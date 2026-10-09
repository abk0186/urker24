// «Добавить Уркер 24 на экран телефона»: service worker, кнопка установки (Android/Chrome), инструкция для iPhone, подсказка для WhatsApp/Instagram.
(function(){
'use strict';
const A=window.URKER_APP; if(!A)return;
const t=k=>A.t(k), esc=A.esc;
A.addDict({pwaT:'📲 Добавить Уркер 24 на экран телефона',pwaS:'Открывается в один тап, как приложение',pwaBtn:'Добавить',pwaMenu:'Добавить на экран телефона',pwaClose:'Скрыть',
 pwaIosT:'Как добавить на iPhone',pwaIos1:'Нажмите кнопку «Поделиться» внизу экрана',pwaIos2:'Выберите «На экран „Домой“» и нажмите «Добавить»',
 pwaAndT:'Как добавить на Android',pwaAnd1:'Нажмите меню ⋮ в правом верхнем углу',pwaAnd2:'Выберите «Добавить на главный экран» или «Установить приложение»',
 pwaInappT:'Сначала откройте сайт в браузере',pwaInapp1:'Нажмите ⋮ или ••• в углу экрана',pwaInapp2:'Выберите «Открыть в браузере» (Chrome или Safari)',pwaInapp3:'Там нажмите «Добавить на экран телефона»',
 pwaDone:'Уркер 24 уже на экране телефона 👍',pwaOk:'Понятно',pwaPage:'Добавить на экран телефона',pwaPageS:'Иконка Уркер 24 появится рядом с другими приложениями — сайт будет открываться в один тап.',pwaInstall:'📲 Установить'},
{pwaT:'📲 Телефон экранына қосу',pwaS:'Үркер 24 қосымша сияқты бір рет басып ашылады',pwaBtn:'Қосу',pwaMenu:'Телефон экранына қосу',pwaClose:'Жасыру',
 pwaIosT:'iPhone-ға қалай қосуға болады',pwaIos1:'Экранның төменгі жағындағы «Бөлісу» батырмасын басыңыз',pwaIos2:'«Басты экранға» тармағын таңдап, «Қосу» басыңыз',
 pwaAndT:'Android-қа қалай қосуға болады',pwaAnd1:'Жоғарғы оң жақтағы ⋮ мәзірін басыңыз',pwaAnd2:'«Басты экранға қосу» немесе «Қолданбаны орнату» тармағын таңдаңыз',
 pwaInappT:'Алдымен сайтты браузерде ашыңыз',pwaInapp1:'Экран бұрышындағы ⋮ немесе ••• басыңыз',pwaInapp2:'«Браузерде ашу» тармағын таңдаңыз (Chrome немесе Safari)',pwaInapp3:'Сонда «Телефон экранына қосу» басыңыз',
 pwaDone:'Үркер 24 телефон экранында тұр 👍',pwaOk:'Түсінікті',pwaPage:'Телефон экранына қосу',pwaPageS:'Үркер 24 белгішесі басқа қолданбалардың қасында пайда болады — сайт бір рет басып ашылады.',pwaInstall:'📲 Орнату'});
const UA=navigator.userAgent||'';
const IOS=/iPhone|iPad|iPod/i.test(UA)||(/Macintosh/.test(UA)&&navigator.maxTouchPoints>1);
const INAPP=/WhatsApp|Instagram|FBAN|FBAV|FB_IAB|FBIOS|Line\//i.test(UA);
const MOBILE=/Android|iPhone|iPad|iPod|Mobile/i.test(UA)||IOS;
const standalone=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
const DK='urker_pwa_dismissed';
const dismissed=()=>{const v=+localStorage.getItem(DK)||0;return v&&Date.now()-v<14*864e5};
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;refresh()});
window.addEventListener('appinstalled',()=>{deferred=null;track('installed');refresh()});
function track(m){try{A.track&&A.track('install',{p_path:'/install/'+m})}catch(e){}}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'))
 window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
