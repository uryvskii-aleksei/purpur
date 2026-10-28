'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const errors = [];
const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const expect = (condition, message) => { if (!condition) errors.push(message); };

function metadata(file) {
    const match = read(file).match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    if (!match) throw new Error(`Нет frontmatter: ${file}`);
    const fields = {};
    const lines = match[1].split('\n');
    for (let index = 0; index < lines.length; index += 1) {
        const field = lines[index].match(/^([\w-]+):\s*(.*)$/);
        if (!field) continue;
        let value = field[2];
        if (/^[>|]-?$/.test(value)) {
            const parts = [];
            while (index + 1 < lines.length && /^\s/.test(lines[index + 1])) {
                parts.push(lines[++index].trim());
            }
            value = parts.join(' ');
        } else if (value.startsWith('"')) {
            value = JSON.parse(value);
        }
        fields[field[1]] = value;
    }
    return fields;
}

function filesUnder(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? filesUnder(file) : [file];
    });
}

function headingAnchors(file) {
    const counts = new Map();
    return new Set([...read(file).matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map((match) => {
        const slug = match[1].toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, '').replace(/ /g, '-');
        const count = counts.get(slug) || 0;
        counts.set(slug, count + 1);
        return count ? `${slug}-${count}` : slug;
    }));
}

function check() {
    const roleDir = path.join(root, '.agents/roles');
    const skillsDir = path.join(root, '.agents/skills');
    const roles = fs.readdirSync(roleDir).filter((name) => name.endsWith('.md'));
    const skills = fs.readdirSync(skillsDir).filter((name) => fs.statSync(path.join(skillsDir, name)).isDirectory());

    for (const file of roles) {
        const name = path.basename(file, '.md');
        const canonical = metadata(path.join(roleDir, file));
        expect(canonical.name === name && canonical.description, `Роль ${name}: имя или описание`);
        for (const runtime of ['.claude', '.cursor']) {
            const adapter = path.join(root, runtime, 'agents', file);
            if (!fs.existsSync(adapter)) { errors.push(`Нет адаптера ${adapter}`); continue; }
            const meta = metadata(adapter);
            expect(meta.name === name && meta.description === canonical.description, `Несогласованные метаданные: ${adapter}`);
            expect(meta.model === 'inherit', `Модель должна наследоваться: ${adapter}`);
            expect(read(adapter).includes(`@.agents/roles/${file}`), `Неверный указатель: ${adapter}`);
        }
        const codex = path.join(root, '.codex/agents', `${name}.toml`);
        if (!fs.existsSync(codex)) { errors.push(`Нет адаптера ${codex}`); continue; }
        const toml = read(codex);
        for (const [key, value] of Object.entries({ name, description: canonical.description })) {
            const match = toml.match(new RegExp(`^${key} = (".*")$`, 'm'));
            expect(match && JSON.parse(match[1]) === value, `Несогласованное поле ${key}: ${codex}`);
        }
        expect(!/^model\s*=/m.test(toml), `Не фиксируйте модель роли: ${codex}`);
        expect(toml.includes(`.agents/roles/${file}`), `Неверный указатель: ${codex}`);
    }

    for (const name of skills) {
        const canonical = metadata(path.join(skillsDir, name, 'SKILL.md'));
        expect(canonical.name === name && canonical.description, `Навык ${name}: имя или описание`);
        const pointer = path.join(root, '.claude/skills', name, 'SKILL.md');
        if (!fs.existsSync(pointer)) { errors.push(`Нет указателя ${pointer}`); continue; }
        const meta = metadata(pointer);
        expect(meta.name === name && meta.description === canonical.description, `Несогласованный навык ${name}`);
        expect(read(pointer).includes(`@.agents/skills/${name}/SKILL.md`), `Неверный указатель навыка ${name}`);
    }
    for (const runtime of ['.codex', '.claude', '.cursor']) {
        for (const file of fs.readdirSync(path.join(root, runtime, 'agents'))) {
            expect(roles.includes(`${path.parse(file).name}.md`), `Адаптер без канонической роли: ${runtime}/${file}`);
        }
    }
    for (const name of fs.readdirSync(path.join(root, '.claude/skills'))) {
        expect(skills.includes(name), `Указатель без канонического навыка: ${name}`);
    }

    // Личные установки навыков Cursor не входят в каноническую обвязку проекта.
    const files = ['AGENTS.md', 'README.md', 'CHANGELOG.md', 'CLAUDE.md'].map((name) => path.join(root, name));
    for (const directory of ['.agents', '.codex', '.claude', '.cursor/agents', 'docs', 'tasks']) {
        files.push(...filesUnder(path.join(root, directory)));
    }
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        for (const match of read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
            const target = match[1];
            if (/^[a-z]+:/i.test(target) || target.startsWith('<')) continue;
            const [relative, anchor] = target.split('#');
            const resolved = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : file;
            expect(fs.existsSync(resolved), `Отсутствующая ссылка: ${file} → ${target}`);
            if (anchor && fs.existsSync(resolved) && resolved.endsWith('.md')) {
                expect(headingAnchors(resolved).has(decodeURIComponent(anchor)), `Отсутствующий заголовок: ${file} → ${target}`);
            }
        }
    }
    for (const runtime of ['.codex', '.claude', '.cursor']) {
        for (const file of filesUnder(path.join(root, runtime)).filter((name) => name.endsWith('.json'))) JSON.parse(read(file));
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`Обвязка: ${roles.length} ролей, ${skills.length} навыков. Адаптеры, наследование модели и ссылки согласованы.`);
}

try { check(); }
catch (error) { console.error(error.message); process.exitCode = 1; }
