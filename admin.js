(function(){
'use strict';
// Защита от «кликджекинга»: админку нельзя открыть внутри чужой страницы (GitHub Pages не даёт поставить заголовок X-Frame-Options)
if(window.top!==window.self){document.documentElement.style.display='none';try{window.top.location.replace(window.location.href)}catch(e){}return}
const SB=window.SBCreate({auth:true}), D=window.URKER_DATA;
// Выключатели разделов (config.js → features): вкладки и поля появляются после запуска 06 / 08 SQL
// подсказки браузера при проверке форм — по-русски / по-казахски (а не на языке браузера)
document.addEventListener('invalid',ev=>{const el=ev.target;if(!el||!el.setCustomValidity)return;el.setCustomValidity('');const kz=lang==='kz',v=el.validity;
 el.setCustomValidity(v.valueMissing?(kz?'Осы өрісті толтырыңыз':'Заполните это поле'):(el.type==='email'?(kz?'Дұрыс email енгізіңіз':'Введите корректный email'):(kz?'Өрістің дұрыс толтырылғанын тексеріңіз':'Проверьте, правильно ли заполнено поле')))},true);
['input','change'].forEach(n=>document.addEventListener(n,ev=>{const el=ev.target;if(el&&el.setCustomValidity)el.setCustomValidity('')},true));
const FEAT=(window.URKER_CONFIG||{}).features||{}, F_LIST=!!FEAT.listings, F_CLAIM=!!FEAT.claims;
const $=(s,r=document)=>r.querySelector(s), adm=$('#adm');
const detectLang=()=>{const s=localStorage.getItem('urker_lang');if(s==='kz'||s==='ru')return s;try{const l=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);return l.some(x=>/^(kk|kz)\b/i.test(String(x)))?'kz':'ru'}catch(e){return 'ru'}};
let lang=detectLang();
const T={ru:{title:'Уркер · Админка',login:'Вход в админку',pwBtn:'🔑 Пароль',pwTitle:'Пароль для входа',pwIntro:'Задайте пароль — потом можно входить по почте и паролю, без письма.',pwNew:'Новый пароль',pwRep:'Повторите пароль',pwShow:'Показать пароль',pwMin:'Не меньше 8 символов',pwSave:'Сохранить пароль',cancel:'Отмена',pwShort:'Пароль слишком короткий — нужно не меньше 8 символов.',pwMismatch:'Пароли не совпадают.',pwOk:'Пароль сохранён. Теперь можно входить по почте и паролю',pwWeak:'Пароль слишком простой. Добавьте буквы и цифры и сделайте его длиннее.',pwSame:'Этот пароль уже установлен. Придумайте другой.',pwReauth:'Для смены пароля нужно подтверждение по почте. Нажмите «Прислать код», введите код из письма и сохраните ещё раз.',pwSendCode:'✉️ Прислать код',pwCode:'Код из письма',pwCodeSent:'Код отправлен на почту.',pwBadCode:'Код неверный или устарел. Запросите новый.',pwRate:'Слишком много попыток. Подождите минуту и попробуйте снова.',pwSession:'Сессия истекла. Выйдите и войдите снова по ссылке из письма.',pwNet:'Нет связи с сервером. Проверьте интернет и попробуйте снова.',pwFail:'Не удалось сохранить пароль',or:'или',forgot:'Забыли пароль? — войдите по ссылке из письма',magicNoEmail:'Сначала введите почту.',showPass:'Показать пароль',hidePass:'Скрыть пароль',barT:'АДМИНКА',barAs:'вы вошли как',toSite:'← На сайт',docT:'🔐 Админка · Уркер',docLogin:'Вход в админку · Уркер',email:'Почта (email)',pass:'Пароль',signin:'Войти',magic:'Прислать ссылку для входа на почту',
 magicSent:'Ссылка для входа отправлена на почту.',badLogin:'Неверная почта или пароль. Если пароль ещё не задан — войдите по ссылке из письма.',noBackend:'База не подключена: заполните config.js (адрес и anon-ключ Supabase).',
 noAccess:'У этого аккаунта нет прав администратора.',logout:'Выйти',refresh:'Обновить',refreshT:'Обновить страницу',
 tabs:{stats:'📊 Статистика',pending:'Заявки',cards:'🔎 Все карточки',listings:'🗂 Объявления жителей',claims:'✔ Владельцы',news:'📰 Новости',reviews:'Отзывы',reports:'Сообщения',specs:'Специалисты',ann:'Объявления',ads:'Реклама'},
 approve:'Одобрить',reject:'Отклонить',save:'Сохранить',del:'Удалить',hide:'Скрыть',show:'Показать',edit:'Изменить',cancel:'Отмена',add:'+ Добавить',
 toAnn:'→ Сделать объявлением',done:'Обработано',saved:'Сохранено',deleted:'Удалено',confirmDel:'Удалить безвозвратно?',empty:'Пусто',
 needSub:'Выберите подкатегорию перед одобрением',search:'Поиск по имени, номеру, описанию…',cardsQ:'Поиск: имя, описание, адрес, телефон в любом виде (8 701…, +7 701…)',allSec:'Все разделы',allSub:'Все подкатегории',allSt:'Все статусы',foundN:n=>`Найдено: ${n}`,first200:'Показаны первые 200 — уточните поиск',src:{whatsapp_list:'из первого списка',submission:'заявка с сайта',admin:'добавлено админом'},lq:'Поиск: заголовок, текст, место, телефон',
 f:{name:'Имя / название',section_id:'Раздел',sub_id:'Подкатегория',note:'Описание на карточке',address:'Адрес',phone:'Телефон (8XXXXXXXXXX)',wa:'WhatsApp (7XXXXXXXXXX, пусто = из телефона)',
  recommended:'⭐ Рекомендован чатом',is_new:'🆕 Новый',vip:'📌 VIP / закреплён',vip_until:'VIP до (пусто = бессрочно)',sort_order:'Порядок',status:'Статус',admin_note:'Заметка админа',verified:'✔ Проверено (платный профиль в будущем)',business_name:'Название бизнеса',owner_name:'Имя владельца',instagram:'Instagram (handle без @)',gis_url:'Ссылка 2ГИС',hours:'Часы работы',descr_ru:'Описание RU (≤300)',descr_kz:'Описание KZ (≤300)',
  type:'Тип',title_ru:'Заголовок (RU)',title_kz:'Заголовок (KZ)',area_ru:'Улицы / район (RU)',area_kz:'Улицы / район (KZ)',source_ru:'Источник (RU)',source_kz:'Источник (KZ)',
  start_at:'Начало',end_at:'Окончание',urgent:'❗ Срочно',is_demo:'Пример (демо)',text_ru:'Текст (RU)',text_kz:'Текст (KZ)',emoji:'Эмодзи',link_url:'Ссылка (https://…)',
  active:'Включено',starts_at:'Показывать с',ends_at:'Показывать до',category:'Рубрика',lead_ru:'Кратко / анонс (RU)',lead_kz:'Кратко / анонс (KZ)',
  body_ru:'Полный текст (RU)',body_kz:'Полный текст (KZ)',video_url:'Видео: YouTube / Instagram',pinned:'📌 Закрепить сверху',publish_at:'Дата публикации'},
 cats:{event:'🎉 Событие',opening:'🏪 Открытие',achievement:'🏆 Достижение',improvement:'🌳 Благоустройство',akimat:'🏛 Акимат',other:'📰 Другое'},
 st:{pending:'на проверке',approved:'одобрено',rejected:'отклонено',hidden:'скрыто',draft:'черновик',published:'опубликовано',archived:'в архиве',done:'обработано'},
 types:{power:'⚡ Свет',water:'💧 Вода',gas:'🔥 Газ',repair:'🚧 Ремонт',other:'📢 Другое'},
 st_:{today:'Сегодня',d7:'7 дней',d30:'30 дней',visitors:'посетителей',views:'просмотров',daily:'По дням (30 дней)',searches:'Частые поиски',notFound:'Искали, но ничего не нашли',contacted:'Кому чаще пишут и звонят',devices:'Устройства',langs:'Язык',referrers:'Откуда приходят',pages:'Популярные страницы',mobile:'Телефон',desktop:'Компьютер',unknown:'неизвестно',times:'раз',results:'в ср. найдено',none:'Пока нет данных',calls:'звонков',privacy:'Анонимная статистика: без cookies и IP, посетитель — случайный id в браузере. Дни — по времени Астаны.',legendV:'посетители',legendN:'просмотры'},
 n:{sugg:'Предложения жителей',toNews:'→ Сделать новостью',addNews:'+ Новая новость',list:'Все новости',photos:'Фотографии',addPhotos:'📷 Добавить фото',uploading:'Загрузка фото…',
  cover:'Обложка',setCover:'★ Обложка',left:'←',right:'→',rm:'✕',publish:'Опубликовать',unpublish:'Снять с публикации',pin:'📌 Закрепить',unpin:'📌 Открепить',
  scheduled:'⏰ запланировано на',views:'просм.',needTitle:'Нужен заголовок хотя бы на одном языке',top:'📰 Популярные новости (30 дней)',sugFrom:'Предложение жителя',
  hintPhotos:'Фото сжимаются в браузере до ~1600 px (JPEG) и загружаются в хранилище Supabase. Первое фото или отмеченное ★ — обложка.',
  hintSched:'Дата публикации в будущем = новость появится на сайте автоматически в это время. Черновики видны только здесь.',
  hintVideo:'Ссылка на YouTube или Instagram (по желанию)',noTitle:'(без заголовка)',fromSug:'Фото из предложения перенесены в хранилище',photoErr:'Не удалось загрузить фото'},
 desc:'Что написал заявитель',wantsVip:'Хочет VIP/рекламу',consent:'Согласие на показ номера',stars:'Оценка',device:'Устройство',when:'Когда',contact:'Контакт',chooseSub:'— выберите —'},
 kz:{title:'Үркер · Әкімші беті',login:'Әкімші бетіне кіру',pwBtn:'🔑 Құпиясөз',pwTitle:'Кіруге арналған құпиясөз',pwIntro:'Құпиясөз орнатыңыз — кейін хатсыз, пошта мен құпиясөз арқылы кіре аласыз.',pwNew:'Жаңа құпиясөз',pwRep:'Құпиясөзді қайталаңыз',pwShow:'Құпиясөзді көрсету',pwMin:'Кемінде 8 таңба',pwSave:'Құпиясөзді сақтау',cancel:'Болдырмау',pwShort:'Құпиясөз тым қысқа — кемінде 8 таңба керек.',pwMismatch:'Құпиясөздер сәйкес емес.',pwOk:'Құпиясөз сақталды. Енді пошта мен құпиясөз арқылы кіруге болады',pwWeak:'Құпиясөз тым қарапайым. Әріптер мен сандар қосып, ұзағырақ етіңіз.',pwSame:'Бұл құпиясөз қазір де орнатылған. Басқасын ойлап табыңыз.',pwReauth:'Құпиясөзді ауыстыру үшін поштамен растау керек. «Код жіберу» батырмасын басып, хаттағы кодты енгізіп, қайта сақтаңыз.',pwSendCode:'✉️ Код жіберу',pwCode:'Хаттағы код',pwCodeSent:'Код поштаға жіберілді.',pwBadCode:'Код қате немесе ескірген. Жаңасын сұраңыз.',pwRate:'Әрекет тым көп. Бір минут күтіп, қайталап көріңіз.',pwSession:'Сессия аяқталды. Шығып, хаттағы сілтеме арқылы қайта кіріңіз.',pwNet:'Сервермен байланыс жоқ. Интернетті тексеріп, қайталап көріңіз.',pwFail:'Құпиясөзді сақтау мүмкін болмады',or:'немесе',forgot:'Құпиясөзді ұмыттыңыз ба? — хаттағы сілтеме арқылы кіріңіз',magicNoEmail:'Алдымен поштаны енгізіңіз.',showPass:'Құпиясөзді көрсету',hidePass:'Құпиясөзді жасыру',barT:'ӘКІМШІ БЕТІ',barAs:'кірдіңіз:',toSite:'← Сайтқа',docT:'🔐 Әкімші беті · Үркер',docLogin:'Әкімші бетіне кіру · Үркер',email:'Пошта (email)',pass:'Құпиясөз',signin:'Кіру',magic:'Кіру сілтемесін поштаға жіберу',
 magicSent:'Кіру сілтемесі поштаға жіберілді.',badLogin:'Пошта немесе құпиясөз қате. Құпиясөз әлі орнатылмаған болса — хаттағы сілтеме арқылы кіріңіз.',noBackend:'База қосылмаған: config.js файлын толтырыңыз (Supabase мекенжайы мен anon-кілті).',
 noAccess:'Бұл аккаунтта әкімші құқығы жоқ.',logout:'Шығу',refresh:'Жаңарту',refreshT:'Бетті жаңарту',
 tabs:{stats:'📊 Статистика',pending:'Өтінімдер',cards:'🔎 Барлық карточкалар',listings:'🗂 Тұрғындар хабарландырулары',claims:'✔ Иелер',news:'📰 Жаңалықтар',reviews:'Пікірлер',reports:'Хабарламалар',specs:'Мамандар',ann:'Хабарландырулар',ads:'Жарнама'},
 approve:'Мақұлдау',reject:'Қабылдамау',save:'Сақтау',del:'Жою',hide:'Жасыру',show:'Көрсету',edit:'Өзгерту',cancel:'Болдырмау',add:'+ Қосу',
 toAnn:'→ Хабарландыру жасау',done:'Өңделді',saved:'Сақталды',deleted:'Жойылды',confirmDel:'Біржола жою керек пе?',empty:'Бос',
 needSub:'Мақұлдамас бұрын ішкі бөлімді таңдаңыз',search:'Аты, нөмірі, сипаттамасы бойынша іздеу…',cardsQ:'Іздеу: аты, сипаттамасы, мекенжайы, кез келген түрдегі телефон (8 701…, +7 701…)',allSec:'Барлық бөлімдер',allSub:'Барлық ішкі бөлімдер',allSt:'Барлық мәртебелер',foundN:n=>`Табылды: ${n}`,first200:'Алғашқы 200 көрсетілді — іздеуді нақтылаңыз',src:{whatsapp_list:'алғашқы тізімнен',submission:'сайттағы өтінім',admin:'әкімші қосқан'},lq:'Іздеу: тақырып, мәтін, орны, телефон',
 f:{name:'Аты / атауы',section_id:'Бөлім',sub_id:'Ішкі бөлім',note:'Карточкадағы сипаттама',address:'Мекенжай',phone:'Телефон (8XXXXXXXXXX)',wa:'WhatsApp (7XXXXXXXXXX, бос болса — телефоннан)',
  recommended:'⭐ Чат ұсынған',is_new:'🆕 Жаңа',vip:'📌 VIP / бекітілген',vip_until:'VIP мерзімі (бос — шектеусіз)',sort_order:'Реті',status:'Мәртебесі',admin_note:'Әкімші жазбасы',verified:'✔ Тексерілген (болашақта ақылы профиль)',business_name:'Бизнес атауы',owner_name:'Иесінің аты',instagram:'Instagram (@-сыз)',gis_url:'2ГИС сілтемесі',hours:'Жұмыс уақыты',descr_ru:'Сипаттама RU (≤300)',descr_kz:'Сипаттама KZ (≤300)',
  type:'Түрі',title_ru:'Тақырыбы (RU)',title_kz:'Тақырыбы (KZ)',area_ru:'Көшелер / аудан (RU)',area_kz:'Көшелер / аудан (KZ)',source_ru:'Дереккөз (RU)',source_kz:'Дереккөз (KZ)',
  start_at:'Басталуы',end_at:'Аяқталуы',urgent:'❗ Шұғыл',is_demo:'Мысал (демо)',text_ru:'Мәтін (RU)',text_kz:'Мәтін (KZ)',emoji:'Эмодзи',link_url:'Сілтеме (https://…)',
  active:'Қосулы',starts_at:'Көрсету басталуы',ends_at:'Көрсету аяқталуы',category:'Айдар',lead_ru:'Қысқаша / анонс (RU)',lead_kz:'Қысқаша / анонс (KZ)',
  body_ru:'Толық мәтін (RU)',body_kz:'Толық мәтін (KZ)',video_url:'Бейне: YouTube / Instagram',pinned:'📌 Жоғарыға бекіту',publish_at:'Жариялау күні'},
 cats:{event:'🎉 Іс-шара',opening:'🏪 Ашылу',achievement:'🏆 Жетістік',improvement:'🌳 Абаттандыру',akimat:'🏛 Әкімдік',other:'📰 Басқа'},
 st:{pending:'тексеруде',approved:'мақұлданды',rejected:'қабылданбады',hidden:'жасырылды',draft:'жоба',published:'жарияланды',archived:'мұрағатта',done:'өңделді'},
 types:{power:'⚡ Жарық',water:'💧 Су',gas:'🔥 Газ',repair:'🚧 Жөндеу',other:'📢 Басқа'},
 st_:{today:'Бүгін',d7:'7 күн',d30:'30 күн',visitors:'келуші',views:'қаралым',daily:'Күндер бойынша (30 күн)',searches:'Жиі іздегендер',notFound:'Іздеді, бірақ ештеңе таппады',contacted:'Кімге жиі жазады және қоңырау шалады',devices:'Құрылғылар',langs:'Тіл',referrers:'Қайдан келеді',pages:'Танымал беттер',mobile:'Телефон',desktop:'Компьютер',unknown:'белгісіз',times:'рет',results:'орташа табылғаны',none:'Әзірге дерек жоқ',calls:'қоңырау',privacy:'Анонимді статистика: cookies пен IP жоқ, келуші — браузердегі кездейсоқ id. Күндер Астана уақытымен.',legendV:'келушілер',legendN:'қаралымдар'},
 n:{sugg:'Тұрғындардың ұсыныстары',toNews:'→ Жаңалық жасау',addNews:'+ Жаңа жаңалық',list:'Барлық жаңалықтар',photos:'Фотосуреттер',addPhotos:'📷 Фото қосу',uploading:'Фото жүктелуде…',
  cover:'Мұқаба',setCover:'★ Мұқаба',left:'←',right:'→',rm:'✕',publish:'Жариялау',unpublish:'Жариялаудан алу',pin:'📌 Бекіту',unpin:'📌 Босату',
  scheduled:'⏰ жоспарланған уақыты',views:'қаралым',needTitle:'Кемінде бір тілде тақырып керек',top:'📰 Танымал жаңалықтар (30 күн)',sugFrom:'Тұрғынның ұсынысы',
  hintPhotos:'Фотолар браузерде ~1600 px-ке дейін сығылады (JPEG) және Supabase қоймасына жүктеледі. Бірінші немесе ★ белгіленген фото — мұқаба.',
  hintSched:'Жариялау күні болашақта болса, жаңалық сол уақытта сайтта өздігінен шығады. Жобаларды тек осы жерде көресіз.',
  hintVideo:'YouTube немесе Instagram сілтемесі (міндетті емес)',noTitle:'(тақырыпсыз)',fromSug:'Ұсыныстағы фотолар қоймаға көшірілді',photoErr:'Фотоны жүктеу мүмкін болмады'},
 desc:'Өтініш берушінің жазғаны',wantsVip:'VIP/жарнама қалайды',consent:'Нөмірді көрсетуге келісім',stars:'Баға',device:'Құрылғы',when:'Қашан',contact:'Байланыс',chooseSub:'— таңдаңыз —'}};
// общий счётчик «🔔 Новое: N» над вкладками
Object.assign(T.ru,{newT:'🔔 Новое',noNew:'✅ Новых нет',newAria:'Ждут проверки',nb:{pending:'Заявки',listings:'Объявления жителей',news:'Предложения новостей',reviews:'Отзывы',reports:'Сообщения',claims:'Заявки владельцев'}});
Object.assign(T.kz,{newT:'🔔 Жаңа',noNew:'✅ Жаңа жоқ',newAria:'Тексеруді күтуде',nb:{pending:'Өтінімдер',listings:'Тұрғындар хабарландырулары',news:'Жаңалық ұсыныстары',reviews:'Пікірлер',reports:'Хабарламалар',claims:'Иелер өтінімдері'}});
Object.assign(T.ru,{shareA:'📲 Отправить автору',shareT:'Отправить автору ссылку в WhatsApp',approvedL:'✅ Объявление одобрено',approvedC:'✅ Карточка одобрена',closeX:'Закрыть'});
Object.assign(T.kz,{shareA:'📲 Авторға жіберу',shareT:'Авторға сілтемені WhatsApp-қа жіберу',approvedL:'✅ Хабарландыру мақұлданды',approvedC:'✅ Карточка мақұлданды',closeX:'Жабу'});
// «📲 Отправить автору»: поздравление KZ + RU со ссылкой на опубликованное (без секретного токена автора)
const PUB='https://urker24.kz/';
const pubLink=(kind,r)=>kind==='l'?PUB+'#/item/'+r.id:PUB+'#/c/'+encodeURIComponent(r.section_id)+'/'+encodeURIComponent(r.sub_id)+'/'+r.id;
function shareUrl(kind,r){
 if(!r||r.status!=='approved')return '';
 const ph=kind==='l'?(/^7\d{10}$/.test(String(r.phone||''))?String(r.phone):null):(normWa(r.wa)||normWa(r.phone));
 if(!ph||(kind==='c'&&!(r.section_id&&r.sub_id)))return '';
 const u=pubLink(kind,r),nm=String((kind==='l'?r.title:(r.name||r.business_name))||'').trim(),q=nm?' «'+nm+'»':'';
 const msg=kind==='l'
  ?`Құттықтаймыз! Сіздің${q} хабарландыруыңыз urker24.kz сайтында жарияланды. Сілтемемен бөлісіңіз: ${u}\n\nПоздравляем! Ваше объявление${q} размещено на urker24.kz. Делитесь ссылкой: ${u}`
  :`Құттықтаймыз! Сіздің${q} карточка-визиткаңыз urker24.kz сайтында жарияланды. Сілтемемен бөлісіңіз: ${u}\n\nПоздравляем! Ваша карточка-визитка${q} размещена на urker24.kz. Делитесь ссылкой: ${u}`;
 return 'https://api.whatsapp.com/send?phone='+ph+'&text='+encodeURIComponent(msg)}
const shareBtn=(kind,r)=>{const h=shareUrl(kind,r);return h?`<a class="b ok wa-share" target="_blank" rel="noopener" href="${esc(h)}" title="${esc(t('shareT'))}">${t('shareA')}</a>`:''};
let JUST=null;  // только что одобренное: {kind,row} — плашка над списком с кнопкой «📲 Отправить автору»
const t=k=>T[lang][k];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tt;const toast=(m,ms)=>{const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,ms||3500)};
const secT=s=>lang==='kz'?s.title_kz:s.title_ru;
const subs=sec=>((D.sections.find(s=>s.id===sec)||{}).subs||[]);
const subT=id=>{for(const s of D.sections)for(const x of s.subs)if(x.id===id)return x.implicit?secT(s):(lang==='kz'?x.title_kz:x.title);return id||'—'};
const fmtDT=iso=>iso?new Date(iso).toLocaleString('ru-RU',{timeZone:'Asia/Almaty',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
const toLocalInput=iso=>iso?new Date(new Date(iso).getTime()+5*3600e3).toISOString().slice(0,16):'';
const fromLocalInput=v=>v?v+':00+05:00':null;
const normWa=p=>{const d=String(p||'').replace(/\D/g,'');if(/^8\d{10}$/.test(d)&&!/^8800/.test(d))return '7'+d.slice(1);if(/^7\d{10}$/.test(d))return d;return null};
let tab='stats',editing=null,filterQ='',CACHE={};
// кнопка «🔄 Обновить»: перезагрузка с ?r=<время> и #tab=<вкладка> — после загрузки возвращаем вкладку и чистим адрес
try{const m=/^#tab=([a-z]+)$/.exec(location.hash);if(m&&T.ru.tabs[m[1]])tab=m[1];if(m||/[?&]r=\d/.test(location.search))history.replaceState(null,'',location.pathname)}catch(e){}

// ---------- generic editor ----------
function field(name,val,kind,opts){
 if(kind==='long')return `<div class="full"><label>${esc(t('f')[name]||name)}</label><textarea name="${name}" rows="${opts&&opts.rows||8}">${esc(val)}</textarea></div>`;
 const L=t('f')[name]||name;
 if(kind==='bool')return `<div><label class="ck"><input type="checkbox" name="${name}" ${val?'checked':''}> ${esc(L)}</label></div>`;
 if(kind==='select')return `<div><label>${esc(L)}</label><select name="${name}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`).join('')}</select></div>`;
 if(kind==='text')return `<div class="full"><label>${esc(L)}</label><textarea name="${name}" rows="2">${esc(val)}</textarea></div>`;
 if(kind==='dt')return `<div><label>${esc(L)} <small>(Астана)</small></label><input type="datetime-local" name="${name}" value="${esc(toLocalInput(val))}"></div>`;
 if(kind==='num')return `<div><label>${esc(L)}</label><input type="number" name="${name}" value="${esc(val)}"></div>`;
 return `<div class="${opts&&opts.full?'full':''}"><label>${esc(L)}</label><input name="${name}" value="${esc(val)}"></div>`;
}
function collect(form,spec){const o={};for(const [n,k] of spec){const el=form.elements[n];if(!el)continue;
 if(k==='bool')o[n]=el.checked;else if(k==='dt')o[n]=fromLocalInput(el.value);else if(k==='long')o[n]=el.value.replace(/\r/g,'').trim();else if(k==='num')o[n]=el.value===''?0:+el.value;else o[n]=el.value.trim()}return o}
const SPEC_SPEC=()=>[['name'],['phone'],['section_id','select',D.sections.map(s=>[s.id,s.emoji+' '+secT(s)])],['sub_id','select'],['note','text'],['address',null,{full:true}],['wa'],
 ['sort_order','num'],['recommended','bool'],['is_new','bool'],['vip','bool'],['vip_until','dt'],...(F_CLAIM?[['verified','bool'],['business_name'],['owner_name'],['instagram'],['gis_url',null,{full:true}],['hours'],['descr_ru','text'],['descr_kz','text']]:[]),['status','select',['pending','approved','rejected','hidden'].map(s=>[s,t('st')[s]])],['admin_note','text']];
const ANN_SPEC=()=>[['type','select',Object.keys(T.ru.types).map(k=>[k,t('types')[k]])],['status','select',['draft','published','archived'].map(s=>[s,t('st')[s]])],
 ['title_ru',null,{full:true}],['title_kz',null,{full:true}],['area_ru'],['area_kz'],['source_ru'],['source_kz'],['start_at','dt'],['end_at','dt'],['urgent','bool']];
const AD_SPEC=()=>[['emoji'],['active','bool'],['title_ru'],['title_kz'],['text_ru','text'],['text_kz','text'],['link_url',null,{full:true}],['wa'],['starts_at','dt'],['ends_at','dt'],['sort_order','num']];
function editor(spec,row,extraBtns){
 return `<form class="ed" data-ed>${spec.map(([n,k,o])=>{
   if(n==='sub_id')return field('sub_id',row.sub_id,'select',[['',t('chooseSub')]].concat(subs(row.section_id).map(x=>[x.id,x.implicit?secT(D.sections.find(s=>s.id===row.section_id)):(lang==='kz'?x.title_kz:x.title)])));
   return field(n,row[n],k,o)}).join('')}
  <div class="full acts" style="display:flex;gap:8px;flex-wrap:wrap"><button class="b pri" data-act="save">${t('save')}</button>${extraBtns||''}<button type="button" class="b" data-act="cancel">${t('cancel')}</button></div></form>`;
}

// ---------- data ----------
const NB_KEYS=['pending','listings','claims','news','reviews','reports'];
const nbKeys=()=>NB_KEYS.filter(k=>(k!=='listings'||F_LIST)&&(k!=='claims'||F_CLAIM));
let NB_RPC=true;
async function counts(){
 if(NB_RPC){try{const o=await SB.rpc('admin_counts',{});if(o&&typeof o==='object'){const c={};for(const k of nbKeys())c[k]=+o[k]||0;return c}}catch(e){if(e&&(e.errorCode==='PGRST202'||e.status===404||/could not find the function/i.test(String(e.message))))NB_RPC=false;else throw e}}  // 13_admin_counts.sql ещё не запущен — считаем по таблицам
 const [p,r,m,n]=await Promise.all([SB.get('specialists?select=id&status=eq.pending'),SB.get('reviews?select=id&status=eq.pending'),SB.get('reports?select=id&status=eq.pending'),
  SB.get('news_suggestions?select=id&status=eq.pending').catch(()=>[])]);
 const l=F_LIST?await SB.get('listings?select=id&status=eq.pending').catch(()=>[]):[];const cl=F_CLAIM?await SB.get('spec_claims?select=id&status=eq.pending').catch(()=>[]):[];
 const all={pending:p.length,reviews:r.length,reports:m.length,news:n.length,listings:l.length,claims:cl.length},c={};for(const k of nbKeys())c[k]=all[k];return c;
}
async function specNames(){if(!CACHE.names){const rows=await SB.get('specialists?select=id,name,phone,sub_id');CACHE.names=Object.fromEntries(rows.map(r=>[r.id,r]))}return CACHE.names}

// ---------- views ----------
// ---------- объявления жителей ----------
const LS_T={ru:{tab:'🗂 Объявления жителей',pm:{negotiable:'договорная',free:'даром',none:''},settings:'Настройки',premod:'Премодерация (новые объявления ждут проверки)',ttl:'Срок показа, дней',ttlLost:'Потеряшки, дней',paid:'Платные «поднять/выделить» (пока выключено, оплаты нет)',
  st:{pending:'на проверке',approved:'опубликовано',closed:'закрыто',rejected:'отклонено',deleted:'удалено автором',expired:'истёк срок'},sec:{market:'🛍 Барахолка',ads:'📋 Объявления',lost:'🐾 Потеряшки'},
  all:'Все',approve:'Одобрить',reject:'Отклонить',hl:'⭐ Выделить',unhl:'⭐ Снять выделение',bump:'⬆ Поднять',extend:'+30 дней',alink:'🔑 Ссылка для автора',alinkConfirm:'Создать новую секретную ссылку для автора? Прежняя ссылка этого объявления (если была) перестанет работать.',alinkNote:'Ссылка показывается один раз. Отправьте её автору — по ней он сможет изменить, продлить, закрыть или удалить своё объявление.',alinkCopy:'📋 Скопировать',alinkWa:'💬 Отправить автору в WhatsApp',alinkCopied:'Скопировано',purge:'🧹 Удалить фото снятых объявлений',purged:n=>`Удалено фото: ${n}`,
  views:'просм.',until:'до',bumped:'поднято',noPhotos:'без фото',f:{title:'Заголовок',body:'Описание',kind:'Тип',category:'Категория',price:'Цена, ₸',price_mode:'Цена: режим',place:'Где',event_date:'Когда',phone:'Телефон (7XXXXXXXXXX)',has_wa:'Есть WhatsApp',admin_note:'Заметка админа',verified:'✔ Проверено (платный профиль в будущем)',business_name:'Название бизнеса',owner_name:'Имя владельца',instagram:'Instagram (handle без @)',gis_url:'Ссылка 2ГИС',hours:'Часы работы',descr_ru:'Описание RU (≤300)',descr_kz:'Описание KZ (≤300)',expires_at:'Показывать до',status:'Статус'}},
 kz:{tab:'🗂 Тұрғындар хабарландырулары',pm:{negotiable:'келісім бойынша',free:'тегін',none:''},settings:'Баптаулар',premod:'Алдын ала модерация (жаңа хабарландырулар тексеруді күтеді)',ttl:'Көрсету мерзімі, күн',ttlLost:'Жоғалғандар, күн',paid:'Ақылы «көтеру/ерекшелеу» (әзірге өшірулі, төлем жоқ)',
  st:{pending:'тексеруде',approved:'жарияланды',closed:'жабылды',rejected:'қабылданбады',deleted:'автор жойды',expired:'мерзімі өтті'},sec:{market:'🛍 Барахолка',ads:'📋 Хабарландырулар',lost:'🐾 Жоғалғандар'},
  all:'Барлығы',approve:'Мақұлдау',reject:'Қабылдамау',hl:'⭐ Ерекшелеу',unhl:'⭐ Ерекшелеуді алу',bump:'⬆ Көтеру',extend:'+30 күн',alink:'🔑 Авторға сілтеме',alinkConfirm:'Авторға жаңа құпия сілтеме жасау керек пе? Бұл хабарландырудың бұрынғы сілтемесі (болса) жұмыс істемейді.',alinkNote:'Сілтеме бір рет көрсетіледі. Оны авторға жіберіңіз — сол арқылы ол хабарландыруын өзгерте, ұзарта, жаба немесе жоя алады.',alinkCopy:'📋 Көшіру',alinkWa:'💬 Авторға WhatsApp-қа жіберу',alinkCopied:'Көшірілді',purge:'🧹 Алынған хабарландырулардың фотоларын жою',purged:n=>`Жойылған фото: ${n}`,
  views:'қаралым',until:'дейін',bumped:'көтерілген',noPhotos:'фотосыз',f:{title:'Тақырыбы',body:'Сипаттамасы',kind:'Түрі',category:'Санаты',price:'Бағасы, ₸',price_mode:'Баға режимі',place:'Қайда',event_date:'Қашан',phone:'Телефон (7XXXXXXXXXX)',has_wa:'WhatsApp бар',admin_note:'Әкімші жазбасы',verified:'✔ Тексерілген (болашақта ақылы профиль)',business_name:'Бизнес атауы',owner_name:'Иесінің аты',instagram:'Instagram (@-сыз)',gis_url:'2ГИС сілтемесі',hours:'Жұмыс уақыты',descr_ru:'Сипаттама RU (≤300)',descr_kz:'Сипаттама KZ (≤300)',expires_at:'Көрсету мерзімі',status:'Мәртебесі'}}};
const LT=()=>LS_T[lang];
const L_LBL={"ru":{"k":{"sell":"Продам","buy":"Куплю","free":"Отдам даром","rent_offer":"Сдам","rent_seek":"Сниму","job_offer":"Вакансия","job_seek":"Ищу работу","gig":"Подработка","service":"Услуги частных лиц","ride":"Попутчики","other":"Разное","lost":"Потерял","found":"Нашёл"},"c":{"market":{"kids":"Детское","clothes":"Одежда","tech":"Техника","furniture":"Мебель","home":"Для дома и дачи","auto":"Авто и запчасти","animals":"Животные и скот","build":"Стройматериалы","other":"Прочее"},"ads":{"house":"Дом","flat":"Квартира","room":"Комната","garage":"Гараж","equipment":"Техника","other":"Другое"},"lost":{"animals":"Животные","docs":"Документы","keys":"Ключи","things":"Вещи","other":"Другое"}}},"kz":{"k":{"sell":"Сатамын","buy":"Сатып аламын","free":"Тегін беремін","rent_offer":"Жалға беремін","rent_seek":"Жалға аламын","job_offer":"Бос жұмыс орны","job_seek":"Жұмыс іздеймін","gig":"Қосымша жұмыс","service":"Жеке қызметтер","ride":"Жолсеріктер","other":"Әртүрлі","lost":"Жоғалттым","found":"Таптым"},"c":{"market":{"kids":"Балаларға","clothes":"Киім","tech":"Техника","furniture":"Жиһаз","home":"Үй мен саяжайға","auto":"Көлік және бөлшектер","animals":"Жануарлар мен мал","build":"Құрылыс материалдары","other":"Басқа"},"ads":{"house":"Үй","flat":"Пәтер","room":"Бөлме","garage":"Гараж","equipment":"Техника","other":"Басқа"},"lost":{"animals":"Жануарлар","docs":"Құжаттар","keys":"Кілттер","things":"Заттар","other":"Басқа"}}}};
const lKindT=r=>(L_LBL[lang].k||{})[r.kind]||r.kind,lCatT=r=>((L_LBL[lang].c||{})[r.section]||{})[r.category]||r.category;
const L_KINDS={market:['sell','buy','free'],ads:['rent_offer','rent_seek','job_offer','job_seek','gig','service','ride','other'],lost:['lost','found']};
const L_CATS={market:['kids','clothes','tech','furniture','home','auto','animals','build','other'],ads:['house','flat','room','garage','equipment','other'],lost:['animals','docs','keys','things','other']};
let LF={status:'pending',section:'',q:''};
const digitsOf=x=>String(x||'').replace(/\D/g,'');
const normQ=x=>String(x||'').toLowerCase().replace(/ё/g,'е');
function textHit(q,parts,phones){q=String(q||'').trim();if(!q)return true;const hay=normQ(parts.join(' '));
 if(normQ(q).split(/\s+/).filter(Boolean).every(w=>hay.includes(w)))return true;
 if(/^[\d\s+()\-]+$/.test(q)){const qd=digitsOf(q);if(qd.length<3)return false;const core=qd.length>=10?qd.slice(-10):qd;return phones.map(digitsOf).some(x=>x&&(x.includes(qd)||x.includes(core)))}
 return false}
const lPhoto=p=>p&&p.path?SB.publicUrl('listings',p.path):'';
async function vListings(box){
 const L=LT();
 const [set]=await SB.get('listing_settings?select=*');
 let q='listings?select=*&order=created_at.desc&limit=300';
 if(LF.status==='expired')q+='&status=eq.approved&expires_at=lt.'+new Date().toISOString();else if(LF.status)q+='&status=eq.'+LF.status;
 if(LF.section)q+='&section=eq.'+LF.section;
 const rows=(await SB.get(q)).filter(r=>textHit(LF.q,[r.title,r.body,r.place,r.admin_note,String(r.id)],[r.phone]));const now=Date.now();
 box.innerHTML=`<details class="row"><summary><b>⚙️ ${L.settings}</b> — ${set.premoderation?'✅':'⚠️'} ${esc(L.premod)}</summary><form class="ed" id="lset">
   <div class="full"><label class="ck"><input type="checkbox" name="premoderation" ${set.premoderation?'checked':''}> ${esc(L.premod)}</label></div>
   <div><label>${L.ttl}</label><input type="number" name="ttl_days" min="1" max="365" value="${set.ttl_days}"></div><div><label>${L.ttlLost}</label><input type="number" name="ttl_lost_days" min="1" max="365" value="${set.ttl_lost_days}"></div>
   <div class="full"><label class="ck"><input type="checkbox" name="paid_features" disabled ${set.paid_features?'checked':''}> ${esc(L.paid)}</label></div>
   <div class="full acts"><button class="b pri">${t('save')}</button> <button type="button" class="b" id="purge">${L.purge}</button></div></form></details>
  <div class="tabs">${['pending','approved','closed','expired','rejected','deleted',''].map(s=>`<button data-ls="${s}" class="${LF.status===s?'on':''}">${s?L.st[s]:L.all}</button>`).join('')}</div>
  <div class="tabs">${['','market','ads','lost'].map(s=>`<button data-lsec="${s}" class="${LF.section===s?'on':''}">${s?L.sec[s]:L.all}</button>`).join('')}</div>
  <input class="filter" id="lq" placeholder="${esc(t('lq'))}" value="${esc(LF.q)}">${LF.q?`<div class="meta">${t('foundN')(rows.length)}</div>`:''}`
  +(rows.length?rows.map(r=>{const exp=new Date(r.expires_at).getTime()<now;const ph=(r.photos||[]);return `<div class="row lrow" data-id="${r.id}">
   ${ph[0]?`<img class="lthumb" src="${esc(lPhoto(ph[0]))}" alt="">`:`<div class="lthumb ph">${L.sec[r.section].split(' ')[0]}</div>`}
   <div class="lmain"><h3>${r.highlighted?'⭐ ':''}${esc(r.title)}</h3>
   <div class="meta">${pill(r.status)}${exp&&r.status==='approved'?`<span class="pill rejected">${L.st.expired}</span>`:''} ${esc(L.sec[r.section])} · ${esc(lKindT(r))} · ${esc(lCatT(r))} · ${r.price_mode==='fixed'?esc(Number(r.price).toLocaleString('ru-RU').replace(/\s/g,' '))+' ₸ · ':(L.pm[r.price_mode]?esc(L.pm[r.price_mode])+' · ':'')}📞 ${esc(r.phone)}${r.has_wa?' (WA)':''}
    · ${fmtDT(r.created_at)} · ${L.until} ${fmtDT(r.expires_at)} · 👁 ${r.views} · 🖼 ${ph.length||L.noPhotos}${r.bumped_at?` · ⬆ ${L.bumped} ${fmtDT(r.bumped_at)}`:''}${r.device_id?` · ${t('device')}: ${esc(String(r.device_id).slice(0,8))}`:''}</div>
   ${r.body?`<p class="pre">${esc(r.body)}</p>`:''}${r.place?`<p>📍 ${esc(r.place)}${r.event_date?' · 🗓 '+esc(r.event_date):''}</p>`:''}
   ${ph.length?`<div class="pgrid sm">${ph.map(p=>`<div class="ph"><img src="${esc(lPhoto(p))}" alt=""></div>`).join('')}</div>`:''}
   <div class="acts">${r.status==='pending'?`<button class="b ok" data-a="approved">${L.approve}</button><button class="b no" data-a="rejected">${L.reject}</button>`:''}
    ${r.status==='approved'?`<button class="b" data-a="rejected">${t('hide')}</button>`+shareBtn('l',r):''}${['rejected','deleted','closed'].includes(r.status)?`<button class="b ok" data-a="approved">${t('show')}</button>`:''}
    <button class="b" data-a="edit">${t('edit')}</button><button class="b sec" data-a="hl">${r.highlighted?L.unhl:L.hl}</button><button class="b" data-a="bump">${L.bump}</button><button class="b" data-a="extend">${L.extend}</button>${r.status!=='deleted'?`<button class="b" data-a="alink">${L.alink}</button>`:''}
    <button class="b no" data-a="del">${t('del')}</button></div></div><div class="slot full"></div></div>`}).join(''):`<div class="row">${t('empty')}</div>`);
 box.querySelectorAll('[data-ls]').forEach(b=>b.onclick=()=>{LF.status=b.dataset.ls;vListings(box)});
 {const lq=$('#lq');lq.oninput=()=>{LF.q=lq.value;clearTimeout(lq._t);lq._t=setTimeout(()=>vListings(box).then(()=>{const n=$('#lq');n.focus();n.setSelectionRange(n.value.length,n.value.length)}),300)}}
 box.querySelectorAll('[data-lsec]').forEach(b=>b.onclick=()=>{LF.section=b.dataset.lsec;vListings(box)});
 $('#lset').onsubmit=async ev=>{ev.preventDefault();const f=ev.target;try{await SB.update('listing_settings','id=eq.1',{premoderation:f.elements.premoderation.checked,ttl_days:+f.elements.ttl_days.value||30,ttl_lost_days:+f.elements.ttl_lost_days.value||60});toast(t('saved'));render()}catch(e){toast(e.message)}};
 $('#purge').onclick=async()=>{try{const old=await SB.get('listings?select=id,photos,status,expires_at&or=(status.in.(deleted,rejected),expires_at.lt.'+new Date(Date.now()-30*864e5).toISOString()+',closed_at.lt.'+new Date(Date.now()-30*864e5).toISOString()+')');
   let n=0;for(const r of old){if(!(r.photos||[]).length)continue;for(const p of r.photos){if(p.path){await SB.removeFile('listings',p.path).catch(()=>{});n++}}await SB.update('listings','id=eq.'+r.id,{photos:[]})}toast(LT().purged(n));vListings(box)}catch(e){toast(e.message)}};
 box.querySelectorAll('.lrow').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id);el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  try{if(a==='approved'||a==='rejected'){await SB.update('listings','id=eq.'+r.id,{status:a});JUST=a==='approved'?{kind:'l',row:Object.assign({},r,{status:'approved'})}:null}
   if(a==='hl')await SB.update('listings','id=eq.'+r.id,{highlighted:!r.highlighted});
   if(a==='bump')await SB.update('listings','id=eq.'+r.id,{bumped_at:new Date().toISOString()});
   if(a==='extend')await SB.update('listings','id=eq.'+r.id,{expires_at:new Date(Math.max(Date.now(),new Date(r.expires_at).getTime())+30*864e5).toISOString()});
   if(a==='alink'){if(!confirm(L.alinkConfirm))return;const tok=await SB.rpc('admin_listing_author_token',{p_id:r.id});const link=location.origin+location.pathname.replace(/admin\.html$/,'')+'#/my/'+r.id+'/'+tok;
    const msg=(r.lang==='kz'?'Сәлеметсіз бе! Сіздің «{t}» хабарландыруыңыз urker24.kz сайтында. Осы сілтеме арқылы оны өзгертуге, ұзартуға, жабуға немесе жоюға болады (сілтемені ешкімге бермеңіз): {u}':'Здравствуйте! Ваше объявление «{t}» размещено на сайте urker24.kz. По этой ссылке вы можете изменить, продлить, закрыть или удалить его (никому её не передавайте): {u}').replace('{t}',()=>r.title).replace('{u}',()=>link);
    const slot=el.querySelector('.slot');slot.innerHTML=`<div class="ed"><div class="full"><p>🔑 ${esc(L.alinkNote)}</p><input id="al${r.id}" readonly value="${esc(link)}" style="width:100%"></div>
     <div class="full acts"><button type="button" class="b" data-cp="1">${L.alinkCopy}</button> <a class="b ok" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?phone=${esc(r.phone)}&text=${encodeURIComponent(msg)}">${L.alinkWa}</a></div></div>`;
    slot.querySelector('[data-cp]').onclick=async()=>{const i=slot.querySelector('input');i.select();try{await navigator.clipboard.writeText(i.value)}catch(e){document.execCommand&&document.execCommand('copy')}toast(L.alinkCopied)};return}
   if(a==='del'){if(!confirm(t('confirmDel')))return;for(const p of (r.photos||[]))if(p.path)await SB.removeFile('listings',p.path).catch(()=>{});await SB.remove('listings','id=eq.'+r.id);toast(t('deleted'));return vListings(box)}
   if(a==='edit'){const slot=el.querySelector('.slot');const F=LT().f;
    const sel=(n,opts,v)=>`<div><label>${F[n]}</label><select name="${n}">${opts.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('')}</select></div>`;
    slot.innerHTML=`<form class="ed"><div class="full"><label>${F.title}</label><input name="title" value="${esc(r.title)}"></div><div class="full"><label>${F.body}</label><textarea name="body" rows="4">${esc(r.body)}</textarea></div>
     ${sel('kind',L_KINDS[r.section],r.kind)}${sel('category',L_CATS[r.section],r.category)}${sel('price_mode',['fixed','negotiable','free','none'],r.price_mode)}<div><label>${F.price}</label><input name="price" type="number" value="${r.price??''}"></div>
     <div><label>${F.place}</label><input name="place" value="${esc(r.place)}"></div><div><label>${F.phone}</label><input name="phone" value="${esc(r.phone)}"></div>
     <div><label class="ck"><input type="checkbox" name="has_wa" ${r.has_wa?'checked':''}> ${F.has_wa}</label></div><div class="full"><label>${F.admin_note}</label><input name="admin_note" value="${esc(r.admin_note)}"></div>
     <div class="full acts"><button class="b pri">${t('save')}</button><button type="button" class="b" data-x>${t('cancel')}</button></div></form>`;
    const f=slot.querySelector('form');f.querySelector('[data-x]').onclick=()=>{slot.innerHTML=''};
    f.onsubmit=async e=>{e.preventDefault();const v=Object.fromEntries(['title','body','kind','category','price_mode','place','phone','admin_note'].map(n=>[n,f.elements[n].value.trim()]));
     v.price=v.price_mode==='fixed'&&f.elements.price.value!==''?+f.elements.price.value:null;v.has_wa=f.elements.has_wa.checked;
     try{await SB.update('listings','id=eq.'+r.id,v);toast(t('saved'));vListings(box)}catch(err){toast(err.message)}};return}
   toast(t('saved'));render()}catch(e){toast(e.message)}}});
}
// ---------- заявки владельцев («Это ваш бизнес?») ----------
const CL_T={ru:{tab:'✔ Владельцы',settings:'Платные функции профиля (на будущее)',photosFree:'Фото работ бесплатно (сейчас — да)',paid:'Платные профили «✔ Проверено» (оплаты пока нет)',
  match:'✅ Телефон совпадает с карточкой — вероятно владелец',nomatch:'⚠️ Телефон не совпадает — проверьте вручную (позвоните по номеру карточки)',apply:'✔ Применить к карточке',reject:'Отклонить',del:'Удалить',
  verify:'✔ Отметить «Проверено»',unverify:'Снять «Проверено»',applied:'Данные перенесены в карточку',now:'Сейчас на карточке',claim:'Заявка',st:{pending:'на проверке',approved:'применено',rejected:'отклонено'},
  f:{owner_name:'Имя владельца',business_name:'Название',instagram:'Instagram',gis_url:'2ГИС',hours:'Часы',descr_ru:'Описание RU',descr_kz:'Описание KZ',phone:'Телефон заявителя'}},
 kz:{tab:'✔ Иелер',settings:'Профильдің ақылы функциялары (болашақта)',photosFree:'Жұмыс фотолары тегін (қазір — иә)',paid:'«✔ Тексерілген» ақылы профильдер (әзірге төлем жоқ)',
  match:'✅ Телефон карточкамен сәйкес — иесі болуы ықтимал',nomatch:'⚠️ Телефон сәйкес емес — қолмен тексеріңіз (карточкадағы нөмірге қоңырау шалыңыз)',apply:'✔ Карточкаға қолдану',reject:'Қабылдамау',del:'Жою',
  verify:'✔ «Тексерілген» деп белгілеу',unverify:'«Тексерілген» белгісін алу',applied:'Деректер карточкаға көшірілді',now:'Қазір карточкада',claim:'Өтінім',st:{pending:'тексеруде',approved:'қолданылды',rejected:'қабылданбады'},
  f:{owner_name:'Иесінің аты',business_name:'Атауы',instagram:'Instagram',gis_url:'2ГИС',hours:'Уақыты',descr_ru:'Сипаттама RU',descr_kz:'Сипаттама KZ',phone:'Өтініш берушінің телефоны'}}};
