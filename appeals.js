// Уркер 24 — «Обращения жителей / Тұрғындар өтініштері»: жители сообщают о проблемах района с конкретным адресом
// (освещение, мусор, дороги, вода, отопление, дворы, собаки, безопасность, транспорт), соседи поддерживают «👍 Мен де қолдаймын».
// Собранные обращения передаются в акимат. Имя и телефон на сайте никогда не показываются (20_appeals.sql).
// Подключается после app.js (использует window.URKER_APP).
(function(){
'use strict';
const A=window.URKER_APP;if(!A)return;
const {esc,$,SB}=A;const t=k=>A.t(k);
const CATS=[['light','💡'],['trash','🗑'],['roads','🛣'],['water','🚰'],['heat','🔥'],['yard','🌳'],['dogs','🐕'],['safety','🚨'],['transport','🚌'],['other','📌']];
const CE=Object.fromEntries(CATS);
const PUB=['new','sent','in_work','resolved'];
A.addDict({
 apTitle:'Обращения жителей',apShort:'Обращения',apMenuD:'Свет, мусор, дороги, вода — сообщите о проблеме',
 apHeroS:'Нет света, мусор, ямы на дороге? Сообщите о проблеме — мы соберём обращения жителей и передадим в акимат.',
 apNew:'✍️ Подать обращение',apAll:'Все обращения',apStat:(n,s)=>`Обращений: ${n} · поддержали: ${s}`,
 apIntro:'Каждое обращение — от реального жителя с адресом, не анонимно. Мы собираем их и передаём в акимат. Поддержите обращения соседей: чем больше жителей, тем весомее обращение.',
 apCat:{light:'Освещение',trash:'Мусор и вывоз',roads:'Дороги и ямы',water:'Вода и канализация',heat:'Отопление и газ',yard:'Благоустройство, дворы, детские площадки',dogs:'Бездомные собаки',safety:'Безопасность',transport:'Транспорт',other:'Другое'},
 apSt:{new:'Новое',sent:'Передано в акимат',in_work:'В работе',resolved:'Решено'},apStAll:'Все',apCatAll:'Все темы',
 apScope:{street:'🏠 Моя улица / дом',district:'🏘 Весь район (общее)'},apScopeS:{street:'Частное',district:'Общее для района'},
 apSortNew:'Сначала новые',apSortTop:'Больше поддержали',
 apSup:'👍 Поддерживаю',apSupped:'✅ Вы поддержали',apSupN:n=>`${n}`,apSupTitle:'Поддержать обращение',
 apSupNote:'Укажите вашу улицу — так видно, что обращение важно жителям разных улиц. Имя и телефон не нужны.',
 apSupSend:'👍 Поддерживаю',apSupOk:'Спасибо! Ваш голос учтён.',apSupAlready:'Вы уже поддержали это обращение',
 apResident:s=>`Житель ${s}`,apStreetFmt:s=>`ул. ${s}`,apHouseFmt:h=>`, д. ${h}`,
 apSupL:'жителей поддержали',apSupStreets:'Поддержали жители улиц',apResp:'💬 Ответ',apStepsT:'Ход обращения',
 apShare:'Поделиться в WhatsApp',apShareMsg:'Поддержите обращение жителей Уркера',apNotFound:'Обращение не найдено или ещё на проверке',
 apEmpty:'Пока обращений нет',apEmptyS:'Подайте первое — после проверки оно появится здесь.',apEmptyF:'По этому фильтру обращений нет',
 apFormT:'Новое обращение',apFormNote:'Обращение проверит модератор и опубликует на сайте. Ваше имя и телефон на сайте не показываются — они нужны, чтобы обращение было не анонимным и его можно было передать в акимат.',
 apFCat:'Тема',apFScope:'Чего касается проблема?',apFAddr:'Ваш адрес (обязательно)',apFStreet:'Улица',apFStreetPh:'Например: Айгыржал',apFHouse:'Дом',apFHousePh:'12',
 apFText:'Опишите проблему (обязательно)',apFTextPh:'Например: возле дома 12 не горят 3 фонаря уже две недели, вечером темно',
 apFPhotos:'Фото проблемы (до 3, по желанию)',apFName:'Ваше имя (обязательно)',apFPhone:'Телефон (обязательно, на сайте не показывается)',
 apFConsent:'Согласен(на) передать обращение с моим именем, адресом и телефоном в акимат',apFSend:'📨 Отправить обращение',
 apEChoose:'Выберите тему',apEStreet:'Укажите улицу',apEHouse:'Укажите номер дома',apEText:'Опишите проблему подробнее (не короче 10 символов)',apEName:'Укажите ваше имя',apEPhone:'Укажите номер телефона: 8 7XX XXX XX XX',apEConsent:'Отметьте согласие на передачу обращения в акимат',
 apUploading:'Загружаем фото…',apDoneT:'Обращение отправлено',apDone:n=>`Ваше обращение № ${n} отправлено на проверку. После проверки оно появится в разделе «Обращения жителей». Расскажите соседям — пусть поддержат.`,
 apPhotoPart:'Обращение отправлено, но фото не загрузились.',apAnother:'✍️ Подать ещё одно',apHeic:'Это фото не открывается (формат HEIC). Выберите фото в формате JPEG или сделайте скриншот фото.',
 apLoading:'Загрузка…',apOffline:'Сейчас нет связи с сервером. Попробуйте позже.',apErr:{bad_category:'Выберите тему',bad_street:'Укажите улицу',bad_house:'Укажите номер дома',bad_text:'Опишите проблему подробнее (не короче 10 символов)',bad_name:'Укажите ваше имя',invalid_phone:'Проверьте номер телефона',already_supported:'Вы уже поддержали это обращение',not_found:'Обращение не найдено',rate_limited:'Слишком много отправок. Попробуйте позже.',bad_token:'Время для загрузки фото истекло',too_many_photos:'Не больше 3 фото'},
 apDate:'от'
},{
 apTitle:'Тұрғындар өтініштері',apShort:'Өтініштер',apMenuD:'Жарық, қоқыс, жол, су — мәселе туралы хабарлаңыз',
 apHeroS:'Жарық жоқ па, қоқыс, жолда шұңқыр ма? Мәселе туралы хабарлаңыз — тұрғындардың өтініштерін жинап, әкімдікке жеткіземіз.',
 apNew:'✍️ Өтініш беру',apAll:'Барлық өтініштер',apStat:(n,s)=>`Өтініштер: ${n} · қолдағандар: ${s}`,
 apIntro:'Әр өтініш — мекенжайы бар нақты тұрғыннан, жасырын емес. Біз оларды жинап, әкімдікке жеткіземіз. Көршілердің өтініштерін қолдаңыз: тұрғындар көп болған сайын өтініш салмақты болады.',
 apCat:{light:'Жарықтандыру',trash:'Қоқыс және шығару',roads:'Жолдар мен шұңқырлар',water:'Су және кәріз',heat:'Жылу және газ',yard:'Абаттандыру, аулалар, балалар алаңдары',dogs:'Қаңғыбас иттер',safety:'Қауіпсіздік',transport:'Көлік',other:'Басқа'},
 apSt:{new:'Жаңа',sent:'Әкімдікке жіберілді',in_work:'Жұмыста',resolved:'Шешілді'},apStAll:'Барлығы',apCatAll:'Барлық тақырып',
 apScope:{street:'🏠 Менің көшем / үйім',district:'🏘 Бүкіл аудан (жалпы)'},apScopeS:{street:'Жеке',district:'Аудан үшін жалпы'},
 apSortNew:'Алдымен жаңалары',apSortTop:'Көп қолдағандар',
 apSup:'👍 Мен де қолдаймын',apSupped:'✅ Сіз қолдадыңыз',apSupN:n=>`${n}`,apSupTitle:'Өтінішті қолдау',
 apSupNote:'Көшеңізді көрсетіңіз — өтініш әр көшенің тұрғындарына маңызды екені көрінеді. Аты-жөні мен телефон қажет емес.',
 apSupSend:'👍 Мен де қолдаймын',apSupOk:'Рақмет! Даусыңыз есептелді.',apSupAlready:'Сіз бұл өтінішті қолдадыңыз',
 apResident:s=>`${s} тұрғыны`,apStreetFmt:s=>`${s} көшесі`,apHouseFmt:h=>`, ${h} үй`,
 apSupL:'тұрғын қолдады',apSupStreets:'Қолдаған тұрғындардың көшелері',apResp:'💬 Жауап',apStepsT:'Өтініштің барысы',
 apShare:'WhatsApp-та бөлісу',apShareMsg:'Үркер тұрғындарының өтінішін қолдаңыз',apNotFound:'Өтініш табылмады немесе әлі тексеруде',
 apEmpty:'Әзірге өтініш жоқ',apEmptyS:'Біріншісін беріңіз — тексеруден кейін осында шығады.',apEmptyF:'Бұл сүзгі бойынша өтініш жоқ',
 apFormT:'Жаңа өтініш',apFormNote:'Өтінішті модератор тексеріп, сайтта жариялайды. Атыңыз бен телефоныңыз сайтта көрсетілмейді — олар өтініш жасырын болмауы және әкімдікке жеткізу үшін қажет.',
 apFCat:'Тақырып',apFScope:'Мәселе неге қатысты?',apFAddr:'Мекенжайыңыз (міндетті)',apFStreet:'Көше',apFStreetPh:'Мысалы: Айғыржал',apFHouse:'Үй',apFHousePh:'12',
 apFText:'Мәселені сипаттаңыз (міндетті)',apFTextPh:'Мысалы: 12-үйдің жанында екі аптадан бері 3 шам жанбайды, кешке қараңғы',
 apFPhotos:'Мәселенің фотосы (3-ке дейін, қаласаңыз)',apFName:'Атыңыз (міндетті)',apFPhone:'Телефон (міндетті, сайтта көрсетілмейді)',
 apFConsent:'Өтінішті атыммен, мекенжайыммен және телефоныммен әкімдікке жеткізуге келісемін',apFSend:'📨 Өтінішті жіберу',
 apEChoose:'Тақырыпты таңдаңыз',apEStreet:'Көшені көрсетіңіз',apEHouse:'Үй нөмірін көрсетіңіз',apEText:'Мәселені толығырақ сипаттаңыз (кемінде 10 таңба)',apEName:'Атыңызды көрсетіңіз',apEPhone:'Телефон нөмірін көрсетіңіз: 8 7XX XXX XX XX',apEConsent:'Өтінішті әкімдікке жеткізуге келісім белгісін қойыңыз',
 apUploading:'Фото жүктелуде…',apDoneT:'Өтініш жіберілді',apDone:n=>`№ ${n} өтінішіңіз тексеруге жіберілді. Тексеруден кейін ол «Тұрғындар өтініштері» бөлімінде шығады. Көршілеріңізге айтыңыз — қолдасын.`,
 apPhotoPart:'Өтініш жіберілді, бірақ фото жүктелмеді.',apAnother:'✍️ Тағы біреуін беру',apHeic:'Бұл фото ашылмайды (HEIC форматы). JPEG форматындағы фотоны таңдаңыз немесе фотоның скриншотын жасаңыз.',
 apLoading:'Жүктелуде…',apOffline:'Қазір сервермен байланыс жоқ. Кейінірек көріңіз.',apErr:{bad_category:'Тақырыпты таңдаңыз',bad_street:'Көшені көрсетіңіз',bad_house:'Үй нөмірін көрсетіңіз',bad_text:'Мәселені толығырақ сипаттаңыз (кемінде 10 таңба)',bad_name:'Атыңызды көрсетіңіз',invalid_phone:'Телефон нөмірін тексеріңіз',already_supported:'Сіз бұл өтінішті қолдадыңыз',not_found:'Өтініш табылмады',rate_limited:'Тым көп жіберілді. Кейінірек қайталап көріңіз.',bad_token:'Фото жүктеу уақыты өтіп кетті',too_many_photos:'3 фотодан артық емес'},
 apDate:''
});
const COLS='id,category,scope,street,house,description,photos,status,response,supports,lang,published_at,status_at,created_at';
let AP=[],LOADED=false;
const SUPK='urker_ap_sup',ADDRK='urker_ap_addr';
const lsGet=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const supped=id=>lsGet(SUPK,[]).includes(+id);
const markSup=id=>{const a=lsGet(SUPK,[]);if(!a.includes(+id)){a.unshift(+id);localStorage.setItem(SUPK,JSON.stringify(a.slice(0,500)))}};
const photoUrl=p=>p&&p.path?SB.publicUrl('appeals',p.path):'';
const fmtDate=iso=>{if(!iso)return '';const d=new Date(new Date(iso).getTime()+5*3600e3);return `${d.getUTCDate()} ${A.MONTHS[A.lang()][d.getUTCMonth()]} ${d.getUTCFullYear()}`};
// «ул. Айгыржал» → «Айгыржал»; «Айғыржал көшесі» → «Айғыржал» (адрес хранится без слова «улица»)
const cleanStreet=s=>String(s||'').replace(/\s+/g,' ').trim().replace(/^(ул\.?|улица|көш\.?|көшесі)\s+/i,'').replace(/\s+(ул\.?|улица|көшесі|көш\.?)$/i,'').trim();
const PREFIXED=/^(мкр|микрорайон|мкрн|пер\.?|переулок|пр\.?|проспект|ш\.?|шоссе|тупик|ж\.?\s?м|тұйық|даңғыл|шағын)/i;
const streetTxt=s=>PREFIXED.test(s)?s:t('apStreetFmt')(s);
const addrTxt=a=>streetTxt(a.street)+(a.house?t('apHouseFmt')(a.house):'');
const KNOWN_STREETS=['Айгыржал','Кейки батыр','Кашаубаев','Камбар ата','Ойсылкара','Жантай батыр','Исатай батыр','Есет батыр','Шопан ата','Мукагали Макатаева','Есенжанова'];
const apErr=e=>{const c=String(e&&e.code||e&&e.message||'');const E=t('apErr');for(const k of Object.keys(E))if(c.includes(k))return E[k];return A.errMsg(e)};
const pub=()=>AP.filter(a=>PUB.includes(a.status));
async function load(){if(!SB.enabled)return;try{const r=await SB.get(`appeals?select=${COLS}&order=published_at.desc.nullslast,id.desc&limit=500`,8000);AP=Array.isArray(r)?r:[];LOADED=true}catch(e){AP=[];LOADED=false}}
const stBadge=s=>`<span class="ap-st st-${esc(s)}">${esc(t('apSt')[s]||s)}</span>`;
const catChip=c=>`<span class="ap-cat">${CE[c]||'📌'} ${esc(t('apCat')[c]||c)}</span>`;
const supBtn=a=>{const on=supped(a.id),open=a.status!=='resolved';
 return `<button type="button" class="ap-sup ${on?'on':''}" data-sup="${a.id}" ${open?'':'disabled'} aria-pressed="${on}"><span>${on?t('apSupped'):t('apSup')}</span><b class="ap-sn">${+a.supports||0}</b></button>`};
const shareHref=a=>{const link='https://urker24.kz/a/'+a.id+'/';/* [siteT] страница с превью */const d=String(a.description||'');
 return 'https://wa.me/?text='+encodeURIComponent(`📢 ${t('apShareMsg')}: ${CE[a.category]||''} ${t('apCat')[a.category]||''} — ${addrTxt(a)}\n«${d.length>140?d.slice(0,140)+'…':d}»\n${link}`)};
function apCard(a){const ph=(a.photos||[])[0];
 return `<article class="apc" id="ap${a.id}"><div class="apc-h">${catChip(a.category)}${stBadge(a.status)}</div>
  <a class="apc-b" href="#/appeal/${a.id}">${ph?`${URKER_PIC(photoUrl(ph),false,'class="apc-img" loading="lazy"',esc)}`:''}
   <p class="apc-d">${esc(a.description)}</p>
   <div class="apc-m">📍 ${esc(addrTxt(a))} · ${esc(t('apScopeS')[a.scope]||'')} · ${esc(fmtDate(a.published_at||a.created_at))}</div></a>
  ${a.response?`<div class="apc-r">${t('apResp')}: ${esc(a.response.length>160?a.response.slice(0,160)+'…':a.response)}</div>`:''}
  <div class="apc-f">${supBtn(a)}<a class="ap-share" href="${esc(shareHref(a))}" target="_blank" rel="noopener" aria-label="${esc(t('apShare'))}">${A.WA_SVG}<span>${esc(t('apShare'))}</span></a></div></article>`}
// главная: заметный блок над всем остальным
function homeBlock(){const l=pub(),sup=l.reduce((s,a)=>s+(+a.supports||0),0);
 return `<section class="ap-hero" aria-labelledby="apHeroT"><div class="ap-hh"><span class="ap-ic" aria-hidden="true">📢</span><div><h2 id="apHeroT">${esc(t('apTitle'))}</h2><p>${esc(t('apHeroS'))}</p></div></div>
  ${l.length?`<div class="ap-hs">${esc(t('apStat')(l.length,sup))}</div>`:''}
  <div class="ap-hb"><a class="btn ap-go" href="#/appeals/new">${esc(t('apNew'))}</a><a class="btn ap-all" href="#/appeals">${esc(t('apAll'))}${l.length?` · ${l.length}`:''}</a></div></section>`}
let F={cat:'',st:'',sort:'new'};
function viewList(){
 A.setMeta(t('apTitle')+' — Уркер 24',t('apHeroS'));
 const all=pub();const cnt=c=>all.filter(a=>a.category===c).length;
 let l=all.filter(a=>(!F.cat||a.category===F.cat)&&(!F.st||a.status===F.st));
 if(F.sort==='top')l=l.slice().sort((x,y)=>(y.supports-x.supports)||(y.id-x.id));
 const byS=s=>all.filter(a=>a.status===s).length;
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>📢 ${esc(t('apTitle'))}</h1></div>
 <p class="ap-intro">${esc(t('apIntro'))}</p>
 <a class="btn primary ap-newbtn" href="#/appeals/new">${esc(t('apNew'))}</a>
 ${all.length?`<div class="ap-sum">${PUB.map(s=>`<button type="button" class="ap-sum-i ${F.st===s?'on':''}" data-st="${s}"><b>${byS(s)}</b><span>${esc(t('apSt')[s])}</span></button>`).join('')}</div>`:''}
 <div class="chips" role="group">${[['',t('apCatAll'),all.length],...CATS.filter(([c])=>cnt(c)).map(([c,e])=>[c,e+' '+t('apCat')[c],cnt(c)])].map(([c,n,k])=>`<button class="${F.cat===c?'on':''}" data-c="${c}">${esc(n)} <small>${k}</small></button>`).join('')}</div>
 <div class="chips" role="group">${[['',t('apStAll')],...PUB.map(s=>[s,t('apSt')[s]])].map(([s,n])=>`<button class="${F.st===s?'on':''}" data-st="${s}">${esc(n)}</button>`).join('')}<span class="ap-gap"></span>${[['new',t('apSortNew')],['top',t('apSortTop')]].map(([s,n])=>`<button class="${F.sort===s?'on':''}" data-so="${s}">${esc(n)}</button>`).join('')}</div>
 <div class="ap-list">${SB.enabled&&!A.isLive()&&!A.isOffline()&&!AP.length?`<div class="ann-empty">⏳ <b>${t('apLoading')}</b></div>`:l.length?l.map(apCard).join(''):`<div class="ann-empty">📢 <b>${esc(all.length?t('apEmptyF'):t('apEmpty'))}</b>${all.length?'':`<span>${esc(t('apEmptyS'))}</span>`}</div>`}</div>`;
 A.app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{F.cat=b.dataset.c;viewList()});
 A.app.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{F.st=F.st===b.dataset.st&&b.classList.contains('ap-sum-i')?'':b.dataset.st;viewList()});
 A.app.querySelectorAll('[data-so]').forEach(b=>b.onclick=()=>{F.sort=b.dataset.so;viewList()});
}
async function viewItem(id){
 let a=AP.find(x=>String(x.id)===String(id));
 if(!a&&SB.enabled){try{const r=await SB.get(`appeals?select=${COLS}&id=eq.${encodeURIComponent(id)}`,8000);a=r&&r[0];if(a&&!AP.some(x=>x.id===a.id))AP.push(a)}catch(e){}}
 if(!a){A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/appeals'" aria-label="${t('back')}">←</button><h1>📢</h1></div><div class="empty"><h2>${esc(t('apNotFound'))}</h2><a class="btn primary" href="#/appeals">${esc(t('apAll'))}</a></div>`;return}
 const photos=(a.photos||[]).map(photoUrl).filter(Boolean);const cur=PUB.indexOf(a.status);
 A.setMeta(`${t('apCat')[a.category]} — ${addrTxt(a)} · ${t('apTitle')} · Уркер 24`,String(a.description||'').slice(0,150));
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/appeals'" aria-label="${t('back')}">←</button><h1 class="sm">📢 ${esc(t('apTitle'))}</h1></div>
 <article class="article ap-item">
  ${photos.length?`<div class="gallery" id="gal">${photos.map((u,i)=>URKER_PIC(u,true,`loading="${i?'lazy':'eager'}"`,esc)).join('')}</div>`:''}
  <div class="apc-h">${catChip(a.category)}${stBadge(a.status)}</div>
  <h1>${CE[a.category]||''} ${esc(t('apCat')[a.category])}</h1>
  <p class="ap-addr">📍 ${esc(addrTxt(a))}<br><small>${esc(t('apScopeS')[a.scope]||'')} · ${esc(t('apResident')(streetTxt(a.street)))} · ${esc(fmtDate(a.published_at||a.created_at))}</small></p>
  <div class="body">${esc(a.description).split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('')}</div>
  ${a.response?`<div class="ap-resp"><b>${t('apResp')}</b><p>${esc(a.response).replace(/\n/g,'<br>')}</p></div>`:''}
  <div class="ap-steps" aria-label="${esc(t('apStepsT'))}">${PUB.map((s,i)=>`<div class="ap-step ${i<cur?'done':''} ${i===cur?'cur':''}"><span>${i<cur?'✓':i+1}</span><small>${esc(t('apSt')[s])}</small></div>`).join('')}</div>
  <div class="ap-supbox"><div class="ap-supc"><b id="apSupN">${+a.supports||0}</b><span>${esc(t('apSupL'))}</span></div>${supBtn(a)}</div>
  <div id="apStreets"></div>
  <a class="btn sm share" href="${esc(shareHref(a))}" target="_blank" rel="noopener">${A.WA_SVG}${esc(t('apShare'))}</a>
 </article>`;
 if(SB.enabled)SB.rpc('appeal_streets',{p_id:a.id},8000).then(r=>{const el=$('#apStreets');if(!el||!Array.isArray(r)||!r.length)return;
  el.innerHTML=`<div class="ap-streets"><b>${esc(t('apSupStreets'))}:</b> ${r.map(x=>`<span>${esc(streetTxt(x.street))}${x.n>1?` <i>× ${+x.n}</i>`:''}</span>`).join('')}</div>`}).catch(()=>{});
}
// «Поддерживаю»: улица (обязательно) + дом (по желанию); один голос с устройства
function openSupport(id){const a=AP.find(x=>x.id===+id);if(!a)return;
 if(supped(id)){A.toast(t('apSupAlready'));return}
 if(!A.isLive()){A.toast(t('apOffline'));return}
 const ad=lsGet(ADDRK,{});const m=$('#modal');
 m.innerHTML=`<div class="sheet ap-sheet" role="dialog" aria-modal="true" aria-labelledby="apSupT"><h2 id="apSupT">${esc(t('apSupTitle'))}</h2>
  <p class="ap-sq">${CE[a.category]||''} ${esc(t('apCat')[a.category])} — ${esc(addrTxt(a))}</p>
  <p class="demo-note live">ℹ️ ${esc(t('apSupNote'))}</p>
  <form id="apsf" novalidate style="position:relative">${A.hp()}
   <p class="ap-al">${esc(t('apFAddr').replace(/\s*\(.*\)$/,''))}</p><div class="ap-row2"><div class="f"><label for="aps1">${esc(t('apFStreet'))}</label><input id="aps1" maxlength="80" list="apStreetsL" autocomplete="address-line1" value="${esc(ad.street||'')}" placeholder="${esc(t('apFStreetPh'))}"></div>
   <div class="f ap-house"><label for="aps2">${esc(t('apFHouse'))}</label><input id="aps2" maxlength="20" value="${esc(ad.house||'')}" placeholder="${esc(t('apFHousePh'))}"></div></div>
   ${streetList()}
   <button class="btn primary ap-submit" type="submit">${esc(t('apSupSend'))}</button></form>
  <button class="btn ghost sm" type="button" id="apsc" style="width:100%">${esc(t('close'))}</button></div>`;
 m.hidden=false;m.onclick=ev=>{if(ev.target===m)m.hidden=true};$('#apsc').onclick=()=>{m.hidden=true};
 $('#apsf').onsubmit=ev=>{ev.preventDefault();const street=cleanStreet($('#aps1').value),house=$('#aps2').value.trim();
  if(street.length<2){A.toast(t('apEStreet'));$('#aps1').focus();return}
  A.sending(ev.target.querySelector('[type=submit]'),async()=>{try{
   const n=await SB.rpc('appeal_support',{p_id:a.id,p_street:street,p_house:house,p_device_id:A.deviceId(),p_hp:$('#hpf').value},10000);
   localStorage.setItem(ADDRK,JSON.stringify({street,house}));markSup(a.id);if(typeof n==='number')a.supports=n;m.hidden=true;A.toast(t('apSupOk'));refreshSup(a)}
   catch(e){if(String(e&&e.code||'').includes('already_supported')){markSup(a.id);m.hidden=true;refreshSup(a)}A.toast(apErr(e))}})};
 setTimeout(()=>{const i=$('#aps1');if(i&&!i.value)i.focus()},50);
}
function refreshSup(a){document.querySelectorAll(`[data-sup="${a.id}"]`).forEach(b=>{b.outerHTML=supBtn(a)});const n=$('#apSupN');if(n)n.textContent=+a.supports||0;
 if(location.hash.startsWith('#/appeal/'))viewItem(a.id)}
function streetList(){const s=new Set(KNOWN_STREETS);AP.forEach(a=>s.add(a.street));return `<datalist id="apStreetsL">${[...s].sort((x,y)=>x.localeCompare(y,'ru')).map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`}
// сжатие фото на телефоне: до 1280 px, JPEG, без EXIF (перерисовка на canvas убирает метаданные, в т.ч. GPS)
function toBlob(file,maxSide,q){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const img=new Image();
 img.onload=()=>{const k=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);
  const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(new Error('encode')),'image/jpeg',q)};
 img.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('image'))};img.src=u})}
async function shrink(file){let b=await toBlob(file,1280,0.82);if(b.size>1.4e6)b=await toBlob(file,1024,0.65);return b}
const rnd=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join('');
function viewForm(){
 A.setMeta(t('apFormT')+' — '+t('apTitle')+' · Уркер 24',t('apHeroS'));
 const ad=lsGet(ADDRK,{});const st={cat:'',photos:[]};
 A.app.innerHTML=`<div class="crumbs"><button class="back" onclick="history.length>1?history.back():location.hash='#/appeals'" aria-label="${t('back')}">←</button><h1 class="sm">📢 ${esc(t('apFormT'))}</h1></div>
 ${A.isOffline()?`<p class="demo-note warn">⚠️ ${esc(t('apOffline'))}</p>`:`<p class="demo-note live">ℹ️ ${esc(t('apFormNote'))}</p>`}
 <form id="apf" novalidate style="position:relative">${A.hp()}
  <div class="f"><label id="apcL">${esc(t('apFCat'))}</label><div class="ap-cats" role="radiogroup" aria-labelledby="apcL">${CATS.map(([c,e])=>`<label class="ap-ct"><input type="radio" name="apc" value="${c}"><span class="e">${e}</span><span class="n">${esc(t('apCat')[c])}</span></label>`).join('')}</div></div>
  <div class="f"><label>${esc(t('apFScope'))}</label><div class="chips wrap">${['street','district'].map((s,i)=>`<label class="radio"><input type="radio" name="aps" value="${s}" ${i?'':'checked'}> ${esc(t('apScope')[s])}</label>`).join('')}</div></div>
  <p class="ap-al">${esc(t('apFAddr'))}</p><div class="ap-row2"><div class="f"><label for="ap1">${esc(t('apFStreet'))}</label><input id="ap1" maxlength="80" list="apStreetsL" autocomplete="address-line1" value="${esc(ad.street||'')}" placeholder="${esc(t('apFStreetPh'))}"></div>
  <div class="f ap-house"><label for="ap2">${esc(t('apFHouse'))}</label><input id="ap2" maxlength="20" value="${esc(ad.house||'')}" placeholder="${esc(t('apFHousePh'))}"></div></div>
  ${streetList()}
  <div class="f"><label for="ap3">${esc(t('apFText'))}</label><textarea id="ap3" maxlength="2000" style="min-height:120px" placeholder="${esc(t('apFTextPh'))}"></textarea></div>
  <div class="f"><label for="ap4">${esc(t('apFPhotos'))}</label>${A.fileBtn('ap4',3)}<div class="thumbs" id="apth"></div></div>
  <div class="f"><label for="ap5">${esc(t('apFName'))}</label><input id="ap5" maxlength="80" autocomplete="name"></div>
  <div class="f"><label for="ap6">${esc(t('apFPhone'))}</label><input id="ap6" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="8 7XX XXX XX XX"></div>
  <div class="f"><label class="chk ap-consent"><input type="checkbox" id="ap7"> ${esc(t('apFConsent'))}</label></div>
  <p class="meta" id="apst" aria-live="polite"></p>
  <button class="btn primary ap-submit" type="submit">${esc(t('apFSend'))}</button></form>`;
 const f=$('#apf');
 f.querySelectorAll('input[name=apc]').forEach(r=>r.onchange=()=>{st.cat=r.value;f.querySelectorAll('.ap-ct').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked))});
 const draw=()=>{A.setFC('ap4',st.photos.length,3);$('#apth').innerHTML=st.photos.map((p,i)=>`<div class="th"><img src="${p.url}" alt=""><button type="button" data-rm="${i}" aria-label="✕">✕</button></div>`).join('')};
 $('#apth').onclick=ev=>{const b=ev.target.closest('[data-rm]');if(b){const [x]=st.photos.splice(+b.dataset.rm,1);URL.revokeObjectURL(x.url);draw()}};
 $('#ap4').onchange=async ev=>{const files=[...ev.target.files];ev.target.value='';
  if(st.photos.length+files.length>3)A.toast(t('apErr').too_many_photos);
  for(const fl of files.slice(0,3-st.photos.length)){try{const b=await shrink(fl);st.photos.push({blob:b,url:URL.createObjectURL(b)})}catch(e){A.toast(t('apHeic'))}}draw()};
 draw();
 f.onsubmit=ev=>{ev.preventDefault();
  const p={category:st.cat,scope:(f.querySelector('input[name=aps]:checked')||{}).value||'street',street:cleanStreet($('#ap1').value),house:$('#ap2').value.trim(),
   description:$('#ap3').value.trim(),name:$('#ap5').value.trim(),phone:$('#ap6').value.trim(),lang:A.lang()};
  const bad=(msg,el)=>{A.toast(msg);if(el){el.focus();el.scrollIntoView({block:'center'})}};
  if(!p.category)return bad(t('apEChoose'),f.querySelector('.ap-ct input'));
  if(p.street.length<2)return bad(t('apEStreet'),$('#ap1'));
  if(!p.house)return bad(t('apEHouse'),$('#ap2'));
  if(p.description.length<10)return bad(t('apEText'),$('#ap3'));
  if(p.name.length<2)return bad(t('apEName'),$('#ap5'));
  const d=p.phone.replace(/\D/g,'');if(!/^(8|7)?7\d{9}$/.test(d))return bad(t('apEPhone'),$('#ap6'));
  if(!$('#ap7').checked)return bad(t('apEConsent'),$('#ap7'));
  if(A.isOffline()||!SB.enabled){A.toast(t('apOffline'));return}
  A.sending(f.querySelector('[type=submit]'),async()=>{try{
   const r=await SB.rpc('submit_appeal',{p,p_device_id:A.deviceId(),p_hp:$('#hpf').value},15000);
   localStorage.setItem(ADDRK,JSON.stringify({street:p.street,house:p.house}));
   let failed=0;
   if(r&&r.id&&st.photos.length){const paths=[];let i=0;
    for(const x of st.photos){$('#apst').textContent=`${t('apUploading')} ${++i}/${st.photos.length}`;
     try{const u=await SB.upload('appeals',`${r.id}/${r.ticket}/${rnd()}.jpg`,x.blob,'image/jpeg');paths.push(u.path)}catch(e){failed++}}
    if(paths.length){try{await SB.rpc('appeal_set_photos',{p_id:r.id,p_ticket:r.ticket,p_paths:paths},15000)}catch(e){failed+=paths.length}}}
   st.photos.forEach(x=>URL.revokeObjectURL(x.url));
   done(r&&r.id,failed)}catch(e){A.toast(apErr(e))}})};
}
function done(id,failed){window.scrollTo(0,0);
 A.app.innerHTML=`<div class="crumbs"><h1>✅ ${esc(t('apDoneT'))}</h1></div>
 <p class="demo-note live">${esc(t('apDone')(id||'—'))}</p>${failed?`<p class="demo-note warn">⚠️ ${esc(t('apPhotoPart'))}</p>`:''}
 <a class="btn primary" href="#/appeals">${esc(t('apAll'))}</a><a class="btn sm ghost" href="#/appeals/new" id="apAgain">${esc(t('apAnother'))}</a>`;
 const ag=$('#apAgain');if(ag)ag.onclick=ev=>{if(location.hash==='#/appeals/new'){ev.preventDefault();viewForm()}};
}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-sup]');if(b&&!b.disabled){ev.preventDefault();openSupport(b.dataset.sup)}});
function searchHtml(q){const qs=A.norm(q).split(' ').filter(w=>w.length>=3);if(!qs.length)return {n:0,html:''};
 const hits=pub().filter(a=>{const tk=A.norm([a.description,a.street,a.response,A.t('apCat')[a.category]].join(' ')).split(' ').filter(Boolean);return qs.every(x=>A.tokScore(x,tk)>0)});
 return {n:hits.length,html:hits.length?`<div class="sugg-l">📢 ${esc(t('apTitle'))}: ${hits.length}</div><div class="ap-list">${hits.slice(0,4).map(apCard).join('')}</div>`:''}}
function route(h){let m;
 if(/^#\/appeals\/new/.test(h)){viewForm();return 'appeals'}
 if((m=h.match(/^#\/appeals(?:$|[/?])/))){const q=(h.split('?')[1]||'');const c=new URLSearchParams(q).get('c');if(c&&CE[c])F.cat=c;viewList();return 'appeals'}
 if((m=h.match(/^#\/appeal\/(\d+)/))){viewItem(m[1]);return 'appeals'}
 return null}
window.URKER_AP={route,load,homeBlock,searchHtml,count:()=>pub().length};
})();
