/* =====================================================================
 * city-itineraries.js  —  Quo Vadis
 * ---------------------------------------------------------------------
 * In-depth, Vilnius-style walking itineraries for the trip's main cities.
 *
 * Each city is an ordered list of stops. Each stop carries a LONG bilingual
 * (IT + EN) description sourced ONLY from real references (cited in `src`).
 * The same description is shown in the itinerary card AND in the map popup
 * (expandable). Coordinates are real place coordinates.
 *
 * Cities (trip order): Vienna, Varsavia, Vilnius, Riga, Tallinn, Trondheim,
 * Bergen, Copenhagen, San Sebastián, Bilbao, Genova.
 *
 * NOTE: This file is data-only. Rendering + map live in city-itineraries-ui.js.
 * ===================================================================== */
(function () {
  'use strict';

  var CITY_ITINERARIES = {
  "vienna": {
    "city": "Vienna",
    "cityEN": "Vienna",
    "country": "Austria",
    "countryEN": "Austria",
    "flag": "🇦🇹",
    "intro": "Vienna è una città di grandezza imperiale, musica classica e architettura mozzafiato. Questo itinerario a piedi ti porta attraverso il suo cuore storico, mescolando palazzi reali, mercati vivaci e musei per famiglie.",
    "introEN": "Vienna is a city of imperial grandeur, classical music, and stunning architecture. This walking itinerary takes you through its historic heart, blending royal palaces, vibrant markets, and family-friendly museums.",
    "center": [
      48.205,
      16.366
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "vie-1",
        "name": "Cattedrale di Santo Stefano",
        "nameEN": "St. Stephen's Cathedral",
        "cat": "cultura",
        "lat": 48.20849,
        "lng": 16.37311,
        "short": "Iconica cattedrale gotica con uno splendido tetto di tegole e un'alta guglia che offre viste mozzafiato sulla città.",
        "shortEN": "Iconic Gothic cathedral with a stunning tiled roof and a towering spire offering breathtaking city views.",
        "desc": "La Cattedrale di Santo Stefano, o Stephansdom, è la chiesa madre dell'Arcidiocesi di Vienna e la sede dell'Arcivescovo. Ergendo fiera nel cuore della città, il suo splendido tetto di tegole multicolori è diventato uno dei simboli più riconoscibili della capitale. L'attuale struttura romanica e gotica fu in gran parte voluta dal duca Rodolfo IV nel XIV secolo, sebbene la chiesa originale risalga al 1147. La magnifica Torre Sud, affettuosamente conosciuta come \"Steffl\", raggiunge un'impressionante altezza di 136 metri e domina lo skyline viennese. I visitatori possono salire i 343 gradini della torre per godere di una vista mozzafiato o esplorare le misteriose catacombe sottostanti. La cattedrale ha assistito a molti eventi importanti della storia asburgica e austriaca, rendendola un punto di partenza essenziale per qualsiasi tour a piedi del centro storico di Vienna.",
        "descEN": "St. Stephen's Cathedral, or Stephansdom, is the mother church of the Roman Catholic Archdiocese of Vienna and the seat of the Archbishop. Standing proudly in the heart of the city, its stunning multi-colored tile roof has become one of the city's most recognizable symbols. The current Romanesque and Gothic structure was largely initiated by Duke Rudolf IV in the 14th century, though the original church dates back to 1147. The magnificent South Tower, affectionately known as \"Steffl,\" reaches an impressive height of 136 meters and dominates the Viennese skyline. Visitors can climb the 343 steps of the tower for a breathtaking view or explore the mysterious catacombs below. The cathedral has witnessed many important events in Habsburg and Austrian history, making it an essential starting point for any walking tour of Vienna's historic center.",
        "tips": "Ingresso gratuito nell'area principale; biglietti richiesti per torri e catacombe. Aperto tutti i giorni 6:00 - 22:00.",
        "tipsEN": "Free to enter the main area; tickets required for towers and catacombs. Open daily 6:00 AM - 10:00 PM.",
        "src": [
          "Wikipedia \"St. Stephen's Cathedral, Vienna\"",
          "stephansdom.at"
        ],
        "maps": "https://maps.google.com/?q=48.20849,16.37311"
      },
      {
        "id": "vie-2",
        "name": "Palazzo dell'Hofburg",
        "nameEN": "Hofburg Palace",
        "cat": "cultura",
        "lat": 48.2065,
        "lng": 16.36526,
        "short": "Il grandioso ex palazzo imperiale degli Asburgo, che oggi ospita affascinanti musei e l'ufficio del Presidente austriaco.",
        "shortEN": "The grand former imperial palace of the Habsburgs, now housing fascinating museums and the Austrian President's office.",
        "desc": "Il Palazzo dell'Hofburg è l'ex principale palazzo imperiale della dinastia degli Asburgo e una magnifica testimonianza della ricca storia imperiale dell'Austria. Situato nel centro di Vienna, questo vasto complesso fu originariamente costruito nel XIII secolo e continuamente ampliato nel corso dei secoli da vari imperatori. Oggi funge da residenza ufficiale e luogo di lavoro del Presidente dell'Austria. Il complesso del palazzo ospita numerosi musei di fama mondiale, tra cui il Museo di Sisi, gli Appartamenti Imperiali e la Scuola di Equitazione Spagnola. Passeggiando per i suoi grandi cortili, i visitatori possono ammirare un'affascinante miscela di stili architettonici, dal gotico al barocco e al neoclassico. L'Hofburg è stato il centro politico dell'Impero austro-ungarico fino al 1918, e l'esplorazione dei suoi vasti terreni offre un viaggio accattivante nello stile di vita opulento di una delle famiglie reali più potenti d'Europa.",
        "descEN": "The Hofburg Palace is the former principal imperial palace of the Habsburg dynasty and a magnificent testament to Austria's rich imperial history. Located in the center of Vienna, this sprawling complex was originally built in the 13th century and continuously expanded over the centuries by various emperors. Today, it serves as the official residence and workplace of the President of Austria. The palace complex houses numerous world-class museums, including the Sisi Museum, the Imperial Apartments, and the Spanish Riding School. Walking through its grand courtyards, visitors can admire a fascinating blend of architectural styles, from Gothic to Baroque and Neo-Classic. The Hofburg was the political center of the Austro-Hungarian Empire until 1918, and exploring its vast grounds offers a captivating journey into the opulent lifestyle of one of Europe's most powerful royal families.",
        "tips": "Acquista un Sisi Ticket per l'accesso combinato agli Appartamenti Imperiali, al Museo di Sisi e alla Collezione degli Argenti.",
        "tipsEN": "Buy a Sisi Ticket for combined access to the Imperial Apartments, Sisi Museum, and Silver Collection.",
        "src": [
          "Wikipedia \"Hofburg\"",
          "hofburg-wien.at"
        ],
        "maps": "https://maps.google.com/?q=48.20650,16.36526"
      },
      {
        "id": "vie-3",
        "name": "Museo di Storia Naturale",
        "nameEN": "Natural History Museum",
        "cat": "kids",
        "lat": 48.20522,
        "lng": 16.35937,
        "short": "Uno spettacolare museo di storia naturale con scheletri di dinosauri, antichi manufatti e mostre interattive perfette per le famiglie.",
        "shortEN": "A spectacular natural history museum featuring dinosaur skeletons, ancient artifacts, and interactive exhibits perfect for families.",
        "desc": "Il Museo di Storia Naturale di Vienna, o Naturhistorisches Museum, è uno dei musei di storia naturale più importanti al mondo e una destinazione fantastica per le famiglie. Inaugurato nel 1889, il magnifico edificio palaziale fu commissionato dall'imperatore Francesco Giuseppe I per ospitare l'enorme collezione di manufatti naturali degli Asburgo. Oggi, il museo espone oltre 30 milioni di oggetti in 39 sale espositive. I punti salienti includono la famosa Venere di Willendorf di 29.500 anni fa, la più grande e antica collezione pubblica di meteoriti al mondo e una spettacolare sala dei dinosauri con un modello di Allosauro in movimento che i bambini adorano. La splendida architettura dell'edificio, con i suoi intricati affreschi sul soffitto e la grande scalinata, è un'attrazione in sé. Offre un'esperienza coinvolgente, educativa e divertente per visitatori di tutte le età.",
        "descEN": "The Natural History Museum of Vienna, or Naturhistorisches Museum, is one of the most important natural history museums in the world and a fantastic destination for families. Opened in 1889, the magnificent palatial building was commissioned by Emperor Franz Joseph I to house the Habsburgs' massive collection of natural artifacts. Today, the museum displays over 30 million objects across 39 exhibition halls. Highlights include the famous 29,500-year-old Venus of Willendorf, the world's largest and oldest public collection of meteorites, and a spectacular dinosaur hall featuring a moving, roaring Allosaurus model that kids absolutely love. The building's stunning architecture, with its intricate ceiling frescoes and grand staircase, is an attraction in itself. It provides an engaging, educational, and fun experience for visitors of all ages, making it a perfect family-friendly stop on your walking tour.",
        "tips": "Chiuso il martedì. Ingresso gratuito per bambini e ragazzi sotto i 19 anni. Non perdetevi il dinosauro in movimento!",
        "tipsEN": "Closed on Tuesdays. Free entry for children and teens under 19. Don't miss the moving dinosaur model!",
        "src": [
          "Wikipedia \"Natural History Museum, Vienna\"",
          "nhm-wien.ac.at"
        ],
        "maps": "https://maps.google.com/?q=48.20522,16.35937"
      },
      {
        "id": "vie-4",
        "name": "Naschmarkt",
        "nameEN": "Naschmarkt",
        "cat": "cibo",
        "lat": 48.19864,
        "lng": 16.36142,
        "short": "Il mercato all'aperto più famoso di Vienna, vivace con diverse bancarelle di cibo, prelibatezze locali e prelibatezze culinarie internazionali.",
        "shortEN": "Vienna's most famous open-air market, bustling with diverse food stalls, local delicacies, and international culinary treats.",
        "desc": "Il Naschmarkt è il mercato all'aperto più popolare e vivace di Vienna, che offre una deliziosa esperienza sensoriale per gli amanti del cibo. Risalente al XVI secolo, originariamente iniziò come un luogo in cui venivano vendute principalmente bottiglie di latte. Nel corso dei secoli, si è evoluto in un vivace punto di ritrovo culinario che si estende per circa 1,5 chilometri. Oggi, il mercato ospita circa 120 bancarelle e ristoranti, offrendo un mix colorato di prelibatezze tradizionali viennesi e cucina internazionale, da prodotti freschi e spezie esotiche a dolci mediorientali e frutti di mare freschi. È il luogo perfetto per fare una pausa dalle visite turistiche, fare uno spuntino veloce o godersi un pasto rilassato. Il sabato, l'area diventa ancora più vivace con un famoso mercato delle pulci adiacente alle bancarelle di cibo, rendendolo un vivace centro culturale.",
        "descEN": "The Naschmarkt is Vienna's most popular and vibrant open-air market, offering a delightful sensory experience for food lovers. Dating back to the 16th century, it originally started as a place where mainly milk bottles were sold. Over the centuries, it has evolved into a bustling culinary hotspot stretching for about 1.5 kilometers. Today, the market features around 120 stalls and restaurants, offering a colorful mix of traditional Viennese delicacies and international cuisine, from fresh produce and exotic spices to Middle Eastern sweets and fresh seafood. It is the perfect place to take a break from sightseeing, grab a quick snack, or enjoy a relaxed sit-down meal. On Saturdays, the area becomes even more lively with a famous flea market adjacent to the food stalls, making it a vibrant cultural and gastronomic hub in the city.",
        "tips": "La maggior parte delle bancarelle è aperta dal lunedì al sabato. Porta contanti, alcuni piccoli venditori non accettano carte.",
        "tipsEN": "Most stalls are open Monday to Saturday. Bring cash, as some smaller vendors may not accept cards.",
        "src": [
          "Wikipedia \"Naschmarkt\"",
          "wien.gv.at"
        ],
        "maps": "https://maps.google.com/?q=48.19864,16.36142"
      },
      {
        "id": "vie-5",
        "name": "Karlskirche",
        "nameEN": "Karlskirche",
        "cat": "panorama",
        "lat": 48.19822,
        "lng": 16.37186,
        "short": "Una magnifica chiesa barocca dotata di un ascensore panoramico che ti porta ad ammirare i suoi splendidi affreschi della cupola.",
        "shortEN": "A magnificent Baroque church featuring a panoramic elevator that takes you up to admire its stunning dome frescoes.",
        "desc": "La Karlskirche, o Chiesa di San Carlo, è ampiamente considerata la chiesa barocca più eccezionale di Vienna e un vero capolavoro architettonico. Commissionata dall'imperatore del Sacro Romano Impero Carlo VI nel 1713 dopo l'ultima grande epidemia di peste, la chiesa fu completata nel 1737. Progettata dall'architetto Johann Bernhard Fischer von Erlach, la sua sorprendente facciata presenta un'enorme cupola e due colonne splendidamente scolpite ispirate alla Colonna Traiana a Roma. Ciò che rende la Karlskirche davvero unica è il suo ascensore panoramico, che porta i visitatori in alto nella cupola. Questo permette di osservare da vicino i magnifici affreschi del soffitto dipinti da Johannes Michael Rottmayr, oltre a offrire una bellissima vista panoramica su Vienna. La chiesa è anche famosa per ospitare regolarmente concerti di musica classica, in particolare il Requiem di Mozart e le Quattro Stagioni di Vivaldi.",
        "descEN": "Karlskirche, or St. Charles Church, is widely considered the most outstanding Baroque church in Vienna and a true architectural masterpiece. Commissioned by Holy Roman Emperor Charles VI in 1713 after the last great plague epidemic, the church was completed in 1737. Designed by architect Johann Bernhard Fischer von Erlach, its striking facade features a massive dome and two beautifully carved columns inspired by Trajan's Column in Rome. What makes Karlskirche truly unique is its panoramic elevator, which takes visitors high up into the dome. This allows for an incredibly close look at the magnificent ceiling frescoes painted by Johannes Michael Rottmayr, as well as offering a beautiful panoramic view over Vienna. The church is also famous for hosting regular classical music concerts, particularly Mozart's Requiem and Vivaldi's Four Seasons, making it a cultural highlight.",
        "tips": "Il biglietto d'ingresso include la corsa in ascensore panoramico. Aperto lunedì-sabato 9:00-18:00, domenica dalle 12:00.",
        "tipsEN": "Entrance fee includes the panoramic elevator ride. Open Monday-Saturday 9:00 AM - 6:00 PM, Sundays from 12:00 PM.",
        "src": [
          "Wikipedia \"Karlskirche\"",
          "karlskirche.at"
        ],
        "maps": "https://maps.google.com/?q=48.19822,16.37186"
      }
    ]
  },
  "varsavia": {
    "city": "Varsavia",
    "cityEN": "Warsaw",
    "country": "Polonia",
    "countryEN": "Poland",
    "flag": "🇵🇱",
    "intro": "Scopri il cuore storico di Varsavia, dove l'architettura meticolosamente ricostruita incontra leggende affascinanti in un centro storico compatto e pedonale.",
    "introEN": "Discover the historic heart of Warsaw, where meticulously reconstructed architecture meets captivating legends in a compact, pedestrian-friendly Old Town.",
    "center": [
      52.24972,
      21.01222
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "war-1",
        "name": "Terrazza Panoramica di Sant'Anna",
        "nameEN": "St. Anne's Church Observation Deck",
        "cat": "panorama",
        "lat": 52.24604,
        "lng": 21.01382,
        "short": "Vista mozzafiato sulla Città Vecchia.",
        "shortEN": "Breathtaking views over the Old Town.",
        "desc": "Inizia la tua avventura a Varsavia con una vista panoramica mozzafiato dalla terrazza panoramica della Chiesa di Sant'Anna. Situata a pochi passi dalla Piazza del Castello, questa storica chiesa fu fondata nel 1454 ed è sopravvissuta a numerose guerre. Tuttavia, l'attrazione principale per le famiglie è la torre campanaria indipendente. Salire i 150 gradini di pietra è un mini-allenamento divertente che ti ricompensa con il punto di osservazione più iconico sui tetti rossi del centro storico, sul fiume Vistola e sullo skyline moderno. È il luogo perfetto per orientarsi prima di immergersi nelle strade storiche sottostanti. Il contrasto tra il centro storico meticolosamente ricostruito e i lontani grattacieli moderni racchiude perfettamente lo spirito resiliente e la storia dinamica di Varsavia.",
        "descEN": "Begin your Warsaw adventure with a breathtaking panoramic view from the observation deck of St. Anne's Church. Located just steps from Castle Square, this historic church was originally founded in 1454 and survived numerous wars. However, the main attraction for families is the standalone bell tower. Climbing the 150 stone steps is a fun, mini-workout that rewards you with the most iconic vantage point over the red roofs of the Old Town, the Vistula River, and the modern skyline. It is the perfect spot to orient yourself before diving into the historic streets below. The contrast between the meticulously reconstructed historic center and the distant modern skyscrapers perfectly encapsulates Warsaw's resilient spirit and dynamic history.",
        "tips": "L'ingresso alla torre è a pagamento; preparati a salire a piedi poiché non c'è ascensore.",
        "tipsEN": "Entry to the tower requires a small fee; be prepared to walk up as there is no elevator.",
        "src": [
          "Wikipedia \"St. Anne's Church, Warsaw\"",
          "warsawtour.pl"
        ],
        "maps": "https://maps.google.com/?q=52.24604,21.01382"
      },
      {
        "id": "war-2",
        "name": "Castello Reale di Varsavia",
        "nameEN": "Royal Castle in Warsaw",
        "cat": "cultura",
        "lat": 52.24806,
        "lng": 21.01444,
        "short": "Residenza reale ricostruita con sfarzo.",
        "shortEN": "Meticulously reconstructed royal residence.",
        "desc": "A breve distanza dalla terrazza panoramica si trova il magnifico Castello Reale, simbolo della sovranità e della resilienza polacca. Costruito originariamente nel XIV secolo, fu la residenza ufficiale dei monarchi polacchi. Tragicamente, il castello fu completamente distrutto durante la Seconda Guerra Mondiale nel 1944. Quello che vedi oggi è una miracolosa ricostruzione completata nel 1984, finanziata in gran parte da donazioni pubbliche. All'interno, le famiglie possono ammirare l'opulenta Sala della Grande Assemblea, i fastosi appartamenti reali e i dipinti originali di Canaletto, che hanno guidato gli sforzi di ricostruzione del dopoguerra. L'ampia Piazza del Castello antistante, con l'imponente Colonna di Sigismondo eretta nel 1644, offre molto spazio aperto per far passeggiare i bambini mentre si immergono nell'atmosfera regale.",
        "descEN": "Just a short walk from the observation deck lies the magnificent Royal Castle, a symbol of Polish sovereignty and resilience. Originally constructed in the 14th century, it served as the official residence of Polish monarchs. Tragically, the castle was completely destroyed during World War II in 1944. What you see today is a miraculous reconstruction completed in 1984, funded largely by public donations. Inside, families can marvel at the opulent Great Assembly Hall, the lavish royal apartments, and original paintings by Canaletto, which actually guided the post-war rebuilding efforts. The expansive Castle Square out front, featuring the towering Sigismund's Column erected in 1644, offers plenty of open space for kids to roam while soaking in the regal atmosphere.",
        "tips": "L'ingresso è gratuito il mercoledì. Controlla gli orari sul sito ufficiale zamek-krolewski.pl.",
        "tipsEN": "Admission is free on Wednesdays. Check opening hours on the official site zamek-krolewski.pl.",
        "src": [
          "Wikipedia \"Royal Castle, Warsaw\"",
          "zamek-krolewski.pl"
        ],
        "maps": "https://maps.google.com/?q=52.24806,21.01444"
      },
      {
        "id": "war-3",
        "name": "Piazza del Mercato della Città Vecchia",
        "nameEN": "Old Town Market Square",
        "cat": "cultura",
        "lat": 52.24972,
        "lng": 21.01222,
        "short": "Piazza storica con la statua della Sirenetta.",
        "shortEN": "Historic square featuring the Mermaid statue.",
        "desc": "Passeggia nel cuore del centro storico, patrimonio dell'UNESCO, per scoprire la vivace Piazza del Mercato, il centro storico di Varsavia fin dalla fine del XIII secolo. Circondata da case borghesi colorate e splendidamente ornate, la piazza sembra uscita da una fiaba. Al centro si erge l'iconica statua in bronzo della Sirenetta di Varsavia (Syrenka), che brandisce spada e scudo per proteggere la città. Secondo la leggenda locale, è la sorella della Sirenetta di Copenaghen. I bambini adoreranno ascoltare i racconti mitici di come ha catturato i cuori dei pescatori. La piazza è animata da artisti di strada, carrozze trainate da cavalli e caffè accoglienti. È il luogo ideale per prendere un tradizionale gelato polacco (lody) e godersi l'atmosfera vivace e storica.",
        "descEN": "Stroll deeper into the UNESCO-listed Old Town to discover the vibrant Market Square, the historic heart of Warsaw since the late 13th century. Surrounded by beautifully ornamented, colorful burgher houses, the square feels like stepping into a fairy tale. At its very center stands the iconic bronze statue of the Warsaw Mermaid (Syrenka), wielding a sword and shield to protect the city. According to local legend, she is the sister of the Little Mermaid in Copenhagen. Kids will love hearing the mythical tales of her capturing fishermen's hearts. The square is bustling with street artists, horse-drawn carriages, and cozy cafes. It is an ideal spot to grab a traditional Polish ice cream (lody) and enjoy the lively, historic ambiance.",
        "tips": "Ottimo posto per acquistare souvenir e assaggiare i tradizionali pierogi nei ristoranti circostanti.",
        "tipsEN": "Great spot to buy souvenirs and taste traditional pierogi at the surrounding restaurants.",
        "src": [
          "Wikipedia \"Old Town Market Place, Warsaw\"",
          "UNESCO World Heritage Centre"
        ],
        "maps": "https://maps.google.com/?q=52.24972,21.01222"
      },
      {
        "id": "war-4",
        "name": "Barbacane di Varsavia",
        "nameEN": "Warsaw Barbican",
        "cat": "cultura",
        "lat": 52.25139,
        "lng": 21.01,
        "short": "Antiche mura difensive in mattoni rossi.",
        "shortEN": "Ancient red-brick defensive walls.",
        "desc": "Continua il tuo viaggio verso nord fino al Barbacane di Varsavia, un suggestivo avamposto fortificato semicircolare che un tempo proteggeva la porta settentrionale della città. Eretto nel 1540 e progettato dall'architetto italiano Giovanni Battista il Veneziano, questa massiccia struttura in mattoni rossi è una delle poche reliquie rimaste della complessa rete di fortificazioni storiche che un tempo circondavano Varsavia. Come gran parte della città, fu in gran parte distrutto durante la Rivolta di Varsavia del 1944 e meticolosamente ricostruito negli anni '50. Oggi, il Barbacane funge da pittoresco ponte tra la Città Vecchia e la Città Nuova. I bambini si divertiranno a esplorare le spesse mura, gli archi e le torri difensive, immaginandosi come cavalieri medievali che difendono la città.",
        "descEN": "Continue your journey north to the Warsaw Barbican, a striking semicircular fortified outpost that once protected the city's northern gate. Erected in 1540 and designed by the Italian architect Jan Baptist the Venetian, this massive red-brick structure is one of the few remaining relics of the complex network of historic fortifications that once encircled Warsaw. Like much of the city, it was largely destroyed during the 1944 Warsaw Uprising and meticulously rebuilt in the 1950s. Today, the Barbican serves as a picturesque bridge between the Old and New Towns. Children will enjoy exploring the thick walls, archways, and defensive towers, imagining themselves as medieval knights defending the city, while parents can appreciate the local artists displaying their paintings along the historic brickwork.",
        "tips": "Passeggia lungo le mura per trovare artisti locali che vendono dipinti e artigianato.",
        "tipsEN": "Walk along the walls to find local artists selling paintings and handicrafts.",
        "src": [
          "Wikipedia \"Warsaw Barbican\"",
          "warsawtour.pl"
        ],
        "maps": "https://maps.google.com/?q=52.25139,21.01000"
      },
      {
        "id": "war-5",
        "name": "Parco Multimediale delle Fontane",
        "nameEN": "Multimedia Fountain Park",
        "cat": "kids",
        "lat": 52.25417,
        "lng": 21.01139,
        "short": "Spettacoli d'acqua, luci e musica.",
        "shortEN": "Water, light, and music shows.",
        "desc": "Concludi il tuo tour a piedi appena fuori dalle mura storiche al Parco Multimediale delle Fontane, una spettacolare attrazione moderna inaugurata nel 2011. Immerso in una verde vallata vicino al fiume Vistola, questo parco presenta un'impressionante serie di 367 getti d'acqua e quasi 300 luci a LED. Durante il giorno, è un luogo fantastico e rinfrescante dove i bambini possono correre e rinfrescarsi nelle aree giochi d'acqua. Nelle serate del fine settimana da maggio a settembre, il parco si trasforma in un magico teatro all'aperto, ospitando spettacolari spettacoli di acqua, luci e laser sincronizzati con la musica. Queste esibizioni accattivanti proiettano spesso storie animate di famose leggende di Varsavia, come il Basilisco o la Sirenetta, offrendo un finale affascinante per tutta la famiglia.",
        "descEN": "Conclude your walking tour just outside the historic walls at the Multimedia Fountain Park, a spectacular modern attraction opened in 2011. Nestled in a green valley near the Vistula River, this park features an impressive array of 367 water jets and nearly 300 LED lights. During the day, it is a fantastic, refreshing spot for kids to run around and cool off in the splash zones. On weekend evenings from May to September, the park transforms into a magical outdoor theater, hosting spectacular water, light, and laser shows synchronized to music. These captivating performances often project animated stories of famous Warsaw legends, such as the Basilisk or the Mermaid, providing a mesmerizing and family-friendly finale to your day of urban exploration.",
        "tips": "Gli spettacoli serali si tengono solitamente il venerdì e il sabato alle 21:00 o alle 21:30 in estate.",
        "tipsEN": "Evening shows are usually held on Fridays and Saturdays at 9:00 PM or 9:30 PM in summer.",
        "src": [
          "Wikipedia \"Multimedia Fountain Park, Warsaw\"",
          "parkfontann.pl"
        ],
        "maps": "https://maps.google.com/?q=52.25417,21.01139"
      }
    ]
  },
  "vilnius": {
    "city": "Vilnius",
    "cityEN": "Vilnius",
    "country": "Lituania",
    "countryEN": "Lithuania",
    "flag": "🇱🇹",
    "intro": "Un itinerario a piedi nel cuore UNESCO di Vilnius: dalla collina del castello al quartiere bohémien di Užupis, fino al mercato coperto più antico della città. Tappe vicine tra loro, percorribili comodamente a piedi o in monopattino.",
    "introEN": "A walking route through Vilnius's UNESCO-listed core: from the castle hill to the bohemian Užupis district and the city's oldest covered market. The stops are close together and easy to cover on foot or by scooter.",
    "center": [
      54.6836,
      25.292
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "vln-1",
        "name": "Torre di Gediminas",
        "nameEN": "Gediminas's Tower",
        "cat": "cultura",
        "lat": 54.68685,
        "lng": 25.29072,
        "short": "L'unica torre superstite del Castello Superiore, simbolo di Vilnius con vista panoramica sul centro storico.",
        "shortEN": "The only surviving tower of the Upper Castle, an emblem of Vilnius with panoramic views over the Old Town.",
        "desc": "La Torre di Gediminas è l'unica parte superstite del Castello Superiore che sorge in cima al colle di Gediminas, simbolo di Vilnius e dell'intera Lituania (tanto da essere stata raffigurata sull'ex valuta nazionale, il litas). Le prime fortificazioni in legno furono erette dal granduca Gediminas all'inizio del XIV secolo; il primo castello in mattoni fu completato nel 1409 dal granduca Vytautas, mentre la torre a tre piani che vediamo oggi fu ricostruita nel 1933. Oggi ospita un museo con reperti archeologici, armi e modelli dei castelli di Vilnius dal XIV al XVII secolo. Si raggiunge a piedi o con una funicolare, e dalla piattaforma panoramica in cima si gode una delle viste più belle sul centro storico (patrimonio UNESCO) e sul fiume Neris. Curiosità: il 7 ottobre 1988 la bandiera lituana fu issata di nuovo sulla torre durante il movimento per la restaurazione dell'indipendenza.",
        "descEN": "Gediminas's Tower is the only surviving part of the Upper Castle atop Gediminas Hill, an emblem of Vilnius and of Lithuania itself (it once featured on the former national currency, the litas). The first wooden fortifications were built by Grand Duke Gediminas in the early 14th century; the first brick castle was completed in 1409 by Grand Duke Vytautas, and the three-storey tower seen today was rebuilt in 1933. It now houses a museum with archaeological finds, weaponry and models of Vilnius's castles from the 14th to the 17th centuries. Reachable on foot or by funicular, its rooftop viewing platform offers one of the finest views over the UNESCO-listed Old Town and the Neris River. A notable fact: on 7 October 1988 the Lithuanian flag was re-hoisted on the tower during the independence-restoration movement.",
        "tips": "Museo Nazionale di Lituania. Funicolare disponibile dal cortile. Sali al tramonto per la luce migliore sul centro storico.",
        "tipsEN": "Part of the National Museum of Lithuania. A funicular runs from the courtyard. Go at sunset for the best light over the Old Town.",
        "src": [
          "Wikipedia \"Gediminas's Tower\"",
          "Lietuvos nacionalinis muziejus (lnm.lt)",
          "UNESCO WHC #541"
        ],
        "maps": "https://maps.google.com/?q=54.68685,25.29072"
      },
      {
        "id": "vln-2",
        "name": "Giardino Bernardino",
        "nameEN": "Bernardine Garden",
        "cat": "natura",
        "lat": 54.68333,
        "lng": 25.29611,
        "short": "Parco storico di oltre 9 ettari lungo il fiume Vilnia, con fontana \"danzante\", giostra e spazi per bambini.",
        "shortEN": "A historic 9-hectare park along the Vilnia River, with a \"singing\" fountain, a carousel and family spaces.",
        "desc": "Il Giardino Bernardino, un tempo noto come Parco Sereikiškės, è un parco pubblico di oltre 9 ettari sulla riva sinistra del fiume Vilnia, tra la Torre di Gediminas e il Monastero Bernardino. Le sue origini risalgono al 1469, quando il re di Polonia e granduca di Lituania Casimiro IV Jagellone invitò i monaci bernardini a Vilnius: furono loro a riorganizzare l'area e ad allestire un'esposizione botanica. Chiuso dal governo zarista nel 1864 e poi recuperato dai cittadini, distrutto durante la Seconda guerra mondiale e ricostruito in epoca sovietica, il parco è stato restaurato per la terza volta nel 2013 (con fondi parzialmente europei). Oggi offre aiuole curate, un'esposizione botanica con piante medicinali, una fontana \"danzante\" con spettacolo di luci e musica, una giostra, tavoli da scacchi e ampi spazi per i bambini: una tappa verde ideale con la famiglia.",
        "descEN": "The Bernardine Garden, formerly known as Sereikiškės Park, is a public park of over 9 hectares on the left bank of the Vilnia River, between Gediminas Tower and the Bernardine Monastery. Its origins date to 1469, when Casimir IV Jagiellon, King of Poland and Grand Duke of Lithuania, invited the Bernardine monks to Vilnius; they reorganised the grounds and set up a botanical display. Closed by the Tsarist government in 1864 and later recovered by townspeople, destroyed in World War II and rebuilt in the Soviet era, the park was restored for the third time in 2013 (partly EU-funded). Today it offers manicured flowerbeds, a botanical exposition of medicinal herbs, a \"singing\" fountain with a light-and-music show, a carousel, chess tables and plenty of space for children — an ideal green stop for families.",
        "tips": "Ingresso libero. A pochi minuti a piedi dalla Torre di Gediminas. Perfetto per una pausa con i bambini.",
        "tipsEN": "Free entry. A few minutes' walk from Gediminas Tower. Perfect for a break with kids.",
        "src": [
          "Wikipedia \"Bernardine Garden\""
        ],
        "maps": "https://maps.google.com/?q=54.68333,25.29611"
      },
      {
        "id": "vln-3",
        "name": "Museo dei Giocattoli",
        "nameEN": "Toy Museum",
        "cat": "kids",
        "lat": 54.68482,
        "lng": 25.29159,
        "short": "Museo per famiglie sulla storia del giocattolo, dall'età della pietra al Novecento, con elementi interattivi.",
        "shortEN": "A family museum on the history of toys, from the Stone Age to the 20th century, with hands-on elements.",
        "desc": "Il Museo dei Giocattoli (Žaislų muziejus) di Vilnius ha aperto le porte nel dicembre 2012 con l'obiettivo di raccontare in modo giocoso la storia dei giocattoli, valorizzando il giocattolo come oggetto di studio scientifico. Il percorso accompagna i visitatori in un viaggio nel tempo: dal Medioevo all'età della pietra, fino al XX secolo, periodo in cui l'industria del giocattolo conobbe un enorme successo. La collezione, con particolare attenzione ai giocattoli lituani e dell'epoca sovietica, è apprezzata per gli allestimenti curati e per gli elementi interattivi che permettono ai più piccoli di giocare con alcune esposizioni, creando un'esperienza adatta a più generazioni. Non è un museo grande, ma è ricco di oggetti curiosi e offre un buon rapporto qualità-prezzo, ideale come pausa \"a misura di bambino\" tra una tappa storica e l'altra.",
        "descEN": "Vilnius's Toy Museum (Žaislų muziejus) opened in December 2012 with the aim of playfully revealing the history of toys while emphasising the toy as a scientific object of study. The route takes visitors on a journey through time — from the Middle Ages back to the Stone Age and on to the 20th century, when the toy industry enjoyed tremendous success. The collection, with a particular focus on Lithuanian and Soviet-era playthings, is praised for its well-organised displays and interactive elements that let children play with some of the exhibits, creating a multi-generational experience. It is not a large museum, but it is packed with curious items and offers good value — an ideal child-friendly break between historical stops.",
        "tips": "Indirizzo: Šiltadaržio g. 2. Biglietto intero ~€7 (ridotto ~€5). Adatto alle famiglie; negozio del museo e audioguida disponibili.",
        "tipsEN": "Address: Šiltadaržio g. 2. Full ticket ~€7 (reduced ~€5). Family-friendly; museum shop and audio tour available.",
        "src": [
          "WhichMuseum \"Toy Museum (Vilnius)\"",
          "zaislumuziejus.lt"
        ],
        "maps": "https://maps.google.com/?q=54.68482,25.29159"
      },
      {
        "id": "vln-4",
        "name": "Užupis",
        "nameEN": "Užupis",
        "cat": "cultura",
        "lat": 54.68318,
        "lng": 25.30719,
        "short": "Il quartiere bohémien che nel 1998 si è proclamato repubblica indipendente degli artisti, con una costituzione tutta sua.",
        "shortEN": "The bohemian district that in 1998 declared itself an independent republic of artists, with its own constitution.",
        "desc": "Užupis (\"oltre il fiume\", in riferimento al Vilnia) è un piccolo quartiere di circa 60 ettari nel centro storico di Vilnius, da tempo amato da artisti e bohémien al punto da essere paragonato a Montmartre a Parigi o a Christiania a Copenhagen. Il 1° aprile 1998 il quartiere si è auto-proclamato repubblica indipendente — la Repubblica di Užupis — con tanto di costituzione. I 38 articoli della costituzione, affissi su una parete di via Paupio in oltre 20 lingue, alternano affermazioni poetiche e ironiche: \"Un cane ha il diritto di essere un cane\" (art. 12), \"Le persone hanno il diritto di essere felici\" (art. 16) e \"di essere infelici\" (art. 17). Da vedere anche l'Angelo di Užupis, statua di un angelo che suona la tromba inaugurata il 1° aprile 2002, diventata simbolo della rinascita del quartiere. La scelta del 1° aprile (pesce d'aprile) suggerisce quanto l'autoironia sia parte dell'identità del luogo.",
        "descEN": "Užupis (\"beyond the river\", referring to the Vilnia) is a small district of about 60 hectares within Vilnius's Old Town, long beloved by artists and bohemians — so much so that it has been compared to Montmartre in Paris and Christiania in Copenhagen. On 1 April 1998 the neighbourhood declared itself an independent republic — the Republic of Užupis — complete with its own constitution. Its 38 articles, displayed on a wall on Paupio Street in more than 20 languages, mix poetic and tongue-in-cheek statements: \"A dog has the right to be a dog\" (art. 12), \"People have the right to be happy\" (art. 16) and \"to be unhappy\" (art. 17). Don't miss the Angel of Užupis, a trumpet-blowing angel statue unveiled on 1 April 2002 that became a symbol of the district's revival. The choice of 1 April (April Fools' Day) hints at how self-irony is part of the place's identity.",
        "tips": "Cerca il muro della Costituzione su via Paupio e l'Angelo di Užupis. Quartiere ideale per caffè e gallerie d'arte.",
        "tipsEN": "Look for the Constitution wall on Paupio Street and the Angel of Užupis. A great district for cafés and art galleries.",
        "src": [
          "Wikipedia \"Užupis\"",
          "BBC Travel (2018)"
        ],
        "maps": "https://maps.google.com/?q=54.68318,25.30719"
      },
      {
        "id": "vln-5",
        "name": "Halės Turgus (Mercato delle Halle)",
        "nameEN": "Halės Market",
        "cat": "attivita",
        "lat": 54.673,
        "lng": 25.283,
        "short": "Il mercato coperto più antico di Vilnius (1906): prodotti freschi locali, pane nero, formaggi e street food.",
        "shortEN": "Vilnius's oldest covered market (1906): fresh local produce, black bread, cheeses and street food.",
        "desc": "Halės Turgus è il mercato coperto più antico di Vilnius e un autentico punto di riferimento storico della città. L'edificio fu costruito nel 1906 su progetto dell'architetto Vaclovas Michnevičius; per lungo tempo fu chiamato \"Mercato del Grano\", e solo nel 1914 prevalse il nome di Halės Market. Situato nel vivace quartiere della stazione, è il posto giusto per immergersi nella vita quotidiana locale e assaggiare la Lituania più genuina: frutta e verdura di stagione dalle fattorie lituane, carne, pollame, pesce e frutti di mare freschi, oltre a pane nero, formaggi, salumi e specialità da street food. È un mercato vivo e popolare, dove i sapori si incontrano e si possono fare acquisti per un picnic o un pranzo veloce.",
        "descEN": "Halės Turgus is Vilnius's oldest covered market and a genuine historical landmark of the city. The building was constructed in 1906 to a design by architect Vaclovas Michnevičius; for a long time it was called the \"Grain Market\", and only in 1914 did the name Halės Market take over. Set in the lively station district, it is the perfect place to dive into everyday local life and taste authentic Lithuania: seasonal fruit and vegetables from Lithuanian farms, fresh meat, poultry, fish and seafood, as well as black bread, cheeses, cured meats and street-food specialities. It is a living, popular market where flavours meet and where you can shop for a picnic or a quick lunch.",
        "tips": "Indirizzo: Pylimo g. 58. Orari (verifica in loco): Lun–Ven 7:00–18:00, Sab 7:00–16:00. Parcheggi a pagamento nelle vicinanze.",
        "tipsEN": "Address: Pylimo g. 58. Hours (verify on site): Mon–Fri 7:00–18:00, Sat 7:00–16:00. Paid parking nearby.",
        "src": [
          "halesturgaviete.lt (sito ufficiale)",
          "Go Vilnius (govilnius.lt)",
          "Kupi.com \"Hale Market\""
        ],
        "maps": "https://maps.google.com/?q=54.6730,25.2830"
      }
    ]
  },
  "riga": {
    "city": "Riga",
    "cityEN": "Riga",
    "country": "Lettonia",
    "countryEN": "Latvia",
    "flag": "🇱🇻",
    "intro": "Scopri il fascino di Riga, dove l'architettura medievale incontra l'eleganza dell'Art Nouveau. Un itinerario perfetto per esplorare il cuore storico e culturale della capitale lettone.",
    "introEN": "Discover the charm of Riga, where medieval architecture meets Art Nouveau elegance. A perfect itinerary to explore the historical and cultural heart of the Latvian capital.",
    "center": [
      56.9496,
      24.1052
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "rig-1",
        "name": "Mercato Centrale di Riga",
        "nameEN": "Riga Central Market",
        "cat": "cibo",
        "lat": 56.94436,
        "lng": 24.11472,
        "short": "Il mercato più grande d'Europa in ex hangar.",
        "shortEN": "Europe's largest market in former hangars.",
        "desc": "Inaugurato nel 1930, il Mercato Centrale di Riga è uno dei mercati coperti più grandi e vivaci d'Europa, riconosciuto come patrimonio dell'umanità dall'UNESCO nel 1997. La sua caratteristica più sorprendente è l'architettura: i cinque enormi padiglioni che ospitano i banchi del mercato furono originariamente costruiti come hangar per i dirigibili Zeppelin tedeschi durante la Prima Guerra Mondiale. Oggi, questi spazi immensi offrono un'incredibile varietà di prodotti locali, dai formaggi freschi al pesce affumicato, fino ai dolci tradizionali lettoni. È il luogo ideale per immergersi nella vita quotidiana della città, assaporare le specialità gastronomiche locali e scoprire l'autentica cultura culinaria lettone in un'atmosfera vibrante e ricca di storia.",
        "descEN": "Opened in 1930, the Riga Central Market is one of the largest and most vibrant covered markets in Europe, recognized as a UNESCO World Heritage site in 1997. Its most striking feature is its architecture: the five massive pavilions housing the market stalls were originally built as hangars for German Zeppelin airships during World War I. Today, these immense spaces offer an incredible variety of local products, from fresh cheeses and smoked fish to traditional Latvian pastries. It is the perfect place to immerse yourself in the daily life of the city, taste local gastronomic specialties, and discover authentic Latvian culinary culture in a vibrant and historically rich atmosphere.",
        "tips": "Aperto tutti i giorni. Ottimo per un pranzo veloce ed economico.",
        "tipsEN": "Open daily. Great for a quick and affordable lunch.",
        "src": [
          "Wikipedia \"Riga Central Market\"",
          "liveriga.com"
        ],
        "maps": "https://maps.google.com/?q=56.94436,24.11472"
      },
      {
        "id": "rig-2",
        "name": "Casa delle Teste Nere",
        "nameEN": "House of the Blackheads",
        "cat": "cultura",
        "lat": 56.94714,
        "lng": 24.10677,
        "short": "Magnifico edificio storico nella Piazza del Municipio.",
        "shortEN": "Magnificent historic building in the Town Hall Square.",
        "desc": "Situata nella pittoresca Piazza del Municipio, la Casa delle Teste Nere è uno degli edifici più iconici di Riga. Costruita originariamente nel 1334, fungeva da luogo di incontro e celebrazione per la Confraternita delle Teste Nere, una gilda di mercanti e armatori celibi. Sebbene l'edificio originale sia stato distrutto durante la Seconda Guerra Mondiale nel 1941, è stato meticolosamente ricostruito nel 1999 per celebrare l'ottocentesimo anniversario della città. La sua facciata in stile gotico olandese, riccamente decorata con sculture e dettagli dorati, è un capolavoro architettonico. All'interno, i visitatori possono esplorare le sfarzose sale da ballo, le cantine storiche e ammirare una vasta collezione di argenteria e manufatti che raccontano la ricca storia commerciale di Riga.",
        "descEN": "Located in the picturesque Town Hall Square, the House of the Blackheads is one of Riga's most iconic buildings. Originally constructed in 1334, it served as a meeting and celebration place for the Brotherhood of Blackheads, a guild of unmarried merchants and shipowners. Although the original building was destroyed during World War II in 1941, it was meticulously reconstructed in 1999 to celebrate the city's 800th anniversary. Its Dutch Renaissance-style facade, richly decorated with sculptures and golden details, is an architectural masterpiece. Inside, visitors can explore the lavish ballrooms, historic cellars, and admire a vast collection of silverware and artifacts that tell the story of Riga's rich commercial history.",
        "tips": "Ingresso a pagamento. Controlla gli orari sul sito ufficiale.",
        "tipsEN": "Paid entry. Check opening hours on the official website.",
        "src": [
          "Wikipedia \"House of the Blackheads (Riga)\"",
          "melngalvjunams.lv"
        ],
        "maps": "https://maps.google.com/?q=56.94714,24.10677"
      },
      {
        "id": "rig-3",
        "name": "Cattedrale di Riga",
        "nameEN": "Riga Cathedral",
        "cat": "cultura",
        "lat": 56.94917,
        "lng": 24.10444,
        "short": "La più grande chiesa medievale dei Paesi Baltici.",
        "shortEN": "The largest medieval church in the Baltic States.",
        "desc": "La Cattedrale di Riga, conosciuta anche come Duomo di Riga, è il cuore spirituale della città e la più grande chiesa medievale dei Paesi Baltici. Fondata nel 1211 dal vescovo Alberto di Riga, la struttura ha subito numerose modifiche nel corso dei secoli, fondendo armoniosamente stili architettonici romanici, gotici, barocchi e Art Nouveau. Uno dei tesori più preziosi della cattedrale è il suo magnifico organo a canne, costruito nel 1884, che all'epoca era il più grande del mondo con le sue 6.718 canne. Ancora oggi, i concerti d'organo attirano visitatori da tutto il mondo per la loro eccezionale acustica. Il chiostro adiacente ospita il Museo di Storia di Riga e della Navigazione, offrendo un affascinante viaggio nel passato della città.",
        "descEN": "Riga Cathedral, also known as the Dome Cathedral, is the spiritual heart of the city and the largest medieval church in the Baltic States. Founded in 1211 by Bishop Albert of Riga, the structure has undergone numerous modifications over the centuries, harmoniously blending Romanesque, Gothic, Baroque, and Art Nouveau architectural styles. One of the cathedral's most precious treasures is its magnificent pipe organ, built in 1884, which was the largest in the world at the time with its 6,718 pipes. Even today, organ concerts attract visitors from all over the world for their exceptional acoustics. The adjacent cloister houses the Museum of the History of Riga and Navigation, offering a fascinating journey into the city's past.",
        "tips": "I concerti d'organo si tengono spesso a mezzogiorno. Biglietti all'ingresso.",
        "tipsEN": "Organ concerts are often held at noon. Tickets at the entrance.",
        "src": [
          "Wikipedia \"Riga Cathedral\"",
          "doms.lv"
        ],
        "maps": "https://maps.google.com/?q=56.94917,24.10444"
      },
      {
        "id": "rig-4",
        "name": "Parco Bastejkalna",
        "nameEN": "Bastejkalna Park",
        "cat": "natura",
        "lat": 56.95167,
        "lng": 24.11111,
        "short": "Un'oasi verde e tranquilla nel centro della città.",
        "shortEN": "A green and peaceful oasis in the city center.",
        "desc": "Il Parco Bastejkalna, o Collina del Bastione, è un incantevole spazio verde situato nel cuore di Riga, proprio accanto al Monumento alla Libertà. Creato a metà del XIX secolo sul sito delle antiche fortificazioni della città demolite nel 1856, il parco è oggi un'oasi di tranquillità amata da residenti e turisti. I suoi sentieri tortuosi, i ponti romantici e le cascate artificiali offrono un rifugio perfetto dal trambusto urbano. Il canale cittadino attraversa il parco, permettendo piacevoli gite in barca durante i mesi più caldi. È un luogo ideale per le famiglie, con ampi spazi per passeggiare e rilassarsi all'ombra di alberi secolari, godendo di splendide viste sull'architettura circostante e sull'Opera Nazionale Lettone.",
        "descEN": "Bastejkalna Park, or Bastion Hill, is an enchanting green space located in the heart of Riga, right next to the Freedom Monument. Created in the mid-19th century on the site of the city's old fortifications demolished in 1856, the park is today a tranquil oasis beloved by locals and tourists alike. Its winding paths, romantic bridges, and artificial waterfalls offer a perfect retreat from the urban bustle. The city canal flows through the park, allowing for pleasant boat rides during the warmer months. It is an ideal place for families, with ample space to stroll and relax in the shade of centuries-old trees, enjoying beautiful views of the surrounding architecture and the Latvian National Opera.",
        "tips": "Perfetto per una passeggiata rilassante o un giro in barca sul canale.",
        "tipsEN": "Perfect for a relaxing walk or a boat ride on the canal.",
        "src": [
          "Wikipedia \"Bastejkalns Park\"",
          "liveriga.com"
        ],
        "maps": "https://maps.google.com/?q=56.95167,24.11111"
      },
      {
        "id": "rig-5",
        "name": "Museo dell'Art Nouveau di Riga",
        "nameEN": "Riga Art Nouveau Centre",
        "cat": "cultura",
        "lat": 56.95944,
        "lng": 24.10833,
        "short": "Immergiti nell'eleganza dell'Art Nouveau lettone.",
        "shortEN": "Immerse yourself in the elegance of Latvian Art Nouveau.",
        "desc": "Riga vanta la più alta concentrazione di architettura Art Nouveau al mondo, e il Museo dell'Art Nouveau (Rīgas Jūgendstila Centrs) è il luogo perfetto per esplorare questo patrimonio. Situato in via Alberta 12, in un magnifico edificio progettato nel 1903 dal celebre architetto lettone Konstantīns Pēkšēns, il museo offre un'autentica esperienza immersiva. L'appartamento, un tempo residenza dell'architetto, è stato meticolosamente restaurato per mostrare gli interni originali dell'inizio del XX secolo, completi di mobili d'epoca, vetrate colorate e decorazioni floreali. I visitatori possono ammirare la spettacolare scala a chiocciola all'ingresso, considerata una delle più belle d'Europa. Il museo illustra vividamente lo stile di vita della borghesia di Riga durante il periodo di massimo splendore dell'Art Nouveau.",
        "descEN": "Riga boasts the highest concentration of Art Nouveau architecture in the world, and the Riga Art Nouveau Centre (Rīgas Jūgendstila Centrs) is the perfect place to explore this heritage. Located at Alberta iela 12, in a magnificent building designed in 1903 by the renowned Latvian architect Konstantīns Pēkšēns, the museum offers an authentic immersive experience. The apartment, once the architect's residence, has been meticulously restored to showcase original early 20th-century interiors, complete with period furniture, stained glass, and floral decorations. Visitors can admire the spectacular spiral staircase at the entrance, considered one of the most beautiful in Europe. The museum vividly illustrates the lifestyle of Riga's bourgeoisie during the heyday of Art Nouveau.",
        "tips": "Ammira la magnifica scala a chiocciola all'ingresso prima di entrare.",
        "tipsEN": "Admire the magnificent spiral staircase at the entrance before going in.",
        "src": [
          "jugendstils.riga.lv",
          "Wikipedia \"Art Nouveau architecture in Riga\""
        ],
        "maps": "https://maps.google.com/?q=56.95944,24.10833"
      }
    ]
  },
  "tallinn": {
    "city": "Tallinn",
    "cityEN": "Tallinn",
    "country": "Estonia",
    "countryEN": "Estonia",
    "flag": "🇪🇪",
    "intro": "Scopri il fascino medievale di Tallinn, una delle città antiche meglio conservate d'Europa. Questo itinerario a piedi ti guida attraverso le strade acciottolate del suo centro storico, Patrimonio dell'Umanità UNESCO.",
    "introEN": "Discover the medieval charm of Tallinn, one of Europe's best-preserved ancient cities. This walking itinerary guides you through the cobblestone streets of its UNESCO World Heritage Old Town.",
    "center": [
      59.437,
      24.7455
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "tal-1",
        "name": "Porta di Viru",
        "nameEN": "Viru Gate",
        "cat": "cultura",
        "lat": 59.43655,
        "lng": 24.75027,
        "short": "Ingresso storico alla Città Vecchia.",
        "shortEN": "Historic entrance to the Old Town.",
        "desc": "La Porta di Viru, costruita nel XIV secolo, rappresenta l'ingresso principale alla Città Vecchia di Tallinn. Originariamente parte di un più ampio sistema di fortificazioni, oggi rimangono solo le due pittoresche torri di guardia coperte di edera. Attraversando queste torri, i visitatori vengono immediatamente trasportati indietro nel tempo, accolti da una vivace strada fiancheggiata da negozi, ristoranti e fioristi. È il punto di partenza perfetto per esplorare il centro storico, offrendo un'introduzione suggestiva all'architettura medievale che caratterizza la capitale estone.",
        "descEN": "The Viru Gate, built in the 14th century, serves as the main entrance to Tallinn's Old Town. Originally part of a larger fortification system, today only the two picturesque ivy-covered watchtowers remain. Passing through these towers, visitors are immediately transported back in time, welcomed by a bustling street lined with shops, restaurants, and florists. It is the perfect starting point for exploring the historic center, offering an evocative introduction to the medieval architecture that characterizes the Estonian capital.",
        "tips": "Ottimo punto per scattare foto; esplora i fioristi vicini.",
        "tipsEN": "Great spot for photos; explore the nearby flower stalls.",
        "src": [
          "Wikipedia \"Gatehouse of the Viru Gate\"",
          "visittallinn.ee"
        ],
        "maps": "https://maps.google.com/?q=59.43655,24.75027"
      },
      {
        "id": "tal-2",
        "name": "Piazza del Municipio",
        "nameEN": "Town Hall Square",
        "cat": "cultura",
        "lat": 59.43709,
        "lng": 24.74547,
        "short": "Il cuore pulsante della città medievale.",
        "shortEN": "The beating heart of the medieval city.",
        "desc": "La Piazza del Municipio (Raekoja plats) è il centro nevralgico della Città Vecchia di Tallinn sin dall'XI secolo. Dominata dal magnifico Municipio gotico, completato nel 1404, la piazza è circondata da elaborate case mercantili dai colori pastello. Storicamente utilizzata come mercato e luogo di ritrovo, oggi ospita caffè all'aperto, concerti e il famoso mercatino di Natale. Al centro della piazza si trova una pietra circolare da cui è possibile scorgere le cime delle cinque guglie più importanti della città. È un luogo vibrante, ricco di storia e atmosfera.",
        "descEN": "Town Hall Square (Raekoja plats) has been the nerve center of Tallinn's Old Town since the 11th century. Dominated by the magnificent Gothic Town Hall, completed in 1404, the square is surrounded by elaborate pastel-colored merchant houses. Historically used as a marketplace and gathering spot, today it hosts outdoor cafes, concerts, and the famous Christmas market. In the center of the square lies a circular stone from which you can spot the tops of the city's five most important spires. It is a vibrant place, rich in history and atmosphere.",
        "tips": "Cerca la pietra circolare al centro della piazza.",
        "tipsEN": "Look for the circular stone in the center of the square.",
        "src": [
          "Wikipedia \"Tallinn Town Hall\"",
          "visittallinn.ee"
        ],
        "maps": "https://maps.google.com/?q=59.43709,24.74547"
      },
      {
        "id": "tal-3",
        "name": "Cattedrale di Aleksandr Nevskij",
        "nameEN": "Alexander Nevsky Cathedral",
        "cat": "cultura",
        "lat": 59.43583,
        "lng": 24.73936,
        "short": "Imponente cattedrale ortodossa russa.",
        "shortEN": "Imposing Russian Orthodox cathedral.",
        "desc": "Situata sulla collina di Toompea, la Cattedrale di Aleksandr Nevskij è la più grande e grandiosa chiesa ortodossa a cupola di Tallinn. Costruita nel 1900, durante il periodo in cui l'Estonia faceva parte dell'Impero Russo, la cattedrale è dedicata al principe di Novgorod, Aleksandr Nevskij. L'architettura in stile revival russo, con le sue caratteristiche cupole a cipolla e i ricchi mosaici, contrasta nettamente con gli edifici medievali circostanti. L'interno è altrettanto sfarzoso, adornato con icone preziose e decorazioni dorate, offrendo uno spaccato affascinante della storia religiosa e politica della regione.",
        "descEN": "Located on Toompea Hill, the Alexander Nevsky Cathedral is Tallinn's largest and grandest orthodox cupola church. Built in 1900, during the period when Estonia was part of the Russian Empire, the cathedral is dedicated to the Prince of Novgorod, Alexander Nevsky. The Russian Revival architecture, with its characteristic onion domes and rich mosaics, contrasts sharply with the surrounding medieval buildings. The interior is equally lavish, adorned with precious icons and gilded decorations, offering a fascinating glimpse into the region's religious and political history.",
        "tips": "Ingresso gratuito; ricordati di vestirti in modo appropriato.",
        "tipsEN": "Free entry; remember to dress appropriately.",
        "src": [
          "Wikipedia \"Alexander Nevsky Cathedral, Tallinn\"",
          "visittallinn.ee"
        ],
        "maps": "https://maps.google.com/?q=59.43583,24.73936"
      },
      {
        "id": "tal-4",
        "name": "Piattaforma panoramica di Kohtuotsa",
        "nameEN": "Kohtuotsa viewing platform",
        "cat": "panorama",
        "lat": 59.43694,
        "lng": 24.74,
        "short": "Vista mozzafiato sui tetti rossi di Tallinn.",
        "shortEN": "Breathtaking view over Tallinn's red roofs.",
        "desc": "La piattaforma panoramica di Kohtuotsa, situata sul lato orientale della collina di Toompea, offre una delle viste più iconiche e fotografate di Tallinn. Da questo punto privilegiato, i visitatori possono ammirare un panorama spettacolare che abbraccia i tetti rossi e le guglie medievali della Città Vecchia, contrastando con i moderni grattacieli del centro direzionale e le acque scintillanti del Golfo di Finlandia sullo sfondo. È il luogo ideale per comprendere la conformazione della città e per scattare foto indimenticabili, specialmente al tramonto quando la luce calda avvolge gli antichi edifici.",
        "descEN": "The Kohtuotsa viewing platform, located on the eastern side of Toompea Hill, offers one of the most iconic and photographed views of Tallinn. From this vantage point, visitors can admire a spectacular panorama that encompasses the red roofs and medieval spires of the Old Town, contrasting with the modern high-rises of the business district and the sparkling waters of the Gulf of Finland in the background. It is the ideal place to understand the city's layout and to take unforgettable photos, especially at sunset when warm light bathes the ancient buildings.",
        "tips": "Il momento migliore per le foto è la mattina presto o al tramonto.",
        "tipsEN": "Best time for photos is early morning or at sunset.",
        "src": [
          "Wikipedia \"Toompea\"",
          "visittallinn.ee"
        ],
        "maps": "https://maps.google.com/?q=59.43694,24.74000"
      },
      {
        "id": "tal-5",
        "name": "Mercato di Balti Jaam",
        "nameEN": "Balti Jaam Market",
        "cat": "cibo",
        "lat": 59.43995,
        "lng": 24.73715,
        "short": "Mercato moderno con street food e prodotti locali.",
        "shortEN": "Modern market with street food and local products.",
        "desc": "Situato vicino alla stazione ferroviaria principale, il Mercato di Balti Jaam (Balti Jaama Turg) è un vivace complesso su tre livelli che combina il fascino di un mercato tradizionale con un design moderno. Riaperto nel 2017 dopo un'ampia ristrutturazione, ospita quasi 300 commercianti. Il piano terra è dedicato a carne, pesce e latticini freschi, oltre a una vasta area di street food che offre specialità locali e internazionali. I piani superiori ospitano negozi di antiquariato, abbigliamento vintage e artigianato estone. È un luogo eccellente per assaporare la cultura culinaria locale in un'atmosfera dinamica e accogliente.",
        "descEN": "Located near the main railway station, the Balti Jaam Market (Balti Jaama Turg) is a bustling three-level complex that combines the charm of a traditional market with modern design. Reopened in 2017 after extensive renovations, it hosts nearly 300 traders. The ground floor is dedicated to fresh meat, fish, and dairy, alongside a large street food area offering local and international specialties. The upper floors house antique shops, vintage clothing, and Estonian handicrafts. It is an excellent place to savor the local culinary culture in a dynamic and welcoming atmosphere.",
        "tips": "Perfetto per il pranzo; prova lo street food locale.",
        "tipsEN": "Perfect for lunch; try the local street food.",
        "src": [
          "Wikipedia \"Tallinn Baltic Station\"",
          "visittallinn.ee"
        ],
        "maps": "https://maps.google.com/?q=59.43995,24.73715"
      }
    ]
  },
  "trondheim": {
    "city": "Trondheim",
    "cityEN": "Trondheim",
    "country": "Norvegia",
    "countryEN": "Norway",
    "flag": "🇳🇴",
    "intro": "L'antica capitale vichinga della Norvegia, famosa per la sua maestosa cattedrale gotica e le colorate case di legno lungo il fiume. Un mix perfetto di storia, cultura e atmosfera accogliente.",
    "introEN": "Norway's ancient Viking capital, famous for its majestic Gothic cathedral and colorful wooden houses along the river. A perfect mix of history, culture, and a welcoming atmosphere.",
    "center": [
      63.428,
      10.4
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "trd-1",
        "name": "Cattedrale di Nidaros",
        "nameEN": "Nidaros Cathedral",
        "cat": "cultura",
        "lat": 63.42692,
        "lng": 10.39611,
        "short": "La cattedrale gotica più a nord del mondo.",
        "shortEN": "The northernmost Gothic cathedral in the world.",
        "desc": "La Cattedrale di Nidaros è il santuario nazionale della Norvegia, costruita sulla tomba di Sant'Olav, il re vichingo che portò il cristianesimo nel paese e morì nella battaglia di Stiklestad nel 1030. I lavori di costruzione iniziarono nel 1070 e terminarono intorno al 1300, sebbene l'edificio abbia subito numerosi incendi e massicci restauri nel corso dei secoli successivi. È la cattedrale gotica più settentrionale del mondo e un importantissimo luogo di pellegrinaggio nel Nord Europa. La magnifica facciata occidentale è riccamente decorata con decine di statue di santi, re e figure bibliche. All'interno, le spettacolari vetrate colorate creano un'atmosfera mistica e solenne. È un capolavoro architettonico assolutamente imperdibile e rappresenta il luogo tradizionale per la consacrazione dei re norvegesi.",
        "descEN": "Nidaros Cathedral is Norway's national sanctuary, built over the burial site of Saint Olav, the Viking king who brought Christianity to the country and died at the Battle of Stiklestad in 1030. Construction work began in 1070 and was completed around 1300, though the building has suffered multiple devastating fires and massive restorations over the following centuries. It stands as the northernmost Gothic cathedral in the world and a highly important pilgrimage site in Northern Europe. The magnificent western facade is richly decorated with dozens of statues of saints, kings, and biblical figures. Inside, the spectacular stained glass windows create a mystical and solemn atmosphere. It is an absolutely unmissable architectural masterpiece and serves as the traditional location for the consecration of Norwegian kings.",
        "tips": "Ingresso a pagamento. Controlla gli orari online, variano in base alla stagione.",
        "tipsEN": "Paid entry. Check hours online as they vary by season.",
        "src": [
          "Wikipedia \"Nidaros Cathedral\"",
          "nidarosdomen.no"
        ],
        "maps": "https://maps.google.com/?q=63.42692,10.39611"
      },
      {
        "id": "trd-2",
        "name": "Palazzo dell'Arcivescovo",
        "nameEN": "Archbishop's Palace",
        "cat": "cultura",
        "lat": 63.42611,
        "lng": 10.39556,
        "short": "Antica residenza arcivescovile e museo storico.",
        "shortEN": "Ancient archbishop's residence and historical museum.",
        "desc": "Situato proprio accanto alla Cattedrale di Nidaros, il Palazzo dell'Arcivescovo è uno degli edifici in pietra più antichi e meglio conservati di tutta la Scandinavia, risalente alla seconda metà del XII secolo. Fino alla Riforma protestante del 1537, questo imponente complesso fu la sede degli arcivescovi norvegesi e il centro del potere religioso. Oggi ospita un eccellente museo che espone sculture originali della cattedrale e affascinanti reperti archeologici rinvenuti in loco. Il cortile interno è molto suggestivo e spesso ospita concerti ed eventi culturali durante l'estate. Nel complesso si trovano anche i preziosi Gioielli della Corona norvegese e il Museo della Resistenza, offrendo ai visitatori un'immersione completa e avvincente nella storia religiosa, politica e militare della regione.",
        "descEN": "Located right next to Nidaros Cathedral, the Archbishop's Palace is one of the oldest and best-preserved stone buildings in all of Scandinavia, dating back to the second half of the 12th century. Until the Protestant Reformation in 1537, this imposing complex was the seat of the Norwegian archbishops and the center of religious power. Today, it houses an excellent museum displaying original sculptures from the cathedral and fascinating archaeological finds discovered on site. The inner courtyard is highly atmospheric and often hosts concerts and cultural events during the summer. The complex also contains the precious Norwegian Crown Jewels and the Resistance Museum, offering visitors a comprehensive and compelling dive into the religious, political, and military history of the region.",
        "tips": "Il biglietto combinato con la cattedrale è conveniente. Chiuso il lunedì in inverno.",
        "tipsEN": "A combined ticket with the cathedral is good value. Closed Mondays in winter.",
        "src": [
          "Wikipedia \"Archbishop's Palace, Trondheim\"",
          "nidarosdomen.no"
        ],
        "maps": "https://maps.google.com/?q=63.42611,10.39556"
      },
      {
        "id": "trd-3",
        "name": "Ponte della Città Vecchia",
        "nameEN": "Old Town Bridge",
        "cat": "panorama",
        "lat": 63.42833,
        "lng": 10.40139,
        "short": "Storico ponte rosso noto come \"Porta della Felicità\".",
        "shortEN": "Historic red bridge known as the \"Gate of Happiness\".",
        "desc": "Il Ponte della Città Vecchia, o Gamle Bybro, fu costruito originariamente nel 1681 subito dopo il devastante grande incendio di Trondheim, come parte integrante della ricostruzione della città progettata dall'urbanista Johan Caspar von Cicignon. L'attuale struttura in legno, caratterizzata dai pittoreschi portali rossi intagliati, risale invece al 1861. Conosciuto affettuosamente dai residenti come \"Lykkens portal\" (Porta della Felicità), offre una delle viste più iconiche e fotografate di tutta Trondheim: le colorate e storiche case di legno (bryggene) costruite su palafitte lungo le sponde del fiume Nidelva. È un luogo assolutamente perfetto per una passeggiata romantica e per ammirare il suggestivo paesaggio urbano che si riflette dolcemente sull'acqua, specialmente durante le magiche luci del tramonto.",
        "descEN": "The Old Town Bridge, or Gamle Bybro, was originally built in 1681 immediately after the devastating great fire of Trondheim, as an integral part of the city's reconstruction designed by urban planner Johan Caspar von Cicignon. The current wooden structure, characterized by its picturesque carved red portals, dates back to 1861. Affectionately known by residents as \"Lykkens portal\" (Gate of Happiness), it offers one of the most iconic and photographed views in all of Trondheim: the colorful and historic wooden wharves (bryggene) built on stilts along the banks of the Nidelva river. It is an absolutely perfect spot for a romantic stroll and to admire the striking urban landscape reflecting gently on the water, especially during the magical light of sunset.",
        "tips": "Accesso gratuito e aperto 24 ore su 24. Ottimo per le foto al tramonto.",
        "tipsEN": "Free access and open 24/7. Great for sunset photography.",
        "src": [
          "Wikipedia \"Old Town Bridge, Trondheim\"",
          "visittrondheim.no"
        ],
        "maps": "https://maps.google.com/?q=63.42833,10.40139"
      },
      {
        "id": "trd-4",
        "name": "Bakklandet",
        "nameEN": "Bakklandet",
        "cat": "cibo",
        "lat": 63.42917,
        "lng": 10.40306,
        "short": "Quartiere pittoresco con case in legno e caffè.",
        "shortEN": "Picturesque neighborhood with wooden houses and cafes.",
        "desc": "Attraversando il Gamle Bybro si entra direttamente a Bakklandet, il quartiere storico più affascinante e vivace di Trondheim. Storicamente era la zona della classe operaia, sviluppatasi nel XVII secolo con piccole e modeste case di legno colorate. Negli anni '60 questo gioiello rischiò di essere completamente demolito per far posto a un'autostrada a quattro corsie, ma fu fortunatamente salvato dalle forti proteste dei cittadini. Oggi le sue pittoresche strade acciottolate sono fiancheggiate da accoglienti caffè, ottimi ristoranti, boutique indipendenti e piccole gallerie d'arte. È il luogo ideale per fermarsi a gustare un caffè caldo e un dolce tradizionale norvegese, immergendosi in un'atmosfera bohémien, sicura e rilassata, che risulta perfetta anche per le famiglie con bambini al seguito.",
        "descEN": "Crossing the Gamle Bybro brings you directly into Bakklandet, the most charming and vibrant historic neighborhood in Trondheim. Historically, it was a working-class area, developed in the 17th century with small and modest colorful wooden houses. In the 1960s, this gem was almost completely demolished to make way for a four-lane highway, but it was fortunately saved by strong citizen protests. Today, its picturesque cobbled streets are lined with cozy cafes, excellent restaurants, independent boutiques, and small art galleries. It is the ideal place to stop and enjoy a hot coffee and a traditional Norwegian pastry, immersing yourself in a bohemian, safe, and relaxed atmosphere that is also perfect for families with children in tow.",
        "tips": "Prova un \"kanelbolle\" (girella alla cannella) in uno dei caffè locali.",
        "tipsEN": "Try a \"kanelbolle\" (cinnamon roll) at one of the local cafes.",
        "src": [
          "Wikipedia \"Bakklandet\"",
          "visittrondheim.no"
        ],
        "maps": "https://maps.google.com/?q=63.42917,10.40306"
      },
      {
        "id": "trd-5",
        "name": "Fortezza di Kristiansten",
        "nameEN": "Kristiansten Fortress",
        "cat": "kids",
        "lat": 63.42694,
        "lng": 10.41056,
        "short": "Fortezza storica con vista panoramica sulla città.",
        "shortEN": "Historic fortress with panoramic views of the city.",
        "desc": "La Fortezza di Kristiansten fu costruita strategicamente tra il 1681 e il 1685 su una collina a est della città, con lo scopo di proteggere Trondheim dagli attacchi nemici. Svolse un ruolo storico cruciale nel 1718, quando riuscì a respingere con successo le forze svedesi durante la Grande Guerra del Nord. Oggi questa imponente struttura militare è diventata un'area ricreativa molto amata dai locali e perfetta per le famiglie, offrendo ampi spazi verdi curati dove i bambini possono correre e giocare liberamente. I cannoni storici ben conservati e le spesse mura bianche difensive affascinano i visitatori di tutte le età. Dalla fortezza si gode di una vista panoramica spettacolare sull'intera città, sul fiordo scintillante e sulle montagne circostanti.",
        "descEN": "Kristiansten Fortress was strategically built between 1681 and 1685 on a hill east of the city, with the purpose of protecting Trondheim from enemy attacks. It played a crucial historical role in 1718 when it successfully repelled Swedish forces during the Great Northern War. Today, this imposing military structure has become a recreational area much loved by locals and perfect for families, offering wide, well-kept green spaces where children can run and play freely. The well-preserved historic cannons and thick white defensive walls fascinate visitors of all ages. From the fortress, you can enjoy a spectacular panoramic view over the entire city, the sparkling fjord, and the beautiful surrounding mountains.",
        "tips": "L'ingresso ai terreni è gratuito. C'è una ripida salita per arrivarci, ma la vista ripaga.",
        "tipsEN": "Entrance to the grounds is free. It's a steep walk up, but the view is rewarding.",
        "src": [
          "Wikipedia \"Kristiansten Fortress\"",
          "forsvarsbygg.no"
        ],
        "maps": "https://maps.google.com/?q=63.42694,10.41056"
      }
    ]
  },
  "bergen": {
    "city": "Bergen",
    "cityEN": "Bergen",
    "country": "Norvegia",
    "countryEN": "Norway",
    "flag": "🇳🇴",
    "intro": "Bergen, conosciuta come la porta dei fiordi, è una città affascinante circondata da sette montagne. Il suo centro storico compatto è perfetto per essere esplorato a piedi, offrendo un mix unico di storia anseatica, cultura marittima e natura spettacolare.",
    "introEN": "Bergen, known as the gateway to the fjords, is a charming city surrounded by seven mountains. Its compact historic center is perfect for exploring on foot, offering a unique mix of Hanseatic history, maritime culture, and spectacular nature.",
    "center": [
      60.3943,
      5.32591
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "ber-1",
        "name": "Fortezza di Bergenhus",
        "nameEN": "Bergenhus Fortress",
        "cat": "cultura",
        "lat": 60.40011,
        "lng": 5.31785,
        "short": "Una delle fortezze più antiche e meglio conservate della Norvegia.",
        "shortEN": "One of the oldest and best-preserved fortresses in Norway.",
        "desc": "La Fortezza di Bergenhus è una delle fortificazioni in pietra più antiche e meglio conservate della Norvegia, situata strategicamente all'ingresso del porto di Bergen. Le sue origini risalgono al 1240, quando re Håkon Håkonsson costruì la Håkonshallen, una magnifica sala per banchetti reali completata nel 1261. Un'altra struttura iconica è la Torre di Rosenkrantz, costruita nel 1560 dal governatore Erik Rosenkrantz, che incorpora parti di un mastio più antico. La fortezza ha svolto un ruolo cruciale nella storia norvegese, fungendo da residenza reale, sede episcopale e base militare. Oggi, i visitatori possono passeggiare liberamente nei vasti terreni, esplorare le antiche mura e godere di viste panoramiche sul porto, immergendosi in secoli di storia medievale e rinascimentale.",
        "descEN": "Bergenhus Fortress is one of the oldest and best-preserved stone fortifications in Norway, strategically located at the entrance to Bergen's harbor. Its origins date back to the 1240s, when King Håkon Håkonsson built Håkonshallen, a magnificent royal banquet hall completed in 1261. Another iconic structure is the Rosenkrantz Tower, built in the 1560s by governor Erik Rosenkrantz, which incorporates parts of an older keep. The fortress has played a crucial role in Norwegian history, serving as a royal residence, episcopal see, and military base. Today, visitors can stroll freely through the extensive grounds, explore the ancient walls, and enjoy panoramic views of the harbor, immersing themselves in centuries of medieval and Renaissance history.",
        "tips": "Aperta tutti i giorni dalle 06:00 alle 23:00. L'ingresso ai giardini è gratuito.",
        "tipsEN": "Open daily from 06:00 to 23:00. Entrance to the grounds is free.",
        "src": [
          "Wikipedia \"Bergenhus Fortress\"",
          "visitbergen.com"
        ],
        "maps": "https://maps.google.com/?q=60.40011,5.31785"
      },
      {
        "id": "ber-2",
        "name": "Mariakirken",
        "nameEN": "St Mary's Church",
        "cat": "cultura",
        "lat": 60.3989,
        "lng": 5.32343,
        "short": "L'edificio più antico di Bergen, risalente al XII secolo.",
        "shortEN": "The oldest existing building in Bergen, dating back to the 12th century.",
        "desc": "La Mariakirken, o Chiesa di Santa Maria, è il più antico edificio ancora esistente a Bergen, con la sua costruzione iniziata tra il 1130 e il 1140 e completata intorno al 1180. Questa magnifica chiesa romanica, caratterizzata da due imponenti torri gemelle, è l'unica sopravvissuta delle tre chiese medievali della città. Per secoli, dal 1408 al 1766, è stata la chiesa principale dei mercanti anseatici tedeschi che operavano a Bryggen, il che spiega la ricchezza dei suoi interni, tra cui un pulpito barocco finemente intagliato donato dai mercanti nel 1676. La chiesa rappresenta un capolavoro architettonico e un simbolo duraturo del ricco patrimonio religioso e commerciale di Bergen.",
        "descEN": "Mariakirken, or St Mary's Church, is the oldest existing building in Bergen, with its construction starting between 1130 and 1140 and completed around 1180. This magnificent Romanesque church, characterized by two imposing twin towers, is the only survivor of the city's three medieval churches. For centuries, from 1408 to 1766, it served as the main church for the German Hanseatic merchants operating in Bryggen, which explains the richness of its interior, including a finely carved Baroque pulpit donated by the merchants in 1676. The church represents an architectural masterpiece and an enduring symbol of Bergen's rich religious and commercial heritage.",
        "tips": "Aperta dal lunedì al venerdì, 10:00-16:00 (orario estivo). Chiusa nei fine settimana.",
        "tipsEN": "Open Monday to Friday, 10:00-16:00 (summer hours). Closed on weekends.",
        "src": [
          "Wikipedia \"St Mary's Church, Bergen\"",
          "visitbergen.com"
        ],
        "maps": "https://maps.google.com/?q=60.3989,5.32343"
      },
      {
        "id": "ber-3",
        "name": "Bryggen",
        "nameEN": "Bryggen",
        "cat": "cultura",
        "lat": 60.39772,
        "lng": 5.32293,
        "short": "Lo storico quartiere anseatico, Patrimonio dell'Umanità UNESCO.",
        "shortEN": "The historic Hanseatic wharf, a UNESCO World Heritage site.",
        "desc": "Bryggen è l'iconico quartiere portuale di Bergen, celebre per le sue pittoresche case di legno colorate allineate lungo il molo di Vågen. Questo sito, dichiarato Patrimonio dell'Umanità dall'UNESCO nel 1979, testimonia l'importanza di Bergen come fulcro dell'impero commerciale della Lega Anseatica dal XIV alla metà del XVI secolo. Sebbene molti edifici siano stati distrutti da numerosi incendi, in particolare quello devastante del 1702, la ricostruzione ha sempre seguito i modelli e i metodi tradizionali, preservando l'autentico aspetto medievale. Oggi, i 62 edifici rimasti ospitano un vivace mix di botteghe artigiane, studi di artisti, boutique e ristoranti. Passeggiare tra gli stretti vicoli di legno offre un affascinante viaggio indietro nel tempo.",
        "descEN": "Bryggen is the iconic harbor district of Bergen, famous for its picturesque colorful wooden houses lined up along the Vågen wharf. This site, declared a UNESCO World Heritage site in 1979, testifies to Bergen's importance as a hub of the Hanseatic League's trading empire from the 14th to the mid-16th century. Although many buildings were destroyed by numerous fires, particularly the devastating one in 1702, reconstruction has always followed traditional patterns and methods, preserving the authentic medieval appearance. Today, the 62 remaining buildings house a vibrant mix of craft shops, artists' studios, boutiques, and restaurants. Strolling through the narrow wooden alleyways offers a fascinating journey back in time.",
        "tips": "Esplora i vicoli stretti dietro le facciate principali per scoprire botteghe artigiane nascoste.",
        "tipsEN": "Explore the narrow alleyways behind the main facades to discover hidden craft shops.",
        "src": [
          "UNESCO World Heritage Centre",
          "visitnorway.com"
        ],
        "maps": "https://maps.google.com/?q=60.39772,5.32293"
      },
      {
        "id": "ber-4",
        "name": "Fisketorget",
        "nameEN": "Fish Market",
        "cat": "cibo",
        "lat": 60.39469,
        "lng": 5.32416,
        "short": "Il vivace e storico mercato del pesce nel cuore di Bergen.",
        "shortEN": "The lively and historic fish market in the heart of Bergen.",
        "desc": "Il Fisketorget, o Mercato del Pesce, è uno dei luoghi più iconici e vivaci di Bergen, situato strategicamente nel cuore della città, proprio in fondo al porto di Vågen. Le sue origini risalgono al 1200, quando divenne un punto di incontro cruciale per i pescatori locali e i mercanti che vendevano il pescato fresco agli abitanti della città. Oggi, il mercato offre un'abbondanza di prelibatezze marine, tra cui salmone, granchio reale, gamberi e caviale, oltre a frutta fresca, verdura e prodotti artigianali locali. Dal 2012, il mercato comprende anche la Mathallen, una moderna struttura coperta che ospita ristoranti e banchi aperti tutto l'anno, permettendo ai visitatori di gustare frutti di mare freschissimi in qualsiasi stagione.",
        "descEN": "Fisketorget, or the Fish Market, is one of the most iconic and lively places in Bergen, strategically located in the heart of the city, right at the bottom of the Vågen harbor. Its origins date back to the 1200s, when it became a crucial meeting point for local fishermen and merchants selling fresh catch to the city's inhabitants. Today, the market offers an abundance of marine delicacies, including salmon, king crab, shrimp, and caviar, as well as fresh fruit, vegetables, and local artisanal products. Since 2012, the market also includes Mathallen, a modern indoor food hall housing restaurants and stalls open year-round, allowing visitors to enjoy the freshest seafood in any season.",
        "tips": "Il mercato all'aperto è attivo da maggio a settembre; la Mathallen coperta è aperta tutto l'anno.",
        "tipsEN": "The outdoor market operates from May to September; the indoor Mathallen is open year-round.",
        "src": [
          "visitbergen.com",
          "bergen.kommune.no"
        ],
        "maps": "https://maps.google.com/?q=60.39469,5.32416"
      },
      {
        "id": "ber-5",
        "name": "Fløibanen",
        "nameEN": "Fløibanen Funicular",
        "cat": "panorama",
        "lat": 60.39641,
        "lng": 5.32856,
        "short": "Funicolare che offre viste spettacolari su Bergen dal Monte Fløyen.",
        "shortEN": "Funicular offering spectacular views of Bergen from Mount Fløyen.",
        "desc": "La Fløibanen è una storica funicolare che collega il centro di Bergen alla cima del Monte Fløyen, a 320 metri sul livello del mare. Inaugurata ufficialmente nel 1918, dopo che l'idea iniziale fu proposta nel 1895, è diventata una delle attrazioni turistiche più popolari di tutta la Norvegia. Il viaggio panoramico dura solo dai 5 agli 8 minuti, ma offre una vista mozzafiato e in continua espansione sulla città, sul porto e sui fiordi circostanti. Una volta in cima, i visitatori possono godere di un panorama spettacolare, esplorare numerosi sentieri escursionistici immersi nella natura, o divertirsi con i bambini nella magica Foresta dei Troll. È un'esperienza imperdibile per ammirare Bergen dall'alto.",
        "descEN": "The Fløibanen is a historic funicular railway connecting the center of Bergen to the top of Mount Fløyen, 320 meters above sea level. Officially opened in 1918, after the initial idea was proposed in 1895, it has become one of the most popular tourist attractions in all of Norway. The scenic journey takes only 5 to 8 minutes but offers a breathtaking, ever-expanding view of the city, the harbor, and the surrounding fjords. Once at the top, visitors can enjoy a spectacular panorama, explore numerous hiking trails immersed in nature, or have fun with children in the magical Troll Forest. It is an unmissable experience to admire Bergen from above.",
        "tips": "Aperta tutti i giorni dalle 07:30 (08:00 nei weekend) fino a mezzanotte. Partenze ogni 10-15 minuti.",
        "tipsEN": "Open daily from 07:30 (08:00 on weekends) until midnight. Departures every 10-15 minutes.",
        "src": [
          "floyen.no",
          "Wikipedia \"Fløibanen\""
        ],
        "maps": "https://maps.google.com/?q=60.39641,5.32856"
      }
    ]
  },
  "copenhagen": {
    "city": "Copenaghen",
    "cityEN": "Copenhagen",
    "country": "Danimarca",
    "countryEN": "Denmark",
    "flag": "🇩🇰",
    "intro": "Scopri il cuore storico di Copenaghen, dove l'architettura reale si fonde con il design moderno e l'atmosfera accogliente. Un itinerario perfetto per esplorare a piedi le meraviglie della capitale danese.",
    "introEN": "Discover the historic heart of Copenhagen, where royal architecture blends with modern design and a cozy atmosphere. A perfect walking itinerary to explore the wonders of the Danish capital.",
    "center": [
      55.68672,
      12.57007
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "cph-1",
        "name": "Nyhavn",
        "nameEN": "Nyhavn",
        "cat": "panorama",
        "lat": 55.67974,
        "lng": 12.59089,
        "short": "Iconico porto del XVII secolo con case colorate.",
        "shortEN": "Iconic 17th-century waterfront with colorful houses.",
        "desc": "Nyhavn è il celebre porto canale di Copenaghen, scavato originariamente nel 1671-1673 dai prigionieri di guerra svedesi. Le pittoresche case a schiera dipinte a colori vivaci che fiancheggiano l'acqua risalgono al XVII e XVIII secolo. La casa più antica, al numero 9, fu costruita nel 1681. Il famoso scrittore di fiabe Hans Christian Andersen visse in diverse case lungo questo canale, tra cui i numeri 18, 20 e 67. Oggi, le storiche navi in legno ormeggiate e i vivaci caffè creano un'atmosfera vibrante, rendendolo il luogo perfetto per iniziare l'esplorazione della città.",
        "descEN": "Nyhavn is Copenhagen's famous canal and entertainment district, originally excavated from 1671 to 1673 by Swedish prisoners of war. The picturesque, brightly colored townhouses lining the water date back to the 17th and 18th centuries. The oldest house, at number 9, was built in 1681. The renowned fairy tale writer Hans Christian Andersen lived in several houses along this canal, including numbers 18, 20, and 67. Today, the historical wooden ships moored in the canal and the lively cafes create a vibrant atmosphere, making it the perfect place to start exploring the city.",
        "tips": "Sempre aperto e gratuito. Ideale per una passeggiata mattutina per evitare la folla.",
        "tipsEN": "Always open and free. Ideal for a morning stroll to avoid the crowds.",
        "src": [
          "Wikipedia \"Nyhavn\"",
          "visitcopenhagen.com"
        ],
        "maps": "https://maps.google.com/?q=55.67974,12.59089"
      },
      {
        "id": "cph-2",
        "name": "Palazzo di Amalienborg",
        "nameEN": "Amalienborg Palace",
        "cat": "cultura",
        "lat": 55.68396,
        "lng": 12.59308,
        "short": "Residenza invernale della famiglia reale danese.",
        "shortEN": "Winter residence of the Danish royal family.",
        "desc": "Il Palazzo di Amalienborg è la residenza invernale ufficiale della famiglia reale danese. Costruito originariamente nel 1750 per quattro famiglie nobili, il complesso è formato da quattro palazzi identici in stile rococò disposti attorno a una piazza ottagonale. Al centro si erge la monumentale statua equestre del re Federico V, fondatore del palazzo. La famiglia reale acquistò la proprietà dopo che il Palazzo di Christiansborg fu distrutto da un incendio nel 1794. I visitatori possono assistere al suggestivo cambio della guardia reale (Den Kongelige Livgarde) che si svolge ogni giorno a mezzogiorno nella piazza.",
        "descEN": "Amalienborg Palace is the official winter residence of the Danish royal family. Originally built in the 1750s for four noble families, the complex consists of four identical rococo-style palaces arranged around an octagonal courtyard. In the center stands a monumental equestrian statue of King Frederick V, the founder of the palace. The royal family acquired the property after Christiansborg Palace was destroyed by fire in 1794. Visitors can witness the impressive changing of the Royal Guard (Den Kongelige Livgarde) which takes place every day at noon in the square.",
        "tips": "Il cambio della guardia avviene ogni giorno alle 12:00 nella piazza centrale.",
        "tipsEN": "The changing of the guard takes place every day at 12:00 PM in the central square.",
        "src": [
          "Wikipedia \"Amalienborg\"",
          "kongeligeslotte.dk"
        ],
        "maps": "https://maps.google.com/?q=55.68396,12.59308"
      },
      {
        "id": "cph-3",
        "name": "Castello di Rosenborg",
        "nameEN": "Rosenborg Castle",
        "cat": "cultura",
        "lat": 55.68569,
        "lng": 12.57742,
        "short": "Castello rinascimentale che custodisce i gioielli della corona.",
        "shortEN": "Renaissance castle housing the Danish crown jewels.",
        "desc": "Il Castello di Rosenborg è un magnifico edificio rinascimentale situato nel cuore dei Giardini del Re (Kongens Have). Costruito nel 1606 dal re Cristiano IV, fu originariamente concepito come residenza estiva di campagna. Il castello fu utilizzato come residenza reale fino al 1710 e oggi ospita un affascinante museo dedicato alla storia reale danese. Le sue stanze riccamente decorate conservano arredi d'epoca, ritratti e tesori inestimabili. L'attrazione principale è la camera blindata sotterranea, dove sono custoditi i magnifici Gioielli della Corona Danese e le insegne reali, alcuni dei quali risalgono al XVI secolo.",
        "descEN": "Rosenborg Castle is a magnificent Renaissance building situated in the heart of the King's Garden (Kongens Have). Built in 1606 by King Christian IV, it was originally designed as a summer countryhouse. The castle was used as a royal residence until 1710 and today houses a fascinating museum dedicated to Danish royal history. Its richly decorated rooms preserve period furnishings, portraits, and priceless treasures. The main attraction is the underground vault, which safeguards the magnificent Danish Crown Jewels and royal regalia, some of which date back to the 16th century.",
        "tips": "Ingresso a pagamento (circa 130 DKK). I giardini circostanti sono gratuiti e perfetti per una pausa.",
        "tipsEN": "Paid entry (approx. 130 DKK). The surrounding gardens are free and perfect for a break.",
        "src": [
          "Wikipedia \"Rosenborg Castle\"",
          "kongeligeslotte.dk"
        ],
        "maps": "https://maps.google.com/?q=55.68569,12.57742"
      },
      {
        "id": "cph-4",
        "name": "Torvehallerne",
        "nameEN": "Torvehallerne",
        "cat": "cibo",
        "lat": 55.68387,
        "lng": 12.56955,
        "short": "Vivace mercato coperto con specialità locali e internazionali.",
        "shortEN": "Bustling indoor market with local and international specialties.",
        "desc": "Torvehallerne è il mercato alimentare più famoso e vivace di Copenaghen, inaugurato nel settembre 2011. Situato nella piazza di Israels Plads, il mercato è composto da due grandi padiglioni in vetro che ospitano oltre 60 bancarelle. È il luogo ideale per immergersi nella cultura gastronomica danese, offrendo una vasta gamma di prodotti freschi, formaggi artigianali, pesce e dolci tradizionali. I visitatori possono gustare il celebre smørrebrød (il tipico panino aperto danese), sorseggiare caffè di alta qualità o assaggiare prelibatezze internazionali. L'atmosfera informale e la varietà di opzioni lo rendono una tappa imperdibile per i buongustai.",
        "descEN": "Torvehallerne is Copenhagen's most famous and bustling food market, opened in September 2011. Located in Israels Plads square, the market consists of two large glass halls housing over 60 stalls. It is the ideal place to immerse yourself in Danish gastronomic culture, offering a wide range of fresh produce, artisanal cheeses, seafood, and traditional pastries. Visitors can enjoy the famous smørrebrød (the typical Danish open-faced sandwich), sip high-quality coffee, or taste international delicacies. The casual atmosphere and variety of options make it a must-visit stop for food lovers.",
        "tips": "Aperto tutti i giorni. Ottimo posto per un pranzo veloce e gustoso.",
        "tipsEN": "Open every day. Great spot for a quick and tasty lunch.",
        "src": [
          "Wikipedia \"Torvehallerne\"",
          "torvehallernekbh.dk"
        ],
        "maps": "https://maps.google.com/?q=55.68387,12.56955"
      },
      {
        "id": "cph-5",
        "name": "Rundetårn",
        "nameEN": "The Round Tower",
        "cat": "kids",
        "lat": 55.68136,
        "lng": 12.57579,
        "short": "Storica torre del XVII secolo con rampa a spirale e vista panoramica.",
        "shortEN": "Historic 17th-century tower with a spiral ramp and panoramic views.",
        "desc": "La Rundetårn, o Torre Rotonda, è uno dei monumenti più iconici di Copenaghen. Costruita dal re Cristiano IV tra il 1637 e il 1642, fu originariamente concepita come osservatorio astronomico per l'Università di Copenaghen. La caratteristica più famosa della torre è la sua rampa equestre a spirale, lunga 209 metri, che sale dolcemente fino alla cima senza gradini, permettendo un tempo a cavalli e carrozze di trasportare attrezzature pesanti. Dalla piattaforma panoramica a 34,8 metri di altezza, i visitatori possono godere di una vista spettacolare a 360 gradi sui tetti rossi del centro storico della città.",
        "descEN": "The Rundetårn, or Round Tower, is one of Copenhagen's most iconic monuments. Built by King Christian IV between 1637 and 1642, it was originally designed as an astronomical observatory for the University of Copenhagen. The tower's most famous feature is its 209-meter-long spiral equestrian ramp, which gently ascends to the top without steps, once allowing horses and carriages to transport heavy equipment. From the viewing platform at a height of 34.8 meters, visitors can enjoy a spectacular 360-degree view over the red roofs of the city's historic center.",
        "tips": "Ingresso a pagamento (circa 40 DKK). La salita senza gradini è divertente e accessibile per i bambini.",
        "tipsEN": "Paid entry (approx. 40 DKK). The step-free climb is fun and accessible for children.",
        "src": [
          "Wikipedia \"Rundetårn\"",
          "rundetaarn.dk"
        ],
        "maps": "https://maps.google.com/?q=55.68136,12.57579"
      }
    ]
  },
  "sansebastian": {
    "city": "San Sebastián",
    "cityEN": "San Sebastián",
    "country": "Spagna",
    "countryEN": "Spain",
    "flag": "🇪🇸",
    "intro": "San Sebastián, o Donostia in basco, è una perla costiera rinomata per la sua gastronomia eccezionale e le spiagge eleganti. Questo itinerario a piedi esplora il cuore storico e la spettacolare baia della città.",
    "introEN": "San Sebastián, or Donostia in Basque, is a coastal pearl renowned for its exceptional gastronomy and elegant beaches. This walking itinerary explores the historic heart and the spectacular bay of the city.",
    "center": [
      43.322,
      -1.987
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "sse-1",
        "name": "Plaza de la Constitución",
        "nameEN": "Constitution Square",
        "cat": "cultura",
        "lat": 43.3236,
        "lng": -1.98488,
        "short": "Il cuore pulsante della Parte Vieja.",
        "shortEN": "The beating heart of the Old Town.",
        "desc": "La Plaza de la Constitución è il centro nevralgico della Parte Vieja (Città Vecchia) di San Sebastián. Costruita originariamente nel 1817 dall'architetto Pedro Manuel de Ugartemendía dopo che un devastante incendio distrusse gran parte della città nel 1813, la piazza si distingue per i suoi portici e i balconi numerati. Questi numeri, ancora oggi visibili sopra le finestre, ricordano il periodo in cui la piazza veniva utilizzata come arena per le corride. Oggi è un luogo vivace, circondato da bar di pintxos e caffè, dove si svolgono le principali feste cittadine, come la famosa Tamborrada il 20 gennaio. È il punto di partenza ideale per esplorare le strette vie storiche e assaporare la cultura basca.",
        "descEN": "Plaza de la Constitución is the vibrant nerve center of San Sebastián's Parte Vieja (Old Town). Originally built in 1817 by architect Pedro Manuel de Ugartemendía after a devastating fire destroyed much of the city in 1813, the square is notable for its arcades and numbered balconies. These numbers, still visible above the windows today, are a reminder of the time when the square was used as a bullring. Today, it is a lively gathering place surrounded by pintxos bars and cafes, hosting major city festivals such as the famous Tamborrada on January 20th. It is the perfect starting point to explore the narrow historic streets and savor Basque culture.",
        "tips": "Aperta 24 ore su 24. Ottima per assaggiare i pintxos nei bar circostanti.",
        "tipsEN": "Open 24/7. Great for tasting pintxos in the surrounding bars.",
        "src": [
          "Wikipedia \"Plaza de la Constitución (San Sebastián)\"",
          "sansebastianturismoa.eus"
        ],
        "maps": "https://maps.google.com/?q=43.3236,-1.98488"
      },
      {
        "id": "sse-2",
        "name": "Museo San Telmo",
        "nameEN": "San Telmo Museum",
        "cat": "cultura",
        "lat": 43.32504,
        "lng": -1.985,
        "short": "Il più antico museo dei Paesi Baschi.",
        "shortEN": "The oldest museum in the Basque Country.",
        "desc": "Situato ai piedi del Monte Urgull, il Museo San Telmo è la principale istituzione dedicata alla storia e alla cultura della società basca. Inaugurato nel 1902, è il museo più antico dei Paesi Baschi. Il complesso architettonico è un affascinante connubio tra un antico convento domenicano del XVI secolo, caratterizzato da un chiostro rinascimentale e una chiesa con affreschi di Josep Maria Sert, e un'estensione contemporanea all'avanguardia completata nel 2011. Le collezioni spaziano dall'archeologia alle belle arti, offrendo un viaggio immersivo attraverso l'evoluzione dell'identità basca dalla preistoria ai giorni nostri. È una tappa imperdibile per comprendere profondamente le radici di questa regione unica.",
        "descEN": "Located at the foot of Mount Urgull, the San Telmo Museum is the premier institution dedicated to the history and culture of Basque society. Inaugurated in 1902, it is the oldest museum in the Basque Country. The architectural complex is a fascinating blend of a 16th-century Dominican convent, featuring a Renaissance cloister and a church with frescoes by Josep Maria Sert, and a cutting-edge contemporary extension completed in 2011. The collections range from archaeology to fine arts, offering an immersive journey through the evolution of Basque identity from prehistory to the present day. It is an unmissable stop to deeply understand the roots of this unique region.",
        "tips": "Chiuso il lunedì. Ingresso circa 6€, gratuito il martedì.",
        "tipsEN": "Closed on Mondays. Admission around €6, free on Tuesdays.",
        "src": [
          "santelmomuseoa.eus",
          "Wikipedia \"San Telmo Museoa\""
        ],
        "maps": "https://maps.google.com/?q=43.32504,-1.985"
      },
      {
        "id": "sse-3",
        "name": "Castello della Mota",
        "nameEN": "Mota Castle",
        "cat": "panorama",
        "lat": 43.32504,
        "lng": -1.98889,
        "short": "Fortezza storica con vista mozzafiato sulla baia.",
        "shortEN": "Historic fortress with breathtaking bay views.",
        "desc": "Il Castillo de la Mota corona la cima del Monte Urgull, offrendo uno dei panorami più spettacolari su San Sebastián e la Baia della Concha. Le origini di questa fortezza difensiva risalgono al XII secolo, quando fu costruita per proteggere la città dagli attacchi marittimi. Nel corso dei secoli ha subito numerosi assedi e ricostruzioni, in particolare durante le guerre carliste nel XIX secolo. Oggi, le sue antiche mura ospitano la Casa de la Historia, un piccolo museo che racconta il passato militare della città. Sulla sommità del castello svetta la monumentale statua del Sagrado Corazón (Sacro Cuore), alta 12 metri e aggiunta nel 1950, che veglia silenziosamente sulla città sottostante.",
        "descEN": "Castillo de la Mota crowns the summit of Mount Urgull, offering one of the most spectacular panoramic views over San Sebastián and La Concha Bay. The origins of this defensive fortress date back to the 12th century when it was built to protect the city from maritime attacks. Over the centuries, it has endured numerous sieges and reconstructions, particularly during the Carlist Wars in the 19th century. Today, its ancient walls house the Casa de la Historia, a small museum recounting the city's military past. Atop the castle stands the monumental 12-meter-tall statue of the Sagrado Corazón (Sacred Heart), added in 1950, which silently watches over the city below.",
        "tips": "La salita a piedi richiede circa 20-30 minuti. Ingresso gratuito.",
        "tipsEN": "The walk up takes about 20-30 minutes. Free admission.",
        "src": [
          "Wikipedia \"Monte Urgull\"",
          "sansebastianturismoa.eus"
        ],
        "maps": "https://maps.google.com/?q=43.32504,-1.98889"
      },
      {
        "id": "sse-4",
        "name": "Acquario di San Sebastián",
        "nameEN": "San Sebastián Aquarium",
        "cat": "kids",
        "lat": 43.3229,
        "lng": -1.99212,
        "short": "Uno dei più antichi e famosi acquari d'Europa.",
        "shortEN": "One of Europe's oldest and most famous aquariums.",
        "desc": "Situato nel pittoresco porto peschereccio, l'Acquario di San Sebastián è una delle attrazioni più amate dalle famiglie. Inaugurato nel 1928 su iniziativa della Società Oceanografica di Gipuzkoa, è stato il primo museo di scienze naturali dedicato al mare in Spagna. La struttura è celebre per il suo spettacolare oceanario, attraversato da un tunnel trasparente a 360 gradi che permette ai visitatori di camminare circondati da squali toro, razze e centinaia di specie marine del Mar Cantabrico. Oltre alle vasche, l'acquario ospita un'affascinante sezione storica che illustra il forte legame della città con l'oceano, includendo modelli navali e lo scheletro di una balena franca catturata nel 1878.",
        "descEN": "Located in the picturesque fishing port, the San Sebastián Aquarium is one of the most beloved family attractions. Inaugurated in 1928 on the initiative of the Oceanographic Society of Gipuzkoa, it was the first natural science museum dedicated to the sea in Spain. The facility is famous for its spectacular oceanarium, traversed by a 360-degree transparent tunnel that allows visitors to walk surrounded by bull sharks, rays, and hundreds of marine species from the Cantabrian Sea. Beyond the tanks, the aquarium houses a fascinating historical section illustrating the city's strong bond with the ocean, including naval models and the skeleton of a right whale caught in 1878.",
        "tips": "Biglietto intero circa 14€. Consigliata la prenotazione online.",
        "tipsEN": "Adult ticket around €14. Online booking recommended.",
        "src": [
          "aquariumss.com",
          "Wikipedia \"Aquarium of Donostia-San Sebastián\""
        ],
        "maps": "https://maps.google.com/?q=43.3229,-1.99212"
      },
      {
        "id": "sse-5",
        "name": "Spiaggia della Concha",
        "nameEN": "La Concha Beach",
        "cat": "natura",
        "lat": 43.3177,
        "lng": -1.98637,
        "short": "L'iconica spiaggia a forma di mezzaluna.",
        "shortEN": "The iconic crescent-shaped beach.",
        "desc": "La Playa de la Concha è universalmente riconosciuta come una delle spiagge urbane più belle d'Europa. Caratterizzata dalla sua perfetta forma a mezzaluna e dalla sabbia dorata, si estende per circa 1,3 chilometri lungo l'omonima baia, protetta dai monti Urgull e Igueldo. La sua fama internazionale iniziò nel 1845, quando la regina Isabella II di Spagna scelse San Sebastián come residenza estiva per i suoi bagni di mare terapeutici, trasformando la città in una meta aristocratica. L'elegante lungomare, impreziosito dalla caratteristica ringhiera bianca in ferro battuto progettata da Juan Rafael Alday nel 1910, è il luogo perfetto per una passeggiata rilassante al tramonto, godendo della brezza marina e dell'atmosfera sofisticata.",
        "descEN": "Playa de la Concha is universally recognized as one of the most beautiful urban beaches in Europe. Characterized by its perfect crescent shape and golden sand, it stretches for about 1.3 kilometers along the eponymous bay, protected by Mounts Urgull and Igueldo. Its international fame began in 1845 when Queen Isabella II of Spain chose San Sebastián as her summer residence for therapeutic sea bathing, transforming the city into an aristocratic destination. The elegant promenade, adorned with the distinctive white wrought-iron railing designed by Juan Rafael Alday in 1910, is the perfect place for a relaxing sunset stroll, enjoying the sea breeze and sophisticated atmosphere.",
        "tips": "Ideale per una passeggiata o un bagno. Le docce e i servizi sono disponibili in estate.",
        "tipsEN": "Ideal for a walk or a swim. Showers and facilities are available in summer.",
        "src": [
          "Wikipedia \"Beach of La Concha\"",
          "sansebastianturismoa.eus"
        ],
        "maps": "https://maps.google.com/?q=43.3177,-1.98637"
      }
    ]
  },
  "bilbao": {
    "city": "Bilbao",
    "cityEN": "Bilbao",
    "country": "Spagna",
    "countryEN": "Spain",
    "flag": "🇪🇸",
    "intro": "Scopri la straordinaria trasformazione di Bilbao da centro industriale a capolavoro moderno, fondendo architettura all'avanguardia con ricche tradizioni basche.",
    "introEN": "Discover Bilbao's stunning transformation from an industrial hub to a modern masterpiece, blending cutting-edge architecture with rich Basque traditions.",
    "center": [
      43.263,
      -2.93
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "bil-1",
        "name": "Parco Doña Casilda Iturrizar",
        "nameEN": "Doña Casilda Iturrizar Park",
        "cat": "kids",
        "lat": 43.2655,
        "lng": -2.9416,
        "short": "Un tranquillo parco in stile inglese con laghetto e giostra, perfetto per una rilassante passeggiata in famiglia.",
        "shortEN": "A peaceful English-style park with a duck pond and carousel, perfect for a relaxing family stroll.",
        "desc": "Il Parco Doña Casilda Iturrizar è lo spazio verde più storico e amato di Bilbao, offrendo un rifugio pacifico nel cuore della città. Progettato in stile romantico inglese e inaugurato nel 1907, il parco prende il nome dalla ricca benefattrice che donò il terreno. Presenta un bellissimo laghetto con anatre, una classica giostra e una maestosa pergola che ospita occasionali spettacoli. Per le famiglie, il parco è una vera delizia, offrendo ampi spazi dove i bambini possono giocare e interagire con i cigni e i pavoni residenti. La lussureggiante varietà botanica e il vicino Museo di Belle Arti lo rendono un punto di partenza perfetto per una passeggiata. La sua atmosfera tranquilla contrasta magnificamente con il vivace ambiente urbano, permettendo ai visitatori di rilassarsi prima di esplorare le meraviglie architettoniche moderne della città.",
        "descEN": "Doña Casilda Iturrizar Park is Bilbao's most historic and cherished green space, offering a peaceful retreat in the heart of the city. Designed in an English romantic style and inaugurated in 1907, the park was named after its wealthy benefactress who donated the land. It features a beautiful duck pond, a classic carousel, and a majestic pergola that hosts occasional performances. For families, the park is an absolute delight, providing ample space for children to play and interact with the resident swans and peacocks. The lush botanical variety and the nearby Bilbao Fine Arts Museum make it a perfect starting point for a leisurely stroll. Its tranquil atmosphere beautifully contrasts with the bustling urban environment, allowing visitors to relax before diving into the city's modern architectural wonders.",
        "tips": "Ingresso gratuito. Aperto 24/7. Situato vicino al Museo di Belle Arti; ottimo posto per un picnic.",
        "tipsEN": "Free entry. Open 24/7. Located near the Fine Arts Museum; great spot for a picnic.",
        "src": [
          "Wikipedia \"Doña Casilda Iturrizar park\"",
          "bilbaoturismo.net"
        ],
        "maps": "https://maps.google.com/?q=43.26550,-2.94160"
      },
      {
        "id": "bil-2",
        "name": "Museo Guggenheim Bilbao",
        "nameEN": "Guggenheim Museum Bilbao",
        "cat": "cultura",
        "lat": 43.2686,
        "lng": -2.934,
        "short": "L'iconico museo d'arte contemporanea in titanio di Frank Gehry che ha trasformato lo skyline di Bilbao.",
        "shortEN": "Frank Gehry's iconic titanium-clad contemporary art museum that transformed Bilbao's skyline and global reputation.",
        "desc": "Il Museo Guggenheim di Bilbao è un capolavoro dell'architettura contemporanea che ha trasformato da solo l'immagine globale della città. Progettato dal celebre architetto Frank Gehry e aperto ufficialmente al pubblico il 18 ottobre 1997, l'edificio è famoso per il suo esterno ondulato rivestito in titanio che cattura la luce del sole in modi affascinanti. All'interno, il museo ospita una collezione di livello mondiale di arte moderna e contemporanea, con opere su larga scala e mostre internazionali a rotazione. All'esterno, i visitatori sono accolti da sculture iconiche, tra cui l'enorme \"Puppy\" floreale di Jeff Koons e il gigantesco ragno \"Maman\" di Louise Bourgeois. Il museo non solo ha rivitalizzato l'ex lungofiume industriale di Bilbao, ma è diventato un simbolo di rigenerazione urbana in tutto il mondo. Esplorare le sue gallerie curve è un'esperienza culturale indimenticabile.",
        "descEN": "The Guggenheim Museum Bilbao is a masterpiece of contemporary architecture that single-handedly transformed the city's global image. Designed by the renowned architect Frank Gehry and officially opened to the public on October 18, 1997, the building is famous for its undulating, titanium-clad exterior that catches the sunlight in mesmerizing ways. Inside, the museum hosts a world-class collection of modern and contemporary art, featuring large-scale, site-specific works and rotating international exhibitions. Outside, visitors are greeted by iconic sculptures, including Jeff Koons's massive floral \"Puppy\" and Louise Bourgeois's giant spider \"Maman.\" The museum not only revitalized Bilbao's former industrial riverfront but also became a symbol of urban regeneration worldwide. Exploring its curved galleries and striking outdoor installations is an unforgettable cultural experience for art lovers of all ages.",
        "tips": "Chiuso il lunedì. Prenota i biglietti online in anticipo per evitare code. Non perdere le sculture esterne.",
        "tipsEN": "Closed on Mondays. Book tickets online in advance to avoid queues. Don't miss the outdoor sculptures.",
        "src": [
          "Wikipedia \"Guggenheim Museum Bilbao\"",
          "guggenheim-bilbao.eus"
        ],
        "maps": "https://maps.google.com/?q=43.26860,-2.93400"
      },
      {
        "id": "bil-3",
        "name": "Ponte Zubizuri",
        "nameEN": "Zubizuri Bridge",
        "cat": "panorama",
        "lat": 43.268,
        "lng": -2.9275,
        "short": "Un suggestivo ponte pedonale a forma di vela progettato da Santiago Calatrava, con viste panoramiche sul fiume Nervión.",
        "shortEN": "A striking, sail-like pedestrian bridge designed by Santiago Calatrava, offering scenic views over the Nervión River.",
        "desc": "Lo Zubizuri, che si traduce in \"ponte bianco\" in lingua basca, è una suggestiva passerella pedonale che attraversa il fiume Nervión. Progettato dall'architetto visionario Santiago Calatrava e inaugurato nel 1997, questo ponte pedonale ad arco tirato presenta un caratteristico arco inclinato e un impalcato curvo in mattoni di vetro. Il suo design futuristico ricorda una vela gonfia, integrandosi perfettamente con l'estetica moderna introdotta dal vicino Museo Guggenheim. Il ponte funge da collegamento vitale e panoramico tra la riva destra di Campo Volantín e la riva sinistra di Uribitarte. Sebbene la superficie in vetro originale si fosse rivelata scivolosa nel clima piovoso di Bilbao, richiedendo l'aggiunta di un tappeto antiscivolo, la struttura rimane un amato punto di riferimento architettonico. Attraversare lo Zubizuri offre fantastiche viste panoramiche sul fiume e sullo skyline in evoluzione della città.",
        "descEN": "The Zubizuri, which translates to \"white bridge\" in the Basque language, is a striking pedestrian walkway spanning the Nervión River. Designed by the visionary architect Santiago Calatrava and opened in 1997, this tied-arch footbridge features a distinctive leaning arch and a curved, glass-brick deck. Its futuristic design resembles a billowing sail, perfectly complementing the modern aesthetic introduced by the nearby Guggenheim Museum. The bridge serves as a vital and scenic link between the Campo Volantín right bank and the Uribitarte left bank. While the original glass surface proved notoriously slippery in Bilbao's rainy climate, prompting the addition of a non-slip carpet, the structure remains a beloved architectural landmark. Walking across the Zubizuri offers fantastic panoramic views of the river and the city's evolving skyline, making it a perfect photo spot.",
        "tips": "Attraversamento gratuito. Ideale da visitare al tramonto o in prima serata quando il ponte è illuminato.",
        "tipsEN": "Free to cross. Best visited at sunset or early evening when the bridge is beautifully illuminated.",
        "src": [
          "Wikipedia \"Zubizuri\""
        ],
        "maps": "https://maps.google.com/?q=43.26800,-2.92750"
      },
      {
        "id": "bil-4",
        "name": "Plaza Nueva",
        "nameEN": "Plaza Nueva",
        "cat": "cibo",
        "lat": 43.2595,
        "lng": -2.9232,
        "short": "Una monumentale piazza neoclassica nella Città Vecchia, famosa per la sua atmosfera vivace e gli squisiti bar di pintxos.",
        "shortEN": "A monumental Neoclassical square in the Old Town, famous for its vibrant atmosphere and exquisite pintxos bars.",
        "desc": "Plaza Nueva è il cuore monumentale del Casco Viejo di Bilbao, o Città Vecchia, e offre un'atmosfera vibrante ricca di storia e tradizione culinaria. Costruita in un rigoroso stile neoclassico, la piazza fu completata nel 1851 dopo decenni di pianificazione. È interamente circondata da eleganti edifici porticati, che storicamente ospitavano il governo locale e ora accolgono alcune delle taverne tradizionali più famose della città. La piazza è la destinazione ideale per vivere la tradizione basca del \"txikiteo\", spostandosi da un bar all'altro per assaggiare squisiti pintxos abbinati al vino locale. La domenica, la piazza si trasforma in un vivace mercato di collezionisti dove la gente del posto scambia monete, francobolli e libri. Con il suo ambiente spazioso e pedonale, è un luogo fantastico per le famiglie per rilassarsi immergendosi nell'autentica cultura locale.",
        "descEN": "Plaza Nueva is the monumental heart of Bilbao's Casco Viejo, or Old Town, offering a vibrant atmosphere steeped in history and culinary tradition. Constructed in a rigorous Neoclassical style, the square was completed in 1851 after decades of planning. It is entirely enclosed by elegant arcaded buildings, which historically housed the local government and now shelter some of the city's most famous traditional taverns. The square is the ultimate destination for experiencing the Basque tradition of \"txikiteo,\" moving from bar to bar to sample exquisite pintxos paired with local wine. On Sundays, the plaza transforms into a bustling collector's market where locals trade coins, stamps, and books. With its spacious, car-free environment, it is a fantastic spot for families to relax while soaking in the authentic local culture and gastronomy.",
        "tips": "Visita la sera per la migliore esperienza di pintxos, o la domenica mattina per il tradizionale mercato dei collezionisti.",
        "tipsEN": "Visit in the evening for the best pintxos experience, or on Sunday morning for the traditional collector's market.",
        "src": [
          "Wikipedia \"Plaza Nueva (Bilbao)\"",
          "bilbaoturismo.net"
        ],
        "maps": "https://maps.google.com/?q=43.25950,-2.92320"
      },
      {
        "id": "bil-5",
        "name": "Mercado de la Ribera",
        "nameEN": "Mercado de la Ribera",
        "cat": "cibo",
        "lat": 43.2565,
        "lng": -2.9244,
        "short": "Il più grande mercato coperto d'Europa, con un design Art Déco e una vivace area gastro-bar per degustazioni.",
        "shortEN": "Europe's largest covered food market, featuring an Art Deco design and a lively gastro-bar area for tasting local flavors.",
        "desc": "Situato sulle rive del fiume Nervión, il Mercado de la Ribera è uno spettacolare tempio della gastronomia e una pietra miliare della vita quotidiana di Bilbao. Progettata dall'architetto Pedro Ispizua e costruita nel 1929, questa monumentale struttura in stile Art Déco presenta magnifiche vetrate e vasti spazi aperti inondati di luce naturale. Riconosciuto dal Guinness dei Primati nel 1990 come il più grande mercato alimentare coperto d'Europa, si estende su ben 10.000 metri quadrati. All'interno, i visitatori troveranno una vivace varietà di bancarelle che vendono i prodotti locali, i frutti di mare e le carni più fresche. Recentemente rinnovato, il mercato include ora una vivace area gastro-bar dove è possibile gustare specialità basche preparate al momento ascoltando musica jazz dal vivo. È la tappa finale perfetta per assaporare i sapori autentici di Bilbao.",
        "descEN": "Situated on the banks of the Nervión River, the Mercado de la Ribera is a spectacular temple of gastronomy and a cornerstone of Bilbao's daily life. Designed by architect Pedro Ispizua and built in 1929, this monumental Art Deco structure features magnificent stained-glass windows and vast open spaces flooded with natural light. Recognized by the Guinness World Records in 1990 as the largest covered food market in Europe, it spans an impressive 10,000 square meters. Inside, visitors will find a vibrant array of stalls selling the freshest local produce, seafood, and meats. Recently renovated, the market now includes a lively gastro-bar area where you can taste freshly prepared Basque specialties while enjoying live jazz music. It is the perfect final stop to savor the authentic flavors and vibrant energy of Bilbao.",
        "tips": "Le bancarelle chiudono nel pomeriggio, ma i gastro-bar restano aperti fino a tardi. Situato in Erribera Kalea.",
        "tipsEN": "Market stalls close in the afternoon, but the gastro-bars remain open until late. Located at Erribera Kalea.",
        "src": [
          "Wikipedia \"Ribera Market\"",
          "mercadodelaribera.biz"
        ],
        "maps": "https://maps.google.com/?q=43.25650,-2.92440"
      }
    ]
  },
  "genova": {
    "city": "Genova",
    "cityEN": "Genoa",
    "country": "Italia",
    "countryEN": "Italy",
    "flag": "🇮🇹",
    "intro": "Scopri il fascino di Genova, una storica città portuale dove stretti vicoli medievali incontrano magnifici palazzi rinascimentali. Questo itinerario a piedi ti guida attraverso il cuore marittimo e culturale della Superba.",
    "introEN": "Discover the charm of Genoa, a historic port city where narrow medieval alleyways meet magnificent Renaissance palaces. This walking itinerary guides you through the maritime and cultural heart of La Superba.",
    "center": [
      44.4095,
      8.931
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "gen-1",
        "name": "Acquario di Genova",
        "nameEN": "Aquarium of Genoa",
        "cat": "kids",
        "lat": 44.4102,
        "lng": 8.92655,
        "short": "Tuffati nella vita marina nel più grande acquario d'Italia, una spettacolare attrazione per famiglie nel porto storico.",
        "shortEN": "Dive into marine life at Italy's largest aquarium, a spectacular family-friendly attraction in the historic port.",
        "desc": "L'Acquario di Genova è il più grande acquario d'Italia e uno dei più estesi in Europa, rappresentando una meta ideale per le famiglie. Fu originariamente costruito per l'Expo '92 di Genova, un'esposizione internazionale che celebrava il 500º anniversario del viaggio dell'esploratore genovese Cristoforo Colombo verso le Americhe. Progettata dall'architetto vincitore del Premio Pritzker Renzo Piano, la struttura ricorda una nave pronta a salpare dallo storico Porto Antico. All'interno, i visitatori possono esplorare oltre 70 vasche che ospitano migliaia di specie marine, tra cui delfini, squali, pinguini e lamantini. Le esposizioni sono progettate per replicare gli habitat naturali, dal Mar Mediterraneo agli oceani tropicali. Offre un'esperienza educativa immersiva sulla conservazione marina, affascinando sia i bambini che gli adulti e sottolineando il profondo legame storico di Genova con il mare.",
        "descEN": "The Aquarium of Genoa is the largest aquarium in Italy and one of the most extensive in Europe, making it a perfect family-friendly destination. It was originally built for the Genoa Expo '92, an international exhibition celebrating the 500th anniversary of the Genoese explorer Christopher Columbus's voyage to the Americas. Designed by Pritzker Prize-winning architect Renzo Piano, the structure resembles a ship ready to set sail from the historic Porto Antico. Inside, visitors can explore over 70 tanks housing thousands of marine species, including dolphins, sharks, penguins, and manatees. The exhibits are designed to replicate natural habitats from the Mediterranean Sea to tropical oceans. It offers an immersive educational experience about marine conservation, captivating both children and adults while highlighting Genoa's deep historical connection to the sea.",
        "tips": "Prenota i biglietti online in anticipo per saltare le code. Calcola almeno 2-3 ore per la visita.",
        "tipsEN": "Book tickets online in advance to skip the lines. Allow at least 2-3 hours for the visit.",
        "src": [
          "Wikipedia \"Aquarium of Genoa\"",
          "acquariodigenova.it"
        ],
        "maps": "https://maps.google.com/?q=44.41020,8.92655"
      },
      {
        "id": "gen-2",
        "name": "Cattedrale di San Lorenzo",
        "nameEN": "Genoa Cathedral",
        "cat": "cultura",
        "lat": 44.40766,
        "lng": 8.93151,
        "short": "Ammira la suggestiva facciata in bianco e nero della cattedrale principale di Genova, custode di reliquie sacre.",
        "shortEN": "Admire the striking black-and-white facade of Genoa's main cathedral, home to sacred relics and medieval art.",
        "desc": "La Cattedrale di Genova, dedicata a San Lorenzo, è la chiesa più importante della città e uno splendido esempio di architettura medievale. Consacrata nel 1118 da Papa Gelasio II, l'edificio presenta una suggestiva facciata gotica a strisce bianche e nere, simbolo tradizionale di nobiltà nella Repubblica Genovese. L'interno della cattedrale è un affascinante mix di stili romanico e gotico, adornato con magnifici affreschi e sculture intricate. Sotto la chiesa si trova il Museo del Tesoro, che custodisce reliquie sacre, tra cui il Sacro Catino, a lungo ritenuto il Santo Graal, e le ceneri di San Giovanni Battista, patrono della città. Un notevole reperto storico all'interno della cattedrale è un proiettile perforante britannico inesploso, risalente a un bombardamento navale della Seconda Guerra Mondiale nel 1941, esposto come simbolo di miracolosa sopravvivenza.",
        "descEN": "The Genoa Cathedral, dedicated to Saint Lawrence, is the most important church in the city and a stunning example of medieval architecture. Consecrated in 1118 by Pope Gelasius II, the building features a striking black and white striped Gothic facade, a traditional symbol of nobility in the Genoese Republic. The cathedral's interior is a fascinating blend of Romanesque and Gothic styles, adorned with magnificent frescoes and intricate sculptures. Below the church lies the Treasury Museum, which houses sacred relics, including the Holy Chalice, long believed to be the Holy Grail, and the ashes of Saint John the Baptist, the city's patron saint. A remarkable historical artifact inside the cathedral is an unexploded British armor-piercing shell from a naval bombardment during World War II in 1941, which is displayed as a symbol of miraculous survival.",
        "tips": "L'ingresso alla chiesa è gratuito, ma è richiesto un abbigliamento modesto. Il Museo del Tesoro richiede un piccolo biglietto.",
        "tipsEN": "Entry to the church is free, but modest dress is required. The Treasury Museum requires a small fee.",
        "src": [
          "Wikipedia \"Genoa Cathedral\"",
          "museidigenova.it"
        ],
        "maps": "https://maps.google.com/?q=44.40766,8.93151"
      },
      {
        "id": "gen-3",
        "name": "Piazza De Ferrari",
        "nameEN": "Piazza De Ferrari",
        "cat": "attivita",
        "lat": 44.40718,
        "lng": 8.93398,
        "short": "Vivi il cuore pulsante di Genova in questa piazza monumentale, famosa per l'iconica fontana in bronzo e l'architettura storica.",
        "shortEN": "Experience the vibrant heart of Genoa at this monumental square, famous for its iconic bronze fountain and historic architecture.",
        "desc": "Piazza De Ferrari è la vivace piazza principale di Genova, fungendo da cuore commerciale e finanziario della città. La piazza è immediatamente riconoscibile per la sua iconica fontana monumentale in bronzo, progettata dall'architetto Giuseppe Crosa di Vergagni e inaugurata nel 1936. Circondata da magnifici edifici storici, la piazza mostra la grandezza del passato di Genova e la sua transizione verso una metropoli moderna. I principali punti di riferimento che costeggiano la piazza includono l'elegante Teatro Carlo Felice, il principale teatro dell'opera della città ricostruito dopo la Seconda Guerra Mondiale, e l'imponente Palazzo della Borsa, l'ex borsa valori costruita all'inizio del XX secolo. La piazza collega gli stretti vicoli medievali del centro storico con le strade più ampie ed eleganti della città moderna, rendendola un perfetto punto di ritrovo e uno snodo centrale per esplorare Genova.",
        "descEN": "Piazza De Ferrari is the vibrant main square of Genoa, serving as the commercial and financial heart of the city. The square is instantly recognizable by its iconic monumental bronze fountain, which was designed by architect Giuseppe Crosa di Vergagni and inaugurated in 1936. Surrounded by magnificent historical buildings, the piazza showcases the grandeur of Genoa's past and its transition into a modern metropolis. Key landmarks bordering the square include the elegant Teatro Carlo Felice, the city's principal opera house rebuilt after World War II, and the imposing Palazzo della Borsa, the former stock exchange built in the early 20th century. The square connects the historic center's narrow medieval alleyways with the wider, elegant streets of the modern city, making it a perfect gathering spot and a central hub for exploring Genoa's diverse architectural heritage.",
        "tips": "Un ottimo posto per scattare foto e fare una rapida pausa caffè in uno dei caffè storici vicini.",
        "tipsEN": "A great spot for photos and a quick coffee break at one of the nearby historic cafes.",
        "src": [
          "Wikipedia \"Piazza De Ferrari\"",
          "visitgenoa.it"
        ],
        "maps": "https://maps.google.com/?q=44.40718,8.93398"
      },
      {
        "id": "gen-4",
        "name": "Via Garibaldi e Palazzi dei Rolli",
        "nameEN": "Via Garibaldi and Palazzi dei Rolli",
        "cat": "cultura",
        "lat": 44.41144,
        "lng": 8.93222,
        "short": "Passeggia tra magnifici palazzi rinascimentali in questa strada patrimonio UNESCO, che mostra l'immensa ricchezza del Secolo d'Oro genovese.",
        "shortEN": "Stroll past magnificent Renaissance palaces on this UNESCO-listed street, showcasing the immense wealth of Genoa's Golden Age.",
        "desc": "Via Garibaldi è una delle strade più belle d'Europa, rinomata per la sua straordinaria collezione di palazzi rinascimentali e barocchi. Originariamente tracciata negli anni 1550 come \"Strada Maggiore\", fu progettata per ospitare le famiglie aristocratiche più ricche della Repubblica Genovese. Nel 2006, la strada e le sue magnifiche residenze, note come Palazzi dei Rolli, sono state designate Patrimonio dell'Umanità UNESCO. Questi palazzi facevano storicamente parte di un sistema di alloggi pubblici in cui le famiglie nobili venivano estratte a sorte per ospitare dignitari e reali in visita. Oggi, molti di questi splendidi edifici, tra cui Palazzo Rosso, Palazzo Bianco e Palazzo Tursi, fungono da musei pubblici. I visitatori possono passeggiare lungo questa elegante strada pedonale per ammirare le facciate riccamente decorate, i cortili nascosti e le spettacolari collezioni d'arte che riflettono l'immensa ricchezza del Secolo d'Oro genovese.",
        "descEN": "Via Garibaldi is one of the most beautiful streets in Europe, renowned for its extraordinary collection of Renaissance and Baroque palaces. Originally laid out in the 1550s as \"Strada Maggiore,\" it was designed to house the wealthiest aristocratic families of the Genoese Republic. In 2006, the street and its magnificent residences, known as the Palazzi dei Rolli, were designated as a UNESCO World Heritage site. These palaces were historically part of a public lodging system where noble families were chosen by lottery to host visiting dignitaries and royalty. Today, several of these stunning buildings, including Palazzo Rosso, Palazzo Bianco, and Palazzo Tursi, function as public museums. Visitors can stroll down this elegant pedestrian street to admire the lavishly decorated facades, hidden courtyards, and spectacular art collections that reflect the immense wealth of Genoa's Golden Age.",
        "tips": "Visita i Musei di Strada Nuova per vedere gli interni di Palazzo Rosso, Bianco e Tursi con un solo biglietto.",
        "tipsEN": "Visit the Musei di Strada Nuova to see the interiors of Palazzo Rosso, Bianco, and Tursi with one ticket.",
        "src": [
          "UNESCO \"Genoa: Le Strade Nuove and the system of the Palazzi dei Rolli\"",
          "Wikipedia \"Via Garibaldi (Genoa)\""
        ],
        "maps": "https://maps.google.com/?q=44.41144,8.93222"
      },
      {
        "id": "gen-5",
        "name": "Spianata Castelletto",
        "nameEN": "Spianata Castelletto",
        "cat": "panorama",
        "lat": 44.41295,
        "lng": 8.9328,
        "short": "Prendi uno storico ascensore in stile Liberty fino a questa terrazza panoramica per viste mozzafiato sulla città e sul mare.",
        "shortEN": "Ride a historic Art Nouveau elevator to this scenic terrace for breathtaking panoramic views of the city and sea.",
        "desc": "Spianata Castelletto è un magnifico belvedere sopraelevato che offre le viste panoramiche più mozzafiato sull'intera città di Genova. Originariamente sede di una fortezza strategica smantellata nel 1849 per evitare che venisse usata contro i cittadini, l'area fu poi trasformata in una bellissima terrazza pubblica. Per raggiungere questo spettacolare punto panoramico, i visitatori possono prendere un affascinante ascensore pubblico in stile Liberty, noto come Ascensore Castelletto Levante, inaugurato nel 1909 e celebre per essere stato elogiato in una poesia del poeta italiano Giorgio Caproni. Dalla terrazza alberata si può godere di una splendida vista a 360 gradi che abbraccia l'esteso centro storico con i suoi tetti in ardesia, il vivace porto, l'iconica Lanterna e lo scintillante Mar Mediterraneo. È il luogo perfetto per ammirare il tramonto e concludere un tour a piedi della città.",
        "descEN": "Spianata Castelletto is a magnificent elevated belvedere that offers the most breathtaking panoramic views over the entire city of Genoa. Originally the site of a strategic fortress that was dismantled in 1849 to prevent it from being used against the citizens, the area was later transformed into a beautiful public terrace. To reach this spectacular viewpoint, visitors can take a charming Art Nouveau public elevator, known as Ascensore Castelletto Levante, which was inaugurated in 1909 and famously celebrated in a poem by the Italian poet Giorgio Caproni. From the tree-lined terrace, you can enjoy a stunning 360-degree vista that encompasses the sprawling historic center with its slate roofs, the bustling port, the iconic Lanterna lighthouse, and the sparkling Mediterranean Sea. It is the perfect spot to watch the sunset and conclude a walking tour.",
        "tips": "L'ascensore costa quanto un normale biglietto dell'autobus AMT. Da visitare preferibilmente al tramonto per una luce spettacolare.",
        "tipsEN": "The elevator costs a standard AMT bus ticket fare. Best visited at sunset for spectacular lighting.",
        "src": [
          "Wikipedia \"Spianata Castelletto\"",
          "visitgenoa.it"
        ],
        "maps": "https://maps.google.com/?q=44.41295,8.93280"
      }
    ]
  }
};

  // Expose globally (consistent with the app's other data modules)
  window.CITY_ITINERARIES = CITY_ITINERARIES;
})();
