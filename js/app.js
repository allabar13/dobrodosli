"use strict";
// ── Добродошли! · экраны и логика приложения ─────────────────────────────────
const App = (() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let tab = 'path';
  let LS = null; // состояние активного урока

  // ── мелкие утилиты ──
  function V(){ return State.U.settings.variant; }
  function SC(){ return State.U.settings.script; }
  function disp2(w){ const f = formOf(w, V()); return SC() === 'cyr' ? TR.toCyr(f) : f; }
  function bare(on){ document.body.classList.toggle('bare', on); }
  function applyVariant(){ document.documentElement.dataset.variant = State.U ? V() : 'rs'; }
  function applySound(){ const on = !State.U || State.U.settings.sound !== false; AudioFX.enabled = on; TTS.enabled = on; }
  function applyTheme(){
    const pref = (State.U && State.U.settings.theme) || 'auto';
    const dark = pref === 'dark' || (pref === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  function dayWord(n){ const a = n % 10, b = n % 100; if (b >= 11 && b <= 14) return 'дней'; if (a === 1) return 'день'; if (a >= 2 && a <= 4) return 'дня'; return 'дней'; }
  function wordWord(n){ const a = n % 10, b = n % 100; if (b >= 11 && b <= 14) return 'слов'; if (a === 1) return 'слово'; if (a >= 2 && a <= 4) return 'слова'; return 'слов'; }

  function toast(html, ms = 3200){
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = html;
    $('#toasts').appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, ms);
  }
  function modal(html){
    const m = document.createElement('div');
    m.className = 'modal-back';
    m.innerHTML = `<div class="modal">${html}</div>`;
    m.onclick = e => { if (e.target === m) m.remove(); };
    document.body.appendChild(m);
    return m;
  }
  function confetti(n = 36){
    const colors = ['#ff7a3d', '#ffc53d', '#4cb944', '#2ba7c9', '#e5484d', '#9c6bff'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      p.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
      p.style.setProperty('--dx', ((Math.random() * 2 - 1) * 90) + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }
  }
  function countUp(el, to){
    const t0 = performance.now();
    (function step(t){
      const k = Math.min(1, (t - t0) / 900);
      el.textContent = '+' + Math.round(to * k);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ── старт ──
  async function boot(){
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    wireChrome();
    State.init();
    applySound();
    applyVariant();
    applyTheme();
    await Cloud.init();
    if (Cloud.active() && Cloud.user()) return enterCloudUser();
    if (State.U) return showApp();
    showGate();
  }

  async function enterCloudUser(){
    const uid = Cloud.user().id;
    const linkId = Cloud.takeLinkRequest();
    let u = State.users().find(x => x.cloudId === uid);
    let remote = null;
    try { remote = await Cloud.pull(); } catch (e) {}
    // пользователь нажал «Войти через Google» ради привязки локального профиля
    if (!u && linkId) {
      const local = State.users().find(x => x.id === linkId);
      if (local && (!remote || (local.updatedAt || 0) >= (remote.updatedAt || 0))) {
        local.cloudId = uid;
        State.login(local.id);
        State.save();
        showApp();
        toast(`☁️ Профиль привязан к Google: <b>${esc(Cloud.email() || '')}</b>`);
        return;
      }
    }
    if (remote && (!u || (remote.updatedAt || 0) > u.updatedAt)) {
      remote.cloudId = uid;
      remote.id = u ? u.id : 'c_' + uid.slice(0, 8);
      delete remote.email; // гигиена: в старых записях могла остаться почта
      State.adopt(remote);
      u = remote;
    }
    if (u) { State.login(u.id); showApp(); return; }
    const meta = (Cloud.user() && Cloud.user().user_metadata) || {};
    startOnboarding({ cloudId: uid, suggestedName: meta.given_name || meta.full_name || meta.name || '' });
  }

  async function googleSignIn(linkProfileId){
    try { await Cloud.signInWithGoogle(linkProfileId); } // дальше страница уходит на Google и вернётся обратно
    catch (e) { toast('Не открылся Google-вход: ' + esc(String((e && e.message) || e))); }
  }

  // ── стартовый экран (профили) ──
  function showGate(){
    bare(true);
    const profiles = State.users();
    $('#screen').innerHTML = `
      <div class="gate">
        <div class="gate-hero">${mascotSvg('happy', 116)}
          <h1>Добродошли!</h1>
          <p class="tagline">Сербский для жизни на Балканах.<br>Без паники. Полако.</p>
        </div>
        ${profiles.length ? `<div class="gate-list">${profiles.map(p => `
          <button class="profile-row" data-id="${p.id}">
            <span class="avatar">${esc((p.name || '?')[0].toUpperCase())}</span>
            <span class="profile-meta"><b>${esc(p.name)}</b><small>🔥 ${p.streak.count} · ⚡ ${p.xp} XP${p.cloudId ? ' · ☁️' : ''}</small></span>
            <span class="chev">›</span>
          </button>`).join('')}</div>` : ''}
        <button class="btn primary big" id="btn-new">${profiles.length ? 'Новый профиль' : 'Начать'}</button>
        ${Cloud.active() && Cloud.canOAuth()
          ? `<button class="btn ghost" id="btn-cloud"><span class="g-mark">G</span> Продолжить с Google</button>
             <p class="cloud-hint">Без паролей: вход подтверждает Google, мы храним только прогресс.</p>`
          : Cloud.configured() && !Cloud.canOAuth()
            ? `<p class="cloud-hint">Google-вход работает на опубликованном сайте, а не из локального файла.</p>`
            : `<p class="cloud-hint">Сейчас прогресс хранится в этом браузере. Google-вход появится после настройки облака — см. README.md.</p>`}
      </div>`;
    $('#btn-new').onclick = () => startOnboarding({});
    $$('.profile-row').forEach(b => b.onclick = () => { State.login(b.dataset.id); applySound(); showApp(); });
    if ($('#btn-cloud')) $('#btn-cloud').onclick = () => googleSignIn(null);
  }

  // ── онбординг / регистрация профиля ──
  function startOnboarding(seed){
    bare(true);
    const data = { script: 'lat', level: 1, goal: 20, motivation: null, name: seed.suggestedName || '', cloudId: seed.cloudId || null };
    let step = 0;
    const TOTAL = 7;

    function dots(){ return `<div class="ob-dots">${Array.from({ length: TOTAL }, (_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`; }
    function shell(inner){
      $('#screen').innerHTML = `<div class="ob">${step > 0 ? '<button class="link-back" id="ob-back">← Назад</button>' : ''}${dots()}${inner}</div>`;
      if ($('#ob-back')) $('#ob-back').onclick = () => { step--; render(); };
    }
    function cards(list){
      return `<div class="ob-cards">${list.map(o => `<button class="ob-card" data-k="${o.k}"><span class="ob-emoji">${o.emoji}</span><div><b>${o.t}</b><small>${o.d}</small></div></button>`).join('')}</div>`;
    }
    function wireCards(fn){
      $$('.ob-card').forEach(b => b.onclick = () => {
        AudioFX.tap();
        b.classList.add('sel');
        fn(b.dataset.k);
        setTimeout(() => { step++; render(); }, 180);
      });
    }
    function render(){
      if (step === 0) {
        shell(`
          <div class="gate-hero">${mascotSvg('happy', 120)}<h1>Добродо́шли!</h1>
            <p class="tagline">Это Жа́рко, адриатический галеб. Научит тебя сербскому — и, так и быть, не унесёт твой бурек.</p></div>
          <ul class="ob-list">
            <li>🎯 Короткие уроки из реальной балканской жизни</li>
            <li>📚 Считаем выученные слова, а не стрики — без давления</li>
            <li>🔁 Ошибки добиваются отдельным блоком, есть карточки</li>
            <li>🌙 Ночной режим и добрые факты о Балканах по пути</li>
          </ul>
          <button class="btn primary big" id="ob-go">Идемо! (поехали)</button>`);
        $('#ob-go').onclick = () => { step++; render(); };
      } else if (step === 1) {
        shell(`<h2>Какой алфавит?</h2><p class="muted">Язык один — сербский. Алфавит задаёт «акцент», различия покажем по ходу. Ответы принимаются любым, переключить можно в любой момент.</p>
          ${cards([
            { k:'lat', emoji:'🌊', t:'Latinica', d:'Черногорский вариант: lijepo, mlijeko, евро. Так пишут на побережье и в интернете.' },
            { k:'cyr', emoji:'Ж', t:'Ћирилица', d:'Сербский вариант: лепо, млеко, динары. Так — в документах и на табличках Белграда.' },
          ])}`);
        wireCards(k => data.script = k);
      } else if (step === 2) {
        shell(`<h2>Какой у тебя уровень?</h2><p class="muted">Не уверен(а) — бери первый, всегда честно. Выберешь выше — всё предыдущее откроется автоматически, а начнёшь со своего уровня.</p>
          ${cards(LEVELS.map(l => ({ k: String(l.n), emoji: ['🐣','☕','🌊','🧺','🏔️'][l.n - 1], t: `${l.name} · ${l.code}`, d: l.desc })))}`);
        wireCards(k => data.level = +k);
      } else if (step === 3) {
        shell(`<h2>Какой темп?</h2><p class="muted">Психологи за реалистичные цели: лучше маленькая, но каждый день.</p>
          ${cards(GOALS.map(g => ({ k: String(g.xp), emoji: g.xp === 10 ? '🐌' : g.xp === 20 ? '☕' : '🚀', t: `${g.name} · ${g.xp} XP в день`, d: g.desc })))}`);
        wireCards(k => data.goal = +k);
      } else if (step === 4) {
        shell(`<h2>Зачем тебе сербский?</h2><p class="muted">Подстроим акценты в лексике под твою цель. А когда мотивация просядет — Жарко напомнит, ради чего всё это.</p>
          ${cards([
            { k:'docs',   emoji:'📋', t:'Документы и быт', d:'Лексика выживания: МУП, аренда, банк, справки.' },
            { k:'live',   emoji:'🗣️', t:'Общение и друзья', d:'Смолток, кафана, комшии — живая разговорная база.' },
            { k:'work',   emoji:'💼', t:'Работа и клиенты', d:'Деловые слова, переписка, созвоны.' },
            { k:'travel', emoji:'✈️', t:'Путешествия по Балканам', d:'Дорога, жильё, заказ еды и «как пройти».' },
            { k:'love',   emoji:'❤️', t:'Любовь', d:'Самая быстрая методика из существующих.' },
          ])}`);
        wireCards(k => data.motivation = k);
      } else if (step === 5) {
        shell(`<h2>Поставь как приложение</h2><p class="muted">«Добродошли» живёт на экране телефона как обычное приложение — без сторов. Это необязательно: в браузере тоже всё работает.</p>
          <div class="pwa-card">
            <span class="pwa-ico"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></svg></span>
            <div><b>iPhone · Safari</b><small>Кнопка «Поделиться» внизу → «На экран “Домой”» → Добавить</small></div>
          </div>
          <div class="pwa-card">
            <span class="pwa-ico"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span>
            <div><b>Android · Chrome</b><small>Меню ⋮ справа сверху → «Добавить на главный экран»</small></div>
          </div>
          <button class="btn primary big" id="ob-pwa">Понятно, дальше</button>`);
        $('#ob-pwa').onclick = () => { step++; render(); };
      } else {
        shell(`<h2>Как тебя зовут?</h2>
          <label>Имя — для приветствий и профиля<input id="ob-name" maxlength="30" placeholder="Ана" value="${escAttr(data.name || '')}" autocomplete="off"></label>
          ${data.cloudId
            ? `<p class="muted small">☁️ Вход через Google: <b>${esc(Cloud.email() || '')}</b>. Прогресс хранится в облаке и подтянется на любом устройстве. Паролей нет, в данные прогресса почта не записывается.</p>`
            : Cloud.active() && Cloud.canOAuth()
              ? '<p class="muted small">Совет: на стартовом экране есть «Продолжить с Google» — тогда прогресс сохранится в облаке и не потеряется. Привязать Google можно и позже, в профиле.</p>'
              : '<p class="muted small">Прогресс сохраняется в этом браузере автоматически. Вход через Google появится после настройки облака (README.md).</p>'}
          <button class="btn primary big" id="ob-done">Создать профиль</button>`);
        $('#ob-name').focus();
        $('#ob-done').onclick = () => {
          const name = $('#ob-name').value.trim();
          if (!name) { $('#ob-name').classList.add('in-bad'); $('#ob-name').focus(); return; }
          data.name = name;
          finish();
        };
      }
    }
    function finish(){
      State.create({
        name: data.name, cloudId: data.cloudId, level: data.level,
        settings: { variant: data.script === 'cyr' ? 'rs' : 'me', script: data.script, goal: data.goal, sound: true, motivation: data.motivation },
      });
      State.save();
      applySound();
      showApp();
      setTimeout(() => toast(`Добро дошли, <b>${esc(data.name)}</b>! Первый урок — три минуты. Полако 🪶`, 3800), 400);
    }
    render();
  }

  // ── основное приложение ──
  function showApp(){
    bare(false);
    applyVariant();
    applyTheme();
    selectTab('path');
  }
  function selectTab(t){
    tab = t;
    renderTopbar();
    ({ path: renderPath, review: renderReview, dict: renderDict, profile: renderProfile })[t]();
    updateTabbar();
    $('#screen').scrollTop = 0;
    window.scrollTo(0, 0);
    // путь длинный (5 уровней) — открываем сразу на «ты здесь»
    if (t === 'path' && (State.U.level || 1) > 1) {
      const go = () => {
        if (tab !== 'path') return;
        const cur = document.querySelector('.level-banner.cur');
        if (cur) window.scrollTo(0, cur.getBoundingClientRect().top + window.scrollY - 56);
      };
      const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      ready.then(() => { requestAnimationFrame(go); [120, 300, 600].forEach(ms => setTimeout(go, ms)); });
    }
  }

  function renderTopbar(){
    const u = State.U, goal = u.settings.goal, today = State.xpToday();
    $('#topbar').innerHTML = `
      <div class="goal-wrap">
        <div class="goal-bar"><i style="width:${Math.min(100, Math.round(today / goal * 100))}%"></i></div>
        <small>${today}/${goal} XP сегодня${today >= goal ? ' ✓' : ''}</small>
      </div>
      <span class="chip-stat" title="слов в копилке — главная метрика">📚 ${State.knownWords().length}</span>
      <span class="chip-stat" title="всего XP">⚡ ${u.xp}</span>`;
  }

  function updateTabbar(){
    const due = State.U ? State.dueWords().length + State.mistakeWords().length : 0;
    $('#tabbar').innerHTML = [
      ['path', '🗺️', 'Путь'],
      ['review', `🧠${due ? `<i class="dot">${due}</i>` : ''}`, 'Тренировка'],
      ['dict', '📖', 'Словарь'],
      ['profile', '🐦', 'Профиль'],
    ].map(([t, ic, lb]) => `<button class="tab ${tab === t ? 'on' : ''}" data-t="${t}"><span class="tab-ic">${ic}</span><span>${lb}</span></button>`).join('');
    $$('.tab').forEach(b => b.onclick = () => selectTab(b.dataset.t));
  }

  // ── карта пути ──
  function mascotLine(){
    const u = State.U;
    if (State.xpToday() >= u.settings.goal) return 'Цель дня закрыта! Кофе — с чистой совестью.';
    if (u.settings.motivation === 'docs' && Math.random() < 0.3) return 'Боравак сам себя не продлит. Идемо!';
    if (u.settings.motivation === 'travel' && Math.random() < 0.25) return 'Следующая поездка сама себя не закажет. Учим!';
    if (u.settings.motivation === 'love' && Math.random() < 0.2) return 'Любовь любовью, а падежи по расписанию.';
    return MASCOT_LINES[Math.floor(Math.random() * MASCOT_LINES.length)];
  }
  function renderPath(){
    const u = State.U;
    const userLvl = u.level || 1;
    const curLesson = (ALL_LESSONS.find(l => State.isUnlocked(l.id) && !u.lessons[l.id]) || {}).id;
    let html = '<div class="path">';
    let idx = 0;
    for (const lvl of LEVELS) {
      const units = UNITS.filter(un => (un.level || 1) === lvl.n);
      if (!units.length) continue;
      const lessonsInLvl = units.reduce((n, un) => n + un.lessons.length, 0);
      const doneInLvl = units.reduce((n, un) => n + un.lessons.filter(l => u.lessons[l.id]).length, 0);
      const isCur = lvl.n === userLvl;
      html += `<div class="level-banner ${isCur ? 'cur' : ''}">
        <div class="lb-row"><small>УРОВЕНЬ ${lvl.n} · ${lvl.code}</small>${isCur ? '<span class="lb-tag">ты здесь</span>' : lvl.n < userLvl ? '<span class="lb-tag open">открыт</span>' : ''}</div>
        <h3>${lvl.n > userLvl ? '🔒 ' : ''}${esc(lvl.name)}</h3>
        <p>${esc(lvl.desc)}</p>
        <div class="lb-prog"><i style="width:${lessonsInLvl ? Math.round(doneInLvl / lessonsInLvl * 100) : 0}%"></i></div>
        <small class="lb-count">${doneInLvl}/${lessonsInLvl} уроков пройдено</small>
      </div>`;
      for (const unit of units) {
      const doneCount = unit.lessons.filter(l => u.lessons[l.id]).length;
      const th = THEMES[unit.theme] || { emoji: '', name: '' };
      html += `<div class="unit-banner"><span class="unit-emoji">${unit.emoji}</span><div><span class="unit-theme">${th.emoji} ${esc(th.name)}</span><h3>${esc(unit.title)}</h3><p>${esc(unit.sub)}</p></div><span class="unit-progress">${doneCount}/${unit.lessons.length}</span></div>`;
      for (const l of unit.lessons) {
        const done = !!u.lessons[l.id];
        const unlocked = State.isUnlocked(l.id);
        const current = l.id === curLesson;
        const stars = done ? u.lessons[l.id].stars : 0;
        html += `
          <div class="node-row ${idx % 2 ? 'right' : 'left'}">
            <button class="node ${done ? 'done' : unlocked ? 'open' : 'locked'}" data-l="${l.id}" aria-label="${escAttr(l.title)}">
              <span>${done ? '✓' : unlocked ? '★' : '🔒'}</span>
            </button>
            <div class="node-label">
              <b>${esc(l.title)}</b>
              ${done ? `<small class="stars-line">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</small>` : current ? '<small>сейчас</small>' : ''}
            </div>
            ${current ? `<div class="mascot-float">${mascotSvg('happy', 54)}<div class="bubble">${esc(mascotLine())}</div></div>` : ''}
          </div>`;
        idx++;
      }
      }
    }
    html += `<div class="path-end">${mascotSvg('wow', 64)}<p>Пять уровней, восемь тем, сотни слов для жизни. Скажи, чего ещё не хватает, — добавим. Полако!</p></div></div>`;
    $('#screen').innerHTML = html;
    $$('.node').forEach(b => b.onclick = () => {
      const l = lessonById(b.dataset.l);
      if (State.isUnlocked(l.id)) { startLesson(l); return; }
      // перепрыгнуть можно — но осознанно
      const m = modal(`<h3>Перепрыгнуть вперёд?</h3><p>Ты точно подумал(а)? 😏 По порядку — полако — обычно надёжнее. Но решать тебе: можно открыть этот урок прямо сейчас.</p>
        <div class="row-btns"><button class="btn ghost" id="m-ord">Вернусь по порядку</button><button class="btn primary" id="m-skip">Открыть всё равно</button></div>`);
      m.querySelector('#m-ord').onclick = () => m.remove();
      m.querySelector('#m-skip').onclick = () => { m.remove(); State.forceUnlock(l.id); startLesson(l); };
    });
  }

  // ── тренировка: повторение + ошибки + карточки ──
  function renderReview(){
    const due = State.dueWords();
    const mist = State.mistakeWords();
    const known = State.knownWords();
    const seen = Object.keys(State.U.words).filter(id => WORDS[id] && State.U.words[id].seen > 0);
    const themeChips = Object.keys(THEMES).filter(t => seen.some(id => (unitById(WORDS[id].unit) || {}).theme === t));
    $('#screen').innerHTML = `
      <div class="page">
        <h2>Тренировка</h2>
        <p class="muted">Повторения подстраиваются под память, ошибки ждут разбора, карточки — для спокойной зубрёжки. Стриков нет: пропустить день — нормально, слова дождутся.</p>

        <div class="card review-card">
          <h3>🧠 Повторение</h3>
          ${due.length ? `
            <div class="due-big">${due.length}</div>
            <p>${wordWord(due.length)} ${due.length === 1 ? 'ждёт' : 'ждут'} повторения</p>
            <div class="due-chips">${due.slice(0, 8).map(id => `<span class="chip">${esc(disp2(W(id)))}</span>`).join('')}${due.length > 8 ? `<span class="chip">+${due.length - 8}</span>` : ''}</div>
            <button class="btn primary big" id="btn-review">Повторить (+15 XP)</button>`
          : known.length === 0
            ? `${mascotSvg('happy', 72)}<p><b>Пока нечего повторять.</b><br>Пройди первый урок — слова появятся здесь сами.</p>`
            : `<p class="muted">Всё повторено! Иди пей кофе — Жарко покараулит расписание.</p>`}
        </div>

        <div class="card review-card">
          <h3>🎯 Ошибки</h3>
          ${mist.length ? `
            <p>${mist.length} ${wordWord(mist.length)} ${mist.length === 1 ? 'ждёт' : 'ждут'} разбора. Ответишь верно — слово вычёркивается из списка.</p>
            <div class="due-chips">${mist.slice(0, 8).map(id => `<span class="chip">${esc(disp2(W(id)))}</span>`).join('')}${mist.length > 8 ? `<span class="chip">+${mist.length - 8}</span>` : ''}</div>
            <button class="btn primary big" id="btn-mist">Разобрать ошибки (+10 XP)</button>`
          : `<p class="muted">Ошибок нет. Либо ты гений, либо пора на новый урок 😉</p>`}
        </div>

        <div class="card review-card">
          <h3>🃏 Карточки</h3>
          ${seen.length ? `
            <p class="muted small">Колоды — по темам. Листай и отвечай себе честно: «знаю / ещё учу».</p>
            <div class="due-chips">
              <button class="chip unit-chip" data-u="all">📚 Все мои слова</button>
              ${themeChips.map(t => `<button class="chip unit-chip" data-u="${t}">${THEMES[t].emoji} ${esc(THEMES[t].name)}</button>`).join('')}
            </div>`
          : `<p class="muted">Карточки появятся после первого урока.</p>`}
        </div>
      </div>`;
    if ($('#btn-review')) $('#btn-review').onclick = () => startLesson({ id: 'review', title: 'Повторение', wordIds: State.dueWords(10) }, 'review');
    if ($('#btn-mist')) $('#btn-mist').onclick = () => startLesson({ id: 'mistakes', title: 'Ошибки', wordIds: pickN(State.mistakeWords(), 10) }, 'mistakes');
    $$('.unit-chip').forEach(b => b.onclick = () => {
      const scope = b.dataset.u === 'all' ? seen : seen.filter(id => (unitById(WORDS[id].unit) || {}).theme === b.dataset.u);
      startLesson({ id: 'cards', title: 'Карточки', wordIds: pickN(scope, 15) }, 'cards');
    });
  }

  // ── словарь ──
  function renderDict(){
    const u = State.U;
    const ids = Object.keys(u.words).filter(id => WORDS[id] && u.words[id].seen > 0);
    let html = '<div class="page"><h2>Словарь</h2>';
    if (!ids.length) {
      html += `<div class="card empty">${mascotSvg('happy', 80)}<p>Здесь появятся выученные слова — с озвучкой и «силой» запоминания.</p></div>`;
    } else {
      html += '<input id="dict-q" class="type-in dict-q" placeholder="Поиск: kafa, кафа или кофе…">';
      for (const tid of Object.keys(THEMES)) {
        const us = ids.filter(id => (unitById(WORDS[id].unit) || {}).theme === tid);
        if (!us.length) continue;
        html += `<h4 class="dict-unit">${THEMES[tid].emoji} ${esc(THEMES[tid].name)}</h4>`;
        html += us.map(id => {
          const w = WORDS[id], r = u.words[id];
          const due = r.due <= Date.now();
          const search = (w.sr + ' ' + (w.me || '') + ' ' + TR.toCyr(w.sr) + ' ' + w.ru).toLowerCase();
          return `<div class="dict-row" data-id="${id}" data-text="${escAttr(search)}">
            <div class="dict-word"><b>${esc(disp2(w))}</b><small>${esc(w.ru)}</small>${w.note ? `<small class="dict-note">💡 ${esc(w.note)}</small>` : ''}</div>
            <div class="dict-right">${due ? '<span title="пора повторить">⏰</span>' : ''}<span class="strength">${'●'.repeat(r.s)}${'○'.repeat(5 - r.s)}</span></div>
          </div>`;
        }).join('');
      }
    }
    html += '</div>';
    $('#screen').innerHTML = html;
    $$('.dict-row').forEach(row => row.onclick = () => {
      const w = WORDS[row.dataset.id];
      TTS.speak(formOf(w, V()));
      row.classList.toggle('open');
    });
    if ($('#dict-q')) $('#dict-q').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      $$('.dict-row').forEach(r => r.style.display = !q || r.dataset.text.includes(q) ? '' : 'none');
      $$('.dict-unit').forEach(h => h.style.display = q ? 'none' : '');
    });
  }

  // ── профиль и настройки ──
  function calendarHtml(u){
    let cells = '';
    for (let i = 27; i >= 0; i--) {
      const k = State.daysAgoKey(i);
      const xp = u.history[k] || 0;
      const lvl = xp === 0 ? 0 : xp >= u.settings.goal ? 2 : 1;
      cells += `<i class="cal-cell l${lvl}" title="${k}: ${xp} XP"></i>`;
    }
    return cells;
  }
  function cloudBoxHtml(){
    if (Cloud.active() && Cloud.user() && State.U.cloudId === Cloud.user().id) {
      return `<p>☁️ Вход через Google: <b>${esc(Cloud.email() || '')}</b></p>
        <p class="muted small">Прогресс синхронизируется автоматически. Паролей нет, почта живёт только в системе входа — в данных прогресса её нет.</p>
        <button class="btn ghost" id="cl-out">Выйти из облака на этом устройстве</button>`;
    }
    if (Cloud.active() && Cloud.canOAuth()) {
      return `<p>Привяжи профиль к Google — прогресс уедет в облако и будет доступен с любого устройства.</p>
        <p class="muted small">Без паролей; в данные прогресса персональное не записывается.</p>
        <button class="btn primary" id="cl-google"><span class="g-mark">G</span> Войти через Google</button>`;
    }
    if (Cloud.configured() && !Cloud.canOAuth()) {
      return `<p class="muted">Облако настроено, но Google-вход работает только на сайте (http/https), а не из локального файла. Открой опубликованную версию.</p>`;
    }
    return `<p class="muted">Облако = вход через Google и синхронизация между устройствами. Настройка — в <b>README.md</b> (Supabase + Google). Потом вставь сюда два публичных ключа:</p>
      <label>Project URL<input id="cf-url" placeholder="https://xxxx.supabase.co"></label>
      <label>Anon (publishable) key<input id="cf-key" placeholder="eyJ… или sb_publishable_…"></label>
      <button class="btn primary" id="cf-save">Подключить облако</button>
      ${Cloud.error() ? `<p class="auth-err">${esc(Cloud.error())}</p>` : ''}`;
  }
  function renderProfile(){
    const u = State.U;
    $('#screen').innerHTML = `
      <div class="page">
        <div class="prof-head">
          <span class="avatar big">${esc((u.name || '?')[0].toUpperCase())}</span>
          <div><h2>${esc(u.name)}</h2>
          <p class="muted small">${u.cloudId && Cloud.email() ? `☁️ ${esc(Cloud.email())}` : 'локальный профиль'} · здесь с ${new Date(u.createdAt).toLocaleDateString('ru-RU')}</p></div>
        </div>
        <div class="stat-grid">
          <div class="stat-cell key"><b>📚 ${State.knownWords().length}</b><small>слов в копилке — главная метрика</small></div>
          <div class="stat-cell"><b>💪 ${State.strongWords()}</b><small>крепких слов (почти не забываются)</small></div>
          <div class="stat-cell"><b>🎯 ${State.totalAccuracy() === null ? '—' : State.totalAccuracy() + '%'}</b><small>точность ответов</small></div>
          <div class="stat-cell"><b>⚡ ${u.xp}</b><small>всего XP</small></div>
          <div class="stat-cell"><b>✅ ${Object.keys(u.lessons).length}</b><small>уроков пройдено</small></div>
          <div class="stat-cell"><b>🧠 ${u.reviews || 0}</b><small>сессий повторения</small></div>
          <div class="stat-cell"><b>📅 ${State.daysStudied()}</b><small>${dayWord(State.daysStudied())} занятий — не подряд, и это ок</small></div>
          <div class="stat-cell"><b>🪜 ${u.level || 1}/5</b><small>уровень «${esc((LEVELS[(u.level || 1) - 1] || LEVELS[0]).name)}»</small></div>
        </div>
        <p class="muted small">Здесь нет стриков и сердечек: пропустить день — нормально, ничего не сгорает. Слова дождутся, повторения перестроятся. «Полако» — это тоже методика.</p>
        <h4>Календарь занятий · 4 недели</h4>
        <div class="cal">${calendarHtml(u)}</div>
        <h4>Ачивки</h4>
        <div class="badges">${BADGES.map(b => {
          const got = u.badges.includes(b.id);
          return `<div class="badge ${got ? '' : 'off'}" title="${escAttr(b.desc)}"><span>${b.emoji}</span><small>${esc(b.name)}</small></div>`;
        }).join('')}</div>
        <h4>Настройки</h4>
        <div class="card settings">
          <div class="set-row"><span>Алфавит</span>
            <span class="seg sm"><button class="${SC() === 'lat' ? 'on' : ''}" data-s="lat">Latinica</button><button class="${SC() === 'cyr' ? 'on' : ''}" data-s="cyr">Ћирилица</button></span></div>
          <p class="muted small">Latinica — черногорский вариант (lijepo, евро, Подгорица), Ћирилица — сербский (лепо, динары, Белград). Язык и логика одни, ответы принимаются любым алфавитом. Это практически один язык — но не говори это вслух ни там, ни там 😉</p>
          <div class="set-row"><span>Тема</span>
            <span class="seg sm"><button class="${u.settings.theme === 'auto' ? 'on' : ''}" data-th="auto">Авто</button><button class="${u.settings.theme === 'light' ? 'on' : ''}" data-th="light">☀️ День</button><button class="${u.settings.theme === 'dark' ? 'on' : ''}" data-th="dark">🌙 Ночь</button></span></div>
          <div class="set-row"><span>Цель дня</span>
            <span class="seg sm">${GOALS.map(g => `<button class="${u.settings.goal === g.xp ? 'on' : ''}" data-g="${g.xp}">${g.xp}</button>`).join('')}</span></div>
          <div class="set-row"><span>Звук и озвучка</span>
            <span class="seg sm"><button class="${u.settings.sound ? 'on' : ''}" data-snd="1">Вкл</button><button class="${!u.settings.sound ? 'on' : ''}" data-snd="0">Выкл</button></span></div>
        </div>
        <h4>Облако</h4>
        <div class="card settings" id="cloud-box">${cloudBoxHtml()}</div>
        <p class="feedback-line">Есть идея или нашли ошибку? <a href="https://t.me/alla_barashchuk" target="_blank" rel="noopener">Поделиться обратной связью</a> ✈️ — Жарко и автор читают всё.</p>
        <div class="prof-actions">
          <button class="btn ghost" id="btn-switch">Сменить профиль</button>
          <button class="btn ghost danger" id="btn-reset">Сбросить прогресс</button>
        </div>
        <p class="muted small center">Добродошли! v1 · сделано с ♥ и буреком</p>
      </div>`;

    const reSet = () => { State.save(); renderTopbar(); renderProfile(); };
    $$('[data-s]').forEach(b => b.onclick = () => {
      u.settings.script = b.dataset.s;
      u.settings.variant = b.dataset.s === 'cyr' ? 'rs' : 'me'; // алфавит и вариант связаны
      applyVariant();
      reSet();
    });
    $$('[data-th]').forEach(b => b.onclick = () => { u.settings.theme = b.dataset.th; applyTheme(); reSet(); });
    $$('[data-g]').forEach(b => b.onclick = () => { u.settings.goal = +b.dataset.g; reSet(); });
    $$('[data-snd]').forEach(b => b.onclick = () => { u.settings.sound = b.dataset.snd === '1'; applySound(); reSet(); });
    $('#btn-switch').onclick = () => { State.logout(); showGate(); };
    $('#btn-reset').onclick = () => {
      const m = modal(`<h3>Сбросить прогресс?</h3><p>Слова, XP и ачивки обнулятся. Жарко сделает вид, что ничего не видел.</p>
        <div class="row-btns"><button class="btn ghost" id="m-no">Оставить</button><button class="btn danger" id="m-yes">Сбросить</button></div>`);
      m.querySelector('#m-no').onclick = () => m.remove();
      m.querySelector('#m-yes').onclick = () => { m.remove(); State.resetProgress(); toast('Начинаем с чистого листа. Полако!'); selectTab('path'); };
    };

    // облако: первичная настройка
    if ($('#cf-save')) $('#cf-save').onclick = () => {
      const url = $('#cf-url').value.trim(), key = $('#cf-key').value.trim();
      if (!/^https:\/\/.+supabase\.co$/.test(url.replace(/\/+$/, '')) || key.length < 20) { toast('Проверь URL (https://….supabase.co) и ключ.'); return; }
      Cloud.saveCfg(url, key);
      location.reload();
    };
    // облако: привязка текущего профиля через Google (вернёмся сюда после редиректа)
    if ($('#cl-google')) $('#cl-google').onclick = () => googleSignIn(State.U.id);
    if ($('#cl-out')) $('#cl-out').onclick = async () => { await Cloud.signOut(); toast('Вышли из облака на этом устройстве. Профиль и прогресс остались.'); renderProfile(); };
  }

  // ── проигрыватель урока ──
  function startLesson(lesson, kind = 'lesson'){
    const u = State.U;
    const replay = kind === 'lesson' && !!u.lessons[lesson.id];
    const queue = kind === 'lesson' ? Ex.buildLesson(lesson, V())
      : kind === 'cards' ? Ex.buildCards(lesson.wordIds)
      : Ex.buildReview(lesson.wordIds, V());
    if (!queue.length) { toast('Пока пусто — сначала пройди урок. Полако!'); return; }
    LS = { lesson, kind, replay, queue, total: queue.length, doneCount: 0, firstTry: {}, attempted: {},
           item: null, ctrl: null, awaitingNext: false, words0: State.knownWords().length, newMistakes: {} };
    $('#lesson-top').classList.remove('hidden');
    $('#lesson-bottom').classList.remove('hidden');
    $('#lesson').classList.remove('hidden');
    document.body.classList.add('lesson-open');
    nextItem();
  }
  function lessonProgress(){
    $('#lesson .lp-fill').style.width = (LS.total ? Math.round(LS.doneCount / LS.total * 100) : 0) + '%';
  }
  function nextItem(){
    if (!LS.queue.length) return finishLesson();
    const item = LS.queue.shift();
    LS.item = item;
    LS.awaitingNext = false;
    const fb = $('#lesson-fb');
    fb.className = 'lesson-fb';
    fb.innerHTML = '';
    const btn = $('#btn-check');
    const scored = !(item.type === 'new' || item.type === 'tip');
    btn.textContent = scored ? 'Проверить' : 'Дальше';
    btn.disabled = scored;
    btn.style.display = item.type === 'flash' ? 'none' : '';
    const ctx = {
      area: $('#ex-area'),
      variant: V(), script: SC(),
      speak: (t, r) => TTS.speak(t, r),
      onReady: ok => { if (!LS.awaitingNext) btn.disabled = scored ? !ok : false; },
      onAutoDone: res => handleResult(res),
    };
    LS.ctrl = Ex.render(item, ctx);
    if (LS.ctrl.auto) btn.disabled = true;
    lessonProgress();
  }
  function handleResult(res){
    const item = LS.item, ctrl = LS.ctrl;

    // карточки: самооценка, мгновенный переход без плашки
    if (res.instant) {
      LS.attempted[item.uid] = true;
      LS.firstTry[item.uid] = !!res.ok;
      for (const id of (ctrl.wordIds || [])) {
        State.gradeWord(id, !!res.ok);
        if (res.ok) State.clearMistake(id);
      }
      State.save();
      AudioFX.tap();
      LS.doneCount++;
      lessonProgress();
      nextItem();
      return;
    }

    LS.awaitingNext = true;
    if (!LS.attempted[item.uid]) {
      LS.attempted[item.uid] = true;
      LS.firstTry[item.uid] = !!res.ok;
      const misses = res.misses || null;
      for (const id of (ctrl.wordIds || [])) {
        const okWord = misses ? !misses[id] : !!res.ok;
        State.gradeWord(id, okWord);
        if (okWord) State.clearMistake(id);
        else { State.addMistake(id); LS.newMistakes[id] = true; }
      }
    }
    const fb = $('#lesson-fb'), btn = $('#btn-check');
    const hasWords = (ctrl.wordIds || []).length > 0;
    if (res.ok) {
      AudioFX.correct();
      fb.className = 'lesson-fb show ok';
      fb.innerHTML = `<b>${['Тако је!', 'Браво!', 'Свака част!', 'Одлично!'][Math.floor(Math.random() * 4)]}</b>
        ${res.soft ? `<p>Почти идеально — следи за «галочками»: <b>${esc(res.correct)}</b></p>` : ''}
        ${res.fb ? `<p>${esc(res.fb)}</p>` : ''}
        ${LS.kind === 'mistakes' && hasWords ? '<p class="fb-again">✓ Вычеркнуто из «Ошибок»</p>' : ''}`;
    } else {
      AudioFX.wrong();
      fb.className = 'lesson-fb show bad';
      fb.innerHTML = ctrl.auto
        ? `<b>Собрано — но с промахами.</b>
        <p>${OOPS[Math.floor(Math.random() * OOPS.length)]}</p>
        <p class="fb-again">→ Промахнувшиеся слова упали в блок «Ошибки»</p>`
        : `<b>Правильный ответ:</b><p class="fb-ans">${esc(res.correct)}</p>
        ${res.fb ? `<p>${esc(res.fb)}</p>` : `<p>${OOPS[Math.floor(Math.random() * OOPS.length)]}</p>`}
        ${hasWords && LS.kind !== 'mistakes' ? '<p class="fb-again">→ Слово упало в блок «Ошибки» — добьёшь, когда удобно</p>' : ''}`;
      $('#ex-area').classList.add('shake');
      setTimeout(() => $('#ex-area').classList.remove('shake'), 450);
    }
    LS.doneCount++;
    btn.disabled = false;
    btn.textContent = 'Дальше';
    lessonProgress();
  }
  function finishLesson(){
    const uids = Object.keys(LS.firstTry);
    const okCount = uids.filter(k => LS.firstTry[k]).length;
    const acc = uids.length ? okCount / uids.length : 1;
    const stars = acc >= 0.95 ? 3 : acc >= 0.75 ? 2 : 1;
    const perfect = uids.length > 0 && okCount === uids.length;
    const kind = LS.kind;
    let xp, result;
    if (kind === 'lesson') { xp = (LS.replay ? 10 : 20) + (perfect ? 5 : 0); result = State.completeLesson(LS.lesson.id, stars, xp, perfect); }
    else { xp = kind === 'review' ? 15 : 10; result = State.completeSession(xp, kind); }
    AudioFX.win();
    confetti();
    const total = State.knownWords().length;
    const delta = total - LS.words0;
    const newMist = Object.keys(LS.newMistakes).length;
    const title = kind === 'lesson' ? 'Урок пройден!'
      : kind === 'review' ? 'Повторение — мать учения'
      : kind === 'mistakes' ? 'Ошибки добиты!'
      : 'Колода пройдена!';
    $('#lesson-top').classList.add('hidden');
    $('#lesson-bottom').classList.add('hidden');
    $('#ex-area').innerHTML = `
      <div class="finish pop-in">
        ${mascotSvg('wow', 110)}
        <h2>${title}</h2>
        ${kind === 'lesson' ? `<div class="finish-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>` : ''}
        <div class="finish-stats">
          <div class="fstat"><b id="fxp">+0</b><small>XP</small></div>
          <div class="fstat"><b>${kind === 'cards' ? `${okCount}/${uids.length}` : Math.round(acc * 100) + '%'}</b><small>${kind === 'cards' ? 'знаю' : 'точность'}</small></div>
        </div>
        <p class="finish-streak">📚 ${total} ${wordWord(total)} в копилке${delta > 0 ? ` <b>(+${delta} ${delta === 1 ? 'новое' : 'новых'})</b>` : ''}</p>
        ${newMist ? `<p class="finish-mist">🎯 ${newMist} ${wordWord(newMist)} — в блоке «Ошибки». Добьём без спешки.</p>` : ''}
        ${perfect && kind === 'lesson' ? '<p class="finish-perfect">💎 Без единой ошибки!</p>' : ''}
        <p class="finish-praise">${esc(PRAISE[Math.floor(Math.random() * PRAISE.length)])}</p>
        <button class="btn primary big" id="btn-finish">Дальше</button>
      </div>`;
    countUp($('#fxp'), xp);
    $('#btn-finish').onclick = () => {
      const badges = result.badges || [];
      closeLesson();
      badges.forEach((b, i) => setTimeout(() => toast(`🏅 Новая ачивка: <b>${b.emoji} ${esc(b.name)}</b><br><small>${esc(b.desc)}</small>`, 4200), 350 + i * 700));
    };
  }
  function closeLesson(){
    LS = null;
    $('#lesson').classList.add('hidden');
    document.body.classList.remove('lesson-open');
    selectTab(tab);
  }

  // ── постоянные элементы (кнопка проверки, выход, клавиатура) ──
  function wireChrome(){
    $('#btn-check').onclick = () => {
      if (!LS || $('#lesson-bottom').classList.contains('hidden')) return;
      if (LS.awaitingNext) { AudioFX.tap(); nextItem(); return; }
      const ctrl = LS.ctrl;
      if (!ctrl.scored) { LS.doneCount++; AudioFX.tap(); nextItem(); return; }
      if (ctrl.auto) return;
      handleResult(ctrl.check());
    };
    $('#lesson-quit').onclick = () => {
      if (!LS) { closeLesson(); return; }
      const m = modal(`<h3>Выйти?</h3><p>Выученные слова уже сохранены — незаконченная сессия просто не засчитается. Жарко переживёт.</p>
        <div class="row-btns"><button class="btn ghost" id="m-stay">Остаться</button><button class="btn danger" id="m-quit">Выйти</button></div>`);
      m.querySelector('#m-stay').onclick = () => m.remove();
      m.querySelector('#m-quit').onclick = () => { m.remove(); closeLesson(); };
    };
    document.addEventListener('keydown', e => {
      if (!LS || $('#lesson').classList.contains('hidden')) return;
      if (e.key === 'Enter') {
        const fin = $('#btn-finish');
        if (fin) { e.preventDefault(); fin.click(); return; }
        const b = $('#btn-check');
        if (!b.disabled) { e.preventDefault(); b.click(); }
        return;
      }
      if (/^[1-4]$/.test(e.key) && !LS.awaitingNext && document.activeElement.tagName !== 'INPUT') {
        const opt = $(`#ex-area .opt[data-i="${+e.key - 1}"]`);
        if (opt && !opt.disabled) opt.click();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', boot);

  return {
    boot, startLesson, selectTab,
    get LS(){ return LS; },
    // для отладки: мгновенно завершить активный урок
    debugWin(){ if (LS) { LS.queue = []; finishLesson(); } },
  };
})();
window.App = App;
