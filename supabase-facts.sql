-- ── Балканские факты: правятся в админке, приложение подтягивает онлайн ──
-- Запусти этот файл целиком в Supabase → SQL Editor → Run. Повторный запуск безопасен:
-- твои правки существующих фактов не затираются (on conflict do nothing).

create table if not exists facts (
  id text primary key,
  lang text not null check (lang in ('ru','en')),
  title text not null check (char_length(title) <= 80),
  body text not null check (char_length(body) <= 300),
  sort int not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table facts enable row level security;
drop policy if exists facts_read_all on facts;
create policy facts_read_all on facts
  for select to anon, authenticated using (active);
drop policy if exists facts_admin_all on facts;
create policy facts_admin_all on facts
  for all to authenticated using (is_admin()) with check (is_admin());

-- стартовый набор: 24 факта × RU и EN (те же, что вшиты в приложение как фолбэк)
insert into facts (id, lang, title, body, sort) values
  ('f01-ru','ru','Город котов','Котор — кошачья столица Адриатики: котов тут кормит весь город, у них есть свой музей. Жарко подтверждает: с ними лучше дружить.',1),
  ('f02-ru','ru','Кофе — это ритуал','«Домаћа кафа» варится в джезве и пьётся минимум полчаса. Заказать «эспрессо с собой» можно, но бариста погрустнеет.',2),
  ('f03-ru','ru','Слатко для гостя','В сербском доме гостю первым делом подают слатко — ложечку варенья и стакан воды. Отказываться не принято. Да и зачем.',3),
  ('f04-ru','ru','Пиши как говоришь','Вук Караджич перестроил сербский по принципу «пиши, как говоришь» — поэтому тут смело пишут kompjuter, vikend и onlajn.',4),
  ('f05-ru','ru','Пеликаны Скадара','На Скадарском озере живут кудрявые пеликаны — одни из самых больших летающих птиц Европы. Жарко считает их двоюродными.',5),
  ('f06-ru','ru','Чемпионат по лежанию','В черногорском селе Брезна проводят чемпионат по лежанию: кто дольше пролежал — тот и победил. Полако — это спорт.',6),
  ('f07-ru','ru','Мерак','«Merak» — балканское слово про удовольствие от простых вещей: кофе, закат, разговор. Перевода нет, есть только практика.',7),
  ('f08-ru','ru','Крепость-парк','Калемегдан в Белграде — древняя крепость, ставшая главным парком: шахматисты, свидания и лучший закат над двумя реками.',8),
  ('f09-ru','ru','Коло вертится','Балканский танец коло — в списке ЮНЕСКО: взялись за руки — и по кругу. Уметь не обязательно: затянут и научат.',9),
  ('f10-ru','ru','Сто пекар','Пекара — главный институт после кафаны. Бурек с йогуртом на завтрак — это не еда, это мировоззрение.',10),
  ('f11-ru','ru','Из лета в зиму','В Черногории можно утром купаться в море, а днём играть в снежки на Дурмиторе — между сезонами час дороги.',11),
  ('f12-ru','ru','Чьи чевапи?','Чевапи считают «своими» сразу все балканские страны. Это самый вкусный спор региона — и единственный, который решается добавкой.',12),
  ('f13-ru','ru','Сезон айвара','В сентябре балканские дворы пахнут печёной паприкой: семьи закатывают айвар на год вперёд. Рецепт у каждой свой, и он правильный.',13),
  ('f14-ru','ru','Где си?','«Gde si?» — это не «где ты?», а «привет, рад тебя видеть». Отвечать координатами не нужно — достаточно улыбнуться и спросить то же самое.',14),
  ('f15-ru','ru','Промаја','Главный враг балканца — промаја, сквозняк. От него закрывают окна в жару и лечатся кафой. Спорить бесполезно: промаја старше науки.',15),
  ('f16-ru','ru','Старше пирамид','Культура Винча под Белградом — одно из древнейших поселений Европы: ей больше семи тысяч лет. Люди тут пили кофе у двух рек задолго до моды.',16),
  ('f17-ru','ru','Каньон Тары','Каньон реки Тары в Черногории — до 1300 метров глубины, глубже только Гранд-Каньон. Рафтинг по «слезе Европы» — местный способ побыть полако наоборот.',17),
  ('f18-ru','ru','Бока — не фьорд','Которский залив называют самым южным «фьордом» Европы. Географы ворчат, что это затопленный каньон. Красоте — всё равно.',18),
  ('f19-ru','ru','Тесла повсюду','Никола Тесла — на динарах, в названии белградского аэропорта и в сердце каждого серба. Спорить, чей Тесла, — отдельный балканский спорт.',19),
  ('f20-ru','ru','Слава','Слава — сербский семейный праздник святого-покровителя дома, внесён в список ЮНЕСКО. Гостей кормят так, что уйти голодным технически невозможно.',20),
  ('f21-ru','ru','Кафана не торопит','В кафане можно сидеть три часа с одной кафой — счёт не принесут, пока сам не попросишь. Торопить гостя тут считается дурным тоном.',21),
  ('f22-ru','ru','Олива-долгожитель','Старой маслине в Баре — больше двух тысяч лет, одна из старейших олив Европы. Пережила империи, а оливки даёт до сих пор. Полако работает.',22),
  ('f23-ru','ru','Четыре по цене одного','Сербский, черногорский, хорватский и боснийский взаимопонятны. Учишь один — здороваешься в четырёх странах. Выгоднее только бурек.',23),
  ('f24-ru','ru','Кафана «?»','Старейшая кафана Белграда называется «?» — «Знак питања». Имя не придумали за двести лет, и так даже лучше: вопрос есть, ответ — кафа.',24),
  ('f01-en','en','The city of cats','Kotor is the cat capital of the Adriatic: the whole town feeds them and they have their own museum. Žarko confirms: better to be friends.',1),
  ('f02-en','en','Coffee is a ritual','“Domaća kafa” is brewed in a džezva and sipped for at least half an hour. You can order espresso to go, but the barista will be sad.',2),
  ('f03-en','en','Slatko for the guest','In a Serbian home a guest is first offered slatko — a spoonful of preserve and a glass of water. Declining isn’t customary. Why would you?',3),
  ('f04-en','en','Write as you speak','Vuk Karadžić rebuilt Serbian on the principle “write as you speak” — hence kompjuter, vikend and onlajn, written fearlessly.',4),
  ('f05-en','en','Skadar pelicans','Lake Skadar hosts Dalmatian pelicans — among Europe’s largest flying birds. Žarko considers them cousins.',5),
  ('f06-en','en','The lying-down championship','The Montenegrin village of Brezna holds a lying-down championship: whoever lies longest wins. Polako is a sport.',6),
  ('f07-en','en','Merak','“Merak” is the Balkan word for pleasure in simple things: coffee, sunset, a chat. No translation exists — only practice.',7),
  ('f08-en','en','The fortress-park','Kalemegdan in Belgrade is an ancient fortress turned main park: chess players, dates and the best sunset over two rivers.',8),
  ('f09-en','en','The kolo turns','The Balkan circle dance kolo is on the UNESCO list: join hands and go round. No skill needed — they’ll pull you in and teach you.',9),
  ('f10-en','en','A hundred bakeries','The pekara is the main institution after the kafana. Burek with yoghurt for breakfast isn’t food — it’s a worldview.',10),
  ('f11-en','en','Summer to winter','In Montenegro you can swim in the sea in the morning and have a snowball fight on Durmitor by noon — the seasons are an hour’s drive apart.',11),
  ('f12-en','en','Whose ćevapi?','Every Balkan nation claims ćevapi as its own. It’s the region’s tastiest argument — and the only one settled by ordering more.',12),
  ('f13-en','en','Ajvar season','In September Balkan courtyards smell of roasted peppers: families jar ajvar for the whole year. Every family has its own recipe, and it’s the correct one.',13),
  ('f14-en','en','Gde si?','“Gde si?” isn’t really “where are you?” — it’s “hey, good to see you”. No coordinates needed: smile and ask the same back.',14),
  ('f15-en','en','Promaja','The Balkans’ greatest enemy is promaja, the draught. Windows close against it in a heatwave; kafa cures it. Don’t argue — promaja predates science.',15),
  ('f16-en','en','Older than the pyramids','The Vinča culture near Belgrade is one of Europe’s oldest settlements — over seven thousand years old. People enjoyed life by these two rivers long before it was trendy.',16),
  ('f17-en','en','Tara Canyon','The Tara river canyon in Montenegro runs up to 1,300 metres deep — only the Grand Canyon goes deeper. Rafting the “tear of Europe” is the local way to do polako in reverse.',17),
  ('f18-en','en','Boka is not a fjord','The Bay of Kotor is called Europe’s southernmost “fjord”. Geographers grumble it’s a drowned river canyon. The beauty doesn’t care.',18),
  ('f19-en','en','Tesla everywhere','Nikola Tesla is on the dinar notes, in the name of Belgrade’s airport and in every Serbian heart. Arguing over whose Tesla he is — a separate Balkan sport.',19),
  ('f20-en','en','Slava','Slava is the Serbian family feast of the household patron saint, on the UNESCO list. Guests are fed so well that leaving hungry is technically impossible.',20),
  ('f21-en','en','The kafana never rushes you','You can sit in a kafana for three hours over one kafa — the bill won’t come until you ask. Rushing a guest is simply bad manners here.',21),
  ('f22-en','en','The elder olive','Stara Maslina in Bar is over two thousand years old — one of Europe’s oldest olive trees. It outlived empires and still bears olives. Polako works.',22),
  ('f23-en','en','Four for the price of one','Serbian, Montenegrin, Croatian and Bosnian are mutually intelligible. Learn one — greet people in four countries. Only burek is a better deal.',23),
  ('f24-en','en','The “?” kafana','Belgrade’s oldest kafana is called “?” — Znak pitanja. Two hundred years and still no proper name. Even better: the question stands, the answer is kafa.',24)
on conflict (id) do nothing;
