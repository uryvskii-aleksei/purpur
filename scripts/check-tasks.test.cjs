'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readTasks } = require('./check-tasks.cjs');

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purpur-tasks-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.mkdirSync(path.join(root, '.agents/roles'), { recursive: true });
    fs.writeFileSync(path.join(root, '.agents/roles/coder.md'), 'role');
    return root;
}
function task(root, id, { status = 'backlog', owner = 'coder', dependencies = [] } = {}) {
    const directory = path.join(root, 'tasks', id);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'README.md'), `# Задача ${id}\n\n- ID: \`${id}\`.\n- Тип: \`feature\`.\n- Статус: \`${status}\`.\n- Приоритет: \`P1\`.\n- Этап: \`current\`.\n- Ответственная роль: \`${owner}\`.\n- Зависимости: ${dependencies.map((dep) => `[${dep}](../${dep}/README.md)`).join(', ') || 'нет'}.\n\n## 1. Цель и полномочия\n\n## 2. Критерии приёмки\n\n## 3. План\n\n## 4. Результаты и следующий шаг\n`);
}

test('Файловые задачи дают актуальный список с проверенными ролями и зависимостями', (t) => {
    const root = fixture(t);
    task(root, 'contract', { status: 'review' });
    task(root, 'checkout', { dependencies: ['contract'] });
    assert.equal(readTasks(root).length, 2);
    assert.deepEqual(readTasks(root).find(({ id }) => id === 'checkout').dependencies, ['contract']);
});
test('Опечатки статуса и неизвестные роли останавливают проверку', (t) => {
    const root = fixture(t);
    task(root, 'checkout', { status: 'working', owner: 'invented' });
    assert.throws(() => readTasks(root), /Неизвестный статус:[\s\S]*Неизвестная роль:/);
});
test('Ссылка на ещё не созданную задачу останавливает проверку', (t) => {
    const root = fixture(t);
    task(root, 'checkout', { dependencies: ['missing'] });
    assert.throws(() => readTasks(root), /Нет зависимости missing/);
});
test('Цикл зависимостей обнаруживается до начала исполнения', (t) => {
    const root = fixture(t);
    task(root, 'first', { dependencies: ['second'] });
    task(root, 'second', { dependencies: ['first'] });
    assert.throws(() => readTasks(root), /Цикл зависимостей:/);
});

test('Текстовая зависимость не теряется молча при обходе графа', (t) => {
    const root = fixture(t);
    task(root, 'checkout');
    const file = path.join(root, 'tasks/checkout/README.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Зависимости: нет.', 'Зависимости: missing.'));
    assert.throws(() => readTasks(root), /Некорректные ссылки зависимостей:/);
});

test('Этап не даёт смешать текущую работу и будущий магазин', (t) => {
    const root = fixture(t);
    task(root, 'checkout');
    const file = path.join(root, 'tasks/checkout/README.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Этап: `current`', 'Этап: `unknown`'));
    assert.throws(() => readTasks(root), /Неизвестный этап:/);
});
