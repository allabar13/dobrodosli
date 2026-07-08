"use strict";
// ── Добродошли! · контент курса ──────────────────────────────────────────────
// sr — сербский (екавица, латиница); me — черногорский вариант (иекавица),
// если отличается. Кириллица генерируется автоматически (translit.js).
// note — подсказка/шутка на карточке слова.

// ── Уровни курса (готов первый; остальные — в производстве) ──
const LEVELS = [
  { n:1, code:'A0', name:'Впервые слышу',      desc:'Здраво, кафа, бурек: первые сто слов выживания.', ready:true },
  { n:2, code:'A1', name:'Заказываю кофе сам', desc:'Вкусы, покупки, числа, простые просьбы и ответы.', ready:true },
  { n:3, code:'A2', name:'Уже год на Балканах',desc:'О себе, семья, рецепты, маршруты, банк и врач.', ready:true },
  { n:4, code:'B1', name:'Торгуюсь на пияце',  desc:'Живые диалоги, торг, характеры, сложные глаголы.', ready:true },
  { n:5, code:'B2', name:'Почти локалац',      desc:'Истории, мнения, культура и душа Балкан.', ready:true },
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

// ════════════ УРОВЕНЬ 2 · A1 «Заказываю кофе сам» ════════════
// u9 · Ко сам ја (о себе)
defW('u9', [
  { id:'zovem_se',    sr:'zovem se',    ru:'меня зовут', note:'«Zovem se Ana» — буквально «зовусь Аной».' },
  { id:'ime',         sr:'ime',         ru:'имя' },
  { id:'prezime',     sr:'prezime',     ru:'фамилия' },
  { id:'odakle_si',   sr:'odakle si?',  ru:'откуда ты?' },
  { id:'iz_rusije',   sr:'iz Rusije',   ru:'из России', note:'Из Украины — iz Ukrajine, из Беларуси — iz Belorusije.' },
  { id:'drago_mi_je', sr:'drago mi je', ru:'приятно познакомиться', note:'Дословно — «мне мило».' },
  { id:'godine',      sr:'godine',      ru:'годы (возраст)', note:'«Imam 30 godina» — мне 30 лет.' },
  { id:'ovde',        sr:'ovde', me:'ovdje', ru:'здесь' },
  { id:'tamo',        sr:'tamo',        ru:'там' },
  { id:'sada',        sr:'sada',        ru:'сейчас' },
]);
// u10 · Укуси (вкусы)
defW('u10', [
  { id:'ukus',     sr:'ukus',     ru:'вкус' },
  { id:'ukusno',   sr:'ukusno',   ru:'вкусно', note:'Высшая похвала повару. И бабушке.' },
  { id:'slatko',   sr:'slatko',   ru:'сладкое' },
  { id:'slano',    sr:'slano',    ru:'солёное' },
  { id:'kiselo',   sr:'kiselo',   ru:'кислое', note:'«Kiselo mleko» — местный кефир. Не пугайся названия.' },
  { id:'ljuto',    sr:'ljuto',    ru:'острое', note:'Айвар бывает «ljuto». Уточняй заранее.' },
  { id:'gorko',    sr:'gorko',    ru:'горькое' },
  { id:'gladan',   sr:'gladan',   ru:'голодный' },
  { id:'zedan',    sr:'žedan',    ru:'хочу пить' },
  { id:'meso',     sr:'meso',     ru:'мясо' },
  { id:'riba',     sr:'riba',     ru:'рыба' },
  { id:'povrce',   sr:'povrće',   ru:'овощи' },
  { id:'voce',     sr:'voće',     ru:'фрукты' },
]);
// u11 · Куповина (покупки)
defW('u11', [
  { id:'kupiti',   sr:'kupiti',   ru:'купить' },
  { id:'prodavac', sr:'prodavac', ru:'продавец' },
  { id:'velicina', sr:'veličina', ru:'размер' },
  { id:'veliko',   sr:'veliko',   ru:'большое' },
  { id:'maleno',   sr:'maleno',   ru:'маленькое' },
  { id:'boja',     sr:'boja',     ru:'цвет' },
  { id:'crveno',   sr:'crveno',   ru:'красное' },
  { id:'plavo',    sr:'plavo',    ru:'синее, голубое' },
  { id:'zeleno',   sr:'zeleno',   ru:'зелёное' },
  { id:'belo',     sr:'belo', me:'bijelo', ru:'белое' },
  { id:'crno',     sr:'crno',     ru:'чёрное' },
  { id:'kesa',     sr:'kesa',     ru:'пакет', note:'«Treba li vam kesa?» — нужен пакет? Обычно платный.' },
]);
// u12 · Превоз (поездки по городу)
defW('u12', [
  { id:'voz',      sr:'voz',      ru:'поезд' },
  { id:'avion',    sr:'avion',    ru:'самолёт' },
  { id:'taksi',    sr:'taksi',    ru:'такси', note:'Договорись о цене заранее или проси включить «taksimetar».' },
  { id:'karta2',   sr:'karta',    ru:'билет' },
  { id:'peske',    sr:'peške', me:'pješke', ru:'пешком' },
  { id:'brzo',     sr:'brzo',     ru:'быстро' },
  { id:'sporo',    sr:'sporo',    ru:'медленно' },
  { id:'kasni',    sr:'kasni',    ru:'опаздывает', note:'«Autobus kasni» — частая, но не трагичная новость.' },
  { id:'polazak',  sr:'polazak',  ru:'отправление' },
  { id:'dolazak',  sr:'dolazak',  ru:'прибытие' },
  { id:'kuda',     sr:'kuda',     ru:'куда' },
]);
// u13 · Термин и време (запись и время)
defW('u13', [
  { id:'termin',   sr:'termin',   ru:'запись, приём', note:'«Zakazati termin» — записаться. Без термина — никуда.' },
  { id:'prijava',  sr:'prijava',  ru:'заявление, регистрация' },
  { id:'broj',     sr:'broj',     ru:'номер' },
  { id:'datum',    sr:'datum',    ru:'дата' },
  { id:'mesec',    sr:'mesec', me:'mjesec', ru:'месяц' },
  { id:'godina',   sr:'godina',   ru:'год' },
  { id:'potpis',   sr:'potpis',   ru:'подпись' },
  { id:'pecat',    sr:'pečat',    ru:'печать', note:'Без печати бумага — просто бумага. С печатью — Документ.' },
  { id:'kopija',   sr:'kopija',   ru:'копия' },
  { id:'hitno',    sr:'hitno',    ru:'срочно', note:'Слово сильное, но на «радно време» не влияет.' },
]);
// u14 · По стану (по квартире)
defW('u14', [
  { id:'kuhinja',      sr:'kuhinja',      ru:'кухня' },
  { id:'kupatilo',     sr:'kupatilo',     ru:'ванная' },
  { id:'spavaca_soba', sr:'spavaća soba', ru:'спальня' },
  { id:'sto2',         sr:'sto',          ru:'стол', note:'Совпадает со «сто» (100) — по смыслу не перепутаешь.' },
  { id:'stolica',      sr:'stolica',      ru:'стул' },
  { id:'krevet',       sr:'krevet',       ru:'кровать' },
  { id:'frizider',     sr:'frižider',     ru:'холодильник' },
  { id:'sporet',       sr:'šporet',       ru:'плита' },
  { id:'prozor',       sr:'prozor',       ru:'окно' },
  { id:'vrata',        sr:'vrata',        ru:'дверь' },
  { id:'cisto',        sr:'čisto',        ru:'чисто' },
  { id:'prljavo',      sr:'prljavo',      ru:'грязно' },
]);
// u15 · Како си заправо (чувства, смолток)
defW('u15', [
  { id:'kako_ide',   sr:'kako ide?',  ru:'как идёт? как оно?' },
  { id:'umoran',     sr:'umoran',     ru:'усталый' },
  { id:'srecan',     sr:'srećan', me:'sretan', ru:'счастливый' },
  { id:'tuzan',      sr:'tužan',      ru:'грустный' },
  { id:'dosadno',    sr:'dosadno',    ru:'скучно' },
  { id:'zanimljivo', sr:'zanimljivo', ru:'интересно' },
  { id:'super',      sr:'super',      ru:'супер' },
  { id:'odlicno',    sr:'odlično',    ru:'отлично' },
  { id:'bas',        sr:'baš',        ru:'прямо, очень', note:'Усилитель на все случаи: «baš lepo», «baš ljuto».' },
  { id:'stvarno',    sr:'stvarno?',   ru:'правда? серьёзно?' },
]);
// u16 · Идем, хоћу, треба (настоящее время)
defW('u16', [
  { id:'ici',     sr:'ići',     ru:'идти, ехать', note:'idem, ideš, ide, idemo, idete, idu.' },
  { id:'doci',    sr:'doći',    ru:'прийти, приехать', note:'dođem, dođeš, dođe. «Dolazim» — иду/приду.' },
  { id:'zeleti',  sr:'želeti', me:'željeti', ru:'желать, хотеть', note:'želim, želiš, želi. Вежливее, чем «hoću».' },
  { id:'trebati', sr:'trebati', ru:'быть нужным', note:'«Treba mi…» — мне нужно… Дальше — что именно.' },
  { id:'voleti',  sr:'voleti', me:'voljeti', ru:'любить', note:'volim, voliš, voli. «Volim Balkan» — и тебя поймут.' },
  { id:'jesti',   sr:'jesti',   ru:'есть, кушать', note:'jedem, jedeš, jede.' },
  { id:'piti',    sr:'piti',    ru:'пить', note:'pijem, piješ, pije.' },
  { id:'spavati', sr:'spavati', ru:'спать', note:'spavam. После бурека — святое дело.' },
]);

// ════════════ УРОВЕНЬ 3 · A2 «Уже год на Балканах» ════════════
// u17 · Биографија (о себе подробнее)
defW('u17', [
  { id:'roden',    sr:'rođen',    ru:'рождён(а)', note:'«Rođen/rođena sam u…» — я родился/родилась в…' },
  { id:'porodica', sr:'porodica', ru:'семья' },
  { id:'posao',    sr:'posao',    ru:'работа', note:'«Tražim posao» — ищу работу. «Imam posao» — повезло.' },
  { id:'studiram', sr:'studiram', ru:'учусь (в вузе)' },
  { id:'ozenjen',  sr:'oženjen',  ru:'женат' },
  { id:'udata',    sr:'udata',    ru:'замужем', note:'Мужчина — «oženjen», женщина — «udata». Не перепутай.' },
  { id:'dete',     sr:'dete', me:'dijete', ru:'ребёнок' },
  { id:'jezik',    sr:'jezik',    ru:'язык' },
  { id:'vec',      sr:'već',      ru:'уже' },
  { id:'tek',      sr:'tek',      ru:'только что, лишь' },
]);
// u18 · Рецепт (готовим)
defW('u18', [
  { id:'recept',   sr:'recept',   ru:'рецепт' },
  { id:'sastojci', sr:'sastojci', ru:'ингредиенты' },
  { id:'brasno',   sr:'brašno',   ru:'мука' },
  { id:'jaje',     sr:'jaje',     ru:'яйцо' },
  { id:'so',       sr:'so',       ru:'соль' },
  { id:'secer',    sr:'šećer',    ru:'сахар' },
  { id:'ulje',     sr:'ulje',     ru:'масло (растительное)' },
  { id:'luk',      sr:'luk',      ru:'лук' },
  { id:'beli_luk', sr:'beli luk', me:'bijeli luk', ru:'чеснок' },
  { id:'krompir',  sr:'krompir',  ru:'картофель' },
  { id:'kuvati',   sr:'kuvati', me:'kuhati', ru:'варить, готовить' },
  { id:'prziti',   sr:'pržiti',   ru:'жарить' },
  { id:'seckati',  sr:'seckati', me:'sjeckati', ru:'резать, нарезать' },
]);
// u19 · Цене и попусти (цены и скидки)
defW('u19', [
  { id:'jeftinije', sr:'jeftinije', ru:'дешевле' },
  { id:'skuplje',   sr:'skuplje',   ru:'дороже' },
  { id:'bolje',     sr:'bolje',     ru:'лучше' },
  { id:'gore',      sr:'gore',      ru:'хуже' },
  { id:'vise',      sr:'više',      ru:'больше' },
  { id:'manje',     sr:'manje',     ru:'меньше' },
  { id:'popust',    sr:'popust',    ru:'скидка', note:'«Ima li popust?» — есть скидка? Спросить не стыдно.' },
  { id:'akcija',    sr:'akcija',    ru:'акция, распродажа' },
  { id:'pola',      sr:'pola',      ru:'половина' },
  { id:'komad',     sr:'komad',     ru:'штука', note:'«Tri komada» — три штуки.' },
  { id:'zajedno',   sr:'zajedno',   ru:'вместе', note:'«Sve zajedno?» — всё вместе? (одним чеком).' },
]);
// u20 · Путовање (путешествие)
defW('u20', [
  { id:'put',         sr:'put',         ru:'путь, поездка' },
  { id:'putovati',    sr:'putovati',    ru:'путешествовать' },
  { id:'granica',     sr:'granica',     ru:'граница', note:'«Gužva na granici» — пробка на границе. Запасись водой и дзеном.' },
  { id:'prtljag',     sr:'prtljag',     ru:'багаж' },
  { id:'kofer',       sr:'kofer',       ru:'чемодан' },
  { id:'rezervacija', sr:'rezervacija', ru:'бронь' },
  { id:'smestaj',     sr:'smeštaj', me:'smještaj', ru:'жильё, проживание' },
  { id:'mapa',        sr:'mapa',        ru:'карта (местности)' },
  { id:'most',        sr:'most',        ru:'мост' },
  { id:'raskrsnica',  sr:'raskrsnica', me:'raskršće', ru:'перекрёсток' },
]);
// u21 · Банка и здравље (банк и здоровье)
defW('u21', [
  { id:'banka',         sr:'banka',         ru:'банк' },
  { id:'bankovni_racun',sr:'račun u banci', ru:'счёт в банке' },
  { id:'kartica',       sr:'kartica',       ru:'карта (банковская)' },
  { id:'novac',         sr:'novac',         ru:'деньги (офиц.)', note:'В жизни чаще «pare». В банке — «novac».' },
  { id:'uplata',        sr:'uplata',        ru:'платёж, пополнение' },
  { id:'broj_telefona', sr:'broj telefona', ru:'номер телефона' },
  { id:'otkazati',      sr:'otkazati',      ru:'отменить, расторгнуть' },
  { id:'produziti',     sr:'produžiti',     ru:'продлить', note:'Главный глагол при оформлении боравка.' },
  { id:'lekar',         sr:'lekar', me:'ljekar', ru:'врач' },
  { id:'osiguranje2',   sr:'zdravstveno osiguranje', ru:'медстраховка' },
]);
// u22 · Кварови и мајстори (поломки и мастера)
defW('u22', [
  { id:'popraviti',  sr:'popraviti', ru:'починить' },
  { id:'pokvareno',  sr:'pokvareno', ru:'сломано' },
  { id:'curi',       sr:'curi',      ru:'течёт', note:'«Slavina curi» — кран течёт. Газда уже едет (sutra).' },
  { id:'sijalica',   sr:'sijalica',  ru:'лампочка' },
  { id:'slavina',    sr:'slavina',   ru:'кран' },
  { id:'klima',      sr:'klima',     ru:'кондиционер' },
  { id:'majstor',    sr:'majstor',   ru:'мастер', note:'«Zvaću majstora» — позову мастера. Придёт sutra.' },
  { id:'cistiti',    sr:'čistiti',   ru:'убирать, чистить' },
  { id:'oprati',     sr:'oprati',    ru:'помыть, постирать' },
  { id:'smece',      sr:'smeće',     ru:'мусор' },
]);
// u23 · Планови и позиви (планы и приглашения)
defW('u23', [
  { id:'plan',       sr:'plan',       ru:'план' },
  { id:'vikend',     sr:'vikend',     ru:'выходные' },
  { id:'pozvati',    sr:'pozvati',    ru:'пригласить, позвать' },
  { id:'slobodan',   sr:'slobodan',   ru:'свободен' },
  { id:'zauzet',     sr:'zauzet',     ru:'занят' },
  { id:'kasnije',    sr:'kasnije',    ru:'позже' },
  { id:'ranije',     sr:'ranije',     ru:'раньше' },
  { id:'hajde',      sr:'hajde',      ru:'давай, пойдём', note:'«Hajde na kafu» — пойдём на кофе. Главное приглашение страны.' },
  { id:'dogovoreno', sr:'dogovoreno', ru:'договорились' },
  { id:'izlazak',    sr:'izlazak',    ru:'выход в люди, тусовка' },
]);
// u24 · Јуче и сутра (прошлое и будущее)
defW('u24', [
  { id:'bio_sam',        sr:'bio sam',        ru:'я был(а)', note:'«bio sam» (м) / «bila sam» (ж). Перфект = «быть» + причастие на -о/-ла.' },
  { id:'juce',           sr:'juče',           ru:'вчера' },
  { id:'sinoc',          sr:'sinoć',          ru:'вчера вечером' },
  { id:'prosle_nedelje', sr:'prošle nedelje', me:'prošle nedjelje', ru:'на прошлой неделе' },
  { id:'sledece_nedelje',sr:'sledeće nedelje',me:'sljedeće nedjelje', ru:'на следующей неделе' },
  { id:'bicu',           sr:'biću',           ru:'я буду', note:'Будущее: «ću» + глагол. «Doći ću» — приду.' },
  { id:'kupio_sam',      sr:'kupio sam',      ru:'я купил(а)', note:'kupio (м) / kupila (ж).' },
  { id:'bilo_je_lepo',   sr:'bilo je lepo',   me:'bilo je lijepo', ru:'было хорошо' },
]);

// ════════════ УРОВЕНЬ 4 · B1 «Торгуюсь на пияце» ════════════
// u25 · Какав је он (характер)
defW('u25', [
  { id:'karakter',   sr:'karakter',   ru:'характер' },
  { id:'ozbiljan',   sr:'ozbiljan',   ru:'серьёзный' },
  { id:'smesno',     sr:'smešno', me:'smiješno', ru:'смешно' },
  { id:'pametan',    sr:'pametan',    ru:'умный' },
  { id:'simpatican', sr:'simpatičan', ru:'милый, приятный' },
  { id:'iskren',     sr:'iskren',     ru:'честный, искренний' },
  { id:'opusten',    sr:'opušten',    ru:'расслабленный', note:'Главное балканское состояние. Цель, к которой ты идёшь.' },
  { id:'dosadan',    sr:'dosadan',    ru:'занудный, скучный' },
  { id:'lud',        sr:'lud',        ru:'сумасшедший', note:'Часто ласково: «lud si!» — «ну ты даёшь!».' },
  { id:'ponekad',    sr:'ponekad',    ru:'иногда' },
]);
// u26 · У ресторану (в ресторане)
defW('u26', [
  { id:'jelovnik',     sr:'jelovnik',     ru:'меню' },
  { id:'specijalitet', sr:'specijalitet', ru:'фирменное блюдо' },
  { id:'preporuka',    sr:'preporuka',    ru:'рекомендация', note:'«Šta preporučujete?» — что посоветуете? Конобар оживёт.' },
  { id:'porcija',      sr:'porcija',      ru:'порция' },
  { id:'naruciti',     sr:'naručiti',     ru:'заказать' },
  { id:'dodatak',      sr:'dodatak',      ru:'гарнир, добавка' },
  { id:'pregoreno',    sr:'pregoreno',    ru:'подгорело' },
  { id:'sveze',        sr:'sveže', me:'svježe', ru:'свежее' },
  { id:'baksis',       sr:'bakšiš',       ru:'чаевые', note:'10% — хороший тон. Округлить счёт — норма.' },
  { id:'zaliti_se',    sr:'žaliti se',    ru:'жаловаться' },
]);
// u27 · Ценкање и рекламације (торг и возврат)
defW('u27', [
  { id:'cenkati_se',     sr:'cenkati se', me:'cjenkati se', ru:'торговаться', note:'На пияце — да. В супермаркете — лучше не надо.' },
  { id:'poslednja_cena', sr:'poslednja cena', me:'posljednja cijena', ru:'последняя цена' },
  { id:'zamena',         sr:'zamena', me:'zamjena', ru:'обмен' },
  { id:'vratiti',        sr:'vratiti',    ru:'вернуть' },
  { id:'reklamacija',    sr:'reklamacija',ru:'рекламация, претензия' },
  { id:'garancija',      sr:'garancija',  ru:'гарантия' },
  { id:'ne_radi',        sr:'ne radi',    ru:'не работает', note:'Фраза-ключ к обмену. И к жизни на Балканах.' },
  { id:'gotovina',       sr:'gotovina',   ru:'наличные', note:'«Samo keš?» — только наличные? Часто да.' },
  { id:'sitno',          sr:'sitno',      ru:'мелочь (деньги)' },
  { id:'preskupo',       sr:'preskupo',   ru:'слишком дорого' },
]);
// u28 · Кад крене наопако (когда что-то ломается)
defW('u28', [
  { id:'kvar',       sr:'kvar',       ru:'поломка' },
  { id:'guma',       sr:'guma',       ru:'шина, колесо' },
  { id:'benzin',     sr:'benzin',     ru:'бензин' },
  { id:'pumpa',      sr:'pumpa',      ru:'заправка' },
  { id:'kazna',      sr:'kazna',      ru:'штраф' },
  { id:'guzva',      sr:'gužva',      ru:'толпа, пробка', note:'«Gužva» — и очередь, и пробка, и движуха. Универсально.' },
  { id:'zakasniti',  sr:'zakasniti',  ru:'опоздать' },
  { id:'propustiti', sr:'propustiti', ru:'пропустить (рейс)' },
  { id:'presedanje', sr:'presedanje', me:'presjedanje', ru:'пересадка' },
  { id:'pomoc',      sr:'pomoć',      ru:'помощь', note:'«Upomoć!» — на помощь! Надеемся, не пригодится.' },
]);
// u29 · Озбиљна бирократија (бюрократия глубже)
defW('u29', [
  { id:'zahtev',       sr:'zahtev', me:'zahtjev', ru:'заявление, запрос' },
  { id:'overa',        sr:'overa', me:'ovjera', ru:'заверение (нотариальное)' },
  { id:'sudski_tumac', sr:'sudski tumač', ru:'присяжный переводчик', note:'Переводит документы официально. Без него бумага «не считается».' },
  { id:'advokat',      sr:'advokat',    ru:'адвокат' },
  { id:'zalba',        sr:'žalba',      ru:'жалоба, апелляция' },
  { id:'rok',          sr:'rok',        ru:'срок' },
  { id:'vazi',         sr:'važi',       ru:'действует; ок, идёт', note:'И «действителен», и разговорное «договорились!».' },
  { id:'istekao',      sr:'istekao',    ru:'истёк (срок)' },
  { id:'produzenje',   sr:'produženje', ru:'продление' },
  { id:'nadlezni',     sr:'nadležni',   ru:'ответственный орган' },
]);
// u30 · Уговор и газда (аренда)
defW('u30', [
  { id:'vlasnik',    sr:'vlasnik',    ru:'владелец' },
  { id:'stanar',     sr:'stanar',     ru:'квартирант' },
  { id:'depozit',    sr:'depozit',    ru:'залог, депозит' },
  { id:'rezije',     sr:'režije',     ru:'коммуналка', note:'Свет, вода, вывоз мусора. Спроси, входят ли в кирию.' },
  { id:'useliti_se', sr:'useliti se', ru:'заселиться' },
  { id:'iseliti_se', sr:'iseliti se', ru:'съехать' },
  { id:'namesteno',  sr:'namešteno', me:'namješteno', ru:'с мебелью' },
  { id:'buka',       sr:'buka',       ru:'шум', note:'«Komšije prave buku» — соседи шумят. Или это свадьба. Или и то, и то.' },
  { id:'otkaz',      sr:'otkaz',      ru:'расторжение' },
  { id:'dogovor',    sr:'dogovor',    ru:'договорённость' },
]);
// u31 · Слажем се? Не баш (спор по-доброму)
defW('u31', [
  { id:'slazem_se',    sr:'slažem se',    ru:'я согласен' },
  { id:'ne_slazem_se', sr:'ne slažem se', ru:'я не согласен' },
  { id:'u_pravu_si',   sr:'u pravu si',   ru:'ты прав(а)' },
  { id:'greska',       sr:'greška',       ru:'ошибка' },
  { id:'izvini',       sr:'izvini',       ru:'прости (на ты)' },
  { id:'salim_se',     sr:'šalim se',     ru:'я шучу', note:'Спасательный круг после смелой шутки.' },
  { id:'ozbiljno',     sr:'ozbiljno',     ru:'серьёзно' },
  { id:'nema_sanse',   sr:'nema šanse',   ru:'ни за что, ни шанса' },
  { id:'svasta',       sr:'svašta',       ru:'надо же; чего только нет', note:'Реакция на любую балканскую новость.' },
  { id:'tacno',        sr:'tačno',        ru:'точно, верно' },
]);
// u32 · Глаголски вид и повратни (вид и -ся)
defW('u32', [
  { id:'osecati_se', sr:'osećati se', me:'osjećati se', ru:'чувствовать себя', note:'Возвратный «se» = русское «-ся». «Osećam se dobro».' },
  { id:'secati_se',  sr:'sećati se', me:'sjećati se', ru:'помнить, вспоминать' },
  { id:'nadati_se',  sr:'nadati se',  ru:'надеяться', note:'«Nadam se» — надеюсь. Часто про «радно време».' },
  { id:'druziti_se', sr:'družiti se', ru:'общаться, тусоваться' },
  { id:'kupovati',   sr:'kupovati',   ru:'покупать (несов.)', note:'kupovati (процесс) ↔ kupiti (результат). Это вид глагола.' },
  { id:'reci',       sr:'reći',       ru:'сказать (сов.)', note:'reći (один раз) ↔ govoriti (вообще).' },
  { id:'hteo_bih',   sr:'hteo bih', me:'htio bih', ru:'я бы хотел', note:'Вежливое сослагательное. «Hteo bih kafu» — звучит культурно.' },
  { id:'trebalo_bi', sr:'trebalo bi', ru:'следовало бы, надо бы' },
]);

// ════════════ УРОВЕНЬ 5 · B2 «Почти локалац» ════════════
// u33 · Моја прича (моя история)
defW('u33', [
  { id:'detinjstvo', sr:'detinjstvo', me:'djetinjstvo', ru:'детство' },
  { id:'iskustvo',   sr:'iskustvo',   ru:'опыт' },
  { id:'uspomena',   sr:'uspomena',   ru:'воспоминание' },
  { id:'san',        sr:'san',        ru:'мечта; сон' },
  { id:'cilj',       sr:'cilj',       ru:'цель' },
  { id:'ponosan',    sr:'ponosan',    ru:'гордый, горжусь' },
  { id:'promena',    sr:'promena', me:'promjena', ru:'перемена' },
  { id:'odluka',     sr:'odluka',     ru:'решение', note:'«Doneti odluku» — принять решение. Переезд — самое смелое.' },
  { id:'izazov',     sr:'izazov',     ru:'вызов, испытание' },
  { id:'zbog',       sr:'zbog',       ru:'из-за, ради' },
]);
// u34 · Кухиња и слава (кулинарная культура)
defW('u34', [
  { id:'domace',   sr:'domaće',   ru:'домашнее', note:'Высшая похвала еде. «Domaća rakija» — гордость дома.' },
  { id:'slava',    sr:'slava',    ru:'слава (семейный праздник)', note:'Сербский праздник святого-покровителя семьи. Гостей кормят до отказа.' },
  { id:'post',     sr:'post',     ru:'пост (религ.)', note:'«Posno» — постное, без животного. Часто очень вкусно.' },
  { id:'zacin',    sr:'začin',    ru:'приправа' },
  { id:'zimnica',  sr:'zimnica',  ru:'заготовки на зиму', note:'Айвар, соленья, варенье. Осенью весь двор пахнет паприкой.' },
  { id:'sarma',    sr:'sarma',    ru:'сарма (голубцы)', note:'Голубцы в квашеной капусте. Праздник без сармы — не праздник.' },
  { id:'gibanica', sr:'gibanica', ru:'гибаница (пирог с сыром)' },
  { id:'ajvar',    sr:'ajvar',    ru:'айвар', note:'Перечная икра, валюта добрососедства. Бывает «ljuti».' },
  { id:'pecenje',  sr:'pečenje',  ru:'жаркое на вертеле', note:'Центр любого торжества. Запах слышен за квартал.' },
  { id:'kuvar',    sr:'kuvar', me:'kuhar', ru:'повар; кулинарная книга' },
]);
// u35 · Квалитет и мишљење (качество и мнение)
defW('u35', [
  { id:'kvalitet',        sr:'kvalitet',        ru:'качество' },
  { id:'domaci_proizvod', sr:'domaći proizvod', ru:'местный продукт' },
  { id:'uvozno',          sr:'uvozno',          ru:'импортное' },
  { id:'preporucujem',    sr:'preporučujem',    ru:'рекомендую' },
  { id:'vredi',           sr:'vredi', me:'vrijedi', ru:'стоит того' },
  { id:'prevara',         sr:'prevara',         ru:'обман, развод' },
  { id:'misljenje',       sr:'mišljenje',       ru:'мнение' },
  { id:'po_meni',         sr:'po meni',         ru:'по-моему' },
  { id:'pouzdano',        sr:'pouzdano',        ru:'надёжно' },
  { id:'razumna_cena',    sr:'razumna cena', me:'razumna cijena', ru:'разумная цена' },
]);
// u36 · Авантуре на путу (истории путешествий)
defW('u36', [
  { id:'avantura',    sr:'avantura',    ru:'приключение' },
  { id:'dozivljaj',   sr:'doživljaj',   ru:'впечатление, переживание' },
  { id:'izgubiti_se', sr:'izgubiti se', ru:'заблудиться' },
  { id:'slucajno',    sr:'slučajno',    ru:'случайно' },
  { id:'na_kraju',    sr:'na kraju',    ru:'в итоге, в конце концов' },
  { id:'ispostavilo', sr:'ispostavilo se', ru:'оказалось', note:'«Ispostavilo se da…» — начало любой балканской истории.' },
  { id:'priroda',     sr:'priroda',     ru:'природа' },
  { id:'pejzaz',      sr:'pejzaž',      ru:'пейзаж' },
  { id:'nezaboravno', sr:'nezaboravno', ru:'незабываемо' },
  { id:'vredelo',     sr:'vredelo je', me:'vrijedilo je', ru:'оно того стоило' },
]);
// u37 · Држављанство и стрпљење (сложные ситуации)
defW('u37', [
  { id:'drzavljanstvo', sr:'državljanstvo',     ru:'гражданство' },
  { id:'prebivaliste',  sr:'prebivalište',      ru:'постоянное место жительства' },
  { id:'boravisna',     sr:'boravišna dozvola', ru:'ВНЖ (офиц.)' },
  { id:'poreska',       sr:'poreska prijava',   ru:'налоговая декларация' },
  { id:'penzija',       sr:'penzija',           ru:'пенсия' },
  { id:'osiguranje',    sr:'osiguranje',        ru:'страховка' },
  { id:'strpljenje',    sr:'strpljenje',        ru:'терпение', note:'Главный документ эмигранта. Выдаётся не сразу — прокачивается на шалтере.' },
  { id:'procedura',     sr:'procedura',         ru:'процедура' },
  { id:'ipak',          sr:'ipak',              ru:'всё же, всё-таки' },
  { id:'konacno',       sr:'konačno',           ru:'наконец-то', note:'Слово, которое ты выдохнешь, получив боравак.' },
]);
// u38 · Комшилук и дружење (соседство)
defW('u38', [
  { id:'naselje',       sr:'naselje',       ru:'район, посёлок' },
  { id:'zajednica',     sr:'zajednica',     ru:'сообщество' },
  { id:'druzenje',      sr:'druženje',      ru:'посиделки, общение' },
  { id:'rostilj',       sr:'roštilj',       ru:'барбекю, гриль', note:'Не еда, а социальный институт. Сосед с роштилем — твой друг навек.' },
  { id:'proslava',      sr:'proslava',      ru:'празднование' },
  { id:'pozajmiti',     sr:'pozajmiti',     ru:'одолжить', note:'Соседи одалживают друг другу всё — от соли до дрели.' },
  { id:'gostoprimstvo', sr:'gostoprimstvo', ru:'гостеприимство', note:'Балканский спорт высших достижений. Гостя не отпустят голодным.' },
  { id:'prijateljstvo', sr:'prijateljstvo', ru:'дружба' },
  { id:'uvek',          sr:'uvek', me:'uvijek', ru:'всегда' },
  { id:'zauvek',        sr:'zauvek', me:'zauvijek', ru:'навсегда' },
]);
// u39 · Мишљења и култура (мнения и культура)
defW('u39', [
  { id:'mislim_da',      sr:'mislim da…',     ru:'я думаю, что…' },
  { id:'cini_mi_se',     sr:'čini mi se',     ru:'мне кажется' },
  { id:'zapravo',        sr:'zapravo',        ru:'на самом деле' },
  { id:'uglavnom',       sr:'uglavnom',       ru:'в основном' },
  { id:'tradicija',      sr:'tradicija',      ru:'традиция' },
  { id:'obicaj',         sr:'običaj',         ru:'обычай' },
  { id:'mentalitet',     sr:'mentalitet',     ru:'менталитет' },
  { id:'dusa',           sr:'duša',           ru:'душа', note:'Балканы измеряют людей душой, а не часами. «Čovek od duše» — высшая похвала.' },
  { id:'ponos',          sr:'ponos',          ru:'гордость' },
  { id:'s_jedne_strane', sr:'s jedne strane', ru:'с одной стороны' },
]);
// u40 · Везници (союзы)
defW('u40', [
  { id:'jer',      sr:'jer',      ru:'потому что' },
  { id:'zato_sto', sr:'zato što', ru:'потому что (в начале причины)' },
  { id:'iako',     sr:'iako',     ru:'хотя' },
  { id:'ako',      sr:'ako',      ru:'если' },
  { id:'kad',      sr:'kad',      ru:'когда' },
  { id:'dok',      sr:'dok',      ru:'пока' },
  { id:'umesto',   sr:'umesto', me:'umjesto', ru:'вместо' },
  { id:'osim',     sr:'osim',     ru:'кроме' },
  { id:'zato',     sr:'zato',     ru:'поэтому' },
  { id:'mada',     sr:'mada',     ru:'хотя (= iako)' },
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

  // ════════════ УРОВЕНЬ 2 · A1 «Заказываю кофе сам» ════════════
  {
    id:'u9', emoji:'🙋', title:'Ко сам ја?', sub:'Представиться и расспросить', level:2, theme:'intro',
    lessons: [
      { id:'u9l1', title:'Знакомство', words:['zovem_se','ime','prezime','odakle_si','iz_rusije','drago_mi_je','godine','ovde','tamo','sada'],
        tip:{ title:'«Drago mi je» работает всегда', text:'Знакомишься — «Drago mi je» («очень приятно»). Безотказно, как «hvala». Дальше — «Odakle si?», и разговор покатился.' },
        sentences: [
          { sr:'Zovem se Ana, drago mi je.', ru:'Меня зовут Ана, приятно познакомиться.' },
          { sr:'Ja sam iz Rusije.', ru:'Я из России.' },
          { sr:'Odakle si ti?', ru:'А ты откуда?' },
          { sr:'Živim ovde već godinu dana.', me:'Živim ovdje već godinu dana.', ru:'Я живу здесь уже год.' },
        ],
        situation: { q:'Новый знакомый спрашивает «Odakle si?». Лучший ответ:', ai:0, opts:[
          { t:'«Ja sam iz Rusije, a živim ovde.»', why:'Идеально: коротко, по делу — и сразу даёшь зацепку для разговора.' },
          { t:'Сделать вид, что не услышал', why:'«Odakle si» — самый частый вопрос к новенькому. Прятаться придётся часто. Лучше выучить ответ.' },
          { t:'«Doviđenja!»', why:'Попрощаться в ответ на «откуда ты» — смело, но разговор окончен не начавшись.' },
        ] } },
    ],
  },
  {
    id:'u10', emoji:'😋', title:'Укуси', sub:'Сладко, солёно, остро', level:2, theme:'food',
    lessons: [
      { id:'u10l1', title:'Вкусы и голод', words:['ukus','ukusno','slatko','slano','kiselo','ljuto','gorko','gladan','zedan','meso','riba','povrce','voce'],
        tip:{ title:'«Ljuto?» — важный вопрос', text:'Перед тем как взять айвар или паприку, спроси: «Da li je ljuto?» («это острое?»). Балканское «чуть-чуть остро» бывает с характером.' },
        situation: { q:'Бабушка на пияце протягивает попробовать и говорит «Probaj, domaće!». Ты:', ai:0, opts:[
          { t:'Пробуешь и говоришь «Mmm, ukusno!»', why:'Именно! «Domaće» (домашнее) — знак качества, а «ukusno» делает бабушку счастливой. Все в выигрыше.' },
          { t:'Вежливо отказываешься', why:'Можно, но ты упускаешь и угощение, и мини-урок языка. На Балканах пробовать — часть ритуала.' },
          { t:'Спрашиваешь сертификат', why:'«Domaće» сильнее любого сертификата. Просто пробуй.' },
        ] } },
    ],
  },
  {
    id:'u11', emoji:'🛍️', title:'Куповина', sub:'Размеры, цвета, пакет', level:2, theme:'shop',
    lessons: [
      { id:'u11l1', title:'В магазине', words:['kupiti','prodavac','velicina','veliko','maleno','boja','crveno','plavo','zeleno','belo','crno','kesa'],
        tip:{ title:'«Koja veličina?»', text:'Продавец спросит «Koja veličina?» (какой размер) и «Koja boja?» (какой цвет). Числа ты уже знаешь — остаётся показать пальцем и улыбнуться.' },
        sentences: [
          { sr:'Tražim crvenu majicu.', ru:'Ищу красную футболку.' },
          { sr:'Imate li veću veličinu?', ru:'У вас есть размер побольше?' },
          { sr:'Treba li vam kesa?', ru:'Вам нужен пакет?' },
          { sr:'Samo gledam, hvala.', ru:'Я просто смотрю, спасибо.', fb:'Волшебная фраза, чтобы продавец дал спокойно походить.' },
        ] },
    ],
  },
  {
    id:'u12', emoji:'🚌', title:'Превоз', sub:'Поезд, автобус, такси', level:2, theme:'transport',
    lessons: [
      { id:'u12l1', title:'Как добраться', words:['voz','avion','taksi','karta2','peske','brzo','sporo','kasni','polazak','dolazak','kuda'],
        tip:{ title:'«Kasni» — не паника', text:'«Autobus kasni 10 minuta» — автобус опаздывает на 10 минут. Это не сбой системы, это и есть система. Polako.' },
        situation: { q:'На остановке висит расписание, но автобуса нет уже 15 минут. Реакция местных:', ai:0, opts:[
          { t:'Спокойно пьют кофе и ждут', why:'Да. Расписание — это пожелание, а не обещание. Кофе из соседней пекары скрашивает ожидание.' },
          { t:'Звонят в мэрию', why:'Никто никуда не звонит. «Kasni» — это нормально, придёт.' },
          { t:'Вызывают такси за 200€', why:'Не драматизируй. Подожди ещё «pet minuta».' },
        ] } },
    ],
  },
  {
    id:'u13', emoji:'🗓️', title:'Термин и време', sub:'Запись, дата, печать', level:2, theme:'docs',
    lessons: [
      { id:'u13l1', title:'Записаться', words:['termin','prijava','broj','datum','mesec','godina','potpis','pecat','kopija','hitno'],
        tip:{ title:'Сначала — термин', text:'В учреждение чаще не приходят «просто так», а берут «termin» (запись). Назвали дату — записывай сразу, свободный термин редок, как тень в августе.' },
        sentences: [
          { sr:'Treba mi termin za sledeći mesec.', me:'Treba mi termin za sljedeći mjesec.', ru:'Мне нужна запись на следующий месяц.' },
          { sr:'Koji je danas datum?', ru:'Какое сегодня число?' },
          { sr:'Ovde vaš potpis, molim.', me:'Ovdje vaš potpis, molim.', ru:'Здесь ваша подпись, пожалуйста.' },
          { sr:'Treba mi kopija i pečat.', ru:'Мне нужна копия и печать.' },
        ] },
    ],
  },
  {
    id:'u14', emoji:'🛋️', title:'По стану', sub:'Кухня, мебель, чисто-грязно', level:2, theme:'home',
    lessons: [
      { id:'u14l1', title:'Комнаты и мебель', words:['kuhinja','kupatilo','spavaca_soba','sto2','stolica','krevet','frizider','sporet','prozor','vrata','cisto','prljavo'],
        tip:{ title:'«Sto» — стол и сто', text:'«Sto» — это и «стол», и число «100». Контекст спасает: «sto evra» — деньги, «drveni sto» — мебель. Балканы любят такие шутки.' },
        sentences: [
          { sr:'Stan ima veliku kuhinju.', ru:'В квартире большая кухня.' },
          { sr:'Frižider ne radi.', ru:'Холодильник не работает.', fb:'Снова «ne radi» — выучи, пригодится не раз.' },
          { sr:'Prozor je prljav.', ru:'Окно грязное.' },
        ] },
    ],
  },
  {
    id:'u15', emoji:'🙂', title:'Како си заправо?', sub:'Чувства и реакции', level:2, theme:'vibe',
    lessons: [
      { id:'u15l1', title:'Как настроение', words:['kako_ide','umoran','srecan','tuzan','dosadno','zanimljivo','super','odlicno','bas','stvarno'],
        tip:{ title:'«Kako ide?» вместо «kako si»', text:'Друзьям вместо «kako si» говорят расслабленное «kako ide?» («как оно?»). Ответ-победитель: «Polako, super» — спокойно, всё отлично.' },
        situation: { q:'Друг спрашивает «Kako ide?». Самый балканский ответ:', ai:0, opts:[
          { t:'«Polako, ne žalim se.»', why:'Идеал! «Потихоньку, не жалуюсь» — фирменный балканский оптимизм с лёгкой иронией.' },
          { t:'Подробный рассказ на 20 минут', why:'Можно, но «kako ide» — это часто просто «привет». Начни коротко, а детали — за кофе.' },
          { t:'«Ne razumem.»', why:'Ты уже знаешь это выражение — но тут лучше ответить, разговор-то лёгкий.' },
        ] } },
    ],
  },
  {
    id:'u16', emoji:'🧩', title:'Идем, хоћу, треба', sub:'Настоящее время глаголов', level:2, theme:'grammar',
    lessons: [
      { id:'u16l1', title:'Главные глаголы', words:['ici','doci','zeleti','trebati','voleti','jesti','piti','spavati'],
        tip:{ title:'«Treba mi» — спасательный круг', text:'Не помнишь глагол? Скажи «Treba mi…» («мне нужно…») и добавь существительное: «Treba mi voda». Просто, вежливо и работает везде.' },
        grammar: [
          { q:'Ja ___ u grad.', hint:'Я иду в город.', opts:['idem','ideš','ide','idemo'], a:'idem' },
          { q:'___ mi pomoć.', hint:'Мне нужна помощь.', opts:['Treba','Trebam','Trebaš','Treba mi'], a:'Treba' },
          { q:'Mi ___ kafu.', hint:'Мы любим кофе.', opts:['volimo','volim','voliš','vole'], a:'volimo' },
        ],
        sentences: [
          { sr:'Želim da naučim srpski.', me:'Želim da naučim crnogorski.', ru:'Я хочу выучить сербский.', ruMe:'Я хочу выучить черногорский.' },
          { sr:'Idem na posao.', ru:'Я иду на работу.' },
        ] },
    ],
  },

  // ════════════ УРОВЕНЬ 3 · A2 «Уже год на Балканах» ════════════
  {
    id:'u17', emoji:'📖', title:'Биографија', sub:'Семья, работа, языки', level:3, theme:'intro',
    lessons: [
      { id:'u17l1', title:'Рассказ о себе', words:['roden','porodica','posao','studiram','ozenjen','udata','dete','jezik','vec','tek'],
        tip:{ title:'«Oženjen» или «udata»?', text:'Тонкость: мужчина «oženjen» (женат), женщина «udata» (замужем). Один корень про мужчин, другой про женщин — перепутаешь, поправят с улыбкой.' },
        sentences: [
          { sr:'Rođena sam u Moskvi.', ru:'Я родилась в Москве.' },
          { sr:'Imam dvoje dece.', me:'Imam dvoje djece.', ru:'У меня двое детей.' },
          { sr:'Govorim ruski i učim srpski.', me:'Govorim ruski i učim crnogorski.', ru:'Я говорю по-русски и учу сербский.' },
          { sr:'Tek sam stigla, učim jezik.', ru:'Я только приехала, учу язык.' },
        ] },
    ],
  },
  {
    id:'u18', emoji:'🍳', title:'Рецепт', sub:'Готовим по-балкански', level:3, theme:'food',
    lessons: [
      { id:'u18l1', title:'Продукты и действия', words:['recept','sastojci','brasno','jaje','so','secer','ulje','luk','beli_luk','krompir','kuvati','prziti','seckati'],
        tip:{ title:'«Odoka» — главная мера', text:'Спросишь у соседки точный рецепт — услышишь «odoka» (на глаз). Грамм не будет. Будет «malo ovoga, malo onoga» — и почему-то всегда вкусно.' },
        sentences: [
          { sr:'Treba mi brašno, jaja i so.', ru:'Мне нужны мука, яйца и соль.' },
          { sr:'Seckam luk i pržim na ulju.', me:'Sjeckam luk i pržim na ulju.', ru:'Режу лук и жарю на масле.' },
          { sr:'Koliko šećera ide u kolač?', ru:'Сколько сахара идёт в пирог?' },
        ] },
    ],
  },
  {
    id:'u19', emoji:'🏷️', title:'Цене и попусти', sub:'Сравнить и сэкономить', level:3, theme:'shop',
    lessons: [
      { id:'u19l1', title:'Дороже-дешевле', words:['jeftinije','skuplje','bolje','gore','vise','manje','popust','akcija','pola','komad','zajedno'],
        tip:{ title:'«Ima li popust?»', text:'Спросить про скидку — не стыдно, а почти спортивно. «Ima li popust za gotovinu?» (скидка за наличные?) иногда творит чудеса.' },
        sentences: [
          { sr:'Na pijaci je jeftinije nego u marketu.', ru:'На рынке дешевле, чем в магазине.' },
          { sr:'Daću vam tri komada.', ru:'Дам вам три штуки.' },
          { sr:'Koliko je sve zajedno?', ru:'Сколько всё вместе?' },
          { sr:'Ima li popust?', ru:'Есть ли скидка?' },
        ] },
    ],
  },
  {
    id:'u20', emoji:'🧳', title:'Путовање', sub:'Граница, багаж, маршрут', level:3, theme:'transport',
    lessons: [
      { id:'u20l1', title:'В дорогу', words:['put','putovati','granica','prtljag','kofer','rezervacija','smestaj','mapa','most','raskrsnica'],
        tip:{ title:'«Gužva na granici»', text:'Едешь между странами — проверь «gužvu na granici» (пробку на границе) заранее. Летом и в праздники она измеряется не минутами, а буреками.' },
        situation: { q:'На границе очередь на два часа. Бывалый сосед советует:', ai:0, opts:[
          { t:'«Polako, ponesi vodu i strpljenje.»', why:'Точно. Вода, терпение и плейлист — стандартный набор. Граница спешки не понимает.' },
          { t:'Объехать через горы без дороги', why:'Героически, но нет. Лучше очередь и кофе из термоса.' },
          { t:'Развернуться и не ехать', why:'Слишком радикально. «Gužva» рассосётся, как и всё на Балканах.' },
        ] } },
    ],
  },
  {
    id:'u21', emoji:'🏦', title:'Банка и здравље', sub:'Счёт, карта, врач', level:3, theme:'docs',
    lessons: [
      { id:'u21l1', title:'Банк и здоровье', words:['banka','bankovni_racun','kartica','novac','uplata','broj_telefona','otkazati','produziti','lekar','osiguranje2'],
        tip:{ title:'«Produžiti» — глагол года', text:'«Produžiti» (продлить) ты будешь спрягать чаще всего: боравак, страховку, договор. Запомни намертво — сэкономит нервы на шалтере.' },
        sentences: [
          { sr:'Želim da otvorim račun u banci.', ru:'Хочу открыть счёт в банке.' },
          { sr:'Treba mi lekar.', me:'Treba mi ljekar.', ru:'Мне нужен врач.' },
          { sr:'Mogu li da produžim osiguranje?', ru:'Могу ли я продлить страховку?' },
        ] },
    ],
  },
  {
    id:'u22', emoji:'🔧', title:'Кварови и мајстори', sub:'Что-то сломалось', level:3, theme:'home',
    lessons: [
      { id:'u22l1', title:'Поломки', words:['popraviti','pokvareno','curi','sijalica','slavina','klima','majstor','cistiti','oprati','smece'],
        tip:{ title:'«Dolazi majstor»', text:'«Dolazi majstor» («придёт мастер») — фраза с открытой датой. Он придёт. Когда-нибудь. Принесёт инструмент, выпьет кофе, всё починит и расскажет про政ику. Polako.' },
        sentences: [
          { sr:'Slavina curi, treba majstor.', ru:'Кран течёт, нужен мастер.' },
          { sr:'Klima je pokvarena.', ru:'Кондиционер сломан.' },
          { sr:'Možete li da popravite danas?', ru:'Можете починить сегодня?', fb:'«Danas» — смелая заявка. Готовься к «sutra».' },
        ] },
    ],
  },
  {
    id:'u23', emoji:'📅', title:'Планови и позиви', sub:'Договориться о встрече', level:3, theme:'vibe',
    lessons: [
      { id:'u23l1', title:'Зовём гулять', words:['plan','vikend','pozvati','slobodan','zauzet','kasnije','ranije','hajde','dogovoreno','izlazak'],
        tip:{ title:'«Hajde na kafu»', text:'«Hajde na kafu» — не про кофе, а про «давай увидимся». Соглашаешься — отвечаешь «Može!» или «Dogovoreno!». Так заводят друзей.' },
        situation: { q:'Тебе пишут «Hajde na kafu u subotu?». Дружелюбный ответ:', ai:0, opts:[
          { t:'«Može! Dogovoreno.»', why:'Идеально. Тёплое согласие в два слова — ты уже почти локалац.' },
          { t:'«Pošaljite повестку дня встречи»', why:'Слишком по-офисному. «Kafa» — это про общение, а не про регламент.' },
          { t:'Не отвечать', why:'Жаль: «hajde na kafu» — это приглашение в круг своих. Лучше согласиться.' },
        ] } },
    ],
  },
  {
    id:'u24', emoji:'⏳', title:'Јуче и сутра', sub:'Прошлое и будущее', level:3, theme:'grammar',
    lessons: [
      { id:'u24l1', title:'Был и буду', words:['bio_sam','juce','sinoc','prosle_nedelje','sledece_nedelje','bicu','kupio_sam','bilo_je_lepo'],
        tip:{ title:'Прошедшее = «sam» + причастие', text:'«Bio sam» (я был), «kupio sam» (я купил). Берёшь «sam/si/je…» и причастие на -o (он) / -la (она). Звучит сложно — на деле как русское «-л».' },
        grammar: [
          { q:'Juče ___ na pijaci.', hint:'Вчера я был(а) на рынке.', opts:['sam bio','sam','je bio','bio'], a:'sam bio' },
          { q:'Sutra ___ doći.', hint:'Завтра я приду (букв. буду прийти).', opts:['ću','sam','je','biću'], a:'ću' },
        ],
        sentences: [
          { sr:'Sinoć je bilo lepo.', me:'Sinoć je bilo lijepo.', ru:'Вчера вечером было хорошо.' },
          { sr:'Prošle nedelje sam putovao.', me:'Prošle nedjelje sam putovao.', ru:'На прошлой неделе я путешествовал.' },
          { sr:'Sledeće nedelje ću raditi.', me:'Sljedeće nedjelje ću raditi.', ru:'На следующей неделе буду работать.' },
        ] },
    ],
  },

  // ════════════ УРОВЕНЬ 4 · B1 «Торгуюсь на пияце» ════════════
  {
    id:'u25', emoji:'🧑', title:'Какав је он?', sub:'Описать характер', level:4, theme:'intro',
    lessons: [
      { id:'u25l1', title:'Какие люди', words:['karakter','ozbiljan','smesno','pametan','simpatican','iskren','opusten','dosadan','lud','ponekad'],
        tip:{ title:'«Lud» — это комплимент', text:'«Lud si, brate!» дословно «ты сумасшедший» — но почти всегда это «ну ты даёшь, красавчик!». Тон решает всё. Балканы любят гиперболу.' },
        sentences: [
          { sr:'On je baš simpatičan i opušten.', ru:'Он очень милый и расслабленный.' },
          { sr:'Komšija je ozbiljan, ali iskren.', ru:'Сосед серьёзный, но честный.' },
          { sr:'Ponekad je smešno, ponekad dosadno.', me:'Ponekad je smiješno, ponekad dosadno.', ru:'Иногда смешно, иногда скучно.' },
        ] },
    ],
  },
  {
    id:'u26', emoji:'🍽️', title:'У ресторану', sub:'Заказать и оценить', level:4, theme:'food',
    lessons: [
      { id:'u26l1', title:'В ресторане', words:['jelovnik','specijalitet','preporuka','porcija','naruciti','dodatak','pregoreno','sveze','baksis','zaliti_se'],
        tip:{ title:'Спроси «specijalitet»', text:'Не знаешь, что взять — спроси «Koji je specijalitet kuće?» (фирменное блюдо). Конобар расцветёт и принесёт лучшее. И, скорее всего, добавку.' },
        situation: { q:'Принесли пересоленное блюдо. Как по-балкански вежливо сказать?', ai:0, opts:[
          { t:'Спокойно: «Izvinite, malo je preslano.»', why:'Идеально. Вежливо, без скандала — почти всегда заменят и извинятся. Конфликт тут не в чести.' },
          { t:'Громко возмутиться на весь зал', why:'Перебор. Балканы решают вопросы тихо и по-человечески, за это ценят.' },
          { t:'Молча съесть и больше не прийти', why:'Зачем? Скажешь спокойно — поймут и исправят. «Žaliti se» иногда полезно.' },
        ] } },
    ],
  },
  {
    id:'u27', emoji:'🤝', title:'Ценкање и рекламације', sub:'Торг и возврат', level:4, theme:'shop',
    lessons: [
      { id:'u27l1', title:'Торгуемся', words:['cenkati_se','poslednja_cena','zamena','vratiti','reklamacija','garancija','ne_radi','gotovina','sitno','preskupo'],
        tip:{ title:'«Koja je poslednja cena?»', text:'Ритуал торга на пияце: «Koja je poslednja cena?» (какая последняя цена?). Продавец «подумает», скинет чуть-чуть — и оба довольны. Это не жадность, это общение.' },
        sentences: [
          { sr:'To je preskupo, dajte popust.', ru:'Это слишком дорого, дайте скидку.' },
          { sr:'Telefon ne radi, hoću zamenu.', me:'Telefon ne radi, hoću zamjenu.', ru:'Телефон не работает, хочу обмен.' },
          { sr:'Imate li sitno?', ru:'У вас есть мелочь?' },
          { sr:'Plaćam gotovinom.', ru:'Плачу наличными.' },
        ] },
    ],
  },
  {
    id:'u28', emoji:'🚨', title:'Кад крене наопако', sub:'Поломки и форс-мажор', level:4, theme:'transport',
    lessons: [
      { id:'u28l1', title:'Проблемы в пути', words:['kvar','guma','benzin','pumpa','kazna','guzva','zakasniti','propustiti','presedanje','pomoc'],
        tip:{ title:'«Gužva» объясняет всё', text:'Опоздал? Универсальное объяснение — «bila je gužva» (была пробка/толпа/движуха). Принимается всеми и всегда. Главное балканское алиби.' },
        sentences: [
          { sr:'Auto je u kvaru, treba mi pomoć.', ru:'Машина сломалась, мне нужна помощь.' },
          { sr:'Zakasnio sam zbog gužve.', ru:'Я опоздал из-за пробки.' },
          { sr:'Gde je najbliža pumpa?', me:'Gdje je najbliža pumpa?', ru:'Где ближайшая заправка?' },
        ] },
    ],
  },
  {
    id:'u29', emoji:'⚖️', title:'Озбиљна бирократија', sub:'Заявления, сроки, апелляции', level:4, theme:'docs',
    lessons: [
      { id:'u29l1', title:'Бюрократия глубже', words:['zahtev','overa','sudski_tumac','advokat','zalba','rok','vazi','istekao','produzenje','nadlezni'],
        tip:{ title:'«Važi» — слово-хамелеон', text:'«Važi» — это и «действителен» (про документ), и разговорное «ок, договорились». «Pasoš važi do 2030.» и «Vidimo se sutra? — Važi!» — одно слово, два мира.' },
        situation: { q:'Сказали, что срок документа «istekao» (истёк). Первый шаг:', ai:0, opts:[
          { t:'Спросить про «produženje» и нужные бумаги', why:'Верно. Истёк — не катастрофа, а повод для «produženje» (продления). Узнай список бумаг и бери термин.' },
          { t:'Сдаться и уехать домой', why:'Слишком драматично. Истёкший срок продлевают — это рутина, не приговор.' },
          { t:'Спорить, что это ошибка', why:'Сначала проверь даты. Если правда истёк — спокойно оформляй продление.' },
        ] } },
    ],
  },
  {
    id:'u30', emoji:'🔑', title:'Уговор и газда', sub:'Аренда без сюрпризов', level:4, theme:'home',
    lessons: [
      { id:'u30l1', title:'Снимаем жильё', words:['vlasnik','stanar','depozit','rezije','useliti_se','iseliti_se','namesteno','buka','otkaz','dogovor'],
        tip:{ title:'Спроси про «režije»', text:'Перед подписанием уточни: «Da li su režije uključene?» (коммуналка входит в цену?). «Režije» (свет, вода, мусор) умеют незаметно удваивать кирию.' },
        sentences: [
          { sr:'Da li je depozit obavezan?', ru:'Залог обязателен?' },
          { sr:'Stan je namešten?', me:'Stan je namješten?', ru:'Квартира с мебелью?' },
          { sr:'Komšije prave buku noću.', ru:'Соседи шумят по ночам.', fb:'Или это свадьба. На Балканах граница тонкая.' },
        ] },
    ],
  },
  {
    id:'u31', emoji:'💬', title:'Слажем се? Не баш', sub:'Согласие и спор по-доброму', level:4, theme:'vibe',
    lessons: [
      { id:'u31l1', title:'Спорим вежливо', words:['slazem_se','ne_slazem_se','u_pravu_si','greska','izvini','salim_se','ozbiljno','nema_sanse','svasta','tacno'],
        tip:{ title:'«Šalim se» спасает', text:'Пошутил, а лицо у собеседника дрогнуло? Скажи «šalim se!» (шучу!) — и всё в порядке. Балканский юмор острый, но «šalim se» — встроенный огнетушитель.' },
        situation: { q:'Друг с жаром доказывает, что бурек надо есть только с йогуртом. Ты не согласен. Мягкий ответ:', ai:0, opts:[
          { t:'«Možda si u pravu, ali ja volim drugačije.»', why:'Дипломатия 10/10: и уважил, и остался при своём. Споры о буреке — святое, но дружбу берегут.' },
          { t:'«Nema šanse, grešiš!»', why:'Слишком резко для такой мелочи. Прибереги «nema šanse» для торга на пияце.' },
          { t:'Молча обидеться', why:'Из-за бурека? Тут спорят с азартом, но без обид. Отвечай и улыбайся.' },
        ] } },
    ],
  },
  {
    id:'u32', emoji:'🔁', title:'Вид и повратни', sub:'Совершенный вид и «-ся»', level:4, theme:'grammar',
    lessons: [
      { id:'u32l1', title:'Глаголы хитрее', words:['osecati_se','secati_se','nadati_se','druziti_se','kupovati','reci','hteo_bih','trebalo_bi'],
        tip:{ title:'«Se» = русское «-ся»', text:'«Osećam se» (чувствую себя), «sećam se» (помню/вспоминаю), «družim se» (общаюсь). Частица «se» работает как русское «-ся» — твоя интуиция почти всегда права.' },
        grammar: [
          { q:'Kako se ___?', hint:'Как ты себя чувствуешь?', opts:['osećaš','osećam','oseća','osećamo'], a:'osećaš' },
          { q:'___ kafu, molim.', hint:'Я бы хотел кофе (вежливо).', opts:['Hteo bih','Hoću','Želim','Treba'], a:'Hteo bih' },
        ],
        sentences: [
          { sr:'Nadam se da ćeš doći.', ru:'Надеюсь, ты придёшь.' },
          { sr:'Volim da se družim s komšijama.', ru:'Люблю общаться с соседями.' },
          { sr:'Trebalo bi da produžim boravak.', ru:'Мне следовало бы продлить боравак.' },
        ] },
    ],
  },

  // ════════════ УРОВЕНЬ 5 · B2 «Почти локалац» ════════════
  {
    id:'u33', emoji:'🌟', title:'Моја прича', sub:'Рассказать свою историю', level:5, theme:'intro',
    lessons: [
      { id:'u33l1', title:'Опыт и мечты', words:['detinjstvo','iskustvo','uspomena','san','cilj','ponosan','promena','odluka','izazov','zbog'],
        tip:{ title:'«Promena» как образ жизни', text:'Переезд — большая «promena» (перемена) и «izazov» (вызов). Местные это уважают: расскажешь свою историю по-сербски — и ты сразу «svoj čovek».' },
        sentences: [
          { sr:'Preselila sam se zbog posla.', ru:'Я переехала из-за работы.' },
          { sr:'To je bila teška odluka.', ru:'Это было трудное решение.' },
          { sr:'Ponosan sam na svoj napredak.', ru:'Я горжусь своим прогрессом.' },
          { sr:'Život na Balkanu je izazov i avantura.', ru:'Жизнь на Балканах — это вызов и приключение.' },
        ] },
    ],
  },
  {
    id:'u34', emoji:'🥘', title:'Кухиња и слава', sub:'Кулинарная культура', level:5, theme:'food',
    lessons: [
      { id:'u34l1', title:'Праздничный стол', words:['domace','slava','post','zacin','zimnica','sarma','gibanica','ajvar','pecenje','kuvar'],
        tip:{ title:'Что такое «slava»', text:'«Slava» — семейный праздник святого-покровителя, сердце сербской традиции. Позвали на славу — это большая честь. Идёшь голодным, уходишь переевшим и счастливым.' },
        situation: { q:'Сосед зовёт на «slavu». Что прихватить и как себя вести?', ai:0, opts:[
          { t:'Цветы или вино, и приготовиться много есть', why:'Идеально. На славу приходят с небольшим подарком и пустым желудком — стол будет ломиться, отказы не принимаются.' },
          { t:'Прийти со своей едой', why:'Не нужно: накормят так, что неделю не проголодаешься. Лучше скромный подарок хозяевам.' },
          { t:'Вежливо отказаться — неудобно', why:'Наоборот, приглашение на славу — знак большого доверия. Отказ обидит сильнее, чем съеденная третья порция.' },
        ] } },
    ],
  },
  {
    id:'u35', emoji:'⭐', title:'Квалитет и мишљење', sub:'Оценить и посоветовать', level:5, theme:'shop',
    lessons: [
      { id:'u35l1', title:'Стоит ли брать', words:['kvalitet','domaci_proizvod','uvozno','preporucujem','vredi','prevara','misljenje','po_meni','pouzdano','razumna_cena'],
        tip:{ title:'«Domaće» бьёт «uvozno»', text:'В разговоре о покупках «domaći proizvod» (местное) почти всегда хвалят больше, чем «uvozno» (импортное). Сыр, мёд, ракия — «domaće» звучит как знак качества.' },
        sentences: [
          { sr:'Po meni, ovo vredi para.', me:'Po meni, ovo vrijedi para.', ru:'По-моему, это стоит своих денег.' },
          { sr:'Preporučujem domaći sir.', ru:'Рекомендую местный сыр.' },
          { sr:'To je prevara, ne vredi.', me:'To je prevara, ne vrijedi.', ru:'Это развод, не стоит того.' },
        ] },
    ],
  },
  {
    id:'u36', emoji:'🗺️', title:'Авантуре на путу', sub:'Истории путешествий', level:5, theme:'transport',
    lessons: [
      { id:'u36l1', title:'Дорожные байки', words:['avantura','dozivljaj','izgubiti_se','slucajno','na_kraju','ispostavilo','priroda','pejzaz','nezaboravno','vredelo'],
        tip:{ title:'Лучшие места — «slučajno»', text:'Самые красивые места на Балканах находишь «slučajno» (случайно), когда «izgubiš se» (заблудишься). Свернул не туда — а там каньон, водопад и дед с лучшей ракией.' },
        sentences: [
          { sr:'Izgubili smo se, ali je vredelo.', me:'Izgubili smo se, ali je vrijedilo.', ru:'Мы заблудились, но оно того стоило.' },
          { sr:'Ispostavilo se da je pejzaž nezaboravan.', ru:'Оказалось, что пейзаж незабываемый.' },
          { sr:'Priroda ovde je čudo.', me:'Priroda ovdje je čudo.', ru:'Природа здесь — чудо.' },
        ] },
    ],
  },
  {
    id:'u37', emoji:'🛂', title:'Држављанство и стрпљење', sub:'Высшая бюрократия', level:5, theme:'docs',
    lessons: [
      { id:'u37l1', title:'Долгий путь бумаг', words:['drzavljanstvo','prebivaliste','boravisna','poreska','penzija','osiguranje','strpljenje','procedura','ipak','konacno'],
        tip:{ title:'«Strpljenje» — твой главный документ', text:'Между «boravišna dozvola» и «državljanstvo» лежат годы «procedura» и тонна «strpljenje» (терпения). Зато «konačno» (наконец-то) звучит как фанфары.' },
        situation: { q:'Процедура тянется второй год, и хочется всё бросить. Балканская мудрость подсказывает:', ai:0, opts:[
          { t:'«Polako, na kraju će ipak uspeti.»', why:'Тот самый дзен: «потихоньку, в итоге всё же получится». Бюрократию тут побеждают терпением, а не нервами.' },
          { t:'Завалить всех жалобами разом', why:'«Žalba» иногда нужна, но ковровая бомбардировка только злит «nadležne». Терпение работает лучше.' },
          { t:'Бросить и не пытаться', why:'После стольких бумаг? «Konačno» уже близко. Ещё чуть-чуть strpljenja.' },
        ] } },
    ],
  },
  {
    id:'u38', emoji:'🎉', title:'Комшилук и дружење', sub:'Соседи и посиделки', level:5, theme:'home',
    lessons: [
      { id:'u38l1', title:'Жизнь во дворе', words:['naselje','zajednica','druzenje','rostilj','proslava','pozajmiti','gostoprimstvo','prijateljstvo','uvek','zauvek'],
        tip:{ title:'«Roštilj» — это дружба', text:'Запах «roštilj» во дворе — сигнал сбора. Тебя позовут, даже если вы знакомы один день. Отказаться можно, но «gostoprimstvo» (гостеприимство) тут не принимает «не».' },
        sentences: [
          { sr:'Komšije su nas pozvale na roštilj.', ru:'Соседи позвали нас на барбекю.' },
          { sr:'Možeš li da mi pozajmiš so?', ru:'Можешь одолжить мне соль?' },
          { sr:'Gostoprimstvo je ovde sveto.', me:'Gostoprimstvo je ovdje sveto.', ru:'Гостеприимство здесь — это святое.' },
        ] },
    ],
  },
  {
    id:'u39', emoji:'🧠', title:'Мишљења и култура', sub:'Высказать мнение', level:5, theme:'vibe',
    lessons: [
      { id:'u39l1', title:'Что я думаю', words:['mislim_da','cini_mi_se','zapravo','uglavnom','tradicija','obicaj','mentalitet','dusa','ponos','s_jedne_strane'],
        tip:{ title:'«Čovek od duše»', text:'Высшая похвала человеку — «čovek od duše» (человек с душой). Балканы ценят душевность выше пунктуальности: лучше опоздать, но прийти от сердца.' },
        sentences: [
          { sr:'Mislim da je to lepa tradicija.', me:'Mislim da je to lijepa tradicija.', ru:'Думаю, это красивая традиция.' },
          { sr:'Čini mi se da uglavnom imaš pravo.', ru:'Мне кажется, ты в основном прав.' },
          { sr:'Zapravo, mentalitet ovde je topao.', me:'Zapravo, mentalitet ovdje je topao.', ru:'На самом деле менталитет здесь тёплый.' },
        ] },
    ],
  },
  {
    id:'u40', emoji:'🔗', title:'Везници', sub:'Связываем фразы: jer, ako, iako', level:5, theme:'grammar',
    lessons: [
      { id:'u40l1', title:'Сложные предложения', words:['jer','zato_sto','iako','ako','kad','dok','umesto','osim','zato','mada'],
        tip:{ title:'Союзы превращают слова в речь', text:'«Jer» (потому что), «ako» (если), «iako» (хотя) — мостики между мыслями. С ними ты не «говоришь слова», а рассказываешь: «Učim jezik jer volim ovu zemlju».' },
        grammar: [
          { q:'Učim srpski ___ volim Balkan.', hint:'…потому что люблю Балканы.', opts:['jer','ako','iako','dok'], a:'jer' },
          { q:'___ pada kiša, ostajemo kući.', hint:'Если идёт дождь, остаёмся дома.', opts:['Ako','Jer','Iako','Osim'], a:'Ako' },
          { q:'Idem napolje ___ pada kiša.', hint:'Иду гулять, хотя идёт дождь.', opts:['iako','jer','ako','zato'], a:'iako' },
        ],
        sentences: [
          { sr:'Ostajem ovde jer volim ljude.', me:'Ostajem ovdje jer volim ljude.', ru:'Я остаюсь здесь, потому что люблю людей.' },
          { sr:'Iako je teško, vredi.', me:'Iako je teško, vrijedi.', ru:'Хотя трудно, оно того стоит.' },
        ] },
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
  { xp:10, name:'Полако',      desc:'Одна короткая тренировка в день: повторение или разбор ошибок.' },
  { xp:20, name:'Стабильно',   desc:'Один новый урок в день — и совесть в порядке.' },
  { xp:40, name:'Вук Караџић', desc:'Урок и тренировка каждый день. Режим лингвиста-реформатора.' },
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
  { id:'streak30',  emoji:'🏛️', name:'Месец дана',          desc:'30 дней занятий. Уже не подвиг, а образ жизни.', test:u => Object.keys(u.history).length >= 30 },
  { id:'words25',   emoji:'📚', name:'25 речи',             desc:'25 слов в копилке.', test:u => knownCount(u) >= 25 },
  { id:'words50',   emoji:'🎓', name:'Пола стотине',        desc:'50 слов. Бабушки на пияце уже почти понимают тебя.', test:u => knownCount(u) >= 50 },
  { id:'words100',  emoji:'🏆', name:'Жива легенда',        desc:'100 слов. Комшия гордится.', test:u => knownCount(u) >= 100 },
  { id:'words200',  emoji:'🦉', name:'Двеста речи',         desc:'200 слов. Кафана затихает, когда ты говоришь.', test:u => knownCount(u) >= 200 },
  { id:'review10',  emoji:'🧠', name:'Мајстор повторения',  desc:'10 сессий повторения. Интервальный метод работает.', test:u => (u.reviews || 0) >= 10 },
  { id:'perfect',   emoji:'💎', name:'Без грешке',          desc:'Урок без единой ошибки.', test:u => !!(u.flags && u.flags.perfect) },
];
