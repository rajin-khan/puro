import {EXTRA_LESSONS,ORDER} from './curriculum.js';
export const LEVELS = [
{id:'A1',name:'First words',subtitle:'Build your everyday foundations',description:'Introduce yourself, ask simple questions, and handle familiar everyday situations.',can:['Introduce yourself and exchange basic information.','Understand slow, clear speech about familiar topics.','Write a few connected sentences about yourself.']},
{id:'A2',name:'Everyday Finnish',subtitle:'Find your feet in daily life',description:'Talk about routines, make plans, describe your day, and navigate everyday services.',can:['Describe your routine and recent experiences.','Handle straightforward conversations in shops and services.','Read short everyday messages and write simple replies.']},
{id:'B1',name:'Real conversations',subtitle:'Connect, explain, and tell stories',description:'Tell stories, express opinions, and keep a conversation going when things are unfamiliar.',can:['Tell a connected story and explain an opinion.','Understand the main points of clear standard speech.','Write a coherent text about a familiar topic.']},
{id:'B2',name:'Independent voice',subtitle:'Speak with confidence and detail',description:'Develop arguments, follow extended discussion, and adapt your Finnish to work and social life.',can:['Discuss abstract topics and support a position with reasons.','Follow extended speech and articles on a range of topics.','Write detailed texts and compare possible solutions.']},
{id:'C1',name:'Precision & nuance',subtitle:'Find the right words for complex ideas',description:'Work with implied meaning, formal registers, dense texts, and nuanced professional communication.',can:['Recognize implied attitudes and subtle shifts in register.','Speak flexibly in social, academic, and professional settings.','Produce well-structured, detailed texts on complex subjects.']},
{id:'C2',name:'Mastery in practice',subtitle:'Refine a flexible, expressive command',description:'Synthesize demanding sources, edit for effect, interpret ambiguity, and practise spontaneous discourse.',can:['Synthesize and critically assess demanding material.','Express fine distinctions with an appropriate register.','Handle spontaneous, complex discussion with flexibility.']}
];
export const SOURCES = {
grammar:{name:'Uusi kielemme · Finnish grammar',url:'https://uusikielemme.fi/finnish-grammar'},
harmony:{name:'Uusi kielemme · Vowel harmony',url:'https://uusikielemme.fi/finnish-grammar/vowel-harmony-vokaaliharmonia-finnish-grammar'},
partitive:{name:'Uusi kielemme · The partitive case',url:'https://uusikielemme.fi/finnish-grammar/finnish-cases/grammatical-cases/the-partitive-case-partitiivi'},
negative:{name:'Uusi kielemme · Making verbs negative',url:'https://uusikielemme.fi/finnish-grammar/verbs/verb-tenses-and-moods/making-verbs-negative-in-finnish-dont-havent-hadnt-shouldnt'},
advanced:{name:'Kielitoimiston ohjepankki · Lauseenvastikkeet',url:'https://kielitoimistonohjepankki.fi/ohje/lauseenvastikkeet/'},
cefr:{name:'InfoFinland · Language course levels',url:'https://infofinland.fi/en/finnish-and-swedish/language-course-levels'},
news:{name:'Yle · News in easy Finnish',url:'https://yle.fi/selkouutiset'}
};
export const mc=(prompt,options,answer,explanation)=>({type:'choice',prompt,options,answer,explanation});
export const write=(prompt,answers,explanation)=>({type:'input',prompt,answers,explanation});
export const listen=(audio,prompt,options,answer,explanation)=>({type:'listen',audio,prompt,options,answer,explanation});
export const lesson=(id,level,title,subtitle,points,words,examples,questions,task,reading='',source='grammar')=>({id,level,title,subtitle,points,words,examples,questions,task,reading,source,minutes:level==='A1'?10:level==='A2'?12:level==='B1'?15:level==='B2'?18:20});
export const LESSONS = [
lesson('a1-hello','A1','A simple hello','Greetings, thanks, and your very first conversation',[
'Moi and hei are everyday greetings. Hei works in a wide range of situations. Moi is usually informal.',
'Kiitos means thank you. Anteeksi means sorry or excuse me. Say näkemiin for goodbye, or moi moi in informal conversation.',
'Learn whole phrases first. Repeat them aloud slowly, then try a tiny conversation without reading.'
],[['hei','hello'],['moi','hi'],['kiitos','thank you'],['anteeksi','sorry / excuse me'],['näkemiin','goodbye'],['ole hyvä','you are welcome / here you are']],
[['Hei!','Hello!'],['Kiitos!','Thank you!'],['Anteeksi.','Excuse me.']],
[mc('Which word means “thank you”?',['Hei','Kiitos','Anteeksi','Näkemiin'],1,'Kiitos means thank you. You can use it on its own.'),listen('Hei!','Which greeting did you hear?',['Hei','Kiitos','Näkemiin'],0,'Hei means hello.'),write('Type the Finnish word for “sorry” or “excuse me”.',['anteeksi'],'Anteeksi works both as an apology and as “excuse me”.')],
{prompt:'Imagine meeting someone at a café. Greet them, thank them, and say goodbye. Say your conversation aloud before writing it.',model:'Hei! Kiitos! Moi moi!',checks:['I can say a greeting without looking.','I can thank someone and say goodbye.']}
),
lesson('a1-sounds','A1','Hear the difference','Vowels, vowel harmony, and sound length',[
'Finnish spelling is fairly regular. A double vowel or consonant is held longer than a single one. Sound length can change a word’s meaning.',
'Tuli means fire; tuuli means wind. Tapa means way or habit; tappaa means to kill. Keep double letters distinct.',
'For many endings, a, o, u take the back-vowel variant and ä, ö, y take the front-vowel variant. The neutral vowels e and i can occur with either group. Compounds and some loanwords need special care.'
],[['tuli','fire'],['tuuli','wind'],['talo','house'],['kylä','village'],['yö','night'],['järvi','lake']],
[['talo → talossa','house → in the house'],['kylä → kylässä','village → in the village'],['tuli / tuuli','fire / wind']],
[mc('What does tuuli mean?',['Fire','Wind','Night'],1,'The double u is long. Tuuli is wind; tuli is fire.'),mc('Which is the correct form for “in the village”?',['kylassa','kylässä','kylässäa'],1,'Kylä has a front vowel, so this ending uses ä.'),write('Type the Finnish word for “fire”.',['tuli'],'Tuli has one u. Tuuli, with two, means wind.')],
{prompt:'Read tuli and tuuli aloud five times. Then read talossa and kylässä. Make the long vowel clearly longer.',model:'tuli, tuuli. talossa, kylässä.',checks:['I can distinguish a single and a double vowel.','I can explain the difference between -ssa and -ssä.']},'', 'harmony')
];
LESSONS.push(
lesson('a1-me','A1','Tell me about yourself','Names, pronouns, and the verb olla',[
'Olla means to be. In the present tense: minä olen, sinä olet, hän on, me olemme, te olette, he ovat.',
'Hän refers to a person without specifying gender. Finnish does not divide nouns into masculine and feminine grammatical genders.',
'You can introduce yourself with Minä olen Aino or Minun nimeni on Aino. In ordinary speech, speakers also use Mä oon Aino. Learn the standard forms here first.'
],[['minä','I'],['sinä','you, singular'],['hän','he / she'],['me','we'],['te','you, plural'],['he','they']],
[['Minä olen opiskelija.','I am a student.'],['Minun nimeni on Aino.','My name is Aino.'],['Hän on suomalainen.','He / she is Finnish.']],
[mc('Complete: Minä ___ opiskelija.',['olet','olen','ovat'],1,'Olen is the minä form of olla.'),mc('Which pronoun means “we”?',['me','te','he'],0,'Me means we. Te is plural you; he means they.'),write('Complete with one word: Hän ___ suomalainen.',['on'],'Hän on means he or she is.')],
{prompt:'Introduce yourself in three short sentences. Give your name, say that you are a student, and say that you study Finnish.',model:'Minä olen Aino. Olen opiskelija. Opiskelen suomea.',checks:['I can introduce myself.','I can choose olen, olet, or on.']}
),
lesson('a1-numbers','A1','One coffee, two coffees','Numbers and the partitive after quantities',[
'Learn the numbers yksi, kaksi, kolme, neljä, viisi, kuusi, seitsemän, kahdeksan, yhdeksän, kymmenen.',
'In a basic counted phrase, numbers greater than one take a singular partitive noun: yksi kahvi, kaksi kahvia. Zero also takes the partitive. Other sentence contexts can change the case.',
'For these nouns, add -a or -ä: kahvi → kahvia, omena → omenaa. Other noun types use different partitive endings. Learn each example as a whole phrase.'
],[['yksi','one'],['kaksi','two'],['kolme','three'],['neljä','four'],['viisi','five'],['kahvi','coffee']],
[['Yksi kahvi, kiitos.','One coffee, please.'],['Kaksi kahvia, kiitos.','Two coffees, please.'],['Kolme omenaa.','Three apples.']],
[mc('Choose the basic phrase for “two coffees”.',['kaksi kahvi','kaksi kahvia','yksi kahvia'],1,'After kaksi, the counted noun is in the singular partitive: kahvia.'),write('Type the Finnish word for “three”.',['kolme'],'Kolme means three.'),mc('What does viisi mean?',['Four','Five','Six'],1,'Viisi means five. Neljä is four and kuusi is six.')],
{prompt:'Write a café order with one coffee, then another with two coffees. Read both aloud. Count from one to ten.',model:'Yksi kahvi, kiitos. Kaksi kahvia, kiitos.',checks:['I can count to ten.','I can distinguish yksi kahvi from kaksi kahvia.']},'','partitive'
),
lesson('a1-verbs','A1','What do you do?','Present-tense actions and simple negatives',[
'The present tense can describe a habit, an action happening now, or a future action with context. Puhun means I speak or I am speaking.',
'For puhua: puhun, puhut, puhuu, puhumme, puhutte, puhuvat. With minä and sinä, the verb ending often makes the pronoun optional.',
'Finnish uses a negative verb: en, et, ei, emme, ette, eivät. In these present-tense examples, the main verb uses its negative form: en puhu, et puhu, ei puhu. Olla is special: en ole.'
],[['puhua','to speak'],['asua','to live'],['opiskella','to study'],['puhun','I speak'],['en','I do not'],['suomea','Finnish, partitive']],
[['Puhun englantia.','I speak English.'],['En puhu suomea.','I do not speak Finnish.'],['Asun Helsingissä.','I live in Helsinki.']],
[mc('Choose “I do not speak”.',['ei puhun','en puhu','en puhun'],1,'The negative verb en carries the person; puhu has no personal ending.'),write('Complete: Minä ___ Helsingissä. Use the minä form of asua.',['asun'],'Asun is the minä form of asua.'),mc('Which negative form belongs with “we”?',['et','emme','eivät'],1,'Me emme puhu means we do not speak.')],
{prompt:'Write two things you do and one thing you do not do. Use the forms asun, puhun, and en puhu.',model:'Asun Helsingissä. Puhun englantia. En puhu ruotsia.',checks:['I can use a present-tense verb.','I can make a simple sentence negative.']},'','negative'
),
lesson('a1-where','A1','Find your way','Questions, locations, and helpful phrases',[
'Missä asks where something is. In a yes/no question, -ko or -kö can attach to the verb: on → onko. The question word or question-marked verb commonly comes first.',
'The inessive ending -ssa/-ssä often means in: kaupassa, kirjastossa. Finnish has several ways to express location; not every English “at” uses this ending.',
'Use Voitko auttaa? to ask “Can you help?” and Voitko puhua hitaammin? for “Can you speak more slowly?” These phrases let you stay in the conversation.'
],[['missä','where, at what location'],['kuka','who'],['mikä','what'],['kauppa','shop'],['kirjasto','library'],['hitaammin','more slowly']],
[['Missä kirjasto on?','Where is the library?'],['Onko tämä bussi?','Is this a bus?'],['Voitko puhua hitaammin?','Can you speak more slowly?']],
[mc('Which word asks where something is?',['Kuka','Missä','Mikä'],1,'Missä asks about location. Kuka asks who; mikä asks what.'),listen('Voitko puhua hitaammin?','What is the speaker asking?',['Can you speak more slowly?','Where is the library?','What is your name?'],0,'Hitaammin means more slowly.'),write('Complete the yes/no question: ___ tämä bussi?',['onko'],'Add -ko to on to form onko.')],
{prompt:'Ask where the library is. Then ask someone to speak more slowly. Try saying both without reading.',model:'Missä kirjasto on? Voitko puhua hitaammin?',checks:['I can ask a simple question.','I can ask for help when I do not understand.']}
),
lesson('a2-have','A2','Your world, your things','Possession, family, and everyday needs',[
'Finnish often expresses “I have” with minulla on, literally “at me is”. The pattern continues sinulla on, hänellä on, meillä on, teillä on, heillä on.',
'For absence, use minulla ei ole. In basic possession sentences, the absent thing usually appears in the partitive: Minulla ei ole autoa.',
'Need can be expressed with minun täytyy plus an infinitive: Minun täytyy opiskella. The person is in the genitive, and täytyy stays the same.'
],[['perhe','family'],['ystävä','friend'],['auto','car'],['aika','time'],['minulla on','I have'],['täytyy','must / have to']],
[['Minulla on yksi sisko.','I have one sister.'],['Minulla ei ole autoa.','I do not have a car.'],['Minun täytyy opiskella.','I have to study.']],
[mc('Choose “I have a car”.',['Minä olen auto.','Minulla on auto.','Minun auto on.'],1,'Minulla on expresses possession.'),write('Complete: Minulla ei ole ___. Use the partitive of auto.',['autoa'],'Auto → autoa in this negative possession sentence.'),mc('Which phrase means “I have to”?',['minulla on','minun täytyy','minä olen'],1,'Minun täytyy plus an infinitive expresses necessity.')],
{prompt:'Describe two things you have and one thing you do not have. Add one thing you need to do today.',model:'Minulla on kirja ja puhelin. Minulla ei ole autoa. Minun täytyy opiskella.',checks:['I can use minulla on.','I can describe absence and a simple need.']}
),
lesson('a2-cases','A2','In, from, and into','The six everyday location cases',[
'Inner location cases often form a set: talossa, in the house; talosta, out of the house; taloon, into the house. These are the inessive, elative, and illative.',
'Outer location cases also form a set: pöydällä, on the table; pöydältä, from the table; pöydälle, onto the table. These are the adessive, ablative, and allative.',
'The illative has several formation patterns. Learn kotiin, kouluun, and kirjastoon as complete forms. Place names and set expressions sometimes use outer cases, so check the normal usage.'
],[['kotona','at home'],['kotiin','home, toward home'],['kotoa','from home'],['pöytä','table'],['kauppaan','to the shop'],['kaupasta','from the shop']],
[['Kirja on pöydällä.','The book is on the table.'],['Menen kauppaan.','I am going to the shop.'],['Tulen kaupasta.','I am coming from the shop.']],
[mc('Which form means “from the shop”?',['kaupassa','kauppaan','kaupasta'],2,'The elative ending -sta expresses movement out of the shop.'),write('Complete: Kirja on ___. Use the form of pöytä meaning “on the table”.',['pöydällä'],'Pöytä → pöydällä. Notice t → d in the stem.'),mc('Which phrase describes movement toward home?',['Olen kotona.','Menen kotiin.','Tulen kotoa.'],1,'Kotiin is movement toward home; kotona is location; kotoa is movement from home.')],
{prompt:'Describe a journey with three sentences. Say where you are, where you are going, and where you are coming from.',model:'Olen kaupassa. Menen kotiin. Tulen kaupasta.',checks:['I can distinguish location from direction.','I can use at least three location forms.']}
),
lesson('a2-patterns','A2','Spot the changing stem','Verb types and consonant gradation',[
'Finnish verbs are often grouped into six types by their infinitive endings and stem formation. Start with familiar examples: puhua → puhun, syödä → syön, tulla → tulen, haluta → haluan, tarvita → tarvitsen, vanheta → vanhenen.',
'Consonant gradation changes some stems between strong and weak forms. Common pairs include kk/k, pp/p, tt/t, and t/d. Not every consonant changes, and different word types follow different patterns.',
'Compare kauppa → kaupassa and ottaa → otan. Learn the base form and a common inflected form together, rather than guessing a rule from spelling alone.'
],[['syödä','to eat'],['tulla','to come'],['haluta','to want'],['tarvita','to need'],['ottaa','to take'],['kaupassa','in the shop']],
[['Minä syön.','I eat.'],['Minä tulen huomenna.','I will come tomorrow.'],['Minä otan kahvin.','I will take a coffee.']],
[mc('Which is the minä form of tulla?',['tullan','tulen','tuleen'],1,'Tulla belongs to type 3: tulla → tule- → tulen.'),write('Type the minä form of ottaa.',['otan'],'Ottaa → otan. Here tt changes to t.'),mc('Which is the correct form for “in the shop”?',['kauppassa','kaupassa','kauppasa'],1,'Kauppa has the weaker stem kaupa- before this ending: kaupassa.')],
{prompt:'Write the minä forms of puhua, syödä, tulla, haluta, tarvita, and vanheta. Then say each with a subject.',model:'puhun, syön, tulen, haluan, tarvitsen, vanhenen.',checks:['I recognize several verb types.','I can explain why ottaa becomes otan.']}
),
lesson('a2-past','A2','What happened yesterday?','The simple past and negative past',[
'The simple past, often called imperfekti, usually contains an i marker, but stems can change. Learn olin, menin, söin, and puhuin with their present forms.',
'For the negative past, use the negative verb plus a past participle: en ollut, en mennyt, en syönyt. In the plural, the participle changes: emme olleet, emme menneet.',
'Words such as eilen, viime viikolla, and aamulla make the time clear. A sequence of short sentences is enough to tell your first story.'
],[['eilen','yesterday'],['huomenna','tomorrow'],['olin','I was'],['menin','I went'],['söin','I ate'],['viime viikolla','last week']],
[['Eilen olin kotona.','Yesterday I was at home.'],['Menin kauppaan.','I went to the shop.'],['En mennyt kouluun.','I did not go to school.']],
[mc('Which sentence is in the past?',['Olen kotona.','Olin kotona.','Olet kotona.'],1,'Olin is the minä simple-past form of olla.'),write('Complete: Eilen minä ___ kauppaan. Use the past of mennä.',['menin'],'Mennä → menin in the minä simple past.'),mc('Choose “I did not go”.',['En menin.','En mennyt.','Ei menen.'],1,'En carries the person; mennyt is the singular past participle.')],
{prompt:'Write four sentences about yesterday. Include a location, an action, and something you did not do.',model:'Eilen olin kotona. Aamulla join kahvia. Iltapäivällä menin kauppaan. En mennyt kouluun.',checks:['I can tell a short story about yesterday.','I can make a past action negative.']}
),
lesson('a2-plans','A2','Make a plan together','Time, requests, and everyday transactions',[
'Finnish normally uses the present tense for future events, with time or context making the meaning clear: Tulen huomenna.',
'You can soften a request with the conditional: Haluaisin kahvin means “I would like a coffee”. Voisitko auttaa? means “Could you help?”',
'For times, Kello on kaksi means “It is two o’clock”. Puoli kolme means half past two, literally “half three”. Say nähdään when proposing “see you”.'
],[['tänään','today'],['aamulla','in the morning'],['illalla','in the evening'],['kello','clock / time'],['haluaisin','I would like'],['nähdään','see you']],
[['Tulen huomenna.','I will come tomorrow.'],['Nähdään kello kaksi.','See you at two o’clock.'],['Haluaisin kahvin, kiitos.','I would like a coffee, please.']],
[mc('What time is puoli kolme?',['2:30','3:30','3:00'],0,'Puoli kolme means halfway toward three: 2:30.'),listen('Nähdään huomenna kello kaksi.','When are they meeting?',['Today at two','Tomorrow at two','Tomorrow at three'],1,'Huomenna means tomorrow; kello kaksi is two o’clock.'),write('Complete a polite café request: ___ kahvin, kiitos. Use “I would like”.',['haluaisin'],'Haluaisin is the conditional minä form of haluta.')],
{prompt:'Invite a friend to meet tomorrow at two. Then write a polite coffee order.',model:'Nähdään huomenna kello kaksi. Haluaisin kahvin, kiitos.',checks:['I can make a simple future plan.','I can use a polite request.']}
),
lesson('a2-spoken','A2','Finnish as you hear it','A first look at puhekieli',[
'Written standard Finnish and everyday spoken Finnish differ. Minä olen often becomes mä oon, sinä olet becomes sä oot, and me olemme can become me ollaan.',
'In much colloquial speech, hän can be replaced by se when referring to a person. In standard writing, hän remains the usual personal pronoun. Regional usage varies.',
'Learn to recognize spoken forms without abandoning standard writing. The forms here are common examples, not the only correct dialect.'
],[['mä','I, colloquial'],['sä','you, colloquial'],['oon','am, colloquial'],['oot','are, colloquial singular'],['mulla on','I have, colloquial'],['me ollaan','we are, colloquial']],
[['Mä oon kotona.','I am at home, colloquial.'],['Mulla on kiire.','I am in a hurry, colloquial.'],['Me ollaan täällä.','We are here, colloquial.']],
[mc('What is the standard equivalent of mä oon?',['minä olen','me olemme','sinä olet'],0,'Mä corresponds to minä, and oon to olen.'),write('Rewrite “mulla on” in standard Finnish.',['minulla on'],'Minulla on is the standard written form.'),mc('In standard formal writing, which pronoun normally refers to a person?',['se','hän','tämä always'],1,'Hän is the normal standard personal pronoun. Se is common for people in colloquial speech.')],
{prompt:'Write the same short introduction twice, once in standard Finnish and once in a casual spoken style. Keep the meaning the same.',model:'Minä olen Aino. Minulla on kirja. / Mä oon Aino. Mulla on kirja.',checks:['I can recognize common spoken forms.','I can choose a register for the situation.']}
),
lesson('b1-experience','B1','What have you done?','The perfect and pluperfect',[
'The perfect combines the present of olla with a past participle: olen käynyt, olet käynyt, hän on käynyt. It often connects a past experience or continuing situation to the present.',
'The plural participle is different: olemme käyneet. For the negative, use en ole käynyt or emme ole käyneet.',
'The pluperfect uses the past of olla: olin käynyt. It places an event before another past point. Contrast Kävin eilen with Olen käynyt Suomessa.'
],[['käydä','to visit / go to'],['jo','already'],['vielä','still / yet'],['koskaan','ever / never, with context'],['olen käynyt','I have visited'],['olin käynyt','I had visited']],
[['Olen käynyt Suomessa.','I have visited Finland.'],['En ole vielä syönyt.','I have not eaten yet.'],['Olin jo lähtenyt, kun hän soitti.','I had already left when he / she called.']],
[mc('Which sentence connects an experience to the present?',['Olen käynyt Suomessa.','Kävin Suomessa eilen.','Käyn Suomessa huomenna.'],0,'Olen käynyt is the perfect. The second sentence specifies a completed past time.'),write('Complete: Me olemme ___ Suomessa. Use the plural past participle of käydä.',['käyneet'],'The plural form is käyneet.'),mc('Which form describes an action before another past event?',['olen lähtenyt','olin lähtenyt','lähden'],1,'Olin lähtenyt is the pluperfect: I had left.')],
{prompt:'Write about two experiences you have had and one you have not had yet. Include one sentence in the simple past with a specific time.',model:'Olen käynyt Suomessa. Olen opiskellut suomea. En ole vielä käynyt Lapissa. Viime vuonna kävin Helsingissä.',checks:['I can distinguish simple past from perfect.','I can use a negative perfect.']}
),
lesson('b1-conditional','B1','If things were different','Conditional forms and hypothetical situations',[
'The conditional uses the marker -isi-: olisin, olisit, olisi. It can express a hypothetical situation, a wish, or a polite request.',
'In a hypothetical if-sentence, both clauses can use the conditional: Jos minulla olisi aikaa, opiskelisin lisää.',
'A negative conditional uses the negative verb and the conditional form without a person ending: en olisi, en menisi. A real future condition often uses the ordinary present instead.'
],[['jos','if'],['olisi','would be'],['voisin','I could'],['haluaisin','I would like'],['ehkä','perhaps'],['enemmän','more']],
[['Jos minulla olisi aikaa, lukisin kirjan.','If I had time, I would read the book.'],['Voisitko auttaa minua?','Could you help me?'],['En menisi sinne.','I would not go there.']],
[mc('Complete: Jos minulla ___ aikaa, lukisin.',['on','olisi','oli'],1,'In this hypothetical pattern, olisi pairs with lukisin.'),write('Make “olisin” negative using two words.',['en olisi'],'The person is marked in en; olisi has no personal ending here.'),mc('Which request is softened with a conditional?',['Autat minua.','Voisitko auttaa minua?','Autatko aina?'],1,'Voisitko means could you and makes the request more tentative.')],
{prompt:'Write three hypothetical sentences beginning with Jos. Then rewrite a direct request as a polite conditional question.',model:'Jos minulla olisi aikaa, opiskelisin lisää. Jos asuisin Suomessa, puhuisin suomea joka päivä. Jos voisin, matkustaisin Lappiin. Voisitko auttaa minua?',checks:['I can build a hypothetical if-sentence.','I can soften a request with the conditional.']}
),
lesson('b1-objects','B1','Finish it, or keep going?','Objects, result, and the partitive',[
'Object case helps express whether an action is complete or ongoing. Compare Luen kirjaa, I am reading the book, with Luen kirjan, I will read the whole book.',
'A negative clause normally takes a partitive object: En lue kirjaa. Some verbs, such as rakastaa and odottaa, also take partitive objects.',
'Total-object form depends on the sentence structure. Compare Ostan kirjan with Osta kirja! and Kirja ostetaan. Do not turn “completed object” into a rule that always adds -n.'
],[['kirjaa','book, singular partitive'],['kirjan','book, genitive form'],['valmis','ready / finished'],['odottaa','to wait for'],['kokonaan','completely'],['loppuun','to the end']],
[['Luen kirjaa.','I am reading the book.'],['Luin kirjan loppuun.','I finished reading the book.'],['En ostanut kirjaa.','I did not buy the book.']],
[mc('Which sentence explicitly says the reading reached the end?',['Luin kirjaa.','Luin kirjan loppuun.','En lukenut kirjaa.'],1,'Kirjan loppuun makes the completed result explicit.'),write('Complete: En ostanut ___. Use kirja as the object.',['kirjaa'],'A negative object sentence uses the partitive: kirjaa.'),mc('Which imperative uses a total object?',['Osta kirja!','Osta kirjan!','Osta kirjaa loppuun!'],0,'In this imperative construction, the singular total object has the nominative form kirja.')],
{prompt:'Write a pair of sentences that contrast ongoing reading and finished reading. Add a negative sentence and a command.',model:'Luen kirjaa. Luin kirjan loppuun. En ostanut kirjaa. Osta kirja!',checks:['I can explain a partitive versus total object.','I know that total objects have different forms in different sentence structures.']},'','partitive'
),
lesson('b1-connections','B1','Connect your ideas','Relative clauses and useful connectors',[
'Joka introduces a relative clause. Its case follows its role inside that clause: ystävä, joka asuu täällä; ystävä, jonka tunnen; ystävä, jolle soitan.',
'Separate clauses clearly in writing. In standard Finnish, a relative clause is normally set off with a comma.',
'Use koska for a reason, vaikka for a concession, and siksi for a consequence. These help your Finnish become a connected explanation rather than isolated sentences.'
],[['joka','who / which, relative'],['jonka','whose / whom, genitive form'],['jolle','to whom / to which'],['koska','because'],['vaikka','although / even though'],['siksi','therefore / for that reason']],
[['Tunnen naisen, joka asuu täällä.','I know a woman who lives here.'],['Tämä on ystävä, jolle soitan.','This is the friend whom I call.'],['Menin ulos, vaikka satoi.','I went out even though it was raining.']],
[mc('Complete: Tämä on ystävä, ___ soitan.',['joka','jolle','jonka'],1,'Soittaa jollekulle takes the allative; jolle means to whom.'),write('Type the Finnish connector meaning “because”.',['koska'],'Koska introduces a reason.'),mc('What relation does vaikka introduce here: Menin ulos, vaikka satoi?',['Reason','Concession','Result'],1,'The rain would normally discourage going out, but the speaker went anyway.')],
{prompt:'Describe a friend using a relative clause. Then explain why you are learning Finnish and mention one difficulty using vaikka.',model:'Minulla on ystävä, joka asuu Suomessa. Opiskelen suomea, koska haluan puhua hänen kanssaan. Jatkan opiskelua, vaikka kieli on vaikea.',checks:['I can join ideas with a reason or concession.','I can choose joka or jolle in these examples.']}
),
lesson('b1-infinitives','B1','Learning to do things','Infinitives and common verb patterns',[
'The verb before an infinitive often determines its form. Compare haluan opiskella, I want to study, and opin puhumaan, I learn to speak.',
'The third infinitive can take location-like endings: menen opiskelemaan, olen opiskelemassa, tulen opiskelemasta. These describe movement into, being engaged in, or returning from an activity.',
'Learn verb patterns as phrases. Osaan puhua and minun täytyy lähteä both use a basic infinitive. The pattern of one verb does not automatically apply to every other verb.'
],[['oppia','to learn'],['puhumaan','to speak, third infinitive illative'],['opiskelemassa','engaged in studying'],['opiskelemasta','from studying'],['haluan','I want'],['osaan','I know how to']],
[['Haluan oppia suomea.','I want to learn Finnish.'],['Opin puhumaan suomea.','I am learning to speak Finnish.'],['Olen opiskelemassa.','I am studying.']],
[mc('Complete: Opin ___ suomea. Use puhua.',['puhua','puhumaan','puhumasta'],1,'Oppia tekemään uses the third infinitive illative: puhumaan.'),write('Complete: Haluan ___ suomea. Use opiskella.',['opiskella'],'Haluta takes the basic infinitive in this construction.'),mc('Which phrase describes returning from an activity?',['Menen opiskelemaan.','Olen opiskelemassa.','Tulen opiskelemasta.'],2,'The -masta form describes returning from studying.')],
{prompt:'Write about what you want to learn, what you already know how to do, and an activity you are going to do.',model:'Haluan oppia suomea. Osaan puhua englantia. Menen kirjastoon opiskelemaan.',checks:['I can use haluan plus a basic infinitive.','I can recognize the -maan, -massa, and -masta patterns.']}
),
lesson('b1-story','B1','Tell the whole story','Read, retell, and keep a conversation going',[
'When retelling an event, establish the time and place before the sequence. Ensin, sitten, and lopuksi make the order clear.',
'Use a repair phrase when you lose a word: Tarkoitan… means “I mean…”. Miten sen sanoisi? means “How would one put it?”',
'Read the story for what happened, then retell it in your own words. You do not need to preserve every sentence.'
],[['ensin','first'],['sitten','then'],['lopuksi','finally'],['unohtaa','to forget'],['huomata','to notice'],['tarkoitan','I mean']],
[['Ensin menin asemalle.','First I went to the station.'],['Sitten huomasin ongelman.','Then I noticed the problem.'],['Tarkoitan eilistä matkaa.','I mean yesterday’s trip.']],
[mc('Why did Aino return home in the text?',['She forgot her phone.','The train was late.','The library was closed.'],0,'Aino notices that her phone is at home and returns to get it.'),mc('Who helped Aino at the station?',['A librarian','A station employee','A friend on the train'],1,'An employee at the station explains when the next train leaves.'),write('Type the connector meaning “finally”.',['lopuksi'],'Lopuksi introduces the final part of a sequence.')],
{prompt:'Retell the story aloud in one minute, using ensin, sitten, and lopuksi. Then write about a small problem you solved yourself.',model:'Ensin Aino meni asemalle. Sitten hän huomasi, että puhelin oli kotona. Hän palasi kotiin ja myöhästyi junasta. Lopuksi hän löysi uuden junan ja pääsi Tampereelle.',checks:['I can retell the main events in order.','I can continue speaking when I forget a word.']},
'Eilen Aino lähti kotoa aikaisin, koska hän oli menossa Tampereelle. Asemalla hän huomasi, että puhelin oli jäänyt keittiön pöydälle. Hän palasi kotiin hakemaan sen, mutta myöhästyi junasta. Aino kysyi aseman työntekijältä, milloin seuraava juna lähtisi. Työntekijä kertoi, että uusi juna lähtisi tunnin kuluttua. Aino osti kahvin ja luki kirjaa odottaessaan. Lopulta hän pääsi Tampereelle. Matka ei sujunut suunnitelman mukaan, mutta hän oli tyytyväinen, että osasi kysyä apua suomeksi.'
),
lesson('b2-passive','B2','What is done, and by whom?','Passive forms and spoken we',[
'The Finnish passive commonly leaves the human agent unspecified: Täällä puhutaan suomea, Finnish is spoken here. It is not formed with olla in the same way as the English passive.',
'Compare the present puhutaan, simple past puhuttiin, perfect on puhuttu, and negative present ei puhuta. Notice the separate forms rather than building one from an English translation.',
'In colloquial Finnish, the passive form is often used with me: me puhutaan. In standard writing, use me puhumme when you mean “we speak”.'
],[['puhutaan','is spoken / people speak'],['puhuttiin','was spoken / people spoke'],['on puhuttu','has been spoken'],['ei puhuta','is not spoken'],['päätetään','is decided'],['rakennetaan','is built / people build']],
[['Täällä puhutaan suomea.','Finnish is spoken here.'],['Asiasta päätettiin eilen.','The matter was decided yesterday.'],['Me puhumme suomea.','We speak Finnish, standard.']],
[mc('Which is a standard passive sentence?',['Täällä puhutaan suomea.','Me puhumme suomea.','Minä puhun suomea.'],0,'Puhutaan leaves the human speaker or speakers unspecified.'),write('Make puhutaan negative using two words.',['ei puhuta'],'The negative present passive is ei puhuta.'),mc('Which is the standard written equivalent of me puhutaan?',['me puhuu','me puhumme','me on puhuttu'],1,'The standard first-person plural form is puhumme.')],
{prompt:'Write three notices for a shared workspace using passive forms. Then turn one into a standard sentence with me.',model:'Täällä puhutaan suomea. Kokous pidetään huomenna. Ovet suljetaan illalla. Me puhumme suomea.',checks:['I can recognize several passive tenses.','I can distinguish passive from colloquial first-person plural.']}
),
lesson('b2-plurals','B2','More than one','Plural cases and agreeing adjectives',[
'The nominative plural normally ends in -t: kirja → kirjat. Many other plural cases include an i element, but the stem may change: taloissa, kaupoissa, kirjoissa.',
'Adjectives usually agree with the noun in case and number: uusissa taloissa, in the new houses. The adjective is not left in its basic form.',
'Learn plural partitives by word type: kirjoja, taloja, ihmisiä. They are useful with indefinite quantities and partitive-taking verbs. A form such as kirjoja is not the same as the singular partitive kirjaa.'
],[['kirjat','the books, nominative plural'],['kirjoja','books, partitive plural'],['taloissa','in houses'],['kaupoissa','in shops'],['ihmisiä','people, partitive'],['uusissa','in new, plural inessive']],
[['Luen suomalaisia kirjoja.','I read Finnish books.'],['Uusissa taloissa on hissit.','The new houses have lifts.'],['Tapasin monia ihmisiä.','I met many people.']],
[mc('Choose “in the new houses”.',['uusi taloissa','uusissa taloissa','uudet taloissa'],1,'Both the adjective and noun are plural inessive.'),write('Type the nominative plural of kirja.',['kirjat'],'Kirja → kirjat.'),mc('Which form is the plural partitive?',['kirjaa','kirjat','kirjoja'],2,'Kirjoja is plural partitive. Kirjaa is singular partitive.')],
{prompt:'Describe a neighborhood using at least two plural location phrases. Mention something you see there with a plural partitive.',model:'Uusissa taloissa on hissit. Pienissä kaupoissa on ystävällinen palvelu. Näen paljon ihmisiä.',checks:['I can make an adjective agree with a plural noun.','I can distinguish nominative plural and partitive plural.']}
),
lesson('b2-argument','B2','Build an argument','Positions, evidence, and counterarguments',[
'A clear argument separates a claim, a reason, and an example. Mielestäni states a personal view; esimerkiksi introduces an illustration.',
'Toisalta introduces another side. Kuitenkin signals a contrast or reservation. Do not confuse giving an example with providing evidence that proves a general claim.',
'Identify the author’s conclusion, then test whether the reasons actually support it. Practise disagreeing with the idea while accurately representing it.'
],[['mielestäni','in my opinion'],['toisaalta','on the other hand'],['kuitenkin','however'],['esimerkiksi','for example'],['perustelu','reason / justification'],['väite','claim']],
[['Mielestäni päätös on hyvä.','In my opinion, the decision is good.'],['Toisaalta kustannukset kasvavat.','On the other hand, costs increase.'],['Tämä ei kuitenkaan ratkaise kaikkea.','However, this does not solve everything.']],
[mc('What does the writer recommend?',['Close the library permanently','Extend opening hours with a trial','Remove all library staff'],1,'The writer supports a monitored trial rather than an unconditional permanent change.'),mc('What counterargument is acknowledged?',['There are too many books.','Costs and safety need attention.','Nobody uses libraries.'],1,'The text acknowledges costs and safety.'),write('Type the phrase used for “on the other hand”.',['toisaalta'],'Toisaalta introduces another perspective.')],
{prompt:'Write 150–200 words for or against longer library opening hours. Include a counterargument and explain why your conclusion still follows. Then summarize your view aloud in two minutes.',model:'Mielestäni kirjaston aukioloaikoja kannattaa pidentää kokeiluna. Moni työssä käyvä ei ehdi kirjastoon päivällä. Toisaalta turvallisuus ja kustannukset on otettava huomioon. Siksi kokeilun tuloksia pitäisi arvioida ennen pysyvää päätöstä.',checks:['I state a clear position with reasons.','I represent and answer a counterargument.']},
'Kaupungin kirjasto sulkeutuu arkisin kello kuusi. Moni työssä käyvä pääsee kotiin vasta silloin, joten nykyiset aukioloajat eivät palvele kaikkia. Mielestäni kirjaston pitäisi kokeilla pidempiä aukioloaikoja kahtena iltana viikossa. Kirjasto tarjoaa kirjojen lisäksi rauhallisen työtilan, jota kaikilla ei ole kotona. Toisaalta pidemmät aukioloajat lisäävät kustannuksia, ja henkilökunnan turvallisuus on varmistettava. Pelkkä kävijämäärä ei myöskään kerro, kuinka hyödyllinen palvelu on. Kokeilu voisi kestää kolme kuukautta. Sen aikana kerättäisiin palautetta sekä käyttäjiltä että työntekijöiltä. Vasta palautteen ja kustannusten arvioinnin jälkeen päätettäisiin, jatketaanko uusia aukioloaikoja. Näin päätös perustuisi kokemukseen eikä pelkkiin oletuksiin.'
),
lesson('b2-work','B2','Finnish at work','Clear emails, requests, and meetings',[
'A useful work email gives the purpose, necessary context, a clear request, and a realistic deadline. Valitettavasti introduces unwelcome news; ystävällisin terveisin is a standard closing.',
'A polite request does not have to be vague. Voisitko lähettää raportin perjantaihin mennessä? states both the action and the deadline.',
'In meetings, distinguish a suggestion from a decision. Ehdotan, että… is a proposal; päätimme, että… reports a decision.'
],[['ehdottaa','to suggest'],['päätös','decision'],['määräaika','deadline'],['liite','attachment'],['valitettavasti','unfortunately'],['mennessä','by, before a deadline']],
[['Voisitko lähettää raportin perjantaihin mennessä?','Could you send the report by Friday?'],['Ehdotan, että siirrämme kokouksen.','I suggest that we move the meeting.'],['Raportti on liitteenä.','The report is attached.']],
[mc('Which phrase clearly states a deadline?',['kun ehdit','perjantaihin mennessä','jos haluat'],1,'Perjantaihin mennessä means by Friday. Kun ehdit means when you have time.'),mc('What does ehdotan signal?',['A final decision','A suggestion','An apology'],1,'Ehdotan means I suggest.'),write('Type the Finnish word for “unfortunately”.',['valitettavasti'],'Valitettavasti introduces regret or unwelcome information.')],
{prompt:'Write a 120-word email moving a meeting to another day. Give a reason, propose a new time, and ask for confirmation. Read it aloud and remove any unclear request.',model:'Hei, valitettavasti en pääse kokoukseen tiistaina. Ehdotan, että siirrämme kokouksen torstaille kello kymmeneen. Voisitko vahvistaa, sopiiko uusi aika sinulle? Ystävällisin terveisin, Aino',checks:['My reader can identify the requested action.','My email uses an appropriate tone and a clear time.']}
),
lesson('b2-participles','B2','Pack more into a sentence','Participles as descriptive forms',[
'Participles can modify nouns. A present active example is lukeva opiskelija, the student who is reading. A past active example is saapunut vieras, the guest who has arrived.',
'Passive participles describe an affected noun: luettu kirja, a book that has been read. The agent construction can specify the doer: Ainon kirjoittama kirje, the letter written by Aino.',
'Participles used as adjectives normally agree with the noun. Rephrase dense structures as ordinary relative clauses when that makes your writing clearer.'
],[['lukeva','reading, present active participle'],['saapunut','arrived, past active participle'],['luettu','read, past passive participle'],['kirjoittama','written by, agent participle'],['vieras','guest'],['kirje','letter']],
[['Saapunut vieras odottaa.','The guest who has arrived is waiting.'],['Tämä on Ainon kirjoittama kirje.','This is a letter written by Aino.'],['Luettu kirja on pöydällä.','The book that has been read is on the table.']],
[mc('Who wrote Ainon kirjoittama kirje?',['Aino','An unspecified guest','Nobody is specified'],0,'Ainon names the agent of kirjoittama.'),mc('Which phrase refers to an already completed arrival?',['saapuva vieras','saapunut vieras','lukeva vieras'],1,'Saapunut is a past active participle.'),write('Complete “a book that has been read”: ___ kirja.',['luettu'],'Luettu is the past passive participle of lukea.')],
{prompt:'Turn three relative clauses into participle phrases, using the lesson examples. Then rewrite the phrases as full clauses to check that the meaning stays the same.',model:'Vieras, joka on saapunut → saapunut vieras. Kirja, joka on luettu → luettu kirja. Kirje, jonka Aino on kirjoittanut → Ainon kirjoittama kirje.',checks:['I distinguish active, passive, and agent participles.','I can expand a participle phrase into a relative clause.']}
),
lesson('b2-discussion','B2','Keep the discussion moving','Longer speech, clarification, and reporting',[
'Report speech using kertoi, että or sanoi, että, followed by a clause. Finnish does not apply the same automatic tense backshift as English. Choose time expressions and tenses from the actual timeline.',
'Check your understanding with Ymmärsinkö oikein, että…? Paraphrasing gives the other person a chance to correct an assumption.',
'When answering an extended question, state your answer early and develop it with relevant details. Practise a two-minute response, then a shorter thirty-second version.'
],[['kertoa','to tell'],['vahvistaa','to confirm'],['täsmentää','to clarify / specify'],['ymmärsinkö','did I understand, question form'],['näkökulma','perspective'],['puheenvuoro','turn / contribution in a discussion']],
[['Hän kertoi, että kokous alkaa huomenna.','He / she said that the meeting starts tomorrow.'],['Ymmärsinkö oikein, että suunnitelma muuttui?','Did I understand correctly that the plan changed?'],['Voisitko täsmentää tätä kohtaa?','Could you clarify this point?']],
[mc('What is the purpose of “Ymmärsinkö oikein, että…”?',['To check an interpretation','To end all discussion','To announce a final decision'],0,'It invites the speaker to confirm or correct your understanding.'),mc('Which principle is correct for Finnish reported speech?',['Always copy English tense backshift.','Choose tenses according to the actual timeline.','Never use a past tense.'],1,'Finnish does not follow automatic English-style backshift.'),write('Type the infinitive meaning “to clarify / specify”.',['täsmentää'],'Täsmentää asks for a more exact explanation.')],
{prompt:'Listen to a short Finnish news item from the resources page. Give a two-minute summary, state what you are uncertain about, and formulate two clarification questions. Then write a 100-word summary.',model:'Uutinen käsitteli uutta suunnitelmaa. Toimittaja kertoi, että päätös tehdään ensi viikolla. Ymmärsinkö oikein, että kustannuksia ei vielä tiedetä? Voisitko täsmentää, ketä muutos koskee?',checks:['I can summarize an extended message.','I can ask specific questions about uncertain details.']}
),
lesson('c1-register','C1','Say it for the right audience','Formal, neutral, and colloquial register',[
'Register is more than swapping a pronoun. Sentence structure, vocabulary, explicitness, and politeness all change with the audience and purpose.',
'Compare Lähetä se mulle, Voisitko lähettää sen minulle?, and Pyydän toimittamaan asiakirjan. Each can be suitable in a different context.',
'Formal writing benefits from precision, but unnecessary nominal phrases can obscure who should act. Prefer a clear human subject when responsibility matters.'
],[['asiakirja','document'],['toimittaa','to deliver / submit'],['pyydän','I request'],['sävy','tone'],['kohderyhmä','target audience'],['rekisteri','register']],
[['Lähetä se mulle.','Send it to me, colloquial.'],['Voisitko lähettää sen minulle?','Could you send it to me?'],['Pyydän toimittamaan asiakirjan.','I request that the document be submitted.']],
[mc('Which request best fits a neutral, polite message to a new colleague?',['Lähetä se mulle heti.','Voisitko lähettää sen minulle?','Anna tänne.'],1,'The conditional request is polite and clear without excessive formality.'),mc('What changes when adapting register?',['Only the pronoun','Vocabulary, structure, tone, and explicitness','Only punctuation'],1,'Register reflects the entire communicative situation.'),write('Replace colloquial mulle with its standard form.',['minulle'],'Minulle is the standard allative form.')],
{prompt:'Write the same request to a close friend, a new colleague, and a public institution. Explain your choices in Finnish. Read each aloud and check that the relationship is clear.',model:'Kaverille: Voitko lähettää sen mulle? Kollegalle: Voisitko lähettää asiakirjan minulle tänään? Viranomaiselle: Pyydän toimittamaan kopion päätöksestä sähköpostitse.',checks:['I adapt register beyond individual words.','I keep the action and responsibility clear.']}
),
lesson('c1-structures','C1','Unpack dense Finnish','Non-finite clauses and compressed structures',[
'Non-finite structures can compress a clause. Compare Kun Aino tuli kotiin, hän soitti with Tultuaan kotiin Aino soitti. The latter describes a completed action before the call.',
'A simultaneous construction can use the -essa/-essä form: Aino kuunteli musiikkia lukiessaan. With a different subject, a genitive can identify it: Aino luki lasten nukkuessa.',
'A purpose construction can use -akseen/-äkseen: Aino tuli opiskelemaan is a third-infinitive phrase; Aino tuli oppiakseen suomea expresses purpose. Be careful about whose action a possessive suffix refers to.'
],[['tultuaan','after coming, third-person possessive suffix'],['lukiessaan','while reading, third-person possessive suffix'],['oppiakseen','in order to learn, third-person possessive suffix'],['samanaikainen','simultaneous'],['tarkoitus','purpose'],['rakenne','structure']],
[['Tultuaan kotiin Aino soitti.','After coming home, Aino called.'],['Aino luki lasten nukkuessa.','Aino read while the children were sleeping.'],['Aino harjoitteli oppiakseen suomea.','Aino practised in order to learn Finnish.']],
[mc('In “Aino luki lasten nukkuessa”, who was sleeping?',['Aino','The children','The subject is impossible to identify'],1,'Lasten is the genitive subject of nukkuessa.'),mc('Which form expresses an earlier completed event?',['lukiessaan','tultuaan','oppiakseen'],1,'Tultuaan means after coming; lukiessaan is simultaneous; oppiakseen expresses purpose.'),write('Expand “Aino luki lasten nukkuessa” into a finite clause. Complete: Aino luki, kun lapset ___.',['nukkuivat'],'The expanded clause is kun lapset nukkuivat.')],
{prompt:'Expand each example into two finite clauses or one subordinate clause. Then compress two sentences of your own. Identify the actor in every structure.',model:'Tultuaan kotiin Aino soitti. → Kun Aino oli tullut kotiin, hän soitti. Aino luki lasten nukkuessa. → Aino luki, kun lapset nukkuivat.',checks:['I can recover the subject and timing of a compressed clause.','I use non-finite structures only when the meaning stays clear.']},'','advanced'
),
lesson('c1-inference','C1','Read what is implied','Reservations, understatement, and stance',[
'A sentence can imply more than it asserts. Ihan kiinnostava ehdotus may be sincere praise or reserved approval depending on the context and intonation.',
'Separate explicit facts from a writer’s evaluation and from your own inference. Qualifiers such as ainakin, toistaiseksi, and tuskin limit the commitment of a claim.',
'When interpreting a text, point to linguistic evidence and consider an alternative reading. Do not treat every indirect expression as irony.'
],[['toistaiseksi','for now / until further notice'],['ainakin','at least'],['tuskin','hardly / unlikely'],['varaus','reservation'],['vihjata','to hint'],['tulkinta','interpretation']],
[['Ehdotus on ainakin keskustelun arvoinen.','The proposal is at least worth discussing.'],['Ratkaisu toimii toistaiseksi.','The solution works for now.'],['Tämä tuskin riittää.','This is unlikely to be enough.']],
[mc('How committed is the writer to the proposed solution?',['Unconditionally supportive','Cautiously supportive with conditions','Entirely opposed'],1,'The proposal is worth testing, but the text explicitly withholds a permanent endorsement.'),mc('What does toistaiseksi restrict?',['The duration or current validity of a claim','The spelling of a noun','The location of an event'],0,'Toistaiseksi means for now; it leaves the future open.'),mc('Which statement is directly supported by the text?',['All residents support the proposal.','The long-term effects are not known.','The trial has already failed.'],1,'The text explicitly says the long-term effects are not yet known.')],
{prompt:'Write 200 words distinguishing the writer’s explicit claims, implied reservations, and possible assumptions. Quote only short phrases from the practice text. Offer one alternative interpretation.',model:'Kirjoittaja suhtautuu ehdotukseen varovaisen myönteisesti. Hän pitää kokeilua perusteltuna, mutta ei sitoudu pysyvään ratkaisuun. Ilmaus “toistaiseksi” rajaa arvion nykyhetkeen. Teksti ei osoita, että kaikki asukkaat kannattaisivat ehdotusta.',checks:['I distinguish fact, evaluation, and inference.','I support an interpretation with language from the text.']},
'Kunnan uusi liikennesuunnitelma on ainakin keskustelun arvoinen. Keskustan rauhoittaminen voisi helpottaa kävelijöiden arkea, eikä nykyistä tilannetta voi pitää erityisen toimivana. Silti olisi ennenaikaista esittää kokeilua ratkaisuna kaikkiin keskustan ongelmiin. Kauppiaiden huoli saavutettavuudesta ansaitsee tulla kuulluksi, vaikka huoli ei yksin osoita, että muutos olisi haitallinen. Toistaiseksi käytettävissä on lähinnä arvioita: pitkän aikavälin vaikutuksia ei tunneta. Kokeilua kannattaisi siksi rajata sekä ajallisesti että alueellisesti. Lisäksi olisi sovittava etukäteen, mitä onnistumisella tarkoitetaan. Jos mittarina käytetään vain liikennemäärää, kaupunkitilan muut hyödyt jäävät helposti näkymättömiksi. Ehdotus voi siis olla askel oikeaan suuntaan, kunhan varovainen alku ei muutu perustelemattomaksi varmuudeksi.'
),
lesson('c1-essay','C1','A coherent written voice','Structure, cohesion, and qualified conclusions',[
'A demanding text needs a clear question, a position, a line of reasoning, and a conclusion proportionate to the evidence. Each paragraph should advance one part of the argument.',
'Use connectors for genuine relationships, not decoration. Vaikka marks concession; sen vuoksi a consequence; sen sijaan a contrasting alternative.',
'Make the scope of a claim explicit. Tämän aineiston perusteella limits the conclusion to the material at hand. Avoid turning a small example into a universal statement.'
],[['aineisto','material / data'],['johtopäätös','conclusion'],['johdonmukainen','coherent / consistent'],['sen sijaan','instead / in contrast'],['sen vuoksi','therefore / for that reason'],['rajata','to delimit']],
[['Tämän aineiston perusteella muutos näyttää hyödylliseltä.','On the basis of this material, the change seems useful.'],['Sen sijaan toinen kysymys jää avoimeksi.','In contrast, another question remains open.'],['Johtopäätös on rajattava tähän tapaukseen.','The conclusion must be limited to this case.']],
[mc('Which wording appropriately limits a conclusion?',['Kaikki ihmiset ajattelevat näin.','Tämän aineiston perusteella…','Tämä todistaa kaiken.'],1,'The phrase limits the inference to the material used.'),mc('What relationship does sen sijaan signal?',['A contrasting alternative','A chronological sequence only','An unconditional agreement'],0,'Sen sijaan presents a contrasting alternative.'),write('Type the Finnish word for “conclusion”.',['johtopäätös'],'Johtopäätös is a conclusion drawn from reasoning or evidence.')],
{prompt:'Write 300–400 Finnish words on whether remote work should be the default for office roles. Develop a position, address a credible counterargument, and limit your conclusion. Revise once for structure and once for language.',model:'Etätyön soveltuvuus riippuu työn tavoitteista ja yhteisön tarpeista. Siksi yhtä toimintamallia ei kannata ulottaa kaikkiin tehtäviin. Arvion pitäisi perustua työn tuloksiin, yhteistyön laatuun ja työntekijöiden kokemuksiin, ei pelkkään toimistolla vietettyyn aikaan.',checks:['Every paragraph advances the argument.','My conclusion stays within the evidence and scope.']}
),
lesson('c1-negotiate','C1','Disagree without losing the thread','Negotiation, reformulation, and precision',[
'In a difficult conversation, show what you understood before stating the disagreement. Ymmärrän näkökulmasi, mutta… acknowledges a view without endorsing it.',
'Distinguish a boundary, a preference, and a proposal. Emme voi… is a boundary; toivoisin… a preference; ehdotan… a proposal.',
'When agreement is partial, specify the part: Tästä olemme samaa mieltä. Reformulate the unresolved point and propose an actionable next step.'
],[['neuvotella','to negotiate'],['kompromissi','compromise'],['edellytys','precondition'],['täsmällinen','precise'],['toivoisin','I would hope / wish'],['samaa mieltä','of the same opinion / in agreement']],
[['Ymmärrän näkökulmasi, mutta aikataulu on liian tiukka.','I understand your perspective, but the schedule is too tight.'],['Tästä olemme samaa mieltä.','We agree on this.'],['Ehdotan, että aloitamme pienellä kokeilulla.','I suggest that we begin with a small trial.']],
[mc('Which phrase states a proposal?',['Ehdotan, että…','Emme voi…','Toivoisin…'],0,'Ehdotan introduces a suggestion or proposal.'),mc('What does acknowledging a view accomplish?',['It necessarily accepts the view.','It demonstrates understanding before disagreement.','It eliminates the need for reasons.'],1,'Understanding and agreement are different.'),write('Complete “we agree”: Olemme ___ mieltä.',['samaa'],'Olla samaa mieltä means to agree.')],
{prompt:'Role-play a three-minute negotiation about a project deadline. State one constraint, acknowledge the other side’s concern, offer two alternatives, and summarize any agreement. Record yourself and listen for vague claims.',model:'Ymmärrän, että tarvitsette tulokset nopeasti. Emme kuitenkaan voi luvata valmista raporttia perjantaiksi. Voimme lähettää alustavat havainnot silloin ja lopullisen raportin tiistaina. Sopisiko tämä teille?',checks:['I separate constraints from preferences.','I can summarize agreement and the remaining disagreement.']}
),
lesson('c1-literary','C1','A closer look at voice','Narrative viewpoint, rhythm, and implied emotion',[
'A literary reading asks both what happens and how the text makes you perceive it. Notice viewpoint, rhythm, repeated images, and what the narrator leaves unstated.',
'Short sentences can slow a moment or sharpen a contrast. Concrete details can imply emotion without naming it. Neither technique has a fixed meaning outside context.',
'Support an interpretation with specific details, and keep competing readings possible where the text is ambiguous.'
],[['kertoja','narrator'],['näkökulma','viewpoint'],['rytmi','rhythm'],['hiljaisuus','silence'],['epävarmuus','uncertainty'],['kaipaus','longing']],
[['Kertoja ei nimeä tunnetta.','The narrator does not name the emotion.'],['Hiljaisuus muuttaa kohtauksen sävyä.','Silence changes the scene’s tone.'],['Yksityiskohta tukee tätä tulkintaa.','A detail supports this interpretation.']],
[mc('What event is explicitly described?',['Aino returns to a familiar house.','Aino meets her mother in the kitchen.','Aino sells the house.'],0,'Only the return is described; the text does not say someone is present or a sale occurs.'),mc('Which detail suggests continuity?',['The familiar scratch on the table','A newly painted gate','A loud celebration'],0,'The unchanged scratch connects the current scene to the past.'),mc('Which interpretation is appropriately cautious?',['The silence may suggest absence or emotional distance.','The narrator proves that the house is haunted.','Aino is certainly happy.'],0,'The text leaves the precise emotional cause open.')],
{prompt:'Write a 250-word reading of the scene. Discuss two details and the effect of the final sentence. Then rewrite the passage in a noticeably different emotional tone while keeping the events unchanged.',model:'Pöydän naarmu yhdistää nykyhetken menneeseen. Teksti ei kerro suoraan, mitä Aino tuntee, mutta tutun äänen odottaminen vihjaa poissaoloon. Viimeinen lause jättää avoimeksi, mitä paluu lopulta merkitsee.',checks:['I explain how form affects interpretation.','I distinguish an explicit event from implied emotion.']},
'Aino avasi oven samalla avaimella kuin ennenkin. Se kääntyi lukossa hieman vastahakoisesti, aivan kuten lapsuudessa. Keittiön pöytä oli paikallaan, ja sen reunassa näkyi yhä pieni naarmu, jonka syntyä kukaan ei ollut koskaan myöntänyt muistavansa. Hän laski laukkunsa lattialle ja jäi seisomaan. Ikkunan takana koivu liikkui tuulessa. Jossakin pihan toisella puolella kolahti ovi, mutta talossa oli hiljaista. Aino huomasi odottavansa askelia, kysymystä matkan sujumisesta tai vedenkeittimen tuttua napsahdusta. Mitään niistä ei kuulunut. Hän veti tuolin esiin ja istui pöydän ääreen. Naarmu tuntui sormen alla samalta kuin ennen. Muut asiat olivat vaikeampia tunnistaa.'
),
lesson('c2-synthesis','C2','Bring sources into conversation','Synthesis without flattening disagreement',[
'Synthesis organizes sources around a question rather than summarizing one source after another. Track where they agree, where they conflict, and whether their assumptions differ.',
'Attribute claims accurately. A writer’s reported concern is not necessarily an established fact. Keep the strength of each claim intact when paraphrasing.',
'An effective synthesis can leave a disagreement unresolved. Explain what additional evidence would distinguish the competing positions.'
],[['yhteenveto','summary'],['ristiriita','contradiction / conflict'],['oletus','assumption'],['näyttö','evidence'],['vertailla','to compare'],['luotettavuus','reliability']],
[['Lähteet ovat eri mieltä muutoksen vaikutuksista.','The sources disagree about the effects of the change.'],['Ero johtuu osittain erilaisista oletuksista.','The difference is partly due to different assumptions.'],['Väitteen tueksi tarvitaan lisää näyttöä.','More evidence is needed to support the claim.']],
[mc('What is the shared concern of both positions?',['The quality of work and cooperation','The color of office furniture','Eliminating every workplace'],0,'Both discuss quality and cooperation but prioritize different mechanisms.'),mc('What is an accurate synthesis of the two views?',['Both reject remote work entirely.','They differ over how location affects cooperation and autonomy.','Neither gives any reason.'],1,'One emphasizes autonomy; the other emphasizes informal contact.'),mc('What additional evidence would be most useful?',['An unsupported slogan','Task-specific outcomes and staff experiences','The author’s favorite color'],1,'Evidence about work outcomes and cooperation could test the assumptions.')],
{prompt:'Write a 400–500-word synthesis of these positions. Then choose two Finnish articles on the same topic from the resources and repeat the task with citations. Distinguish agreement, assumptions, and unresolved questions.',model:'Kummassakin näkemyksessä työn laatu on keskeinen tavoite, mutta keinot eroavat. Ensimmäinen korostaa työntekijän autonomiaa, toinen epämuodollisen yhteistyön merkitystä. Ristiriitaa ei voi ratkaista pelkällä läsnäolotiedolla, vaan tarvitaan tehtäväkohtaista näyttöä ja kokemuksia yhteistyöstä.',checks:['I organize the synthesis around issues rather than source order.','I preserve qualifications and identify missing evidence.']},
`Näkökulma A: Etätyö antaa työntekijälle mahdollisuuden järjestää päivänsä tehtävien mukaan. Rauhaa vaativa työ ei välttämättä hyödy toimistosta, jossa keskeytyksiä on paljon. Työn laatua pitäisi arvioida tulosten eikä läsnäolon perusteella. Autonomia voi myös lisätä vastuuta: työntekijä joutuu tekemään omat prioriteettinsa näkyviksi. Tämä ei silti tarkoita, että kaikki tapaamiset pitäisi siirtää verkkoon.

Näkökulma B: Yhteistyössä tärkeä tieto ei aina synny ennalta sovituissa kokouksissa. Lyhyt keskustelu käytävällä voi paljastaa ongelman, jota kukaan ei olisi osannut nostaa esityslistalle. Toimisto voi siis tukea yhteistä ymmärrystä, vaikka siellä vietetty aika ei yksin mittaa työn laatua. Joustavuus on tarpeen, mutta sen rinnalla pitäisi huolehtia siitä, että myös uudet työntekijät pääsevät mukaan epämuodollisiin keskusteluihin.`
),
lesson('c2-ambiguity','C2','Meaning between the lines','Ambiguity, irony, and pragmatic interpretation',[
'At an advanced level, interpretation includes the relationship between literal wording, context, and speaker intention. The same sentence can praise, criticize, or simply report.',
'No single word guarantees irony. Evidence can come from an incongruity, a shared situation, a shift in tone, or an intentionally exaggerated conclusion.',
'When context is insufficient, keep multiple interpretations open. Ask a precise clarification question rather than confidently guessing an intention.'
],[['ironia','irony'],['monitulkintainen','ambiguous'],['kirjaimellinen','literal'],['asiayhteys','context'],['liioittelu','exaggeration'],['tarkoitusperä','intention / motive']],
[['Olipa nopeaa palvelua.','That was quick service, potentially ironic in context.'],['Tulkinta riippuu asiayhteydestä.','The interpretation depends on context.'],['Tarkoitatko tätä kirjaimellisesti?','Do you mean this literally?']],
[mc('After a two-hour wait, “Olipa nopeaa palvelua” most plausibly conveys…',['A neutral measurement of speed','Ironic criticism','A definite promise'],1,'The claim of quick service conflicts with the described long wait, supporting irony.'),mc('Without context, is that same sentence necessarily ironic?',['Yes','No','Only in writing'],1,'It can also be sincere praise after quick service.'),write('Type the Finnish word meaning “context”.',['asiayhteys'],'Asiayhteys helps determine a sentence’s intended meaning.')],
{prompt:'Create three contexts for “Olipa nopeaa palvelua”: sincere, ironic, and uncertain. Explain the evidence for each in Finnish. Record yourself saying the phrase in two contrasting tones.',model:'Jos asiakas saa apua heti, lause voi olla vilpitön kehu. Kahden tunnin odotuksen jälkeen sama ilmaus voi olla ironinen moite. Ilman tietoa tilanteesta ja äänensävystä tulkintaa ei voi varmistaa.',checks:['I use contextual evidence rather than keyword rules.','I can maintain uncertainty when an intention is unclear.']}
),
lesson('c2-style','C2','Edit for precision and effect','Advanced revision, rhythm, and concision',[
'Revision can change emphasis without changing the facts. Decide what the reader should notice first, then adjust information order, sentence length, and word choice.',
'Avoid hiding responsibility in vague passive or nominal phrases when the actor matters. At the same time, use passive or impersonal structures when the actor is unknown or irrelevant.',
'Check reference chains, time relationships, and claim strength. A shorter text is better only if it preserves the distinctions the reader needs.'
],[['tiivistää','to condense / summarize'],['painotus','emphasis'],['viittaus','reference'],['vastuu','responsibility'],['epämääräinen','vague'],['muokata','to edit / modify']],
[['Tiimi arvioi tulokset perjantaina.','The team will evaluate the results on Friday.'],['Tulokset arvioidaan perjantaina.','The results will be evaluated on Friday.'],['Kumpi muoto tekee vastuun näkyväksi?','Which form makes responsibility visible?']],
[mc('Which sentence explicitly identifies who evaluates the results?',['Tulokset arvioidaan perjantaina.','Tiimi arvioi tulokset perjantaina.','Arviointi tapahtuu.'],1,'Tiimi explicitly names the actor.'),mc('When is an impersonal form useful?',['When the actor is irrelevant or unknown','Always, because it sounds longer','Only when the actor is the writer'],0,'The information needs of the reader determine the choice.'),mc('What must a concise revision preserve?',['Every original word','The important distinctions and claim strength','All repetition'],1,'Concision is useful when it keeps the meaning and necessary qualifications.')],
{prompt:'Revise a 300-word Finnish text you wrote in an earlier lesson. Make a version 25% shorter, then a version with a different emphasis. Explain five edits in Finnish and check that you did not strengthen the claims accidentally.',model:'Muutin passiivin aktiiviksi, koska vastuun piti näkyä. Poistin toistuvan perustelun, mutta säilytin rajauksen. Siirsin pääväitteen alkuun, jotta lukija ymmärtää tekstin tavoitteen heti.',checks:['I can explain the purpose of each important edit.','I preserve meaning while changing emphasis and length.']}
),
lesson('c2-spontaneous','C2','Think on your feet','Unprepared speaking and conversational flexibility',[
'Spontaneous fluency includes reformulation, turn-taking, and handling unexpected questions. A natural pause is acceptable; a memorized speech alone does not demonstrate interaction.',
'Practise answering the same question for different audiences. Give an initial answer, justify it, and adapt when the other person challenges an assumption.',
'Use Erottaisin tässä kaksi asiaa… to make a useful distinction, or Jos ymmärsin kysymyksen oikein… to verify the question before answering.'
],[['spontaani','spontaneous'],['vuorovaikutus','interaction'],['vastaväite','counterargument'],['erottaa','to distinguish'],['keskeyttää','to interrupt'],['muotoilla uudelleen','to reformulate']],
[['Erottaisin tässä kaksi asiaa.','I would distinguish two things here.'],['Jos ymmärsin kysymyksen oikein…','If I understood the question correctly…'],['Muotoilen tämän uudelleen.','I will reformulate this.']],
[mc('Which activity best practises spontaneous interaction?',['Reading one memorized speech only','Responding to an unexpected follow-up question','Copying a paragraph silently'],1,'The follow-up question requires adapting in real time.'),mc('What can “Erottaisin tässä kaksi asiaa” accomplish?',['Introduce a useful distinction','Promise an unconditional agreement','End the discussion automatically'],0,'The phrase lets you separate ideas that the question may have conflated.'),write('Complete “interaction” in Finnish with the lesson word.',['vuorovaikutus'],'Vuorovaikutus means interaction.')],
{prompt:'Speak for three minutes about a policy you would change in your city. Then answer: Who could be disadvantaged? What evidence could change your view? What would you do with half the budget? Practise with a Finnish-speaking partner for real turn-taking.',model:'Aloittaisin pienestä kokeilusta. Erottaisin tässä kaksi asiaa: tavoitteen ja toteutustavan. Tavoite voi olla perusteltu, vaikka ensimmäinen suunnitelma ei toimisi. Muuttaisin kantaani, jos kokeilu osoittaisi haittojen ylittävän hyödyt.',checks:['I can respond to unfamiliar follow-up questions.','I can reformulate a point without losing the discussion.']}
),
lesson('c2-assessment','C2','Put your Finnish to the test','An integrated reading, listening, writing, and speaking project',[
'A course completion record is not a proficiency certificate. Assess what you can do with new material across reading, listening, speaking, and writing.',
'Choose an unfamiliar Finnish topic. Read two sources, listen to an extended discussion, summarize the disagreements, and produce an independent response.',
'Ask a qualified Finnish teacher or proficient speaker for feedback on accuracy, range, coherence, interaction, and register. Revise your work and use the findings to plan the next cycle.'
],[['arviointi','assessment'],['kielitaito','language proficiency'],['sujuvuus','fluency'],['tarkkuus','accuracy'],['palaute','feedback'],['tavoite','goal']],
[['Haluan palautetta kieleni tarkkuudesta.','I want feedback on the accuracy of my language.'],['Tämä on harjoitus, ei kielitutkinto.','This is a practice task, not a language examination.'],['Seuraava tavoitteeni on spontaani keskustelu.','My next goal is spontaneous conversation.']],
[mc('What does finishing this course establish?',['A formally certified C2 level','Completion of the course activities','Guaranteed native-speaker ability'],1,'Course completion records the activities you completed, not independently assessed proficiency.'),mc('Which assessment includes interaction?',['A silent vocabulary list','An unscripted discussion with follow-up questions','Only a copied essay'],1,'A live discussion reveals turn-taking and adaptation to another speaker.'),mc('What should guide your next study cycle?',['Only your lesson count','Specific feedback and observed weaknesses','A promise of instant fluency'],1,'Use evidence about your actual performance to select the next practice goals.')],
{prompt:'Complete a capstone over several study sessions: read two Finnish sources, listen for 20 minutes, write a 500-word synthesis, give a five-minute presentation, and discuss it with a Finnish speaker. Save the synthesis here and record the feedback you receive.',model:'Aiheeni on kaupunkien liikenne. Vertailen kahta näkökulmaa, erotan havainnot oletuksista ja perustelen oman johtopäätökseni. Pyydän palautetta erityisesti väitteiden täsmällisyydestä, tekstin rakenteesta ja keskustelun sujuvuudesta.',checks:['I have tested all four language skills with unfamiliar material.','I have obtained feedback and identified my next study priorities.']}
),
lesson('c2-continue','C2','Make Finnish part of your life','A sustainable immersion and feedback routine',[
'Advanced learning continues with varied, demanding input and regular output. Read different genres, listen to unscripted conversations, and use Finnish with other people.',
'Keep a record of recurring errors and new expressions in context. Revisit the same material after feedback to notice distinctions you missed the first time.',
'Use the level self-checks as reflection prompts, not scores. For an official proficiency result, use an appropriately administered language examination and its published criteria.'
],[['ylläpitää','to maintain'],['syventää','to deepen'],['ilmaisu','expression'],['toistuva','recurring'],['havainto','observation'],['harjoittelurutiini','practice routine']],
[['Haluan syventää kielitaitoani.','I want to deepen my language proficiency.'],['Kirjaan toistuvat virheet muistiin.','I note down recurring errors.'],['Käytän suomea joka päivä.','I use Finnish every day.']],
[mc('Which routine supports continued advanced development?',['Only repeating the same beginner phrases','Varied input, active output, and feedback','Stopping after the final lesson'],1,'Variety and feedback expose weaknesses that lesson repetition alone can miss.'),mc('How should a self-check be used?',['As an official certificate','As a reflection prompt','As proof of perfect accuracy'],1,'Self-checks help identify what to practise; they are not independent certification.'),write('Type the Finnish verb for “to deepen”.',['syventää'],'Syventää means to deepen.')],
{prompt:'Write a four-week Finnish practice plan. Include two reading genres, two listening formats, regular conversations, one weekly written piece, and a feedback session. Choose a specific weakness to track.',model:'Luen joka viikko uutisia ja kaunokirjallisuutta. Kuuntelen haastatteluja ja keskusteluohjelmia. Kirjoitan yhden tekstin viikossa ja pyydän siitä palautetta. Harjoittelen keskustelua kahdesti viikossa. Seuraan erityisesti objektin sijamuotoja.',checks:['My plan includes input, output, interaction, and feedback.','I have chosen a specific skill to develop next.']},'','cefr'
)
);

