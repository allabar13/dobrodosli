"use strict";
// ── Транслитерация и проверка ответов ───────────────────────────────────
// Сербский пишется и латиницей, и кириллицей. Контент храним латиницей,
// кириллицу получаем автоматически, а в ответах принимаем обе.
const TR = (() => {
  const DIG = { 'dž':'џ', 'Dž':'Џ', 'DŽ':'Џ', 'lj':'љ', 'Lj':'Љ', 'LJ':'Љ', 'nj':'њ', 'Nj':'Њ', 'NJ':'Њ' };
  const L2C = {
    a:'а', b:'б', c:'ц', 'č':'ч', 'ć':'ћ', d:'д', 'đ':'ђ', e:'е', f:'ф', g:'г', h:'х',
    i:'и', j:'ј', k:'к', l:'л', m:'м', n:'н', o:'о', p:'п', r:'р', s:'с', 'š':'ш',
    t:'т', u:'у', v:'в', z:'з', 'ž':'ж',
    A:'А', B:'Б', C:'Ц', 'Č':'Ч', 'Ć':'Ћ', D:'Д', 'Đ':'Ђ', E:'Е', F:'Ф', G:'Г', H:'Х',
    I:'И', J:'Ј', K:'К', L:'Л', M:'М', N:'Н', O:'О', P:'П', R:'Р', S:'С', 'Š':'Ш',
    T:'Т', U:'У', V:'В', Z:'З', 'Ž':'Ж',
  };
  const C2L = {};
  for (const [k, v] of Object.entries(L2C)) if (!(v in C2L)) C2L[v] = k;
  Object.assign(C2L, { 'џ':'dž', 'Џ':'Dž', 'љ':'lj', 'Љ':'Lj', 'њ':'nj', 'Њ':'Nj' });

  function toCyr(s){
    let out = '';
    s = String(s);
    for (let i = 0; i < s.length; i++) {
      const two = s.slice(i, i + 2);
      if (DIG[two]) { out += DIG[two]; i++; continue; }
      const ch = s[i];
      out += L2C[ch] !== undefined ? L2C[ch] : ch;
    }
    return out;
  }
  function toLat(s){
    let out = '';
    for (const ch of String(s)) out += C2L[ch] !== undefined ? C2L[ch] : ch;
    return out;
  }
  // нормализация: любой алфавит → латиница, без регистра, знаков и лишних пробелов
  function norm(s){
    return toLat(String(s)).toLowerCase()
      .replace(/[.,!?;:'"„“”«»()\-–—…]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  // «сложенная» форма: без галочек (č→c, š→s…) — для мягкой проверки
  function fold(s){
    return norm(s).replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj');
  }
  // Точное совпадение → ок. Совпадение без диакритики → ок + мягкое замечание.
  function check(input, accepted){
    const n = norm(input);
    if (!n) return { ok: false };
    for (const a of accepted) if (norm(a) === n) return { ok: true };
    for (const a of accepted) if (fold(a) === fold(input)) return { ok: true, soft: true, correct: accepted[0] };
    return { ok: false };
  }
  return { toCyr, toLat, norm, fold, check };
})();
