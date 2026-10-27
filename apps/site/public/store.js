(function(root){
  'use strict';
  const MAX_QUANTITY=99;
  function normalizeCart(raw,products){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
    const result={};
    for(const p of products){if(p.canOrder===false)continue;const q=raw[p.id];if(Number.isSafeInteger(q)&&q>0)result[p.id]=Math.min(q,MAX_QUANTITY)}
    return result;
  }
  function cartSummary(cart,products){
    const normalized=normalizeCart(cart,products);
    const items=products.filter(p=>normalized[p.id]).map(p=>({...p,quantity:normalized[p.id],subtotal:p.price*normalized[p.id]}));
    return {items,count:items.reduce((s,p)=>s+p.quantity,0),total:items.reduce((s,p)=>s+p.subtotal,0)};
  }
  function filterProducts(products,{category='all',query='',budget='all',sort='default'}={}){
    const q=query.toLocaleLowerCase('ru').replaceAll('ё','е').trim();
    let out=products.filter(p=>(category==='all'||p.category===category||p.categories?.includes(category))&&(budget==='all'||p.price<=Number(budget))&&(!q||[p.name,p.title,p.description,p.fields['Состав']||''].join(' ').toLocaleLowerCase('ru').replaceAll('ё','е').includes(q)));
    if(sort==='asc')out.sort((a,b)=>a.price-b.price);if(sort==='desc')out.sort((a,b)=>b.price-a.price);
    return out;
  }
  function shipping(total,method){
    if(method==='pickup')return 'Самовывоз с фабрики — без стоимости доставки.';
    if(method==='spb'&&total>=10000)return 'Бесплатно до ПВЗ СДЭК по Санкт-Петербургу. Возможная стоимость термоупаковки уточняется отдельно.';
    if(method==='spb')return `До бесплатной доставки в ПВЗ СДЭК по Санкт-Петербургу — ${new Intl.NumberFormat('ru-RU').format(10000-total)} ₽. Сейчас доставка по тарифу СДЭК.`;
    return 'Доставка по тарифу СДЭК. Срок, стоимость и необходимость термокороба подтвердит менеджер.';
  }
  const api={MAX_QUANTITY,normalizeCart,cartSummary,filterProducts,shipping};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PurpurStore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
