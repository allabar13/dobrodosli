"use strict";
// ── Добродошли! · контент курса ──────────────────────────────────────────────
// sr — сербский (екавица, латиница); me — черногорский вариант (иекавица),
// если отличается. Кириллица генерируется автоматически (translit.js).
// note — подсказка/шутка на карточке слова.

// ── Уровни курса (готов первый; остальные — в производстве) ──
const LEVELS = [
  { n:1, code:'A0', name:'Впервые слышу',      desc:'Здраво, кафа, бурек: первые сто слов выживания.', ready:true },
  { n:2, code:'A1', name:'Заказываю кофе сам', desc:'Вкусы, покупки, простые просьбы и ответы.', ready:false },
  { n:3, code:'A2', name:'Уже год на Балканах',desc:'О себе, планы, рецепты, маршруты.', ready:false },
  { n:4, code:'B1', name:'Торгуюсь на пияце',  desc:'Живые диалоги, юмор, сложные глаголы.', ready:false },
  { n:5, code:'B2', name:'Почти локалац',      desc:'Истории, мнения, культура — без подстраховки.', ready:false },
];

// ── Темы (блоки): одни и те же на каждом уровне, дальше — глубже ──
const THEMES = {
  intro:     { emoji:'👋', name:'Знакомство с языком' },
  food:      { emoji:'☕', name:'Еда и кафана' },
  shop:      { emoji:'💰', name:'Деньги и пияца' },
  transport: { emoji:'🚌', name:'Город и транспорт' },
  docs:      { emoji:'📋', name:'Документы и быт' },
  home:      { emoji:'🏠', name:'Дом и соседи' },
  vibe:      { emoji:'🌊', name:'Смолток и вайб' },
  grammar:   { emoji:'🛠️', name:'Глаголы и грамматика' },
};

// ── Добрые факты о Балканах (войны не трогаем) ──
const FACTS = [
  { t:'Город котов', x:'Котор — кошачья столица Адриатики: котов тут кормит весь город, у них есть свой музей. Жарко подтверждает: с ними лучше дружить.' },
  { t:'Кофе — это ритуал', x:'«Домаћа кафа» варится в джезве и пьётся минимум полчаса. Заказать «эспрессо с собой» можно, но бариста погрустнеет.' },
  { t:'Слатко для гостя', x:'В сербском доме гостю первым делом подают слатко — ложечку варенья и стакан воды. Отказываться не принято. Да и зачем.' },
  { t:'Пиши как говоришь', x:'Вук Караджич перестроил сербский по принципу «пиши, как говоришь» — поэтому тут смело пишут kompjuter, vikend и onlajn.' },
  { t:'Пеликаны Скадара', x:'На Скадарском озере живут кудрявые пеликаны — одни из самых больших летающих птиц Европы. Жарко считает их двоюродными.' },
  { t:'Чемпионат по лежанию', x:'В черногорском селе Брезна проводят чемпионат по лежанию: кто дольше пролежал — тот и победил. Полако — это спорт.' },
  { t:'Мерак', x:'«Merak» — балканское слово про удовольствие от простых вещей: кофе, закат, разговор. Перевода нет, есть только практика.' },
  { t:'Крепость-парк', x:'Калемегдан в Белграде — древняя крепость, ставшая главным парком: шахматисты, свидания и лучший закат над двумя реками.' },
  { t:'Коло вертится', x:'Балканский танец коло — в списке ЮНЕСКО: взялись за руки — и по кругу. Уметь не обязательно: затянут и научат.' },
  { t:'Сто пекар', x:'Пекара — главный институт после кафаны. Бурек с йогуртом на завтрак — это не еда, это мировоззрение.' },
  { t:'Из лета в зиму', x:'В Черногории можно утром купаться в море, а днём играть в снежки на Дурмиторе — между сезонами час дороги.' },
  { t:'Чьи чевапи?', x:'Чевапи считают «своими» сразу все балканские страны. Это самый вкусный спор региона — и единственный, который решается добавкой.' },
];

const WORDS = {};
function defW(unit, items){ for (const w of items) { w.unit = unit; WORDS[w.id] = w; } }

