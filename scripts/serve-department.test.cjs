'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createDepartmentServer } = require('./serve-department.cjs');

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purpur-board-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.mkdirSync(path.join(root, '.agents/roles'), { recursive: true });
    fs.writeFileSync(path.join(root, '.agents/roles/coder.md'), 'role');
    fs.mkdirSync(path.join(root, 'tasks/sample'), { recursive: true });
    const file = path.join(root, 'tasks/sample/README.md');
    fs.writeFileSync(file, '# Пример\n- ID: `sample`.\n- Тип: `feature`.\n- Статус: `in-progress`.\n- Приоритет: `P1`.\n- Этап: `current`.\n- Ответственная роль: `coder`.\n- Назначение: Разработчик проверяет доску.\n- Зависимости: нет.\n## 1. Цель и полномочия\nТекст\n## 2. Критерии приёмки\n## 3. План\n## 4. Результаты и следующий шаг\n');
    return { root, file, server: createDepartmentServer(root) };
}

function request(server, url, method = 'GET') {
    const result = { headers: {} };
    server.emit('request', { url, method }, {
        setHeader(key, value) { result.headers[key] = value; },
        writeHead(status, headers) { result.status = status; Object.assign(result.headers, headers); },
        end(body) { result.body = body?.toString(); },
    });
    return result;
}

test('Доска перечитывает канонические записи, назначения и роли без второго реестра', (t) => {
    const { server, file } = fixture(t);
    const first = JSON.parse(request(server, '/api/tasks').body);
    assert.deepEqual(first.roles, ['coder']);
    assert.equal(first.tasks[0].status, 'in-progress');
    assert.equal(first.tasks[0].assignment, 'Разработчик проверяет доску.');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('`in-progress`', '`review`'));
    assert.equal(JSON.parse(request(server, '/api/tasks').body).tasks[0].status, 'review');
    assert.match(request(server, '/records/sample').body, /Статус: `review`/);
});

test('Доска не изменяет задачи и не раздаёт произвольные файлы', (t) => {
    const { server, file } = fixture(t);
    const original = fs.readFileSync(file, 'utf8');
    assert.equal(request(server, '/api/tasks', 'POST').status, 405);
    assert.equal(request(server, '/records/sample', 'DELETE').status, 405);
    for (const url of ['/README.md', '/.git/config', '/records/sample/../../package.json', '/records/%2e%2e%2fpackage.json']) {
        assert.equal(request(server, url).status, 404);
    }
    assert.equal(fs.readFileSync(file, 'utf8'), original);
    assert.equal(request(server, '/api/tasks', 'HEAD').body, undefined);
    assert.match(request(server, '/').headers['Content-Security-Policy'], /default-src 'self'/);
});

test('Повреждённый реестр даёт полезный отказ без путей и текста исключения', (t) => {
    const { root, file, server } = fixture(t);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('`in-progress`', '`invalid`'));
    const response = request(server, '/api/tasks');
    assert.equal(response.status, 500);
    assert.match(response.body, /check:tasks/);
    assert.ok(!response.body.includes(root));
    assert.ok(!response.body.includes('invalid'));
});
