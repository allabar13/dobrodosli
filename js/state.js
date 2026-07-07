"use strict";
// ── Профили, прогресс, стрик, интервальные повторения ────────────────────
// Хранение — localStorage; при подключённом облаке копия улетает в Supabase.
const State = (() => {
  const KEY = 'dobrodosli_users_v1';
  const CUR = 'dobrodosli_current_v1';
  let users = {};

  function loadAll(){
    try { users = JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { users = {}; }
  }
  function persist(){ localStorage.setItem(KEY, JSON.stringify(users)); }
  function todayKey(d){ return (d || new Date()).toLocaleDateString('sv-SE'); }
  function daysAgoKey(n){ return todayKey(new Date(Date.now() - n * 864e5)); }

  function blank(profile){
    return Object.assign({
      id: 'u_' + Math.random().toString(36).slice(2, 10),
      name: 'Ученик', cloudId: null,
      createdAt: Date.now(), updatedAt: Date.now(),
      settings: { variant: 'rs', script: 'lat', goal: 20, sound: true, motivation: null, theme: 'auto' },
      level: 1,           // выбранный уровень курса (1–5)
      unlockedExtra: {},  // уроки, открытые «через голову» по явному решению
      xp: 0,
      streak: { count: 0, best: 0, last: null, freezes: 1 }, // легаси: стрики больше не показываем
      lessons: {},   // lessonId → { stars, times, ts }
      words: {},     // wordId  → { s, seen, ok, bad, last, due }
      mistakes: {},  // wordId  → { n, ts } — блок «Ошибки»
      badges: [],
      history: {},   // 'YYYY-MM-DD' → XP за день
      reviews: 0,
      flags: {},
    }, profile || {});
  }

  // профили из старых версий получают новые поля
  function migrate(u){
    if (!u) return u;
    if (!u.mistakes) u.mistakes = {};
    if (!u.flags) u.flags = {};
    if (!u.settings.theme) u.settings.theme = 'auto';
    if (!u.level) u.level = 1;
    if (!u.unlockedExtra) u.unlockedExtra = {};
    // алфавит и вариант языка связаны: кириллица — сербский, латиница — черногорский
    u.settings.variant = u.settings.script === 'cyr' ? 'rs' : 'me';
    delete u.email; // персональные данные не храним даже локально
    return u;
  }

  const api = {
    U: null,
    todayKey, daysAgoKey,

    init(){
      loadAll();
      const id = localStorage.getItem(CUR);
      if (id && users[id]) api.U = migrate(users[id]);
    },
    users(){ return Object.values(users).sort((a, b) => b.updatedAt - a.updatedAt); },
    create(profile){ const u = blank(profile); users[u.id] = u; api.login(u.id); return u; },
    adopt(u){ users[u.id] = migrate(u); persist(); },
    login(id){ api.U = migrate(users[id]); localStorage.setItem(CUR, id); persist(); },
    logout(){ api.U = null; localStorage.removeItem(CUR); },
    save(){
      if (!api.U) return;
      api.U.updatedAt = Date.now();
      persist();
      if (window.Cloud) Cloud.push(api.U);
    },

    // ── Слияние прогресса двух устройств без потерь ──────────────────────
    // Прогресс монотонный (слова/уроки/XP только растут), поэтому берём
    // «лучшее из каждого». Результат не зависит от порядка устройств —
    // именно это лечит «как отдельные аккаунты».
    mergeProgress(a, b){
      if (!a) return b;
      if (!b) return a;
      const newer = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
      const older = newer === a ? b : a;
      const out = JSON.parse(JSON.stringify(newer)); // база — свежее (имя, настройки)
      const nz = (x, y) => Math.max(x || 0, y || 0);
      out.xp = nz(a.xp, b.xp);
      out.reviews = nz(a.reviews, b.reviews);
      out.level = Math.max(a.level || 1, b.level || 1);
      out.createdAt = Math.min(a.createdAt || Date.now(), b.createdAt || Date.now());
      out.updatedAt = nz(a.updatedAt, b.updatedAt);
      const as = a.streak || {}, bs = b.streak || {};
      out.streak = {
        count: nz(as.count, bs.count), best: nz(as.best, bs.best),
        last: (as.last || '') >= (bs.last || '') ? (as.last || null) : (bs.last || null),
        freezes: nz(as.freezes, bs.freezes),
      };
      out.words = {};
      for (const src of [a.words || {}, b.words || {}]) for (const id in src) {
        const c = out.words[id], w = src[id];
        out.words[id] = c ? {
          s: nz(c.s, w.s), seen: nz(c.seen, w.seen), ok: nz(c.ok, w.ok),
          bad: nz(c.bad, w.bad), last: nz(c.last, w.last), due: nz(c.due, w.due),
        } : Object.assign({}, w);
      }
      out.lessons = {};
      for (const src of [a.lessons || {}, b.lessons || {}]) for (const id in src) {
        const c = out.lessons[id], l = src[id];
        out.lessons[id] = c ? { stars: nz(c.stars, l.stars), times: nz(c.times, l.times), ts: nz(c.ts, l.ts) } : Object.assign({}, l);
      }
      out.history = {};
      for (const src of [a.history || {}, b.history || {}]) for (const d in src) out.history[d] = nz(out.history[d], src[d]);
      out.badges = [...new Set([...(a.badges || []), ...(b.badges || [])])].sort();
      out.unlockedExtra = Object.assign({}, a.unlockedExtra || {}, b.unlockedExtra || {});
      out.mistakes = {};
      for (const src of [a.mistakes || {}, b.mistakes || {}]) for (const id in src) {
        const c = out.mistakes[id]; out.mistakes[id] = c ? { n: nz(c.n, src[id].n), ts: nz(c.ts, src[id].ts) } : Object.assign({}, src[id]);
      }
      out.flags = Object.assign({}, a.flags || {}, b.flags || {});
      if ((a.flags && a.flags.perfect) || (b.flags && b.flags.perfect)) out.flags.perfect = true;
      out.premiumUntil = nz(a.premiumUntil, b.premiumUntil); // промо-безлимит: берём дольший
      out.settings = Object.assign({}, older.settings || {}, newer.settings || {});
      out.name = newer.name || older.name;
      return out;
    },

    xpToday(){ return (api.U && api.U.history[todayKey()]) || 0; },
    addXp(n){ const u = api.U; u.xp += n; u.history[todayKey()] = (u.history[todayKey()] || 0) + n; },

    // Ключевая метрика — выученные слова. Стрики не считаем: пропустить
    // день — нормально, давление мешает взрослым учиться.
    daysStudied(){ return Object.keys(api.U.history).length; },

    // ── Блок «Ошибки» (как в Quizlet): копится отдельно, добивается отдельно ──
    addMistake(id){
      const m = api.U.mistakes;
      const r = m[id] || (m[id] = { n: 0 });
      r.n += 1; r.ts = Date.now();
    },
    clearMistake(id){ delete api.U.mistakes[id]; },
    mistakeWords(){
      return Object.keys(api.U.mistakes).filter(id => WORDS[id])
        .sort((a, b) => api.U.mistakes[b].n - api.U.mistakes[a].n);
    },

    // ── Интервальные повторения (упрощённый SM-2) ──
    IVL: [0, 1, 2, 4, 8, 16], // дней до следующего показа, по силе слова 0–5
    wordRec(id){
      const u = api.U;
      return u.words[id] || (u.words[id] = { s: 0, seen: 0, ok: 0, bad: 0, last: 0, due: 0 });
    },
    gradeWord(id, correct){
      const r = api.wordRec(id);
      r.seen += 1; r.last = Date.now();
      if (correct) { r.ok += 1; r.s = Math.min(5, r.s + 1); }
      else { r.bad += 1; r.s = Math.max(0, r.s - 1); }
      r.due = Date.now() + api.IVL[r.s] * 864e5;
    },
    dueWords(limit){
      const u = api.U, now = Date.now();
      const ids = Object.keys(u.words).filter(id => WORDS[id] && u.words[id].seen > 0 && u.words[id].due <= now);
      ids.sort((a, b) => u.words[a].due - u.words[b].due);
      return limit ? ids.slice(0, limit) : ids;
    },
    knownWords(){
      const u = api.U;
      return Object.keys(u.words).filter(id => WORDS[id] && u.words[id].s >= 1);
    },

    completeLesson(lessonId, stars, xp, perfect){
      const u = api.U;
      const rec = u.lessons[lessonId] || (u.lessons[lessonId] = { stars: 0, times: 0 });
      rec.stars = Math.max(rec.stars, stars); rec.times += 1; rec.ts = Date.now();
      if (perfect) u.flags.perfect = true;
      api.addXp(xp);
      const badges = api.checkBadges();
      api.save();
      return { badges };
    },
    // повторение / разбор ошибок / карточки
    completeSession(xp, kind){
      const u = api.U;
      if (kind === 'review') u.reviews = (u.reviews || 0) + 1;
      api.addXp(xp);
      const badges = api.checkBadges();
      api.save();
      return { badges };
    },
    checkBadges(){
      const u = api.U, fresh = [];
      for (const b of BADGES) if (!u.badges.includes(b.id) && b.test(u)) { u.badges.push(b.id); fresh.push(b); }
      return fresh;
    },
    isUnlocked(lessonId){
      const idx = ALL_LESSONS.findIndex(l => l.id === lessonId);
      if (idx <= 0) return true;
      const lesson = ALL_LESSONS[idx];
      const lvl = (unitById(lesson.unitId) || {}).level || 1;
      const userLvl = api.U.level || 1;
      if (lvl < userLvl) return true;                  // более ранние уровни открыты целиком
      if (api.U.unlockedExtra && api.U.unlockedExtra[lessonId]) return true;
      const prev = ALL_LESSONS[idx - 1];
      const prevLvl = (unitById(prev.unitId) || {}).level || 1;
      if (prevLvl < lvl && lvl <= userLvl) return true; // первый урок «своего» уровня открыт
      return !!api.U.lessons[prev.id];
    },
    forceUnlock(lessonId){
      api.U.unlockedExtra[lessonId] = true;
      api.save();
    },
    // ── статистика для профиля ──
    totalAccuracy(){
      let ok = 0, seen = 0;
      for (const id of Object.keys(api.U.words)) { const r = api.U.words[id]; ok += r.ok; seen += r.seen; }
      return seen ? Math.round(ok / seen * 100) : null;
    },
    strongWords(){
      return Object.keys(api.U.words).filter(id => WORDS[id] && api.U.words[id].s >= 4).length;
    },
    resetProgress(){
      const u = api.U;
      const keep = { id: u.id, name: u.name, cloudId: u.cloudId, settings: u.settings, createdAt: u.createdAt };
      users[u.id] = Object.assign(blank(), keep);
      api.U = users[u.id];
      api.save();
    },
  };
  return api;
})();
