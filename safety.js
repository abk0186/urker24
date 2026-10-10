// Уркер 24 — «⚠️ Пожаловаться» для жителей и «🙈 Скрыть» для админа прямо на сайте.
// Подключается после app.js и listings.js. Ничего не публикует: жалоба уходит админу (вкладка «Сообщения»),
// объявление/отзыв с жалобами из 3 разных сетей скрывается автоматически до решения админа (см. 14_content_safety.sql).
(function(){
'use strict';
const A=window.URKER_APP;if(!A)return;
const {t,esc,$}=A;
A.addDict({
 cmpL:'⚠️ Пожаловаться',cmpCard:'⚠️ Пожаловаться на карточку',cmpT:'Пожаловаться',cmpWhat:{listing:'Объявление',news:'Новость',spec:'Карточка',review:'Отзыв'},
 cmpWhy:'Что не так?',cmpR:{offensive:'Оскорбления, провокация, непристойное',spam:'Спам или реклама',fraud:'Мошенничество',wrong:'Неверные данные, номер не работает',other:'Другое'},
 cmpTxt:'Комментарий (по желанию)',cmpSend:'Отправить жалобу',cmpCancel:'Отмена',cmpPick:'Выберите причину',cmpSent:'Спасибо! Жалоба отправлена администратору.',
 cmpNote:'Жалобу увидит только администратор сайта. Ваши данные не передаются автору.',cmpOffline:'Сейчас нет связи с сервером. Попробуйте позже.',
 admHide:'🙈 Скрыть',admHideQ:'Скрыть с сайта? Вернуть можно в админке.',admHidden:'Скрыто. Вернуть можно в админке.',admErr:'Не удалось скрыть: ',admTag:'админ',modTag:'модератор'
},{
 cmpL:'⚠️ Шағымдану',cmpCard:'⚠️ Карточкаға шағымдану',cmpT:'Шағымдану',cmpWhat:{listing:'Хабарландыру',news:'Жаңалық',spec:'Карточка',review:'Пікір'},
 cmpWhy:'Не дұрыс емес?',cmpR:{offensive:'Қорлау, арандату, әдепсіз мазмұн',spam:'Спам немесе жарнама',fraud:'Алаяқтық',wrong:'Деректер қате, нөмір істемейді',other:'Басқа'},
 cmpTxt:'Пікір (қаласаңыз)',cmpSend:'Шағым жіберу',cmpCancel:'Болдырмау',cmpPick:'Себебін таңдаңыз',cmpSent:'Рақмет! Шағым әкімшіге жіберілді.',
 cmpNote:'Шағымды тек сайт әкімшісі көреді. Деректеріңіз авторға берілмейді.',cmpOffline:'Қазір сервермен байланыс жоқ. Кейінірек көріңіз.',
 admHide:'🙈 Жасыру',admHideQ:'Сайттан жасыру керек пе? Әкімші бетінде қайтаруға болады.',admHidden:'Жасырылды. Әкімші бетінде қайтаруға болады.',admErr:'Жасыру мүмкін болмады: ',admTag:'әкімші',modTag:'модератор'
});
const css=document.createElement('style');
css.textContent=`.cmpl-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}
.cmpl-l{background:none;border:0;padding:8px 2px;color:#8a6d5a;font:inherit;font-size:14px;text-decoration:underline;cursor:pointer;min-height:36px}
.rev{position:relative}.rev .cmpl-r{float:right;background:none;border:0;color:#a08875;font-size:13px;padding:2px 4px 6px 10px;cursor:pointer;min-height:28px}
.adm-hide{background:#1e3a5f;color:#fff;border:0;border-radius:10px;padding:7px 12px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;min-height:36px}
.card .adm-hide{margin-top:8px}.rev .adm-hide{float:right;padding:4px 9px;min-height:28px;font-size:12.5px;margin-left:6px}
.sheet.cmpl h2{margin:4px 0 6px;font-size:20px}.sheet.cmpl .what{color:#7a6a5c;font-size:14.5px;margin:0 0 10px;overflow-wrap:anywhere}
.sheet.cmpl fieldset{border:0;padding:0;margin:0 0 8px}.sheet.cmpl legend{font-weight:700;margin-bottom:6px}
.sheet.cmpl label.r{display:flex;gap:10px;align-items:center;padding:9px 4px;border-bottom:1px solid #f0e6dc;font-size:15.5px;cursor:pointer;min-height:40px}
.sheet.cmpl label.r input{width:20px;height:20px;flex:none}.sheet.cmpl textarea{width:100%;min-height:64px;margin:6px 0 0;box-sizing:border-box}
.sheet.cmpl .note{color:#7a6a5c;font-size:13.5px;margin:8px 0}.sheet.cmpl .btns{display:flex;gap:8px;margin-top:10px}.sheet.cmpl .btns .btn{flex:1}`;
document.head.appendChild(css);

// ---------- жалоба ----------
let lastSpec=null;  // карточка, у которой открыли окно отзывов
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-review]');if(b)lastSpec=+b.dataset.review},true);
let box=null;
function openComplaint(kind,id,title){
 if(!box){box=document.createElement('div');box.className='modal';box.id='cmpl';box.hidden=true;document.body.appendChild(box)}
 const R=t('cmpR');
 box.innerHTML=`<div class="sheet cmpl" role="dialog" aria-modal="true" aria-labelledby="cmplT"><h2 id="cmplT">${t('cmpT')}</h2>
  <p class="what">${esc(t('cmpWhat')[kind]||'')}${title?': «'+esc(String(title).slice(0,120))+'»':''}</p>
  <form id="cmplF" style="position:relative">${A.hp()}<fieldset><legend>${t('cmpWhy')}</legend>
  ${Object.keys(R).map(k=>`<label class="r"><input type="radio" name="cr" value="${k}"> <span>${esc(R[k])}</span></label>`).join('')}</fieldset>
  <label for="cmplX" style="font-weight:600;font-size:14.5px">${t('cmpTxt')}</label><textarea id="cmplX" class="rv-in" maxlength="300"></textarea>
  <p class="note">${t('cmpNote')}</p>
  <div class="btns"><button type="button" class="btn" id="cmplC" style="background:#eee;color:#333">${t('cmpCancel')}</button><button class="btn primary" id="cmplS">${t('cmpSend')}</button></div></form></div>`;
 box.hidden=false;
 const close=()=>{box.hidden=true;box.innerHTML=''};
 $('#cmplC').onclick=close;box.onclick=e=>{if(e.target===box)close()};
 $('#cmplF').onsubmit=e=>{e.preventDefault();const r=(box.querySelector('[name=cr]:checked')||{}).value;if(!r){A.toast(t('cmpPick'));return}
  if(!A.isLive()){A.toast(t('cmpOffline'));return}
  A.sending($('#cmplS'),async()=>{try{await A.SB.rpc('submit_complaint',{p_kind:kind,p_id:+id,p_reason:r,p_text:$('#cmplX').value,p_device_id:A.deviceId(),p_hp:box.querySelector('#hpf').value},12000);
   close();A.toast(t('cmpSent'))}catch(err){A.toast(A.errMsg(err))}})};
}
// ---------- админ: «Скрыть» прямо на сайте (только если на этом телефоне выполнен вход в админку) ----------
let ADM=null,MODR=false,admChecked=false;  // MODR: moderator (18_moderator) - may hide listings/reviews/news, not specialist cards
async function checkAdmin(){
 if(admChecked)return ADM;admChecked=true;
 try{if(!localStorage.getItem('urker_admin_session_v1')||!window.SBCreate)return null;
  const S=window.SBCreate({auth:true});if(!S.enabled||!S.session())return null;
  const ok=await S.rpc('is_admin',{},8000);if(ok===true){ADM=S;decorate();return ADM}
  const role=await S.rpc('my_role',{},8000).catch(()=>null);if(role==='moderator'){ADM=S;MODR=true;decorate()}}catch(e){ADM=null;MODR=false}
 return ADM}
const HIDE={spec:['specialists','hidden'],listing:['listings','rejected'],news:['news','draft'],review:['reviews','rejected']};
async function admHide(kind,id,btn){
 if(!ADM||(MODR&&kind==='spec')||!confirm(t('admHideQ')))return;const [tb,st]=HIDE[kind];btn.disabled=true;
 try{if(MODR){const x=await ADM.rpc('mod_hide_target',{p_kind:kind,p_id:+id},8000);if(x!=='hidden')throw new Error(x||'0 rows');A.toast(t('admHidden'));setTimeout(()=>location.reload(),900);return}
  const r=await ADM.update(tb,'id=eq.'+(+id),{status:st});if(!Array.isArray(r)||!r.length)throw new Error('0 rows');
  A.toast(t('admHidden'));setTimeout(()=>location.reload(),900)}catch(e){btn.disabled=false;A.toast(t('admErr')+(e&&e.message||''))}}
const admBtn=(kind,id)=>ADM&&!(MODR&&kind==='spec')?`<button type="button" class="adm-hide" data-ah="${kind}" data-aid="${+id}" title="${esc(t(MODR?'modTag':'admTag'))}">${t('admHide')}</button>`:'';

// ---------- вставка кнопок ----------
function decorate(){
 const h=location.hash||'';
 // объявление жителя
 let m=/^#\/item\/(\d+)/.exec(h),art=document.querySelector('#app article.litem');
 if(m&&art&&!art.querySelector('.cmpl-row')){const ti=(art.querySelector('h1')||{}).textContent||'';
  art.insertAdjacentHTML('beforeend',`<div class="cmpl-row"><button type="button" class="cmpl-l" data-ck="listing" data-cid="${+m[1]}" data-ct="${esc(ti)}">${t('cmpL')}</button>${admBtn('listing',m[1])}</div>`)}
 // новость
 m=/^#\/news\/(\d+)/.exec(h);art=document.querySelector('#app article.article:not(.litem)');
 if(m&&art&&!art.querySelector('.cmpl-row')){const ti=(art.querySelector('h1')||{}).textContent||'';
  art.insertAdjacentHTML('beforeend',`<div class="cmpl-row"><button type="button" class="cmpl-l" data-ck="news" data-cid="${+m[1]}" data-ct="${esc(ti)}">${t('cmpL')}</button>${admBtn('news',m[1])}</div>`)}
 // окно отзывов карточки
 const rl=document.querySelector('#modal #rvlist');
 if(rl&&lastSpec&&!document.querySelector('#modal .cmpl-row')){const ti=((document.querySelector('#modal h2')||{}).textContent||'').replace(/^[^:]*:\s*/,'');
  rl.insertAdjacentHTML('afterend',`<div class="cmpl-row"><button type="button" class="cmpl-l" data-ck="spec" data-cid="${lastSpec}" data-ct="${esc(ti)}">${t('cmpCard')}</button>${admBtn('spec',lastSpec)}</div>`)}
 document.querySelectorAll('#modal .rev[data-rid]:not([data-cmpl])').forEach(r=>{r.dataset.cmpl='1';const id=+r.dataset.rid;
  r.insertAdjacentHTML('afterbegin',`<button type="button" class="cmpl-r" data-ck="review" data-cid="${id}" data-ct="${esc(r.textContent.trim().slice(0,80))}" aria-label="${esc(t('cmpL'))}" title="${esc(t('cmpL'))}">⚠️</button>${admBtn('review',id)}`)});
 // админ: «Скрыть» на каждой карточке
 if(ADM&&!MODR)document.querySelectorAll('#app article.card[id^="e"]:not([data-ahd])').forEach(c=>{c.dataset.ahd="1";const id=+c.id.slice(1);if(id>0)c.insertAdjacentHTML('beforeend',admBtn('spec',id))});
}
document.addEventListener('click',ev=>{
 const c=ev.target.closest('[data-ck]');if(c){ev.preventDefault();openComplaint(c.dataset.ck,c.dataset.cid,c.dataset.ct);return}
 const a=ev.target.closest('[data-ah]');if(a&&a.tagName==='BUTTON'){ev.preventDefault();ev.stopPropagation();admHide(a.dataset.ah,a.dataset.aid,a)}
},true);
let q=0;const soon=()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;decorate()})};
new MutationObserver(soon).observe(document.getElementById('app'),{childList:true,subtree:true});
const md=document.getElementById('modal');if(md)new MutationObserver(soon).observe(md,{childList:true,subtree:true});
window.addEventListener('hashchange',soon);window.addEventListener('urker-lang',()=>{document.querySelectorAll('.cmpl-row,.adm-hide,.cmpl-r').forEach(e=>e.remove());document.querySelectorAll('[data-cmpl],[data-ahd]').forEach(e=>{delete e.dataset.cmpl;delete e.dataset.ahd});soon()});
soon();checkAdmin();
})();
