'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { collectSnapshot } = require('./diagnose-desktop-input.cjs');

function sample(left = false) {
    return {
        combined: { left, right: false, middle: false },
        hid: { left, right: false, middle: false },
    };
}

test('Снимок отличает краткое нажатие от удержания и не раскрывает список приложений', () => {
    const result = collectSnapshot({ platform: 'darwin', run(command) {
        if (command === '/usr/bin/python3') {
            return { status: 0, stdout: JSON.stringify([sample(), sample(true), sample()]) };
        }
        return { status: 0, stdout: '42 /private/Codex Computer Use.app/Contents/MacOS/SkyComputerUseService\n99 /private/Other App\n' };
    } });
    assert.equal(result.buttons.status, 'available');
    assert.equal(result.buttons.leftHeldAcrossSamples, false);
    assert.deepEqual(result.nativeAutomation, { status: 'available', running: true, pids: [42] });
    assert.equal(JSON.stringify(result).includes('Other App'), false);
});

test('Удержание в двух источниках остаётся наблюдением, без автоматического исправления', () => {
    const commands = [];
    const result = collectSnapshot({ platform: 'darwin', run(command) {
        commands.push(command);
        return { status: 0, stdout: command === '/usr/bin/python3'
            ? JSON.stringify([sample(true), sample(true), sample(true)]) : '' };
    } });
    assert.equal(result.buttons.leftHeldAcrossSamples, true);
    assert.deepEqual(commands, ['/usr/bin/python3', '/bin/ps']);
    assert.equal(result.nativeAutomation.running, false);
});

test('Тайм-аут и отказ чтения процессов не выдаются за исправный ввод', () => {
    const result = collectSnapshot({ platform: 'darwin', run(command, args, options) {
        assert.ok(options.timeout > 0 && options.timeout <= 5000);
        return command === '/usr/bin/python3'
            ? { status: null, error: { code: 'ETIMEDOUT' } }
            : { status: 1, stderr: 'private diagnostic output' };
    } });
    assert.equal(result.buttons.status, 'unavailable');
    assert.equal(result.buttons.reason, 'timeout');
    assert.equal(result.nativeAutomation.status, 'unavailable');
    assert.equal(JSON.stringify(result).includes('private diagnostic output'), false);
});

test('Неполный ответ системной пробы остаётся непроверенным', () => {
    const result = collectSnapshot({ platform: 'darwin', run(command) {
        return { status: 0, stdout: command === '/usr/bin/python3' ? '[{}]' : '' };
    } });
    assert.equal(result.buttons.status, 'unavailable');
    assert.equal(result.buttons.reason, 'invalid-probe-output');
});

test('На другой ОС системные процессы не запускаются', () => {
    const result = collectSnapshot({ platform: 'linux', run() {
        assert.fail('Не следует запускать macOS-диагностику на другой ОС');
    } });
    assert.equal(result.buttons.status, 'unsupported-platform');
});
