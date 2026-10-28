const test = require('node:test');
const assert = require('node:assert/strict');
const createBackgroundVideo = require('../public/concept/background-video.js');

class Target {
  constructor(values = {}) { Object.assign(this, values); this.events = {}; }
  addEventListener(name, fn) { (this.events[name] ||= []).push(fn); }
  emit(name) { for (const fn of this.events[name] || []) fn(); }
  setAttribute(name, value) { this[name] = value; }
}
function fixture(reduced = false) {
  const video = new Target({ paused: true, calls: 0 });
  video.play = async () => { video.calls++; video.paused = false; video.emit('play'); };
  video.pause = () => { if (!video.paused) { video.paused = true; video.emit('pause'); } };
  const page = new Target({ hidden: false });
  const motion = new Target({ matches: reduced });
  const button = new Target({ hidden: true });
  let visibility;
  const controller = createBackgroundVideo({ video, button, page, motion, observe(fn) { visibility = fn; return { disconnect() {} }; } });
  return { video, page, motion, button, controller, visible(value) { visibility(value); } };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('Фон играет только при видимости и останавливается в скрытой вкладке', async () => {
  const f = fixture();
  assert.equal(f.video.calls, 0);
  f.visible(true); await settle();
  assert.equal(f.video.paused, false);
  f.page.hidden = true; f.page.emit('visibilitychange');
  assert.equal(f.video.paused, true);
  f.page.hidden = false; f.page.emit('visibilitychange'); await settle();
  assert.equal(f.video.paused, false);
  f.visible(false);
  assert.equal(f.video.paused, true);
});
test('Пользовательская пауза сохраняется после прокрутки, reduced motion не запускает фон автоматически', async () => {
  const f = fixture(true);
  f.visible(true); await settle();
  assert.equal(f.video.calls, 0);
  f.button.emit('click'); await settle();
  assert.equal(f.video.paused, false);
  f.button.emit('click');
  f.visible(false); f.visible(true); await settle();
  assert.equal(f.video.paused, true);
});
test('Уход со страницы приостанавливает видео, возврат восстанавливает воспроизведение', async () => {
  const f = fixture(); f.visible(true); await settle();
  f.controller.suspend();
  assert.equal(f.video.paused, true);
  f.controller.resume(); await settle();
  assert.equal(f.video.paused, false);
});
test('Ожидание разрешения play не создаёт параллельных запусков и учитывает скрытие вкладки', async () => {
  const f = fixture(); let finish;
  f.video.play = () => { f.video.calls++; return new Promise(resolve => { finish = () => { f.video.paused = false; resolve(); }; }); };
  f.visible(true); f.controller.sync(); f.controller.sync();
  assert.equal(f.video.calls, 1);
  f.page.hidden = true; f.page.emit('visibilitychange');
  finish(); await settle();
  assert.equal(f.video.paused, true);
});
test('Запрет автозапуска оставляет доступный ручной запуск, ошибка медиа отключает кнопку', async () => {
  const f = fixture();
  f.video.play = async () => { throw new Error('NotAllowedError'); };
  f.visible(true); await settle();
  assert.equal(f.button.hidden, false);
  assert.match(f.button.textContent, /Включить/);
  f.video.emit('error');
  assert.equal(f.button.disabled, true);
  assert.match(f.button.textContent, /недоступно/);
});