// ЮНИТ 1 · Здраво!
defW('u1', [
  { id:'dobrodosli',  sr:'dobrodošli',  ru:'добро пожаловать', note:'Название этого приложения. Теперь ты знаешь: тебе тут рады.' },
  { id:'zdravo',      sr:'zdravo',      ru:'привет' },
  { id:'cao',         sr:'ćao',         ru:'привет / пока', note:'Работает и на вход, и на выход. Экономия!' },
  { id:'dobar_dan',   sr:'dobar dan',   ru:'добрый день' },
  { id:'hvala',       sr:'hvala',       ru:'спасибо' },
  { id:'molim',       sr:'molim',       ru:'пожалуйста', note:'Слово-мультитул: «пожалуйста», «алло» и вежливое «что-что?»' },
  { id:'da',          sr:'da',          ru:'да' },
  { id:'ne',          sr:'ne',          ru:'нет' },
  { id:'dobro_jutro', sr:'dobro jutro', ru:'доброе утро' },
  { id:'dobro_vece',  sr:'dobro veče',  ru:'добрый вечер' },
  { id:'laku_noc',    sr:'laku noć',    ru:'спокойной ночи' },
  { id:'izvinite',    sr:'izvinite',    ru:'извините' },
  { id:'dovidjenja',  sr:'doviđenja',   ru:'до свидания' },
  { id:'kako_si',     sr:'kako si?',    ru:'как ты? / как дела?', note:'Вежливо, на «вы» — «kako ste?»' },
  { id:'dobro_sam',   sr:'dobro sam',   ru:'у меня всё хорошо' },
  { id:'vidimo_se',   sr:'vidimo se',   ru:'увидимся' },
]);

// ЮНИТ 2 · Кафана
defW('u2', [
  { id:'kafa',     sr:'kafa',      ru:'кофе' },
  { id:'pivo',     sr:'pivo',      ru:'пиво' },
  { id:'vino',     sr:'vino',      ru:'вино' },
  { id:'rakija',   sr:'rakija',    ru:'ракия', note:'Национальное лекарство от всего. Дозировка — полако.' },
  { id:'voda',     sr:'voda',      ru:'вода' },
  { id:'sok',      sr:'sok',       ru:'сок' },
  { id:'caj',      sr:'čaj',       ru:'чай' },
  { id:'hleb',     sr:'hleb',      me:'hljeb', ru:'хлеб' },
  { id:'sir',      sr:'sir',       ru:'сыр' },
  { id:'burek',    sr:'burek',     ru:'бурек', note:'Священный жирный пирог. Лечит и душу, и похмелье.' },
  { id:'kajmak',   sr:'kajmak',    ru:'каймак', note:'Как сливочное масло, только лучше.' },
  { id:'racun',    sr:'račun',     ru:'счёт' },
  { id:'konobar',  sr:'konobar',   ru:'официант' },
  { id:'ziveli',   sr:'živeli!',   me:'živjeli!', ru:'будем! / за здоровье!', note:'Главный тост. Чокаясь, смотри людям в глаза — таков ритуал.' },
  { id:'prijatno', sr:'prijatno',  ru:'приятного аппетита' },
]);

// ЮНИТ 3 · Бројеви и паре
defW('u3', [
  { id:'jedan',  sr:'jedan',  ru:'один' },
  { id:'dva',    sr:'dva',    ru:'два' },
  { id:'tri',    sr:'tri',    ru:'три' },
  { id:'cetiri', sr:'četiri', ru:'четыре' },
  { id:'pet',    sr:'pet',    ru:'пять' },
  { id:'sest',   sr:'šest',   ru:'шесть' },
  { id:'sedam',  sr:'sedam',  ru:'семь' },
  { id:'osam',   sr:'osam',   ru:'восемь' },
  { id:'devet',  sr:'devet',  ru:'девять' },
  { id:'deset',  sr:'deset',  ru:'десять' },
  { id:'sto',    sr:'sto',    ru:'сто' },
  { id:'hiljada', sr:'hiljada', ru:'тысяча' },
  { id:'pare',   sr:'pare',   ru:'деньги', note:'Официально — novac, но все говорят pare.' },
  { id:'koliko_kosta', sr:'koliko košta?', ru:'сколько стоит?' },
  { id:'skupo',  sr:'skupo',  ru:'дорого' },
  { id:'jeftino', sr:'jeftino', ru:'дёшево' },
  { id:'pijaca', sr:'pijaca', ru:'рынок' },
  { id:'kusur',  sr:'kusur',  ru:'сдача' },
]);

// ЮНИТ 4 · Град
defW('u4', [
  { id:'grad',       sr:'grad',       ru:'город' },
  { id:'ulica',      sr:'ulica',      ru:'улица' },
  { id:'trg',        sr:'trg',        ru:'площадь' },
  { id:'pekara',     sr:'pekara',     ru:'пекарня', note:'Открыта, когда тебе надо. И когда не надо — тоже.' },
  { id:'apoteka',    sr:'apoteka',    ru:'аптека' },
  { id:'prodavnica', sr:'prodavnica', ru:'магазин' },
  { id:'posta',      sr:'pošta',      ru:'почта' },
  { id:'stanica',    sr:'stanica',    ru:'остановка, станция' },
  { id:'autobus',    sr:'autobus',    ru:'автобус' },
  { id:'gde_je',     sr:'gde je…?',   me:'gdje je…?', ru:'где (находится)…?', note:'В Черногории услышишь «đe si!» — это не вопрос, а «здорово, брат!»' },
  { id:'levo',       sr:'levo',       me:'lijevo', ru:'налево' },
  { id:'desno',      sr:'desno',      ru:'направо' },
  { id:'pravo',      sr:'pravo',      ru:'прямо' },
  { id:'blizu',      sr:'blizu',      ru:'близко' },
  { id:'daleko',     sr:'daleko',     ru:'далеко' },
]);

