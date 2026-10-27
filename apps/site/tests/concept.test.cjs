const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSession, validateRetail, validateBusiness } = require('../public/concept/state.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/products.js'), 'utf8'), context);
const products = JSON.parse(JSON.stringify(context.window.PRODUCTS));

test('Concept cart persists only allowed product IDs and bounded integer quantities', () => {
  const unknownPackage = products.find(product => product.canOrder === false);
  const session = createSession(products, { 1: 3, 2: 900, 3: 1.5, 99999: 2, [unknownPackage.id]: 1, name: 'Synthetic name' });
  assert.deepEqual(session.cart(), { 1: 3, 2: 99 });
  session.saveRetail({ name: 'Synthetic name', phone: '+7 999 000-00-00', city: 'Synthetic city', notes: 'Private draft' });
  session.saveBusiness('store', { name: 'Synthetic business', contact: 'sample@example.test' });
  assert.deepEqual(JSON.parse(session.serializeCart()), { 1: 3, 2: 99 });
  session.setQuantity(unknownPackage.id, 2);
  session.setQuantity(1, 200);
  session.setQuantity(2, 0);
  assert.deepEqual(session.cart(), { 1: 99 });
  session.setQuantity(1, 2.5);
  assert.equal(session.cart()[1], 99);
});

test('Retail draft survives back navigation, validation failure and cart edits', () => {
  const session = createSession(products, { 1: 1 });
  assert.equal(session.beginCheckout(), true);
  session.saveRetail({ name: 'Synthetic buyer', phone: '123', delivery: 'cdek', city: 'Synthetic city', email: 'sample@example.test', notes: 'Remember this note' });
  assert.equal(session.prepareRetail().ok, false);
  assert.equal(session.stage(), 'checkout');
  session.backToCart();
  session.setQuantity(1, 2);
  session.beginCheckout();
  assert.equal(session.retailDraft().notes, 'Remember this note');
  assert.equal(session.retailDraft().email, 'sample@example.test');
  session.saveRetail({ phone: '+7 (999) 000-00-00' });
  assert.equal(session.prepareRetail().ok, true);
  assert.equal(session.stage(), 'prepared');
  assert.equal(session.summary().count, 2);
  const copy = session.retailDraft();
  copy.name = 'Changed externally';
  assert.equal(session.retailDraft().name, 'Synthetic buyer');
});

test('Pickup excludes a remembered city from the prepared request and restores it for delivery', () => {
  const session = createSession(products, { 1: 1 });
  session.saveRetail({ name: 'Synthetic buyer', phone: '79990000000', delivery: 'cdek', city: 'Synthetic city' });
  session.saveRetail({ delivery: 'pickup' });
  assert.equal(session.retailDraft().city, 'Synthetic city');
  assert.equal(session.retailPayload().city, '');
  assert.doesNotMatch(session.retailText(), /Synthetic city/);
  assert.equal(session.prepareRetail().ok, true);
  session.saveRetail({ delivery: 'cdek' });
  assert.equal(session.retailPayload().city, 'Synthetic city');
  assert.match(session.retailText(), /Synthetic city/);
});

test('Prepared requests always derive from current cart and draft and never claim receipt', () => {
  const session = createSession(products, { 1: 1 });
  session.saveRetail({ name: 'First buyer', phone: '79990000000' });
  assert.equal(session.prepareRetail().ok, true);
  session.saveRetail({ name: 'Current buyer' });
  session.setQuantity(1, 3);
  const text = session.retailText();
  assert.match(text, /Current buyer/);
  assert.doesNotMatch(text, /First buyer/);
  assert.match(text, /3 шт\./);
  assert.match(text, /3\s?630 ₽/);
  assert.match(text, /Фабрика её ещё не получила/);
  assert.doesNotMatch(text, /зарегистрирована|оплачена|заказ принят/i);
  assert.equal(session.summary().count, 3);
});

test('Retail asks only required contact and conditional city and rejects malformed phones', () => {
  assert.deepEqual(validateRetail({ name: 'Synthetic buyer', phone: '79990000000', delivery: 'pickup' }), {});
  assert.ok(validateRetail({ name: ' ', phone: '123', delivery: 'cdek' }).name);
  assert.ok(validateRetail({ name: 'Buyer', phone: '123', delivery: 'cdek' }).phone);
  assert.ok(validateRetail({ name: 'Buyer', phone: '79990000000', delivery: 'cdek' }).city);
  assert.ok(validateRetail({ name: 'Buyer', phone: '79990000000', delivery: 'pickup', email: 'bad-address' }).email);
  assert.ok(validateRetail({ name: 'Buyer', phone: '1234567890123456', delivery: 'pickup' }).phone);
  assert.ok(validateRetail({ name: 'Buyer', phone: 'a79990000000', delivery: 'pickup' }).phone);
});

test('Store and corporate drafts remain separate and current business content is used', () => {
  const session = createSession(products);
  session.saveBusiness('store', { name: 'Store buyer', contact: 'sample@example.test', details: 'Store details' });
  session.saveBusiness('corporate', { name: 'Corporate buyer', contact: '79990000000', company: 'Synthetic company' });
  assert.equal(session.businessDraft('store').details, 'Store details');
  assert.equal(session.businessDraft('corporate').details, '');
  assert.equal(session.prepareBusiness('store').ok, true);
  session.saveBusiness('store', { details: 'Current store details' });
  assert.match(session.businessText('store'), /Current store details/);
  assert.doesNotMatch(session.businessText('store'), /Corporate buyer/);
  assert.match(session.businessText('corporate'), /Корпоративные подарки/);
  assert.match(session.businessText('store'), /Фабрика его ещё не получила/);
  assert.ok(validateBusiness({ name: 'Buyer', contact: 'invalid@' }).contact);
  assert.deepEqual(validateBusiness({ name: 'Buyer', contact: '+7 999 000-00-00' }), {});
});

test('An empty cart cannot enter checkout or prepare an application', () => {
  const session = createSession(products);
  assert.equal(session.beginCheckout(), false);
  session.saveRetail({ name: 'Buyer', phone: '79990000000' });
  assert.equal(session.prepareRetail().ok, false);
  assert.ok(session.prepareRetail().errors.cart);
});