Object.assign(SOURCES,{
genitive:{name:'Uusi kielemme · Genitive',url:'https://uusikielemme.fi/finnish-grammar/finnish-cases/grammatical-cases/the-genitive-case-genetiivi'},
plural:{name:'Uusi kielemme · Nominative plural',url:'https://uusikielemme.fi/finnish-grammar/finnish-cases/grammatical-cases/the-t-plural-t-monikko-plural-nominative'},
stems:{name:'Uusi kielemme · Noun inflection',url:'https://uusikielemme.fi/inflection-of-nouns-finnish-grammar'},
likes:{name:'Uusi kielemme · Preferences',url:'https://uusikielemme.fi/finnish-grammar/syntax/rections/tykata-and-pitaa-saying-you-like-things-in-finnish'},
food:{name:'Uusi kielemme · Food and objects',url:'https://uusikielemme.fi/finnish-grammar/syntax/object-sentences/mass-nouns-as-objects-food-and-the-partitive'},
numbers:{name:'Uusi kielemme · Numbers',url:'https://uusikielemme.fi/finnish-vocabulary/vocabulary-lists/the-numbers-in-finnish-numerot'},
time:{name:'Uusi kielemme · Telling time',url:'https://uusikielemme.fi/finnish-vocabulary/vocabulary-lists/telling-the-time-in-finnish-mita-kello-on'},
imperative:{name:'Uusi kielemme · Imperative',url:'https://uusikielemme.fi/finnish-grammar/verbs/verb-tenses-and-moods/the-imperative-mood-imperatiivi-tule-mene-syo'}
});
// Retrieval of taught examples supplements recognition questions. Open production stays ungraded.
for(const item of LESSONS){
  for(const [fi,en] of item.examples.slice(0,2))item.questions.push(write('Recall the taught example for: '+en,[fi],'The taught example is: '+fi+' Other natural translations may exist; this check practises recalling this example.'));
}
LESSONS.push(...EXTRA_LESSONS);
const order=new Map(ORDER.map((id,index)=>[id,index]));
const levels=new Map(LEVELS.map((level,index)=>[level.id,index]));
LESSONS.sort((a,b)=>(levels.get(a.level)-levels.get(b.level))||((order.get(a.id)??999)-(order.get(b.id)??999)));
// Rotate options without changing their correctness, so the answer position does not teach a shortcut.
for(const item of LESSONS)for(const [index,q] of item.questions.entries())if(q.options){const shift=(item.id.length+index+item.id.charCodeAt(3))%q.options.length;q.options=[...q.options.slice(shift),...q.options.slice(0,shift)];q.answer=(q.answer-shift+q.options.length)%q.options.length;}
