'use strict';

/**
 * Тесты хука format-touched на встроенном node:test.
 * Запуск из корня репозитория: `node --test .agents/hooks/scripts/format-touched.spec.js`.
 */

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, describe, it } = require('node:test');

const hook = require('./format-touched.js');

const CODEX_PATCH = [
    '*** Begin Patch',
    '*** Update File: packages/utils/src/index.ts',
    '@@',
    '-const a = 1;',
    '+const a = 2;',
    '*** Add File: packages/utils/src/new.ts',
    '+export const b = 1;',
    '*** End Patch',
].join('\n');

/** Создаёт файл вместе с промежуточными каталогами. */
function writeFile(filePath, content = '') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

describe('collectPaths', () => {
    it('берёт file_path с верхнего уровня payload (Cursor afterFileEdit)', () => {
        assert.deepEqual(hook.collectPaths({ file_path: 'packages/utils/src/index.ts' }), ['packages/utils/src/index.ts']);
    });

    it('берёт tool_input.file_path (Claude PostToolUse Edit|Write)', () => {
        const payload = {
            tool_name: 'Edit',
            tool_input: { file_path: '/repo/packages/utils/src/index.ts', old_string: 'a', new_string: 'b' },
        };

        assert.deepEqual(hook.collectPaths(payload), ['/repo/packages/utils/src/index.ts']);
    });

    it('извлекает пути из текста патча apply_patch (Codex PostToolUse)', () => {
        const payload = { tool_name: 'apply_patch', tool_input: { input: CODEX_PATCH } };

        assert.deepEqual(hook.collectPaths(payload), ['packages/utils/src/index.ts', 'packages/utils/src/new.ts']);
    });

    it('игнорирует пустые строки и нестроковые значения', () => {
        assert.deepEqual(hook.collectPaths({ file_path: '   ', tool_input: { file_path: 42 } }), []);
    });
});

describe('collectPathsFromPatchText', () => {
    it('читает Update/Add/Delete File и заголовки unified diff без дублей', () => {
        const patch = ['*** Update File: a.ts', '*** Add File: b.ts', '*** Delete File: c.ts', '--- a/a.ts', '+++ b/a.ts'].join(
            '\n',
        );

        assert.deepEqual(hook.collectPathsFromPatchText(patch), ['a.ts', 'b.ts', 'c.ts']);
    });

    it('возвращает пустой список для не строки', () => {
        assert.deepEqual(hook.collectPathsFromPatchText(undefined), []);
        assert.deepEqual(hook.collectPathsFromPatchText('   '), []);
    });
});

describe('isGeneratedAdapterPath', () => {
    it('считает адаптерами .cursor/, .claude/, .codex/ и .mcp.json', () => {
        assert.equal(hook.isGeneratedAdapterPath('.cursor/hooks.json'), true);
        assert.equal(hook.isGeneratedAdapterPath('.claude/settings.json'), true);
        assert.equal(hook.isGeneratedAdapterPath('.codex/hooks.json'), true);
        assert.equal(hook.isGeneratedAdapterPath('apps/shop/.codex/agents/coder.md'), true);
        assert.equal(hook.isGeneratedAdapterPath('.mcp.json'), true);
        assert.equal(hook.isGeneratedAdapterPath('apps/shop/.mcp.json'), true);
    });

    it('не считает адаптерами исходники и файлы обвязки', () => {
        assert.equal(hook.isGeneratedAdapterPath('.agents/hooks/scripts/format-touched.js'), false);
        assert.equal(hook.isGeneratedAdapterPath('packages/utils/src/index.ts'), false);
        assert.equal(hook.isGeneratedAdapterPath('packages/utils/src/cursor/index.ts'), false);
    });
});

