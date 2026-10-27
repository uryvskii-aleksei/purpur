#!/usr/bin/env node
'use strict';

/**
 * Хук format-touched: prettier по затронутым файлам (afterFileEdit).
 * Fail-open: любая ошибка → exit 0 (без failClosed в hooks.json).
 * Причины пропуска и ошибки выводятся в stderr с префиксом `format-touched:`.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// Markdown не форматируем автоматически: структуру инструкций проверяем отдельно.
const FORMAT_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.scss', '.css', '.json', '.yml', '.yaml']);

const GENERATED_PREFIXES = ['.cursor/', '.claude/', '.codex/'];

/** Личные настройки подключения не форматируем вместе с исходным кодом. */
const GENERATED_BASENAMES = new Set(['.mcp.json']);

/** Каталоги, в которых лежат workspace монорепозитория (см. `workspaces` в корневом package.json). */
const WORKSPACE_PARENTS = ['packages', 'apps'];

const NO_PLUGIN_SEARCH_FLAG = '--no-plugin-search';

function readStdin() {
    try {
        const raw = fs.readFileSync(0, 'utf8').trim();

        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}

/**
 * Пути адаптеров сред и личных настроек, которые не форматируются вместе с исходным кодом.
 * @param {string} filePath Путь относительно корня репозитория.
 */
function isGeneratedAdapterPath(filePath) {
    const normalized = normalizePath(filePath);
    const base = normalized.split('/').pop() ?? '';

    if (GENERATED_BASENAMES.has(base)) {
        return true;
    }

    return GENERATED_PREFIXES.some((prefix) => normalized.startsWith(prefix) || normalized.includes(`/${prefix.slice(0, -1)}/`));
}

/**
 * Извлекает пути файлов из текста патча Codex (`*** Update File:`) или unified diff.
 * @param {unknown} patchText Текст патча.
 * @returns {string[]} Уникальные пути в порядке появления.
 */
function collectPathsFromPatchText(patchText) {
    if (typeof patchText !== 'string' || !patchText.trim()) {
        return [];
    }

    const paths = [];
    const seen = new Set();
    const patterns = [/^\*\*\* (?:Update|Add|Delete) File:\s*(.+)$/gm, /^\+\+\+ [ab]\/(.*)$/gm, /^--- [ab]\/(.*)$/gm];

    for (const pattern of patterns) {
        for (const match of patchText.matchAll(pattern)) {
            const candidate = match[1]?.trim();

            if (candidate && !seen.has(candidate)) {
                seen.add(candidate);
                paths.push(candidate);
            }
        }
    }

    return paths;
}

/**
 * Собирает пути из payload хука любой из сред: Cursor (`file_path`), Claude (`tool_input.file_path`),
 * Codex (`apply_patch` с текстом патча).
 * @param {Record<string, unknown>} payload JSON из stdin.
 * @returns {string[]} Пути в порядке появления (без дедупликации).
 */
function collectPaths(payload) {
    const paths = [];
    const push = (value) => {
        if (typeof value === 'string' && value.trim()) {
            paths.push(value.trim());
        }
    };

    push(payload.file_path);
    push(payload.path);
    push(payload.filePath);
    push(payload.file);

    const input = payload.tool_input ?? payload.input ?? payload.arguments ?? payload.params ?? {};

    push(input.file_path);
    push(input.path);
    push(input.filePath);
    push(input.file);

    if (Array.isArray(input.paths)) {
        input.paths.forEach(push);
    }

    const outputArgs = payload.output?.args;

    if (outputArgs && typeof outputArgs === 'object' && !Array.isArray(outputArgs)) {
        push(outputArgs.filePath);
        push(outputArgs.file_path);
        push(outputArgs.path);
        push(outputArgs.file);
    }

    const args = payload.args;

    if (args && typeof args === 'object' && !Array.isArray(args)) {
        push(args.file_path);
        push(args.path);
        push(args.filePath);
        push(args.file);

        if (Array.isArray(args.paths)) {
            args.paths.forEach(push);
        }
    } else if (typeof args === 'string') {
        push(args);
    }

    const patchSources = [
        payload.patch,
        typeof payload.input === 'string' ? payload.input : null,
        input.patch,
        input.diff,
        typeof input.input === 'string' ? input.input : null,
        typeof input.changes === 'string' ? input.changes : null,
    ];

    const argumentsInput = payload.arguments?.input;

    if (typeof argumentsInput === 'string') {
        patchSources.push(argumentsInput);
    }

    for (const patchText of patchSources) {
        collectPathsFromPatchText(patchText).forEach(push);
    }

    return paths;
}

/**
 * Возвращает реальный путь файла, если он существует и лежит внутри репозитория (с учётом symlink).
 * @param {string | null} repoRoot Корень репозитория.
 * @param {string} filePath Абсолютный путь или путь относительно корня.
 * @returns {string | null}
 */
function resolveWithinRepo(repoRoot, filePath) {
    if (!repoRoot) {
        return null;
    }

    const abs = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
    let real;

    try {
        real = fs.realpathSync(abs);
    } catch {
        return null;
    }

    let rootReal;

    try {
        rootReal = fs.realpathSync(repoRoot);
    } catch {
        return null;
    }

    const rel = path.relative(rootReal, real);

    if (rel.startsWith('..') || path.isAbsolute(rel)) {
        return null;
    }

    return real;
}

/**
 * Нужно ли форматировать файл: внутри репозитория, не адаптер среды, поддерживаемое расширение.
 * @param {string | null} repoRoot Корень репозитория.
 * @param {string} filePath Путь к файлу.
 */
function shouldFormat(repoRoot, filePath) {
    const resolved = resolveWithinRepo(repoRoot, filePath);

    if (!resolved || isGeneratedAdapterPath(path.relative(fs.realpathSync(repoRoot), resolved))) {
        return false;
    }

    const ext = path.extname(filePath).toLowerCase();

    return FORMAT_EXT.has(ext);
}

/**
 * Оставляет только существующие форматируемые файлы без дублей.
 * @param {string | null} repoRoot Корень репозитория.
 * @param {string[]} files Пути из payload.
 * @returns {string[]} Реальные абсолютные пути.
 */
function uniqueExisting(repoRoot, files) {
    const seen = new Set();

    return files
        .map((file) => {
            const resolved = resolveWithinRepo(repoRoot, file);

            if (!resolved || !shouldFormat(repoRoot, file)) {
                return null;
            }

            const key = normalizePath(resolved);

            if (seen.has(key)) {
                return null;
            }

            seen.add(key);

            return resolved;
        })
        .filter(Boolean);
}

function resolvePrettierCliFromPackageDir(prettierPkgDir) {
    const pkgJsonPath = path.join(prettierPkgDir, 'package.json');

    if (!fs.existsSync(pkgJsonPath)) {
        return null;
    }

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const binField = pkg.bin;

        if (typeof binField === 'string') {
            const resolved = path.join(prettierPkgDir, binField);

            if (fs.existsSync(resolved)) {
                return resolved;
            }
        } else if (binField && typeof binField === 'object') {
            for (const rel of Object.values(binField)) {
                if (typeof rel !== 'string') {
                    continue;
                }

                const resolved = path.join(prettierPkgDir, rel);

                if (fs.existsSync(resolved)) {
                    return resolved;
                }
            }
        }
    } catch {
        // fail-open
    }

    for (const rel of ['bin-prettier.js', 'bin/prettier.cjs']) {
        const candidate = path.join(prettierPkgDir, rel);

        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}

/**
 * Ищет корень репозитория вверх от каталога: по `.agents/hooks` или по `workspaces` в package.json.
 * @param {string} startDir Стартовый каталог.
 * @returns {string | null}
 */
function findRepoRoot(startDir) {
    let dir = path.resolve(startDir);

    for (;;) {
        if (fs.existsSync(path.join(dir, '.agents', 'hooks'))) {
            return dir;
        }

        const pkgJsonPath = path.join(dir, 'package.json');

        if (fs.existsSync(path.join(dir, 'yarn.lock')) || fs.existsSync(pkgJsonPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

                if (pkg.workspaces) {
                    return dir;
                }
            } catch {
                // ignore
            }
        }

        const parent = path.dirname(dir);

        if (parent === dir) {
            break;
        }

        dir = parent;
    }

    return null;
}

/**
 * Каталоги `node_modules/prettier` реальных workspace (с собственным package.json).
 * Неотслеживаемые остатки вида `packages/<name>/node_modules` без package.json не считаются.
 * @param {string} repoRoot Корень репозитория.
 * @returns {string[]}
 */
function listWorkspacePrettierPackageDirs(repoRoot) {
    const dirs = [];
    const parents = new Set(WORKSPACE_PARENTS);
    const skipped = new Set(['node_modules', 'dist', 'build', 'coverage', 'public']);

    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
        const patterns = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages;
        for (const pattern of patterns ?? []) {
            if (typeof pattern !== 'string' || pattern.startsWith('!')) continue;
            const first = normalizePath(pattern).replace(/^\.\//, '').split('/')[0];
            if (first && !/[?*{}[\]]/.test(first) && first !== '..' && first !== '.') parents.add(first);
        }
    } catch {
        // Корневой manifest необязателен. Стандартные каталоги остаются доступны.
    }

    const visit = (directory) => {
        if (fs.existsSync(path.join(directory, 'package.json'))) {
            const prettierDir = path.join(directory, 'node_modules', 'prettier');
            if (fs.existsSync(path.join(prettierDir, 'package.json'))) dirs.push(prettierDir);
        }
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            // Символические ссылки не обходим: поиск остаётся в выбранном checkout.
            if (entry.isDirectory() && !entry.name.startsWith('.') && !skipped.has(entry.name)) {
                visit(path.join(directory, entry.name));
            }
        }
    };

    for (const relative of parents) {
        const parent = path.join(repoRoot, relative);
        if (fs.existsSync(parent) && fs.lstatSync(parent).isDirectory()) visit(parent);
    }
    return [...new Set(dirs)];
}

