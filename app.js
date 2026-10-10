(function(){
'use strict';
// «Это ваш бизнес?» — включается в config.js → features.claims после 08_claims.sql
const CLAIMS_ON=!!(((window.URKER_CONFIG||{}).features||{}).claims);
// Реклама (баннер на главной и место «Закрепиться наверху»): config.js → features.ads. Настоящие VIP из админки показываются всегда.
const ADS_ON=!!(((window.URKER_CONFIG||{}).features||{}).ads);
const D=window.URKER_DATA, SYN=window.URKER_SYNONYMS||{};
const $=(s,r=document)=>r.querySelector(s);
const app=$('#app');
const detectLang=()=>{try{const u=new URL(location.href),q=u.searchParams.get('lang');if(q==='kz'||q==='ru'){localStorage.setItem('urker_lang',q);u.searchParams.delete('lang');history.replaceState(history.state,'',u.pathname+u.search+u.hash);return q}}catch(e){}  // ?lang=kz из статических страниц /kz/…
 const s=localStorage.getItem('urker_lang');if(s==='kz'||s==='ru')return s;try{const l=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);return l.some(x=>/^(kk|kz)\b/i.test(String(x)))?'kz':'ru'}catch(e){return 'ru'}};
let lang=detectLang();

const T={
 ru:{draft:'Черновик-прототип · не для публикации',brand:'Уркер',tagline:'Мастера и услуги рядом',navHome:'Главная',navSearch:'Поиск',navAdd:'Добавить',navAnn:'Важно',annTitle:'Важно: отключения, ремонт, события',annAll:'Все →',annEmpty:'Сейчас важных объявлений нет',annEmptyS:'Если узнаете об отключении или ремонте — сообщите, мы проверим и опубликуем.',annActive:'актуально',annDone:'завершено',annUrgent:'срочно',annExample:'ПРИМЕР · демо',annSource:'Источник',annShare:'Поделиться в WhatsApp',annReport:'📣 Сообщить о важном',annTypes:{power:'Свет',water:'Вода',gas:'Газ',repair:'Ремонт',other:'Другое'},annFound:'Важно',repTitle:'Сообщить о важном',repNote:'Демо-форма: пока ничего не отправляется. В рабочей версии сообщение пойдёт на модерацию и после проверки появится в разделе «Важно».',rType:'Что случилось?',rTitle:'Коротко, что происходит',rTitlePh:'Например: нет света с утра',rArea:'Улицы / дома',rWhen:'Когда (дата и время)',rSrc:'Откуда информация?',rSrcPh:'Например: сообщение Астана-РЭК, видел сам',rContact:'Ваш телефон (по желанию, для уточнения)',rSend:'Отправить на модерацию',rSent:'Спасибо! Это демо: в рабочей версии сообщение уйдёт на модерацию.',
  searchPh:'Например: укол, газель',searchTitle:'Найти мастера или услугу',cats:'Все разделы',catsHint:'Нажмите на раздел и выберите нужного специалиста/бизнес',
  promoT:'Здесь может быть ваша реклама',promoS:'Нажмите, чтобы разместить рекламу',promoBtn:'Разместить рекламу',adMsg:'Здравствуйте! Хочу разместить рекламу на сайте https://urker24.kz ',ad:'Реклама',
  wa:'Написать в WhatsApp',call:'Позвонить',noName:'Номер из списка',noReviews:'пока нет отзывов',review:'Оценить',demo:'демо',
  sortList:'Как в списке',sortRating:'По рейтингу',all:'Все',found:n=>`Найдено: ${n}`,sections:'Подходящие разделы',
  nothing:'Пока никого нет по запросу',nothingS:'Знаете такого мастера или у вас свой бизнес? Добавьте его — после проверки он появится здесь.',addBiz:'➕ Добавить свой бизнес',
  starB:'⭐ Рекомендован чатом',newB:'🆕 Новый',dup:'Этот номер есть и в разделах: ',warn10:'⚠️ В номере 10 цифр — нужно уточнить',tollfree:'☎️ Бесплатная линия 8-800, только звонок',
  vipT:'Закрепиться наверху — нажмите',vipS:'Закреплённое место вверху раздела с подсветкой',vip:'Ваша карточка будет первой в разделе',vipMsg:'Здравствуйте! Хочу закрепить свою карточку наверху раздела «{s}» на сайте https://urker24.kz ',
  sortNote:'Рейтинг и отзывы — демо: сохраняются только на этом телефоне.',
  addTitle:'Добавить свой бизнес',addNote:'Демо-форма: пока ничего никуда не отправляется. В рабочей версии заявка пойдёт на модерацию и появится на сайте после проверки.',
  fName:'Имя или название',fCat:'Раздел',fWhat:'Чем занимаетесь?',fWhatPh:'Например: ремонт стиральных машин, выезд на дом',fPhone:'Телефон (WhatsApp)',fAddr:'Адрес или ориентир (по желанию)',
  fConsent:'Я согласен(на), чтобы мой номер был показан на сайте',fVip:'Хочу закреплённое место / рекламу (свяжемся отдельно)',fSend:'Отправить на модерацию',
  sent:'Спасибо! Это демо: в рабочей версии заявка уйдёт на модерацию.',rvTitle:'Ваш отзыв',rvPh:'Что понравилось? (по желанию)',rvSave:'Сохранить отзыв',rvSaved:'Отзыв сохранён на этом телефоне (демо)',
  rvDemo:'Демо: отзыв сохранится только на этом устройстве.',close:'Закрыть',reviewsN:n=>`${n} отз.`,entries:n=>`${n} контакт${n%10==1&&n%100!=11?'':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'а':'ов')}`,
  foot:'Список составлен жителями Уркера в WhatsApp-чате. Прототип закрыт от поисковиков.',choose:'— выберите —'},
 kz:{draft:'Жоба-прототип · жариялауға емес',brand:'Үркер',tagline:'Жақын маман мен қызметтер',navHome:'Басты',navSearch:'Іздеу',navAdd:'Қосу',navAnn:'Маңызды',annTitle:'Маңызды: өшірулер, жөндеу, оқиғалар',annAll:'Барлығы →',annEmpty:'Қазір маңызды хабарландыру жоқ',annEmptyS:'Өшіру немесе жөндеу туралы білсеңіз — хабарлаңыз, тексеріп жариялаймыз.',annActive:'өзекті',annDone:'аяқталды',annUrgent:'шұғыл',annExample:'МЫСАЛ · демо',annSource:'Дереккөз',annShare:'WhatsApp-та бөлісу',annReport:'📣 Маңызды жайт туралы хабарлау',annTypes:{power:'Жарық',water:'Су',gas:'Газ',repair:'Жөндеу',other:'Басқа'},annFound:'Маңызды',repTitle:'Маңызды жайт туралы хабарлау',repNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында хабарлама модерацияға түседі.',rType:'Не болды?',rTitle:'Қысқаша не болып жатыр',rTitlePh:'Мысалы: таңертеңнен жарық жоқ',rArea:'Көшелер / үйлер',rWhen:'Қашан (күні мен уақыты)',rSrc:'Ақпарат қайдан?',rSrcPh:'Мысалы: Астана-РЭК хабарламасы, өзім көрдім',rContact:'Телефоныңыз (міндетті емес)',rSend:'Модерацияға жіберу',rSent:'Рақмет! Бұл демо: жұмыс нұсқасында хабарлама модерацияға кетеді.',
  searchPh:'Мысалы: укол, жүк',searchTitle:'Маман немесе қызмет табу',cats:'Барлық бөлімдер',catsHint:'Бөлімді басып, қажетті маманды/бизнесті таңдаңыз',
  promoT:'Мұнда сіздің жарнамаңыз болуы мүмкін',promoS:'Жарнама орналастыру үшін басыңыз',promoBtn:'Жарнама орналастыру',adMsg:'Сәлеметсіз бе! https://urker24.kz сайтында жарнама орналастырғым келеді.',ad:'Жарнама',
  wa:'WhatsApp-қа жазу',call:'Қоңырау шалу',noName:'Тізімдегі нөмір',noReviews:'әзірге пікір жоқ',review:'Бағалау',demo:'демо',
  sortList:'Тізімдегідей',sortRating:'Рейтинг бойынша',all:'Барлығы',found:n=>`Табылды: ${n}`,sections:'Сәйкес бөлімдер',
  nothing:'Бұл сұрау бойынша әзірге ешкім жоқ',nothingS:'Осындай маманды білесіз бе, әлде өз бизнесіңіз бар ма? Қосыңыз — тексерістен кейін осында шығады.',addBiz:'➕ Бизнесіңізді қосу',
  starB:'⭐ Чат ұсынған',newB:'🆕 Жаңа',dup:'Бұл нөмір мына бөлімдерде де бар: ',warn10:'⚠️ Нөмірде 10 сан — нақтылау керек',tollfree:'☎️ 8-800 тегін желі, тек қоңырау',
  vipT:'Жоғарыда бекіту — басыңыз',vipS:'Бөлімнің жоғарғы жағындағы ерекшеленген орын',vip:'Карточкаңыз бөлімде бірінші тұрады',vipMsg:'Сәлеметсіз бе! https://urker24.kz сайтындағы «{s}» бөлімінің жоғарғы жағына карточкамды бекіткім келеді.',
  sortNote:'Рейтинг пен пікірлер — демо: тек осы телефонда сақталады.',
  addTitle:'Бизнесіңізді қосу',addNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында өтінім модерацияға түседі.',
  fName:'Аты немесе атауы',fCat:'Бөлім',fWhat:'Немен айналысасыз?',fWhatPh:'Мысалы: кір жуғыш машина жөндеу, үйге бару',fPhone:'Телефон (WhatsApp)',fAddr:'Мекенжай немесе бағдар (міндетті емес)',
  fConsent:'Нөмірімнің сайтта көрсетілуіне келісемін',fVip:'Бекітілген орын / жарнама керек (бөлек хабарласамыз)',fSend:'Модерацияға жіберу',
  sent:'Рақмет! Бұл демо: жұмыс нұсқасында өтінім модерацияға кетеді.',rvTitle:'Сіздің пікіріңіз',rvPh:'Не ұнады? (міндетті емес)',rvSave:'Пікірді сақтау',rvSaved:'Пікір осы телефонда сақталды (демо)',
  rvDemo:'Демо: пікір тек осы құрылғыда сақталады.',close:'Жабу',reviewsN:n=>`${n} пікір`,entries:n=>`${n} байланыс`,
  foot:'Тізімді Үркер тұрғындары WhatsApp-чатта құрастырған. Прототип іздеу жүйелерінен жабық.',choose:'— таңдаңыз —'}
};
const t=k=>T[lang][k];
// ---- Полный казахский словарь + новые ключи для обоих языков ----
Object.assign(T.ru,{waS:'WhatsApp',callS:'Позвонить',err_bad_photo:'Фото не подошло. Попробуйте другое (JPEG, до ~400 КБ после сжатия).',err_too_many_photos:'Можно добавить не больше 3 фото',navNews:'Новости',newsTitle:'Новости района',newsAll:'Все новости →',newsEmpty:'Пока новостей нет',
 newsEmptyS:'Знаете, что интересного происходит в Уркере? Предложите новость — после проверки она появится здесь.',newsSuggest:'✍️ Предложить новость',
 fallbackNote:'Текст есть только на казахском языке',pinned:'📌 Закреплено',newsFound:'Новости',video:'Видео',photosN:n=>`${n} фото`,readMore:'Читать →',
 newsCats:{event:'🎉 Событие',opening:'🏪 Открытие',achievement:'🏆 Достижение',improvement:'🌳 Благоустройство',akimat:'🏛 Акимат',other:'📰 Другое'},
 sugTitle:'Предложить новость',sugNoteDemo:'Демо-форма: пока ничего не отправляется. В рабочей версии новость уйдёт на проверку.',
 sugNoteLive:'Новость уйдёт на проверку и после редактирования появится в «Новостях района».',sTitle:'Заголовок',sTitlePh:'Например: во дворе открыли новую площадку',
 sText:'Что произошло? Где и когда?',sContact:'Ваш телефон или имя (по желанию, не публикуется)',sPhotos:'Фото (до 3)',sSend:'Отправить на проверку',
 sSent:'Спасибо! Новость отправлена на проверку.',sSentDemo:'Спасибо! Это демо: в рабочей версии новость уйдёт на проверку.',
 sErr:'Напишите заголовок (не короче 3 символов)',sTooMany:'Можно добавить не больше 3 фото',sPhotoErr:'Не удалось обработать фото',newsNotFound:'Новость не найдена',
 offline:'Нет связи с сервером — показан сохранённый список. Отзывы и заявки временно недоступны.',
 liveAddNote:'Заявка уйдёт на проверку администратору и появится на сайте после одобрения.',
 liveRepNote:'Сообщение уйдёт на проверку и после подтверждения появится в разделе «Важно».',
 liveSent:'Спасибо! Заявка отправлена на проверку.',liveRepSent:'Спасибо! Сообщение отправлено на проверку.',
 rvLiveNote:'Отзыв появится после проверки. Один отзыв на мастера с одного телефона.',rvName:'Ваше имя (по желанию)',
 rvPhone:'Ваш телефон (по желанию, не публикуется)',rvSent:'Спасибо! Отзыв отправлен на проверку.',rvPick:'Выберите от 1 до 5 звёзд',
 loading:'Загрузка…',vipLive:'📌 VIP · закреплено',vipOffer:'Ваша карточка будет первой в разделе',adLive:'Реклама',
 sortNoteLive:'Сначала VIP, затем по рейтингу с учётом числа отзывов (одна пятёрка не обгонит десятки хороших оценок). Отзывы проходят проверку.',
 err_already_reviewed:'Вы уже оставляли отзыв этому мастеру.',err_rate_limited:'Слишком много отправок. Попробуйте позже.',
 err_invalid_phone:'Проверьте номер телефона.',err_no_consent:'Отметьте согласие на показ номера.',
 viewsA:'Просмотры',addPhoto:'Добавить фото',photoCount:'Выбрано: {n} из {m}',vRequired:'Заполните это поле',vCheck:'Отметьте этот пункт',vChoose:'Выберите вариант из списка',vFormat:'Проверьте, правильно ли заполнено поле',
 err_generic:'Не удалось отправить. Проверьте интернет и попробуйте ещё раз.',stillLoading:'Подождите пару секунд — данные ещё загружаются, затем отправьте снова.',offlineForm:'Сейчас нет связи с сервером. Попробуйте позже.',
 back:'Назад',hints:['сантехник','газель','укол','электрик','такси','уголь'],
 waGreet:'Здравствуйте! Нашёл ваш контакт на сайте https://urker24.kz в разделе «{s}».',
 nothing:q=>`Пока никого нет по запросу «${q}»`,
 addErr:'Заполните название, раздел, номер из 11 цифр и отметьте согласие',repErr:'Напишите, что случилось и где',
 docTitle:'Уркер 24 — мастера, услуги, объявления и новости района Уркер, Астана',demoForm:'демо-форма'});
T.kz={waS:'WhatsApp',callS:'Қоңырау',err_bad_photo:'Фото жарамады. Басқасын көріңіз (JPEG, сығудан кейін ~400 КБ-қа дейін).',err_too_many_photos:'3 фотодан артық қосуға болмайды',navNews:'Жаңалықтар',newsTitle:'Аудан жаңалықтары',newsAll:'Барлығы →',newsEmpty:'Әзірге жаңалық жоқ',
 newsEmptyS:'Үркерде не қызық болып жатқанын білесіз бе? Жаңалық ұсыныңыз — тексеруден кейін осында шығады.',newsSuggest:'✍️ Жаңалық ұсыну',
 fallbackNote:'Мәтін тек орыс тілінде берілген',pinned:'📌 Бекітілген',newsFound:'Жаңалықтар',video:'Бейне',photosN:n=>`${n} фото`,readMore:'Оқу →',
 newsCats:{event:'🎉 Іс-шара',opening:'🏪 Ашылу',achievement:'🏆 Жетістік',improvement:'🌳 Абаттандыру',akimat:'🏛 Әкімдік',other:'📰 Басқа'},
 sugTitle:'Жаңалық ұсыну',sugNoteDemo:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында жаңалық тексеруге жіберіледі.',
 sugNoteLive:'Жаңалық тексеруге жіберіледі және өңделгеннен кейін «Аудан жаңалықтарында» жарияланады.',sTitle:'Тақырыбы',sTitlePh:'Мысалы: аулада жаңа алаң ашылды',
 sText:'Не болды? Қайда және қашан?',sContact:'Телефоныңыз немесе атыңыз (міндетті емес, жарияланбайды)',sPhotos:'Фото (3-ке дейін)',sSend:'Тексеруге жіберу',
 sSent:'Рақмет! Жаңалық тексеруге жіберілді.',sSentDemo:'Рақмет! Бұл — демо: жұмыс нұсқасында жаңалық тексеруге жіберіледі.',
 sErr:'Тақырыпты жазыңыз (кемінде 3 таңба)',sTooMany:'3 фотодан артық қосуға болмайды',sPhotoErr:'Фотоны өңдеу мүмкін болмады',newsNotFound:'Жаңалық табылмады',
 offline:'Сервермен байланыс жоқ — сақталған тізім көрсетілді. Пікірлер мен өтінімдер уақытша қолжетімсіз.',
 liveAddNote:'Өтінім әкімшінің тексеруіне жіберіледі және мақұлданғаннан кейін сайтта пайда болады.',
 liveRepNote:'Хабарлама тексеруге жіберіледі және расталғаннан кейін «Маңызды» бөлімінде жарияланады.',
 liveSent:'Рақмет! Өтінім тексеруге жіберілді.',liveRepSent:'Рақмет! Хабарлама тексеруге жіберілді.',
 rvLiveNote:'Пікір тексерілгеннен кейін шығады. Бір шеберге бір телефоннан бір пікір қалдыруға болады.',rvName:'Атыңыз (міндетті емес)',
 rvPhone:'Телефоныңыз (міндетті емес, жарияланбайды)',rvSent:'Рақмет! Пікір тексеруге жіберілді.',rvPick:'1-ден 5-ке дейін жұлдыз таңдаңыз',
 loading:'Жүктелуде…',vipLive:'📌 VIP · бекітілген',vipOffer:'Карточкаңыз бөлімде бірінші тұрады',adLive:'Жарнама',
 sortNoteLive:'Алдымен VIP, содан кейін пікір санын ескеретін рейтинг бойынша (бір ғана бестік ондаған жақсы бағадан озбайды). Пікірлер тексеруден өтеді.',
 err_already_reviewed:'Сіз бұл шеберге пікір қалдырып қойғансыз.',err_rate_limited:'Тым көп жіберілді. Кейінірек қайталап көріңіз.',
 err_invalid_phone:'Телефон нөмірін тексеріңіз.',err_no_consent:'Нөмірді көрсетуге келісім белгісін қойыңыз.',
 viewsA:'Қаралым',addPhoto:'Фото қосу',photoCount:'Таңдалды: {n} / {m}',vRequired:'Осы өрісті толтырыңыз',vCheck:'Осы тармақты белгілеңіз',vChoose:'Тізімнен бір нұсқаны таңдаңыз',vFormat:'Өрістің дұрыс толтырылғанын тексеріңіз',
 err_generic:'Жіберу мүмкін болмады. Интернетті тексеріп, қайталап көріңіз.',stillLoading:'Бірнеше секунд күтіңіз — деректер әлі жүктелуде, содан кейін қайта жіберіңіз.',offlineForm:'Қазір сервермен байланыс жоқ. Кейінірек қайталап көріңіз.',
 draft:'Жоба-прототип · жариялауға арналмаған',brand:'Үркер',tagline:'Жаныңыздағы шеберлер мен қызметтер',
 navHome:'Басты бет',navSearch:'Іздеу',navAdd:'Қосу',navAnn:'Маңызды',back:'Артқа',
 searchPh:'Мысалы: көмір, жүк тасу',searchTitle:'Шебер немесе қызмет іздеу',cats:'Барлық бөлімдер',catsHint:'Бөлімді басып, қажетті маманды/бизнесті таңдаңыз',
 hints:['сантехник','жүк тасу','ине салу','электрик','такси','көмір'],
 promoT:'Мұнда сіздің жарнамаңыз болуы мүмкін',promoS:'Жарнама орналастыру үшін басыңыз',promoBtn:'Жарнама орналастыру',adMsg:'Сәлеметсіз бе! https://urker24.kz сайтында жарнама орналастырғым келеді.',ad:'Жарнама',
 wa:'WhatsApp-қа жазу',call:'Қоңырау шалу',noName:'Тізімдегі нөмір',noReviews:'әзірге пікір жоқ',review:'Баға беру',demo:'демо',
 waGreet:'Сәлеметсіз бе! Сіздің байланысыңызды https://urker24.kz сайтындағы «{s}» бөлімінен таптым.',
 sortList:'Тізімдегі ретпен',sortRating:'Рейтинг бойынша',all:'Барлығы',found:n=>`Табылғаны: ${n}`,sections:'Сәйкес бөлімдер',
 nothing:q=>`«${q}» сұрауы бойынша әзірге ешкім жоқ`,
 nothingS:'Осындай шеберді білесіз бе, әлде өз бизнесіңіз бар ма? Қосыңыз — тексеруден кейін осында пайда болады.',addBiz:'➕ Өз бизнесіңізді қосу',
 starB:'⭐ Чат ұсынған',newB:'🆕 Жаңа',dup:'Бұл нөмір мына бөлімдерде де бар: ',warn10:'⚠️ Нөмірде 10 сан ғана бар — нақтылау қажет',
 tollfree:'☎️ 8-800 тегін желісі, тек қоңырау шалуға болады',
 vipT:'Жоғарыда бекіту — басыңыз',vipS:'Бөлімнің жоғарғы жағындағы ерекшеленген орын',vip:'Карточкаңыз бөлімде бірінші тұрады',vipMsg:'Сәлеметсіз бе! https://urker24.kz сайтындағы «{s}» бөлімінің жоғарғы жағына карточкамды бекіткім келеді.',
 sortNote:'Рейтинг пен пікірлер — демо: тек осы телефонда сақталады.',
 addTitle:'Өз бизнесіңізді қосу',addNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында өтінім модерацияға түседі де, тексеруден кейін сайтта пайда болады.',
 fName:'Аты-жөні немесе атауы',fCat:'Бөлім',fWhat:'Немен айналысасыз?',fWhatPh:'Мысалы: кір жуғыш машина жөндеймін, үйге барамын',fPhone:'Телефон (WhatsApp)',
 fAddr:'Мекенжай немесе бағдар (міндетті емес)',fConsent:'Нөмірімнің сайтта көрсетілуіне келісемін',fVip:'Бекітілген орын немесе жарнама қажет (бөлек хабарласамыз)',
 fSend:'Модерацияға жіберу',sent:'Рақмет! Бұл — демо: жұмыс нұсқасында өтінім модерацияға жіберіледі.',
 addErr:'Атауын, бөлімін, 11 саннан тұратын нөмірді толтырып, келісім белгісін қойыңыз',
 rvTitle:'Пікіріңіз',rvPh:'Не ұнады? (міндетті емес)',rvSave:'Пікірді сақтау',rvSaved:'Пікір осы телефонда сақталды (демо)',
 rvDemo:'Демо: пікір тек осы құрылғыда сақталады.',close:'Жабу',reviewsN:n=>`${n} пікір`,entries:n=>`${n} байланыс`,
 foot:'Тізімді Үркер тұрғындары WhatsApp-чатта құрастырған. Прототип іздеу жүйелерінен жасырылған.',choose:'— таңдаңыз —',
 annTitle:'Маңызды: өшірулер, жөндеу, оқиғалар',annAll:'Барлығы →',annEmpty:'Қазір маңызды хабарландыру жоқ',
 annEmptyS:'Жарықтың, судың не газдың өшірілуі немесе жөндеу жұмыстары туралы білсеңіз, хабарлаңыз — тексеріп, жариялаймыз.',
 annActive:'өзекті',annDone:'аяқталды',annUrgent:'шұғыл',annExample:'МЫСАЛ · демо',annSource:'Дереккөз',annShare:'WhatsApp арқылы бөлісу',
 annReport:'📣 Маңызды жайт туралы хабарлау',annTypes:{power:'Жарық',water:'Су',gas:'Газ',repair:'Жөндеу',other:'Басқа'},annFound:'Маңызды',
 repTitle:'Маңызды жайт туралы хабарлау',repNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында хабарлама модерацияға түседі де, тексеруден кейін «Маңызды» бөлімінде жарияланады.',
 rType:'Не болды?',rTitle:'Не болып жатқанын қысқаша жазыңыз',rTitlePh:'Мысалы: таңертеңнен бері жарық жоқ',rArea:'Көшелер / үйлер',
 rWhen:'Қашан (күні мен уақыты)',rSrc:'Ақпарат қайдан алынды?',rSrcPh:'Мысалы: Астана-РЭК хабарламасы, өзім көрдім',
 rContact:'Телефоныңыз (міндетті емес, нақтылау үшін)',rSend:'Модерацияға жіберу',rSent:'Рақмет! Бұл — демо: жұмыс нұсқасында хабарлама модерацияға жіберіледі.',
 repErr:'Не болғанын және қай жерде екенін жазыңыз',docTitle:'Үркер 24 — Үркер ауданының шеберлері, қызметтері, хабарландырулары мен жаңалықтары, Астана',demoForm:'демо-форма'};


// ---------- backend ----------
const SB=window.SBCreate?window.SBCreate({auth:false}):{enabled:false};
let LIVE=false, OFFLINE=false, ADS=[];
let LOADING=!!SB.enabled;
// счётчики просмотров новостей и «Важно» (10_views.sql). Нет функции в базе — счётчики просто не показываются.
let VIEWS={};const vKey=(k,id)=>k+':'+id;
const vw=(k,id)=>{const n=VIEWS[vKey(k,id)]||0;return n>0?`<span class="vw" data-vw="${vKey(k,id)}" aria-label="${t('viewsA')}: ${n}">👁 ${n}</span>`:`<span class="vw" data-vw="${vKey(k,id)}"></span>`};  // 0 — не показываем
const seenNow={};  // не дёргать базу повторно при перерисовке той же страницы
function countView(k,id){if(!LIVE||seenNow[vKey(k,id)])return;seenNow[vKey(k,id)]=1;
 SB.rpc('content_view',{p_kind:k,p_id:+id,p_device_id:deviceId()},8000).then(n=>{n=+n||0;if(n<1)return;VIEWS[vKey(k,id)]=n;
  document.querySelectorAll(`[data-vw="${vKey(k,id)}"]`).forEach(e=>{e.textContent='👁 '+n;e.setAttribute('aria-label',t('viewsA')+': '+n)})}).catch(()=>{})}   // пока база не ответила — «Загрузка…», никаких демо-данных
function deviceId(){let d=localStorage.getItem('urker_device');if(!d||!/^[A-Za-z0-9-]{8,64}$/.test(d)){d=(crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''));localStorage.setItem('urker_device',d)}return d}
const errMsg=e=>{const c=String(e&&e.code||'');for(const k of ['already_reviewed','rate_limited','invalid_phone','no_consent','bad_photo','too_many_photos','bad_instagram','bad_2gis','too_long','empty','not_found'])if(c.includes(k))return t('err_'+k);return t('err_generic')};
// Выбор фото: системная кнопка «Choose files» скрыта (она на языке браузера), вместо неё — своя кнопка RU/KZ.
// Поле остаётся в документе (визуально скрыто), поэтому доступно с клавиатуры: Tab → Enter/Пробел.
const fcText=(n,m)=>t('photoCount').replace('{n}',n).replace('{m}',m);
const fileBtn=(id,m)=>`<div class="fpick"><input id="${id}" type="file" accept="image/*" multiple class="vh-file"><label for="${id}" class="file-btn">📷 ${t('addPhoto')}</label><span class="fcount" id="${id}-n" aria-live="polite">${fcText(0,m)}</span></div>`;
const setFC=(id,n,m)=>{const e=document.getElementById(id+'-n');if(e)e.textContent=fcText(n,m)};
// Подсказки браузера при проверке форм («Please fill out this field») — заменяем своими RU/KZ
document.addEventListener('invalid',ev=>{const el=ev.target;if(!el||!el.setCustomValidity)return;el.setCustomValidity('');const v=el.validity;
 el.setCustomValidity(v.valueMissing?t(el.type==='checkbox'||el.type==='radio'?'vCheck':el.tagName==='SELECT'?'vChoose':'vRequired'):t('vFormat'))},true);
