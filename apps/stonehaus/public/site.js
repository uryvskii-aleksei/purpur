(function () {
  'use strict';
  const header = document.querySelector('.header');
  const toggle = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  const onScroll = () => header.classList.toggle('is-raised', window.scrollY > 2);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const setMenu = open => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
})();
