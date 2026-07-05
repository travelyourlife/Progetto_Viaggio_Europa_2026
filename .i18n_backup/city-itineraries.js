/* =====================================================================
 * city-itineraries.js  —  Quo Vadis
 * ---------------------------------------------------------------------
 * In-depth, Vilnius-style walking itineraries for the trip's main cities.
 *
 * Each city is an ordered list of stops with LONG bilingual (IT + EN)
 * descriptions sourced ONLY from real references (cited in `src`).
 *
 * Cities (trip order): Leoben, Vienna, Warsaw, Vilnius, Riga, Tallinn, Rovaniemi, Oulu, Tromsø, Trondheim, Stavanger, Kristiansand, Bergen, Copenhagen, Bremen, Amiens, San Sebastián, Bilbao, León, Palencia, Genoa.
 *
 * NOTE: This file is data-only. Rendering + map live in city-itineraries-ui.js.
 * ===================================================================== */
(function () {
  'use strict';
  var CITY_ITINERARIES = {
  "leoben": {
    "city": "Leoben",
    "cityEN": "Leoben",
    "country": "Austria",
    "countryEN": "Austria",
    "flag": "🇦🇹",
    "intro": "Scopri Leoben, il cuore industriale e storico della Stiria, situato lungo le rive del fiume Mur. Questo itinerario a piedi ti porterà attraverso piazze affascinanti, antiche abbazie e la ricca tradizione birraria della città.",
    "introEN": "Discover Leoben, the industrial and historic heart of Styria, situated along the banks of the Mur River. This walking itinerary will take you through charming squares, ancient abbeys, and the city's rich brewing tradition.",
    "center": [
      47.3767,
      15.0931
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 1,
        "id": "leo-1",
        "name": "Hauptplatz",
        "nameEN": "Hauptplatz",
        "cat": "cultura",
        "lat": 47.38046,
        "lng": 15.09476,
        "short": "La piazza principale di Leoben, circondata da edifici storici e monumenti.",
        "shortEN": "Leoben's main square, surrounded by historic buildings and monuments.",
        "desc": "L'Hauptplatz è il cuore pulsante di Leoben, risalente al Medioevo. Questa spaziosa piazza pedonale è fiancheggiata da eleganti edifici storici, tra cui il Vecchio Municipio e la Colonna della Trinità (Pestsäule). È il luogo ideale per iniziare l'esplorazione della città, godendosi l'atmosfera locale nei numerosi caffè all'aperto.",
        "descEN": "Hauptplatz is the beating heart of Leoben, dating back to the Middle Ages. This spacious pedestrian square is lined with elegant historic buildings, including the Old Town Hall and the Trinity Column (Pestsäule). It is the ideal place to start exploring the city, enjoying the local atmosphere in the numerous outdoor cafes.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Hauptplatz (Leoben)",
          "TripAdvisor: Hauptplatz"
        ],
        "maps": "https://maps.google.com/?q=47.38046,15.09476"
      },
      {
        "tier": 2,
        "id": "leo-2",
        "name": "Schwammerlturm",
        "nameEN": "Schwammerlturm",
        "cat": "cultura",
        "lat": 47.37999,
        "lng": 15.09258,
        "short": "Una torre medievale iconica con un caratteristico tetto a forma di fungo.",
        "shortEN": "An iconic medieval tower with a distinctive mushroom-shaped roof.",
        "desc": "Lo Schwammerlturm, o 'Torre del Fungo', è il simbolo più famoso di Leoben. Alta circa 30 metri, questa torre medievale faceva parte delle antiche fortificazioni cittadine. Il suo nome deriva dal tetto a cupola aggiunto nel XVII secolo, che ricorda un fungo. I visitatori possono salire in cima per godere di una vista panoramica sulla città e sul fiume Mur.",
        "descEN": "The Schwammerlturm, or 'Mushroom Tower', is Leoben's most famous landmark. Standing about 30 meters tall, this medieval tower was part of the ancient city fortifications. Its name comes from the dome roof added in the 17th century, which resembles a mushroom. Visitors can climb to the top to enjoy a panoramic view of the city and the Mur River.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Schwammerlturm",
          "Leoben Tourism: Schwammerlturm"
        ],
        "maps": "https://maps.google.com/?q=47.37999,15.09258"
      },
      {
        "tier": 1,
        "id": "leo-3",
        "name": "MuseumsCenter Leoben",
        "nameEN": "MuseumsCenter Leoben",
        "cat": "cultura",
        "lat": 47.3807,
        "lng": 15.09167,
        "short": "Un museo che esplora la ricca storia e la cultura industriale della regione.",
        "shortEN": "A museum exploring the rich history and industrial culture of the region.",
        "desc": "Situato nel KulturQuartier, il MuseumsCenter Leoben offre un affascinante viaggio attraverso 1100 anni di storia della città. Le esposizioni si concentrano in particolare sull'industria mineraria e metallurgica che ha plasmato la regione. Il complesso ospita anche la Kunsthalle, che presenta mostre d'arte contemporanea. L'ingresso costa circa 3,50 euro.",
        "descEN": "Located in the KulturQuartier, the MuseumsCenter Leoben offers a fascinating journey through 1100 years of city history. The exhibitions focus particularly on the mining and metallurgical industry that shaped the region. The complex also houses the Kunsthalle, which features contemporary art exhibitions. Admission is approximately 3.50 euros.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: MuseumsCenter Leoben",
          "KulturQuartier Leoben Official Site"
        ],
        "maps": "https://maps.google.com/?q=47.3807,15.09167"
      },
      {
        "tier": 1,
        "id": "leo-4",
        "name": "Pfarrkirche Leoben-St. Xaver",
        "nameEN": "St. Xaver Parish Church",
        "cat": "cultura",
        "lat": 47.38079,
        "lng": 15.09251,
        "short": "Una magnifica chiesa ex-gesuita con un imponente interno barocco.",
        "shortEN": "A magnificent former Jesuit church with an impressive Baroque interior.",
        "desc": "La chiesa parrocchiale di San Francesco Saverio è un capolavoro dell'architettura barocca, costruita tra il 1660 e il 1665. Originariamente una chiesa gesuita, domina il centro storico con la sua facciata a due torri. L'interno è riccamente decorato e si è conservato quasi intatto dal XVII secolo, offrendo un'atmosfera di grandiosa spiritualità.",
        "descEN": "The Parish Church of St. Francis Xavier is a masterpiece of Baroque architecture, built between 1660 and 1665. Originally a Jesuit church, it dominates the historic center with its twin-tower facade. The interior is richly decorated and has been preserved almost intact since the 17th century, offering an atmosphere of grandiose spirituality.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Pfarrkirche Leoben-St. Xaver",
          "Visit A City: Parish Church Leoben-St. Xaver"
        ],
        "maps": "https://maps.google.com/?q=47.38079,15.09251"
      },
      {
        "tier": 1,
        "id": "leo-5",
        "name": "Gösser Braumuseum",
        "nameEN": "Gösser Brewery Museum",
        "cat": "cibo",
        "lat": 47.36138,
        "lng": 15.09388,
        "short": "Scopri la storia della birra austriaca più famosa in questo museo interattivo.",
        "shortEN": "Discover the history of Austria's most famous beer in this interactive museum.",
        "desc": "Il Gösser Braumuseum, situato nel quartiere di Göss, celebra la lunga tradizione birraria di Leoben, che risale al 1010. Il museo offre un'esperienza interattiva sulla produzione della birra Gösser, una delle più amate in Austria. Le visite guidate, che costano circa 10 euro, includono spesso una degustazione finale. Si consiglia di prenotare in anticipo.",
        "descEN": "The Gösser Braumuseum, located in the Göss district, celebrates Leoben's long brewing tradition, which dates back to 1010. The museum offers an interactive experience on the production of Gösser beer, one of the most beloved in Austria. Guided tours, which cost around 10 euros, often include a final tasting. It is recommended to book in advance.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "TripAdvisor: Gösser Braumuseum",
          "Gösser Official Site"
        ],
        "maps": "https://maps.google.com/?q=47.36138,15.09388"
      },
      {
        "id": "leo-6",
        "name": "Eggenwald'sches Gartenhaus",
        "nameEN": "Eggenwald'sches Gartenhaus",
        "cat": "cultura",
        "lat": 47.378281,
        "lng": 15.097676,
        "short": "L'edificio storico dove fu firmato il Trattato di Leoben nel 1797.",
        "shortEN": "The historic building where the Treaty of Leoben was signed in 1797.",
        "desc": "L'Eggenwald'sches Gartenhaus è un edificio storico di grande importanza per Leoben e per l'Europa. In questo edificio a un piano in stile classico, Napoleone Bonaparte e i diplomatici austriaci negoziarono e firmarono il Trattato di Pace preliminare di Leoben il 18 aprile 1797. L'edificio si distingue per la sua elegante scalinata esterna e la sua architettura sobria ma imponente. Rappresenta un pezzo fondamentale della storia europea conservato nel cuore della Stiria.",
        "descEN": "The Eggenwald'sches Gartenhaus is a historic building of great importance for Leoben and Europe. In this classical one-story building, Napoleon Bonaparte and Austrian diplomats negotiated and signed the preliminary Peace Treaty of Leoben on April 18, 1797. The building is distinguished by its elegant outdoor staircase and its sober yet imposing architecture. It represents a fundamental piece of European history preserved in the heart of Styria.",
        "tips": "Situato in Mühltaler Straße, è facilmente raggiungibile a piedi dal centro.",
        "tipsEN": "Located on Mühltaler Straße, it is easily accessible on foot from the center.",
        "src": [
          "Leoben Sightseeing",
          "Wikipedia"
        ],
        "maps": "https://maps.google.com/?q=47.378281,15.097676"
      },
      {
        "id": "leo-7",
        "name": "Evangelische Gustav Adolf Kirche",
        "nameEN": "Evangelische Gustav Adolf Kirche",
        "cat": "cultura",
        "lat": 47.381666,
        "lng": 15.093077,
        "short": "Una chiesa protestante con una guglia imponente e bellissime vetrate.",
        "shortEN": "A Protestant church with an imposing spire and beautiful stained glass windows.",
        "desc": "La Chiesa Evangelica Gustav Adolf è un punto di riferimento visivo a Leoben, grazie alla sua imponente guglia visibile dalla piazza principale. L'interno della chiesa è caratterizzato da un design spartano che crea un affascinante contrasto con le elaborate vetrate colorate. Questo luogo di culto rappresenta un'importante testimonianza della comunità protestante nella regione. La sua architettura semplice ma elegante invita alla riflessione e alla contemplazione.",
        "descEN": "The Evangelical Gustav Adolf Church is a visual landmark in Leoben, thanks to its imposing spire visible from the main square. The interior of the church is characterized by a spartan design that creates a fascinating contrast with the elaborate stained glass windows. This place of worship represents an important testimony of the Protestant community in the region. Its simple yet elegant architecture invites reflection and contemplation.",
        "tips": "Aperta per le funzioni religiose e le visite durante il giorno.",
        "tipsEN": "Open for religious services and visits during the day.",
        "src": [
          "Leoben Sightseeing"
        ],
        "maps": "https://maps.google.com/?q=47.381666,15.093077"
      },
      {
        "id": "leo-8",
        "name": "Freimannsturm",
        "nameEN": "Freimannsturm",
        "cat": "cultura",
        "lat": 47.37878,
        "lng": 15.09386,
        "short": "Una torre storica che faceva parte delle fortificazioni medievali della città.",
        "shortEN": "A historic tower that was part of the city's medieval fortifications.",
        "desc": "Il Freimannsturm è una torre storica che faceva parte delle fortificazioni medievali di Leoben. Caratterizzata da un possente tetto piramidale, un fregio a dentelli e merlature a forma di buco della serratura, la torre è un eccellente esempio di architettura militare del tardo Medioevo. La sua struttura robusta testimonia l'importanza strategica della città nel passato. Oggi, la torre si erge come un affascinante promemoria della ricca storia di Leoben.",
        "descEN": "The Freimannsturm is a historic tower that was part of the medieval fortifications of Leoben. Characterized by a massive pyramidal roof, a dentil frieze, and keyhole battlements, the tower is an excellent example of late medieval military architecture. Its robust structure testifies to the strategic importance of the city in the past. Today, the tower stands as a fascinating reminder of Leoben's rich history.",
        "tips": "Visibile dall'esterno, si trova in Krottendorfergasse.",
        "tipsEN": "Visible from the outside, located in Krottendorfergasse.",
        "src": [
          "Leoben Sightseeing",
          "Mapcarta"
        ],
        "maps": "https://maps.google.com/?q=47.37878,15.09386"
      },
      {
        "id": "leo-9",
        "name": "Gärner Park",
        "nameEN": "Gärner Park",
        "cat": "natura",
        "lat": 47.381198,
        "lng": 15.094455,
        "short": "Un parco storico con un monumento dedicato alle vittime del fascismo.",
        "shortEN": "A historic park with a monument dedicated to the victims of fascism.",
        "desc": "Il Gärner Park è un'oasi verde inaugurata nel 1892 per celebrare il completamento della prima fase di costruzione nel quartiere Josefee. Il parco offre un ambiente sereno per passeggiate e relax, con alberi secolari e sentieri ben curati. All'interno del parco si trova anche un monumento antifascista eretto in omaggio alle vittime di Leoben tra il 1939 e il 1945. È un luogo perfetto per una pausa tranquilla durante l'esplorazione della città.",
        "descEN": "Gärner Park is a green oasis inaugurated in 1892 to celebrate the completion of the first construction phase in the Josefee district. The park offers a serene environment for walks and relaxation, with ancient trees and well-kept paths. Inside the park, there is also an anti-fascist monument erected in tribute to the victims from Leoben between 1939 and 1945. It is a perfect place for a quiet break while exploring the city.",
        "tips": "Ideale per una passeggiata rilassante o un picnic.",
        "tipsEN": "Ideal for a relaxing walk or a picnic.",
        "src": [
          "Leoben Sightseeing"
        ],
        "maps": "https://maps.google.com/?q=47.381198,15.094455"
      },
      {
        "id": "leo-10",
        "name": "Jakobikirche",
        "nameEN": "Jakobikirche",
        "cat": "cultura",
        "lat": 47.37709,
        "lng": 15.097615,
        "short": "Una chiesa storica con un impressionante interno barocco e uno splendido pulpito.",
        "shortEN": "A historic church with an impressive baroque interior and a splendid pulpit.",
        "desc": "La Jakobikirche, o Chiesa di San Giacomo, è una storica chiesa cittadina con radici che risalgono al XII secolo. L'interno barocco è particolarmente impressionante, dominato dallo splendido pulpito realizzato dallo scultore barocco Matthäus Krenauer. La chiesa offre un'atmosfera di profonda spiritualità e bellezza artistica. È un luogo di grande importanza storica e religiosa per la comunità di Leoben.",
        "descEN": "The Jakobikirche, or St. James Church, is a historic city church with roots dating back to the 12th century. The baroque interior is particularly impressive, dominated by the splendid pulpit created by the baroque sculptor Matthäus Krenauer. The church offers an atmosphere of deep spirituality and artistic beauty. It is a place of great historical and religious importance for the Leoben community.",
        "tips": "Situata in Maßenbergstraße, merita una visita per il suo pulpito barocco.",
        "tipsEN": "Located on Maßenbergstraße, it is worth a visit for its baroque pulpit.",
        "src": [
          "Leoben Sightseeing",
          "Mapy.com"
        ],
        "maps": "https://maps.google.com/?q=47.37709,15.097615"
      },
      {
        "tier": 1,
        "id": "leo-11",
        "name": "Maßenburg",
        "nameEN": "Maßenburg",
        "cat": "panorama",
        "lat": 47.37241,
        "lng": 15.10871,
        "short": "Rovine di un castello medievale che offrono una vista panoramica sulla città.",
        "shortEN": "Ruins of a medieval castle offering a panoramic view of the city.",
        "desc": "La Maßenburg è un'imponente rovina di un castello situata sulla collina di Maßenberg, che domina la città di Leoben. Costruito originariamente alla fine del XIII secolo, il castello fu in gran parte ridotto in macerie nel 1820. Oggi, l'area offre un'attraente piattaforma panoramica da cui si può godere di una magnifica vista su Leoben e sulle montagne circostanti. È una meta popolare per escursioni e passeggiate panoramiche.",
        "descEN": "The Maßenburg is an impressive castle ruin located on the Maßenberg hill, overlooking the city of Leoben. Originally built in the late 13th century, the castle was largely reduced to rubble in 1820. Today, the area offers an attractive viewing platform from which you can enjoy a magnificent view of Leoben and the surrounding mountains. It is a popular destination for hikes and scenic walks.",
        "tips": "Raggiungibile tramite un sentiero escursionistico, ideale per ammirare il tramonto.",
        "tipsEN": "Accessible via a hiking trail, ideal for watching the sunset.",
        "src": [
          "Leoben Sightseeing",
          "Steiermark.com"
        ],
        "maps": "https://maps.google.com/?q=47.37241,15.10871"
      },
      {
        "id": "leo-12",
        "name": "Montanuniversität",
        "nameEN": "Montanuniversität",
        "cat": "cultura",
        "lat": 47.38556,
        "lng": 15.09305,
        "short": "Una prestigiosa università specializzata in ingegneria mineraria e metallurgia.",
        "shortEN": "A prestigious university specializing in mining engineering and metallurgy.",
        "desc": "La Montanuniversität è un'università specializzata di fama mondiale situata a Leoben. Fondata nel 1835 come 'Scuola corporativa stiriana delle miniere', l'istituzione ha una lunga e orgogliosa storia nel campo dell'ingegneria mineraria e della metallurgia. L'imponente edificio principale dell'università è un punto di riferimento architettonico della città. L'università attira migliaia di studenti internazionali, contribuendo all'atmosfera vivace e cosmopolita di Leoben.",
        "descEN": "The Montanuniversität is a world-renowned specialized university located in Leoben. Founded in 1835 as the 'Styrian Corporate School of Mining', the institution has a long and proud history in the fields of mining engineering and metallurgy. The imposing main building of the university is an architectural landmark of the city. The university attracts thousands of international students, contributing to the lively and cosmopolitan atmosphere of Leoben.",
        "tips": "Ammira l'architettura dell'edificio principale situato in Franz Josef-Straße.",
        "tipsEN": "Admire the architecture of the main building located on Franz Josef-Straße.",
        "src": [
          "Leoben Sightseeing",
          "Wikipedia"
        ],
        "maps": "https://maps.google.com/?q=47.38556,15.09305"
      },
      {
        "id": "leo-13",
        "name": "Parish church \"Maria am Waasen\"",
        "nameEN": "Parish church \"Maria am Waasen\"",
        "cat": "cultura",
        "lat": 47.377108,
        "lng": 15.090907,
        "short": "Una magnifica chiesa gotica con notevoli vetrate nel coro.",
        "shortEN": "A magnificent Gothic church with remarkable stained glass windows in the choir.",
        "desc": "La chiesa parrocchiale 'Maria am Waasen' è un primo esempio di architettura gotica in Stiria. È l'edificio più alto e una delle chiese più antiche di Leoben. Particolarmente notevoli sono le finestre del coro che raffigurano scene della vita di Gesù, vari santi e figure dei donatori della chiesa. Questa magnifica struttura offre un'esperienza spirituale e visiva indimenticabile per i visitatori.",
        "descEN": "The parish church 'Maria am Waasen' is a prime example of Gothic architecture in Styria. It is the tallest building and one of the oldest churches in Leoben. Particularly remarkable are the choir windows depicting scenes from the life of Jesus, various saints, and figures of the church's donors. This magnificent structure offers an unforgettable spiritual and visual experience for visitors.",
        "tips": "Prenditi del tempo per ammirare le dettagliate vetrate gotiche.",
        "tipsEN": "Take some time to admire the detailed Gothic stained glass windows.",
        "src": [
          "Leoben Sightseeing",
          "Wikimedia Commons"
        ],
        "maps": "https://maps.google.com/?q=47.377108,15.090907"
      },
      {
        "id": "leo-14",
        "name": "Peter Tunner-Park",
        "nameEN": "Peter Tunner-Park",
        "cat": "natura",
        "lat": 47.38277,
        "lng": 15.09289,
        "short": "Un tranquillo parco cittadino con monumenti dedicati a figure storiche locali.",
        "shortEN": "A quiet city park with monuments dedicated to local historical figures.",
        "desc": "Il Peter Tunner-Park è una piccola e curata oasi urbana situata nel centro di Leoben. Il parco ospita una scultura del famoso 'Montanista' Peter Tunner, oltre a busti dell'Arciduca Giovanni e dello scrittore stiriano Peter Rosegger. Con i suoi sentieri tranquilli e le aree verdi, offre un rifugio perfetto dal trambusto cittadino. È un luogo ideale per rilassarsi e godersi un momento di pace all'aria aperta.",
        "descEN": "The Peter Tunner-Park is a small, well-kept urban oasis located in the center of Leoben. The park features a sculpture of the famous 'Montanist' Peter Tunner, as well as busts of Archduke Johann and the Styrian writer Peter Rosegger. With its quiet paths and green areas, it offers a perfect retreat from the hustle and bustle of the city. It is an ideal place to relax and enjoy a moment of peace outdoors.",
        "tips": "Un ottimo posto per una breve pausa durante la visita della città.",
        "tipsEN": "A great spot for a short break while touring the city.",
        "src": [
          "Leoben Sightseeing",
          "Airial.Travel"
        ],
        "maps": "https://maps.google.com/?q=47.38277,15.09289"
      },
      {
        "id": "leo-15",
        "name": "Redemptorist Church",
        "nameEN": "Redemptorist Church",
        "cat": "cultura",
        "lat": 47.377036,
        "lng": 15.0928,
        "short": "Una suggestiva chiesa neo-romanica dedicata a Sant'Alfonso de' Liguori.",
        "shortEN": "A striking neo-Romanesque church dedicated to St. Alphonsus Liguori.",
        "desc": "La Chiesa dei Redentoristi, dedicata a Sant'Alfonso de' Liguori, è una delle fondazioni più recenti di Leoben. Costruita in stile neo-romanico, la sua facciata occidentale con una singola torre è particolarmente impressionante. L'interno della chiesa è spazioso e accogliente, offrendo un luogo di preghiera e riflessione per la comunità locale. La sua architettura distintiva la rende un'aggiunta interessante al paesaggio religioso della città.",
        "descEN": "The Redemptorist Church, dedicated to St. Alphonsus Liguori, is one of Leoben's most recent foundations. Built in the neo-Romanesque style, its west facade featuring a single tower is particularly impressive. The interior of the church is spacious and welcoming, offering a place of prayer and reflection for the local community. Its distinctive architecture makes it an interesting addition to the city's religious landscape.",
        "tips": "Situata in Gösser Straße, è facilmente riconoscibile per la sua torre singola.",
        "tipsEN": "Located on Gösser Straße, it is easily recognizable by its single tower.",
        "src": [
          "Leoben Sightseeing",
          "Tripadvisor"
        ],
        "maps": "https://maps.google.com/?q=47.377036,15.0928"
      },
      {
        "id": "leo-16",
        "name": "Bergmannsbrunnen",
        "nameEN": "Bergmannsbrunnen",
        "cat": "cultura",
        "lat": 47.379816,
        "lng": 15.095013,
        "short": "Una fontana dedicata alla tradizione mineraria della regione.",
        "shortEN": "A fountain dedicated to the region's mining tradition.",
        "desc": "Il Bergmannsbrunnen, o Fontana del Minatore, è un monumento situato nella piazza principale di Leoben che rende omaggio alla lunga tradizione mineraria della regione. La fontana presenta una statua di un minatore in abiti tradizionali, simbolo dell'importanza dell'industria estrattiva per lo sviluppo economico e culturale della città. È un'opera d'arte significativa che celebra il duro lavoro e la dedizione dei minatori locali.",
        "descEN": "The Bergmannsbrunnen, or Miner's Fountain, is a monument located in the main square of Leoben that pays tribute to the region's long mining tradition. The fountain features a statue of a miner in traditional clothing, a symbol of the importance of the mining industry to the economic and cultural development of the city. It is a significant work of art that celebrates the hard work and dedication of local miners.",
        "tips": "Ammira i dettagli della statua del minatore sulla piazza principale.",
        "tipsEN": "Admire the details of the miner statue on the main square.",
        "src": [
          "Wikidata",
          "Wikimedia Commons"
        ],
        "maps": "https://maps.google.com/?q=47.379816,15.095013"
      }
    ]
  },
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 1,
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
      },
      {
        "tier": 1,
        "id": "vie-6",
        "name": "Wiener Staatsoper",
        "nameEN": "Wiener Staatsoper",
        "cat": "cultura",
        "lat": 48.203,
        "lng": 16.3691,
        "short": "Uno dei teatri d'opera più prestigiosi al mondo, simbolo della capitale della musica.",
        "shortEN": "One of the most prestigious opera houses in the world, a symbol of the capital of music.",
        "desc": "L'Opera di Stato di Vienna è uno dei teatri d'opera più importanti e rinomati al mondo, inaugurato nel 1869 con il Don Giovanni di Mozart. L'edificio neorinascimentale fu in gran parte distrutto durante la Seconda Guerra Mondiale e meticolosamente ricostruito per restituirgli l'antico splendore. Oggi offre un programma vario con produzioni di altissimo livello, ospitando i migliori cantanti e direttori d'orchestra internazionali. Inoltre, una volta all'anno il teatro si trasforma per ospitare il celebre e sfarzoso Ballo dell'Opera.",
        "descEN": "The Vienna State Opera is one of the most important and renowned opera houses in the world, inaugurated in 1869 with Mozart's Don Giovanni. The Neo-Renaissance building was largely destroyed during World War II and meticulously rebuilt to restore its former glory. Today, it offers a diverse program with top-tier productions, hosting the best international singers and conductors. Furthermore, once a year the theater transforms to host the famous and lavish Opera Ball.",
        "tips": "Prenota i biglietti con largo anticipo o prova ad acquistare i biglietti per i posti in piedi poco prima dello spettacolo.",
        "tipsEN": "Book tickets well in advance or try to get standing room tickets shortly before the performance.",
        "src": [
          "Wikipedia: Vienna State Opera",
          "Official Website: wiener-staatsoper.at"
        ],
        "maps": "https://maps.google.com/?q=48.203,16.3691"
      },
      {
        "tier": 1,
        "id": "vie-7",
        "name": "Albertina",
        "nameEN": "Albertina",
        "cat": "cultura",
        "lat": 48.2047,
        "lng": 16.3681,
        "short": "Un magnifico museo d'arte con capolavori da Monet a Picasso e splendide sale asburgiche.",
        "shortEN": "A magnificent art museum featuring masterpieces from Monet to Picasso and splendid Habsburg staterooms.",
        "desc": "L'Albertina è un museo d'arte situato nel cuore di Vienna, che ospita una delle più grandi e importanti collezioni di stampe e disegni al mondo. Situato in un ex palazzo residenziale asburgico, il museo presenta capolavori che vanno da Monet a Picasso, oltre a mostre temporanee di grande rilievo. Le sontuose sale di rappresentanza offrono anche uno spaccato della vita aristocratica del passato, con arredi originali e decorazioni sfarzose. È una tappa imperdibile per gli amanti dell'arte che visitano la capitale austriaca.",
        "descEN": "The Albertina is an art museum in the heart of Vienna, housing one of the largest and most important print rooms in the world. Located in a former Habsburg residential palace, the museum features masterpieces ranging from Monet to Picasso, alongside major temporary exhibitions. The sumptuous staterooms also offer a glimpse into aristocratic life of the past, with original furnishings and lavish decorations. It is an unmissable stop for art lovers visiting the Austrian capital.",
        "tips": "Aperto tutti i giorni; la visita alle sale di rappresentanza è inclusa nel biglietto d'ingresso.",
        "tipsEN": "Open daily; the visit to the staterooms is included in the admission ticket.",
        "src": [
          "Wikipedia: Albertina",
          "Official Website: albertina.at"
        ],
        "maps": "https://maps.google.com/?q=48.2047,16.3681"
      },
      {
        "tier": 2,
        "id": "vie-8",
        "name": "Kunsthistorisches Museum",
        "nameEN": "Kunsthistorisches Museum",
        "cat": "cultura",
        "lat": 48.2038,
        "lng": 16.3618,
        "short": "Il principale museo d'arte di Vienna, che custodisce le vaste collezioni imperiali degli Asburgo.",
        "shortEN": "Vienna's premier art museum, housing the vast imperial collections of the Habsburgs.",
        "desc": "Il Kunsthistorisches Museum è il più grande museo d'arte dell'Austria, commissionato dall'imperatore Francesco Giuseppe per ospitare le formidabili collezioni imperiali. L'edificio stesso è un capolavoro architettonico, con interni sfarzosi, marmi pregiati e una magnifica cupola ottagonale. Al suo interno si possono ammirare opere inestimabili di artisti come Bruegel il Vecchio, Tiziano, Velázquez e Rubens. Il museo vanta inoltre una vasta e affascinante collezione di antichità egizie e greco-romane.",
        "descEN": "The Kunsthistorisches Museum is the largest art museum in Austria, commissioned by Emperor Franz Joseph to house the formidable imperial collections. The building itself is an architectural masterpiece, with lavish interiors, fine marbles, and a magnificent octagonal dome. Inside, visitors can admire priceless works by artists such as Bruegel the Elder, Titian, Velázquez, and Rubens. The museum also boasts a vast and fascinating collection of Egyptian and Greco-Roman antiquities.",
        "tips": "Il caffè sotto la cupola è uno dei più belli di Vienna, perfetto per una pausa elegante.",
        "tipsEN": "The cafe under the dome is one of the most beautiful in Vienna, perfect for an elegant break.",
        "src": [
          "Wikipedia: Kunsthistorisches Museum",
          "Official Website: khm.at"
        ],
        "maps": "https://maps.google.com/?q=48.2038,16.3618"
      },
      {
        "tier": 1,
        "id": "vie-9",
        "name": "Museumsquartier",
        "nameEN": "Museumsquartier",
        "cat": "cultura",
        "lat": 48.2033,
        "lng": 16.3581,
        "short": "Un vasto e vivace polo culturale che unisce arte moderna, musei e spazi ricreativi all'aperto.",
        "shortEN": "A vast and lively cultural hub combining modern art, museums, and outdoor recreational spaces.",
        "desc": "Il Museumsquartier è uno dei complessi culturali più grandi del mondo, situato negli spazi delle ex scuderie imperiali. Unisce sapientemente un'architettura barocca a edifici moderni e ospita istituzioni di rilievo come il Leopold Museum e il MUMOK. I suoi ampi cortili sono diventati un vivace punto di ritrovo per i viennesi e i turisti. Grazie ai famosi divani colorati chiamati 'Enzi' e ai numerosi caffè, l'area offre un'atmosfera rilassata e creativa.",
        "descEN": "The Museumsquartier is one of the largest cultural complexes in the world, located in the former imperial stables. It cleverly combines Baroque architecture with modern buildings and houses major institutions like the Leopold Museum and MUMOK. Its spacious courtyards have become a lively gathering place for both the Viennese and tourists. Thanks to the famous colorful loungers called 'Enzi' and numerous cafes, the area offers a relaxed and creative atmosphere.",
        "tips": "L'ingresso ai cortili è gratuito; ottimo posto per rilassarsi all'aperto durante la bella stagione.",
        "tipsEN": "Entry to the courtyards is free; a great place to relax outdoors during good weather.",
        "src": [
          "Wikipedia: Museumsquartier",
          "Official Website: mqw.at"
        ],
        "maps": "https://maps.google.com/?q=48.2033,16.3581"
      },
      {
        "id": "vie-10",
        "name": "Rathaus",
        "nameEN": "Rathaus",
        "cat": "cultura",
        "lat": 48.2106,
        "lng": 16.3583,
        "short": "Il maestoso municipio neogotico di Vienna, fulcro di eventi e festival cittadini.",
        "shortEN": "Vienna's majestic Neo-Gothic city hall, a hub for city events and festivals.",
        "desc": "Il Rathaus è il maestoso municipio di Vienna, un imponente edificio in stile neogotico progettato da Friedrich von Schmidt e completato nel 1883. La sua facciata è dominata da cinque torri, la centrale delle quali è sormontata dalla statua del Rathausmann, uno dei simboli indiscussi della città. Gli interni sono altrettanto spettacolari, con ampie sale da ballo e cortili porticati. La piazza antistante ospita eventi tutto l'anno, tra cui il famoso mercatino di Natale e il festival del cinema all'aperto in estate.",
        "descEN": "The Rathaus is Vienna's majestic city hall, an imposing Neo-Gothic building designed by Friedrich von Schmidt and completed in 1883. Its facade is dominated by five towers, the central one topped by the Rathausmann statue, an undisputed symbol of the city. The interiors are equally spectacular, featuring large ballrooms and arcaded courtyards. The square in front hosts events year-round, including the famous Christmas market and the open-air film festival in summer.",
        "tips": "Sono disponibili visite guidate gratuite in determinati giorni della settimana.",
        "tipsEN": "Free guided tours are available on certain days of the week.",
        "src": [
          "Wikipedia: Vienna City Hall",
          "wien.gv.at"
        ],
        "maps": "https://maps.google.com/?q=48.2106,16.3583"
      },
      {
        "id": "vie-11",
        "name": "Parlament",
        "nameEN": "Parlament",
        "cat": "cultura",
        "lat": 48.2082,
        "lng": 16.3586,
        "short": "Un imponente edificio neoclassico ispirato all'antica Grecia, sede del governo austriaco.",
        "shortEN": "An imposing Neoclassical building inspired by ancient Greece, seat of the Austrian government.",
        "desc": "Il Parlamento austriaco è un magnifico edificio in stile neoclassico, progettato dall'architetto Theophil Hansen per richiamare l'antica Grecia, culla della democrazia. Davanti all'ingresso principale si erge la monumentale fontana di Pallade Atena, dea della saggezza, che accoglie i visitatori con la sua imponenza. L'edificio ospita le due camere del parlamento austriaco ed è il cuore pulsante della politica nazionale. Recentemente è stato sottoposto a un vasto restauro per modernizzarne gli interni e renderli più accessibili al pubblico.",
        "descEN": "The Austrian Parliament Building is a magnificent Neoclassical structure, designed by architect Theophil Hansen to evoke ancient Greece, the cradle of democracy. In front of the main entrance stands the monumental Pallas Athena fountain, goddess of wisdom, welcoming visitors with its grandeur. The building houses the two chambers of the Austrian parliament and is the beating heart of national politics. It recently underwent an extensive renovation to modernize its interiors and make them more accessible to the public.",
        "tips": "Il centro visitatori è stato recentemente rinnovato e offre interessanti mostre interattive.",
        "tipsEN": "The visitor center has been recently renovated and offers interesting interactive exhibitions.",
        "src": [
          "Wikipedia: Austrian Parliament Building",
          "parlament.gv.at"
        ],
        "maps": "https://maps.google.com/?q=48.2082,16.3586"
      },
      {
        "id": "vie-12",
        "name": "Peterskirche",
        "nameEN": "Peterskirche",
        "cat": "cultura",
        "lat": 48.2094,
        "lng": 16.37,
        "short": "Una splendida chiesa barocca nel cuore di Vienna, nota per i suoi interni sfarzosi e i concerti.",
        "shortEN": "A splendid Baroque church in the heart of Vienna, known for its lavish interiors and concerts.",
        "desc": "La Peterskirche è una delle chiese più antiche di Vienna, sebbene l'attuale struttura barocca risalga all'inizio del XVIII secolo. Ispirata alla Basilica di San Pietro a Roma, presenta un interno riccamente decorato con stucchi dorati, affreschi spettacolari e un magnifico altare maggiore. La cura dei dettagli e la ricchezza dei materiali la rendono un vero gioiello nascosto tra le vie del centro. La chiesa è famosa anche per la sua eccellente acustica e ospita regolarmente concerti d'organo e di musica classica.",
        "descEN": "Peterskirche is one of the oldest churches in Vienna, although the current Baroque structure dates back to the early 18th century. Inspired by St. Peter's Basilica in Rome, it features a richly decorated interior with gilded stucco, spectacular frescoes, and a magnificent high altar. The attention to detail and the richness of the materials make it a true hidden gem in the city center. The church is also famous for its excellent acoustics and regularly hosts organ and classical music concerts.",
        "tips": "I concerti d'organo pomeridiani sono spesso gratuiti (è gradita un'offerta).",
        "tipsEN": "Afternoon organ concerts are often free (donations are appreciated).",
        "src": [
          "Wikipedia: Peterskirche, Vienna",
          "peterskirche.at"
        ],
        "maps": "https://maps.google.com/?q=48.2094,16.37"
      },
      {
        "id": "vie-13",
        "name": "Graben & Pestsäule",
        "nameEN": "Graben & Pestsäule",
        "cat": "cultura",
        "lat": 48.2087,
        "lng": 16.3698,
        "short": "Un'elegante via pedonale dominata dalla monumentale Colonna della Peste barocca.",
        "shortEN": "An elegant pedestrian street dominated by the monumental Baroque Plague Column.",
        "desc": "Il Graben è una delle strade più famose ed eleganti del centro di Vienna, fiancheggiata da splendidi palazzi storici e negozi di lusso. Al centro di questa vivace via pedonale si erge la Pestsäule, una colonna della peste in stile barocco. Fu eretta dall'imperatore Leopoldo I in segno di ringraziamento per la fine della devastante epidemia del 1679. Questo capolavoro scultoreo, ricco di dettagli dorati e figure allegoriche, rappresenta la fede trionfante sulla malattia.",
        "descEN": "The Graben is one of the most famous and elegant streets in central Vienna, lined with beautiful historic buildings and luxury shops. In the middle of this lively pedestrian street stands the Pestsäule, a Baroque plague column. It was erected by Emperor Leopold I in gratitude for the end of the devastating 1679 epidemic. This sculptural masterpiece, rich in gilded details and allegorical figures, represents faith triumphing over disease.",
        "tips": "Ottima zona per lo shopping di lusso e per ammirare l'architettura viennese sorseggiando un caffè.",
        "tipsEN": "Great area for luxury shopping and admiring Viennese architecture while sipping a coffee.",
        "src": [
          "Wikipedia: Graben, Vienna",
          "Wikipedia: Plague Column, Vienna"
        ],
        "maps": "https://maps.google.com/?q=48.2087,16.3698"
      },
      {
        "id": "vie-14",
        "name": "Spanische Hofreitschule",
        "nameEN": "Spanische Hofreitschule",
        "cat": "attivita",
        "lat": 48.2075,
        "lng": 16.3666,
        "short": "La storica scuola di equitazione dove i famosi cavalli Lipizzani si esibiscono in un'arena barocca.",
        "shortEN": "The historic riding school where famous Lipizzan horses perform in a Baroque arena.",
        "desc": "La Scuola di Equitazione Spagnola è l'unica istituzione al mondo che conserva e coltiva l'arte equestre classica nella tradizione dell'Alta Scuola fin dal Rinascimento. Situata nel vasto complesso dell'Hofburg, offre spettacoli indimenticabili che attirano visitatori da tutto il mondo. Durante le esibizioni, i magnifici stalloni Lipizzani eseguono complessi movimenti a tempo di musica classica con incredibile eleganza. L'arena invernale barocca in cui si tengono gli spettacoli è di una bellezza mozzafiato e aggiunge magia all'esperienza.",
        "descEN": "The Spanish Riding School is the only institution in the world that has preserved and cultivated classical equestrian art in the Haute École tradition since the Renaissance. Located in the vast Hofburg complex, it offers unforgettable performances that attract visitors from all over the world. During the shows, magnificent Lipizzan stallions execute complex movements to classical music with incredible elegance. The Baroque Winter Riding School where performances are held is breathtakingly beautiful and adds magic to the experience.",
        "tips": "Se i biglietti per gli spettacoli sono esauriti, è possibile assistere all'addestramento mattutino a un prezzo inferiore.",
        "tipsEN": "If performance tickets are sold out, you can watch the morning training sessions for a lower price.",
        "src": [
          "Wikipedia: Spanish Riding School",
          "srs.at"
        ],
        "maps": "https://maps.google.com/?q=48.2075,16.3666"
      },
      {
        "id": "vie-15",
        "name": "Österreichische Nationalbibliothek",
        "nameEN": "Österreichische Nationalbibliothek",
        "cat": "cultura",
        "lat": 48.206,
        "lng": 16.3665,
        "short": "Una biblioteca barocca mozzafiato, considerata una delle più belle al mondo.",
        "shortEN": "A breathtaking Baroque library, considered one of the most beautiful in the world.",
        "desc": "La Sala di Rappresentanza (Prunksaal) della Biblioteca Nazionale Austriaca è senza dubbio una delle biblioteche storiche più belle del mondo. Costruita nel XVIII secolo per volere dell'imperatore Carlo VI, questa sala barocca lunga quasi 80 metri lascia i visitatori senza fiato. È decorata con magnifici affreschi sul soffitto, imponenti colonne e statue in marmo a grandezza naturale. Custodisce oltre 200.000 volumi antichi, tra cui la preziosa collezione del principe Eugenio di Savoia, in un'atmosfera magica e solenne.",
        "descEN": "The State Hall (Prunksaal) of the Austrian National Library is undoubtedly one of the most beautiful historic libraries in the world. Built in the 18th century under Emperor Charles VI, this nearly 80-meter-long Baroque hall leaves visitors breathless. It is decorated with magnificent ceiling frescoes, imposing columns, and life-size marble statues. It houses over 200,000 ancient volumes, including the precious collection of Prince Eugene of Savoy, in a magical and solemn atmosphere.",
        "tips": "L'ingresso si trova in Josefsplatz; la fotografia senza flash è solitamente consentita.",
        "tipsEN": "The entrance is located at Josefsplatz; photography without flash is usually allowed.",
        "src": [
          "Wikipedia: Austrian National Library",
          "onb.ac.at"
        ],
        "maps": "https://maps.google.com/?q=48.206,16.3665"
      },
      {
        "id": "vie-16",
        "name": "Stadtpark",
        "nameEN": "Stadtpark",
        "cat": "natura",
        "lat": 48.205,
        "lng": 16.38,
        "short": "Un bellissimo parco pubblico famoso per il monumento dorato a Johann Strauss.",
        "shortEN": "A beautiful public park famous for the gilded monument to Johann Strauss.",
        "desc": "Lo Stadtpark è un'oasi verde nel centro di Vienna, inaugurato nel 1862 come primo parco pubblico della città. È diviso in due dal fiume Wien e presenta un romantico design in stile paesaggistico inglese, con ampi prati e laghetti. Il parco è famoso per le sue numerose statue dedicate a musicisti e artisti viennesi che hanno fatto la storia. Tra queste spicca il celebre monumento dorato dedicato a Johann Strauss figlio, che è diventato uno dei luoghi più fotografati della capitale.",
        "descEN": "The Stadtpark is a green oasis in the center of Vienna, opened in 1862 as the city's first public park. It is divided in two by the Wien River and features a romantic English landscape design, with wide lawns and small lakes. The park is famous for its numerous statues dedicated to Viennese musicians and artists who made history. Among these stands out the famous gilded monument dedicated to Johann Strauss II, which has become one of the most photographed spots in the capital.",
        "tips": "Perfetto per una passeggiata rilassante; ospita anche il Kursalon, dove si tengono concerti di valzer.",
        "tipsEN": "Perfect for a relaxing stroll; it also houses the Kursalon, where waltz concerts are held.",
        "src": [
          "Wikipedia: Stadtpark, Vienna",
          "wien.gv.at"
        ],
        "maps": "https://maps.google.com/?q=48.205,16.38"
      },
      {
        "id": "vie-17",
        "name": "Volksgarten",
        "nameEN": "Volksgarten",
        "cat": "natura",
        "lat": 48.208,
        "lng": 16.3615,
        "short": "Un elegante giardino storico noto per il suo magnifico roseto e il monumento all'imperatrice Sissi.",
        "shortEN": "An elegant historic garden known for its magnificent rose garden and the monument to Empress Sisi.",
        "desc": "Il Volksgarten è un elegante parco pubblico situato lungo la Ringstraße, originariamente concepito come giardino privato per gli arciduchi asburgici. È rinomato in tutto il mondo per il suo splendido roseto, che ospita centinaia di varietà diverse di rose. In primavera ed estate, il giardino esplode in un tripudio di colori e profumi, offrendo uno spettacolo naturale indimenticabile. All'interno del parco si trovano anche il Tempio di Teseo, in stile neoclassico, e il suggestivo monumento dedicato all'amata imperatrice Sissi.",
        "descEN": "The Volksgarten is an elegant public park located along the Ringstraße, originally designed as a private garden for the Habsburg archdukes. It is renowned worldwide for its stunning rose garden, which houses hundreds of different varieties of roses. In spring and summer, the garden bursts into a riot of colors and scents, offering an unforgettable natural spectacle. The park also features the Neoclassical Theseus Temple and the poignant monument dedicated to the beloved Empress Sisi.",
        "tips": "Visitalo tra maggio e giugno per vedere le rose in piena fioritura.",
        "tipsEN": "Visit between May and June to see the roses in full bloom.",
        "src": [
          "Wikipedia: Volksgarten, Vienna",
          "wien.gv.at"
        ],
        "maps": "https://maps.google.com/?q=48.208,16.3615"
      },
      {
        "tier": 2,
        "id": "vie-18",
        "name": "Schloss Belvedere",
        "nameEN": "Schloss Belvedere",
        "cat": "cultura",
        "lat": 48.1915,
        "lng": 16.3809,
        "short": "Un magnifico palazzo barocco che ospita la celebre opera 'Il Bacio' di Gustav Klimt.",
        "shortEN": "A magnificent Baroque palace housing Gustav Klimt's famous painting 'The Kiss'.",
        "desc": "Il Palazzo del Belvedere è uno straordinario complesso barocco costruito come residenza estiva per il grande condottiero principe Eugenio di Savoia. Il Belvedere Superiore, con la sua architettura imponente e i giardini terrazzati decorati con fontane e sfingi, è un capolavoro assoluto. Oggi le sue sale ospitano un'importante collezione d'arte austriaca che copre dal Medioevo ai giorni nostri. L'attrazione principale per i visitatori è la più grande collezione al mondo di dipinti di Gustav Klimt, tra cui il celeberrimo capolavoro 'Il Bacio'.",
        "descEN": "The Belvedere Palace is an extraordinary Baroque complex built as a summer residence for the great military commander Prince Eugene of Savoy. The Upper Belvedere, with its imposing architecture and terraced gardens decorated with fountains and sphinxes, is an absolute masterpiece. Today, its halls house an important collection of Austrian art ranging from the Middle Ages to the present day. The main attraction for visitors is the world's largest collection of paintings by Gustav Klimt, including his famous masterpiece 'The Kiss'.",
        "tips": "Acquista i biglietti online per evitare le lunghe code all'ingresso del Belvedere Superiore.",
        "tipsEN": "Buy tickets online to avoid long queues at the entrance of the Upper Belvedere.",
        "src": [
          "Wikipedia: Belvedere, Vienna",
          "belvedere.at"
        ],
        "maps": "https://maps.google.com/?q=48.1915,16.3809"
      },
      {
        "tier": 1,
        "id": "vie-19",
        "name": "Hundertwasserhaus",
        "nameEN": "Hundertwasserhaus",
        "cat": "cultura",
        "lat": 48.2077,
        "lng": 16.3928,
        "short": "Un eccentrico e colorato edificio residenziale che fonde arte, architettura e natura.",
        "shortEN": "An eccentric and colorful residential building that blends art, architecture, and nature.",
        "desc": "La Hundertwasserhaus è un complesso residenziale unico e colorato, progettato dall'eccentrico artista e architetto austriaco Friedensreich Hundertwasser. L'edificio si distingue nettamente dal paesaggio urbano per le sue facciate asimmetriche, i colori vivaci e i pavimenti volutamente ondulati. Una caratteristica fondamentale è la vegetazione lussureggiante che cresce sui tetti e sporge dai balconi, integrando la natura nella struttura. L'opera rappresenta una forte ribellione contro l'architettura moderna standardizzata e un inno all'armonia tra uomo e ambiente.",
        "descEN": "The Hundertwasserhaus is a unique and colorful residential complex designed by the eccentric Austrian artist and architect Friedensreich Hundertwasser. The building stands out sharply from the urban landscape with its asymmetrical facades, bright colors, and deliberately undulating floors. A key feature is the lush vegetation growing on the roofs and protruding from the balconies, integrating nature into the structure. The work represents a strong rebellion against standardized modern architecture and an ode to the harmony between humans and the environment.",
        "tips": "Essendo un edificio residenziale, l'interno non è visitabile, ma l'adiacente Hundertwasser Village offre un'esperienza simile.",
        "tipsEN": "As it is a residential building, the interior cannot be visited, but the adjacent Hundertwasser Village offers a similar experience.",
        "src": [
          "Wikipedia: Hundertwasserhaus",
          "hundertwasser-haus.info"
        ],
        "maps": "https://maps.google.com/?q=48.2077,16.3928"
      },
      {
        "tier": 1,
        "id": "vie-20",
        "name": "Wiener Prater & Riesenrad",
        "nameEN": "Wiener Prater & Riesenrad",
        "cat": "panorama",
        "lat": 48.2166,
        "lng": 16.3959,
        "short": "Il celebre parco divertimenti di Vienna, dominato dalla storica ruota panoramica del 1897.",
        "shortEN": "Vienna's famous amusement park, dominated by the historic 1897 giant Ferris wheel.",
        "desc": "Il Prater è un vasto parco pubblico di Vienna, famoso soprattutto per il suo parco divertimenti storico noto come Wurstelprater. Il simbolo indiscusso dell'area è la Riesenrad, la ruota panoramica gigante costruita nel 1897 in occasione del giubileo dell'imperatore. Dalle sue tradizionali cabine in legno si può godere di una vista spettacolare e romantica su tutta la città. Oltre alle giostre e alle attrazioni, il Prater comprende ampi viali alberati e boschi tranquilli, ideali per lunghe passeggiate e gite in bicicletta.",
        "descEN": "The Prater is a vast public park in Vienna, most famous for its historic amusement park known as the Wurstelprater. The undisputed symbol of the area is the Riesenrad, the giant Ferris wheel built in 1897 for the emperor's jubilee. From its traditional wooden cabins, visitors can enjoy a spectacular and romantic view over the entire city. Beyond the rides and attractions, the Prater includes wide tree-lined avenues and quiet woods, ideal for long walks and cycling trips.",
        "tips": "L'ingresso al parco è gratuito; si paga solo per le singole attrazioni.",
        "tipsEN": "Entry to the park is free; you only pay for individual attractions.",
        "src": [
          "Wikipedia: Prater",
          "praterwien.com"
        ],
        "maps": "https://maps.google.com/?q=48.2166,16.3959"
      },
      {
        "id": "vie-21",
        "name": "Wiener Secession",
        "nameEN": "Wiener Secession",
        "cat": "cultura",
        "lat": 48.2003,
        "lng": 16.3658,
        "short": "Il simbolo dell'Art Nouveau viennese, noto per la sua cupola dorata e il Fregio di Beethoven di Klimt.",
        "shortEN": "The symbol of Viennese Art Nouveau, known for its golden dome and Klimt's Beethoven Frieze.",
        "desc": "Il Palazzo della Secessione è un capolavoro dell'Art Nouveau viennese, costruito nel 1898 come manifesto architettonico del movimento artistico guidato da Gustav Klimt. L'edificio è inconfondibile grazie alla sua suggestiva cupola sferica formata da foglie di alloro dorate, affettuosamente chiamata 'il cavolo d'oro' dai viennesi. Le pareti esterne bianche sono decorate con delicati motivi floreali e maschere di gorgoni. Al piano interrato è esposto in modo permanente il celebre Fregio di Beethoven, un'opera monumentale e affascinante realizzata da Klimt.",
        "descEN": "The Secession Building is a masterpiece of Viennese Art Nouveau, built in 1898 as the architectural manifesto of the art movement led by Gustav Klimt. The building is unmistakable thanks to its striking spherical dome made of golden laurel leaves, affectionately called 'the golden cabbage' by the Viennese. The white exterior walls are decorated with delicate floral motifs and gorgon masks. The basement permanently houses the famous Beethoven Frieze, a monumental and fascinating work created by Klimt.",
        "tips": "Il motto del movimento, 'A ogni tempo la sua arte, all'arte la sua libertà', è inciso sopra l'ingresso.",
        "tipsEN": "The movement's motto, 'To every age its art, to every art its freedom,' is inscribed above the entrance.",
        "src": [
          "Wikipedia: Secession Building",
          "secession.at"
        ],
        "maps": "https://maps.google.com/?q=48.2003,16.3658"
      },
      {
        "id": "vie-22",
        "name": "Votivkirche",
        "nameEN": "Votivkirche",
        "cat": "cultura",
        "lat": 48.2155,
        "lng": 16.3598,
        "short": "Una maestosa chiesa neogotica costruita per ringraziare della salvezza dell'imperatore.",
        "shortEN": "A majestic Neo-Gothic church built to give thanks for the emperor's survival.",
        "desc": "La Votivkirche, o Chiesa Votiva, è uno dei più importanti e imponenti edifici neogotici del mondo, situata lungo la celebre Ringstraße. Fu commissionata dall'arciduca Ferdinando Massimiliano come ringraziamento a Dio per il fallito attentato alla vita di suo fratello, l'imperatore Francesco Giuseppe, nel 1853. Le sue due torri gemelle traforate, alte ben 99 metri, dominano il paesaggio circostante. All'interno, le splendide vetrate colorate e le alte volte a coste la rendono una delle chiese più suggestive e luminose di Vienna.",
        "descEN": "The Votivkirche, or Votive Church, is one of the most important and imposing Neo-Gothic buildings in the world, located along the famous Ringstraße. It was commissioned by Archduke Ferdinand Maximilian in gratitude to God for the failed assassination attempt on his brother, Emperor Franz Joseph, in 1853. Its two pierced twin towers, standing 99 meters tall, dominate the surrounding landscape. Inside, the stunning stained glass windows and high ribbed vaults make it one of Vienna's most striking and luminous churches.",
        "tips": "L'interno è spesso tranquillo e meno affollato rispetto ad altre chiese del centro.",
        "tipsEN": "The interior is often quiet and less crowded compared to other churches in the center.",
        "src": [
          "Wikipedia: Votivkirche, Vienna",
          "votivkirche.at"
        ],
        "maps": "https://maps.google.com/?q=48.2155,16.3598"
      },
      {
        "id": "vie-23",
        "name": "Karmelitermarkt",
        "nameEN": "Karmelitermarkt",
        "cat": "cibo",
        "lat": 48.2173,
        "lng": 16.3756,
        "short": "Un mercato storico e autentico, perfetto per scoprire i sapori locali lontano dalle folle turistiche.",
        "shortEN": "A historic and authentic market, perfect for discovering local flavors away from tourist crowds.",
        "desc": "Il Karmelitermarkt è uno dei mercati più antichi e autentici di Vienna, situato nel vivace quartiere di Leopoldstadt, a breve distanza dal centro. Meno turistico del Naschmarkt, offre un'atmosfera rilassata e un'eccellente selezione di prodotti freschi, formaggi, carni e specialità regionali. Negli ultimi anni, l'area circostante è diventata un punto di ritrovo alla moda, ricca di caffè accoglienti e ristoranti innovativi. È il luogo ideale per assaporare la vera vita quotidiana viennese e gustare ottimo cibo locale.",
        "descEN": "The Karmelitermarkt is one of the oldest and most authentic markets in Vienna, located in the lively Leopoldstadt district, a short distance from the center. Less touristy than the Naschmarkt, it offers a relaxed atmosphere and an excellent selection of fresh produce, cheeses, meats, and regional specialties. In recent years, the surrounding area has become a trendy gathering spot, full of cozy cafes and innovative restaurants. It is the ideal place to experience true Viennese daily life and enjoy great local food.",
        "tips": "Visitalo il sabato mattina, quando i contadini locali portano i loro prodotti freschi e l'atmosfera è più vivace.",
        "tipsEN": "Visit on Saturday morning, when local farmers bring their fresh produce and the atmosphere is liveliest.",
        "src": [
          "Wikipedia: Karmelitermarkt",
          "wien.info"
        ],
        "maps": "https://maps.google.com/?q=48.2173,16.3756"
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 1,
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
      },
      {
        "tier": 2,
        "id": "war-6",
        "name": "Palace of Culture and Science",
        "nameEN": "Palace of Culture and Science",
        "cat": "panorama",
        "lat": 52.231838,
        "lng": 21.005995,
        "short": "Grattacielo iconico di epoca sovietica con una spettacolare terrazza panoramica.",
        "shortEN": "Iconic Soviet-era skyscraper featuring a spectacular observation deck.",
        "desc": "Il Palazzo della Cultura e della Scienza è l'edificio più alto della Polonia, un dono dell'Unione Sovietica alla nazione. Offre una terrazza panoramica al 30° piano con viste mozzafiato su tutta Varsavia. Al suo interno ospita teatri, cinema, musei e uffici. È un simbolo controverso ma iconico della capitale polacca.",
        "descEN": "The Palace of Culture and Science is the tallest building in Poland, originally a gift from the Soviet Union. It features an observation deck on the 30th floor offering breathtaking views over all of Warsaw. Inside, it houses theaters, cinemas, museums, and offices. It remains a controversial yet iconic symbol of the Polish capital.",
        "tips": "La terrazza panoramica è aperta tutti i giorni; i biglietti possono essere acquistati online per evitare code.",
        "tipsEN": "The observation deck is open daily; tickets can be bought online to avoid queues.",
        "src": [
          "Wikipedia: Palace of Culture and Science",
          "warsawtour.pl"
        ],
        "maps": "https://maps.google.com/?q=52.231838,21.005995"
      },
      {
        "tier": 1,
        "id": "war-7",
        "name": "Krakowskie Przedmieście",
        "nameEN": "Krakowskie Przedmieście",
        "cat": "cultura",
        "lat": 52.241667,
        "lng": 21.015278,
        "short": "Elegante viale storico che fa parte della famosa Via Reale di Varsavia.",
        "shortEN": "Elegant historic avenue forming part of Warsaw's famous Royal Route.",
        "desc": "Krakowskie Przedmieście è una delle strade più prestigiose e storiche di Varsavia, parte della Via Reale. È fiancheggiata da palazzi storici, chiese eleganti e monumenti importanti, tra cui il Palazzo Presidenziale e l'Università di Varsavia. La strada è un vivace centro culturale, perfetto per passeggiare e ammirare l'architettura.",
        "descEN": "Krakowskie Przedmieście is one of the most prestigious and historic streets in Warsaw, forming part of the Royal Route. It is lined with historic palaces, elegant churches, and important monuments, including the Presidential Palace and Warsaw University. The street is a vibrant cultural hub, perfect for strolling and admiring the architecture.",
        "tips": "Ottima per una passeggiata serale quando gli edifici sono splendidamente illuminati.",
        "tipsEN": "Great for an evening stroll when the buildings are beautifully illuminated.",
        "src": [
          "Wikipedia: Krakowskie Przedmieście"
        ],
        "maps": "https://maps.google.com/?q=52.241667,21.015278"
      },
      {
        "id": "war-8",
        "name": "Presidential Palace",
        "nameEN": "Presidential Palace",
        "cat": "cultura",
        "lat": 52.243056,
        "lng": 21.015278,
        "short": "Residenza ufficiale del Presidente polacco, ricca di storia e architettura neoclassica.",
        "shortEN": "Official residence of the Polish President, rich in history and neoclassical architecture.",
        "desc": "Il Palazzo Presidenziale è il più grande palazzo di Varsavia e la residenza ufficiale del Presidente della Polonia. Costruito nel XVII secolo, ha ospitato numerosi eventi storici cruciali, tra cui la firma del Patto di Varsavia. La sua facciata neoclassica e il monumento al principe Józef Poniatowski antistante sono imperdibili.",
        "descEN": "The Presidential Palace is the largest palace in Warsaw and the official residence of the President of Poland. Built in the 17th century, it has hosted numerous crucial historical events, including the signing of the Warsaw Pact. Its neoclassical facade and the monument to Prince Józef Poniatowski in front are must-sees.",
        "tips": "L'interno non è generalmente aperto al pubblico, ma la facciata merita una foto.",
        "tipsEN": "The interior is generally not open to the public, but the facade is worth a photo.",
        "src": [
          "Wikipedia: Presidential Palace, Warsaw"
        ],
        "maps": "https://maps.google.com/?q=52.243056,21.015278"
      },
      {
        "id": "war-9",
        "name": "Holy Cross Church",
        "nameEN": "Holy Cross Church",
        "cat": "cultura",
        "lat": 52.238611,
        "lng": 21.0175,
        "short": "Splendida chiesa barocca che custodisce il cuore di Fryderyk Chopin.",
        "shortEN": "Beautiful Baroque church that houses the heart of Frédéric Chopin.",
        "desc": "La Chiesa della Santa Croce è una delle chiese barocche più importanti di Varsavia, situata su Krakowskie Przedmieście. È famosa in tutto il mondo perché uno dei suoi pilastri custodisce il cuore del celebre compositore Fryderyk Chopin. L'edificio ha subito gravi danni durante la Seconda Guerra Mondiale ma è stato meticolosamente ricostruito.",
        "descEN": "The Holy Cross Church is one of the most important Baroque churches in Warsaw, located on Krakowskie Przedmieście. It is world-famous because one of its pillars houses the heart of the renowned composer Frédéric Chopin. The building suffered severe damage during World War II but was meticulously reconstructed.",
        "tips": "L'ingresso è gratuito; cercate il pilastro con l'urna di Chopin sul lato sinistro della navata.",
        "tipsEN": "Entry is free; look for the pillar with Chopin's urn on the left side of the nave.",
        "src": [
          "Wikipedia: Holy Cross Church, Warsaw"
        ],
        "maps": "https://maps.google.com/?q=52.238611,21.0175"
      },
      {
        "id": "war-10",
        "name": "Tomb of the Unknown Soldier",
        "nameEN": "Tomb of the Unknown Soldier",
        "cat": "cultura",
        "lat": 52.240833,
        "lng": 21.011111,
        "short": "Monumento solenne con una fiamma eterna, situato in Piazza Piłsudski.",
        "shortEN": "Solemn monument featuring an eternal flame, located in Piłsudski Square.",
        "desc": "La Tomba del Milite Ignoto è un monumento dedicato ai soldati polacchi caduti in guerra, situato in Piazza Piłsudski. È l'unica parte sopravvissuta del Palazzo Sassone, distrutto durante la Seconda Guerra Mondiale. La fiamma eterna è sorvegliata da una guardia d'onore, e il cambio della guardia è una cerimonia solenne e toccante.",
        "descEN": "The Tomb of the Unknown Soldier is a monument dedicated to Polish soldiers who died in combat, located in Piłsudski Square. It is the only surviving part of the Saxon Palace, which was destroyed during World War II. The eternal flame is guarded by an honor guard, and the changing of the guard is a solemn and moving ceremony.",
        "tips": "Il cambio della guardia avviene ogni ora allo scoccare dell'ora.",
        "tipsEN": "The changing of the guard takes place every hour on the hour.",
        "src": [
          "Wikipedia: Tomb of the Unknown Soldier (Warsaw)"
        ],
        "maps": "https://maps.google.com/?q=52.240833,21.011111"
      },
      {
        "id": "war-11",
        "name": "Saxon Garden",
        "nameEN": "Saxon Garden",
        "cat": "natura",
        "lat": 52.240278,
        "lng": 21.008333,
        "short": "Storico parco pubblico con una magnifica fontana e statue classiche.",
        "shortEN": "Historic public park featuring a magnificent fountain and classical statues.",
        "desc": "I Giardini Sassoni sono il più antico parco pubblico di Varsavia, aperti nel 1727. Originariamente progettati in stile barocco francese, furono poi trasformati in un giardino paesaggistico all'inglese. Il parco vanta una bellissima fontana del XIX secolo, statue allegoriche e ampi viali alberati perfetti per una pausa rilassante.",
        "descEN": "The Saxon Garden is the oldest public park in Warsaw, opened in 1727. Originally designed in the French Baroque style, it was later transformed into an English landscape garden. The park boasts a beautiful 19th-century fountain, allegorical statues, and wide tree-lined avenues perfect for a relaxing break.",
        "tips": "Ideale per una passeggiata dopo aver visitato la vicina Tomba del Milite Ignoto.",
        "tipsEN": "Ideal for a stroll after visiting the nearby Tomb of the Unknown Soldier.",
        "src": [
          "Wikipedia: Saxon Garden"
        ],
        "maps": "https://maps.google.com/?q=52.240278,21.008333"
      },
      {
        "tier": 1,
        "id": "war-12",
        "name": "POLIN Museum of the History of Polish Jews",
        "nameEN": "POLIN Museum of the History of Polish Jews",
        "cat": "cultura",
        "lat": 52.249444,
        "lng": 20.993056,
        "short": "Museo pluripremiato che celebra la millenaria storia degli ebrei polacchi.",
        "shortEN": "Award-winning museum celebrating the thousand-year history of Polish Jews.",
        "desc": "Il Museo POLIN sorge sul sito dell'ex ghetto di Varsavia e racconta i mille anni di storia degli ebrei in Polonia. L'edificio stesso è un capolavoro di architettura contemporanea. L'esposizione principale è interattiva e profondamente commovente, offrendo un viaggio immersivo attraverso secoli di convivenza, cultura e tragedia.",
        "descEN": "The POLIN Museum stands on the site of the former Warsaw Ghetto and recounts the thousand-year history of Polish Jews. The building itself is a masterpiece of contemporary architecture. The core exhibition is interactive and deeply moving, offering an immersive journey through centuries of coexistence, culture, and tragedy.",
        "tips": "La visita richiede almeno 2-3 ore; si consiglia di prenotare i biglietti in anticipo.",
        "tipsEN": "The visit takes at least 2-3 hours; booking tickets in advance is recommended.",
        "src": [
          "Wikipedia: POLIN Museum of the History of Polish Jews",
          "polin.pl"
        ],
        "maps": "https://maps.google.com/?q=52.249444,20.993056"
      },
      {
        "tier": 1,
        "id": "war-13",
        "name": "Warsaw Uprising Museum",
        "nameEN": "Warsaw Uprising Museum",
        "cat": "cultura",
        "lat": 52.232222,
        "lng": 20.980833,
        "short": "Museo immersivo dedicato all'eroica Rivolta di Varsavia del 1944.",
        "shortEN": "Immersive museum dedicated to the heroic Warsaw Uprising of 1944.",
        "desc": "Questo museo è dedicato alla Rivolta di Varsavia del 1944, uno degli eventi più eroici e tragici della storia polacca. Situato in un'ex centrale elettrica, utilizza display multimediali, suoni e luci per ricreare l'atmosfera della città in guerra. È un'esperienza intensa che aiuta a comprendere lo spirito indomito di Varsavia.",
        "descEN": "This museum is dedicated to the Warsaw Uprising of 1944, one of the most heroic and tragic events in Polish history. Located in a former power station, it uses multimedia displays, sounds, and lights to recreate the atmosphere of the war-torn city. It is an intense experience that helps visitors understand Warsaw's indomitable spirit.",
        "tips": "L'ingresso è gratuito il lunedì. Preparatevi a un'esperienza emotivamente forte.",
        "tipsEN": "Admission is free on Mondays. Be prepared for an emotionally powerful experience.",
        "src": [
          "Wikipedia: Warsaw Uprising Museum",
          "1944.pl"
        ],
        "maps": "https://maps.google.com/?q=52.232222,20.980833"
      },
      {
        "tier": 1,
        "id": "war-14",
        "name": "Łazienki Park",
        "nameEN": "Łazienki Park",
        "cat": "natura",
        "lat": 52.215,
        "lng": 21.035556,
        "short": "Vasto parco reale con palazzi storici, pavoni e concerti estivi di Chopin.",
        "shortEN": "Vast royal park featuring historic palaces, peacocks, and summer Chopin concerts.",
        "desc": "Il Parco Łazienki è il parco più grande e pittoresco di Varsavia, noto anche come il Parco delle Terme. Ospita il magnifico Palazzo sull'Acqua, ex residenza estiva dell'ultimo re di Polonia. I visitatori possono passeggiare tra giardini curati, pavoni in libertà e assistere ai famosi concerti gratuiti di Chopin durante l'estate.",
        "descEN": "Łazienki Park is the largest and most picturesque park in Warsaw, also known as the Royal Baths Park. It is home to the magnificent Palace on the Isle, the former summer residence of Poland's last king. Visitors can stroll among manicured gardens, free-roaming peacocks, and attend the famous free Chopin concerts during summer.",
        "tips": "I concerti di Chopin si tengono ogni domenica da maggio a settembre presso il monumento al compositore.",
        "tipsEN": "Chopin concerts are held every Sunday from May to September by the composer's monument.",
        "src": [
          "Wikipedia: Łazienki Park"
        ],
        "maps": "https://maps.google.com/?q=52.215,21.035556"
      },
      {
        "tier": 1,
        "id": "war-15",
        "name": "Copernicus Science Centre",
        "nameEN": "Copernicus Science Centre",
        "cat": "kids",
        "lat": 52.241944,
        "lng": 21.028611,
        "short": "Museo della scienza interattivo, perfetto per famiglie e menti curiose.",
        "shortEN": "Interactive science museum, perfect for families and curious minds.",
        "desc": "Il Centro delle Scienze Copernico è uno dei musei scientifici più grandi e moderni d'Europa. Offre centinaia di mostre interattive che permettono a visitatori di tutte le età di condurre esperimenti e scoprire le leggi della natura. Situato lungo la Vistola, include anche un planetario all'avanguardia.",
        "descEN": "The Copernicus Science Centre is one of the largest and most modern science museums in Europe. It offers hundreds of interactive exhibits that allow visitors of all ages to conduct experiments and discover the laws of nature. Located along the Vistula River, it also includes a state-of-the-art planetarium.",
        "tips": "Acquistate i biglietti online con largo anticipo, poiché si esauriscono rapidamente.",
        "tipsEN": "Buy tickets online well in advance, as they sell out quickly.",
        "src": [
          "Wikipedia: Copernicus Science Centre"
        ],
        "maps": "https://maps.google.com/?q=52.241944,21.028611"
      },
      {
        "id": "war-16",
        "name": "Vistula Boulevards",
        "nameEN": "Vistula Boulevards",
        "cat": "natura",
        "lat": 52.243333,
        "lng": 21.028889,
        "short": "Vivace passeggiata lungo il fiume con caffè, piste ciclabili e spiagge urbane.",
        "shortEN": "Lively riverfront promenade with cafes, cycling paths, and urban beaches.",
        "desc": "I viali lungo il fiume Vistola sono diventati uno dei luoghi di ritrovo più popolari di Varsavia. Offrono chilometri di percorsi pedonali e ciclabili, caffè all'aperto, spiagge urbane e aree relax. Durante l'estate, la zona si anima con eventi culturali, musica dal vivo e una vivace vita notturna lungo le rive del fiume.",
        "descEN": "The boulevards along the Vistula River have become one of Warsaw's most popular gathering spots. They offer kilometers of walking and cycling paths, open-air cafes, urban beaches, and relaxation areas. During summer, the area comes alive with cultural events, live music, and a vibrant nightlife along the riverbanks.",
        "tips": "Perfetto per una passeggiata al tramonto o per noleggiare una bicicletta cittadina.",
        "tipsEN": "Perfect for a sunset walk or renting a city bike.",
        "src": [
          "warsawtour.pl",
          "Wikipedia: Vistula Boulevards"
        ],
        "maps": "https://maps.google.com/?q=52.243333,21.028889"
      },
      {
        "id": "war-17",
        "name": "Hala Koszyki",
        "nameEN": "Hala Koszyki",
        "cat": "cibo",
        "lat": 52.222222,
        "lng": 21.010278,
        "short": "Storico mercato coperto trasformato in un vivace e moderno polo gastronomico.",
        "shortEN": "Historic covered market transformed into a vibrant and modern food hall.",
        "desc": "Hala Koszyki è uno storico mercato coperto restaurato e trasformato in un moderno polo gastronomico. L'architettura industriale in mattoni e acciaio ospita decine di ristoranti, bar e negozi di specialità alimentari. È il luogo ideale per assaggiare sia la cucina polacca moderna che piatti internazionali in un'atmosfera vibrante.",
        "descEN": "Hala Koszyki is a historic covered market restored and transformed into a modern food hall. The industrial brick and steel architecture houses dozens of restaurants, bars, and specialty food shops. It is the ideal place to taste both modern Polish cuisine and international dishes in a vibrant atmosphere.",
        "tips": "Ottimo per il pranzo o la cena; può essere molto affollato nei fine settimana.",
        "tipsEN": "Great for lunch or dinner; it can get very crowded on weekends.",
        "src": [
          "koszyki.com",
          "Wikipedia: Hala Koszyki"
        ],
        "maps": "https://maps.google.com/?q=52.222222,21.010278"
      },
      {
        "id": "war-18",
        "name": "National Museum in Warsaw",
        "nameEN": "National Museum in Warsaw",
        "cat": "cultura",
        "lat": 52.231667,
        "lng": 21.024722,
        "short": "Il principale museo d'arte di Varsavia, con vaste collezioni di opere polacche ed europee.",
        "shortEN": "Warsaw's premier art museum, featuring vast collections of Polish and European works.",
        "desc": "Il Museo Nazionale è una delle più grandi istituzioni culturali della Polonia. Ospita una vasta collezione di arte antica, dipinti polacchi e stranieri, e una straordinaria galleria di arte medievale. Tra i capolavori spicca l'enorme dipinto 'La battaglia di Grunwald' di Jan Matejko, un'opera fondamentale per la storia polacca.",
        "descEN": "The National Museum is one of the largest cultural institutions in Poland. It houses a vast collection of ancient art, Polish and foreign paintings, and an extraordinary gallery of medieval art. Among the masterpieces is the enormous painting 'Battle of Grunwald' by Jan Matejko, a fundamental work for Polish history.",
        "tips": "L'ingresso alle mostre permanenti è gratuito il martedì.",
        "tipsEN": "Admission to the permanent exhibitions is free on Tuesdays.",
        "src": [
          "Wikipedia: National Museum, Warsaw",
          "mnw.art.pl"
        ],
        "maps": "https://maps.google.com/?q=52.231667,21.024722"
      },
      {
        "id": "war-19",
        "name": "Nowy Świat Street",
        "nameEN": "Nowy Świat Street",
        "cat": "cultura",
        "lat": 52.233333,
        "lng": 21.018333,
        "short": "Elegante via dello shopping e dei caffè, parte della storica Via Reale.",
        "shortEN": "Elegant shopping and cafe street, part of the historic Royal Route.",
        "desc": "Via Nowy Świat (Nuovo Mondo) è una delle principali arterie storiche e commerciali di Varsavia. Ricostruita dopo la guerra nel suo stile neoclassico originale, è ricca di boutique, ristoranti, caffè storici e librerie. È una continuazione della Via Reale e rappresenta il cuore pulsante della vita sociale cittadina.",
        "descEN": "Nowy Świat (New World) Street is one of Warsaw's main historic and commercial arteries. Rebuilt after the war in its original neoclassical style, it is full of boutiques, restaurants, historic cafes, and bookstores. It is a continuation of the Royal Route and represents the beating heart of the city's social life.",
        "tips": "Fermatevi da Blikle, una storica pasticceria famosa per i suoi pączki (krapfen polacchi).",
        "tipsEN": "Stop by Blikle, a historic pastry shop famous for its pączki (Polish doughnuts).",
        "src": [
          "Wikipedia: Nowy Świat Street"
        ],
        "maps": "https://maps.google.com/?q=52.233333,21.018333"
      },
      {
        "id": "war-20",
        "name": "Ujazdów Castle",
        "nameEN": "Ujazdów Castle",
        "cat": "cultura",
        "lat": 52.219722,
        "lng": 21.031389,
        "short": "Castello storico che oggi ospita un dinamico centro d'arte contemporanea.",
        "shortEN": "Historic castle that now houses a dynamic contemporary art center.",
        "desc": "Il Castello di Ujazdów è un'antica residenza reale situata tra il Parco Łazienki e la Vistola. Oggi ospita il Centro per l'Arte Contemporanea, offrendo mostre d'arte moderna, proiezioni cinematografiche e performance. L'edificio combina un'architettura storica con un'anima culturale all'avanguardia, circondato da splendidi giardini.",
        "descEN": "Ujazdów Castle is a former royal residence located between Łazienki Park and the Vistula River. Today it houses the Centre for Contemporary Art, offering modern art exhibitions, film screenings, and performances. The building combines historic architecture with an avant-garde cultural soul, surrounded by beautiful gardens.",
        "tips": "Il giovedì l'ingresso alle mostre è gratuito.",
        "tipsEN": "Admission to the exhibitions is free on Thursdays.",
        "src": [
          "Wikipedia: Ujazdów Castle"
        ],
        "maps": "https://maps.google.com/?q=52.219722,21.031389"
      },
      {
        "id": "war-21",
        "name": "Neon Museum",
        "nameEN": "Neon Museum",
        "cat": "cultura",
        "lat": 52.248611,
        "lng": 21.048333,
        "short": "Unico museo in Europa dedicato alle storiche insegne al neon dell'era sovietica.",
        "shortEN": "Unique museum in Europe dedicated to historic Soviet-era neon signs.",
        "desc": "Situato nel quartiere creativo di Praga, il Museo dei Neon è un'istituzione unica dedicata alla conservazione delle insegne luminose dell'era della Guerra Fredda. La collezione presenta centinaia di neon restaurati che un tempo illuminavano le strade polacche. È un tuffo affascinante nel design e nella tipografia del blocco orientale.",
        "descEN": "Located in the creative Praga district, the Neon Museum is a unique institution dedicated to preserving Cold War-era illuminated signs. The collection features hundreds of restored neon signs that once lit up Polish streets. It is a fascinating dive into Eastern Bloc design and typography.",
        "tips": "Perfetto per gli amanti della fotografia e del design retrò.",
        "tipsEN": "Perfect for lovers of photography and retro design.",
        "src": [
          "Wikipedia: Neon Museum in Warsaw",
          "neonmuzeum.org"
        ],
        "maps": "https://maps.google.com/?q=52.248611,21.048333"
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
        "tier": 2,
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
        "tier": 2,
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
      },
      {
        "tier": 2,
        "id": "vln-6",
        "name": "Vilnius Cathedral",
        "nameEN": "Vilnius Cathedral",
        "cat": "cultura",
        "lat": 54.685833,
        "lng": 25.287778,
        "short": "La principale cattedrale cattolica della Lituania, celebre per la sua architettura neoclassica e la piazza antistante.",
        "shortEN": "Lithuania's main Catholic cathedral, famous for its neoclassical architecture and the adjacent square.",
        "desc": "La Cattedrale di Vilnius, dedicata ai Santi Stanislao e Ladislao, è il cuore spirituale della Lituania. Situata nell'omonima piazza, questa maestosa struttura neoclassica sorge sul sito di antichi templi pagani. Al suo interno spicca la sfarzosa Cappella di San Casimiro, un capolavoro del barocco. La piazza antistante, con la sua iconica torre campanaria separata, è il principale punto di ritrovo della città.",
        "descEN": "Vilnius Cathedral, dedicated to Saints Stanislaus and Ladislaus, is the spiritual heart of Lithuania. Located in Cathedral Square, this majestic neoclassical structure stands on the site of ancient pagan temples. Inside, the opulent Chapel of Saint Casimir stands out as a masterpiece of Baroque architecture. The square in front, with its iconic separate bell tower, is the city's main gathering point.",
        "tips": "L'ingresso alla cattedrale è gratuito, ma l'accesso alle cripte e al campanile richiede un biglietto.",
        "tipsEN": "Entry to the cathedral is free, but access to the crypts and the bell tower requires a ticket.",
        "src": [
          "Wikipedia: Vilnius Cathedral",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.685833,25.287778"
      },
      {
        "tier": 1,
        "id": "vln-7",
        "name": "Palace of the Grand Dukes of Lithuania",
        "nameEN": "Palace of the Grand Dukes of Lithuania",
        "cat": "cultura",
        "lat": 54.6865,
        "lng": 25.2889,
        "short": "Un palazzo storico ricostruito che ospita un museo sulla storia del Granducato di Lituania.",
        "shortEN": "A reconstructed historic palace housing a museum on the history of the Grand Duchy of Lithuania.",
        "desc": "Ricostruito nel XXI secolo, questo imponente palazzo rinascimentale fu la residenza dei sovrani del Granducato di Lituania. Oggi ospita un vasto museo nazionale che ripercorre la storia del paese attraverso reperti archeologici, sale di rappresentanza ricreate e mostre d'arte. I visitatori possono esplorare le rovine originali nei sotterranei e ammirare viste panoramiche dalla torre. È un viaggio affascinante nel passato glorioso della nazione.",
        "descEN": "Reconstructed in the 21st century, this imposing Renaissance palace was the residence of the rulers of the Grand Duchy of Lithuania. Today it houses a vast national museum that traces the country's history through archaeological finds, recreated state rooms, and art exhibitions. Visitors can explore the original ruins in the basement and enjoy panoramic views from the tower. It is a fascinating journey into the nation's glorious past.",
        "tips": "Prevedi almeno due ore per la visita completa; sono disponibili audioguide in diverse lingue.",
        "tipsEN": "Allow at least two hours for a full visit; audio guides are available in several languages.",
        "src": [
          "Official Site: Valdovų rūmai",
          "Wikipedia: Palace of the Grand Dukes of Lithuania"
        ],
        "maps": "https://maps.google.com/?q=54.6865,25.2889"
      },
      {
        "id": "vln-8",
        "name": "Pilies Street",
        "nameEN": "Pilies Street",
        "cat": "cultura",
        "lat": 54.6828,
        "lng": 25.2892,
        "short": "La via più antica e vivace del centro storico, ricca di caffè, negozi e architettura storica.",
        "shortEN": "The oldest and liveliest street in the historic center, full of cafes, shops, and historic architecture.",
        "desc": "Pilies è la strada più antica e pittoresca del centro storico di Vilnius, collegando la Piazza della Cattedrale alla Piazza del Municipio. È fiancheggiata da edifici storici di varie epoche, che spaziano dal gotico al barocco. La via è sempre animata grazie ai numerosi caffè, ristoranti, gallerie d'arte e negozi di souvenir che vendono ambra e lino. Passeggiare qui offre un'autentica immersione nell'atmosfera vibrante della città.",
        "descEN": "Pilies is the oldest and most picturesque street in the historic center of Vilnius, connecting Cathedral Square to Town Hall Square. It is lined with historic buildings from various eras, ranging from Gothic to Baroque. The street is always bustling thanks to numerous cafes, restaurants, art galleries, and souvenir shops selling amber and linen. Strolling here offers an authentic immersion into the city's vibrant atmosphere.",
        "tips": "Ottima zona per acquistare souvenir in ambra o fermarsi per un caffè all'aperto.",
        "tipsEN": "Great area to buy amber souvenirs or stop for an outdoor coffee.",
        "src": [
          "Vilnius Tourism: Pilies Street"
        ],
        "maps": "https://maps.google.com/?q=54.6828,25.2892"
      },
      {
        "tier": 1,
        "id": "vln-9",
        "name": "St. Anne's Church",
        "nameEN": "St. Anne's Church",
        "cat": "cultura",
        "lat": 54.6831,
        "lng": 25.2931,
        "short": "Un capolavoro del gotico fiammeggiante in mattoni rossi, ammirato persino da Napoleone.",
        "shortEN": "A masterpiece of Flamboyant Gothic in red brick, admired even by Napoleon.",
        "desc": "La Chiesa di Sant'Anna è uno dei capolavori gotici più celebri della Lituania, famosa per la sua intricata facciata in mattoni rossi. Costruita alla fine del XV secolo, la leggenda narra che Napoleone Bonaparte ne rimase così affascinato da volerla portare a Parigi sul palmo della mano. L'esterno, con le sue guglie slanciate e i motivi geometrici, è un esempio eccezionale di gotico fiammeggiante. L'interno è più sobrio ma merita comunque una visita.",
        "descEN": "St. Anne's Church is one of Lithuania's most famous Gothic masterpieces, renowned for its intricate red brick facade. Built at the end of the 15th century, legend has it that Napoleon Bonaparte was so fascinated by it that he wanted to carry it to Paris in the palm of his hand. The exterior, with its slender spires and geometric patterns, is an exceptional example of Flamboyant Gothic. The interior is more modest but still worth a visit.",
        "tips": "La chiesa è piccola e la visita è breve; l'ingresso è gratuito.",
        "tipsEN": "The church is small and the visit is short; entry is free.",
        "src": [
          "Wikipedia: St. Anne's Church, Vilnius"
        ],
        "maps": "https://maps.google.com/?q=54.6831,25.2931"
      },
      {
        "id": "vln-10",
        "name": "Literatų Street",
        "nameEN": "Literatų Street",
        "cat": "cultura",
        "lat": 54.6822,
        "lng": 25.2903,
        "short": "Una pittoresca stradina decorata con centinaia di opere d'arte dedicate a scrittori e poeti.",
        "shortEN": "A picturesque little street decorated with hundreds of artworks dedicated to writers and poets.",
        "desc": "Questa stretta e affascinante via pedonale è dedicata agli scrittori e ai poeti legati alla Lituania. I muri della strada sono decorati con centinaia di piccole opere d'arte, placche e sculture incastonate, ciascuna in omaggio a un diverso letterato. Il progetto artistico, iniziato nel 2008, ha trasformato la via in una galleria d'arte a cielo aperto. È un luogo perfetto per una passeggiata tranquilla e per scattare fotografie uniche.",
        "descEN": "This narrow and charming pedestrian street is dedicated to writers and poets connected to Lithuania. The walls of the street are decorated with hundreds of small artworks, plaques, and embedded sculptures, each paying homage to a different literary figure. The art project, started in 2008, has transformed the street into an open-air art gallery. It is a perfect place for a quiet stroll and taking unique photographs.",
        "tips": "Visitala con calma per apprezzare i dettagli delle singole opere d'arte sui muri.",
        "tipsEN": "Visit at a leisurely pace to appreciate the details of the individual artworks on the walls.",
        "src": [
          "Vilnius Tourism: Literatų Street"
        ],
        "maps": "https://maps.google.com/?q=54.6822,25.2903"
      },
      {
        "tier": 1,
        "id": "vln-11",
        "name": "Vilnius University Architectural Ensemble",
        "nameEN": "Vilnius University Architectural Ensemble",
        "cat": "cultura",
        "lat": 54.6826,
        "lng": 25.2878,
        "short": "Un complesso universitario storico con magnifici cortili, una chiesa barocca e una biblioteca affrescata.",
        "shortEN": "A historic university complex with magnificent courtyards, a Baroque church, and a frescoed library.",
        "desc": "Fondata nel 1579, l'Università di Vilnius è una delle più antiche dell'Europa orientale. Il suo campus storico è un labirinto di cortili pittoreschi, portici e passaggi segreti che mescolano stili gotici, rinascimentali, barocchi e classici. Da non perdere la Chiesa di San Giovanni con il suo alto campanile e la storica biblioteca, ricca di affreschi e antichi manoscritti. Passeggiare per i suoi cortili è come fare un salto indietro nel tempo.",
        "descEN": "Founded in 1579, Vilnius University is one of the oldest in Eastern Europe. Its historic campus is a labyrinth of picturesque courtyards, arcades, and secret passages blending Gothic, Renaissance, Baroque, and Classical styles. Do not miss St. John's Church with its tall bell tower and the historic library, rich in frescoes and ancient manuscripts. Strolling through its courtyards is like stepping back in time.",
        "tips": "L'accesso ai cortili richiede un piccolo biglietto d'ingresso; il campanile offre una vista stupenda.",
        "tipsEN": "Access to the courtyards requires a small entrance fee; the bell tower offers a stunning view.",
        "src": [
          "Wikipedia: Vilnius University",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.6826,25.2878"
      },
      {
        "id": "vln-12",
        "name": "Town Hall Square",
        "nameEN": "Town Hall Square",
        "cat": "cultura",
        "lat": 54.6781,
        "lng": 25.2875,
        "short": "Una vivace piazza triangolare dominata dal Municipio neoclassico, cuore degli eventi cittadini.",
        "shortEN": "A lively triangular square dominated by the neoclassical Town Hall, the heart of city events.",
        "desc": "La Piazza del Municipio è uno dei centri nevralgici della vita pubblica di Vilnius, circondata da eleganti edifici storici e numerosi caffè. Al centro domina il Municipio neoclassico, un tempo fulcro del commercio e dell'amministrazione cittadina. La piazza a forma triangolare ospita regolarmente mercati, concerti e festival, rendendola un luogo vivace in ogni stagione. È il punto di partenza ideale per esplorare le stradine del quartiere ebraico.",
        "descEN": "Town Hall Square is one of the nerve centers of public life in Vilnius, surrounded by elegant historic buildings and numerous cafes. At the center dominates the neoclassical Town Hall, once the hub of city commerce and administration. The triangular-shaped square regularly hosts markets, concerts, and festivals, making it a lively place in every season. It is the ideal starting point for exploring the narrow streets of the Jewish quarter.",
        "tips": "Ottimo posto per sedersi in un caffè all'aperto e osservare il viavai della città.",
        "tipsEN": "Great place to sit at an outdoor cafe and watch the hustle and bustle of the city.",
        "src": [
          "Vilnius Tourism: Town Hall Square"
        ],
        "maps": "https://maps.google.com/?q=54.6781,25.2875"
      },
      {
        "tier": 1,
        "id": "vln-13",
        "name": "Gate of Dawn",
        "nameEN": "Gate of Dawn",
        "cat": "cultura",
        "lat": 54.6744,
        "lng": 25.2895,
        "short": "L'unica porta cittadina rimasta, che ospita una venerata icona miracolosa della Vergine Maria.",
        "shortEN": "The only remaining city gate, housing a venerated miraculous icon of the Virgin Mary.",
        "desc": "La Porta dell'Aurora è l'unica porta sopravvissuta delle antiche mura difensive di Vilnius. Al suo interno ospita una celebre cappella che custodisce l'icona della Madonna della Misericordia, venerata sia dai cattolici che dagli ortodossi. L'immagine, dipinta nel XVII secolo, è considerata miracolosa e attira pellegrini da tutto il mondo. La vista della cappella illuminata dalla strada sottostante è una delle immagini più iconiche della città.",
        "descEN": "The Gate of Dawn is the only surviving gate of the ancient defensive walls of Vilnius. Inside, it houses a famous chapel containing the icon of the Blessed Virgin Mary Mother of Mercy, venerated by both Catholics and Orthodox Christians. The image, painted in the 17th century, is considered miraculous and attracts pilgrims from all over the world. The view of the illuminated chapel from the street below is one of the city's most iconic sights.",
        "tips": "Rispetta il silenzio e l'atmosfera di preghiera quando visiti la cappella.",
        "tipsEN": "Respect the silence and prayerful atmosphere when visiting the chapel.",
        "src": [
          "Wikipedia: Gate of Dawn",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.6744,25.2895"
      },
      {
        "id": "vln-14",
        "name": "Bastion of the Vilnius Defensive Wall",
        "nameEN": "Bastion of the Vilnius Defensive Wall",
        "cat": "panorama",
        "lat": 54.6764,
        "lng": 25.2928,
        "short": "Un'antica fortificazione con un museo delle armi e una terrazza che offre viste spettacolari sulla città.",
        "shortEN": "An ancient fortification with a weapons museum and a terrace offering spectacular city views.",
        "desc": "Il Bastione della cinta muraria di Vilnius, noto anche come Barbacane, è una fortificazione rinascimentale costruita per difendere la città. Oggi ospita un museo che espone armi antiche e armature, raccontando la storia militare di Vilnius. Oltre all'interesse storico, il sito offre una splendida terrazza panoramica da cui si gode una vista mozzafiato sui tetti rossi del centro storico e sul quartiere di Užupis. I sotterranei del bastione aggiungono un tocco di mistero alla visita.",
        "descEN": "The Bastion of the Vilnius Defensive Wall, also known as the Barbican, is a Renaissance fortification built to defend the city. Today it houses a museum displaying ancient weapons and armor, recounting the military history of Vilnius. Besides its historical interest, the site offers a splendid panoramic terrace from which you can enjoy breathtaking views of the red roofs of the old town and the Užupis district. The bastion's underground tunnels add a touch of mystery to the visit.",
        "tips": "La salita al bastione è breve ma ripida; la vista al tramonto è particolarmente suggestiva.",
        "tipsEN": "The climb to the bastion is short but steep; the view at sunset is particularly striking.",
        "src": [
          "National Museum of Lithuania",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.6764,25.2928"
      },
      {
        "tier": 1,
        "id": "vln-15",
        "name": "Three Crosses Monument",
        "nameEN": "Three Crosses Monument",
        "cat": "panorama",
        "lat": 54.6868,
        "lng": 25.2974,
        "short": "Un monumento storico su una collina che offre la migliore vista panoramica di Vilnius.",
        "shortEN": "A historic monument on a hill offering the best panoramic view of Vilnius.",
        "desc": "Situato sulla Collina delle Tre Croci, questo imponente monumento bianco domina il panorama di Vilnius. Le croci originali furono erette nel XVII secolo per commemorare un gruppo di monaci francescani martirizzati, ma furono distrutte durante il regime sovietico e ricostruite nel 1989 come simbolo di rinascita nazionale. La salita attraverso il parco richiede un po' di sforzo, ma la ricompensa è la vista panoramica più spettacolare e completa su tutta la città.",
        "descEN": "Located on the Hill of Three Crosses, this imposing white monument dominates the Vilnius skyline. The original crosses were erected in the 17th century to commemorate a group of martyred Franciscan monks, but were destroyed during the Soviet regime and rebuilt in 1989 as a symbol of national rebirth. The climb through the park requires some effort, but the reward is the most spectacular and comprehensive panoramic view over the entire city.",
        "tips": "Indossa scarpe comode per affrontare i gradini di legno che portano alla cima della collina.",
        "tipsEN": "Wear comfortable shoes to tackle the wooden steps leading to the top of the hill.",
        "src": [
          "Wikipedia: Three Crosses",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.6868,25.2974"
      },
      {
        "id": "vln-16",
        "name": "MO Museum",
        "nameEN": "MO Museum",
        "cat": "cultura",
        "lat": 54.6795,
        "lng": 25.2771,
        "short": "Un museo d'arte moderna e contemporanea ospitato in un edificio all'avanguardia progettato da Daniel Libeskind.",
        "shortEN": "A modern and contemporary art museum housed in an avant-garde building designed by Daniel Libeskind.",
        "desc": "Progettato dal celebre architetto Daniel Libeskind, il MO Museum è il fulcro dell'arte moderna e contemporanea in Lituania. L'edificio stesso è un'opera d'arte architettonica, con linee audaci e spazi luminosi. All'interno, le mostre a rotazione presentano opere di artisti lituani dagli anni '50 ai giorni nostri, offrendo uno spaccato unico sulla cultura visiva del paese. Il museo dispone anche di un giardino delle sculture e di un'accogliente caffetteria.",
        "descEN": "Designed by the renowned architect Daniel Libeskind, the MO Museum is the hub of modern and contemporary art in Lithuania. The building itself is an architectural work of art, with bold lines and bright spaces. Inside, rotating exhibitions feature works by Lithuanian artists from the 1950s to the present day, offering a unique insight into the country's visual culture. The museum also features a sculpture garden and a cozy cafe.",
        "tips": "Controlla il programma delle mostre temporanee prima della visita; il negozio del museo offre ottimi libri d'arte.",
        "tipsEN": "Check the schedule of temporary exhibitions before visiting; the museum shop offers excellent art books.",
        "src": [
          "MO Museum Official Site",
          "Vilnius Tourism"
        ],
        "maps": "https://maps.google.com/?q=54.6795,25.2771"
      },
      {
        "tier": 1,
        "id": "vln-17",
        "name": "Church of St. Peter and St. Paul",
        "nameEN": "Church of St. Peter and St. Paul",
        "cat": "cultura",
        "lat": 54.694,
        "lng": 25.3061,
        "short": "Il capolavoro del barocco lituano, celebre per il suo interno mozzafiato decorato con oltre 2.000 sculture in stucco bianco.",
        "shortEN": "The masterpiece of Lithuanian Baroque, famous for its breathtaking interior decorated with over 2,000 white stucco sculptures.",
        "desc": "Situata nel quartiere di Antakalnis, questa chiesa è considerata il capolavoro assoluto del barocco lituano. Sebbene l'esterno sia relativamente sobrio, l'interno lascia i visitatori senza fiato: è decorato con oltre 2.000 figure in stucco bianco che creano un'atmosfera celestiale e intricata. Le sculture raffigurano scene bibliche, angeli, demoni e figure storiche, realizzate con una maestria eccezionale da artisti italiani nel XVII secolo. È una tappa imperdibile per gli amanti dell'arte.",
        "descEN": "Located in the Antakalnis district, this church is considered the absolute masterpiece of Lithuanian Baroque. Although the exterior is relatively modest, the interior leaves visitors breathless: it is decorated with over 2,000 white stucco figures that create a celestial and intricate atmosphere. The sculptures depict biblical scenes, angels, demons, and historical figures, crafted with exceptional skill by Italian artists in the 17th century. It is a must-see for art lovers.",
        "tips": "Si trova a circa 20 minuti a piedi dal centro, ma la straordinaria decorazione interna vale assolutamente la passeggiata.",
        "tipsEN": "It is about a 20-minute walk from the center, but the extraordinary interior decoration is absolutely worth the stroll.",
        "src": [
          "Wikipedia: Church of St. Peter and St. Paul, Vilnius"
        ],
        "maps": "https://maps.google.com/?q=54.694,25.3061"
      },
      {
        "id": "vln-18",
        "name": "Museum of Occupations and Freedom Fights",
        "nameEN": "Museum of Occupations and Freedom Fights",
        "cat": "cultura",
        "lat": 54.688,
        "lng": 25.2706,
        "short": "Un museo toccante situato nell'ex prigione del KGB, dedicato alla storia delle occupazioni e della resistenza lituana.",
        "shortEN": "A moving museum located in the former KGB prison, dedicated to the history of occupations and Lithuanian resistance.",
        "desc": "Situato nell'ex quartier generale del KGB, questo museo offre una testimonianza toccante e cruda della storia lituana durante le occupazioni sovietica e nazista. Le mostre ai piani superiori documentano la resistenza partigiana e le deportazioni in Siberia. Il momento più intenso della visita è l'esplorazione delle prigioni sotterranee, lasciate esattamente come erano quando il KGB abbandonò l'edificio nel 1991. È un'esperienza profondamente commovente e storicamente fondamentale.",
        "descEN": "Located in the former KGB headquarters, this museum offers a poignant and stark testimony of Lithuanian history during the Soviet and Nazi occupations. The exhibitions on the upper floors document the partisan resistance and deportations to Siberia. The most intense part of the visit is exploring the underground prison cells, left exactly as they were when the KGB abandoned the building in 1991. It is a deeply moving and historically essential experience.",
        "tips": "La visita alle celle sotterranee può essere emotivamente intensa; sono disponibili audioguide molto dettagliate.",
        "tipsEN": "The visit to the underground cells can be emotionally intense; very detailed audio guides are available.",
        "src": [
          "Official Site: Museum of Occupations and Freedom Fights"
        ],
        "maps": "https://maps.google.com/?q=54.688,25.2706"
      },
      {
        "id": "vln-19",
        "name": "Presidential Palace",
        "nameEN": "Presidential Palace",
        "cat": "cultura",
        "lat": 54.6832,
        "lng": 25.2858,
        "short": "L'elegante residenza ufficiale del Presidente lituano, famosa per la cerimonia del cambio della guardia.",
        "shortEN": "The elegant official residence of the Lithuanian President, famous for the changing of the guard ceremony.",
        "desc": "Il Palazzo Presidenziale è la residenza ufficiale del Presidente della Lituania. Questo elegante edificio in stile impero, situato nella pittoresca Piazza Daukantas, ha ospitato nel corso dei secoli zar russi, re polacchi e persino Napoleone Bonaparte. Ogni domenica a mezzogiorno si svolge la solenne cerimonia del cambio della guardia, un evento molto popolare tra i turisti. I giardini del palazzo sono aperti al pubblico durante i fine settimana estivi.",
        "descEN": "The Presidential Palace is the official residence of the President of Lithuania. This elegant Empire-style building, located in the picturesque Daukantas Square, has hosted Russian tsars, Polish kings, and even Napoleon Bonaparte over the centuries. Every Sunday at noon, the solemn changing of the guard ceremony takes place, a very popular event among tourists. The palace gardens are open to the public during summer weekends.",
        "tips": "Assisti al cambio della guardia la domenica a mezzogiorno; prenota in anticipo per le visite guidate gratuite all'interno.",
        "tipsEN": "Watch the changing of the guard on Sundays at noon; book in advance for free guided tours inside.",
        "src": [
          "Vilnius Tourism: Presidential Palace"
        ],
        "maps": "https://maps.google.com/?q=54.6832,25.2858"
      },
      {
        "id": "vln-20",
        "name": "St. Casimir's Church",
        "nameEN": "St. Casimir's Church",
        "cat": "cultura",
        "lat": 54.6776,
        "lng": 25.2883,
        "short": "La più antica chiesa barocca della città, sormontata da una caratteristica cupola a forma di corona.",
        "shortEN": "The oldest Baroque church in the city, topped by a distinctive crown-shaped dome.",
        "desc": "La Chiesa di San Casimiro è il più antico edificio barocco di Vilnius, facilmente riconoscibile per la sua imponente cupola a forma di corona granducale. Costruita dai Gesuiti all'inizio del XVII secolo, la chiesa ha avuto una storia turbolenta, essendo stata trasformata in chiesa ortodossa e persino in un museo dell'ateismo durante l'era sovietica. Oggi è tornata al suo splendore originale e vanta un'acustica eccellente, ospitando spesso concerti d'organo.",
        "descEN": "St. Casimir's Church is the oldest Baroque building in Vilnius, easily recognizable by its imposing dome shaped like a Grand Ducal crown. Built by the Jesuits in the early 17th century, the church has had a turbulent history, having been transformed into an Orthodox church and even a museum of atheism during the Soviet era. Today it has returned to its original splendor and boasts excellent acoustics, frequently hosting organ concerts.",
        "tips": "Controlla il programma locale per assistere a uno dei suggestivi concerti d'organo gratuiti.",
        "tipsEN": "Check the local schedule to attend one of the atmospheric free organ concerts.",
        "src": [
          "Wikipedia: Church of St. Casimir, Vilnius"
        ],
        "maps": "https://maps.google.com/?q=54.6776,25.2883"
      },
      {
        "id": "vln-21",
        "name": "Vokiečių Street",
        "nameEN": "Vokiečių Street",
        "cat": "cultura",
        "lat": 54.6793,
        "lng": 25.2838,
        "short": "Un ampio e vivace viale alberato nel cuore del centro storico, ricco di ristoranti e caffè.",
        "shortEN": "A wide and lively tree-lined boulevard in the heart of the historic center, full of restaurants and cafes.",
        "desc": "Vokiečių, che significa 'Via dei Tedeschi', è uno dei viali più ampi e vivaci del centro storico. Storicamente era il cuore commerciale della comunità mercantile tedesca e, in seguito, un'importante arteria del quartiere ebraico. Oggi è una passeggiata alberata divisa a metà, fiancheggiata da ristoranti alla moda, boutique e caffè con ampi dehors. È il luogo perfetto per una passeggiata serale o per gustare la cucina locale e internazionale.",
        "descEN": "Vokiečių, meaning 'German Street', is one of the widest and liveliest boulevards in the historic center. Historically, it was the commercial heart of the German merchant community and later an important artery of the Jewish quarter. Today it is a tree-lined promenade divided in half, flanked by trendy restaurants, boutiques, and cafes with large outdoor seating areas. It is the perfect place for an evening stroll or to enjoy local and international cuisine.",
        "tips": "Ottima zona per cenare all'aperto durante i mesi estivi o per una passeggiata serale.",
        "tipsEN": "Great area for outdoor dining during the summer months or for an evening stroll.",
        "src": [
          "Vilnius Tourism: Vokiečių Street"
        ],
        "maps": "https://maps.google.com/?q=54.6793,25.2838"
      },
      {
        "id": "vln-22",
        "name": "Choral Synagogue",
        "nameEN": "Choral Synagogue",
        "cat": "cultura",
        "lat": 54.6766,
        "lng": 25.2808,
        "short": "L'unica sinagoga sopravvissuta a Vilnius, un importante simbolo della storica comunità ebraica della città.",
        "shortEN": "The only surviving synagogue in Vilnius, an important symbol of the city's historic Jewish community.",
        "desc": "La Sinagoga Corale è l'unica sinagoga di Vilnius sopravvissuta alla Seconda Guerra Mondiale e al regime sovietico. Costruita nel 1903 in stile moresco-romanico, rappresenta l'ultimo baluardo della 'Gerusalemme del Nord', come un tempo era conosciuta Vilnius per la sua fiorente comunità ebraica. L'interno è elegantemente decorato e continua a servire come luogo di culto attivo per la piccola ma resiliente comunità ebraica locale.",
        "descEN": "The Choral Synagogue is the only synagogue in Vilnius to survive World War II and the Soviet regime. Built in 1903 in a Moorish-Romanesque style, it represents the last bastion of the 'Jerusalem of the North', as Vilnius was once known for its thriving Jewish community. The interior is elegantly decorated and continues to serve as an active place of worship for the small but resilient local Jewish community.",
        "tips": "L'ingresso è consentito ai visitatori, ma è richiesto un abbigliamento modesto e gli uomini devono coprire il capo.",
        "tipsEN": "Visitors are allowed to enter, but modest dress is required and men must cover their heads.",
        "src": [
          "Wikipedia: Choral Synagogue (Vilnius)"
        ],
        "maps": "https://maps.google.com/?q=54.6766,25.2808"
      },
      {
        "id": "vln-23",
        "name": "Bernardine Cemetery",
        "nameEN": "Bernardine Cemetery",
        "cat": "natura",
        "lat": 54.6811,
        "lng": 25.3058,
        "short": "Un antico e romantico cimitero storico immerso nella natura, perfetto per una passeggiata malinconica.",
        "shortEN": "An ancient and romantic historic cemetery immersed in nature, perfect for a melancholic stroll.",
        "desc": "Fondato nel 1810, il Cimitero dei Bernardini è uno dei cimiteri storici più antichi e affascinanti di Vilnius. Situato nel quartiere di Užupis, vicino al fiume Vilnia, è un luogo di pace e memoria, immerso in una fitta vegetazione. Le antiche lapidi ricoperte di muschio, le cripte in rovina e i sentieri ombreggiati creano un'atmosfera romantica e malinconica. È il luogo di riposo di molte figure culturali e storiche lituane e polacche.",
        "descEN": "Founded in 1810, the Bernardine Cemetery is one of the oldest and most fascinating historic cemeteries in Vilnius. Located in the Užupis district, near the Vilnia River, it is a place of peace and memory, immersed in dense vegetation. The ancient moss-covered tombstones, ruined crypts, and shaded paths create a romantic and melancholic atmosphere. It is the resting place of many Lithuanian and Polish cultural and historical figures.",
        "tips": "Visitalo in autunno quando le foglie colorate rendono l'atmosfera ancora più suggestiva.",
        "tipsEN": "Visit in autumn when the colorful leaves make the atmosphere even more evocative.",
        "src": [
          "Vilnius Tourism: Bernardine Cemetery"
        ],
        "maps": "https://maps.google.com/?q=54.6811,25.3058"
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 1,
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
      },
      {
        "tier": 1,
        "id": "rig-6",
        "name": "St. Peter's Church",
        "nameEN": "St. Peter's Church",
        "cat": "panorama",
        "lat": 56.9475,
        "lng": 24.1094,
        "short": "Una storica chiesa medievale caratterizzata da un'imponente guglia con un ponte di osservazione per viste panoramiche sulla città.",
        "shortEN": "A historic medieval church featuring a towering spire with an observation deck for panoramic city views.",
        "desc": "La Chiesa di San Pietro è uno dei monumenti medievali più antichi e importanti degli Stati Baltici, risalente al 1209. La sua imponente guglia domina lo skyline di Riga e offre viste panoramiche mozzafiato sulla città dal suo ponte di osservazione. L'interno presenta una bellissima architettura gotica, epitaffi storici e mostre d'arte regolari. È stata ricostruita più volte nel corso della storia, l'ultima dopo la Seconda Guerra Mondiale.",
        "descEN": "St. Peter's Church is one of the oldest and most prominent medieval monuments in the Baltic States, dating back to 1209. Its towering spire dominates the Riga skyline and offers breathtaking panoramic views of the city from its observation deck. The interior features beautiful Gothic architecture, historical epitaphs, and regular art exhibitions. It has been rebuilt several times throughout history, most recently after World War II.",
        "tips": "Il ponte di osservazione è accessibile tramite ascensore; è previsto un biglietto d'ingresso.",
        "tipsEN": "The observation deck is accessible by elevator; an entrance fee applies.",
        "src": [
          "Wikipedia: St. Peter's Church, Riga",
          "Latvia Travel"
        ],
        "maps": "https://maps.google.com/?q=56.9475,24.1094"
      },
      {
        "tier": 1,
        "id": "rig-7",
        "name": "Three Brothers",
        "nameEN": "Three Brothers",
        "cat": "cultura",
        "lat": 56.9503,
        "lng": 24.1044,
        "short": "Il più antico complesso di edifici residenziali di Riga, che mostra tre distinte epoche architettoniche.",
        "shortEN": "The oldest complex of residential buildings in Riga, showcasing three distinct architectural eras.",
        "desc": "I Tre Fratelli formano il più antico complesso di case di abitazione a Riga, con ogni edificio che rappresenta un diverso periodo di sviluppo architettonico. L'edificio più antico, risalente al XV secolo, presenta elementi del tardo gotico e del primo Rinascimento. Il fratello di mezzo mostra il manierismo olandese, mentre il più giovane è una stretta struttura barocca. Oggi ospitano il Museo di Architettura Lettone.",
        "descEN": "The Three Brothers form the oldest complex of dwelling houses in Riga, with each building representing a different period of architectural development. The oldest building, dating back to the 15th century, features late Gothic and early Renaissance elements. The middle brother showcases Dutch Mannerism, while the youngest is a narrow Baroque structure. Today, they house the Latvian Museum of Architecture.",
        "tips": "Visibile gratuitamente dall'esterno; anche il museo di architettura all'interno è gratuito ma ha orari limitati.",
        "tipsEN": "Free to view from the outside; the architecture museum inside is also free but has limited hours.",
        "src": [
          "Wikipedia: Three Brothers, Riga"
        ],
        "maps": "https://maps.google.com/?q=56.9503,24.1044"
      },
      {
        "tier": 1,
        "id": "rig-8",
        "name": "Freedom Monument",
        "nameEN": "Freedom Monument",
        "cat": "cultura",
        "lat": 56.9514,
        "lng": 24.1133,
        "short": "Un imponente monumento di 42 metri che simboleggia l'indipendenza e l'orgoglio nazionale della Lettonia.",
        "shortEN": "A towering 42-meter monument symbolizing Latvia's independence and national pride.",
        "desc": "Il Monumento alla Libertà è un imponente memoriale che onora i soldati caduti durante la Guerra d'Indipendenza lettone. Inaugurato nel 1935, è alto 42 metri ed è sormontato da una figura in rame della Libertà che tiene tre stelle dorate, che rappresentano le regioni storiche della Lettonia. Funge da potente simbolo della libertà, dell'indipendenza e della sovranità della Lettonia. La base presenta intricate sculture che raffigurano la storia e la cultura lettone.",
        "descEN": "The Freedom Monument is a towering memorial honoring the soldiers killed during the Latvian War of Independence. Unveiled in 1935, it stands 42 meters tall and is topped by a copper figure of Liberty holding three gilded stars, representing the historical regions of Latvia. It serves as a powerful symbol of Latvia's freedom, independence, and sovereignty. The base features intricate sculptures depicting Latvian history and culture.",
        "tips": "Le cerimonie del cambio della guardia si svolgono ogni ora durante il giorno.",
        "tipsEN": "Guard changing ceremonies take place hourly during the day.",
        "src": [
          "Wikipedia: Freedom Monument"
        ],
        "maps": "https://maps.google.com/?q=56.9514,24.1133"
      },
      {
        "id": "rig-9",
        "name": "Swedish Gate",
        "nameEN": "Swedish Gate",
        "cat": "cultura",
        "lat": 56.9516,
        "lng": 24.1064,
        "short": "L'unica porta sopravvissuta delle mura medievali della città di Riga, costruita durante il dominio svedese.",
        "shortEN": "The only surviving gate from Riga's medieval city walls, built during Swedish rule.",
        "desc": "La Porta Svedese è l'unica porta rimasta delle mura medievali originali della città di Riga. Costruita nel 1698 durante il periodo del dominio svedese, fu progettata per fornire accesso alle caserme fuori dalle mura della città. La porta è intrisa di leggende locali, tra cui storie di amore proibito tra una ragazza del posto e un soldato svedese. Attraversarla offre un legame tangibile con il passato fortificato di Riga.",
        "descEN": "The Swedish Gate is the only remaining gate of the original medieval city walls of Riga. Built in 1698 during the period of Swedish rule, it was designed to provide access to the barracks outside the city walls. The gate is steeped in local legends, including tales of forbidden love between a local girl and a Swedish soldier. Walking through it offers a tangible connection to Riga's fortified past.",
        "tips": "Situata in via Torņa, è un ottimo posto per foto suggestive.",
        "tipsEN": "Located on Torņa street, it's a great spot for atmospheric photos.",
        "src": [
          "Wikipedia: Swedish Gate (Riga)"
        ],
        "maps": "https://maps.google.com/?q=56.9516,24.1064"
      },
      {
        "id": "rig-10",
        "name": "Riga Castle",
        "nameEN": "Riga Castle",
        "cat": "cultura",
        "lat": 56.9508,
        "lng": 24.1006,
        "short": "Uno storico castello sul fiume Daugava che oggi funge da residenza del Presidente lettone.",
        "shortEN": "A historic castle on the Daugava River that now serves as the residence of the Latvian President.",
        "desc": "Situato sulle rive del fiume Daugava, il Castello di Riga fu originariamente fondato nel 1330 come fortezza per l'Ordine di Livonia. Nel corso dei secoli è stato distrutto e ricostruito più volte, fondendo vari stili architettonici. Oggi funge da residenza ufficiale del Presidente della Lettonia e ospita diversi musei, tra cui il Museo Nazionale di Storia della Lettonia. Le sue robuste mura gialle e le torri distinte sono una parte fondamentale del paesaggio urbano.",
        "descEN": "Situated on the banks of the Daugava River, Riga Castle was originally founded in 1330 as a fortress for the Livonian Order. Over the centuries, it has been destroyed and rebuilt multiple times, blending various architectural styles. Today, it serves as the official residence of the President of Latvia and houses several museums, including the Latvian National Museum of History. Its robust yellow walls and distinct towers are a key part of the cityscape.",
        "tips": "Mentre le aree presidenziali sono riservate, i musei all'interno sono aperti al pubblico.",
        "tipsEN": "While the presidential areas are restricted, the museums inside are open to the public.",
        "src": [
          "Wikipedia: Riga Castle"
        ],
        "maps": "https://maps.google.com/?q=56.9508,24.1006"
      },
      {
        "id": "rig-11",
        "name": "Latvian National Opera",
        "nameEN": "Latvian National Opera",
        "cat": "cultura",
        "lat": 56.9496,
        "lng": 24.1139,
        "short": "Un magnifico edificio neoclassico che ospita i principali spettacoli di opera e balletto della Lettonia.",
        "shortEN": "A magnificent neo-classical building hosting Latvia's premier opera and ballet performances.",
        "desc": "L'Opera e il Balletto Nazionale Lettone sono ospitati in uno splendido edificio neoclassico completato nel 1863. Situato vicino al canale della città e circondato da splendidi giardini, è il luogo principale per la musica classica, l'opera e il balletto in Lettonia. L'interno è riccamente decorato, offrendo un'atmosfera grandiosa per spettacoli di livello mondiale. Anche se non si assiste a uno spettacolo, l'esterno dell'edificio è un gioiello architettonico da non perdere.",
        "descEN": "The Latvian National Opera and Ballet is housed in a stunning neo-classical building completed in 1863. Located near the city canal and surrounded by beautiful gardens, it is the premier venue for classical music, opera, and ballet in Latvia. The interior is lavishly decorated, providing a grand atmosphere for world-class performances. Even if you don't attend a show, the building's exterior is a must-see architectural gem.",
        "tips": "Sono disponibili visite guidate dell'interno, oppure è possibile prenotare i biglietti per uno spettacolo serale.",
        "tipsEN": "Guided tours of the interior are available, or you can book tickets for an evening performance.",
        "src": [
          "Wikipedia: Latvian National Opera"
        ],
        "maps": "https://maps.google.com/?q=56.9496,24.1139"
      },
      {
        "id": "rig-12",
        "name": "Powder Tower",
        "nameEN": "Powder Tower",
        "cat": "cultura",
        "lat": 56.9511,
        "lng": 24.1086,
        "short": "Una massiccia torre difensiva medievale che oggi ospita il Museo della Guerra Lettone.",
        "shortEN": "A massive medieval defensive tower that now houses the Latvian War Museum.",
        "desc": "La Torre delle Polveri è una delle torri difensive originali delle mura medievali della città di Riga, menzionata per la prima volta nel 1330. Ha acquisito il suo nome attuale nel XVII secolo quando veniva utilizzata per conservare la polvere da sparo. La massiccia struttura cilindrica ha mura spesse fino a tre metri e porta ancora i segni delle palle di cannone russe degli assedi storici. Oggi fa parte del Museo della Guerra Lettone, offrendo approfondimenti sulla storia militare della nazione.",
        "descEN": "The Powder Tower is one of the original defensive towers of Riga's medieval city walls, first mentioned in 1330. It gained its current name in the 17th century when it was used to store gunpowder. The massive cylindrical structure has walls up to three meters thick and still bears the scars of Russian cannonballs from historical sieges. Today, it forms part of the Latvian War Museum, offering deep insights into the nation's military history.",
        "tips": "L'ingresso al Museo della Guerra Lettone all'interno della torre è gratuito.",
        "tipsEN": "Entrance to the Latvian War Museum inside the tower is free of charge.",
        "src": [
          "Wikipedia: Powder Tower, Riga"
        ],
        "maps": "https://maps.google.com/?q=56.9511,24.1086"
      },
      {
        "tier": 1,
        "id": "rig-13",
        "name": "Cat House",
        "nameEN": "Cat House",
        "cat": "cultura",
        "lat": 56.9493,
        "lng": 24.1086,
        "short": "Un iconico edificio in stile Art Nouveau famoso per le statue di gatti in rame sul tetto.",
        "shortEN": "An iconic Art Nouveau building famous for the defiant copper cat statues on its roof.",
        "desc": "La Casa dei Gatti è un famoso edificio in stile Art Nouveau nel centro storico, rinomato per le due statue di gatti in rame appollaiate sulle torrette del tetto. Secondo la leggenda locale, il ricco commerciante che la costruì fu respinto dalla Grande Gilda dall'altra parte della strada, così posizionò i gatti con le code rivolte verso la Gilda in segno di sfida. L'edificio stesso presenta un'architettura elegante ed è uno dei punti di riferimento più fotografati di Riga.",
        "descEN": "The Cat House is a famous Art Nouveau building in the Old Town, renowned for the two copper cat statues perched on its roof turrets. According to local legend, the wealthy tradesman who built it was rejected by the Great Guild across the street, so he placed the cats with their tails turned toward the Guild in defiance. The building itself features elegant architecture and is one of Riga's most photographed landmarks.",
        "tips": "Si vede meglio dalla piazza di fronte alla Grande Gilda per l'angolazione fotografica perfetta.",
        "tipsEN": "Best viewed from the square in front of the Great Guild for the perfect photo angle.",
        "src": [
          "Wikipedia: Cat House, Riga"
        ],
        "maps": "https://maps.google.com/?q=56.9493,24.1086"
      },
      {
        "id": "rig-14",
        "name": "Vērmanes Garden",
        "nameEN": "Vērmanes Garden",
        "cat": "natura",
        "lat": 56.9519,
        "lng": 24.1181,
        "short": "Il parco pubblico più antico di Riga, che offre un tranquillo rifugio verde con fontane e un palcoscenico all'aperto.",
        "shortEN": "Riga's oldest public park, offering a peaceful green retreat with fountains and an open-air stage.",
        "desc": "Il Giardino Vērmanes è il parco pubblico più antico di Riga, istituito nel 1814 grazie a una generosa donazione di Anna Gertrud Wöhrmann. Questa lussureggiante oasi verde nel centro della città presenta un bellissimo roseto, una pittoresca fontana e un palcoscenico all'aperto che ospita concerti in estate. È il luogo preferito dalla gente del posto per rilassarsi, giocare a scacchi o godersi una passeggiata tranquilla lontano dalle strade trafficate.",
        "descEN": "Vērmanes Garden is the oldest public park in Riga, established in 1814 thanks to a generous donation from Anna Gertrud Wöhrmann. This lush, green oasis in the city center features a beautiful rose garden, a picturesque fountain, and an open-air stage that hosts concerts in the summer. It is a favorite spot for locals to relax, play chess, or enjoy a peaceful stroll away from the bustling streets.",
        "tips": "Un ottimo posto per un picnic o per prendere un caffè in uno dei chioschi vicini.",
        "tipsEN": "A great place for a picnic or to grab a coffee from one of the nearby kiosks.",
        "src": [
          "Wikipedia: Vērmanes Garden"
        ],
        "maps": "https://maps.google.com/?q=56.9519,24.1181"
      },
      {
        "id": "rig-15",
        "name": "Nativity of Christ Cathedral",
        "nameEN": "Nativity of Christ Cathedral",
        "cat": "cultura",
        "lat": 56.9542,
        "lng": 24.1158,
        "short": "La più grande cattedrale ortodossa di Riga, nota per la sua splendida architettura neo-bizantina e le cupole dorate.",
        "shortEN": "The largest Orthodox cathedral in Riga, known for its stunning Neo-Byzantine architecture and gold domes.",
        "desc": "La Cattedrale della Natività di Cristo è la più grande chiesa ortodossa di Riga, sorprendente con la sua architettura neo-bizantina e le scintillanti cupole dorate. Costruita durante l'era dell'Impero russo alla fine del XIX secolo, è sopravvissuta al periodo sovietico quando è stata controversamente trasformata in un planetario e un caffè. Oggi è stata completamente riportata al suo antico splendore, con icone mozzafiato e un'atmosfera profondamente spirituale all'interno.",
        "descEN": "The Nativity of Christ Cathedral is the largest Orthodox church in Riga, striking with its Neo-Byzantine architecture and gleaming gold domes. Built during the Russian Empire era in the late 19th century, it survived the Soviet period when it was controversially converted into a planetarium and a café. Today, it has been fully restored to its former glory, featuring stunning icons and a deeply spiritual atmosphere inside.",
        "tips": "Per entrare è richiesto un abbigliamento modesto; le donne sono incoraggiate a coprirsi il capo.",
        "tipsEN": "Modest dress is required to enter; women are encouraged to cover their heads.",
        "src": [
          "Wikipedia: Nativity of Christ Cathedral, Riga"
        ],
        "maps": "https://maps.google.com/?q=56.9542,24.1158"
      },
      {
        "id": "rig-16",
        "name": "Latvian National Museum of Art",
        "nameEN": "Latvian National Museum of Art",
        "cat": "cultura",
        "lat": 56.9558,
        "lng": 24.1131,
        "short": "Il principale museo d'arte in Lettonia, che presenta capolavori nazionali in un edificio storico magnificamente restaurato.",
        "shortEN": "The premier art museum in Latvia, featuring national masterpieces in a beautifully restored historic building.",
        "desc": "Ospitato in un maestoso edificio storicista, il Museo Nazionale d'Arte Lettone è il più importante deposito di arte professionale del paese. Il museo espone una collezione completa di arte lettone dal XVIII secolo ai giorni nostri, mettendo in risalto i capolavori nazionali. Dopo un'importante ristrutturazione, ora dispone di moderne sale espositive sotterranee e di una splendida terrazza con tetto in vetro che offre viste uniche sul parco circostante.",
        "descEN": "Housed in a majestic historicist building, the Latvian National Museum of Art is the most significant depository of professional art in the country. The museum showcases a comprehensive collection of Latvian art from the 18th century to the present day, highlighting national masterpieces. Following a major renovation, it now features modern underground exhibition halls and a stunning glass roof terrace that offers unique views of the surrounding park.",
        "tips": "Non perdetevi le terrazze con tetto in vetro per una prospettiva architettonica unica e viste sulla città.",
        "tipsEN": "Don't miss the glass roof terraces for a unique architectural perspective and city views.",
        "src": [
          "Wikipedia: Latvian National Museum of Art"
        ],
        "maps": "https://maps.google.com/?q=56.9558,24.1131"
      },
      {
        "id": "rig-17",
        "name": "Museum of the Occupation of Latvia",
        "nameEN": "Museum of the Occupation of Latvia",
        "cat": "cultura",
        "lat": 56.9472,
        "lng": 24.1044,
        "short": "Un potente museo che documenta la storia della Lettonia sotto le occupazioni sovietica e nazista dal 1940 al 1991.",
        "shortEN": "A powerful museum documenting Latvia's history under Soviet and Nazi occupations from 1940 to 1991.",
        "desc": "Il Museo dell'Occupazione della Lettonia offre uno sguardo sobrio ed essenziale sulla storia del paese dal 1940 al 1991. Descrive in dettaglio i periodi di occupazione sia da parte dell'Unione Sovietica che della Germania nazista, evidenziando il profondo impatto sul popolo, sulla cultura e sullo stato lettone. Attraverso ampi manufatti, documenti e testimonianze personali, il museo educa i visitatori sulla resilienza della nazione durante i suoi tempi più bui.",
        "descEN": "The Museum of the Occupation of Latvia provides a sobering and essential look into the country's history from 1940 to 1991. It details the periods of occupation by both the Soviet Union and Nazi Germany, highlighting the profound impact on the Latvian people, culture, and statehood. Through extensive artifacts, documents, and personal testimonies, the museum educates visitors on the resilience of the nation during its darkest times.",
        "tips": "Le mostre sono ricche di testi ed emotivamente d'impatto; calcolate almeno 1,5 ore per una visita.",
        "tipsEN": "The exhibits are text-heavy and emotionally impactful; allocate at least 1.5 hours for a visit.",
        "src": [
          "Wikipedia: Museum of the Occupation of Latvia"
        ],
        "maps": "https://maps.google.com/?q=56.9472,24.1044"
      },
      {
        "id": "rig-18",
        "name": "St. John's Church",
        "nameEN": "St. John's Church",
        "cat": "cultura",
        "lat": 56.9478,
        "lng": 24.1106,
        "short": "Una storica chiesa del XIII secolo caratterizzata da un'architettura tardo gotica e uno splendido soffitto con volta a costoloni.",
        "shortEN": "A historic 13th-century church featuring late Gothic architecture and a stunning ribbed vault ceiling.",
        "desc": "La Chiesa di San Giovanni è un bellissimo esempio di architettura tardo gotica a Riga, originariamente costruita come cappella domenicana nel XIII secolo. Presenta un suggestivo timpano a gradoni e un interno unico con uno splendido soffitto con volta a costoloni. La chiesa è nota anche per le due maschere di pietra sulla parete esterna, che, secondo la leggenda, venivano utilizzate dai monaci per predicare al pubblico. Oggi rimane una chiesa luterana attiva.",
        "descEN": "St. John's Church is a beautiful example of late Gothic architecture in Riga, originally built as a Dominican chapel in the 13th century. It features a striking stepped gable and a unique interior with a stunning ribbed vault ceiling. The church is also known for the two stone masks on its exterior wall, which, according to legend, were used by monks to preach to the public. It remains an active Lutheran church today.",
        "tips": "Cercate la piccola apertura nel muro dove si dice che due monaci siano stati murati vivi.",
        "tipsEN": "Look for the small opening in the wall where two monks were allegedly walled up alive.",
        "src": [
          "Wikipedia: St. John's Church, Riga"
        ],
        "maps": "https://maps.google.com/?q=56.9478,24.1106"
      },
      {
        "id": "rig-19",
        "name": "Esplanāde Park",
        "nameEN": "Esplanāde Park",
        "cat": "natura",
        "lat": 56.9536,
        "lng": 24.1136,
        "short": "Un ampio parco centrale che è passato da piazza d'armi militare a lussureggiante spazio pubblico.",
        "shortEN": "A spacious central park that transitioned from a military parade ground to a lush public space.",
        "desc": "L'Esplanāde è un grande parco magnificamente paesaggistico situato tra il centro storico e il quartiere in stile Art Nouveau. Originariamente una piazza d'armi militare, fu trasformato in un parco pubblico alla fine del XIX secolo. Il parco ospita numerosi monumenti ed edifici importanti, tra cui la Cattedrale della Natività di Cristo e il Museo Nazionale d'Arte Lettone. I suoi ampi viali alberati lo rendono un luogo perfetto per una passeggiata rilassante.",
        "descEN": "Esplanāde is a large, beautifully landscaped park situated between the Old Town and the Art Nouveau district. Originally a military parade ground, it was transformed into a public park in the late 19th century. The park is home to several important monuments and buildings, including the Nativity of Christ Cathedral and the Latvian National Museum of Art. Its wide, tree-lined avenues make it a perfect place for a relaxing walk.",
        "tips": "Un'ottima area di transizione da attraversare quando ci si dirige dal centro storico al quartiere in stile Art Nouveau.",
        "tipsEN": "A great transitional area to walk through when heading from the Old Town to the Art Nouveau district.",
        "src": [
          "Wikipedia: Esplanāde (Riga)"
        ],
        "maps": "https://maps.google.com/?q=56.9536,24.1136"
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
        "tier": 1,
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 2,
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
      },
      {
        "tier": 1,
        "id": "tal-6",
        "name": "St. Olaf's Church",
        "nameEN": "St. Olaf's Church",
        "cat": "panorama",
        "lat": 59.4414,
        "lng": 24.7475,
        "short": "Storica chiesa gotica con una torre che offre viste panoramiche mozzafiato sulla città.",
        "shortEN": "Historic Gothic church featuring a tower that offers breathtaking panoramic views of the city.",
        "desc": "La Chiesa di Sant'Olav, un tempo l'edificio più alto del mondo, è un simbolo iconico di Tallinn. Costruita nel XII secolo, la sua imponente guglia gotica domina lo skyline della città. I visitatori possono salire i 232 gradini fino alla piattaforma panoramica per godere di una vista mozzafiato a 360 gradi sul centro storico e sul porto. L'interno della chiesa è sobrio ma suggestivo, riflettendo la sua storia travagliata di incendi e ricostruzioni.",
        "descEN": "St. Olaf's Church, once the tallest building in the world, is an iconic symbol of Tallinn. Built in the 12th century, its massive Gothic spire dominates the city's skyline. Visitors can climb the 232 steps to the viewing platform to enjoy breathtaking 360-degree views of the Old Town and the harbor. The church's interior is austere yet striking, reflecting its turbulent history of fires and reconstructions.",
        "tips": "La salita alla torre è ripida e stretta; aperta da aprile a ottobre.",
        "tipsEN": "The climb to the tower is steep and narrow; open from April to October.",
        "src": [
          "Wikipedia",
          "Visit Tallinn"
        ],
        "maps": "https://maps.google.com/?q=59.4414,24.7475"
      },
      {
        "tier": 1,
        "id": "tal-7",
        "name": "Toompea Castle",
        "nameEN": "Toompea Castle",
        "cat": "cultura",
        "lat": 59.4353,
        "lng": 24.7372,
        "short": "Imponente castello storico che ospita il Parlamento estone, con la celebre torre di Pikk Hermann.",
        "shortEN": "Imposing historic castle housing the Estonian Parliament, featuring the famous Pikk Hermann tower.",
        "desc": "Il Castello di Toompea, situato sull'omonima collina, è la sede del Parlamento estone (Riigikogu). La struttura mescola stili architettonici diversi, dalla fortezza medievale in pietra alla facciata barocca rosa del palazzo settecentesco. La torre di Pikk Hermann, alta 46 metri, è un simbolo nazionale dove ogni mattina viene issata la bandiera estone. È un luogo fondamentale per comprendere la storia politica e l'indipendenza dell'Estonia.",
        "descEN": "Toompea Castle, situated on the hill of the same name, is the seat of the Estonian Parliament (Riigikogu). The structure blends different architectural styles, from the medieval stone fortress to the pink Baroque facade of the 18th-century palace. The 46-meter-tall Pikk Hermann tower is a national symbol where the Estonian flag is raised every morning. It is a fundamental site for understanding Estonia's political history and independence.",
        "tips": "Visite guidate gratuite del parlamento disponibili su prenotazione.",
        "tipsEN": "Free guided tours of the parliament are available upon reservation.",
        "src": [
          "Wikipedia",
          "Riigikogu"
        ],
        "maps": "https://maps.google.com/?q=59.4353,24.7372"
      },
      {
        "id": "tal-8",
        "name": "St. Nicholas Church",
        "nameEN": "St. Nicholas Church",
        "cat": "cultura",
        "lat": 59.4358,
        "lng": 24.7426,
        "short": "Ex chiesa medievale ora museo d'arte sacra, celebre per il dipinto 'Danza Macabra'.",
        "shortEN": "Former medieval church now a museum of sacred art, famous for the 'Danse Macabre' painting.",
        "desc": "La Chiesa di San Nicola è un ex edificio religioso medievale trasformato in un museo d'arte ecclesiastica. Ospita capolavori inestimabili, tra cui il famoso dipinto 'Danza Macabra' di Bernt Notke, che raffigura la fragilità della vita umana. Il museo espone anche altari lignei finemente intagliati e argenteria storica. La sua acustica eccezionale la rende una sede popolare per concerti di musica classica e corale.",
        "descEN": "St. Nicholas Church is a former medieval religious building transformed into a museum of ecclesiastical art. It houses priceless masterpieces, including the famous 'Danse Macabre' painting by Bernt Notke, which depicts the fragility of human life. The museum also exhibits finely carved wooden altars and historic silverware. Its exceptional acoustics make it a popular venue for classical and choral music concerts.",
        "tips": "Ingresso a pagamento; controlla il programma per i concerti d'organo del fine settimana.",
        "tipsEN": "Paid entry; check the schedule for weekend organ concerts.",
        "src": [
          "Wikipedia",
          "Art Museum of Estonia"
        ],
        "maps": "https://maps.google.com/?q=59.4358,24.7426"
      },
      {
        "tier": 1,
        "id": "tal-9",
        "name": "Kiek in de Kök Museum and Bastion Tunnels",
        "nameEN": "Kiek in de Kök Museum and Bastion Tunnels",
        "cat": "cultura",
        "lat": 59.4347,
        "lng": 24.7405,
        "short": "Torre di artiglieria medievale e rete di tunnel sotterranei che raccontano la storia militare della città.",
        "shortEN": "Medieval artillery tower and network of underground tunnels recounting the city's military history.",
        "desc": "Kiek in de Kök è una massiccia torre di artiglieria del XV secolo, il cui nome in basso tedesco significa 'sbircia in cucina'. Oggi ospita un affascinante museo dedicato alla storia delle fortificazioni di Tallinn e alle armi antiche. Dalla torre si accede ai misteriosi tunnel dei bastioni, costruiti nel XVII secolo per scopi militari e usati come rifugi antiaerei durante la Seconda Guerra Mondiale. L'esplorazione offre un viaggio unico nel sottosuolo della città.",
        "descEN": "Kiek in de Kök is a massive 15th-century artillery tower, whose Low German name means 'peek into the kitchen.' Today it houses a fascinating museum dedicated to the history of Tallinn's fortifications and ancient weapons. From the tower, visitors can access the mysterious bastion tunnels, built in the 17th century for military purposes and used as bomb shelters during World War II. The exploration offers a unique journey into the city's underground.",
        "tips": "I tunnel possono essere freddi, si consiglia di portare una giacca leggera.",
        "tipsEN": "The tunnels can be chilly, so bringing a light jacket is recommended.",
        "src": [
          "Wikipedia",
          "Tallinn City Museum"
        ],
        "maps": "https://maps.google.com/?q=59.4347,24.7405"
      },
      {
        "id": "tal-10",
        "name": "Patkuli viewing platform",
        "nameEN": "Patkuli viewing platform",
        "cat": "panorama",
        "lat": 59.4384,
        "lng": 24.7396,
        "short": "Terrazza panoramica che offre viste spettacolari sulle mura medievali e sul Mar Baltico.",
        "shortEN": "Panoramic terrace offering spectacular views of the medieval walls and the Baltic Sea.",
        "desc": "La piattaforma panoramica di Patkuli offre una delle viste più pittoresche e fotografate di Tallinn. Situata sul lato nord della collina di Toompea, regala una prospettiva perfetta sulle mura medievali, le torri di guardia e il porto in lontananza. È il luogo ideale per ammirare il contrasto tra i tetti rossi della Città Vecchia e il blu del Mar Baltico. Particolarmente suggestiva al tramonto, è accessibile tramite una scalinata che sale dalla città bassa.",
        "descEN": "The Patkuli viewing platform offers one of the most picturesque and photographed views of Tallinn. Located on the north side of Toompea Hill, it provides a perfect perspective of the medieval walls, watchtowers, and the harbor in the distance. It is the ideal spot to admire the contrast between the red roofs of the Old Town and the blue of the Baltic Sea. Particularly striking at sunset, it is accessible via a staircase leading up from the lower town.",
        "tips": "Accessibile gratuitamente 24 ore su 24; preparati a salire 157 gradini se arrivi dal basso.",
        "tipsEN": "Accessible for free 24/7; be prepared to climb 157 steps if coming from below.",
        "src": [
          "Visit Tallinn",
          "Wikipedia"
        ],
        "maps": "https://maps.google.com/?q=59.4384,24.7396"
      },
      {
        "id": "tal-11",
        "name": "St. Catherine's Passage",
        "nameEN": "St. Catherine's Passage",
        "cat": "cultura",
        "lat": 59.4378,
        "lng": 24.7483,
        "short": "Pittoresco vicolo medievale fiancheggiato da botteghe artigiane tradizionali e archi in pietra.",
        "shortEN": "Picturesque medieval alley lined with traditional artisan workshops and stone arches.",
        "desc": "Il Passaggio di Santa Caterina è una delle stradine più romantiche e fotogeniche della Città Vecchia di Tallinn. Questo vicolo acciottolato e semi-nascosto collega via Vene a via Müürivahe, costeggiando i resti dell'antica chiesa di Santa Caterina. È fiancheggiato da botteghe artigiane dove si possono osservare artisti al lavoro su vetro, ceramica, gioielli e tessuti. L'atmosfera medievale è esaltata dagli archi in pietra che sovrastano il passaggio.",
        "descEN": "St. Catherine's Passage is one of the most romantic and photogenic streets in Tallinn's Old Town. This cobbled, semi-hidden alley connects Vene Street to Müürivahe Street, running alongside the remains of the ancient St. Catherine's Church. It is lined with artisan workshops where visitors can watch artists working on glass, ceramics, jewelry, and textiles. The medieval atmosphere is enhanced by the stone arches spanning the passage.",
        "tips": "Ottimo posto per acquistare souvenir artigianali unici e di alta qualità.",
        "tipsEN": "Great place to buy unique, high-quality handcrafted souvenirs.",
        "src": [
          "Visit Tallinn",
          "Lonely Planet"
        ],
        "maps": "https://maps.google.com/?q=59.4378,24.7483"
      },
      {
        "id": "tal-12",
        "name": "Fat Margaret",
        "nameEN": "Fat Margaret",
        "cat": "cultura",
        "lat": 59.4426,
        "lng": 24.7494,
        "short": "Massiccia torre difensiva che ospita il Museo Marittimo Estone e offre viste dal tetto.",
        "shortEN": "Massive defensive tower housing the Estonian Maritime Museum and offering rooftop views.",
        "desc": "La torre di Margherita la Grassa è una massiccia struttura difensiva del XVI secolo, costruita per proteggere la città dagli attacchi marittimi. Con le sue pareti spesse fino a cinque metri, è un impressionante esempio di architettura militare medievale. Oggi ospita il Museo Marittimo Estone, che espone modelli di navi, strumenti di navigazione e il relitto di una nave mercantile medievale (cog). La terrazza sul tetto offre una splendida vista sul porto e sulla Città Vecchia.",
        "descEN": "Fat Margaret is a massive 16th-century defensive tower built to protect the city from maritime attacks. With walls up to five meters thick, it is an impressive example of medieval military architecture. Today it houses the Estonian Maritime Museum, which exhibits ship models, navigational instruments, and the wreck of a medieval merchant ship (cog). The rooftop terrace offers a splendid view of the harbor and the Old Town.",
        "tips": "Il biglietto include l'accesso alla terrazza panoramica sul tetto, aperta in estate.",
        "tipsEN": "The ticket includes access to the rooftop viewing terrace, open in summer.",
        "src": [
          "Wikipedia",
          "Estonian Maritime Museum"
        ],
        "maps": "https://maps.google.com/?q=59.4426,24.7494"
      },
      {
        "id": "tal-13",
        "name": "Freedom Square",
        "nameEN": "Freedom Square",
        "cat": "cultura",
        "lat": 59.4338,
        "lng": 24.7446,
        "short": "Ampia piazza pedonale dominata dal monumento in vetro dedicato all'indipendenza estone.",
        "shortEN": "Large pedestrian square dominated by the glass monument dedicated to Estonian independence.",
        "desc": "Piazza della Libertà è il cuore civico e moderno di Tallinn, un ampio spazio pedonale circondato da edifici eleganti. Dominata dalla Colonna della Vittoria della Guerra d'Indipendenza, una struttura in vetro illuminata, la piazza è un simbolo dell'orgoglio nazionale estone. È un luogo di ritrovo popolare, spesso utilizzato per concerti, parate e celebrazioni pubbliche. Sotto la piazza si trovano resti archeologici visibili attraverso pannelli di vetro e un centro commerciale sotterraneo.",
        "descEN": "Freedom Square is the civic and modern heart of Tallinn, a large pedestrian space surrounded by elegant buildings. Dominated by the War of Independence Victory Column, an illuminated glass structure, the square is a symbol of Estonian national pride. It is a popular gathering place, often used for concerts, parades, and public celebrations. Beneath the square lie archaeological remains visible through glass panels and an underground shopping center.",
        "tips": "Particolarmente suggestiva la sera quando la Colonna della Vittoria è illuminata.",
        "tipsEN": "Particularly striking in the evening when the Victory Column is illuminated.",
        "src": [
          "Wikipedia",
          "Visit Tallinn"
        ],
        "maps": "https://maps.google.com/?q=59.4338,24.7446"
      },
      {
        "id": "tal-14",
        "name": "Rotermann Quarter",
        "nameEN": "Rotermann Quarter",
        "cat": "cibo",
        "lat": 59.4385,
        "lng": 24.7565,
        "short": "Vivace quartiere pedonale che fonde architettura industriale storica e design moderno, ricco di ristoranti.",
        "shortEN": "Vibrant pedestrian quarter blending historic industrial architecture with modern design, full of restaurants.",
        "desc": "Il Quartiere Rotermann è un eccellente esempio di rigenerazione urbana, dove l'architettura industriale del XIX secolo incontra il design contemporaneo. Un tempo zona di fabbriche e magazzini fatiscenti, oggi è un vivace centro commerciale e culturale. Le strade pedonali sono fiancheggiate da boutique alla moda, caffè accoglienti e alcuni dei migliori ristoranti di Tallinn. L'audace contrasto tra i vecchi mattoni rossi e le moderne strutture in vetro e acciaio lo rende un paradiso per gli amanti dell'architettura.",
        "descEN": "The Rotermann Quarter is an excellent example of urban regeneration, where 19th-century industrial architecture meets contemporary design. Once an area of dilapidated factories and warehouses, it is now a vibrant commercial and cultural hub. The pedestrian streets are lined with trendy boutiques, cozy cafes, and some of Tallinn's best restaurants. The bold contrast between old red bricks and modern glass and steel structures makes it a paradise for architecture lovers.",
        "tips": "Ottima zona per cenare o fare shopping lontano dalle folle della Città Vecchia.",
        "tipsEN": "Great area for dining or shopping away from the Old Town crowds.",
        "src": [
          "Wikipedia",
          "Visit Tallinn"
        ],
        "maps": "https://maps.google.com/?q=59.4385,24.7565"
      },
      {
        "tier": 1,
        "id": "tal-15",
        "name": "Telliskivi Creative City",
        "nameEN": "Telliskivi Creative City",
        "cat": "attivita",
        "lat": 59.4398,
        "lng": 24.7285,
        "short": "Ex area industriale trasformata in un vivace centro artistico con street art, gallerie e caffè.",
        "shortEN": "Former industrial area transformed into a vibrant artistic hub with street art, galleries, and cafes.",
        "desc": "Telliskivi Creative City è il cuore bohémien e artistico di Tallinn, situato in un ex complesso industriale di epoca sovietica. Questo vivace quartiere ospita studi di design, gallerie d'arte, uffici di startup e il rinomato museo fotografico Fotografiska. Le pareti degli edifici sono coperte da vivaci murales e opere di street art. È il luogo perfetto per scoprire la cultura alternativa estone, fare shopping nei mercatini delle pulci e gustare cibo di strada innovativo.",
        "descEN": "Telliskivi Creative City is the bohemian and artistic heart of Tallinn, located in a former Soviet-era industrial complex. This vibrant neighborhood is home to design studios, art galleries, startup offices, and the renowned Fotografiska photography museum. The building walls are covered with vibrant murals and street art. It is the perfect place to discover Estonian alternative culture, shop at flea markets, and enjoy innovative street food.",
        "tips": "Visita il sabato per il vivace mercatino delle pulci all'aperto.",
        "tipsEN": "Visit on Saturdays for the lively outdoor flea market.",
        "src": [
          "Wikipedia",
          "Visit Tallinn"
        ],
        "maps": "https://maps.google.com/?q=59.4398,24.7285"
      },
      {
        "id": "tal-16",
        "name": "Seaplane Harbour",
        "nameEN": "Seaplane Harbour",
        "cat": "cultura",
        "lat": 59.4516,
        "lng": 24.7383,
        "short": "Spettacolare museo marittimo situato in storici hangar per idrovolanti, con un vero sottomarino esplorabile.",
        "shortEN": "Spectacular maritime museum located in historic seaplane hangars, featuring a real explorable submarine.",
        "desc": "Il Porto degli Idrovolanti è uno dei musei marittimi più innovativi d'Europa, ospitato in enormi hangar storici costruiti originariamente per l'aviazione russa. L'architettura degli hangar, con le loro cupole in cemento armato senza pilastri, è di per sé un capolavoro ingegneristico. L'attrazione principale è il sottomarino Lembit degli anni '30, che i visitatori possono esplorare all'interno. Il museo offre anche simulatori di volo, acquari e navi storiche ormeggiate all'esterno, rendendolo ideale per tutte le età.",
        "descEN": "The Seaplane Harbour is one of Europe's most innovative maritime museums, housed in massive historic hangars originally built for Russian aviation. The architecture of the hangars, with their pillarless reinforced concrete domes, is an engineering masterpiece in itself. The main attraction is the 1930s submarine Lembit, which visitors can explore inside. The museum also offers flight simulators, aquariums, and historic ships moored outside, making it ideal for all ages.",
        "tips": "Calcola almeno due ore per la visita; il museo è molto interattivo e adatto alle famiglie.",
        "tipsEN": "Allow at least two hours for the visit; the museum is highly interactive and family-friendly.",
        "src": [
          "Wikipedia",
          "Estonian Maritime Museum"
        ],
        "maps": "https://maps.google.com/?q=59.4516,24.7383"
      },
      {
        "id": "tal-17",
        "name": "Masters' Courtyard",
        "nameEN": "Masters' Courtyard",
        "cat": "cultura",
        "lat": 59.4375,
        "lng": 24.7472,
        "short": "Tranquillo cortile medievale dedicato all'artigianato locale, sede di una celebre e accogliente cioccolateria.",
        "shortEN": "Quiet medieval courtyard dedicated to local crafts, home to a famous and cozy chocolaterie.",
        "desc": "Il Cortile dei Maestri è un angolo nascosto e incantevole della Città Vecchia, dedicato a preservare le tradizioni artigianali di Tallinn. Questo tranquillo cortile medievale ospita laboratori dove artigiani locali creano e vendono gioielli, ceramiche e tessuti fatti a mano. L'atmosfera è resa ancora più magica dalla presenza della famosa Chocolaterie Pierre, un caffè dall'arredamento eclettico e bohémien. È il luogo ideale per sfuggire al trambusto delle strade principali e gustare ottimi dolci.",
        "descEN": "The Masters' Courtyard is a hidden and enchanting corner of the Old Town, dedicated to preserving Tallinn's artisanal traditions. This quiet medieval courtyard houses workshops where local artisans create and sell handmade jewelry, ceramics, and textiles. The atmosphere is made even more magical by the presence of the famous Chocolaterie Pierre, a cafe with eclectic and bohemian decor. It is the ideal place to escape the bustle of the main streets and enjoy excellent pastries.",
        "tips": "Non perderti la cioccolata calda e i tartufi artigianali della Chocolaterie Pierre.",
        "tipsEN": "Don't miss the hot chocolate and artisanal truffles at Chocolaterie Pierre.",
        "src": [
          "Visit Tallinn",
          "Lonely Planet"
        ],
        "maps": "https://maps.google.com/?q=59.4375,24.7472"
      },
      {
        "id": "tal-18",
        "name": "Holy Spirit Church",
        "nameEN": "Holy Spirit Church",
        "cat": "cultura",
        "lat": 59.4381,
        "lng": 24.7456,
        "short": "Storica chiesa con il più antico orologio pubblico della città e un magnifico altare ligneo.",
        "shortEN": "Historic church featuring the city's oldest public clock and a magnificent wooden altar.",
        "desc": "La Chiesa dello Spirito Santo è un gioiello architettonico del XIV secolo, facilmente riconoscibile per la sua torre ottagonale bianca e il tetto in legno. Sulla facciata esterna spicca il più antico orologio pubblico di Tallinn, finemente dipinto e risalente al XVII secolo. L'interno è intimo e riccamente decorato, con un magnifico altare ligneo scolpito da Bernt Notke e gallerie dipinte con scene bibliche. È stata una delle prime chiese a tenere sermoni in lingua estone.",
        "descEN": "The Holy Spirit Church is a 14th-century architectural gem, easily recognizable by its white octagonal tower and wooden roof. The exterior facade features Tallinn's oldest public clock, finely painted and dating back to the 17th century. The interior is intimate and richly decorated, with a magnificent wooden altar carved by Bernt Notke and galleries painted with biblical scenes. It was one of the first churches to hold sermons in the Estonian language.",
        "tips": "L'ingresso è a pagamento; l'interno in legno scuro offre un'atmosfera molto suggestiva.",
        "tipsEN": "Entry is paid; the dark wooden interior offers a very evocative atmosphere.",
        "src": [
          "Wikipedia",
          "Visit Tallinn"
        ],
        "maps": "https://maps.google.com/?q=59.4381,24.7456"
      }
    ]
  },
  "helsinki": {
    "city": "Helsinki",
    "cityEN": "Helsinki",
    "country": "Finlandia",
    "countryEN": "Finland",
    "flag": "🇫🇮",
    "intro": "Esplora Helsinki partendo dal porto: una capitale compatta, verde e affacciata sul Baltico, perfetta da girare in monopattino tra mercati, cattedrali e sorprendenti spazi moderni a misura di famiglia. ⚠️ Dal 17 giugno 2025 i monopattini elettrici (oltre 15 km/h) sono vietati ai minori di 15 anni, anche a noleggio: i bambini più piccoli dovranno salire con un adulto o spostarsi a piedi.",
    "introEN": "Explore Helsinki starting from the harbour: a compact, green capital on the Baltic, perfect to tour by e-scooter among markets, cathedrals and surprisingly family-friendly modern spaces. ⚠️ Since 17 June 2025, e-scooters (faster than 15 km/h) are banned for under-15s, including rentals: younger children must ride with an adult or go on foot.",
    "center": [
      60.1680,
      24.9520
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 1,
        "id": "hel-1",
        "name": "Kauppatori (Piazza del Mercato)",
        "nameEN": "Kauppatori (Market Square)",
        "cat": "cibo",
        "lat": 60.16743,
        "lng": 24.95261,
        "short": "La vivace piazza del mercato sul porto: punto di partenza e noleggio monopattini.",
        "shortEN": "The lively market square on the harbour: starting point and e-scooter pickup.",
        "desc": "Kauppatori è la storica piazza del mercato di Helsinki, affacciata direttamente sul Mar Baltico e riconoscibile per i caratteristici tendoni arancioni. È il punto di partenza ideale dell'itinerario: qui si trovano numerosi monopattini a noleggio e bancarelle che vendono souvenir tipici in legno, pellicce di renna e prodotti artigianali. Sul fronte gastronomico è il posto giusto per assaggiare street food finlandese come la zuppa di salmone, le polpette di renna e i muikku fritti, piccoli pesciolini di lago. La vista sul porto e sul viavai dei traghetti rende l'atmosfera vivace e piacevole.",
        "descEN": "Kauppatori is Helsinki's historic market square, facing the Baltic Sea and recognisable by its distinctive orange tents. It is the ideal starting point for the itinerary: plenty of rental e-scooters are parked here, alongside stalls selling typical wooden souvenirs, reindeer furs and handicrafts. For food, this is the place to try Finnish street food such as salmon soup, reindeer meatballs and fried muikku, small lake fish. The view over the harbour and the ferry traffic makes for a lively, pleasant atmosphere.",
        "tips": "Configura in anticipo l'app di noleggio (Tier, Voi o Lime). Piatti tipici delle bancarelle: circa 10 euro.",
        "tipsEN": "Set up the rental app (Tier, Voi or Lime) in advance. Stall dishes cost around 10 euros.",
        "src": [
          "Profumo di Follia: Helsinki in un giorno",
          "Visit Finland"
        ],
        "maps": "https://maps.google.com/?q=60.16743,24.95261"
      },
      {
        "tier": 2,
        "id": "hel-2",
        "name": "Havis Amanda",
        "nameEN": "Havis Amanda",
        "cat": "cultura",
        "lat": 60.16719,
        "lng": 24.94944,
        "short": "L'iconica fontana con la ninfa del mare, a due passi dal mercato.",
        "shortEN": "The iconic sea-nymph fountain, a stone's throw from the market.",
        "desc": "A pochi metri da Kauppatori si trova la Havis Amanda, una delle statue più amate di Helsinki. Scolpita da Ville Vallgren e inaugurata nel 1908, raffigura una giovane donna che emerge dalle onde, circondata da quattro foche in bronzo che spruzzano acqua: un dettaglio che diverte molto i bambini. La statua rappresenta simbolicamente la rinascita della città. Durante la festa del primo maggio (Vappu) gli studenti la decorano con il tradizionale berretto dei diplomati.",
        "descEN": "Just steps from Kauppatori stands Havis Amanda, one of Helsinki's most beloved statues. Sculpted by Ville Vallgren and unveiled in 1908, it depicts a young woman rising from the waves, surrounded by four bronze seals that spout water — a detail children love. The statue symbolises the city's rebirth. During the May Day celebration (Vappu), students decorate it with the traditional graduate's cap.",
        "tips": "Perfetta per una foto ricordo con i bambini.",
        "tipsEN": "Perfect for a family photo with the kids.",
        "src": [
          "Profumo di Follia: Helsinki in un giorno"
        ],
        "maps": "https://maps.google.com/?q=60.16719,24.94944"
      },
      {
        "tier": 1,
        "id": "hel-3",
        "name": "Vanha Kauppahalli (Mercato Coperto)",
        "nameEN": "Vanha Kauppahalli (Old Market Hall)",
        "cat": "cibo",
        "lat": 60.16680,
        "lng": 24.95220,
        "short": "Lo storico mercato coperto del 1889, ideale per una pausa o col maltempo.",
        "shortEN": "The historic 1889 indoor market, ideal for a break or in bad weather.",
        "desc": "Il Vanha Kauppahalli è il più antico mercato coperto di Helsinki, inaugurato nel 1889 e riconoscibile per la facciata a strisce rosse e bianche. All'interno, in un'atmosfera accogliente, si trovano piccole botteghe che vendono pesce fresco, formaggi, pane, dolci, spezie, caffè e prelibatezze locali, oltre a graziosi caffè dove sedersi. È la sosta perfetta in una giornata fredda o piovosa e il posto giusto per acquistare souvenir gastronomici come la carne di renna affumicata, venduta sottovuoto e adatta al trasporto.",
        "descEN": "Vanha Kauppahalli is Helsinki's oldest indoor market, opened in 1889 and recognisable by its red-and-white striped facade. Inside, in a cosy atmosphere, small shops sell fresh fish, cheese, bread, pastries, spices, coffee and local delicacies, alongside charming cafes to sit down in. It is the perfect stop on a cold or rainy day, and a great place to buy edible souvenirs such as vacuum-packed smoked reindeer meat, easy to carry home.",
        "tips": "A circa 50 metri da Kauppatori, verso il mare.",
        "tipsEN": "About 50 metres from Kauppatori, towards the sea.",
        "src": [
          "Profumo di Follia: Helsinki in un giorno"
        ],
        "maps": "https://maps.google.com/?q=60.16680,24.95220"
      },
      {
        "tier": 1,
        "id": "hel-4",
        "name": "Cattedrale Uspenski",
        "nameEN": "Uspenski Cathedral",
        "cat": "panorama",
        "lat": 60.16820,
        "lng": 24.95828,
        "short": "Grande cattedrale ortodossa in mattoni rossi con vista sul porto.",
        "shortEN": "Large red-brick Orthodox cathedral with harbour views.",
        "desc": "A pochi minuti in monopattino verso est, sulla collina di Katajanokka, si erge la Cattedrale Uspenski, la più grande chiesa ortodossa dell'Europa occidentale e settentrionale. Costruita nel 1868 in mattoni rossi e sormontata da cupole a cipolla dorate, domina il porto e offre un bel colpo d'occhio sulla città. La breve salita è ripagata dal panorama e l'interno riccamente decorato in stile bizantino-russo merita una visita.",
        "descEN": "A few minutes by e-scooter to the east, on the Katajanokka hill, stands Uspenski Cathedral, the largest Orthodox church in Western and Northern Europe. Built in 1868 in red brick and crowned with golden onion domes, it overlooks the harbour and offers a fine view of the city. The short climb is rewarded by the panorama, and the richly decorated Byzantine-Russian interior is worth a visit.",
        "tips": "Breve salita; ottimo punto panoramico sul porto.",
        "tipsEN": "Short climb; great viewpoint over the harbour.",
        "src": [
          "TripAdvisor: cose da vedere a Helsinki",
          "Visit Finland"
        ],
        "maps": "https://maps.google.com/?q=60.16820,24.95828"
      },
      {
        "tier": 1,
        "id": "hel-5",
        "name": "Piazza del Senato e Cattedrale di Helsinki",
        "nameEN": "Senate Square & Helsinki Cathedral",
        "cat": "cultura",
        "lat": 60.16986,
        "lng": 24.95229,
        "short": "Il simbolo bianco della città e la sua piazza monumentale pedonale.",
        "shortEN": "The city's white symbol and its monumental pedestrian square.",
        "desc": "La Senaatintori è la piazza monumentale che rappresenta la nascita di Helsinki, progettata in stile neoclassico da Carl Ludvig Engel. A dominarla è la candida Cattedrale di Helsinki (Tuomiokirkko), completata nel 1852 e ispirata al Pantheon: la sua imponente scalinata e la cupola verde sono il simbolo più fotografato della città. La piazza, ampia e interamente pedonale, è uno spazio sicuro dove i bambini possono correre liberamente. Attorno si affacciano l'Università e il Palazzo del Governo.",
        "descEN": "Senaatintori is the monumental square that represents the birth of Helsinki, designed in neoclassical style by Carl Ludvig Engel. It is dominated by the white Helsinki Cathedral (Tuomiokirkko), completed in 1852 and inspired by the Pantheon: its imposing staircase and green dome are the city's most photographed symbol. The wide, fully pedestrian square is a safe space where children can run freely. It is framed by the University and the Government Palace.",
        "tips": "Piazza pedonale: spazio sicuro per i bambini e ottime foto.",
        "tipsEN": "Pedestrian square: safe space for kids and great photos.",
        "src": [
          "Profumo di Follia: Helsinki in un giorno",
          "TripAdvisor: cose da vedere a Helsinki"
        ],
        "maps": "https://maps.google.com/?q=60.16986,24.95229"
      },
      {
        "tier": 2,
        "id": "hel-6",
        "name": "Esplanadi e Design District",
        "nameEN": "Esplanadi & Design District",
        "cat": "natura",
        "lat": 60.16764,
        "lng": 24.94517,
        "short": "Il viale-parco alberato di Helsinki, cuore dello shopping e del design.",
        "shortEN": "Helsinki's tree-lined park avenue, heart of shopping and design.",
        "desc": "L'Esplanadi è il salotto verde di Helsinki: un viale alberato con un parco centrale, fiancheggiato dai due lati dalle vie dello shopping e dall'inizio del Design District, la zona dedicata al celebre design finlandese. Si può percorrere comodamente in monopattino sulle corsie laterali, ammirando le vetrine, oppure fermarsi nel parco per una pausa: in estate ci sono spesso musicisti di strada e ampi prati dove i bambini possono sgranchirsi le gambe.",
        "descEN": "Esplanadi is Helsinki's green living room: a tree-lined avenue with a central park, flanked on both sides by shopping streets and the start of the Design District, the area dedicated to renowned Finnish design. You can easily ride it by e-scooter along the side lanes while admiring the shop windows, or stop in the park for a break: in summer there are often street musicians and wide lawns where children can stretch their legs.",
        "tips": "Percorri le corsie laterali; ideale per una pausa in famiglia.",
        "tipsEN": "Ride the side lanes; ideal for a family break.",
        "src": [
          "Profumo di Follia: Helsinki in un giorno",
          "Visit Finland"
        ],
        "maps": "https://maps.google.com/?q=60.16764,24.94517"
      },
      {
        "tier": 1,
        "id": "hel-7",
        "name": "Biblioteca Centrale Oodi",
        "nameEN": "Oodi Central Library",
        "cat": "kids",
        "lat": 60.17359,
        "lng": 24.93810,
        "short": "Spettacolare biblioteca moderna con una fantastica area per bambini.",
        "shortEN": "Spectacular modern library with a fantastic children's area.",
        "desc": "La Biblioteca Centrale Oodi è molto più di una biblioteca: è un centro polifunzionale dall'architettura futuristica in legno e vetro, inaugurato nel 2018. Il terzo piano, luminoso e aperto, ospita alberi veri, un caffè e soprattutto una splendida area dedicata ai bambini con tappeti morbidi, giochi e costruzioni. È una sosta gratuita e rilassante, perfetta per far riposare i genitori mentre i più piccoli si divertono, specialmente in caso di pioggia.",
        "descEN": "Oodi Central Library is far more than a library: it is a futuristic multi-purpose centre in wood and glass, opened in 2018. Its bright, open third floor features real trees, a cafe and, above all, a wonderful children's area with soft carpets, toys and building blocks. It is a free, relaxing stop, perfect for resting parents while the little ones play — especially handy in the rain.",
        "tips": "Ingresso gratuito. Area bimbi al terzo piano.",
        "tipsEN": "Free entry. Kids' area on the third floor.",
        "src": [
          "TripAdvisor: cose da vedere a Helsinki",
          "Oodi Helsinki (sito ufficiale)"
        ],
        "maps": "https://maps.google.com/?q=60.17359,24.93810"
      },
      {
        "tier": 1,
        "id": "hel-8",
        "name": "Chiesa nella Roccia (Temppeliaukio)",
        "nameEN": "Rock Church (Temppeliaukio)",
        "cat": "cultura",
        "lat": 60.17313,
        "lng": 24.92527,
        "short": "Chiesa unica al mondo, interamente scavata nel granito.",
        "shortEN": "A one-of-a-kind church carved entirely into granite.",
        "desc": "La Temppeliaukion Kirkko è una delle attrazioni più spettacolari e insolite di Helsinki: una chiesa interamente scavata all'interno di un blocco di solido granito e inaugurata nel 1969. Entrare in questo 'cratere' circolare, coperto da un'enorme cupola in rame e illuminato dalla luce naturale che filtra dai lucernari, è un'esperienza suggestiva. L'acustica eccezionale la rende una sede molto amata per i concerti, e la particolarità del luogo affascina anche i bambini.",
        "descEN": "Temppeliaukion Kirkko is one of Helsinki's most spectacular and unusual attractions: a church carved entirely into a block of solid granite and opened in 1969. Stepping into this circular 'crater', covered by a huge copper dome and lit by natural light filtering through the skylights, is a striking experience. Its exceptional acoustics make it a much-loved concert venue, and the sheer originality of the place fascinates children too.",
        "tips": "Ingresso a pagamento; può chiudere durante concerti o funzioni.",
        "tipsEN": "Paid entry; may close during concerts or services.",
        "src": [
          "TripAdvisor: cose da vedere a Helsinki",
          "Wikipedia: Temppeliaukio Church"
        ],
        "maps": "https://maps.google.com/?q=60.17313,24.92527"
      },
      {
        "tier": 2,
        "id": "hel-9",
        "name": "Allas Sea Pool",
        "nameEN": "Allas Sea Pool",
        "cat": "attivita",
        "lat": 60.16812,
        "lng": 24.95435,
        "short": "Piscine galleggianti e sauna sul porto, a due passi da Kauppatori.",
        "shortEN": "Floating pools and sauna on the harbour, steps from Kauppatori.",
        "desc": "A conclusione del giro, tornando verso Kauppatori, l'Allas Sea Pool è un complesso galleggiante proprio sul porto, con saune pubbliche e piscine riscaldate all'aperto, oltre a una vasca con acqua di mare filtrata. È un'esperienza tipicamente finlandese e divertente anche per i bambini, con vista sul viavai dei traghetti. Una sosta rilassante e rigenerante prima di rientrare al van o al traghetto.",
        "descEN": "To round off the tour, on the way back to Kauppatori, Allas Sea Pool is a floating complex right on the harbour, with public saunas and heated outdoor pools plus a filtered sea-water pool. It is a quintessentially Finnish experience and fun for children too, with views over the ferry traffic. A relaxing, rejuvenating stop before heading back to the van or ferry.",
        "tips": "Alternativa adrenalinica per i bambini: il parco divertimenti Linnanmäki, più a nord.",
        "tipsEN": "Adrenaline alternative for kids: Linnanmäki amusement park, further north.",
        "src": [
          "Visit Finland",
          "Allas Sea Pool (sito ufficiale)"
        ],
        "maps": "https://maps.google.com/?q=60.16812,24.95435"
      }
    ]
  },
  "rovaniemi": {
    "city": "Rovaniemi",
    "cityEN": "Rovaniemi",
    "country": "Finlandia",
    "countryEN": "Finland",
    "flag": "🇫🇮",
    "intro": "Esplora il cuore di Rovaniemi con questo itinerario a piedi che unisce cultura, storia e natura artica. Scopri i luoghi più iconici della capitale della Lapponia in mezza giornata.",
    "introEN": "Explore the heart of Rovaniemi with this walking itinerary that combines culture, history, and Arctic nature. Discover the most iconic spots of the capital of Lapland in half a day.",
    "center": [
      66.5013,
      25.7272
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 1,
        "id": "rov-1",
        "name": "Piazza Lordi",
        "nameEN": "Lordi's Square",
        "cat": "cultura",
        "lat": 66.5012,
        "lng": 25.7305,
        "short": "La piazza centrale di Rovaniemi, dedicata ai vincitori dell'Eurovision 2006.",
        "shortEN": "The central square of Rovaniemi, dedicated to the 2006 Eurovision winners.",
        "desc": "Piazza Lordi (Lordin aukio) è il cuore pulsante di Rovaniemi, rinominata nel 2006 in onore della band hard rock Lordi, vincitrice dell'Eurovision Song Contest. Qui puoi trovare le impronte delle mani e le firme dei membri della band. La piazza è un vivace punto di ritrovo circondato da negozi e ristoranti, e ospita eventi durante tutto l'anno. Non perdere l'occasione di scattare una foto con il famoso termometro della piazza.",
        "descEN": "Lordi's Square (Lordin aukio) is the beating heart of Rovaniemi, renamed in 2006 in honor of the hard rock band Lordi, winners of the Eurovision Song Contest. Here you can find the handprints and signatures of the band members. The square is a lively gathering place surrounded by shops and restaurants, and hosts events throughout the year. Don't miss the chance to take a picture with the famous thermometer in the square.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Lordi's Square",
          "Tripadvisor: Lordi's Square"
        ],
        "maps": "https://maps.google.com/?q=66.5012,25.7305"
      },
      {
        "tier": 1,
        "id": "rov-2",
        "name": "Korundi Casa della Cultura",
        "nameEN": "Korundi House of Culture",
        "cat": "cultura",
        "lat": 66.5008,
        "lng": 25.71797,
        "short": "Un centro d'arte e cultura ospitato in un ex deposito di autobus postali.",
        "shortEN": "An art and culture center housed in a former post bus depot.",
        "desc": "La Casa della Cultura Korundi è uno dei pochi edifici sopravvissuti alla Seconda Guerra Mondiale a Rovaniemi. Oggi ospita il Museo d'Arte di Rovaniemi e l'Orchestra da Camera della Lapponia. Le mostre esplorano il mondo da una prospettiva nordica, offrendo un'immersione profonda nell'arte contemporanea finlandese. Si trova in Lapinkävijäntie 4, a breve distanza dal centro città.",
        "descEN": "The Korundi House of Culture is one of the few buildings in Rovaniemi to survive the Second World War. Today it houses the Rovaniemi Art Museum and the Lapland Chamber Orchestra. The exhibitions explore the world from a northern perspective, offering a deep dive into contemporary Finnish art. It is located at Lapinkävijäntie 4, a short walk from the city center.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Official site korundi.fi",
          "Visit Rovaniemi: Korundi House of Culture"
        ],
        "maps": "https://maps.google.com/?q=66.5008,25.71797"
      },
      {
        "tier": 2,
        "id": "rov-3",
        "name": "Arktikum",
        "nameEN": "Arktikum",
        "cat": "cultura",
        "lat": 66.50756,
        "lng": 25.7263,
        "short": "Un museo e centro scientifico che racconta la natura, la cultura e la storia dell'Artico.",
        "shortEN": "A museum and science center that tells the story of Arctic nature, culture, and history.",
        "desc": "L'Arktikum è uno dei punti di riferimento più noti di Rovaniemi, situato sulle rive del fiume Ounasjoki. Questo museo e centro scientifico offre mostre interattive sulla vita nell'Artico, la storia della Lapponia e il fenomeno dell'aurora boreale. L'edificio stesso è un capolavoro architettonico, con un suggestivo corridoio di vetro lungo 172 metri. I biglietti d'ingresso variano, ma offrono un'esperienza educativa imperdibile per tutte le età.",
        "descEN": "Arktikum is one of Rovaniemi's most famous landmarks, located on the banks of the Ounasjoki river. This museum and science center offers interactive exhibitions on life in the Arctic, the history of Lapland, and the phenomenon of the Northern Lights. The building itself is an architectural masterpiece, featuring a striking 172-meter-long glass corridor. Entrance fees vary, but it offers an unmissable educational experience for all ages.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Official site arktikum.fi",
          "Wikipedia: Arktikum"
        ],
        "maps": "https://maps.google.com/?q=66.50756,25.7263"
      },
      {
        "id": "rov-4",
        "name": "Chiesa di Rovaniemi",
        "nameEN": "Rovaniemi Church",
        "cat": "cultura",
        "lat": 66.49463,
        "lng": 25.72925,
        "short": "Un'iconica chiesa luterana che domina lo skyline della città.",
        "shortEN": "An iconic Lutheran church dominating the city skyline.",
        "desc": "La Chiesa di Rovaniemi, completata nel 1950, è un punto di riferimento spirituale e architettonico della città. Progettata dall'architetto Bertel Liljequist, presenta un imponente affresco sull'altare intitolato 'La sorgente della vita', opera del professor Lennart Segerstråle. La chiesa può ospitare fino a 680 persone e vanta un organo a 45 registri. Si trova in Yliopistonkatu 2 ed è aperta ai visitatori durante il giorno.",
        "descEN": "The Rovaniemi Church, completed in 1950, is a spiritual and architectural landmark of the city. Designed by architect Bertel Liljequist, it features an impressive altar fresco titled 'The Fountain of Life', painted by Professor Lennart Segerstråle. The church can seat up to 680 people and boasts a 45-stop organ. It is located at Yliopistonkatu 2 and is open to visitors during the day.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Official site rovaniemenseurakunta.fi",
          "Visit Rovaniemi: Rovaniemi Church"
        ],
        "maps": "https://maps.google.com/?q=66.49463,25.72925"
      },
      {
        "tier": 1,
        "id": "rov-5",
        "name": "Ponte della Candela del Boscaiolo",
        "nameEN": "Lumberjack's Candle Bridge",
        "cat": "cultura",
        "lat": 66.50218,
        "lng": 25.73186,
        "short": "Il primo ponte stradale strallato della Finlandia, un omaggio alla storia dei boscaioli.",
        "shortEN": "Finland's first cable-stayed road bridge, a tribute to the history of lumberjacks.",
        "desc": "Il Ponte della Candela del Boscaiolo (Jätkänkynttilä) attraversa il fiume Kemijoki per 320 metri, collegando il centro città con la collina di Ounasvaara. Completato nel 1989, è il primo ponte sospeso costruito in Lapponia in epoca moderna. Le due torri del ponte sono illuminate per simboleggiare le torce usate dai boscaioli, rendendo omaggio al patrimonio del disboscamento di Rovaniemi. Offre viste spettacolari, specialmente di notte o durante l'aurora boreale.",
        "descEN": "The Lumberjack's Candle Bridge (Jätkänkynttilä) stretches 320 meters across the Kemijoki River, connecting the city center with the Ounasvaara hill. Completed in 1989, it is the first suspension bridge built in Lapland in modern times. The twin towers of the bridge are illuminated to symbolize the torches used by lumberjacks, paying homage to Rovaniemi's logging heritage. It offers spectacular views, especially at night or during the Northern Lights.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Tripadvisor: Lumberjack's Candle Bridge",
          "VoiceMap: The Lumberjack's Candle Bridge"
        ],
        "maps": "https://maps.google.com/?q=66.50218,25.73186"
      },
      {
        "tier": 1,
        "id": "rov-6",
        "name": "Pilke Science Centre",
        "nameEN": "Pilke Science Centre",
        "cat": "cultura",
        "lat": 66.507556,
        "lng": 25.724683,
        "short": "Un museo interattivo dedicato alle foreste nordiche e all'uso sostenibile del legno.",
        "shortEN": "An interactive museum dedicated to northern forests and the sustainable use of wood.",
        "desc": "Il Pilke Science Centre è un museo interattivo dedicato alle foreste nordiche e all'industria del legno, situato accanto all'Arktikum. Attraverso mostre pratiche e coinvolgenti, i visitatori possono esplorare l'importanza ecologica ed economica delle foreste in Finlandia. L'edificio stesso è un capolavoro di architettura in legno sostenibile, progettato per ridurre al minimo l'impatto ambientale. È un luogo ideale per comprendere il profondo legame tra i finlandesi e la natura che li circonda.",
        "descEN": "The Pilke Science Centre is an interactive museum dedicated to northern forests and the timber industry, located next to the Arktikum. Through hands-on and engaging exhibitions, visitors can explore the ecological and economic importance of forests in Finland. The building itself is a masterpiece of sustainable wooden architecture, designed to minimize environmental impact. It is an ideal place to understand the deep connection between the Finnish people and their surrounding nature.",
        "tips": "Acquista il Culture Pass per l'ingresso combinato con Arktikum e Korundi.",
        "tipsEN": "Buy the Culture Pass for combined entry with Arktikum and Korundi.",
        "src": [
          "Official Website",
          "Wikipedia"
        ],
        "maps": "https://maps.google.com/?q=66.507556,25.724683"
      },
      {
        "id": "rov-7",
        "name": "Lappia Hall",
        "nameEN": "Lappia Hall",
        "cat": "cultura",
        "lat": 66.497048,
        "lng": 25.720518,
        "short": "Un iconico centro culturale e teatrale progettato dal famoso architetto Alvar Aalto.",
        "shortEN": "An iconic cultural and theatrical center designed by the famous architect Alvar Aalto.",
        "desc": "La Lappia Hall (Lappia-talo) è un importante centro culturale e teatrale progettato dal celebre architetto finlandese Alvar Aalto. L'edificio, completato in diverse fasi tra il 1961 e il 1975, si distingue per il suo tetto ondulato che ricorda le montagne della Lapponia. Ospita il Teatro della Città di Rovaniemi e la Scuola di Musica della Lapponia. Insieme alla biblioteca e al municipio, forma il centro amministrativo e culturale della città, noto come 'Aalto Centre'.",
        "descEN": "Lappia Hall (Lappia-talo) is a major cultural and theatrical center designed by the renowned Finnish architect Alvar Aalto. The building, completed in several phases between 1961 and 1975, is distinguished by its undulating roof that resembles the mountains of Lapland. It houses the Rovaniemi City Theatre and the Lapland Music School. Together with the library and city hall, it forms the city's administrative and cultural hub, known as the 'Aalto Centre'.",
        "tips": "Ammira l'architettura esterna o prenota un biglietto per uno spettacolo teatrale.",
        "tipsEN": "Admire the exterior architecture or book a ticket for a theater performance.",
        "src": [
          "Wikipedia",
          "Alvar Aalto Foundation"
        ],
        "maps": "https://maps.google.com/?q=66.497048,25.720518"
      },
      {
        "id": "rov-8",
        "name": "Rovaniemi City Library",
        "nameEN": "Rovaniemi City Library",
        "cat": "cultura",
        "lat": 66.496498,
        "lng": 25.722254,
        "short": "Una splendida biblioteca progettata da Alvar Aalto, nota per l'uso magistrale della luce naturale.",
        "shortEN": "A beautiful library designed by Alvar Aalto, known for its masterful use of natural light.",
        "desc": "La Biblioteca della Città di Rovaniemi è un altro capolavoro architettonico di Alvar Aalto, completato nel 1965. L'edificio è famoso per il suo design funzionale e l'uso innovativo della luce naturale, che illumina le ampie sale di lettura attraverso lucernari appositamente progettati. L'interno presenta dettagli in legno, ottone e pelle, tipici dello stile di Aalto. Oltre a essere un luogo di studio, ospita una vasta collezione di letteratura lappone, rendendola una tappa imperdibile per gli amanti dell'architettura e della cultura.",
        "descEN": "The Rovaniemi City Library is another architectural masterpiece by Alvar Aalto, completed in 1965. The building is famous for its functional design and innovative use of natural light, which illuminates the spacious reading rooms through specially designed skylights. The interior features details in wood, brass, and leather, typical of Aalto's style. Besides being a place of study, it houses a vast collection of Lappish literature, making it a must-visit for architecture and culture lovers.",
        "tips": "L'ingresso è gratuito; esplora le sale di lettura per apprezzare il design degli interni.",
        "tipsEN": "Entry is free; explore the reading rooms to appreciate the interior design.",
        "src": [
          "Wikipedia",
          "Alvar Aalto Foundation"
        ],
        "maps": "https://maps.google.com/?q=66.496498,25.722254"
      },
      {
        "id": "rov-9",
        "name": "Angry Birds Activity Park",
        "nameEN": "Angry Birds Activity Park",
        "cat": "kids",
        "lat": 66.498078,
        "lng": 25.733532,
        "short": "Un divertente parco giochi all'aperto a tema Angry Birds, ideale per le famiglie.",
        "shortEN": "A fun outdoor playground themed around Angry Birds, ideal for families.",
        "desc": "L'Angry Birds Activity Park è un parco giochi all'aperto situato lungo le rive del fiume Kemijoki, a breve distanza dal centro città. Il parco è interamente a tema Angry Birds, il famoso videogioco creato dall'azienda finlandese Rovio. Offre scivoli, altalene, pareti da arrampicata e percorsi a ostacoli, rendendolo un luogo perfetto per le famiglie con bambini. È un'area ricreativa gratuita e molto popolare sia tra i residenti che tra i turisti.",
        "descEN": "The Angry Birds Activity Park is an outdoor playground located along the banks of the Kemijoki River, a short distance from the city center. The park is entirely themed around Angry Birds, the famous video game created by the Finnish company Rovio. It offers slides, swings, climbing walls, and obstacle courses, making it a perfect place for families with children. It is a free recreational area and very popular among both locals and tourists.",
        "tips": "L'accesso è gratuito e aperto tutto l'anno, ma è più godibile nei mesi più caldi.",
        "tipsEN": "Access is free and open year-round, but it is most enjoyable in the warmer months.",
        "src": [
          "Visit Rovaniemi",
          "Local Guides"
        ],
        "maps": "https://maps.google.com/?q=66.498078,25.733532"
      },
      {
        "tier": 1,
        "id": "rov-10",
        "name": "Ounasvaara",
        "nameEN": "Ounasvaara",
        "cat": "natura",
        "lat": 66.502504,
        "lng": 25.802095,
        "short": "Una collina panoramica vicino al centro, perfetta per escursioni, sci e attività all'aperto.",
        "shortEN": "A scenic hill near the center, perfect for hiking, skiing, and outdoor activities.",
        "desc": "Ounasvaara è una collina boscosa situata proprio di fronte al centro di Rovaniemi, sull'altra sponda del fiume Kemijoki. È una destinazione popolare per le attività all'aperto in tutte le stagioni, offrendo sentieri per escursioni, piste da sci, percorsi per mountain bike e una pista da slittino estiva. Dalla cima si gode di una vista panoramica spettacolare sulla città e sui fiumi circostanti. È il luogo ideale per immergersi nella natura lappone senza allontanarsi troppo dal centro urbano.",
        "descEN": "Ounasvaara is a forested hill located right across from the center of Rovaniemi, on the other side of the Kemijoki River. It is a popular destination for outdoor activities in all seasons, offering hiking trails, ski slopes, mountain biking routes, and a summer toboggan run. From the top, you can enjoy a spectacular panoramic view of the city and the surrounding rivers. It is the ideal place to immerse yourself in Lappish nature without straying too far from the urban center.",
        "tips": "Raggiungibile a piedi dal centro attraversando il ponte Jätkänkynttilä.",
        "tipsEN": "Reachable on foot from the center by crossing the Jätkänkynttilä bridge.",
        "src": [
          "Visit Rovaniemi",
          "Wikipedia"
        ],
        "maps": "https://maps.google.com/?q=66.502504,25.802095"
      },
      {
        "id": "rov-11",
        "name": "Jätkänpuisto",
        "nameEN": "Jätkänpuisto",
        "cat": "natura",
        "lat": 66.504417,
        "lng": 25.738749,
        "short": "Un parco rilassante lungo il fiume Kemijoki, con ottime viste sul ponte Jätkänkynttilä.",
        "shortEN": "A relaxing park along the Kemijoki River, with great views of the Jätkänkynttilä bridge.",
        "desc": "Jätkänpuisto è un tranquillo parco situato lungo le rive del fiume Kemijoki, vicino al famoso ponte Jätkänkynttilä. Il parco offre ampi spazi verdi, sentieri per passeggiate e aree per picnic, rendendolo un luogo ideale per rilassarsi ammirando il paesaggio fluviale. Durante l'estate, è un punto di ritrovo popolare per i locali che vogliono godersi il sole di mezzanotte, mentre in inverno offre una vista suggestiva sul fiume ghiacciato e, con un po' di fortuna, sull'aurora boreale.",
        "descEN": "Jätkänpuisto is a peaceful park located along the banks of the Kemijoki River, near the famous Jätkänkynttilä bridge. The park offers large green spaces, walking paths, and picnic areas, making it an ideal place to relax while admiring the river landscape. During the summer, it is a popular gathering spot for locals wanting to enjoy the midnight sun, while in winter it offers a striking view of the frozen river and, with a bit of luck, the northern lights.",
        "tips": "Ottimo punto per fotografare il ponte o per una passeggiata serale.",
        "tipsEN": "Great spot for photographing the bridge or for an evening stroll.",
        "src": [
          "Local Guides",
          "OpenStreetMap"
        ],
        "maps": "https://maps.google.com/?q=66.504417,25.738749"
      },
      {
        "id": "rov-12",
        "name": "Rovaniemi Market Square",
        "nameEN": "Rovaniemi Market Square",
        "cat": "cibo",
        "lat": 66.500408,
        "lng": 25.71391,
        "short": "Una vivace piazza del mercato dove acquistare prodotti locali, artigianato e specialità lapponi.",
        "shortEN": "A lively market square where you can buy local produce, handicrafts, and Lappish specialties.",
        "desc": "La Piazza del Mercato di Rovaniemi (Kauppatori) è il cuore commerciale all'aperto della città. Qui si possono trovare bancarelle che vendono prodotti locali, artigianato tradizionale lappone, souvenir e specialità culinarie come carne di renna, frutti di bosco freschi e salmone. L'atmosfera è vivace e autentica, offrendo ai visitatori l'opportunità di interagire con i venditori locali e assaporare la cultura gastronomica della regione. È un luogo eccellente per acquistare regali unici e assaggiare lo street food finlandese.",
        "descEN": "The Rovaniemi Market Square (Kauppatori) is the outdoor commercial heart of the city. Here you can find stalls selling local produce, traditional Lappish handicrafts, souvenirs, and culinary specialties such as reindeer meat, fresh berries, and salmon. The atmosphere is lively and authentic, offering visitors the opportunity to interact with local vendors and taste the region's gastronomic culture. It is an excellent place to buy unique gifts and sample Finnish street food.",
        "tips": "Visita durante la mattina per la migliore selezione di prodotti freschi.",
        "tipsEN": "Visit during the morning for the best selection of fresh produce.",
        "src": [
          "Visit Rovaniemi",
          "Local Guides"
        ],
        "maps": "https://maps.google.com/?q=66.500408,25.71391"
      },
      {
        "id": "rov-13",
        "name": "Rovaniemi Local History Museum",
        "nameEN": "Rovaniemi Local History Museum",
        "cat": "cultura",
        "lat": 66.479881,
        "lng": 25.741848,
        "short": "Un museo all'aperto in una fattoria storica che illustra la vita rurale tradizionale lappone.",
        "shortEN": "An open-air museum in a historic farmhouse illustrating traditional rural Lappish life.",
        "desc": "Il Museo di Storia Locale di Rovaniemi (Rovaniemen kotiseutumuseo) è situato in una storica fattoria del XIX secolo, sopravvissuta alla distruzione della città durante la Seconda Guerra Mondiale. Il museo offre uno sguardo affascinante sulla vita rurale tradizionale in Lapponia prima dell'era moderna. I visitatori possono esplorare gli edifici originali, tra cui la casa principale, i fienili e le saune, arredati con oggetti d'epoca. È un'esperienza immersiva che racconta la storia della comunità locale e delle sue tradizioni agricole.",
        "descEN": "The Rovaniemi Local History Museum (Rovaniemen kotiseutumuseo) is located in a historic 19th-century farmhouse that survived the city's destruction during World War II. The museum offers a fascinating glimpse into traditional rural life in Lapland before the modern era. Visitors can explore the original buildings, including the main house, barns, and saunas, furnished with period objects. It is an immersive experience that tells the story of the local community and its agricultural traditions.",
        "tips": "Aperto principalmente durante i mesi estivi; controlla gli orari prima della visita.",
        "tipsEN": "Open mainly during the summer months; check hours before visiting.",
        "src": [
          "Museum Official Website",
          "Visit Rovaniemi"
        ],
        "maps": "https://maps.google.com/?q=66.479881,25.741848"
      },
      {
        "id": "rov-14",
        "name": "Kotisaari",
        "nameEN": "Kotisaari",
        "cat": "natura",
        "lat": 66.487065,
        "lng": 25.733839,
        "short": "Un'isola storica sul fiume Kemijoki, ex base dei taglialegna, ora un'oasi di pace.",
        "shortEN": "A historic island on the Kemijoki River, former lumberjack base, now a peaceful oasis.",
        "desc": "Kotisaari è una pittoresca isola situata nel fiume Kemijoki, un tempo utilizzata come base per i taglialegna che trasportavano il legname lungo il fiume. Oggi, l'isola è un'oasi di pace che conserva gli antichi edifici in legno, tra cui una vecchia taverna e una sauna. È accessibile tramite tour in barca e offre un'esperienza autentica della storia forestale della regione, immersa in un paesaggio naturale mozzafiato. È un luogo perfetto per chi cerca tranquillità e un tuffo nel passato.",
        "descEN": "Kotisaari is a picturesque island located in the Kemijoki River, once used as a base for lumberjacks transporting timber down the river. Today, the island is a peaceful oasis that preserves the old wooden buildings, including an old tavern and a sauna. It is accessible via boat tours and offers an authentic experience of the region's forestry history, set in a breathtaking natural landscape. It is a perfect place for those seeking tranquility and a dive into the past.",
        "tips": "Accessibile solo tramite tour organizzati in barca; prenota in anticipo.",
        "tipsEN": "Accessible only via organized boat tours; book in advance.",
        "src": [
          "Visit Rovaniemi",
          "Local Tour Operators"
        ],
        "maps": "https://maps.google.com/?q=66.487065,25.733839"
      },
      {
        "id": "rov-15",
        "name": "Rovaniemi Orthodox Church",
        "nameEN": "Rovaniemi Orthodox Church",
        "cat": "cultura",
        "lat": 66.496412,
        "lng": 25.751902,
        "short": "Una suggestiva chiesa ortodossa con le caratteristiche cupole a cipolla e splendide icone.",
        "shortEN": "A striking Orthodox church with characteristic onion domes and beautiful icons.",
        "desc": "La Chiesa Ortodossa di Rovaniemi, dedicata a Sant'Andrea Apostolo, è un bellissimo edificio religioso completato nel 1957. L'architettura della chiesa è semplice ma elegante, con le tipiche cupole a cipolla che caratterizzano lo stile ortodosso. All'interno, i visitatori possono ammirare splendide icone e un'atmosfera di profonda spiritualità. La chiesa serve la piccola ma attiva comunità ortodossa della regione e rappresenta un'interessante diversità architettonica e culturale nel panorama della città.",
        "descEN": "The Rovaniemi Orthodox Church, dedicated to Saint Andrew the Apostle, is a beautiful religious building completed in 1957. The church's architecture is simple yet elegant, featuring the typical onion domes that characterize the Orthodox style. Inside, visitors can admire stunning icons and an atmosphere of deep spirituality. The church serves the small but active Orthodox community in the region and represents an interesting architectural and cultural diversity in the city's landscape.",
        "tips": "Rispetta il silenzio e l'abbigliamento adeguato durante la visita all'interno.",
        "tipsEN": "Respect the silence and wear appropriate clothing when visiting inside.",
        "src": [
          "Wikipedia",
          "Orthodox Church of Finland"
        ],
        "maps": "https://maps.google.com/?q=66.496412,25.751902"
      }
    ]
  },
  "oulu": {
    "city": "Oulu",
    "cityEN": "Oulu",
    "country": "Finlandia",
    "countryEN": "Finland",
    "flag": "🇫🇮",
    "intro": "Scopri Oulu, la capitale del nord della Finlandia, con un itinerario a piedi che unisce storia, natura e cultura. Dalla vivace piazza del mercato ai tranquilli parchi sulle isole, esplora il cuore di questa affascinante città costiera.",
    "introEN": "Discover Oulu, the capital of northern Finland, with a walking itinerary that blends history, nature, and culture. From the lively market square to tranquil island parks, explore the heart of this charming coastal city.",
    "center": [
      65.0164,
      25.4736
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 2,
        "id": "oul-1",
        "name": "Piazza del Mercato di Oulu",
        "nameEN": "Oulu Market Square",
        "cat": "cibo",
        "lat": 65.01349,
        "lng": 25.46451,
        "short": "Il cuore pulsante di Oulu, famoso per i suoi vivaci mercati e l'iconica statua del Toripolliisi.",
        "shortEN": "The beating heart of Oulu, famous for its lively markets and the iconic Toripolliisi statue.",
        "desc": "La Piazza del Mercato di Oulu (Kauppatori) è il centro storico e commerciale della città, situato vicino al lungomare. Ospita il pittoresco Mercato Coperto (Kauppahalli), un edificio neogotico dove è possibile assaggiare specialità locali. L'attrazione più fotografata è il Toripolliisi, una simpatica statua in bronzo di un poliziotto del mercato. La piazza è circondata da antichi magazzini in legno rossi, ora trasformati in caffè e ristoranti.",
        "descEN": "Oulu Market Square (Kauppatori) is the historical and commercial center of the city, located near the waterfront. It hosts the picturesque Market Hall (Kauppahalli), a neo-Gothic building where you can taste local specialties. The most photographed attraction is the Toripolliisi, a friendly bronze statue of a market policeman. The square is surrounded by old red wooden storehouses, now transformed into cafes and restaurants.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Oulu",
          "Wikipedia: Toripolliisi"
        ],
        "maps": "https://maps.google.com/?q=65.01349,25.46451"
      },
      {
        "tier": 1,
        "id": "oul-2",
        "name": "Cattedrale di Oulu",
        "nameEN": "Oulu Cathedral",
        "cat": "cultura",
        "lat": 65.01472,
        "lng": 25.47583,
        "short": "Una maestosa cattedrale neoclassica che domina il centro della città.",
        "shortEN": "A majestic neoclassical cathedral dominating the city center.",
        "desc": "La Cattedrale di Oulu (Oulun tuomiokirkko) è una chiesa evangelica luterana costruita originariamente nel 1777. Dopo essere stata distrutta da un incendio nel 1822, fu ricostruita in stile neoclassico su progetto del famoso architetto Carl Ludvig Engel e completata nel 1832. L'interno è noto per il suo bellissimo organo e il modello di una nave appeso al soffitto, tipico delle chiese marittime nordiche. È aperta ai visitatori tutti i giorni e l'ingresso è gratuito.",
        "descEN": "Oulu Cathedral (Oulun tuomiokirkko) is an Evangelical Lutheran church originally built in 1777. After being destroyed by a fire in 1822, it was rebuilt in a neoclassical style designed by the famous architect Carl Ludvig Engel and completed in 1832. The interior is known for its beautiful organ and a model ship hanging from the ceiling, typical of Nordic maritime churches. It is open to visitors daily and admission is free.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Oulu Cathedral"
        ],
        "maps": "https://maps.google.com/?q=65.01472,25.47583"
      },
      {
        "tier": 1,
        "id": "oul-3",
        "name": "Isole Hupisaaret",
        "nameEN": "Hupisaaret Islands",
        "cat": "natura",
        "lat": 65.01833,
        "lng": 25.4775,
        "short": "Un'oasi verde di pace formata da piccole isole collegate da ponti pittoreschi.",
        "shortEN": "A green oasis of peace formed by small islands connected by picturesque bridges.",
        "desc": "Il parco delle Isole Hupisaaret è un'area verde situata nell'estuario del fiume Oulu, a pochi passi dal centro città. È composto da decine di piccole isole collegate da graziosi ponti pedonali bianchi, creando un paesaggio idilliaco. Il parco ospita splendidi giardini, ruscelli e percorsi pedonali perfetti per una passeggiata rilassante. Al suo interno si trovano anche un roseto e un teatro estivo.",
        "descEN": "The Hupisaaret Islands park is a green area located in the estuary of the Oulu River, just a short walk from the city center. It consists of dozens of small islands connected by charming white pedestrian bridges, creating an idyllic landscape. The park features beautiful gardens, streams, and walking paths perfect for a relaxing stroll. Inside, you can also find a rose garden and a summer theater.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Hupisaaret Islands"
        ],
        "maps": "https://maps.google.com/?q=65.01833,25.4775"
      },
      {
        "id": "oul-4",
        "name": "Museo d'Arte di Oulu",
        "nameEN": "Oulu Museum of Art",
        "cat": "cultura",
        "lat": 65.01833,
        "lng": 25.48194,
        "short": "Un museo d'arte contemporanea situato ai margini del parco Hupisaaret.",
        "shortEN": "A contemporary art museum located on the edge of the Hupisaaret park.",
        "desc": "Il Museo d'Arte di Oulu (OMA) si trova nel quartiere di Myllytulli, vicino al parco delle Isole Hupisaaret. Il museo è ospitato in un ex edificio industriale, una fabbrica di colla e pelle, che è stato magnificamente ristrutturato. Le sue collezioni si concentrano principalmente sull'arte contemporanea finlandese e regionale, offrendo uno spaccato della cultura visiva del nord. Il museo organizza regolarmente mostre temporanee ed eventi culturali.",
        "descEN": "The Oulu Museum of Art (OMA) is located in the Myllytulli neighborhood, near the Hupisaaret Islands park. The museum is housed in a former industrial building, a glue and leather factory, which has been beautifully renovated. Its collections focus primarily on Finnish and regional contemporary art, offering an insight into northern visual culture. The museum regularly hosts temporary exhibitions and cultural events.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Oulu Museum of Art"
        ],
        "maps": "https://maps.google.com/?q=65.01833,25.48194"
      },
      {
        "tier": 1,
        "id": "oul-5",
        "name": "Castello di Oulu",
        "nameEN": "Oulu Castle",
        "cat": "cultura",
        "lat": 65.017,
        "lng": 25.468,
        "short": "Le rovine storiche di un castello del XVI secolo su un'isola nel delta del fiume.",
        "shortEN": "The historic ruins of a 16th-century castle on an island in the river delta.",
        "desc": "Il Castello di Oulu (Oulun linna) fu costruito nel 1590 sull'isola di Linnansaari per difendere la città. Sebbene l'originale struttura in legno sia stata distrutta, oggi è possibile visitare le rovine in pietra e le cantine restaurate. Sulle fondamenta del castello è stato costruito un osservatorio nel 1875, che ora ospita una caffetteria estiva. L'isola offre anche splendide viste sul fiume e sulla città circostante.",
        "descEN": "Oulu Castle (Oulun linna) was built in 1590 on the island of Linnansaari to defend the city. Although the original wooden structure was destroyed, today you can visit the stone ruins and restored cellars. An observatory was built on the castle's foundations in 1875, which now houses a summer cafe. The island also offers beautiful views of the river and the surrounding city.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Oulu Castle"
        ],
        "maps": "https://maps.google.com/?q=65.017,25.468"
      },
      {
        "id": "oul-6",
        "name": "Pikisaari",
        "nameEN": "Pikisaari",
        "cat": "cultura",
        "lat": 65.016,
        "lng": 25.454,
        "short": "Un pittoresco quartiere su un'isola noto per le sue storiche case in legno e la comunità di artisti.",
        "shortEN": "A picturesque island neighborhood known for its historic wooden houses and artist community.",
        "desc": "Pikisaari è un affascinante e storico quartiere di case in legno situato su un'isola a breve distanza a piedi dal centro della città. Originariamente un'area industriale e di costruzione di barche, oggi è una vivace comunità di artisti e artigiani. Le case in legno del XVII secolo ben conservate e i sentieri panoramici sul lungomare lo rendono una zona deliziosa per una passeggiata rilassante.",
        "descEN": "Pikisaari is a charming, historic wooden town neighborhood located on an island just a short walk from the city center. Originally a boat-building and industrial area, it is now a vibrant community of artists and craftsmen. The well-preserved 17th-century wooden houses and scenic waterfront paths make it a delightful area for a leisurely stroll.",
        "tips": "Facilmente accessibile tramite un ponte pedonale dalla zona della Piazza del Mercato.",
        "tipsEN": "Easily accessible via a pedestrian bridge from the Market Square area.",
        "src": [
          "Visit Oulu: Pikisaari"
        ],
        "maps": "https://maps.google.com/?q=65.016,25.454"
      },
      {
        "id": "oul-7",
        "name": "Rotuaari",
        "nameEN": "Rotuaari",
        "cat": "cultura",
        "lat": 65.0123,
        "lng": 25.4705,
        "short": "La principale strada pedonale e il cuore commerciale di Oulu.",
        "shortEN": "The main pedestrian street and commercial heart of Oulu.",
        "desc": "Rotuaari è la vivace zona pedonale nel cuore di Oulu, che comprende parti di Kirkkokatu e delle strade circostanti. È il centro commerciale e sociale della città, fiancheggiato da negozi, caffè, ristoranti e grandi magazzini. La strada è riscaldata in inverno per mantenerla libera da neve e ghiaccio, rendendola un luogo di ritrovo confortevole tutto l'anno.",
        "descEN": "Rotuaari is the lively pedestrian zone in the heart of Oulu, encompassing parts of Kirkkokatu and surrounding streets. It is the commercial and social hub of the city, lined with shops, cafes, restaurants, and department stores. The street is heated in winter to keep it free of snow and ice, making it a comfortable gathering place year-round.",
        "tips": "Ottimo per fare shopping e cenare. Cerca il palco centrale dove si tengono spesso eventi.",
        "tipsEN": "Great for shopping and dining. Look out for the central stage where events are often held.",
        "src": [
          "Wikipedia: Rotuaari"
        ],
        "maps": "https://maps.google.com/?q=65.0123,25.4705"
      },
      {
        "tier": 1,
        "id": "oul-8",
        "name": "Tietomaa",
        "nameEN": "Tietomaa",
        "cat": "kids",
        "lat": 65.0177,
        "lng": 25.4812,
        "short": "Un centro scientifico interattivo con una torre di osservazione che offre splendide viste sulla città.",
        "shortEN": "An interactive science center with an observation tower offering great city views.",
        "desc": "Tietomaa è il primo centro scientifico della Finlandia, ospitato in un'ex centrale elettrica e torre dell'acqua. Offre mostre interattive che coprono vari campi scientifici, rendendolo molto coinvolgente per i visitatori di tutte le età. La torre di osservazione offre splendide viste panoramiche su Oulu e il centro dispone di un cinema con schermo gigante per film educativi.",
        "descEN": "Tietomaa is Finland's first science center, housed in a former power station and water tower. It offers interactive exhibits covering various scientific fields, making it highly engaging for visitors of all ages. The observation tower provides stunning panoramic views of Oulu, and the center features a giant screen theater for educational films.",
        "tips": "Perfetto per le famiglie. La torre è una visita obbligata per il panorama.",
        "tipsEN": "Perfect for families. The tower is a must-visit for the view.",
        "src": [
          "Wikipedia: Tietomaa"
        ],
        "maps": "https://maps.google.com/?q=65.0177,25.4812"
      },
      {
        "id": "oul-9",
        "name": "Oulun kaupungintalo",
        "nameEN": "Oulun kaupungintalo",
        "cat": "cultura",
        "lat": 65.0137,
        "lng": 25.4719,
        "short": "Uno splendido edificio neorinascimentale che funge da centro amministrativo di Oulu.",
        "shortEN": "A stunning Neo-Renaissance building that serves as the administrative center of Oulu.",
        "desc": "Il Municipio di Oulu è un magnifico edificio neorinascimentale completato nel 1886, che originariamente fungeva da ristorante e hotel. Progettato dall'architetto svedese Johan Erik Stenberg, è uno degli edifici storici più belli del centro città. L'edificio ha ospitato molti eventi significativi e la sua elegante facciata è un punto culminante del patrimonio architettonico di Oulu.",
        "descEN": "The Oulu City Hall is a magnificent Neo-Renaissance building completed in 1886, originally serving as a restaurant and hotel. Designed by Swedish architect Johan Erik Stenberg, it is one of the most beautiful historic buildings in the city center. The building has hosted many significant events and its elegant facade is a highlight of Oulu's architectural heritage.",
        "tips": "Ammira l'architettura dall'esterno; l'interno è principalmente per affari ufficiali.",
        "tipsEN": "Admire the architecture from the outside; the interior is mostly for official business.",
        "src": [
          "Wikipedia: Oulu City Hall"
        ],
        "maps": "https://maps.google.com/?q=65.0137,25.4719"
      },
      {
        "id": "oul-10",
        "name": "Pohjois-Pohjanmaan museo",
        "nameEN": "Pohjois-Pohjanmaan museo",
        "cat": "cultura",
        "lat": 65.0178,
        "lng": 25.4745,
        "short": "Un museo di storia regionale con mostre sul passato di Oulu e un modello in scala della città del 1938.",
        "shortEN": "A regional history museum featuring exhibits on Oulu's past and a 1938 scale model of the city.",
        "desc": "Situato nel pittoresco parco Ainolan puisto, questo museo illustra la storia culturale di Oulu e della vicina regione dell'Ostrobotnia settentrionale. Le ampie mostre coprono tutto, dalla preistoria ai tempi moderni, incluso un popolare modello in scala di Oulu nel 1938. Offre un'immersione profonda nel patrimonio locale, nei mezzi di sussistenza tradizionali e nell'evoluzione della città.",
        "descEN": "Located in the scenic Ainolan puisto park, this museum showcases the cultural history of Oulu and the surrounding Northern Ostrobothnia region. The extensive exhibits cover everything from prehistory to modern times, including a popular scale model of Oulu in 1938. It provides a deep dive into the local heritage, traditional livelihoods, and the city's evolution.",
        "tips": "Controlla gli orari di apertura attuali. Ottimo da combinare con una passeggiata nel parco circostante.",
        "tipsEN": "Check for current opening hours. Great to combine with a walk in the surrounding park.",
        "src": [
          "Wikipedia: Northern Ostrobothnia Museum"
        ],
        "maps": "https://maps.google.com/?q=65.0178,25.4745"
      },
      {
        "id": "oul-11",
        "name": "Mannerheimin puisto",
        "nameEN": "Mannerheimin puisto",
        "cat": "natura",
        "lat": 65.0106,
        "lng": 25.4672,
        "short": "Un parco urbano centrale che offre un rifugio tranquillo con splendidi paesaggi.",
        "shortEN": "A central urban park offering a peaceful retreat with beautiful landscaping.",
        "desc": "Il Parco Mannerheim è un popolare spazio verde nel centro di Oulu, intitolato al leader militare e statista finlandese Carl Gustaf Emil Mannerheim. Il parco presenta bellissime aiuole, alberi secolari e un monumento centrale. Funge da oasi di pace per la gente del posto e per i visitatori, offrendo un luogo tranquillo per rilassarsi in mezzo all'ambiente urbano.",
        "descEN": "Mannerheim Park is a popular green space in the center of Oulu, named after the Finnish military leader and statesman Carl Gustaf Emil Mannerheim. The park features beautiful flower beds, mature trees, and a central monument. It serves as a peaceful oasis for locals and visitors alike, offering a quiet spot to relax amidst the urban environment.",
        "tips": "Un bel posto per un rapido riposo o un picnic durante la passeggiata in città.",
        "tipsEN": "A nice spot for a quick rest or a picnic during your city walk.",
        "src": [
          "Visit Oulu: Parks"
        ],
        "maps": "https://maps.google.com/?q=65.0106,25.4672"
      },
      {
        "id": "oul-12",
        "name": "Oulun kaupunginkirjasto",
        "nameEN": "Oulun kaupunginkirjasto",
        "cat": "cultura",
        "lat": 65.0146,
        "lng": 25.4623,
        "short": "Un punto di riferimento architettonico brutalista che funge da biblioteca principale e centro culturale della città.",
        "shortEN": "A brutalist architectural landmark serving as the city's main library and cultural hub.",
        "desc": "La sede principale della Biblioteca Comunale di Oulu è un notevole esempio di architettura moderna finlandese, situata vicino al lungomare. Progettato dagli architetti Marjatta e Martti Jaatinen, l'edificio in cemento brutalista è addolcito da grandi finestre che offrono viste sul mare. All'interno, è un vivace centro culturale con ampie collezioni, aree di lettura e spazi espositivi.",
        "descEN": "The main branch of the Oulu City Library is a striking example of modern Finnish architecture, situated near the waterfront. Designed by architects Marjatta and Martti Jaatinen, the building's brutalist concrete structure is softened by large windows offering views of the sea. Inside, it is a vibrant cultural hub with extensive collections, reading areas, and exhibition spaces.",
        "tips": "Ingresso gratuito. Le grandi finestre offrono splendide viste sul lungomare circostante.",
        "tipsEN": "Free to enter. The large windows offer great views of the surrounding waterfront.",
        "src": [
          "Wikipedia: Oulu City Library"
        ],
        "maps": "https://maps.google.com/?q=65.0146,25.4623"
      },
      {
        "id": "oul-13",
        "name": "Oulun kaupunginteatteri",
        "nameEN": "Oulun kaupunginteatteri",
        "cat": "cultura",
        "lat": 65.0141,
        "lng": 25.4611,
        "short": "Il teatro principale della città, ospitato in un suggestivo edificio modernista sul lungomare.",
        "shortEN": "The city's main theater, housed in a striking modernist building on the waterfront.",
        "desc": "Il Teatro di Oulu è un'importante istituzione culturale situata sulla piazza del lungomare, adiacente alla Biblioteca Comunale. L'edificio modernista, progettato anch'esso da Marjatta e Martti Jaatinen, ospita un'ampia varietà di spettacoli tra cui opere teatrali, musical e teatro per bambini. È una pietra miliare della scena delle arti dello spettacolo di Oulu e una caratteristica architettonica chiave dello skyline costiero della città.",
        "descEN": "The Oulu Theatre is a prominent cultural institution located on the waterfront square, adjacent to the City Library. The modernist building, also designed by Marjatta and Martti Jaatinen, hosts a wide variety of performances including plays, musicals, and children's theater. It is a cornerstone of Oulu's performing arts scene and a key architectural feature of the city's coastal skyline.",
        "tips": "Controlla il loro programma per gli spettacoli, anche se l'edificio stesso merita di essere visto dall'esterno.",
        "tipsEN": "Check their schedule for performances, though the building itself is worth seeing from the outside.",
        "src": [
          "Wikipedia: Oulu Theatre"
        ],
        "maps": "https://maps.google.com/?q=65.0141,25.4611"
      },
      {
        "id": "oul-14",
        "name": "Franzénin puisto",
        "nameEN": "Franzénin puisto",
        "cat": "natura",
        "lat": 65.0149,
        "lng": 25.4736,
        "short": "Un parco storico vicino alla cattedrale, con un monumento al poeta F.M. Franzén.",
        "shortEN": "A historic park next to the cathedral, featuring a monument to poet F.M. Franzén.",
        "desc": "Il Parco Franzén è un parco storico e pittoresco situato vicino alla Cattedrale di Oulu. Prende il nome dal poeta e vescovo Frans Michael Franzén, il cui busto si erge in modo prominente al centro. Il parco è circondato da alcuni degli edifici in legno e pietra più antichi e belli di Oulu, rendendolo un luogo panoramico per una passeggiata rilassante.",
        "descEN": "Franzén Park is a historic and picturesque park located next to the Oulu Cathedral. It is named after the poet and bishop Frans Michael Franzén, whose bust stands prominently in the center. The park is surrounded by some of the oldest and most beautiful wooden and stone buildings in Oulu, making it a scenic spot for a relaxing stroll.",
        "tips": "Un posto incantevole dove sedersi dopo aver visitato l'adiacente cattedrale.",
        "tipsEN": "A lovely place to sit after visiting the adjacent cathedral.",
        "src": [
          "Visit Oulu: Franzén Park"
        ],
        "maps": "https://maps.google.com/?q=65.0149,25.4736"
      }
    ]
  },
  "tromso": {
    "city": "Tromsø",
    "cityEN": "Tromsø",
    "country": "Norvegia",
    "countryEN": "Norway",
    "flag": "🇳🇴",
    "intro": "Scopri il fascino artico di Tromsø con questo tour a piedi compatto attraverso il suo centro storico e attraverso il fiordo. Dalle cattedrali in legno e la storia polare fino all'iconica Cattedrale dell'Artico, questo percorso mette in risalto il meglio della \"Parigi del Nord\".",
    "introEN": "Discover the Arctic charm of Tromsø with this compact walking tour through its historic center and across the fjord. From wooden cathedrals and polar history to the iconic Arctic Cathedral, this route highlights the best of the \"Paris of the North\".",
    "center": [
      69.65,
      18.9678
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 1,
        "id": "tro-1",
        "name": "Cattedrale di Tromsø",
        "nameEN": "Tromsø Cathedral",
        "cat": "cultura",
        "lat": 69.6489,
        "lng": 18.9569,
        "short": "Una delle più grandi cattedrali in legno della Norvegia, situata nel cuore della città.",
        "shortEN": "One of the largest wooden cathedrals in Norway, located in the heart of the city.",
        "desc": "Costruita nel 1861, questa bellissima chiesa in legno giallo è l'unica cattedrale norvegese realizzata in legno. È situata nel centro della città, circondata da un parco verde. La chiesa è progettata in stile neogotico e presenta interni mozzafiato. L'ingresso costa solitamente circa 50 NOK durante gli orari di visita turistica.",
        "descEN": "Built in 1861, this beautiful yellow wooden church is the only Norwegian cathedral made of wood. It is situated in the middle of the city surrounded by a green park. The church is designed in the Gothic Revival style and features a stunning interior. Admission is usually around 50 NOK during tourist hours.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Tromsø Cathedral",
          "Visit Tromsø official site"
        ],
        "maps": "https://maps.google.com/?q=69.6489,18.9569"
      },
      {
        "id": "tro-2",
        "name": "Raketten Bar & Pølse",
        "nameEN": "Raketten Bar & Pølse",
        "cat": "cibo",
        "lat": 69.6495,
        "lng": 18.9563,
        "short": "Un minuscolo e storico chiosco che serve tradizionali hot dog norvegesi nella piazza principale.",
        "shortEN": "A historic, tiny kiosk serving traditional Norwegian hot dogs in the main square.",
        "desc": "Conosciuto come il bar più piccolo della Norvegia, questo affascinante chiosco risale al 1911. Situato su Storgata, la principale via pedonale, è famoso per servire hot dog di renna e birra locale. È una sosta veloce perfetta per sperimentare la cultura del cibo di strada locale. Aperto tutti i giorni, i prezzi per un hot dog si aggirano intorno alle 100 NOK.",
        "descEN": "Known as the smallest bar in Norway, this charming kiosk dates back to 1911. Located on Storgata, the main pedestrian street, it is famous for serving reindeer hot dogs and local beer. It's a perfect quick stop to experience local street food culture. Open daily, prices for a hot dog are around 100 NOK.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Official site raketten.no",
          "Visit Tromsø: Food and Drink"
        ],
        "maps": "https://maps.google.com/?q=69.6495,18.9563"
      },
      {
        "tier": 1,
        "id": "tro-3",
        "name": "Museo Polare",
        "nameEN": "The Polar Museum",
        "cat": "cultura",
        "lat": 69.6521,
        "lng": 18.9635,
        "short": "Un affascinante museo che illustra la storia di Tromsø come porta d'accesso all'Artico.",
        "shortEN": "A fascinating museum detailing Tromsø's history as the gateway to the Arctic.",
        "desc": "Ospitato in una tradizionale dogana degli anni '30 dell'Ottocento sul lungomare, questo museo espone la storia della caccia artica, della caccia alle foche e di famosi esploratori come Roald Amundsen. Offre approfondimenti sulle dure realtà delle spedizioni polari. I biglietti per adulti costano circa 110 NOK. È aperto tutti i giorni, solitamente dalle 11:00 alle 17:00.",
        "descEN": "Housed in a traditional 1830s customs house on the waterfront, this museum exhibits the history of Arctic trapping, sealing, and famous explorers like Roald Amundsen. It provides deep insights into the harsh realities of polar expeditions. Adult tickets are approximately 110 NOK. It is open daily, usually from 11:00 to 17:00.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "UiT The Arctic University of Norway: Polar Museum",
          "Wikipedia: Polar Museum"
        ],
        "maps": "https://maps.google.com/?q=69.6521,18.9635"
      },
      {
        "tier": 1,
        "id": "tro-4",
        "name": "Ponte di Tromsø",
        "nameEN": "Tromsø Bridge",
        "cat": "panorama",
        "lat": 69.6514,
        "lng": 18.975,
        "short": "Un ponte stradale a sbalzo che offre viste panoramiche sulla città, sulle montagne e sui fiordi.",
        "shortEN": "A cantilever road bridge offering panoramic views of the city, mountains, and fjords.",
        "desc": "Inaugurato nel 1960, questo ponte lungo 1.036 metri collega l'isola di Tromsøya con la terraferma. Camminare lungo il percorso pedonale offre punti panoramici spettacolari sulla Cattedrale dell'Artico e sul circostante stretto di Tromsøysundet. La passeggiata dura circa 15-20 minuti ed è completamente gratuita. Può essere ventoso, quindi vestitevi pesanti.",
        "descEN": "Opened in 1960, this 1,036-meter-long bridge connects the island of Tromsøya with the mainland. Walking across the pedestrian path provides spectacular viewpoints of the Arctic Cathedral and the surrounding Tromsøysundet strait. The walk takes about 15-20 minutes and is completely free. It can be windy, so dress warmly.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Tromsø Bridge",
          "Visit Norway: Tromsø"
        ],
        "maps": "https://maps.google.com/?q=69.6514,18.975"
      },
      {
        "tier": 2,
        "id": "tro-5",
        "name": "Cattedrale dell'Artico",
        "nameEN": "Arctic Cathedral",
        "cat": "cultura",
        "lat": 69.6481,
        "lng": 18.9875,
        "short": "Una suggestiva chiesa modernista diventata il simbolo più iconico di Tromsø.",
        "shortEN": "A striking modernist church that has become the most iconic symbol of Tromsø.",
        "desc": "Progettata da Jan Inge Hovig e completata nel 1965, la sua audace architettura triangolare è ispirata alla natura artica e agli iceberg. La parete orientale presenta un enorme e bellissimo mosaico di vetro che brilla in modo sbalorditivo al buio. È una chiesa parrocchiale attiva e un popolare luogo di concerti. Il biglietto d'ingresso per i visitatori è di circa 80 NOK.",
        "descEN": "Designed by Jan Inge Hovig and completed in 1965, its bold triangular architecture is inspired by Arctic nature and icebergs. The eastern wall features a massive, beautiful glass mosaic that glows stunningly in the dark. It is an active parish church and a popular concert venue. Entrance fee for visitors is about 80 NOK.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Official site ishavskatedralen.no",
          "Wikipedia: Arctic Cathedral"
        ],
        "maps": "https://maps.google.com/?q=69.6481,18.9875"
      },
      {
        "id": "tro-6",
        "name": "Arctic-Alpine Botanic Garden",
        "nameEN": "Arctic-Alpine Botanic Garden",
        "cat": "natura",
        "lat": 69.6767,
        "lng": 18.9761,
        "short": "Il giardino botanico più a nord del mondo, con rare piante artiche e alpine.",
        "shortEN": "The northernmost botanical garden in the world, featuring rare Arctic and alpine plants.",
        "desc": "Il Giardino Botanico Artico-Alpino di Tromsø è il più a nord del mondo e ospita una straordinaria collezione di piante provenienti dalle regioni polari e dalle alte montagne di tutti i continenti. Aperto da maggio a ottobre, offre un'esplosione di colori durante la breve estate artica, con specie rare come il papavero blu dell'Himalaya. Non ci sono cancelli o recinzioni, rendendolo un parco aperto e accessibile a tutti in qualsiasi momento.",
        "descEN": "The Arctic-Alpine Botanic Garden in Tromsø is the northernmost in the world, housing an extraordinary collection of plants from polar regions and high mountains across all continents. Open from May to October, it offers an explosion of colors during the short Arctic summer, featuring rare species like the Himalayan blue poppy. There are no gates or fences, making it an open park accessible to everyone at any time.",
        "tips": "Aperto 24 ore su 24, ingresso gratuito. I mesi migliori sono tra giugno e agosto.",
        "tipsEN": "Open 24/7, free admission. The best months are between June and August.",
        "src": [
          "Wikipedia: Arctic-Alpine Botanic Garden",
          "UiT The Arctic University of Norway"
        ],
        "maps": "https://maps.google.com/?q=69.6767,18.9761"
      },
      {
        "id": "tro-7",
        "name": "Prestvannet",
        "nameEN": "Prestvannet",
        "cat": "natura",
        "lat": 69.658,
        "lng": 18.935,
        "short": "Un tranquillo lago naturale, ideale per passeggiate e per avvistare l'aurora boreale.",
        "shortEN": "A tranquil natural lake, ideal for walks and spotting the northern lights.",
        "desc": "Prestvannet è un pittoresco lago situato nel punto più alto dell'isola di Tromsøya, circondato da una riserva naturale. Creato originariamente come serbatoio d'acqua nel 1867, oggi è un'oasi di pace amata da locali e turisti per passeggiate e birdwatching. In inverno, il lago ghiacciato e l'assenza di inquinamento luminoso lo rendono uno dei luoghi migliori in città per osservare l'aurora boreale. In estate, è un paradiso verde ricco di avifauna.",
        "descEN": "Prestvannet is a picturesque lake located at the highest point of Tromsøya island, surrounded by a nature reserve. Originally created as a water reservoir in 1867, today it is a peaceful oasis loved by locals and tourists for walking and birdwatching. In winter, the frozen lake and lack of light pollution make it one of the best spots in the city to watch the northern lights. In summer, it is a green paradise rich in birdlife.",
        "tips": "Facilmente raggiungibile a piedi dal centro con una passeggiata in salita di circa 20 minuti.",
        "tipsEN": "Easily reachable on foot from the center with an uphill walk of about 20 minutes.",
        "src": [
          "Wikipedia: Prestvannet"
        ],
        "maps": "https://maps.google.com/?q=69.658,18.935"
      },
      {
        "id": "tro-8",
        "name": "Skansen",
        "nameEN": "Skansen",
        "cat": "cultura",
        "lat": 69.6533,
        "lng": 18.9622,
        "short": "La casa in legno più antica della città e antica fortificazione medievale.",
        "shortEN": "The city's oldest wooden house and former medieval fortification.",
        "desc": "Skansen è la più antica casa in legno di Tromsø, costruita nel 1789, e l'unica fortificazione storica della città, risalente al Medioevo. Circondata da un piccolo parco e da cannoni storici, offre uno scorcio affascinante sul passato di Tromsø prima del suo sviluppo moderno. L'area è tranquilla e pittoresca, ideale per una breve passeggiata vicino al porto. Oggi la casa ospita eventi culturali e mostre temporanee.",
        "descEN": "Skansen is the oldest wooden house in Tromsø, built in 1789, and the city's only historical fortification, dating back to the Middle Ages. Surrounded by a small park and historic cannons, it offers a fascinating glimpse into Tromsø's past before its modern development. The area is quiet and picturesque, ideal for a short walk near the harbor. Today, the house hosts cultural events and temporary exhibitions.",
        "tips": "L'esterno è sempre visitabile, l'interno solo durante eventi specifici.",
        "tipsEN": "The exterior is always accessible, the interior only during specific events.",
        "src": [
          "Wikipedia: Skansen (Tromsø)"
        ],
        "maps": "https://maps.google.com/?q=69.6533,18.9622"
      },
      {
        "id": "tro-9",
        "name": "Tromsø Public Library",
        "nameEN": "Tromsø Public Library",
        "cat": "cultura",
        "lat": 69.6518,
        "lng": 18.9565,
        "short": "Una biblioteca dal design moderno e luminoso, vero gioiello architettonico.",
        "shortEN": "A library with a modern and bright design, a true architectural gem.",
        "desc": "La Biblioteca Pubblica di Tromsø è ospitata in un edificio dal design architettonico sorprendente, caratterizzato da ampie vetrate e un tetto curvo che ricorda le vele di una nave. Costruita sotto la struttura originale di un ex cinema, offre un ambiente luminoso e accogliente. È un luogo perfetto per rilassarsi, leggere un libro o semplicemente ammirare l'architettura moderna norvegese. La biblioteca è un importante centro culturale per la comunità locale.",
        "descEN": "The Tromsø Public Library is housed in a building with striking architectural design, featuring large glass windows and a curved roof that resembles ship sails. Built under the original structure of a former cinema, it offers a bright and welcoming environment. It is a perfect place to relax, read a book, or simply admire modern Norwegian architecture. The library serves as an important cultural hub for the local community.",
        "tips": "Ingresso gratuito, ottimo rifugio nelle giornate fredde.",
        "tipsEN": "Free entry, great refuge on cold days.",
        "src": [
          "Wikipedia: Tromsø bibliotek og byarkiv"
        ],
        "maps": "https://maps.google.com/?q=69.6518,18.9565"
      },
      {
        "id": "tro-10",
        "name": "Perspektivet Museum",
        "nameEN": "Perspektivet Museum",
        "cat": "cultura",
        "lat": 69.6508,
        "lng": 18.9555,
        "short": "Museo di fotografia e storia culturale ospitato in un'elegante dimora del XIX secolo.",
        "shortEN": "Photography and cultural history museum housed in an elegant 19th-century mansion.",
        "desc": "Il Perspektivet Museum è situato in una splendida dimora neoclassica del 1838, un tempo casa della scrittrice Cora Sandel. Il museo si concentra sulla fotografia documentaria e sulla storia culturale di Tromsø, esplorando temi di diversità e identità. Le mostre temporanee offrono spunti di riflessione sulla società contemporanea attraverso l'obiettivo di fotografi internazionali e locali. Gli interni storici dell'edificio sono stati magnificamente conservati.",
        "descEN": "The Perspektivet Museum is located in a beautiful neoclassical mansion from 1838, once the home of writer Cora Sandel. The museum focuses on documentary photography and the cultural history of Tromsø, exploring themes of diversity and identity. Temporary exhibitions offer insights into contemporary society through the lenses of international and local photographers. The building's historic interiors have been beautifully preserved.",
        "tips": "Ingresso gratuito. Le mostre cambiano regolarmente.",
        "tipsEN": "Free admission. Exhibitions change regularly.",
        "src": [
          "Wikipedia: Perspektivet Museum",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=69.6508,18.9555"
      },
      {
        "id": "tro-11",
        "name": "Roald Amundsen Monument",
        "nameEN": "Roald Amundsen Monument",
        "cat": "cultura",
        "lat": 69.6487,
        "lng": 18.9588,
        "short": "Statua dedicata al celebre esploratore polare, simbolo del legame della città con l'Artico.",
        "shortEN": "Statue dedicated to the famous polar explorer, a symbol of the city's link to the Arctic.",
        "desc": "Situato in una piccola piazza vicino al porto, questo monumento è dedicato a Roald Amundsen, il leggendario esploratore polare norvegese. La statua lo ritrae con lo sguardo rivolto verso il mare, a ricordo delle sue numerose spedizioni partite proprio da Tromsø, nota come la 'Porta dell'Artico'. Il monumento è un importante simbolo del legame storico della città con le esplorazioni polari e un ottimo punto di partenza per esplorare il lungomare.",
        "descEN": "Located in a small square near the harbor, this monument is dedicated to Roald Amundsen, the legendary Norwegian polar explorer. The statue depicts him looking out towards the sea, commemorating his numerous expeditions that departed from Tromsø, known as the 'Gateway to the Arctic.' The monument is an important symbol of the city's historical connection to polar exploration and a great starting point for exploring the waterfront.",
        "tips": "Ottimo punto per scattare foto con il porto sullo sfondo.",
        "tipsEN": "Great spot for taking photos with the harbor in the background.",
        "src": [
          "Tromsø Municipality",
          "Local Guide"
        ],
        "maps": "https://maps.google.com/?q=69.6487,18.9588"
      },
      {
        "id": "tro-12",
        "name": "Tromsø Harbor",
        "nameEN": "Tromsø Harbor",
        "cat": "panorama",
        "lat": 69.648,
        "lng": 18.96,
        "short": "Il vivace lungomare della città, con viste spettacolari sui fiordi e sulle montagne.",
        "shortEN": "The city's lively waterfront, with spectacular views of the fjords and mountains.",
        "desc": "Il porto di Tromsø è il cuore pulsante della città, dove si mescolano pescherecci tradizionali, navi da crociera e imbarcazioni per l'esplorazione artica. Passeggiando lungo le banchine si può godere di una vista magnifica sul fiordo, sul ponte di Tromsø e sull'iconica Cattedrale dell'Artico sulla sponda opposta. È un'area vivace, ricca di ristoranti e caffè, perfetta per assaporare l'atmosfera marittima e osservare il viavai delle navi.",
        "descEN": "Tromsø Harbor is the beating heart of the city, where traditional fishing boats, cruise ships, and Arctic exploration vessels mingle. Walking along the docks, you can enjoy a magnificent view of the fjord, the Tromsø Bridge, and the iconic Arctic Cathedral on the opposite shore. It is a lively area, full of restaurants and cafes, perfect for soaking in the maritime atmosphere and watching the comings and goings of ships.",
        "tips": "Ideale per una passeggiata serale, specialmente durante il sole di mezzanotte.",
        "tipsEN": "Ideal for an evening stroll, especially during the midnight sun.",
        "src": [
          "Tromsø Port Authority"
        ],
        "maps": "https://maps.google.com/?q=69.648,18.96"
      },
      {
        "id": "tro-13",
        "name": "Vår Frue Kirke",
        "nameEN": "Vår Frue Kirke",
        "cat": "cultura",
        "lat": 69.648,
        "lng": 18.955,
        "short": "La chiesa cattolica più a nord del mondo, un pittoresco edificio in legno del 1861.",
        "shortEN": "The northernmost Catholic church in the world, a picturesque wooden building from 1861.",
        "desc": "La Chiesa di Nostra Signora è una piccola e affascinante chiesa cattolica situata nel cuore di Tromsø, costruita nel 1861. È la sede della prelatura territoriale di Tromsø, la giurisdizione cattolica più a nord del mondo. L'edificio in legno presenta un'architettura neogotica semplice ma elegante, ed è sopravvissuto a vari incendi che hanno colpito la città. L'interno è intimo e accogliente, offrendo un momento di pace nel centro cittadino.",
        "descEN": "The Church of Our Lady is a small and charming Catholic church located in the heart of Tromsø, built in 1861. It is the seat of the Territorial Prelature of Tromsø, the northernmost Catholic jurisdiction in the world. The wooden building features simple yet elegant neo-Gothic architecture and has survived several fires that struck the city. The interior is intimate and welcoming, offering a moment of peace in the city center.",
        "tips": "Aperta durante il giorno per la preghiera silenziosa.",
        "tipsEN": "Open during the day for silent prayer.",
        "src": [
          "Wikipedia: Church of Our Lady, Tromsø"
        ],
        "maps": "https://maps.google.com/?q=69.648,18.955"
      },
      {
        "id": "tro-14",
        "name": "Magic Ice Bar",
        "nameEN": "Magic Ice Bar",
        "cat": "attivita",
        "lat": 69.6465,
        "lng": 18.958,
        "short": "Un bar interamente di ghiaccio con sculture illuminate e drink serviti in bicchieri gelati.",
        "shortEN": "An all-ice bar with illuminated sculptures and drinks served in frozen glasses.",
        "desc": "Il Magic Ice Bar è un'esperienza unica dove tutto, dai bicchieri alle sculture, è realizzato in puro ghiaccio cristallino. Le sculture di ghiaccio, illuminate da luci suggestive, raccontano storie di esploratori polari e della vita nell'Artico. All'ingresso vengono forniti poncho caldi e guanti per affrontare la temperatura interna mantenuta costantemente sotto lo zero. È un modo divertente e insolito per brindare alla propria avventura norvegese.",
        "descEN": "The Magic Ice Bar is a unique experience where everything, from the glasses to the sculptures, is made of pure crystal-clear ice. The ice sculptures, illuminated by atmospheric lighting, tell stories of polar explorers and life in the Arctic. Warm ponchos and gloves are provided at the entrance to brave the indoor temperature, which is kept constantly below freezing. It is a fun and unusual way to toast to your Norwegian adventure.",
        "tips": "Il biglietto d'ingresso include solitamente un drink di benvenuto.",
        "tipsEN": "The entrance fee usually includes a welcome drink.",
        "src": [
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=69.6465,18.958"
      },
      {
        "id": "tro-15",
        "name": "Ølhallen",
        "nameEN": "Ølhallen",
        "cat": "cibo",
        "lat": 69.6445,
        "lng": 18.9515,
        "short": "Il pub più antico della città, famoso per la sua vasta selezione di birre artigianali.",
        "shortEN": "The city's oldest pub, famous for its vast selection of craft beers.",
        "desc": "Ølhallen è il pub più antico di Tromsø, aperto nel 1928 e storicamente legato alla Mack, che per lungo tempo è stata la birreria più a nord del mondo. Il locale offre un'atmosfera autentica e vanta una selezione di oltre 70 birre norvegesi alla spina. In passato era il punto di ritrovo per cacciatori, pescatori ed esploratori polari che tornavano dalle loro spedizioni. Oggi è una tappa imperdibile per assaporare la cultura locale.",
        "descEN": "Ølhallen is Tromsø's oldest pub, opened in 1928 and historically linked to Mack, which was long known as the world's northernmost brewery. The venue offers an authentic atmosphere and boasts a selection of over 70 Norwegian beers on tap. In the past, it was the gathering place for hunters, fishermen, and polar explorers returning from their expeditions. Today, it is a must-visit spot to taste local culture.",
        "tips": "Ottimo per una pausa pomeridiana, chiude relativamente presto la sera.",
        "tipsEN": "Great for an afternoon break, closes relatively early in the evening.",
        "src": [
          "Wikipedia: Mack Brewery",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=69.6445,18.9515"
      },
      {
        "tier": 1,
        "id": "tro-16",
        "name": "Polaria",
        "nameEN": "Polaria",
        "cat": "natura",
        "lat": 69.6433,
        "lng": 18.95,
        "short": "Un acquario artico dal design unico dedicato alla fauna e all'ambiente del nord.",
        "shortEN": "A uniquely designed Arctic aquarium dedicated to northern wildlife and environment.",
        "desc": "Polaria è un acquario e centro educativo dedicato all'ambiente artico, situato in un edificio dall'architettura unica che ricorda blocchi di ghiaccio spinti a riva. Offre mostre interattive sulla fauna del nord e sul cambiamento climatico. L'attrazione principale è la vasca delle foche barbute, dove i visitatori possono assistere al loro addestramento e alimentazione. È un luogo ideale per comprendere il delicato ecosistema delle regioni polari.",
        "descEN": "Polaria is an aquarium and educational center dedicated to the Arctic environment, housed in a unique building designed to resemble ice floes pressed against the land. It features interactive exhibits on northern wildlife and climate change. The main attraction is the bearded seal pool, where visitors can watch their training and feeding sessions. It is an ideal place to understand the delicate ecosystem of the polar regions.",
        "tips": "Controllare gli orari per assistere al pasto delle foche. Ingresso a pagamento.",
        "tipsEN": "Check the schedule for seal feeding times. Admission fee applies.",
        "src": [
          "Wikipedia: Polaria",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=69.6433,18.95"
      },
      {
        "tier": 2,
        "id": "tro-17",
        "name": "Fjellheisen",
        "nameEN": "Fjellheisen",
        "cat": "panorama",
        "lat": 69.6411,
        "lng": 18.9855,
        "short": "Funivia che offre viste mozzafiato sulla città e sui fiordi circostanti.",
        "shortEN": "Cable car offering breathtaking views of the city and surrounding fjords.",
        "desc": "La funivia Fjellheisen porta i visitatori sulla montagna Storsteinen, a 421 metri sul livello del mare, offrendo una vista panoramica spettacolare su Tromsø, le isole circostanti e i fiordi. È uno dei luoghi migliori per ammirare il sole di mezzanotte in estate o l'aurora boreale in inverno. Sulla cima si trova un ristorante dove potersi riscaldare godendo del paesaggio. La salita dura solo pochi minuti ma regala emozioni indimenticabili.",
        "descEN": "The Fjellheisen cable car takes visitors up Storsteinen mountain, 421 meters above sea level, offering spectacular panoramic views of Tromsø, the surrounding islands, and fjords. It is one of the best spots to admire the midnight sun in summer or the northern lights in winter. At the top, there is a restaurant where you can warm up while enjoying the scenery. The ride takes only a few minutes but provides unforgettable thrills.",
        "tips": "Vestirsi a strati, in cima c'è spesso molto vento.",
        "tipsEN": "Dress in layers, it is often very windy at the top.",
        "src": [
          "Wikipedia: Fjellheisen",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=69.6411,18.9855"
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
        "tier": 2,
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 2,
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
        "tier": 1,
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
      },
      {
        "id": "trd-6",
        "name": "Stiftsgården",
        "nameEN": "Stiftsgården",
        "cat": "cultura",
        "lat": 63.4316,
        "lng": 10.3942,
        "short": "La maestosa residenza reale in legno di Trondheim.",
        "shortEN": "The majestic wooden royal residence of Trondheim.",
        "desc": "Stiftsgården è la residenza reale ufficiale a Trondheim e uno dei più grandi edifici in legno del Nord Europa. Costruito nel 1778 in stile neoclassico, vanta oltre 140 stanze con interni riccamente decorati. Durante l'estate, i visitatori possono partecipare a visite guidate per esplorare le eleganti sale storiche. È un simbolo importante della storia norvegese e della monarchia.",
        "descEN": "Stiftsgården is the official royal residence in Trondheim and one of the largest wooden buildings in Northern Europe. Built in 1778 in a neoclassical style, it boasts over 140 rooms with richly decorated interiors. During the summer, visitors can join guided tours to explore the elegant historical halls. It stands as an important symbol of Norwegian history and the monarchy.",
        "tips": "Aperto per visite guidate in estate; i giardini sono sempre accessibili.",
        "tipsEN": "Open for guided tours in summer; the gardens are always accessible.",
        "src": [
          "Wikipedia: Stiftsgården",
          "Official Site"
        ],
        "maps": "https://maps.google.com/?q=63.4316,10.3942"
      },
      {
        "id": "trd-7",
        "name": "Torvet",
        "nameEN": "Torvet",
        "cat": "cultura",
        "lat": 63.4305,
        "lng": 10.3951,
        "short": "La piazza centrale della città con la statua del suo fondatore.",
        "shortEN": "The central city square featuring the statue of its founder.",
        "desc": "Torvet è la piazza principale di Trondheim, progettata nel XVII secolo dal generale Cicignon. Al centro si erge l'imponente statua di Olav Tryggvason, il fondatore della città, che domina lo spazio circostante. La piazza è un vivace punto di incontro, circondata da caffè, negozi e un mercato all'aperto. Recentemente rinnovata, è il cuore pulsante della vita cittadina.",
        "descEN": "Torvet is the main public square of Trondheim, designed in the 17th century by General Cicignon. At its center stands the imposing statue of Olav Tryggvason, the city's founder, towering over the surrounding space. The square is a lively meeting point, surrounded by cafes, shops, and an open-air market. Recently renovated, it is the beating heart of city life.",
        "tips": "Ottimo posto per rilassarsi e osservare la vita locale.",
        "tipsEN": "Great spot to relax and people-watch.",
        "src": [
          "Wikipedia: Torvet i Trondheim"
        ],
        "maps": "https://maps.google.com/?q=63.4305,10.3951"
      },
      {
        "id": "trd-8",
        "name": "Vår Frue Kirke",
        "nameEN": "Vår Frue Kirke",
        "cat": "cultura",
        "lat": 63.43,
        "lng": 10.3975,
        "short": "Un'antica chiesa medievale nota per la sua atmosfera accogliente.",
        "shortEN": "An ancient medieval church known for its welcoming atmosphere.",
        "desc": "La Chiesa di Nostra Signora è la terza chiesa medievale più grande della Norvegia, con origini che risalgono al 1200. Dopo vari incendi, è stata ricostruita e ampliata nel corso dei secoli, mescolando stili romanici e gotici. Oggi è nota come 'chiesa aperta', offrendo un rifugio accogliente e un luogo di riflessione per tutti. L'interno è semplice ma profondamente suggestivo.",
        "descEN": "The Church of Our Lady is the third largest medieval church in Norway, with origins dating back to the 1200s. After several fires, it was rebuilt and expanded over the centuries, blending Romanesque and Gothic styles. Today it is known as an 'open church,' offering a welcoming refuge and a place of reflection for everyone. The interior is simple yet deeply evocative.",
        "tips": "Ingresso gratuito; spesso offre tè e caffè ai visitatori.",
        "tipsEN": "Free entry; often offers tea and coffee to visitors.",
        "src": [
          "Wikipedia: Vår Frue Church"
        ],
        "maps": "https://maps.google.com/?q=63.43,10.3975"
      },
      {
        "id": "trd-9",
        "name": "Solsiden",
        "nameEN": "Solsiden",
        "cat": "cibo",
        "lat": 63.4344,
        "lng": 10.4111,
        "short": "Un vivace quartiere sul fiume, perfetto per cenare e rilassarsi.",
        "shortEN": "A lively riverside district, perfect for dining and relaxing.",
        "desc": "Solsiden, che significa 'il lato soleggiato', è un ex cantiere navale trasformato in uno dei quartieri più vivaci di Trondheim. L'area è ricca di ristoranti, bar e caffè situati in vecchi edifici industriali in mattoni lungo il fiume Nidelva. È il luogo ideale per gustare un pasto all'aperto durante le lunghe serate estive. L'atmosfera unisce il fascino storico al design moderno.",
        "descEN": "Solsiden, meaning 'the sunny side,' is a former shipyard transformed into one of Trondheim's most vibrant neighborhoods. The area is packed with restaurants, bars, and cafes housed in old brick industrial buildings along the Nidelva river. It is the perfect place to enjoy an outdoor meal during the long summer evenings. The atmosphere combines historical charm with modern design.",
        "tips": "Molto affollato nei fine settimana e nelle serate di sole.",
        "tipsEN": "Very busy on weekends and sunny evenings.",
        "src": [
          "Trondheim Tourism",
          "Wikipedia: Solsiden"
        ],
        "maps": "https://maps.google.com/?q=63.4344,10.4111"
      },
      {
        "tier": 1,
        "id": "trd-10",
        "name": "Rockheim",
        "nameEN": "Rockheim",
        "cat": "cultura",
        "lat": 63.4369,
        "lng": 10.4011,
        "short": "Il museo interattivo dedicato alla musica pop e rock norvegese.",
        "shortEN": "The interactive museum dedicated to Norwegian pop and rock music.",
        "desc": "Rockheim è il museo nazionale norvegese della musica popolare, situato in un edificio iconico con una 'scatola' illuminata sul tetto. Offre mostre interattive che ripercorrono la storia della musica norvegese dagli anni '50 a oggi. I visitatori possono suonare strumenti, mixare brani e immergersi nella cultura pop. È un'esperienza coinvolgente e divertente per tutte le età.",
        "descEN": "Rockheim is Norway's national museum of popular music, housed in an iconic building with an illuminated 'box' on the roof. It offers interactive exhibits tracing the history of Norwegian music from the 1950s to the present. Visitors can play instruments, mix tracks, and immerse themselves in pop culture. It is an engaging and fun experience for all ages.",
        "tips": "Controllare gli orari di apertura; il ristorante all'ultimo piano offre un'ottima vista.",
        "tipsEN": "Check opening hours; the top-floor restaurant offers a great view.",
        "src": [
          "Official Site",
          "Wikipedia: Rockheim"
        ],
        "maps": "https://maps.google.com/?q=63.4369,10.4011"
      },
      {
        "id": "trd-11",
        "name": "NTNU University Museum",
        "nameEN": "NTNU University Museum",
        "cat": "cultura",
        "lat": 63.4286,
        "lng": 10.3872,
        "short": "Un museo affascinante che esplora la natura e la storia vichinga.",
        "shortEN": "A fascinating museum exploring nature and Viking history.",
        "desc": "Il Museo Universitario NTNU è uno dei principali musei di storia naturale e culturale della Norvegia. Le sue collezioni includono reperti archeologici dell'era vichinga, mostre sulla fauna nordica e affascinanti esposizioni scientifiche. È un luogo eccellente per comprendere la storia naturale della regione del Trøndelag. Le mostre sono ben curate e molto educative.",
        "descEN": "The NTNU University Museum is one of Norway's leading museums of natural and cultural history. Its collections include archaeological artifacts from the Viking Age, exhibits on Nordic wildlife, and fascinating scientific displays. It is an excellent place to understand the natural history of the Trøndelag region. The exhibitions are well-curated and highly educational.",
        "tips": "Ideale per le famiglie; ingresso a pagamento.",
        "tipsEN": "Ideal for families; admission fee applies.",
        "src": [
          "Official Site",
          "Wikipedia: NTNU University Museum"
        ],
        "maps": "https://maps.google.com/?q=63.4286,10.3872"
      },
      {
        "id": "trd-12",
        "name": "Ravnkloa",
        "nameEN": "Ravnkloa",
        "cat": "cibo",
        "lat": 63.4333,
        "lng": 10.3928,
        "short": "Il tradizionale mercato del pesce con vista sul fiordo.",
        "shortEN": "The traditional fish market with views of the fjord.",
        "desc": "Ravnkloa è la piazza pubblica più antica di Trondheim e il tradizionale mercato del pesce della città. Situata alla fine di Munkegata, offre una vista pittoresca sul fiordo e sull'isola di Munkholmen. Qui si possono acquistare frutti di mare freschi o gustare un panino ai gamberetti in un'atmosfera autentica. In estate, da qui partono i traghetti per Munkholmen.",
        "descEN": "Ravnkloa is Trondheim's oldest public square and the city's traditional fish market. Located at the end of Munkegata, it offers a picturesque view of the fjord and Munkholmen island. Here you can buy fresh seafood or enjoy a shrimp sandwich in an authentic atmosphere. In summer, ferries to Munkholmen depart from here.",
        "tips": "Assaggiate i frutti di mare locali presso la pescheria storica.",
        "tipsEN": "Taste the local seafood at the historic fishmonger.",
        "src": [
          "Wikipedia: Ravnkloa"
        ],
        "maps": "https://maps.google.com/?q=63.4333,10.3928"
      },
      {
        "id": "trd-13",
        "name": "Skansen Bridge",
        "nameEN": "Skansen Bridge",
        "cat": "cultura",
        "lat": 63.4311,
        "lng": 10.3808,
        "short": "Un ponte ferroviario storico progettato dal creatore del Golden Gate.",
        "shortEN": "A historic railway bridge designed by the creator of the Golden Gate.",
        "desc": "Il Ponte di Skansen è uno spettacolare ponte ferroviario basculante, progettato da Joseph Strauss, lo stesso ingegnere del Golden Gate Bridge. Costruito nel 1918, è l'unico ponte del suo genere in Norvegia ed è ancora in funzione. La sua struttura in acciaio si staglia contro il cielo, offrendo un'ottima opportunità fotografica. È un capolavoro di ingegneria industriale.",
        "descEN": "The Skansen Bridge is a spectacular bascule railway bridge, designed by Joseph Strauss, the same engineer behind the Golden Gate Bridge. Built in 1918, it is the only bridge of its kind in Norway and is still in operation. Its steel structure stands out against the sky, offering a great photo opportunity. It is a masterpiece of industrial engineering.",
        "tips": "Particolarmente suggestivo al tramonto o quando si solleva per far passare le barche.",
        "tipsEN": "Particularly striking at sunset or when it lifts for passing boats.",
        "src": [
          "Wikipedia: Skansen Bridge"
        ],
        "maps": "https://maps.google.com/?q=63.4311,10.3808"
      },
      {
        "id": "trd-14",
        "name": "Trondhjems Sjøfartsmuseum",
        "nameEN": "Trondhjems Sjøfartsmuseum",
        "cat": "cultura",
        "lat": 63.4336,
        "lng": 10.4022,
        "short": "Un museo che esplora la profonda eredità marittima di Trondheim.",
        "shortEN": "A museum exploring Trondheim's deep maritime heritage.",
        "desc": "Il Museo Marittimo di Trondheim è ospitato in un ex edificio carcerario del XVIII secolo. Le sue esposizioni raccontano la ricca storia marittima della città, dalle antiche navi a vela fino all'era del vapore e della navigazione moderna. I visitatori possono ammirare modelli di navi, strumenti di navigazione e affascinanti fotografie storiche. È una visita istruttiva che celebra il legame vitale della Norvegia con il mare.",
        "descEN": "The Trondheim Maritime Museum is housed in a former 18th-century prison building. Its exhibitions recount the city's rich maritime history, from ancient sailing ships to the era of steam and modern navigation. Visitors can admire ship models, navigational instruments, and fascinating historical photographs. It is an educational visit that celebrates Norway's vital connection to the sea.",
        "tips": "Situato vicino al fiume, perfetto per una passeggiata dopo la visita.",
        "tipsEN": "Located near the river, perfect for a walk after the visit.",
        "src": [
          "Official Site",
          "Wikipedia: Trondhjems Sjøfartsmuseum"
        ],
        "maps": "https://maps.google.com/?q=63.4336,10.4022"
      }
    ]
  },
  "stavanger": {
    "city": "Stavanger",
    "cityEN": "Stavanger",
    "country": "Norvegia",
    "countryEN": "Norway",
    "flag": "🇳🇴",
    "intro": "Scopri il fascino di Stavanger con questo itinerario a piedi di mezza giornata. Dalle storiche case in legno di Gamle Stavanger al moderno Museo del Petrolio, esplorerai il cuore vibrante della città.",
    "introEN": "Discover the charm of Stavanger with this half-day walking itinerary. From the historic wooden houses of Gamle Stavanger to the modern Petroleum Museum, you will explore the vibrant heart of the city.",
    "center": [
      58.9708,
      5.7316
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 2,
        "id": "sta-1",
        "name": "Gamle Stavanger",
        "nameEN": "Old Stavanger",
        "cat": "cultura",
        "lat": 58.97033,
        "lng": 5.72583,
        "short": "Passeggia tra le storiche case in legno bianco del XVIII secolo.",
        "shortEN": "Stroll among the historic white wooden houses from the 18th century.",
        "desc": "Gamle Stavanger, o Vecchia Stavanger, è un'area storica situata sul lato ovest del porto di Vågen. Comprende 173 case in legno bianco costruite tra la fine del XVIII e l'inizio del XIX secolo. È considerata l'insediamento di case in legno meglio conservato d'Europa. L'area è in gran parte residenziale, ma ospita anche alcune gallerie e musei. L'ingresso è gratuito e l'area è sempre accessibile.",
        "descEN": "Gamle Stavanger, or Old Stavanger, is a historic area located on the west side of the Vågen harbor. It comprises 173 white wooden houses built in the late 18th and early 19th centuries. It is considered Europe's best-preserved wooden house settlement. The area is largely residential but also hosts a few galleries and museums. Entry is free and the area is always accessible.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Stavanger",
          "Visit Norway: Old Stavanger"
        ],
        "maps": "https://maps.google.com/?q=58.97033,5.72583"
      },
      {
        "tier": 1,
        "id": "sta-2",
        "name": "Cattedrale di Stavanger",
        "nameEN": "Stavanger Cathedral",
        "cat": "cultura",
        "lat": 58.96978,
        "lng": 5.73316,
        "short": "Ammira la cattedrale più antica della Norvegia, risalente al 1125.",
        "shortEN": "Admire Norway's oldest cathedral, dating back to 1125.",
        "desc": "La Cattedrale di Stavanger è la cattedrale più antica della Norvegia, costruita intorno al 1125. Si trova nel centro della città, vicino al porto e al lago Breiavatnet. L'architettura originale era in stile romanico, ma in seguito furono aggiunti elementi gotici. È l'unica cattedrale norvegese ad aver mantenuto la sua architettura originale dal Medioevo. L'ingresso è generalmente a pagamento per i turisti, con orari che variano a seconda della stagione.",
        "descEN": "Stavanger Cathedral is Norway's oldest cathedral, built around 1125. It is located in the city center, near the harbor and the Breiavatnet lake. The original architecture was Romanesque, but Gothic elements were added later. It is the only Norwegian cathedral to have retained its original architecture since the Middle Ages. Entry is generally subject to a fee for tourists, with hours varying by season.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Stavanger Cathedral",
          "Visit Norway: Stavanger Cathedral"
        ],
        "maps": "https://maps.google.com/?q=58.96978,5.73316"
      },
      {
        "id": "sta-3",
        "name": "Breiavatnet",
        "nameEN": "Breiavatnet",
        "cat": "natura",
        "lat": 58.96806,
        "lng": 5.733,
        "short": "Rilassati in questo pittoresco lago situato nel cuore della città.",
        "shortEN": "Relax by this picturesque lake located in the heart of the city.",
        "desc": "Breiavatnet è un piccolo lago naturale situato proprio nel centro di Stavanger, adiacente alla Cattedrale e alla stazione ferroviaria. È un luogo popolare per passeggiate rilassanti e per osservare i cigni e le anatre che lo popolano. Il parco circostante offre panchine e aree verdi ideali per una breve pausa. È un'oasi di tranquillità in mezzo al trambusto cittadino. L'accesso è libero e aperto 24 ore su 24.",
        "descEN": "Breiavatnet is a small natural lake located right in the center of Stavanger, adjacent to the Cathedral and the railway station. It is a popular spot for relaxing walks and observing the swans and ducks that inhabit it. The surrounding park offers benches and green areas ideal for a short break. It is an oasis of tranquility amidst the city bustle. Access is free and open 24 hours a day.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Breiavatnet",
          "TripAdvisor: Breiavatnet"
        ],
        "maps": "https://maps.google.com/?q=58.96806,5.733"
      },
      {
        "tier": 1,
        "id": "sta-4",
        "name": "Øvre Holmegate",
        "nameEN": "Øvre Holmegate",
        "cat": "cultura",
        "lat": 58.97271,
        "lng": 5.73125,
        "short": "Esplora la strada più colorata di Stavanger, ricca di caffè e boutique.",
        "shortEN": "Explore Stavanger's most colorful street, full of cafes and boutiques.",
        "desc": "Øvre Holmegate, conosciuta anche come Fargegata (la strada dei colori), è una delle strade più vivaci e fotografate di Stavanger. Tutti gli edifici lungo la strada sono dipinti con colori vivaci e accesi, creando un'atmosfera unica e allegra. La strada è pedonale e ospita numerosi caffè, bar, boutique e negozi di artigianato. È il luogo perfetto per fare shopping o gustare un caffè all'aperto. L'accesso alla strada è libero in qualsiasi momento.",
        "descEN": "Øvre Holmegate, also known as Fargegata (the street of colors), is one of the most vibrant and photographed streets in Stavanger. All the buildings along the street are painted in bright, vivid colors, creating a unique and cheerful atmosphere. The street is pedestrianized and hosts numerous cafes, bars, boutiques, and craft shops. It is the perfect place for shopping or enjoying an outdoor coffee. Access to the street is free at any time.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikidata: Øvre Holmegate",
          "Locationscout: Øvre Holmegate"
        ],
        "maps": "https://maps.google.com/?q=58.97271,5.73125"
      },
      {
        "tier": 2,
        "id": "sta-5",
        "name": "Museo Norvegese del Petrolio",
        "nameEN": "Norwegian Petroleum Museum",
        "cat": "cultura",
        "lat": 58.97333,
        "lng": 5.73472,
        "short": "Scopri la storia dell'industria petrolifera norvegese in questo museo interattivo.",
        "shortEN": "Discover the history of the Norwegian oil industry in this interactive museum.",
        "desc": "Il Museo Norvegese del Petrolio (Norsk Oljemuseum) documenta la storia delle attività petrolifere e del gas in Norvegia. L'edificio stesso è un punto di riferimento architettonico, progettato per assomigliare a una piccola piattaforma petrolifera vista dal mare. Le mostre interattive spiegano come si formano petrolio e gas, come vengono estratti e il loro impatto sulla società norvegese. Il museo è aperto tutti i giorni in estate (10-19) e dal lunedì al sabato (10-16) con domenica (10-18) in inverno. I biglietti costano circa 150 NOK per gli adulti.",
        "descEN": "The Norwegian Petroleum Museum (Norsk Oljemuseum) documents the history of oil and gas activities in Norway. The building itself is an architectural landmark, designed to look like a small oil platform when seen from the sea. Interactive exhibits explain how oil and gas are formed, how they are extracted, and their impact on Norwegian society. The museum is open daily in summer (10-19) and Monday to Saturday (10-16) with Sunday (10-18) in winter. Tickets cost around 150 NOK for adults.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Norwegian Petroleum Museum",
          "Official site: norskolje.museum.no"
        ],
        "maps": "https://maps.google.com/?q=58.97333,5.73472"
      },
      {
        "id": "sta-6",
        "name": "Valbergtårnet",
        "nameEN": "Valbergtårnet",
        "cat": "panorama",
        "lat": 58.9718,
        "lng": 5.7315,
        "short": "Un'antica torre di avvistamento che offre viste panoramiche sul centro di Stavanger.",
        "shortEN": "A historic watchtower offering panoramic views over central Stavanger.",
        "desc": "La Torre Valberg (Valbergtårnet) è un'ex torre di avvistamento costruita nel 1853, situata nel punto più alto del centro città. Originariamente utilizzata dai guardiani per avvistare gli incendi, oggi ospita un piccolo museo dedicato alla sua storia. Dalla cima si gode di una vista panoramica spettacolare sulla città, sul porto di Vågen e sulle montagne circostanti. È un punto di riferimento iconico e un luogo perfetto per scattare fotografie.",
        "descEN": "The Valberg Tower (Valbergtårnet) is a former watchtower built in 1853, situated at the highest point in the city center. Originally used by watchmen to spot fires, it now houses a small museum dedicated to its history. From the top, visitors can enjoy spectacular panoramic views of the city, the Vågen harbor, and the surrounding mountains. It is an iconic landmark and a perfect spot for photography.",
        "tips": "L'ingresso alla torre ha un costo ridotto; verificare gli orari di apertura stagionali.",
        "tipsEN": "There is a small entrance fee for the tower; check seasonal opening hours.",
        "src": [
          "Wikipedia: Valbergtårnet",
          "Region Stavanger"
        ],
        "maps": "https://maps.google.com/?q=58.9718,5.7315"
      },
      {
        "id": "sta-7",
        "name": "Norsk Hermetikkmuseum",
        "nameEN": "Norsk Hermetikkmuseum",
        "cat": "cultura",
        "lat": 58.9733,
        "lng": 5.7266,
        "short": "Un museo affascinante situato in un'ex fabbrica di conserve di sardine.",
        "shortEN": "A fascinating museum located in a former sardine canning factory.",
        "desc": "Situato nel cuore della Città Vecchia (Gamle Stavanger), questo museo unico celebra l'industria conserviera che ha dominato l'economia della città dal 1890 al 1960. Ospitato in un'autentica fabbrica di conserve, mostra i macchinari originali e il processo di affumicatura e inscatolamento delle sardine. I visitatori possono persino assaggiare le sardine appena affumicate in determinati giorni. È un'immersione affascinante nella storia industriale norvegese.",
        "descEN": "Located in the heart of Old Stavanger (Gamle Stavanger), this unique museum celebrates the canning industry that dominated the city's economy from 1890 to 1960. Housed in an authentic former canning factory, it displays original machinery and the process of smoking and canning sardines. Visitors can even taste freshly smoked sardines on certain days. It offers a fascinating dive into Norwegian industrial history.",
        "tips": "Il biglietto è spesso combinato con il Museo Marittimo e altri musei cittadini.",
        "tipsEN": "The ticket is often combined with the Maritime Museum and other city museums.",
        "src": [
          "Museum Stavanger (MUST)",
          "Wikipedia: Norwegian Canning Museum"
        ],
        "maps": "https://maps.google.com/?q=58.9733,5.7266"
      },
      {
        "id": "sta-8",
        "name": "Stavanger Maritime Museum",
        "nameEN": "Stavanger Maritime Museum",
        "cat": "cultura",
        "lat": 58.9715,
        "lng": 5.7285,
        "short": "Museo che esplora la ricca storia marittima e commerciale di Stavanger.",
        "shortEN": "Museum exploring Stavanger's rich maritime and commercial history.",
        "desc": "Il Museo Marittimo di Stavanger è ospitato in magazzini mercantili splendidamente conservati lungo il porto di Vågen, risalenti al XVIII e XIX secolo. Le esposizioni illustrano oltre 200 anni di storia marittima locale, tra cui la costruzione navale, il commercio e la vita dei marinai. Gli interni storici, come l'ufficio del mercante e l'emporio, sono stati accuratamente ricostruiti. È una tappa essenziale per comprendere il profondo legame della città con il mare.",
        "descEN": "The Stavanger Maritime Museum is housed in beautifully preserved merchant warehouses along the Vågen harbor, dating back to the 18th and 19th centuries. The exhibitions illustrate over 200 years of local maritime history, including shipbuilding, trade, and the lives of sailors. Historic interiors, such as the merchant's office and general store, have been carefully reconstructed. It is an essential stop to understand the city's deep connection to the sea.",
        "tips": "Situato proprio sul porto, è facilmente accessibile a piedi dal centro.",
        "tipsEN": "Located right on the harbor, it is easily accessible on foot from the center.",
        "src": [
          "Museum Stavanger (MUST)",
          "Wikipedia: Stavanger Maritime Museum"
        ],
        "maps": "https://maps.google.com/?q=58.9715,5.7285"
      },
      {
        "tier": 1,
        "id": "sta-9",
        "name": "Vågen",
        "nameEN": "Vågen",
        "cat": "natura",
        "lat": 58.9725,
        "lng": 5.73,
        "short": "Il pittoresco porto storico, circondato da antichi magazzini in legno e locali vivaci.",
        "shortEN": "The picturesque historic harbor, surrounded by old wooden warehouses and lively venues.",
        "desc": "Vågen è il cuore storico e marittimo di Stavanger, un'insenatura naturale attorno alla quale si è sviluppata la città. Le sue banchine, in particolare Skagenkaien, sono fiancheggiate da colorati magazzini in legno che oggi ospitano vivaci bar, ristoranti e club. È il luogo ideale per una passeggiata rilassante, per ammirare le barche ormeggiate e per godersi l'atmosfera vibrante della città. Durante l'estate, l'area si anima con festival ed eventi all'aperto.",
        "descEN": "Vågen is the historic and maritime heart of Stavanger, a natural inlet around which the city developed. Its quays, particularly Skagenkaien, are lined with colorful wooden warehouses that now host lively bars, restaurants, and clubs. It is the ideal place for a relaxing stroll, to admire the moored boats, and to soak in the city's vibrant atmosphere. During the summer, the area comes alive with festivals and outdoor events.",
        "tips": "Perfetto per una passeggiata serale o per cenare con vista sul mare.",
        "tipsEN": "Perfect for an evening stroll or dining with a view of the sea.",
        "src": [
          "Region Stavanger",
          "Wikipedia: Vågen, Stavanger"
        ],
        "maps": "https://maps.google.com/?q=58.9725,5.73"
      },
      {
        "id": "sta-10",
        "name": "Stavanger Museum",
        "nameEN": "Stavanger Museum",
        "cat": "cultura",
        "lat": 58.9664,
        "lng": 5.7328,
        "short": "Un grande museo che unisce storia naturale, storia culturale e un museo interattivo per bambini.",
        "shortEN": "A large museum combining natural history, cultural history, and an interactive children's museum.",
        "desc": "Fondato nel 1877, lo Stavanger Museum è una delle istituzioni culturali più antiche della città. L'imponente edificio storico ospita due sezioni principali: il museo di storia naturale, con ampie collezioni zoologiche, e il museo di storia culturale, che esplora lo sviluppo di Stavanger. Una delle attrazioni più amate è il Museo dei Bambini (Norsk Barnemuseum), situato all'interno della stessa struttura, che offre mostre interattive sulla storia dell'infanzia.",
        "descEN": "Founded in 1877, the Stavanger Museum is one of the city's oldest cultural institutions. The impressive historic building houses two main sections: the natural history museum, featuring extensive zoological collections, and the cultural history museum, which explores the development of Stavanger. One of the most popular attractions is the Norwegian Children's Museum (Norsk Barnemuseum), located within the same facility, offering interactive exhibits on the history of childhood.",
        "tips": "Ottimo per le giornate di pioggia; il biglietto include l'accesso ad altri musei della rete MUST.",
        "tipsEN": "Great for rainy days; the ticket includes access to other museums in the MUST network.",
        "src": [
          "Museum Stavanger (MUST)",
          "Wikipedia: Stavanger Museum"
        ],
        "maps": "https://maps.google.com/?q=58.9664,5.7328"
      },
      {
        "id": "sta-11",
        "name": "Ledaal",
        "nameEN": "Ledaal",
        "cat": "cultura",
        "lat": 58.9669,
        "lng": 5.7214,
        "short": "Un'elegante villa storica che funge da residenza reale e museo.",
        "shortEN": "An elegant historic manor that serves as a royal residence and museum.",
        "desc": "Ledaal è una magnifica residenza signorile costruita tra il 1799 e il 1803 per la ricca famiglia di mercanti Kielland. Oggi funge da residenza ufficiale del Re di Norvegia quando visita Stavanger ed è aperta al pubblico come museo. Gli interni lussuosi, arredati con mobili d'epoca, offrono uno spaccato della vita dell'alta borghesia norvegese del XIX secolo. I giardini circostanti sono splendidamente curati e perfetti per una passeggiata tranquilla.",
        "descEN": "Ledaal is a magnificent manor house built between 1799 and 1803 for the wealthy Kielland merchant family. Today, it serves as the official residence of the King of Norway when visiting Stavanger and is open to the public as a museum. The luxurious interiors, furnished with period pieces, offer a glimpse into the life of the Norwegian upper class in the 19th century. The surrounding gardens are beautifully maintained and perfect for a quiet stroll.",
        "tips": "Si trova a breve distanza a piedi dal centro; verificare gli orari di apertura che variano stagionalmente.",
        "tipsEN": "Located a short walk from the center; check opening hours as they vary seasonally.",
        "src": [
          "Museum Stavanger (MUST)",
          "Wikipedia: Ledaal"
        ],
        "maps": "https://maps.google.com/?q=58.9669,5.7214"
      },
      {
        "id": "sta-12",
        "name": "Breidablikk",
        "nameEN": "Breidablikk",
        "cat": "cultura",
        "lat": 58.966,
        "lng": 5.721,
        "short": "Una villa del XIX secolo perfettamente conservata, con arredi originali e un bellissimo giardino.",
        "shortEN": "A perfectly preserved 19th-century villa with original furnishings and a beautiful garden.",
        "desc": "Situata proprio di fronte a Ledaal, Breidablikk è una villa eccezionalmente ben conservata costruita nel 1881 in stile svizzero per un ricco armatore. A differenza di molte case storiche, Breidablikk ha mantenuto quasi intatti i suoi arredi originali, le decorazioni e persino gli oggetti personali della famiglia. La visita offre un'esperienza autentica e intima della vita borghese vittoriana in Norvegia. La proprietà include anche un fienile storico e un rigoglioso giardino all'inglese.",
        "descEN": "Located right across from Ledaal, Breidablikk is an exceptionally well-preserved villa built in 1881 in the Swiss chalet style for a wealthy shipowner. Unlike many historic homes, Breidablikk has kept its original furnishings, decorations, and even the family's personal items almost entirely intact. A visit offers an authentic and intimate experience of Victorian bourgeois life in Norway. The property also includes a historic barn and a lush English-style garden.",
        "tips": "È possibile acquistare un biglietto combinato per visitare sia Breidablikk che la vicina Ledaal.",
        "tipsEN": "You can purchase a combined ticket to visit both Breidablikk and the nearby Ledaal.",
        "src": [
          "Museum Stavanger (MUST)",
          "Wikipedia: Breidablikk (Stavanger)"
        ],
        "maps": "https://maps.google.com/?q=58.966,5.721"
      }
    ]
  },
  "kristiansand": {
    "city": "Kristiansand",
    "cityEN": "Kristiansand",
    "country": "Norvegia",
    "countryEN": "Norway",
    "flag": "🇳🇴",
    "intro": "Scopri il fascino costiero di Kristiansand con questo itinerario a piedi. Dalle storiche case in legno alle moderne architetture sul mare, esplora il cuore del sud della Norvegia.",
    "introEN": "Discover the coastal charm of Kristiansand with this walking itinerary. From historic wooden houses to modern seaside architecture, explore the heart of southern Norway.",
    "center": [
      58.1443,
      7.9974
    ],
    "zoom": 14,
    "stops": [
      {
        "id": "kri-1",
        "name": "Kilden teater og konserthus",
        "nameEN": "Kilden Performing Arts Centre",
        "cat": "cultura",
        "lat": 58.14083,
        "lng": 7.99583,
        "short": "Un capolavoro di architettura moderna sul lungomare.",
        "shortEN": "A masterpiece of modern architecture on the waterfront.",
        "desc": "Il Kilden Performing Arts Centre è un punto di riferimento culturale inaugurato nel 2012. La sua iconica facciata in legno ondulato si affaccia sul mare, ospitando teatri e sale da concerto. È il secondo edificio culturale più grande della Norvegia. L'ingresso alle aree pubbliche è gratuito, mentre i biglietti per gli spettacoli variano.",
        "descEN": "The Kilden Performing Arts Centre is a cultural landmark opened in 2012. Its iconic undulating wooden facade overlooks the sea, housing theaters and concert halls. It is the second largest cultural building in Norway. Entrance to public areas is free, while show tickets vary.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Kilden Performing Arts Centre",
          "Official site kilden.com"
        ],
        "maps": "https://maps.google.com/?q=58.14083,7.99583"
      },
      {
        "tier": 1,
        "id": "kri-2",
        "name": "Fiskebrygga",
        "nameEN": "Fiskebrygga",
        "cat": "cibo",
        "lat": 58.14188,
        "lng": 7.99524,
        "short": "Il vivace mercato del pesce e zona di ristorazione.",
        "shortEN": "The lively fish market and dining area.",
        "desc": "Fiskebrygga, l'antico molo del pesce, è stato riqualificato in una vivace area con ristoranti e gelaterie. Qui puoi vedere pesci e crostacei vivi nelle vasche del mercato del pesce. È il luogo ideale per assaggiare specialità di mare locali. I ristoranti sono aperti tutti i giorni, con orari prolungati in estate.",
        "descEN": "Fiskebrygga, the former fish wharf, has been redeveloped into a vibrant area with restaurants and ice cream parlors. Here you can see live fish and shellfish in the fish market tanks. It is the ideal place to taste local seafood specialties. Restaurants are open daily, with extended hours in summer.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Fiskebrygga, Kristiansand",
          "Visit Norway: Fiskebrygga"
        ],
        "maps": "https://maps.google.com/?q=58.14188,7.99524"
      },
      {
        "tier": 1,
        "id": "kri-3",
        "name": "Christiansholm Festning",
        "nameEN": "Christiansholm Fortress",
        "cat": "cultura",
        "lat": 58.14422,
        "lng": 8.00291,
        "short": "Una fortezza del XVII secolo che proteggeva il porto.",
        "shortEN": "A 17th-century fortress that protected the harbor.",
        "desc": "Costruita nel 1672 per ordine del re Federico III, questa fortezza costiera difendeva la città. Passeggia lungo i bastioni per ammirare i vecchi cannoni e la vista sul mare. Si trova lungo la passeggiata costiera, vicino alla spiaggia cittadina. L'accesso ai giardini e ai bastioni è gratuito e aperto al pubblico.",
        "descEN": "Built in 1672 by order of King Frederick III, this coastal fortress defended the city. Walk along the ramparts to admire the old cannons and sea views. It is located along the coastal promenade, near the city beach. Access to the grounds and ramparts is free and open to the public.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Christiansholm Fortress",
          "Visit Norway: Christiansholm Fortress"
        ],
        "maps": "https://maps.google.com/?q=58.14422,8.00291"
      },
      {
        "id": "kri-4",
        "name": "Kristiansand Domkirke",
        "nameEN": "Kristiansand Cathedral",
        "cat": "cultura",
        "lat": 58.14611,
        "lng": 7.99462,
        "short": "Una delle cattedrali neogotiche più grandi della Norvegia.",
        "shortEN": "One of the largest neo-Gothic cathedrals in Norway.",
        "desc": "Completata nel 1885, la Cattedrale di Kristiansand domina il centro della città. È un imponente edificio neogotico con una torre alta 70 metri. La chiesa può ospitare circa 1.000 persone ed è la chiesa principale della diocesi. L'ingresso è gratuito, con orari di apertura regolari durante il giorno.",
        "descEN": "Completed in 1885, Kristiansand Cathedral dominates the city center. It is an impressive neo-Gothic building with a 70-meter high tower. The church can seat about 1,000 people and is the main church of the diocese. Entrance is free, with regular opening hours during the day.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Kristiansand Cathedral",
          "Visit Norway: Kristiansand Cathedral"
        ],
        "maps": "https://maps.google.com/?q=58.14611,7.99462"
      },
      {
        "tier": 1,
        "id": "kri-5",
        "name": "Posebyen",
        "nameEN": "Posebyen",
        "cat": "cultura",
        "lat": 58.14833,
        "lng": 7.99833,
        "short": "L'affascinante centro storico con case in legno bianco.",
        "shortEN": "The charming old town with white wooden houses.",
        "desc": "Posebyen è il quartiere più antico di Kristiansand e l'unica parte sopravvissuta al grande incendio del 1892. Ospita una delle più grandi collezioni di vecchie case in legno bianco del Nord Europa. Passeggiare per queste strade idilliache offre un tuffo nel passato. L'area è residenziale e liberamente esplorabile a piedi.",
        "descEN": "Posebyen is the oldest neighborhood in Kristiansand and the only part that survived the great city fire of 1892. It houses one of Northern Europe's largest collections of old white wooden houses. Strolling through these idyllic streets offers a glimpse into the past. The area is residential and freely explorable on foot.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Visit Norway: Posebyen",
          "Wikipedia: Kristiansand"
        ],
        "maps": "https://maps.google.com/?q=58.14833,7.99833"
      },
      {
        "id": "kri-6",
        "name": "Torvet",
        "nameEN": "Torvet",
        "cat": "cultura",
        "lat": 58.1455,
        "lng": 7.9955,
        "short": "La vivace piazza centrale di Kristiansand, circondata da edifici storici e caffè.",
        "shortEN": "The lively central square of Kristiansand, surrounded by historic buildings and cafes.",
        "desc": "Torvet è la piazza principale e il cuore pulsante di Kristiansand, situata nel centro del reticolo stradale noto come Kvadraturen. Circondata da edifici storici, tra cui il Municipio e la Cattedrale, la piazza è un vivace punto di incontro. Durante l'estate ospita un mercato all'aperto dove si possono acquistare prodotti locali, fiori e artigianato. È anche il luogo ideale per sedersi in uno dei tanti caffè all'aperto e osservare la vita cittadina.",
        "descEN": "Torvet is the main square and the beating heart of Kristiansand, located in the center of the grid pattern known as Kvadraturen. Surrounded by historic buildings, including the City Hall and the Cathedral, the square is a lively meeting point. During the summer, it hosts an open-air market where you can buy local produce, flowers, and crafts. It is also the perfect place to sit at one of the many outdoor cafes and watch city life go by.",
        "tips": "Visita la piazza durante i giorni di mercato per un'esperienza più autentica.",
        "tipsEN": "Visit the square during market days for a more authentic experience.",
        "src": [
          "Visit Norway",
          "Wikipedia: Torvet i Kristiansand"
        ],
        "maps": "https://maps.google.com/?q=58.1455,7.9955"
      },
      {
        "id": "kri-7",
        "name": "Bystranda",
        "nameEN": "Bystranda",
        "cat": "natura",
        "lat": 58.1448,
        "lng": 8.0065,
        "short": "Una bellissima spiaggia sabbiosa cittadina con Bandiera Blu, perfetta per rilassarsi.",
        "shortEN": "A beautiful Blue Flag sandy city beach, perfect for relaxing.",
        "desc": "Bystranda è la spiaggia cittadina di Kristiansand, situata a pochi passi dal centro storico. Questa spiaggia sabbiosa è insignita della Bandiera Blu, garantendo acque pulite e servizi eccellenti per i visitatori. È circondata da un piacevole lungomare, palme che le conferiscono un'atmosfera esotica e sculture all'aperto. Durante l'estate, è un luogo vivace dove locali e turisti si rilassano, nuotano e si godono il sole.",
        "descEN": "Bystranda is Kristiansand's city beach, located just a short walk from the historic center. This sandy beach boasts a Blue Flag status, ensuring clean water and excellent facilities for visitors. It is surrounded by a pleasant promenade, palm trees that give it an exotic vibe, and outdoor sculptures. During the summer, it is a lively spot where locals and tourists alike relax, swim, and soak up the sun.",
        "tips": "Molto affollata in estate; ci sono bagni pubblici e docce disponibili.",
        "tipsEN": "Very crowded in summer; public restrooms and showers are available.",
        "src": [
          "Visit Norway: Bystranda",
          "Wikipedia: Bystranda"
        ],
        "maps": "https://maps.google.com/?q=58.1448,8.0065"
      },
      {
        "tier": 2,
        "id": "kri-8",
        "name": "Kunstsilo",
        "nameEN": "Kunstsilo",
        "cat": "cultura",
        "lat": 58.13962,
        "lng": 7.99724,
        "short": "Un museo d'arte innovativo ospitato in un ex silo per il grano, con un'incredibile collezione di arte nordica.",
        "shortEN": "An innovative art museum housed in a former grain silo, featuring an incredible collection of Nordic art.",
        "desc": "Il Kunstsilo è un museo d'arte all'avanguardia situato in un ex silo per il grano ristrutturato sull'isola di Odderøya. Inaugurato di recente, ospita la vasta collezione Tangen di arte modernista nordica, oltre a mostre temporanee di arte contemporanea. L'architettura stessa è un'attrazione, combinando il patrimonio industriale con il design moderno. I visitatori possono godere di viste panoramiche sulla città e sull'arcipelago dal tetto dell'edificio.",
        "descEN": "Kunstsilo is a cutting-edge art museum housed in a beautifully restored former grain silo on the island of Odderøya. Recently opened, it showcases the extensive Tangen Collection of Nordic modernist art, alongside temporary contemporary exhibitions. The architecture itself is a major draw, blending industrial heritage with modern design. Visitors can also enjoy panoramic views of the city and archipelago from the building's rooftop.",
        "tips": "Controlla gli orari di apertura online; il bar sul tetto offre ottime viste.",
        "tipsEN": "Check opening hours online; the rooftop bar offers great views.",
        "src": [
          "Wikipedia: Kunstsilo",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=58.13962,7.99724"
      },
      {
        "id": "kri-9",
        "name": "Odderøya",
        "nameEN": "Odderøya",
        "cat": "natura",
        "lat": 58.1355,
        "lng": 7.9986,
        "short": "Un'isola pittoresca vicino al centro, ideale per passeggiate nella natura e per esplorare la storia militare.",
        "shortEN": "A picturesque island near the center, ideal for nature walks and exploring military history.",
        "desc": "Odderøya è un'isola idilliaca collegata al centro della città da un ponte, offrendo una fuga perfetta nella natura. Un tempo base navale, l'isola è ora un'area ricreativa popolare con sentieri panoramici, vecchie installazioni militari e calette nascoste. Passeggiando lungo la costa, si possono ammirare viste mozzafiato sul mare e sul faro di Odderøya. L'isola ospita anche caffè affascinanti e studi di artisti locali.",
        "descEN": "Odderøya is an idyllic island connected to the city center by a bridge, offering a perfect escape into nature. Once a naval base, the island is now a popular recreational area featuring scenic walking trails, old military installations, and hidden coves. Strolling along the coastline provides stunning views of the sea and the Odderøya Lighthouse. The island is also home to charming cafes and local artist studios.",
        "tips": "Indossa scarpe comode per camminare; ci sono ottimi punti per un picnic.",
        "tipsEN": "Wear comfortable walking shoes; there are great spots for a picnic.",
        "src": [
          "Visit Norway: Odderøya",
          "Wikipedia: Odderøya"
        ],
        "maps": "https://maps.google.com/?q=58.1355,7.9986"
      },
      {
        "id": "kri-10",
        "name": "Baneheia",
        "nameEN": "Baneheia",
        "cat": "natura",
        "lat": 58.152,
        "lng": 7.988,
        "short": "Un'area naturale vicino al centro con sentieri, laghetti e punti panoramici.",
        "shortEN": "A natural area near the center with trails, small lakes, and viewpoints.",
        "desc": "Baneheia è una vasta area naturale situata appena a nord del centro di Kristiansand, facilmente raggiungibile a piedi. Offre una rete di sentieri ben curati, perfetti per escursioni leggere, jogging o passeggiate nella foresta. L'area è punteggiata da numerosi laghetti, alcuni dei quali sono popolari per fare il bagno in estate. Dal punto panoramico, si può godere di una vista spettacolare sulla città e sul mare.",
        "descEN": "Baneheia is a vast natural area located just north of Kristiansand's center, easily accessible on foot. It offers a network of well-maintained trails, perfect for light hiking, jogging, or walking through the forest. The area is dotted with several small lakes, some of which are popular for swimming in the summer. From the viewpoint, you can enjoy spectacular views of the city and the sea.",
        "tips": "I sentieri sono ben segnalati; porta un costume da bagno in estate per un tuffo nei laghi.",
        "tipsEN": "Trails are well-marked; bring a swimsuit in summer for a dip in the lakes.",
        "src": [
          "Visit Norway: Baneheia",
          "Wikipedia: Baneheia"
        ],
        "maps": "https://maps.google.com/?q=58.152,7.988"
      },
      {
        "tier": 1,
        "id": "kri-11",
        "name": "Ravnedalen Naturpark",
        "nameEN": "Ravnedalen Naturpark",
        "cat": "natura",
        "lat": 58.1545,
        "lng": 7.9755,
        "short": "Un romantico parco naturale con laghetti, scogliere e un'atmosfera tranquilla.",
        "shortEN": "A romantic nature park with ponds, cliffs, and a tranquil atmosphere.",
        "desc": "Ravnedalen è un incantevole parco naturale situato a nord-ovest del centro di Kristiansand, noto per i suoi paesaggi romantici e le scogliere scoscese. Creato alla fine del XIX secolo dal generale Joseph Frantz Oscar Wergeland, il parco presenta laghetti tranquilli, ponti pittoreschi e una ricca varietà di alberi e piante. È un luogo amato per passeggiate rilassanti e picnic. Durante l'estate, il parco ospita spesso concerti all'aperto e spettacoli teatrali.",
        "descEN": "Ravnedalen is an enchanting nature park located northwest of Kristiansand's center, known for its romantic landscapes and steep cliffs. Created in the late 19th century by General Joseph Frantz Oscar Wergeland, the park features tranquil ponds, picturesque bridges, and a rich variety of trees and plants. It is a beloved spot for relaxing walks and picnics. During the summer, the park frequently hosts open-air concerts and theatrical performances.",
        "tips": "Il Café Generalen all'interno del parco è famoso per i suoi deliziosi hamburger.",
        "tipsEN": "Café Generalen inside the park is famous for its delicious burgers.",
        "src": [
          "Visit Norway: Ravnedalen",
          "Wikipedia: Ravnedalen"
        ],
        "maps": "https://maps.google.com/?q=58.1545,7.9755"
      },
      {
        "id": "kri-12",
        "name": "Gimle Gård",
        "nameEN": "Gimle Gård",
        "cat": "cultura",
        "lat": 58.1585,
        "lng": 8.004,
        "short": "Un'elegante dimora storica del XIX secolo circondata da splendidi giardini.",
        "shortEN": "An elegant 19th-century historic mansion surrounded by beautiful gardens.",
        "desc": "Gimle Gård è una magnifica tenuta storica situata a breve distanza dal centro, oltre il fiume Otra. Costruita intorno al 1800 come residenza estiva per un ricco mercante, la villa è circondata da un bellissimo giardino all'inglese. Gli interni sono conservati in modo impeccabile, offrendo uno sguardo affascinante sulla vita dell'alta borghesia norvegese nei secoli passati. Oggi fa parte del Museo di Kristiansand e ospita collezioni di mobili d'epoca e dipinti.",
        "descEN": "Gimle Gård is a magnificent historic estate located a short distance from the center, across the Otra river. Built around 1800 as a summer residence for a wealthy merchant, the mansion is surrounded by a beautiful English-style garden. The interiors are impeccably preserved, offering a fascinating glimpse into the life of the Norwegian upper class in past centuries. Today it is part of the Kristiansand Museum and houses collections of period furniture and paintings.",
        "tips": "Controlla gli orari delle visite guidate per esplorare gli interni della villa.",
        "tipsEN": "Check the schedule for guided tours to explore the interior of the mansion.",
        "src": [
          "Vest-Agder Museum",
          "Wikipedia: Gimle Gård"
        ],
        "maps": "https://maps.google.com/?q=58.1585,8.004"
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 2,
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
      },
      {
        "id": "ber-6",
        "name": "Bergen Domkirke",
        "nameEN": "Bergen Domkirke",
        "cat": "cultura",
        "lat": 60.3944,
        "lng": 5.3294,
        "short": "Storica cattedrale con una palla di cannone incastonata nella facciata.",
        "shortEN": "Historic cathedral with a cannonball embedded in its facade.",
        "desc": "La Cattedrale di Bergen, dedicata a Sant'Olav, vanta una storia lunga quasi 900 anni, segnata da numerosi incendi e ricostruzioni. La sua architettura attuale mescola elementi romanici e gotici, con una facciata imponente e un interno sobrio ma suggestivo. Un dettaglio curioso è la palla di cannone incastrata nella facciata esterna, ricordo della Battaglia di Vågen del 1665 tra flotte inglesi e olandesi. È un luogo di pace e spiritualità nel cuore della città.",
        "descEN": "Bergen Cathedral, dedicated to St. Olav, boasts a history of nearly 900 years, marked by numerous fires and reconstructions. Its current architecture mixes Romanesque and Gothic elements, with an imposing facade and a sober yet evocative interior. A curious detail is the cannonball embedded in the exterior wall, a reminder of the 1665 Battle of Vågen between English and Dutch fleets. It is a place of peace and spirituality in the heart of the city.",
        "tips": "Ingresso gratuito, ma gli orari di apertura possono variare.",
        "tipsEN": "Free entry, but opening hours may vary.",
        "src": [
          "Wikipedia: Bergen Cathedral"
        ],
        "maps": "https://maps.google.com/?q=60.3944,5.3294"
      },
      {
        "id": "ber-7",
        "name": "St. Jørgen's Hospital",
        "nameEN": "St. Jørgen's Hospital",
        "cat": "cultura",
        "lat": 60.3917,
        "lng": 5.3325,
        "short": "Antico ospedale che racconta la storia della ricerca sulla lebbra.",
        "shortEN": "Historic hospital telling the story of leprosy research.",
        "desc": "Il Museo della Lazzaretto si trova nell'antico Ospedale di San Giorgio, uno dei complessi ospedalieri in legno meglio conservati d'Europa. Bergen fu un centro cruciale per la ricerca sulla lebbra nel XIX secolo, grazie al lavoro del medico norvegese Gerhard Armauer Hansen che qui scoprì il batterio responsabile della malattia. Il museo racconta la toccante storia dei pazienti e i progressi medici che hanno cambiato il mondo. L'atmosfera all'interno è solenne e profondamente educativa.",
        "descEN": "The Leprosy Museum is located in the historic St. Jørgen's Hospital, one of the best-preserved wooden hospital complexes in Europe. Bergen was a crucial center for leprosy research in the 19th century, thanks to the work of Norwegian physician Gerhard Armauer Hansen, who discovered the leprosy bacterium here. The museum tells the touching story of the patients and the medical breakthroughs that changed the world. The atmosphere inside is solemn and deeply educational.",
        "tips": "Aperto principalmente durante i mesi estivi.",
        "tipsEN": "Open primarily during the summer months.",
        "src": [
          "Wikipedia: St. Jørgen's Hospital",
          "KODE Museums"
        ],
        "maps": "https://maps.google.com/?q=60.3917,5.3325"
      },
      {
        "tier": 1,
        "id": "ber-8",
        "name": "KODE Art Museums",
        "nameEN": "KODE Art Museums",
        "cat": "cultura",
        "lat": 60.3897,
        "lng": 5.3278,
        "short": "Importante complesso museale con opere di Edvard Munch.",
        "shortEN": "Major museum complex featuring works by Edvard Munch.",
        "desc": "Il complesso museale KODE è uno dei più grandi poli dedicati all'arte, al design e alla musica nei paesi nordici. Situato lungo le sponde del lago Lille Lungegårdsvannet, si divide in quattro edifici principali (KODE 1, 2, 3 e 4). Ospita collezioni straordinarie, tra cui la terza più grande collezione al mondo di opere di Edvard Munch, oltre a capolavori di Nikolai Astrup e arte contemporanea. Un'esperienza imperdibile per gli amanti dell'arte e della cultura norvegese.",
        "descEN": "The KODE museum complex is one of the largest centers for art, design, and music in the Nordic countries. Located along the shores of Lake Lille Lungegårdsvannet, it is divided into four main buildings (KODE 1, 2, 3, and 4). It houses extraordinary collections, including the world's third-largest collection of works by Edvard Munch, as well as masterpieces by Nikolai Astrup and contemporary art. An unmissable experience for lovers of Norwegian art and culture.",
        "tips": "Un unico biglietto consente l'accesso a tutti e quattro gli edifici per due giorni.",
        "tipsEN": "A single ticket grants access to all four buildings for two days.",
        "src": [
          "Wikipedia: KODE",
          "Official Site"
        ],
        "maps": "https://maps.google.com/?q=60.3897,5.3278"
      },
      {
        "id": "ber-9",
        "name": "Grieghallen",
        "nameEN": "Grieghallen",
        "cat": "cultura",
        "lat": 60.3886,
        "lng": 5.3283,
        "short": "Moderna sala da concerti intitolata a Edvard Grieg.",
        "shortEN": "Modern concert hall named after Edvard Grieg.",
        "desc": "La Grieghallen è la principale sala da concerti di Bergen, intitolata al celebre compositore norvegese Edvard Grieg. L'edificio, con la sua architettura moderna e la forma che ricorda un pianoforte a coda, è un punto di riferimento visivo e culturale. È la sede dell'Orchestra Filarmonica di Bergen e ospita numerosi eventi, dal balletto all'opera, fino a concerti di musica contemporanea. L'acustica eccezionale rende ogni spettacolo un'esperienza memorabile.",
        "descEN": "Grieghallen is the main concert hall in Bergen, named after the famous Norwegian composer Edvard Grieg. The building, with its modern architecture and shape resembling a grand piano, is a visual and cultural landmark. It is home to the Bergen Philharmonic Orchestra and hosts numerous events, from ballet and opera to contemporary music concerts. The exceptional acoustics make every performance a memorable experience.",
        "tips": "Prenota i biglietti in anticipo se desideri assistere a un concerto.",
        "tipsEN": "Book tickets in advance if you wish to attend a concert.",
        "src": [
          "Wikipedia: Grieg Hall",
          "Official Site"
        ],
        "maps": "https://maps.google.com/?q=60.3886,5.3283"
      },
      {
        "id": "ber-10",
        "name": "Byparken",
        "nameEN": "Byparken",
        "cat": "natura",
        "lat": 60.3914,
        "lng": 5.3253,
        "short": "Elegante parco cittadino con un iconico padiglione della musica.",
        "shortEN": "Elegant city park with an iconic music pavilion.",
        "desc": "Byparken è il parco centrale di Bergen, un'elegante area verde che collega il lago Lille Lungegårdsvannet con la piazza Torgallmenningen. Caratterizzato da aiuole fiorite, prati curati e un iconico padiglione della musica (Musikkpaviljongen) in stile moresco, è un luogo di ritrovo storico. Durante l'estate, il padiglione ospita spesso concerti gratuiti e performance all'aperto. È il cuore verde della città, perfetto per una sosta rilassante tra una visita e l'altra.",
        "descEN": "Byparken is the central park of Bergen, an elegant green area connecting Lake Lille Lungegårdsvannet with Torgallmenningen square. Characterized by flower beds, manicured lawns, and an iconic Moorish-style music pavilion (Musikkpaviljongen), it is a historic gathering place. During the summer, the pavilion often hosts free concerts and outdoor performances. It is the green heart of the city, perfect for a relaxing break between visits.",
        "tips": "Ottimo posto per rilassarsi e ascoltare musica dal vivo in estate.",
        "tipsEN": "Great place to relax and listen to live music in the summer.",
        "src": [
          "Visit Bergen: Byparken"
        ],
        "maps": "https://maps.google.com/?q=60.3914,5.3253"
      },
      {
        "id": "ber-11",
        "name": "Torgallmenningen",
        "nameEN": "Torgallmenningen",
        "cat": "cultura",
        "lat": 60.3928,
        "lng": 5.3242,
        "short": "La vivace piazza principale e via pedonale di Bergen.",
        "shortEN": "The bustling main square and pedestrian street of Bergen.",
        "desc": "Torgallmenningen è la piazza e la strada pedonale principale di Bergen, il vero cuore pulsante della vita cittadina. Ricostruita in stile neoclassico e funzionalista dopo il devastante incendio del 1916, è fiancheggiata da negozi, caffè e grandi magazzini. Al centro spicca il Monumento ai Marinai (Sjømannsmonumentet), che celebra il legame storico della Norvegia con il mare. È il luogo ideale per passeggiare, fare shopping e osservare il viavai quotidiano.",
        "descEN": "Torgallmenningen is the main square and pedestrian street of Bergen, the true beating heart of city life. Rebuilt in Neoclassical and Functionalist styles after the devastating fire of 1916, it is lined with shops, cafes, and department stores. In the center stands the Sailors' Monument (Sjømannsmonumentet), celebrating Norway's historic connection to the sea. It is the ideal place for strolling, shopping, and people-watching.",
        "tips": "Ottimo punto di partenza per esplorare il centro città.",
        "tipsEN": "Great starting point for exploring the city center.",
        "src": [
          "Wikipedia: Torgallmenningen"
        ],
        "maps": "https://maps.google.com/?q=60.3928,5.3242"
      },
      {
        "id": "ber-12",
        "name": "Den Nationale Scene",
        "nameEN": "Den Nationale Scene",
        "cat": "cultura",
        "lat": 60.3925,
        "lng": 5.3197,
        "short": "Storico teatro norvegese in un elegante edificio Art Nouveau.",
        "shortEN": "Historic Norwegian theater in an elegant Art Nouveau building.",
        "desc": "Den Nationale Scene è il più antico teatro permanente della Norvegia, fondato originariamente nel 1850 su iniziativa del celebre violinista Ole Bull. L'edificio attuale, un magnifico esempio di architettura in stile Art Nouveau, fu inaugurato nel 1909. Il teatro ha un forte legame con il drammaturgo Henrik Ibsen, che vi lavorò come scrittore e regista. Anche senza assistere a uno spettacolo, l'eleganza della struttura e il parco circostante meritano una visita.",
        "descEN": "Den Nationale Scene is the oldest permanent theater in Norway, originally founded in 1850 on the initiative of the famous violinist Ole Bull. The current building, a magnificent example of Art Nouveau architecture, was inaugurated in 1909. The theater has a strong connection with playwright Henrik Ibsen, who worked there as a writer and director. Even without attending a performance, the elegance of the structure and the surrounding park are worth a visit.",
        "tips": "Controlla il programma per eventuali visite guidate o spettacoli.",
        "tipsEN": "Check the schedule for any guided tours or performances.",
        "src": [
          "Wikipedia: Den Nationale Scene"
        ],
        "maps": "https://maps.google.com/?q=60.3925,5.3197"
      },
      {
        "id": "ber-13",
        "name": "Johanneskirken",
        "nameEN": "Johanneskirken",
        "cat": "cultura",
        "lat": 60.3897,
        "lng": 5.3206,
        "short": "La chiesa più grande di Bergen, in stile neogotico.",
        "shortEN": "The largest church in Bergen, built in Neo-Gothic style.",
        "desc": "La Chiesa di San Giovanni, con la sua imponente facciata in mattoni rossi e la torre alta 61 metri, domina lo skyline di Bergen dalla collina di Sydnes. Costruita in stile neogotico alla fine del XIX secolo, è la chiesa più grande della città. L'interno è luminoso e maestoso, caratterizzato da un bellissimo soffitto in legno e un organo imponente. La scalinata che conduce alla chiesa offre anche un'ottima vista panoramica sul centro cittadino.",
        "descEN": "St. John's Church, with its imposing red brick facade and 61-meter-high tower, dominates the Bergen skyline from Sydnes hill. Built in the Neo-Gothic style at the end of the 19th century, it is the largest church in the city. The interior is bright and majestic, featuring a beautiful wooden ceiling and an impressive organ. The staircase leading up to the church also offers a great panoramic view of the city center.",
        "tips": "La salita può essere faticosa, ma la vista ripaga lo sforzo.",
        "tipsEN": "The climb can be tiring, but the view is worth the effort.",
        "src": [
          "Wikipedia: St. John's Church, Bergen"
        ],
        "maps": "https://maps.google.com/?q=60.3897,5.3206"
      },
      {
        "id": "ber-14",
        "name": "Nordnesparken",
        "nameEN": "Nordnesparken",
        "cat": "natura",
        "lat": 60.4008,
        "lng": 5.3053,
        "short": "Parco panoramico sulla punta della penisola di Nordnes.",
        "shortEN": "Scenic park at the tip of the Nordnes peninsula.",
        "desc": "Situato sulla punta della penisola di Nordnes, questo parco offre alcune delle viste più spettacolari sul fiordo e sulle montagne circostanti. Creato alla fine del XIX secolo, il parco è caratterizzato da ampi prati, alberi secolari e un totem donato dalla città gemellata di Seattle. È un luogo molto amato dai locali per rilassarsi, fare il bagno nelle acque del fiordo durante l'estate o ammirare il tramonto. Una passeggiata qui permette di sfuggire al trambusto del centro.",
        "descEN": "Located at the tip of the Nordnes peninsula, this park offers some of the most spectacular views of the fjord and surrounding mountains. Created at the end of the 19th century, the park features large lawns, ancient trees, and a totem pole donated by the sister city of Seattle. It is a beloved spot for locals to relax, swim in the fjord waters during the summer, or watch the sunset. A walk here allows you to escape the hustle and bustle of the center.",
        "tips": "Porta con te un costume da bagno in estate per un tuffo nel fiordo.",
        "tipsEN": "Bring a swimsuit in summer for a dip in the fjord.",
        "src": [
          "Wikipedia: Nordnes"
        ],
        "maps": "https://maps.google.com/?q=60.4008,5.3053"
      },
      {
        "id": "ber-15",
        "name": "Akvariet i Bergen",
        "nameEN": "Akvariet i Bergen",
        "cat": "kids",
        "lat": 60.3994,
        "lng": 5.3044,
        "short": "Acquario storico con fauna marina locale, pinguini e foche.",
        "shortEN": "Historic aquarium featuring local marine life, penguins, and seals.",
        "desc": "L'Acquario di Bergen, situato vicino al Nordnesparken, è una delle attrazioni più popolari della città, ideale per famiglie e amanti della natura. Ospita una vasta gamma di specie marine norvegesi e internazionali, oltre a pinguini, foche e persino rettili. Le esposizioni interattive e le sessioni di alimentazione giornaliere offrono un'esperienza educativa e divertente. È un'ottima opportunità per conoscere da vicino la ricca biodiversità marina della costa norvegese.",
        "descEN": "The Bergen Aquarium, located near Nordnesparken, is one of the city's most popular attractions, ideal for families and nature lovers. It houses a wide range of Norwegian and international marine species, as well as penguins, seals, and even reptiles. Interactive exhibits and daily feeding sessions offer an educational and fun experience. It is a great opportunity to get up close to the rich marine biodiversity of the Norwegian coast.",
        "tips": "Controlla gli orari delle sessioni di alimentazione per non perderle.",
        "tipsEN": "Check the feeding session times so you don't miss them.",
        "src": [
          "Wikipedia: Bergen Aquarium",
          "Official Site"
        ],
        "maps": "https://maps.google.com/?q=60.3994,5.3044"
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
        "tier": 2,
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 1,
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
      },
      {
        "tier": 2,
        "id": "cph-6",
        "name": "Tivoli Gardens",
        "nameEN": "Tivoli Gardens",
        "cat": "attivita",
        "lat": 55.6736,
        "lng": 12.5681,
        "short": "Storico parco divertimenti nel centro città con giardini magici e giostre d'epoca.",
        "shortEN": "Historic amusement park in the city center featuring magical gardens and vintage rides.",
        "desc": "I Giardini di Tivoli sono uno dei parchi di divertimento più antichi del mondo, inaugurato nel 1843. Situato nel cuore di Copenaghen, offre un'atmosfera magica con giardini curati, architetture esotiche e giostre storiche. Di sera, migliaia di luci colorate illuminano il parco creando un ambiente fiabesco. È un luogo amato sia dai locali che dai turisti per passeggiare, cenare e assistere a spettacoli dal vivo.",
        "descEN": "Tivoli Gardens is one of the oldest amusement parks in the world, having opened in 1843. Located in the heart of Copenhagen, it offers a magical atmosphere with manicured gardens, exotic architecture, and historic rides. In the evening, thousands of colored lights illuminate the park, creating a fairytale environment. It is a beloved spot for both locals and tourists to stroll, dine, and watch live performances.",
        "tips": "L'ingresso è a pagamento; le giostre richiedono biglietti separati o un pass illimitato.",
        "tipsEN": "Admission requires a ticket; rides require separate tickets or an unlimited pass.",
        "src": [
          "Wikipedia: Tivoli Gardens",
          "Official Website"
        ],
        "maps": "https://maps.google.com/?q=55.6736,12.5681"
      },
      {
        "tier": 1,
        "id": "cph-7",
        "name": "Christiansborg Palace",
        "nameEN": "Christiansborg Palace",
        "cat": "cultura",
        "lat": 55.6762,
        "lng": 12.5806,
        "short": "Imponente palazzo reale che ospita il Parlamento danese e sfarzose sale di rappresentanza.",
        "shortEN": "Imposing royal palace housing the Danish Parliament and lavish reception rooms.",
        "desc": "Il Palazzo di Christiansborg sorge sull'isolotto di Slotsholmen ed è la sede del Parlamento danese, dell'Ufficio del Primo Ministro e della Corte Suprema. Questo imponente edificio storico è l'unico al mondo a ospitare tutti e tre i poteri dello Stato. I visitatori possono esplorare le sfarzose Sale di Rappresentanza Reali, le rovine sotterranee dei castelli precedenti e le scuderie reali. La torre del palazzo offre inoltre una delle migliori viste panoramiche sulla città.",
        "descEN": "Christiansborg Palace is located on the islet of Slotsholmen and houses the Danish Parliament, the Prime Minister's Office, and the Supreme Court. This imposing historic building is the only one in the world to house all three branches of government. Visitors can explore the lavish Royal Reception Rooms, the underground ruins of previous castles, and the royal stables. The palace tower also offers one of the best panoramic views of the city.",
        "tips": "La salita alla torre è gratuita, ma le sale reali richiedono un biglietto d'ingresso.",
        "tipsEN": "Access to the tower is free, but the royal rooms require an entrance ticket.",
        "src": [
          "Wikipedia: Christiansborg Palace"
        ],
        "maps": "https://maps.google.com/?q=55.6762,12.5806"
      },
      {
        "tier": 2,
        "id": "cph-8",
        "name": "The Little Mermaid",
        "nameEN": "The Little Mermaid",
        "cat": "cultura",
        "lat": 55.6928,
        "lng": 12.5992,
        "short": "Iconica statua in bronzo ispirata alla celebre fiaba di Hans Christian Andersen.",
        "shortEN": "Iconic bronze statue inspired by Hans Christian Andersen's famous fairy tale.",
        "desc": "La Sirenetta è una celebre scultura in bronzo creata da Edvard Eriksen nel 1913, ispirata all'omonima fiaba di Hans Christian Andersen. Situata sul lungomare di Langelinie, la statua è diventata il simbolo indiscusso di Copenaghen. Nonostante le sue dimensioni modeste, attira milioni di visitatori ogni anno. La sua posizione pittoresca sugli scogli offre un'ottima occasione per una passeggiata lungo il porto.",
        "descEN": "The Little Mermaid is a famous bronze sculpture created by Edvard Eriksen in 1913, inspired by Hans Christian Andersen's fairy tale of the same name. Located on the Langelinie promenade, the statue has become the undisputed symbol of Copenhagen. Despite its modest size, it attracts millions of visitors every year. Its picturesque setting on the rocks offers a great opportunity for a stroll along the harbor.",
        "tips": "Visitala la mattina presto per evitare le grandi folle di turisti.",
        "tipsEN": "Visit early in the morning to avoid the large crowds of tourists.",
        "src": [
          "Wikipedia: The Little Mermaid (statue)"
        ],
        "maps": "https://maps.google.com/?q=55.6928,12.5992"
      },
      {
        "id": "cph-9",
        "name": "Kastellet",
        "nameEN": "Kastellet",
        "cat": "natura",
        "lat": 55.6914,
        "lng": 12.5936,
        "short": "Antica fortezza a forma di stella, oggi un tranquillo parco con un pittoresco mulino a vento.",
        "shortEN": "Ancient star-shaped fortress, now a peaceful park with a picturesque windmill.",
        "desc": "Kastellet è una delle fortezze a stella meglio conservate del Nord Europa, costruita nel XVII secolo. Oggi funge da parco pubblico e area militare attiva, caratterizzata da bastioni erbosi, fossati pittoreschi e un iconico mulino a vento rosso. È il luogo ideale per una passeggiata rilassante immersi nella natura e nella storia militare danese. I sentieri lungo i bastioni offrono splendide viste sul porto e sulla città.",
        "descEN": "Kastellet is one of the best-preserved star fortresses in Northern Europe, built in the 17th century. Today it serves as a public park and active military area, featuring grassy ramparts, picturesque moats, and an iconic red windmill. It is the ideal place for a relaxing walk immersed in nature and Danish military history. The paths along the ramparts offer beautiful views of the harbor and the city.",
        "tips": "L'ingresso è gratuito; rispetta le aree militari ancora in uso.",
        "tipsEN": "Entrance is free; please respect the military areas still in use.",
        "src": [
          "Wikipedia: Kastellet, Copenhagen"
        ],
        "maps": "https://maps.google.com/?q=55.6914,12.5936"
      },
      {
        "id": "cph-10",
        "name": "Frederik's Church",
        "nameEN": "Frederik's Church",
        "cat": "cultura",
        "lat": 55.6849,
        "lng": 12.5896,
        "short": "Maestosa chiesa con la cupola più grande della Scandinavia, vicina al palazzo reale.",
        "shortEN": "Majestic church featuring the largest dome in Scandinavia, near the royal palace.",
        "desc": "La Chiesa di Frederik, popolarmente nota come Marmorkirken (Chiesa di Marmo), è un magnifico edificio religioso in stile rococò. La sua imponente cupola verde, ispirata alla Basilica di San Pietro a Roma, domina lo skyline di Copenaghen ed è la più grande della Scandinavia. L'interno è altrettanto spettacolare, con decorazioni eleganti e un'atmosfera solenne. Si trova in asse con il Palazzo di Amalienborg, creando una prospettiva architettonica perfetta.",
        "descEN": "Frederik's Church, popularly known as Marmorkirken (The Marble Church), is a magnificent religious building in the Rococo style. Its imposing green dome, inspired by St. Peter's Basilica in Rome, dominates the Copenhagen skyline and is the largest in Scandinavia. The interior is equally spectacular, with elegant decorations and a solemn atmosphere. It is aligned with Amalienborg Palace, creating a perfect architectural perspective.",
        "tips": "È possibile salire sulla cupola in orari specifici per una vista panoramica.",
        "tipsEN": "You can climb the dome at specific times for a panoramic view.",
        "src": [
          "Wikipedia: Frederik's Church"
        ],
        "maps": "https://maps.google.com/?q=55.6849,12.5896"
      },
      {
        "id": "cph-11",
        "name": "Strøget",
        "nameEN": "Strøget",
        "cat": "cultura",
        "lat": 55.6785,
        "lng": 12.5751,
        "short": "La principale via pedonale dello shopping, ricca di negozi, caffè e artisti di strada.",
        "shortEN": "The main pedestrian shopping street, full of shops, cafes, and street performers.",
        "desc": "Strøget è una delle strade pedonali dedicate allo shopping più lunghe d'Europa, situata nel cuore di Copenaghen. Collega la Piazza del Municipio (Rådhuspladsen) a Kongens Nytorv, offrendo un mix vivace di boutique di lusso, negozi di design danese e catene internazionali. Lungo il percorso si incontrano artisti di strada, caffè storici e piazze affascinanti come Amagertorv. È il centro pulsante della vita urbana e commerciale della città.",
        "descEN": "Strøget is one of the longest pedestrian shopping streets in Europe, located in the heart of Copenhagen. It connects City Hall Square (Rådhuspladsen) to Kongens Nytorv, offering a vibrant mix of luxury boutiques, Danish design stores, and international chains. Along the way, you will encounter street performers, historic cafes, and charming squares like Amagertorv. It is the beating heart of the city's urban and commercial life.",
        "tips": "Esplora anche le stradine laterali per trovare boutique indipendenti e caffè meno affollati.",
        "tipsEN": "Explore the side streets to find independent boutiques and less crowded cafes.",
        "src": [
          "Wikipedia: Strøget"
        ],
        "maps": "https://maps.google.com/?q=55.6785,12.5751"
      },
      {
        "id": "cph-12",
        "name": "National Museum of Denmark",
        "nameEN": "National Museum of Denmark",
        "cat": "cultura",
        "lat": 55.6746,
        "lng": 12.5746,
        "short": "Il più grande museo di storia culturale della Danimarca, con eccezionali reperti vichinghi.",
        "shortEN": "Denmark's largest museum of cultural history, featuring exceptional Viking artifacts.",
        "desc": "Il Museo Nazionale Danese (Nationalmuseet) è la principale istituzione culturale del paese per la storia e la cultura. Ospitato nel Palazzo del Principe, un edificio del XVIII secolo, espone reperti che vanno dall'Età della Pietra, all'epoca vichinga, fino alla storia moderna danese. Tra i pezzi più celebri ci sono il Carro Solare di Trundholm e le armi vichinghe. È una tappa imperdibile per comprendere a fondo l'evoluzione della Danimarca.",
        "descEN": "The National Museum of Denmark (Nationalmuseet) is the country's premier cultural institution for history and culture. Housed in the Prince's Mansion, an 18th-century building, it exhibits artifacts ranging from the Stone Age and the Viking Age to modern Danish history. Among its most famous pieces are the Trundholm Sun Chariot and Viking weapons. It is a must-visit to fully understand the evolution of Denmark.",
        "tips": "Il museo è molto vasto; dedica almeno due o tre ore per la visita.",
        "tipsEN": "The museum is very large; dedicate at least two or three hours for your visit.",
        "src": [
          "Wikipedia: National Museum of Denmark"
        ],
        "maps": "https://maps.google.com/?q=55.6746,12.5746"
      },
      {
        "tier": 1,
        "id": "cph-13",
        "name": "Ny Carlsberg Glyptotek",
        "nameEN": "Ny Carlsberg Glyptotek",
        "cat": "cultura",
        "lat": 55.6722,
        "lng": 12.5714,
        "short": "Elegante museo d'arte con sculture antiche, dipinti impressionisti e un bellissimo giardino d'inverno.",
        "shortEN": "Elegant art museum with ancient sculptures, Impressionist paintings, and a beautiful winter garden.",
        "desc": "La Ny Carlsberg Glyptotek è un museo d'arte fondato dal birraio Carl Jacobsen, noto per la sua eccezionale collezione di sculture antiche e arte moderna. Il museo ospita capolavori dell'antichità egizia, greca e romana, oltre a un'importante collezione di dipinti impressionisti francesi e del Secolo d'Oro danese. Il cuore dell'edificio è un magnifico giardino d'inverno coperto da una cupola di vetro, perfetto per una pausa rilassante tra palme e sculture.",
        "descEN": "The Ny Carlsberg Glyptotek is an art museum founded by brewer Carl Jacobsen, known for its exceptional collection of ancient sculptures and modern art. The museum houses masterpieces from Egyptian, Greek, and Roman antiquity, as well as an important collection of French Impressionist and Danish Golden Age paintings. The heart of the building is a magnificent winter garden covered by a glass dome, perfect for a relaxing break among palms and sculptures.",
        "tips": "L'ingresso è gratuito l'ultimo mercoledì del mese.",
        "tipsEN": "Admission is free on the last Wednesday of the month.",
        "src": [
          "Wikipedia: Ny Carlsberg Glyptotek"
        ],
        "maps": "https://maps.google.com/?q=55.6722,12.5714"
      },
      {
        "id": "cph-14",
        "name": "Church of Our Saviour",
        "nameEN": "Church of Our Saviour",
        "cat": "panorama",
        "lat": 55.6729,
        "lng": 12.5941,
        "short": "Chiesa barocca celebre per la sua guglia a spirale percorribile all'esterno.",
        "shortEN": "Baroque church famous for its spiraling spire that can be climbed on the outside.",
        "desc": "La Chiesa del Nostro Salvatore (Vor Frelsers Kirke) è famosa per la sua straordinaria guglia a spirale con una scala esterna che si avvolge fino alla cima. Costruita in stile barocco nel quartiere di Christianshavn, offre una delle viste panoramiche più spettacolari su Copenaghen. Salire i 400 gradini, di cui gli ultimi 150 all'aperto, è un'esperienza emozionante e vertiginosa. L'interno della chiesa ospita un imponente altare e un grandioso organo intagliato.",
        "descEN": "The Church of Our Saviour (Vor Frelsers Kirke) is famous for its extraordinary spiraling spire with an external staircase winding to the top. Built in the Baroque style in the Christianshavn district, it offers one of the most spectacular panoramic views of Copenhagen. Climbing the 400 steps, the last 150 of which are outdoors, is a thrilling and dizzying experience. The interior of the church features an imposing altar and a grand carved organ.",
        "tips": "Prenota i biglietti in anticipo per salire sulla torre, specialmente in estate.",
        "tipsEN": "Book tickets in advance to climb the tower, especially in summer.",
        "src": [
          "Wikipedia: Church of Our Saviour, Copenhagen"
        ],
        "maps": "https://maps.google.com/?q=55.6729,12.5941"
      },
      {
        "id": "cph-15",
        "name": "Botanical Garden",
        "nameEN": "Botanical Garden",
        "cat": "natura",
        "lat": 55.6869,
        "lng": 12.5738,
        "short": "Splendido giardino botanico con serre storiche in vetro e migliaia di specie vegetali.",
        "shortEN": "Beautiful botanical garden with historic glasshouses and thousands of plant species.",
        "desc": "L'Orto Botanico di Copenaghen è un'oasi verde situata nel centro della città, parte del Museo di Storia Naturale della Danimarca. È rinomato per il suo vasto complesso di serre storiche risalenti al XIX secolo, tra cui la spettacolare Casa delle Palme. Il giardino ospita oltre 13.000 specie di piante provenienti da tutto il mondo, laghetti pittoreschi e giardini rocciosi. È il luogo ideale per una passeggiata tranquilla e per ammirare la biodiversità vegetale.",
        "descEN": "The Copenhagen Botanical Garden is a green oasis located in the city center, part of the Natural History Museum of Denmark. It is renowned for its vast complex of historical glasshouses dating back to the 19th century, including the spectacular Palm House. The garden is home to over 13,000 plant species from around the world, picturesque ponds, and rock gardens. It is the ideal place for a peaceful walk and to admire plant biodiversity.",
        "tips": "L'accesso al giardino è gratuito, ma la Casa delle Palme richiede un biglietto.",
        "tipsEN": "Access to the garden is free, but the Palm House requires a ticket.",
        "src": [
          "Wikipedia: University of Copenhagen Botanical Garden"
        ],
        "maps": "https://maps.google.com/?q=55.6869,12.5738"
      },
      {
        "id": "cph-16",
        "name": "The Black Diamond",
        "nameEN": "The Black Diamond",
        "cat": "cultura",
        "lat": 55.6735,
        "lng": 12.5828,
        "short": "Straordinario edificio moderno in granito nero che ospita la Biblioteca Reale Danese.",
        "shortEN": "Striking modern black granite building housing the Royal Danish Library.",
        "desc": "Il Diamante Nero (Den Sorte Diamant) è un'estensione moderna della Biblioteca Reale Danese, situata sul lungomare di Slotsholmen. Il suo nome deriva dal rivestimento in granito nero dello Zimbabwe che riflette magnificamente l'acqua del porto. Oltre a fungere da biblioteca, l'edificio ospita sale da concerto, spazi espositivi e un caffè con vista panoramica. L'architettura contemporanea contrasta in modo affascinante con gli edifici storici circostanti.",
        "descEN": "The Black Diamond (Den Sorte Diamant) is a modern extension of the Royal Danish Library, located on the Slotsholmen waterfront. Its name comes from the black Zimbabwe granite cladding that beautifully reflects the water of the harbor. In addition to serving as a library, the building houses concert halls, exhibition spaces, and a cafe with a panoramic view. The contemporary architecture contrasts fascinatingly with the surrounding historic buildings.",
        "tips": "Entra per ammirare l'atrio luminoso e la vista sul canale dalle grandi vetrate.",
        "tipsEN": "Go inside to admire the bright atrium and the view of the canal from the large windows.",
        "src": [
          "Wikipedia: Black Diamond (library)"
        ],
        "maps": "https://maps.google.com/?q=55.6735,12.5828"
      },
      {
        "id": "cph-17",
        "name": "Copenhagen City Hall",
        "nameEN": "Copenhagen City Hall",
        "cat": "cultura",
        "lat": 55.6753,
        "lng": 12.5695,
        "short": "Imponente municipio storico che ospita un celebre orologio astronomico.",
        "shortEN": "Imposing historic city hall housing a famous astronomical clock.",
        "desc": "Il Municipio di Copenaghen (Københavns Rådhus) domina l'omonima piazza centrale con la sua imponente architettura in stile romantico nazionale. Costruito all'inizio del XX secolo, è decorato con sculture della mitologia norrena e dettagli intricati. All'interno si può ammirare l'Orologio Mondiale di Jens Olsen, un capolavoro di ingegneria astronomica. La torre del municipio, alta 105 metri, è una delle strutture più alte della città e offre viste mozzafiato.",
        "descEN": "Copenhagen City Hall (Københavns Rådhus) dominates the central square of the same name with its imposing National Romantic architecture. Built in the early 20th century, it is decorated with sculptures from Norse mythology and intricate details. Inside, you can admire Jens Olsen's World Clock, a masterpiece of astronomical engineering. The 105-meter-tall city hall tower is one of the tallest structures in the city and offers breathtaking views.",
        "tips": "L'ingresso all'edificio è gratuito, ma le visite guidate e la salita alla torre sono a pagamento.",
        "tipsEN": "Entrance to the building is free, but guided tours and tower climbs require a fee.",
        "src": [
          "Wikipedia: Copenhagen City Hall"
        ],
        "maps": "https://maps.google.com/?q=55.6753,12.5695"
      },
      {
        "id": "cph-18",
        "name": "Gefion Fountain",
        "nameEN": "Gefion Fountain",
        "cat": "cultura",
        "lat": 55.6892,
        "lng": 12.5975,
        "short": "Monumentale fontana che raffigura la dea norrena Gefion e la creazione della Zelanda.",
        "shortEN": "Monumental fountain depicting the Norse goddess Gefion and the creation of Zealand.",
        "desc": "La Fontana di Gefion è il più grande monumento di Copenaghen, situato vicino al Kastellet e al lungomare. La scultura drammatica raffigura la dea norrena Gefion che guida un gruppo di buoi, illustrando il mito della creazione dell'isola di Zelanda, su cui sorge la città. L'acqua che sgorga a cascata sui gradini di pietra crea un effetto visivo e sonoro impressionante. È un luogo molto fotogenico, specialmente quando è illuminato di sera.",
        "descEN": "The Gefion Fountain is Copenhagen's largest monument, located near Kastellet and the waterfront. The dramatic sculpture depicts the Norse goddess Gefion driving a group of oxen, illustrating the myth of the creation of the island of Zealand, where the city is located. The water cascading over the stone steps creates an impressive visual and auditory effect. It is a highly photogenic spot, especially when illuminated in the evening.",
        "tips": "Ottima tappa fotografica mentre ci si dirige verso la Sirenetta.",
        "tipsEN": "A great photo stop while heading towards The Little Mermaid.",
        "src": [
          "Wikipedia: Gefion Fountain"
        ],
        "maps": "https://maps.google.com/?q=55.6892,12.5975"
      },
      {
        "id": "cph-19",
        "name": "SMK - National Gallery of Denmark",
        "nameEN": "SMK - National Gallery of Denmark",
        "cat": "cultura",
        "lat": 55.6888,
        "lng": 12.5783,
        "short": "La galleria d'arte nazionale danese, con capolavori dal Rinascimento all'arte contemporanea.",
        "shortEN": "The Danish national art gallery, featuring masterpieces from the Renaissance to contemporary art.",
        "desc": "Lo Statens Museum for Kunst (SMK) è la galleria nazionale della Danimarca e il più grande museo d'arte del paese. La sua vasta collezione copre oltre 700 anni di arte, dal Rinascimento europeo all'arte contemporanea internazionale. Il museo è particolarmente rinomato per la sua eccezionale collezione di arte danese e nordica, oltre a opere di maestri come Matisse, Picasso e Rembrandt. L'edificio stesso è un interessante mix di architettura classica e moderna.",
        "descEN": "The Statens Museum for Kunst (SMK) is the national gallery of Denmark and the largest art museum in the country. Its vast collection covers over 700 years of art, from the European Renaissance to international contemporary art. The museum is particularly renowned for its exceptional collection of Danish and Nordic art, as well as works by masters such as Matisse, Picasso, and Rembrandt. The building itself is an interesting mix of classical and modern architecture.",
        "tips": "L'ingresso alla collezione permanente è a pagamento, ma ci sono spesso mostre temporanee interessanti.",
        "tipsEN": "Admission to the permanent collection requires a fee, but there are often interesting temporary exhibitions.",
        "src": [
          "Wikipedia: Statens Museum for Kunst"
        ],
        "maps": "https://maps.google.com/?q=55.6888,12.5783"
      },
      {
        "id": "cph-20",
        "name": "Kongens Nytorv",
        "nameEN": "Kongens Nytorv",
        "cat": "cultura",
        "lat": 55.6805,
        "lng": 12.5859,
        "short": "La piazza più elegante della città, circondata da teatri storici e palazzi prestigiosi.",
        "shortEN": "The city's most elegant square, surrounded by historic theaters and prestigious buildings.",
        "desc": "Kongens Nytorv (La Nuova Piazza del Re) è la piazza più grande e prestigiosa di Copenaghen, situata alla fine della via pedonale Strøget. È circondata da edifici storici di grande importanza, tra cui il Teatro Reale Danese, l'Hotel D'Angleterre e il grande magazzino Magasin du Nord. Al centro della piazza si erge una statua equestre del re Cristiano V. In inverno, la piazza ospita una popolare pista di pattinaggio sul ghiaccio.",
        "descEN": "Kongens Nytorv (The King's New Square) is the largest and most prestigious square in Copenhagen, located at the end of the Strøget pedestrian street. It is surrounded by historic buildings of great importance, including the Royal Danish Theatre, the Hotel D'Angleterre, and the Magasin du Nord department store. An equestrian statue of King Christian V stands in the center of the square. In winter, the square hosts a popular ice skating rink.",
        "tips": "Ottimo punto di partenza per esplorare il vicino canale di Nyhavn.",
        "tipsEN": "A great starting point for exploring the nearby Nyhavn canal.",
        "src": [
          "Wikipedia: Kongens Nytorv"
        ],
        "maps": "https://maps.google.com/?q=55.6805,12.5859"
      },
      {
        "id": "cph-21",
        "name": "Designmuseum Denmark",
        "nameEN": "Designmuseum Denmark",
        "cat": "cultura",
        "lat": 55.6864,
        "lng": 12.5932,
        "short": "Museo dedicato al celebre design danese, con esposizioni di mobili e oggetti iconici.",
        "shortEN": "Museum dedicated to famous Danish design, featuring exhibitions of iconic furniture and objects.",
        "desc": "Il Designmuseum Danmark è il principale museo danese dedicato al design industriale e alle arti applicate. Situato in un ex ospedale del XVIII secolo, offre un'affascinante panoramica sulla storia del design danese, celebre in tutto il mondo per il suo funzionalismo e la sua estetica minimalista. Le esposizioni includono mobili iconici, ceramiche, tessuti e oggetti di uso quotidiano creati da maestri come Arne Jacobsen e Hans J. Wegner. È una tappa fondamentale per gli amanti dell'architettura e dell'arredamento.",
        "descEN": "Designmuseum Danmark is the premier Danish museum dedicated to industrial design and applied arts. Located in a former 18th-century hospital, it offers a fascinating overview of the history of Danish design, world-renowned for its functionalism and minimalist aesthetics. The exhibitions include iconic furniture, ceramics, textiles, and everyday objects created by masters such as Arne Jacobsen and Hans J. Wegner. It is an essential stop for architecture and interior design lovers.",
        "tips": "Il caffè del museo è un ottimo posto per rilassarsi e gustare dolci tradizionali.",
        "tipsEN": "The museum cafe is a great place to relax and enjoy traditional pastries.",
        "src": [
          "Wikipedia: Designmuseum Denmark"
        ],
        "maps": "https://maps.google.com/?q=55.6864,12.5932"
      }
    ]
  },
  "bremen": {
    "city": "Brema",
    "cityEN": "Bremen",
    "country": "Germania",
    "countryEN": "Germany",
    "flag": "🇩🇪",
    "intro": "Scopri il fascino storico di Brema con questo itinerario a piedi nel cuore della città. Dalla magnifica Piazza del Mercato ai vicoli medievali dello Schnoor, esplorerai secoli di storia, arte e leggende fiabesche.",
    "introEN": "Discover the historic charm of Bremen with this walking itinerary through the heart of the city. From the magnificent Market Square to the medieval alleys of the Schnoor, you will explore centuries of history, art, and fairytale legends.",
    "center": [
      53.075,
      8.8077
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 2,
        "id": "bre-1",
        "name": "Piazza del Mercato e Municipio",
        "nameEN": "Market Square & Town Hall",
        "cat": "cultura",
        "lat": 53.0758,
        "lng": 8.8073,
        "short": "Il cuore storico di Brema, con il Municipio e la statua di Rolando, patrimonio UNESCO.",
        "shortEN": "The historic heart of Bremen, featuring the UNESCO-listed Town Hall and the Roland statue.",
        "desc": "La Piazza del Mercato di Brema è una delle piazze pubbliche più antiche della città, circondata da magnifici edifici storici. Il fulcro è il Municipio in stile Rinascimento del Weser, costruito all'inizio del XV secolo, e la statua di Rolando del 1404, entrambi siti Patrimonio dell'Umanità UNESCO. I visitatori possono ammirare l'intricata facciata ed esplorare il Ratskeller sottostante. È aperto al pubblico, con visite guidate del Municipio disponibili a circa 8 €.",
        "descEN": "The Bremen Market Square is one of the oldest public squares in the city, surrounded by magnificent historic buildings. The centerpiece is the Weser Renaissance-style Town Hall, built in the early 15th century, and the 1404 Roland statue, both UNESCO World Heritage sites. Visitors can admire the intricate facade and explore the Ratskeller below. It is open to the public, with guided tours of the Town Hall available for around €8.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Bremen Market Square",
          "UNESCO: Town Hall and Roland on the Marketplace of Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.0758,8.8073"
      },
      {
        "tier": 2,
        "id": "bre-2",
        "name": "I Musicanti di Brema",
        "nameEN": "Town Musicians of Bremen",
        "cat": "cultura",
        "lat": 53.0761,
        "lng": 8.8075,
        "short": "Una famosa statua in bronzo che raffigura gli animali dell'amata fiaba dei fratelli Grimm.",
        "shortEN": "A famous bronze statue depicting the animals from the beloved Brothers Grimm fairy tale.",
        "desc": "Situata proprio accanto al Municipio, questa iconica scultura in bronzo del 1953 di Gerhard Marcks dà vita alla fiaba dei fratelli Grimm. Raffigura un asino, un cane, un gatto e un gallo in piedi l'uno sulla schiena dell'altro. La tradizione dice che strofinare le zampe anteriori dell'asino porti fortuna, motivo per cui sono lucide e levigate. La statua è visitabile gratuitamente e accessibile 24 ore su 24, rendendola un punto fotografico imperdibile.",
        "descEN": "Located just beside the Town Hall, this iconic 1953 bronze sculpture by Gerhard Marcks brings the Brothers Grimm fairy tale to life. It features a donkey, dog, cat, and rooster standing on each other's backs. Tradition says that rubbing the donkey's front legs brings good luck, which is why they are shiny and polished. The statue is free to visit and accessible 24/7, making it a must-see photo spot.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Town Musicians of Bremen",
          "visitbremen.de: Town Musicians"
        ],
        "maps": "https://maps.google.com/?q=53.0761,8.8075"
      },
      {
        "tier": 1,
        "id": "bre-3",
        "name": "Cattedrale di San Pietro",
        "nameEN": "St. Peter's Cathedral",
        "cat": "cultura",
        "lat": 53.0755,
        "lng": 8.8088,
        "short": "Un'imponente chiesa dell'XI secolo con due guglie gemelle che dominano lo skyline della città.",
        "shortEN": "An imposing 11th-century church with twin spires dominating the city skyline.",
        "desc": "La Cattedrale di San Pietro è uno splendido esempio di architettura romanica e gotica, con una storia che abbraccia oltre 1.200 anni. All'interno, i visitatori possono esplorare le cripte, vedere le mummie nel Bleikeller (Cantina di piombo) e ammirare le bellissime vetrate. Salire sulla torre sud offre una vista panoramica di Brema per una piccola quota di circa 2 €. L'ingresso alla cattedrale è gratuito e generalmente aperto tutti i giorni dalle 10:00 alle 16:30.",
        "descEN": "St. Peter's Cathedral is a stunning example of Romanesque and Gothic architecture, with a history spanning over 1,200 years. Inside, visitors can explore the crypts, view the mummies in the Bleikeller (Lead Cellar), and admire the beautiful stained glass windows. Climbing the south tower offers a panoramic view of Bremen for a small fee of around €2. The cathedral itself is free to enter and generally open daily from 10:00 AM to 4:30 PM.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Bremen Cathedral",
          "stpetridom.de"
        ],
        "maps": "https://maps.google.com/?q=53.0755,8.8088"
      },
      {
        "tier": 1,
        "id": "bre-4",
        "name": "Böttcherstraße",
        "nameEN": "Böttcherstraße",
        "cat": "cultura",
        "lat": 53.075,
        "lng": 8.8055,
        "short": "Una stretta strada lunga 100 metri famosa per la sua insolita architettura espressionista in mattoni.",
        "shortEN": "A narrow, 100-meter-long street famous for its unusual Brick Expressionist architecture.",
        "desc": "Costruita negli anni '20 dal mercante di caffè Ludwig Roselius, la Böttcherstraße è un singolare complesso architettonico di espressionismo in mattoni. La strada ospita musei d'arte, laboratori artigianali e un famoso carillon fatto di campane di porcellana di Meissen che suona regolarmente. Collega la Piazza del Mercato al fiume Weser ed è interamente pedonale. Passeggiare per la strada è gratuito, sebbene i musei (come il Museo Paula Modersohn-Becker) prevedano un biglietto d'ingresso di circa 8 €.",
        "descEN": "Built in the 1920s by coffee merchant Ludwig Roselius, Böttcherstraße is a unique architectural ensemble of Brick Expressionism. The street houses art museums, craft workshops, and a famous glockenspiel made of Meissen porcelain bells that chimes regularly. It connects the Market Square to the Weser River and is entirely pedestrianized. Walking through the street is free, though the museums (like the Paula Modersohn-Becker Museum) charge an entrance fee of around €8.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Böttcherstraße",
          "boettcherstrasse.de"
        ],
        "maps": "https://maps.google.com/?q=53.075,8.8055"
      },
      {
        "tier": 1,
        "id": "bre-5",
        "name": "Quartiere Schnoor",
        "nameEN": "Schnoor Quarter",
        "cat": "cultura",
        "lat": 53.0728,
        "lng": 8.8094,
        "short": "Il quartiere più antico di Brema, caratterizzato da un labirinto di stradine e affascinanti case del XV secolo.",
        "shortEN": "Bremen's oldest neighborhood, featuring a maze of narrow lanes and charming 15th-century houses.",
        "desc": "Lo Schnoor è l'unica parte di Brema che ha conservato un carattere medievale, con vicoli tortuosi così stretti da poter toccare entrambi i lati contemporaneamente. Il nome deriva dall'antica parola tedesca per \"corda\", poiché le minuscole case a graticcio si allineano come perle su un filo. Oggi è ricco di boutique artigianali, caffè accoglienti e ristoranti tradizionali che servono specialità locali. È liberamente accessibile e perfetto per una piacevole passeggiata e per lo shopping di souvenir.",
        "descEN": "The Schnoor is the only part of Bremen that has preserved a medieval character, with winding alleys so narrow you can touch both sides at once. The name comes from the old German word for \"string,\" as the tiny half-timbered houses line up like pearls on a string. Today, it is packed with artisan boutiques, cozy cafes, and traditional restaurants serving local specialties. It is freely accessible and perfect for a leisurely stroll and souvenir shopping.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Schnoor",
          "bremen.eu: The Schnoor quarter"
        ],
        "maps": "https://maps.google.com/?q=53.0728,8.8094"
      },
      {
        "tier": 1,
        "id": "bre-6",
        "name": "Schlachte",
        "nameEN": "Schlachte",
        "cat": "cibo",
        "lat": 53.076465,
        "lng": 8.799753,
        "short": "Vivace passeggiata lungo il fiume Weser con birrerie e navi storiche.",
        "shortEN": "Lively promenade along the Weser River with beer gardens and historic ships.",
        "desc": "La Schlachte è la storica passeggiata lungo il fiume Weser, un tempo porto principale della città. Oggi è il cuore della vita all'aperto di Brema, ricca di birrerie all'aperto, ristoranti e caffè. Passeggiando lungo le sue rive, si possono ammirare antiche navi ormeggiate e godere di un'atmosfera vivace, specialmente in estate. È il luogo ideale per rilassarsi dopo aver esplorato il centro storico.",
        "descEN": "The Schlachte is the historic promenade along the Weser River, once the city's main harbor. Today, it is the heart of Bremen's outdoor life, lined with beer gardens, restaurants, and cafes. Strolling along its banks, you can admire old moored ships and enjoy a lively atmosphere, especially in summer. It is the perfect place to relax after exploring the historic center.",
        "tips": "Molto affollata nelle serate estive; ottima per cenare o bere una birra locale.",
        "tipsEN": "Very crowded on summer evenings; great for dining or drinking a local beer.",
        "src": [
          "Wikipedia: Schlachte (Bremen)",
          "Bremen Tourism"
        ],
        "maps": "https://maps.google.com/?q=53.076465,8.799753"
      },
      {
        "id": "bre-7",
        "name": "Mühle am Wall",
        "nameEN": "Mühle am Wall",
        "cat": "cultura",
        "lat": 53.080138,
        "lng": 8.806622,
        "short": "Storico mulino a vento circondato da un bellissimo parco cittadino.",
        "shortEN": "Historic windmill surrounded by a beautiful city park.",
        "desc": "Situato nei pittoreschi giardini Wallanlagen, questo storico mulino a vento è uno dei simboli più fotografati di Brema. Costruito originariamente nel 1699 e ricostruito nel 1898, il mulino è ancora funzionante e ospita un accogliente ristorante. Circondato da fiori e verde, offre un'immagine idilliaca a pochi passi dal trambusto del centro cittadino.",
        "descEN": "Located in the picturesque Wallanlagen gardens, this historic windmill is one of Bremen's most photographed landmarks. Originally built in 1699 and rebuilt in 1898, the mill is still functional and houses a cozy restaurant. Surrounded by flowers and greenery, it offers an idyllic sight just steps away from the bustling city center.",
        "tips": "Il ristorante all'interno offre ottimi dolci e caffè con vista sul parco.",
        "tipsEN": "The restaurant inside offers great cakes and coffee with a view of the park.",
        "src": [
          "Wikipedia: Am Wall Windmill",
          "Bremen Tourism"
        ],
        "maps": "https://maps.google.com/?q=53.080138,8.806622"
      },
      {
        "id": "bre-8",
        "name": "Wallanlagen",
        "nameEN": "Wallanlagen",
        "cat": "natura",
        "lat": 53.078512,
        "lng": 8.810543,
        "short": "Parco cittadino a forma di anello creato sulle antiche mura difensive.",
        "shortEN": "Ring-shaped city park created on the ancient defensive walls.",
        "desc": "I Wallanlagen sono i vecchi bastioni difensivi di Brema, trasformati nel XIX secolo in un magnifico parco pubblico. Questo anello verde circonda il centro storico con i suoi sentieri tortuosi, laghetti tranquilli e sculture interessanti. È un'oasi di pace perfetta per una passeggiata rilassante, offrendo un netto contrasto con l'architettura urbana circostante.",
        "descEN": "The Wallanlagen are Bremen's old defensive ramparts, transformed into a magnificent public park in the 19th century. This green ring surrounds the historic center with its winding paths, tranquil ponds, and interesting sculptures. It is a peaceful oasis perfect for a relaxing walk, offering a stark contrast to the surrounding urban architecture.",
        "tips": "Ideale per un picnic o una passeggiata primaverile quando i fiori sono sbocciati.",
        "tipsEN": "Ideal for a picnic or a spring walk when the flowers are in bloom.",
        "src": [
          "Wikipedia: Bremer Wallanlagen"
        ],
        "maps": "https://maps.google.com/?q=53.078512,8.810543"
      },
      {
        "id": "bre-9",
        "name": "Übersee-Museum Bremen",
        "nameEN": "Übersee-Museum Bremen",
        "cat": "cultura",
        "lat": 53.082833,
        "lng": 8.809415,
        "short": "Museo etnografico e di storia naturale che esplora continenti lontani.",
        "shortEN": "Ethnographic and natural history museum exploring distant continents.",
        "desc": "Situato vicino alla stazione centrale, l'Übersee-Museum è un affascinante museo dedicato alla natura, alla cultura e al commercio globale. Le sue esposizioni interattive trasportano i visitatori in continenti lontani, dall'Asia all'Oceania, esplorando la biodiversità e le tradizioni umane. È un'istituzione unica che riflette la lunga storia marittima e commerciale di Brema.",
        "descEN": "Located near the central station, the Übersee-Museum is a fascinating museum dedicated to nature, culture, and global trade. Its interactive exhibits transport visitors to distant continents, from Asia to Oceania, exploring biodiversity and human traditions. It is a unique institution that reflects Bremen's long maritime and commercial history.",
        "tips": "Chiuso il lunedì. Calcolate almeno due ore per visitare tutte le sezioni.",
        "tipsEN": "Closed on Mondays. Allow at least two hours to visit all sections.",
        "src": [
          "Official Website: Übersee-Museum",
          "Wikipedia: Übersee-Museum Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.082833,8.809415"
      },
      {
        "id": "bre-10",
        "name": "Kunsthalle Bremen",
        "nameEN": "Kunsthalle Bremen",
        "cat": "cultura",
        "lat": 53.072845,
        "lng": 8.813612,
        "short": "Prestigioso museo d'arte con opere dal Medioevo ai giorni nostri.",
        "shortEN": "Prestigious art museum with works from the Middle Ages to the present day.",
        "desc": "La Kunsthalle Bremen è uno dei musei d'arte più importanti della Germania, situato vicino ai Wallanlagen. Ospita una vasta collezione che spazia dal Medioevo all'arte contemporanea, con capolavori di artisti come Dürer, Monet, Van Gogh e Picasso. L'edificio stesso è un'opera d'arte, che combina l'architettura classica con un'elegante estensione moderna.",
        "descEN": "The Kunsthalle Bremen is one of Germany's most important art museums, located near the Wallanlagen. It houses a vast collection ranging from the Middle Ages to contemporary art, featuring masterpieces by artists like Dürer, Monet, Van Gogh, and Picasso. The building itself is a work of art, combining classical architecture with an elegant modern extension.",
        "tips": "Controllate le mostre temporanee, spesso di livello internazionale.",
        "tipsEN": "Check out the temporary exhibitions, which are often of international caliber.",
        "src": [
          "Official Website: Kunsthalle Bremen",
          "Wikipedia: Kunsthalle Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.072845,8.813612"
      },
      {
        "id": "bre-11",
        "name": "Weserburg Museum für moderne Kunst",
        "nameEN": "Weserburg Museum für moderne Kunst",
        "cat": "cultura",
        "lat": 53.075312,
        "lng": 8.798145,
        "short": "Museo d'arte contemporanea situato in ex magazzini sul fiume.",
        "shortEN": "Contemporary art museum located in former riverfront warehouses.",
        "desc": "Situato sulla penisola di Teerhof in mezzo al fiume Weser, questo museo è il più grande museo d'arte contemporanea di Brema. È ospitato in ex magazzini industriali, offrendo spazi espositivi ampi e suggestivi. La Weserburg si concentra su collezioni private internazionali, presentando opere all'avanguardia in un contesto architettonico unico.",
        "descEN": "Located on the Teerhof peninsula in the middle of the Weser River, this is Bremen's largest museum of contemporary art. It is housed in former industrial warehouses, offering spacious and striking exhibition areas. The Weserburg focuses on international private collections, presenting avant-garde works in a unique architectural setting.",
        "tips": "La vista sul fiume dalle finestre del museo è spettacolare.",
        "tipsEN": "The view of the river from the museum's windows is spectacular.",
        "src": [
          "Official Website: Weserburg",
          "Wikipedia: Weserburg"
        ],
        "maps": "https://maps.google.com/?q=53.075312,8.798145"
      },
      {
        "id": "bre-12",
        "name": "Liebfrauenkirche",
        "nameEN": "Liebfrauenkirche",
        "cat": "cultura",
        "lat": 53.076823,
        "lng": 8.807512,
        "short": "La chiesa più antica di Brema, nota per le sue magnifiche vetrate moderne.",
        "shortEN": "Bremen's oldest church, known for its magnificent modern stained glass windows.",
        "desc": "La Liebfrauenkirche è la chiesa più antica di Brema, situata proprio accanto al Municipio. Costruita originariamente nell'XI secolo, presenta una splendida architettura gotica e vetrate moderne mozzafiato realizzate dall'artista francese Alfred Manessier. La sua cripta storica è un luogo di silenzio e riflessione nel cuore della città.",
        "descEN": "The Liebfrauenkirche is the oldest church in Bremen, located right next to the Town Hall. Originally built in the 11th century, it features beautiful Gothic architecture and stunning modern stained glass windows created by French artist Alfred Manessier. Its historic crypt is a place of silence and reflection in the heart of the city.",
        "tips": "L'ingresso è gratuito. Non perdete la cripta sotterranea.",
        "tipsEN": "Admission is free. Don't miss the underground crypt.",
        "src": [
          "Wikipedia: Liebfrauenkirche, Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.076823,8.807512"
      },
      {
        "id": "bre-13",
        "name": "Stadtwaage",
        "nameEN": "Stadtwaage",
        "cat": "cultura",
        "lat": 53.075812,
        "lng": 8.805845,
        "short": "Storico edificio rinascimentale un tempo utilizzato per pesare le merci.",
        "shortEN": "Historic Renaissance building once used for weighing goods.",
        "desc": "La Stadtwaage è un magnifico edificio rinascimentale in mattoni situato nella Langenstraße. Costruito nel 1587, serviva come pesa pubblica per le merci, garantendo il corretto pagamento delle tasse commerciali. La sua facciata riccamente decorata con timpani a gradoni è un eccellente esempio dell'architettura del Rinascimento del Weser.",
        "descEN": "The Stadtwaage is a magnificent Renaissance brick building located on Langenstraße. Built in 1587, it served as the public weighing house for goods, ensuring the correct payment of trade taxes. Its richly decorated facade with stepped gables is an excellent example of Weser Renaissance architecture.",
        "tips": "L'edificio ospita oggi uffici, ma la facciata merita sicuramente una foto.",
        "tipsEN": "The building now houses offices, but the facade is definitely worth a photo.",
        "src": [
          "Wikipedia: Stadtwaage (Bremen)"
        ],
        "maps": "https://maps.google.com/?q=53.075812,8.805845"
      },
      {
        "id": "bre-14",
        "name": "Martinikirche",
        "nameEN": "Martinikirche",
        "cat": "cultura",
        "lat": 53.074712,
        "lng": 8.804245,
        "short": "Chiesa gotica in mattoni situata pittorescamente lungo il fiume Weser.",
        "shortEN": "Gothic brick church picturesquely situated along the Weser River.",
        "desc": "Affacciata sul fiume Weser, la Martinikirche è una suggestiva chiesa gotica in mattoni risalente al XIII secolo. Fu gravemente danneggiata durante la Seconda Guerra Mondiale ma è stata fedelmente ricostruita. L'interno è noto per la sua eccellente acustica e per il bellissimo organo, spesso utilizzato per concerti di musica classica.",
        "descEN": "Overlooking the Weser River, the Martinikirche is a striking Gothic brick church dating back to the 13th century. It was severely damaged during World War II but has been faithfully reconstructed. The interior is known for its excellent acoustics and beautiful organ, often used for classical music concerts.",
        "tips": "Controllate il programma per assistere a un concerto d'organo serale.",
        "tipsEN": "Check the schedule to attend an evening organ concert.",
        "src": [
          "Wikipedia: St. Martin's Church, Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.074712,8.804245"
      },
      {
        "id": "bre-15",
        "name": "Teerhof",
        "nameEN": "Teerhof",
        "cat": "panorama",
        "lat": 53.074512,
        "lng": 8.800045,
        "short": "Penisola pedonale che offre viste spettacolari sul centro storico e sul fiume.",
        "shortEN": "Pedestrian peninsula offering spectacular views of the historic center and the river.",
        "desc": "Il Teerhof è una penisola situata tra due bracci del fiume Weser, un tempo utilizzata dai costruttori di navi. Oggi è una tranquilla zona residenziale e culturale pedonale. Passeggiando lungo le sue rive, si gode di una delle migliori viste panoramiche sulla Schlachte e sul profilo storico della città di Brema.",
        "descEN": "The Teerhof is a peninsula located between two branches of the Weser River, once used by shipbuilders. Today, it is a quiet pedestrian residential and cultural area. Strolling along its banks, you can enjoy one of the best panoramic views of the Schlachte and the historic skyline of Bremen.",
        "tips": "Il ponte pedonale che collega il Teerhof alla Schlachte è perfetto per le foto al tramonto.",
        "tipsEN": "The pedestrian bridge connecting the Teerhof to the Schlachte is perfect for sunset photos.",
        "src": [
          "Wikipedia: Teerhof"
        ],
        "maps": "https://maps.google.com/?q=53.074512,8.800045"
      },
      {
        "id": "bre-16",
        "name": "Bürgerpark Bremen",
        "nameEN": "Bürgerpark Bremen",
        "cat": "natura",
        "lat": 53.088012,
        "lng": 8.823045,
        "short": "Vasto e storico parco cittadino con laghetti, boschi e un recinto per animali.",
        "shortEN": "Vast and historic city park with lakes, woods, and an animal enclosure.",
        "desc": "Il Bürgerpark è uno dei parchi cittadini privati più grandi della Germania, situato a breve distanza dal centro. Creato nel XIX secolo grazie alle donazioni dei cittadini, offre ampi prati, boschi ombrosi, laghetti dove noleggiare barche a remi e persino un piccolo recinto con animali. È il polmone verde di Brema, amato dai locali per lo sport e il relax.",
        "descEN": "The Bürgerpark is one of Germany's largest privately funded city parks, located a short distance from the center. Created in the 19th century through citizen donations, it offers expansive lawns, shady woods, lakes where you can rent rowboats, and even a small animal enclosure. It is Bremen's green lung, beloved by locals for sports and relaxation.",
        "tips": "Noleggiate una barca a remi sul lago Emmasee per un'esperienza romantica.",
        "tipsEN": "Rent a rowboat on Lake Emmasee for a romantic experience.",
        "src": [
          "Wikipedia: Bürgerpark Bremen"
        ],
        "maps": "https://maps.google.com/?q=53.088012,8.823045"
      }
    ]
  },
  "amiens": {
    "city": "Amiens",
    "cityEN": "Amiens",
    "country": "Francia",
    "countryEN": "France",
    "flag": "🇫🇷",
    "intro": "Scopri il cuore storico di Amiens con questo itinerario a piedi perfetto per le famiglie. Dalla maestosa cattedrale gotica ai pittoreschi canali, esplora il meglio della città in mezza giornata.",
    "introEN": "Discover the historic heart of Amiens with this family-friendly walking itinerary. From the majestic Gothic cathedral to the picturesque canals, explore the best of the city in a half-day.",
    "center": [
      49.8939,
      2.2999
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 2,
        "id": "ami-1",
        "name": "Cattedrale di Notre-Dame",
        "nameEN": "Amiens Cathedral",
        "cat": "cultura",
        "lat": 49.89449,
        "lng": 2.29587,
        "short": "La più grande cattedrale gotica di Francia, un capolavoro architettonico mozzafiato.",
        "shortEN": "The largest Gothic cathedral in France, a breathtaking architectural masterpiece.",
        "desc": "La Cattedrale di Notre-Dame di Amiens è un sito Patrimonio dell'Umanità UNESCO e la più grande cattedrale gotica classica del XIII secolo in Francia. I visitatori possono ammirare le sue magnifiche statue, i dipinti e le vetrate colorate. L'ingresso è gratuito e la cattedrale è aperta tutto l'anno, generalmente dalle 8:30 alle 17:30 o 18:30 a seconda della stagione. Si trova nel cuore della città, rendendola il punto di partenza ideale per la nostra passeggiata.",
        "descEN": "The Notre-Dame Cathedral of Amiens is a UNESCO World Heritage site and the largest classic Gothic cathedral of the 13th century in France. Visitors can admire its magnificent statues, paintings, and stained-glass windows. Admission is free and the cathedral is open all year round, generally from 8:30 AM to 5:30 PM or 6:30 PM depending on the season. It is located in the heart of the city, making it the ideal starting point for our walk.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "UNESCO: Amiens Cathedral",
          "Official site cathedrale-amiens.fr"
        ],
        "maps": "https://maps.google.com/?q=49.89449,2.29587"
      },
      {
        "tier": 2,
        "id": "ami-2",
        "name": "Quartiere Saint-Leu",
        "nameEN": "Quartier Saint-Leu",
        "cat": "cultura",
        "lat": 49.89698,
        "lng": 2.30381,
        "short": "Un affascinante quartiere medievale con strade acciottolate e case colorate lungo i canali.",
        "shortEN": "A charming medieval district with cobblestone streets and colorful houses along the canals.",
        "desc": "Il Quartiere Saint-Leu è il cuore storico e pittoresco di Amiens, spesso chiamato la 'Piccola Venezia del Nord'. Questo affascinante quartiere medievale è caratterizzato da strette strade acciottolate fiancheggiate da case colorate con persiane, situate lungo una rete di canali. È il luogo perfetto per passeggiare, con numerosi caffè, ristoranti e negozi di artigianato locale. L'area è sempre accessibile e offre un'atmosfera vivace sia di giorno che di sera.",
        "descEN": "The Quartier Saint-Leu is the historic and picturesque heart of Amiens, often called the 'Little Venice of the North'. This charming medieval district features narrow cobblestone streets lined with colorful shuttered houses situated along a network of canals. It is the perfect place to stroll, with numerous cafes, restaurants, and local craft shops. The area is always accessible and offers a lively atmosphere both day and night.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Amiens Tourisme: Le quartier Saint-Leu",
          "Wikipedia: Saint-Leu (Amiens)"
        ],
        "maps": "https://maps.google.com/?q=49.89698,2.30381"
      },
      {
        "id": "ami-3",
        "name": "Parco Saint-Pierre",
        "nameEN": "Parc Saint-Pierre",
        "cat": "natura",
        "lat": 49.89898,
        "lng": 2.30795,
        "short": "Un vasto parco verde nel cuore della città, ideale per il relax e le attività in famiglia.",
        "shortEN": "A vast green park in the heart of the city, ideal for relaxation and family activities.",
        "desc": "Il Parco Saint-Pierre è uno spazio verde di 22 ettari situato tra il quartiere Saint-Leu e gli hortillonnages. Questo parco pluripremiato offre un ambiente tranquillo con laghetti, percorsi pedonali e aree gioco per bambini, rendendolo perfetto per una pausa rilassante. L'ingresso è gratuito e il parco è aperto tutti i giorni, offrendo un facile accesso alla natura a pochi passi dal centro città. È un luogo molto amato sia dai residenti che dai turisti.",
        "descEN": "Parc Saint-Pierre is a 22-hectare green space located between the Saint-Leu neighborhood and the hortillonnages. This award-winning park offers a peaceful environment with ponds, walking paths, and children's play areas, making it perfect for a relaxing break. Admission is free and the park is open every day, providing easy access to nature just a short walk from the city center. It is a beloved spot for both locals and tourists.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Amiens",
          "Amiens Tourisme: Parks and gardens"
        ],
        "maps": "https://maps.google.com/?q=49.89898,2.30795"
      },
      {
        "tier": 1,
        "id": "ami-4",
        "name": "Museo della Piccardia",
        "nameEN": "Musée de Picardie",
        "cat": "cultura",
        "lat": 49.89046,
        "lng": 2.29457,
        "short": "Spesso chiamato il 'Piccolo Louvre', ospita una ricca collezione di arte e archeologia.",
        "shortEN": "Often called the 'Little Louvre', it houses a rich collection of art and archaeology.",
        "desc": "Il Museo della Piccardia è uno dei più bei musei di provincia in Francia, costruito tra il 1855 e il 1867. L'edificio stesso è un capolavoro architettonico che ospita vaste collezioni che spaziano dall'archeologia alle belle arti. Il museo è aperto dal martedì alla domenica (chiuso il lunedì), generalmente dalle 9:30 alle 18:00, con orari ridotti nel fine settimana. I biglietti d'ingresso sono a pagamento, ma offrono l'accesso a un vero e proprio viaggio attraverso il tempo e le arti.",
        "descEN": "The Musée de Picardie is one of the finest provincial museums in France, built between 1855 and 1867. The building itself is an architectural masterpiece that houses vast collections ranging from archaeology to fine arts. The museum is open from Tuesday to Sunday (closed on Mondays), generally from 9:30 AM to 6:00 PM, with adjusted hours on weekends. Admission tickets are required, but they offer access to a true journey through time and the arts.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Structurae: Musée de Picardie",
          "Amiens Métropole: Infos pratiques"
        ],
        "maps": "https://maps.google.com/?q=49.89046,2.29457"
      },
      {
        "tier": 1,
        "id": "ami-5",
        "name": "Casa di Jules Verne",
        "nameEN": "Maison de Jules Verne",
        "cat": "cultura",
        "lat": 49.8885,
        "lng": 2.2975,
        "short": "La casa storica dove il celebre scrittore visse e scrisse molte delle sue opere.",
        "shortEN": "The historic house where the famous writer lived and wrote many of his works.",
        "desc": "La Casa di Jules Verne, situata in 2 rue Charles Dubois, è la residenza dove il famoso autore visse dal 1882 al 1900. Oggi è una casa-museo che permette ai visitatori di esplorare l'universo dello scrittore attraverso le stanze in cui ha vissuto e lavorato. Il museo è aperto tutti i giorni tranne il martedì, solitamente dalle 10:00 alle 12:30 e dalle 14:00 alle 18:30. È un'attrazione imperdibile per gli amanti della letteratura e offre un'esperienza immersiva nella vita di Verne.",
        "descEN": "The Maison de Jules Verne, located at 2 rue Charles Dubois, is the residence where the famous author lived from 1882 to 1900. Today it is a house museum that allows visitors to explore the writer's universe through the rooms where he lived and worked. The museum is open every day except Tuesday, usually from 10:00 AM to 12:30 PM and from 2:00 PM to 6:30 PM. It is a must-visit attraction for literature lovers and offers an immersive experience into Verne's life.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Somme Tourisme: Jules Verne in Amiens",
          "Amiens Tourisme: Maison de Jules Verne"
        ],
        "maps": "https://maps.google.com/?q=49.8885,2.2975"
      },
      {
        "tier": 1,
        "id": "ami-6",
        "name": "Les Hortillonnages d'Amiens",
        "nameEN": "Les Hortillonnages d'Amiens",
        "cat": "natura",
        "lat": 49.8986,
        "lng": 2.3169,
        "short": "Una vasta rete di storici giardini galleggianti accessibili con barche tradizionali.",
        "shortEN": "A vast network of historic floating gardens accessible by traditional boats.",
        "desc": "Gli Hortillonnages sono una rete unica di giardini galleggianti che si estendono su 300 ettari, intervallati da 65 chilometri di canali. Coltivate fin dal Medioevo, queste paludi offrono un rifugio pacifico dalla città. I visitatori possono esplorare l'area su tradizionali barche a fondo piatto chiamate \"barques à cornet\". È un paradiso per la biodiversità e una testimonianza della tradizionale orticoltura.",
        "descEN": "The Hortillonnages are a unique network of floating gardens spread over 300 hectares, interspersed with 65 kilometers of canals. Cultivated since the Middle Ages, these marshlands offer a peaceful retreat from the city. Visitors can explore the area on traditional flat-bottomed boats called \"barques à cornet\". It is a haven for biodiversity and a testament to traditional market gardening.",
        "tips": "I tour in barca sono disponibili da aprile a ottobre.",
        "tipsEN": "Boat tours are available from April to October.",
        "src": [
          "Wikipedia: Hortillonnages d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.8986,2.3169"
      },
      {
        "tier": 1,
        "id": "ami-7",
        "name": "Beffroi d'Amiens",
        "nameEN": "Beffroi d'Amiens",
        "cat": "panorama",
        "lat": 49.8954,
        "lng": 2.2965,
        "short": "Una torre campanaria medievale patrimonio dell'UNESCO che offre viste panoramiche su Amiens.",
        "shortEN": "A UNESCO-listed medieval belfry offering panoramic views of Amiens.",
        "desc": "Il Beffroi di Amiens è una storica torre campanaria risalente al XII secolo, ricostruita più volte nel corso dei secoli. Alta 52 metri, è riconosciuta come patrimonio dell'umanità dall'UNESCO. La torre simboleggia l'indipendenza del comune medievale della città. I visitatori possono salire i gradini per godere di viste panoramiche sulla città e sulla cattedrale.",
        "descEN": "The Belfry of Amiens is a historic bell tower dating back to the 12th century, rebuilt several times over the centuries. Standing at 52 meters tall, it is recognized as a UNESCO World Heritage site. The tower symbolizes the independence of the city's medieval commune. Visitors can climb the steps to enjoy panoramic views of the city and the cathedral.",
        "tips": "Controllare gli orari di apertura poiché l'accesso alla cima potrebbe essere limitato o richiedere una visita guidata.",
        "tipsEN": "Check opening hours as access to the top may be restricted or require a guided tour.",
        "src": [
          "Wikipedia: Beffroi d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.8954,2.2965"
      },
      {
        "id": "ami-8",
        "name": "Tour Perret",
        "nameEN": "Tour Perret",
        "cat": "cultura",
        "lat": 49.8906,
        "lng": 2.3047,
        "short": "Un pionieristico grattacielo in cemento di 110 metri costruito durante la ricostruzione del dopoguerra.",
        "shortEN": "A pioneering 110-meter concrete skyscraper built during post-war reconstruction.",
        "desc": "Progettata dall'architetto Auguste Perret e completata nel 1952, la Torre Perret è stata uno dei primi grattacieli d'Europa. Alto 110 metri, questo edificio residenziale e per uffici in cemento è un capolavoro dell'architettura della ricostruzione del dopoguerra. La sua cima illuminata funge da faro nel cielo notturno. Sebbene sia in gran parte residenziale, il suo esterno è un punto di riferimento sorprendente vicino alla stazione ferroviaria.",
        "descEN": "Designed by architect Auguste Perret and completed in 1952, the Perret Tower was one of Europe's first skyscrapers. Standing at 110 meters, this concrete residential and office building is a masterpiece of post-war reconstruction architecture. Its illuminated top acts as a beacon in the night sky. Though mostly residential, its exterior is a striking landmark near the train station.",
        "tips": "Da ammirare preferibilmente dall'esterno; l'interno è in gran parte composto da appartamenti privati.",
        "tipsEN": "Best viewed from the outside; the interior is mostly private apartments.",
        "src": [
          "Wikipedia: Tour Perret (Amiens)"
        ],
        "maps": "https://maps.google.com/?q=49.8906,2.3047"
      },
      {
        "id": "ami-9",
        "name": "Cirque Jules Verne",
        "nameEN": "Cirque Jules Verne",
        "cat": "cultura",
        "lat": 49.8886,
        "lng": 2.2961,
        "short": "Uno storico edificio circense permanente inaugurato da Jules Verne nel 1889.",
        "shortEN": "A historic permanent circus building inaugurated by Jules Verne in 1889.",
        "desc": "Il Cirque Jules Verne è un magnifico edificio poligonale in mattoni e pietra inaugurato nel 1889 dallo stesso Jules Verne. È uno dei pochi circhi permanenti ancora in funzione in Francia. L'architettura presenta una sorprendente struttura in ghisa progettata da un allievo di Gustave Eiffel. Oggi ospita spettacoli di circo contemporaneo, concerti ed eventi culturali.",
        "descEN": "The Cirque Jules Verne is a magnificent polygonal brick and stone building inaugurated in 1889 by Jules Verne himself. It is one of the few permanent circuses still operating in France. The architecture features a striking cast-iron framework designed by a student of Gustave Eiffel. Today, it hosts contemporary circus performances, concerts, and cultural events.",
        "tips": "Controllare il programma per spettacoli o visite guidate dell'interno.",
        "tipsEN": "Check the schedule for performances or guided tours of the interior.",
        "src": [
          "Wikipedia: Cirque Jules-Verne"
        ],
        "maps": "https://maps.google.com/?q=49.8886,2.2961"
      },
      {
        "id": "ami-10",
        "name": "Horloge Dewailly et Marie-sans-chemise",
        "nameEN": "Horloge Dewailly et Marie-sans-chemise",
        "cat": "cultura",
        "lat": 49.8925,
        "lng": 2.2983,
        "short": "Un orologio decorato del XIX secolo con una statua in bronzo un tempo considerata scandalosa.",
        "shortEN": "An ornate 19th-century clock featuring a famously scandalous bronze statue.",
        "desc": "L'Orologio Dewailly è un orologio pubblico decorato creato nel 1892 da Émile Ricquier, accompagnato da una statua in bronzo nota come \"Marie-sans-chemise\" (Marie senza camicia) di Albert Roze. La statua di una donna poco vestita che tiene un ramo di melo causò scandalo quando fu svelata per la prima volta. Oggi è un'amata opera d'arte di strada e un popolare punto di incontro nel centro della città.",
        "descEN": "The Dewailly Clock is an ornate public clock created in 1892 by Émile Ricquier, accompanied by a bronze statue known as \"Marie-sans-chemise\" (Marie without a shirt) by Albert Roze. The statue of a scantily clad woman holding an apple branch caused a scandal when first unveiled. Today, it is a beloved piece of street art and a popular meeting point in the city center.",
        "tips": "Situato all'incrocio tra Rue des Trois Cailloux e Rue Ernest Cauvin.",
        "tipsEN": "Located at the intersection of Rue des Trois Cailloux and Rue Ernest Cauvin.",
        "src": [
          "Wikipedia: Horloge Dewailly"
        ],
        "maps": "https://maps.google.com/?q=49.8925,2.2983"
      },
      {
        "id": "ami-11",
        "name": "Zoo d'Amiens Métropole",
        "nameEN": "Zoo d'Amiens Métropole",
        "cat": "kids",
        "lat": 49.8994,
        "lng": 2.2858,
        "short": "Un affascinante zoo incentrato sulla conservazione immerso in un ambiente verdeggiante.",
        "shortEN": "A charming, conservation-focused zoo set in a lush green environment.",
        "desc": "Lo Zoo di Amiens è un parco zoologico compatto e splendidamente paesaggistico situato vicino al centro della città. Si concentra sulla conservazione delle specie in via di estinzione e ospita oltre 500 animali provenienti da tutto il mondo. Lo zoo è profondamente integrato nella natura circostante, offrendo percorsi ombreggiati e mostre educative. È una destinazione ideale per famiglie e amanti della natura.",
        "descEN": "The Amiens Zoo is a compact, beautifully landscaped zoological park located near the city center. It focuses on the conservation of endangered species and houses over 500 animals from around the world. The zoo is deeply integrated into the surrounding nature, offering shaded pathways and educational exhibits. It is an ideal destination for families and nature lovers.",
        "tips": "Prevedere circa 2 ore per la visita; ottimo per i bambini.",
        "tipsEN": "Allow about 2 hours for a visit; great for children.",
        "src": [
          "Official Website: Zoo d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.8994,2.2858"
      },
      {
        "id": "ami-12",
        "name": "Église Saint-Germain-l'Écossais",
        "nameEN": "Église Saint-Germain-l'Écossais",
        "cat": "cultura",
        "lat": 49.8961,
        "lng": 2.2986,
        "short": "Una chiesa gotica del XV secolo famosa per la sua torre leggermente pendente.",
        "shortEN": "A 15th-century Gothic church famous for its slightly leaning tower.",
        "desc": "La Chiesa di Saint-Germain-l'Écossais è una bellissima chiesa gotica risalente al XV secolo. È nota per la sua sorprendente torre pendente e per la sua ricca storia legata alle corporazioni locali. La chiesa ha subito danni durante la Seconda Guerra Mondiale ma è stata accuratamente restaurata. Il suo interno presenta eleganti vetrate e un'atmosfera pacifica lontano dalla folla.",
        "descEN": "The Church of Saint-Germain-l'Écossais is a beautiful Gothic church dating back to the 15th century. It is known for its striking leaning tower and its rich history tied to the local guilds. The church suffered damage during World War II but has been carefully restored. Its interior features elegant stained glass windows and a peaceful atmosphere away from the crowds.",
        "tips": "Spesso chiusa al di fuori degli orari delle funzioni, ma l'esterno merita di essere ammirato.",
        "tipsEN": "Often closed outside of service times, but the exterior is worth admiring.",
        "src": [
          "Wikipedia: Église Saint-Germain-l'Écossais d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.8961,2.2986"
      },
      {
        "id": "ami-13",
        "name": "Place Gambetta",
        "nameEN": "Place Gambetta",
        "cat": "cultura",
        "lat": 49.8928,
        "lng": 2.2997,
        "short": "Una vivace piazza centrale pedonale circondata da negozi e caffè.",
        "shortEN": "A lively, pedestrianized central square surrounded by shops and cafes.",
        "desc": "Place Gambetta è una piazza centrale di Amiens, riprogettata per essere un vivace centro pedonale. Circondata da negozi, caffè e architettura storica, funge da cuore pulsante del quartiere commerciale della città. La piazza presenta un paesaggio moderno, giochi d'acqua e aree salotto. È il luogo perfetto per rilassarsi, osservare la gente e immergersi nell'atmosfera locale.",
        "descEN": "Place Gambetta is a central square in Amiens, redesigned to be a pedestrian-friendly hub of activity. Surrounded by shops, cafes, and historic architecture, it serves as the beating heart of the city's commercial district. The square features modern landscaping, water features, and seating areas. It is the perfect spot to relax, people-watch, and soak in the local atmosphere.",
        "tips": "Un ottimo punto di partenza per esplorare la principale via dello shopping, Rue des Trois Cailloux.",
        "tipsEN": "A great starting point for exploring the main shopping street, Rue des Trois Cailloux.",
        "src": [
          "Local Knowledge"
        ],
        "maps": "https://maps.google.com/?q=49.8928,2.2997"
      },
      {
        "id": "ami-14",
        "name": "Cimetière de la Madeleine",
        "nameEN": "Cimetière de la Madeleine",
        "cat": "cultura",
        "lat": 49.9056,
        "lng": 2.2811,
        "short": "Un cimitero romantico e boscoso famoso per la drammatica tomba di Jules Verne.",
        "shortEN": "A romantic, wooded cemetery famous for the dramatic tomb of Jules Verne.",
        "desc": "Il Cimitero della Madeleine è un cimitero romantico e boscoso spesso paragonato al Père Lachaise di Parigi. È famoso soprattutto per essere l'ultima dimora del celebre autore Jules Verne, la cui tomba presenta una drammatica scultura di lui che esce dalla tomba. Il terreno collinare del cimitero, gli alberi secolari e gli elaborati mausolei del XIX secolo creano un ambiente malinconico e pacifico per una passeggiata.",
        "descEN": "The Madeleine Cemetery is a romantic, wooded cemetery often compared to Père Lachaise in Paris. It is most famous as the final resting place of the renowned author Jules Verne, whose tomb features a dramatic sculpture of him breaking out of his grave. The cemetery's hilly terrain, ancient trees, and elaborate 19th-century mausoleums create a melancholic and peaceful setting for a walk.",
        "tips": "La tomba di Jules Verne è chiaramente segnalata dall'ingresso principale.",
        "tipsEN": "Jules Verne's tomb is clearly signposted from the main entrance.",
        "src": [
          "Wikipedia: Cimetière de la Madeleine (Amiens)"
        ],
        "maps": "https://maps.google.com/?q=49.9056,2.2811"
      },
      {
        "id": "ami-15",
        "name": "Parc de la Hotoie",
        "nameEN": "Parc de la Hotoie",
        "cat": "natura",
        "lat": 49.8967,
        "lng": 2.2822,
        "short": "Il più antico parco pubblico di Amiens, caratterizzato da ampi viali e un grande bacino d'acqua.",
        "shortEN": "The oldest public park in Amiens, featuring wide avenues and a large water basin.",
        "desc": "Il Parc de la Hotoie è il più antico parco pubblico di Amiens e offre una vasta distesa verde a ovest del centro città. Istituito nel XV secolo, presenta ampi viali alberati, un grande bacino centrale e ampi prati. Il parco ospita frequentemente fiere, circhi ed eventi pubblici. È un luogo popolare per fare jogging, picnic e passeggiate rilassanti tra la gente del posto.",
        "descEN": "Parc de la Hotoie is the oldest public park in Amiens, offering a vast green expanse just west of the city center. Established in the 15th century, it features wide tree-lined avenues, a large central basin, and expansive lawns. The park frequently hosts fairs, circuses, and public events. It is a popular spot for jogging, picnicking, and leisurely strolls among locals.",
        "tips": "Situato proprio accanto allo Zoo di Amiens, rendendo facile combinare entrambe le visite.",
        "tipsEN": "Located right next to the Amiens Zoo, making it easy to combine both visits.",
        "src": [
          "Wikipedia: Parc de la Hotoie"
        ],
        "maps": "https://maps.google.com/?q=49.8967,2.2822"
      },
      {
        "id": "ami-16",
        "name": "Maison du Sagittaire",
        "nameEN": "Maison du Sagittaire",
        "cat": "cultura",
        "lat": 49.8936,
        "lng": 2.2989,
        "short": "Una facciata rinascimentale del XVI secolo conservata e adornata con sculture intricate.",
        "shortEN": "A preserved 16th-century Renaissance facade adorned with intricate sculptures.",
        "desc": "La Maison du Sagittaire è una sorprendente facciata di edificio in stile rinascimentale situata vicino alla cattedrale. Originariamente costruita nel XVI secolo, la facciata fu salvata dalla distruzione durante la Seconda Guerra Mondiale e successivamente annessa a un edificio moderno. È adornata con sculture intricate, tra cui la figura del Sagittario che le dà il nome. Rappresenta un bellissimo ricordo del patrimonio architettonico prebellico di Amiens.",
        "descEN": "The Maison du Sagittaire is a striking Renaissance-style building facade located near the cathedral. Originally built in the 16th century, the facade was saved from destruction during World War II and later attached to a modern building. It is adorned with intricate sculptures, including the Sagittarius figure that gives it its name. It stands as a beautiful reminder of Amiens' pre-war architectural heritage.",
        "tips": "Situata nella zona pedonale, facilmente visibile passeggiando verso la cattedrale.",
        "tipsEN": "Located in the pedestrian zone, easily viewed while walking to the cathedral.",
        "src": [
          "Wikipedia: Maison du Sagittaire"
        ],
        "maps": "https://maps.google.com/?q=49.8936,2.2989"
      },
      {
        "id": "ami-17",
        "name": "Église Saint-Leu",
        "nameEN": "Église Saint-Leu",
        "cat": "cultura",
        "lat": 49.8969,
        "lng": 2.3019,
        "short": "Una chiesa gotica del XV secolo situata nello storico quartiere dei canali.",
        "shortEN": "A 15th-century Gothic church located in the historic canal district.",
        "desc": "La Chiesa di Saint-Leu è una chiesa tardo gotica situata nel cuore del pittoresco quartiere di Saint-Leu. Costruita nel XV secolo, serviva i mugnai, i tessitori e i tintori locali che vivevano lungo i canali. La chiesa presenta una caratteristica volta in legno e una robusta torre campanaria. La sua posizione vicino all'acqua la rende un punto di riferimento altamente fotogenico nel quartiere più antico di Amiens.",
        "descEN": "The Church of Saint-Leu is a late Gothic church situated in the heart of the picturesque Saint-Leu district. Built in the 15th century, it served the local millers, weavers, and dyers who lived along the canals. The church features a distinctive wooden vault and a robust bell tower. Its location by the water makes it a highly photogenic landmark in Amiens' oldest neighborhood.",
        "tips": "Le strade circostanti sono ricche di caffè e ristoranti con vista sui canali.",
        "tipsEN": "The surrounding streets are full of cafes and restaurants with canal views.",
        "src": [
          "Wikipedia: Église Saint-Leu d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.8969,2.3019"
      },
      {
        "id": "ami-18",
        "name": "Jardin des Plantes d'Amiens",
        "nameEN": "Jardin des Plantes d'Amiens",
        "cat": "natura",
        "lat": 49.9022,
        "lng": 2.2951,
        "short": "Un giardino botanico del XVIII secolo con diverse collezioni di piante e alberi secolari.",
        "shortEN": "An 18th-century botanical garden featuring diverse plant collections and ancient trees.",
        "desc": "Il Jardin des Plantes è uno storico giardino botanico di Amiens, originariamente istituito nel XVIII secolo. Esteso su quasi due ettari, presenta una vasta collezione di piante, aiuole a tema e alberi secolari. Il giardino funge sia da risorsa scientifica che da tranquillo parco pubblico. Le sue serre ben tenute e le disposizioni geometriche lo rendono un luogo delizioso per una passeggiata rilassante.",
        "descEN": "The Jardin des Plantes is a historic botanical garden in Amiens, originally established in the 18th century. Spanning nearly two hectares, it features a diverse collection of plants, themed flower beds, and ancient trees. The garden serves both as a scientific resource and a peaceful public park. Its well-maintained greenhouses and geometric layouts make it a delightful spot for a relaxing walk.",
        "tips": "L'ingresso è gratuito ed è un luogo perfetto per una pausa tranquilla dalle visite turistiche.",
        "tipsEN": "Entrance is free, and it is a perfect spot for a quiet break from sightseeing.",
        "src": [
          "Wikipedia: Jardin des Plantes d'Amiens"
        ],
        "maps": "https://maps.google.com/?q=49.9022,2.2951"
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
        "tier": 1,
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
        "tier": 1,
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
        "tier": 2,
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
        "tier": 2,
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
      },
      {
        "id": "sse-6",
        "name": "Basílica de Santa María del Coro",
        "nameEN": "Basílica de Santa María del Coro",
        "cat": "cultura",
        "lat": 43.3241,
        "lng": -1.9866,
        "short": "Un'imponente basilica barocca con una spettacolare facciata nel cuore della Città Vecchia.",
        "shortEN": "An impressive Baroque basilica with a spectacular facade in the heart of the Old Town.",
        "desc": "La Basílica de Santa María del Coro è un'imponente chiesa barocca situata nel cuore della Parte Vieja (Città Vecchia) di San Sebastián. Completata nel 1774, presenta una magnifica facciata churrigueresca che cattura l'attenzione dei visitatori. L'interno è altrettanto spettacolare, con una navata spaziosa e altari riccamente decorati. La chiesa è dedicata alla patrona della città e rappresenta uno dei monumenti religiosi più importanti della regione.",
        "descEN": "The Basilica of Santa María del Coro is an impressive Baroque church located in the heart of the Parte Vieja (Old Town) of San Sebastián. Completed in 1774, it features a magnificent Churrigueresque facade that captivates visitors. The interior is equally spectacular, with a spacious nave and richly decorated altars. The church is dedicated to the city's patron saint and represents one of the most important religious monuments in the region.",
        "tips": "Ingresso gratuito, ma le donazioni sono ben accette. Rispetta il silenzio durante le funzioni.",
        "tipsEN": "Free entry, but donations are welcome. Please respect silence during services.",
        "src": [
          "Wikipedia: Basilica of Santa María del Coro"
        ],
        "maps": "https://maps.google.com/?q=43.3241,-1.9866"
      },
      {
        "id": "sse-7",
        "name": "Iglesia de San Vicente",
        "nameEN": "Iglesia de San Vicente",
        "cat": "cultura",
        "lat": 43.3245,
        "lng": -1.9839,
        "short": "La chiesa più antica della città, un capolavoro gotico del XVI secolo.",
        "shortEN": "The oldest church in the city, a 16th-century Gothic masterpiece.",
        "desc": "L'Iglesia de San Vicente è l'edificio più antico di San Sebastián, costruito all'inizio del XVI secolo in stile gotico. Situata nella Parte Vieja, la chiesa si distingue per le sue maestose volte a crociera e il bellissimo retablo maggiore romanico, opera di Ambrosio de Bengoechea. Le sue spesse mura e i contrafforti le conferiscono un aspetto quasi fortificato. È un luogo di grande importanza storica e spirituale per la comunità locale.",
        "descEN": "The Iglesia de San Vicente is the oldest building in San Sebastián, built in the early 16th century in the Gothic style. Located in the Parte Vieja, the church stands out for its majestic ribbed vaults and the beautiful Romanesque main altarpiece by Ambrosio de Bengoechea. Its thick walls and buttresses give it an almost fortified appearance. It is a place of great historical and spiritual importance for the local community.",
        "tips": "Aperta tutti i giorni. L'illuminazione interna esalta le splendide vetrate.",
        "tipsEN": "Open daily. The interior lighting highlights the beautiful stained glass windows.",
        "src": [
          "Wikipedia: San Vicente Church, San Sebastián"
        ],
        "maps": "https://maps.google.com/?q=43.3245,-1.9839"
      },
      {
        "tier": 1,
        "id": "sse-8",
        "name": "Mercado de la Bretxa",
        "nameEN": "Mercado de la Bretxa",
        "cat": "cibo",
        "lat": 43.3232,
        "lng": -1.9825,
        "short": "Storico mercato coperto dove trovare i migliori prodotti freschi della gastronomia basca.",
        "shortEN": "Historic covered market where you can find the best fresh products of Basque gastronomy.",
        "desc": "Il Mercado de la Bretxa è uno storico mercato coperto situato ai margini della Città Vecchia, risalente al 1870. Il nome deriva dalla breccia aperta nelle mura della città dalle truppe anglo-portoghesi nel 1813. Oggi ospita bancarelle che vendono i migliori prodotti freschi locali, tra cui pesce, carne, formaggi e verdure. È il luogo ideale per scoprire gli ingredienti alla base della rinomata gastronomia basca.",
        "descEN": "The Mercado de la Bretxa is a historic covered market located on the edge of the Old Town, dating back to 1870. The name comes from the breach made in the city walls by Anglo-Portuguese troops in 1813. Today it houses stalls selling the best fresh local produce, including fish, meat, cheeses, and vegetables. It is the ideal place to discover the ingredients behind the renowned Basque gastronomy.",
        "tips": "Visita al mattino presto per vedere i banchi del pesce più forniti.",
        "tipsEN": "Visit early in the morning to see the best selection at the fish stalls.",
        "src": [
          "Official Tourism Website: La Bretxa Market"
        ],
        "maps": "https://maps.google.com/?q=43.3232,-1.9825"
      },
      {
        "id": "sse-9",
        "name": "Teatro Victoria Eugenia",
        "nameEN": "Teatro Victoria Eugenia",
        "cat": "cultura",
        "lat": 43.3228,
        "lng": -1.9801,
        "short": "Un elegante teatro in stile Belle Époque, centro della vita culturale cittadina.",
        "shortEN": "An elegant Belle Époque theatre, the center of the city's cultural life.",
        "desc": "Il Teatro Victoria Eugenia è uno dei teatri più emblematici della Spagna, inaugurato nel 1912 in stile Belle Époque. Situato lungo il fiume Urumea, ha ospitato per decenni il Festival Internazionale del Cinema di San Sebastián. L'edificio, recentemente restaurato, vanta una facciata elegante in pietra arenaria e un interno lussuoso con un magnifico soffitto affrescato. È il cuore pulsante della vita culturale della città.",
        "descEN": "The Victoria Eugenia Theatre is one of the most emblematic theatres in Spain, inaugurated in 1912 in the Belle Époque style. Located along the Urumea River, it hosted the San Sebastián International Film Festival for decades. The recently restored building boasts an elegant sandstone facade and a luxurious interior with a magnificent frescoed ceiling. It is the beating heart of the city's cultural life.",
        "tips": "Controlla il programma per assistere a uno spettacolo o prenota una visita guidata.",
        "tipsEN": "Check the schedule to catch a show or book a guided tour.",
        "src": [
          "Wikipedia: Victoria Eugenia Theater"
        ],
        "maps": "https://maps.google.com/?q=43.3228,-1.9801"
      },
      {
        "id": "sse-10",
        "name": "Catedral del Buen Pastor",
        "nameEN": "Catedral del Buen Pastor",
        "cat": "cultura",
        "lat": 43.3168,
        "lng": -1.9815,
        "short": "La più grande cattedrale della città, un magnifico esempio di architettura neogotica.",
        "shortEN": "The largest cathedral in the city, a magnificent example of neo-Gothic architecture.",
        "desc": "La Catedral del Buen Pastor è la chiesa più grande di San Sebastián, costruita alla fine del XIX secolo in stile neogotico. Ispirata alle grandi cattedrali medievali europee, come quella di Colonia, presenta una torre imponente alta 75 metri che domina lo skyline della città. L'interno è vasto e luminoso, arricchito da splendide vetrate policrome e un grande organo. Si trova nel centro della zona romantica della città.",
        "descEN": "The Cathedral of the Good Shepherd is the largest church in San Sebastián, built in the late 19th century in the neo-Gothic style. Inspired by the great medieval European cathedrals, such as Cologne, it features an imposing 75-meter-high tower that dominates the city's skyline. The interior is vast and bright, enriched by beautiful stained glass windows and a large organ. It is located in the center of the city's romantic area.",
        "tips": "L'ingresso è gratuito. La piazza antistante è perfetta per scattare foto della facciata.",
        "tipsEN": "Entry is free. The square in front is perfect for taking photos of the facade.",
        "src": [
          "Wikipedia: Cathedral of the Good Shepherd of San Sebastián"
        ],
        "maps": "https://maps.google.com/?q=43.3168,-1.9815"
      },
      {
        "id": "sse-11",
        "name": "Parque Alderdi Eder",
        "nameEN": "Parque Alderdi Eder",
        "cat": "natura",
        "lat": 43.3211,
        "lng": -1.9845,
        "short": "Un bellissimo parco costiero con giardini curati, una giostra d'epoca e viste sulla baia.",
        "shortEN": "A beautiful coastal park with manicured gardens, a vintage carousel, and bay views.",
        "desc": "Il Parque Alderdi Eder, che in basco significa 'luogo bellissimo', è un incantevole giardino pubblico situato di fronte alla baia de La Concha e al municipio. Caratterizzato da eleganti palme tamerici, aiuole fiorite e una giostra d'epoca, è uno dei luoghi più pittoreschi della città. Offre una vista spettacolare sul mare e sull'isola di Santa Clara. È il posto perfetto per una passeggiata rilassante o per ammirare il tramonto.",
        "descEN": "Parque Alderdi Eder, which means 'beautiful place' in Basque, is a charming public garden located in front of La Concha Bay and the City Hall. Characterized by elegant tamarisk trees, flower beds, and a vintage carousel, it is one of the most picturesque spots in the city. It offers spectacular views of the sea and Santa Clara Island. It is the perfect place for a relaxing stroll or to watch the sunset.",
        "tips": "Ideale per le famiglie, la giostra è un'attrazione imperdibile per i bambini.",
        "tipsEN": "Ideal for families, the carousel is a must-do attraction for children.",
        "src": [
          "San Sebastián Tourism: Alderdi Eder"
        ],
        "maps": "https://maps.google.com/?q=43.3211,-1.9845"
      },
      {
        "id": "sse-12",
        "name": "Palacio de Miramar",
        "nameEN": "Palacio de Miramar",
        "cat": "cultura",
        "lat": 43.3144,
        "lng": -1.9989,
        "short": "Ex residenza estiva reale circondata da splendidi giardini con vista mozzafiato sulla baia.",
        "shortEN": "Former royal summer residence surrounded by beautiful gardens with breathtaking bay views.",
        "desc": "Il Palacio de Miramar è un'elegante residenza in stile inglese costruita nel 1893 come residenza estiva per la famiglia reale spagnola. Situato su una collina che separa le spiagge de La Concha e Ondarreta, offre alcune delle viste panoramiche più spettacolari sulla baia. Sebbene l'interno sia aperto solo per eventi speciali, i vasti giardini circostanti sono aperti al pubblico e rappresentano un luogo idilliaco per passeggiare.",
        "descEN": "The Miramar Palace is an elegant English-style residence built in 1893 as a summer home for the Spanish royal family. Situated on a hill separating La Concha and Ondarreta beaches, it offers some of the most spectacular panoramic views of the bay. Although the interior is only open for special events, the vast surrounding gardens are open to the public and represent an idyllic place to stroll.",
        "tips": "I giardini sono aperti gratuitamente al pubblico e sono perfetti per un picnic.",
        "tipsEN": "The gardens are open to the public for free and are perfect for a picnic.",
        "src": [
          "Wikipedia: Miramar Palace"
        ],
        "maps": "https://maps.google.com/?q=43.3144,-1.9989"
      },
      {
        "tier": 1,
        "id": "sse-13",
        "name": "Peine del Viento",
        "nameEN": "Peine del Viento",
        "cat": "panorama",
        "lat": 43.3216,
        "lng": -2.0058,
        "short": "Un'iconica scultura in acciaio incastonata nelle rocce dove le onde dell'oceano si infrangono.",
        "shortEN": "An iconic steel sculpture embedded in the rocks where the ocean waves crash.",
        "desc": "Il Peine del Viento (Pettine del Vento) è una delle opere d'arte più iconiche di San Sebastián, creata dallo scultore basco Eduardo Chillida e dall'architetto Luis Peña Ganchegui. Situata all'estremità occidentale della baia, ai piedi del Monte Igueldo, l'opera è composta da tre massicce sculture in acciaio incastonate nelle rocce. Quando il mare è agitato, le onde si infrangono violentemente contro le sculture, creando uno spettacolo naturale e artistico unico.",
        "descEN": "The Peine del Viento (Comb of the Wind) is one of the most iconic artworks in San Sebastián, created by Basque sculptor Eduardo Chillida and architect Luis Peña Ganchegui. Located at the western end of the bay, at the foot of Mount Igueldo, the work consists of three massive steel sculptures embedded in the rocks. When the sea is rough, the waves crash violently against the sculptures, creating a unique natural and artistic spectacle.",
        "tips": "Visita durante l'alta marea o in una giornata ventosa per vedere le onde in azione.",
        "tipsEN": "Visit during high tide or on a windy day to see the waves in action.",
        "src": [
          "Wikipedia: Comb of the Wind"
        ],
        "maps": "https://maps.google.com/?q=43.3216,-2.0058"
      },
      {
        "tier": 1,
        "id": "sse-14",
        "name": "Monte Igueldo",
        "nameEN": "Monte Igueldo",
        "cat": "panorama",
        "lat": 43.3219,
        "lng": -2.0086,
        "short": "Una collina accessibile in funicolare che offre la vista più spettacolare sulla baia.",
        "shortEN": "A hill accessible by funicular offering the most spectacular view of the bay.",
        "desc": "Il Monte Igueldo offre la vista panoramica più famosa e fotografata di San Sebastián e della sua baia a forma di conchiglia. Si può raggiungere la cima tramite una storica funicolare in legno inaugurata nel 1912. Sulla sommità si trova un parco divertimenti vintage dal fascino retrò e un'antica torre di avvistamento, il Torreón, che ospita una mostra e offre viste ancora più elevate. È un'esperienza imperdibile per ogni visitatore.",
        "descEN": "Mount Igueldo offers the most famous and photographed panoramic view of San Sebastián and its shell-shaped bay. You can reach the top via a historic wooden funicular opened in 1912. At the summit, there is a vintage amusement park with retro charm and an ancient watchtower, the Torreón, which houses an exhibition and offers even higher views. It is a must-do experience for every visitor.",
        "tips": "Prendi la funicolare storica per salire. L'ingresso al belvedere richiede un piccolo biglietto.",
        "tipsEN": "Take the historic funicular to go up. Entry to the viewpoint requires a small fee.",
        "src": [
          "Wikipedia: Monte Igueldo"
        ],
        "maps": "https://maps.google.com/?q=43.3219,-2.0086"
      },
      {
        "id": "sse-15",
        "name": "Playa de la Zurriola",
        "nameEN": "Playa de la Zurriola",
        "cat": "natura",
        "lat": 43.3265,
        "lng": -1.9752,
        "short": "La spiaggia dei surfisti, nota per le sue onde e l'atmosfera vivace e giovanile.",
        "shortEN": "The surfers' beach, known for its waves and lively, youthful atmosphere.",
        "desc": "La Playa de la Zurriola è la spiaggia più dinamica e giovanile di San Sebastián, situata nel quartiere di Gros. A differenza della tranquilla baia de La Concha, Zurriola è aperta all'oceano e famosa per le sue onde, rendendola un paradiso per i surfisti di tutto il mondo. La spiaggia è fiancheggiata da un vivace lungomare ed è il luogo ideale per praticare sport, assistere a concerti o semplicemente godersi l'atmosfera vibrante.",
        "descEN": "Playa de la Zurriola is the most dynamic and youthful beach in San Sebastián, located in the Gros neighborhood. Unlike the calm La Concha bay, Zurriola is open to the ocean and famous for its waves, making it a paradise for surfers from all over the world. The beach is flanked by a lively promenade and is the ideal place to practice sports, attend concerts, or simply enjoy the vibrant atmosphere.",
        "tips": "Ottima per prendere lezioni di surf o guardare i surfisti al tramonto.",
        "tipsEN": "Great for taking surf lessons or watching the surfers at sunset.",
        "src": [
          "San Sebastián Tourism: Zurriola Beach"
        ],
        "maps": "https://maps.google.com/?q=43.3265,-1.9752"
      },
      {
        "tier": 1,
        "id": "sse-16",
        "name": "Kursaal",
        "nameEN": "Kursaal",
        "cat": "cultura",
        "lat": 43.325,
        "lng": -1.9778,
        "short": "Un moderno centro congressi formato da due cubi di vetro che si illuminano di notte.",
        "shortEN": "A modern congress center formed by two glass cubes that light up at night.",
        "desc": "Il Kursaal è un imponente centro congressi e auditorium progettato dall'architetto Rafael Moneo. Situato alla foce del fiume Urumea, l'edificio è composto da due grandi cubi di vetro traslucido che ricordano rocce arenate sulla spiaggia. Di notte, i cubi si illuminano creando un effetto visivo straordinario. È la sede principale del Festival Internazionale del Cinema di San Sebastián e ospita numerosi eventi culturali e concerti.",
        "descEN": "The Kursaal is an imposing congress center and auditorium designed by architect Rafael Moneo. Located at the mouth of the Urumea River, the building consists of two large translucent glass cubes that resemble rocks stranded on the beach. At night, the cubes light up, creating an extraordinary visual effect. It is the main venue for the San Sebastián International Film Festival and hosts numerous cultural events and concerts.",
        "tips": "Ammira l'edificio di notte quando è illuminato. Controlla il programma per eventi e concerti.",
        "tipsEN": "Admire the building at night when it is illuminated. Check the schedule for events and concerts.",
        "src": [
          "Wikipedia: Kursaal Palace"
        ],
        "maps": "https://maps.google.com/?q=43.325,-1.9778"
      },
      {
        "id": "sse-17",
        "name": "Puente de María Cristina",
        "nameEN": "Puente de María Cristina",
        "cat": "cultura",
        "lat": 43.3175,
        "lng": -1.9792,
        "short": "Un elegante ponte in stile Belle Époque decorato con quattro monumentali obelischi.",
        "shortEN": "An elegant Belle Époque bridge decorated with four monumental obelisks.",
        "desc": "Il Puente de María Cristina è il ponte più elegante di San Sebastián, che attraversa il fiume Urumea collegando il centro città con la stazione ferroviaria. Inaugurato nel 1905, si distingue per i suoi quattro monumentali obelischi alle estremità, sormontati da gruppi scultorei equestri. Il design del ponte, con i suoi ricchi dettagli ornamentali, riflette lo stile Belle Époque che caratterizza gran parte dell'architettura della città.",
        "descEN": "The María Cristina Bridge is the most elegant bridge in San Sebastián, crossing the Urumea River to connect the city center with the train station. Inaugurated in 1905, it stands out for its four monumental obelisks at the ends, topped by equestrian sculptural groups. The design of the bridge, with its rich ornamental details, reflects the Belle Époque style that characterizes much of the city's architecture.",
        "tips": "Attraversa il ponte a piedi per ammirare i dettagli scultorei e la vista sul fiume.",
        "tipsEN": "Cross the bridge on foot to admire the sculptural details and the view of the river.",
        "src": [
          "Wikipedia: María Cristina Bridge"
        ],
        "maps": "https://maps.google.com/?q=43.3175,-1.9792"
      },
      {
        "id": "sse-18",
        "name": "Plaza de Gipuzkoa",
        "nameEN": "Plaza de Gipuzkoa",
        "cat": "natura",
        "lat": 43.3218,
        "lng": -1.9814,
        "short": "Una pittoresca piazza con un giardino all'inglese, un laghetto e un orologio floreale.",
        "shortEN": "A picturesque square with an English-style garden, a pond, and a floral clock.",
        "desc": "La Plaza de Gipuzkoa è un'oasi verde nel cuore della zona romantica di San Sebastián. Progettata dal giardiniere francese Pierre Ducasse, la piazza ospita un bellissimo giardino all'inglese con un laghetto, cigni, un ponte di legno e un orologio floreale. È circondata da eleganti edifici porticati, tra cui il Palazzo della Deputazione Forale di Gipuzkoa. È un luogo tranquillo e pittoresco, molto amato dai residenti.",
        "descEN": "Plaza de Gipuzkoa is a green oasis in the heart of San Sebastián's romantic area. Designed by French gardener Pierre Ducasse, the square features a beautiful English-style garden with a pond, swans, a wooden bridge, and a floral clock. It is surrounded by elegant arcaded buildings, including the Palace of the Provincial Council of Gipuzkoa. It is a quiet and picturesque place, much loved by locals.",
        "tips": "Perfetta per una pausa rilassante all'ombra degli alberi.",
        "tipsEN": "Perfect for a relaxing break in the shade of the trees.",
        "src": [
          "San Sebastián Tourism: Gipuzkoa Square"
        ],
        "maps": "https://maps.google.com/?q=43.3218,-1.9814"
      },
      {
        "id": "sse-19",
        "name": "Tabakalera",
        "nameEN": "Tabakalera",
        "cat": "cultura",
        "lat": 43.3164,
        "lng": -1.9765,
        "short": "Ex fabbrica di tabacco ora vivace centro di cultura contemporanea con una terrazza panoramica.",
        "shortEN": "Former tobacco factory now a vibrant contemporary culture center with a rooftop terrace.",
        "desc": "Tabakalera è un ex fabbrica di tabacco trasformata in un imponente Centro Internazionale di Cultura Contemporanea. Situato vicino alla stazione ferroviaria, questo vasto edificio offre spazi espositivi, cinema, laboratori creativi e una biblioteca. L'architettura industriale è stata magnificamente rinnovata, creando un ambiente stimolante per l'arte e la cultura. La terrazza sul tetto offre una vista panoramica unica sulla città.",
        "descEN": "Tabakalera is a former tobacco factory transformed into an impressive International Centre for Contemporary Culture. Located near the train station, this vast building offers exhibition spaces, cinemas, creative labs, and a library. The industrial architecture has been beautifully renovated, creating a stimulating environment for art and culture. The rooftop terrace offers a unique panoramic view of the city.",
        "tips": "L'ingresso all'edificio e a molte mostre è gratuito. Non perdere la vista dalla terrazza.",
        "tipsEN": "Entry to the building and many exhibitions is free. Don't miss the view from the terrace.",
        "src": [
          "Wikipedia: Tabakalera"
        ],
        "maps": "https://maps.google.com/?q=43.3164,-1.9765"
      },
      {
        "id": "sse-20",
        "name": "Ayuntamiento de San Sebastián",
        "nameEN": "Ayuntamiento de San Sebastián",
        "cat": "cultura",
        "lat": 43.3214,
        "lng": -1.9856,
        "short": "L'elegante municipio della città, un tempo un lussuoso casinò della Belle Époque.",
        "shortEN": "The city's elegant city hall, once a luxurious Belle Époque casino.",
        "desc": "L'Ayuntamiento (Municipio) di San Sebastián è uno degli edifici più belli della città, originariamente costruito nel 1887 come Gran Casinò. Durante la Belle Époque, ha ospitato l'alta società europea prima che il gioco d'azzardo venisse proibito. Situato tra la baia de La Concha e il Parque Alderdi Eder, l'edificio vanta un'architettura elegante e maestosa. Sulla facciata sono ancora visibili i fori di proiettile risalenti alla Guerra Civile Spagnola.",
        "descEN": "The Ayuntamiento (City Hall) of San Sebastián is one of the most beautiful buildings in the city, originally built in 1887 as the Grand Casino. During the Belle Époque, it hosted European high society before gambling was prohibited. Located between La Concha Bay and Parque Alderdi Eder, the building boasts elegant and majestic architecture. Bullet holes from the Spanish Civil War are still visible on the facade.",
        "tips": "Ammira l'edificio dall'esterno; i giardini circostanti sono perfetti per rilassarsi.",
        "tipsEN": "Admire the building from the outside; the surrounding gardens are perfect for relaxing.",
        "src": [
          "Wikipedia: San Sebastián City Hall"
        ],
        "maps": "https://maps.google.com/?q=43.3214,-1.9856"
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
        "tier": 2,
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
        "tier": 1,
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
        "tier": 2,
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
      },
      {
        "tier": 1,
        "id": "bil-6",
        "name": "Catedral de Santiago de Bilbao",
        "nameEN": "Catedral de Santiago de Bilbao",
        "cat": "cultura",
        "lat": 43.2575,
        "lng": -2.9242,
        "short": "Una storica cattedrale gotica nel cuore del centro storico di Bilbao.",
        "shortEN": "A historic Gothic cathedral in the heart of Bilbao's old town.",
        "desc": "La Cattedrale di Santiago è il più antico edificio di Bilbao, situato nel cuore del Casco Viejo. Costruita tra il XIV e il XV secolo, presenta un magnifico stile gotico con un chiostro affascinante. È dedicata all'apostolo San Giacomo ed è una tappa importante sul Cammino di Santiago del Nord. L'interno è caratterizzato da tre navate e splendide cappelle laterali.",
        "descEN": "Santiago Cathedral is the oldest building in Bilbao, located in the heart of the Casco Viejo. Built between the 14th and 15th centuries, it features a magnificent Gothic style with a charming cloister. It is dedicated to the apostle Saint James and is an important stop on the Northern Way of St. James. The interior is characterized by three naves and beautiful side chapels.",
        "tips": "L'ingresso è a pagamento e include l'audioguida; controlla gli orari delle messe.",
        "tipsEN": "Entry requires a ticket which includes an audioguide; check mass times.",
        "src": [
          "Wikipedia: Bilbao Cathedral",
          "Official Tourism Website"
        ],
        "maps": "https://maps.google.com/?q=43.2575,-2.9242"
      },
      {
        "tier": 1,
        "id": "bil-7",
        "name": "Museo de Bellas Artes de Bilbao",
        "nameEN": "Museo de Bellas Artes de Bilbao",
        "cat": "cultura",
        "lat": 43.2661,
        "lng": -2.9383,
        "short": "Un prestigioso museo che ospita una vasta collezione di arte dal Medioevo ai giorni nostri.",
        "shortEN": "A prestigious museum housing a vast collection of art from the Middle Ages to the present day.",
        "desc": "Il Museo di Belle Arti di Bilbao è uno dei musei d'arte più importanti della Spagna. La sua vasta collezione spazia dall'arte medievale a quella contemporanea, includendo capolavori di artisti baschi, spagnoli ed europei. L'edificio stesso è un interessante mix di architettura classica e moderna. Offre un'esperienza culturale profonda, complementare a quella del vicino Guggenheim.",
        "descEN": "The Bilbao Fine Arts Museum is one of the most important art museums in Spain. Its vast collection ranges from medieval to contemporary art, including masterpieces by Basque, Spanish, and European artists. The building itself is an interesting mix of classical and modern architecture. It offers a deep cultural experience, complementary to the nearby Guggenheim.",
        "tips": "L'ingresso è spesso gratuito il mercoledì pomeriggio o la domenica.",
        "tipsEN": "Entry is often free on Wednesday afternoons or Sundays.",
        "src": [
          "Wikipedia: Bilbao Fine Arts Museum",
          "Museo de Bellas Artes official site"
        ],
        "maps": "https://maps.google.com/?q=43.2661,-2.9383"
      },
      {
        "tier": 1,
        "id": "bil-8",
        "name": "Teatro Arriaga",
        "nameEN": "Teatro Arriaga",
        "cat": "cultura",
        "lat": 43.2594,
        "lng": -2.9247,
        "short": "Un magnifico teatro neo-barocco dedicato al \"Mozart spagnolo\".",
        "shortEN": "A magnificent neo-baroque theater dedicated to the \"Spanish Mozart\".",
        "desc": "Il Teatro Arriaga è un elegante teatro dell'opera in stile neo-barocco situato lungo le rive del fiume Nervión. Inaugurato nel 1890, è intitolato al compositore basco Juan Crisóstomo de Arriaga, noto come il \"Mozart spagnolo\". La sua facciata imponente e gli interni lussuosi lo rendono uno degli edifici più iconici della città. Ospita regolarmente spettacoli teatrali, opere e concerti di alto livello.",
        "descEN": "The Arriaga Theatre is an elegant neo-baroque opera house located along the banks of the Nervión River. Opened in 1890, it is named after the Basque composer Juan Crisóstomo de Arriaga, known as the \"Spanish Mozart\". Its imposing facade and luxurious interiors make it one of the city's most iconic buildings. It regularly hosts high-level theatrical performances, operas, and concerts.",
        "tips": "È possibile partecipare a visite guidate nei fine settimana.",
        "tipsEN": "Guided tours are available on weekends.",
        "src": [
          "Wikipedia: Teatro Arriaga",
          "Teatro Arriaga official site"
        ],
        "maps": "https://maps.google.com/?q=43.2594,-2.9247"
      },
      {
        "id": "bil-9",
        "name": "Azkuna Zentroa",
        "nameEN": "Azkuna Zentroa",
        "cat": "cultura",
        "lat": 43.26,
        "lng": -2.9375,
        "short": "Un ex magazzino di vino trasformato in un moderno centro culturale da Philippe Starck.",
        "shortEN": "A former wine warehouse transformed into a modern cultural center by Philippe Starck.",
        "desc": "Azkuna Zentroa, precedentemente noto come Alhóndiga, è un ex magazzino di vino trasformato in un centro culturale e ricreativo all'avanguardia. Ridisegnato dal celebre designer Philippe Starck, l'edificio è famoso per le sue 43 colonne uniche che sostengono la struttura interna. Al suo interno ospita cinema, una biblioteca, spazi espositivi e una piscina con fondo di vetro visibile dal piano terra. È un perfetto esempio di rigenerazione urbana a Bilbao.",
        "descEN": "Azkuna Zentroa, formerly known as Alhóndiga, is a former wine warehouse transformed into a cutting-edge cultural and leisure center. Redesigned by renowned designer Philippe Starck, the building is famous for its 43 unique columns supporting the internal structure. Inside, it houses cinemas, a library, exhibition spaces, and a glass-bottomed swimming pool visible from the ground floor. It is a perfect example of urban regeneration in Bilbao.",
        "tips": "L'ingresso all'edificio è gratuito; non perdere la vista della piscina dal basso.",
        "tipsEN": "Entry to the building is free; don't miss the view of the swimming pool from below.",
        "src": [
          "Wikipedia: Azkuna Zentroa",
          "Azkuna Zentroa official site"
        ],
        "maps": "https://maps.google.com/?q=43.26,-2.9375"
      },
      {
        "tier": 1,
        "id": "bil-10",
        "name": "Funicular de Artxanda",
        "nameEN": "Funicular de Artxanda",
        "cat": "panorama",
        "lat": 43.2686,
        "lng": -2.9228,
        "short": "Una storica funicolare che porta al miglior punto panoramico di Bilbao.",
        "shortEN": "A historic funicular leading to the best panoramic viewpoint in Bilbao.",
        "desc": "La Funicolare di Artxanda collega il centro di Bilbao con la cima del Monte Artxanda dal 1915. Il breve viaggio offre un'esperienza storica e pittoresca. Una volta in cima, i visitatori possono godere della migliore vista panoramica sull'intera città e sulla valle circostante. L'area sommitale dispone anche di parchi, sculture e ristoranti tradizionali baschi.",
        "descEN": "The Artxanda Funicular has connected the center of Bilbao with the top of Mount Artxanda since 1915. The short journey offers a historic and picturesque experience. Once at the top, visitors can enjoy the best panoramic view of the entire city and the surrounding valley. The summit area also features parks, sculptures, and traditional Basque restaurants.",
        "tips": "Le corse partono ogni 15 minuti; puoi usare la tessera dei trasporti Barik.",
        "tipsEN": "Services run every 15 minutes; you can use the Barik transport card.",
        "src": [
          "Wikipedia: Artxanda Funicular",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2686,-2.9228"
      },
      {
        "tier": 1,
        "id": "bil-11",
        "name": "Basílica de Begoña",
        "nameEN": "Basílica de Begoña",
        "cat": "cultura",
        "lat": 43.2586,
        "lng": -2.9142,
        "short": "Un venerato santuario gotico-rinascimentale dedicato alla patrona della regione.",
        "shortEN": "A revered Gothic-Renaissance sanctuary dedicated to the region's patron saint.",
        "desc": "La Basilica di Begoña è un importante santuario dedicato alla patrona della Biscaglia, la Vergine di Begoña. Costruita nel XVI secolo, mescola elementi gotici e rinascimentali. È un luogo di profonda devozione per i marinai e i cittadini locali, che la chiamano affettuosamente \"Amatxu\" (madre). La chiesa domina la città dall'alto e offre un'atmosfera di grande spiritualità.",
        "descEN": "The Basilica of Begoña is an important sanctuary dedicated to the patron saint of Biscay, the Virgin of Begoña. Built in the 16th century, it mixes Gothic and Renaissance elements. It is a place of deep devotion for sailors and local citizens, who affectionately call her \"Amatxu\" (mother). The church overlooks the city from above and offers an atmosphere of great spirituality.",
        "tips": "Raggiungibile a piedi dal Casco Viejo tramite le scale di Mallona o con l'ascensore.",
        "tipsEN": "Accessible on foot from the Casco Viejo via the Mallona stairs or by elevator.",
        "src": [
          "Wikipedia: Basilica of Begoña",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2586,-2.9142"
      },
      {
        "id": "bil-12",
        "name": "San Mamés Stadium",
        "nameEN": "San Mamés Stadium",
        "cat": "attivita",
        "lat": 43.2642,
        "lng": -2.9493,
        "short": "Lo spettacolare stadio dell'Athletic Club, noto come \"La Cattedrale\" del calcio.",
        "shortEN": "The spectacular stadium of Athletic Club, known as \"The Cathedral\" of football.",
        "desc": "Lo stadio San Mamés è la casa dell'Athletic Club, una delle squadre di calcio più storiche e uniche della Spagna. Conosciuto come \"La Cattedrale\" del calcio spagnolo, il nuovo stadio è un capolavoro di architettura sportiva moderna. Offre un museo interattivo che racconta la filosofia unica del club, che impiega solo giocatori di origine basca. Il tour dello stadio permette di visitare gli spogliatoi, il tunnel e il campo.",
        "descEN": "The San Mamés Stadium is the home of Athletic Club, one of the most historic and unique football teams in Spain. Known as \"The Cathedral\" of Spanish football, the new stadium is a masterpiece of modern sports architecture. It offers an interactive museum that tells the unique philosophy of the club, which only employs players of Basque origin. The stadium tour allows you to visit the dressing rooms, the tunnel, and the pitch.",
        "tips": "Prenota il tour dello stadio e del museo in anticipo, specialmente nei giorni di partita.",
        "tipsEN": "Book the stadium and museum tour in advance, especially on match days.",
        "src": [
          "Wikipedia: San Mamés Stadium (2013)",
          "Athletic Club official site"
        ],
        "maps": "https://maps.google.com/?q=43.2642,-2.9493"
      },
      {
        "id": "bil-13",
        "name": "Iglesia de San Antón",
        "nameEN": "Iglesia de San Antón",
        "cat": "cultura",
        "lat": 43.2553,
        "lng": -2.9236,
        "short": "Una storica chiesa gotica situata lungo il fiume, simbolo della città.",
        "shortEN": "A historic Gothic church located along the river, a symbol of the city.",
        "desc": "La Chiesa di San Antón è un simbolo così iconico di Bilbao da essere raffigurata nello stemma della città. Situata proprio accanto al ponte omonimo e al Mercato della Ribera, fu costruita nel XV secolo in stile gotico. Le sue fondamenta poggiano sulle rovine dell'antico alcázar della città. L'interno ospita un bel retablo plateresco e resti archeologici visibili.",
        "descEN": "The Church of San Antón is such an iconic symbol of Bilbao that it is depicted on the city's coat of arms. Located right next to the bridge of the same name and the Ribera Market, it was built in the 15th century in the Gothic style. Its foundations rest on the ruins of the city's ancient alcázar. The interior houses a beautiful Plateresque altarpiece and visible archaeological remains.",
        "tips": "L'ingresso è spesso incluso nel biglietto della Cattedrale di Santiago.",
        "tipsEN": "Entry is often included with the ticket for Santiago Cathedral.",
        "src": [
          "Wikipedia: Church of San Antón, Bilbao",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2553,-2.9236"
      },
      {
        "id": "bil-14",
        "name": "Puente de La Salve",
        "nameEN": "Puente de La Salve",
        "cat": "panorama",
        "lat": 43.2689,
        "lng": -2.9328,
        "short": "Un ponte iconico con un arco rosso che offre viste spettacolari sul Guggenheim.",
        "shortEN": "An iconic bridge with a red arch offering spectacular views of the Guggenheim.",
        "desc": "Il Ponte de La Salve è una struttura iconica che attraversa il fiume Nervión, integrandosi perfettamente con il Museo Guggenheim. Costruito originariamente negli anni '70, è stato arricchito nel 2007 da un grande arco rosso progettato dall'artista francese Daniel Buren. Il ponte offre una delle viste più spettacolari e fotografate del museo e del lungofiume. È un punto di passaggio pedonale molto frequentato.",
        "descEN": "The La Salve Bridge is an iconic structure that crosses the Nervión River, integrating perfectly with the Guggenheim Museum. Originally built in the 1970s, it was enhanced in 2007 by a large red arch designed by French artist Daniel Buren. The bridge offers one of the most spectacular and photographed views of the museum and the riverfront. It is a highly frequented pedestrian crossing point.",
        "tips": "Usa gli ascensori gratuiti per salire sul ponte dal livello del fiume.",
        "tipsEN": "Use the free elevators to get up to the bridge from the river level.",
        "src": [
          "Wikipedia: Puente de La Salve",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2689,-2.9328"
      },
      {
        "id": "bil-15",
        "name": "Euskal Museoa",
        "nameEN": "Euskal Museoa",
        "cat": "cultura",
        "lat": 43.2583,
        "lng": -2.9225,
        "short": "Un museo dedicato alla ricca storia, cultura e tradizioni del popolo basco.",
        "shortEN": "A museum dedicated to the rich history, culture, and traditions of the Basque people.",
        "desc": "Il Museo Basco, situato in un ex collegio gesuita del XVII secolo nel Casco Viejo, è il luogo ideale per comprendere la cultura e la storia dei Paesi Baschi. Le sue esposizioni coprono l'etnografia, la storia marittima, l'artigianato e le tradizioni locali. Il chiostro centrale ospita il misterioso \"Idolo di Mikeldi\", una scultura in pietra di origine pre-romana. È una visita essenziale per chi vuole approfondire l'identità basca.",
        "descEN": "The Basque Museum, located in a former 17th-century Jesuit college in the Casco Viejo, is the ideal place to understand the culture and history of the Basque Country. Its exhibits cover ethnography, maritime history, crafts, and local traditions. The central cloister houses the mysterious \"Mikeldi Idol\", a stone sculpture of pre-Roman origin. It is an essential visit for those wanting to delve into Basque identity.",
        "tips": "Controlla gli orari di apertura poiché il museo è stato recentemente in fase di ristrutturazione.",
        "tipsEN": "Check opening hours as the museum has recently been undergoing renovations.",
        "src": [
          "Wikipedia: Basque Museum (Bilbao)",
          "Euskal Museoa official site"
        ],
        "maps": "https://maps.google.com/?q=43.2583,-2.9225"
      },
      {
        "id": "bil-16",
        "name": "Palacio Chávarri",
        "nameEN": "Palacio Chávarri",
        "cat": "cultura",
        "lat": 43.2631,
        "lng": -2.9361,
        "short": "Un affascinante palazzo eclettico noto per le sue finestre tutte diverse tra loro.",
        "shortEN": "A fascinating eclectic palace known for its completely unique, asymmetrical windows.",
        "desc": "Il Palacio Chávarri è uno degli edifici più singolari ed eclettici di Bilbao, situato in Plaza Moyúa. Costruito alla fine del XIX secolo per un ricco industriale, si distingue per la sua facciata asimmetrica, dove nessuna finestra è uguale all'altra. L'architettura è fortemente influenzata dallo stile rinascimentale fiammingo. Attualmente ospita la sede della rappresentanza del governo spagnolo in Biscaglia.",
        "descEN": "The Palacio Chávarri is one of the most unique and eclectic buildings in Bilbao, located in Plaza Moyúa. Built in the late 19th century for a wealthy industrialist, it stands out for its asymmetrical facade, where no two windows are alike. The architecture is heavily influenced by the Flemish Renaissance style. It currently houses the headquarters of the Spanish government's representation in Biscay.",
        "tips": "L'edificio è chiuso al pubblico, ma la facciata merita sicuramente una foto.",
        "tipsEN": "The building is closed to the public, but the facade is definitely worth a photo.",
        "src": [
          "Wikipedia: Palacio Chávarri",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2631,-2.9361"
      },
      {
        "id": "bil-17",
        "name": "Parque Etxebarria",
        "nameEN": "Parque Etxebarria",
        "cat": "natura",
        "lat": 43.2614,
        "lng": -2.9189,
        "short": "Un grande parco collinare con viste panoramiche, sorto su un'ex area industriale.",
        "shortEN": "A large hilly park with panoramic views, built on a former industrial site.",
        "desc": "Il Parco Etxebarria è il più grande spazio verde pubblico di Bilbao, nato dalla riqualificazione di un'ex area industriale. Situato su una collina che domina il Casco Viejo, offre ampi prati, alberi e percorsi pedonali. L'unico elemento rimasto del suo passato industriale è un'alta ciminiera in mattoni, conservata come monumento. È un luogo perfetto per rilassarsi e godere di splendide viste sulla città.",
        "descEN": "Etxebarria Park is the largest public green space in Bilbao, born from the redevelopment of a former industrial area. Located on a hill overlooking the Casco Viejo, it offers wide lawns, trees, and walking paths. The only remaining element of its industrial past is a tall brick chimney, preserved as a monument. It is a perfect place to relax and enjoy beautiful views of the city.",
        "tips": "Ad agosto, il parco ospita le giostre e i fuochi d'artificio durante la Semana Grande.",
        "tipsEN": "In August, the park hosts fairground rides and fireworks during the Semana Grande.",
        "src": [
          "Wikipedia: Parque Etxebarria",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2614,-2.9189"
      },
      {
        "id": "bil-18",
        "name": "Ayuntamiento de Bilbao",
        "nameEN": "Ayuntamiento de Bilbao",
        "cat": "cultura",
        "lat": 43.2636,
        "lng": -2.9233,
        "short": "L'elegante municipio cittadino, famoso per il suo spettacolare Salone Arabo interno.",
        "shortEN": "The elegant city hall, famous for its spectacular internal Arab Hall.",
        "desc": "Il Municipio di Bilbao è un magnifico edificio inaugurato nel 1892, situato lungo l'estuario del Nervión. Progettato dall'architetto Joaquín Rucoba, presenta un'elegante facciata in stile eclettico con influenze classiche francesi. L'interno è famoso per il suo lussuoso Salone Arabo, decorato con dettagli intricati in stile neo-mudéjar. L'edificio rappresenta la prosperità economica della città alla fine del XIX secolo.",
        "descEN": "Bilbao City Hall is a magnificent building inaugurated in 1892, located along the Nervión estuary. Designed by architect Joaquín Rucoba, it features an elegant eclectic facade with French classical influences. The interior is famous for its luxurious Arab Hall, decorated with intricate neo-Mudéjar details. The building represents the city's economic prosperity at the end of the 19th century.",
        "tips": "Le visite guidate gratuite sono disponibili su prenotazione tramite il sito web del comune.",
        "tipsEN": "Free guided tours are available by reservation through the city council's website.",
        "src": [
          "Wikipedia: Bilbao City Hall",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2636,-2.9233"
      },
      {
        "id": "bil-19",
        "name": "Estación de Abando Indalecio Prieto",
        "nameEN": "Estación de Abando Indalecio Prieto",
        "cat": "cultura",
        "lat": 43.2608,
        "lng": -2.9275,
        "short": "La stazione centrale, celebre per la sua monumentale vetrata che racconta la storia basca.",
        "shortEN": "The central station, famous for its monumental stained glass window depicting Basque history.",
        "desc": "La Stazione di Abando è la principale stazione ferroviaria di Bilbao e un importante punto di riferimento architettonico. La sua caratteristica più sorprendente è l'immensa vetrata policroma situata nell'atrio principale. Questa magnifica opera d'arte illustra la storia, l'industria, l'agricoltura e le tradizioni sportive della società basca. Anche se non devi prendere un treno, vale la pena entrare per ammirare questa vetrata.",
        "descEN": "Abando Station is the main railway station in Bilbao and an important architectural landmark. Its most striking feature is the immense polychrome stained glass window located in the main concourse. This magnificent work of art illustrates the history, industry, agriculture, and sporting traditions of Basque society. Even if you don't have to catch a train, it is worth entering to admire this window.",
        "tips": "La vetrata si trova al piano superiore, facilmente accessibile dalle scale mobili.",
        "tipsEN": "The stained glass window is located on the upper floor, easily accessible by escalators.",
        "src": [
          "Wikipedia: Bilbao-Abando railway station",
          "Bilbao Turismo"
        ],
        "maps": "https://maps.google.com/?q=43.2608,-2.9275"
      },
      {
        "id": "bil-20",
        "name": "Museo Marítimo Ría de Bilbao",
        "nameEN": "Museo Marítimo Ría de Bilbao",
        "cat": "cultura",
        "lat": 43.2669,
        "lng": -2.9467,
        "short": "Un museo interattivo che esplora il ricco patrimonio marittimo e industriale di Bilbao.",
        "shortEN": "An interactive museum exploring Bilbao's rich maritime and industrial heritage.",
        "desc": "L'Itsasmuseum, o Museo Marittimo di Bilbao, celebra la profonda connessione della città con il mare e la costruzione navale. Situato negli ex cantieri navali Euskalduna, espone modelli di navi, strumenti di navigazione e imbarcazioni storiche restaurate nei bacini di carenaggio esterni. L'iconica gru rossa \"Carola\", alta 60 metri, si erge all'esterno come simbolo del passato industriale della ría. È un'esperienza affascinante per comprendere lo sviluppo di Bilbao.",
        "descEN": "The Itsasmuseum, or Bilbao Maritime Museum, celebrates the city's deep connection with the sea and shipbuilding. Located in the former Euskalduna shipyards, it exhibits ship models, navigational instruments, and restored historic vessels in the outdoor dry docks. The iconic 60-meter-tall red \"Carola\" crane stands outside as a symbol of the estuary's industrial past. It is a fascinating experience to understand Bilbao's development.",
        "tips": "L'ingresso è gratuito il martedì; l'area esterna con le navi è sempre visibile.",
        "tipsEN": "Entry is free on Tuesdays; the outdoor area with the ships is always visible.",
        "src": [
          "Wikipedia: Bilbao Maritime Museum",
          "Itsasmuseum official site"
        ],
        "maps": "https://maps.google.com/?q=43.2669,-2.9467"
      }
    ]
  },
  "leon": {
    "city": "León",
    "cityEN": "León",
    "country": "Spagna",
    "countryEN": "Spain",
    "flag": "🇪🇸",
    "intro": "Antica capitale del Regno di León e tappa fondamentale del Cammino di Santiago, León è una città castigliana di pietra dorata, ricca di arte romanica, gotica e modernista. Il suo centro storico, piccolo e quasi interamente pedonale, racchiude la celebre cattedrale gotica soprannominata la \"Casa della Luce\", la Casa Botines di Gaudí, la basilica di San Isidoro con i suoi affreschi medievali e l'animato Barrio Húmedo, cuore della vita gastronomica e delle tapas.",
    "introEN": "Former capital of the Kingdom of León and a key stage on the Camino de Santiago, León is a Castilian city of golden stone, rich in Romanesque, Gothic and Art Nouveau heritage. Its small, almost entirely pedestrian old town holds the famous Gothic cathedral nicknamed the \"House of Light\", Gaudí's Casa Botines, the Basilica of San Isidoro with its medieval frescoes, and the lively Barrio Húmedo, the beating heart of the city's tapas and nightlife.",
    "center": [
      42.5987,
      -5.5671
    ],
    "zoom": 15,
    "stops": [
      {
        "name": "Cattedrale di León (Santa María)",
        "nameEN": "León Cathedral (Santa María)",
        "cat": "cultura",
        "lat": 42.599,
        "lng": -5.5664,
        "short": "Capolavoro gotico soprannominato la \"Casa della Luce\" per le sue 1.800 m² di vetrate medievali.",
        "shortEN": "Gothic masterpiece nicknamed the \"House of Light\" for its 1,800 m² of medieval stained glass.",
        "desc": "La Cattedrale di Santa María de León è uno dei templi gotici più belli di Spagna e il monumento simbolo della città. Iniziata nel 1205 e completata intorno al 1302, fu costruita sulle fondamenta di antiche terme romane e di una chiesa romanica. Due dei suoi tre principali architetti erano francesi, il che spiega la sua somiglianza con le cattedrali di Notre-Dame, Reims e Saint-Denis. La facciata presenta due torri di altezze diverse (65 e 68 metri) separate dal corpo centrale e un magnifico rosone policromo. L'elemento più straordinario sono però le sue 125 vetrate che coprono circa 1.800 metri quadrati: insieme alla pietra chiara delle pareti, lasciano filtrare la luce creando un effetto luminoso che le è valso il soprannome di \"Casa della Luce\". All'interno si trovano il coro ligineo più antico di Spagna (XV secolo) e la pala d'altare dedicata a San Froilán.",
        "descEN": "Santa María de León Cathedral is one of the most beautiful Gothic churches in Spain and the city's emblematic monument. Begun in 1205 and completed around 1302, it was built on the foundations of ancient Roman baths and a Romanesque church. Two of its three main architects were French, which explains its resemblance to the cathedrals of Notre-Dame, Reims and Saint-Denis. The façade features two towers of different heights (65 and 68 metres) separated from the central body, and a magnificent polychrome rose window. Its most extraordinary feature is its 125 stained-glass windows covering roughly 1,800 square metres: together with the pale stone walls, they let light flood in, earning it the nickname \"House of Light\". Inside are the oldest wooden choir stalls in Spain (15th century) and the altarpiece dedicated to Saint Froilán.",
        "tips": "Ingresso circa 6€ (ridotti 2-4€). Generalmente chiusa 13:30-16:00. Visita il museo e il chiostro per i tesori medievali.",
        "tipsEN": "Entry about €6 (reduced €2-4). Usually closed 13:30-16:00. Visit the museum and cloister for medieval treasures.",
        "src": [
          "checkinblog.it \"León cosa vedere\"",
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.59900,-5.56640",
        "tier": 2,
        "id": "leo-1"
      },
      {
        "name": "Plaza de la Regla",
        "nameEN": "Plaza de la Regla",
        "cat": "cultura",
        "lat": 42.5994,
        "lng": -5.567,
        "short": "La piazza dominata dalla cattedrale, con l'Antigua Casa de Correos e il Palacio Episcopal.",
        "shortEN": "The square dominated by the cathedral, with the old Post Office and the Episcopal Palace.",
        "desc": "La Plaza de la Regla è lo spazio aperto da cui si ammira nella sua interezza la facciata della Cattedrale di León, ed è quindi il punto migliore per coglierne la maestosità gotica. Oltre alla cattedrale, sulla piazza si affacciano altri edifici di rilievo: l'Antigua Casa de Correos y Telégrafos (il vecchio ufficio postale), facilmente riconoscibile per la sua torre che ricorda quella di un castello, e il Palacio Episcopal sul lato opposto. La piazza è un luogo di sosta abituale per i pellegrini del Cammino di Santiago e per i turisti che fotografano la cattedrale e l'iconica scritta \"León\" posta nelle vicinanze. È un punto di partenza naturale per esplorare il centro storico lungo la Calle Ancha.",
        "descEN": "Plaza de la Regla is the open space from which you can admire the full façade of León Cathedral, and it is therefore the best spot to take in its Gothic grandeur. Besides the cathedral, the square is overlooked by other notable buildings: the Antigua Casa de Correos y Telégrafos (the old post office), easily recognised by its castle-like tower, and the Episcopal Palace on the opposite side. The square is a regular resting place for Camino de Santiago pilgrims and for tourists photographing the cathedral and the iconic \"León\" sign nearby. It is a natural starting point for exploring the old town along Calle Ancha.",
        "tips": "Punto panoramico ideale per fotografare la cattedrale. Spazio pedonale, accessibile sempre.",
        "tipsEN": "Ideal viewpoint for photographing the cathedral. Pedestrian space, always accessible.",
        "src": [
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.59940,-5.56700",
        "id": "leo-2"
      },
      {
        "name": "Calle Ancha",
        "nameEN": "Calle Ancha",
        "cat": "cultura",
        "lat": 42.5982,
        "lng": -5.5688,
        "short": "La principale via pedonale del centro storico, fra negozi storici e palazzi modernisti.",
        "shortEN": "The main pedestrian street of the old town, lined with historic shops and Art Nouveau buildings.",
        "desc": "La Calle Ancha è l'arteria principale del centro storico di León e collega la Plaza de Santo Domingo alla Plaza de la Regla, davanti alla cattedrale. Completamente pedonale, è il cuore pulsante della vita quotidiana di abitanti e visitatori: vi si trovano negozi e locali di piccole dimensioni, molti dei quali in attività da oltre mezzo secolo, oltre a bar e caffè. Lungo la via, pannelli informativi segnalano i punti in cui sorgevano le porte e le strutture romane dell'antica Legio. Alzando lo sguardo si scoprono splendidi palazzi modernisti dei primi del Novecento, testimonianza della prosperità della città in quell'epoca. Percorrerla è il modo migliore per entrare nell'atmosfera di León.",
        "descEN": "Calle Ancha is the main artery of León's old town, connecting Plaza de Santo Domingo to Plaza de la Regla in front of the cathedral. Entirely pedestrian, it is the beating heart of daily life for locals and visitors alike: it is lined with small shops and businesses, many of which have been operating for over half a century, as well as bars and cafés. Along the street, information panels mark where the gates and Roman structures of the ancient Legio once stood. Looking up, you discover beautiful early-20th-century Art Nouveau buildings, evidence of the city's prosperity in that era. Walking it is the best way to soak up León's atmosphere.",
        "tips": "Via pedonale; ottima per shopping e tapas. Collega i principali monumenti del centro.",
        "tipsEN": "Pedestrian street; great for shopping and tapas. Connects the main downtown landmarks.",
        "src": [
          "checkinblog.it \"León cosa vedere\"",
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.59820,-5.56880",
        "id": "leo-3"
      },
      {
        "name": "Casa Botines (Gaudí)",
        "nameEN": "Casa Botines (Gaudí)",
        "cat": "cultura",
        "lat": 42.5972,
        "lng": -5.5699,
        "short": "Palazzo neogotico di Antoni Gaudí, una delle sue rare opere fuori dalla Catalogna, oggi museo.",
        "shortEN": "Neo-Gothic palace by Antoni Gaudí, one of his rare works outside Catalonia, now a museum.",
        "desc": "La Casa Botines è uno dei monumenti più celebri di León e una delle sole tre opere realizzate da Antoni Gaudí fuori dalla Catalogna. Progettata tra il 1891 e il 1893 per i commercianti Fernández e Andrés, è un edificio in pietra dall'aspetto di fortezza medievale, con torrette laterali ai quattro angoli, un fossato che illumina il piano seminterrato e finestre che si ispirano alle vetrate della vicina cattedrale. Sulla facciata principale spicca la scultura di San Giorgio che uccide il drago. L'edificio servì a lungo come sede bancaria e oggi ospita un museo dedicato a Gaudí, con la ricostruzione del negozio ottocentesco di tessuti, una collezione di dipinti dei secoli XIX-XX (tra cui la \"Divina Commedia\" illustrata da Dalí) e l'accesso alla torretta originale del 1893.",
        "descEN": "Casa Botines is one of León's most famous monuments and one of only three works Antoni Gaudí built outside Catalonia. Designed between 1891 and 1893 for the merchants Fernández and Andrés, it is a stone building resembling a medieval fortress, with corner turrets, a moat that lights the basement, and windows inspired by the stained glass of the nearby cathedral. The main façade is crowned by a sculpture of Saint George slaying the dragon. The building long served as a bank and today houses a museum dedicated to Gaudí, with a reconstruction of the 19th-century textile shop, a collection of 19th-20th century paintings (including Dalí's illustrated \"Divine Comedy\") and access to the original 1893 turret.",
        "tips": "Visite guidate in inglese/spagnolo. Controlla orari e biglietti su casabotines.es.",
        "tipsEN": "Guided tours in English/Spanish. Check times and tickets at casabotines.es.",
        "src": [
          "leon.es \"Casa Botines\"",
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.59720,-5.56990",
        "tier": 2,
        "id": "leo-4"
      },
      {
        "name": "Palacio de los Guzmanes",
        "nameEN": "Palacio de los Guzmanes",
        "cat": "cultura",
        "lat": 42.5974,
        "lng": -5.5703,
        "short": "Elegante palazzo rinascimentale del XVI secolo, oggi sede della Diputación provinciale.",
        "shortEN": "Elegant 16th-century Renaissance palace, today seat of the provincial government.",
        "desc": "Adiacente alla Casa Botines, in Plaza de San Marcelo, sorge il Palacio de los Guzmanes, un palazzo rinascimentale appartenuto alla nobile famiglia locale dei Guzmán. I lavori iniziarono intorno al 1560 e si conclusero nel secolo XVII. L'edificio presenta una facciata sobria ed elegante, un bel cortile interno porticato e una torre angolare. Oggi è la sede della Diputación de León (il governo provinciale) e in alcune occasioni è visitabile all'interno. Nei giardini affacciati sulla strada si trova un plastico di León che illustra le fasi del suo sviluppo urbano, dall'accampamento romano della Legio VII Gemina fino a oggi, con le mura romane e quelle medievali del XIV secolo chiaramente riconoscibili. Insieme alla Casa Botines forma uno degli angoli più fotografati della città.",
        "descEN": "Next to Casa Botines, on Plaza de San Marcelo, stands the Palacio de los Guzmanes, a Renaissance palace that belonged to the local noble Guzmán family. Construction began around 1560 and was completed in the 17th century. The building has a sober, elegant façade, a fine arcaded inner courtyard and a corner tower. Today it is the seat of the Diputación de León (the provincial government) and can occasionally be visited inside. In the street-facing gardens there is a scale model of León illustrating the stages of its urban development, from the Roman camp of Legio VII Gemina to the present day, with the Roman walls and the 14th-century medieval walls clearly visible. Together with Casa Botines it forms one of the most photographed corners of the city.",
        "tips": "Cortile e interni visitabili in determinati orari/eventi. Esterno sempre ammirabile.",
        "tipsEN": "Courtyard and interiors open at set times/events. Exterior always admirable.",
        "src": [
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.59740,-5.57030",
        "id": "leo-5"
      },
      {
        "name": "Plaza de San Marcelo & Ayuntamiento",
        "nameEN": "Plaza de San Marcelo & City Hall",
        "cat": "cultura",
        "lat": 42.5969,
        "lng": -5.5701,
        "short": "Piazza centrale con la chiesa di San Marcelo e l'antico municipio rinascimentale (Casa de Poridad).",
        "shortEN": "Central square with San Marcelo church and the old Renaissance town hall (Casa de Poridad).",
        "desc": "La Plaza de San Marcelo è uno dei nodi nevralgici del centro di León, punto d'incontro tra la Calle Ancha, la Casa Botines e il Palacio de los Guzmanes. Sulla piazza si affaccia la chiesa di San Marcelo, dedicata al patrono militare della città, ricostruita tra il XVI e il XVII secolo con una facciata sobria di gusto classicista. Di fronte si trova l'antico municipio, noto come Casa de Poridad o Ayuntamiento Viejo, un grazioso edificio rinascimentale del XVI secolo con balconi e stemmi. La piazza, animata e centrale, è un ottimo punto per orientarsi e per iniziare o concludere una passeggiata nel cuore storico della città.",
        "descEN": "Plaza de San Marcelo is one of the nerve centres of León's downtown, a meeting point between Calle Ancha, Casa Botines and the Palacio de los Guzmanes. The square is overlooked by the church of San Marcelo, dedicated to the city's military patron, rebuilt in the 16th-17th centuries with a sober classicist façade. Opposite stands the old town hall, known as the Casa de Poridad or Ayuntamiento Viejo, a charming 16th-century Renaissance building with balconies and coats of arms. Lively and central, the square is a great place to get your bearings and to begin or end a stroll through the city's historic heart.",
        "tips": "Punto centrale di passaggio. Bar e caffè nei dintorni per una sosta.",
        "tipsEN": "Central thoroughfare. Bars and cafés nearby for a break.",
        "src": [
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.59690,-5.57010",
        "id": "leo-6"
      },
      {
        "name": "Basílica de San Isidoro",
        "nameEN": "Basilica of San Isidoro",
        "cat": "cultura",
        "lat": 42.6004,
        "lng": -5.5715,
        "short": "Gioiello romanico con la \"Cappella Sistina del romanico\": il Panteón Real affrescato.",
        "shortEN": "Romanesque jewel with the \"Sistine Chapel of the Romanesque\": the frescoed Royal Pantheon.",
        "desc": "La Real Colegiata Basílica de San Isidoro è uno dei massimi capolavori dell'arte romanica in Spagna. Costruita a partire dal X-XI secolo, custodisce le reliquie di Sant'Isidoro di Siviglia, importante erudito cristiano, traslate qui nel 1063. La basilica conserva moltissima arte medievale, cripte, una biblioteca storica e soprattutto il celebre Panteón Real, il pantheon dei re di León, i cui soffitti sono interamente ricoperti da affreschi romanici del XII secolo di straordinaria vivacità cromatica, tanto da essere soprannominato la \"Cappella Sistina del romanico\". All'esterno, la piazza è impreziosita da fontane e statue, e nelle vicinanze si possono ammirare tratti delle antiche mura romane, alcune risalenti al III secolo.",
        "descEN": "The Royal Collegiate Basilica of San Isidoro is one of the supreme masterpieces of Romanesque art in Spain. Built from the 10th-11th centuries, it holds the relics of Saint Isidore of Seville, an important Christian scholar, brought here in 1063. The basilica preserves a great deal of medieval art, crypts, a historic library and, above all, the famous Royal Pantheon, the pantheon of the kings of León, whose ceilings are entirely covered with strikingly colourful 12th-century Romanesque frescoes, earning it the nickname the \"Sistine Chapel of the Romanesque\". Outside, the square is adorned with fountains and statues, and nearby you can admire sections of the ancient Roman walls, some dating from the 3rd century.",
        "tips": "Il Panteón Real si visita con biglietto del museo. Da non perdere gli affreschi sui soffitti.",
        "tipsEN": "The Royal Pantheon is visited with a museum ticket. Don't miss the ceiling frescoes.",
        "src": [
          "mappingspain.com \"Walking tour of León\"",
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.60040,-5.57150",
        "tier": 2,
        "id": "leo-7"
      },
      {
        "name": "Mura Romane di León",
        "nameEN": "Roman Walls of León",
        "cat": "cultura",
        "lat": 42.6009,
        "lng": -5.5705,
        "short": "Resti delle mura dell'accampamento romano della Legio VII, alcune del III secolo.",
        "shortEN": "Remains of the walls of the Roman camp of Legio VII, some dating from the 3rd century.",
        "desc": "León nacque come accampamento militare romano della Legio VII Gemina, fondata nel I secolo d.C., e conserva ancora oggi notevoli tratti delle sue mura difensive. I resti più antichi e imponenti si trovano nei pressi della basilica di San Isidoro, dove si possono osservare poderosi muraglioni in pietra, alcuni risalenti al III secolo, costruiti per proteggere l'antica città. Altre porzioni di mura, rimaneggiate in epoca medievale, sono visibili in diversi punti del centro storico. Camminare lungo questi resti permette di leggere la stratificazione storica di León, dalla sua origine romana all'espansione medievale del XIV secolo. È un'esperienza affascinante per chi vuole comprendere come la città si sia sviluppata nei secoli.",
        "descEN": "León was born as the Roman military camp of Legio VII Gemina, founded in the 1st century AD, and still preserves remarkable sections of its defensive walls today. The oldest and most impressive remains are found near the Basilica of San Isidoro, where you can see mighty stone ramparts, some dating from the 3rd century, built to protect the ancient city. Other stretches of wall, reworked in the medieval period, are visible at various points in the old town. Walking along these remains lets you read León's historical layering, from its Roman origins to its 14th-century medieval expansion. It is a fascinating experience for anyone wanting to understand how the city developed over the centuries.",
        "tips": "Visibili gratuitamente lungo la strada, soprattutto dietro San Isidoro. Sempre accessibili.",
        "tipsEN": "Free to view along the street, especially behind San Isidoro. Always accessible.",
        "src": [
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.60090,-5.57050",
        "tier": 1,
        "id": "leo-8"
      },
      {
        "name": "Convento / Parador de San Marcos",
        "nameEN": "Convent / Parador de San Marcos",
        "cat": "cultura",
        "lat": 42.6024,
        "lng": -5.579,
        "short": "Spettacolare facciata plateresca del Rinascimento spagnolo, oggi lussuoso hotel Parador.",
        "shortEN": "Spectacular Plateresque façade of the Spanish Renaissance, now a luxury Parador hotel.",
        "desc": "L'antico convento di San Marcos è uno degli edifici più belli e celebri di León, considerato uno dei monumenti più rappresentativi del Rinascimento spagnolo. Donato da Ferdinando il Cattolico alla città, il complesso è composto dal convento vero e proprio, oggi trasformato in un lussuoso hotel Parador a cinque stelle, da una chiesa consacrata nel 1541 e da un affascinante museo archeologico. La sua immensa facciata plateresca, lunga e finemente decorata con medaglioni, conchiglie e dettagli scultorei, è uno dei capolavori dello stile. Davanti all'edificio si apre un'ampia piazza con la celebre scultura del pellegrino stanco, simbolo del Cammino di Santiago, che rende questo luogo una tappa imperdibile per i viaggiatori.",
        "descEN": "The former convent of San Marcos is one of León's most beautiful and famous buildings, regarded as one of the most representative monuments of the Spanish Renaissance. Given by Ferdinand the Catholic to the city, the complex comprises the convent itself, now converted into a luxury five-star Parador hotel, a church consecrated in 1541, and a fascinating archaeological museum. Its immense Plateresque façade, long and finely decorated with medallions, shells and sculptural detail, is one of the masterpieces of the style. In front of the building lies a wide square with the famous sculpture of the weary pilgrim, a symbol of the Camino de Santiago, making this a must-see stop for travellers.",
        "tips": "Si può entrare nella hall del Parador e visitare la chiesa/museo. Bella la piazza con il pellegrino.",
        "tipsEN": "You can step into the Parador lobby and visit the church/museum. Lovely square with the pilgrim statue.",
        "src": [
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.60240,-5.57900",
        "tier": 1,
        "id": "leo-9"
      },
      {
        "name": "Plaza Mayor",
        "nameEN": "Plaza Mayor",
        "cat": "cultura",
        "lat": 42.5965,
        "lng": -5.568,
        "short": "Una delle piazze più antiche di Spagna, porticata, con mercato il mercoledì e il sabato.",
        "shortEN": "One of the oldest squares in Spain, arcaded, with a market on Wednesdays and Saturdays.",
        "desc": "A pochi minuti dalla cattedrale, la Plaza Mayor di León è una delle piazze maggiori più antiche di Spagna ed era il cuore commerciale della città nel Medioevo. Interamente porticata, è circondata da edifici tradizionali con balconi e ospita numerosi bar e ristoranti sotto i suoi loggiati. Ancora oggi, ogni mercoledì e sabato vi si tiene un mercato di prodotti agricoli, mantenendo viva la sua funzione storica. L'edificio più bello della piazza è il Consistorio (detto anche edificio del Mirador), una graziosa costruzione barocca con due torri che fungeva da balconata per le autorità durante le feste cittadine. La Plaza Mayor è il punto d'accesso al Barrio Húmedo ed è uno dei luoghi più caratteristici e vivaci di León.",
        "descEN": "A few minutes from the cathedral, León's Plaza Mayor is one of the oldest main squares in Spain and was the city's commercial heart in the Middle Ages. Fully arcaded, it is surrounded by traditional balconied buildings and hosts numerous bars and restaurants under its porticoes. Even today, a farmers' market is held here every Wednesday and Saturday, keeping its historic function alive. The square's finest building is the Consistorio (also called the Mirador building), a charming Baroque structure with two towers that served as a balcony for the authorities during city festivities. Plaza Mayor is the gateway to the Barrio Húmedo and one of the most characteristic and lively spots in León.",
        "tips": "Mercato mercoledì e sabato mattina. Ottima per tapas serali; porta d'ingresso al Barrio Húmedo.",
        "tipsEN": "Market on Wednesday and Saturday mornings. Great for evening tapas; gateway to the Barrio Húmedo.",
        "src": [
          "mappingspain.com \"Walking tour of León\"",
          "checkinblog.it \"León cosa vedere\""
        ],
        "maps": "https://maps.google.com/?q=42.59650,-5.56800",
        "tier": 1,
        "id": "leo-10"
      },
      {
        "name": "Barrio Húmedo",
        "nameEN": "Barrio Húmedo",
        "cat": "cibo",
        "lat": 42.5972,
        "lng": -5.5675,
        "short": "Il quartiere medievale delle tapas: vicoli pittoreschi pieni di bar dove la tapa è gratis.",
        "shortEN": "The medieval tapas quarter: picturesque alleys full of bars where the tapa is free.",
        "desc": "Il Barrio Húmedo (\"quartiere umido\", così chiamato per l'abbondanza di bar e vino) è l'anima della León medievale e il centro indiscusso della sua celebre vita gastronomica. Si concentra nei vicoli pittoreschi attorno alla Plaza de San Martín, a meno di cinque minuti dalla Plaza Mayor. Le sue stradine acciottolate sono fittamente costellate di bar e taverne, e León è famosa per una tradizione molto amata: ordinando una consumazione (un vino o una birra) si riceve gratuitamente una tapa, spesso abbondante e creativa. Vivacissimo soprattutto la sera e nei weekend, il quartiere è il luogo ideale per vivere il \"tapeo\" leonese, spostandosi di bar in bar tra atmosfere autentiche e affollate. È un'esperienza imperdibile per comprendere la cultura sociale e culinaria della città.",
        "descEN": "The Barrio Húmedo (\"wet quarter\", so called for its abundance of bars and wine) is the soul of medieval León and the undisputed centre of its famous food scene. It is concentrated in the picturesque alleys around Plaza de San Martín, less than five minutes from Plaza Mayor. Its cobbled lanes are densely packed with bars and taverns, and León is famous for a much-loved tradition: when you order a drink (a wine or a beer) you receive a free tapa, often generous and creative. Buzzing especially in the evenings and at weekends, the quarter is the ideal place to experience León's \"tapeo\", hopping from bar to bar amid authentic, crowded atmospheres. It is a must for understanding the city's social and culinary culture.",
        "tips": "Vivo soprattutto la sera. Ordina un vino e ricevi una tapa gratis; gira più bar per provarne tante.",
        "tipsEN": "Liveliest in the evening. Order a wine and get a free tapa; hop between bars to try many.",
        "src": [
          "checkinblog.it \"León cosa vedere\"",
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.59720,-5.56750",
        "tier": 1,
        "id": "leo-11"
      },
      {
        "name": "Plaza del Grano (Santa María del Camino)",
        "nameEN": "Plaza del Grano (Santa María del Camino)",
        "cat": "panorama",
        "lat": 42.5955,
        "lng": -5.5688,
        "short": "Pittoresca piazza acciottolata del 1789, con fontana e portici: una delle più amate della città.",
        "shortEN": "Picturesque 1789 cobblestone square with a fountain and arcades: one of the city's most beloved.",
        "desc": "La Plaza del Grano, ufficialmente Plaza de Santa María del Camino, è uno degli angoli più suggestivi e amati di León. Anticamente sede del mercato del grano, conserva un fascino antico e quasi rurale che la distingue dalle altre piazze cittadine: il suo selciato è fatto di ciottoli irregolari, è circondata da case porticate basse e tradizionali, e al centro si trova una graziosa fontana. Sulla piazza si affaccia la chiesa romanica di Nuestra Señora del Mercado (Santa María del Camino). L'atmosfera raccolta e autentica del luogo lo rende perfetto per una sosta tranquilla, lontano dalla folla, magari per un drink o un caffè. È spesso citata come una delle piazze più belle e fotogeniche della città.",
        "descEN": "Plaza del Grano, officially Plaza de Santa María del Camino, is one of the most charming and beloved corners of León. Formerly the site of the grain market, it retains an old, almost rural charm that sets it apart from the city's other squares: its surface is made of irregular cobblestones, it is surrounded by low, traditional arcaded houses, and a graceful fountain stands at its centre. The square is overlooked by the Romanesque church of Nuestra Señora del Mercado (Santa María del Camino). Its intimate, authentic atmosphere makes it perfect for a quiet stop away from the crowds, perhaps for a drink or a coffee. It is often cited as one of the most beautiful and photogenic squares in the city.",
        "tips": "Angolo tranquillo e fotogenico. Bei tavolini all'aperto per una pausa lontano dalla folla.",
        "tipsEN": "Quiet, photogenic corner. Nice outdoor tables for a break away from the crowds.",
        "src": [
          "mappingspain.com \"Walking tour of León\""
        ],
        "maps": "https://maps.google.com/?q=42.59550,-5.56880",
        "id": "leo-12"
      }
    ]
  },
  "palencia": {
    "city": "Palencia",
    "cityEN": "Palencia",
    "country": "Spagna",
    "countryEN": "Spain",
    "flag": "🇪🇸",
    "intro": "Scopri Palencia, una gemma nascosta della Spagna, con questo itinerario a piedi. Esplora la sua maestosa cattedrale, le piazze storiche e i parchi incantevoli in mezza giornata.",
    "introEN": "Discover Palencia, a hidden gem of Spain, with this walking itinerary. Explore its majestic cathedral, historic squares, and charming parks in a half-day.",
    "center": [
      42.0133,
      -4.5313
    ],
    "zoom": 14,
    "stops": [
      {
        "tier": 2,
        "id": "pal-1",
        "name": "Cristo del Otero",
        "nameEN": "Christ of the Knoll",
        "cat": "cultura",
        "lat": 42.02833,
        "lng": -4.52944,
        "short": "Ammira una delle statue di Cristo più alte del mondo che domina la città.",
        "shortEN": "Admire one of the tallest Christ statues in the world overlooking the city.",
        "desc": "Il Cristo del Otero è un'imponente scultura alta 20 metri, simbolo della città di Palencia. Realizzata dallo scultore Victorio Macho, è una delle statue di Cristo più grandi al mondo. Si trova su una collina a circa 3 km dal centro, offrendo viste panoramiche spettacolari. È possibile raggiungere quasi la cima in auto o a piedi.",
        "descEN": "The Cristo del Otero is an impressive 20-meter-high sculpture and a symbol of the city of Palencia. Created by the sculptor Victorio Macho, it is one of the largest Christ statues in the world. It is located on a hill about 3 km from the center, offering spectacular panoramic views. You can reach almost the top by car or on foot.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Cristo del Otero",
          "Tripadvisor: Cristo del Otero"
        ],
        "maps": "https://maps.google.com/?q=42.02833,-4.52944"
      },
      {
        "tier": 2,
        "id": "pal-2",
        "name": "Cattedrale di Palencia",
        "nameEN": "Palencia Cathedral",
        "cat": "cultura",
        "lat": 42.01087,
        "lng": -4.53444,
        "short": "Visita la terza cattedrale più grande della Spagna, un capolavoro gotico.",
        "shortEN": "Visit the third largest cathedral in Spain, a Gothic masterpiece.",
        "desc": "La Cattedrale di San Antolín è un imponente edificio in stile gotico, la terza cattedrale più grande della Spagna per superficie. Dedicata a Sant'Antonino di Pamiers, vanta la navata centrale più lunga del paese. L'ingresso costa circa 7 euro e permette di esplorare la magnifica architettura interna ed esterna. Si trova in Plaza de la Inmaculada.",
        "descEN": "The Cathedral of San Antolín is an imposing Gothic-style building, the third largest cathedral in Spain by area. Dedicated to Saint Antoninus of Pamiers, it boasts the longest central nave in the country. Admission is around €7 and allows you to explore the magnificent interior and exterior architecture. It is located in Plaza de la Inmaculada.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Palencia Cathedral",
          "Spain.info: Palencia Cathedral"
        ],
        "maps": "https://maps.google.com/?q=42.01087,-4.53444"
      },
      {
        "tier": 1,
        "id": "pal-3",
        "name": "Plaza Mayor",
        "nameEN": "Plaza Mayor",
        "cat": "cultura",
        "lat": 42.01071,
        "lng": -4.53273,
        "short": "Rilassati nella piazza principale della città, circondata da edifici storici.",
        "shortEN": "Relax in the city's main square, surrounded by historic buildings.",
        "desc": "La Plaza Mayor di Palencia è il cuore pulsante della città, facilmente raggiungibile da Calle Mayor. Qui si trovano il Municipio e il monumento a Berruguete. La piazza è circondata da vari ristoranti e caffè, rendendola il luogo ideale per una pausa. È un tipico esempio di piazza spagnola, perfetta per osservare la vita locale.",
        "descEN": "The Plaza Mayor of Palencia is the beating heart of the city, easily accessible from Calle Mayor. Here you will find the Town Hall and the monument to Berruguete. The square is surrounded by various restaurants and cafes, making it the ideal place for a break. It is a typical example of a Spanish square, perfect for people-watching.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Tripadvisor: Plaza Mayor de Palencia",
          "Mapcarta: Plaza Mayor of Palencia"
        ],
        "maps": "https://maps.google.com/?q=42.01071,-4.53273"
      },
      {
        "id": "pal-4",
        "name": "Mercado de Abastos",
        "nameEN": "Mercado de Abastos",
        "cat": "cibo",
        "lat": 42.01048,
        "lng": -4.53133,
        "short": "Esplora il mercato tradizionale per scoprire i prodotti locali.",
        "shortEN": "Explore the traditional market to discover local products.",
        "desc": "Il Mercado de Abastos è il mercato tradizionale di Palencia, situato in Calle Felipe Prieto, a soli 100 metri a est di Plaza Mayor. Progettato nel 1895 dall'architetto Juan Agapito y Revilla, è un luogo vivace dove acquistare prodotti freschi e locali. È un'ottima tappa per immergersi nella cultura culinaria della regione. Il mercato è aperto dal 1895 e continua a servire la comunità.",
        "descEN": "The Mercado de Abastos is the traditional market of Palencia, located on Calle Felipe Prieto, just 100 meters east of Plaza Mayor. Designed in 1895 by the architect Juan Agapito y Revilla, it is a lively place to buy fresh, local products. It is a great stop to immerse yourself in the culinary culture of the region. The market has been open since 1895 and continues to serve the community.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Mapcarta: Mercado de Abastos, Palencia",
          "Turismo de Palencia: Food Market"
        ],
        "maps": "https://maps.google.com/?q=42.01048,-4.53133"
      },
      {
        "tier": 1,
        "id": "pal-5",
        "name": "Parque del Salón de Isabel II",
        "nameEN": "Isabel II Hall Park",
        "cat": "natura",
        "lat": 42.00631,
        "lng": -4.52838,
        "short": "Passeggia in questo parco romantico del XIX secolo nel centro della città.",
        "shortEN": "Stroll through this 19th-century romantic park in the city center.",
        "desc": "Il Parque del Salón de Isabel II è un parco romantico di 30.000 metri quadrati situato nel centro di Palencia. Creato a metà del XIX secolo sul sito di un antico convento, presenta un chiosco della musica in ghisa del 1911, parterre formali e lunghi viali alberati. È il luogo perfetto per una passeggiata rilassante dopo aver esplorato la città. Si trova a pochi passi dalla piazza principale.",
        "descEN": "The Parque del Salón de Isabel II is a 30,000-square-meter romantic park located in the center of Palencia. Created in the mid-19th century on the site of a former convent, it features a 1911 cast-iron bandstand, formal parterres, and long alleys of plane trees. It is the perfect place for a relaxing stroll after exploring the city. It is located just a few steps from the main square.",
        "tips": "",
        "tipsEN": "",
        "src": [
          "Wikipedia: Salón de Isabel II",
          "Turismo de Palencia: Isabel II Hall Park"
        ],
        "maps": "https://maps.google.com/?q=42.00631,-4.52838"
      },
      {
        "tier": 1,
        "id": "pal-6",
        "name": "Iglesia de San Miguel",
        "nameEN": "Iglesia de San Miguel",
        "cat": "cultura",
        "lat": 42.007936,
        "lng": -4.53436,
        "short": "Storica chiesa con torre fortificata, legata alla leggenda del Cid.",
        "shortEN": "Historic church with a fortified tower, linked to the legend of El Cid.",
        "desc": "La Chiesa di San Miguel è uno dei templi più emblematici di Palencia, celebre per la sua imponente torre fortificata che domina il paesaggio urbano. Costruita tra l'XI e il XIII secolo, rappresenta un magnifico esempio di transizione dal romanico al gotico. La leggenda narra che qui si celebrarono le nozze tra il Cid Campeador e Doña Jimena. All'interno, i visitatori possono ammirare pregevoli opere d'arte e un'atmosfera di profonda spiritualità.",
        "descEN": "The Church of San Miguel is one of Palencia's most emblematic temples, famous for its imposing fortified tower that dominates the cityscape. Built between the 11th and 13th centuries, it represents a magnificent example of the transition from Romanesque to Gothic architecture. Legend has it that the wedding between El Cid Campeador and Doña Jimena was celebrated here. Inside, visitors can admire valuable artworks and an atmosphere of deep spirituality.",
        "tips": "L'ingresso è gratuito, ma gli orari di apertura possono variare; meglio visitarla prima o dopo le messe.",
        "tipsEN": "Entry is free, but opening hours may vary; best visited before or after mass.",
        "src": [
          "Wikipedia: Iglesia de San Miguel (Palencia)",
          "Turismo Castilla y León"
        ],
        "maps": "https://maps.google.com/?q=42.007936,-4.53436"
      },
      {
        "id": "pal-7",
        "name": "Monasterio de Santa Clara",
        "nameEN": "Monasterio de Santa Clara",
        "cat": "cultura",
        "lat": 42.0094,
        "lng": -4.53083,
        "short": "Monastero gotico che custodisce il venerato 'Cristo de las Claras'.",
        "shortEN": "Gothic monastery housing the venerated 'Cristo de las Claras'.",
        "desc": "Il Monastero di Santa Clara è un importante complesso religioso fondato nel XIV secolo, noto per la sua architettura gotica e il suo profondo significato storico. La chiesa del monastero ospita il famoso 'Cristo de las Claras', una scultura molto venerata circondata da leggende locali. L'edificio conserva elementi architettonici di grande valore, tra cui un bellissimo coro e altari finemente decorati. È un luogo di pace e devozione nel cuore della città.",
        "descEN": "The Monastery of Santa Clara is an important religious complex founded in the 14th century, known for its Gothic architecture and deep historical significance. The monastery's church houses the famous 'Cristo de las Claras', a highly venerated sculpture surrounded by local legends. The building preserves valuable architectural elements, including a beautiful choir and finely decorated altars. It is a place of peace and devotion in the heart of the city.",
        "tips": "Verificare gli orari di apertura della chiesa, solitamente accessibile durante le funzioni religiose.",
        "tipsEN": "Check the church's opening hours, usually accessible during religious services.",
        "src": [
          "Wikipedia: Monasterio de Santa Clara (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.0094,-4.53083"
      },
      {
        "id": "pal-8",
        "name": "Museo de Palencia",
        "nameEN": "Museo de Palencia",
        "cat": "cultura",
        "lat": 42.009167,
        "lng": -4.535556,
        "short": "Museo archeologico situato nella rinascimentale Casa del Cordón.",
        "shortEN": "Archaeological museum located in the Renaissance Casa del Cordón.",
        "desc": "Il Museo di Palencia, noto anche come Museo Archeologico, è ospitato nella storica Casa del Cordón, un edificio rinascimentale del XVI secolo. Le sue collezioni offrono un affascinante viaggio attraverso la storia della provincia, dalla preistoria fino al Medioevo. Tra i pezzi più importanti vi sono reperti celtiberici, mosaici romani e sculture medievali. È una tappa fondamentale per comprendere l'evoluzione culturale e storica della regione.",
        "descEN": "The Museum of Palencia, also known as the Archaeological Museum, is housed in the historic Casa del Cordón, a 16th-century Renaissance building. Its collections offer a fascinating journey through the history of the province, from prehistory to the Middle Ages. Among the most important pieces are Celtiberian artifacts, Roman mosaics, and medieval sculptures. It is an essential stop to understand the cultural and historical evolution of the region.",
        "tips": "Chiuso il lunedì. L'ingresso è gratuito nei fine settimana.",
        "tipsEN": "Closed on Mondays. Entry is free on weekends.",
        "src": [
          "Wikipedia: Museo de Palencia",
          "Junta de Castilla y León"
        ],
        "maps": "https://maps.google.com/?q=42.009167,-4.535556"
      },
      {
        "id": "pal-9",
        "name": "Calle Mayor Principal",
        "nameEN": "Calle Mayor Principal",
        "cat": "cultura",
        "lat": 42.009197,
        "lng": -4.532801,
        "short": "La via principale porticata, cuore pulsante della vita cittadina.",
        "shortEN": "The main arcaded street, the beating heart of city life.",
        "desc": "La Calle Mayor Principal è l'arteria vitale e il cuore commerciale di Palencia, estendendosi per quasi un chilometro attraverso il centro storico. Caratterizzata dai suoi iconici portici sostenuti da colonne, offre riparo e un'atmosfera unica per passeggiare. Lungo la via si affacciano eleganti edifici borghesi del XIX e XX secolo, negozi tradizionali e caffè storici. È il luogo perfetto per immergersi nella vita quotidiana palentina.",
        "descEN": "Calle Mayor Principal is the vital artery and commercial heart of Palencia, stretching for almost a kilometer through the historic center. Characterized by its iconic arcades supported by columns, it offers shelter and a unique atmosphere for strolling. Elegant 19th and 20th-century bourgeois buildings, traditional shops, and historic cafes line the street. It is the perfect place to immerse yourself in the daily life of Palencia.",
        "tips": "Ideale per una passeggiata pomeridiana e per fare shopping al coperto.",
        "tipsEN": "Ideal for an afternoon stroll and indoor shopping.",
        "src": [
          "Wikipedia: Calle Mayor (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.009197,-4.532801"
      },
      {
        "id": "pal-10",
        "name": "Puente Mayor",
        "nameEN": "Puente Mayor",
        "cat": "cultura",
        "lat": 42.008469,
        "lng": -4.537425,
        "short": "Storico ponte in pietra del XVI secolo sul fiume Carrión.",
        "shortEN": "Historic 16th-century stone bridge over the Carrión River.",
        "desc": "Il Puente Mayor è uno storico ponte in pietra che attraversa il fiume Carrión, collegando il centro di Palencia con i quartieri occidentali. Costruito originariamente nel XVI secolo e successivamente ampliato, presenta una struttura robusta con archi a tutto sesto. Oltre alla sua importanza architettonica, offre splendide viste sul fiume e sulle aree verdi circostanti. È un punto di passaggio pittoresco e ricco di storia.",
        "descEN": "The Puente Mayor is a historic stone bridge that crosses the Carrión River, connecting the center of Palencia with the western neighborhoods. Originally built in the 16th century and later expanded, it features a robust structure with semicircular arches. In addition to its architectural importance, it offers beautiful views of the river and the surrounding green areas. It is a picturesque crossing point rich in history.",
        "tips": "Ottimo punto per scattare foto al fiume e al parco Isla Dos Aguas.",
        "tipsEN": "Great spot for taking photos of the river and Isla Dos Aguas park.",
        "src": [
          "Wikipedia: Puente Mayor (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.008469,-4.537425"
      },
      {
        "id": "pal-11",
        "name": "Iglesia de San Pablo",
        "nameEN": "Iglesia de San Pablo",
        "cat": "cultura",
        "lat": 42.014346,
        "lng": -4.536171,
        "short": "Imponente chiesa gotico-rinascimentale con pregevoli opere d'arte.",
        "shortEN": "Imposing Gothic-Renaissance church with valuable artworks.",
        "desc": "La Chiesa di San Pablo, parte di un antico convento domenicano, è un imponente edificio gotico e rinascimentale situato nel centro di Palencia. La sua facciata principale è un capolavoro di scultura, mentre l'interno a tre navate colpisce per la sua grandiosità e luminosità. Ospita importanti opere d'arte, tra cui la tomba dei marchesi di Poza e un magnifico retablo maggiore. È uno dei monumenti religiosi più significativi della città.",
        "descEN": "The Church of San Pablo, part of a former Dominican convent, is an imposing Gothic and Renaissance building located in the center of Palencia. Its main facade is a masterpiece of sculpture, while the three-nave interior impresses with its grandeur and brightness. It houses important artworks, including the tomb of the Marquises of Poza and a magnificent main altarpiece. It is one of the most significant religious monuments in the city.",
        "tips": "Da non perdere la facciata principale e la cappella maggiore.",
        "tipsEN": "Don't miss the main facade and the main chapel.",
        "src": [
          "Wikipedia: Convento de San Pablo (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.014346,-4.536171"
      },
      {
        "id": "pal-12",
        "name": "Parque de la Huerta de Guadián",
        "nameEN": "Parque de la Huerta de Guadián",
        "cat": "natura",
        "lat": 42.007783,
        "lng": -4.526012,
        "short": "Rilassante parco cittadino che ospita una chiesa romanica recuperata.",
        "shortEN": "Relaxing city park housing a recovered Romanesque church.",
        "desc": "Il Parco della Huerta de Guadián è uno dei polmoni verdi più amati di Palencia, un'oasi di tranquillità ideale per passeggiate e relax. Caratterizzato da ampi viali alberati, giardini curati e sculture moderne, offre un perfetto rifugio dal trambusto cittadino. All'interno del parco si trova anche la suggestiva chiesa romanica di San Juan Bautista, trasferita qui pietra su pietra da un villaggio sommerso. È un luogo perfetto per famiglie e amanti della natura.",
        "descEN": "The Huerta de Guadián Park is one of Palencia's most beloved green lungs, an oasis of tranquility ideal for walks and relaxation. Characterized by wide tree-lined avenues, manicured gardens, and modern sculptures, it offers a perfect refuge from the city bustle. Inside the park is also the striking Romanesque church of San Juan Bautista, moved here stone by stone from a flooded village. It is a perfect place for families and nature lovers.",
        "tips": "Ideale per un picnic o una pausa rilassante durante la visita della città.",
        "tipsEN": "Ideal for a picnic or a relaxing break while visiting the city.",
        "src": [
          "Ayuntamiento de Palencia",
          "Wikipedia: Huerta de Guadián"
        ],
        "maps": "https://maps.google.com/?q=42.007783,-4.526012"
      },
      {
        "id": "pal-13",
        "name": "Iglesia de San Francisco",
        "nameEN": "Iglesia de San Francisco",
        "cat": "cultura",
        "lat": 42.011417,
        "lng": -4.532143,
        "short": "Storica chiesa francescana con un mix di stili architettonici.",
        "shortEN": "Historic Franciscan church with a mix of architectural styles.",
        "desc": "La Chiesa di San Francisco è un edificio storico di grande rilevanza, situato vicino alla Plaza Mayor. Fondata nel XIII secolo dai francescani, la chiesa ha subito varie modifiche nel corso dei secoli, mescolando elementi gotici, rinascimentali e barocchi. L'interno è noto per le sue cappelle riccamente decorate e per il soffitto a cassettoni mudéjar. È un luogo che testimonia la profonda storia religiosa e architettonica di Palencia.",
        "descEN": "The Church of San Francisco is a historic building of great importance, located near the Plaza Mayor. Founded in the 13th century by the Franciscans, the church has undergone various modifications over the centuries, mixing Gothic, Renaissance, and Baroque elements. The interior is known for its richly decorated chapels and its Mudéjar coffered ceiling. It is a place that testifies to the deep religious and architectural history of Palencia.",
        "tips": "Situata in posizione centrale, è facilmente visitabile insieme alla Plaza Mayor.",
        "tipsEN": "Centrally located, it is easily visited along with the Plaza Mayor.",
        "src": [
          "Wikipedia: Iglesia de San Francisco (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.011417,-4.532143"
      },
      {
        "id": "pal-14",
        "name": "Palacio de la Diputación",
        "nameEN": "Palacio de la Diputación",
        "cat": "cultura",
        "lat": 42.01138,
        "lng": -4.530312,
        "short": "Elegante palazzo neorinascimentale, sede del governo provinciale.",
        "shortEN": "Elegant Neo-Renaissance palace, seat of the provincial government.",
        "desc": "Il Palazzo della Deputazione Provinciale è uno degli edifici civili più belli e rappresentativi di Palencia. Costruito all'inizio del XX secolo in stile neorinascimentale, si distingue per la sua facciata elegante e simmetrica, decorata con sculture e dettagli in pietra. L'interno ospita sale di grande pregio artistico, spesso utilizzate per mostre ed eventi culturali. È un simbolo dell'amministrazione e della cultura locale.",
        "descEN": "The Provincial Council Palace is one of the most beautiful and representative civil buildings in Palencia. Built in the early 20th century in a Neo-Renaissance style, it stands out for its elegant and symmetrical facade, decorated with sculptures and stone details. The interior houses rooms of great artistic value, often used for exhibitions and cultural events. It is a symbol of local administration and culture.",
        "tips": "Ammirate i dettagli della facciata; l'interno è accessibile durante le mostre.",
        "tipsEN": "Admire the details of the facade; the interior is accessible during exhibitions.",
        "src": [
          "Wikipedia: Palacio de la Diputación de Palencia"
        ],
        "maps": "https://maps.google.com/?q=42.01138,-4.530312"
      },
      {
        "id": "pal-15",
        "name": "Iglesia de Nuestra Señora de la Calle",
        "nameEN": "Iglesia de Nuestra Señora de la Calle",
        "cat": "cultura",
        "lat": 42.009603,
        "lng": -4.534465,
        "short": "Chiesa gesuita che custodisce l'immagine della patrona di Palencia.",
        "shortEN": "Jesuit church housing the image of the patron saint of Palencia.",
        "desc": "La Chiesa di Nuestra Señora de la Calle, conosciuta anche come La Compañía, è un magnifico tempio gesuita del XVI secolo. La sua facciata austera nasconde un interno sorprendente, dove spicca la venerata immagine della Virgen de la Calle, patrona di Palencia. L'altare maggiore e le cappelle laterali sono riccamente decorati in stile barocco. È un centro di grande devozione popolare, specialmente durante le festività patronali.",
        "descEN": "The Church of Nuestra Señora de la Calle, also known as La Compañía, is a magnificent 16th-century Jesuit temple. Its austere facade hides a surprising interior, where the venerated image of the Virgen de la Calle, patron saint of Palencia, stands out. The main altar and side chapels are richly decorated in Baroque style. It is a center of great popular devotion, especially during the patronal festivities.",
        "tips": "Visitatela per ammirare l'altare barocco e l'immagine della patrona.",
        "tipsEN": "Visit to admire the Baroque altar and the image of the patron saint.",
        "src": [
          "Wikipedia: Iglesia de Nuestra Señora de la Calle"
        ],
        "maps": "https://maps.google.com/?q=42.009603,-4.534465"
      },
      {
        "id": "pal-16",
        "name": "Iglesia de San Lázaro",
        "nameEN": "Iglesia de San Lázaro",
        "cat": "cultura",
        "lat": 42.009478,
        "lng": -4.529583,
        "short": "Antica chiesa con un magnifico retablo plateresco e legami con El Cid.",
        "shortEN": "Ancient church with a magnificent Plateresque altarpiece and ties to El Cid.",
        "desc": "La Chiesa di San Lázaro è un antico tempio le cui origini risalgono a un ospedale per pellegrini e lebbrosi fondato da El Cid. L'edificio attuale presenta un mix di stili, con una predominanza del gotico e importanti riforme rinascimentali. All'interno spicca il magnifico retablo maggiore plateresco, opera di artisti rinomati della scuola castigliana. È un luogo intriso di storia e leggende, fondamentale per il patrimonio religioso di Palencia.",
        "descEN": "The Church of San Lázaro is an ancient temple whose origins date back to a hospital for pilgrims and lepers founded by El Cid. The current building features a mix of styles, with a predominance of Gothic and important Renaissance reforms. Inside, the magnificent Plateresque main altarpiece, the work of renowned artists of the Castilian school, stands out. It is a place steeped in history and legends, fundamental to Palencia's religious heritage.",
        "tips": "Ammirate i dettagli del retablo maggiore, uno dei migliori della città.",
        "tipsEN": "Admire the details of the main altarpiece, one of the best in the city.",
        "src": [
          "Wikipedia: Iglesia de San Lázaro (Palencia)"
        ],
        "maps": "https://maps.google.com/?q=42.009478,-4.529583"
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
        "tier": 2,
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
        "tier": 2,
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
        "tier": 1,
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
        "tier": 2,
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
        "tier": 1,
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
      },
      {
        "tier": 1,
        "id": "gen-6",
        "name": "Palazzo Ducale",
        "nameEN": "Palazzo Ducale",
        "cat": "cultura",
        "lat": 44.4075,
        "lng": 8.933,
        "short": "L'antica sede dei Dogi, oggi cuore pulsante della cultura genovese.",
        "shortEN": "The ancient seat of the Doges, now the beating heart of Genoese culture.",
        "desc": "Il Palazzo Ducale è uno dei principali edifici storici e musei di Genova, un tempo sede del Doge della Repubblica. Oggi ospita importanti mostre d'arte, eventi culturali e rassegne internazionali. La sua architettura maestosa, con i due cortili e i saloni affrescati, testimonia la grandezza passata della città.",
        "descEN": "Palazzo Ducale is one of the main historical buildings and museums in Genoa, once the seat of the Doge of the Republic. Today it hosts important art exhibitions, cultural events, and international festivals. Its majestic architecture, with two courtyards and frescoed halls, testifies to the city's past greatness.",
        "tips": "L'ingresso ai cortili è gratuito, le mostre sono a pagamento.",
        "tipsEN": "Entry to the courtyards is free, exhibitions require a ticket.",
        "src": [
          "Wikipedia: Palazzo Ducale (Genoa)",
          "palazzoducale.genova.it"
        ],
        "maps": "https://maps.google.com/?q=44.4075,8.933"
      },
      {
        "tier": 1,
        "id": "gen-7",
        "name": "Porto Antico",
        "nameEN": "Porto Antico",
        "cat": "natura",
        "lat": 44.4092,
        "lng": 8.9265,
        "short": "L'area portuale riqualificata da Renzo Piano, perfetta per passeggiare sul mare.",
        "shortEN": "The port area redeveloped by Renzo Piano, perfect for a seaside stroll.",
        "desc": "Il Porto Antico è il cuore turistico e ricreativo di Genova, riqualificato dall'architetto Renzo Piano nel 1992. Questa vasta area pedonale affacciata sul mare offre passeggiate panoramiche, musei, ristoranti e attrazioni per tutte le età. È il luogo ideale per rilassarsi ammirando le barche e l'orizzonte.",
        "descEN": "The Porto Antico is the tourist and recreational heart of Genoa, redeveloped by architect Renzo Piano in 1992. This vast pedestrian area overlooking the sea offers scenic walks, museums, restaurants, and attractions for all ages. It is the ideal place to relax while admiring the boats and the horizon.",
        "tips": "Ottimo per una passeggiata al tramonto.",
        "tipsEN": "Great for a sunset walk.",
        "src": [
          "Wikipedia: Porto Antico (Genoa)",
          "portoantico.it"
        ],
        "maps": "https://maps.google.com/?q=44.4092,8.9265"
      },
      {
        "id": "gen-8",
        "name": "Galata Museo del Mare",
        "nameEN": "Galata Museo del Mare",
        "cat": "cultura",
        "lat": 44.4148,
        "lng": 8.9238,
        "short": "Il più grande museo marittimo del Mediterraneo, con un vero sottomarino.",
        "shortEN": "The largest maritime museum in the Mediterranean, featuring a real submarine.",
        "desc": "Il Galata Museo del Mare è il più grande museo marittimo del Mediterraneo, dedicato alla storia della navigazione. Attraverso ricostruzioni di navi, strumenti nautici e mostre interattive, racconta il legame profondo tra Genova e il mare. Include anche un vero sottomarino visitabile ormeggiato all'esterno.",
        "descEN": "The Galata Museo del Mare is the largest maritime museum in the Mediterranean, dedicated to the history of navigation. Through ship reconstructions, nautical instruments, and interactive exhibits, it tells the deep bond between Genoa and the sea. It also includes a real visitable submarine moored outside.",
        "tips": "Calcola almeno due ore per la visita completa, incluso il sottomarino Nazario Sauro.",
        "tipsEN": "Allow at least two hours for a full visit, including the Nazario Sauro submarine.",
        "src": [
          "Wikipedia: Galata Museo del Mare",
          "galatamuseodelmare.it"
        ],
        "maps": "https://maps.google.com/?q=44.4148,8.9238"
      },
      {
        "id": "gen-9",
        "name": "Palazzo Reale",
        "nameEN": "Palazzo Reale",
        "cat": "cultura",
        "lat": 44.4149,
        "lng": 8.9261,
        "short": "Una sfarzosa residenza aristocratica con una magnifica Galleria degli Specchi.",
        "shortEN": "A lavish aristocratic residence with a magnificent Hall of Mirrors.",
        "desc": "Il Palazzo Reale di Genova è una sontuosa dimora aristocratica che conserva intatti i suoi arredi originali, affreschi e opere d'arte. Acquistato dai Savoia nel XIX secolo, vanta una magnifica Galleria degli Specchi e un bellissimo giardino pensile. È uno dei palazzi più affascinanti di Via Balbi.",
        "descEN": "The Royal Palace of Genoa is a sumptuous aristocratic residence that preserves its original furnishings, frescoes, and artworks intact. Purchased by the House of Savoy in the 19th century, it boasts a magnificent Hall of Mirrors and a beautiful hanging garden. It is one of the most fascinating palaces on Via Balbi.",
        "tips": "Chiuso il lunedì. Il biglietto include la visita ai giardini.",
        "tipsEN": "Closed on Mondays. The ticket includes access to the gardens.",
        "src": [
          "Wikipedia: Palazzo Reale (Genoa)",
          "palazzorealegenova.beniculturali.it"
        ],
        "maps": "https://maps.google.com/?q=44.4149,8.9261"
      },
      {
        "tier": 1,
        "id": "gen-10",
        "name": "Porta Soprana e Casa di Colombo",
        "nameEN": "Porta Soprana e Casa di Colombo",
        "cat": "cultura",
        "lat": 44.4055,
        "lng": 8.934,
        "short": "Le imponenti torri medievali e la casa d'infanzia di Cristoforo Colombo.",
        "shortEN": "The imposing medieval towers and the childhood home of Christopher Columbus.",
        "desc": "Porta Soprana è una delle antiche porte di accesso alla città, fiancheggiata da due imponenti torri medievali. A pochi passi si trova la Casa di Cristoforo Colombo, una ricostruzione dell'edificio in cui il celebre navigatore visse la sua giovinezza. Questo angolo medievale offre un affascinante contrasto con la città moderna.",
        "descEN": "Porta Soprana is one of the ancient city gates, flanked by two imposing medieval towers. A few steps away is the House of Christopher Columbus, a reconstruction of the building where the famous navigator spent his youth. This medieval corner offers a fascinating contrast with the modern city.",
        "tips": "È possibile acquistare un biglietto combinato per visitare l'interno della casa e le torri.",
        "tipsEN": "You can buy a combined ticket to visit the inside of the house and the towers.",
        "src": [
          "Wikipedia: Porta Soprana",
          "Wikipedia: Christopher Columbus's house"
        ],
        "maps": "https://maps.google.com/?q=44.4055,8.934"
      },
      {
        "tier": 1,
        "id": "gen-11",
        "name": "Mercato Orientale",
        "nameEN": "Mercato Orientale",
        "cat": "cibo",
        "lat": 44.4061,
        "lng": 8.9392,
        "short": "Il vivace mercato storico di Genova, perfetto per scoprire i sapori locali.",
        "shortEN": "Genoa's vibrant historic market, perfect for discovering local flavors.",
        "desc": "Il Mercato Orientale è il mercato coperto più antico e vivace di Genova, situato lungo la centrale Via XX Settembre. Qui i genovesi acquistano prodotti freschi, dal basilico per il pesto al pesce appena pescato. Recentemente è stato arricchito da un'area food court dove gustare specialità locali sul momento.",
        "descEN": "The Mercato Orientale is the oldest and most vibrant covered market in Genoa, located along the central Via XX Settembre. Here locals buy fresh produce, from basil for pesto to freshly caught fish. It was recently enriched with a food court area where you can taste local specialties on the spot.",
        "tips": "Ottimo per una pausa pranzo veloce e autentica al MOG (Mercato Orientale Genova).",
        "tipsEN": "Great for a quick and authentic lunch break at the MOG (Mercato Orientale Genova).",
        "src": [
          "Wikipedia: Mercato Orientale",
          "moggenova.it"
        ],
        "maps": "https://maps.google.com/?q=44.4061,8.9392"
      },
      {
        "id": "gen-12",
        "name": "Villetta Di Negro",
        "nameEN": "Villetta Di Negro",
        "cat": "natura",
        "lat": 44.411,
        "lng": 8.937,
        "short": "Un'oasi verde nel centro città con cascate e viste panoramiche.",
        "shortEN": "A green oasis in the city center with waterfalls and panoramic views.",
        "desc": "Villetta Di Negro è un parco collinare situato nel cuore di Genova, famoso per le sue cascate artificiali, le grotte e i sentieri tortuosi. Offre una splendida vista panoramica sulla città e sul porto. All'interno del parco si trova anche il Museo d'Arte Orientale Edoardo Chiossone.",
        "descEN": "Villetta Di Negro is a hilly park located in the heart of Genoa, famous for its artificial waterfalls, caves, and winding paths. It offers a splendid panoramic view of the city and the port. Inside the park, you will also find the Edoardo Chiossone Museum of Oriental Art.",
        "tips": "L'ingresso al parco è gratuito. Ottimo per una pausa rilassante.",
        "tipsEN": "Entry to the park is free. Great for a relaxing break.",
        "src": [
          "Wikipedia: Villetta Di Negro"
        ],
        "maps": "https://maps.google.com/?q=44.411,8.937"
      },
      {
        "id": "gen-13",
        "name": "Castello d'Albertis",
        "nameEN": "Castello d'Albertis",
        "cat": "cultura",
        "lat": 44.4172,
        "lng": 8.9248,
        "short": "Un castello neogotico che ospita il Museo delle Culture del Mondo.",
        "shortEN": "A neo-Gothic castle housing the Museum of World Cultures.",
        "desc": "Il Castello d'Albertis è una dimora in stile neogotico costruita dal capitano Enrico Alberto d'Albertis. Oggi ospita il Museo delle Culture del Mondo, esponendo le collezioni etnografiche raccolte dal capitano nei suoi viaggi. Dalle sue terrazze si gode una delle viste più spettacolari sul porto di Genova.",
        "descEN": "Castello d'Albertis is a neo-Gothic residence built by Captain Enrico Alberto d'Albertis. Today it houses the Museum of World Cultures, displaying the ethnographic collections gathered by the captain during his travels. Its terraces offer one of the most spectacular views of the port of Genoa.",
        "tips": "Raggiungibile facilmente con l'ascensore Montegalletto, un'esperienza unica che si muove sia in orizzontale che in verticale.",
        "tipsEN": "Easily reachable with the Montegalletto elevator, a unique experience that moves both horizontally and vertically.",
        "src": [
          "Wikipedia: Castello d'Albertis",
          "museidigenova.it"
        ],
        "maps": "https://maps.google.com/?q=44.4172,8.9248"
      },
      {
        "id": "gen-14",
        "name": "Palazzo San Giorgio",
        "nameEN": "Palazzo San Giorgio",
        "cat": "cultura",
        "lat": 44.4094,
        "lng": 8.9286,
        "short": "Storico palazzo affrescato, un tempo prigione di Marco Polo e antica banca.",
        "shortEN": "Historic frescoed palace, once Marco Polo's prison and an ancient bank.",
        "desc": "Palazzo San Giorgio è uno degli edifici storici più importanti di Genova, situato vicino al Porto Antico. Costruito nel 1260, fu sede del potere cittadino, prigione (dove fu rinchiuso Marco Polo) e poi sede del Banco di San Giorgio, una delle prime banche al mondo. La sua facciata affrescata è inconfondibile.",
        "descEN": "Palazzo San Giorgio is one of the most important historical buildings in Genoa, located near the Porto Antico. Built in 1260, it was the seat of civic power, a prison (where Marco Polo was held), and later the seat of the Bank of Saint George, one of the world's first banks. Its frescoed facade is unmistakable.",
        "tips": "L'interno è visitabile solo in occasioni speciali o mostre, ma la facciata merita una foto.",
        "tipsEN": "The interior is only open on special occasions or for exhibitions, but the facade is worth a photo.",
        "src": [
          "Wikipedia: Palazzo San Giorgio (Genoa)"
        ],
        "maps": "https://maps.google.com/?q=44.4094,8.9286"
      },
      {
        "id": "gen-15",
        "name": "Biosfera",
        "nameEN": "Biosfera",
        "cat": "natura",
        "lat": 44.4088,
        "lng": 8.9255,
        "short": "Una sfera di vetro sul mare che racchiude una foresta tropicale.",
        "shortEN": "A glass sphere on the sea enclosing a tropical forest.",
        "desc": "La Biosfera, progettata da Renzo Piano, è una spettacolare struttura sferica in vetro e acciaio sospesa sull'acqua nel Porto Antico. Al suo interno ricrea un ambiente tropicale con piante esotiche, uccelli in libertà, rettili e farfalle. È un piccolo ma affascinante ecosistema che sensibilizza sulla biodiversità.",
        "descEN": "The Biosphere, designed by Renzo Piano, is a spectacular spherical glass and steel structure suspended over the water in the Porto Antico. Inside, it recreates a tropical environment with exotic plants, free-flying birds, reptiles, and butterflies. It is a small but fascinating ecosystem that raises awareness about biodiversity.",
        "tips": "Ideale per le famiglie. Il biglietto può essere combinato con l'Acquario.",
        "tipsEN": "Ideal for families. The ticket can be combined with the Aquarium.",
        "src": [
          "Wikipedia: Biosfera (Genoa)",
          "acquariodigenova.it"
        ],
        "maps": "https://maps.google.com/?q=44.4088,8.9255"
      },
      {
        "id": "gen-16",
        "name": "Basilica della Santissima Annunziata del Vastato",
        "nameEN": "Basilica della Santissima Annunziata del Vastato",
        "cat": "cultura",
        "lat": 44.4136,
        "lng": 8.9281,
        "short": "Una chiesa spettacolare con interni barocchi riccamente decorati.",
        "shortEN": "A spectacular church with richly decorated Baroque interiors.",
        "desc": "Questa basilica è uno degli esempi più fulgidi dell'arte genovese del tardo manierismo e del barocco. Nonostante i gravi danni subiti durante la Seconda Guerra Mondiale, l'interno è stato magnificamente restaurato e abbaglia i visitatori con le sue volte affrescate, gli stucchi dorati e le colonne in marmo. La sua facciata neoclassica, aggiunta nell'Ottocento, nasconde un tesoro di inestimabile valore artistico.",
        "descEN": "This basilica is one of the most shining examples of Genoese late Mannerist and Baroque art. Despite severe damage during World War II, the interior has been magnificently restored and dazzles visitors with its frescoed vaults, gilded stucco, and marble columns. Its neoclassical facade, added in the 19th century, hides a treasure of inestimable artistic value.",
        "tips": "Situata in Piazza della Nunziata, l'ingresso è gratuito.",
        "tipsEN": "Located in Piazza della Nunziata, entry is free.",
        "src": [
          "Wikipedia: Basilica della Santissima Annunziata del Vastato"
        ],
        "maps": "https://maps.google.com/?q=44.4136,8.9281"
      },
      {
        "id": "gen-17",
        "name": "Commenda di San Giovanni di Pré",
        "nameEN": "Commenda di San Giovanni di Pré",
        "cat": "cultura",
        "lat": 44.4155,
        "lng": 8.9222,
        "short": "Un antico complesso medievale che accoglieva i pellegrini e i crociati.",
        "shortEN": "An ancient medieval complex that welcomed pilgrims and crusaders.",
        "desc": "La Commenda di San Giovanni di Pré è un complesso medievale risalente al 1180, originariamente costruito come convento e ospedale per i pellegrini diretti in Terra Santa. È un raro esempio di architettura romanica a Genova, composto da due chiese sovrapposte e un edificio conventuale, oggi sede museale. Le sue spesse mura in pietra e le atmosfere silenziose trasportano i visitatori indietro nel tempo.",
        "descEN": "The Commenda di San Giovanni di Pré is a medieval complex dating back to 1180, originally built as a convent and hospital for pilgrims heading to the Holy Land. It is a rare example of Romanesque architecture in Genoa, consisting of two superimposed churches and a convent building, now a museum. Its thick stone walls and silent atmospheres transport visitors back in time.",
        "tips": "Ospita il MEI (Museo Nazionale dell'Emigrazione Italiana).",
        "tipsEN": "It houses the MEI (National Museum of Italian Emigration).",
        "src": [
          "Wikipedia: Commenda di San Giovanni di Pré"
        ],
        "maps": "https://maps.google.com/?q=44.4155,8.9222"
      }
    ]
  }
};
  // Expose globally (read by city-itineraries-ui.js)
  window.CITY_ITINERARIES = CITY_ITINERARIES;
})();