['input','change'].forEach(n=>document.addEventListener(n,ev=>{const el=ev.target;if(el&&el.setCustomValidity)el.setCustomValidity('')},true));
const hp=()=>`<div style="position:absolute;left:-5000px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><label>Website<input id="hpf" name="website" tabindex="-1" autocomplete="off"></label></div>`;

// ---------- статистика (анонимно, без cookies) ----------
const STATS_OFF=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
function visitorId(){let v=localStorage.getItem('urker_vid');if(!v||!/^[A-Za-z0-9-]{8,64}$/.test(v)){v=(crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''));localStorage.setItem('urker_vid',v)}return v}
const DEVICE=(matchMedia('(pointer:coarse)').matches||/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))?'mobile':'desktop';
let firstView=true,lastPath='',lastSearch='',searchTimer=0;
function track(kind,extra){if(!SB.enabled||STATS_OFF||OFFLINE)return;
 SB.beacon('track',Object.assign({p_kind:kind,p_visitor_id:visitorId(),p_lang:lang,p_device:DEVICE},extra||{}))}
function trackView(){const path=((location.hash||'#/').replace(/^#/,'').split('?')[0].replace(/^\/my\/.*/,'/my')).slice(0,120)||'/';if(path===lastPath)return;lastPath=path;
 let ref=null;if(firstView){try{const h=document.referrer?new URL(document.referrer).hostname:'';if(h&&h!==location.hostname)ref=h}catch(e){}firstView=false}
 track('view',{p_path:path,p_referrer:ref})}
function trackSearch(q,n){clearTimeout(searchTimer);const qq=String(q||'').trim().toLowerCase();if(qq.length<2)return;
 searchTimer=setTimeout(()=>{if(qq===lastSearch)return;lastSearch=qq;track('search',{p_query:qq,p_result_count:n})},1500)}
function loadMetrika(){const C=window.URKER_CONFIG||{},id=String(C.metrikaId||'').trim();if(!/^\d{5,12}$/.test(id))return;
 (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
  for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return}k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
  (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
 window.ym(+id,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,trackHash:true,webvisor:!!C.metrikaWebvisor});
 const ns=document.createElement('noscript');ns.innerHTML=`<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px" alt=""></div>`;document.body.appendChild(ns)}

// ---------- helpers ----------
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const secById=Object.fromEntries(D.sections.map(s=>[s.id,s]));
const subById={};D.sections.forEach(s=>s.subs.forEach(x=>{subById[x.id]=Object.assign(x,{section:s.id})}));
const secTitle=s=>lang==='kz'?s.title_kz:s.title_ru;
const subTitle=x=>x.implicit?secTitle(secById[x.section]):(lang==='kz'?x.title_kz:x.title);
function fmtPhone(e){const r=e.raw_phone;if(r.length!==11)return r;return `8 ${r.slice(1,4)} ${r.slice(4,7)} ${r.slice(7,9)} ${r.slice(9)}`}
const KZMAP={'ә':'а','ө':'о','ү':'у','ұ':'у','қ':'к','ғ':'г','ң':'н','һ':'х','і':'и','ё':'е','й':'и','ъ':'','ь':''};
function norm(s){return String(s).toLowerCase().replace(/[әөүұқғңһіёйъь]/g,c=>KZMAP[c]).replace(/[^a-zа-я0-9/]+/g,' ').trim()}
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let p=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const c=[i];let m=i;for(let j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));m=Math.min(m,c[j])}if(m>max)return max+1;p=c}return p[b.length]}

