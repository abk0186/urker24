(function(){
'use strict';
const D=window.URKER_DATA, SYN=window.URKER_SYNONYMS||{};
const $=(s,r=document)=>r.querySelector(s);
const app=$('#app');
let lang=localStorage.getItem('urker_lang');if(lang!=='kz')lang='ru';

const T={
 ru:{draft:'Черновик-прототип · не для публикации',brand:'Уркер',tagline:'Мастера и услуги рядом',navHome:'Главная',navSearch:'Поиск',navAdd:'Добавить',navAnn:'Объявления',annTitle:'Важные объявления',annAll:'Все объявления →',annEmpty:'Сейчас важных объявлений нет',annEmptyS:'Если узнаете об отключении или ремонте — сообщите, мы проверим и опубликуем.',annActive:'актуально',annDone:'завершено',annUrgent:'срочно',annExample:'ПРИМЕР · демо',annSource:'Источник',annShare:'Поделиться в WhatsApp',annReport:'📣 Сообщить о важном',annTypes:{power:'Свет',water:'Вода',gas:'Газ',repair:'Ремонт',other:'Другое'},annFound:'Объявления',repTitle:'Сообщить о важном',repNote:'Демо-форма: пока ничего не отправляется. В рабочей версии сообщение пойдёт на модерацию и после проверки появится в «Важных объявлениях».',rType:'Что случилось?',rTitle:'Коротко, что происходит',rTitlePh:'Например: нет света с утра',rArea:'Улицы / дома',rWhen:'Когда (дата и время)',rSrc:'Откуда информация?',rSrcPh:'Например: сообщение Астана-РЭК, видел сам',rContact:'Ваш телефон (по желанию, для уточнения)',rSend:'Отправить на модерацию',rSent:'Спасибо! Это демо: в рабочей версии сообщение уйдёт на модерацию.',
  searchPh:'Например: укол, газель',searchTitle:'Найти мастера или услугу',cats:'Все разделы',
  promoT:'Здесь может быть ваша реклама',promoS:'Баннер для кафе, магазинов и акций Уркера',ad:'Реклама · демо',
  wa:'Написать в WhatsApp',call:'Позвонить',noName:'Номер из списка',noReviews:'пока нет отзывов',review:'Оценить',demo:'демо',
  sortList:'Как в списке',sortRating:'По рейтингу',all:'Все',found:n=>`Найдено: ${n}`,sections:'Подходящие разделы',
  nothing:'Пока никого нет по запросу',nothingS:'Знаете такого мастера или у вас свой бизнес? Добавьте его — после проверки он появится здесь.',addBiz:'➕ Добавить свой бизнес',
  starB:'⭐ Рекомендован чатом',newB:'🆕 Новый',dup:'Этот номер есть и в разделах: ',warn10:'⚠️ В номере 10 цифр — нужно уточнить',tollfree:'☎️ Бесплатная линия 8-800, только звонок',
  vipT:'Здесь может быть ваша карточка',vipS:'Закреплённое место вверху раздела с подсветкой. Платная услуга — демо.',vip:'Закреплено · VIP · демо',
  sortNote:'Рейтинг и отзывы — демо: сохраняются только на этом телефоне.',
  addTitle:'Добавить свой бизнес',addNote:'Демо-форма: пока ничего никуда не отправляется. В рабочей версии заявка пойдёт на модерацию и появится на сайте после проверки.',
  fName:'Имя или название',fCat:'Раздел',fWhat:'Чем занимаетесь?',fWhatPh:'Например: ремонт стиральных машин, выезд на дом',fPhone:'Телефон (WhatsApp)',fAddr:'Адрес или ориентир (по желанию)',
  fConsent:'Я согласен(на), чтобы мой номер был показан на сайте',fVip:'Хочу закреплённое место / рекламу (свяжемся отдельно)',fSend:'Отправить на модерацию',
  sent:'Спасибо! Это демо: в рабочей версии заявка уйдёт на модерацию.',rvTitle:'Ваш отзыв',rvPh:'Что понравилось? (по желанию)',rvSave:'Сохранить отзыв',rvSaved:'Отзыв сохранён на этом телефоне (демо)',
  rvDemo:'Демо: отзыв сохранится только на этом устройстве.',close:'Закрыть',reviewsN:n=>`${n} отз.`,entries:n=>`${n} контакт${n%10==1&&n%100!=11?'':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'а':'ов')}`,
  foot:'Список составлен жителями Уркера в WhatsApp-чате. Прототип закрыт от поисковиков.',choose:'— выберите —'},
 kz:{draft:'Жоба-прототип · жариялауға емес',brand:'Үркер',tagline:'Жақын маман мен қызметтер',navHome:'Басты',navSearch:'Іздеу',navAdd:'Қосу',navAnn:'Ескертулер',annTitle:'Маңызды хабарландырулар',annAll:'Барлық хабарландырулар →',annEmpty:'Қазір маңызды хабарландыру жоқ',annEmptyS:'Өшіру немесе жөндеу туралы білсеңіз — хабарлаңыз, тексеріп жариялаймыз.',annActive:'өзекті',annDone:'аяқталды',annUrgent:'шұғыл',annExample:'МЫСАЛ · демо',annSource:'Дереккөз',annShare:'WhatsApp-та бөлісу',annReport:'📣 Маңызды жайт туралы хабарлау',annTypes:{power:'Жарық',water:'Су',gas:'Газ',repair:'Жөндеу',other:'Басқа'},annFound:'Хабарландырулар',repTitle:'Маңызды жайт туралы хабарлау',repNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында хабарлама модерацияға түседі.',rType:'Не болды?',rTitle:'Қысқаша не болып жатыр',rTitlePh:'Мысалы: таңертеңнен жарық жоқ',rArea:'Көшелер / үйлер',rWhen:'Қашан (күні мен уақыты)',rSrc:'Ақпарат қайдан?',rSrcPh:'Мысалы: Астана-РЭК хабарламасы, өзім көрдім',rContact:'Телефоныңыз (міндетті емес)',rSend:'Модерацияға жіберу',rSent:'Рақмет! Бұл демо: жұмыс нұсқасында хабарлама модерацияға кетеді.',
  searchPh:'Мысалы: укол, жүк',searchTitle:'Маман немесе қызмет табу',cats:'Барлық бөлімдер',
  promoT:'Мұнда сіздің жарнамаңыз болуы мүмкін',promoS:'Үркердегі кафе, дүкен және акцияларға арналған баннер',ad:'Жарнама · демо',
  wa:'WhatsApp-қа жазу',call:'Қоңырау шалу',noName:'Тізімдегі нөмір',noReviews:'әзірге пікір жоқ',review:'Бағалау',demo:'демо',
  sortList:'Тізімдегідей',sortRating:'Рейтинг бойынша',all:'Барлығы',found:n=>`Табылды: ${n}`,sections:'Сәйкес бөлімдер',
  nothing:'Бұл сұрау бойынша әзірге ешкім жоқ',nothingS:'Осындай маманды білесіз бе, әлде өз бизнесіңіз бар ма? Қосыңыз — тексерістен кейін осында шығады.',addBiz:'➕ Бизнесіңізді қосу',
  starB:'⭐ Чат ұсынған',newB:'🆕 Жаңа',dup:'Бұл нөмір мына бөлімдерде де бар: ',warn10:'⚠️ Нөмірде 10 сан — нақтылау керек',tollfree:'☎️ 8-800 тегін желі, тек қоңырау',
  vipT:'Мұнда сіздің карточкаңыз болуы мүмкін',vipS:'Бөлімнің жоғарғы жағындағы ерекшеленген орын. Ақылы қызмет — демо.',vip:'Бекітілген · VIP · демо',
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
 liveRepNote:'Сообщение уйдёт на проверку и после подтверждения появится в «Важных объявлениях».',
 liveSent:'Спасибо! Заявка отправлена на проверку.',liveRepSent:'Спасибо! Сообщение отправлено на проверку.',
 rvLiveNote:'Отзыв появится после проверки. Один отзыв на мастера с одного телефона.',rvName:'Ваше имя (по желанию)',
 rvPhone:'Ваш телефон (по желанию, не публикуется)',rvSent:'Спасибо! Отзыв отправлен на проверку.',rvPick:'Выберите от 1 до 5 звёзд',
 loading:'Загрузка…',vipLive:'📌 VIP · закреплено',vipOffer:'Место для VIP',adLive:'Реклама',
 sortNoteLive:'Сначала VIP, затем по среднему рейтингу и числу отзывов. Отзывы проходят проверку.',
 err_already_reviewed:'Вы уже оставляли отзыв этому мастеру.',err_rate_limited:'Слишком много отправок. Попробуйте позже.',
 err_invalid_phone:'Проверьте номер телефона.',err_no_consent:'Отметьте согласие на показ номера.',
 err_generic:'Не удалось отправить. Проверьте интернет и попробуйте ещё раз.',offlineForm:'Сейчас нет связи с сервером. Попробуйте позже.',
 back:'Назад',hints:['сантехник','газель','укол','электрик','такси','уголь'],
 waGreet:'Здравствуйте! Нашёл(ла) ваш номер в списке специалистов Уркера.',
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
 liveRepNote:'Хабарлама тексеруге жіберіледі және расталғаннан кейін «Маңызды хабарландыруларда» жарияланады.',
 liveSent:'Рақмет! Өтінім тексеруге жіберілді.',liveRepSent:'Рақмет! Хабарлама тексеруге жіберілді.',
 rvLiveNote:'Пікір тексерілгеннен кейін шығады. Бір шеберге бір телефоннан бір пікір қалдыруға болады.',rvName:'Атыңыз (міндетті емес)',
 rvPhone:'Телефоныңыз (міндетті емес, жарияланбайды)',rvSent:'Рақмет! Пікір тексеруге жіберілді.',rvPick:'1-ден 5-ке дейін жұлдыз таңдаңыз',
 loading:'Жүктелуде…',vipLive:'📌 VIP · бекітілген',vipOffer:'VIP орын',adLive:'Жарнама',
 sortNoteLive:'Алдымен VIP, содан кейін орташа рейтинг пен пікір саны бойынша. Пікірлер тексеруден өтеді.',
 err_already_reviewed:'Сіз бұл шеберге пікір қалдырып қойғансыз.',err_rate_limited:'Тым көп жіберілді. Кейінірек қайталап көріңіз.',
 err_invalid_phone:'Телефон нөмірін тексеріңіз.',err_no_consent:'Нөмірді көрсетуге келісім белгісін қойыңыз.',
 err_generic:'Жіберу мүмкін болмады. Интернетті тексеріп, қайталап көріңіз.',offlineForm:'Қазір сервермен байланыс жоқ. Кейінірек қайталап көріңіз.',
 draft:'Жоба-прототип · жариялауға арналмаған',brand:'Үркер',tagline:'Жаныңыздағы шеберлер мен қызметтер',
 navHome:'Басты бет',navSearch:'Іздеу',navAdd:'Қосу',navAnn:'Ескертулер',back:'Артқа',
 searchPh:'Мысалы: көмір, жүк тасу',searchTitle:'Шебер немесе қызмет іздеу',cats:'Барлық бөлімдер',
 hints:['сантехник','жүк тасу','ине салу','электрик','такси','көмір'],
 promoT:'Мұнда сіздің жарнамаңыз болуы мүмкін',promoS:'Үркердегі кафе, дүкендер мен акцияларға арналған баннер',ad:'Жарнама · демо',
 wa:'WhatsApp-қа жазу',call:'Қоңырау шалу',noName:'Тізімдегі нөмір',noReviews:'әзірге пікір жоқ',review:'Баға беру',demo:'демо',
 waGreet:'Сәлеметсіз бе! Нөміріңізді Үркер мамандарының тізімінен таптым.',
 sortList:'Тізімдегі ретпен',sortRating:'Рейтинг бойынша',all:'Барлығы',found:n=>`Табылғаны: ${n}`,sections:'Сәйкес бөлімдер',
 nothing:q=>`«${q}» сұрауы бойынша әзірге ешкім жоқ`,
 nothingS:'Осындай шеберді білесіз бе, әлде өз бизнесіңіз бар ма? Қосыңыз — тексеруден кейін осында пайда болады.',addBiz:'➕ Өз бизнесіңізді қосу',
 starB:'⭐ Чат ұсынған',newB:'🆕 Жаңа',dup:'Бұл нөмір мына бөлімдерде де бар: ',warn10:'⚠️ Нөмірде 10 сан ғана бар — нақтылау қажет',
 tollfree:'☎️ 8-800 тегін желісі, тек қоңырау шалуға болады',
 vipT:'Мұнда сіздің карточкаңыз болуы мүмкін',vipS:'Бөлімнің ең жоғарғы жағында ерекшеленіп тұратын орын. Ақылы қызмет — демо.',vip:'Бекітілген · VIP · демо',
 sortNote:'Рейтинг пен пікірлер — демо: тек осы телефонда сақталады.',
 addTitle:'Өз бизнесіңізді қосу',addNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында өтінім модерацияға түседі де, тексеруден кейін сайтта пайда болады.',
 fName:'Аты-жөні немесе атауы',fCat:'Бөлім',fWhat:'Немен айналысасыз?',fWhatPh:'Мысалы: кір жуғыш машина жөндеймін, үйге барамын',fPhone:'Телефон (WhatsApp)',
 fAddr:'Мекенжай немесе бағдар (міндетті емес)',fConsent:'Нөмірімнің сайтта көрсетілуіне келісемін',fVip:'Бекітілген орын немесе жарнама қажет (бөлек хабарласамыз)',
 fSend:'Модерацияға жіберу',sent:'Рақмет! Бұл — демо: жұмыс нұсқасында өтінім модерацияға жіберіледі.',
 addErr:'Атауын, бөлімін, 11 саннан тұратын нөмірді толтырып, келісім белгісін қойыңыз',
 rvTitle:'Пікіріңіз',rvPh:'Не ұнады? (міндетті емес)',rvSave:'Пікірді сақтау',rvSaved:'Пікір осы телефонда сақталды (демо)',
 rvDemo:'Демо: пікір тек осы құрылғыда сақталады.',close:'Жабу',reviewsN:n=>`${n} пікір`,entries:n=>`${n} байланыс`,
 foot:'Тізімді Үркер тұрғындары WhatsApp-чатта құрастырған. Прототип іздеу жүйелерінен жасырылған.',choose:'— таңдаңыз —',
 annTitle:'Маңызды хабарландырулар',annAll:'Барлығы →',annEmpty:'Қазір маңызды хабарландыру жоқ',
 annEmptyS:'Жарықтың, судың не газдың өшірілуі немесе жөндеу жұмыстары туралы білсеңіз, хабарлаңыз — тексеріп, жариялаймыз.',
 annActive:'өзекті',annDone:'аяқталды',annUrgent:'шұғыл',annExample:'МЫСАЛ · демо',annSource:'Дереккөз',annShare:'WhatsApp арқылы бөлісу',
 annReport:'📣 Маңызды жайт туралы хабарлау',annTypes:{power:'Жарық',water:'Су',gas:'Газ',repair:'Жөндеу',other:'Басқа'},annFound:'Хабарландырулар',
 repTitle:'Маңызды жайт туралы хабарлау',repNote:'Демо-форма: әзірге ештеңе жіберілмейді. Жұмыс нұсқасында хабарлама модерацияға түседі де, тексеруден кейін «Маңызды хабарландыруларда» жарияланады.',
 rType:'Не болды?',rTitle:'Не болып жатқанын қысқаша жазыңыз',rTitlePh:'Мысалы: таңертеңнен бері жарық жоқ',rArea:'Көшелер / үйлер',
 rWhen:'Қашан (күні мен уақыты)',rSrc:'Ақпарат қайдан алынды?',rSrcPh:'Мысалы: Астана-РЭК хабарламасы, өзім көрдім',
 rContact:'Телефоныңыз (міндетті емес, нақтылау үшін)',rSend:'Модерацияға жіберу',rSent:'Рақмет! Бұл — демо: жұмыс нұсқасында хабарлама модерацияға жіберіледі.',
 repErr:'Не болғанын және қай жерде екенін жазыңыз',docTitle:'Үркер 24 — Үркер ауданының шеберлері, қызметтері, хабарландырулары мен жаңалықтары, Астана',demoForm:'демо-форма'};


// ---------- backend ----------
const SB=window.SBCreate?window.SBCreate({auth:false}):{enabled:false};
let LIVE=false, OFFLINE=false, ADS=[];
function deviceId(){let d=localStorage.getItem('urker_device');if(!d||!/^[A-Za-z0-9-]{8,64}$/.test(d)){d=(crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''));localStorage.setItem('urker_device',d)}return d}
const errMsg=e=>{const c=String(e&&e.code||'');for(const k of ['already_reviewed','rate_limited','invalid_phone','no_consent','bad_photo','too_many_photos'])if(c.includes(k))return t('err_'+k);return t('err_generic')};
const hp=()=>`<div style="position:absolute;left:-5000px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><label>Website<input id="hpf" name="website" tabindex="-1" autocomplete="off"></label></div>`;

// ---------- статистика (анонимно, без cookies) ----------
const STATS_OFF=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
function visitorId(){let v=localStorage.getItem('urker_vid');if(!v||!/^[A-Za-z0-9-]{8,64}$/.test(v)){v=(crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''));localStorage.setItem('urker_vid',v)}return v}
const DEVICE=(matchMedia('(pointer:coarse)').matches||/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))?'mobile':'desktop';
let firstView=true,lastPath='',lastSearch='',searchTimer=0;
function track(kind,extra){if(!SB.enabled||STATS_OFF||OFFLINE)return;
 SB.beacon('track',Object.assign({p_kind:kind,p_visitor_id:visitorId(),p_lang:lang,p_device:DEVICE},extra||{}))}