function canShow(){return !standalone()&&!dismissed()&&(deferred||MOBILE)}
function banner(){if(!canShow())return '';
 return `<div class="pwa-b" id="pwab"><span class="pwa-i">📲</span><span class="pwa-t"><b>${esc(t('pwaT').replace(/^📲\s*/,''))}</b><small>${t('pwaS')}</small></span>
  <button class="btn pwa-go" data-pwa="go">${t('pwaBtn')}</button><button class="pwa-x" data-pwa="x" aria-label="${t('pwaClose')}">✕</button></div>`}
function refresh(){const b=document.getElementById('pwab');if(b&&!canShow())b.remove();
 if(!b&&canShow()){const h=document.querySelector('#homeBody');if(h)h.insertAdjacentHTML('afterbegin',banner())}
 const p=document.getElementById('pwapage');if(p)view()}
function steps(kind){
 const S={ios:[t('pwaIosT'),[['<span class="pwa-k">⬆️</span>',t('pwaIos1')],['<span class="pwa-k">➕</span>',t('pwaIos2')]]],
  and:[t('pwaAndT'),[['<span class="pwa-k">⋮</span>',t('pwaAnd1')],['<span class="pwa-k">📲</span>',t('pwaAnd2')]]],
  inapp:[t('pwaInappT'),[['<span class="pwa-k">⋮</span>',t('pwaInapp1')],['<span class="pwa-k">🌐</span>',t('pwaInapp2')],['<span class="pwa-k">📲</span>',t('pwaInapp3')]]]}[kind];
 return `<h2 style="margin:6px 0 12px">${esc(S[0])}</h2><ol class="pwa-steps">${S[1].map(([i,x],n)=>`<li>${i}<span><b>${n+1}.</b> ${esc(x)}</span></li>`).join('')}</ol>
  ${kind==='ios'?`<div class="pwa-ill" aria-hidden="true"><div class="pwa-phone"><div class="pwa-bar"><span>⬆️</span></div></div><span class="pwa-arr">→</span><div class="pwa-menu"><div>📋 …</div><div class="on">➕ ${lang()==='kz'?'Басты экранға':'На экран «Домой»'}</div><div>🔖 …</div></div></div>`:''}`}
const lang=()=>A.lang();
function modal(kind){const m=document.getElementById('modal');
 m.innerHTML=`<div class="sheet pwa-sheet">${steps(kind)}<button class="btn primary" style="width:100%;margin-top:14px" id="pwaok">${t('pwaOk')}</button></div>`;
 m.hidden=false;document.getElementById('pwaok').onclick=()=>{m.hidden=true};m.onclick=ev=>{if(ev.target===m)m.hidden=true}}
async function go(){
 if(standalone()){A.toast(t('pwaDone'));return}
 if(INAPP){track('inapp');modal('inapp');return}
 if(deferred){const e=deferred;deferred=null;try{await e.prompt();const r=await e.userChoice;if(r&&r.outcome==='accepted')track('android')}catch(err){}refresh();return}
 if(IOS){track('ios');modal('ios');return}
 track('guide');modal('and');
}
function view(){A.setMeta(t('pwaPage')+' — Уркер 24','');
 const kind=INAPP?'inapp':(IOS?'ios':'and');
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/menu'" aria-label="${t('back')}">←</button><h1>📲 ${t('pwaPage')}</h1></div>
 <div id="pwapage" class="pwa-page"><img src="/icon-192.png" width="72" height="72" alt="" class="pwa-icon"><p>${t('pwaPageS')}</p>
 ${standalone()?`<p class="demo-note live">${t('pwaDone')}</p>`:(deferred&&!INAPP?`<button class="btn primary" data-pwa="go">${t('pwaInstall')}</button>`:steps(kind))}</div>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-pwa]');if(!b)return;ev.preventDefault();
 if(b.dataset.pwa==='x'){localStorage.setItem(DK,String(Date.now()));const x=document.getElementById('pwab');if(x)x.remove();return}
 go()});
window.URKER_PWA={banner,view,open:go,standalone};
})();