// ---------- reviews (demo, localStorage) ----------
const RK='urker_reviews_demo_v1';
const getRevs=()=>{try{return JSON.parse(localStorage.getItem(RK))||{}}catch(e){return{}}};
const BAYES_C=5;
function demoMean(){const all=Object.values(getRevs()).flat();return all.length?all.reduce((a,b)=>a+b.stars,0)/all.length:4.0}
function bayes(id,m){if(LIVE){const e=D.entries.find(x=>x.id==id)||{};return e.cnt?(e.bayes!=null?e.bayes:(BAYES_C*4+e.avg*e.cnt)/(BAYES_C+e.cnt)):null}return null}  // без базы рейтингов нет (локальные «демо»-отзывы не используются)
const fmtAvg=v=>(Math.round(v*10)/10).toFixed(1).replace('.',',');
function rating(id){if(LIVE){const e=D.entries.find(x=>x.id==id)||{};return{n:e.cnt||0,avg:e.avg||0,list:[]}}return{n:0,avg:0,list:[]}}

// ---------- search index ----------
const subTokens={};
for(const id in subById){const x=subById[id],s=secById[x.section];
 subTokens[id]=norm([x.title,x.title_kz||'',s.title_raw,s.title_kz,SYN[id]||''].join(' ')).split(' ').filter(Boolean)}
