(function (root) {
  'use strict';

  const store = typeof module !== 'undefined' && module.exports ? require('../store.js') : root.PurpurStore;
  const retailDefaults = { name: '', phone: '', delivery: 'pickup', city: '', email: '', date: '', notes: '' };
  const businessDefaults = { name: '', contact: '', company: '', details: '' };
  const limits = { name: 100, phone: 40, city: 150, email: 150, date: 10, notes: 1500, contact: 150, company: 150, details: 1500 };
  const money = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  const clean = value => String(value || '').trim();
  const validPhone = value => /^[+\d\s().-]+$/.test(clean(value)) && /^\d{10,15}$/.test(clean(value).replace(/\D/g, ''));
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));

  function updateDraft(current, update, defaults) {
    const next = { ...current };
    for (const key of Object.keys(defaults)) {
      if (typeof update[key] === 'string') next[key] = update[key].slice(0, limits[key] || 30);
    }
    if ('delivery' in next && !['pickup', 'cdek'].includes(next.delivery)) next.delivery = 'pickup';
    return next;
  }

  function validateRetail(draft = {}) {
    const errors = {};
    if (!clean(draft.name)) errors.name = 'Укажите, как к вам обращаться.';
    if (!validPhone(draft.phone)) errors.phone = 'Укажите телефон: от 10 до 15 цифр.';
    if (draft.delivery === 'cdek' && !clean(draft.city)) errors.city = 'Укажите город доставки.';
    if (clean(draft.email) && !validEmail(draft.email)) errors.email = 'Проверьте адрес электронной почты.';
    return errors;
  }

  function validateBusiness(draft = {}) {
    const errors = {};
    if (!clean(draft.name)) errors.name = 'Укажите, как к вам обращаться.';
    if (!validPhone(draft.contact) && !validEmail(draft.contact)) errors.contact = 'Укажите телефон из 10–15 цифр или полный e-mail.';
    return errors;
  }

  function createSession(products, initialCart = {}) {
    let cart = store.normalizeCart(initialCart, products);
    let retail = { ...retailDefaults };
    const business = { store: { ...businessDefaults }, corporate: { ...businessDefaults } };
    let stage = 'cart';
    const typeKey = type => type === 'corporate' ? 'corporate' : 'store';
    const summary = () => store.cartSummary(cart, products);
    const retailPayload = () => {
      const payload = Object.fromEntries(Object.entries(retail).map(([key, value]) => [key, clean(value)]));
      if (payload.delivery === 'pickup') payload.city = '';
      return payload;
    };

    return {
      cart: () => ({ ...cart }),
      summary,
      serializeCart: () => JSON.stringify(cart),
      setQuantity(id, quantity) {
        const product = products.find(item => item.id === Number(id));
        if (!product || product.canOrder === false || !Number.isSafeInteger(quantity) || quantity < 0) return false;
        if (quantity === 0) delete cart[product.id];
        else cart[product.id] = Math.min(quantity, store.MAX_QUANTITY);
        if (stage === 'prepared') stage = 'cart';
        return true;
      },
      stage: () => stage,
      beginCheckout() {
        if (!summary().count) return false;
        stage = 'checkout';
        return true;
      },
      backToCart() { stage = 'cart'; },
      retailDraft: () => ({ ...retail }),
      saveRetail(update) {
        retail = updateDraft(retail, update, retailDefaults);
        if (stage === 'prepared') stage = 'checkout';
      },
      retailPayload,
      prepareRetail() {
        const errors = validateRetail(retail);
        if (!summary().count) errors.cart = 'Добавьте сладости в корзину.';
        const ok = Object.keys(errors).length === 0;
        if (ok) stage = 'prepared';
        return { ok, errors };
      },
      retailText() {
        const draft = retailPayload();
        const basket = summary();
        const lines = [
          'Заявка подготовлена. Фабрика её ещё не получила.',
          'Для передачи заявки самостоятельно отправьте этот текст на info@purpur.spb.ru.',
          '',
          'Розничная заявка «Пурпур»',
          `Имя: ${draft.name}`,
          `Телефон: ${draft.phone}`,
          `Получение: ${draft.delivery === 'pickup' ? 'самовывоз с фабрики' : 'доставка СДЭК'}`,
        ];
        if (draft.city) lines.push(`Город: ${draft.city}`);
        if (draft.date) lines.push(`Желаемая дата: ${draft.date}`);
        if (draft.email) lines.push(`E-mail: ${draft.email}`);
        if (draft.notes) lines.push(`Пожелания: ${draft.notes}`);
        lines.push('', 'Состав заявки:');
        basket.items.forEach(item => lines.push(`${item.name} · ${item.weight} · ${item.quantity} шт. × ${money(item.price)} = ${money(item.subtotal)}`));
        lines.push('', `Итого по каталогу: ${money(basket.total)}.`, 'Наличие, итоговую стоимость, получение и срок подтвердит менеджер. Оплата не произведена.');
        return lines.join('\n');
      },
      businessDraft(type) { return { ...business[typeKey(type)] }; },
      saveBusiness(type, update) {
        const key = typeKey(type);
        business[key] = updateDraft(business[key], update, businessDefaults);
      },
      prepareBusiness(type) {
        const errors = validateBusiness(business[typeKey(type)]);
        return { ok: Object.keys(errors).length === 0, errors };
      },
      businessText(type) {
        const key = typeKey(type);
        const draft = business[key];
        const lines = [
          'Обращение подготовлено. Фабрика его ещё не получила.',
          'Для передачи обращения самостоятельно отправьте этот текст на info@purpur.spb.ru.',
          '',
          key === 'corporate' ? 'Корпоративные подарки «Пурпур»' : 'Поставки в магазин «Пурпур»',
          `Имя: ${clean(draft.name)}`,
          `Контакт: ${clean(draft.contact)}`,
        ];
        if (clean(draft.company)) lines.push(`Компания: ${clean(draft.company)}`);
        if (clean(draft.details)) lines.push(`Подробности: ${clean(draft.details)}`);
        return lines.join('\n');
      },
    };
  }

  const api = { createSession, validateRetail, validateBusiness };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PurpurConcept = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
