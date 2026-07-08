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

// Озвучка: ищем сербский голос, затем хорватский/боснийский (произношение
// почти идентично). Если голосов нет — аудио-задания просто не показываются.
const TTS = (() => {
  let voice = null;
  function pickVoice(){
    const vs = speechSynthesis.getVoices();
    voice = null;
    for (const pref of ['sr', 'hr', 'bs']) {
      const v = vs.find(x => x.lang && x.lang.toLowerCase().startsWith(pref));
      if (v) { voice = v; break; }
    }
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