let entryTokens=[];
function buildIndex(){
 entryTokens=D.entries.map(e=>Array.from(new Set((subTokens[e.sub]||[]).concat(norm(e.name+' '+e.note+' '+(e.address||'')).split(' ').filter(Boolean)))));
 const cnt={};D.entries.forEach(e=>cnt[e.raw_phone]=(cnt[e.raw_phone]||0)+1);D.entries.forEach(e=>{e.dup_count=cnt[e.raw_phone]>1?cnt[e.raw_phone]:0});
}
buildIndex();
const visibleSubs=s=>s.subs.filter(x=>D.entries.some(e=>e.sub===x.id));
function tokScore(q,tokens){
 let best=0;const stem=q.length>5?q.slice(0,q.length-2):(q.length>4?q.slice(0,q.length-1):q);
 const max=q.length>=8?2:(q.length>=5?1:0);
 for(const w of tokens){
  if(w===q)return 4;
  if(w.startsWith(q)){best=Math.max(best,3);continue}
  if(q.length>=4&&w.startsWith(stem)){best=Math.max(best,2);continue}
  if(max&&w.length>=4){const d=Math.min(lev(q,w,max),(w.length>q.length&&q.length>=7)?lev(q,w.slice(0,q.length),max):9);if(d<=max)best=Math.max(best,1)}
 }return best}
function search(query){
 const qn=norm(query);if(!qn)return null;
 const digits=query.replace(/\D/g,'');
 const qs=qn.split(' ').filter(w=>w.length>=2||/\d/.test(w));
 const res=[];
 D.entries.forEach((e,i)=>{
  if(digits.length>=4&&(e.raw_phone.includes(digits)||(e.wa||'').includes(digits))){res.push({e,s:10});return}
  if(!qs.length)return;let tot=0;
  for(const q of qs){if(/^\d+$/.test(q)&&q.length<4){const sc=tokScore(q,entryTokens[i]);if(!sc){tot=0;break}tot+=sc;continue}
   const sc=tokScore(q,entryTokens[i]);if(!sc){tot=0;break}tot+=sc}
  if(tot)res.push({e,s:tot});
 });
 const bad=e=>e.flags.includes('malformed')?1:0;
 res.sort((a,b)=>bad(a.e)-bad(b.e)||b.s-a.s||a.e.id-b.e.id);
 const subs={};res.forEach(r=>{subs[r.e.sub]=(subs[r.e.sub]||0)+1});
 return{list:res.map(r=>r.e),subs:Object.entries(subs).sort((a,b)=>b[1]-a[1])};
}

// ---------- UI pieces ----------
const WA_SVG='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>';
function stars(avg){let h='';for(let i=1;i<=5;i++)h+=i<=Math.round(avg)?'★':'<span class="off">★</span>';return `<span class="stars">${h}</span>`}
// WhatsApp: приветствие со ссылкой на сайт и названием подкатегории (короткие названия для длинных)
const WA_SHORT={'med-1':['Справки и анализы','Анықтамалар мен талдаулар']};
function waText(e){const x=subById[e.sub]||{},sh=WA_SHORT[e.sub];return t('waGreet').replace('{s}',sh?sh[lang==='kz'?1:0]:subTitle(x))}
function card(e,showSection){
 const x=subById[e.sub],s=secById[e.section],r=rating(e.id);
 const others=e.dup_count?D.entries.filter(o=>o.raw_phone===e.raw_phone&&o.id!==e.id).map(o=>subTitle(subById[o.sub])):[];
 const bad=e.flags.includes('malformed'),toll=e.flags.includes('tollfree');
 const waMsg=encodeURIComponent(waText(e));
 return `<article class="card ${e.vip?'vip':''}" id="e${e.id}">${e.vip?`<span class="tag">${t('vipLive')}</span>`:''}
  <div class="sub">${esc(x.emoji||s.emoji)} ${showSection?esc(secTitle(s))+' · ':''}${esc(subTitle(x))}</div>
  ${e.biz||e.verified?`<div class="biz">${e.biz?esc(e.biz):''}${e.verified?`<span class="vf">✔ ${t('verified')}</span>`:''}</div>`:''}
  <div class="idl"><span class="nm">${esc(e.name||e.owner||fmtPhone(e))}</span>${e.name||e.owner?`<span class="ph">${esc(fmtPhone(e))}</span>`:''}</div>
  ${e.note?`<p class="note">${esc(e.note)}</p>`:''}${e.address?`<p class="note">📍 ${esc(e.address)}</p>`:''}${profileHtml(e)}
  ${bad||toll||others.length?`<div class="badges">
   ${bad?`<span class="badge warn">${t('warn10')}</span>`:''}${toll?`<span class="badge">${t('tollfree')}</span>`:''}
   ${others.length?`<span class="badge">${t('dup')}${esc(others.join(', '))}</span>`:''}</div>`:''}
  <div class="actions">
   <a class="btn wa ${e.wa?'':'off'}" aria-label="${esc(t('wa'))}: ${esc(e.name||fmtPhone(e))}" ${e.wa?`href="https://api.whatsapp.com/send?phone=${e.wa}&text=${waMsg}" target="_blank" rel="noopener"`:'aria-disabled="true"'}>${WA_SVG}<span>${t('waS')}</span></a>
   <a class="btn call ${bad?'off':''}" aria-label="${esc(t('call'))}: ${esc(fmtPhone(e))}" ${bad?'aria-disabled="true"':`href="tel:${esc(e.tel)}"`}>📞 <span>${t('callS')}</span></a>
  </div>
  <div class="rate">${stars(r.avg)}<span class="rc">${r.n?`<b>★ ${fmtAvg(r.avg)}</b> (${r.n})`:t('noReviews')}</span>
   <button data-review="${e.id}">✍️ ${t('review')}</button></div>
  ${CLAIMS_ON?`<button class="claim-l" data-claim="${e.id}">${t('claimL')}</button>`:''}
 </article>`}
const adWa=()=>{const d=String((window.URKER_CONFIG||{}).adContactWa||'').replace(/\D/g,'');return /^7\d{10}$/.test(d)?d:(/^87\d{9}$/.test(d)?'7'+d.slice(1):'')};
const adLink=msg=>{const w=adWa();return w?`href="https://api.whatsapp.com/send?phone=${w}&text=${encodeURIComponent(msg)}" target="_blank" rel="noopener"`:'href="#/add"'};
const vipCard=(sec)=>!ADS_ON?'':`<a class="card vip vip-mini" ${adLink(t('vipMsg').replace('{s}',sec?secTitle(sec):''))} title="${esc(t('vipS'))}"><span class="vm-i">📌</span><span class="vm-b"><b>${t('vipT')}</b><small>${t('vip')}</small></span><span class="vm-a">›</span></a>`;
const promo=()=>!ADS_ON?'':ADS.length?ADS.slice(0,2).map(a=>{const href=a.link_url||(a.wa?`https://wa.me/${a.wa}`:'#/add');return `<a class="promo live" href="${esc(href)}" ${href.startsWith('http')?'target="_blank" rel="noopener sponsored"':''}><span class="pi">${esc(a.emoji||'☕')}</span><span class="tag">${t('adLive')}</span><b>${esc(L({ru:a.title_ru,kz:a.title_kz}))}</b><span>${esc(L({ru:a.text_ru,kz:a.text_kz}))}</span></a>`}).join(''):`<a class="promo" ${adLink(t('adMsg'))}><span class="pi">📣</span><b>${t('promoT')}</b><span>${t('promoS')}</span><span class="promo-btn">${t('promoBtn')}</span></a>`;
const nothing=q=>`<div class="empty"><div style="font-size:52px">🤷</div><h2>${t('nothing')(esc(q))}</h2><p>${t('nothingS')}</p><a class="btn primary" href="#/add">${t('addBiz')}</a></div>`;
const searchBox=(q='')=>`<section class="hero"><h2>${t('searchTitle')}</h2><div class="search"><span class="ic">🔍</span><input id="q" type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="${t('searchPh')}" value="${esc(q)}"></div>
 <div class="hints">${t('hints').map(h=>`<button data-hint="${h}">${h}</button>`).join('')}</div></section>`;

function renderResults(q){
 const box=$('#results'),home=$('#homeBody');const r=search(q);
 if(!r){clearTimeout(searchTimer);box.innerHTML='';if(home)home.hidden=false;return}
 const ls=window.URKER_L?URKER_L.searchHtml(q):{n:0,html:''};
 trackSearch(q,r.list.length+annSearch(q).length+newsSearch(q).length+ls.n);
 if(home)home.hidden=true;
 const nw=newsSearch(q);const newsHtml=nw.length?`<div class="sugg-l">📰 ${t('newsFound')}: ${nw.length}</div>${nw.slice(0,3).map(n=>newsCard(n,true)).join('')}`:'';
 const an=annSearch(q);const annHtml=ls.html+newsHtml+(an.length?`<div class="sugg-l">📣 ${t('annFound')}: ${an.length}</div>${an.map(a=>`<a href="#/ann/${a.id}" class="ann-link">${annCard(a,true)}</a>`).join('')}`:'');
 if(!r.list.length){box.innerHTML=annHtml+(an.length||nw.length||ls.n?'':nothing(q));return}
 box.innerHTML=annHtml+`<div class="sortbar"><span>${t('found')(r.list.length)}</span></div>
  ${r.subs.length?`<div class="sugg-l">${t('sections')}:</div><div class="chips">${r.subs.map(([id,n])=>{const x=subById[id];return `<button data-goto="${x.section}|${id}">${esc(x.emoji)} ${esc(subTitle(x))} · ${n}</button>`}).join('')}</div>`:''}
  <div class="cards">${r.list.map(e=>card(e,true)).join('')}</div>`;
}
function bindSearch(){
 const inp=$('#q');if(!inp)return;
 inp.addEventListener('input',()=>{renderResults(inp.value);history.replaceState(null,'',inp.value?'#/search?q='+encodeURIComponent(inp.value):(location.hash.startsWith('#/search')?'#/search':'#/'))});
 renderResults(inp.value);
}

