'use strict';

const { spawnSync } = require('node:child_process');

// Отдельный процесс ограничивает зависание обращения к WindowServer.
const probe = String.raw`
import ctypes as c, json, time
cg = c.CDLL('/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics')
cg.CGEventSourceButtonState.argtypes = [c.c_int32, c.c_uint32]
cg.CGEventSourceButtonState.restype = c.c_bool
samples = []
for index in range(3):
    samples.append({name: {button: bool(cg.CGEventSourceButtonState(state, number))
        for number, button in enumerate(['left', 'right', 'middle'])}
        for state, name in [(0, 'combined'), (1, 'hid')]})
    if index < 2:
        time.sleep(0.25)
print(json.dumps(samples), flush=True)
`;

function collectSnapshot({ platform = process.platform, run = spawnSync } = {}) {
    const result = {
        timestamp: new Date().toISOString(),
        platform,
        passive: true,
        buttons: { status: 'unavailable' },
        nativeAutomation: { status: 'unavailable' },
    };
    if (platform !== 'darwin') {
        result.buttons.status = 'unsupported-platform';
        return result;
    }

    const buttons = run('/usr/bin/python3', ['-u', '-c', probe], {
        encoding: 'utf8', timeout: 5000, maxBuffer: 16384,
    });
    if (buttons.status === 0 && !buttons.error) {
        try {
            const samples = JSON.parse(buttons.stdout);
            const valid = Array.isArray(samples) && samples.length === 3 && samples.every(
                sample => ['combined', 'hid'].every(state => ['left', 'right', 'middle'].every(
                    button => typeof sample?.[state]?.[button] === 'boolean',
                )),
            );
            if (valid) {
                result.buttons = {
                    status: 'available', samples,
                    leftHeldAcrossSamples: samples.every(sample => sample.combined.left && sample.hid.left),
                };
            } else {
                result.buttons.reason = 'invalid-probe-output';
            }
        } catch {
            result.buttons.reason = 'invalid-probe-output';
        }
    } else {
        result.buttons.reason = buttons.error?.code === 'ETIMEDOUT' ? 'timeout' : 'probe-failed';
    }

    const processes = run('/bin/ps', ['-axo', 'pid=,comm='], {
        encoding: 'utf8', timeout: 3000, maxBuffer: 1048576,
    });
    if (processes.status === 0 && !processes.error) {
        const suffix = '/Codex Computer Use.app/Contents/MacOS/SkyComputerUseService';
        const pids = String(processes.stdout).split('\n').flatMap(line => {
            const match = line.trim().match(/^(\d+)\s+(.+)$/);
            return match && match[2].endsWith(suffix) ? [Number(match[1])] : [];
        });
        result.nativeAutomation = { status: 'available', running: pids.length > 0, pids };
    }
    return result;
}

if (require.main === module) {
    const result = collectSnapshot();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (result.buttons.status !== 'available' || result.nativeAutomation.status !== 'available') {
        process.exitCode = 1;
    }
}

module.exports = { collectSnapshot };
