"use strict";
// ── Анонимная продуктовая аналитика ──────────────────────────────────────
// Никаких персональных данных: только случайный id устройства, имя события
// и минимальный контекст. Отправка «выстрелил и забыл»: если сети нет или
// облако не настроено — приложение этого не замечает.
const Track = (() => {
  const KEY = 'dobrodosli_did';
  let did = localStorage.getItem(KEY);
  if (!did) {
    did = (crypto.randomUUID && crypto.randomUUID()) ||
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    localStorage.setItem(KEY, did);
  }

  function send(event, props){
    try {
      const c = window.DOBRODOSLI_SUPABASE;
      if (!c || !c.url || !c.key) return;
      fetch(c.url + '/rest/v1/events', {
        method: 'POST',
        headers: {
          apikey: c.key,
          Authorization: 'Bearer ' + c.key,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          device_id: did,
          platform: window.__IOS__ ? 'ios' : 'web', // лениво: iOS-мост грузится позже
          event: String(event).slice(0, 40),
          props: props || {},
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) { /* аналитика никогда не мешает приложению */ }
  }

  // события-вехи шлём раз в день, чтобы перезагрузки не раздували цифры
  function sendDaily(event, props){
    const k = 'dobrodosli_ev_' + event + '_' + new Date().toLocaleDateString('sv-SE');
    if (localStorage.getItem(k)) return;
    localStorage.setItem(k, '1');
    send(event, props);
  }

  return { send, sendDaily, get deviceId(){ return did; } };
})();
window.Track = Track;