// ---------- announcements ----------
let ANN=[];   // только из базы; демо-объявлений нет
const ANN_TYPES={power:{ic:'⚡',c:'#f2a100',kw:'свет света светом электричество электроэнергия электроэнергии электр энергия отключение света нет света жарық жарык электр'},
 water:{ic:'💧',c:'#2f8fdb',kw:'вода воды водой водоснабжение холодная горячая отключение воды нет воды су суык ыстык'},
 gas:{ic:'🔥',c:'#e8503c',kw:'газ газа газоснабжение отключение газа утечка газ'},
 repair:{ic:'🚧',c:'#8a6d3b',kw:'ремонт ремонта дорога дороги дорог перекрытие раскопки трубы асфальт работы жондеу жол'},
 other:{ic:'📢',c:'#8a5cf6',kw:'объявление новость информация хабарландыру'}};
const COMMON_ANN_KW='отключение отключения отключат авария аварийное объявление объявления важное плановое оширу хабарландыру';
const L=o=>o==null?'':(typeof o==='string'?o:(o[lang]||o.ru||''));
const annDate=s=>new Date(s+':00+05:00');
const annActive=a=>!a.end||annDate(a.end)>new Date();
const MONTHS={ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
 kz:['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан']};
function annWhen(a){const f=d=>{const [y,m,dd]=d.slice(0,10).split('-').map(Number);return `${dd} ${MONTHS[lang][m-1]}`};
 const tm=d=>d.slice(11,16);
 if(!a.start)return '';if(!a.end||a.start.slice(0,10)===a.end.slice(0,10))return `${f(a.start)}, ${tm(a.start)}${a.end?'–'+tm(a.end):''}`;
 return `${f(a.start)} ${tm(a.start)} — ${f(a.end)} ${tm(a.end)}`}
function annSorted(){return ANN.slice().sort((a,b)=>(annActive(b)-annActive(a))||((b.urgent?1:0)-(a.urgent?1:0))||(annActive(a)?annDate(a.start)-annDate(b.start):annDate(b.start)-annDate(a.start)))}
const annTokens=a=>norm([L(a.title),L(a.area),L(a.source),ANN_TYPES[a.type]?.kw||'',COMMON_ANN_KW,(T.ru.annTypes[a.type]||''),(T.kz.annTypes[a.type]||'')].join(' ')).split(' ').filter(Boolean);
function annSearch(query){const qs=norm(query).split(' ').filter(w=>w.length>=2);if(!qs.length)return[];
 return annSorted().filter(a=>{const tk=annTokens(a);return qs.every(q=>tokScore(q,tk)>0)})}
function annCard(a,compact){const ty=ANN_TYPES[a.type]||ANN_TYPES.other,act=annActive(a);
 const msg=`${ty.ic} ${L(a.title)}\n📍 ${L(a.area)}\n🕒 ${annWhen(a)}${a.source?'\n'+t('annSource')+': '+L(a.source):''}\nhttps://urker24.kz/#/ann/${a.id}`;
 return `<article class="ann ${a.urgent&&act?'urgent':''} ${act?'':'done'}" style="--tc:${ty.c}">
  <div class="ann-ic">${ty.ic}</div><div class="ann-b">
  <div class="ann-tags">${a.urgent&&act?`<span class="tag urg">❗ ${t('annUrgent')}</span>`:''}<span class="st ${act?'on':''}">${act?'● '+t('annActive'):'✓ '+t('annDone')}</span>${vw('ann',a.id)}</div>
  <h3>${esc(L(a.title))}</h3>
  <div class="ann-l">📍 ${esc(L(a.area))}</div><div class="ann-l">🕒 ${esc(annWhen(a))}</div>
  ${!compact&&a.source?`<div class="ann-l src">${t('annSource')}: ${esc(L(a.source))}</div>`:''}
  ${compact?'':`<a class="btn wa sm" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${WA_SVG}${t('annShare')}</a>`}
 </div></article>`}
const annEmpty=()=>LOADING?`<div class="ann-empty">⏳ <b>${t('loading')}</b></div>`:`<div class="ann-empty">✅ <b>${t('annEmpty')}</b><span>${t('annEmptyS')}</span></div>`;
function annBlock(){const act=annSorted().filter(annActive).slice(0,3);
 return `<section class="ann-block"><div class="ann-h"><h2>📣 ${t('annTitle')}</h2><a href="#/ann">${t('annAll')}</a></div>
  ${act.length?act.map(a=>`<a href="#/ann/${a.id}" class="ann-link">${annCard(a,true)}</a>`).join(''):annEmpty()}</section>`}
let annFilter='';
function viewAnn(focusId){
 const list=annSorted().filter(a=>!annFilter||a.type===annFilter);
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>📣 ${t('annTitle')}</h1></div>
 <div class="chips"><button class="${annFilter?'':'on'}" data-af="">${t('all')}</button>${Object.entries(ANN_TYPES).map(([k,v])=>`<button class="${annFilter===k?'on':''}" data-af="${k}">${v.ic} ${t('annTypes')[k]}</button>`).join('')}</div>
 ${list.length?list.map(a=>`<div id="a${a.id}">${annCard(a,false)}</div>`).join(''):annEmpty()}
 <a class="btn primary" style="margin:8px 0 6px" href="#/report">${t('annReport')}</a>`;
 app.querySelectorAll('[data-af]').forEach(b=>b.onclick=()=>{annFilter=b.dataset.af;viewAnn()});
 if(focusId&&ANN.some(a=>String(a.id)===String(focusId)))countView('ann',focusId);
 if(focusId){const el=document.getElementById('a'+focusId);if(el)setTimeout(()=>{el.scrollIntoView({block:'center'});el.firstElementChild.classList.add('flash')},30)}
}
function viewReport(){
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/ann'" aria-label="${t('back')}">←</button><h1>📣 ${t('repTitle')}</h1></div>
 ${formNote('liveRepNote','repNote')}
 <form id="repf" novalidate style="position:relative">${hp()}
  <div class="f"><label>${t('rType')}</label><div class="chips wrap">${Object.entries(ANN_TYPES).map(([k,v],i)=>`<label class="radio"><input type="radio" name="rt" value="${k}" ${i==0?'checked':''}> ${v.ic} ${t('annTypes')[k]}</label>`).join('')}</div></div>
  <div class="f"><label for="r1">${t('rTitle')}</label><input id="r1" placeholder="${t('rTitlePh')}"></div>
  <div class="f"><label for="r2">${t('rArea')}</label><input id="r2"></div>
  <div class="f"><label for="r3">${t('rWhen')}</label><input id="r3" type="datetime-local"></div>
  <div class="f"><label for="r4">${t('rSrc')}</label><input id="r4" placeholder="${t('rSrcPh')}"></div>
  <div class="f"><label for="r5">${t('rContact')}</label><input id="r5" type="tel" inputmode="tel"></div>
  <button class="btn primary" type="submit">${t('rSend')}</button></form>`;
 $('#repf').onsubmit=ev=>{ev.preventDefault();const f=ev.target;if(!$('#r1').value.trim()||!$('#r2').value.trim()){toast(t('repErr'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t(LOADING?'stillLoading':'offlineForm'));return}
  sending(f.querySelector('[type=submit]'),async()=>{
   try{await SB.rpc('submit_report',{p_type:(f.querySelector('[name=rt]:checked')||{}).value||'other',p_title:$('#r1').value,p_area:$('#r2').value,p_when:$('#r3').value,
     p_source:$('#r4').value,p_contact:$('#r5').value,p_device_id:deviceId(),p_hp:$('#hpf').value});toast(t('liveRepSent'));f.reset()}
   catch(e){toast(errMsg(e))}})};
}

// ---------- новости района ----------
let NEWS=[];  // только из базы; демо-новостей нет
const NEWS_KW={event:'событие мероприятие праздник концерт иc-шара мереке',opening:'открытие открылся открылась новый магазин кафе ашылу ашылды',achievement:'достижение победа награда спорт олимпиада жетистик жениc',
 improvement:'благоустройство двор площадка дорога асфальт освещение парк деревья абаттандыру аула',akimat:'акимат аким встреча собрание жители акимдик кездесу',other:'новость новости жаналык'};
const LT=o=>{o=o||{};const want=o[lang]||'',other=o[lang==='kz'?'ru':'kz']||'';return want?{text:want,fb:false}:{text:other,fb:!!other}};
function newsSorted(){return NEWS.slice().sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||String(b.date).localeCompare(String(a.date)))}
const newsDate=n=>{if(!n.date)return '';const [y,m,d]=n.date.slice(0,10).split('-').map(Number);return `${d} ${MONTHS[lang][m-1]} ${y}`};
function newsCover(n,cls){const c=(t('newsCats')[n.category]||'📰').split(' ')[0];
 return n.cover?`<div class="${cls}" style="background-image:url('${esc(n.cover)}')"></div>`:`<div class="${cls} ph"><span>${c}</span></div>`}
function newsCard(n,compact){const ti=LT(n.title),le=LT(n.lead);
 return `<a class="news-card ${compact?'compact':''}" href="#/news/${n.id}">${newsCover(n,'nc-img')}<div class="nc-b">
  <div class="nc-tags">${n.pinned?`<span class="chip pin">${t('pinned')}</span>`:''}<span class="chip">${esc(t('newsCats')[n.category]||'')}</span>${vw('news',n.id)}</div>
  <h3>${esc(ti.text)}</h3>${compact?'':`<p>${esc(le.text)}</p>`}<small>${esc(newsDate(n))}${n.photos&&n.photos.length>1?' · 🖼 '+t('photosN')(n.photos.length):''}${n.video?' · ▶️ '+t('video'):''}</small></div></a>`}
const newsEmpty=()=>LOADING?`<div class="ann-empty">⏳ <b>${t('loading')}</b></div>`:`<div class="ann-empty">📰 <b>${t('newsEmpty')}</b><span>${t('newsEmptyS')}</span><a href="#/news/suggest" class="lnk">${t('newsSuggest')}</a></div>`;
function newsBlock(){const l=newsSorted().slice(0,3);
 return `<section class="ann-block"><div class="ann-h"><h2>📰 ${t('newsTitle')}</h2><a href="#/news">${t('newsAll')}</a></div>${l.length?l.map(n=>newsCard(n,true)).join(''):newsEmpty()}</section>`}
