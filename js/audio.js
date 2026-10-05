"use strict";
// ── Звуки (WebAudio, без файлов) и озвучка (системный синтез речи) ───────
const AudioFX = (() => {
  let ctx = null;
  function ac(){
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, at, dur, type = 'sine', vol = 0.16){
    if (!api.enabled) return;
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    const t = c.currentTime + at;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  const api = {
    enabled: true,
    tap(){ tone(520, 0, 0.05, 'sine', 0.05); },
    correct(){ tone(659, 0, 0.12); tone(880, 0.1, 0.2); },
    wrong(){ tone(233, 0, 0.18, 'triangle', 0.12); tone(196, 0.12, 0.24, 'triangle', 0.12); },
    win(){ [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22)); },
  };
  return api;
})();

// Озвучка: системный синтез речи. Сербского голоса у Apple нет, поэтому
// кандидаты — сербский → хорватский → боснийский (произношение почти
// идентично). Из кандидатов берём ЛУЧШИЙ по качеству: премиум/enhanced-
// версии голосов звучат по-человечески, compact — роботом (на это и
// жаловались тестеры). Если голосов нет — аудио-задания не показываются.
const TTS = (() => {
  let voice = null;
  function score(v){
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase() + ' ' + (v.voiceURI || '').toLowerCase();
    let s = 0;
    if (lang.startsWith('sr')) s += 300;
    else if (lang.startsWith('hr')) s += 200;
    else if (lang.startsWith('bs')) s += 100;
    else return -1;                                   // чужие языки не берём
    if (/premium/.test(name)) s += 30;                // лучшие нейроголоса iOS
    if (/enhanced|improved/.test(name)) s += 20;      // улучшенные
    if (/eloquence|compact/.test(name)) s -= 15;      // роботизированные
    if (!v.localService) s += 5;                      // сетевые (Chrome) обычно чище
    return s;
  }
  function pickVoice(){
    const vs = speechSynthesis.getVoices();
    voice = vs.filter(v => score(v) > 0).sort((a, b) => score(b) - score(a))[0] || null;
    document.documentElement.classList.toggle('no-tts', !voice);
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  } else {
    document.documentElement.classList.add('no-tts');
  }
  return {
    enabled: true,
    has(){ return !!voice; },
    // диагностика: какой голос реально выбран (и из чего выбирали)
    voiceInfo(){
      const vs = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];
      return {
        picked: voice ? `${voice.name} (${voice.lang})${voice.localService ? '' : ' · сетевой'}` : null,
        candidates: vs.filter(v => score(v) > 0).map(v => `${v.name} (${v.lang})`),
      };
    },
    speak(text, rate = 0.88){
      if (!voice || !this.enabled || !text) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(text).replace(/[…_]/g, ''));
        u.voice = voice; u.lang = voice.lang; u.rate = rate;
        speechSynthesis.speak(u);
      } catch (e) { /* озвучка — украшение, не критично */ }
    },
  };
})();

window.AudioFX = AudioFX; // для хаптики iOS-моста
