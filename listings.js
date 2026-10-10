// Объявления жителей: «Барахолка», «Объявления», «Потеряшки». Подключается после app.js (использует window.URKER_APP).
(function(){
'use strict';
const A=window.URKER_APP; if(!A)return;
const {esc,$,SB}=A; const t=k=>A.t(k);
// Выключатель раздела: config.js → features.listings (до запуска 06_listings.sql — false)
const ON=!!(((window.URKER_CONFIG||{}).features||{}).listings);
if(ON){const nv=document.querySelector('nav.bottom');if(nv)nv.innerHTML=[['#/','home','🏠','navHome',''],['#/bazar','bazar','🛍','navBazar',''],['#/post','post','➕','navPost',' class="post"'],['#/news','news','📰','navNews',''],['#/menu','menu','☰','navMenu','']].map(([h,k,e,i,c])=>`<a href="${h}" data-nav="${k}"${c}><span>${e}</span><b data-i18n="${i}">${A.t(i)||''}</b></a>`).join('')}
A.addDict({
 navBazar:'Барахолка',navPost:'Подать',navMenu:'Меню',waGreetL:'Здравствуйте! Нашёл ваше объявление «{t}» на сайте {u}',
 lSec:{market:'Барахолка',ads:'Объявления',lost:'Потеряшки'},
 lSecD:{market:'Продам, куплю, отдам даром',ads:'Аренда, работа, услуги, попутчики',lost:'Потерял или нашёл'},
 lKind:{sell:'Продам',buy:'Куплю',free:'Отдам даром',rent_offer:'Сдам',rent_seek:'Сниму',job_offer:'Вакансия',job_seek:'Ищу работу',gig:'Подработка',service:'Услуги частных лиц',ride:'Попутчики',other:'Разное',lost:'Потерял',found:'Нашёл'},
 lCat:{market:{kids:'Детское',clothes:'Одежда',tech:'Техника',furniture:'Мебель',home:'Для дома и дачи',auto:'Авто и запчасти',animals:'Животные и скот',build:'Стройматериалы',other:'Прочее'},
  ads:{house:'Дом',flat:'Квартира',room:'Комната',garage:'Гараж',equipment:'Техника',other:'Другое'},
  lost:{animals:'Животные',docs:'Документы',keys:'Ключи',things:'Вещи',other:'Другое'}},
 lPrice:{free:'Даром',negotiable:'Договорная',none:''},lAll:'Все',lAllCats:'Все категории',
 lEmpty:'Пока объявлений нет',lEmptyS:'Подайте первое — это бесплатно. После проверки оно появится здесь.',lPostBtn:'➕ Подать объявление',
 lFresh:'Свежие объявления жителей',lFreshAll:'Все →',lFreshEmpty:'Пока объявлений нет — подайте первое',
 lClosed:{market:'Продано',ads:'Неактуально',lost:'Нашлось'},lViews:n=>`👁 ${n}`,lPosted:'Опубликовано',lWhere:'Где',lWhen:'Когда',lShare:'Поделиться в WhatsApp',
 lHighlight:'Выделено',lNotFound:'Объявление не найдено или снято',lExpires:'Активно до',
 pTitle:'Подать объявление',pChoose:'Где разместить?',pKind:'Тип',pCat:'Категория',pTitleF:'Заголовок',pTitlePh:'Например: детская коляска, почти новая',
 pBody:'Описание',pPriceMode:'Цена',pPriceFixed:'Цена, ₸',pFixedR:'Указать цену',pNeg:'Договорная',pFree:'Даром',pNone:'Без цены',pPlace:'Где (улица, дом — по желанию)',pPlaceLost:'Где потеряли / нашли',
 pDate:'Когда',pPhone:'Телефон для связи (обязательно)',pWa:'На этот номер можно писать в WhatsApp',pPhotos:'Фото (до 5)',pSend:'Отправить',
 pNoteLive:'Объявление проверит модератор, обычно в течение дня. Срок показа — 30 дней (потеряшки — 60), можно продлить.',
 pNoteDemo:'Сейчас нет связи с сервером. Попробуйте позже.',
 pErrTitle:'Напишите заголовок (не короче 3 символов)',pErrPhone:'Укажите номер телефона: 8XXXXXXXXXX',pErrPrice:'Укажите цену или выберите «Договорная»',pTooMany:'Можно добавить не больше 5 фото',
 pUploading:'Загружаем фото…',pDone:'Готово!',pDonePending:'Объявление отправлено на проверку. После одобрения оно появится на сайте.',pDoneLive:'Объявление опубликовано.',
 pSecret:'Ваша секретная ссылка для изменения и удаления. Сохраните её — без неё управлять объявлением нельзя:',pCopy:'📋 Скопировать ссылку',pCopied:'Ссылка скопирована',
 pSaveWa:'💬 Отправить ссылку себе в WhatsApp',pView:'Открыть объявление',pMy:'Мои объявления',pMyEmpty:'Здесь появятся объявления, поданные с этого телефона.',
 mStatus:{pending:'На проверке',approved:'Опубликовано',rejected:'Отклонено',closed:'Закрыто',deleted:'Удалено'},mExpires:'Показывается до',mEdit:'✏️ Изменить',mClose:{market:'✅ Продано',ads:'✅ Неактуально',lost:'✅ Нашлось'},
 mRenew:'🔄 Продлить',mDelete:'🗑 Удалить',mConfirmDel:'Удалить объявление безвозвратно?',mDeleted:'Объявление удалено',mSaved:'Сохранено',mSavedPending:'Сохранено — отправлено на повторную проверку',
 mRenewed:'Продлено до',mBadLink:'Ссылка недействительна или объявление удалено',mManage:'Управление объявлением',
 pSavedMy:'Ссылка также сохранена в «Мои объявления» на этом телефоне.',pOpenMy:'🗂 Мои объявления',mExpired:'Срок показа истёк — нажмите «Продлить»',
 mGone:'Ссылка недействительна или объявление удалено',mForget:'Убрать из списка',mMyNote:'Список хранится только на этом телефоне. Чтобы управлять объявлением с другого телефона, откройте свою секретную ссылку.',mOnlyYou:'Изменять, закрывать и удалять объявление можете только вы — по этой ссылке.',
 menuTitle:'Все разделы',menuMasters:'Мастера и услуги',menuMastersD:'Каталог специалистов района',menuAlerts:'Важно',menuAlertsD:'Отключения, ремонт, перекрытия',menuNews:'Новости района',menuNewsD:'Что происходит в Уркере',
 menuAddBiz:'Добавить мастера или бизнес',menuLang:'Язык',homeSections:'Разделы',lFound:'Объявления жителей',
 lErr:{bad_token:'Ссылка недействительна',invalid_phone:'Проверьте номер телефона',bad_price:'Проверьте цену',bad_title:'Слишком короткий заголовок',bad_kind:'Выберите тип и категорию',too_many_photos:'Не больше 5 фото',locked:'Объявление отклонено модератором'}
},{
 navBazar:'Барахолка',navPost:'Қосу',navMenu:'Мәзір',waGreetL:'Сәлеметсіз бе! Сіздің «{t}» хабарландыруыңызды urker24.kz сайтынан таптым: {u}',
 lSec:{market:'Барахолка',ads:'Хабарландырулар',lost:'Жоғалғандар'},
 lSecD:{market:'Сатамын, сатып аламын, тегін беремін',ads:'Жалға беру, жұмыс, қызмет, жолсерік',lost:'Жоғалттым немесе таптым'},
 lKind:{sell:'Сатамын',buy:'Сатып аламын',free:'Тегін беремін',rent_offer:'Жалға беремін',rent_seek:'Жалға аламын',job_offer:'Бос жұмыс орны',job_seek:'Жұмыс іздеймін',gig:'Қосымша жұмыс',service:'Жеке қызметтер',ride:'Жолсеріктер',other:'Әртүрлі',lost:'Жоғалттым',found:'Таптым'},
 lCat:{market:{kids:'Балаларға',clothes:'Киім',tech:'Техника',furniture:'Жиһаз',home:'Үй мен саяжайға',auto:'Көлік және бөлшектер',animals:'Жануарлар мен мал',build:'Құрылыс материалдары',other:'Басқа'},
  ads:{house:'Үй',flat:'Пәтер',room:'Бөлме',garage:'Гараж',equipment:'Техника',other:'Басқа'},
  lost:{animals:'Жануарлар',docs:'Құжаттар',keys:'Кілттер',things:'Заттар',other:'Басқа'}},
 lPrice:{free:'Тегін',negotiable:'Келісімді',none:''},lAll:'Барлығы',lAllCats:'Барлық санат',
 lEmpty:'Әзірге хабарландыру жоқ',lEmptyS:'Біріншісін беріңіз — бұл тегін. Тексеруден кейін осында шығады.',lPostBtn:'➕ Хабарландыру беру',
 lFresh:'Тұрғындардың жаңа хабарландырулары',lFreshAll:'Барлығы →',lFreshEmpty:'Әзірге хабарландыру жоқ — біріншісін беріңіз',
 lClosed:{market:'Сатылды',ads:'Өзекті емес',lost:'Табылды'},lViews:n=>`👁 ${n}`,lPosted:'Жарияланды',lWhere:'Қайда',lWhen:'Қашан',lShare:'WhatsApp-та бөлісу',
 lHighlight:'Ерекшеленген',lNotFound:'Хабарландыру табылмады немесе алынып тасталды',lExpires:'Белсенді мерзімі',
 pTitle:'Хабарландыру беру',pChoose:'Қай бөлімге?',pKind:'Түрі',pCat:'Санаты',pTitleF:'Тақырыбы',pTitlePh:'Мысалы: балалар арбасы, жаңа дерлік',
 pBody:'Сипаттамасы',pPriceMode:'Бағасы',pPriceFixed:'Бағасы, ₸',pFixedR:'Бағасын көрсету',pNeg:'Келісімді',pFree:'Тегін',pNone:'Бағасыз',pPlace:'Қайда (көше, үй — міндетті емес)',pPlaceLost:'Қайда жоғалттыңыз / таптыңыз',
 pDate:'Қашан',pPhone:'Байланыс телефоны (міндетті)',pWa:'Бұл нөмірге WhatsApp-та жазуға болады',pPhotos:'Фото (5-ке дейін)',pSend:'Жіберу',
 pNoteLive:'Хабарландыруды модератор тексереді, әдетте бір күн ішінде. Көрсету мерзімі — 30 күн (жоғалғандар — 60), ұзартуға болады.',
 pNoteDemo:'Қазір сервермен байланыс жоқ. Кейінірек көріңіз.',
 pErrTitle:'Тақырыпты жазыңыз (кемінде 3 таңба)',pErrPhone:'Телефон нөмірін көрсетіңіз: 8XXXXXXXXXX',pErrPrice:'Бағаны көрсетіңіз немесе «Келісімді» таңдаңыз',pTooMany:'5 фотодан артық қосуға болмайды',
 pUploading:'Фото жүктелуде…',pDone:'Дайын!',pDonePending:'Хабарландыру тексеруге жіберілді. Мақұлданғаннан кейін сайтта шығады.',pDoneLive:'Хабарландыру жарияланды.',
 pSecret:'Өзгерту және жою үшін құпия сілтемеңіз. Оны сақтап қойыңыз — онсыз хабарландыруды басқару мүмкін емес:',pCopy:'📋 Сілтемені көшіру',pCopied:'Сілтеме көшірілді',
 pSaveWa:'💬 Сілтемені өзіме WhatsApp-қа жіберу',pView:'Хабарландыруды ашу',pMy:'Менің хабарландыруларым',pMyEmpty:'Осы телефоннан берілген хабарландырулар осында шығады.',
 mStatus:{pending:'Тексеруде',approved:'Жарияланған',rejected:'Қабылданбады',closed:'Жабылды',deleted:'Жойылды'},mExpires:'Көрсетіледі',mEdit:'✏️ Өзгерту',mClose:{market:'✅ Сатылды',ads:'✅ Өзекті емес',lost:'✅ Табылды'},
 mRenew:'🔄 Ұзарту',mDelete:'🗑 Жою',mConfirmDel:'Хабарландыруды біржола жою керек пе?',mDeleted:'Хабарландыру жойылды',mSaved:'Сақталды',mSavedPending:'Сақталды — қайта тексеруге жіберілді',
 mRenewed:'Ұзартылды:',mBadLink:'Сілтеме жарамсыз немесе хабарландыру жойылған',mManage:'Хабарландыруды басқару',
 pSavedMy:'Сілтеме осы телефондағы «Менің хабарландыруларым» бөлімінде де сақталды.',pOpenMy:'🗂 Менің хабарландыруларым',mExpired:'Көрсету мерзімі бітті — «Ұзарту» басыңыз',
 mGone:'Сілтеме жарамсыз немесе хабарландыру жойылған',mForget:'Тізімнен алып тастау',mMyNote:'Тізім тек осы телефонда сақталады. Хабарландыруды басқа телефоннан басқару үшін құпия сілтемеңізді ашыңыз.',mOnlyYou:'Хабарландыруды осы сілтеме арқылы тек сіз өзгерте, жаба және жоя аласыз.',
 menuTitle:'Барлық бөлімдер',menuMasters:'Шеберлер мен қызметтер',menuMastersD:'Аудан мамандарының каталогы',menuAlerts:'Маңызды',menuAlertsD:'Өшірулер, жөндеу, жол жабылуы',menuNews:'Аудан жаңалықтары',menuNewsD:'Үркерде не болып жатыр',
 menuAddBiz:'Шебер немесе бизнес қосу',menuLang:'Тіл',homeSections:'Бөлімдер',lFound:'Тұрғындардың хабарландырулары',
 lErr:{bad_token:'Сілтеме жарамсыз',invalid_phone:'Телефон нөмірін тексеріңіз',bad_price:'Бағаны тексеріңіз',bad_title:'Тақырып тым қысқа',bad_kind:'Түрі мен санатын таңдаңыз',too_many_photos:'5 фотодан артық емес',locked:'Хабарландыруды модератор қабылдамады'}
});
const SECT={market:{e:'🛍',kinds:['sell','buy','free'],cats:['kids','clothes','tech','furniture','home','auto','animals','build','other']},
 ads:{e:'📋',kinds:['rent_offer','rent_seek','job_offer','job_seek','gig','service','ride','other'],cats:['house','flat','room','garage','equipment','other']},
 lost:{e:'🐾',kinds:['lost','found'],cats:['animals','docs','keys','things','other']}};
const ROUTE={market:'bazar',ads:'ads',lost:'lost'}, BYROUTE={bazar:'market',ads:'ads',lost:'lost'};
const RENT=k=>k==='rent_offer'||k==='rent_seek';
const COLS='id,section,kind,category,title,body,price,price_mode,place,event_date,phone,has_wa,photos,status,closed_at,views,highlighted,published_at,sort_at,expires_at,created_at';
let LST=[]; const MYK='urker_my_listings';
const my=()=>{try{return JSON.parse(localStorage.getItem(MYK))||[]}catch(e){return[]}};
const saveMy=a=>localStorage.setItem(MYK,JSON.stringify(a.slice(0,50)));
const photoUrl=p=>p&&p.path?SB.publicUrl('listings',p.path):(p&&p.url)||'';
const catLabel=(l)=>(t('lCat')[l.section]||{})[l.category]||'';
const fmtPrice=l=>l.price_mode==='fixed'&&l.price!=null?Number(l.price).toLocaleString('ru-RU').replace(/,/g,' ')+' ₸':(t('lPrice')[l.price_mode]||'');
const fmtDate=iso=>{if(!iso)return '';const d=new Date(new Date(iso).getTime()+5*3600e3);return `${d.getUTCDate()} ${A.MONTHS[A.lang()][d.getUTCMonth()]}`};
const fmtPhone=p=>p&&p.length===11?`8 ${p.slice(1,4)} ${p.slice(4,7)} ${p.slice(7,9)} ${p.slice(9)}`:p;
const visible=()=>LST.filter(l=>new Date(l.expires_at).getTime()>Date.now());
async function load(){if(!ON||!SB.enabled)return;try{const r=await SB.get(`listings?select=${COLS}&order=sort_at.desc&limit=500`,6000);LST=Array.isArray(r)?r:[]}catch(e){LST=[]}}
function lcard(l,compact){const ph=(l.photos||[])[0];const closed=l.status==='closed';const pr=fmtPrice(l);
 return `<a class="lcard ${compact?'mini':''} ${l.highlighted?'hl':''} ${closed?'closed':''}" href="#/item/${l.id}">
  <div class="lc-img" ${ph?`style="background-image:url('${esc(photoUrl(ph))}')"`:''}>${ph?'':`<span>${SECT[l.section].e}</span>`}${closed?`<em>${t('lClosed')[l.section]}</em>`:''}${l.views>0?`<span class="lc-vw" aria-label="${A.t('viewsA')}: ${l.views}">${t('lViews')(l.views)}</span>`:''}</div>
  <div class="lc-b"><div class="lc-k">${esc(t('lKind')[l.kind]||'')}${catLabel(l)&&l.category!=='other'?' · '+esc(catLabel(l)):''}</div><b class="lc-t">${esc(l.title)}</b>
  ${pr?`<div class="lc-p">${esc(pr)}</div>`:''}${compact?'':`<small>${esc([l.place,fmtDate(l.published_at||l.created_at)].filter(Boolean).join(' · '))}</small>`}</div></a>`}
function empty(sec){return `<div class="ann-empty">🗂 <b>${t('lEmpty')}</b><span>${t('lEmptyS')}</span><a href="#/post${sec?'/'+sec:''}" class="lnk">${t('lPostBtn')}</a></div>`}
let F={kind:'',cat:''},lastSec='';
function viewList(sec){
 if(sec!==lastSec){F={kind:'',cat:''};lastSec=sec}
 const S=SECT[sec];const showCats=sec!=='ads'||RENT(F.kind);
 const list=visible().filter(l=>l.section===sec&&(!F.kind||l.kind===F.kind)&&(!F.cat||l.category===F.cat));
 A.setMeta(t('lSec')[sec]+' — Уркер 24',t('lSecD')[sec]);
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>${S.e} ${t('lSec')[sec]}</h1></div>
 <div class="chips">${['',...S.kinds].map(k=>`<button class="${F.kind===k?'on':''}" data-lk="${k}">${k?esc(t('lKind')[k]):t('lAll')}</button>`).join('')}</div>
 ${showCats?`<div class="chips">${['',...S.cats].map(c=>`<button class="${F.cat===c?'on':''}" data-lc="${c}">${c?esc(t('lCat')[sec][c]):t('lAllCats')}</button>`).join('')}</div>`:''}
 <a class="btn primary lpost" href="#/post/${sec}">${t('lPostBtn')}</a>
 ${list.length?`<div class="lcards">${list.map(l=>lcard(l)).join('')}</div>`:empty(sec)}`;
 A.app.querySelectorAll('[data-lk]').forEach(b=>b.onclick=()=>{F.kind=b.dataset.lk;if(sec==='ads'&&!RENT(F.kind))F.cat='';viewList(sec)});
 A.app.querySelectorAll('[data-lc]').forEach(b=>b.onclick=()=>{F.cat=b.dataset.lc;viewList(sec)});
}
function contactBtns(l){const name=l.title;const wa=l.has_wa?`https://api.whatsapp.com/send?phone=${l.phone}&text=${encodeURIComponent(t('waGreetL').replace('{t}',()=>l.title).replace('{u}',()=>'https://urker24.kz/#/item/'+l.id))}`:'';
 return `<div class="actions lact"><a class="btn wa ${wa?'':'off'}" ${wa?`href="${wa}" target="_blank" rel="noopener"`:'aria-disabled="true"'} aria-label="${esc(t('wa'))}">${A.WA_SVG}<span>${t('waS')}</span></a>
  <a class="btn call" href="tel:+${esc(l.phone)}" aria-label="${esc(t('call'))}: ${esc(fmtPhone(l.phone))}">📞 <span>${t('callS')}</span></a></div>`}
async function viewItem(id){
 let l=LST.find(x=>String(x.id)===String(id));
 if(!l&&SB.enabled){try{const r=await SB.get(`listings?select=${COLS}&id=eq.${encodeURIComponent(id)}`,6000);l=r&&r[0]}catch(e){}}
 if(!l){A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="history.length>1?history.back():location.hash='#/'">←</button><h1>🗂</h1></div><div class="empty"><h2>${t('lNotFound')}</h2><a class="btn primary" href="#/bazar">${t('lSec').market}</a></div>`;return}
 const S=SECT[l.section];const photos=(l.photos||[]).map(photoUrl).filter(Boolean);const pr=fmtPrice(l);const closed=l.status==='closed';
 const link=location.origin+location.pathname+'#/item/'+l.id;
 A.setMeta(l.title+' — '+t('lSec')[l.section]+' · Уркер 24',(l.body||'').slice(0,150));
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/${ROUTE[l.section]}'" aria-label="${t('back')}">←</button><h1 class="sm">${S.e} ${t('lSec')[l.section]}</h1></div>
 <article class="article litem">
  ${photos.length?`<div class="gallery" id="gal">${photos.map((u,i)=>`<img src="${esc(u)}" alt="" loading="${i?'lazy':'eager'}">`).join('')}</div>${photos.length>1?`<div class="gal-n"><span id="galn">1</span> / ${photos.length}</div>`:''}`:''}
  <div class="nc-tags">${closed?`<span class="tag">${t('lClosed')[l.section]}</span>`:''}${l.highlighted?`<span class="chip pin">⭐ ${t('lHighlight')}</span>`:''}<span class="chip">${esc(t('lKind')[l.kind]||'')}</span>${catLabel(l)?`<span class="chip">${esc(catLabel(l))}</span>`:''}</div>
  <h1>${esc(l.title)}</h1>${pr?`<div class="lprice">${esc(pr)}</div>`:''}
  ${l.place?`<p class="lmeta">📍 ${l.section==='lost'?t('lWhere')+': ':''}${esc(l.place)}</p>`:''}${l.event_date?`<p class="lmeta">🗓 ${t('lWhen')}: ${esc(fmtDate(l.event_date+'T12:00:00Z'))}</p>`:''}
  ${l.body?`<div class="body">${esc(l.body).split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('')}</div>`:''}
  <p class="lmeta muted">${t('lPosted')}: ${esc(fmtDate(l.published_at||l.created_at))}<span id="lviews">${l.views>0?' · '+t('lViews')(l.views):''}</span> · ${esc(fmtPhone(l.phone))}</p>
  ${closed?'':contactBtns(l)}
  <a class="btn sm share" href="https://wa.me/?text=${encodeURIComponent(l.title+(pr?' — '+pr:'')+'\n'+link)}" target="_blank" rel="noopener">${A.WA_SVG}${t('lShare')}</a>
 </article>`;
 const g=$('#gal');if(g&&$('#galn'))g.addEventListener('scroll',()=>{$('#galn').textContent=Math.round(g.scrollLeft/g.clientWidth)+1},{passive:true});
 if(A.isLive()&&l.status==='approved'){try{const v=await SB.rpc('listing_view',{p_id:l.id,p_device_id:A.deviceId()});if(typeof v==='number'){l.views=v;const e=$('#lviews');if(e)e.textContent=v>0?' · '+t('lViews')(v):''}}catch(e){}}
}
function lerr(e){const c=String(e&&e.code||'');for(const k of Object.keys(T_ERR()))if(c.includes(k))return T_ERR()[k];return A.errMsg(e)}
const T_ERR=()=>t('lErr');
function toBlob(file,maxSide,q){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const img=new Image();
 img.onload=()=>{const k=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);
  const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(new Error('encode')),'image/jpeg',q)};
 img.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('image'))};img.src=u})}
