(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  const products = window.PRODUCTS;
  const store = window.PurpurStore;
  const cartKey = 'purpur-concept-cart-v1';
  let savedCart = {};
  try { savedCart = JSON.parse(localStorage.getItem(cartKey) || '{}'); } catch { /* Недоступное хранилище не мешает выбору товаров. */ }
  const session = window.PurpurConcept.createSession(products, savedCart);
  const catalogPageSize = 8;
  const filters = { category: 'all', query: '', budget: 'all', sort: 'default', visibleCount: catalogPageSize };
  const returnFocus = new WeakMap();
  let toastTimer;
  let businessType = 'store';
  let businessPrepared = false;

  function asset(path) {
    return typeof path === 'string' && /^assets\/[a-zA-Z0-9._/-]+$/.test(path) && !path.includes('..') ? `../${path}` : '';
  }

  function sourceUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'purpur.spb.ru' ? esc(url.href) : '';
    } catch { return ''; }
  }

  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2600);
  }

  function updateCount() {
    const { count } = session.summary();
    $$('.cart-count').forEach(element => { element.textContent = count; });
    $$('.cart-toggle').forEach(element => element.setAttribute('aria-label', `Открыть корзину: ${count} шт.`));
  }

  function persistCart() {
    try { localStorage.setItem(cartKey, session.serializeCart()); } catch { /* Контактные данные остаются только в памяти страницы. */ }
    updateCount();
  }

  function closeMenu() {
    $('#mobile-nav').hidden = true;
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Открыть меню');
  }

  function openDialog(dialog, opener = document.activeElement) {
    if (dialog.open) return;
    closeMenu();
    returnFocus.set(dialog, opener);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target.closest('.close-dialog')) dialog.close();
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.classList.remove('modal-open');
      const opener = returnFocus.get(dialog);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  });

  function addButton(product) {
    if (product.canOrder === false) {
      return `<button type="button" class="btn secondary" data-product="${product.id}" aria-label="Уточнить фасовку: ${esc(product.name)}">Фасовка уточняется</button>`;
    }
    const qty = session.cart()[product.id] || 0;
    const label = qty ? `В корзине · ${qty}` : 'В корзину';
    const aria = qty
      ? `Открыть корзину, уже ${qty} шт.: ${esc(product.name)}`
      : `Добавить в корзину: ${esc(product.name)}`;
    return `<button type="button" class="btn primary" data-add="${product.id}" aria-label="${aria}">${label}${qty ? '' : ' <span aria-hidden="true">+</span>'}</button>`;
  }

  function renderGifts() {
    $('#gift-grid').innerHTML = products.filter(product => product.giftAssortment).map(product => `
      <article class="gift-card">
        <button class="gift-image" type="button" data-product="${product.id}" aria-label="Рассмотреть набор: ${esc(product.title)}"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="402" height="402" loading="lazy"></button>
        <div class="gift-body"><h3><button type="button" data-product="${product.id}">${esc(product.title)}</button></h3><p class="gift-meta">${esc(product.weight)} · четыре начинки${product.pieces ? ` · ${product.pieces} конфет` : ''}</p><div class="gift-bottom"><span class="gift-price">${money(product.price)}</span>${addButton(product)}</div></div>
      </article>`).join('');
  }

  const catalogCategories = [
    ['all', 'Все сладости'],
    ['gifts', 'Подарочные наборы'],
    ['sugarfree', 'Без сахара'],
    ['truffles', 'Трюфели и конфеты'],
    ['marmalade', 'Мармелад'],
    ['chocolate', 'Шоколад'],
    ['marzipan', 'Марципан'],
    ['fruits', 'Фрукты в шоколаде'],
    ['candied', 'Цукаты в шоколаде'],
    ['desserts', 'Крем-десерты'],
    ['bars', 'Батончики'],
    ['dubai', 'Дубайский шоколад'],
    ['marshmallow', 'Зефир в шоколаде'],
    ['toffee', 'Ирис'],
  ];

  function renderCategories() {
    $('#category-navigation').innerHTML = catalogCategories.map(([value, label]) => `<button type="button" data-category="${esc(value)}" aria-pressed="${value === filters.category}">${esc(label)}</button>`).join('');
  }

  function renderProducts(resetPage = true) {
    if (resetPage) filters.visibleCount = catalogPageSize;
    const matching = store.filterProducts(products, filters);
    const filtered = filters.category === 'all' && filters.sort === 'default' && !filters.query
      ? window.PurpurCatalogView.diverseOrder(matching) : matching;
    $$('#category-navigation [data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === filters.category)));
    $('#load-more').hidden = filtered.length <= filters.visibleCount;
    $('#load-more').textContent = 'Показать ещё';
    $('#product-grid').innerHTML = filtered.slice(0, filters.visibleCount).map(product => `
      <article class="product-card"><div class="product-image"><button type="button" data-product="${product.id}" aria-label="Подробнее: ${esc(product.name)}"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="402" height="402" loading="lazy"></button></div><p class="product-category">${esc(product.categoryLabel)}</p><h3 class="product-title"><button type="button" data-product="${product.id}">${esc(product.title || product.name)}</button></h3><p class="product-meta">${product.weight ? esc(product.weight) : 'Вес уточняется'} · ${esc(product.packLabel)}</p><div class="product-bottom"><span class="product-price">${money(product.price)}</span>${addButton(product)}</div></article>`).join('') || '<div class="empty-results"><h3>Такого сочетания пока нет.</h3><p>Попробуйте другое название или вкус.</p><button type="button" class="btn outline" data-reset>Показать все сладости →</button></div>';
  }

  function resetFilters() {
    Object.assign(filters, { category: 'all', query: '', budget: 'all', sort: 'default' });
    renderProducts();
  }

  function openProduct(id, opener) {
    const product = products.find(item => item.id === Number(id));
    if (!product) return;
    const fieldDetails = Object.entries(product.fields || {})
      .sort(([left], [right]) => Number(right === 'Состав') - Number(left === 'Состав'))
      .map(([label, value]) => `<details${label === 'Состав' ? ' open' : ''}><summary>${esc(label)} <span class="fold" aria-hidden="true"></span></summary><p>${esc(value).replace(/\n/g, '<br>')}</p></details>`)
      .join('');
    $('#product-content').innerHTML = `<div class="detail-grid"><button class="detail-photo" type="button" data-photo="${product.id}" aria-label="Увеличить фотографию: ${esc(product.title || product.name)}"><img src="${asset(product.largeImage || product.image)}" alt="${esc(product.name)}" width="640" height="640"></button><div class="detail-buy"><p class="eyebrow">${esc(product.categoryLabel)}</p><h2 id="product-title">${esc(product.title || product.name)}</h2><p class="intro">${esc(product.description)}</p><div class="detail-facts"><span>${product.weight ? esc(product.weight) : 'Фасовка требует уточнения'}</span><span>${esc(product.packLabel)}</span>${product.pieces ? `<span>${product.pieces} конфет</span>` : ''}</div><p class="detail-price">${money(product.price)}</p>${addButton(product)}<p class="quiet">${product.canOrder === false ? 'Добавление в заявку недоступно до подтверждения фасовки.' : 'Цена по каталогу. Наличие и итоговую стоимость подтвердит менеджер.'}</p></div><div class="detail-more">${fieldDetails}<a class="detail-source" href="${sourceUrl(product.url)}" target="_blank" rel="noopener">Карточка в действующем магазине <svg class="link-arrow" aria-hidden="true"><use href="#arrow-ne"/></svg></a></div></div>`;
    openDialog($('#product-dialog'), opener);
  }

  function openPhoto(id, opener) {
    const product = products.find(item => item.id === Number(id));
    if (!product) return;
    $('#photo-image').src = asset(product.largeImage || product.image);
    $('#photo-image').alt = product.name;
    $('#photo-title').textContent = `Фотография: ${product.title || product.name}`;
    openDialog($('#photo-dialog'), opener);
  }

  function addProduct(id, opener) {
    const product = products.find(item => item.id === Number(id));
    if (!product || product.canOrder === false) return;
    const quantity = session.cart()[product.id] || 0;
    if (!quantity) {
      session.setQuantity(product.id, 1);
      persistCart();
      $$(`[data-add="${product.id}"]`).forEach(button => {
        button.classList.add('btn', 'primary');
        button.innerHTML = 'В корзине · 1';
        button.setAttribute('aria-label', `Открыть корзину, уже 1 шт.: ${product.name}`);
      });
    }
    const productDialog = $('#product-dialog');
    if (productDialog.open) productDialog.close();
    showCart(opener);
  }

  function titleFocus() {
    const title = $('#cart-title');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    $('#cart-dialog').scrollTop = 0;
  }

  function renderCart() {
    const { items, total } = session.summary();
    $('#cart-title').textContent = 'Корзина';
    if (!items.length) {
      $('#cart-content').innerHTML = '<div class="empty-results"><h3>Здесь будут ваши сладости.</h3><p>Добавьте понравившиеся сладости — и продолжим.</p><button class="btn primary" type="button" data-continue>Выбрать сладости →</button></div>';
      return;
    }
    $('#cart-content').innerHTML = `<button type="button" class="back-button" data-continue>← Продолжить выбор</button>` + items.map(product => `<article class="cart-item"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="70" height="80"><div><h3>${esc(product.title || product.name)}</h3><small>${esc(product.weight)} · ${money(product.price)} за упаковку</small><div class="qty"><button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="Уменьшить количество: ${esc(product.title || product.name)}" ${product.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Количество">${product.quantity}</span><button type="button" data-quantity="${product.id}" data-delta="1" aria-label="Увеличить количество: ${esc(product.title || product.name)}" ${product.quantity === store.MAX_QUANTITY ? 'disabled' : ''}>+</button></div><button type="button" class="remove-item" data-remove="${product.id}" aria-label="Удалить из корзины: ${esc(product.title || product.name)}">Убрать</button></div><span class="cart-item-price">${money(product.subtotal)}</span></article>`).join('') + `<div class="cart-total"><span>Товары</span><span>${money(total)}</span></div><button type="button" class="btn primary cart-action" data-checkout>Перейти к оформлению <span aria-hidden="true">→</span></button>`;
  }

  function readRetailForm(form) {
    const values = {};
    for (const key of Object.keys(session.retailDraft())) {
      const field = form.elements.namedItem(key);
      if (field) values[key] = field.value;
    }
    session.saveRetail(values);
  }

  function showFieldError(element, message) {
    const label = element.closest('.field');
    if (!label) return;
    let note = label.querySelector('.field-error');
    if (!message) {
      element.removeAttribute('aria-invalid');
      element.removeAttribute('aria-describedby');
      note?.remove();
      return;
    }
    if (!note) {
      note = document.createElement('span');
      note.className = 'field-error';
      label.append(note);
    }
    note.id = `${element.name}-error`;
    note.textContent = message;
    element.setAttribute('aria-invalid', 'true');
    element.setAttribute('aria-describedby', note.id);
  }

  function applyErrors(form, errors) {
    let first = null;
    for (const element of form.elements) {
      if (typeof element.setCustomValidity !== 'function' || !element.name) continue;
      element.setCustomValidity('');
      const message = errors[element.name] || '';
      showFieldError(element, message);
      if (message && !first) first = element;
    }
    first?.focus();
  }

  let sendError = '';

  async function sendApplication(kind, text) {
    try {
      const response = await fetch('/order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ kind, text }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data.ok === true;
    } catch {
      return false;
    }
  }

  let cdekMap;
  let cdekLayer;
  let cdekTarget;

  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.append(css);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('map'));
      document.head.append(script);
    });
  }

  function chooseCdekPoint(point) {
    if (!cdekTarget) return;
    cdekTarget.value = `${point.city}, ${point.address}, ${point.code}`;
    let chosen = $('#cdek-chosen');
    if (!chosen) {
      const field = $('#checkout-city-field');
      const hidden = $('#cdek-point');
      if (field && hidden) {
        chosen = document.createElement('p');
        chosen.className = 'cdek-chosen';
        chosen.id = 'cdek-chosen';
        field.insertBefore(chosen, hidden);
      }
    }
    if (chosen) chosen.textContent = cdekTarget.value;
    cdekTarget.dispatchEvent(new Event('input', { bubbles: true }));
    setCdekMapOpen(false);
  }

  async function drawCdek(query) {
    const note = $('#cdek-map-note');
    note.textContent = 'Загружаем пункты СДЭК…';
    cdekLayer.clearLayers();
    const url = query.code
      ? `/cdek-points.php?code=${encodeURIComponent(query.code)}`
      : `/cdek-points.php?city=${encodeURIComponent(query.city || '')}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    const points = Array.isArray(data.points) ? data.points : [];
    const bounds = [];
    points.forEach(point => {
      if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return;
      const marker = window.L.circleMarker([point.lat, point.lon], {
        radius: 9, color: '#ffffff', weight: 2, fillColor: '#9d169e', fillOpacity: 1,
      });
      const popup = document.createElement('div');
      const text = document.createElement('p');
      text.textContent = `${point.city}, ${point.address}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn primary cdek-pick';
      button.textContent = 'Выбрать';
      button.addEventListener('click', () => chooseCdekPoint(point));
      popup.append(text, button);
      marker.bindPopup(popup, { minWidth: 240, maxWidth: 280 });
      marker.addTo(cdekLayer);
      bounds.push([point.lat, point.lon]);
    });
    if (bounds.length) cdekMap.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
    else cdekMap.setView([59.94, 30.31], 10);
    setTimeout(() => cdekMap.invalidateSize(), 80);
    note.textContent = bounds.length
      ? `На карте ${bounds.length} пунктов. Нажмите точку и подтвердите выбор.`
      : 'Пункты не найдены. Проверьте название города.';
  }

  function setCdekMapOpen(open) {
    const map = $('#cdek-map-dialog');
    const cart = $('#cart-dialog');
    if (cart && map.parentElement !== cart) cart.append(map);
    map.hidden = !open;
    const content = $('#cart-content');
    const heading = cart?.querySelector('.dialog-heading');
    if (content) content.hidden = open;
    if (heading) heading.hidden = open;
  }

  async function showCdekMap(input, preset) {
    cdekTarget = input;
    const dialog = $('#cdek-map-dialog');
    const cityInput = $('#cdek-map-city');
    if (preset.city) cityInput.value = preset.city;
    setCdekMapOpen(true);
    const note = $('#cdek-map-note');
    try {
      await loadLeaflet();
      if (!cdekMap) {
        cdekMap = window.L.map('cdek-map');
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap',
        }).addTo(cdekMap);
        cdekLayer = window.L.layerGroup().addTo(cdekMap);
      }
      setTimeout(() => cdekMap.invalidateSize(), 60);
      if (!preset.code && !cityInput.value.trim()) {
        note.textContent = 'Введите город, чтобы показать пункты на карте.';
        if (cdekMap) cdekMap.setView([59.94, 30.31], 10);
        return;
      }
      await drawCdek(preset.code ? { code: preset.code } : { city: cityInput.value.trim() });
    } catch {
      note.textContent = 'Карта СДЭК не открылась. Попробуйте ещё раз.';
    }
  }

  function renderCheckout() {
    const draft = session.retailDraft();
    const { total, count } = session.summary();
    $('#cart-title').textContent = 'Оформление заявки';
    $('#cart-content').innerHTML = `<button type="button" class="back-button" data-back>← Вернуться к корзине</button><form id="checkout-form" novalidate><div class="field-row"><label class="field">Ваше имя<input name="name" required maxlength="100" autocomplete="name" value="${esc(draft.name)}"></label><label class="field">Телефон<input name="phone" type="tel" required maxlength="40" autocomplete="tel" placeholder="+7 (___) ___-__-__" value="${esc(draft.phone)}"></label></div><label class="field">Как получить<select name="delivery"><option value="spb" ${draft.delivery === 'spb' ? 'selected' : ''}>ПВЗ СДЭК в Санкт-Петербурге</option><option value="region" ${draft.delivery === 'region' ? 'selected' : ''}>СДЭК в другой город России</option><option value="pickup" ${draft.delivery === 'pickup' ? 'selected' : ''}>Самовывоз с фабрики</option></select></label><label class="field" id="checkout-city-field" ${draft.delivery === 'pickup' ? 'hidden' : ''}>Пункт выдачи СДЭК<button type="button" class="btn secondary cdek-open" id="cdek-open"><svg class="cdek-map-icon" aria-hidden="true"><use href="#map-icon"/></svg>Выбрать пункт на карте</button>${draft.city ? `<p class="cdek-chosen" id="cdek-chosen">${esc(draft.city)}</p>` : ''}<input type="hidden" name="city" id="cdek-point" value="${esc(draft.city)}"></label><div class="checkout-summary">${count} шт. по каталогу · <strong>${money(total)}</strong><p class="cart-note" id="checkout-delivery-note">${esc(store.shipping(session.summary().total, draft.delivery))}</p></div>${sendError ? `<p class="demo-note" role="alert">${esc(sendError)}</p>` : ''}<button type="submit" class="btn primary cart-action">Отправить заявку <span aria-hidden="true">→</span></button></form>`;
    const form = $('#checkout-form');
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
      showFieldError(event.target, '');
      readRetailForm(form);
    });
    const openCdekMap = () => showCdekMap($('#cdek-point'), form.elements.delivery.value === 'region' ? {} : { code: '137', city: 'Санкт-Петербург' });
    $('#cdek-open')?.addEventListener('click', openCdekMap);
    form.addEventListener('change', () => {
      readRetailForm(form);
      const method = form.elements.delivery.value;
      const pickup = method === 'pickup';
      $('#checkout-city-field').hidden = pickup;
      const city = form.elements.city;
      if (city) {
        city.required = !pickup;
        if (pickup) city.setCustomValidity('');
      }
      $('#checkout-delivery-note').textContent = store.shipping(session.summary().total, method);
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      readRetailForm(form);
      const result = session.prepareRetail();
      if (!result.ok) { applyErrors(form, result.errors); return; }
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      button.textContent = 'Отправляем…';
      const sent = await sendApplication('retail', session.retailText());
      if (!sent) {
        sendError = 'Письмо не ушло. Проверьте связь и отправьте заявку ещё раз или позвоните +7 (812) 911-59-36.';
        session.beginCheckout();
        renderCheckout();
        titleFocus();
        return;
      }
      sendError = '';
      session.markSent();
      renderSent();
      titleFocus();
    });
  }

  function renderSent() {
    $('#cart-title').textContent = 'Заявка отправлена';
    $('#cart-content').innerHTML = '<div class="prepared-result"><h3>Заявка ушла на почту фабрики.</h3><p>Мы свяжемся с вами и подтвердим наличие, сумму и получение. Деньги не списаны, заказ не зарезервирован.</p></div><button type="button" class="btn primary cart-action" data-continue>Вернуться к сладостям</button>';
  }

  function showCart(opener) {
    if (session.stage() === 'sent' && session.summary().count) renderSent();
    else if (session.stage() === 'checkout' && session.summary().count) renderCheckout();
    else renderCart();
    openDialog($('#cart-dialog'), opener);
  }

  function readBusinessForm() {
    const form = $('#wholesale-form');
    const draft = {};
    for (const key of Object.keys(session.businessDraft(businessType))) draft[key] = form.elements.namedItem(key).value;
    session.saveBusiness(businessType, draft);
  }

  function showBusiness(type, opener) {
    businessType = type === 'corporate' ? 'corporate' : 'store';
    const corporate = businessType === 'corporate';
    const form = $('#wholesale-form');
    form.elements.type.value = businessType;
    for (const [key, value] of Object.entries(session.businessDraft(businessType))) {
      form.elements.namedItem(key).value = value;
      form.elements.namedItem(key).setCustomValidity('');
    }
    $('#wholesale-title').textContent = corporate ? 'Подарки для вашей команды.' : 'Обсудим поставки в магазин.';
    $('#wholesale-intro').textContent = corporate ? 'Для первого разговора достаточно имени и контакта. Остальные детали можно обсудить с менеджером.' : 'Оставьте контакт, чтобы подготовить обращение об ассортименте и условиях поставки.';
    $('#wholesale-details-label').textContent = corporate ? 'Количество, желаемая дата и пожелания — необязательно' : 'Город, ассортимент и объём — необязательно';
    businessPrepared = false;
    $('#wholesale-result').replaceChildren();
    openDialog($('#wholesale-dialog'), opener);
  }

  function renderBusinessResult() {
    $('#wholesale-result').innerHTML = '<div class="prepared-result"><h3>Обращение ушло на почту фабрики.</h3><p>Это не оплата и не бронь. Менеджер ответит по указанному контакту.</p></div>';
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('[data-product]')) openProduct(target.dataset.product, target);
    else if (target.matches('[data-photo]')) openPhoto(target.dataset.photo, target);
    else if (target.matches('[data-add]')) addProduct(target.dataset.add, target);
    else if (target.matches('.cart-toggle')) showCart(target);
    else if (target.matches('[data-business]')) showBusiness(target.dataset.business, target);
    else if (target.matches('[data-quantity]')) {
      session.setQuantity(target.dataset.quantity, session.cart()[target.dataset.quantity] + Number(target.dataset.delta));
      persistCart();
      const selector = `[data-quantity="${target.dataset.quantity}"][data-delta="${target.dataset.delta}"]`;
      renderCart();
      const next = $(selector);
      if (next && !next.disabled) next.focus({ preventScroll: true });
      else titleFocus();
    } else if (target.matches('[data-remove]')) {
      session.setQuantity(target.dataset.remove, 0);
      persistCart();
      renderCart();
      titleFocus();
    } else if (target.matches('[data-checkout]')) {
      if (session.beginCheckout()) { renderCheckout(); $('#checkout-form').elements.name.focus({ preventScroll: true }); $('#cart-dialog').scrollTop = 0; }
    } else if (target.matches('[data-back]')) {
      session.backToCart(); renderCart(); titleFocus();
    } else if (target.matches('[data-edit]')) {
      if (session.beginCheckout()) { renderCheckout(); $('#checkout-form').elements.name.focus({ preventScroll: true }); $('#cart-dialog').scrollTop = 0; }
    } else if (target.matches('[data-continue]')) {
      returnFocus.set($('#cart-dialog'), $('#category-navigation button'));
      $('#cart-dialog').close();
      $('#catalog').scrollIntoView({ behavior: 'auto' });
      $('#category-navigation button')?.focus({ preventScroll: true });
    } else if (target.matches('[data-reset], #reset-filters')) resetFilters();
    else if (target.matches('[data-category]')) {
      filters.category = target.dataset.category;
      filters.query = '';
      renderProducts();
    }
  });

  $('#menu-toggle').addEventListener('click', () => {
    const expanded = $('#mobile-nav').hidden;
    $('#mobile-nav').hidden = !expanded;
    $('#menu-toggle').setAttribute('aria-expanded', String(expanded));
    $('#menu-toggle').setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
  });
  $('#mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('#mobile-nav').hidden && !$('dialog[open]')) { closeMenu(); $('#menu-toggle').focus(); }
  });
  function revealProducts(count) {
    const firstNewIndex = filters.visibleCount;
    filters.visibleCount += count;
    renderProducts(false);
    const firstNewAction = $('#product-grid').children[firstNewIndex]?.querySelector('[data-product]');
    if (firstNewAction) {
      firstNewAction.focus({ preventScroll: true });
      firstNewAction.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }
  $('#load-more').addEventListener('click', () => revealProducts(catalogPageSize));
  $('#wholesale-form').addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    showFieldError(event.target, '');
    readBusinessForm();
    if (businessPrepared) {
      businessPrepared = false;
      $('#wholesale-result').innerHTML = '<p class="demo-note">Данные изменены. Отправьте обращение ещё раз.</p>';
    }
  });
  $('#wholesale-form').addEventListener('submit', async event => {
    event.preventDefault();
    readBusinessForm();
    const result = session.prepareBusiness(businessType);
    if (!result.ok) { applyErrors(event.target, result.errors); return; }
    const button = event.target.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = 'Отправляем…';
    const sent = await sendApplication('business', session.businessText(businessType));
    button.disabled = false;
    button.textContent = 'Отправить обращение';
    if (!sent) {
      $('#wholesale-result').innerHTML = '<p class="demo-note" role="alert">Письмо не ушло. Позвоните +7 (812) 911-59-36.</p>';
      return;
    }
    businessPrepared = true;
    renderBusinessResult();
    $('#wholesale-result').scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
  const background = window.createBackgroundVideo({
    video: $('#hero-video'), button: null,
    page: document, motion: matchMedia('(prefers-reduced-motion: reduce)'),
    observe(onVisibility) {
      const observer = new IntersectionObserver(entries => {
        onVisibility(entries[0].isIntersecting && entries[0].intersectionRatio >= 0.08);
      }, {
        threshold: 0.08,
        rootMargin: `-${Math.ceil($('.header').getBoundingClientRect().height)}px 0px 0px 0px`,
      });
      observer.observe($('#hero-video'));
      return observer;
    },
  });
  window.addEventListener('pagehide', () => background.suspend());
  window.addEventListener('pageshow', () => background.resume());
  const header = $('.header');
  const paintHeader = () => header.classList.toggle('is-raised', window.scrollY > 2);
  paintHeader();
  window.addEventListener('scroll', paintHeader, { passive: true });

  const cdekCity = $('#cdek-map-city');
  const searchCdekCity = () => {
    const value = cdekCity.value.trim();
    if (value) drawCdek({ city: value });
  };
  cdekCity.addEventListener('change', searchCdekCity);
  cdekCity.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    searchCdekCity();
  });
  $('#cdek-map-dialog').querySelector('.close-dialog').addEventListener('click', () => setCdekMapOpen(false));
  $('#cart-dialog').addEventListener('close', () => setCdekMapOpen(false));

  renderCategories();
  renderGifts();
  renderProducts();
  persistCart();
})();