/**
 * Лежит ли путь внутри каталога или совпадает с ним.
 * @param {string} dir Каталог.
 * @param {string} filePath Проверяемый путь.
 */
function isInsideOrEqual(dir, filePath) {
    const rel = path.relative(dir, filePath);

    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/**
 * Собирает кандидатов prettier внутри корня репозитория: вверх от cwd, но не выше корня, и из workspace.
 * @param {string | null} repoRoot Корень репозитория.
 * @returns {Array<{ cli: string, prettierPkgDir: string }>}
 */
function collectPrettierCandidates(repoRoot) {
    const byCli = new Map();
    const addDir = (prettierPkgDir) => {
        const cli = resolvePrettierCliFromPackageDir(prettierPkgDir);

        if (cli && !byCli.has(cli)) {
            byCli.set(cli, prettierPkgDir);
        }
    };

    const root = repoRoot ? path.resolve(repoRoot) : null;
    let dir = path.resolve(process.cwd());

    if (!root || isInsideOrEqual(root, dir)) {
        for (;;) {
            if (root && !isInsideOrEqual(root, dir)) {
                break;
            }

            addDir(path.join(dir, 'node_modules', 'prettier'));

            if (root && path.resolve(dir) === root) {
                break;
            }

            const parent = path.dirname(dir);

            if (parent === dir) {
                break;
            }

            dir = parent;
        }
    }

    if (repoRoot) {
        for (const prettierDir of listWorkspacePrettierPackageDirs(repoRoot)) {
            addDir(prettierDir);
        }
    }

    return [...byCli.entries()].map(([cli, prettierPkgDir]) => ({ cli, prettierPkgDir }));
}

/**
 * Корень пакета, которому принадлежит установленный prettier (`<pkgRoot>/node_modules/prettier`).
 * @param {string} prettierPkgDir Каталог пакета prettier.
 */
function getPrettierPkgRoot(prettierPkgDir) {
    return path.dirname(path.dirname(prettierPkgDir));
}

/**
 * Лежит ли файл внутри каталога (не равен ему).
 * @param {string} dir Каталог.
 * @param {string} filePath Абсолютный путь к файлу.
 */
function isInsideDir(dir, filePath) {
    const rel = path.relative(dir, filePath);

    return Boolean(rel) && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Выбирает prettier для файла: сначала workspace, содержащий файл, иначе ближайший по пути.
 * @param {Array<{ cli: string, prettierPkgDir: string }>} candidates Кандидаты.
 * @param {string | undefined} hintFilePath Файл, для которого выбирается prettier.
 * @returns {{ cli: string, prettierPkgDir: string, pkgRoot: string } | null}
 */
function pickPrettierCli(candidates, hintFilePath) {
    if (!candidates.length) {
        return null;
    }

    const withRoot = (candidate) => ({ ...candidate, pkgRoot: getPrettierPkgRoot(candidate.prettierPkgDir) });

    if (!hintFilePath) {
        return withRoot(candidates[0]);
    }

    const absHint = path.isAbsolute(hintFilePath) ? hintFilePath : path.join(process.cwd(), hintFilePath);
    let best = candidates[0];
    let bestScore = Infinity;
    let deepest = null;
    let deepestLength = -1;

    for (const candidate of candidates) {
        const pkgRoot = getPrettierPkgRoot(candidate.prettierPkgDir);

        if (isInsideDir(pkgRoot, absHint) && pkgRoot.length > deepestLength) {
            deepest = candidate;
            deepestLength = pkgRoot.length;
        }

        const score = path.relative(candidate.prettierPkgDir, absHint).split(path.sep).filter(Boolean).length;

        if (score < bestScore) {
            bestScore = score;
            best = candidate;
        }
    }

    return withRoot(deepest ?? best);
}

/**
 * Группирует файлы по запускам prettier. Для файлов вне workspace выбранного prettier
 * отключается автопоиск плагинов: иначе prettier-plugin-import-sort подхватывается без
 * `importSort`-конфигурации и падает с `TypeError: style is not a function`.
 * @param {Array<{ cli: string, prettierPkgDir: string }>} candidates Кандидаты prettier.
 * @param {string[]} files Абсолютные пути файлов.
 * @returns {Array<{ cli: string, args: string[], files: string[] }>}
 */
function planPrettierRuns(candidates, files) {
    const runs = new Map();

    for (const file of files) {
        const pick = pickPrettierCli(candidates, file);

        if (!pick) {
            return [];
        }

        const args = isInsideDir(pick.pkgRoot, file) ? [] : [NO_PLUGIN_SEARCH_FLAG];
        const key = `${pick.cli}\n${args.join(' ')}`;
        const run = runs.get(key) ?? { cli: pick.cli, args, files: [] };

        run.files.push(file);
        runs.set(key, run);
    }

    return [...runs.values()];
}

/**
 * Запускает prettier `--write` по файлам.
 * @param {string | null} repoRoot Корень репозитория.
 * @param {string[]} files Абсолютные пути файлов.
 * @returns {string | null} Текст ошибки или null при успехе.
 */
function runPrettier(repoRoot, files) {
    const runs = planPrettierRuns(collectPrettierCandidates(repoRoot), files);

    if (!runs.length) {
        return 'prettier не найден в node_modules (установите зависимости репозитория)';
    }

    const errors = [];

    for (const run of runs) {
        const result = spawnSync(process.execPath, [run.cli, ...run.args, '--write', ...run.files], {
            cwd: process.cwd(),
            encoding: 'utf8',
            shell: false,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        if (result.error) {
            errors.push(result.error.message);
        } else if (result.status !== 0) {
            errors.push((result.stderr || result.stdout || `prettier exit ${result.status}`).trim());
        }
    }

    return errors.length ? errors.join('\n') : null;
}

function warn(message) {
    process.stderr.write(`format-touched: ${message}\n`);
}

function main() {
    const payload = readStdin();
    const repoRoot = findRepoRoot(process.cwd()) ?? findRepoRoot(__dirname);

    if (!repoRoot) {
        warn('корень репозитория не найден, форматирование пропущено');
        process.stdout.write('{}\n');

        return;
    }

    const requested = collectPaths(payload);
    const files = uniqueExisting(repoRoot, requested);

    if (!files.length) {
        // Без путей на входе хук вызывается штатно (например, для других инструментов) — не шумим.
        if (requested.length) {
            warn(`нет файлов для форматирования после фильтра (путей на входе: ${requested.length})`);
        }

        process.stdout.write('{}\n');

        return;
    }

    const error = runPrettier(repoRoot, files);

    if (error) {
        warn(error);
    }

    process.stdout.write('{}\n');
}

module.exports = {
    FORMAT_EXT,
    NO_PLUGIN_SEARCH_FLAG,
    collectPaths,
    collectPathsFromPatchText,
    collectPrettierCandidates,
    findRepoRoot,
    getPrettierPkgRoot,
    isGeneratedAdapterPath,
    isInsideDir,
    listWorkspacePrettierPackageDirs,
    pickPrettierCli,
    planPrettierRuns,
    resolvePrettierCliFromPackageDir,
    resolveWithinRepo,
    runPrettier,
    shouldFormat,
    uniqueExisting,
};

if (require.main === module) {
    try {
        main();
    } catch (error) {
        warn(error instanceof Error ? error.message : String(error));
        process.stdout.write('{}\n');
    }
}