// ЮНИТ 5 · Папири
defW('u5', [
  { id:'papiri',      sr:'papiri',      ru:'документы, бумаги', note:'Главное слово твоего первого года.' },
  { id:'pasos',       sr:'pasoš',       ru:'паспорт' },
  { id:'viza',        sr:'viza',        ru:'виза' },
  { id:'boravak',     sr:'boravak',     ru:'ВНЖ, пребывание' },
  { id:'beli_karton', sr:'beli karton', me:'bijeli karton', ru:'«белый картон», регистрация', note:'Первая ачивка каждого эмигранта.' },
  { id:'potvrda',     sr:'potvrda',     ru:'справка' },
  { id:'ugovor',      sr:'ugovor',      ru:'договор' },
  { id:'salter',      sr:'šalter',      ru:'окошко (в учреждении)' },
  { id:'red',         sr:'red',         ru:'очередь', note:'«U redu» — ещё и «окей». Стоишь в очереди — значит, всё окей.' },
  { id:'cekati',      sr:'čekati',      ru:'ждать' },
  { id:'sutra',       sr:'sutra',       ru:'завтра', note:'Формально — «завтра». Духовно — «когда-нибудь».' },
  { id:'danas',       sr:'danas',       ru:'сегодня' },
  { id:'ponedeljak',  sr:'ponedeljak',  me:'ponedjeljak', ru:'понедельник' },
  { id:'radno_vreme', sr:'radno vreme', me:'radno vrijeme', ru:'рабочее время', note:'Загадочный интервал. Уточняй лично.' },
]);

// ЮНИТ 6 · Стан
defW('u6', [
  { id:'stan',     sr:'stan',     ru:'квартира' },
  { id:'kuca',     sr:'kuća',     ru:'дом' },
  { id:'soba',     sr:'soba',     ru:'комната' },
  { id:'kirija',   sr:'kirija',   ru:'аренда, квартплата' },
  { id:'kljuc',    sr:'ključ',    ru:'ключ' },
  { id:'terasa',   sr:'terasa',   ru:'терраса, балкон' },
  { id:'gazda',    sr:'gazda',    ru:'хозяин квартиры', note:'Твой самый важный человек после мамы.' },
  { id:'struja',   sr:'struja',   ru:'электричество' },
  { id:'grejanje', sr:'grejanje', me:'grijanje', ru:'отопление' },
  { id:'internet', sr:'internet', ru:'интернет' },
  { id:'komsija',  sr:'komšija',  ru:'сосед', note:'Узнает о тебе всё раньше, чем МУП.' },
  { id:'macka',    sr:'mačka',    ru:'кошка', note:'В Которе их сотни — главные жители города. Жарко с ними в мирном договоре.' },
]);

// ЮНИТ 7 · Polako-вайб
defW('u7', [
  { id:'polako',        sr:'polako',        ru:'потихоньку, спокойно', note:'Национальная философия и универсальный ответ на всё.' },
  { id:'nema_problema', sr:'nema problema', ru:'нет проблем' },
  { id:'nema_veze',     sr:'nema veze',     ru:'ничего страшного, неважно' },
  { id:'moze',          sr:'može',          ru:'можно / ок / договорились', note:'Универсальное «да» для любых планов.' },
  { id:'naravno',       sr:'naravno',       ru:'конечно' },
  { id:'mozda',         sr:'možda',         ru:'может быть' },
  { id:'prijatelj',     sr:'prijatelj',     ru:'друг', note:'Звательный падеж: «Prijatelju!» — и человек уже твой.' },
  { id:'sunce',         sr:'sunce',         ru:'солнце' },
  { id:'kisa',          sr:'kiša',          ru:'дождь', note:'«Pada kiša» — идёт дождь.' },
  { id:'more',          sr:'more',          ru:'море' },
  { id:'planina',       sr:'planina',       ru:'гора' },
  { id:'lepo',          sr:'lepo',          me:'lijepo', ru:'красиво, хорошо' },
  { id:'vreme',         sr:'vreme',         me:'vrijeme', ru:'погода; время', note:'Одно слово на оба понятия — ни то, ни другое тут не торопится.' },
  { id:'ljudi',         sr:'ljudi',         ru:'люди' },
]);

