/**
 * curiosita-data.js — "Sapevi che?" curiosità giornaliere
 * 11 pre-partenza (ogni 2 giorni, dal 4 giugno al 25 giugno)
 * 54 durante il viaggio (1 per giorno, legata alla tappa)
 *
 * Formato: { day: number, emoji: string, text: string, source: string }
 * - day < 0: pre-partenza (day = -22 significa 22 giorni prima)
 * - day >= 0: giorno di viaggio (0-indexed, G1 = day 0)
 */

var CURIOSITA_DATA = [
  // ═══════════════════════════════════════════════════════
  // PRE-PARTENZA (11 curiosità, una ogni ~2 giorni)
  // ═══════════════════════════════════════════════════════

  { day: -22, emoji: "🗺️", text: "Il vostro viaggio coprirà circa 12.000 km — la stessa distanza che separa Roma da Tokyo in linea d'aria!", source: "Calcolo itinerario" },
  { day: -20, emoji: "☀️", text: "A Tromsø, in Norvegia, il sole non tramonta dal 20 maggio al 22 luglio: 69 giorni consecutivi di luce!", source: "Institute of Marine Research, Norway" },
  { day: -18, emoji: "🧱", text: "LEGOLAND Billund ha usato oltre 65 milioni di mattoncini LEGO solo per il Miniland — e ne aggiungono ogni anno.", source: "LEGOLAND Billund Resort" },
  { day: -16, emoji: "🌊", text: "I fiordi norvegesi possono raggiungere i 1.308 metri di profondità (Sognefjord) — più profondi del Grand Canyon!", source: "Norwegian Mapping Authority" },
  { day: -14, emoji: "🦌", text: "In Lapponia finlandese ci sono più renne che abitanti: 200.000 renne per 180.000 persone.", source: "Reindeer Herders' Association, Finland" },
  { day: -12, emoji: "🌒", text: "Il 12 agosto 2026 ci sarà un'eclissi totale di sole visibile dalla Spagna — e voi sarete lì!", source: "NASA Eclipse 2026" },
  { day: -10, emoji: "🐋", text: "Nelle acque di Andenes (Vesterålen) vivono capodogli tutto l'anno — è uno dei pochi posti al mondo dove si avvistano con certezza.", source: "Whalesafari Andenes" },
  { day: -8, emoji: "🏛️", text: "Il Clos Lucé ad Amboise fu l'ultima dimora di Leonardo da Vinci. Nel parco ci sono 40 macchine costruite dai suoi disegni!", source: "Château du Clos Lucé" },
  { day: -6, emoji: "🎨", text: "Il Guggenheim di Bilbao è ricoperto da 33.000 lastre di titanio — ognuna spessa solo mezzo millimetro.", source: "Guggenheim Bilbao Museum" },
  { day: -4, emoji: "🇪🇪", text: "Tallinn ha il centro storico medievale meglio conservato del Nord Europa — Patrimonio UNESCO dal 1997.", source: "UNESCO World Heritage" },
  { day: -2, emoji: "🚐", text: "Attraverserete 13 paesi in 54 giorni — una media di un paese nuovo ogni 4 giorni!", source: "Calcolo itinerario" },

  // ═══════════════════════════════════════════════════════
  // DURANTE IL VIAGGIO (54 curiosità, 1 per giorno)
  // ═══════════════════════════════════════════════════════

  // G1 - Selvazzano → Leoben (Austria)
  { day: 0, emoji: "🍺", text: "Leoben ospita il birrificio Gösser, fondato nel 1860 — la birra più bevuta d'Austria. Il motto? \"Gut, besser, Gösser\" (Buona, migliore, Gösser).", source: "Brauerei Göss" },

  // G2 - Leoben → Vienna
  { day: 1, emoji: "🎡", text: "La Riesenrad del Prater di Vienna gira dal 1897 — ha 127 anni ed è una delle ruote panoramiche più antiche del mondo ancora in funzione.", source: "Wiener Riesenrad" },

  // G3 - Vienna → Varsavia
  { day: 2, emoji: "🧜‍♀️", text: "Lo stemma di Varsavia è una sirena con spada e scudo — la leggenda dice che una sirena della Vistola protegge la città dai nemici.", source: "City of Warsaw" },

  // G4 - Varsavia → Vilnius (Lituania)
  { day: 3, emoji: "🎈", text: "Vilnius ha una \"Repubblica di Užupis\" — un quartiere bohémien che si è autoproclamato stato indipendente nel 1997, con costituzione e presidente.", source: "Užupis Republic" },

  // G5 - Vilnius → Riga (Lettonia)
  { day: 4, emoji: "🏛️", text: "Riga ha la più grande collezione di edifici Art Nouveau al mondo: oltre 800 palazzi decorati, concentrati in Alberta iela.", source: "Riga Art Nouveau Centre" },

  // G6 - Riga → Tallinn (Estonia)
  { day: 5, emoji: "💻", text: "L'Estonia è il paese più digitale del mondo: il 99% dei servizi pubblici è online. Puoi persino votare dal telefono!", source: "e-Estonia" },

  // G7 - Tallinn → Lappeenranta (Finlandia)
  { day: 6, emoji: "🧖", text: "In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili!", source: "Finnish Sauna Society" },

  // G8 - Lappeenranta → Punkaharju
  { day: 7, emoji: "🌲", text: "La cresta di Punkaharju è una formazione glaciale lunga 7 km tra due laghi — lo Zar Alessandro I la dichiarò paesaggio protetto nel 1803.", source: "Metsähallitus Finland" },

  // G9 - Regione dei Laghi (Saimaa)
  { day: 8, emoji: "🦭", text: "Nel lago Saimaa vive la foca degli anelli più rara del mondo: ne restano solo ~430 esemplari, intrappolati qui dalla fine dell'era glaciale.", source: "WWF Finland" },

  // G10 - Laghi → Oulu
  { day: 9, emoji: "🎸", text: "Oulu ospita ogni anno i Campionati Mondiali di Air Guitar — sì, è una competizione seria dal 1996!", source: "Air Guitar World Championships" },

  // G11 - Oulu → Ranua
  { day: 10, emoji: "🐻‍❄️", text: "Lo zoo artico di Ranua è l'unico zoo al mondo dove si possono vedere gli orsi polari a queste latitudini in un habitat quasi naturale.", source: "Ranua Wildlife Park" },

  // G12 - Ranua → Rovaniemi
  { day: 11, emoji: "🎅", text: "Rovaniemi riceve ogni anno oltre 500.000 lettere indirizzate a Babbo Natale da bambini di 198 paesi diversi.", source: "Santa Claus Main Post Office" },

  // G13 - Rovaniemi
  { day: 12, emoji: "📐", text: "Il Circolo Polare Artico (66°33'N) passa esattamente attraverso il Santa Claus Village — c'è una linea dipinta sul pavimento dove puoi attraversarlo!", source: "Arctic Circle marking, Rovaniemi" },

  // G14 - Rovaniemi → Inari
  { day: 13, emoji: "🦌", text: "Il popolo Sami è l'unico popolo indigeno riconosciuto dell'UE. La loro lingua ha oltre 300 parole diverse per descrivere la neve e il ghiaccio.", source: "Sámi Parliament Finland" },

  // G15 - Inari → Kilpisjärvi
  { day: 14, emoji: "🪨", text: "A Kilpisjärvi c'è il Treriksröset: il punto dove si incontrano i confini di Finlandia, Svezia e Norvegia. Puoi stare in 3 paesi contemporaneamente!", source: "Kilpisjärvi Biological Station" },

  // G16 - Kilpisjärvi → Tromsø
  { day: 15, emoji: "⛪", text: "La Cattedrale Artica di Tromsø (Ishavskatedralen) ha una vetrata di 140 m² — una delle più grandi d'Europa, visibile anche di notte col sole di mezzanotte.", source: "Ishavskatedralen" },

  // G17 - Tromsø → Senja
  { day: 16, emoji: "👹", text: "Senja ospita il Troll più grande del mondo: Senjatrollet, alto 18 metri, con una grotta-museo dentro la pancia!", source: "Senjatrollet" },

  // G18 - Senja → Andenes
  { day: 17, emoji: "🚀", text: "Ad Andøya c'è una base spaziale attiva — la Andøya Space, da cui vengono lanciati razzi di ricerca scientifica nell'atmosfera dal 1962.", source: "Andøya Space" },

  // G19 - Andenes (Vesterålen)
  { day: 18, emoji: "🐋", text: "I capodogli di Andenes si immergono fino a 2.000 metri di profondità per cacciare calamari giganti — trattengono il respiro per 90 minuti!", source: "Whalesafari Andenes" },

  // G20 - Andenes → Svolvær (Lofoten)
  { day: 19, emoji: "🐟", text: "Le Lofoten producono il 70% di tutto lo stoccafisso norvegese — il merluzzo viene essiccato all'aria aperta sui caratteristici hjell da oltre 1.000 anni.", source: "Norwegian Seafood Council" },

  // G21 - Svolvær → Henningsvær
  { day: 20, emoji: "⚽", text: "Henningsvær ha il campo da calcio più scenografico del mondo: costruito su un isolotto tra le montagne, circondato dal mare su tutti i lati.", source: "Henningsvær Idrettslag" },

  // G22 - Lofoten (Spiagge)
  { day: 21, emoji: "🏖️", text: "Haukland Beach alle Lofoten è stata votata tra le 10 spiagge più belle del mondo — con sabbia bianca e acqua turchese... a 68° Nord!", source: "National Geographic" },

  // G23 - Lofoten (Reine)
  { day: 22, emoji: "📸", text: "Reine è stata eletta \"villaggio più bello della Norvegia\" dalla rivista Allers nel 1970 — da allora è diventata l'immagine iconica delle Lofoten.", source: "Lofoten Tourism" },

  // G24 - Lofoten (Nusfjord)
  { day: 23, emoji: "🏚️", text: "Nusfjord è uno dei villaggi di pescatori meglio conservati della Norvegia — le sue rorbu (capanne rosse) risalgono al 1800 e sono Patrimonio UNESCO.", source: "Nusfjord Arctic Resort" },

  // G25 - Lofoten → Mo i Rana
  { day: 24, emoji: "🌀", text: "Il Saltstraumen vicino a Mo i Rana è la corrente di marea più forte del mondo: 400 milioni di m³ d'acqua passano in un canale stretto a 37 km/h!", source: "Visit Bodø" },

  // G26 - Mo i Rana → Trondheim
  { day: 25, emoji: "🌐", text: "Oggi attraverserete il Circolo Polare Artico verso sud — il monumento Polarsirkelen segna il punto esatto a 66°33'N sulla E6.", source: "Polarsirkelsenteret" },

  // G27 - Trondheim
  { day: 26, emoji: "👑", text: "La cattedrale di Nidaros a Trondheim è il luogo di incoronazione dei re norvegesi dal Medioevo — e la chiesa più settentrionale del mondo in stile gotico.", source: "Nidaros Cathedral" },

  // G28 - Trondheim → Molde (Atlanterhavsveien)
  { day: 27, emoji: "🌊", text: "L'Atlanterhavsveien (Strada dell'Atlantico) è lunga solo 8,3 km ma ha 8 ponti che saltano da un isolotto all'altro — votata \"strada del secolo\" in Norvegia.", source: "Norwegian Public Roads Administration" },

  // G29 - Molde → Geiranger (Trollstigen)
  { day: 28, emoji: "🐉", text: "La Trollstigen (Scala dei Troll) ha 11 tornanti con pendenza del 10% e una cascata che attraversa la strada — aperta solo da maggio a ottobre.", source: "Visit Norway" },

  // G30 - Geiranger → Bergen
  { day: 29, emoji: "💎", text: "Il Geirangerfjord è Patrimonio UNESCO dal 2005 — le cascate \"Sette Sorelle\" cadono per 250 metri direttamente nel fiordo.", source: "UNESCO World Heritage" },

  // G31 - Bergen
  { day: 30, emoji: "🌧️", text: "Bergen è la città più piovosa d'Europa: piove in media 231 giorni all'anno (2.250 mm). I locali dicono: \"Non esiste cattivo tempo, solo cattivo abbigliamento\".", source: "Norwegian Meteorological Institute" },

  // G32 - Bergen → Stavanger (Preikestolen)
  { day: 31, emoji: "🧗", text: "Il Preikestolen (Pulpito) è una piattaforma rocciosa piatta di 25×25 metri sospesa a 604 metri sopra il Lysefjord — senza ringhiere!", source: "Stavanger Turistforening" },

  // G33 - Stavanger → Kristiansand
  { day: 32, emoji: "⛰️", text: "Il Kjeragbolten è un masso di 5 m³ incastrato tra due pareti rocciose a 984 metri d'altezza — la foto in piedi sopra è un classico (vertiginoso!) norvegese.", source: "Visit Norway" },

  // G34 - Kristiansand → Copenhagen
  { day: 33, emoji: "🚢", text: "Il traghetto Kristiansand-Hirtshals attraversa lo Skagerrak in ~2h30 — lo stesso stretto dove nel 1940 affondò l'incrociatore tedesco Blücher.", source: "Color Line" },

  // G35 - Copenhagen (Tivoli)
  { day: 34, emoji: "🎢", text: "I Giardini di Tivoli a Copenhagen, aperti nel 1843, sono il secondo parco divertimenti più antico del mondo — e ispirarono Walt Disney per Disneyland!", source: "Tivoli Gardens" },

  // G36 - Copenhagen
  { day: 35, emoji: "🚲", text: "A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone. Il 49% dei residenti va al lavoro in bici ogni giorno.", source: "City of Copenhagen" },

  // G37 - Copenhagen → Billund
  { day: 36, emoji: "🧱", text: "La parola LEGO viene dal danese \"leg godt\" che significa \"gioca bene\". L'azienda fu fondata nel 1932 a Billund da un falegname, Ole Kirk Christiansen.", source: "LEGO Group" },

  // G38 - Legoland
  { day: 37, emoji: "🏗️", text: "LEGOLAND Billund ha un modello del Monte Rushmore fatto con 1,5 milioni di mattoncini — ci sono voluti 3 anni per costruirlo!", source: "LEGOLAND Billund" },

  // G39 - LEGO House + Lalandia
  { day: 38, emoji: "🏠", text: "La LEGO House di Billund contiene 25 milioni di mattoncini e un albero della creatività alto 15 metri fatto interamente di LEGO — il più grande mai costruito.", source: "LEGO House" },

  // G40 - Billund → Brema (Germania)
  { day: 39, emoji: "🐴", text: "I Musicanti di Brema (asino, cane, gatto e gallo) non arrivarono mai a Brema nella fiaba dei Grimm — si fermarono prima! La statua in città è del 1951.", source: "Bremen Tourism" },

  // G41 - Brema → Amiens (Francia)
  { day: 40, emoji: "⛪", text: "La cattedrale di Amiens è la più grande cattedrale gotica di Francia per volume (200.000 m³) — ci entrerebbero 2 Notre-Dame di Parigi!", source: "UNESCO / Cathédrale Notre-Dame d'Amiens" },

  // G42 - Amiens → Loira
  { day: 41, emoji: "🏰", text: "La Valle della Loira ha oltre 300 castelli in 280 km — più castelli per km² di qualsiasi altra regione al mondo.", source: "Val de Loire UNESCO" },

  // G43 - Castelli della Loira (Clos Lucé, Chenonceau)
  { day: 42, emoji: "🎨", text: "Leonardo da Vinci trascorse gli ultimi 3 anni della sua vita al Clos Lucé, invitato da Francesco I. Morì qui nel 1519 — portò con sé la Gioconda dall'Italia!", source: "Château du Clos Lucé" },

  // G44 - Loira → San Sebastián
  { day: 43, emoji: "🍽️", text: "San Sebastián ha la più alta concentrazione di stelle Michelin per metro quadrato al mondo — 16 stelle in una città di 180.000 abitanti.", source: "Michelin Guide" },

  // G45 - San Sebastián → Bilbao (Guggenheim)
  { day: 44, emoji: "🐕", text: "\"Puppy\" davanti al Guggenheim di Bilbao è un cane di 12 metri ricoperto da 37.000 piante fiorite — viene ripiantato due volte l'anno!", source: "Guggenheim Bilbao" },

  // G46 - Bilbao → Picos de Europa (Fuente Dé)
  { day: 45, emoji: "🚡", text: "La funivia di Fuente Dé sale 753 metri in soli 4 minuti — è una delle più ripide d'Europa, con una vista a 360° sui Picos de Europa.", source: "Cantur" },

  // G47 - Picos → Palencia
  { day: 46, emoji: "✝️", text: "Il Cristo del Otero a Palencia è alto 20 metri — fu la seconda statua di Cristo più alta del mondo quando fu costruita nel 1931 (dopo il Corcovado di Rio).", source: "Ayuntamiento de Palencia" },

  // G48 - ECLISSI TOTALE DI SOLE
  { day: 47, emoji: "🌑", text: "L'eclissi del 12 agosto 2026 sarà totale per ~1 min 50 sec a Palencia. La prossima eclissi totale visibile dalla Spagna sarà nel 2090 — tra 64 anni!", source: "NASA Eclipse Predictions" },

  // G49 - Palencia → Costa Brava
  { day: 48, emoji: "🗿", text: "Cap de Creus è il punto più orientale della penisola iberica — le sue rocce erose dal vento ispirarono i paesaggi surreali di Salvador Dalí.", source: "Parc Natural de Cap de Creus" },

  // G50 - Costa Brava (Cadaqués)
  { day: 49, emoji: "🎨", text: "Cadaqués fu il rifugio di Dalí per 50 anni. La sua casa-museo a Portlligat ha uova giganti sul tetto e un labirinto di stanze collegate.", source: "Fundació Gala-Salvador Dalí" },

  // G51 - Costa Brava → Costa Azzurra
  { day: 50, emoji: "🏎️", text: "La Costa Azzurra prende il nome dal libro \"La Côte d'Azur\" (1887) dello scrittore Stéphen Liégeard — prima si chiamava semplicemente \"Riviera\".", source: "Office de Tourisme Côte d'Azur" },

  // G52 - Costa Azzurra → Genova (Acquario)
  { day: 51, emoji: "🐬", text: "L'Acquario di Genova è il più grande d'Italia e il secondo in Europa: 70 vasche, 12.000 animali di 600 specie, e una vasca tattile dove toccare le razze!", source: "Acquario di Genova" },

  // G53 - Genova
  { day: 52, emoji: "⛵", text: "Genova fu la \"Superba\" — la repubblica marinara più ricca del Medioevo. Cristoforo Colombo nacque qui nel 1451, e la sua casa è ancora visitabile.", source: "Comune di Genova" },

  // G54 - Genova → Selvazzano (ritorno!)
  { day: 53, emoji: "🏠", text: "Dopo 54 giorni, ~12.000 km e 13 paesi, il cerchio si chiude. La parola \"nostos\" (ritorno) + \"algos\" (dolore) dà \"nostalgia\" — ma voi tornate con 54 giorni di ricordi!", source: "Etimologia greca" }
];
