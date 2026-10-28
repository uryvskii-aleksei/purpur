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
  const pageSize = 24;
  const filters = { category: 'all', query: '', budget: 'all', sort: 'default', visibleCount: pageSize };
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

  function addButton(product, featured = false) {
    return product.canOrder === false
      ? `<button type="button" data-product="${product.id}" aria-label="Уточнить фасовку: ${esc(product.name)}">Фасовка уточняется</button>`
      : `<button type="button" ${featured ? 'class="btn primary"' : ''} data-add="${product.id}" aria-label="Добавить в корзину: ${esc(product.name)}">В корзину <span aria-hidden="true">+</span></button>`;
  }

  function renderGifts() {
    $('#gift-grid').innerHTML = products.filter(product => product.giftAssortment).map(product => `
      <article class="gift-card">
        <button class="gift-image" type="button" data-product="${product.id}" aria-label="Рассмотреть набор: ${esc(product.title)}"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="402" height="402" loading="lazy"></button>
        <div class="gift-body"><h3><button type="button" data-product="${product.id}">${esc(product.title)}</button></h3><p class="gift-meta">${esc(product.weight)} · четыре начинки${product.pieces ? ` · ${product.pieces} конфет` : ''}</p><div class="gift-bottom"><span class="gift-price">${money(product.price)}</span>${addButton(product, true)}</div></div>
      </article>`).join('');
  }

  function renderCategories() {
    $('#catalog-intro').textContent = `Товаров в каталоге: ${products.length}. Выберите категорию или найдите сладости по названию, вкусу и составу.`;
    $('#category-navigation').innerHTML = [...$('#category').options].map(option => `<button type="button" data-category="${esc(option.value)}" aria-pressed="${option.value === filters.category}">${esc(option.textContent)}</button>`).join('');
  }

  function renderProducts(resetPage = true) {
    if (resetPage) filters.visibleCount = pageSize;
    for (const key of ['category', 'budget', 'sort']) $(`#${key}`).value = filters[key];
    $('#search').value = filters.query;
    $('#reset-filters').hidden = filters.category === 'all' && !filters.query && filters.budget === 'all' && filters.sort === 'default';
    const matching = store.filterProducts(products, filters);
    const filtered = filters.category === 'all' && filters.sort === 'default' && !filters.query
      ? window.PurpurCatalogView.diverseOrder(matching) : matching;
    $$('#category-navigation [data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === filters.category)));
    $('#result-count').textContent = `Показано ${Math.min(filters.visibleCount, filtered.length)} из ${filtered.length}`;
    $('#load-more').hidden = filtered.length <= filters.visibleCount;
    $('#show-all').hidden = filtered.length <= filters.visibleCount;
    $('#load-more').textContent = `Показать ещё ${Math.min(pageSize, Math.max(0, filtered.length - filters.visibleCount))}`;
    $('#product-grid').innerHTML = filtered.slice(0, filters.visibleCount).map(product => `
      <article class="product-card"><div class="product-image"><button type="button" data-product="${product.id}" aria-label="Подробнее: ${esc(product.name)}"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="402" height="402" loading="lazy"></button></div><p class="product-category">${esc(product.categoryLabel)}</p><h3 class="product-title"><button type="button" data-product="${product.id}">${esc(product.title || product.name)}</button></h3><p class="product-meta">${product.weight ? esc(product.weight) : 'Вес уточняется'} · ${esc(product.packLabel)}</p><div class="product-bottom"><span class="product-price">${money(product.price)}</span>${addButton(product)}</div></article>`).join('') || '<div class="empty-results"><h3>Такого сочетания пока нет.</h3><p>Попробуйте другой вкус, категорию или бюджет.</p><button type="button" class="btn outline" data-reset>Показать все сладости →</button></div>';
  }

  function resetFilters() {
    Object.assign(filters, { category: 'all', query: '', budget: 'all', sort: 'default' });
    renderProducts();
  }

  function openProduct(id, opener) {
    const product = products.find(item => item.id === Number(id));
    if (!product) return;
    const fieldDetails = Object.entries(product.fields).map(([label, value]) => `<details><summary>${esc(label)} <span aria-hidden="true">+</span></summary><p>${esc(value).replace(/\n/g, '<br>')}</p></details>`).join('');
    $('#product-content').innerHTML = `<div class="detail-grid"><button class="detail-photo" type="button" data-photo="${product.id}" aria-label="Увеличить фотографию: ${esc(product.title || product.name)}"><img src="${asset(product.largeImage || product.image)}" alt="${esc(product.name)}" width="640" height="640"></button><div class="detail-copy"><p class="eyebrow">${esc(product.categoryLabel)}</p><h2 id="product-title">${esc(product.title || product.name)}</h2><p class="intro">${esc(product.description)}</p><div class="detail-facts"><span>${product.weight ? esc(product.weight) : 'Фасовка требует уточнения'}</span><span>${esc(product.packLabel)}</span>${product.pieces ? `<span>${product.pieces} конфет</span>` : ''}</div><p class="detail-price">${money(product.price)}</p>${addButton(product, true)}<p class="quiet">${product.canOrder === false ? 'Добавление в заявку недоступно до подтверждения фасовки.' : 'Цена по каталогу. Наличие и итоговую стоимость подтвердит менеджер.'}</p>${fieldDetails}<a class="detail-source" href="${sourceUrl(product.url)}" target="_blank" rel="noopener">Карточка в действующем магазине ↗</a></div></div>`;
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

  function addProduct(id) {
    const product = products.find(item => item.id === Number(id));
    if (!product || product.canOrder === false) return;
    const quantity = session.cart()[product.id] || 0;
    if (quantity >= store.MAX_QUANTITY) { toast('В корзине уже 99 упаковок этого товара.'); return; }
    session.setQuantity(product.id, quantity + 1);
    persistCart();
    toast(`Добавлено: ${product.title || product.name}`);
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
    $('#cart-content').innerHTML = items.map(product => `<article class="cart-item"><img src="${asset(product.image)}" alt="${esc(product.name)}" width="70" height="80"><div><h3>${esc(product.title || product.name)}</h3><small>${esc(product.weight)} · ${money(product.price)} за упаковку</small><div class="qty"><button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="Уменьшить количество: ${esc(product.title || product.name)}" ${product.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Количество">${product.quantity}</span><button type="button" data-quantity="${product.id}" data-delta="1" aria-label="Увеличить количество: ${esc(product.title || product.name)}" ${product.quantity === store.MAX_QUANTITY ? 'disabled' : ''}>+</button></div><button type="button" class="remove-item" data-remove="${product.id}" aria-label="Удалить из корзины: ${esc(product.title || product.name)}">Убрать</button></div><span class="cart-item-price">${money(product.subtotal)}</span></article>`).join('') + `<div class="cart-total"><span>Товары</span><span>${money(total)}</span></div><p class="cart-note">Наличие, стоимость доставки и итоговую сумму подтвердит менеджер. В концепции можно подготовить заявку для самостоятельной передачи фабрике.</p><button type="button" class="btn primary cart-action" data-checkout>Перейти к оформлению <span aria-hidden="true">→</span></button><button type="button" class="back-button" data-continue>← Продолжить выбор</button>`;
  }

  function readRetailForm(form) {
    const values = {};
    for (const key of Object.keys(session.retailDraft())) values[key] = form.elements.namedItem(key).value;
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

  function renderCheckout() {
    const draft = session.retailDraft();
    const { total, count } = session.summary();
    $('#cart-title').textContent = 'Оформление заявки';
    $('#cart-content').innerHTML = `<button type="button" class="back-button" data-back>← Вернуться к корзине</button><div class="checkout-steps"><span>1. Ваш выбор</span><span class="current">2. Контакт и получение</span></div><form id="checkout-form" novalidate><div class="field-row"><label class="field">Ваше имя<input name="name" required maxlength="100" autocomplete="name" value="${esc(draft.name)}"></label><label class="field">Телефон<input name="phone" type="tel" required maxlength="40" autocomplete="tel" placeholder="+7 (___) ___-__-__" value="${esc(draft.phone)}"></label></div><label class="field">Как получить<select name="delivery"><option value="spb" ${draft.delivery === 'spb' ? 'selected' : ''}>ПВЗ СДЭК в Санкт-Петербурге</option><option value="region" ${draft.delivery === 'region' ? 'selected' : ''}>СДЭК в другой город России</option><option value="pickup" ${draft.delivery === 'pickup' ? 'selected' : ''}>Самовывоз с фабрики</option></select></label><label class="field" id="checkout-city-field" ${draft.delivery === 'pickup' ? 'hidden' : ''}>Город доставки<input name="city" maxlength="150" autocomplete="address-level2" value="${esc(draft.city)}" ${draft.delivery === 'cdek' ? 'required' : ''}></label><details class="checkout-optionals" ${draft.email || draft.date || draft.notes ? 'open' : ''}><summary>Добавить пожелания <span class="optional">необязательно +</span></summary><label class="field">Желаемая дата<input name="date" type="date" value="${esc(draft.date)}"></label><label class="field">E-mail<input name="email" type="email" maxlength="150" autocomplete="email" value="${esc(draft.email)}"></label><label class="field">Пожелания<textarea name="notes" rows="3" maxlength="1500">${esc(draft.notes)}</textarea></label></details><div class="checkout-summary">${count} шт. по каталогу · <strong>${money(total)}</strong><p class="cart-note" id="checkout-delivery-note">${esc(store.shipping(session.summary().total, draft.delivery))}</p></div><p class="demo-note">Оплата картой на сайте сохраняется, как в действующем магазине. Эта демонстрация деньги не списывает и заявку фабрике не отправляет.</p><button type="submit" class="btn primary cart-action">Подготовить заявку <span aria-hidden="true">→</span></button></form>`;
    const form = $('#checkout-form');
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
      showFieldError(event.target, '');
      readRetailForm(form);
    });
    form.addEventListener('change', () => {
      readRetailForm(form);
      const method = form.elements.delivery.value;
      const pickup = method === 'pickup';
      $('#checkout-city-field').hidden = pickup;
      form.elements.city.required = !pickup;
      if (pickup) form.elements.city.setCustomValidity('');
      $('#checkout-delivery-note').textContent = store.shipping(session.summary().total, method);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      readRetailForm(form);
      const result = session.prepareRetail();
      if (!result.ok) { applyErrors(form, result.errors); return; }
      renderPrepared();
      titleFocus();
    });
  }

  function resultActions(kind) {
    return `<div class="result-actions"><button type="button" class="btn primary" data-download="${kind}">Скачать текст <span aria-hidden="true">↓</span></button><button type="button" class="btn outline" data-email="${kind}">Открыть письмо <span aria-hidden="true">↗</span></button></div>`;
  }

  function renderPrepared() {
    $('#cart-title').textContent = 'Заявка подготовлена';
    $('#cart-content').innerHTML = `<button type="button" class="back-button" data-edit>← Изменить данные</button><div class="prepared-result"><h3>Заявка подготовлена.<br>Фабрика её ещё не получила.</h3><p>Отправьте текст самостоятельно на <a href="mailto:info@purpur.spb.ru">info@purpur.spb.ru</a>. После получения менеджер сможет уточнить наличие, итоговую стоимость и способ получения.</p>${resultActions('retail')}<p>Кнопка «Открыть письмо» подготовит черновик в вашей почтовой программе. Для отправки потребуется ваше действие в ней.</p></div><details class="checkout-optionals"><summary>Посмотреть текст заявки <span aria-hidden="true">+</span></summary><pre class="order-preview">${esc(session.retailText())}</pre></details><button type="button" class="back-button" data-back>← Вернуться к корзине</button>`;
  }

  function showCart(opener) {
    if (session.stage() === 'checkout' && session.summary().count) renderCheckout();
    else if (session.stage() === 'prepared' && session.summary().count) renderPrepared();
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
    $('#wholesale-result').innerHTML = `<div class="prepared-result"><h3>Обращение подготовлено.</h3><p>Фабрика его ещё не получила. Самостоятельно передайте текст на info@purpur.spb.ru. В почтовой программе потребуется нажать «Отправить».</p>${resultActions('business')}<details><summary>Посмотреть текст <span aria-hidden="true">+</span></summary><pre class="order-preview">${esc(session.businessText(businessType))}</pre></details></div>`;
  }

  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportRequest(kind, email) {
    if (kind === 'business') readBusinessForm();
    const result = kind === 'business' ? session.prepareBusiness(businessType) : session.prepareRetail();
    if (!result.ok) {
      if (kind === 'business') applyErrors($('#wholesale-form'), result.errors);
      else { session.beginCheckout(); renderCheckout(); titleFocus(); }
      return;
    }
    const text = kind === 'business' ? session.businessText(businessType) : session.retailText();
    if (!email) { downloadText(kind === 'business' ? 'purpur-sotrudnichestvo.txt' : 'purpur-zayavka.txt', text); return; }
    const link = document.createElement('a');
    link.href = `mailto:info@purpur.spb.ru?subject=${encodeURIComponent(kind === 'business' ? 'Сотрудничество с Пурпур' : 'Розничная заявка — Пурпур')}&body=${encodeURIComponent(text)}`;
    document.body.append(link);
    link.click();
    link.remove();
    toast('Проверьте письмо и отправьте его в почтовой программе.');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('[data-product]')) openProduct(target.dataset.product, target);
    else if (target.matches('[data-photo]')) openPhoto(target.dataset.photo, target);
    else if (target.matches('[data-add]')) addProduct(target.dataset.add);
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
      returnFocus.set($('#cart-dialog'), $('#search'));
      $('#cart-dialog').close();
      $('#catalog').scrollIntoView({ behavior: 'auto' });
      $('#search').focus({ preventScroll: true });
    } else if (target.matches('[data-reset], #reset-filters')) resetFilters();
    else if (target.matches('[data-category]')) {
      filters.category = target.dataset.category;
      filters.budget = target.dataset.budget || 'all';
      filters.query = '';
      renderProducts();
    } else if (target.matches('[data-preset="gifts"]')) {
      filters.category = 'gifts'; filters.query = ''; renderProducts();
    } else if (target.matches('[data-download]')) exportRequest(target.dataset.download, false);
    else if (target.matches('[data-email]')) exportRequest(target.dataset.email, true);
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
  $('#search').addEventListener('input', event => { filters.query = event.target.value; renderProducts(); });
  for (const key of ['category', 'budget', 'sort']) $(`#${key}`).addEventListener('change', event => { filters[key] = event.target.value; renderProducts(); });
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
  $('#load-more').addEventListener('click', () => revealProducts(pageSize));
  $('#show-all').addEventListener('click', () => revealProducts(products.length));
  $('#wholesale-form').addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    showFieldError(event.target, '');
    readBusinessForm();
    if (businessPrepared) {
      businessPrepared = false;
      $('#wholesale-result').innerHTML = '<p class="demo-note">Данные изменены. Подготовьте обращение ещё раз.</p>';
    }
  });
  $('#wholesale-form').addEventListener('submit', event => {
    event.preventDefault();
    readBusinessForm();
    const result = session.prepareBusiness(businessType);
    if (!result.ok) { applyErrors(event.target, result.errors); return; }
    businessPrepared = true;
    renderBusinessResult();
    $('#wholesale-result').scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
  const background = window.createBackgroundVideo({
    video: $('#hero-video'), button: $('#hero-video-toggle'),
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

  renderCategories();
  renderGifts();
  renderProducts();
  persistCart();
})();