let CLF='pending';
async function vClaims(box){
 const L=CL_T[lang];const [set]=await SB.get('claim_settings?select=*');
 const rows=await SB.get('spec_claims?select=*&order=created_at.desc&limit=200'+(CLF?'&status=eq.'+CLF:''));
 const ids=[...new Set(rows.map(r=>r.specialist_id))];const sp=ids.length?await SB.get('specialists?select=id,name,phone,wa,sub_id,owner_name,business_name,instagram,gis_url,hours,descr_ru,descr_kz,photos,verified&id=in.('+ids.join(',')+')'):[];
 const S=Object.fromEntries(sp.map(x=>[x.id,x]));const F=['owner_name','business_name','instagram','gis_url','hours','descr_ru','descr_kz'];
 box.innerHTML=`<details class="row"><summary><b>⚙️ ${L.settings}</b></summary><form class="ed" id="clset">
   <div class="full"><label class="ck"><input type="checkbox" name="photos_free" ${set.photos_free?'checked':''}> ${esc(L.photosFree)}</label></div>
   <div class="full"><label class="ck"><input type="checkbox" name="paid_profiles" disabled ${set.paid_profiles?'checked':''}> ${esc(L.paid)}</label></div>
   <div class="full acts"><button class="b pri">${t('save')}</button></div></form></details>
  <div class="tabs">${['pending','approved','rejected',''].map(s=>`<button data-cls="${s}" class="${CLF===s?'on':''}">${s?L.st[s]:LT().all}</button>`).join('')}</div>`
 +(rows.length?rows.map(r=>{const s=S[r.specialist_id]||{};return `<div class="row lrow1" data-id="${r.id}">
   <h3>${s.verified?'<span class="pill approved">✔</span> ':''}${esc(s.name||'—')} · ${esc(s.phone||'')} · ${esc(subT(s.sub_id))}</h3>
   <div class="meta">${pill(r.status)} ${fmtDT(r.created_at)}${r.device_id?` · ${t('device')}: ${esc(String(r.device_id).slice(0,8))}`:''}</div>
   <p class="${r.phone_match?'okline':'warnline'}">${r.phone_match?L.match:L.nomatch} · 📞 ${esc(r.phone)}</p>
   <table class="cmp"><tr><th></th><th>${L.claim}</th><th>${L.now}</th></tr>${F.filter(k=>r[k]).map(k=>`<tr><td>${L.f[k]}</td><td><b>${esc(r[k])}</b></td><td>${esc(s[k]||'—')}</td></tr>`).join('')}</table>
   ${(r.photos||[]).length?`<div class="pgrid sm">${r.photos.map(p=>`<div class="ph"><img src="${esc(SB.publicUrl('profiles',p.path))}" alt=""></div>`).join('')}</div>`:''}
   <div class="acts">${r.status==='pending'?`<button class="b ok" data-a="apply">${L.apply}</button><button class="b no" data-a="reject">${L.reject}</button>`:''}
    <button class="b sec" data-a="verify">${s.verified?L.unverify:L.verify}</button><button class="b no" data-a="del">${L.del}</button></div></div>`}).join(''):`<div class="row">${t('empty')}</div>`);
 box.querySelectorAll('[data-cls]').forEach(b=>b.onclick=()=>{CLF=b.dataset.cls;vClaims(box)});
 $('#clset').onsubmit=async ev=>{ev.preventDefault();try{await SB.update('claim_settings','id=eq.1',{photos_free:ev.target.elements.photos_free.checked});toast(t('saved'))}catch(e){toast(e.message)}};
 box.querySelectorAll('.lrow1').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id),s=S[r.specialist_id]||{};el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  try{if(a==='apply'){await SB.rpc('admin_apply_claim',{p_id:r.id});toast(L.applied)}
   if(a==='reject')await SB.update('spec_claims','id=eq.'+r.id,{status:'rejected',moderated_at:new Date().toISOString()});
   if(a==='verify')await SB.update('specialists','id=eq.'+r.specialist_id,{verified:!s.verified});
   if(a==='del'){if(!confirm(t('confirmDel')))return;const used=JSON.stringify(s.photos||[]);for(const p of (r.photos||[]))if(p.path&&!used.includes(p.path))await SB.removeFile('profiles',p.path).catch(()=>{});await SB.remove('spec_claims','id=eq.'+r.id)}
   if(a!=='apply')toast(t('saved'));render()}catch(e){toast(e.message)}}});
}
// «🔔 Новое: N» — сумма всего, что ждёт проверки; ниже — только ненулевые очереди, нажатие открывает вкладку
let NB_C=null,NB_TIMER=0,NB_SEQ=0;
function nbHtml(c){
 if(!c)return '';
 const ks=nbKeys().filter(k=>c[k]>0),sum=ks.reduce((a,k)=>a+c[k],0);
 if(!sum)return `<div class="nb-h nb-zero">${t('noNew')}</div>`;
 return `<div class="nb-h"><span>${t('newT')}:</span> <b class="nb-n">${sum}</b></div><div class="nb-l" role="list" aria-label="${esc(t('newAria'))}">${ks.map(k=>`<button type="button" role="listitem" class="nb-i" data-go="${k}"><span class="nb-t">${esc(t('nb')[k])}</span><span class="cnt">${c[k]}</span></button>`).join('')}</div>`}