describe('shouldFormat и uniqueExisting (файловая система)', () => {
    let tmpRoot;
    let repoRoot;
    let outsideDir;
    let symlinkReady = true;

    before(() => {
        tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'format-touched-'));
        repoRoot = path.join(tmpRoot, 'repo');
        outsideDir = path.join(tmpRoot, 'outside');

        // Маркер корня репозитория для findRepoRoot.
        fs.mkdirSync(path.join(repoRoot, '.agents', 'hooks'), { recursive: true });

        writeFile(path.join(repoRoot, 'packages', 'utils', 'src', 'index.ts'), 'export const a = 1;\n');
        writeFile(path.join(repoRoot, 'packages', 'utils', 'src', 'styles.scss'), '.a { color: red; }\n');
        writeFile(path.join(repoRoot, 'tsconfig.json'), '{}\n');
        writeFile(path.join(repoRoot, 'README.md'), '# Readme\n');
        writeFile(path.join(repoRoot, '.cursor', 'hooks.json'), '{}\n');
        writeFile(path.join(repoRoot, '.claude', 'settings.json'), '{}\n');
        writeFile(path.join(repoRoot, '.codex', 'hooks.json'), '{}\n');
        writeFile(path.join(repoRoot, '.mcp.json'), '{}\n');

        writeFile(path.join(outsideDir, 'secret.ts'), 'export const s = 1;\n');

        try {
            fs.symlinkSync(path.join(outsideDir, 'secret.ts'), path.join(repoRoot, 'linked.ts'));
        } catch {
            symlinkReady = false;
        }
    });

    after(() => {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
    });

    it('находит корень репозитория по .agents/hooks', () => {
        assert.equal(hook.findRepoRoot(path.join(repoRoot, 'packages', 'utils', 'src')), repoRoot);
        assert.equal(hook.findRepoRoot(outsideDir), null);
    });

    it('форматирует .ts, .scss и .json внутри репозитория', () => {
        assert.equal(hook.shouldFormat(repoRoot, 'packages/utils/src/index.ts'), true);
        assert.equal(hook.shouldFormat(repoRoot, 'packages/utils/src/styles.scss'), true);
        assert.equal(hook.shouldFormat(repoRoot, path.join(repoRoot, 'tsconfig.json')), true);
    });

    it('не форматирует .md', () => {
        assert.equal(hook.shouldFormat(repoRoot, 'README.md'), false);
    });

    it('не форматирует адаптеры сред и .mcp.json', () => {
        assert.equal(hook.shouldFormat(repoRoot, '.cursor/hooks.json'), false);
        assert.equal(hook.shouldFormat(repoRoot, '.claude/settings.json'), false);
        assert.equal(hook.shouldFormat(repoRoot, '.codex/hooks.json'), false);
        assert.equal(hook.shouldFormat(repoRoot, '.mcp.json'), false);
    });

    it('не форматирует symlink, ведущий наружу репозитория', (t) => {
        if (!symlinkReady) {
            t.skip('symlink недоступен');

            return;
        }

        assert.equal(hook.resolveWithinRepo(repoRoot, 'linked.ts'), null);
        assert.equal(hook.shouldFormat(repoRoot, 'linked.ts'), false);
    });

    it('не форматирует несуществующие файлы и пути без корня', () => {
        assert.equal(hook.shouldFormat(repoRoot, 'packages/utils/src/missing.ts'), false);
        assert.equal(hook.resolveWithinRepo(null, 'tsconfig.json'), null);
    });

    it('uniqueExisting оставляет только форматируемые файлы без дублей', () => {
        const result = hook.uniqueExisting(repoRoot, [
            'packages/utils/src/index.ts',
            path.join(repoRoot, 'packages', 'utils', 'src', 'index.ts'),
            'README.md',
            'linked.ts',
            '.cursor/hooks.json',
            'tsconfig.json',
        ]);

        assert.deepEqual(result, [
            fs.realpathSync(path.join(repoRoot, 'packages', 'utils', 'src', 'index.ts')),
            fs.realpathSync(path.join(repoRoot, 'tsconfig.json')),
        ]);
    });
});