const newsTokens=n=>norm([n.title&&n.title.ru,n.title&&n.title.kz,n.lead&&n.lead.ru,n.lead&&n.lead.kz,n.body&&n.body.ru,n.body&&n.body.kz,NEWS_KW[n.category]||'',T.ru.newsCats[n.category],T.kz.newsCats[n.category]].join(' ')).split(' ').filter(Boolean);
function newsSearch(q){const qs=norm(q).split(' ').filter(w=>w.length>=3);if(!qs.length)return[];return newsSorted().filter(n=>{const tk=newsTokens(n);return qs.every(x=>tokScore(x,tk)>0)})}
let newsFilter='';
function viewNews(){
 const list=newsSorted().filter(n=>!newsFilter||n.category===newsFilter);
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>📰 ${t('newsTitle')}</h1></div>
 <div class="chips"><button class="${newsFilter?'':'on'}" data-nf="">${t('all')}</button>${Object.keys(T.ru.newsCats).map(k=>`<button class="${newsFilter===k?'on':''}" data-nf="${k}">${esc(t('newsCats')[k])}</button>`).join('')}</div>
 ${list.length?'<div class="ncards">'+list.map(n=>newsCard(n,false)).join('')+'</div>':newsEmpty()}
 <a class="btn primary" style="margin:8px 0 6px" href="#/news/suggest">${t('newsSuggest')}</a>`;
 app.querySelectorAll('[data-nf]').forEach(b=>b.onclick=()=>{newsFilter=b.dataset.nf;viewNews()});
}
function linkify(s){return esc(s).replace(/https:\/\/[^\s<]+/g,u=>`<a href="${u}" target="_blank" rel="noopener nofollow">${u}</a>`)}
function embed(url){let m;
 if((m=String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{11})/)))
  return `<div class="embed yt"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="YouTube" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
 if((m=String(url).match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)))
  return `<div class="embed ig"><iframe src="https://www.instagram.com/p/${m[1]}/embed" title="Instagram" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>`;
 return ''}
