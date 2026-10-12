#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Уркер 24 — статические страницы для поисковиков и превью ссылок в WhatsApp/Telegram (только стандартная библиотека Python).

  python3 .github/scripts/build_static.py [--root .] [--data-dir DIR] [--today YYYY-MM-DD]

Читает ПУБЛИЧНЫЕ данные сайта через anon-ключ из config.js (только GET; anon-ключ публичный, его защищают правила RLS)
и пишет ТОЛЬКО:
  i/<id>/index.html      объявления жителей (превью: фото, заголовок, цена)
  n/<id>/index.html      новости района
  a/<id>/index.html      обращения жителей
  s/**/index.html, kz/index.html, kz/s/**/index.html   разделы мастеров (как build_seo.py)
  sitemap.xml
  t/<hash>.jpg, t/<hash>f.jpg  [siteU] копии фото объявлений/новостей/обращений: 480 px для плиток и 1280 px для галереи —
                 чтобы фото грузились с GitHub Pages, а не тратили трафик Supabase (бесплатно 5 ГБ/мес).
                 Пишутся, только если workflow разрешает путь t/ (иначе шаг проверки отклонил бы коммит) или задан --thumbs.
Файлы сайта (index.html, app.js, styles.css, s/seo.css, s/og/*.jpg, 404.html …) не трогает: запись в другие пути запрещена (WRITE_OK).
Пишет файл, только если его содержимое изменилось, — поэтому коммит в репозиторий бывает только при реальных изменениях.
--data-dir: взять JSON из папки (spec.json, listings.json, news.json, appeals.json) вместо запросов — для тестов.
"""
import argparse, datetime, html, io, json, os, re, subprocess, sys, urllib.parse, urllib.request

SITE = 'https://urker24.kz'
E = lambda s: html.escape(str(s or ''), quote=True)
THUMB_OK = re.compile(r'^t/[0-9a-f]{16}f?\.jpg$')
WRITE_OK = re.compile(r'^(?:(?:i|n|a)/\d+/index\.html|s/(?:[a-z]+/)(?:[a-z]+-\d+/)?index\.html|kz/index\.html|kz/s/(?:[a-z]+/)(?:[a-z]+-\d+/)?index\.html|sitemap\.xml)$')

def load_js_json(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

def fetch_json(url, key, timeout=30):
    req = urllib.request.Request(url, headers={'apikey': key, 'Authorization': 'Bearer ' + key, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        if r.status != 200: raise RuntimeError(f'HTTP {r.status} {url}')
        return json.loads(r.read())

def fmt_phone(p):
    return f'8 {p[1:4]} {p[4:7]} {p[7:9]} {p[9:]}' if len(p) == 11 else p

def ru_plural(n, one, few, many):
    return one if n % 10 == 1 and n % 100 != 11 else (few if 2 <= n % 10 <= 4 and not 10 <= n % 100 < 20 else many)

def short(t):
    t = re.sub(r'\s*\([^)]*\)', '', t).replace('&', 'и').strip()
    return t

L = {
 'ru': dict(brand='Уркер 24', place='Уркер, Астана', open='Открыть сайт Уркер 24', all='Все разделы',
            wa='WhatsApp', call='Позвонить', home='Главная', more='Открыть на сайте',
            add='➕ Добавить свой бизнес', report='Сообщить об ошибке или убрать свой номер',
            greet='Здравствуйте! Нашёл ваш контакт на сайте https://urker24.kz в разделе «{s}».',
            contacts=lambda n: f'{n} {ru_plural(n, "контакт", "контакта", "контактов")}',
            lang_other='Қазақша', lang_self='Русский', sw_label='Язык · Тіл',
            foot='Каталог мастеров и услуг района Уркер (Астана). Номера добавлены жителями и самими мастерами и проверены модератором.',
            reviews=lambda a, n: f'★ {a:.1f} ({n} отз.)'.replace('.', ','),
            sub_h='Подразделы'),
 'kz': dict(brand='Үркер 24', place='Үркер, Астана', open='Үркер 24 сайтын ашу', all='Барлық бөлімдер',
            wa='WhatsApp', call='Қоңырау', home='Басты бет', more='Сайтта ашу',
            add='➕ Өз бизнесіңізді қосу', report='Қате туралы хабарлау немесе нөміріңізді алып тастау',
            greet='Сәлеметсіз бе! Сіздің байланысыңызды https://urker24.kz сайтындағы «{s}» бөлімінен таптым.',
            contacts=lambda n: f'{n} байланыс',
            lang_other='Русский', lang_self='Қазақша', sw_label='Тіл · Язык',
            foot='Үркер ауданының (Астана) шеберлері мен қызметтерінің каталогы. Нөмірлерді тұрғындар мен шеберлердің өздері қосқан, модератор тексерген.',
            reviews=lambda a, n: f'★ {a:.1f} ({n} пікір)'.replace('.', ','),
            sub_h='Бөлімшелер'),
}

def sec_t(s, lg): return s['title_kz'] if lg == 'kz' else s['title_ru']
def sub_t(s, x, lg): return sec_t(s, lg) if x.get('implicit') else (x.get('title_kz') if lg == 'kz' else x['title'])

def page_url(lg, sec=None, sub=None):
    p = '/kz' if lg == 'kz' else ''
    if sec is None: return p + '/' if lg == 'kz' else '/'
    return f'{p}/s/{sec}/' + (f'{sub}/' if sub else '')

def spa(lg, frag='/'):
    return ('/?lang=kz#' if lg == 'kz' else '/?lang=ru#') + frag

WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>'

def card(e, s, x, lg):
    l = L[lg]; p = e['raw_phone']; ok = len(p) == 11 and p.isdigit()
    name = e['name'] or fmt_phone(p)
    wa = e['wa'] if re.fullmatch(r'7\d{10}', e['wa'] or '') else ''
    msg = urllib.parse.quote(l['greet'].replace('{s}', sub_t(s, x, lg)))
    rv = f'<span class="rv">{E(l["reviews"](float(e["avg"]), int(e["cnt"])))}</span>' if e['cnt'] else ''
    return (f'<article class="c" id="e{e["id"]}"><div class="cs">{E(x.get("emoji") or s["emoji"])} {E(sub_t(s, x, lg))}{rv}</div>'
            f'<h3>{E(name)}</h3>' + (f'<div class="ph">{E(fmt_phone(p))}</div>' if e['name'] else '') +
            (f'<p>{E(e["note"])}</p>' if e['note'] else '') + (f'<p>📍 {E(e["address"])}</p>' if e['address'] else '') +
            '<div class="ac">' +
            (f'<a class="b wa" href="https://api.whatsapp.com/send?phone={wa}&amp;text={E(msg)}" rel="nofollow noopener" target="_blank">{WA_SVG}{l["wa"]}</a>' if wa else '') +
            (f'<a class="b call" href="tel:+7{p[1:]}" rel="nofollow">📞 {l["call"]}</a>' if ok else '') +
            f'</div><a class="more" href="{E(spa(lg, f"/c/{s["id"]}/{x["id"]}/{e["id"]}"))}">{l["more"]} ›</a></article>')

def head(lg, title, desc, path, alt_ru, alt_kz, og_img, ld):
    return f'''<!doctype html>
<html lang="{'kk' if lg == 'kz' else 'ru'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#e8603c">
<meta name="color-scheme" content="only light">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{SITE}{path}">
<link rel="alternate" hreflang="ru" href="{SITE}{alt_ru}">
<link rel="alternate" hreflang="kk" href="{SITE}{alt_kz}">
<link rel="alternate" hreflang="x-default" href="{SITE}{alt_ru}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{L[lg]['brand']}">
<meta property="og:locale" content="{'kk_KZ' if lg == 'kz' else 'ru_RU'}">
<meta property="og:locale:alternate" content="{'ru_RU' if lg == 'kz' else 'kk_KZ'}">
<meta property="og:url" content="{SITE}{path}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE}{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{E(title)}">
<meta name="twitter:description" content="{E(desc)}">
<meta name="twitter:image" content="{SITE}{og_img}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="/s/seo.css?v=1">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
</head>
'''

def topbar(lg, alt_href):
    l = L[lg]
    return (f'<header class="top"><a class="brand" href="{spa(lg)}"><span class="logo">🏡</span><span><b>{"Үркер" if lg == "kz" else "Уркер"}</b>'
            f'<small>{"Жаныңыздағы шеберлер мен қызметтер" if lg == "kz" else "Мастера и услуги рядом"}</small></span></a></header>'
            f'<nav class="lb" aria-label="{l["sw_label"]}"><span>🌐 {l["sw_label"]}</span>'
            f'<a href="{alt_href}" hreflang="{"ru" if lg == "kz" else "kk"}" lang="{"ru" if lg == "kz" else "kk"}">{l["lang_other"]}</a><b>{l["lang_self"]}</b></nav>')

def footer(lg, D, counts):
    l = L[lg]
    links = ''.join(f'<a href="{page_url(lg, s["id"])}">{s["emoji"]} {E(sec_t(s, lg))}</a>' for s in D['sections'] if counts.get(s['id']))
    return (f'<section class="all"><h2>{l["all"]}</h2><div class="al">{links}</div></section>'
            f'<div class="cta"><a class="b pri" href="{spa(lg)}">🏡 {l["open"]}</a><a class="b gh" href="{spa(lg, "/add")}">{l["add"]}</a></div>'
            f'<footer><p>{l["foot"]}</p><p><a href="{spa(lg, "/report")}">{l["report"]}</a></p><p>© urker24.kz</p></footer>')

def crumbs(lg, items):
    out = []; ld = []
    for i, (name, href) in enumerate(items, 1):
        out.append(f'<a href="{href}">{E(name)}</a>' if i < len(items) else f'<span>{E(name)}</span>')
        ld.append({'@type': 'ListItem', 'position': i, 'name': name, 'item': SITE + href})
    return '<nav class="cr">' + ' › '.join(out) + '</nav>', {'@type': 'BreadcrumbList', 'itemListElement': ld}


# ---------------------------------------------------------------- объявления / новости / обращения
STYLE_V = 2
L_SEC = {'market': ('🛍', 'Барахолка', 'Барахолка'), 'ads': ('📋', 'Объявления', 'Хабарландырулар'), 'lost': ('🐾', 'Потеряшки', 'Жоғалғандар')}
L_KIND = {'sell': 'Продам', 'buy': 'Куплю', 'free': 'Отдам даром', 'rent_offer': 'Сдам', 'rent_seek': 'Сниму', 'job_offer': 'Вакансия', 'job_seek': 'Ищу работу',
          'gig': 'Подработка', 'service': 'Услуги частных лиц', 'ride': 'Попутчики', 'other': 'Разное', 'lost': 'Потерял', 'found': 'Нашёл'}
L_CAT = {'market': {'kids': 'Детское', 'clothes': 'Одежда', 'tech': 'Техника', 'furniture': 'Мебель', 'home': 'Для дома и дачи', 'auto': 'Авто и запчасти',
                    'animals': 'Животные и скот', 'build': 'Стройматериалы', 'other': ''},
         'ads': {'house': 'Дом', 'flat': 'Квартира', 'room': 'Комната', 'garage': 'Гараж', 'equipment': 'Техника', 'other': ''},
         'lost': {'animals': 'Животные', 'docs': 'Документы', 'keys': 'Ключи', 'things': 'Вещи', 'other': ''}}
L_CLOSED = {'market': 'Продано', 'ads': 'Неактуально', 'lost': 'Нашлось'}
AP_CAT = {'light': ('💡', 'Освещение'), 'trash': ('🗑', 'Мусор и вывоз'), 'roads': ('🛣', 'Дороги и ямы'), 'water': ('🚰', 'Вода и канализация'),
          'heat': ('🔥', 'Отопление и газ'), 'yard': ('🌳', 'Благоустройство, дворы, детские площадки'), 'dogs': ('🐕', 'Бездомные собаки'),
          'safety': ('🚨', 'Безопасность'), 'transport': ('🚌', 'Транспорт'), 'other': ('📌', 'Другое')}
AP_ST = {'new': 'Новое', 'sent': 'Передано в акимат', 'in_work': 'В работе', 'resolved': 'Решено'}
NEWS_CAT = {'event': '🎉 Событие', 'opening': '🏪 Открытие', 'achievement': '🏆 Достижение', 'improvement': '🌳 Благоустройство', 'akimat': '🏛 Акимат', 'other': '📰 Новости'}
MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
BOTS = 'bot|crawl|spider|slurp|facebookexternalhit|facebookcatalog|WhatsApp|TelegramBot|Twitterbot|vkShare|Slack|Discord|Viber|Skype|LinkedIn|Pinterest|Google|Yandex|bingpreview|Applebot'

def money(l):
    if l.get('price_mode') == 'fixed' and l.get('price') is not None:
        return f'{int(l["price"]):,}'.replace(',', ' ') + ' ₸'
    return {'free': 'Даром', 'negotiable': 'Договорная'}.get(l.get('price_mode'), '')

def clip(s, n):
    s = re.sub(r'\s+', ' ', str(s or '')).strip()
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0].rstrip(',.;:—-') + '…'

def ru_date(iso):
    if not iso: return ''
    d = datetime.datetime.fromisoformat(iso.replace('Z', '+00:00'))
    d = d.astimezone(datetime.timezone(datetime.timedelta(hours=5))) if d.tzinfo else d + datetime.timedelta(hours=5)
    return f'{d.day} {MONTHS[d.month - 1]} {d.year}'

def street_txt(s):
    s = str(s or '').strip()
    return s if re.match(r'^(мкр|микрорайон|мкрн|пер\.?|переулок|пр\.?|проспект|ш\.?|шоссе|тупик|ж\.?\s?м|тұйық|даңғыл|шағын)', s, re.I) else 'ул. ' + s

def small_page(path, title, desc, image, spa_route, body, lang='ru', noindex=False, img_alt=''):
    """Короткая страница: OpenGraph для превью + видимый текст. Людей сразу переводит в приложение (spa_route), роботов — нет."""
    url = SITE + path
    img = image or SITE + '/og-urker24.jpg'
    dims = '' if image else '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
    redirect = (f'<script>if(!/{BOTS}/i.test(navigator.userAgent))location.replace({json.dumps(spa_route)});</script>\n') if spa_route else ''
    return f'''<!doctype html>
<html lang="{'kk' if lang == 'kz' else 'ru'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#e8603c">
<meta name="color-scheme" content="only light">
{redirect}<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
{'<meta name="robots" content="noindex">' if noindex else f'<link rel="canonical" href="{url}">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Уркер 24">
<meta property="og:locale" content="{'kk_KZ' if lang == 'kz' else 'ru_RU'}">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{E(img)}">
{dims}<meta property="og:image:alt" content="{E(img_alt or title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{E(title)}">
<meta name="twitter:description" content="{E(desc)}">
<meta name="twitter:image" content="{E(img)}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/s/seo.css?v={STYLE_V}">
</head>
<body><header class="top"><a class="brand" href="/"><span class="logo">🏡</span><span><b>Уркер 24</b><small>Мастера и услуги рядом · Жаныңыздағы шеберлер</small></span></a></header>
<main class="it">{body}
<footer><p>Уркер 24 — мастера, объявления, новости и обращения жителей района Уркер (Астана).</p><p lang="kk">Үркер 24 — Үркер ауданының шеберлері, хабарландырулары, жаңалықтары мен тұрғындар өтініштері.</p><p>© urker24.kz</p></footer></main>
</body></html>
'''

def open_btns(route, ru, kz):
    return (f'<a class="b pri" href="{E(route)}">{E(ru)} ›</a>'
            f'<a class="b gh" lang="kk" href="{E(route.replace("/#", "/?lang=kz#", 1))}">{E(kz)} ›</a>')

def gone_page(path, ru, kz, home_route, home_ru, home_kz):
    body = (f'<div class="nf"><div class="em">🗂</div><h1>{E(ru)}</h1><p>Возможно, его уже закрыли или срок показа истёк.</p>'
            f'<h1 lang="kk">{E(kz)}</h1><p lang="kk">Мүмкін, ол жабылған немесе көрсету мерзімі өткен.</p>'
            f'<div class="cta">{open_btns(home_route, home_ru, home_kz)}<a class="b gh" href="/">🏡 Уркер 24 · Үркер 24</a></div></div>')
    return small_page(path, f'{ru} · {kz} — Уркер 24', f'{ru}. Свежие объявления, мастера и новости района Уркер — на urker24.kz', None, None, body, noindex=True)

MIRROR = {}
def og_img(key, sb_url):
    fn = thumb_name(key, True)
    if MIRROR.get('root') and os.path.exists(os.path.join(MIRROR['root'], fn)): return SITE + '/' + fn
    return f'{sb_url}/storage/v1/object/public/' + '/'.join(urllib.parse.quote(p) for p in key.split('/'))

def listing_page(l, sb_url):
    lid = int(l['id']); path = f'/i/{lid}/'; route = f'/#/item/{lid}'
    sec = l.get('section') if l.get('section') in L_SEC else 'market'
    em, sec_ru, sec_kz = L_SEC[sec]
    kind = L_KIND.get(l.get('kind'), ''); cat = L_CAT.get(sec, {}).get(l.get('category'), '')
    closed = l.get('status') == 'closed'
    pr = money(l); title_txt = clip(l.get('title'), 110)
    photos = [p.get('path') for p in (l.get('photos') or []) if isinstance(p, dict) and p.get('path')]
    img = og_img('listings/' + photos[0], sb_url) if photos else None
    title = (f'✅ {L_CLOSED[sec]}: ' if closed else '') + title_txt + (f' — {pr}' if pr and not closed and not re.search(r'\d[\d\s]*₸', title_txt) else '')
    meta = ' · '.join(x for x in [kind, cat] if x)
    desc = clip(' · '.join(x for x in [(f'💰 {pr}' if pr else ''), meta, (f'📍 {l["place"]}' if l.get('place') else '')] if x) +
                ('. ' + l['body'] if l.get('body') else '') + ' — объявление жителя Уркера на urker24.kz', 200)
    body = ((f'<a class="pic" href="{route}"><img src="{E(img)}" alt="{E(title_txt)}" width="640" height="480"></a>' if img else '') +
            f'<div class="cs">{em} {sec_ru}{" · " + E(meta) if meta else ""}</div>'
            f'<h1>{E(title_txt)}</h1>' + (f'<div class="pr">{E(pr)}</div>' if pr else '') +
            (f'<p class="tag">✅ {L_CLOSED[sec]}</p>' if closed else '') +
            (f'<p class="pl">📍 {E(l["place"])}</p>' if l.get('place') else '') +
            (f'<p>{E(clip(l["body"], 600))}</p>' if l.get('body') else '') +
            f'<p class="dt">Опубликовано {E(ru_date(l.get("published_at") or l.get("created_at")))}</p>'
            f'<div class="cta">{open_btns(route, "Открыть объявление", "Хабарландыруды ашу")}</div>')
    return path, small_page(path, title + ' | Уркер 24', desc, img, route, body, lang=l.get('lang') or 'ru', img_alt=title_txt)

def news_page(n):
    nid = int(n['id']); path = f'/n/{nid}/'; route = f'/#/news/{nid}'
    ti = n.get('title_ru') or n.get('title_kz') or ''; lang = 'ru' if n.get('title_ru') else 'kz'
    lead = n.get('lead_ru') or n.get('lead_kz') or ''
    ph = [(p if isinstance(p, str) else (p or {}).get('url')) for p in (n.get('photos') or [])]
    img = n.get('cover_url') or next((u for u in ph if u), None)
    img = img if img and re.match(r'^https://', img) else None
    if img and key_from_url(img) and MIRROR.get('root') and os.path.exists(os.path.join(MIRROR['root'], thumb_name(key_from_url(img), True))):
        img = SITE + '/' + thumb_name(key_from_url(img), True)
    cat = NEWS_CAT.get(n.get('category'), '📰 Новости')
    desc = clip(lead or ti, 190) or 'Новости района Уркер'
    body = ((f'<a class="pic" href="{route}"><img src="{E(img)}" alt="{E(ti)}" width="640" height="420"></a>' if img else '') +
            f'<div class="cs">{E(cat)} · {E(ru_date(n.get("publish_at")))}</div><h1>{E(ti)}</h1>' +
            (f'<p class="lead">{E(lead)}</p>' if lead else '') +
            (f'<h2 lang="kk" class="kzt">{E(n["title_kz"])}</h2>' if n.get('title_ru') and n.get('title_kz') else '') +
            f'<div class="cta">{open_btns(route, "Читать новость", "Жаңалықты оқу")}</div>')
    return path, small_page(path, f'{clip(ti, 110)} — Новости Уркера | Уркер 24', desc, img, route, body, lang=lang, img_alt=ti)

def appeal_page(a, sb_url):
    aid = int(a['id']); path = f'/a/{aid}/'; route = f'/#/appeal/{aid}'
    em, cat = AP_CAT.get(a.get('category'), AP_CAT['other'])
    addr = street_txt(a.get('street')) + (f', д. {a["house"]}' if a.get('house') else '')
    st = AP_ST.get(a.get('status'), ''); sup = int(a.get('supports') or 0)
    photos = [p.get('path') for p in (a.get('photos') or []) if isinstance(p, dict) and p.get('path')]
    img = og_img('appeals/' + photos[0], sb_url) if photos else None
    title = f'📢 {cat} — {addr}'
    desc = clip(f'«{clip(a.get("description"), 120)}» · Статус: {st} · Поддержали: {sup}. Поддержите обращение жителей Уркера', 200)
    body = ((f'<a class="pic" href="{route}"><img src="{E(img)}" alt="{E(cat)}" width="640" height="480"></a>' if img else '') +
            f'<div class="cs">📢 Обращение жителей · {E(st)}</div><h1>{em} {E(cat)}</h1><p class="pl">📍 {E(addr)}</p>'
            f'<p>{E(clip(a.get("description"), 600))}</p><p class="dt">👍 Поддержали: {sup} · {E(ru_date(a.get("published_at")))}</p>'
            f'<div class="cta">{open_btns(route, "Поддержать обращение", "Өтінішті қолдау")}</div>')
    return path, small_page(path, title + ' | Уркер 24', desc, img, route, body, img_alt=cat)

# ---------------------------------------------------------------- [siteU] копии фото на GitHub Pages
THUMB_W, FULL_W = 480, 1280
def fnv(b, h):
    for x in b: h = ((h ^ x) * 16777619) & 0xffffffff
    return h
def thumb_name(key, full=False):  # key = 'bucket/путь'; то же самое считает URKER_IMG в sb.js
    b = key.encode('utf-8'); return f't/{fnv(b, 2166136261):08x}{fnv(b, 84696351):08x}{"f" if full else ""}.jpg'
def key_from_url(u):
    m = re.search(r'/storage/v1/object/public/([^?#]+)', u or '')
    return urllib.parse.unquote(m.group(1)) if m else None

def get_pil():
    try:
        from PIL import Image; return Image
    except ImportError: pass
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '--disable-pip-version-check', 'pillow'], check=True, timeout=180,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        import importlib; importlib.invalidate_caches(); from PIL import Image; return Image
    except Exception as ex:
        print('thumbs: Pillow unavailable —', ex); return None

def make_jpeg(Image, raw, maxw, q):
    from PIL import ImageOps
    im = Image.open(io.BytesIO(raw)); im = ImageOps.exif_transpose(im)
    if im.mode not in ('RGB', 'L'):
        bg = Image.new('RGB', im.size, (255, 255, 255)); im = im.convert('RGBA'); bg.paste(im, mask=im.split()[3]); im = bg
    im = im.convert('RGB'); im.thumbnail((maxw, maxw), Image.LANCZOS)
    out = io.BytesIO(); im.save(out, 'JPEG', quality=q, optimize=True, progressive=True); return out.getvalue()

def build_thumbs(root, sb_url, keys, prune, limit=150):
    """keys: множество 'bucket/путь'. Скачивает (публичный GET) только то, чего ещё нет. Возвращает список изменённых файлов."""
    os.makedirs(os.path.join(root, 't'), exist_ok=True); changed = []; Image = None; done = 0
    want = set()
    for k in sorted(keys):
        tn, fn = thumb_name(k), thumb_name(k, True); want |= {tn, fn}
        if os.path.exists(os.path.join(root, tn)) and os.path.exists(os.path.join(root, fn)): continue
        if done >= limit: continue
        Image = Image or get_pil()
        if not Image: break
        try:
            url = sb_url + '/storage/v1/object/public/' + '/'.join(urllib.parse.quote(p) for p in k.split('/'))
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'urker24-static'}), timeout=30) as r: raw = r.read()
            small = make_jpeg(Image, raw, THUMB_W, 72); big = make_jpeg(Image, raw, FULL_W, 80)
            if len(big) > len(raw) and raw[:3] == b'\xff\xd8\xff': big = raw   # оригинал уже лёгкий
        except Exception as ex:
            print('thumbs: skip', k, ex); continue
        for rel, data in ((tn, small), (fn, big)):
            assert THUMB_OK.match(rel)
            open(os.path.join(root, rel), 'wb').write(data); changed.append(rel)
        done += 1
    if prune:
        for f in os.listdir(os.path.join(root, 't')):
            rel = 't/' + f
            if THUMB_OK.match(rel) and rel not in want: os.remove(os.path.join(root, rel)); changed.append(rel)
    print(f'thumbs: {len(keys)} photos, {done} new, {len(changed)} files changed')
    return changed

def thumbs_allowed(root):
    try: y = open(os.path.join(root, '.github', 'workflows', 'static-pages.yml'), encoding='utf-8').read()
    except OSError: return False
    return bool(re.search(r'for p in [^;\n]*\bt\b', y)) and 't/[0-9a-f]' in y

# ---------------------------------------------------------------- запуск
class Writer:
    def __init__(self, root):
        self.root = root; self.changed = []; self.written = set()
    def put(self, path, text):
        rel = path.lstrip('/')
        if rel.endswith('/') or rel == '': rel += 'index.html'
        if not WRITE_OK.match(rel): raise SystemExit(f'refusing to write {rel}')
        self.written.add(rel)
        fp = os.path.join(self.root, rel)
        old = open(fp, encoding='utf-8').read() if os.path.exists(fp) else None
        if old == text: return False
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        open(fp, 'w', encoding='utf-8').write(text); self.changed.append(rel); return True
    def remove(self, rel):
        if not WRITE_OK.match(rel): raise SystemExit(f'refusing to remove {rel}')
        os.remove(os.path.join(self.root, rel)); self.changed.append(rel)
        d = os.path.dirname(os.path.join(self.root, rel))
        try: os.rmdir(d)
        except OSError: pass

def existing_ids(root, d):
    p = os.path.join(root, d)
    return sorted(int(x) for x in os.listdir(p) if x.isdigit() and os.path.exists(os.path.join(p, x, 'index.html'))) if os.path.isdir(p) else []

def is_stub(root, rel):
    fp = os.path.join(root, rel)
    return os.path.exists(fp) and 'name="robots" content="noindex"' in open(fp, encoding='utf-8').read()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.'); ap.add_argument('--data-dir'); ap.add_argument('--today')
    ap.add_argument('--thumbs', action='store_true', help='писать t/ даже если workflow его ещё не разрешает (для тестов)')
    ap.add_argument('--no-thumbs', action='store_true')
    a = ap.parse_args(); root = os.path.abspath(a.root)
    D = load_js_json(os.path.join(root, 'data.js'))
    cfg = open(os.path.join(root, 'config.js'), encoding='utf-8').read()
    sb_url = re.search(r"supabaseUrl:\s*'([^']+)'", cfg).group(1).rstrip('/'); key = re.search(r"supabaseAnonKey:\s*'([^']+)'", cfg).group(1)
    if a.data_dir:
        ld = lambda n: json.load(open(os.path.join(a.data_dir, n), encoding='utf-8'))
        sp, ls, nw, apl = ld('spec.json'), ld('listings.json'), ld('news.json'), ld('appeals.json')
    else:
        R = sb_url + '/rest/v1/'
        sp = fetch_json(R + 'specialists_public?select=id,section_id,sub_id,name,note,address,phone,wa,vip,avg_stars,review_count,sort_order&order=sort_order.asc,id.asc', key)
        ls = fetch_json(R + 'listings?select=id,section,kind,category,title,body,price,price_mode,place,photos,status,lang,published_at,created_at,expires_at&order=id.asc&limit=2000', key)
        nw = fetch_json(R + 'news?select=id,category,title_ru,title_kz,lead_ru,lead_kz,cover_url,photos,publish_at,is_demo&status=eq.published&order=id.asc&limit=1000', key)
        try: apl = fetch_json(R + 'appeals?select=id,category,street,house,description,photos,status,supports,published_at&order=id.asc&limit=2000', key)
        except Exception as ex: print('appeals skipped:', ex); apl = None
    # защита: при сбое базы не превращать все страницы в «снято»
    if not isinstance(sp, list) or len(sp) < 20: raise SystemExit(f'specialists: only {len(sp) if isinstance(sp, list) else sp!r} rows — abort, nothing written')
    old_i = existing_ids(root, 'i')
    live_i = [x for x in (ls or []) if x.get('status') in ('approved', 'closed')]
    if old_i and len([i for i in old_i if not is_stub(root, f'i/{i}/index.html')]) >= 5 and not live_i:
        raise SystemExit('listings: 0 rows while pages exist — abort, nothing written')
    # [siteU] копии фото — до страниц, чтобы og:image уже указывал на копию
    thumbs_changed = []
    if not a.no_thumbs and (a.thumbs or thumbs_allowed(root)):
        keys = set()
        for x in live_i:
            for p in (x.get('photos') or []):
                if isinstance(p, dict) and p.get('path'): keys.add('listings/' + p['path'])
        for n in (nw or []):
            if n.get('is_demo'): continue
            for u in [n.get('cover_url')] + [(p if isinstance(p, str) else (p or {}).get('url')) for p in (n.get('photos') or [])]:
                k = key_from_url(u)
                if k: keys.add(k)
        for x in (apl or []):
            if x.get('status') not in AP_ST: continue
            for p in (x.get('photos') or []):
                if isinstance(p, dict) and p.get('path'): keys.add('appeals/' + p['path'])
        thumbs_changed = build_thumbs(root, sb_url, keys, prune=apl is not None and not a.data_dir)
        MIRROR['root'] = root
    elif not a.no_thumbs:
        print('thumbs: skipped — workflow does not allow t/ yet (see NOTE.md)')
    today = a.today or (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=5)).date().isoformat()
    W = Writer(root)
    pages = []  # (ru_path, kz_path or None)
    # 1) s/ и kz/ — те же страницы, что build_seo.py --live
    pages += build_sections(D, sp, W)
    # 2) объявления
    seen = set()
    for l in sorted(live_i, key=lambda x: int(x['id'])):
        path, text = listing_page(l, sb_url); W.put(path, text); seen.add(int(l['id']))
        if l.get('status') == 'approved': pages.append((path, None))
    for i in old_i:
        if i not in seen: W.put(f'/i/{i}/', gone_page(f'/i/{i}/', 'Объявление снято', 'Хабарландыру алынып тасталды', '/#/bazar', 'Смотреть свежие объявления', 'Жаңа хабарландыруларды көру'))
    # 3) новости
    seen = set()
    for n in sorted([x for x in (nw or []) if not x.get('is_demo')], key=lambda x: int(x['id'])):
        path, text = news_page(n); W.put(path, text); seen.add(int(n['id'])); pages.append((path, None))
    for i in existing_ids(root, 'n'):
        if i not in seen: W.put(f'/n/{i}/', gone_page(f'/n/{i}/', 'Новость снята', 'Жаңалық алынып тасталды', '/#/news', 'Все новости района', 'Барлық жаңалықтар'))
    # 4) обращения (если таблицы ещё нет — пропускаем)
    if apl is not None:
        seen = set()
        for x in sorted([x for x in apl if x.get('status') in AP_ST], key=lambda x: int(x['id'])):
            path, text = appeal_page(x, sb_url); W.put(path, text); seen.add(int(x['id'])); pages.append((path, None))
        for i in existing_ids(root, 'a'):
            if i not in seen: W.put(f'/a/{i}/', gone_page(f'/a/{i}/', 'Обращение не найдено', 'Өтініш табылмады', '/#/appeals', 'Все обращения жителей', 'Барлық өтініштер'))
    # 5) устаревшие страницы разделов (раздел опустел) — удалить; seo.css и s/og/ не трогаем
    for top in ('s', 'kz/s'):
        base = os.path.join(root, top)
        for dp, dn, fn in os.walk(base):
            for f in fn:
                rel = os.path.relpath(os.path.join(dp, f), root).replace(os.sep, '/')
                if f == 'index.html' and WRITE_OK.match(rel) and rel not in W.written: W.remove(rel)
    # 6) sitemap: lastmod меняется только у изменившихся страниц
    old_lm = {}
    smp = os.path.join(root, 'sitemap.xml')
    if os.path.exists(smp):
        for m in re.finditer(r'<loc>([^<]+)</loc><lastmod>([^<]+)</lastmod>', open(smp, encoding='utf-8').read()): old_lm[m.group(1)] = m.group(2)
    chg = set('/' + c[:-len('index.html')] for c in W.changed)
    def lm(p): return today if (p in chg or SITE + p not in old_lm) else old_lm[SITE + p]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for ru_p, kz_p in pages:
        if kz_p is None:
            sm.append(f'  <url><loc>{SITE}{ru_p}</loc><lastmod>{lm(ru_p)}</lastmod></url>'); continue
        for p in (ru_p, kz_p):
            l2 = lm(p) if p not in ('/',) else (old_lm.get(SITE + '/') or today)
            sm.append(f'  <url><loc>{SITE}{p}</loc><lastmod>{l2}</lastmod>'
                      f'<xhtml:link rel="alternate" hreflang="ru" href="{SITE}{ru_p}"/><xhtml:link rel="alternate" hreflang="kk" href="{SITE}{kz_p}"/>'
                      f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{ru_p}"/></url>')
    sm.append('</urlset>')
    W.put('/sitemap.xml', '\n'.join(sm) + '\n')
    print(f'ok: {len(sp)} specialists, {len(live_i)} listings, {len(nw or [])} news, {len(apl or [])} appeals; changed files: {len(W.changed)}')
    for c in W.changed[:40]: print('  ', c)

def build_sections(D, rows, W):
    secs = {s['id']: s for s in D['sections']}
    subs = {x['id']: (s, x) for s in D['sections'] for x in s['subs']}
    ents = [{'id': r['id'], 'section': r['section_id'], 'sub': r['sub_id'], 'name': r.get('name') or '', 'note': r.get('note') or '',
             'address': r.get('address') or '', 'raw_phone': r.get('phone') or '', 'wa': r.get('wa') or '', 'vip': bool(r.get('vip')),
             'avg': r.get('avg_stars') or 0, 'cnt': r.get('review_count') or 0, 'sort': r.get('sort_order') or r['id']} for r in rows]
    ents = [e for e in ents if e['sub'] in subs and subs[e['sub']][0]['id'] == e['section']]
    ents.sort(key=lambda e: (not e['vip'], 0 if len(e['raw_phone']) == 11 else 1, e['id']))
    counts = {}
    for e in ents: counts[e['section']] = counts.get(e['section'], 0) + 1
    pages = [('/', '/kz/')]
    for sid, s in secs.items():
        if not counts.get(sid): continue
        sec_ents = [e for e in ents if e['section'] == sid]
        vis_subs = [x for x in s['subs'] if any(e['sub'] == x['id'] for e in sec_ents)]
        sub_pages = vis_subs if len(vis_subs) > 1 else []
        for x, lst in [(None, sec_ents)] + [(x, [e for e in sec_ents if e['sub'] == x['id']]) for x in sub_pages]:
            ru_p, kz_p = page_url('ru', sid, x and x['id']), page_url('kz', sid, x and x['id'])
            pages.append((ru_p, kz_p))
            for lg in ('ru', 'kz'):
                l = L[lg]; n = len(lst)
                st = sec_t(s, lg); xt = short(sub_t(s, x, lg)) if x else None
                named = [e['name'] for e in lst if e['name']][:3]
                if lg == 'ru':
                    title = f'{xt or st} в Уркере, Астана — {l["contacts"](n)} | Уркер 24'
                    h1 = f'{(x or {}).get("emoji") or s["emoji"]} {xt or st}'
                    lead = (f'{xt or st} в районе Уркер (Астана): {l["contacts"](n)}. Звоните или пишите в WhatsApp в один клик — мастера рядом с домом.')
                    desc = (f'{xt or st} в районе Уркер, Астана: {l["contacts"](n)}' + (f' ({", ".join(named)} и другие)' if named else '') +
                            '. Телефоны и WhatsApp, без посредников.')
                else:
                    title = f'Үркердегі {xt or st} — {l["contacts"](n)} | Үркер 24'
                    h1 = f'{(x or {}).get("emoji") or s["emoji"]} {xt or st}'
                    lead = (f'Үркер ауданындағы (Астана) {xt or st}: {l["contacts"](n)}. Қоңырау шалыңыз немесе WhatsApp-қа бір рет басып жазыңыз.')
                    desc = (f'Үркер ауданындағы (Астана) {xt or st}: {l["contacts"](n)}' + (f' ({", ".join(named)} және басқалар)' if named else '') +
                            '. Телефондар мен WhatsApp, делдалсыз.')
                desc = desc if len(desc) <= 200 else desc[:197].rsplit(' ', 1)[0] + '…'
                path = ru_p if lg == 'ru' else kz_p
                cr_items = [(l['brand'], page_url(lg)), (st, page_url(lg, sid))] + ([(xt, path)] if x else [])
                cr_html, cr_ld = crumbs(lg, cr_items)
                chips = ''
                if len(vis_subs) > 1:
                    chips = (f'<nav class="ch" aria-label="{l["sub_h"]}"><a class="{"" if x else "on"}" href="{page_url(lg, sid)}">{"Барлығы" if lg == "kz" else "Все"}</a>' +
                             ''.join(f'<a class="{"on" if x and v["id"] == x["id"] else ""}" href="{page_url(lg, sid, v["id"])}">{E(v["emoji"])} {E(short(sub_t(s, v, lg)))}</a>' for v in vis_subs) + '</nav>')
                ld = {'@context': 'https://schema.org', '@graph': [
                    {'@type': 'CollectionPage', 'name': title, 'description': desc, 'url': SITE + path,
                     'inLanguage': 'kk' if lg == 'kz' else 'ru', 'isPartOf': {'@id': SITE + '/#website'},
                     'about': {'@type': 'Place', 'name': 'Үркер, Астана'}}, cr_ld]}
                alt = kz_p if lg == 'ru' else ru_p
                body = (f'<body>{topbar(lg, alt)}<main>{cr_html}<h1>{E(h1)}</h1><p class="lead">{E(lead)}</p>{chips}'
                        f'<a class="b pri open" href="{E(spa(lg, f"/c/{sid}" + (f"/{x["id"]}" if x else "")))}">{l["open"]} ›</a>'
                        f'<div class="cards">' + ''.join(card(e, s, subs[e['sub']][1], lg) for e in lst) + '</div>'
                        + footer(lg, D, counts) + '</main></body></html>\n')
                og = f'/s/og/{sid}.jpg' if os.path.exists(os.path.join(W.root, 's', 'og', f'{sid}.jpg')) else '/og-urker24.jpg'
                W.put(path, head(lg, title, desc, path, ru_p, kz_p, og, ld) + body)
    lg = 'kz'; l = L[lg]
    tiles = ''.join(f'<a class="t" href="{page_url(lg, s["id"])}"><span class="em">{s["emoji"]}</span><b>{E(sec_t(s, lg))}</b><small>{l["contacts"](counts[s["id"]])}</small></a>'
                    for s in D['sections'] if counts.get(s['id']))
    title = 'Үркер 24 — Үркер ауданының шеберлері мен қызметтері, Астана'
    desc = 'Жақын маман мен қызметтер: сантехниктер, электриктер, тазалау, медицина, авто және басқалар. Үркер ауданының (Астана) хабарландырулары мен жаңалықтары. WhatsApp-қа бір рет басып жазыңыз.'
    ld = {'@context': 'https://schema.org', '@graph': [{'@type': 'WebPage', 'name': title, 'url': SITE + '/kz/', 'inLanguage': 'kk', 'isPartOf': {'@id': SITE + '/#website'}}]}
    W.put('/kz/', head(lg, title, desc, '/kz/', '/', '/kz/', '/og-urker24.jpg', ld) +
          f'<body>{topbar(lg, "/?lang=ru#/")}<main><h1>🏡 Үркер 24 — Үркер ауданының шеберлері мен қызметтері</h1>'
          f'<p class="lead">{E(desc)}</p><a class="b pri open" href="{spa(lg)}">{l["open"]} ›</a>'
          f'<h2>{l["all"]}</h2><div class="tiles">{tiles}</div>'
          f'<div class="cta"><a class="b gh" href="{spa(lg, "/news")}">📰 Жаңалықтар</a><a class="b gh" href="{spa(lg, "/ann")}">⚠️ Маңызды хабарландырулар</a><a class="b gh" href="{spa(lg, "/add")}">{l["add"]}</a></div>'
          f'<footer><p>{l["foot"]}</p><p>© urker24.kz</p></footer></main></body></html>\n')
    return pages

if __name__ == '__main__':
    main()
