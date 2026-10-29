(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.createBackgroundVideo = factory;
})(typeof window === 'undefined' ? globalThis : window, function createBackgroundVideo({ video, button, page, motion, observe }) {
  let visible = false;
  let allowed = !motion.matches;
  let userPaused = false;
  let pending = false;
  let pageActive = true;
  let failed = false;
  const shouldPlay = () => visible && pageActive && !page.hidden && allowed && !userPaused && !failed;
  function update() {
    if (!button) return;
    const playing = !video.paused;
    button.textContent = failed ? 'Видео недоступно' : playing ? 'Ⅱ Пауза видео' : '▶ Включить видео';
    button.setAttribute('aria-label', playing ? 'Приостановить фоновое видео' : 'Воспроизвести фоновое видео без звука');
    button.disabled = failed;
  }
  async function sync() {
    if (!shouldPlay()) { video.pause(); update(); return; }
    if (!video.paused || pending) return;
    pending = true;
    try {
      await video.play();
      // Вкладка могла скрыться, пока браузер разрешал воспроизведение.
      if (!shouldPlay()) video.pause();
    } catch {
      // При запрете автозапуска остаются постер и явная кнопка запуска.
    } finally { pending = false; update(); }
  }
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      userPaused = !video.paused;
      if (!userPaused) allowed = true;
      sync();
    });
  }
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  video.addEventListener('error', () => { failed = true; sync(); });
  page.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { allowed = !motion.matches; sync(); });
  const observer = observe((isVisible) => { visible = isVisible; sync(); });
  update();
  return {
    sync,
    suspend() { pageActive = false; sync(); },
    resume() { pageActive = true; sync(); },
    disconnect() { pageActive = false; observer.disconnect(); sync(); },
  };
});