function trackView(){const path=(location.hash||'#/').replace(/^#/,'').split('?')[0].slice(0,120)||'/';if(path===lastPath)return;lastPath=path;
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
function rating(id){if(LIVE){const e=D.entries.find(x=>x.id==id)||{};return{n:e.cnt||0,avg:e.avg||0,list:[]}}const r=getRevs()[id]||[];return{n:r.length,avg:r.length?r.reduce((a,b)=>a+b.stars,0)/r.length:0,list:r}}

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
function card(e,showSection){
 const x=subById[e.sub],s=secById[e.section],r=rating(e.id);
 const others=e.dup_count?D.entries.filter(o=>o.raw_phone===e.raw_phone&&o.id!==e.id).map(o=>subTitle(subById[o.sub])):[];
 const bad=e.flags.includes('malformed'),toll=e.flags.includes('tollfree');
 const waMsg=encodeURIComponent(t('waGreet'));
 return `<article class="card ${e.vip?'vip':''}" id="e${e.id}">${e.vip?`<span class="tag">${t('vipLive')}</span>`:''}
  <div class="sub">${esc(x.emoji||s.emoji)} ${showSection?esc(secTitle(s))+' · ':''}${esc(subTitle(x))}</div>
  <div class="idl"><span class="nm">${esc(e.name||fmtPhone(e))}</span>${e.name?`<span class="ph">${esc(fmtPhone(e))}</span>`:''}</div>
  ${e.note?`<p class="note">${esc(e.note)}</p>`:''}${e.address?`<p class="note">📍 ${esc(e.address)}</p>`:''}
  ${e.star||e.new||bad||toll||others.length?`<div class="badges">${e.star?`<span class="badge star">${t('starB')}</span>`:''}${e.new?`<span class="badge new">${t('newB')}</span>`:''}
   ${bad?`<span class="badge warn">${t('warn10')}</span>`:''}${toll?`<span class="badge">${t('tollfree')}</span>`:''}
   ${others.length?`<span class="badge">${t('dup')}${esc(others.join(', '))}</span>`:''}</div>`:''}
  <div class="actions">
   <a class="btn wa ${e.wa?'':'off'}" aria-label="${esc(t('wa'))}: ${esc(e.name||fmtPhone(e))}" ${e.wa?`href="https://api.whatsapp.com/send?phone=${e.wa}&text=${waMsg}" target="_blank" rel="noopener"`:'aria-disabled="true"'}>${WA_SVG}<span>${t('waS')}</span></a>
   <a class="btn call ${bad?'off':''}" aria-label="${esc(t('call'))}: ${esc(fmtPhone(e))}" ${bad?'aria-disabled="true"':`href="tel:${esc(e.tel)}"`}>📞 <span>${t('callS')}</span></a>
  </div>
  <div class="rate">${stars(r.avg)}<span class="rc">${r.n?`${r.avg.toFixed(1)} · ${t('reviewsN')(r.n)}`:t('noReviews')}</span>
   <button data-review="${e.id}">✍️ ${t('review')}${LIVE?'':` <small>(${t('demo')})</small>`}</button></div>
 </article>`}
const vipCard=()=>`<a class="card vip vip-mini" href="#/add" title="${esc(t('vipS'))}"><span class="vm-i">📌</span><span class="vm-b"><b>${t('vipT')}</b><small>${LIVE?t('vipOffer'):t('vip')}</small></span><span class="vm-a">›</span></a>`;
const promo=()=>ADS.length?ADS.slice(0,2).map(a=>{const href=a.link_url||(a.wa?`https://wa.me/${a.wa}`:'#/add');return `<a class="promo live" href="${esc(href)}" ${href.startsWith('http')?'target="_blank" rel="noopener sponsored"':''}><span class="pi">${esc(a.emoji||'☕')}</span><span class="tag">${t('adLive')}</span><b>${esc(L({ru:a.title_ru,kz:a.title_kz}))}</b><span>${esc(L({ru:a.text_ru,kz:a.text_kz}))}</span></a>`}).join(''):`<a class="promo" href="#/add"><span class="pi">☕</span><span class="tag">${t('ad')}</span><b>${t('promoT')}</b><span>${t('promoS')}</span></a>`;
const nothing=q=>`<div class="empty"><div style="font-size:52px">🤷</div><h2>${t('nothing')(esc(q))}</h2><p>${t('nothingS')}</p><a class="btn primary" href="#/add">${t('addBiz')}</a></div>`;
const searchBox=(q='')=>`<section class="hero"><h2>${t('searchTitle')}</h2><div class="search"><span class="ic">🔍</span><input id="q" type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="${t('searchPh')}" value="${esc(q)}"></div>
 <div class="hints">${t('hints').map(h=>`<button data-hint="${h}">${h}</button>`).join('')}</div></section>`;

function renderResults(q){
 const box=$('#results'),home=$('#homeBody');const r=search(q);
 if(!r){clearTimeout(searchTimer);box.innerHTML='';if(home)home.hidden=false;return}
 trackSearch(q,r.list.length+annSearch(q).length+newsSearch(q).length);
 if(home)home.hidden=true;
 const nw=newsSearch(q);const newsHtml=nw.length?`<div class="sugg-l">📰 ${t('newsFound')}: ${nw.length}</div>${nw.slice(0,3).map(n=>newsCard(n,true)).join('')}`:'';
 const an=annSearch(q);const annHtml=newsHtml+(an.length?`<div class="sugg-l">📣 ${t('annFound')}: ${an.length}</div>${an.map(a=>`<a href="#/ann/${a.id}" class="ann-link">${annCard(a,true)}</a>`).join('')}`:'');
 if(!r.list.length){box.innerHTML=annHtml+(an.length||nw.length?'':nothing(q));return}
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
let ANN=(window.URKER_ANN||[]).slice();
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
 const msg=`${ty.ic} ${L(a.title)}\n📍 ${L(a.area)}\n🕒 ${annWhen(a)}${a.source?'\n'+t('annSource')+': '+L(a.source):''}${a.demo?'\n('+t('annExample')+')':''}`;
 return `<article class="ann ${a.urgent&&act?'urgent':''} ${act?'':'done'}" style="--tc:${ty.c}">
  <div class="ann-ic">${ty.ic}</div><div class="ann-b">
  <div class="ann-tags">${a.demo?`<span class="tag demo">${t('annExample')}</span>`:''}${a.urgent&&act?`<span class="tag urg">❗ ${t('annUrgent')}</span>`:''}<span class="st ${act?'on':''}">${act?'● '+t('annActive'):'✓ '+t('annDone')}</span></div>
  <h3>${esc(L(a.title))}</h3>
  <div class="ann-l">📍 ${esc(L(a.area))}</div><div class="ann-l">🕒 ${esc(annWhen(a))}</div>
  ${!compact&&a.source?`<div class="ann-l src">${t('annSource')}: ${esc(L(a.source))}</div>`:''}
  ${compact?'':`<a class="btn wa sm" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${WA_SVG}${t('annShare')}</a>`}
 </div></article>`}
const annEmpty=()=>`<div class="ann-empty">✅ <b>${t('annEmpty')}</b><span>${t('annEmptyS')}</span></div>`;
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
  if(!LIVE){toast(t('rSent'));f.reset();return}
  sending(f.querySelector('[type=submit]'),async()=>{
   try{await SB.rpc('submit_report',{p_type:(f.querySelector('[name=rt]:checked')||{}).value||'other',p_title:$('#r1').value,p_area:$('#r2').value,p_when:$('#r3').value,
     p_source:$('#r4').value,p_contact:$('#r5').value,p_device_id:deviceId(),p_hp:$('#hpf').value});toast(t('liveRepSent'));f.reset()}
   catch(e){toast(errMsg(e))}})};
}