const rnd=()=>Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>b.toString(16).padStart(2,'0')).join('');
async function uploadAll(id,ticket,files,onStep){const paths=[];let i=0;for(const f of files){onStep&&onStep(++i,files.length);
  const b=await toBlob(f,1280,0.8);const r=await SB.upload('listings',`${id}/${ticket}/${rnd()}.jpg`,b,'image/jpeg');paths.push(r.path)}return paths}
// форма подачи / правки
function form(sec,row,onSubmit){
 const S=SECT[sec];row=row||{};const kind=row.kind||S.kinds[0];
 const photos={keep:(row.photos||[]).slice(),add:[]};
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="history.length>1?history.back():location.hash='#/'" aria-label="${t('back')}">←</button><h1 class="sm">${row.id?t('mEdit'):'➕ '+t('pTitle')} · ${S.e} ${t('lSec')[sec]}</h1></div>
 ${row.id?'':A.formNote('pNoteLive','pNoteDemo')}
 <form id="lf" novalidate style="position:relative">${A.hp()}
  <div class="f"><label>${t('pKind')}</label><div class="chips wrap">${S.kinds.map(k=>`<label class="radio"><input type="radio" name="lk" value="${k}" ${k===kind?'checked':''}> ${esc(t('lKind')[k])}</label>`).join('')}</div></div>
  <div class="f" id="catf"><label for="lc">${t('pCat')}</label><select id="lc">${S.cats.map(c=>`<option value="${c}" ${c===(row.category||'other')?'selected':''}>${esc(t('lCat')[sec][c])}</option>`).join('')}</select></div>
  <div class="f"><label for="lt">${t('pTitleF')}</label><input id="lt" maxlength="120" value="${esc(row.title||'')}" placeholder="${t('pTitlePh')}"></div>
  <div class="f"><label for="lb">${t('pBody')}</label><textarea id="lb" maxlength="3000">${esc(row.body||'')}</textarea></div>
  <div class="f" id="pricef"><label>${t('pPriceMode')}</label><div class="chips wrap" id="pm">
   <label class="radio"><input type="radio" name="pm" value="fixed"> ${t('pFixedR')}</label><label class="radio"><input type="radio" name="pm" value="negotiable"> ${t('pNeg')}</label>
   ${sec==='market'?'':`<label class="radio"><input type="radio" name="pm" value="none"> ${t('pNone')}</label>`}</div>
   <input id="lp" inputmode="numeric" maxlength="14" placeholder="${t('pPriceFixed')}" value="${row.price!=null?esc(row.price):''}" style="margin-top:8px"></div>
  <div class="f"><label for="lpl">${sec==='lost'?t('pPlaceLost'):t('pPlace')}</label><input id="lpl" maxlength="120" value="${esc(row.place||'')}"></div>
  ${sec==='lost'?`<div class="f"><label for="ld">${t('pDate')}</label><input id="ld" type="date" value="${esc(row.event_date||'')}"></div>`:''}
  <div class="f"><label for="lph">${t('pPhone')}</label><input id="lph" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="8 7XX XXX XX XX" value="${row.phone?esc(fmtPhone(row.phone)):''}"></div>
  <div class="f"><label class="chk"><input type="checkbox" id="lwa" ${row.has_wa===false?'':'checked'}> ${t('pWa')}</label></div>
  <div class="f"><label for="lpf">${t('pPhotos')}</label>${A.fileBtn('lpf',5)}<div class="thumbs" id="lth"></div></div>
  <button class="btn primary" type="submit">${t('pSend')}</button><p class="meta" id="lst" aria-live="polite"></p></form>`;
 const f=$('#lf');
 const pmDefault=row.price_mode&&row.price_mode!=='free'?row.price_mode:(sec==='lost'?'none':'fixed');
 const syncKind=()=>{const k=(f.querySelector('[name=lk]:checked')||{}).value;
  $('#catf').hidden=sec==='ads'&&!RENT(k);$('#pricef').hidden=sec==='lost'||k==='free';
  const pm=(f.querySelector('[name=pm]:checked')||{}).value;$('#lp').hidden=pm!=='fixed'};
 const pmEl=f.querySelector(`[name=pm][value=${pmDefault}]`)||f.querySelector('[name=pm]');if(pmEl)pmEl.checked=true;
 f.onchange=ev=>{if(ev.target.name==='lk'||ev.target.name==='pm')syncKind()};syncKind();
 const draw=()=>{A.setFC('lpf',photos.keep.length+photos.add.length,5);$('#lth').innerHTML=photos.keep.map((p,i)=>`<div class="th"><img src="${esc(photoUrl(p))}" alt=""><button type="button" data-rk="${i}" aria-label="✕">✕</button></div>`).join('')
   +photos.add.map((p,i)=>`<div class="th"><img src="${p.url}" alt=""><button type="button" data-ra="${i}" aria-label="✕">✕</button></div>`).join('')};
 $('#lth').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.rk!=null)photos.keep.splice(+b.dataset.rk,1);else{URL.revokeObjectURL(photos.add[+b.dataset.ra].url);photos.add.splice(+b.dataset.ra,1)}draw()};
 $('#lpf').onchange=ev=>{const fs=[...ev.target.files];ev.target.value='';const room=5-photos.keep.length-photos.add.length;if(fs.length>room)A.toast(t('pTooMany'));
  fs.slice(0,Math.max(0,room)).forEach(file=>photos.add.push({file,url:URL.createObjectURL(file)}));draw()};
 draw();
 f.onsubmit=ev=>{ev.preventDefault();
  const k=(f.querySelector('[name=lk]:checked')||{}).value;let pm=(f.querySelector('[name=pm]:checked')||{}).value||'none';
  if(sec==='lost')pm='none';if(k==='free')pm='free';
  const p={section:sec,kind:k,category:(sec==='ads'&&!RENT(k))?'other':$('#lc').value,title:$('#lt').value.trim(),body:$('#lb').value.trim(),price_mode:pm,price:pm==='fixed'?$('#lp').value:'',
   place:$('#lpl').value.trim(),event_date:sec==='lost'?$('#ld').value:'',phone:$('#lph').value,has_wa:$('#lwa').checked,lang:A.lang()};
  if(p.title.length<3){A.toast(t('pErrTitle'));$('#lt').focus();return}
  const d=p.phone.replace(/\D/g,'');if(!/^(8|7)?7\d{9}$/.test(d)){A.toast(t('pErrPhone'));$('#lph').focus();return}
  if(pm==='fixed'&&!/\d/.test(p.price)){A.toast(t('pErrPrice'));$('#lp').focus();return}
  onSubmit(p,photos,f.querySelector('[type=submit]'))};
}
function viewPost(sec){
 if(!SECT[sec]){A.setMeta(t('pTitle')+' — Уркер 24','');
  A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>➕ ${t('pTitle')}</h1></div><h2>${t('pChoose')}</h2>
  <div class="mtiles">${Object.keys(SECT).map(s=>`<a class="mtile" href="#/post/${s}"><span>${SECT[s].e}</span><b>${t('lSec')[s]}</b><small>${t('lSecD')[s]}</small></a>`).join('')}
  <a class="mtile" href="#/add"><span>🧰</span><b>${t('menuAddBiz')}</b><small>${t('menuMastersD')}</small></a></div>`;return}
 A.setMeta(t('pTitle')+' · '+t('lSec')[sec]+' — Уркер 24','');
 form(sec,null,async(p,photos,btn)=>{
  if(A.isOffline()){A.toast(t('offlineForm'));return}
  if(!A.isLive()){A.toast(t('pNoteDemo'));return}
  await A.sending(btn,async()=>{try{
   const r=await SB.rpc('submit_listing',{p,p_device_id:A.deviceId(),p_hp:$('#hpf').value},15000);
   if(!r||!r.id){A.toast(t('pDonePending'));return}
   if(photos.add.length){$('#lst').textContent=t('pUploading');try{const paths=await uploadAll(r.id,r.ticket,photos.add.map(x=>x.file),(i,n)=>$('#lst').textContent=`${t('pUploading')} ${i}/${n}`);
     await SB.rpc('listing_set_photos',{p_id:r.id,p_token:r.token,p_paths:paths},15000)}catch(e){A.toast(lerr(e))}}
   saveMy([{id:r.id,token:r.token,title:p.title,section:sec,at:Date.now()},...my()]);
   if(r.status==='approved')await load();
   done(r,p,sec)}catch(e){A.toast(lerr(e))}})});
}
const secretLink=(id,tok)=>location.origin+location.pathname+'#/my/'+id+'/'+tok;
function done(r,p,sec){const link=secretLink(r.id,r.token);
 A.app.innerHTML=`<div class="crumbs"><h1>✅ ${t('pDone')}</h1></div>
 <p class="demo-note live">${r.status==='approved'?t('pDoneLive'):t('pDonePending')}</p>
 <div class="secret"><p>🔑 ${t('pSecret')}</p><input id="sl" readonly value="${esc(link)}"><button class="btn primary" id="cp">${t('pCopy')}</button>
 <a class="btn wa sm" href="https://wa.me/?text=${encodeURIComponent(p.title+'\n'+link)}" target="_blank" rel="noopener">${A.WA_SVG}${t('pSaveWa')}</a>
 <p class="meta">✅ ${t('pSavedMy')}</p></div>
 <a class="btn sm ghost" href="#/my/${r.id}/${r.token}">${t('mManage')}</a><a class="btn sm ghost" href="#/my">${t('pOpenMy')}</a>${r.status==='approved'?`<a class="btn sm ghost" href="#/item/${r.id}">${t('pView')}</a>`:''}`;
 $('#cp').onclick=async()=>{const i=$('#sl');i.select();try{await navigator.clipboard.writeText(i.value)}catch(e){document.execCommand&&document.execCommand('copy')}A.toast(t('pCopied'))};
}
async function viewManage(id,tok){
 A.setMeta(t('mManage')+' — Уркер 24','');
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1 class="sm">🔑 ${t('mManage')}</h1></div><p class="meta">…</p>`;
 if(!A.isLive()&&!SB.enabled){A.app.querySelector('.meta').textContent=t('pNoteDemo');return}
 let r;try{r=await SB.rpc('listing_get_own',{p_id:+id,p_token:tok},10000)}catch(e){A.app.innerHTML+=`<div class="empty"><h2>${t('mBadLink')}</h2></div>`;A.app.querySelector('.meta').remove();return}
 if(!my().some(x=>x.id===r.id))saveMy([{id:r.id,token:tok,title:r.title,section:r.section,at:Date.now()},...my()]);
 const S=SECT[r.section];const open=r.status==='approved'||r.status==='pending';
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1 class="sm">🔑 ${t('mManage')}</h1></div>
 <div class="card mcard"><div class="sub">${S.e} ${t('lSec')[r.section]} · ${esc(t('lKind')[r.kind]||'')}</div><div class="idl"><span class="nm">${esc(r.title)}</span></div>
  <div class="badges"><span class="badge ${r.status==='approved'?'new':r.status==='rejected'?'warn':''}">${t('mStatus')[r.status]||r.status}</span>${fmtPrice(r)?`<span class="badge">${esc(fmtPrice(r))}</span>`:''}<span class="badge">${t('lViews')(r.views||0)}</span>
  ${open?(new Date(r.expires_at).getTime()<Date.now()?`<span class="badge warn">${t('mExpired')}</span>`:`<span class="badge">${t('mExpires')} ${esc(fmtDate(r.expires_at))}</span>`):''}</div></div>
 <div class="mgrid">${open?`<button class="btn sm ghost" data-m="edit">${t('mEdit')}</button><button class="btn sm ok" data-m="close">${t('mClose')[r.section]}</button><button class="btn sm ghost" data-m="renew">${t('mRenew')}</button>`:''}
  ${r.status==='approved'?`<a class="btn sm ghost" href="#/item/${r.id}">${t('pView')}</a>`:''}<button class="btn sm danger" data-m="del">${t('mDelete')}</button></div>
 <div class="secret"><p>🔑 ${t('pSecret')}</p><input id="sl" readonly value="${esc(secretLink(r.id,tok))}"><button class="btn sm ghost" id="cp">${t('pCopy')}</button><p class="meta">🔒 ${t('mOnlyYou')}</p></div>`;
 $('#cp').onclick=async()=>{const i=$('#sl');i.select();try{await navigator.clipboard.writeText(i.value)}catch(e){}A.toast(t('pCopied'))};
 A.app.querySelector('.mgrid').onclick=async ev=>{const b=ev.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;
  try{if(m==='close'){await SB.rpc('listing_close',{p_id:r.id,p_token:tok});await load();return viewManage(id,tok)}
   if(m==='renew'){const e=await SB.rpc('listing_renew',{p_id:r.id,p_token:tok});A.toast(t('mRenewed')+' '+fmtDate(e));return viewManage(id,tok)}
   if(m==='del'){if(!confirm(t('mConfirmDel')))return;await SB.rpc('listing_delete',{p_id:r.id,p_token:tok});saveMy(my().filter(x=>x.id!==r.id));await load();A.toast(t('mDeleted'));location.hash='#/'+ROUTE[r.section];return}
   if(m==='edit')form(r.section,r,async(p,photos,btn)=>{await A.sending(btn,async()=>{try{
     const st=await SB.rpc('listing_update',{p_id:r.id,p_token:tok,p});
     const keepPaths=photos.keep.map(x=>x.path);let paths=keepPaths;
     if(photos.add.length){const tk=await SB.rpc('listing_upload_ticket',{p_id:r.id,p_token:tok});paths=keepPaths.concat(await uploadAll(r.id,tk,photos.add.map(x=>x.file),(i,n)=>$('#lst').textContent=`${t('pUploading')} ${i}/${n}`))}
     if(photos.add.length||keepPaths.length!==(r.photos||[]).length)await SB.rpc('listing_set_photos',{p_id:r.id,p_token:tok,p_paths:paths});
     await load();A.toast(st==='pending'?t('mSavedPending'):t('mSaved'));viewManage(id,tok)}catch(e){A.toast(lerr(e))}})});
  }catch(e){A.toast(lerr(e))}};
}
function viewMy(){A.setMeta(t('pMy')+' — Уркер 24','');const a=my();
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/menu'" aria-label="${t('back')}">←</button><h1>🗂 ${t('pMy')}</h1></div>
 ${a.length?`<div class="mlist">${a.map(x=>`<a class="mrow" data-my="${x.id}" href="#/my/${x.id}/${x.token}"><span>${(SECT[x.section]||{}).e||'🗂'}</span><b>${esc(x.title)}</b><small>${t('lSec')[x.section]||''}<i class="myst" style="font-style:normal"></i></small></a>`).join('')}</div>`:`<div class="ann-empty"><span>${t('pMyEmpty')}</span></div>`}
 ${a.length?`<p class="meta">🔒 ${t('mMyNote')}</p>`:''}
 <a class="btn primary" style="margin-top:10px" href="#/post">${t('lPostBtn')}</a>`;
 if(!a.length||!A.isLive())return;
 SB.rpc('listing_my',{p_items:a.map(x=>({id:x.id,token:x.token}))},10000).then(res=>{if(!Array.isArray(res))return;let ch=false;
  res.forEach(s=>{const row=A.app.querySelector(`[data-my="${s.id}"]`);if(!row)return;const st=row.querySelector('.myst');
   if(s.gone){row.style.opacity='.6';st.textContent=' · '+t('mGone');const b=document.createElement('button');b.className='btn sm ghost';b.style.margin='0 14px 10px';b.textContent=t('mForget');
    b.onclick=()=>{saveMy(my().filter(x=>x.id!==s.id));viewMy()};row.after(b);return}
   const exp=(s.status==='approved'||s.status==='pending')&&new Date(s.expires_at).getTime()<Date.now();
   st.textContent=' · '+(exp?t('mExpired'):(s.status==='closed'?t('lClosed')[s.section]:(t('mStatus')[s.status]||s.status)));
   const m=my().find(x=>x.id===s.id);if(m&&m.title!==s.title){ch=true;row.querySelector('b').textContent=s.title}});
  if(ch)saveMy(my().map(x=>{const r=res.find(y=>y.id===x.id&&!y.gone);return r?Object.assign(x,{title:r.title}):x}))}).catch(()=>{})}
function viewMenu(){A.setMeta(t('menuTitle')+' — Уркер 24','');
 const items=[['#/',`🧰`,t('menuMasters'),t('menuMastersD')],...(ON?Object.keys(SECT):[]).map(s=>[`#/${ROUTE[s]}`,SECT[s].e,t('lSec')[s],t('lSecD')[s]]),
  ['#/news','📰',t('menuNews'),t('menuNewsD')],['#/ann','⚠️',t('menuAlerts'),t('menuAlertsD')],...(ON?[['#/my','🔑',t('pMy'),'']]:[]),['#/add','➕',t('menuAddBiz'),''],['#/report','📣',t('repTitle'),''],['#/install','📲',t('pwaMenu')||'',''],['#/search','🔍',t('navSearch'),'']];
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>☰ ${t('menuTitle')}</h1></div>
 <div class="mlist">${items.map(([h,e,ti,d])=>`<a class="mrow" href="${h}"><span>${e}</span><b>${esc(ti)}</b>${d?`<small>${esc(d)}</small>`:''}</a>`).join('')}</div>`}
// главная: полоса свежих объявлений и плитки разделов
function homeStrip(){if(!ON)return '';const l=visible().filter(x=>x.status==='approved').slice(0,10);
 return `<section class="ann-block"><div class="ann-h"><h2>🗂 ${t('lFresh')}</h2><a href="#/bazar">${t('lFreshAll')}</a></div>
 ${l.length?`<div class="lstrip">${l.map(x=>lcard(x,true)).join('')}</div>`:`<a class="ann-empty lnk-empty" href="#/post"><span>${t('lFreshEmpty')}</span><b>${t('lPostBtn')}</b></a>`}</section>`}
function homeTiles(){if(!ON)return '';const it=[['#/bazar','🛍',t('lSec').market],['#/ads','📋',t('lSec').ads],['#/lost','🐾',t('lSec').lost],['#/news','📰',t('navNews')],['#/ann','⚠️',t('menuAlerts')],['#/post','➕',t('navPost')]];
 return `<div class="stiles">${it.map(([h,e,n])=>`<a class="stile" href="${h}"><span>${e}</span><b>${esc(n)}</b></a>`).join('')}</div>`}
function searchHtml(q){if(!ON)return {n:0,html:''};const qs=A.norm(q).split(' ').filter(w=>w.length>=3);if(!qs.length)return {n:0,html:''};
 const hits=visible().filter(l=>{const tk=A.norm([l.title,l.body,l.place,T_KIND(l),catLabel(l),t('lSec')[l.section]].join(' ')).split(' ').filter(Boolean);return qs.every(x=>A.tokScore(x,tk)>0)});
 return {n:hits.length,html:hits.length?`<div class="sugg-l">🗂 ${t('lFound')}: ${hits.length}</div><div class="lcards">${hits.slice(0,6).map(l=>lcard(l)).join('')}</div>`:''}}
const T_KIND=l=>t('lKind')[l.kind]||'';
function route(h){let m;
 if(!ON){if(/^#\/menu/.test(h)){viewMenu();return 'menu'}return null}
 if((m=h.match(/^#\/(bazar|ads|lost)(?:$|[/?])/))){viewList(BYROUTE[m[1]]);return m[1]==='bazar'?'bazar':'menu'}
 if((m=h.match(/^#\/item\/(\d+)/))){viewItem(m[1]);return 'bazar'}
 if((m=h.match(/^#\/post(?:\/(\w+))?/))){viewPost(m[1]);return 'post'}
 if((m=h.match(/^#\/my\/(\d+)\/([0-9a-f]{64})/))){viewManage(m[1],m[2]);return 'menu'}
 if(/^#\/my\/?$/.test(h)){viewMy();return 'menu'}
 if(/^#\/menu/.test(h)){viewMenu();return 'menu'}
 return null}
window.URKER_L={on:ON,route,load,homeStrip,homeTiles,searchHtml,count:()=>visible().length};
})();
