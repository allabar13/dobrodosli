"use strict";
// ── Английский контент курса ──────────────────────────────────────────────
// При языке EN подменяет русские тексты в данных НА МЕСТЕ (data.js уже
// загружен). Рендеры продолжают читать те же поля — ничего не ломается.
(() => {
  if (I18N.lang !== 'en') return;

  // ── переводы слов: id → английская глосса ──
  const W = {
    // u1
    dobrodosli:'welcome', zdravo:'hi / hello', cao:'hi / bye', dobar_dan:'good afternoon', hvala:'thank you',
    molim:'please', da:'yes', ne:'no', dobro_jutro:'good morning', dobro_vece:'good evening', laku_noc:'good night',
    izvinite:'excuse me / sorry', dovidjenja:'goodbye', kako_si:'how are you?', dobro_sam:'I’m fine', vidimo_se:'see you',
    // u2
    kafa:'coffee', pivo:'beer', vino:'wine', rakija:'rakija (fruit brandy)', voda:'water', sok:'juice', caj:'tea',
    hleb:'bread', sir:'cheese', burek:'burek (savoury pie)', kajmak:'kajmak (creamy spread)', racun:'the bill',
    konobar:'waiter', ziveli:'cheers!', prijatno:'bon appétit',
    // u3
    jedan:'one', dva:'two', tri:'three', cetiri:'four', pet:'five', sest:'six', sedam:'seven', osam:'eight',
    devet:'nine', deset:'ten', sto:'hundred', hiljada:'thousand', pare:'money (colloquial)', koliko_kosta:'how much is it?',
    skupo:'expensive', jeftino:'cheap', pijaca:'farmers market', kusur:'change (money)',
    // u4
    grad:'city', ulica:'street', trg:'square', pekara:'bakery', apoteka:'pharmacy', prodavnica:'shop',
    posta:'post office', stanica:'stop, station', autobus:'bus', gde_je:'where is…?', levo:'left', desno:'right',
    pravo:'straight ahead', blizu:'near', daleko:'far',
    // u5
    papiri:'papers, documents', pasos:'passport', viza:'visa', boravak:'residence permit', beli_karton:'“white card” registration',
    potvrda:'certificate', ugovor:'contract', salter:'counter window', red:'queue', cekati:'to wait', sutra:'tomorrow',
    danas:'today', ponedeljak:'Monday', radno_vreme:'working hours',
    // u6
    stan:'apartment', kuca:'house', soba:'room', kirija:'rent', kljuc:'key', terasa:'terrace, balcony',
    gazda:'landlord', struja:'electricity', grejanje:'heating', internet:'internet', komsija:'neighbour', macka:'cat',
    // u7
    polako:'take it easy', nema_problema:'no problem', nema_veze:'never mind', moze:'sure / OK', naravno:'of course',
    mozda:'maybe', prijatelj:'friend', sunce:'sun', kisa:'rain', more:'sea', planina:'mountain', lepo:'nice, beautiful',
    vreme:'weather; time', ljudi:'people',
    // u8
    biti:'to be', imati:'to have', znati:'to know', razumeti:'to understand', hteti:'to want', moci:'can, to be able',
    govoriti:'to speak', uciti:'to learn', raditi:'to work, to do', ziveti:'to live',
    // u9
    zovem_se:'my name is', ime:'first name', prezime:'surname', odakle_si:'where are you from?', iz_rusije:'from Russia',
    drago_mi_je:'nice to meet you', godine:'years (age)', ovde:'here', tamo:'there', sada:'now',
    // u10
    ukus:'taste', ukusno:'tasty', slatko:'sweet', slano:'salty', kiselo:'sour', ljuto:'spicy', gorko:'bitter',
    gladan:'hungry', zedan:'thirsty', meso:'meat', riba:'fish', povrce:'vegetables', voce:'fruit',
    // u11
    kupiti:'to buy', prodavac:'shop assistant', velicina:'size', veliko:'big', maleno:'small', boja:'colour',
    crveno:'red', plavo:'blue', zeleno:'green', belo:'white', crno:'black', kesa:'plastic bag',
    // u12
    voz:'train', avion:'plane', taksi:'taxi', karta2:'ticket', peske:'on foot', brzo:'fast', sporo:'slow',
    kasni:'is late', polazak:'departure', dolazak:'arrival', kuda:'where to',
    // u13
    termin:'appointment', prijava:'application, registration', broj:'number', datum:'date', mesec:'month',
    godina:'year', potpis:'signature', pecat:'stamp', kopija:'copy', hitno:'urgent',
    // u14
    kuhinja:'kitchen', kupatilo:'bathroom', spavaca_soba:'bedroom', sto2:'table', stolica:'chair', krevet:'bed',
    frizider:'fridge', sporet:'stove', prozor:'window', vrata:'door', cisto:'clean', prljavo:'dirty',
    // u15
    kako_ide:'how’s it going?', umoran:'tired', srecan:'happy', tuzan:'sad', dosadno:'boring', zanimljivo:'interesting',
    super:'great', odlicno:'excellent', bas:'really, so', stvarno:'really? seriously?',
    // u16
    ici:'to go', doci:'to come', zeleti:'to wish, to want', trebati:'to need', voleti:'to love', jesti:'to eat',
    piti:'to drink', spavati:'to sleep',
    // u17
    roden:'born', porodica:'family', posao:'job, work', studiram:'I study (at university)', ozenjen:'married (man)',
    udata:'married (woman)', dete:'child', jezik:'language', vec:'already', tek:'only just',
    // u18
    recept:'recipe', sastojci:'ingredients', brasno:'flour', jaje:'egg', so:'salt', secer:'sugar', ulje:'oil',
    luk:'onion', beli_luk:'garlic', krompir:'potato', kuvati:'to cook, to boil', prziti:'to fry', seckati:'to chop',
    // u19
    jeftinije:'cheaper', skuplje:'more expensive', bolje:'better', gore:'worse', vise:'more', manje:'less',
    popust:'discount', akcija:'sale, special offer', pola:'half', komad:'piece', zajedno:'together',
    // u20
    put:'trip, road', putovati:'to travel', granica:'border', prtljag:'luggage', kofer:'suitcase',
    rezervacija:'reservation', smestaj:'accommodation', mapa:'map', most:'bridge', raskrsnica:'crossroads',
    // u21
    banka:'bank', bankovni_racun:'bank account', kartica:'card (bank)', novac:'money (formal)', uplata:'payment, deposit',
    broj_telefona:'phone number', otkazati:'to cancel', produziti:'to extend', lekar:'doctor', osiguranje2:'health insurance',
    // u22
    popraviti:'to fix', pokvareno:'broken', curi:'is leaking', sijalica:'light bulb', slavina:'tap', klima:'air conditioner',
    majstor:'repairman', cistiti:'to clean', oprati:'to wash', smece:'rubbish',
    // u23
    plan:'plan', vikend:'weekend', pozvati:'to invite, to call', slobodan:'free (not busy)', zauzet:'busy',
    kasnije:'later', ranije:'earlier', hajde:'come on, let’s', dogovoreno:'agreed, deal', izlazak:'going out',
    // u24
    bio_sam:'I was', juce:'yesterday', sinoc:'last night', prosle_nedelje:'last week', sledece_nedelje:'next week',
    bicu:'I will be', kupio_sam:'I bought', bilo_je_lepo:'it was nice',
    // u25
    karakter:'character', ozbiljan:'serious', smesno:'funny', pametan:'smart', simpatican:'likeable, cute',
    iskren:'honest', opusten:'relaxed, laid-back', dosadan:'boring (person)', lud:'crazy', ponekad:'sometimes',
    // u26
    jelovnik:'menu', specijalitet:'house specialty', preporuka:'recommendation', porcija:'portion', naruciti:'to order',
    dodatak:'side dish, extra', pregoreno:'burnt', sveze:'fresh', baksis:'tip (gratuity)', zaliti_se:'to complain',
    // u27
    cenkati_se:'to haggle', poslednja_cena:'final price', zamena:'exchange, replacement', vratiti:'to return',
    reklamacija:'complaint, claim', garancija:'warranty', ne_radi:'doesn’t work', gotovina:'cash', sitno:'small change',
    preskupo:'way too expensive',
    // u28
    kvar:'breakdown', guma:'tyre', benzin:'petrol', pumpa:'petrol station', kazna:'fine (penalty)',
    guzva:'crowd, traffic jam', zakasniti:'to be late', propustiti:'to miss (a bus, flight)', presedanje:'transfer, connection',
    pomoc:'help',
    // u29
    zahtev:'request, application', overa:'notarisation', sudski_tumac:'certified court translator', advokat:'lawyer',
    zalba:'appeal, complaint', rok:'deadline', vazi:'is valid; deal!', istekao:'expired', produzenje:'extension',
    nadlezni:'the competent authority',
    // u30
    vlasnik:'owner', stanar:'tenant', depozit:'deposit', rezije:'utilities', useliti_se:'to move in',
    iseliti_se:'to move out', namesteno:'furnished', buka:'noise', otkaz:'termination', dogovor:'agreement',
    // u31
    slazem_se:'I agree', ne_slazem_se:'I disagree', u_pravu_si:'you’re right', greska:'mistake', izvini:'sorry (informal)',
    salim_se:'I’m joking', ozbiljno:'seriously', nema_sanse:'no way', svasta:'well, well; all sorts', tacno:'exactly, correct',
    // u32
    osecati_se:'to feel', secati_se:'to remember', nadati_se:'to hope', druziti_se:'to hang out',
    kupovati:'to buy (ongoing)', reci:'to say (once)', hteo_bih:'I would like', trebalo_bi:'one should, it’d be good to',
    // u33
    detinjstvo:'childhood', iskustvo:'experience', uspomena:'memory (keepsake)', san:'dream; sleep', cilj:'goal',
    ponosan:'proud', promena:'change', odluka:'decision', izazov:'challenge', zbog:'because of',
    // u34
    domace:'homemade', slava:'slava (family patron saint day)', post:'fasting', zacin:'spice', zimnica:'winter preserves',
    sarma:'sarma (cabbage rolls)', gibanica:'gibanica (cheese pie)', ajvar:'ajvar (pepper relish)', pecenje:'spit-roast',
    kuvar:'cook; cookbook',
    // u35
    kvalitet:'quality', domaci_proizvod:'local product', uvozno:'imported', preporucujem:'I recommend',
    vredi:'it’s worth it', prevara:'scam', misljenje:'opinion', po_meni:'in my opinion', pouzdano:'reliable',
    razumna_cena:'reasonable price',
    // u36
    avantura:'adventure', dozivljaj:'experience, impression', izgubiti_se:'to get lost', slucajno:'by accident',
    na_kraju:'in the end', ispostavilo:'it turned out', priroda:'nature', pejzaz:'landscape', nezaboravno:'unforgettable',
    vredelo:'it was worth it',
    // u37
    drzavljanstvo:'citizenship', prebivaliste:'permanent residence', boravisna:'residence permit (official)',
    poreska:'tax return', penzija:'pension', osiguranje:'insurance', strpljenje:'patience', procedura:'procedure',
    ipak:'still, nevertheless', konacno:'finally',
    // u38
    naselje:'neighbourhood', zajednica:'community', druzenje:'get-together', rostilj:'barbecue', proslava:'celebration',
    pozajmiti:'to lend / to borrow', gostoprimstvo:'hospitality', prijateljstvo:'friendship', uvek:'always', zauvek:'forever',
    // u39
    mislim_da:'I think that…', cini_mi_se:'it seems to me', zapravo:'actually', uglavnom:'mostly', tradicija:'tradition',
    obicaj:'custom', mentalitet:'mentality', dusa:'soul', ponos:'pride', s_jedne_strane:'on the one hand',
    // u40
    jer:'because', zato_sto:'because (clause start)', iako:'although', ako:'if', kad:'when', dok:'while',
    umesto:'instead of', osim:'except', zato:'that’s why', mada:'although (= iako)',
  };
  for (const id in W) if (WORDS[id]) WORDS[id].ru = W[id];
  // подсказки-заметки к словам оставляем только там, где перевели, иначе скрываем
  const NOTES = {
    dobrodosli:'The name of this app. Now you know: you’re welcome here.',
    cao:'Works for both hello and goodbye. Efficient!',
    molim:'A multi-tool: “please”, “hello?” on the phone, and a polite “come again?”',
    kako_si:'Polite/plural: “kako ste?”',
    rakija:'The national cure for everything. Dosage: polako.',
    burek:'A sacred greasy pie. Heals both soul and hangover.',
    kajmak:'Like butter, but better.',
    ziveli:'The main toast. Look people in the eye as you clink — that’s the ritual.',
    pare:'Officially “novac”, but everyone says “pare”.',
    pekara:'Open when you need it. And when you don’t — also open.',
    gde_je:'In Montenegro you’ll hear “đe si!” — not a question, just “hey bro!”',
    papiri:'The main word of your first year.',
    beli_karton:'Every expat’s first achievement.',
    red:'“U redu” also means “OK”. Standing in a queue means everything’s OK.',
    sutra:'Formally “tomorrow”. Spiritually — “someday”.',
    radno_vreme:'A mysterious interval. Verify in person.',
    gazda:'Your most important person after your mum.',
    komsija:'Will know everything about you before the police do.',
    macka:'Hundreds of them in Kotor — the city’s true residents. Žarko has a peace treaty with them.',
    polako:'The national philosophy and the universal answer to everything.',
    moze:'The universal “yes” to any plan.',
    prijatelj:'Vocative case: “Prijatelju!” — and the person is yours.',
    kisa:'“Pada kiša” — it’s raining.',
    vreme:'One word for both weather and time — neither is in a hurry here.',
    biti:'ja sam · ti si · on je · mi smo · vi ste · oni su',
    imati:'imam, imaš, ima. “Imam pitanje” — I have a question.',
    znati:'znam, znaš, zna. “Ne znam” — the second most important phrase.',
    razumeti:'razumem / razumijem. “Ne razumem” saves you daily.',
    hteti:'hoću, hoćeš, hoće. “Hoću burek” — a solid morning plan.',
    moci:'mogu, možeš, može. “Može” — the universal OK.',
    govoriti:'govorim, govoriš, govori',
    uciti:'“Učim srpski” — which is exactly what you’re doing.',
    raditi:'radim. “Ne radi” — “it doesn’t work” (about everything).',
    ziveti:'živim u… + city. Locative case! But polako.',
    zovem_se:'“Zovem se Ana” — literally “I call myself Ana”.',
    iz_rusije:'From Ukraine — iz Ukrajine, from Belarus — iz Belorusije.',
    drago_mi_je:'Literally “it is dear to me”.',
    godine:'“Imam 30 godina” — I’m 30 years old.',
    ukusno:'The highest praise for any cook. And any grandma.',
    kiselo:'“Kiselo mleko” — the local kefir. Don’t fear the name.',
    ljuto:'Ajvar can be “ljuto”. Check before you scoop.',
    kesa:'“Treba li vam kesa?” — need a bag? Usually costs extra.',
    taksi:'Agree the price upfront or ask for the “taksimetar”.',
    kasni:'“Autobus kasni” — frequent, not tragic news.',
    termin:'“Zakazati termin” — to book an appointment. No termin, no entry.',
    pecat:'Without a stamp, paper is just paper. With one — a Document.',
    hitno:'A strong word, but powerless against “radno vreme”.',
    sto2:'Same as “sto” (100) — context saves you.',
    hajde:'“Hajde na kafu” — the country’s main invitation.',
    bio_sam:'“bio sam” (m) / “bila sam” (f). Past = “to be” + participle.',
    bicu:'Future: “ću” + verb. “Doći ću” — I’ll come.',
    kupio_sam:'kupio (m) / kupila (f).',
    lud:'Often affectionate: “lud si!” — “you madman!” (a compliment).',
    opusten:'The core Balkan state of being. Your destination.',
    preporuka:'“Šta preporučujete?” — what do you recommend? Watch the waiter light up.',
    baksis:'10% is good manners. Rounding up is normal.',
    cenkati_se:'At the market — yes. In the supermarket — better not.',
    ne_radi:'The key phrase for exchanges. And for life in the Balkans.',
    gotovina:'“Samo keš?” — cash only? Often yes.',
    guzva:'Crowd, queue, traffic — one word for all chaos.',
    pomoc:'“Upomoć!” — help! Hopefully never needed.',
    sudski_tumac:'Translates documents officially. Without them, paper “doesn’t count”.',
    vazi:'Both “is valid” (document) and casual “deal!”',
    rezije:'Electricity, water, rubbish. Ask if they’re included in the rent.',
    buka:'“Komšije prave buku” — neighbours are noisy. Or it’s a wedding. Or both.',
    salim_se:'The fire extinguisher after a bold joke.',
    svasta:'The reaction to any Balkan news.',
    osecati_se:'Reflexive “se” = Russian “-ся”. “Osećam se dobro”.',
    nadati_se:'“Nadam se” — I hope. Often about “radno vreme”.',
    kupovati:'kupovati (process) ↔ kupiti (result). That’s verb aspect.',
    reci:'reći (say once) ↔ govoriti (speak in general).',
    hteo_bih:'Polite conditional. “Hteo bih kafu” sounds cultured.',
    odluka:'“Doneti odluku” — to make a decision. Moving abroad is the bravest one.',
    domace:'The highest praise for food. “Domaća rakija” — the pride of the house.',
    slava:'A Serbian family’s patron saint day. Guests are fed beyond capacity.',
    post:'“Posno” — lenten, no animal products. Often delicious.',
    zimnica:'Ajvar, pickles, jams. In autumn the whole yard smells of paprika.',
    sarma:'Cabbage rolls in sauerkraut. No sarma — no holiday.',
    ajvar:'Pepper relish, the currency of good neighbourship. Can be “ljuti”.',
    pecenje:'The centrepiece of any celebration. You’ll smell it a block away.',
    strpljenje:'The expat’s main document. Not issued — earned at the counter.',
    konacno:'The word you’ll exhale when the permit finally arrives.',
    rostilj:'Not food — a social institution. A neighbour with a roštilj is a friend for life.',
    pozajmiti:'Neighbours lend each other everything — from salt to power drills.',
    gostoprimstvo:'A Balkan competitive sport. No guest leaves hungry.',
    dusa:'Balkans measure people by soul, not by clocks. “Čovek od duše” — highest praise.',
  };
  for (const id in WORDS) {
    if (NOTES[id]) WORDS[id].note = NOTES[id];
    else if (WORDS[id].note) delete WORDS[id].note;
  }

  // ── предложения: ключ — сербский текст ──
  const S = {
    'Dobar dan, kako ste?': ['Good afternoon, how are you?', '“Kako ste” is the polite “how are you”. For friends and cats — “kako si”.'],
    'Zdravo, ja sam Ana.': ['Hi, I’m Ana.', '“Ja sam…” — “I am…”. Insert your name and use freely.'],
    'Hvala, dobro sam.': ['Thanks, I’m fine.'],
    'Ćao, vidimo se!': ['Bye, see you!'],
    'Jednu kafu, molim.': ['One coffee, please.', 'Note: jedna kafa → jednu kafu. Cases! There are seven, but Slavic speakers get a head start — and you’ll pick them up as you go.'],
    'Pivo i voda, molim.': ['A beer and a water, please.'],
    'Burek sa sirom, molim.': ['A cheese burek, please.', 'Perfect the morning after an evening that started with “živeli”.'],
    'Račun, molim.': ['The bill, please.'],
    'Živeli!': ['Cheers!'],
    'Koliko košta burek?': ['How much is the burek?'],
    'Burek košta dvesta dinara.': ['The burek costs two hundred dinars.'],
    'To je skupo!': ['That’s expensive!'],
    'Imate li kusur?': ['Do you have change?'],
    'Na pijaci je jeftino.': ['The market is cheap.'],
    'Gde je pekara?': ['Where is the bakery?'],
    'Stanica je blizu.': ['The stop is near.'],
    'Idite pravo, pa levo.': ['Go straight, then left.'],
    'Autobus ide u grad.': ['The bus goes to town.'],
    'Pošta je daleko.': ['The post office is far.'],
    'Treba mi potvrda.': ['I need a certificate.'],
    'Gde je šalter tri?': ['Where is counter three?'],
    'Dođite sutra.': ['Come back tomorrow.', 'Memorise this phrase. You will hear it. More than once.'],
    'Čekam u redu.': ['I’m waiting in the queue.', '“U redu” also means “OK”. If you’re in a queue, everything is OK. Logic!'],
    'Imam ugovor i pasoš.': ['I have a contract and a passport.'],
    'Koliko je kirija?': ['How much is the rent?'],
    'Stan ima terasu.': ['The apartment has a terrace.'],
    'Internet ne radi.': ['The internet doesn’t work.', 'A phrase of first necessity. Learn it before you move.'],
    'Gazda dolazi sutra.': ['The landlord is coming tomorrow.', 'You already know what “sutra” means here.'],
    'Ključ je kod komšije.': ['The key is at the neighbour’s.'],
    'Polako, nema problema.': ['Take it easy, no problem.'],
    'Danas je lepo vreme.': ['The weather is nice today.'],
    'Planina je blizu.': ['The mountain is near.'],
    'Može kafa? Može!': ['Coffee? Sure!', '“Može” — the universal “yes”. You’ll use it daily.'],
    'Sutra možda pada kiša.': ['It might rain tomorrow.'],
    'Ne razumem.': ['I don’t understand.', 'The main phrase of month one. Say it with a smile — they’ll explain again, louder, with gestures.'],
    'Učim srpski.': ['I’m learning Serbian.', '(whispering) It’s practically one language, but each has its own name. Diplomacy!'],
    'Živim u Beogradu.': ['I live in Belgrade.'],
    'Radim onlajn.': ['I work online.', 'Yes, “onlajn” is spelled like that. Serbian writes as it hears. Vuk Karadžić approves.'],
    'Mogu li da platim karticom?': ['Can I pay by card?', 'Sometimes the answer is “samo keš” — cash only. Especially where the burek is best.'],
    'Zovem se Ana, drago mi je.': ['My name is Ana, nice to meet you.'],
    'Ja sam iz Rusije.': ['I’m from Russia.'],
    'Odakle si ti?': ['And where are you from?'],
    'Živim ovde već godinu dana.': ['I’ve been living here for a year.'],
    'Tražim crvenu majicu.': ['I’m looking for a red T-shirt.'],
    'Imate li veću veličinu?': ['Do you have a bigger size?'],
    'Treba li vam kesa?': ['Do you need a bag?'],
    'Samo gledam, hvala.': ['Just looking, thanks.', 'The magic phrase for browsing in peace.'],
    'Treba mi termin za sledeći mesec.': ['I need an appointment for next month.'],
    'Koji je danas datum?': ['What’s the date today?'],
    'Ovde vaš potpis, molim.': ['Your signature here, please.'],
    'Treba mi kopija i pečat.': ['I need a copy and a stamp.'],
    'Stan ima veliku kuhinju.': ['The apartment has a big kitchen.'],
    'Frižider ne radi.': ['The fridge doesn’t work.', '“Ne radi” again — learn it, you’ll need it more than once.'],
    'Prozor je prljav.': ['The window is dirty.'],
    'Želim da naučim srpski.': ['I want to learn Serbian.'],
    'Idem na posao.': ['I’m off to work.'],
    'Rođena sam u Moskvi.': ['I was born in Moscow.'],
    'Imam dvoje dece.': ['I have two kids.'],
    'Govorim ruski i učim srpski.': ['I speak Russian and I’m learning Serbian.'],
    'Tek sam stigla, učim jezik.': ['I’ve only just arrived, I’m learning the language.'],
    'Treba mi brašno, jaja i so.': ['I need flour, eggs and salt.'],
    'Seckam luk i pržim na ulju.': ['I chop the onion and fry it in oil.'],
    'Koliko šećera ide u kolač?': ['How much sugar goes into the cake?'],
    'Na pijaci je jeftinije nego u marketu.': ['The market is cheaper than the supermarket.'],
    'Daću vam tri komada.': ['I’ll give you three pieces.'],
    'Koliko je sve zajedno?': ['How much is it all together?'],
    'Ima li popust?': ['Is there a discount?'],
    'Želim da otvorim račun u banci.': ['I’d like to open a bank account.'],
    'Treba mi lekar.': ['I need a doctor.'],
    'Mogu li da produžim osiguranje?': ['Can I extend the insurance?'],
    'Slavina curi, treba majstor.': ['The tap is leaking, we need a repairman.'],
    'Klima je pokvarena.': ['The air conditioner is broken.'],
    'Možete li da popravite danas?': ['Can you fix it today?', '“Danas” is a bold request. Prepare for “sutra”.'],
    'Komšije su nas pozvale na roštilj.': ['The neighbours invited us to a barbecue.'],
    'Možeš li da mi pozajmiš so?': ['Could you lend me some salt?'],
    'Gostoprimstvo je ovde sveto.': ['Hospitality is sacred here.'],
    'Sinoć je bilo lepo.': ['Last night was lovely.'],
    'Prošle nedelje sam putovao.': ['Last week I travelled.'],
    'Sledeće nedelje ću raditi.': ['Next week I’ll be working.'],
    'On je baš simpatičan i opušten.': ['He’s really likeable and laid-back.'],
    'Komšija je ozbiljan, ali iskren.': ['The neighbour is serious but honest.'],
    'Ponekad je smešno, ponekad dosadno.': ['Sometimes it’s funny, sometimes boring.'],
    'To je preskupo, dajte popust.': ['That’s way too expensive, give me a discount.'],
    'Telefon ne radi, hoću zamenu.': ['The phone doesn’t work, I want a replacement.'],
    'Imate li sitno?': ['Do you have small change?'],
    'Plaćam gotovinom.': ['I’m paying cash.'],
    'Auto je u kvaru, treba mi pomoć.': ['The car has broken down, I need help.'],
    'Zakasnio sam zbog gužve.': ['I was late because of the traffic.'],
    'Gde je najbliža pumpa?': ['Where is the nearest petrol station?'],
    'Da li je depozit obavezan?': ['Is a deposit required?'],
    'Stan je namešten?': ['Is the apartment furnished?'],
    'Komšije prave buku noću.': ['The neighbours are noisy at night.', 'Or it’s a wedding. The line is thin in the Balkans.'],
    'Nadam se da ćeš doći.': ['I hope you’ll come.'],
    'Volim da se družim s komšijama.': ['I love hanging out with the neighbours.'],
    'Trebalo bi da produžim boravak.': ['I should extend my residence permit.'],
    'Preselila sam se zbog posla.': ['I moved because of work.'],
    'To je bila teška odluka.': ['That was a hard decision.'],
    'Ponosan sam na svoj napredak.': ['I’m proud of my progress.'],
    'Život na Balkanu je izazov i avantura.': ['Life in the Balkans is a challenge and an adventure.'],
    'Po meni, ovo vredi para.': ['In my opinion, this is worth the money.'],
    'Preporučujem domaći sir.': ['I recommend the local cheese.'],
    'To je prevara, ne vredi.': ['That’s a scam, not worth it.'],
    'Izgubili smo se, ali je vredelo.': ['We got lost, but it was worth it.'],
    'Ispostavilo se da je pejzaž nezaboravan.': ['The landscape turned out to be unforgettable.'],
    'Priroda ovde je čudo.': ['The nature here is a miracle.'],
    'Mislim da je to lepa tradicija.': ['I think that’s a beautiful tradition.'],
    'Čini mi se da uglavnom imaš pravo.': ['It seems to me you’re mostly right.'],
    'Zapravo, mentalitet ovde je topao.': ['Actually, the mentality here is warm.'],
    'Ostajem ovde jer volim ljude.': ['I’m staying here because I love the people.'],
    'Iako je teško, vredi.': ['Although it’s hard, it’s worth it.'],
  };
  function walkSentences(cb){
    UNITS.forEach(u => u.lessons.forEach(l => (l.sentences || []).forEach(cb)));
  }
  walkSentences(s => {
    const tr = S[s.sr];
    if (tr) { s.ru = tr[0]; if (s.ruMe) s.ruMe = tr[0]; if (tr[1]) s.fb = tr[1]; else if (s.fb) delete s.fb; }
  });

  // ── грамматика: подсказки ──
  const G = {
    'Я из России.':'I’m from Russia.', 'Мы в кафане.':'We’re at the kafana.', 'Он официант.':'He’s a waiter.',
    'Я хочу один кофе.':'I want one coffee.', 'Вы говорите по-английски?':'Do you speak English?',
    'Я иду в город.':'I’m going to town.', 'Мне нужна помощь.':'I need help.', 'Мы любим кофе.':'We love coffee.',
    'Вчера я был(а) на рынке.':'Yesterday I was at the market.', 'Завтра я приду (букв. буду прийти).':'Tomorrow I will come.',
    'Как ты себя чувствуешь?':'How do you feel?', 'Я бы хотел кофе (вежливо).':'I would like a coffee (polite).',
    '…потому что люблю Балканы.':'…because I love the Balkans.', 'Если идёт дождь, остаёмся дома.':'If it rains, we stay home.',
    'Иду гулять, хотя идёт дождь.':'I’m going out although it’s raining.',
  };
  UNITS.forEach(u => u.lessons.forEach(l => (l.grammar || []).forEach(g => { if (G[g.hint]) g.hint = G[g.hint]; })));

  // ── уровни, темы, юниты, цели ──
  const LV = [
    ['Never heard it', 'Zdravo, kafa, burek: your first hundred survival words.'],
    ['I order my own coffee', 'Tastes, shopping, numbers, simple requests and replies.'],
    ['A year in the Balkans', 'About yourself, family, recipes, routes, bank and doctor.'],
    ['Haggling at the market', 'Living dialogues, bargaining, characters, tricky verbs.'],
    ['Almost a local', 'Stories, opinions, culture and the soul of the Balkans.'],
  ];
  LEVELS.forEach((l, i) => { l.name = LV[i][0]; l.desc = LV[i][1]; });
  const TH = { intro:'Meeting the language', food:'Food & kafana', shop:'Money & the market', transport:'City & transport',
    docs:'Documents & bureaucracy', home:'Home & neighbours', vibe:'Small talk & vibe', grammar:'Verbs & grammar' };
  for (const k in TH) if (THEMES[k]) THEMES[k].name = TH[k];
  const UN = {
    u1:['Zdravo!','Say hi without blowing your cover'], u2:['Kafana','The country’s main institution'],
    u3:['Numbers & pare','Numbers, prices, the market'], u4:['Grad','City and navigation'],
    u5:['Papiri','Bureaucracy: the expat special'], u6:['Stan','Apartment, landlord, neighbours'],
    u7:['Polako vibes','Password-words and small talk'], u8:['Survival verbs','Say, understand, pay'],
    u9:['Who am I?','Introduce yourself and ask around'], u10:['Tastes','Sweet, salty, spicy'],
    u11:['Shopping','Sizes, colours, a bag'], u12:['Getting around','Train, bus, taxi'],
    u13:['Appointments & time','Booking, dates, stamps'], u14:['Around the flat','Kitchen, furniture, clean-dirty'],
    u15:['How are you, really?','Feelings and reactions'], u16:['Going, wanting, needing','Present tense verbs'],
    u17:['Biography','Family, work, languages'], u18:['The recipe','Cooking Balkan-style'],
    u19:['Prices & discounts','Compare and save'], u20:['Travel','Border, luggage, routes'],
    u21:['Bank & health','Account, card, doctor'], u22:['Repairs & handymen','Something broke'],
    u23:['Plans & invitations','Arrange to meet'], u24:['Yesterday & tomorrow','Past and future'],
    u25:['What’s he like?','Describing character'], u26:['At the restaurant','Order and judge'],
    u27:['Haggling & returns','Bargain and claim'], u28:['When things go wrong','Breakdowns and force majeure'],
    u29:['Serious bureaucracy','Applications, deadlines, appeals'], u30:['Lease & landlord','Renting without surprises'],
    u31:['Agree? Not quite','Friendly arguing'], u32:['Aspect & reflexives','Perfective and “-sya” verbs'],
    u33:['My story','Telling your journey'], u34:['Kitchen & slava','Culinary culture'],
    u35:['Quality & opinion','Assess and recommend'], u36:['Road adventures','Travel stories'],
    u37:['Citizenship & patience','Bureaucracy, the final boss'], u38:['Neighbourhood & fellowship','Neighbours and get-togethers'],
    u39:['Opinions & culture','Speak your mind'], u40:['Conjunctions','Linking phrases: jer, ako, iako'],
  };
  UNITS.forEach(u => { if (UN[u.id]) { u.title = UN[u.id][0]; u.sub = UN[u.id][1]; } });
  const LESSON_T = {
    u1l1:'First words', u1l2:'Getting acquainted', u2l1:'Drinks', u2l2:'Food and the bill',
    u3l1:'One-two-three', u3l2:'To ten and beyond', u3l3:'At the market', u4l1:'Places', u4l2:'Which way',
    u5l1:'The starter pack', u5l2:'In the queue', u6l1:'The apartment', u6l2:'Landlord & neighbours',
    u7l1:'Password-words', u7l2:'Weather and vibes', u8l1:'To be and to understand', u8l2:'To want and to be able',
    u9l1:'Introductions', u10l1:'Tastes and hunger', u11l1:'At the shop', u12l1:'Getting there',
    u13l1:'Booking things', u14l1:'Rooms and furniture', u15l1:'How’s the mood', u16l1:'Key verbs',
    u17l1:'About yourself', u18l1:'Products and actions', u19l1:'Cheaper or dearer', u20l1:'On the road',
    u21l1:'Bank and health', u22l1:'Breakdowns', u23l1:'Let’s go out', u24l1:'Was and will be',
    u25l1:'What people are like', u26l1:'At the restaurant', u27l1:'Haggling', u28l1:'Trouble en route',
    u29l1:'Deeper bureaucracy', u30l1:'Renting a place', u31l1:'Polite arguing', u32l1:'Trickier verbs',
    u33l1:'Experience and dreams', u34l1:'The festive table', u35l1:'Worth buying?', u36l1:'Road tales',
    u37l1:'The long paper trail', u38l1:'Life in the yard', u39l1:'What I think', u40l1:'Complex sentences',
  };
  UNITS.forEach(u => u.lessons.forEach(l => { if (LESSON_T[l.id]) l.title = LESSON_T[l.id]; }));
  const GO = [['Polako','One short practice a day: a review or clearing mistakes.'],
    ['Steady','One new lesson a day keeps the conscience clean.'],
    ['Vuk Karadžić','A lesson and a practice every day. Linguist-reformer mode.']];
  GOALS.forEach((g, i) => { g.name = GO[i][0]; g.desc = GO[i][1]; });

  // ── советы (tips) по заголовку ──
  const TIPS = {
    'Molim — слово-мультитул': ['“Molim” — the multi-tool', '“Molim” means “please”, answers the phone, and works as a polite “come again?”. Didn’t catch something? Say “Molim?” and put on Žarko’s innocent face.'],
    'Кофе — это формат времени': ['Coffee is a unit of time', 'Coffee at a kafana isn’t a drink, it’s a unit of life. A coffee meeting shorter than two hours counts as suspicious haste.'],
    'Числа закрывают 90% жизни': ['Numbers cover 90% of life', 'Prices, buses, “dva piva, molim” — numbers one to ten cover almost everything. The rest is combinatorics.'],
    'Пекара — главный ориентир': ['The bakery is your landmark', 'Every address here is explained via the nearest pekara. Memorise yours — you’ll never get lost. Or hungry.'],
    'Стартовый сет эмигранта': ['The expat starter pack', 'Pasoš, ugovor, potvrda, beli karton. Collect all four and they’ll issue a fifth paper nobody warned you about. That’s normal.'],
    'Айвар — это инициация': ['Ajvar is an initiation', 'If the landlord brings a jar of ajvar or a bottle of rakija — it’s not a bribe, it’s an initiation. Congratulations: you’re almost family.'],
    'Polako — это стратегия': ['Polako is a strategy', '“Polako” isn’t laziness — it’s an energy-saving strategy honed for centuries. Resistance is futile: in six months you’ll live like this too.'],
    'Глагол biti (быть)': ['The verb “biti” (to be)', 'ja sam · ti si · on/ona je · mi smo · vi ste · oni su. Unlike Russian, “to be” never drops: “Ja sam Ana” = “I am Ana”. Seven cases can wait; biti can’t.'],
    '«Drago mi je» работает всегда': ['“Drago mi je” always works', 'Meeting someone? “Drago mi je” (“nice to meet you”). Fail-safe, like “hvala”. Then “Odakle si?” — and the conversation rolls.'],
    '«Ljuto?» — важный вопрос': ['“Ljuto?” — the important question', 'Before scooping ajvar or paprika, ask “Da li je ljuto?” (is it spicy?). The Balkan “slightly spicy” has a personality.'],
    '«Koja veličina?»': ['“Koja veličina?”', 'The assistant will ask “Koja veličina?” (what size) and “Koja boja?” (what colour). You know numbers already — the rest is pointing and smiling.'],
    '«Kasni» — не паника': ['“Kasni” — don’t panic', '“Autobus kasni 10 minuta” — the bus is 10 minutes late. That’s not a system failure, that IS the system. Polako.'],
    'Сначала — термин': ['First — the termin', 'You don’t just walk into an office here — you book a “termin”. Got offered a date? Take it: free slots are as rare as shade in August.'],
    '«Sto» — стол и сто': ['“Sto” — table and hundred', '“Sto” is both “table” and “100”. Context saves you: “sto evra” is money, “drveni sto” is furniture. The Balkans love such jokes.'],
    '«Kako ide?» вместо «kako si»': ['“Kako ide?” instead of “kako si”', 'Friends get the relaxed “kako ide?” (“how’s it going?”). The winning reply: “Polako, super” — easy does it, all good.'],
    '«Treba mi» — спасательный круг': ['“Treba mi” — your lifebuoy', 'Can’t recall a verb? Say “Treba mi…” (“I need…”) plus a noun: “Treba mi voda”. Simple, polite, works everywhere.'],
    '«Oženjen» или «udata»?': ['“Oženjen” or “udata”?', 'Subtlety: a man is “oženjen”, a woman is “udata”. Different roots for different genders — mix them up and you’ll be corrected with a smile.'],
    '«Odoka» — главная мера': ['“Odoka” — the main unit', 'Ask a neighbour for an exact recipe and you’ll hear “odoka” (by eye). No grams. Just “a bit of this, a bit of that” — and somehow it’s always delicious.'],
    '«Ima li popust?»': ['“Ima li popust?”', 'Asking for a discount isn’t shameful — it’s almost a sport. “Ima li popust za gotovinu?” (cash discount?) sometimes works miracles.'],
    '«Gužva na granici»': ['“Gužva na granici”', 'Crossing between countries? Check the border queue first. In summer and holidays it’s measured not in minutes but in bureks.'],
    '«Produžiti» — глагол года': ['“Produžiti” — verb of the year', 'You’ll conjugate “produžiti” (to extend) most of all: the permit, the insurance, the contract. Learn it cold — it saves nerves at the counter.'],
    '«Dolazi majstor»': ['“Dolazi majstor”', '“The repairman is coming” — a phrase with an open date. He will come. Eventually. He’ll bring tools, drink a coffee, fix everything and explain politics. Polako.'],
    '«Hajde na kafu»': ['“Hajde na kafu”', '“Hajde na kafu” isn’t about coffee — it means “let’s hang out”. To accept, reply “Može!” or “Dogovoreno!”. That’s how friendships start.'],
    'Прошедшее = «sam» + причастие': ['Past = “sam” + participle', '“Bio sam” (I was), “kupio sam” (I bought). Take “sam/si/je…” plus a participle in -o (he) / -la (she). Sounds scary — works like the Russian “-л”.'],
    '«Lud» — это комплимент': ['“Lud” is a compliment', '“Lud si, brate!” literally “you’re crazy” — but it almost always means “you legend!”. Tone is everything. The Balkans love hyperbole.'],
    'Спроси «specijalitet»': ['Ask for the “specijalitet”', 'Not sure what to order? Ask “Koji je specijalitet kuće?” (house specialty). The waiter will light up and bring the best. Probably with seconds.'],
    '«Koja je poslednja cena?»': ['“Koja je poslednja cena?”', 'The market haggling ritual: “What’s the final price?” The seller “thinks”, knocks a bit off — and everyone’s happy. It’s not greed, it’s conversation.'],
    '«Gužva» объясняет всё': ['“Gužva” explains everything', 'Late? The universal excuse: “bila je gužva” (there was traffic/a crowd). Accepted by everyone, always. The great Balkan alibi.'],
    '«Važi» — слово-хамелеон': ['“Važi” — the chameleon word', '“Važi” means both “is valid” (a document) and the casual “OK, deal”. “Pasoš važi do 2030” and “Vidimo se sutra? — Važi!” — one word, two worlds.'],
    'Спроси про «režije»': ['Ask about “režije”', 'Before signing, ask: “Da li su režije uključene?” (are utilities included?). “Režije” (power, water, rubbish) can quietly double the rent.'],
    '«Šalim se» спасает': ['“Šalim se” saves the day', 'Joke landed wrong? Say “šalim se!” (just kidding!) — and all is well. Balkan humour is sharp, but “šalim se” is the built-in fire extinguisher.'],
    '«Se» = русское «-ся»': ['“Se” = the reflexive', '“Osećam se” (I feel), “sećam se” (I remember), “družim se” (I hang out). The particle “se” works like the Russian “-ся” — your intuition is usually right.'],
    '«Promena» как образ жизни': ['“Promena” as a way of life', 'Moving abroad is a big “promena” (change) and an “izazov” (challenge). Locals respect it: tell your story in Serbian and you’re instantly “svoj čovek”.'],
    'Что такое «slava»': ['What is a “slava”', 'A slava is the family patron saint day, the heart of Serbian tradition. Being invited is a big honour. Arrive hungry, leave overfed and happy.'],
    '«Domaće» бьёт «uvozno»': ['“Domaće” beats “uvozno”', 'In shopping talk, “domaći proizvod” (local) is always praised above “uvozno” (imported). Cheese, honey, rakija — “domaće” is a quality mark.'],
    'Лучшие места — «slučajno»': ['The best places — “slučajno”', 'The most beautiful Balkan spots are found “slučajno” (by accident), when you get lost. Take a wrong turn — and there’s a canyon, a waterfall, and a grandpa with the best rakija.'],
    '«Strpljenje» — твой главный документ': ['“Strpljenje” — your main document', 'Between “boravišna dozvola” and “državljanstvo” lie years of “procedura” and a ton of “strpljenje” (patience). But “konačno” (finally!) sounds like a fanfare.'],
    '«Roštilj» — это дружба': ['“Roštilj” means friendship', 'The smell of roštilj in the yard is a summons. You’ll be invited even if you met yesterday. You may refuse, but “gostoprimstvo” doesn’t accept “no”.'],
    '«Čovek od duše»': ['“Čovek od duše”', 'The highest praise here is “čovek od duše” (a person with soul). The Balkans value soulfulness over punctuality: better late but from the heart.'],
    'Союзы превращают слова в речь': ['Conjunctions turn words into speech', '“Jer” (because), “ako” (if), “iako” (although) — bridges between thoughts. With them you don’t “say words”, you tell stories: “Učim jezik jer volim ovu zemlju”.'],
  };
  UNITS.forEach(u => u.lessons.forEach(l => {
    if (l.tip && TIPS[l.tip.title]) { l.tip.text = TIPS[l.tip.title][1]; l.tip.title = TIPS[l.tip.title][0]; }
  }));

  // ── ситуации: по вопросу ──
  const SITS = {
    'Сосед в лифте кивает: «Ćao!» Твой ход:': ['A neighbour in the lift nods: “Ćao!” Your move:',
      [['“Ćao!”','Yes! “Ćao” is both hello and bye. One sound — double value.'],
       ['“Doviđenja!”','That’s “goodbye” — you’ve left before saying hello. Bold, but odd.'],
       ['Stare silently at the floor','That worked in a Moscow lift. Here you’ll have to talk — such is the way.']]],
    'Ты допил кофе час назад, а счёт никто не несёт. Почему?': ['You finished your coffee an hour ago and no bill in sight. Why?',
      [['No one rushes you here: the table is yours all day','Exactly. A kafana isn’t catering, it’s a way of life. Want the bill? Say “Račun, molim”.'],
       ['The waiter forgot you','A konobar forgets nothing. He simply respects your right to sit forever.'],
       ['No need to pay, it’s a gift','Bold theory. No.']]],
    'На пияце нет ценников. Как узнать цену?': ['No price tags at the market. How do you find out?',
      [['“Koliko košta?” — and brace for a chat','Yes. The price comes with a story about the harvest, the weather and the grandkids. It’s included.'],
       ['Silently show a calculator','It works, but your soul gains no XP.'],
       ['Look for a QR code','Brave idea. No.']]],
    'Ты спросил дорогу. Ответ: «Pravo, pa malo levo, pa pitaj tamo» («прямо, чуть налево, а там спроси»). Это значит:': ['You asked for directions. The answer: “Pravo, pa malo levo, pa pitaj tamo” (straight, a bit left, then ask there). It means:',
      [['Balkan navigation: keep walking and asking — you’ll be guided','Exactly. Directions here are assembled from three people. But you get a chat with each.'],
       ['You were politely told off','Quite the opposite — they really helped. It’s just the style.'],
       ['Better use the maps app','Maps don’t know the shortcut through Milovan’s yard.']]],
    'В МУПе сказали: «Dođite sutra». Когда приходить?': ['The office said: “Dođite sutra”. When do you come?',
      [['Tomorrow. But brace for another “sutra”','“Sutra” isn’t a date, it’s a genre. Bring a burek and a philosophical mood.'],
       ['Tonight — maybe they’ll change their mind','No. Radno vreme is sacred.'],
       ['Never — it’s a rejection','Don’t dramatise. It’s not a no, it’s a Tuesday.']]],
    'Газда зашёл «на пять минут» проверить кран. Прошло два часа. Что происходит?': ['The landlord dropped by “for five minutes” to check the tap. Two hours later. What’s happening?',
      [['All according to plan: the tap is the excuse, the chat is the goal','Congrats: you now have a mentor, a weatherman and a rakija sommelier in one person.'],
       ['He wants to raise the rent','No, he’s genuinely curious how you live. And why you still have no ajvar.'],
       ['Time to call the police','The police would come and stay for a chat too.']]],
    'Ты опоздал на встречу на 20 минут и в панике извиняешься. В ответ: «Polako, nema veze». Перевод:': ['You’re 20 minutes late and apologising in panic. The reply: “Polako, nema veze”. Translation:',
      [['“Relax, that’s not late here”','20 minutes isn’t lateness, it’s a rounding error. Lateness starts after an hour. Maybe.'],
       ['He’s holding a grudge','Holding grudges takes too much energy. Not in this climate.'],
       ['The meeting is cancelled','Everything’s on. Just no panic.']]],
    'Ты сказал три слова по-сербски. Реакция местного:': ['You said three words in Serbian. The local’s reaction:',
      [['Wild delight and a five-minute monologue','You’re now “naš čovek”. You’ll be praised, poured a drink, and told the family history five generations deep.'],
       ['They politely switch to English','That’s Berlin. Here they continue in Serbian — louder, with gestures.'],
       ['Nothing changes','It changes. People here truly love it when you learn the language.']]],
    'Новый знакомый спрашивает «Odakle si?». Лучший ответ:': ['A new acquaintance asks “Odakle si?”. Best reply:',
      [['“Ja sam iz Rusije, a živim ovde.”','Perfect: short, clear — and it hands them a conversation hook.'],
       ['Pretend you didn’t hear','“Odakle si” is the most common question for newcomers. You can’t hide forever — learn the answer.'],
       ['“Doviđenja!”','Saying goodbye to “where are you from” is bold, but the chat is over before it began.']]],
    'Бабушка на пияце протягивает попробовать и говорит «Probaj, domaće!». Ты:': ['A grandma at the market offers a taste: “Probaj, domaće!”. You:',
      [['Try it and say “Mmm, ukusno!”','Exactly! “Domaće” (homemade) is a quality mark, and “ukusno” makes the grandma’s day. Everyone wins.'],
       ['Politely decline','You may, but you’re missing both a treat and a mini language lesson. Tasting is part of the ritual.'],
       ['Ask for a certificate','“Domaće” outranks any certificate. Just taste it.']]],
    'На остановке висит расписание, но автобуса нет уже 15 минут. Реакция местных:': ['There’s a timetable at the stop, but no bus for 15 minutes. The locals:',
      [['Calmly sip coffee and wait','Yes. The timetable is a wish, not a promise. Coffee from the nearby pekara sweetens the wait.'],
       ['Call the mayor’s office','Nobody calls anyone. “Kasni” is normal — it’ll come.'],
       ['Order a €200 taxi','Don’t dramatise. Wait another “pet minuta”.']]],
    'Друг спрашивает «Kako ide?». Самый балканский ответ:': ['A friend asks “Kako ide?”. The most Balkan reply:',
      [['“Polako, ne žalim se.”','Perfect! “Slowly, can’t complain” — trademark Balkan optimism with light irony.'],
       ['A detailed 20-minute report','You could, but “kako ide” is often just “hi”. Start short; details over coffee.'],
       ['“Ne razumem.”','You know this phrase already — but here, just answer. It’s small talk.']]],
    'На границе очередь на два часа. Бывалый сосед советует:': ['A two-hour queue at the border. A seasoned neighbour advises:',
      [['“Polako, ponesi vodu i strpljenje.”','Correct. Water, patience and a playlist — the standard kit. Borders don’t understand haste.'],
       ['Go around through the mountains off-road','Heroic, but no. Better the queue and thermos coffee.'],
       ['Turn around and not go','Too radical. The “gužva” will dissolve, like everything in the Balkans.']]],
    'Тебе пишут «Hajde na kafu u subotu?». Дружелюбный ответ:': ['You get a message: “Hajde na kafu u subotu?”. The friendly reply:',
      [['“Može! Dogovoreno.”','Perfect. Warm agreement in two words — you’re nearly a local.'],
       ['“Please send a meeting agenda”','Too corporate. “Kafa” is about connection, not protocol.'],
       ['Leave it on read','A pity: “hajde na kafu” is an invitation into the inner circle. Better say yes.']]],
    'Принесли пересоленное блюдо. Как по-балкански вежливо сказать?': ['Your dish arrived oversalted. The polite Balkan way to say it:',
      [['Calmly: “Izvinite, malo je preslano.”','Perfect. Polite, no scene — they’ll almost always replace it and apologise. Conflict isn’t the style here.'],
       ['Loudly protest across the room','Overkill. The Balkans solve things quietly and humanly — and are respected for it.'],
       ['Eat silently and never return','Why? Say it calmly — they’ll understand and fix it. “Žaliti se” has its uses.']]],
    'Сказали, что срок документа «istekao» (истёк). Первый шаг:': ['They say your document “istekao” (expired). First move:',
      [['Ask about “produženje” and the paperwork','Right. Expired isn’t a disaster — it’s a reason for “produženje” (extension). Get the list and book a termin.'],
       ['Give up and fly home','Too dramatic. Expired documents get extended — it’s routine, not a verdict.'],
       ['Argue it’s a mistake','Check the dates first. If it truly expired — calmly arrange the extension.']]],
    'Друг с жаром доказывает, что бурек надо есть только с йогуртом. Ты не согласен. Мягкий ответ:': ['A friend passionately insists burek must be eaten with yoghurt only. You disagree. The soft reply:',
      [['“Možda si u pravu, ali ja volim drugačije.”','Diplomacy 10/10: you honoured them and kept your stance. Burek debates are sacred, but friendship is preserved.'],
       ['“Nema šanse, grešiš!”','Too harsh for such a small thing. Save “nema šanse” for the market.'],
       ['Sulk silently','Over burek? Here people argue with passion and zero grudges. Answer and smile.']]],
    'Сосед зовёт на «slavu». Что прихватить и как себя вести?': ['A neighbour invites you to a “slava”. What to bring and how to behave?',
      [['Flowers or wine, and prepare to eat a lot','Perfect. You come with a small gift and an empty stomach — the table will groan, refusals not accepted.'],
       ['Bring your own food','No need: they’ll feed you for a week ahead. A modest gift for the hosts is better.'],
       ['Politely decline — feels awkward','Quite the opposite: a slava invitation is a sign of deep trust. Declining hurts more than a third helping.']]],
    'Процедура тянется второй год, и хочется всё бросить. Балканская мудрость подсказывает:': ['The procedure drags into its second year and you want to quit. Balkan wisdom says:',
      [['“Polako, na kraju će ipak uspeti.”','That’s the zen: “slowly, in the end it will work out”. Bureaucracy here is beaten by patience, not nerves.'],
       ['Carpet-bomb everyone with complaints','A “žalba” has its place, but carpet-bombing only annoys the “nadležni”. Patience works better.'],
       ['Give up entirely','After all those papers? “Konačno” is close. A little more strpljenje.']]],
  };
  UNITS.forEach(u => u.lessons.forEach(l => {
    const s = l.situation && SITS[l.situation.q];
    if (s) {
      l.situation.q = s[0];
      l.situation.opts.forEach((o, i) => { if (s[1][i]) { o.t = s[1][i][0]; o.why = s[1][i][1]; } });
    }
  }));

  // ── факты, похвалы, реплики, ачивки ──
  FACTS.length = 0;
  FACTS.push(
    { t:'The city of cats', x:'Kotor is the cat capital of the Adriatic: the whole town feeds them and they have their own museum. Žarko confirms: better to be friends.' },
    { t:'Coffee is a ritual', x:'“Domaća kafa” is brewed in a džezva and sipped for at least half an hour. You can order espresso to go, but the barista will be sad.' },
    { t:'Slatko for the guest', x:'In a Serbian home a guest is first offered slatko — a spoonful of preserve and a glass of water. Declining isn’t customary. Why would you?' },
    { t:'Write as you speak', x:'Vuk Karadžić rebuilt Serbian on the principle “write as you speak” — hence kompjuter, vikend and onlajn, written fearlessly.' },
    { t:'Skadar pelicans', x:'Lake Skadar hosts Dalmatian pelicans — among Europe’s largest flying birds. Žarko considers them cousins.' },
    { t:'The lying-down championship', x:'The Montenegrin village of Brezna holds a lying-down championship: whoever lies longest wins. Polako is a sport.' },
    { t:'Merak', x:'“Merak” is the Balkan word for pleasure in simple things: coffee, sunset, a chat. No translation exists — only practice.' },
    { t:'The fortress-park', x:'Kalemegdan in Belgrade is an ancient fortress turned main park: chess players, dates and the best sunset over two rivers.' },
    { t:'The kolo turns', x:'The Balkan circle dance kolo is on the UNESCO list: join hands and go round. No skill needed — they’ll pull you in and teach you.' },
    { t:'A hundred bakeries', x:'The pekara is the main institution after the kafana. Burek with yoghurt for breakfast isn’t food — it’s a worldview.' },
    { t:'Summer to winter', x:'In Montenegro you can swim in the sea in the morning and have a snowball fight on Durmitor by noon — the seasons are an hour’s drive apart.' },
    { t:'Whose ćevapi?', x:'Every Balkan nation claims ćevapi as its own. It’s the region’s tastiest argument — and the only one settled by ordering more.' },
  );
  PRAISE.length = 0;
  PRAISE.push(
    'Svaka čast! (“well done”, literally — “all honour”)',
    'Bravo! The landlord would be proud.',
    '+1 to Balkan survival.',
    'You’re closer to your residence permit than yesterday.',
    'Polako but steady. The perfect pace.',
    'Žarko is announcing you to the whole beach.',
  );
  OOPS.length = 0;
  OOPS.push(
    'No worries: a mistake is training, not a verdict.',
    'Normal. Even locals mix up cases.',
    'Polako. The word went to Mistakes — we’ll finish it there.',
    'Your brain is learning right now. Seriously, that’s science.',
  );
  MASCOT_LINES.length = 0;
  MASCOT_LINES.push(
    'Polako! Nobody is in a hurry.',
    'Kjaa! I mean — zdravo!',
    'Coffee first, lesson second. It’s the law.',
    'One lesson a day and within a year you’ll understand what the neighbour is shouting about.',
    'No streaks: we count words, not days.',
    'Sutra means tomorrow. But that’s not certain.',
    'Saw a burek on the beach. It’s my burek now.',
  );
  const BG = {
    prvi:['First step','First lesson done. Onwards — polako.'],
    kafana:['Kafana certificate','The Kafana unit is done: coffee, rakija and the bill — survival kit assembled.'],
    birokrata:['Bureaucrat, 1st class','The Papiri unit is done. Mentally ready for the immigration office.'],
    streak3:['Three days','Three days of practice — not necessarily in a row, we don’t push.'],
    streak7:['Stubborn one','Seven days of practice. “Stubborn” is a compliment here.'],
    streak30:['A month of days','30 days of practice. Not a feat anymore — a lifestyle.'],
    words25:['25 words','25 words in the bank.'],
    words50:['Half a hundred','50 words. The market grandmas almost understand you.'],
    words100:['Living legend','100 words. The neighbour is proud.'],
    words200:['Two hundred words','200 words. The kafana goes quiet when you speak.'],
    review10:['Review master','10 review sessions. Spaced repetition works.'],
    perfect:['Flawless','A lesson without a single mistake.'],
  };
  BADGES.forEach(b => { if (BG[b.id]) { b.name = BG[b.id][0]; b.desc = BG[b.id][1]; } });
})();
