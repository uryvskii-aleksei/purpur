'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');

const root = fs.realpathSync(path.join(__dirname, '../apps/site/public'));
const port = Number(process.env.PORT || 4173);
const types = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT должен быть целым числом от 1 до 65535');
}

const server = http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
    }
    let file;
    try {
        const url = new URL(request.url, 'http://localhost');
        const pathname = decodeURIComponent(url.pathname);
        const requested = path.resolve(root, `.${pathname}`);
        const directory = fs.statSync(requested).isDirectory();
        if (directory) {
            const relative = path.relative(root, fs.realpathSync(requested));
            if (relative.startsWith('..') || path.isAbsolute(relative)) {
                response.writeHead(403).end();
                return;
            }
            if (!url.pathname.endsWith('/')) {
                response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
                return;
            }
        }
        const candidate = directory ? path.join(requested, 'index.html') : requested;
        file = fs.realpathSync(candidate);
        const relative = path.relative(root, file);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            response.writeHead(403).end();
            return;
        }
        if (!fs.statSync(file).isFile()) throw new Error('not a file');
    } catch {
        response.writeHead(404).end();
        return;
    }
    const size = fs.statSync(file).size;
    response.writeHead(200, {
        'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': size,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else pipeline(fs.createReadStream(file), response, () => {});
}).listen(port, '127.0.0.1', () => {
    console.log(`Пурпур: http://localhost:${port}`);
});

module.exports = server;
