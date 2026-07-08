"use strict";
// ── Сборка уроков и отрисовка упражнений ─────────────────────────────────
// Методики внутри:
//  • активное припоминание — слово сразу проверяется, а не просто показывается;
//  • чередование форматов (interleaving) — мозгу не дают заскучать;
//  • немедленная обратная связь с правильным ответом;
//  • ошибки копятся в отдельный блок (как в Quizlet) и добиваются там;
//  • карточки — спокойная самопроверка «знаю / ещё учу».
const Ex = (() => {

  function disp(text, script){ return script === 'cyr' ? TR.toCyr(text) : text; }
  function unitWordObjs(unitId){ return Object.values(WORDS).filter(w => w.unit === unitId); }

  function distractRu(word, n){
    const pool = shuf(unitWordObjs(word.unit).filter(x => x.id !== word.id)).map(x => x.ru);
    const extra = shuf(Object.values(WORDS).filter(x => x.unit !== word.unit)).map(x => x.ru);
    return uniq(pool.concat(extra)).filter(t => t !== word.ru).slice(0, n);
  }
  function distractSr(word, n, variant){
    const form = formOf(word, variant);
    const pool = shuf(unitWordObjs(word.unit).filter(x => x.id !== word.id)).map(x => formOf(x, variant));
    const extra = shuf(Object.values(WORDS).filter(x => x.unit !== word.unit)).map(x => formOf(x, variant));
    return uniq(pool.concat(extra)).filter(t => t !== form).slice(0, n);
  }
  function typeable(w, variant){
    const f = formOf(w, variant);
    return f.length <= 9 && !f.includes('?') && !f.includes('…');
  }
  function speakBtn(text){ return `<button class="spk" data-say="${escAttr(text)}" title="${t('Озвучить')}">🔊</button>`; }
  // «слово — перевод» для сербской формы (глоссы в разборе ответа)
  function glossSr(text, ctx){
    const w = Object.values(WORDS).find(x => TR.norm(x.sr) === TR.norm(text) || (x.me && TR.norm(x.me) === TR.norm(text)));
    return w ? `${disp(text, ctx.script)} — ${w.ru}` : disp(text, ctx.script);
  }
  function wireSpeak(ctx){
    ctx.area.querySelectorAll('.spk').forEach(b => b.onclick = e => { e.stopPropagation(); ctx.speak(b.dataset.say); });
  }
  function wireOpts(item, ctx){
    ctx.area.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      ctx.area.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      item._sel = +b.dataset.i;
      AudioFX.tap();
      ctx.onReady(true);
    });
  }
  function markOpts(ctx, correctIdx, selIdx){
    ctx.area.querySelectorAll('.opt').forEach(b => {
      const i = +b.dataset.i;
      b.disabled = true;
      if (i === correctIdx) b.classList.add('right');
      else if (i === selIdx) b.classList.add('wrong');
    });
  }

  // ── Сборка очереди урока ──
  // Урок держим коротким (~на треть короче первой версии): мгновенная
  // проверка — для 60% слов, остальные добирают пары и две выборочные
  // проверки сейчас, а SRS-повторения — завтра. Предложений — максимум три,
  // лишние форматы не дублируем: длинные уроки роняют дочитываемость.
  function buildLesson(lesson, variant){
    const items = [];
    const words = lesson.words.map(W);
    const checked = new Set(pickN(words, Math.ceil(words.length * 0.6)).map(w => w.id));
    for (const w of words) {
      items.push({ type: 'new', w });
      if (checked.has(w.id)) items.push({ type: 'mcq', w });
    }
    const extras = [];
    if (words.length >= 4) extras.push({ type: 'pairs', words: pickN(words, 5) });
    // две активные проверки в случайном формате — в приоритете слова без мгновенной
    const unchecked = words.filter(w => !checked.has(w.id));
    for (const w of pickN(unchecked.length >= 2 ? unchecked : words, 2)) {
      const kinds = ['rmcq'];
      if (typeable(w, variant)) kinds.push('type');
      if (TTS.has()) kinds.push('listen');
      extras.push({ type: kinds[Math.floor(Math.random() * kinds.length)], w });
    }
    for (const g of (lesson.grammar || [])) extras.push({ type: 'fill', g });
    for (const s of pickN(lesson.sentences || [], 3)) extras.push({ type: 'bank', s });

    const queue = items.concat(shuf(extras));
    if (lesson.situation) queue.push({ type: 'sit', sit: lesson.situation });
    if (lesson.tip) queue.splice(Math.min(4, queue.length), 0, { type: 'tip', tip: lesson.tip });
    // добрый факт о Балканах — передышка ближе к концу урока
    const f = FACTS[Math.floor(Math.random() * FACTS.length)];
    queue.splice(Math.max(5, Math.floor(queue.length * 0.7)), 0, { type: 'tip', kicker: 'Балканский факт 🪶', tip: { title: f.t, text: f.x } });
    queue.forEach((it, i) => { it.uid = i; it.retries = 0; });
    return queue;
  }

  // ── Сборка сессии повторения ──
  function buildReview(wordIds, variant){
    const items = [];
    for (const id of wordIds) {
      const w = W(id);
      if (!w) continue;
      const kinds = ['mcq', 'rmcq'];
      if (typeable(w, variant)) kinds.push('type');
      if (TTS.has()) kinds.push('listen');
      items.push({ type: kinds[Math.floor(Math.random() * kinds.length)], w });
    }
    const queue = shuf(items);
    if (wordIds.length >= 4) queue.push({ type: 'pairs', words: pickN(wordIds.map(W).filter(Boolean), 5) });
    queue.forEach((it, i) => { it.uid = i; it.retries = 0; });
    return queue;
  }

  // ── Сборка колоды карточек ──
  function buildCards(wordIds){
    const queue = shuf(wordIds.map(W).filter(Boolean)).map(w => ({ type: 'flash', w }));
    queue.forEach((it, i) => { it.uid = i; it.retries = 0; });
    return queue;
  }

  // ── Отрисовщики ──
  function rNew(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const other = ctx.script === 'cyr' ? form : TR.toCyr(form);
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Новое слово')}</p>
      <div class="card word-card pop-in">
        <div class="word-main">${esc(disp(form, ctx.script))} ${speakBtn(form)}</div>
        <div class="word-alt">${esc(other)}</div>
        <div class="word-ru">${esc(w.ru)}</div>
        ${w.note ? `<div class="word-note">💡 ${esc(w.note)}</div>` : ''}
      </div>`;
    wireSpeak(ctx);
    setTimeout(() => ctx.speak(form), 350);
    ctx.onReady(true);
    return { scored: false };
  }

  function rTip(item, ctx){
    ctx.area.innerHTML = `
      <p class="ex-kicker">${esc(item.kicker ? t(item.kicker) : t('Жарко советует'))}</p>
      <div class="card tip-card pop-in">
        <div class="tip-mascot">${mascotSvg('happy', 64)}</div>
        <h3>${esc(item.tip.title)}</h3>
        <p>${esc(item.tip.text)}</p>
      </div>`;
    ctx.onReady(true);
    return { scored: false };
  }

  function rMcq(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const opts = shuf([w.ru].concat(distractRu(w, 3)));
    item._correct = opts.indexOf(w.ru);
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Что значит это слово?')}</p>
      <div class="big-term">${esc(disp(form, ctx.script))} ${speakBtn(form)}</div>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-key">${i + 1}</span>${esc(o)}</button>`).join('')}</div>`;
    wireSpeak(ctx); wireOpts(item, ctx);
    setTimeout(() => ctx.speak(form), 250);
    return {
      scored: true, wordIds: [w.id],
      check(){
        const ok = item._sel === item._correct;
        markOpts(ctx, item._correct, item._sel);
        // при ошибке поясняем и выбранный вариант: «а „маленькое“ — это maleno»
        let gloss = '';
        if (!ok) {
          const chosen = opts[item._sel];
          const src = Object.values(WORDS).find(x => x.ru === chosen);
          if (src) gloss = I18N.lang === 'en'
            ? `and “${chosen}” is ${disp(formOf(src, ctx.variant), ctx.script)}`
            : `а «${chosen}» — это ${disp(formOf(src, ctx.variant), ctx.script)}`;
        }
        return { ok, correct: `${disp(form, ctx.script)} — ${w.ru}`, gloss };
      },
    };
  }

  function rRmcq(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const opts = shuf([form].concat(distractSr(w, 3, ctx.variant)));
    item._correct = opts.indexOf(form);
    const lang = ctx.variant === 'me' ? 'me' : 'sr';
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t(lang === 'me' ? 'Как сказать по-черногорски?' : 'Как сказать по-сербски?')}</p>
      <div class="big-term">${esc(w.ru)}</div>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-key">${i + 1}</span>${esc(disp(o, ctx.script))}</button>`).join('')}</div>`;
    wireOpts(item, ctx);
    return {
      scored: true, wordIds: [w.id],
      check(){
        const ok = item._sel === item._correct;
        markOpts(ctx, item._correct, item._sel);
        if (ok) ctx.speak(form);
        return { ok, correct: `${disp(form, ctx.script)} — ${w.ru}`,
                 gloss: ok ? '' : glossSr(opts[item._sel], ctx) };
      },
    };
  }

  function rType(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const lang = ctx.variant === 'me' ? 'me' : 'sr';
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t(lang === 'me' ? 'Напиши по-черногорски' : 'Напиши по-сербски')}</p>
      <div class="big-term">${esc(w.ru)}</div>
      <input id="type-in" class="type-in" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${t('латиницей или кириллицей')}">
      <div class="char-row">${['č','ć','š','ž','đ'].map(c => `<button class="chip char-chip" data-c="${c}">${c}</button>`).join('')}</div>`;
    const inp = ctx.area.querySelector('#type-in');
    inp.addEventListener('input', () => ctx.onReady(inp.value.trim().length > 0));
    ctx.area.querySelectorAll('.char-chip').forEach(b => b.onclick = () => {
      const st = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? inp.value.length;
      inp.setRangeText(b.dataset.c, st, en, 'end');
      inp.focus();
      ctx.onReady(inp.value.trim().length > 0);
    });
    setTimeout(() => inp.focus(), 120);
    return {
      scored: true, wordIds: [w.id],
      check(){
        const res = TR.check(inp.value, [w.sr, w.me].filter(Boolean));
        inp.disabled = true;
        inp.classList.add(res.ok ? 'in-ok' : 'in-bad');
        if (res.ok) ctx.speak(form);
        return { ok: res.ok, soft: res.soft, correct: disp(form, ctx.script) };
      },
    };
  }

  function rListen(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const opts = shuf([form].concat(distractSr(w, 3, ctx.variant)));
    item._correct = opts.indexOf(form);
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Что ты слышишь?')}</p>
      <div class="listen-wrap">
        <button class="listen-big" id="play-big" title="Послушать">🔊</button>
        <button class="listen-slow" id="play-slow" title="${t('Помедленнее')}">🐢</button>
      </div>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-key">${i + 1}</span>${esc(disp(o, ctx.script))}</button>`).join('')}</div>`;
    ctx.area.querySelector('#play-big').onclick = () => ctx.speak(form);
    ctx.area.querySelector('#play-slow').onclick = () => ctx.speak(form, 0.6);
    wireOpts(item, ctx);
    setTimeout(() => ctx.speak(form), 300);
    return {
      scored: true, wordIds: [w.id],
      check(){
        const ok = item._sel === item._correct;
        markOpts(ctx, item._correct, item._sel);
        // перевод показываем всегда: и в «Тако је!», и в разборе ошибки
        return { ok, correct: `${disp(form, ctx.script)} — ${w.ru}`,
                 fb: ok ? `${disp(form, ctx.script)} — ${w.ru}` : '',
                 gloss: ok ? '' : glossSr(opts[item._sel], ctx) };
      },
    };
  }

  function rFill(item, ctx){
    const g = item.g;
    const opts = shuf(g.opts.slice());
    item._correct = opts.indexOf(g.a);
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Вставь нужную форму')}</p>
      <div class="big-term fill-q">${esc(disp(g.q, ctx.script)).replace('___', '<span class="blank" id="blank">___</span>')}</div>
      <p class="fill-hint">${esc(g.hint)}</p>
      <div class="opts opts-row">${opts.map((o, i) => `<button class="opt opt-sm" data-i="${i}">${esc(disp(o, ctx.script))}</button>`).join('')}</div>`;
    ctx.area.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      ctx.area.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      item._sel = +b.dataset.i;
      ctx.area.querySelector('#blank').textContent = opts[item._sel];
      AudioFX.tap();
      ctx.onReady(true);
    });
    return {
      scored: true, wordIds: [],
      check(){
        const ok = item._sel === item._correct;
        markOpts(ctx, item._correct, item._sel);
        const full = g.q.replace('___', g.a);
        if (ok) ctx.speak(full);
        return { ok, correct: disp(full, ctx.script) };
      },
    };
  }

  function rBank(item, ctx){
    const s = item.s;
    const target = (ctx.variant === 'me' && s.me) ? s.me : s.sr;
    const ru = (ctx.variant === 'me' && s.ruMe) ? s.ruMe : s.ru;
    const chipsBase = target.replace(/[.,!?;:]/g, '').split(/\s+/).filter(Boolean);
    const extras = pickN(
      Object.values(WORDS)
        .map(w => formOf(w, ctx.variant))
        .filter(f => !f.includes(' ') && !f.includes('?') && !chipsBase.some(c => TR.norm(c) === TR.norm(f))),
      2
    );
    const chips = shuf(chipsBase.concat(extras)).map((t, i) => ({ t, i }));
    item._answer = [];
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Собери перевод')}</p>
      <div class="big-term bank-ru">${esc(ru)} ${speakBtn(target)}</div>
      <div class="bank-answer" id="bank-answer"></div>
      <div class="bank-pool" id="bank-pool">${chips.map(c => `<button class="chip bank-chip" data-i="${c.i}">${esc(disp(c.t, ctx.script))}</button>`).join('')}</div>`;
    wireSpeak(ctx);
    const ansEl = ctx.area.querySelector('#bank-answer');
    const poolEl = ctx.area.querySelector('#bank-pool');
    function sync(){
      ansEl.innerHTML = item._answer.length
        ? item._answer.map((ci, pos) => `<button class="chip bank-chip in-ans" data-pos="${pos}">${esc(disp(chips.find(c => c.i === ci).t, ctx.script))}</button>`).join('')
        : `<span class="bank-placeholder">${t('нажимай на слова ниже ↓')}</span>`;
      ansEl.querySelectorAll('.in-ans').forEach(b => b.onclick = () => {
        const ci = item._answer.splice(+b.dataset.pos, 1)[0];
        poolEl.querySelector(`[data-i="${ci}"]`).classList.remove('used');
        AudioFX.tap();
        sync();
      });
      ctx.onReady(item._answer.length > 0);
    }
    poolEl.querySelectorAll('.bank-chip').forEach(b => b.onclick = () => {
      if (b.classList.contains('used')) return;
      b.classList.add('used');
      item._answer.push(+b.dataset.i);
      AudioFX.tap();
      sync();
    });
    sync();
    // слова курса, встречающиеся в предложении, получают зачёт в SRS
    const ids = chipsBase
      .map(c => Object.values(WORDS).find(w => TR.norm(w.sr) === TR.norm(c) || (w.me && TR.norm(w.me) === TR.norm(c))))
      .filter(Boolean).map(w => w.id);
    return {
      scored: true, wordIds: uniq(ids),
      check(){
        const gotWords = item._answer.map(ci => chips.find(c => c.i === ci).t);
        const got = gotWords.map(w => TR.norm(w)).join(' ');
        const ok = got === TR.norm(target);
        if (ok) ctx.speak(target);
        // при ошибке — глоссы пропущенных и лишних слов: «pumpa — заправка»
        let gloss = '';
        if (!ok) {
          const missing = chipsBase.filter(w => !gotWords.some(g => TR.norm(g) === TR.norm(w)));
          const extraW = gotWords.filter(g => !chipsBase.some(w => TR.norm(w) === TR.norm(g)));
          const seen = new Set();
          const parts = [];
          for (const token of extraW.concat(missing)) {
            const k = TR.norm(token);
            if (seen.has(k) || parts.length >= 4) continue;
            seen.add(k);
            parts.push(glossSr(token, ctx));
          }
          gloss = parts.join(' · ');
        }
        return { ok, correct: disp(target, ctx.script), fb: s.fb, gloss };
      },
    };
  }

  function rPairs(item, ctx){
    const ws = item.words;
    const left = shuf(ws.map(w => ({ id: w.id, t: disp(formOf(w, ctx.variant), ctx.script) })));
    const right = shuf(ws.map(w => ({ id: w.id, t: w.ru })));
    item._miss = {};
    let selL = null, selR = null, done = 0;
    // одна grid-сетка с явными рядами: карточки пары всегда строго напротив
    // и одинаковой высоты, даже если текст в одной из них длиннее
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Соедини пары')}</p>
      <div class="pairs">
        ${left.map((c, i) => `<button class="opt pair" data-side="l" data-id="${escAttr(c.id)}" style="grid-row:${i + 1};grid-column:1;">${esc(c.t)}</button>`).join('')}
        ${right.map((c, i) => `<button class="opt pair" data-side="r" data-id="${escAttr(c.id)}" style="grid-row:${i + 1};grid-column:2;">${esc(c.t)}</button>`).join('')}
      </div>`;
    function pickBtn(btn){
      if (btn.classList.contains('done')) return;
      const side = btn.dataset.side;
      const cur = side === 'l' ? selL : selR;
      if (cur) cur.classList.remove('sel');
      if (side === 'l') selL = btn; else selR = btn;
      btn.classList.add('sel');
      AudioFX.tap();
      if (selL && selR) {
        if (selL.dataset.id === selR.dataset.id) {
          selL.classList.remove('sel'); selR.classList.remove('sel');
          selL.classList.add('done'); selR.classList.add('done');
          const w = W(selL.dataset.id);
          if (w) ctx.speak(formOf(w, ctx.variant));
          done++; selL = selR = null;
          if (done === ws.length) {
            const ok = Object.keys(item._miss).length === 0;
            setTimeout(() => ctx.onAutoDone({ ok, misses: item._miss, correct: t('Все пары собраны') }), 380);
          }
        } else {
          item._miss[selL.dataset.id] = true;
          item._miss[selR.dataset.id] = true;
          selL.classList.add('bad'); selR.classList.add('bad');
          AudioFX.wrong();
          const a = selL, b = selR;
          selL = selR = null;
          setTimeout(() => { a.classList.remove('sel', 'bad'); b.classList.remove('sel', 'bad'); }, 450);
        }
      }
    }
    ctx.area.querySelectorAll('.pair').forEach(b => b.onclick = () => pickBtn(b));
    return { scored: true, auto: true, wordIds: ws.map(w => w.id) };
  }

  function rSit(item, ctx){
    const sit = item.sit;
    const order = shuf(sit.opts.map((_, i) => i));
    item._order = order;
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Жизненная ситуация 🎬')}</p>
      <div class="card sit-q">${esc(sit.q)}</div>
      <div class="opts">${order.map((oi, i) => `<button class="opt" data-i="${i}">${esc(sit.opts[oi].t)}</button>`).join('')}</div>`;
    wireOpts(item, ctx);
    return {
      scored: true, wordIds: [],
      check(){
        const chosen = order[item._sel];
        const ok = chosen === sit.ai;
        ctx.area.querySelectorAll('.opt').forEach((b) => {
          const i = +b.dataset.i;
          b.disabled = true;
          if (order[i] === sit.ai) b.classList.add('right');
          else if (i === item._sel) b.classList.add('wrong');
        });
        return { ok, correct: sit.opts[sit.ai].t, fb: sit.opts[chosen].why };
      },
    };
  }

  // карточка-флешка: переворот + самооценка «знаю / ещё учу»
  function rFlash(item, ctx){
    const w = item.w, form = formOf(w, ctx.variant);
    const other = ctx.script === 'cyr' ? form : TR.toCyr(form);
    ctx.area.innerHTML = `
      <p class="ex-kicker">${t('Карточка · вспомни перевод, потом переверни')}</p>
      <div class="flash-wrap"><div class="flash" id="flash">
        <div class="flash-face front">
          <div class="word-main">${esc(disp(form, ctx.script))} ${TTS.has() ? speakBtn(form) : ''}</div>
          <div class="word-alt">${esc(other)}</div>
          <span class="flash-hint">${t('нажми, чтобы перевернуть')}</span>
        </div>
        <div class="flash-face back">
          <div class="word-ru">${esc(w.ru)}</div>
          ${w.note ? `<div class="word-note">💡 ${esc(w.note)}</div>` : ''}
          <span class="flash-hint">${t('ну что, знал(а)?')}</span>
        </div>
      </div></div>
      <div class="flash-btns">
        <button class="btn ghost" id="fl-no">${t('🌀 Ещё учу')}</button>
        <button class="btn primary" id="fl-yes">${t('Знаю ✓')}</button>
      </div>`;
    const card = ctx.area.querySelector('#flash');
    card.onclick = e => {
      if (e.target.closest('.spk')) return;
      card.classList.toggle('flipped');
      AudioFX.tap();
    };
    wireSpeak(ctx);
    setTimeout(() => ctx.speak(form), 300);
    ctx.area.querySelector('#fl-yes').onclick = () => ctx.onAutoDone({ ok: true, instant: true });
    ctx.area.querySelector('#fl-no').onclick = () => ctx.onAutoDone({ ok: false, instant: true });
    return { scored: true, auto: true, instant: true, wordIds: [w.id] };
  }

  const R = { new: rNew, tip: rTip, mcq: rMcq, rmcq: rRmcq, type: rType, listen: rListen, fill: rFill, bank: rBank, pairs: rPairs, sit: rSit, flash: rFlash };
  function render(item, ctx){ return R[item.type](item, ctx); }

  return { buildLesson, buildReview, buildCards, render };
})();