function applyCounts(c){
 NB_C=c;const box=$('#nbox');if(!box)return;
 const sum=c?nbKeys().reduce((a,k)=>a+(c[k]||0),0):0;
 box.className='nbox'+(c&&!sum?' zero':'')+(c?'':' nb-off');box.innerHTML=nbHtml(c);
 adm.querySelectorAll('.tabs [data-tab]').forEach(b=>{const k=b.dataset.tab,n=c&&c[k]||0;let el=b.querySelector('.cnt');
  if(n){if(!el){el=document.createElement('span');el.className='cnt';b.appendChild(el)}el.textContent=n}else if(el)el.remove()});
 box.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>goTo(b.dataset.go))}
async function refreshCounts(){clearTimeout(NB_TIMER);const my=++NB_SEQ;try{const c=await counts();if(my===NB_SEQ)applyCounts(c)}catch(e){}}
const countsSoon=()=>{clearTimeout(NB_TIMER);NB_TIMER=setTimeout(refreshCounts,350)};
// после любого изменения в базе (одобрить/отклонить/удалить/сохранить) — пересчитать
for(const m of ['insert','update','remove']){const f=SB[m];SB[m]=(...a)=>f(...a).then(r=>{countsSoon();return r})}
{const f=SB.rpc;SB.rpc=(fn,...a)=>f(fn,...a).then(r=>{if(/^admin_apply/.test(fn))countsSoon();return r})}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&$('#nbox'))refreshCounts()});
function goTo(k){tab=k;editing=null;filterQ='';JUST=null;
 if(k==='listings')LF={status:'pending',section:'',q:''};if(k==='claims')CLF='pending';
 render().then(()=>{const tb=adm.querySelector('.tabs');if(tb){const y=tb.getBoundingClientRect().top+scrollY-(($('#admbar')||{}).offsetHeight||0)-8;if(y<scrollY)scrollTo({top:Math.max(0,y)})}})}
