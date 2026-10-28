'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { readTasks } = require('./check-tasks.cjs');

function taskSnapshot(root) {
    const tasks = readTasks(root).map((task) => {
        const record = fs.readFileSync(path.join(root, 'tasks', task.id, 'README.md'), 'utf8');
        return {
            ...task,
            assignment: record.match(/^- Назначение: (.+)$/m)?.[1] || '',
            record,
        };
    });
    const roles = fs.readdirSync(path.join(root, '.agents/roles'))
        .filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3));
    return { readAt: new Date().toISOString(), tasks, roles };
}

function createDepartmentServer(root = path.resolve(__dirname, '..')) {
    const assets = {
        '/': ['index.html', 'text/html; charset=utf-8'],
        '/board.css': ['board.css', 'text/css; charset=utf-8'],
        '/board.js': ['board.js', 'text/javascript; charset=utf-8'],
    };
    return http.createServer((request, response) => {
        const send = (status, type, body) => {
            response.writeHead(status, {
                'Content-Type': type, 'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': "default-src 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
            });
            response.end(request.method === 'HEAD' ? undefined : body);
        };
        if (!['GET', 'HEAD'].includes(request.method)) {
            response.setHeader('Allow', 'GET, HEAD');
            send(405, 'text/plain; charset=utf-8', 'Доска доступна только для чтения.');
            return;
        }
        let pathname;
        try { pathname = new URL(request.url, 'http://127.0.0.1').pathname; }
        catch { send(400, 'text/plain; charset=utf-8', 'Некорректный адрес.'); return; }
        try {
            if (pathname === '/api/tasks') {
                send(200, 'application/json; charset=utf-8', JSON.stringify(taskSnapshot(root)));
            } else if (assets[pathname]) {
                const [file, type] = assets[pathname];
                send(200, type, fs.readFileSync(path.join(__dirname, '../tools/department', file)));
            } else if (/^\/records\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname)) {
                const id = pathname.slice('/records/'.length);
                const task = taskSnapshot(root).tasks.find((entry) => entry.id === id);
                send(task ? 200 : 404, 'text/plain; charset=utf-8', task?.record || 'Задача не найдена.');
            } else {
                send(404, 'text/plain; charset=utf-8', 'Страница не найдена.');
            }
        } catch {
            send(500, 'text/plain; charset=utf-8', 'Не удалось прочитать реестр. Проверьте npm run check:tasks в рабочей папке.');
        }
    });
}

if (require.main === module) {
    const port = Number(process.env.PORT || 4174);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Некорректный PORT');
    createDepartmentServer().listen(port, '127.0.0.1', () => {
        console.log(`Отдел Пурпура: http://127.0.0.1:${port}/`);
    });
}

module.exports = { createDepartmentServer, taskSnapshot };