function viewArticle(id){
 if(id==='suggest')return viewSuggest();
 const n=NEWS.find(x=>String(x.id)===String(id));
 if(!n){app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/news'">←</button><h1>📰</h1></div><div class="empty"><h2>${t('newsNotFound')}</h2><a class="btn primary" href="#/news">${t('newsAll')}</a></div>`;return}
 countView('news',n.id);
 const ti=LT(n.title),le=LT(n.lead),bo=LT(n.body),fb=ti.fb||bo.fb||le.fb;
 const photos=(n.photos||[]).filter(Boolean);
 const link=location.origin+location.pathname+'#/news/'+n.id;
 const msg=`📰 ${ti.text}\n${le.text?le.text+'\n':''}${link}`;
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/news'" aria-label="${t('back')}">←</button><h1 class="sm">📰 ${t('newsTitle')}</h1></div>
 <article class="article">
  ${photos.length>1?`<div class="gallery" id="gal">${photos.map((u,i)=>`<img src="${esc(u)}" alt="" loading="${i?'lazy':'eager'}">`).join('')}</div><div class="gal-n"><span id="galn">1</span> / ${photos.length}</div>`:newsCover(n,'art-cover')}
  <div class="nc-tags">${n.pinned?`<span class="chip pin">${t('pinned')}</span>`:''}<span class="chip">${esc(t('newsCats')[n.category]||'')}</span><small>${esc(newsDate(n))}</small>${vw('news',n.id)}</div>
  <h1>${esc(ti.text)}</h1>
  ${fb?`<p class="fb-note">🌐 ${t('fallbackNote')}</p>`:''}
  ${le.text?`<p class="lead">${esc(le.text)}</p>`:''}
  <div class="body">${bo.text.split(/\n{2,}/).map(p=>`<p>${linkify(p).replace(/\n/g,'<br>')}</p>`).join('')}</div>
  ${n.video?embed(n.video):''}
  <a class="btn wa" style="margin-top:14px" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${WA_SVG}${t('annShare')}</a>
 </article>`;
 const g=$('#gal');if(g)g.addEventListener('scroll',()=>{$('#galn').textContent=Math.round(g.scrollLeft/g.clientWidth)+1},{passive:true});
}
function compressImage(file,maxSide,q){return new Promise((res,rej)=>{const url=URL.createObjectURL(file);const img=new Image();
 img.onload=()=>{const k=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',q))};img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('img'))};img.src=url})}
function viewSuggest(){
 let photos=[];
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/news'" aria-label="${t('back')}">←</button><h1>✍️ ${t('sugTitle')}</h1></div>
 ${formNote('sugNoteLive','sugNoteDemo')}
 <form id="sugf" novalidate style="position:relative">${hp()}
  <div class="f"><label for="s1">${t('sTitle')}</label><input id="s1" maxlength="200" placeholder="${t('sTitlePh')}"></div>
  <div class="f"><label for="s2">${t('sText')}</label><textarea id="s2" maxlength="5000" style="min-height:140px"></textarea></div>
  <div class="f"><label for="s3">${t('sPhotos')}</label>${fileBtn('s3',3)}<div class="thumbs" id="sth"></div></div>
  <div class="f"><label for="s4">${t('sContact')}</label><input id="s4" maxlength="60"></div>
  <button class="btn primary" type="submit">${t('sSend')}</button></form>`;
 const draw=()=>{setFC('s3',photos.length,3);$('#sth').innerHTML=photos.map((p,i)=>`<div class="th"><img src="${p}" alt=""><button type="button" data-rm="${i}" aria-label="✕">✕</button></div>`).join('')};
 $('#sth').onclick=ev=>{const b=ev.target.closest('[data-rm]');if(b){photos.splice(+b.dataset.rm,1);draw()}};
 $('#s3').onchange=async ev=>{const files=[...ev.target.files];ev.target.value='';
  if(photos.length+files.length>3)toast(t('sTooMany'));
  for(const f of files.slice(0,3-photos.length)){try{let d=await compressImage(f,1280,0.8);if(d.length>580000)d=await compressImage(f,960,0.7);photos.push(d)}catch(e){toast(t('sPhotoErr'))}}draw()};
 $('#sugf').onsubmit=ev=>{ev.preventDefault();const f=ev.target;if($('#s1').value.trim().length<3){toast(t('sErr'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t(LOADING?'stillLoading':'offlineForm'));return}
  sending(f.querySelector('[type=submit]'),async()=>{try{await SB.rpc('submit_news',{p_title:$('#s1').value,p_text:$('#s2').value,p_contact:$('#s4').value,p_photos:photos,p_device_id:deviceId(),p_hp:$('#hpf').value},30000);
   toast(t('sSent'));f.reset();photos=[];draw()}catch(e){toast(errMsg(e))}})};
}

// ---------- views ----------
function viewHome(q=''){
 app.innerHTML=`${searchBox(q)}<div id="results"></div>
 <div id="homeBody">${window.URKER_PWA?URKER_PWA.banner():''}${window.URKER_L?URKER_L.homeTiles():''}${annBlock()}${window.URKER_L?URKER_L.homeStrip():''}${newsBlock()}${promo()}<h2 class="cats-h">${t('cats')}</h2><p class="cats-hint">${t('catsHint')}</p><div class="tiles">${D.sections.filter(s=>D.entries.some(e=>e.section===s.id)).map(s=>{const n=D.entries.filter(e=>e.section===s.id).length;
  return `<a class="tile" href="#/c/${s.id}"><span class="em">${s.emoji}</span><b>${esc(secTitle(s))}</b><small>${t('entries')(n)}</small></a>`}).join('')}</div></div>`;
 bindSearch();
}
let sortMode='list';
function viewCat(id,subId,focusId){  // focusId: #/c/<раздел>/<подраздел>/<id карточки> — ссылка на конкретную карточку (кнопка «📲 Отправить автору» в админке)
 const s=secById[id];if(!s)return viewHome();
 const vs=visibleSubs(s);const showChips=!(vs.length<=1&&(vs[0]||{}).implicit);
 let list=D.entries.filter(e=>e.section===id&&(!subId||e.sub===subId));
 const bad=e=>e.flags.includes('malformed')?1:0;list.sort((a,b)=>bad(a)-bad(b)||a.id-b.id);
 if(sortMode==='rating'){const m=LIVE?0:demoMean(),sc={},nn={};list.forEach(e=>{sc[e.id]=bayes(e.id,m);nn[e.id]=rating(e.id).n});
  list=list.slice().sort((a,b)=>{const sa=sc[a.id],sb=sc[b.id];return bad(a)-bad(b)||(sa==null)-(sb==null)||(sb||0)-(sa||0)||nn[b.id]-nn[a.id]||(a.sort||a.id)-(b.sort||b.id)})}
 list=list.filter(e=>e.vip).concat(list.filter(e=>!e.vip));
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>${s.emoji} ${esc(secTitle(s))}</h1></div>
  ${showChips?`<div class="chips"><button class="${subId?'':'on'}" data-sub="">${t('all')}</button>${vs.map(x=>`<button class="${x.id===subId?'on':''}" data-sub="${x.id}">${esc(x.emoji)} ${esc(subTitle(x))}</button>`).join('')}</div>`:''}
  <div class="sortbar"><span>${t('found')(list.length)}</span><select id="sort"><option value="list">${t('sortList')}</option><option value="rating" ${sortMode==='rating'?'selected':''}>${t('sortRating')}</option></select></div>
  ${list.some(e=>e.vip)?'':vipCard(s)}<div class="cards">${list.map(e=>card(e,false)).join('')}</div>`;
 app.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{location.hash='#/c/'+id+(b.dataset.sub?'/'+b.dataset.sub:'')});
 $('#sort').onchange=ev=>{sortMode=ev.target.value;viewCat(id,subId)};
 if(focusId&&/^\d+$/.test(focusId)){const el=document.getElementById('e'+focusId);if(el)setTimeout(()=>{el.scrollIntoView({block:'center'});el.style.outline='3px solid #f4a340';el.style.outlineOffset='2px';setTimeout(()=>{el.style.outline='';el.style.outlineOffset=''},5000)},60)}
}
function formNote(liveKey){return OFFLINE?`<p class="demo-note warn">⚠️ ${t('offlineForm')}</p>`:`<p class="demo-note live">ℹ️ ${t(liveKey)}</p>`}
async function sending(btn,fn){btn.disabled=true;try{await fn()}finally{btn.disabled=false}}
function viewAdd(){
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="history.length>1?history.back():location.hash='#/'" aria-label="${t('back')}">←</button><h1>➕ ${t('addTitle')}</h1></div>
 ${formNote('liveAddNote','addNote')}
 <form id="addf" novalidate style="position:relative">${hp()}
  <div class="f"><label for="f1">${t('fName')}</label><input id="f1" required autocomplete="name" maxlength="120"></div>
  <div class="f"><label for="f2">${t('fCat')}</label><select id="f2" required><option value="">${t('choose')}</option>${D.sections.map(s=>`<option value="${s.id}">${s.emoji} ${esc(secTitle(s))}</option>`).join('')}</select></div>
  <div class="f"><label for="f3">${t('fWhat')}</label><textarea id="f3" maxlength="500" placeholder="${t('fWhatPh')}"></textarea></div>
  <div class="f"><label for="f4">${t('fPhone')}</label><input id="f4" type="tel" inputmode="tel" placeholder="8 7__ ___ __ __" required></div>
  <div class="f"><label for="f5">${t('fAddr')}</label><input id="f5" maxlength="200"></div>
  <div class="f"><label class="chk"><input type="checkbox" id="f6" required> ${t('fConsent')}</label></div>
  <div class="f"><label class="chk"><input type="checkbox" id="f7"> ${t('fVip')}</label></div>
  <button class="btn primary" type="submit">${t('fSend')}</button>
 </form>`;
 $('#addf').onsubmit=ev=>{ev.preventDefault();const f=ev.target,ph=$('#f4').value.replace(/\D/g,'');
  if(!$('#f1').value.trim()||!$('#f2').value||ph.length!==11||!$('#f6').checked){toast(t('addErr'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t(LOADING?'stillLoading':'offlineForm'));return}
  sending(f.querySelector('[type=submit]'),async()=>{
   try{await SB.rpc('submit_business',{p_name:$('#f1').value,p_section_id:$('#f2').value,p_description:$('#f3').value,p_phone:ph,p_address:$('#f5').value,
     p_consent:$('#f6').checked,p_wants_vip:$('#f7').checked,p_device_id:deviceId(),p_hp:$('#hpf').value});toast(t('liveSent'));f.reset()}
   catch(e){toast(errMsg(e))}})};
}
function openReview(id){
 const e=D.entries.find(x=>x.id==id),r=rating(id);let pick=0;const m=$('#modal');
 m.innerHTML=`<div class="sheet"><h2 style="margin:6px 0">${t('rvTitle')}: ${esc(e.name||fmtPhone(e))}</h2>
  ${LIVE?`<p class="demo-note live">ℹ️ ${t('rvLiveNote')}</p>`:(OFFLINE?`<p class="demo-note warn">⚠️ ${t('offlineForm')}</p>`:'')}
  <div class="pick" role="radiogroup">${[1,2,3,4,5].map(i=>`<button type="button" data-s="${i}" aria-label="${i}">★</button>`).join('')}</div>
  <form id="rvf" style="position:relative">${hp()}<textarea id="rvt" maxlength="1000" placeholder="${t('rvPh')}" class="rv-in" style="min-height:80px"></textarea>
  ${LIVE?`<input id="rvn" class="rv-in" maxlength="60" placeholder="${t('rvName')}"><input id="rvp" class="rv-in" type="tel" inputmode="tel" placeholder="${t('rvPhone')}">`:''}
  <button class="btn primary" style="margin-top:10px">${t('rvSave')}</button></form>
  <button class="btn" style="background:#eee;color:#333;width:100%;margin-top:8px" id="rvc">${t('close')}</button>
  <div id="rvlist">${LIVE?`<div class="rev">${t('loading')}</div>`:r.list.map(v=>`<div class="rev">${stars(v.stars)} ${esc(v.text||'')}</div>`).join('')}</div></div>`;
 m.hidden=false;
 m.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{pick=+b.dataset.s;m.querySelectorAll('[data-s]').forEach(c=>c.classList.toggle('on',+c.dataset.s<=pick))});
 $('#rvc').onclick=()=>{m.hidden=true};m.onclick=ev=>{if(ev.target===m)m.hidden=true};
 if(LIVE)SB.get(`reviews_public?select=id,stars,text,author_name,created_at&specialist_id=eq.${+id}&order=created_at.desc&limit=30`).then(rows=>{
   const rl=$('#rvlist');if(!rl)return;rl.innerHTML=rows.length?rows.map(v=>`<div class="rev" data-rid="${+v.id}">${stars(v.stars)} <b>${esc(v.author_name||'')}</b> ${esc(v.text||'')}</div>`).join(''):`<div class="rev">${t('noReviews')}</div>`})
  .catch(()=>{const rl=$('#rvlist');if(rl)rl.innerHTML=''});
 $('#rvf').onsubmit=ev=>{ev.preventDefault();if(!pick){toast(t('rvPick'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t(LOADING?'stillLoading':'offlineForm'));return}
  sending(ev.target.querySelector('.btn'),async()=>{
   try{await SB.rpc('submit_review',{p_specialist_id:+id,p_stars:pick,p_text:$('#rvt').value,p_device_id:deviceId(),p_phone:$('#rvp').value||null,p_name:$('#rvn').value||null,p_hp:$('#hpf').value});
    m.hidden=true;toast(t('rvSent'))}catch(e){toast(errMsg(e))}})};
}
// ---------- «Это ваш бизнес? Дополните карточку» ----------
Object.assign(T.ru,{claimL:'Это ваш бизнес? Дополните карточку',clTitle:'Дополнить карточку',clNote:'Заполните то, что хотите показать клиентам. После проверки данные появятся на карточке. Если ваш телефон совпадает с номером на карточке — проверим быстрее.',
 clOwner:'Ваше имя',clBiz:'Название бизнеса (если есть)',clIg:'Instagram (@имя или ссылка)',clGis:'Ссылка на 2ГИС',clHours:'Часы работы (например: Пн–Сб 9:00–19:00)',clDescrRu:'Коротко о себе / услугах (по-русски, до 300 знаков)',clDescrKz:'Қысқаша (қазақша, 300 таңбаға дейін) — по желанию',
 clPhotos:'Фото ваших работ (до 3)',clPhone:'Ваш телефон (обязательно)',clSend:'Отправить на проверку',clSent:'Спасибо! Данные отправлены на проверку.',clBadIg:'Instagram: укажите @имя или ссылку instagram.com/имя',clBadGis:'2ГИС: вставьте ссылку вида https://2gis.kz/…',
 clEmpty:'Заполните хотя бы одно поле',clDemo:'Сейчас нет связи с сервером. Попробуйте позже.',verified:'Проверено',hoursL:'Часы',err_bad_instagram:'Instagram: укажите @имя или ссылку instagram.com/имя',err_bad_2gis:'2ГИС: вставьте ссылку вида https://2gis.kz/…',err_too_long:'Описание — не больше 300 знаков',err_empty:'Заполните хотя бы одно поле',err_not_found:'Карточка не найдена'});
Object.assign(T.kz,{claimL:'Бұл сіздің бизнесіңіз бе? Карточканы толықтырыңыз',clTitle:'Карточканы толықтыру',clNote:'Клиенттерге көрсеткіңіз келетінді толтырыңыз. Тексерістен кейін деректер карточкада пайда болады. Телефоныңыз карточкадағы нөмірмен сәйкес келсе — тезірек тексереміз.',
 clOwner:'Атыңыз',clBiz:'Бизнес атауы (бар болса)',clIg:'Instagram (@атау немесе сілтеме)',clGis:'2ГИС сілтемесі',clHours:'Жұмыс уақыты (мысалы: Дс–Сб 9:00–19:00)',clDescrRu:'Қысқаша орысша (300 таңбаға дейін) — қаласаңыз',clDescrKz:'Өзіңіз / қызметтер туралы қысқаша (қазақша, 300 таңбаға дейін)',
 clPhotos:'Жұмыстарыңыздың фотосы (3-ке дейін)',clPhone:'Телефоныңыз (міндетті)',clSend:'Тексеруге жіберу',clSent:'Рақмет! Деректер тексеруге жіберілді.',clBadIg:'Instagram: @атау немесе instagram.com/атау сілтемесін жазыңыз',clBadGis:'2ГИС: https://2gis.kz/… түріндегі сілтемені қойыңыз',
 clEmpty:'Кемінде бір өрісті толтырыңыз',clDemo:'Қазір сервермен байланыс жоқ. Кейінірек көріңіз.',verified:'Тексерілген',hoursL:'Уақыты',err_bad_instagram:'Instagram: @атау немесе instagram.com/атау сілтемесін жазыңыз',err_bad_2gis:'2ГИС: https://2gis.kz/… түріндегі сілтемені қойыңыз',err_too_long:'Сипаттама — 300 таңбадан аспауы керек',err_empty:'Кемінде бір өрісті толтырыңыз',err_not_found:'Карточка табылмады'});
const IG_RE=/^(@?[A-Za-z0-9._]{1,30}|(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?(\?.*)?)$/;
const GIS_RE=/^https?:\/\/([a-z0-9-]+\.)*2gis\.(kz|ru|com)(\/|$)/i;
const igHandle=v=>String(v||'').trim().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i,'').replace(/^@/,'').replace(/[/?#].*$/,'').toLowerCase();
const IG_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>';
function profileHtml(e){const d=lang==='kz'?(e.descr_kz||e.descr_ru):(e.descr_ru||e.descr_kz);const ph=(e.photos||[]).filter(p=>p&&p.path).slice(0,3);
 return `${d?`<p class="pdesc">${esc(d)}</p>`:''}${e.hours?`<p class="note">🕒 ${esc(e.hours)}</p>`:''}
 ${e.ig||e.gis?`<div class="plinks">${e.ig?`<a class="ig" href="https://instagram.com/${encodeURIComponent(e.ig)}" target="_blank" rel="noopener">${IG_SVG}<span>@${esc(e.ig)}</span></a>`:''}${e.gis?`<a class="gis" href="${esc(e.gis)}" target="_blank" rel="noopener"><b>2ГИС</b></a>`:''}</div>`:''}
 ${ph.length?`<div class="pphotos">${ph.map(p=>`<a href="${esc(SB.publicUrl('profiles',p.path))}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(SB.publicUrl('profiles',p.path))}" alt=""></a>`).join('')}</div>`:''}`}
const dataUrlBlob=u=>fetch(u).then(r=>r.blob());
function openClaim(id){
 const e=D.entries.find(x=>x.id==id);if(!e)return;const m=$('#modal');let files=[];
 m.innerHTML=`<div class="sheet claim"><h2 style="margin:6px 0">✏️ ${t('clTitle')}</h2><div class="sub">${esc(subTitle(subById[e.sub]||{}))} · ${esc(e.name||'')} ${esc(fmtPhone(e))}</div>
  <p class="demo-note ${LIVE?'live':''}">${LIVE?'ℹ️ '+t('clNote'):'⚠️ '+t('clDemo')}</p>
  <form id="clf" style="position:relative">${hp()}
   <label for="cl1">${t('clOwner')}</label><input id="cl1" class="rv-in" maxlength="80" autocomplete="name">
   <label for="cl2">${t('clBiz')}</label><input id="cl2" class="rv-in" maxlength="80" autocomplete="organization">
   <label for="cl3">${t('clIg')}</label><input id="cl3" class="rv-in" maxlength="120" autocapitalize="off" autocomplete="off" placeholder="@urker_master">
   <label for="cl4">${t('clGis')}</label><input id="cl4" class="rv-in" maxlength="300" inputmode="url" autocapitalize="off" placeholder="https://2gis.kz/astana/firm/…">
   <label for="cl5">${t('clHours')}</label><input id="cl5" class="rv-in" maxlength="120">
   <label for="cl6">${t(lang==='kz'?'clDescrKz':'clDescrRu')} <small id="cl6n">0/300</small></label><textarea id="cl6" class="rv-in" maxlength="300" style="min-height:70px"></textarea>
   <label for="cl7">${t(lang==='kz'?'clDescrRu':'clDescrKz')} <small id="cl7n">0/300</small></label><textarea id="cl7" class="rv-in" maxlength="300" style="min-height:60px"></textarea>
   <label for="cl8">${t('clPhotos')}</label>${fileBtn('cl8',3)}<div class="thumbs" id="clth"></div>
   <label for="cl9">${t('clPhone')}</label><input id="cl9" class="rv-in" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="8 7XX XXX XX XX">
   <button class="btn primary" style="margin-top:12px">${t('clSend')}</button></form>
  <button class="btn" style="background:#eee;color:#333;width:100%;margin-top:8px" id="clc">${t('close')}</button></div>`;
 m.hidden=false;m.scrollTop=0;
 const ru=lang==='kz'?'#cl7':'#cl6',kz=lang==='kz'?'#cl6':'#cl7';
 ['cl6','cl7'].forEach(i=>$('#'+i).oninput=()=>{$('#'+i+'n').textContent=$('#'+i).value.length+'/300'});
 const draw=()=>{setFC('cl8',files.length,3);$('#clth').innerHTML=files.map((f,i)=>`<div class="th"><img src="${f.url}" alt=""><button type="button" data-rm="${i}" aria-label="✕">✕</button></div>`).join('')};
 $('#clth').onclick=ev=>{const b=ev.target.closest('[data-rm]');if(!b)return;URL.revokeObjectURL(files[+b.dataset.rm].url);files.splice(+b.dataset.rm,1);draw()};
 $('#cl8').onchange=ev=>{const fs=[...ev.target.files];ev.target.value='';fs.slice(0,3-files.length).forEach(f=>files.push({file:f,url:URL.createObjectURL(f)}));if(fs.length>3)toast(t('err_too_many_photos'));draw()};
 $('#clc').onclick=()=>{m.hidden=true};m.onclick=ev=>{if(ev.target===m)m.hidden=true};
 $('#clf').onsubmit=ev=>{ev.preventDefault();
  const p={specialist_id:+id,owner_name:$('#cl1').value.trim(),business_name:$('#cl2').value.trim(),instagram:$('#cl3').value.trim(),gis_url:$('#cl4').value.trim(),hours:$('#cl5').value.trim(),
   descr_ru:$(ru).value.trim(),descr_kz:$(kz).value.trim(),phone:$('#cl9').value,has_photos:files.length>0};
  if(p.instagram&&!IG_RE.test(p.instagram)){toast(t('clBadIg'));$('#cl3').focus();return}
  if(p.gis_url&&!GIS_RE.test(p.gis_url)){toast(t('clBadGis'));$('#cl4').focus();return}
  if(!['owner_name','business_name','instagram','gis_url','hours','descr_ru','descr_kz'].some(k=>p[k])&&!files.length){toast(t('clEmpty'));return}
  if(!/^(8|7)?7\d{9}$/.test(p.phone.replace(/\D/g,''))){toast(t('err_invalid_phone'));$('#cl9').focus();return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t('clDemo'));return}
  sending(ev.target.querySelector('.btn'),async()=>{try{
   const r=await SB.rpc('submit_claim',{p,p_device_id:deviceId(),p_hp:$('#hpf').value},15000);
   if(r&&r.id&&files.length){const paths=[];for(const f of files){const b=await dataUrlBlob(await compressImage(f.file,1280,0.8));
     const u=await SB.upload('profiles',`claims/${r.id}/${r.ticket}/${Math.random().toString(36).slice(2,12)}.jpg`,b,'image/jpeg');paths.push(u.path)}
    await SB.rpc('claim_set_photos',{p_id:r.id,p_ticket:r.ticket,p_paths:paths},15000)}
   m.hidden=true;toast(t('clSent'))}catch(err){toast(errMsg(err))}})};
}
let tt;function toast(msg){const el=$('#toast');el.textContent=msg;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,3500)}

// ---------- router ----------
function route(){setMeta();setTimeout(()=>{if(!OFFLINE&&(LIVE||!SB.enabled))trackView()},0);
 const h=location.hash||'#/';let nav='home';
 app.dataset.view=(h.match(/^#\/(news\/suggest|news\/[^/?]+|[a-z]+)/)||[,'home'])[1].replace(/^news\/(?!suggest).+/,'article').replace('news/suggest','suggest');
 if(h.startsWith('#/c/')){const [id,sub,fid]=h.slice(4).split('?')[0].split('/');viewCat(id,sub,fid)}
 else if(h.startsWith('#/add')){viewAdd();nav=document.querySelector('[data-nav=post]')?'post':'add'}
 else if(h.startsWith('#/ann')){viewAnn(h.split('/')[2]);nav=document.querySelector('[data-nav=ann]')?'ann':'menu'}
 else if(h.startsWith('#/news')){const id=h.split('/')[2];if(id)viewArticle(decodeURIComponent(id));else viewNews();nav='news'}
 else if(h.startsWith('#/report')){viewReport();nav='menu'}
 else if(h.startsWith('#/search')){const q=decodeURIComponent((h.split('q=')[1]||''));viewHome(q);nav='home';const i=$('#q');if(i&&!q)i.focus()}
 else if(h.startsWith('#/install')&&window.URKER_PWA){URKER_PWA.view();nav='menu'}
 else{const ln=window.URKER_L&&URKER_L.route(h);if(ln)nav=ln;else viewHome()}
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===nav));
 if(!h.startsWith('#/search'))window.scrollTo(0,0);
}
document.addEventListener('click',ev=>{
 const ct=ev.target.closest('a.btn.wa[href],a.btn.call[href]');const art=ct&&ct.closest('article.card[id^="e"]');
 if(art)track('contact',{p_specialist_id:+art.id.slice(1),p_channel:ct.classList.contains('wa')?'wa':'call'});
 const rv=ev.target.closest('[data-review]');if(rv){openReview(rv.dataset.review);return}
 const cl=CLAIMS_ON&&ev.target.closest('[data-claim]');if(cl){openClaim(cl.dataset.claim);return}
 const hint=ev.target.closest('[data-hint]');if(hint){const i=$('#q');i.value=hint.dataset.hint;i.dispatchEvent(new Event('input'));return}
 const g=ev.target.closest('[data-goto]');if(g){const [s,sub]=g.dataset.goto.split('|');location.hash='#/c/'+s+'/'+sub}
});
function applyLang(){document.documentElement.lang=lang==='kz'?'kk':'ru';document.title=t('docTitle');document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===lang))}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('urker_lang',lang);applyLang();route();window.dispatchEvent(new Event('urker-lang'))});
window.addEventListener('hashchange',route);
// ---------- загрузка из базы (с резервом на встроенный список) ----------
const toAlmaty=iso=>iso?new Date(new Date(iso).getTime()+5*3600e3).toISOString().slice(0,16):null;
function mapSpec(r){const flags=r.phone.startsWith('8800')?['tollfree']:(r.phone.length!==11?['malformed']:[]);
 return{id:r.id,section:r.section_id,sub:r.sub_id,raw_phone:r.phone,wa:r.wa,tel:r.wa?'+'+r.wa:r.phone,name:r.name||'',note:r.note||'',address:r.address||'',
  star:!!r.recommended,new:!!r.is_new,flags,vip:!!r.vip,avg:+r.avg_stars||0,cnt:+r.review_count||0,bayes:r.bayes_score==null?null:+r.bayes_score,owner:r.owner_name||'',biz:r.business_name||'',ig:r.instagram||'',gis:r.gis_url||'',hours:r.hours||'',descr_ru:r.descr_ru||'',descr_kz:r.descr_kz||'',photos:Array.isArray(r.photos)?r.photos:[],verified:!!r.verified,sort:r.sort_order}}