// ---------- новости района ----------
let NEWS=(window.URKER_NEWS||[]).slice();
const NEWS_KW={event:'событие мероприятие праздник концерт иc-шара мереке',opening:'открытие открылся открылась новый магазин кафе ашылу ашылды',achievement:'достижение победа награда спорт олимпиада жетистик жениc',
 improvement:'благоустройство двор площадка дорога асфальт освещение парк деревья абаттандыру аула',akimat:'акимат аким встреча собрание жители акимдик кездесу',other:'новость новости жаналык'};
const LT=o=>{o=o||{};const want=o[lang]||'',other=o[lang==='kz'?'ru':'kz']||'';return want?{text:want,fb:false}:{text:other,fb:!!other}};
function newsSorted(){return NEWS.slice().sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||String(b.date).localeCompare(String(a.date)))}
const newsDate=n=>{if(!n.date)return '';const [y,m,d]=n.date.slice(0,10).split('-').map(Number);return `${d} ${MONTHS[lang][m-1]} ${y}`};
function newsCover(n,cls){const c=(t('newsCats')[n.category]||'📰').split(' ')[0];
 return n.cover?`<div class="${cls}" style="background-image:url('${esc(n.cover)}')"></div>`:`<div class="${cls} ph"><span>${c}</span></div>`}