// ЮНИТ 8 · Глаголы выживания
defW('u8', [
  { id:'biti',     sr:'biti',     ru:'быть', note:'ja sam · ti si · on je · mi smo · vi ste · oni su' },
  { id:'imati',    sr:'imati',    ru:'иметь', note:'imam, imaš, ima. «Imam pitanje» — «у меня вопрос».' },
  { id:'znati',    sr:'znati',    ru:'знать', note:'znam, znaš, zna. «Ne znam» — вторая по важности фраза.' },
  { id:'razumeti', sr:'razumeti', me:'razumjeti', ru:'понимать', note:'razumem / razumijem. «Ne razumem» спасает ежедневно.' },
  { id:'hteti',    sr:'hteti',    me:'htjeti', ru:'хотеть', note:'hoću, hoćeš, hoće. «Hoću burek» — программа на утро.' },
  { id:'moci',     sr:'moći',     ru:'мочь', note:'mogu, možeš, može. «Može» — универсальное «ок».' },
  { id:'govoriti', sr:'govoriti', ru:'говорить', note:'govorim, govoriš, govori' },
  { id:'uciti',    sr:'učiti',    ru:'учить', note:'«Učim srpski» — то, что ты сейчас и делаешь.' },
  { id:'raditi',   sr:'raditi',   ru:'работать, делать', note:'radim. «Ne radi» — «не работает» (про всё).' },
  { id:'ziveti',   sr:'živeti',   me:'živjeti', ru:'жить', note:'živim u… + город. Локатив! Но полако.' },
]);