describe('listWorkspacePrettierPackageDirs (файловая система)', () => {
    let repoRoot;

    before(() => {
        repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'format-touched-ws-'));

        // Реальный workspace: есть package.json и prettier.
        writeFile(path.join(repoRoot, 'packages', 'utils', 'package.json'), '{"name":"@purpur/utils"}');
        writeFile(
            path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier', 'package.json'),
            '{"name":"prettier","bin":"./bin-prettier.js"}',
        );
        writeFile(path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier', 'bin-prettier.js'), '');

        // Остаток удалённого workspace: только node_modules без package.json.
        writeFile(
            path.join(repoRoot, 'packages', 'cursor-rules', 'node_modules', 'prettier', 'package.json'),
            '{"name":"prettier","bin":"./bin-prettier.js"}',
        );
        writeFile(path.join(repoRoot, 'packages', 'cursor-rules', 'node_modules', 'prettier', 'bin-prettier.js'), '');

        // Workspace без prettier.
        writeFile(path.join(repoRoot, 'apps', 'shop', 'package.json'), '{"name":"@purpur/shop"}');
    });

    after(() => {
        fs.rmSync(repoRoot, { recursive: true, force: true });
    });

    it('учитывает только каталоги с собственным package.json', () => {
        assert.deepEqual(hook.listWorkspacePrettierPackageDirs(repoRoot), [
            path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier'),
        ]);
    });

    it('находит bin по полю bin из package.json prettier', () => {
        const prettierDir = path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier');

        assert.equal(hook.resolvePrettierCliFromPackageDir(prettierDir), path.join(prettierDir, 'bin-prettier.js'));
        assert.equal(hook.resolvePrettierCliFromPackageDir(path.join(repoRoot, 'nope')), null);
    });
});

describe('pickPrettierCli и planPrettierRuns', () => {
    const repoRoot = path.resolve(path.sep, 'repo');
    const utilsPrettier = path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier');
    const shopPrettier = path.join(repoRoot, 'apps', 'shop', 'node_modules', 'prettier');
    const candidates = [
        { cli: path.join(utilsPrettier, 'bin-prettier.js'), prettierPkgDir: utilsPrettier },
        { cli: path.join(shopPrettier, 'bin-prettier.js'), prettierPkgDir: shopPrettier },
    ];

    it('возвращает null без кандидатов', () => {
        assert.equal(hook.pickPrettierCli([], path.join(repoRoot, 'tsconfig.json')), null);
        assert.deepEqual(hook.planPrettierRuns([], [path.join(repoRoot, 'tsconfig.json')]), []);
    });

    it('выбирает prettier того workspace, где лежит файл', () => {
        const pick = hook.pickPrettierCli(candidates, path.join(repoRoot, 'apps', 'shop', 'src', 'index.tsx'));

        assert.equal(pick.cli, candidates[1].cli);
        assert.equal(pick.pkgRoot, path.join(repoRoot, 'apps', 'shop'));
    });

    it('среди вложенных workspace выбирает самый глубокий', () => {
        const parentPrettier = path.join(repoRoot, 'apps', 'portal', 'node_modules', 'prettier');
        const nestedPrettier = path.join(repoRoot, 'apps', 'portal', 'ui-tests', 'node_modules', 'prettier');
        const nested = [
            { cli: path.join(parentPrettier, 'bin-prettier.js'), prettierPkgDir: parentPrettier },
            { cli: path.join(nestedPrettier, 'bin-prettier.js'), prettierPkgDir: nestedPrettier },
        ];
        const file = path.join(repoRoot, 'apps', 'portal', 'ui-tests', 'src', 'index.ts');
        const pick = hook.pickPrettierCli(nested, file);

        assert.equal(pick.cli, nested[1].cli);
    });

    it('без флага --no-plugin-search внутри workspace', () => {
        const file = path.join(repoRoot, 'packages', 'utils', 'src', 'index.ts');

        assert.deepEqual(hook.planPrettierRuns(candidates, [file]), [{ cli: candidates[0].cli, args: [], files: [file] }]);
    });

    it('добавляет --no-plugin-search для файла вне workspace выбранного prettier', () => {
        for (const file of [
            path.join(repoRoot, 'tsconfig.json'),
            path.join(repoRoot, '.agents', 'hooks', 'scripts', 'format-touched.js'),
            path.join(repoRoot, 'pipelines', 'storybook', 'template.yml'),
        ]) {
            const runs = hook.planPrettierRuns(candidates, [file]);

            assert.equal(runs.length, 1);
            assert.deepEqual(runs[0].args, [hook.NO_PLUGIN_SEARCH_FLAG]);
            assert.deepEqual(runs[0].files, [file]);
        }
    });

    it('группирует файлы по prettier и набору флагов', () => {
        const inside = path.join(repoRoot, 'packages', 'utils', 'src', 'index.ts');
        const shop = path.join(repoRoot, 'apps', 'shop', 'src', 'index.tsx');
        const outside = path.join(repoRoot, 'tsconfig.json');
        const runs = hook.planPrettierRuns(candidates, [inside, outside, shop]);

        assert.equal(runs.length, 3);
        assert.deepEqual(
            runs.map((run) => [run.cli, run.args, run.files]),
            [
                [candidates[0].cli, [], [inside]],
                [hook.pickPrettierCli(candidates, outside).cli, [hook.NO_PLUGIN_SEARCH_FLAG], [outside]],
                [candidates[1].cli, [], [shop]],
            ],
        );
    });
});

