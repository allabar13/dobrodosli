"use strict";
// ── Монетизация веб-версии (решения 2026-11-02) ───────────────────────────
// Зеркало iOS-слоя (ios-premium.js), но без StoreKit:
// • Бесплатно: 10 минут активных занятий в день; первый день — без лимита.
// • Лимит ВКЛЮЧАЕТСЯ только когда заполнена ссылка на оплату (TRIBUTE.lifetime):
//   пока продавать нечего — веб безлимитный и пейволл не показывается.
// • «Безлимит навсегда» продаётся как промокод: оплата в Tribute («товар на
//   заказ»), покупатель получает код в ответ на заказ и вводит его в профиле.
// • Код пишет State.U.premiumUntil — поле уезжает в облако (mergeProgress
//   берёт больший срок), поэтому безлимит восстанавливается входом в облако
//   на любом устройстве, включая iOS-приложение.
// В iOS-сборку этот файл НЕ попадает (sync-web.sh удаляет его и тег скрипта):
// Apple запрещает упоминать внешнюю оплату внутри приложения (гайдлайн 3.1.1).
(() => {
  // WKWebView: нативный мост существует с первого байта — в iOS слой молчит
  // (страховка на случай, если файл всё же окажется в бандле)
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.ios) return;

  // ── ссылки Tribute: заполнить после регистрации (пусто — кнопка скрыта) ──
  const TRIBUTE = {
    donate: 'https://web.tribute.tg/d/TpO', // страница доната (любая сумма)
    // товар «Безлимит навсегда» (промокод в ответ на заказ, верифицирован 2026-11-02)
    lifetime: 'https://t.me/tribute/app?startapp=pJ1K',
    lifetimePrice: '', // цена для кнопки, например '9,99 €' (пусто — без цены)
  };
  const LIMIT_ON = !!TRIBUTE.lifetime; // продавать нечего — лимит не включаем

  // переводы веб-монетизации живут здесь, а не в i18n.js: этот файл не попадает
  // в iOS-бандл, и упоминаний внешней оплаты в приложении нет вовсе (Apple 3.1.1)
  Object.assign(I18N.UI, {
    'Бесплатные 10 минут на сегодня закончились. Хочешь без пауз — безлимит навсегда: после оплаты пришлём промокод, введёшь его здесь, и никаких ограничений.': 'Your free 10 minutes for today are up. Want no pauses — lifetime unlimited: after payment we’ll send you a promo code, you enter it here, and that’s it, no limits.',
    'Купить безлимит навсегда': 'Buy lifetime unlimited',
    'Оплата откроется в новой вкладке (сервис Tribute). После оплаты мы отправим промокод — введи его в профиле, и безлимит включится навсегда.': 'Payment opens in a new tab (Tribute). After payment we’ll send you a promo code — enter it in your profile and unlimited stays on forever.',
    'Открыть оплату': 'Open payment',
    'Ввести промокод': 'Enter promo code',
    'Уже покупал(а)? Войди в облако в профиле — безлимит вернётся сам.': 'Already bought it? Sign in to the cloud in your profile — unlimited comes back on its own.',
    'Совет: войди в облако в профиле — безлимит привяжется к аккаунту и не потеряется при чистке браузера.': 'Tip: sign in to the cloud in your profile — unlimited links to your account and won’t get lost if browser data is cleared.',
    '☕ Поддержать донатом': '☕ Support with a donation',
  });

  const FREE_SEC = 600;   // 10 минут бесплатных занятий в день (как в iOS)
  const BONUS_SEC = 300;  // +5 за шаринг (раз в день, только где есть navigator.share)
  const FOREVER_SPAN = 3650 * 864e5; // срок дальше 10 лет считаем «навсегда»
  // русская типографика: тире не должно оказываться в начале строки
  const typo = (s) => String(s).replace(/ — /g, ' — ');

  const day = () => new Date().toLocaleDateString('sv-SE');
  const usedKey = () => 'web_used_' + day();
  const bonusKey = () => 'web_bonus_' + day();
  const used = () => +(localStorage.getItem(usedKey()) || 0);
  const bonus = () => +(localStorage.getItem(bonusKey()) || 0);
  const left = () => Math.max(0, FREE_SEC + bonus() - used());
  // первый день после регистрации — без лимита: даём втянуться (как в iOS)
  const firstDay = () => {
    const u = window.State && State.U;
    return !!(u && u.createdAt && new Date(u.createdAt).toLocaleDateString('sv-SE') === day());
  };

  // ── промо-безлимит: локальный ключ + поле профиля (синк в облако) ──
  const PROMO_KEY = 'web_premium_until';
  const until = () => Math.max(+(localStorage.getItem(PROMO_KEY) || 0),
    (window.State && State.U && +State.U.premiumUntil) || 0);
  const promoActive = () => until() > Date.now();
  const forever = () => until() > Date.now() + FOREVER_SPAN;
  const promoDate = () => new Date(until()).toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : 'ru-RU');
  const unlimited = () => !LIMIT_ON || promoActive() || firstDay();

  function addPromoDays(days, silentEvent){
    const base = Math.max(Date.now(), until());
    const v = base + days * 86400000;
    localStorage.setItem(PROMO_KEY, String(v));
    if (window.State && State.U) { State.U.premiumUntil = v; State.save(); } // уедет в облако
    document.querySelector('#web-time-chip')?.remove();
    refreshLimitChip();
    if (window.Track && silentEvent) Track.send(silentEvent, { days });
  }

  // ── учёт времени: тикаем, пока открыт урок и вкладка видима ──
  setInterval(() => {
    if (unlimited()) return;
    if (document.hidden) return;
    if (document.body.classList.contains('lesson-wait')) return; // задание сдано, ждём «Дальше»
    if (!document.body.classList.contains('lesson-open')) return;
    localStorage.setItem(usedKey(), used() + 1);
    const chip = document.querySelector('#web-time-chip');
    if (chip) chip.textContent = '⏱ ' + fmt(left());
  }, 1000);

  function fmt(s){ return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  // ── гейт: вызывается из startLesson (строка живёт в app.js) ──
  function gate(){
    if (unlimited() || left() > 0) {
      if (!unlimited()) setTimeout(mountChip, 60);
      return true;
    }
    showPaywall();
    return false;
  }
  function mountChip(){
    if (unlimited()) return;
    const top = document.querySelector('#lesson-top');
    if (top && !top.querySelector('#web-time-chip')) {
      top.insertAdjacentHTML('beforeend', `<span id="web-time-chip" class="chip-stat" style="font-size:12px;">⏱ ${fmt(left())}</span>`);
    }
  }

  // маленький локальный модал (modal() в app.js не экспортируется)
  function modalBox(html){
    const el = document.createElement('div');
    el.className = 'modal-back';
    el.innerHTML = `<div class="modal">${html}</div>`;
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
    return el;
  }

  // открыть оплату: новая вкладка (нужен прямой клик юзера — жест сохраняем)
  function openPay(where){
    if (!TRIBUTE.lifetime) return;
    if (window.Track) Track.send('purchase_tap', { where });
    window.open(TRIBUTE.lifetime, '_blank', 'noopener');
  }

  // ── пейволл ──
  function showPaywall(){
    document.querySelector('#web-paywall')?.remove();
    if (window.Track) Track.send('paywall_shown');
    const canBonus = bonus() === 0 && !!navigator.share;
    const priceTail = TRIBUTE.lifetimePrice ? ' ' + esc(TRIBUTE.lifetimePrice) : '';
    const el = document.createElement('div');
    el.id = 'web-paywall';
    el.className = 'modal-back';
    el.innerHTML = `
      <div class="modal" style="text-align:center;position:relative;">
        <button id="wpw-x" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:22px;color:var(--muted);padding:6px;cursor:pointer;">✕</button>
        ${typeof mascotSvg === 'function' ? mascotSvg('happy', 72) : ''}
        <h3>${typo(t('Полако! На сегодня всё 🙂'))}</h3>
        <p class="muted small" style="margin:6px 0 14px;">${typo(t('Бесплатные 10 минут на сегодня закончились. Хочешь без пауз — безлимит навсегда: после оплаты пришлём промокод, введёшь его здесь, и никаких ограничений.'))}</p>
        <button class="btn primary big" id="wpw-buy">${TRIBUTE.lifetimePrice ? typo(t('Безлимит навсегда —')) + priceTail : t('Купить безлимит навсегда')}</button>
        <p class="muted small" style="margin:8px 0;">${t('Разовая покупка. Никаких подписок.')}</p>
        <div class="row-btns" style="margin-top:10px;">
          <button class="btn ghost" id="wpw-promo" style="font-size:13.5px;padding:9px 10px;">${t('Ввести промокод')}</button>
          <button class="btn ghost" id="wpw-later" style="font-size:13.5px;padding:9px 10px;">${t('До завтра')}</button>
        </div>
        <p class="muted small" style="margin:10px 0 0;">${typo(t('Уже покупал(а)? Войди в облако в профиле — безлимит вернётся сам.'))}</p>
        ${canBonus ? `<button id="wpw-share" style="background:none;border:none;color:var(--muted);font-family:inherit;font-size:13.5px;margin-top:10px;text-decoration:underline;cursor:pointer;">${t('🎁 +5 минут за пост в соцсети или мессенджер')}</button>` : ''}
      </div>`;
    document.body.appendChild(el);
    const close = () => { el.remove(); refreshLimitChip(); };
    el.querySelector('#wpw-x').onclick = close;
    el.querySelector('#wpw-later').onclick = close;
    el.querySelector('#wpw-buy').onclick = () => {
      openPay('paywall');
      const note = document.createElement('p');
      note.className = 'muted small';
      note.style.margin = '8px 0 0';
      note.textContent = typo(t('Оплата откроется в новой вкладке (сервис Tribute). После оплаты мы отправим промокод — введи его в профиле, и безлимит включится навсегда.'));
      el.querySelector('#wpw-buy').insertAdjacentElement('afterend', note);
      el.querySelector('#wpw-buy').disabled = true;
    };
    el.querySelector('#wpw-promo').onclick = () => {
      close();
      App.selectTab('profile');
      setTimeout(() => {
        const inp = document.querySelector('#wp-promo-inp');
        if (inp) { inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); inp.focus({ preventScroll: true }); }
      }, 350);
    };
    const sh = el.querySelector('#wpw-share');
    if (sh) sh.onclick = async () => {
      const text = I18N.lang === 'en'
        ? 'Learning Serbian with Dobrodošli — real Balkan life lessons, Žarko the seagull and zero pressure 🐦'
        : 'Учу сербский в «Добродошли» — уроки из жизни на Балканах, галеб Жарко и никакого давления 🐦';
      try {
        await navigator.share({ text, url: location.origin + location.pathname });
        localStorage.setItem(bonusKey(), BONUS_SEC);
        el.remove();
        toastSafe(t('🎁 +5 минут на сегодня. Уживању!'));
        if (window.Track) Track.send('share_bonus');
      } catch (e) { /* юзер передумал — ок */ }
    };
  }

  function toastSafe(msg){
    const el = document.createElement('div');
    el.className = 'toast show';
    el.textContent = String(msg).replace(/<[^>]*>/g, '');
    (document.querySelector('#toasts') || document.body).appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  // ── чип «⏱ лимит» в шапке: интерфейс смотреть можно, тап — пейволл ──
  function refreshLimitChip(){
    const tb = document.querySelector('#topbar');
    if (!tb) return;
    const existing = tb.querySelector('#web-limit-chip');
    if (unlimited() || left() > 0) { if (existing) existing.remove(); return; }
    if (existing) return;
    const b = document.createElement('button');
    b.id = 'web-limit-chip';
    b.className = 'chip-stat';
    b.style.cssText = 'border-color:var(--primary);color:var(--primary-deep);cursor:pointer;';
    b.textContent = t('⏱ лимит');
    b.onclick = showPaywall;
    tb.appendChild(b);
  }

  // ── профиль: донат, покупка безлимита, промокод, обратная связь ──
  // Профиль перерисовывается и мимо selectTab (смена темы/цели/звука зовёт
  // renderProfile напрямую) — поэтому следим за DOM, как в iOS-слое.
  // дебаунс таймером, не rAF: rAF молчит в фоновой вкладке, а профиль может
  // перерисоваться и пока вкладка не видна (вернёмся — карточек нет)
  let pending = null;
  new MutationObserver(() => {
    if (pending) return;
    pending = setTimeout(() => {
      pending = null;
      refreshLimitChip();
      if (document.querySelector('#tabbar .tab.on[data-t="profile"]')) injectProfile();
    }, 50);
  }).observe(document.body, { childList: true, subtree: true });

  function injectProfile(){
    if (document.querySelector('#web-promo-card')) return;
    const anchor = document.querySelector('.prof-actions');
    if (!anchor) return;
    const u = window.State && State.U;
    const inCloud = !!(u && u.cloudId);
    const priceTail = TRIBUTE.lifetimePrice ? ' ' + esc(TRIBUTE.lifetimePrice) : '';

    const supportCard = (TRIBUTE.donate || TRIBUTE.lifetime) ? `
      <h4>${t('Поддержать проект')}</h4>
      <div class="card settings" id="web-support">
        <p class="muted small" style="margin:0;">${t('«Добродошли» делает один человек и один галеб. Донат — ваше «хвала» для нас: не влияет на процесс, но очень приятно!')}</p>
        ${TRIBUTE.donate ? `<button class="btn ghost" id="wp-donate">${t('☕ Поддержать донатом')}</button>` : ''}
        ${TRIBUTE.lifetime && !promoActive() ? `<button class="btn primary" id="wp-buy">${TRIBUTE.lifetimePrice ? typo(t('Безлимит навсегда —')) + priceTail : t('Купить безлимит навсегда')}</button>` : ''}
        ${promoActive() && LIMIT_ON ? `<p class="muted small center" style="margin:6px 0 0;">${t('Безлимит активен 💙')}</p>` : ''}
      </div>` : '';

    const promoCard = `
      <div class="card settings" id="web-promo-card">
        ${promoActive()
          ? `<p class="muted small" style="margin:0;">${forever() ? t('♾ Безлимит навсегда активен 💙') : `${t('🎟 Безлимит по промокоду до')} <b>${promoDate()}</b>`}</p>
             ${inCloud ? '' : `<p class="muted small" style="margin:6px 0 0;">${typo(t('Совет: войди в облако в профиле — безлимит привяжется к аккаунту и не потеряется при чистке браузера.'))}</p>`}`
          : `<p class="muted small" style="margin:0;">${t('Есть промокод? Введи его.')}</p>
             <div class="row-btns" style="align-items:stretch;">
               <input id="wp-promo-inp" maxlength="24" placeholder="${t('Промокод')}" autocapitalize="characters" autocomplete="off"
                      style="flex:1;font-family:inherit;font-size:16px;padding:10px 12px;border-radius:14px;border:2px solid var(--line);min-width:0;">
               <button class="btn ghost" id="wp-promo-apply">${t('Активировать')}</button>
             </div>
             <p class="muted small" id="wp-promo-msg" style="margin:4px 0 0;display:none;"></p>`}
      </div>`;

    const feedbackCard = `
      <div class="card settings" id="web-feedback">
        <button id="wfb-toggle" style="background:none;border:none;padding:0;text-align:left;cursor:pointer;font-family:inherit;color:inherit;">
          <p class="muted small" style="margin:0;"><b>${t('✍️ Написать разработчикам')}</b> <span id="wfb-chev" style="float:right;color:var(--muted);">▾</span><br>${t('Есть идея или нашли ошибку?')} ${t('Читаем всё и отвечаем на почту.')}</p>
        </button>
        <div id="wfb-body" style="display:none;flex-direction:column;gap:12px;">
          <input id="wfb-topic" maxlength="120" placeholder="${t('Тема')}" autocomplete="off" autocorrect="off"
                 style="font-family:inherit;font-size:15px;padding:10px 12px;border-radius:14px;border:2px solid var(--line);width:100%;">
          <input id="wfb-email" maxlength="200" type="email" placeholder="${t('Твоя почта (для ответа)')}" autocomplete="email" autocapitalize="off" autocorrect="off"
                 style="font-family:inherit;font-size:15px;padding:10px 12px;border-radius:14px;border:2px solid var(--line);width:100%;">
          <textarea id="wfb-msg" maxlength="4000" rows="3" placeholder="${t('Сообщение')}"
                 style="font-family:inherit;font-size:15px;padding:10px 12px;border-radius:14px;border:2px solid var(--line);width:100%;resize:vertical;"></textarea>
          <button class="btn ghost" id="wfb-send">${t('Отправить')}</button>
          <p class="muted small" id="wfb-status" style="margin:0;display:none;"></p>
        </div>
      </div>`;

    anchor.insertAdjacentHTML('beforebegin', supportCard + promoCard + feedbackCard);

    const donate = document.querySelector('#wp-donate');
    if (donate) donate.onclick = () => {
      if (window.Track) Track.send('purchase_tap', { where: 'donate_web' });
      window.open(TRIBUTE.donate, '_blank', 'noopener');
    };
    const buy = document.querySelector('#wp-buy');
    if (buy) buy.onclick = () => {
      const m = modalBox(`
        <h3>${t('Купить безлимит навсегда')}</h3>
        <p class="muted small">${typo(t('Оплата откроется в новой вкладке (сервис Tribute). После оплаты мы отправим промокод — введи его в профиле, и безлимит включится навсегда.'))}</p>
        <div class="row-btns"><button class="btn ghost" id="wm-later">${t('До завтра')}</button>
        <button class="btn primary" id="wm-go">${t('Открыть оплату')}</button></div>`);
      m.querySelector('#wm-later').onclick = () => m.remove();
      m.querySelector('#wm-go').onclick = () => { openPay('profile'); m.remove(); };
    };
    const apply = document.querySelector('#wp-promo-apply');
    if (apply) apply.onclick = () => redeemPromo();
    const inp = document.querySelector('#wp-promo-inp');
    if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') redeemPromo(); });
    const fbSend = document.querySelector('#wfb-send');
    if (fbSend) fbSend.onclick = () => sendFeedback();
    const fbToggle = document.querySelector('#wfb-toggle');
    if (fbToggle) fbToggle.onclick = () => {
      const body = document.querySelector('#wfb-body');
      const chev = document.querySelector('#wfb-chev');
      const open = body.style.display === 'none';
      body.style.display = open ? 'flex' : 'none';
      if (chev) chev.textContent = open ? '▴' : '▾';
    };
  }

  // ── погашение промокода: тот же RPC, что в iOS, но чистым fetch ──
  async function redeemPromo(){
    const inp = document.querySelector('#wp-promo-inp');
    const msg = document.querySelector('#wp-promo-msg');
    const btn = document.querySelector('#wp-promo-apply');
    const code = (inp && inp.value || '').trim().toUpperCase();
    if (!code) { if (inp) inp.focus(); return; }
    const say = (text, bad) => {
      if (!msg) return;
      msg.style.display = 'block';
      msg.style.color = bad ? 'var(--bad, #c0392b)' : 'var(--ok, #2e7d32)';
      msg.textContent = text;
    };
    if (btn) btn.disabled = true;
    try {
      const c = window.DOBRODOSLI_SUPABASE;
      if (!c || !c.url) { say(t('Не получилось проверить код. Проверь интернет и попробуй ещё раз.'), true); return; }
      const res = await fetch(c.url + '/rest/v1/rpc/redeem_promo', {
        method: 'POST',
        headers: { apikey: c.key, Authorization: 'Bearer ' + c.key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_code: code, p_device: Track.deviceId }),
      });
      if (!res.ok) {
        let m = '';
        try { m = String((await res.json()).message || ''); } catch (e) {}
        say(m.includes('promo_already_redeemed') ? t('Этот код уже активирован на этом устройстве.')
          : m.includes('promo_exhausted') ? t('У этого кода закончились активации.')
          : m.includes('promo_not_found') ? t('Код не найден или больше не действует.')
          : t('Не получилось проверить код. Проверь интернет и попробуй ещё раз.'), true);
        return;
      }
      const days = +(await res.json()) || 0;
      if (days <= 0) { say(t('Код не найден или больше не действует.'), true); return; }
      addPromoDays(days, 'promo_redeemed');
      toastSafe(forever() ? t('🎟 Промокод принят! Безлимит навсегда 💙')
        : `${t('🎟 Промокод принят! Безлимит до')} ${promoDate()}`);
      // инкогнито/чистка браузера съедят localStorage — подталкиваем к облаку
      const u = window.State && State.U;
      if (u && !u.cloudId) setTimeout(() =>
        toastSafe(typo(t('Совет: войди в облако в профиле — безлимит привяжется к аккаунту и не потеряется при чистке браузера.'))), 2800);
      App.selectTab('profile'); // перерисовать карточку в состояние «активен»
    } catch (e) {
      say(t('Не получилось проверить код. Проверь интернет и попробуй ещё раз.'), true);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ── обратная связь: тема + почта + текст → таблица feedback (админка) ──
  async function sendFeedback(){
    const topic = (document.querySelector('#wfb-topic') || {}).value?.trim() || '';
    const email = (document.querySelector('#wfb-email') || {}).value?.trim() || '';
    const msg = (document.querySelector('#wfb-msg') || {}).value?.trim() || '';
    const status = document.querySelector('#wfb-status');
    const btn = document.querySelector('#wfb-send');
    const say = (text, bad) => {
      if (!status) return;
      status.style.display = 'block';
      status.style.color = bad ? 'var(--bad, #c0392b)' : 'var(--ok, #2e7d32)';
      status.textContent = text;
    };
    if (!topic || !email.includes('@') || !msg) { say(t('Заполни все три поля, пожалуйста.'), true); return; }
    if (btn) btn.disabled = true;
    try {
      const c = window.DOBRODOSLI_SUPABASE;
      const res = await fetch(c.url + '/rest/v1/feedback', {
        method: 'POST',
        headers: { apikey: c.key, Authorization: 'Bearer ' + c.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ topic, email, message: msg, device_id: window.Track ? Track.deviceId : null, platform: 'web' }),
      });
      if (!res.ok) throw new Error('http ' + res.status);
      say(t('Хвала! Сообщение улетело — ответим на почту.'));
      ['#wfb-topic', '#wfb-email', '#wfb-msg'].forEach(s => { const el = document.querySelector(s); if (el) el.value = ''; });
      if (window.Track) Track.send('feedback_sent');
    } catch (e) {
      say(t('Не отправилось. Проверь интернет и попробуй ещё раз.'), true);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ── начисления из админки: забрать при активном облаке (раз в день) ──
  async function claimGrants(){
    try {
      if (!window.Cloud || !Cloud.active() || !Cloud.user() || typeof Cloud.client !== 'function') return;
      const k = 'web_grants_checked_' + day();
      if (localStorage.getItem(k)) return;
      localStorage.setItem(k, '1');
      const sb = Cloud.client();
      if (!sb) return;
      const { data, error } = await sb.rpc('claim_grants');
      const days = +data || 0;
      if (!error && days > 0) {
        addPromoDays(days, 'grant_claimed');
        toastSafe(forever() ? t('🎟 Промокод принят! Безлимит навсегда 💙')
          : `${t('🎁 Тебе начислили дни безлимита! Действует до')} ${promoDate()}`);
      }
    } catch (e) { /* тихо: попробуем завтра */ }
  }
  setTimeout(claimGrants, 3500); // после Cloud.init в App.boot

  window.Premium = { showPaywall, gate, left, get premium(){ return unlimited(); } };
})();
