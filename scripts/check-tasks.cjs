'use strict';

const fs = require('node:fs');
const path = require('node:path');

const statuses = new Set(['backlog', 'ready', 'in-progress', 'review', 'blocked', 'done']);
const phases = new Set(['current', 'future-store']);
const types = new Set(['feature', 'bug', 'research', 'tech-debt', 'ops', 'content']);

function readTasks(root) {
    const directory = path.join(root, 'tasks');
    const errors = [];
    const tasks = fs.readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory()).map((entry) => {
            const file = path.join(directory, entry.name, 'README.md');
            if (!fs.existsSync(file)) {
                errors.push(`Нет записи задачи: ${entry.name}`);
                return { id: entry.name, dependencies: [] };
            }
            const text = fs.readFileSync(file, 'utf8');
            const field = (name) => text.match(new RegExp(`^- ${name}: \x60([^\x60]+)\x60`, 'm'))?.[1];
            const task = {
                id: field('ID'), type: field('Тип'), status: field('Статус'),
                priority: field('Приоритет'), phase: field('Этап'), owner: field('Ответственная роль'),
                title: text.match(/^# (.+)$/m)?.[1], dependencies: [],
            };
            if (task.id !== entry.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(task.id || '')) {
                errors.push(`Некорректный ID или каталог: ${entry.name}`);
            }
            if (!types.has(task.type)) errors.push(`Неизвестный тип: ${entry.name}`);
            if (!phases.has(task.phase)) errors.push(`Неизвестный этап: ${entry.name}`);
            if (!statuses.has(task.status)) errors.push(`Неизвестный статус: ${entry.name}`);
            if (!/^P[012]$/.test(task.priority || '')) errors.push(`Неизвестный приоритет: ${entry.name}`);
            if (!/^[a-z0-9-]+$/.test(task.owner || '') ||
                !fs.existsSync(path.join(root, '.agents/roles', `${task.owner}.md`))) {
                errors.push(`Неизвестная роль: ${entry.name}`);
            }
            const dependencies = text.match(/^- Зависимости: (.*)$/m)?.[1];
            if (dependencies === undefined) errors.push(`Не указаны зависимости: ${entry.name}`);
            task.dependencies = [...(dependencies || '').matchAll(/\]\(\.\.\/([a-z0-9-]+)\/README\.md\)/g)].map((match) => match[1]);
            const remainder = (dependencies || '').replace(/\[[^\]]+\]\(\.\.\/[a-z0-9-]+\/README\.md\)/g, '').replace(/[\s,.]/g, '');
            if (dependencies !== undefined && !/^нет\.?$/.test(dependencies.trim()) &&
                (task.dependencies.length === 0 || remainder)) {
                errors.push(`Некорректные ссылки зависимостей: ${entry.name}`);
            }
            for (const section of ['Цель и полномочия', 'Критерии приёмки', 'План', 'Результаты и следующий шаг']) {
                if (!new RegExp(`^## \\d+\\. ${section}$`, 'm').test(text)) errors.push(`Нет раздела «${section}»: ${entry.name}`);
            }
            return { ...task, directoryId: entry.name };
        });
    const byId = new Map(tasks.map((task) => [task.directoryId || task.id, task]));
    const active = new Set();
    const visited = new Set();
    function visit(id) {
        if (active.has(id)) { errors.push(`Цикл зависимостей: ${id}`); return; }
        if (visited.has(id)) return;
        active.add(id);
        for (const dependency of byId.get(id).dependencies) {
            if (!byId.has(dependency)) errors.push(`Нет зависимости ${dependency} у ${id}`);
            else visit(dependency);
        }
        active.delete(id);
        visited.add(id);
    }
    for (const id of byId.keys()) visit(id);
    if (errors.length) throw new Error(errors.join('\n'));
    return tasks;
}

if (require.main === module) {
    try {
        const tasks = readTasks(path.resolve(__dirname, '..'));
        if (process.argv.includes('--list')) {
            console.table(tasks.map(({ id, status, priority, phase, owner }) => ({ id, status, priority, phase, owner })));
        } else console.log(`Задачи: ${tasks.length}. Формат, роли и зависимости согласованы.`);
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { readTasks };