async function render(){
 clearTimeout(NB_TIMER);const my=++NB_SEQ;
 const c=await counts().catch(()=>null);
 adm.innerHTML=`<section id="nbox" class="nbox" aria-live="polite"></section><div class="tabs">${Object.keys(T.ru.tabs).filter(k=>(k!=='listings'||F_LIST)&&(k!=='claims'||F_CLAIM)).map(k=>`<button data-tab="${k}" class="${tab===k?'on':''}">${t('tabs')[k]}</button>`).join('')}</div>${JUST&&shareUrl(JUST.kind,JUST.row)?`<div class="row just" id="just"><div><b>${JUST.kind==='l'?t('approvedL'):t('approvedC')}</b>: ${esc(JUST.kind==='l'?JUST.row.title:(JUST.row.name||JUST.row.phone))}</div><div class="acts">${shareBtn(JUST.kind,JUST.row)}<button type="button" class="b" id="justX">${t('closeX')}</button></div></div>`:''}<div id="list">…</div>`;
 {const x=$('#justX');if(x)x.onclick=()=>{JUST=null;$('#just').remove()}}
 if(my===NB_SEQ)applyCounts(c);else applyCounts(NB_C);
 {const tb=adm.querySelector('.tabs'),on=tb&&tb.querySelector('button.on');if(on&&(on.offsetLeft+on.offsetWidth>tb.scrollLeft+tb.clientWidth||on.offsetLeft<tb.scrollLeft))tb.scrollLeft=Math.max(0,on.offsetLeft-12)}
 adm.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;editing=null;filterQ='';JUST=null;render()});
 try{await ({stats:vStats,pending:vPending,reviews:vReviews,reports:vReports,specs:vSpecs,cards:vCards,ann:vAnn,ads:vAds,news:vNews,listings:vListings,claims:vClaims})[tab]($('#list'))}catch(e){$('#list').innerHTML=`<div class="row">⚠️ ${esc(e.message)}</div>`}
}
const pill=s=>`<span class="pill ${esc(s)}">${esc(t('st')[s]||s)}</span>`;
function bindSpecEditor(box,row,onDone){
 const f=box.querySelector('[data-ed]');
 f.elements.section_id.onchange=()=>{row=Object.assign(row,collect(f,SPEC_SPEC()),{section_id:f.elements.section_id.value,sub_id:''});box.innerHTML=box.innerHTML;onDone('rerender',row)};
 f.onclick=async ev=>{const a=ev.target.dataset.act;if(!a)return;ev.preventDefault();
  if(a==='cancel'){editing=null;return render()}
  const v=collect(f,SPEC_SPEC());if(!v.wa)v.wa=normWa(v.phone);v.phone=v.phone.replace(/\D/g,'');if(!v.sub_id)v.sub_id=null;
  if(a==='approve')v.status='approved';if(a==='reject')v.status='rejected';
  if(v.status==='approved'&&!v.sub_id){toast(t('needSub'));return}
  try{let saved;if(row.id)saved=await SB.update('specialists','id=eq.'+row.id,v);else saved=await SB.insert('specialists',Object.assign(v,{source:'admin'}));CACHE.names=null;
   if(a==='approve'){const sr=Array.isArray(saved)&&saved[0]?saved[0]:Object.assign({},row,v);JUST={kind:'c',row:sr}}CACHE.allSpecs=null;editing=null;toast(t('saved'));render()}catch(e){toast(e.message)}};
}
async function vPending(box){
 const rows=await SB.get('specialists?select=*&status=eq.pending&order=created_at.asc');
 box.innerHTML=rows.length?rows.map(r=>`<div class="row" data-id="${r.id}"><h3>${esc(r.name)} · ${esc(r.phone)}</h3>
  <div class="meta">${fmtDT(r.created_at)} · ${esc(secT(D.sections.find(s=>s.id===r.section_id)||{title_ru:r.section_id,title_kz:r.section_id}))}${r.wants_vip?' · <span class="pill vip">'+t('wantsVip')+'</span>':''}${r.consent?' · ✅ '+t('consent'):''}</div>
  <p><b>${t('desc')}:</b> ${esc(r.description)}<br>${r.address?'📍 '+esc(r.address):''}</p>
  <div class="slot">${editor(SPEC_SPEC(),r,`<button class="b ok" data-act="approve">${t('approve')}</button><button class="b no" data-act="reject">${t('reject')}</button>`)}</div></div>`).join(''):`<div class="row">${t('empty')}</div>`;
 rows.forEach(r=>{const slot=box.querySelector(`[data-id="${r.id}"] .slot`);const bind=(x)=>bindSpecEditor(slot,x,(k,nr)=>{slot.innerHTML=editor(SPEC_SPEC(),nr,`<button class="b ok" data-act="approve">${t('approve')}</button><button class="b no" data-act="reject">${t('reject')}</button>`);bind(nr)});bind(r)});
}
async function vSpecs(box){
 const rows=await SB.get('specialists?select=*&status=in.(approved,hidden,rejected)&order=section_id.asc,sort_order.asc,id.asc');
 const q=filterQ.toLowerCase();const list=rows.filter(r=>!q||[r.name,r.phone,r.note,r.address,subT(r.sub_id)].join(' ').toLowerCase().includes(q));
 box.innerHTML=`<input class="filter" id="fq" placeholder="${t('search')}" value="${esc(filterQ)}"><button class="b pri" id="addSpec" style="margin-bottom:10px">${t('add')}</button>
  <div id="newSlot"></div>`+list.map(r=>`<div class="row" data-id="${r.id}"><h3>${r.vip?'<span class="pill vip">VIP</span>':''}${r.recommended?'⭐ ':''}${esc(r.name||'—')} · ${esc(r.phone)}</h3>
  <div class="meta">${pill(r.status)} ${esc(subT(r.sub_id))} · ${esc(r.note)}</div>
  <div class="acts"><button class="b" data-a="edit">${t('edit')}</button><button class="b sec" data-a="vip">${r.vip?'VIP ✕':'📌 VIP'}</button>
  <button class="b" data-a="vis">${r.status==='approved'?t('hide'):t('show')}</button>${shareBtn('c',r)}<button class="b no" data-a="del">${t('del')}</button></div><div class="slot"></div></div>`).join('');
 const fq=$('#fq');fq.oninput=()=>{filterQ=fq.value;clearTimeout(fq._t);fq._t=setTimeout(()=>vSpecs(box).then(()=>{const n=$('#fq');n.focus();n.setSelectionRange(n.value.length,n.value.length)}),250)};
 $('#addSpec').onclick=()=>{const slot=$('#newSlot');const r={section_id:D.sections[0].id,status:'approved',sort_order:5000,name:'',phone:''};const bind=x=>{slot.innerHTML=editor(SPEC_SPEC(),x);bindSpecEditor(slot,x,(k,nr)=>bind(nr))};bind(r)};
 box.querySelectorAll('.row[data-id]').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id);el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  try{if(a==='edit'){const slot=el.querySelector('.slot');const bind=x=>{slot.innerHTML=editor(SPEC_SPEC(),x);bindSpecEditor(slot,x,(k,nr)=>bind(nr))};bind(Object.assign({},r));return}
   if(a==='vip')await SB.update('specialists','id=eq.'+r.id,{vip:!r.vip});
   if(a==='vis')await SB.update('specialists','id=eq.'+r.id,{status:r.status==='approved'?'hidden':'approved'});
   if(a==='del'){if(!confirm(t('confirmDel')))return;await SB.remove('specialists','id=eq.'+r.id);CACHE.names=null}
   toast(t('saved'));vSpecs(box)}catch(e){toast(e.message)}}});
}
let AF={q:'',sec:'',sub:'',st:''};
async function vCards(box){
 if(!CACHE.allSpecs)CACHE.allSpecs=await SB.get('specialists?select=*&order=section_id.asc,sort_order.asc,id.asc');
 const rows=CACHE.allSpecs;const secOf=id=>D.sections.find(s=>s.id===id);
 const list=rows.filter(r=>(!AF.sec||r.section_id===AF.sec)&&(!AF.sub||r.sub_id===AF.sub)&&(!AF.st||r.status===AF.st)
  &&textHit(AF.q,[r.name,r.note,r.description,r.address,r.admin_note,subT(r.sub_id),secOf(r.section_id)?secT(secOf(r.section_id)):'','#'+r.id],[r.phone,r.wa]));
 const opt=(v,l,cur)=>`<option value="${esc(v)}" ${v===cur?'selected':''}>${esc(l)}</option>`;
 box.innerHTML=`<div class="ed" style="margin-bottom:10px"><div class="full"><input class="filter" id="aq" placeholder="${esc(t('cardsQ'))}" value="${esc(AF.q)}" style="margin:0"></div>
  <div><select id="asec">${opt('',t('allSec'),AF.sec)}${D.sections.map(s=>opt(s.id,s.emoji+' '+secT(s),AF.sec)).join('')}</select></div>
  <div><select id="asub">${opt('',t('allSub'),AF.sub)}${AF.sec?subs(AF.sec).map(x=>opt(x.id,x.implicit?secT(secOf(AF.sec)):(lang==='kz'?x.title_kz:x.title),AF.sub)).join(''):''}</select></div>
  <div><select id="ast">${opt('',t('allSt'),AF.st)}${['approved','pending','hidden','rejected'].map(s=>opt(s,t('st')[s],AF.st)).join('')}</select></div></div>
  <div class="meta" style="margin-bottom:8px">${t('foundN')(list.length)}${list.length>200?' · '+t('first200'):''}</div>`
  +list.slice(0,200).map(r=>`<div class="row" data-id="${r.id}"><h3>${r.vip?'<span class="pill vip">VIP</span>':''}${esc(r.name||'—')} · ${esc(r.phone)}</h3>
  <div class="meta">${pill(r.status)} #${r.id} · ${esc(secOf(r.section_id)?secT(secOf(r.section_id)):r.section_id)} → ${esc(subT(r.sub_id))} · ${esc((t('src')||{})[r.source]||r.source)}</div>
  ${r.note?`<p>${esc(r.note)}</p>`:''}${r.address?`<p>📍 ${esc(r.address)}</p>`:''}${r.description?`<p class="meta">${esc(t('desc'))}: ${esc(r.description)}</p>`:''}
  <div class="acts"><button class="b" data-a="edit">${t('edit')}</button><button class="b" data-a="vis">${r.status==='approved'?t('hide'):t('show')}</button>${shareBtn('c',r)}<button class="b no" data-a="del">${t('del')}</button></div><div class="slot"></div></div>`).join('');
 const re=(fn)=>{CACHE.allSpecs=fn?null:CACHE.allSpecs;return vCards(box)};
 const aq=$('#aq');aq.oninput=()=>{AF.q=aq.value;clearTimeout(aq._t);aq._t=setTimeout(()=>re().then(()=>{const n=$('#aq');n.focus();n.setSelectionRange(n.value.length,n.value.length)}),250)};
 $('#asec').onchange=e=>{AF.sec=e.target.value;AF.sub='';re()};$('#asub').onchange=e=>{AF.sub=e.target.value;re()};$('#ast').onchange=e=>{AF.st=e.target.value;re()};
 box.querySelectorAll('.row[data-id]').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id);el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  try{if(a==='edit'){const slot=el.querySelector('.slot');const bind=x=>{slot.innerHTML=editor(SPEC_SPEC(),x);bindSpecEditor(slot,x,(k,nr)=>bind(nr))};bind(Object.assign({},r));return}
   if(a==='vis')await SB.update('specialists','id=eq.'+r.id,{status:r.status==='approved'?'hidden':'approved'});
   if(a==='del'){if(!confirm(t('confirmDel')+' «'+(r.name||r.phone)+'»'))return;await SB.remove('specialists','id=eq.'+r.id);CACHE.names=null}
   toast(t('saved'));re(true)}catch(e){toast(e.message)}}});
}
async function vReviews(box){
 const [pend,appr,names]=await Promise.all([SB.get('reviews?select=*&status=eq.pending&order=created_at.asc'),SB.get('reviews?select=*&status=eq.approved&order=created_at.desc&limit=30'),specNames()]);
 const card=(r,btns)=>{const s=names[r.specialist_id]||{};return `<div class="row" data-id="${r.id}"><h3>${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)} · ${esc(s.name||s.phone||('#'+r.specialist_id))} <small>(${esc(subT(s.sub_id))})</small></h3>
  <div class="meta">${pill(r.status)} ${fmtDT(r.created_at)} · ${esc(r.author_name)} ${r.phone?'· '+esc(r.phone):''} · ${t('device')}: ${esc(String(r.device_id).slice(0,8))}</div><p>${esc(r.text)}</p><div class="acts">${btns}</div></div>`};
 box.innerHTML=(pend.length?pend.map(r=>card(r,`<button class="b ok" data-a="approved">${t('approve')}</button><button class="b no" data-a="rejected">${t('reject')}</button>`)).join(''):`<div class="row">${t('empty')}</div>`)
  +(appr.length?`<h2>${t('st').approved}</h2>`+appr.map(r=>card(r,`<button class="b" data-a="rejected">${t('hide')}</button>`)).join(''):'');
 box.querySelectorAll('.row[data-id] .acts').forEach(el=>el.onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;try{await SB.update('reviews','id=eq.'+el.closest('.row').dataset.id,{status:a});toast(t('saved'));render()}catch(e){toast(e.message)}});
}
async function vReports(box){
 const rows=(await SB.get('reports?select=*&order=status.desc,created_at.desc&limit=100')).sort((a,b)=>(b.status==='pending')-(a.status==='pending'));
 box.innerHTML=rows.length?rows.map(r=>`<div class="row" data-id="${r.id}"><h3>${esc(t('types')[r.type]||r.type)} · ${esc(r.title)}</h3>
  <div class="meta">${pill(r.status)} ${fmtDT(r.created_at)}</div><p>📍 ${esc(r.area)}<br>🕒 ${esc(r.when_text)}<br>ℹ️ ${esc(r.source)} ${r.contact?'<br>📞 '+esc(r.contact):''}</p>
  <div class="acts">${r.status==='pending'?`<button class="b ok" data-a="ann">${t('toAnn')}</button><button class="b" data-a="done">${t('done')}</button><button class="b no" data-a="rejected">${t('reject')}</button>`:''}</div></div>`).join(''):`<div class="row">${t('empty')}</div>`;
 box.querySelectorAll('.row[data-id] .acts').forEach(el=>el.onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;const r=rows.find(x=>x.id==el.closest('.row').dataset.id);
  try{if(a==='ann'){tab='ann';editing={type:r.type,title_ru:r.title,area_ru:r.area,source_ru:r.source,status:'draft',report_id:r.id,start_at:r.when_text&&/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(r.when_text)?r.when_text+':00+05:00':null};return render()}
   await SB.update('reports','id=eq.'+r.id,{status:a});toast(t('saved'));render()}catch(e){toast(e.message)}});
}
function crud(table,spec,rowsHtml){return async function(box){
 const rows=await SB.get(table+'?select=*&order=created_at.desc&limit=200');
 box.innerHTML=`<button class="b pri" id="addRow" style="margin-bottom:10px">${t('add')}</button><div id="edSlot"></div>`+(rows.length?rows.map(r=>`<div class="row" data-id="${r.id}">${rowsHtml(r)}
  <div class="acts"><button class="b" data-a="edit">${t('edit')}</button><button class="b no" data-a="del">${t('del')}</button></div><div class="slot"></div></div>`).join(''):`<div class="row">${t('empty')}</div>`);
 const open=(slot,row)=>{slot.innerHTML=editor(spec(),row);const f=slot.querySelector('[data-ed]');f.onclick=async ev=>{const a=ev.target.dataset.act;if(!a)return;ev.preventDefault();
   if(a==='cancel'){editing=null;return render()}
   const v=collect(f,spec());if('wa' in v)v.wa=normWa(v.wa);
   try{if(row.id)await SB.update(table,'id=eq.'+row.id,v);else{if(row.report_id)v.report_id=row.report_id;await SB.insert(table,v);if(row.report_id)await SB.update('reports','id=eq.'+row.report_id,{status:'done'})}
    editing=null;toast(t('saved'));render()}catch(e){toast(e.message)}}};
 $('#addRow').onclick=()=>open($('#edSlot'),{});
 if(editing){open($('#edSlot'),editing);editing=null}
 box.querySelectorAll('.row[data-id]').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id);el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  if(a==='edit')return open(el.querySelector('.slot'),r);
  if(a==='del'&&confirm(t('confirmDel'))){try{await SB.remove(table,'id=eq.'+r.id);toast(t('deleted'));render()}catch(e){toast(e.message)}}}});
}}
const vAnn=crud('announcements',ANN_SPEC,r=>`<h3>${r.urgent?'❗ ':''}${esc(t('types')[r.type])} · ${esc(lang==='kz'&&r.title_kz?r.title_kz:r.title_ru)}</h3><div class="meta">${pill(r.status)} ${r.is_demo?'<span class="pill">demo</span>':''} ${fmtDT(r.start_at)} — ${fmtDT(r.end_at)} · ${esc(r.area_ru)}</div>`);
const vAds=crud('ads',AD_SPEC,r=>`<h3>${esc(r.emoji)} ${esc(lang==='kz'&&r.title_kz?r.title_kz:r.title_ru)}</h3><div class="meta">${r.active?'<span class="pill approved">ON</span>':'<span class="pill">OFF</span>'} ${fmtDT(r.starts_at)} — ${fmtDT(r.ends_at)} · ${esc(r.link_url||r.wa||'')}</div>`);