function mapAnn(r){return{id:r.id,type:r.type,urgent:r.urgent,demo:r.is_demo,title:{ru:r.title_ru,kz:r.title_kz||r.title_ru},area:{ru:r.area_ru,kz:r.area_kz||r.area_ru},
 source:{ru:r.source_ru,kz:r.source_kz||r.source_ru},start:toAlmaty(r.start_at)||toAlmaty(r.created_at),end:toAlmaty(r.end_at)}}
function mapNews(r){const ph=(Array.isArray(r.photos)?r.photos:[]).map(p=>typeof p==='string'?p:p&&p.url).filter(Boolean);
 return{id:r.id,category:r.category,pinned:r.pinned,demo:r.is_demo,date:toAlmaty(r.publish_at),title:{ru:r.title_ru,kz:r.title_kz},lead:{ru:r.lead_ru,kz:r.lead_kz},body:{ru:r.body_ru,kz:r.body_kz},
  cover:r.cover_url||ph[0]||'',photos:r.cover_url&&ph.includes(r.cover_url)?[r.cover_url].concat(ph.filter(u=>u!==r.cover_url)):ph,video:r.video_url||''}}
async function loadBackend(){
 if(!SB.enabled){LOADING=false;return}
 const get=async(q,ms)=>{try{return await SB.get(q,ms)}catch(e){await new Promise(r=>setTimeout(r,1500));return SB.get(q,ms)}};  // одна повторная попытка
 try{
  const [sp,an,ad,nw,vc]=await Promise.all([
   get('specialists_public?select=*&order=sort_order.asc,id.asc',15000),
   get('announcements?select=*&order=start_at.desc.nullslast',15000).catch(()=>null),
   get('ads?select=*&order=sort_order.asc',15000).catch(()=>null),
   get('news?select=*&order=pinned.desc,publish_at.desc&limit=200',15000).catch(()=>null),
   SB.rpc('content_view_counts',{},10000).catch(()=>null)]);
  if(window.URKER_L)await URKER_L.load().catch(e=>console.warn('listings',e&&e.message));
  if(!Array.isArray(sp)||!sp.length)throw new Error('empty');
  D.entries=sp.filter(r=>subById[r.sub_id]).map(mapSpec);
  ANN=Array.isArray(an)?an.filter(r=>!r.is_demo).map(mapAnn):[];ADS=Array.isArray(ad)?ad:[];NEWS=Array.isArray(nw)?nw.filter(r=>!r.is_demo).map(mapNews):[];
  VIEWS={};if(Array.isArray(vc))vc.forEach(x=>{VIEWS[vKey(x.kind,x.item_id)]=+x.views||0});
  LIVE=true;OFFLINE=false;sortMode='rating';buildIndex();
 }catch(e){OFFLINE=true;LIVE=false;console.warn('Urker backend unreachable, using built-in list',e&&e.message)}
 LOADING=false;
 const n=$('#netnote');if(n){n.hidden=!OFFLINE;n.textContent=t('offline')}
 const q=$('#q');if(q&&document.activeElement===q)renderResults(q.value);else route();
}
function setMeta(title,desc){document.title=title||t('docTitle');const d=document.querySelector('meta[name="description"]');if(d){if(!d.dataset.def)d.dataset.def=d.content;d.content=desc||(lang==='ru'?d.dataset.def:t('docTitle'))}}
window.URKER_APP={fileBtn,setFC,t,esc,$,app,SB,isLive:()=>LIVE,isOffline:()=>OFFLINE,toast,deviceId,hp,formNote,sending,errMsg,norm,tokScore,WA_SVG,MONTHS,lang:()=>lang,setMeta,track,
 addDict(ru,kz){Object.assign(T.ru,ru||{});Object.assign(T.kz,kz||{})}};
const start=()=>{applyLang();route();loadBackend().then(()=>{if(LIVE)trackView()});loadMetrika()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.addEventListener('urker-lang',()=>{const n=$('#netnote');if(n)n.textContent=t('offline')});
})();