// ── Юниты и уроки ────────────────────────────────────────────────────────
const UNITS = [
  {
    id:'u1', emoji:'👋', title:'Здраво!', sub:'Поздороваться и не спалиться', level:1, theme:'intro',
    lessons: [
      { id:'u1l1', title:'Первые слова', words:['dobrodosli','zdravo','cao','dobar_dan','hvala','molim','da','ne'],
        tip:{ title:'Molim — слово-мультитул', text:'«Molim» — это «пожалуйста», ответ на телефонный звонок и вежливое «что-что?». Не расслышал(а) человека — скажи «Molim?» и сделай невинное лицо галеба Жарко.' } },
      { id:'u1l2', title:'Знакомимся', words:['dobro_jutro','dobro_vece','laku_noc','izvinite','dovidjenja','kako_si','dobro_sam','vidimo_se'],
        sentences: [
          { sr:'Dobar dan, kako ste?', ru:'Добрый день, как у вас дела?', fb:'«Kako ste» — вежливое «как вы». Друзьям и котам — «kako si».' },
          { sr:'Zdravo, ja sam Ana.', ru:'Привет, я Ана.', fb:'«Ja sam…» — «я — …». Подставь своё имя и пользуйся.' },
          { sr:'Hvala, dobro sam.', ru:'Спасибо, у меня всё хорошо.' },
          { sr:'Ćao, vidimo se!', ru:'Пока, увидимся!' },
        ],
        situation: { q:'Сосед в лифте кивает: «Ćao!» Твой ход:', ai:0, opts:[
          { t:'«Ćao!»', why:'Да! «Ćao» — и привет, и пока. Один звук — двойная польза.' },
          { t:'«Doviđenja!»', why:'Это «до свидания» — ты попрощался(ась), не успев поздороваться. Смело, но странно.' },
          { t:'Молча смотреть в пол', why:'Так работало в московском лифте. Здесь придётся разговаривать — таков путь.' },
        ] } },
    ],
  },
  {
    id:'u2', emoji:'☕', title:'Кафана', sub:'Главный институт страны', level:1, theme:'food',
    lessons: [
      { id:'u2l1', title:'Напитки', words:['kafa','pivo','vino','rakija','voda','sok','caj'],
        tip:{ title:'Кофе — это формат времени', text:'Кофе в кафане — не напиток, а единица измерения жизни. Встреча «на кофе» короче двух часов считается подозрительной спешкой.' } },
      { id:'u2l2', title:'Еда и счёт', words:['hleb','sir','burek','kajmak','racun','konobar','ziveli','prijatno'],
        sentences: [
          { sr:'Jednu kafu, molim.', ru:'Один кофе, пожалуйста.', fb:'Заметь: jedna kafa → jednu kafu. Это падежи. Их семь, но ты из русского — у тебя почти иммунитет.' },
          { sr:'Pivo i voda, molim.', ru:'Пиво и воду, пожалуйста.' },
          { sr:'Burek sa sirom, molim.', ru:'Бурек с сыром, пожалуйста.', fb:'Идеален утром после вечера, который начался со слова «živeli».' },
          { sr:'Račun, molim.', ru:'Счёт, пожалуйста.' },
          { sr:'Živeli!', me:'Živjeli!', ru:'Будем! / За здоровье!' },
        ],
        situation: { q:'Ты допил кофе час назад, а счёт никто не несёт. Почему?', ai:0, opts:[
          { t:'Здесь не торопят: столик твой хоть весь день', why:'Именно. Кафана — это не общепит, это образ жизни. Хочешь счёт — скажи: «Račun, molim».' },
          { t:'Официант про тебя забыл', why:'Конобар ничего не забывает. Он просто уважает твоё право сидеть вечно.' },
          { t:'Платить не нужно, это подарок', why:'Смелая теория. Нет.' },
        ] } },
    ],
  },
  {
    id:'u3', emoji:'💰', title:'Бројеви и паре', sub:'Числа, цены, пияца', level:1, theme:'shop',
    lessons: [
      { id:'u3l1', title:'Раз-два-три', words:['jedan','dva','tri','cetiri','pet'],
        tip:{ title:'Числа закрывают 90% жизни', text:'Цены, автобусы, «dva piva, molim» — числа от одного до десяти закрывают почти всё. Остальное — комбинаторика.' } },
      { id:'u3l2', title:'До десяти и дальше', words:['sest','sedam','osam','devet','deset','sto','hiljada'] },
      { id:'u3l3', title:'На пияце', words:['pare','koliko_kosta','skupo','jeftino','pijaca','kusur'],
        sentences: [
          { sr:'Koliko košta burek?', ru:'Сколько стоит бурек?' },
          { sr:'Burek košta dvesta dinara.', me:'Burek košta dva eura.', ru:'Бурек стоит двести динаров.', ruMe:'Бурек стоит два евро.' },
          { sr:'To je skupo!', ru:'Это дорого!' },
          { sr:'Imate li kusur?', ru:'У вас есть сдача?' },
          { sr:'Na pijaci je jeftino.', ru:'На рынке дёшево.' },
        ],
        situation: { q:'На пияце нет ценников. Как узнать цену?', ai:0, opts:[
          { t:'«Koliko košta?» — и приготовиться к разговору', why:'Да. Цена придёт вместе с историей про урожай, погоду и внуков. Это входит в стоимость.' },
          { t:'Молча показать калькулятор', why:'Сработает, но душа не прокачается.' },
          { t:'Поискать QR-код', why:'Смелая идея. Нет.' },
        ] } },
    ],
  },
  {
    id:'u4', emoji:'🏙️', title:'Град', sub:'Город и навигация', level:1, theme:'transport',
    lessons: [
      { id:'u4l1', title:'Места', words:['grad','ulica','trg','pekara','apoteka','prodavnica','posta','stanica'],
        tip:{ title:'Пекара — главный ориентир', text:'Любой адрес здесь объясняется через ближайшую пекару. Запомни свою — и ты никогда не потеряешься. И не проголодаешься.' } },
      { id:'u4l2', title:'Куда идти', words:['autobus','gde_je','levo','desno','pravo','blizu','daleko'],
        sentences: [
          { sr:'Gde je pekara?', me:'Gdje je pekara?', ru:'Где пекарня?' },
          { sr:'Stanica je blizu.', ru:'Остановка близко.' },
          { sr:'Idite pravo, pa levo.', me:'Idite pravo, pa lijevo.', ru:'Идите прямо, потом налево.' },
          { sr:'Autobus ide u grad.', ru:'Автобус идёт в город.' },
          { sr:'Pošta je daleko.', ru:'Почта далеко.' },
        ],
        situation: { q:'Ты спросил дорогу. Ответ: «Pravo, pa malo levo, pa pitaj tamo» («прямо, чуть налево, а там спроси»). Это значит:', ai:0, opts:[
          { t:'Навигация по-балкански: иди и спрашивай — доведут', why:'Точно. Дорогу здесь собирают из трёх человек. Зато с каждым поговоришь.' },
          { t:'Тебя вежливо послали', why:'Наоборот — тебе реально помогли. Просто стиль такой.' },
          { t:'Лучше включить карты', why:'Карты не знают про короткую тропу через двор Милована.' },
        ] } },
    ],
  },
  {
    id:'u5', emoji:'📋', title:'Папири', sub:'Бюрократия: спецкурс эмигранта', level:1, theme:'docs',
    lessons: [
      { id:'u5l1', title:'Стартовый сет', words:['papiri','pasos','viza','boravak','beli_karton','potvrda','ugovor'],
        tip:{ title:'Стартовый сет эмигранта', text:'Pasoš, ugovor, potvrda, beli karton. Когда соберёшь все четыре — выдадут пятую бумагу, о которой никто не предупреждал. Это нормально.' } },
      { id:'u5l2', title:'В очереди', words:['salter','red','cekati','sutra','danas','ponedeljak','radno_vreme'],
        sentences: [
          { sr:'Treba mi potvrda.', ru:'Мне нужна справка.' },
          { sr:'Gde je šalter tri?', me:'Gdje je šalter tri?', ru:'Где третье окошко?' },
          { sr:'Dođite sutra.', ru:'Приходите завтра.', fb:'Запомни эту фразу. Ты её ещё услышишь. Не раз.' },
          { sr:'Čekam u redu.', ru:'Я жду в очереди.', fb:'«U redu» ещё значит «окей». Стоишь в очереди — значит, всё окей. Логика!' },
          { sr:'Imam ugovor i pasoš.', ru:'У меня есть договор и паспорт.' },
        ],
        situation: { q:'В МУПе сказали: «Dođite sutra». Когда приходить?', ai:0, opts:[
          { t:'Завтра. Но морально готовься к ещё одному «sutra»', why:'«Sutra» — это не дата, это жанр. Возьми с собой бурек и философское настроение.' },
          { t:'Сегодня вечером — вдруг передумают', why:'Нет. Радно време — святое.' },
          { t:'Никогда, это отказ', why:'Не драматизируй. Это не отказ, это вторник.' },
        ] } },
    ],
  },
  {
    id:'u6', emoji:'🏠', title:'Стан', sub:'Квартира, газда, комшије', level:1, theme:'home',
    lessons: [
      { id:'u6l1', title:'Квартира', words:['stan','kuca','soba','kirija','kljuc','terasa'],
        tip:{ title:'Айвар — это инициация', text:'Если газда принёс банку айвара или бутылку ракии — это не взятка, это инициация. Поздравляем: ты почти свой человек.' } },
      { id:'u6l2', title:'Газда и комшије', words:['gazda','struja','grejanje','internet','komsija','macka'],
        sentences: [
          { sr:'Koliko je kirija?', ru:'Сколько стоит аренда?' },
          { sr:'Stan ima terasu.', ru:'В квартире есть терраса.' },
          { sr:'Internet ne radi.', ru:'Интернет не работает.', fb:'Фраза первой необходимости. Выучи до переезда.' },
          { sr:'Gazda dolazi sutra.', ru:'Хозяин придёт завтра.', fb:'Ты уже знаешь, что здесь значит «sutra».' },
          { sr:'Ključ je kod komšije.', ru:'Ключ у соседа.' },
        ],
        situation: { q:'Газда зашёл «на пять минут» проверить кран. Прошло два часа. Что происходит?', ai:0, opts:[
          { t:'Всё по плану: кран — повод, разговор — цель', why:'Поздравляю: у тебя теперь есть наставник, метеоролог и дегустатор ракии в одном лице.' },
          { t:'Он хочет поднять кирию', why:'Нет, ему правда интересно, как ты живёшь. И почему до сих пор без айвара.' },
          { t:'Пора звонить в полицию', why:'Полиция приедет и тоже останется поговорить.' },
        ] } },
    ],
  },
  {
    id:'u7', emoji:'🌊', title:'Polako-вайб', sub:'Слова-пароли и смолток', level:1, theme:'vibe',
    lessons: [
      { id:'u7l1', title:'Слова-пароли', words:['polako','nema_problema','nema_veze','moze','naravno','mozda','prijatelj'],
        tip:{ title:'Polako — это стратегия', text:'«Polako» — не лень, а стратегия энергосбережения, отточенная веками. Сопротивляться бесполезно: через полгода ты тоже будешь так жить.' } },
      { id:'u7l2', title:'Погода и вайб', words:['sunce','kisa','more','planina','lepo','vreme','ljudi'],
        sentences: [
          { sr:'Polako, nema problema.', ru:'Спокойно, нет проблем.' },
          { sr:'Danas je lepo vreme.', me:'Danas je lijepo vrijeme.', ru:'Сегодня хорошая погода.' },
          { sr:'Planina je blizu.', me:'More je blizu.', ru:'Гора близко.', ruMe:'Море близко.' },
          { sr:'Može kafa? Može!', ru:'Кофе будешь? — Давай!', fb:'«Može» — универсальное «да». Пригодится каждый день.' },
          { sr:'Sutra možda pada kiša.', ru:'Завтра, может быть, будет дождь.' },
        ],
        situation: { q:'Ты опоздал на встречу на 20 минут и в панике извиняешься. В ответ: «Polako, nema veze». Перевод:', ai:0, opts:[
          { t:'«Расслабься, тут это не опоздание»', why:'20 минут — это не опоздание, это погрешность. Опоздание начинается после часа. И то не факт.' },
          { t:'Он затаил обиду', why:'Затаивать обиду — слишком энергозатратно. Не в этом климате.' },
          { t:'Встреча отменена', why:'Всё в силе. Просто без паники.' },
        ] } },
    ],
  },
  {
    id:'u8', emoji:'🛠️', title:'Глаголы выживания', sub:'Сказать, понять, заплатить', level:1, theme:'grammar',
    lessons: [
      { id:'u8l1', title:'Быть и понимать', words:['biti','imati','znati','razumeti'],
        tip:{ title:'Глагол biti (быть)', text:'ja sam · ti si · on/ona je · mi smo · vi ste · oni su. В отличие от русского, «есть» не выпадает: «Ja sam Ana» = «Я — Ана». Семь падежей подождут, biti — сейчас.' },
        grammar: [
          { q:'Ja ___ iz Rusije.', hint:'Я из России.', opts:['sam','si','je','smo'], a:'sam' },
          { q:'Mi ___ u kafani.', hint:'Мы в кафане.', opts:['smo','sam','su','ste'], a:'smo' },
          { q:'On ___ konobar.', hint:'Он официант.', opts:['je','sam','si','smo'], a:'je' },
        ] },
      { id:'u8l2', title:'Хотеть и мочь', words:['hteti','moci','govoriti','uciti','raditi','ziveti'],
        grammar: [
          { q:'Ja ___ jednu kafu.', hint:'Я хочу один кофе.', opts:['hoću','hoće','hoćeš','hoćemo'], a:'hoću' },
          { q:'___ li engleski?', hint:'Вы говорите по-английски?', opts:['Govorite','Govorim','Govori','Govoriš'], a:'Govorite' },
        ],
        sentences: [
          { sr:'Ne razumem.', me:'Ne razumijem.', ru:'Я не понимаю.', fb:'Главная фраза первого месяца. Говори с улыбкой — и тебе всё объяснят ещё раз, громче и с жестами.' },
          { sr:'Učim srpski.', me:'Učim crnogorski.', ru:'Я учу сербский.', ruMe:'Я учу черногорский.', fb:'(шёпотом) Это практически один язык, но у каждого своё имя. Дипломатия!' },
          { sr:'Živim u Beogradu.', me:'Živim u Podgorici.', ru:'Я живу в Белграде.', ruMe:'Я живу в Подгорице.' },
          { sr:'Radim onlajn.', ru:'Я работаю онлайн.', fb:'Да, «onlajn» так и пишется. Сербский пишет, как слышит. Вук Караджич одобряет.' },
          { sr:'Mogu li da platim karticom?', ru:'Могу ли я заплатить картой?', fb:'Иногда ответ — «samo keš» («только наличные»). Особенно там, где самый вкусный бурек.' },
        ],
        situation: { q:'Ты сказал три слова по-сербски. Реакция местного:', ai:0, opts:[
          { t:'Бурный восторг и монолог на пять минут', why:'Теперь ты «naš čovek». Тебя похвалят, нальют и расскажут историю семьи до пятого колена.' },
          { t:'Вежливо перейдёт на английский', why:'Это в Берлине. Тут продолжат по-сербски — громче и с жестами.' },
          { t:'Ничего не изменится', why:'Изменится. Здесь очень радуются, когда учишь язык.' },
        ] } },
    ],
  },
];

