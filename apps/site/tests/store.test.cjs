const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {normalizeCart,cartSummary,filterProducts,shipping}=require('../public/store.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../public/products.js'),'utf8'),context);
const products=JSON.parse(JSON.stringify(context.window.PRODUCTS));
test('Untrusted saved cart cannot add unknown products, fractions or unlimited quantities',()=>{
  assert.deepEqual(normalizeCart({'1':2,'2':-1,'3':2.5,'4':100000,'5':'3','999':20},products),{'1':2,'4':99});
  assert.deepEqual(normalizeCart(null,products),{});
  assert.deepEqual(normalizeCart([1,2,3],products),{});
});
test('Mixed retail and kilogram packages retain the exact source price and unit',()=>{
  const s=cartSummary({'1':2,'7':1},products);
  assert.equal(s.total,1210*2+7447);assert.equal(s.count,3);
  assert.equal(s.items.find(x=>x.id===1).weight,'95 г');
  assert.equal(s.items.find(x=>x.id===7).weight,'1000 г');
});
test('Gift quiz and price constraints apply together without changing source data',()=>{
  const before=JSON.stringify(products);
  const gifts=filterProducts(products,{category:'gifts',budget:'1500'});
  assert.ok(gifts.length>3);
  assert.ok(gifts.every(p=>p.price<=1500&&(p.category==='gifts'||p.categories.includes('gifts'))));
  const found=filterProducts(products,{query:'малина',category:'sugarfree',sort:'asc'});
  assert.ok(found.length>=2);
  assert.ok(found.some(p=>p.id===4)&&found.some(p=>p.id===6));
  assert.ok(found.every((p,i)=>i===0||found[i-1].price<=p.price));
  assert.equal(JSON.stringify(products),before);
});
test('Cyrillic search handles е/ё and ingredient search',()=>{
  assert.ok(filterProducts(products,{query:'ТЕМНОМ'}).length>0);
  assert.ok(filterProducts(products,{query:'топинамбура'}).some(p=>p.id===4));
  assert.equal(filterProducts(products,{query:'несуществующий вкус'}).length,0);
});
test('Free shipping is limited to Saint Petersburg PVZ at the exact threshold',()=>{
  assert.match(shipping(10000,'spb'),/^Бесплатно/);
  assert.match(shipping(9999,'spb'),/1 ₽/);
  assert.doesNotMatch(shipping(20000,'region'),/^Бесплатно/);
  assert.match(shipping(100,'pickup'),/Самовывоз/);
});
test('Every published product has a source, explicit package, price and existing image',()=>{
  const audit=require('../catalog-audit.json');
  assert.equal(products.length,221);
  assert.equal(products.length,audit.publishedCount);
  assert.deepEqual(products.map(p=>p.url).sort(),audit.products.map(p=>p.url).sort());
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
  assert.equal(new Set(products.map(p=>p.url)).size,products.length);
  for(const p of products){if(p.canOrder!==false)assert.match(p.weight,/\d\s*(г|кг)(?:$|\s)/u);else assert.equal(p.weight,null);assert.ok(p.price>0&&Number.isInteger(p.price));assert.match(p.url,/^https:\/\/purpur\.spb\.ru\/magazin\/product\//);assert.ok(fs.existsSync(require('node:path').join(__dirname,'../public',p.image)));}
});

test('Products without a verified weight remain visible and cannot enter an order',()=>{
  const p=products.find(p=>p.canOrder===false);
  assert.ok(p);
  assert.ok(filterProducts(products,{query:p.name}).some(x=>x.id===p.id));
  assert.deepEqual(normalizeCart({[p.id]:2},products),{});
  assert.equal(cartSummary({[p.id]:2},products).total,0);
});

test('A boxed truffle can be found both by product type and gift purpose',()=>{
  const p=products.find(p=>p.category==='truffles'&&p.categories.includes('gifts'));
  assert.ok(p);
  for(const category of ['truffles','gifts'])assert.ok(filterProducts(products,{category}).some(x=>x.id===p.id));
});
