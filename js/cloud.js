"use strict";
// ── Облако (Supabase): вход через Google + синхронизация прогресса ───────
// Принципы приватности:
//  • паролей нет вообще — личность подтверждает Google (OAuth);
//  • в таблицу прогресса персональные данные не пишутся (см. sanitize):
//    почта живёт только во встроенной системе входа Supabase Auth;
//  • без настройки облака приложение полностью работает локально.
const Cloud = (() => {
  const CFG_KEY = 'dobrodosli_cloud_cfg_v1';
  const LINK_KEY = 'dobrodosli_link_profile_v1'; // какой локальный профиль привязать после возврата от Google
  let sb = null, authUser = null, pushTimer = null, pendingUser = null, lastErr = null;

  function cfg(){
    try {
      const c = JSON.parse(localStorage.getItem(CFG_KEY));
      if (c && c.url && c.key) return c;
    } catch (e) {}
    const w = window.DOBRODOSLI_SUPABASE;
    return (w && w.url && w.key) ? w : null;
  }
  function loadScript(src){
    return new Promise(res => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.head.appendChild(s);
    });
  }
  // в облако улетает только прогресс — никаких персональных данных
  function sanitize(user){
    const copy = JSON.parse(JSON.stringify(user));
    delete copy.email;
    return copy;
  }

  const api = {
    configured(){ return !!cfg(); },
    active(){ return !!sb; },
    user(){ return authUser; },
    email(){ return authUser ? authUser.email : null; },
    error(){ return lastErr; },
    saveCfg(url, key){ localStorage.setItem(CFG_KEY, JSON.stringify({ url: url.trim().replace(/\/+$/, ''), key: key.trim() })); },
    clearCfg(){ localStorage.removeItem(CFG_KEY); },
    // OAuth-редирект невозможен при открытии из файла — только http(s)
    canOAuth(){ return location.protocol === 'http:' || location.protocol === 'https:'; },

    async init(){
      const c = cfg();
      if (!c) return;
      if (!window.supabase) {
        // локальная копия; на всякий случай — фолбэк на CDN
        const ok = (await loadScript('js/vendor/supabase.min.js'))
          || (await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'));
        if (!ok || !window.supabase) { lastErr = 'Не удалось загрузить модуль облака.'; return; }
      }
      try {
        sb = window.supabase.createClient(c.url, c.key);
        const { data } = await sb.auth.getSession();
        authUser = data.session ? data.session.user : null;
      } catch (e) { lastErr = String((e && e.message) || e); sb = null; }
    },

    // Вход через Google: уводит на страницу Google и возвращает обратно сюда.
    // linkProfileId — локальный профиль, который надо привязать после возврата.
    async signInWithGoogle(linkProfileId){
      if (!sb) throw new Error('Облако не настроено');
      if (linkProfileId) localStorage.setItem(LINK_KEY, linkProfileId);
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: location.origin + location.pathname },
      });
      if (error) { localStorage.removeItem(LINK_KEY); throw error; }
    },
    takeLinkRequest(){
      const id = localStorage.getItem(LINK_KEY);
      localStorage.removeItem(LINK_KEY);
      return id;
    },
    async signOut(){
      try { await sb.auth.signOut(); } catch (e) {}
      authUser = null;
    },

    async pull(){
      if (!sb || !authUser) return null;
      const { data, error } = await sb.from('progress').select('data, updated_at').eq('user_id', authUser.id).maybeSingle();
      if (error) throw error;
      return data ? data.data : null;
    },
    // сохраняем с задержкой, чтобы не дёргать сеть на каждый клик
    push(user){
      if (!sb || !authUser || !user || user.cloudId !== authUser.id) return;
      pendingUser = user; // ссылка на актуальный профиль — sanitize снимет копию при отправке
      clearTimeout(pushTimer);
      pushTimer = setTimeout(() => { pushTimer = null; doUpsert(); }, 1500);
    },
    // немедленно дослать накопившееся (при сворачивании/закрытии вкладки)
    async flush(){
      if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
      await doUpsert();
    },
  };

  async function doUpsert(){
    if (!sb || !authUser || !pendingUser || pendingUser.cloudId !== authUser.id) return;
    try {
      await sb.from('progress').upsert({ user_id: authUser.id, data: sanitize(pendingUser), updated_at: new Date().toISOString() });
    } catch (e) { /* не вышло — уедет при следующем сохранении/flush */ }
  }
  return api;
})();

window.Cloud = Cloud; // для iOS-слоя и страховочного flush при сворачивании
