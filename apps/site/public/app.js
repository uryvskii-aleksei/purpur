'use strict';
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const products=window.PRODUCTS;
const store=window.PurpurStore;
const state={category:'all',query:'',budget:'all',sort:'default',visibleCount:24};
let cart={};let toastTimer;let lastFocus;let photoFocus;
try{cart=store.normalizeCart(JSON.parse(localStorage.getItem('purpur-cart-v1')||'{}'),products)}catch{}
function persist(){try{localStorage.setItem('purpur-cart-v1',JSON.stringify(cart))}catch{}updateCount()}
function summary(){return store.cartSummary(cart,products)}
function updateCount(){const {count}=summary();$$('.cart-count').forEach(el=>el.textContent=count);$$('.cart-toggle').forEach(el=>el.setAttribute('aria-label',`Открыть корзину: ${count} шт.`))}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function openModal(id){if($(id).open)return;lastFocus=document.activeElement;$$('dialog[open]').forEach(d=>d.close());$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');$(id).showModal();document.body.classList.add('modal-open')}
function closeModal(d){d.close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');const focus=d.id==='photo-dialog'?photoFocus:lastFocus;if(focus?.isConnected)focus.focus({preventScroll:true})}
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target.closest('.close-dialog'))closeModal(d);if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal(d)}});d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open')})});
function syncFilters(){
  $$('.chip').forEach(el=>{const active=el.dataset.filter===state.category;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active))});
  $('#category-select').value=state.category;$('#search').value=state.query;$('#budget').value=state.budget;$('#sort').value=state.sort;
  $('#reset-filters').hidden=state.category==='all'&&!state.query&&state.budget==='all'&&state.sort==='default';
}
function renderProducts(resetPage=true){
  if(resetPage)state.visibleCount=24;
  syncFilters();const filtered=store.filterProducts(products,state);
  $('#result-count').textContent=`Показано ${Math.min(state.visibleCount,filtered.length)} из ${filtered.length}`;
  $('#load-more').hidden=filtered.length<=state.visibleCount;
  $('#load-more').textContent=`Показать ещё ${Math.min(24,filtered.length-state.visibleCount)}`;
  $('#product-grid').innerHTML=filtered.slice(0,state.visibleCount).map(p=>`<article class="product-card"><div class="product-image"><span class="product-tag">${esc(p.badge)}</span><button data-product="${p.id}" aria-label="Подробнее: ${esc(p.name)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="402" height="402" loading="lazy"></button></div><p class="product-category">${esc(p.categoryLabel)}</p><h3 class="product-title"><button data-product="${p.id}">${esc(p.title)}</button></h3><p class="product-description">${esc(p.description)}</p><div class="product-bottom"><div class="price">${money(p.price)}<span class="unit">${p.weight?`за ${esc(p.weight)} · ${esc(p.packLabel)}`:`Вес уточняется · ${esc(p.packLabel)}`}</span></div><button class="add-btn" ${p.canOrder!==false?`data-add="${p.id}" aria-label="В корзину: ${esc(p.name)}"`:`data-product="${p.id}" aria-label="Уточнить фасовку: ${esc(p.name)}"`}><svg><use href="${p.canOrder!==false?'#i-bag':'#i-search'}"/></svg></button></div></article>`).join('')||`<div class="empty-results"><h3>Пока ничего не нашлось</h3><p>Попробуйте другой вкус или увеличьте бюджет.</p><button class="btn outline" data-reset>Показать все сладости →</button></div>`;
}
function renderFeaturedGifts(){
  const gifts=products.filter(p=>p.giftAssortment);
  $('#featured-gifts').innerHTML=gifts.map(p=>`<article class="product-card gift-card"><div class="product-image"><button data-product="${p.id}" aria-label="Посмотреть подарочный набор «${esc(p.title)}»"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="402" height="402" loading="lazy"></button></div><p class="product-category">ВЫБЕРИТЕ ПЕТЕРБУРГСКИЙ СЮЖЕТ</p><h3 class="product-title"><button data-product="${p.id}">${esc(p.title)}</button></h3><p class="product-description">Ассорти из четырёх начинок.</p><div class="product-bottom"><div class="price">${money(p.price)}<span class="unit">${esc(p.weight)} · 4 вкуса${p.pieces?' · '+p.pieces+' конфет':''}</span></div><button class="add-btn" data-add="${p.id}" aria-label="В корзину: подарочный набор «${esc(p.title)}»"><svg><use href="#i-bag"/></svg></button></div><button class="gift-details-link" data-product="${p.id}">Рассмотреть подарок ↗</button></article>`).join('');
}
function resetFilters(){Object.assign(state,{category:'all',query:'',budget:'all',sort:'default'});renderProducts()}
function preset(category){Object.assign(state,{category,query:'',budget:'all',sort:'default'});renderProducts();$('#catalog').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
document.addEventListener('click',e=>{
  const category=e.target.closest('[data-filter]');if(category){state.category=category.dataset.filter;renderProducts()}
  const pre=e.target.closest('[data-preset]');if(pre){e.preventDefault();preset(pre.dataset.preset)}
  const p=e.target.closest('[data-product]');if(p){e.preventDefault();openProduct(Number(p.dataset.product));return}
  const photo=e.target.closest('[data-photo]');if(photo)openPhoto(Number(photo.dataset.photo));
  const add=e.target.closest('[data-add]');if(add)addToCart(Number(add.dataset.add),add);
  if(e.target.closest('[data-reset]'))resetFilters();
  if(e.target.closest('[data-quiz]'))openModal('#quiz-dialog');
});
$('#search').addEventListener('input',e=>{state.query=e.target.value;renderProducts()});
$('#budget').addEventListener('change',e=>{state.budget=e.target.value;renderProducts()});
$('#category-select').addEventListener('change',e=>{state.category=e.target.value;renderProducts()});
$('#load-more').addEventListener('click',()=>{state.visibleCount+=24;renderProducts(false)});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;renderProducts()});
$('#reset-filters').addEventListener('click',resetFilters);
$('#search-toggle').addEventListener('click',()=>{$('#catalog').scrollIntoView();$('#search').focus({preventScroll:true})});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!document.querySelector('dialog[open]')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#catalog').scrollIntoView();$('#search').focus({preventScroll:true})}});
$('#menu-toggle').addEventListener('click',()=>{const nav=$('#mobile-nav');nav.hidden=!nav.hidden;$('#menu-toggle').setAttribute('aria-expanded',String(!nav.hidden))});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false')}));
$('#quiz-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);state.category=data.get('occasion');state.budget=data.get('budget');state.query='';state.sort='default';renderProducts();closeModal($('#quiz-dialog'));$('#catalog').scrollIntoView();toast('Подобрали сладости под ваши пожелания')});
function openProduct(id){const p=products.find(x=>x.id===id);if(!p)return;
  const gift=p.giftAssortment;
  const variants=gift?`<div class="detail-variants"><p>То же ассорти — другое оформление:</p><div class="variant-list">${products.filter(x=>x.giftAssortment).map(x=>`<button class="variant-button" data-product="${x.id}" aria-label="Оформление «${esc(x.title)}»" aria-pressed="${x.id===id}"><img src="${esc(x.image)}" alt="" width="60" height="60"><span>${esc(x.title)}</span></button>`).join('')}</div></div>`:'';
  $('#product-detail').innerHTML=`<div class="detail-layout"><div class="detail-image"><button data-photo="${p.id}" aria-label="Увеличить фото «${esc(p.title)}»"><img src="${esc(p.largeImage||p.image)}" alt="${esc(p.name)}" width="1280" height="1280"><span class="zoom-hint"><svg><use href="#i-search"/></svg> Увеличить фото</span></button>${variants}</div><div class="detail-info"><p class="eyebrow">${esc(p.categoryLabel)}</p><h2>${esc(p.title)}</h2><p>${gift?'Петербургский сюжет на подарочной коробке. Внутри — ассорти из марципана, ореховой халвы, ягодного и кофейного трюфеля.':esc(p.description)}</p>${gift?`<div class="detail-gift-facts"><span>${esc(p.weight)}</span><span>4 вкуса</span>${p.pieces?`<span>${p.pieces} конфет</span>`:''}<span>Подарочная коробка</span></div>`:''}<div class="detail-price">${money(p.price)} <small>${p.weight?`/ ${esc(p.weight)}`:'· вес уточняется'}</small></div><p class="detail-stock">${p.canOrder===false?'Цена из каталога фабрики; фасовку нужно уточнить':`Цена за ${gift?'один подарочный набор':'одну фасовку'}`}<br>Наличие уточняется при подтверждении заявки</p>${p.canOrder!==false?`<button class="btn primary" data-add="${p.id}" aria-live="polite">${gift?'Добавить подарок в корзину':'Добавить в корзину'} <span>+</span></button>`:`<p class="package-note">На сайте фабрики не указан вес этой фасовки. Уточните его перед заказом.</p><a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener">Уточнить фасовку ↗</a>`}<p class="delivery-mini">Нужен к определённой дате? Укажите её в заявке.<br>Подготовка — 3 рабочих дня, затем доставка СДЭК. Срок и стоимость подтвердит менеджер.</p>${gift?'<p class="gift-note">С орехами, молочными ингредиентами и алкогольными начинками. Пожалуйста, учитывайте это при выборе подарка.</p>':''}${['Содержит','Состав','Характеристики','Условия хранения'].filter(k=>p.fields[k]).map(k=>`<details ${k==='Содержит'?'open':''}><summary>${esc(k)} <span>+</span></summary><p>${esc(p.fields[k])}</p></details>`).join('')}<a class="detail-source" href="${esc(p.url)}" target="_blank" rel="noopener">Товар в действующем магазине ↗</a></div></div>`;
  openModal('#product-dialog');
}
function openPhoto(id){const p=products.find(p=>p.id===id);if(!p)return;photoFocus=document.activeElement;$('#photo-title').textContent=p.title;$('#photo-image').src=p.largeImage||p.image;$('#photo-image').alt=p.name;$('#photo-dialog').showModal();document.body.classList.add('modal-open')}
function addToCart(id,button){const p=products.find(p=>p.id===id);if(!p||p.canOrder===false)return;const q=cart[id]||0;if(q>=store.MAX_QUANTITY){toast('Для большой партии свяжитесь с отделом опта');return}cart[id]=q+1;persist();toast(`${p.title} — в корзине`);if(button?.closest('#product-dialog')){button.innerHTML=`В корзине: ${cart[id]} <span>✓</span>`}}
$$('.cart-toggle').forEach(btn=>btn.addEventListener('click',()=>{renderCart();openModal('#cart-dialog')}));
function renderCart(){const {items,total}=summary();
  if(!items.length){$('#cart-content').innerHTML=`<div class="cart-empty"><svg><use href="#i-bag"/></svg><h2>Здесь будет что-то вкусное.</h2><p>Выберите подарок или любимый вкус в каталоге.</p><button class="btn primary" data-cart-catalog>Перейти в каталог →</button></div>`;return}
  $('#cart-content').innerHTML=items.map(p=>`<div class="cart-item"><img src="${esc(p.image)}" alt="" width="65" height="75"><div><div class="cart-item-title">${esc(p.title)}</div><small>${esc(p.weight)} · ${esc(p.packLabel)}</small><div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Уменьшить количество: ${esc(p.title)}">−</button><span aria-live="polite">${p.quantity}</span><button data-qty="${p.id}" data-delta="1" aria-label="Увеличить количество: ${esc(p.title)}" ${p.quantity>=store.MAX_QUANTITY?'disabled':''}>+</button></div></div><div><div class="price">${money(p.subtotal)}</div><button class="remove-item" data-remove="${p.id}" aria-label="Удалить: ${esc(p.title)}">Удалить</button></div></div>`).join('')+`<div class="cart-total"><span>Товары</span><span>${money(total)}</span></div><div class="shipping-hint"><strong>Доставка рассчитывается отдельно.</strong><br>${store.shipping(total,'spb')}<br>Подготовка к отправке — 3 рабочих дня.</div><button class="btn primary cart-checkout" data-checkout>Оформить заявку <span>→</span></button><p class="form-note">Заявка подтверждается менеджером. Онлайн-оплата в этой версии не подключена.</p>`;
}
$('#cart-content').addEventListener('click',e=>{
  const qty=e.target.closest('[data-qty]');if(qty){const id=qty.dataset.qty;const n=(cart[id]||0)+Number(qty.dataset.delta);if(n<=0)delete cart[id];else cart[id]=Math.min(store.MAX_QUANTITY,n);persist();renderCart();$(`[data-qty="${id}"][data-delta="${qty.dataset.delta}"]`)?.focus();return}
  const rem=e.target.closest('[data-remove]');if(rem){delete cart[rem.dataset.remove];persist();renderCart();return}
  if(e.target.closest('[data-cart-catalog]')){closeModal($('#cart-dialog'));$('#catalog').scrollIntoView()}
  if(e.target.closest('[data-checkout]'))renderCheckout();
  if(e.target.closest('[data-back]'))renderCart();
});
function renderCheckout(){const {total}=summary();$('#cart-content').innerHTML=`<button class="checkout-back" data-back>← Вернуться к корзине</button><form id="checkout-form"><div class="field-row"><label class="field">Ваше имя *<input name="name" required maxlength="100" autocomplete="name"></label><label class="field">Телефон *<input name="phone" type="tel" required minlength="10" maxlength="22" autocomplete="tel" placeholder="+7 (___) ___-__-__"></label></div><label class="field">E-mail<input name="email" type="email" maxlength="150" autocomplete="email"></label><div class="field-row"><label class="field">Получение<select name="delivery"><option value="spb">ПВЗ СДЭК в Санкт-Петербурге</option><option value="region">СДЭК в другом городе России</option><option value="pickup">Самовывоз с фабрики</option></select></label><label class="field">Город / ПВЗ<input name="city" required maxlength="200" autocomplete="address-level2" placeholder="Санкт-Петербург"></label></div><label class="field">Пожелания и желаемая дата<textarea name="notes" maxlength="1000" rows="2" placeholder="Если подарок нужен к определённой дате, напишите здесь"></textarea></label><div class="shipping-hint" id="checkout-shipping">${store.shipping(total,'spb')}</div><div class="cart-total"><span>Товары</span><span>${money(total)}</span></div><p class="form-note">Итоговую сумму с доставкой и наличие подтвердит менеджер. Подготовка — 3 рабочих дня, затем доставка. Здесь можно скачать заявку или открыть письмо для самостоятельной отправки на info@purpur.spb.ru.</p><label class="consent"><input type="checkbox" required><span>Я понимаю, что заявка ещё не отправлена и её нужно передать фабрике самостоятельно.</span></label><div class="form-actions"><button class="btn primary" type="submit" name="action" value="download">Скачать заявку <span>↓</span></button><button class="btn outline" type="submit" name="action" value="email">Открыть письмо <span>↗</span></button></div><div id="order-result" aria-live="polite"></div></form>`;
  const form=$('#checkout-form');
  form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
  form.elements.delivery.addEventListener('change',()=>{const pickup=form.elements.delivery.value==='pickup';form.elements.city.required=!pickup;$('#checkout-shipping').textContent=store.shipping(total,form.elements.delivery.value)});
  form.addEventListener('submit',e=>{e.preventDefault();const phone=form.elements.phone.value.replace(/\D/g,'');if(phone.length<10||phone.length>15){form.elements.phone.setCustomValidity('Введите телефон: от 10 до 15 цифр');form.elements.phone.reportValidity();return}const data=new FormData(form);const text=orderText(data);const isMail=e.submitter?.value==='email';if(isMail)openMail('Заявка на заказ — Пурпур',text);else downloadText('purpur-zayavka.txt',text);$('#order-result').innerHTML=`<div class="checkout-success">${isMail?'Открываем почтовую программу. Проверьте письмо и нажмите «Отправить» в ней. Если программа не открылась, скачайте заявку.':'Заявка подготовлена для скачивания. Передайте файл на info@purpur.spb.ru или свяжитесь с фабрикой по телефону +7 (812) 911-59-36.'}<br><strong>Заказ пока не подтверждён.</strong></div><details><summary>Посмотреть текст заявки <span>+</span></summary><pre class="order-preview">${esc(text)}</pre></details>`});
  form.elements.name.focus();
}
function orderText(data){const {items,total}=summary();const method={spb:'ПВЗ СДЭК по Санкт-Петербургу',region:'СДЭК по России',pickup:'Самовывоз с фабрики'}[data.get('delivery')];return ['ЗАЯВКА НА ЗАКАЗ — ПУРПУР','Требует подтверждения наличия и окончательной стоимости менеджером.','',...items.map(p=>`${p.title} | ${p.weight} | ${p.quantity} шт. × ${money(p.price)} = ${money(p.subtotal)}\n${p.url}`),'',`Товары: ${money(total)}`,`Получение: ${method}`,store.shipping(total,data.get('delivery')),`Город / ПВЗ: ${data.get('city')||'Самовывоз'}`,'',`Имя: ${data.get('name')}`,`Телефон: ${data.get('phone')}`,`E-mail: ${data.get('email')||'Не указан'}`,`Пожелания: ${data.get('notes')||'Нет'}`,'','Цены и фасовки взяты с purpur.spb.ru 26.10.2026. Сборка — 3 рабочих дня.'].join('\n')}
function downloadText(name,text){const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function openMail(subject,body){const a=document.createElement('a');a.href='mailto:info@purpur.spb.ru?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.body.append(a);a.click();a.remove()}
$('#wholesale-open').addEventListener('click',()=>openModal('#wholesale-dialog'));
$('#wholesale-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const body=`Здравствуйте!\n\nИнтересует: ${d.get('type')}\nКомпания: ${d.get('company')}\nКонтакт: ${d.get('name')}\nE-mail: ${d.get('email')}\n\nОбъём, сроки и пожелания:\n${d.get('details')||'Прошу направить условия сотрудничества и актуальный прайс.'}`;openMail('Сотрудничество с Пурпур — '+d.get('company'),body);const out=$('#wholesale-fallback');out.hidden=false;out.innerHTML=`<p class="form-note">Письмо подготовлено. Отправьте его в почтовой программе. Если она не открылась, скачайте текст и направьте на info@purpur.spb.ru.</p><button class="btn outline" type="button" id="wholesale-download">Скачать текст письма ↓</button>`;$('#wholesale-download').onclick=()=>downloadText('purpur-partnerstvo.txt',body)});
renderFeaturedGifts();renderProducts();updateCount();

// A decorative silent background and a separate, user-controlled full film.
const factoryVideo=$('#factory-video');
const filmPlayer=$('#film-player');
const filmStart=$('#film-start');
const heroVideo=$('#hero-video');
const heroVideoToggle=$('#hero-video-toggle');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let heroMotionAllowed=!motionPreference.matches;
let heroUserPaused=false;
let heroVisible=false;
let heroPlayPending=false;
function heroShouldPlay(){return heroVisible&&!document.hidden&&heroMotionAllowed&&!heroUserPaused&&factoryVideo.paused}
function updateHeroVideoControl(){
  const playing=!heroVideo.paused&&!heroVideo.ended;
  $('[data-video-symbol]').textContent=playing?'Ⅱ':'▶';
  $('[data-video-label]').textContent=playing?'Пауза видео':'Включить видео';
  heroVideoToggle.setAttribute('aria-label',playing?'Приостановить фоновое видео':'Воспроизвести фоновое видео без звука');
}
async function syncHeroVideo(){
  if(!heroShouldPlay()){heroVideo.pause();return}
  if(!heroVideo.paused||heroPlayPending)return;
  heroPlayPending=true;
  try{await heroVideo.play();if(!heroShouldPlay())heroVideo.pause()}
  catch(error){/* Autoplay can be blocked: the poster and manual play remain available. */}
  finally{heroPlayPending=false;updateHeroVideoControl()}
}
heroVideoToggle.hidden=false;
heroVideoToggle.addEventListener('click',()=>{
  if(!heroVideo.paused){heroUserPaused=true;heroVideo.pause()}
  else{heroUserPaused=false;heroMotionAllowed=true;syncHeroVideo()}
});
heroVideo.addEventListener('play',updateHeroVideoControl);
heroVideo.addEventListener('pause',updateHeroVideoControl);
heroVideo.addEventListener('error',()=>{heroVideoToggle.hidden=true});
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.08;syncHeroVideo()},{threshold:.08,rootMargin:`-${Math.ceil($('.header').getBoundingClientRect().height)}px 0px 0px 0px`}).observe($('.video-hero'));
document.addEventListener('visibilitychange',syncHeroVideo);
motionPreference.addEventListener('change',()=>{heroMotionAllowed=!motionPreference.matches;syncHeroVideo()});
updateHeroVideoControl();
async function playFactoryFilm(scrollToFilm=false){
  if(scrollToFilm)$('#film').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  $('#film-error').hidden=true;
  try{if(factoryVideo.ended)factoryVideo.currentTime=0;await factoryVideo.play();filmPlayer.dataset.playing='true'}
  catch(error){if(error.name==='AbortError')return;filmPlayer.dataset.playing='false';$('#film-error').hidden=false}
}
filmStart.hidden=false;
filmStart.addEventListener('click',()=>playFactoryFilm());
$$('[data-play-film]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();playFactoryFilm(true)}));
factoryVideo.addEventListener('play',()=>{filmPlayer.dataset.playing='true';$('#film-error').hidden=true;syncHeroVideo()});
factoryVideo.addEventListener('pause',syncHeroVideo);
factoryVideo.addEventListener('ended',()=>{filmPlayer.dataset.playing='false'});
factoryVideo.addEventListener('error',()=>{filmPlayer.dataset.playing='false';$('#film-error').hidden=false});