function newsCard(n,compact){const ti=LT(n.title),le=LT(n.lead);
 return `<a class="news-card ${compact?'compact':''}" href="#/news/${n.id}">${newsCover(n,'nc-img')}<div class="nc-b">
  <div class="nc-tags">${n.demo?`<span class="tag demo">${t('annExample')}</span>`:''}${n.pinned?`<span class="chip pin">${t('pinned')}</span>`:''}<span class="chip">${esc(t('newsCats')[n.category]||'')}</span></div>
  <h3>${esc(ti.text)}</h3>${compact?'':`<p>${esc(le.text)}</p>`}<small>${esc(newsDate(n))}${n.photos&&n.photos.length>1?' · 🖼 '+t('photosN')(n.photos.length):''}${n.video?' · ▶️ '+t('video'):''}</small></div></a>`}
const newsEmpty=()=>`<div class="ann-empty">📰 <b>${t('newsEmpty')}</b><span>${t('newsEmptyS')}</span><a href="#/news/suggest" class="lnk">${t('newsSuggest')}</a></div>`;
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
 const ti=LT(n.title),le=LT(n.lead),bo=LT(n.body),fb=ti.fb||bo.fb||le.fb;
 const photos=(n.photos||[]).filter(Boolean);
 const link=location.origin+location.pathname+'#/news/'+n.id;
 const msg=`📰 ${ti.text}\n${le.text?le.text+'\n':''}${link}`;
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/news'" aria-label="${t('back')}">←</button><h1 class="sm">📰 ${t('newsTitle')}</h1></div>
 <article class="article">
  ${photos.length>1?`<div class="gallery" id="gal">${photos.map((u,i)=>`<img src="${esc(u)}" alt="" loading="${i?'lazy':'eager'}">`).join('')}</div><div class="gal-n"><span id="galn">1</span> / ${photos.length}</div>`:newsCover(n,'art-cover')}
  <div class="nc-tags">${n.demo?`<span class="tag demo">${t('annExample')}</span>`:''}${n.pinned?`<span class="chip pin">${t('pinned')}</span>`:''}<span class="chip">${esc(t('newsCats')[n.category]||'')}</span><small>${esc(newsDate(n))}</small></div>
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
  <div class="f"><label for="s3">${t('sPhotos')}</label><input id="s3" type="file" accept="image/*" multiple><div class="thumbs" id="sth"></div></div>
  <div class="f"><label for="s4">${t('sContact')}</label><input id="s4" maxlength="60"></div>
  <button class="btn primary" type="submit">${t('sSend')}</button></form>`;
 const draw=()=>{$('#sth').innerHTML=photos.map((p,i)=>`<div class="th"><img src="${p}" alt=""><button type="button" data-rm="${i}" aria-label="✕">✕</button></div>`).join('')};
 $('#sth').onclick=ev=>{const b=ev.target.closest('[data-rm]');if(b){photos.splice(+b.dataset.rm,1);draw()}};
 $('#s3').onchange=async ev=>{const files=[...ev.target.files];ev.target.value='';
  if(photos.length+files.length>3)toast(t('sTooMany'));
  for(const f of files.slice(0,3-photos.length)){try{let d=await compressImage(f,1280,0.8);if(d.length>580000)d=await compressImage(f,960,0.7);photos.push(d)}catch(e){toast(t('sPhotoErr'))}}draw()};
 $('#sugf').onsubmit=ev=>{ev.preventDefault();const f=ev.target;if($('#s1').value.trim().length<3){toast(t('sErr'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){toast(t('sSentDemo'));f.reset();photos=[];draw();return}
  sending(f.querySelector('[type=submit]'),async()=>{try{await SB.rpc('submit_news',{p_title:$('#s1').value,p_text:$('#s2').value,p_contact:$('#s4').value,p_photos:photos,p_device_id:deviceId(),p_hp:$('#hpf').value},30000);
   toast(t('sSent'));f.reset();photos=[];draw()}catch(e){toast(errMsg(e))}})};
}

// ---------- views ----------
function viewHome(q=''){
 app.innerHTML=`${searchBox(q)}<div id="results"></div>
 <div id="homeBody">${annBlock()}${newsBlock()}${promo()}<h2>${t('cats')}</h2><div class="tiles">${D.sections.filter(s=>D.entries.some(e=>e.section===s.id)).map(s=>{const n=D.entries.filter(e=>e.section===s.id).length;
  return `<a class="tile" href="#/c/${s.id}"><span class="em">${s.emoji}</span><b>${esc(secTitle(s))}</b><small>${t('entries')(n)}</small></a>`}).join('')}</div></div>`;
 bindSearch();
}
let sortMode='list';
function viewCat(id,subId){
 const s=secById[id];if(!s)return viewHome();
 const vs=visibleSubs(s);const showChips=!(vs.length<=1&&(vs[0]||{}).implicit);
 let list=D.entries.filter(e=>e.section===id&&(!subId||e.sub===subId));
 const bad=e=>e.flags.includes('malformed')?1:0;list.sort((a,b)=>bad(a)-bad(b)||a.id-b.id);
 if(sortMode==='rating')list=list.slice().sort((a,b)=>{const ra=rating(a.id),rb=rating(b.id);return bad(a)-bad(b)||rb.avg-ra.avg||rb.n-ra.n||(a.sort||a.id)-(b.sort||b.id)});
 list=list.filter(e=>e.vip).concat(list.filter(e=>!e.vip));
 app.innerHTML=`<div class="crumbs"><button class="back" onclick="location.hash='#/'" aria-label="${t('back')}">←</button><h1>${s.emoji} ${esc(secTitle(s))}</h1></div>
  ${showChips?`<div class="chips"><button class="${subId?'':'on'}" data-sub="">${t('all')}</button>${vs.map(x=>`<button class="${x.id===subId?'on':''}" data-sub="${x.id}">${esc(x.emoji)} ${esc(subTitle(x))}</button>`).join('')}</div>`:''}
  <div class="sortbar"><span>${t('found')(list.length)}</span><select id="sort"><option value="list">${t('sortList')}</option><option value="rating" ${sortMode==='rating'?'selected':''}>${t('sortRating')}</option></select></div>
  <p class="demo-note mini">${LIVE?'ℹ️ '+t('sortNoteLive'):'🧪 '+t('sortNote')}</p>
  ${list.some(e=>e.vip)?'':vipCard()}<div class="cards">${list.map(e=>card(e,false)).join('')}</div>`;
 app.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{location.hash='#/c/'+id+(b.dataset.sub?'/'+b.dataset.sub:'')});
 $('#sort').onchange=ev=>{sortMode=ev.target.value;viewCat(id,subId)};
}
function formNote(liveKey,demoKey){return LIVE?`<p class="demo-note live">ℹ️ ${t(liveKey)}</p>`:(OFFLINE?`<p class="demo-note warn">⚠️ ${t('offlineForm')}</p>`:`<p class="demo-note">🧪 ${t(demoKey)}</p>`)}
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
  if(!LIVE){toast(t('sent'));f.reset();return}
  sending(f.querySelector('[type=submit]'),async()=>{
   try{await SB.rpc('submit_business',{p_name:$('#f1').value,p_section_id:$('#f2').value,p_description:$('#f3').value,p_phone:ph,p_address:$('#f5').value,
     p_consent:$('#f6').checked,p_wants_vip:$('#f7').checked,p_device_id:deviceId(),p_hp:$('#hpf').value});toast(t('liveSent'));f.reset()}
   catch(e){toast(errMsg(e))}})};
}
function openReview(id){
 const e=D.entries.find(x=>x.id==id),r=rating(id);let pick=0;const m=$('#modal');
 m.innerHTML=`<div class="sheet">${LIVE?'':`<span class="tag demo">${t('demo')}</span>`}<h2 style="margin:6px 0">${t('rvTitle')}: ${esc(e.name||fmtPhone(e))}</h2>
  ${LIVE?`<p class="demo-note live">ℹ️ ${t('rvLiveNote')}</p>`:(OFFLINE?`<p class="demo-note warn">⚠️ ${t('offlineForm')}</p>`:`<p class="demo-note">🧪 ${t('rvDemo')}</p>`)}
  <div class="pick" role="radiogroup">${[1,2,3,4,5].map(i=>`<button type="button" data-s="${i}" aria-label="${i}">★</button>`).join('')}</div>
  <form id="rvf" style="position:relative">${hp()}<textarea id="rvt" maxlength="1000" placeholder="${t('rvPh')}" class="rv-in" style="min-height:80px"></textarea>
  ${LIVE?`<input id="rvn" class="rv-in" maxlength="60" placeholder="${t('rvName')}"><input id="rvp" class="rv-in" type="tel" inputmode="tel" placeholder="${t('rvPhone')}">`:''}
  <button class="btn primary" style="margin-top:10px">${t('rvSave')}</button></form>
  <button class="btn" style="background:#eee;color:#333;width:100%;margin-top:8px" id="rvc">${t('close')}</button>
  <div id="rvlist">${LIVE?`<div class="rev">${t('loading')}</div>`:r.list.map(v=>`<div class="rev">${stars(v.stars)} ${esc(v.text||'')}</div>`).join('')}</div></div>`;
 m.hidden=false;
 m.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{pick=+b.dataset.s;m.querySelectorAll('[data-s]').forEach(c=>c.classList.toggle('on',+c.dataset.s<=pick))});
 $('#rvc').onclick=()=>{m.hidden=true};m.onclick=ev=>{if(ev.target===m)m.hidden=true};
 if(LIVE)SB.get(`reviews_public?select=stars,text,author_name,created_at&specialist_id=eq.${+id}&order=created_at.desc&limit=30`).then(rows=>{
   $('#rvlist').innerHTML=rows.length?rows.map(v=>`<div class="rev">${stars(v.stars)} <b>${esc(v.author_name||'')}</b> ${esc(v.text||'')}</div>`).join(''):`<div class="rev">${t('noReviews')}</div>`})
  .catch(()=>{$('#rvlist').innerHTML=''});
 $('#rvf').onsubmit=ev=>{ev.preventDefault();if(!pick){toast(t('rvPick'));return}
  if(OFFLINE){toast(t('offlineForm'));return}
  if(!LIVE){const all=getRevs();(all[id]=all[id]||[]).push({stars:pick,text:$('#rvt').value.trim().slice(0,500),date:new Date().toISOString()});
   localStorage.setItem(RK,JSON.stringify(all));m.hidden=true;toast(t('rvSaved'));route();return}
  sending(ev.target.querySelector('.btn'),async()=>{
   try{await SB.rpc('submit_review',{p_specialist_id:+id,p_stars:pick,p_text:$('#rvt').value,p_device_id:deviceId(),p_phone:$('#rvp').value||null,p_name:$('#rvn').value||null,p_hp:$('#hpf').value});
    m.hidden=true;toast(t('rvSent'))}catch(e){toast(errMsg(e))}})};
}
let tt;function toast(msg){const el=$('#toast');el.textContent=msg;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,3500)}

// ---------- router ----------
function route(){setTimeout(()=>{if(!OFFLINE&&(LIVE||!SB.enabled))trackView()},0);
 const h=location.hash||'#/';let nav='home';
 app.dataset.view=(h.match(/^#\/(news\/suggest|news\/[^/?]+|[a-z]+)/)||[,'home'])[1].replace(/^news\/(?!suggest).+/,'article').replace('news/suggest','suggest');
 if(h.startsWith('#/c/')){const [id,sub]=h.slice(4).split('/');viewCat(id,sub)}
 else if(h.startsWith('#/add')){viewAdd();nav='add'}
 else if(h.startsWith('#/ann')){viewAnn(h.split('/')[2]);nav='ann'}
 else if(h.startsWith('#/news')){const id=h.split('/')[2];if(id)viewArticle(decodeURIComponent(id));else viewNews();nav='news'}
 else if(h.startsWith('#/report')){viewReport();nav='ann'}
 else if(h.startsWith('#/search')){const q=decodeURIComponent((h.split('q=')[1]||''));viewHome(q);nav='search';const i=$('#q');if(i&&!q)i.focus()}
 else viewHome();
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===nav));
 if(!h.startsWith('#/search'))window.scrollTo(0,0);
}
document.addEventListener('click',ev=>{
 const ct=ev.target.closest('a.btn.wa[href],a.btn.call[href]');const art=ct&&ct.closest('article.card[id^="e"]');
 if(art)track('contact',{p_specialist_id:+art.id.slice(1),p_channel:ct.classList.contains('wa')?'wa':'call'});
 const rv=ev.target.closest('[data-review]');if(rv){openReview(rv.dataset.review);return}
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
  star:!!r.recommended,new:!!r.is_new,flags,vip:!!r.vip,avg:+r.avg_stars||0,cnt:+r.review_count||0,sort:r.sort_order}}
function mapAnn(r){return{id:r.id,type:r.type,urgent:r.urgent,demo:r.is_demo,title:{ru:r.title_ru,kz:r.title_kz||r.title_ru},area:{ru:r.area_ru,kz:r.area_kz||r.area_ru},
 source:{ru:r.source_ru,kz:r.source_kz||r.source_ru},start:toAlmaty(r.start_at)||toAlmaty(r.created_at),end:toAlmaty(r.end_at)}}
function mapNews(r){const ph=(Array.isArray(r.photos)?r.photos:[]).map(p=>typeof p==='string'?p:p&&p.url).filter(Boolean);
 return{id:r.id,category:r.category,pinned:r.pinned,demo:r.is_demo,date:toAlmaty(r.publish_at),title:{ru:r.title_ru,kz:r.title_kz},lead:{ru:r.lead_ru,kz:r.lead_kz},body:{ru:r.body_ru,kz:r.body_kz},
  cover:r.cover_url||ph[0]||'',photos:r.cover_url&&ph.includes(r.cover_url)?[r.cover_url].concat(ph.filter(u=>u!==r.cover_url)):ph,video:r.video_url||''}}
async function loadBackend(){
 if(!SB.enabled)return;
 try{
  const [sp,an,ad]=await Promise.all([
   SB.get('specialists_public?select=*&order=sort_order.asc,id.asc',6000),
   SB.get('announcements?select=*&order=start_at.desc.nullslast',6000),
   SB.get('ads?select=*&order=sort_order.asc',6000)]);
  const nw=await SB.get('news?select=*&order=pinned.desc,publish_at.desc&limit=200',6000).catch(()=>null);
  if(!Array.isArray(sp)||!sp.length)throw new Error('empty');
  D.entries=sp.filter(r=>subById[r.sub_id]).map(mapSpec);ANN=an.map(mapAnn);ADS=ad;NEWS=Array.isArray(nw)?nw.map(mapNews):[];LIVE=true;OFFLINE=false;sortMode='rating';buildIndex();
 }catch(e){OFFLINE=true;LIVE=false;console.warn('Urker backend unreachable, using built-in list',e&&e.message)}
 const n=$('#netnote');if(n){n.hidden=!OFFLINE;n.textContent=t('offline')}
 const q=$('#q');if(q&&document.activeElement===q)renderResults(q.value);else route();
}
applyLang();route();loadBackend().then(()=>{if(LIVE)trackView()});loadMetrika();
window.addEventListener('urker-lang',()=>{const n=$('#netnote');if(n)n.textContent=t('offline')});
})();