// ---------- новости ----------
const NEWS_SPEC=()=>[['category','select',Object.keys(T.ru.cats).map(k=>[k,t('cats')[k]])],['status','select',['draft','published','archived'].map(s=>[s,t('st')[s]])],
 ['publish_at','dt'],['pinned','bool'],['title_ru',null,{full:true}],['title_kz',null,{full:true}],['lead_ru','text'],['lead_kz','text'],['body_ru','long'],['body_kz','long'],
 ['video_url',null,{full:true}]];
function compress(src,maxSide,q){return new Promise((res,rej)=>{const isBlob=src instanceof Blob;const u=isBlob?URL.createObjectURL(src):src;const img=new Image();
 img.onload=()=>{const k=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);
  const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);if(isBlob)URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(new Error('encode')),'image/jpeg',q)};
 img.onerror=()=>{if(isBlob)URL.revokeObjectURL(u);rej(new Error('image'))};img.src=u})}
const rnd=()=>Array.from(crypto.getRandomValues(new Uint8Array(9)),b=>b.toString(16).padStart(2,'0')).join('');
async function uploadPhoto(src){const b=await compress(src,1600,0.82);const d=new Date(Date.now()+5*3600e3).toISOString();
 return SB.upload('news',`${d.slice(0,4)}/${d.slice(5,7)}/${rnd()}.jpg`,b,'image/jpeg')}