const ALL_LESSONS = [];
UNITS.forEach(u => u.lessons.forEach(l => { l.unitId = u.id; ALL_LESSONS.push(l); }));

// ── Хелперы ──────────────────────────────────────────────────────────────
function W(id){ return WORDS[id]; }
function formOf(w, variant){ return (variant === 'me' && w.me) ? w.me : w.sr; }
function lessonById(id){ return ALL_LESSONS.find(l => l.id === id); }
function unitById(id){ return UNITS.find(u => u.id === id); }
function shuf(arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickN(arr, n){ return shuf(arr).slice(0, n); }
function uniq(arr){ return [...new Set(arr)]; }
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
const escAttr = esc;

// Жарко — адриатический галеб, талисман приложения
function mascotSvg(mood = 'happy', size = 80){
  const eyes = mood === 'sad'
    ? '<line x1="27" y1="19" x2="34" y2="22" stroke="#1B2B33" stroke-width="2.2" stroke-linecap="round"/><line x1="53" y1="19" x2="46" y2="22" stroke="#1B2B33" stroke-width="2.2" stroke-linecap="round"/><circle cx="31" cy="26" r="2.8" fill="#1B2B33"/><circle cx="49" cy="26" r="2.8" fill="#1B2B33"/>'
    : mood === 'wow'
      ? '<circle cx="31" cy="25" r="4" fill="#1B2B33"/><circle cx="49" cy="25" r="4" fill="#1B2B33"/>'
      : '<circle cx="31" cy="25" r="3.2" fill="#1B2B33"/><circle cx="49" cy="25" r="3.2" fill="#1B2B33"/>';
  const beak = mood === 'wow'
    ? '<path d="M35 31 L45 31 L40 36 Z" fill="#F2A93B"/><path d="M36.5 38 L43.5 38 L40 43 Z" fill="#E08A1E"/>'
    : '<path d="M35 32 L45 32 L40 39 Z" fill="#F2A93B"/><circle cx="41.5" cy="34.5" r="1.1" fill="#E2554F"/>';
  return `<svg viewBox="0 0 80 84" width="${size}" height="${Math.round(size * 1.05)}" class="mascot" aria-hidden="true">
    <path d="M33 11 Q36 5 39 10" stroke="#C9D9E1" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M41 10 Q44 5 47 11" stroke="#C9D9E1" stroke-width="2" fill="none" stroke-linecap="round"/>
    <line x1="34" y1="64" x2="33" y2="76" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>
    <line x1="46" y1="64" x2="47" y2="76" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>
    <line x1="29" y1="77" x2="37" y2="77" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>
    <line x1="43" y1="77" x2="51" y2="77" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="40" cy="48" rx="23" ry="20" fill="#FCFDFD"/>
    <path d="M18 42 Q15 58 32 65 Q24 52 26 40 Z" fill="#C9D9E1"/>
    <path d="M62 42 Q65 58 48 65 Q56 52 54 40 Z" fill="#C9D9E1"/>
    <path d="M33 66 L40 73 L47 66 Z" fill="#5E7480"/>
    <circle cx="40" cy="25" r="16" fill="#FCFDFD"/>
    ${eyes}
    ${beak}
    <path d="M26 41 Q40 51 54 41 L54 49 Q40 59 26 49 Z" fill="var(--primary, #1899C2)"/>
  </svg>`;
}

// ── Тексты-настроение ────────────────────────────────────────────────────
const MASCOT_LINES = [
  'Полако! Никто никуда не спешит.',
  'Кјаа! То есть — здраво!',
  'Кофе сначала, урок потом. Это закон.',
  'Один урок в день — и через год поймёшь, о чём кричит комшия.',
  'Без стриков: считаем слова, а не дни.',
  'Сутра — это завтра. Но это не точно.',
  'Видел бурек на пляже. Теперь это мой бурек.',
];

const PRAISE = [
  'Свака част! («молодец», дословно — «всякая честь»)',
  'Браво! Газда бы гордился.',
  '+1 к выживанию на Балканах.',
  'Ты сегодня ближе к боравку, чем вчера.',
  'Полако, но стабильно. Идеальный темп.',
  'Жарко кричит о тебе всему пляжу.',
];

const OOPS = [
  'Не страшно: ошибка — это тренировка, а не приговор.',
  'Нормально. Даже местные путают падежи.',
  'Полако. Слово ушло в «Ошибки» — добьём там.',
  'Мозг учится именно в этот момент. Серьёзно, это наука.',
];

const GOALS = [
  { xp:10, name:'Полако',      desc:'Один подход в день. Честно — достаточно.' },
  { xp:20, name:'Стабильно',   desc:'Урок в день — и совесть в порядке.' },
  { xp:40, name:'Вук Караџић', desc:'Режим лингвиста-реформатора. Уважение.' },
];

// ── Ачивки ───────────────────────────────────────────────────────────────
function unitDone(u, unitId){ const un = unitById(unitId); return un.lessons.every(l => u.lessons[l.id]); }
function knownCount(u){ return Object.keys(u.words).filter(id => WORDS[id] && u.words[id].s >= 1).length; }

const BADGES = [
  { id:'prvi',      emoji:'🐾', name:'Први корак',          desc:'Первый урок пройден. Дальше — полако.', test:u => Object.keys(u.lessons).length >= 1 },
  { id:'kafana',    emoji:'☕', name:'Кафана-сертификат',    desc:'Юнит «Кафана» пройден: кофе, ракия и счёт — база собрана.', test:u => unitDone(u, 'u2') },
  { id:'birokrata', emoji:'📋', name:'Бирократа I степени', desc:'Юнит «Папири» пройден. Морально готов(а) к МУПу.', test:u => unitDone(u, 'u5') },
  { id:'streak3',   emoji:'🌱', name:'Три дана',            desc:'Три дня занятий — подряд не обязательно, мы не давим.', test:u => Object.keys(u.history).length >= 3 },
  { id:'streak7',   emoji:'🐏', name:'Тврдоглав',           desc:'Семь дней занятий. «Упрямый» — тут это комплимент.', test:u => Object.keys(u.history).length >= 7 },
  { id:'words25',   emoji:'📚', name:'25 речи',             desc:'25 слов в копилке.', test:u => knownCount(u) >= 25 },
  { id:'words50',   emoji:'🎓', name:'Пола стотине',        desc:'50 слов. Бабушки на пияце уже почти понимают тебя.', test:u => knownCount(u) >= 50 },
  { id:'words100',  emoji:'🏆', name:'Жива легенда',        desc:'100 слов. Комшия гордится.', test:u => knownCount(u) >= 100 },
  { id:'review10',  emoji:'🧠', name:'Мајстор повторения',  desc:'10 сессий повторения. Интервальный метод работает.', test:u => (u.reviews || 0) >= 10 },
  { id:'perfect',   emoji:'💎', name:'Без грешке',          desc:'Урок без единой ошибки.', test:u => !!(u.flags && u.flags.perfect) },
];
