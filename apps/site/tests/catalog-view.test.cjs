const test = require('node:test');
const assert = require('node:assert/strict');
const { diverseOrder } = require('../public/concept/catalog-view.js');

test('Начало общего каталога представляет разные группы, полный ассортимент сохранён без дублей', () => {
  const products = [
    { id: 1, category: 'chocolate' }, { id: 2, category: 'chocolate' },
    { id: 3, category: 'chocolate' }, { id: 4, category: 'marmalade' },
    { id: 5, category: 'gifts' }, { id: 6, category: 'gifts' },
  ];
  const before = JSON.stringify(products);
  const result = diverseOrder(products);
  assert.equal(new Set(result.slice(0, 3).map(p => p.category)).size, 3);
  assert.deepEqual(result.map(p => p.id).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(result.filter(p => p.category === 'chocolate').map(p => p.id), [1, 2, 3]);
  assert.equal(JSON.stringify(products), before);
});
test('Пустой каталог и одна группа не теряют и не создают товары', () => {
  assert.deepEqual(diverseOrder([]), []);
  const products = [{ id: 7, category: 'chocolate' }, { id: 8, category: 'chocolate' }];
  assert.deepEqual(diverseOrder(products), products);
});
