(function (root) {
  'use strict';
  function diverseOrder(products) {
    const groups = new Map();
    for (const product of products) {
      if (!groups.has(product.category)) groups.set(product.category, []);
      groups.get(product.category).push(product);
    }
    const ordered = [];
    for (let index = 0; ordered.length < products.length; index++) {
      for (const group of groups.values()) if (index < group.length) ordered.push(group[index]);
    }
    return ordered;
  }
  const api = { diverseOrder };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PurpurCatalogView = api;
})(typeof window === 'undefined' ? globalThis : window);