const ntitle=r=>(lang==='kz'?(r.title_kz||r.title_ru):(r.title_ru||r.title_kz))||t('n').noTitle;
function newsEditor(slot,row,onDone){
 const N=t('n');const st={photos:(row.photos||[]).map(p=>typeof p==='string'?{url:p,path:''}:p),cover:row.cover_url||'',uploaded:[],removed:[]};
 if(!row.status)row.status='draft';if(!row.category)row.category='other';
 slot.innerHTML=`${row.suggestion_id?`<p class="demo-note live">✍️ ${N.sugFrom} #${row.suggestion_id}</p>`:''}${editor(NEWS_SPEC(),row)}`;
 const f=slot.querySelector('[data-ed]');
 f.querySelector('[name=publish_at]').closest('div').insertAdjacentHTML('beforeend',`<small class="hint">${N.hintSched}</small>`);
 f.querySelector('[name=video_url]').placeholder='https://www.youtube.com/watch?v=…';f.querySelector('[name=video_url]').closest('div').insertAdjacentHTML('beforeend',`<small class="hint">${N.hintVideo}</small>`);
 f.querySelector('.acts').insertAdjacentHTML('beforebegin',`<div class="full"><label>${N.photos}</label><small class="hint">${N.hintPhotos}</small><div class="pgrid" id="pg"></div>
  <input type="file" accept="image/*" multiple id="pf" class="vh-file"><label for="pf" class="b sec upl">${N.addPhotos}</label> <span class="meta" id="pst"></span></div>`);
 const pg=f.querySelector('#pg');
 const coverOf=()=>st.photos.some(p=>p.url===st.cover)?st.cover:(st.photos[0]&&st.photos[0].url)||'';
 const draw=()=>{const c=coverOf();pg.innerHTML=st.photos.map((p,i)=>`<div class="ph ${p.url===c?'cv':''}"><img src="${esc(p.url)}" alt="">${p.url===c?`<span class="cvb">${N.cover}</span>`:''}
  <div class="pb"><button type="button" data-p="cover" data-i="${i}" title="${N.setCover}">★</button><button type="button" data-p="l" data-i="${i}">${N.left}</button><button type="button" data-p="r" data-i="${i}">${N.right}</button><button type="button" data-p="rm" data-i="${i}" class="no">${N.rm}</button></div></div>`).join('')};
 pg.onclick=ev=>{const b=ev.target.closest('[data-p]');if(!b)return;ev.preventDefault();const i=+b.dataset.i,a=b.dataset.p,P=st.photos;
  if(a==='cover')st.cover=P[i].url;if(a==='l'&&i>0)[P[i-1],P[i]]=[P[i],P[i-1]];if(a==='r'&&i<P.length-1)[P[i+1],P[i]]=[P[i],P[i+1]];
  if(a==='rm'){const [x]=P.splice(i,1);if(x.path)st.removed.push(x.path)}draw()};
 const addFiles=async(list)=>{const pst=f.querySelector('#pst');let k=0;for(const src of list){pst.textContent=`${N.uploading} ${++k}/${list.length}`;
   try{const r=await uploadPhoto(src);st.uploaded.push(r.path);st.photos.push(r);draw()}catch(e){toast(N.photoErr+': '+e.message)}}pst.textContent=''};
 f.querySelector('#pf').onchange=ev=>{const l=[...ev.target.files];ev.target.value='';addFiles(l)};
 draw();
 if(row._sugPhotos&&row._sugPhotos.length){addFiles(row._sugPhotos).then(()=>toast(N.fromSug));delete row._sugPhotos}
 f.onclick=async ev=>{const a=ev.target.dataset.act;if(!a)return;ev.preventDefault();
  if(a==='cancel'){for(const p of st.uploaded)SB.removeFile('news',p).catch(()=>{});editing=null;return render()}
  const v=collect(f,NEWS_SPEC());if(!v.title_ru&&!v.title_kz){toast(N.needTitle);return}
  if(!v.publish_at)delete v.publish_at;v.photos=st.photos.map(p=>({url:p.url,path:p.path||''}));v.cover_url=coverOf();
  try{if(row.id)await SB.update('news','id=eq.'+row.id,Object.assign(v,{updated_at:new Date().toISOString()}));
   else{if(row.suggestion_id)v.suggestion_id=row.suggestion_id;await SB.insert('news',v);if(row.suggestion_id)await SB.update('news_suggestions','id=eq.'+row.suggestion_id,{status:'accepted'})}
   for(const p of st.removed)SB.removeFile('news',p).catch(()=>{});
   editing=null;toast(t('saved'));render()}catch(e){toast(e.message)}};
}
async function vNews(box){
 const N=t('n');
 const [sug,rows,top]=await Promise.all([SB.get('news_suggestions?select=*&status=eq.pending&order=created_at.asc'),SB.get('news?select=*&order=pinned.desc,publish_at.desc&limit=300'),
  SB.rpc('admin_top_news',{p_days:30}).catch(()=>[])]);
 const views=Object.fromEntries((top||[]).map(x=>[x.news_id,x.views]));const now=Date.now();
 box.innerHTML=(sug.length?`<h2>✍️ ${N.sugg} <span class="cnt">${sug.length}</span></h2>`+sug.map(s=>`<div class="row" data-sid="${s.id}"><h3>${esc(s.title)}</h3>
   <div class="meta">${fmtDT(s.created_at)}${s.contact?' · 📞 '+esc(s.contact):''} · ${t('device')}: ${esc(String(s.device_id||'').slice(0,8))}</div><p class="pre">${esc(s.text)}</p>
   ${(s.photos||[]).length?`<div class="pgrid sm">${s.photos.map(u=>/^data:image\/(jpeg|webp);base64,/.test(u)?`<div class="ph"><img src="${esc(u)}" alt=""></div>`:'').join('')}</div>`:''}
   <div class="acts"><button class="b ok" data-a="tonews">${N.toNews}</button><button class="b no" data-a="rejected">${t('reject')}</button></div></div>`).join(''):'')
  +`<button class="b pri" id="addNews" style="margin:6px 0 10px">${N.addNews}</button><div id="edSlot"></div><h2>${N.list}</h2>`
  +(rows.length?rows.map(r=>{const sch=r.status==='published'&&new Date(r.publish_at).getTime()>now;return `<div class="row nrow" data-id="${r.id}">
   ${r.cover_url?`<img class="nthumb" src="${esc(r.cover_url)}" alt="">`:`<div class="nthumb ph">${esc((t('cats')[r.category]||'📰').split(' ')[0])}</div>`}
   <div class="nmain"><h3>${r.pinned?'📌 ':''}${esc(ntitle(r))}</h3>
   <div class="meta">${pill(r.status)} ${r.is_demo?'<span class="pill">demo</span>':''} ${esc(t('cats')[r.category]||'')} · ${sch?`<b class="sched">${N.scheduled} ${fmtDT(r.publish_at)}</b>`:fmtDT(r.publish_at)}
    ${(r.photos||[]).length?' · 🖼 '+r.photos.length:''}${r.video_url?' · ▶️':''}${views[r.id]?` · 👁 ${views[r.id]} ${N.views}`:''}${!r.title_kz||!r.title_ru?` · <span class="pill">${r.title_kz?'KZ':'RU'} only</span>`:''}</div>
   <div class="acts"><button class="b" data-a="edit">${t('edit')}</button>${r.status==='published'?`<button class="b" data-a="unpub">${N.unpublish}</button>`:`<button class="b ok" data-a="pub">${N.publish}</button>`}
   <button class="b sec" data-a="pin">${r.pinned?N.unpin:N.pin}</button><button class="b no" data-a="del">${t('del')}</button></div></div><div class="slot full"></div></div>`}).join(''):`<div class="row">${t('empty')}</div>`);
 $('#addNews').onclick=()=>newsEditor($('#edSlot'),{});
 if(editing&&editing._news){const e=editing;editing=null;newsEditor($('#edSlot'),e)}
 box.querySelectorAll('.row[data-sid] .acts').forEach(el=>el.onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;const s=sug.find(x=>x.id==el.closest('.row').dataset.sid);
  try{if(a==='tonews'){newsEditor($('#edSlot'),{title_ru:s.title,body_ru:s.text,status:'draft',category:'other',suggestion_id:s.id,_sugPhotos:(s.photos||[]).filter(u=>/^data:image\//.test(u))});$('#edSlot').scrollIntoView({behavior:'smooth'});return}
   await SB.update('news_suggestions','id=eq.'+s.id,{status:a});toast(t('saved'));render()}catch(e){toast(e.message)}});
 box.querySelectorAll('.nrow').forEach(el=>{const r=rows.find(x=>x.id==el.dataset.id);el.querySelector('.acts').onclick=async ev=>{const a=ev.target.dataset.a;if(!a)return;
  try{if(a==='edit')return newsEditor(el.querySelector('.slot'),Object.assign({},r));
   if(a==='pub')await SB.update('news','id=eq.'+r.id,{status:'published'});
   if(a==='unpub')await SB.update('news','id=eq.'+r.id,{status:'draft'});
   if(a==='pin')await SB.update('news','id=eq.'+r.id,{pinned:!r.pinned});
   if(a==='del'){if(!confirm(t('confirmDel')))return;await SB.remove('news','id=eq.'+r.id);for(const p of (r.photos||[]))if(p&&p.path)SB.removeFile('news',p.path).catch(()=>{});toast(t('deleted'));return render()}
   toast(t('saved'));render()}catch(e){toast(e.message)}}});
}

// ---------- статистика ----------
function chart(daily){
 const W=640,H=180,P=24,n=daily.length,max=Math.max(1,...daily.map(d=>d.views)),bw=(W-P*2)/n;
 const y=v=>H-P-(v/max)*(H-P*2);
 const bars=daily.map((d,i)=>`<rect x="${(P+i*bw+1).toFixed(1)}" y="${y(d.views).toFixed(1)}" width="${Math.max(1,bw-2).toFixed(1)}" height="${(H-P-y(d.views)).toFixed(1)}" fill="#f4c7a8"><title>${d.day}: ${d.views} / ${d.visitors}</title></rect>`).join('');
 const line=daily.map((d,i)=>`${(P+i*bw+bw/2).toFixed(1)},${y(d.visitors).toFixed(1)}`).join(' ');
 const lbl=daily.map((d,i)=>(i%5===0||i===n-1)?`<text x="${(P+i*bw+bw/2).toFixed(1)}" y="${H-6}" font-size="11" text-anchor="middle" fill="#7a6a5c">${d.day.slice(8,10)}.${d.day.slice(5,7)}</text>`:'').join('');
 return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img"><text x="${P}" y="14" font-size="11" fill="#7a6a5c">max ${max}</text>${bars}<polyline points="${line}" fill="none" stroke="#e8603c" stroke-width="2.5"/>${daily.map((d,i)=>`<circle cx="${(P+i*bw+bw/2).toFixed(1)}" cy="${y(d.visitors).toFixed(1)}" r="2.5" fill="#e8603c"/>`).join('')}${lbl}</svg>
  <div class="legend"><span><i style="background:#e8603c"></i>${t('st_').legendV}</span><span><i style="background:#f4c7a8"></i>${t('st_').legendN}</span></div>`;
}
function split(obj){const S=t('st_');const tot=Object.values(obj).reduce((a,b)=>a+b,0);if(!tot)return `<p class="meta">${S.none}</p>`;
 return Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{const pct=Math.round(v*100/tot);const name=S[k]||({ru:'Русский',kz:'Қазақша'})[k]||k;
  return `<div class="bar"><span>${esc(name)}</span><b>${v} · ${pct}%</b><div><i style="width:${pct}%"></i></div></div>`}).join('')}
async function vStats(box){
 const [s,tn]=await Promise.all([SB.rpc('admin_stats',{p_days:30}),SB.rpc('admin_top_news',{p_days:30}).catch(()=>[])]),S=t('st_');
 const tile=(k)=>`<div class="kpi"><small>${S[k]}</small><b>${s.totals[k].visitors}</b><span>${S.visitors}</span><em>${s.totals[k].views} ${S.views}</em></div>`;
 const list=(rows,fn)=>rows.length?`<ol class="tl">${rows.map(fn).join('')}</ol>`:`<p class="meta">${S.none}</p>`;
 box.innerHTML=`<p class="demo-note live">🔒 ${S.privacy}</p>
  <div class="kpis">${tile('today')}${tile('d7')}${tile('d30')}</div>
  <div class="row"><h3>${S.daily}</h3>${chart(s.daily)}</div>
  <div class="grid2">
   <div class="row"><h3>🔍 ${S.searches}</h3>${list(s.top_searches,x=>`<li><span>${esc(x.query)}</span><b>${x.cnt} ${S.times}</b><small>${S.results}: ${x.avg_results}</small></li>`)}</div>
   <div class="row"><h3>🤷 ${S.notFound}</h3>${list(s.top_not_found,x=>`<li><span>${esc(x.query)}</span><b>${x.cnt} ${S.times}</b></li>`)}</div>
  </div>
  <div class="row"><h3>📞 ${S.contacted}</h3>${list(s.top_contacted,x=>`<li><span>${esc(x.name||x.phone||('#'+x.specialist_id))} <small>${esc(subT(x.sub_id))}</small></span><b>${x.total}</b><small>WhatsApp ${x.wa} · ${S.calls} ${x.calls}</small></li>`)}</div>
  <div class="row"><h3>${t('n').top}</h3>${list(tn||[],x=>`<li><span>${esc((lang==='kz'?(x.title_kz||x.title_ru):(x.title_ru||x.title_kz)))}</span><b>${x.views} ${S.views}</b><small>${x.visitors} ${S.visitors}</small></li>`)}</div>
  <div class="grid2"><div class="row"><h3>📱 ${S.devices}</h3>${split(s.devices)}</div><div class="row"><h3>🌐 ${S.langs}</h3>${split(s.langs)}</div></div>
  <div class="grid2">
   <div class="row"><h3>↪️ ${S.referrers}</h3>${list(s.referrers,x=>`<li><span>${esc(x.referrer_domain)}</span><b>${x.cnt}</b></li>`)}</div>
   <div class="row"><h3>📄 ${S.pages}</h3>${list(s.top_pages,x=>`<li><span>${esc(x.path)}</span><b>${x.cnt}</b></li>`)}</div>
  </div>`;
 SB.rpc('admin_install_stats',{p_days:30}).then(ins=>{const L=lang==='kz'?{t:'📲 Телефон экранына қосу (30 күн)',android:'Android: орнатылды',installed:'Браузер растады',ios:'iPhone: нұсқаулық ашылды',inapp:'WhatsApp/Instagram ішінен',guide:'Android: нұсқаулық'}:{t:'📲 Добавили на экран телефона (30 дней)',android:'Android: установили',installed:'Подтверждено браузером',ios:'iPhone: открыли инструкцию',inapp:'Из WhatsApp/Instagram (подсказка)',guide:'Android: инструкция'};
  box.insertAdjacentHTML('beforeend',`<div class="row"><h3>${L.t}</h3>${Object.keys(ins||{}).length?`<ol class="tl">${Object.entries(ins).map(([k,v])=>`<li><span>${esc(L[k]||k)}</span><b>${v}</b></li>`).join('')}</ol>`:`<p class="meta">${S.none}</p>`}</div>`)}).catch(()=>{});
}

// ---------- login / boot ----------
function vLogin(msg){
 adm.innerHTML=`<div class="login"><h1>${t('login')}</h1>${msg?`<p class="demo-note warn">${esc(msg)}</p>`:''}
  <form id="lf" method="post" action="#" autocomplete="on">
   <label for="le">${t('email')}</label><input id="le" name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" required>
   <label for="lp">${t('pass')}</label><div class="pwf"><input id="lp" name="password" type="password" autocomplete="current-password" required><button type="button" class="eye" data-eye="lp" aria-label="${t('showPass')}" aria-pressed="false">👁</button></div>
   <button class="btn primary" type="submit">${t('signin')}</button></form>
  <p class="forgot">🔑 ${t('forgot')}</p>
  <div class="or"><span>${t('or')}</span></div>
  <button class="btn ml" id="ml" type="button">✉️ ${t('magic')}</button></div>`;
 bindEyes(adm);
 $('#lf').onsubmit=async ev=>{ev.preventDefault();try{await SB.signInWithPassword($('#le').value.trim(),$('#lp').value);boot()}catch(e){toast(t('badLogin'),6000)}};
 $('#ml').onclick=async()=>{const e=$('#le').value.trim();if(!e||!$('#le').checkValidity()){toast(t('magicNoEmail'));$('#le').focus();return}try{await SB.signInWithOtp(e,location.origin+location.pathname);toast(t('magicSent'))}catch(err){toast(err.message)}};
}
// кнопка 👁 показать/скрыть пароль
function bindEyes(root){root.querySelectorAll('[data-eye]').forEach(b=>b.onclick=()=>{const ids=b.dataset.eye.split(',');const show=b.getAttribute('aria-pressed')!=='true';
 ids.forEach(id=>{const i=document.getElementById(id);if(i)i.type=show?'text':'password'});b.setAttribute('aria-pressed',String(show));b.setAttribute('aria-label',t(show?'hidePass':'showPass'));b.textContent=show?'🙈':'👁'})}
// ---------- смена пароля ----------
function pwError(e){const c=(e&&e.errorCode)||'',m=String((e&&e.message)||''),st=e&&e.status;
 if(e&&e.name==='AbortError'||e instanceof TypeError)return t('pwNet');
 if(c==='weak_password'||/weak|at least|characters/i.test(m)&&!c)return t('pwWeak');
 if(c==='same_password'||/different from the old/i.test(m))return t('pwSame');
 if(c==='reauthentication_needed'||/reauthenticat/i.test(m)&&c!=='reauthentication_not_valid')return 'REAUTH';
 if(c==='reauthentication_not_valid'||c==='otp_expired'||/nonce|invalid.*code/i.test(m))return t('pwBadCode');
 if(c==='over_email_send_rate_limit'||c==='over_request_rate_limit'||st===429)return t('pwRate');
 if(st===401||st===403||c==='session_not_found'||c==='bad_jwt'||c==='session_expired')return t('pwSession');
 return t('pwFail')+(m?': '+m:'')}
function openPw(){
 const em=esc(SB.email()||'');const prev=document.activeElement;
 const box=document.createElement('div');box.className='modal pwm';box.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="pwh">
  <h2 id="pwh">🔑 ${t('pwTitle')}</h2><p class="muted">${t('pwIntro')}</p>
  <form id="pwf" method="post" action="#" novalidate>
   <input type="email" name="email" autocomplete="username" value="${em}" readonly hidden>
   <label for="pw1">${t('pwNew')}</label><div class="pwf"><input id="pw1" name="new-password" type="password" autocomplete="new-password" minlength="8" required aria-describedby="pwmin"><button type="button" class="eye" data-eye="pw1,pw2" aria-label="${t('showPass')}" aria-pressed="false">👁</button></div>
   <small id="pwmin" class="muted">${t('pwMin')}</small>
   <label for="pw2">${t('pwRep')}</label><input id="pw2" name="confirm-password" type="password" autocomplete="new-password" minlength="8" required>
   <div id="pwcode" hidden><label for="pwc">${t('pwCode')}</label><div class="pwc-row"><input id="pwc" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10"><button type="button" class="b sec" id="pwsend">${t('pwSendCode')}</button></div></div>
   <p class="pw-err" id="pwe" role="alert" hidden></p>
   <div class="pw-acts"><button type="button" class="b" id="pwx">${t('cancel')}</button><button type="submit" class="b pri" id="pws">${t('pwSave')}</button></div>
  </form></div>`;
 document.body.appendChild(box);bindEyes(box);
 const err=m=>{const e=$('#pwe');e.textContent=m||'';e.hidden=!m};
 const close=()=>{box.remove();document.removeEventListener('keydown',kd);if(prev&&prev.focus)prev.focus()};
 const kd=ev=>{if(ev.key==='Escape')close()};document.addEventListener('keydown',kd);
 box.onclick=ev=>{if(ev.target===box)close()};$('#pwx').onclick=close;
 $('#pwsend').onclick=async()=>{const b=$('#pwsend');b.disabled=true;try{await SB.reauthenticate();err('');toast(t('pwCodeSent'));$('#pwc').focus()}catch(e){const m=pwError(e);err(m==='REAUTH'?t('pwReauth'):m)}finally{b.disabled=false}};
 $('#pwf').onsubmit=async ev=>{ev.preventDefault();const p1=$('#pw1').value,p2=$('#pw2').value;
  if(p1.length<8){err(t('pwShort'));$('#pw1').focus();return}
  if(p1!==p2){err(t('pwMismatch'));$('#pw2').focus();return}
  const attrs={password:p1};const code=$('#pwc').value.trim();if(!$('#pwcode').hidden&&code)attrs.nonce=code;
  const sb=$('#pws');sb.disabled=true;err('');
  try{await SB.updateUser(attrs);close();toast(t('pwOk'),7000)}
  catch(e){const m=pwError(e);if(m==='REAUTH'){$('#pwcode').hidden=false;err(t('pwReauth'));$('#pwsend').focus()}else err(m)}
  finally{if(sb.isConnected)sb.disabled=false}};
 $('#pw1').focus();
}
// заметная полоса «🔐 АДМИНКА · вы вошли как …» — только когда вошёл администратор
function adminBar(on){const bar=$('#admbar');document.body.classList.toggle('in',!!on);
 if(!on){bar.hidden=true;bar.innerHTML='';document.title=t('docLogin');return}
 bar.innerHTML=`<b class="ab-t">🔐 ${t('barT')}</b><a class="ab-s" href="./">${t('toSite')}</a><button class="ab-lo" id="lo" type="button">${t('logout')}</button><button class="ab-pw" id="pwb" type="button" aria-haspopup="dialog">${t('pwBtn')}</button><button class="ab-rf" id="rfb" type="button" title="${t('refreshT')}" aria-label="${t('refreshT')}"><span aria-hidden="true">🔄</span><span class="ab-rt"> ${t('refresh')}</span></button><span class="ab-u"><span class="sep">· </span>${t('barAs')} <span class="ab-e" title="${esc(SB.email()||'')}">${esc(SB.email()||'')}</span></span>`;
 bar.hidden=false;document.title=t('docT');$('#hUser').textContent=SB.email()||'';  // полный email ещё и в шапке: в полосе на узком экране он может обрезаться
$('#lo').onclick=async()=>{await SB.signOut();boot()};$('#pwb').onclick=openPw;$('#rfb').onclick=()=>{const b=$('#rfb');b.disabled=true;location.replace(location.pathname+'?r='+Date.now()+'#tab='+tab)}}
async function boot(){
 document.documentElement.lang=lang==='kz'?'kk':'ru';$('#hTitle').textContent=t('title');document.title=t('docLogin');
 document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===lang));
 if(!SB.enabled){adm.innerHTML=`<div class="row">⚠️ ${t('noBackend')}</div>`;return}
 SB.handleRedirect();
 if(!SB.session()){$('#hUser').textContent='';adminBar(false);return vLogin()}
 let isAdm=false;try{isAdm=await SB.rpc('is_admin',{})}catch(e){}
 if(!SB.session()){adminBar(false);return vLogin()}
 $('#hUser').textContent=SB.email();
 if(!isAdm){adminBar(false);adm.innerHTML=`<div class="row">⛔ ${t('noAccess')}</div><button class="b" id="lo2">${t('logout')}</button>`;$('#lo2').onclick=async()=>{await SB.signOut();boot()};return}
 adminBar(true);
 render();
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('urker_lang',lang);boot()});
boot();
})();
