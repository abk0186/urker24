// Уркер 24 — «📨 Обращение активисту района» (#/appeal). Обращение НЕ публикуется на сайте:
// попадает в админку «Сообщения» (reports, type='appeal', 24_resident_appeals.sql), оттуда — в WhatsApp активисту.
// Имя и должность активиста — config.js → activist. Подключается после app.js (использует window.URKER_APP).
(function(){
'use strict';
const A=window.URKER_APP;if(!A)return;
const {esc,SB,$}=A;const t=k=>A.t(k);
const AC=Object.assign({wa:'77016441239',phone:'+7 701 644 1239',short_ru:'Карашаш Султановна',short_ru_dat:'Карашаш Султановне',name_ru:'Карашаш Султановна Ташенова',
 title_ru:'активист района Уркер',short_kz:'Карашаш Султановна',name_kz:'Карашаш Султановна Ташенова',name_kz_dat:'Карашаш Султановна Ташеноваға',title_kz:'Үркер ауданының белсендісі'},(window.URKER_CONFIG||{}).activist||{});
const TOPICS=[['power','⚡'],['gas','🔥'],['water','💧'],['road','🛣'],['trash','🗑'],['improve','🌳'],['other','📌']];
A.addDict({
 apTitle:'Обращение',apMenu:'Обращение активисту района',apMenuD:'Свет, газ, вода, дороги, мусор — передадим активисту',
 apLinkT:'Есть проблема в районе?',apLinkS:`Напишите обращение — передадим ${AC.short_ru_dat}`,
 apWhoT:`${AC.name_ru}, ${AC.title_ru}`,
 apWho:`Ваше обращение получит ${AC.short_ru} — ${AC.title_ru}. Она решает вопросы жителей и работает с акиматом и службами, а сайт помогает ей собирать обращения.`,
 apPriv:'Обращение не публикуется на сайте. Его видят только администрация сайта и активист района.',
 apTopic:'Тема',apTopics:{power:'Свет',gas:'Газ и отопление',water:'Вода',road:'Дороги',trash:'Мусор',improve:'Благоустройство',other:'Другое'},
 apArea:'Адрес или место',apAreaPh:'Улица, дом или ориентир',apText:'Что случилось',apTextPh:'Опишите проблему: что, где и с какого времени',
 apPhone:'Ваш телефон (WhatsApp)',apPhoneNote:'Чтобы сообщить вам, что обращение передано',apSend:'Отправить обращение',
 apErrArea:'Укажите адрес или место',apErrText:'Опишите проблему (хотя бы несколько слов)',apErrPhone:'Укажите номер телефона: 8XXXXXXXXXX',
 apOkT:'Обращение принято',apOk:`Мы передадим его ${AC.short_ru_dat} и напишем вам в WhatsApp, когда передадим.`,apMore:'Написать ещё одно',apHome:'На главную'
},{
 apTitle:'Өтініш',apMenu:'Аудан белсендісіне өтініш',apMenuD:'Жарық, газ, су, жол, қоқыс — белсендіге жеткіземіз',
 apLinkT:'Ауданда мәселе бар ма?',apLinkS:`Өтініш жазыңыз — ${AC.name_kz_dat} жеткіземіз`,
 apWhoT:`${AC.name_kz}, ${AC.title_kz}`,
 apWho:`Өтінішіңізді ${AC.title_kz} ${AC.short_kz} алады. Ол тұрғындардың мәселелерін шешеді, әкімдікпен және қызметтермен жұмыс істейді, ал сайт оған өтініштерді жинауға көмектеседі.`,
 apPriv:'Өтініш сайтта жарияланбайды. Оны тек сайт әкімшілігі мен аудан белсендісі көреді.',
 apTopic:'Тақырып',apTopics:{power:'Жарық',gas:'Газ және жылу',water:'Су',road:'Жолдар',trash:'Қоқыс',improve:'Абаттандыру',other:'Басқа'},
 apArea:'Мекенжай немесе орын',apAreaPh:'Көше, үй немесе бағдар',apText:'Не болды',apTextPh:'Мәселені сипаттаңыз: не, қай жерде және қашаннан бері',
 apPhone:'Телефоныңыз (WhatsApp)',apPhoneNote:'Өтініш жеткізілгенін хабарлау үшін',apSend:'Өтінішті жіберу',
 apErrArea:'Мекенжайды немесе орынды көрсетіңіз',apErrText:'Мәселені сипаттаңыз (бірнеше сөз болса да)',apErrPhone:'Телефон нөмірін көрсетіңіз: 8XXXXXXXXXX',
 apOkT:'Өтініш қабылданды',apOk:`Біз оны ${AC.name_kz_dat} жеткіземіз және жеткізгенде WhatsApp арқылы хабарлаймыз.`,apMore:'Тағы біреуін жазу',apHome:'Басты бетке'
});
const normPhone=v=>{let d=String(v||'').replace(/\D/g,'');if(d.length===10&&d[0]==='7')d='8'+d;if(d.length===11&&d[0]==='7')d='8'+d.slice(1);return /^87\d{9}$/.test(d)?d:''};
const link=()=>`<a class="ap-link" href="#/appeal"><span aria-hidden="true">📨</span><span><b>${esc(t('apLinkT'))}</b><small>${esc(t('apLinkS'))}</small></span></a>`;
function view(){
 A.setMeta(t('apMenu')+' — Уркер 24',t('apMenuD'));
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="history.length>1?history.back():location.hash='#/'" aria-label="${t('back')}">←</button><h1>📨 ${esc(t('apTitle'))}</h1></div>
 <div class="ap-who"><span class="ap-i" aria-hidden="true">🙋‍♀️</span><div><b>${esc(t('apWhoT'))}</b><p>${esc(t('apWho'))}</p><small>🔒 ${esc(t('apPriv'))}</small></div></div>
 <form id="apf" novalidate style="position:relative">${A.hp()}
  <div class="f"><label>${esc(t('apTopic'))}</label><div class="chips wrap">${TOPICS.map(([k,e],i)=>`<label class="radio"><input type="radio" name="at" value="${k}" ${i===0?'checked':''}> ${e} ${esc(t('apTopics')[k])}</label>`).join('')}</div></div>
  <div class="f"><label for="ap1">${esc(t('apArea'))}</label><input id="ap1" maxlength="300" autocomplete="street-address" placeholder="${esc(t('apAreaPh'))}"></div>
  <div class="f"><label for="ap2">${esc(t('apText'))}</label><textarea id="ap2" maxlength="1500" rows="4" placeholder="${esc(t('apTextPh'))}"></textarea></div>
  <div class="f"><label for="ap3">${esc(t('apPhone'))}</label><input id="ap3" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="8 7XX XXX XX XX"><small class="hint" style="display:block;color:var(--muted);font-size:13px;margin-top:4px">${esc(t('apPhoneNote'))}</small></div>
  <button class="btn primary" type="submit">📨 ${esc(t('apSend'))}</button></form>`;
 $('#apf').onsubmit=ev=>{ev.preventDefault();const f=ev.target;
  const area=$('#ap1').value.trim(),text=$('#ap2').value.trim(),ph=normPhone($('#ap3').value);
  if(area.length<3){A.toast(t('apErrArea'));$('#ap1').focus();return}
  if(text.length<5){A.toast(t('apErrText'));$('#ap2').focus();return}
  if(!ph){A.toast(t('apErrPhone'));$('#ap3').focus();return}
  if(A.isOffline()||!SB.enabled){A.toast(t('offlineForm'));return}
  A.sending(f.querySelector('[type=submit]'),async()=>{
   try{await SB.rpc('submit_appeal',{p_topic:(f.querySelector('[name=at]:checked')||{}).value||'other',p_area:area,p_text:text,p_contact:ph,p_device_id:A.deviceId(),p_hp:$('#hpf').value});
    A.app.innerHTML=`<div class="ap-ok"><div>✅</div><h2>${esc(t('apOkT'))}</h2><p>${esc(t('apOk'))}</p><p>🔒 ${esc(t('apPriv'))}</p>
     <a class="btn primary" href="#/">${esc(t('apHome'))}</a> <p><a class="ap-more" href="#/appeal" id="apMore">${esc(t('apMore'))}</a></p></div>`;$('#apMore').onclick=e=>{e.preventDefault();view()};window.scrollTo(0,0)}
   catch(e){A.toast(A.errMsg(e))}})};
}
window.URKER_AP={view,link,AC};
})();
