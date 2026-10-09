// Подключение к базе Supabase. Пусто = сайт работает на встроенном списке (data.js) в демо-режиме.
// Supabase → Project Settings → API: "Project URL" и ключ "anon public".
// anon-ключ публичный по замыслу Supabase (его защищают правила RLS). service_role-ключ сюда НЕЛЬЗЯ.
window.URKER_CONFIG = {
  supabaseUrl: 'https://guccqytzzqbsvkyimhax.supabase.co',
  supabaseAnonKey: 'sb_publishable_sPRO5PI4kBXK8TYHxMng7A_UB4I9zjV',
  // Яндекс Метрика: номер счётчика (только цифры), пусто = не подключать.
  metrikaId: '',
  metrikaWebvisor: false,     // запись сессий (Вебвизор) — выключена
  // WhatsApp для рекламы и VIP-мест (номер Асета, 7XXXXXXXXXX). Пусто = кнопки ведут на форму «Добавить».
  adContactWa: '',
  // Разделы, которые включаются ПОСЛЕ запуска их SQL в Supabase (true = включено):
  //   listings — «Барахолка / Объявления / Потеряшки» (нужен 06_listings.sql)
  //   claims   — «Это ваш бизнес? Дополните карточку» (нужен 08_claims.sql)
  //   ads      — рекламный баннер на главной и место «Закрепиться наверху» (пока скрыто)
  features: { listings: false, claims: false, ads: false }
};