describe('collectPrettierCandidates и запуск', () => {
    let parentDir;
    let repoRoot;
    let previousCwd;

    before(() => {
        parentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'format-touched-parent-'));
        repoRoot = path.join(parentDir, 'repo');
        writeFile(
            path.join(parentDir, 'node_modules', 'prettier', 'package.json'),
            '{"name":"prettier","bin":"./bin-prettier.js"}',
        );
        writeFile(path.join(parentDir, 'node_modules', 'prettier', 'bin-prettier.js'), '');
        writeFile(path.join(repoRoot, 'packages', 'utils', 'package.json'), '{"name":"@purpur/utils"}');
        writeFile(
            path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier', 'package.json'),
            '{"name":"prettier","bin":"./bin-prettier.js"}',
        );
        writeFile(
            path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier', 'bin-prettier.js'),
            "require('node:fs').writeFileSync(require('node:path').join(__dirname, 'argv.json'), JSON.stringify(process.argv));\n",
        );
        writeFile(path.join(repoRoot, 'tsconfig.json'), '{}\n');
        previousCwd = process.cwd();
    });

    after(() => {
        process.chdir(previousCwd);
        fs.rmSync(parentDir, { recursive: true, force: true });
    });

    it('не берёт prettier выше корня репозитория', () => {
        const outsideCli = path.join(parentDir, 'node_modules', 'prettier', 'bin-prettier.js');

        process.chdir(parentDir);
        assert.equal(
            hook.collectPrettierCandidates(repoRoot).some((candidate) => candidate.cli === outsideCli),
            false,
        );

        process.chdir(repoRoot);
        assert.equal(
            hook.collectPrettierCandidates(repoRoot).some((candidate) => candidate.cli === outsideCli),
            false,
        );
    });

    it('runPrettier передаёт --no-plugin-search и --write для файла вне workspace', () => {
        process.chdir(repoRoot);
        const file = path.join(repoRoot, 'tsconfig.json');
        const error = hook.runPrettier(repoRoot, [file]);
        const argvPath = path.join(repoRoot, 'packages', 'utils', 'node_modules', 'prettier', 'argv.json');
        const argv = JSON.parse(fs.readFileSync(argvPath, 'utf8'));

        assert.equal(error, null);
        assert.ok(argv.includes(hook.NO_PLUGIN_SEARCH_FLAG));
        assert.ok(argv.includes('--write'));
        assert.ok(argv.includes(file));
    });

    it('невалидный stdin завершается без ошибки и печатает {}', () => {
        const result = spawnSync(process.execPath, [path.join(__dirname, 'format-touched.js')], {
            input: 'not json',
            encoding: 'utf8',
        });

        assert.equal(result.status, 0);
        assert.equal(result.stdout.trim(), '{}');
    });
});

// Поиск форматтера не зависит от названий приложений исходного проекта.
describe('listWorkspacePrettierPackageDirs: вложенные и настроенные каталоги', () => {
    it('находит вложенный и нестандартный workspace, игнорируя node_modules без manifest', () => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'format-touched-nested-'));
        try {
            writeFile(path.join(root, 'package.json'), JSON.stringify({ workspaces: ['services/*'] }));
            const expected = [
                path.join(root, 'apps', 'portal', 'tools', 'checks', 'node_modules', 'prettier'),
                path.join(root, 'services', 'api', 'node_modules', 'prettier'),
            ];
            for (const directory of expected) {
                writeFile(path.join(path.dirname(path.dirname(directory)), 'package.json'), '{}');
                writeFile(path.join(directory, 'package.json'), '{}');
            }
            writeFile(path.join(root, 'services', 'orphan', 'node_modules', 'prettier', 'package.json'), '{}');
            assert.deepEqual(hook.listWorkspacePrettierPackageDirs(root).sort(), expected.sort());
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
});
