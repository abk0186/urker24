// Уркер 24 — «📞 Полезные телефоны / Пайдалы телефондар» (таблица phones, 21_growth.sql): экстренные службы, аварийные,
// ОСИ/КСК, участковый, акимат, ЦОН, поликлиника, школа, детсады. Список ведут админ и модератор в админке.
// Подключается после app.js (использует window.URKER_APP).
(function(){
'use strict';
const A=window.URKER_APP;if(!A)return;
const {esc,SB}=A;const t=k=>A.t(k);
const GR=[['activist','⭐'],['emergency','🚨'],['utility','🔧'],['police','👮'],['akimat','🏛'],['osi','🏘'],['con','📄'],['clinic','🏥'],['school','🏫'],['kindergarten','🧸'],['other','📌']];
A.addDict({
 phTitle:'Полезные телефоны',phShort:'Телефоны',phMenuD:'Экстренные службы, аварийные, участковый, акимат',phHome:'112 · 104 · 109 · участковый',
 phIntro:'Нажмите на номер, чтобы позвонить. Номера взяты с официальных сайтов служб или проверены администрацией сайта.',
 phGr:{activist:'Активист района',emergency:'Экстренные службы',utility:'Коммунальные и аварийные службы',police:'Участковый',akimat:'Акимат',osi:'ОСИ / КСК',con:'ЦОН и госуслуги',clinic:'Поликлиника',school:'Школа',kindergarten:'Детские сады',other:'Другое'},
 phEmpty:'Список телефонов скоро появится',phCall:'Позвонить',phAlso:'Ещё',phFound:'Полезные телефоны',phWaAct:n=>`Здравствуйте, ${n}! Ваш номер взял на сайте urker24.kz`,phWaGreet:'Здравствуйте! Нашёл ваш номер на сайте https://urker24.kz в разделе «Полезные телефоны».',
 menuAlerts:'Отключения',menuAlertsD:'Свет, вода, газ, ремонт — где и когда',annTitle:'Отключения и важное',annDoneH:'Завершённые',navAnn:'Отключения',annFound:'Отключения и важное',annEmpty:'Сейчас отключений и важных объявлений нет',liveRepNote:'Сообщение уйдёт на проверку и после подтверждения появится в разделе «Отключения и важное».',
 outT:'Отключения',outNow:'сейчас',outSoon:'скоро',outNone:'Сейчас нет',outN:n=>`Сейчас: ${n}`,outSoonN:n=>`Скоро: ${n}`,outAll:'Все →',outHead:'Отключения и работы'
},{
 phTitle:'Пайдалы телефондар',phShort:'Телефондар',phMenuD:'Шұғыл қызметтер, апаттық қызметтер, учаскелік, әкімдік',phHome:'112 · 104 · 109 · учаскелік',
 phIntro:'Қоңырау шалу үшін нөмірді басыңыз. Нөмірлер қызметтердің ресми сайттарынан алынған немесе сайт әкімшілігі тексерген.',
 phGr:{activist:'Аудан белсендісі',emergency:'Шұғыл қызметтер',utility:'Коммуналдық және апаттық қызметтер',police:'Учаскелік инспектор',akimat:'Әкімдік',osi:'ПИК / ТҮБ',con:'ХҚКО және мемлекеттік қызметтер',clinic:'Емхана',school:'Мектеп',kindergarten:'Балабақшалар',other:'Басқа'},
 phEmpty:'Телефондар тізімі жақында шығады',phCall:'Қоңырау шалу',phAlso:'Тағы',phFound:'Пайдалы телефондар',phWaAct:n=>`Сәлеметсіз бе, ${n}! Нөміріңізді urker24.kz сайтынан алдым`,phWaGreet:'Сәлеметсіз бе! Нөміріңізді https://urker24.kz сайтындағы «Пайдалы телефондар» бөлімінен таптым.',
 menuAlerts:'Өшірулер',menuAlertsD:'Жарық, су, газ, жөндеу — қай жерде және қашан',annTitle:'Өшірулер және маңызды',annDoneH:'Аяқталғандар',navAnn:'Өшірулер',annFound:'Өшірулер және маңызды',annEmpty:'Қазір өшірулер мен маңызды хабарландыру жоқ',liveRepNote:'Хабарлама тексеруге жіберіледі және расталғаннан кейін «Өшірулер және маңызды» бөлімінде жарияланады.',
 outT:'Өшірулер',outNow:'қазір',outSoon:'жақында',outNone:'Қазір жоқ',outN:n=>`Қазір: ${n}`,outSoonN:n=>`Жақында: ${n}`,outAll:'Барлығы →',outHead:'Өшірулер мен жұмыстар'
});
const COLS='id,grp,title_ru,title_kz,note_ru,note_kz,phone,phone2,wa,sort_order';
let PH=[],LOADED=false;
async function load(){if(!SB.enabled)return;try{const r=await SB.get(`phones?select=${COLS}&order=sort_order.asc,id.asc`,8000);PH=Array.isArray(r)?r:[];LOADED=true}catch(e){PH=[]}}
const L=(r,k)=>A.lang()==='kz'?(r[k+'_kz']||r[k+'_ru']):(r[k+'_ru']||r[k+'_kz']);
// 112 → «112»; 87172620438 → «8 7172 62 04 38»; 87012681101 → «8 701 268 11 01»; 88000807777 → «8 800 080 77 77»
const fmt=p=>{p=String(p||'');if(p.length!==11)return p;if(/^87172/.test(p))return `8 7172 ${p.slice(5,7)} ${p.slice(7,9)} ${p.slice(9)}`;return `8 ${p.slice(1,4)} ${p.slice(4,7)} ${p.slice(7,9)} ${p.slice(9)}`};
const tel=p=>{p=String(p||'');return p.length===11&&p[0]==='8'&&!/^8800/.test(p)?'+7'+p.slice(1):p};
// activist: personal greeting by first name + patronymic (first two words of title_ru)
const actName=r=>String(r.title_ru||'').split(/\s+[—–-]\s+/)[0].trim().split(/\s+/).slice(0,2).join(' ');
const waHref=r=>{const n=r.grp==='activist'?actName(r):'';return n?`https://wa.me/${r.wa}?text=${encodeURIComponent(t('phWaAct')(n))}`:`https://api.whatsapp.com/send?phone=${r.wa}&text=${encodeURIComponent(t('phWaGreet'))}`};
function row(r){const wa=/^7\d{10}$/.test(r.wa||'')?r.wa:'';const note=L(r,'note');
 return `<article class="phr" id="ph${r.id}"><div class="phr-b"><b class="phr-t">${esc(L(r,'title'))}</b>${note?`<small class="phr-n">${esc(note)}</small>`:''}
  <a class="phr-num" href="tel:${esc(tel(r.phone))}" aria-label="${esc(t('phCall'))}: ${esc(fmt(r.phone))}">${esc(fmt(r.phone))}</a>${r.phone2?`<a class="phr-num2" href="tel:${esc(tel(r.phone2))}">${esc(t('phAlso'))}: ${esc(fmt(r.phone2))}</a>`:''}</div>
  <div class="phr-a"><a class="btn call" href="tel:${esc(tel(r.phone))}" aria-label="${esc(t('phCall'))}: ${esc(fmt(r.phone))}">📞 <span>${esc(t('phCall'))}</span></a>${wa?`<a class="btn wa" href="${esc(waHref(r))}" target="_blank" rel="noopener" aria-label="WhatsApp: ${esc(L(r,'title'))}">${A.WA_SVG}<span>WhatsApp</span></a>`:''}</div></article>`}
function view(){
 A.setMeta(t('phTitle')+' — Уркер 24',t('phMenuD'));
 const groups=GR.map(([g,e])=>[g,e,PH.filter(r=>r.grp===g)]).filter(x=>x[2].length);
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>📞 ${esc(t('phTitle'))}</h1></div>
 <p class="ph-intro">${esc(t('phIntro'))}</p>
 ${groups.length?groups.map(([g,e,l])=>`<section class="phg"><h2>${e} ${esc(t('phGr')[g])}</h2>${l.map(row).join('')}${g==='activist'&&window.URKER_AP?URKER_AP.link():''}</section>`).join('')
   :`<div class="ann-empty">${SB.enabled&&!LOADED&&!A.isOffline()?`⏳ <b>${t('loading')}</b>`:`📞 <b>${esc(t('phEmpty'))}</b>`}</div>`}`;
}
const KW={activist:'активист старший район вопросы акимат белсенді аудан',emergency:'экстренные экстренная служба спасение спасатели мчс пожар пожарная полиция скорая газ шұғыл құтқару өрт жедел жәрдем',
 utility:'аварийная авария коммунальные свет электричество электроэнергия вода водоканал канализация газ отопление тепло уборка улиц снег мусор апаттық коммуналдық жарық электр су кәріз жылу тазалау',
 police:'участковый полиция инспектор учаскелік',akimat:'акимат аким жалоба 109 әкімдік',osi:'оси кск дом управляющая пик түб',con:'цон госуслуги egov справка хқко мемлекеттік',
 clinic:'поликлиника больница врач емхана дәрігер',school:'школа мектеп',kindergarten:'детсад детский сад садик балабақша',other:''};
function searchHtml(q){const qs=A.norm(q).split(' ').filter(w=>w.length>=3||/^\d{3,}$/.test(w));if(!qs.length||!PH.length)return {n:0,html:''};
 const tok=x=>A.norm(x).split(' ').filter(Boolean),sc=[];
 for(const r of PH){const tt=tok([r.title_ru,r.title_kz,r.phone,r.phone2].join(' ')),all=tt.concat(tok([r.note_ru,r.note_kz,KW[r.grp]||'',A.t('phGr')[r.grp]||''].join(' ')));
  if(qs.every(x=>A.tokScore(x,all)>0))sc.push([qs.every(x=>A.tokScore(x,tt)>0)?2:1,r])}
 const hits=sc.sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
 return {n:hits.length,html:hits.length?`<div class="sugg-l">📞 ${esc(t('phFound'))}: ${hits.length}</div><div class="phl">${hits.slice(0,3).map(row).join('')}</div>`:''}}
function route(h){if(/^#\/phones/.test(h)){view();return true}return false}
// статистика: нажатия «Позвонить» / WhatsApp / номер в строке (событие 'phone', 23_phone_clicks.sql; до SQL сервер просто отвечает 'ignored')
document.addEventListener('click',ev=>{const a=ev.target.closest('article.phr a[href]');if(!a)return;const r=a.closest('article.phr'),id=+String(r.id||'').replace(/^ph/,'');
 if(id&&A.track)A.track('phone',{p_specialist_id:id,p_channel:/^tel:/.test(a.getAttribute('href')||'')?'call':'wa'})});
window.URKER_PH={load,view,route,searchHtml,count:()=>PH.length,loaded:()=>LOADED};
})();
