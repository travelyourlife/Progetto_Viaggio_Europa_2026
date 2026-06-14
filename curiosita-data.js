/**
 * curiosita-data.js — "Sapevi che?" curiosità giornaliere
 * ~25 pre-partenza (una al giorno dal 1 giugno al 25 giugno)
 * 54×3 = 162 durante il viaggio (3 per giorno, legate alla tappa)
 * Totale: ~187 curiosità
 *
 * Formato: { day: number, emoji: string, text: string, source: string }
 * - day < 0: pre-partenza (day = -25 significa 25 giorni prima della partenza)
 * - day >= 0: giorno di viaggio (0-indexed, G1 = day 0)
 *
 * Quando ci sono più curiosità per lo stesso giorno, il sistema le ruota
 * mostrando una diversa ogni volta (round-robin basato su lastCuriositaIndex).
 */

var CURIOSITA_DATA = [
  // ═══════════════════════════════════════════════════════
  // PRE-PARTENZA (25 curiosità, una al giorno)
  // ═══════════════════════════════════════════════════════

  { day: -25, emoji: "🗺️", text: "Il vostro viaggio coprirà circa 12.000 km — la stessa distanza che separa Roma da Tokyo in linea d'aria!", source: "Calcolo itinerario" },
  { day: -24, emoji: "🌍", text: "Attraverserete 13 paesi in 55 giorni — una media di un paese nuovo ogni 4 giorni! Quanti passaporti servirebbero senza l'UE?", source: "Calcolo itinerario" },
  { day: -23, emoji: "☀️", text: "A Tromsø, in Norvegia, il sole non tramonta dal 20 maggio al 22 luglio: 69 giorni consecutivi di luce!", source: "Institute of Marine Research, Norway" },
  { day: -22, emoji: "🌊", text: "I fiordi norvegesi possono raggiungere i 1.308 metri di profondità (Sognefjord) — più profondi del Grand Canyon!", source: "Norwegian Mapping Authority" },
  { day: -21, emoji: "🧱", text: "LEGOLAND Billund ha usato oltre 65 milioni di mattoncini LEGO solo per il Miniland — e ne aggiungono ogni anno.", source: "LEGOLAND Billund Resort" },
  { day: -20, emoji: "🦌", text: "In Lapponia finlandese ci sono più renne che abitanti: 200.000 renne per 180.000 persone.", source: "Reindeer Herders' Association, Finland" },
  { day: -19, emoji: "🌒", text: "Il 12 agosto 2026 ci sarà un'eclissi totale di sole visibile dalla Spagna — e voi sarete lì!", source: "NASA Eclipse 2026" },
  { day: -18, emoji: "🐋", text: "Nelle acque di Andenes (Vesterålen) vivono capodogli tutto l'anno — è uno dei pochi posti al mondo dove si avvistano con certezza.", source: "Whalesafari Andenes" },
  { day: -17, emoji: "🏛️", text: "Il Clos Lucé ad Amboise fu l'ultima dimora di Leonardo da Vinci. Nel parco ci sono 40 macchine costruite dai suoi disegni!", source: "Château du Clos Lucé" },
  { day: -16, emoji: "🎨", text: "Il Guggenheim di Bilbao è ricoperto da 33.000 lastre di titanio — ognuna spessa solo mezzo millimetro.", source: "Guggenheim Bilbao Museum" },
  { day: -15, emoji: "🇪🇪", text: "Tallinn ha il centro storico medievale meglio conservato del Nord Europa — Patrimonio UNESCO dal 1997.", source: "UNESCO World Heritage" },
  { day: -14, emoji: "🚐", text: "Il vostro camper percorrerà una media di 222 km al giorno — come andare da Padova a Firenze ogni singolo giorno per 55 giorni!", source: "Calcolo itinerario" },
  { day: -13, emoji: "🧖", text: "In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili! Ne proverete almeno una.", source: "Finnish Sauna Society" },
  { day: -12, emoji: "🏰", text: "Il castello di Chenonceau scavalca il fiume Cher con una galleria-ponte: è detto \"il castello delle dame\" perché plasmato da donne come Caterina de' Medici e Diana di Poitiers.", source: "Château de Chenonceau" },
  { day: -11, emoji: "🍽️", text: "San Sebastián sorge nei Paesi Baschi, che hanno una lingua propria — l'euskera — senza parentele note con nessun'altra lingua viva al mondo.", source: "Etxepare Basque Institute" },
  { day: -10, emoji: "🎢", text: "I Giardini di Tivoli a Copenhagen (1843) ispirarono Walt Disney per creare Disneyland. Disse: \"Se Tivoli può farlo, posso farlo anch'io\".", source: "Tivoli Gardens" },
  { day: -9, emoji: "🌧️", text: "Bergen è la città più piovosa d'Europa: piove in media 231 giorni all'anno. Portate l'impermeabile!", source: "Norwegian Meteorological Institute" },
  { day: -8, emoji: "⚽", text: "Henningsvær (Lofoten) ha il campo da calcio più scenografico del mondo: su un isolotto tra montagne e mare.", source: "Henningsvær Idrettslag" },
  { day: -7, emoji: "🎅", text: "A Rovaniemi una linea dipinta a terra segna il Circolo Polare Artico: si può letteralmente scavalcarla con un piede in ciascuna metà del mondo.", source: "Visit Rovaniemi" },
  { day: -6, emoji: "🚲", text: "A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone. Il 49% va al lavoro in bici!", source: "City of Copenhagen" },
  { day: -5, emoji: "🐬", text: "L'Acquario di Genova è il più grande d'Italia e il secondo in Europa: 70 vasche, 12.000 animali di 600 specie diverse.", source: "Acquario di Genova" },
  { day: -4, emoji: "🧗", text: "Il Preikestolen in Norvegia è una piattaforma rocciosa di 25×25m sospesa a 604 metri sopra il fiordo — senza ringhiere!", source: "Stavanger Turistforening" },
  { day: -3, emoji: "🌐", text: "L'Estonia è stato il primo paese al mondo a introdurre il voto elettronico vincolante via Internet in elezioni politiche nazionali, nel 2005.", source: "e-Estonia" },
  { day: -2, emoji: "🎈", text: "Vilnius ha una \"Repubblica di Užupis\" — un quartiere che si è autoproclamato stato indipendente nel 1997, con costituzione propria!", source: "Užupis Republic" },
  { day: -1, emoji: "🚐", text: "Domani si parte! 55 giorni, 13 paesi, 12.000 km. L'avventura della vita inizia tra poche ore!", source: "Quo Vadis" },

  // ═══════════════════════════════════════════════════════
  // DURANTE IL VIAGGIO (55 giorni × 3 curiosità = 165)
  // ═══════════════════════════════════════════════════════

  // G1 - Selvazzano → Leoben (Austria)
  { day: 0, emoji: "🍺", text: "Leoben ospita il birrificio Gösser, fondato nel 1860 — la birra più bevuta d'Austria. Il motto? \"Gut, besser, Gösser\" (Buona, migliore, Gösser).", source: "Brauerei Göss" },
  { day: 0, emoji: "⛏️", text: "Leoben è la capitale mineraria dell'Austria: la Montanuniversität (1840) è una delle più antiche università minerarie del mondo.", source: "Montanuniversität Leoben" },
  { day: 0, emoji: "🏔️", text: "L'Erzberg vicino a Leoben è la più grande miniera di ferro a cielo aperto dell'Europa centrale — attiva da oltre 1.300 anni senza interruzione.", source: "Abenteuer Erzberg" },

  // G2 - Leoben → Vienna
  { day: 1, emoji: "🎡", text: "La Riesenrad del Prater di Vienna gira dal 1897 — ha 127 anni ed è una delle ruote panoramiche più antiche del mondo ancora in funzione.", source: "Wiener Riesenrad" },
  { day: 1, emoji: "🎵", text: "Vienna ha più compositori famosi sepolti di qualsiasi altra città: Mozart, Beethoven, Schubert, Strauss, Brahms — tutti nello stesso cimitero (Zentralfriedhof).", source: "Wien Tourismus" },
  { day: 1, emoji: "🎂", text: "La Sachertorte originale è stata inventata a Vienna nel 1832 da Franz Sacher, che aveva solo 16 anni. La ricetta è ancora segreta!", source: "Hotel Sacher Wien" },

  // G3 - Vienna → Varsavia
  { day: 2, emoji: "🧜‍♀️", text: "Lo stemma di Varsavia è una sirena con spada e scudo — la leggenda dice che una sirena della Vistola protegge la città dai nemici.", source: "City of Warsaw" },
  { day: 2, emoji: "🏗️", text: "Il centro storico di Varsavia fu ricostruito mattone per mattone dopo la distruzione del 1944 — usando i dipinti di Canaletto come guida. È Patrimonio UNESCO.", source: "UNESCO World Heritage" },
  { day: 2, emoji: "🎹", text: "Varsavia ha panchine musicali sparse per la città che suonano brani di Chopin quando ti siedi — il compositore nacque qui nel 1810.", source: "Chopin Institute Warsaw" },

  // G4 - Varsavia → Vilnius (Lituania)
  { day: 3, emoji: "🎈", text: "Vilnius ha una \"Repubblica di Užupis\" — un quartiere bohémien che si è autoproclamato stato indipendente nel 1997, con costituzione e presidente.", source: "Užupis Republic" },
  { day: 3, emoji: "🎭", text: "La costituzione di Užupis include articoli come \"Un gatto non è obbligato ad amare il suo padrone, ma deve aiutarlo nei momenti di bisogno\".", source: "Užupis Constitution" },
  { day: 3, emoji: "🌳", text: "Vilnius è una delle capitali europee più verdi: i parchi e le foreste coprono il 40% della superficie della città.", source: "Vilnius Tourism" },

  // G5 - Vilnius → Riga (Lettonia)
  { day: 4, emoji: "🏛️", text: "Riga ha la più grande collezione di edifici Art Nouveau al mondo: oltre 800 palazzi decorati, concentrati in Alberta iela.", source: "Riga Art Nouveau Centre" },
  { day: 4, emoji: "✝️", text: "La Collina delle Croci vicino a Šiauliai ha oltre 200.000 croci piantate dai pellegrini — i sovietici la distrussero 3 volte, ma i lituani la ricostruirono sempre.", source: "Hill of Crosses" },
  { day: 4, emoji: "🍯", text: "La Lettonia ha la più alta percentuale di foreste nell'UE dopo Finlandia e Svezia: il 54% del territorio è coperto da boschi.", source: "Central Statistical Bureau of Latvia" },

  // G6 - Riga → Tallinn (Estonia)
  { day: 5, emoji: "💻", text: "L'Estonia è il paese più digitale del mondo: il 99% dei servizi pubblici è online. Puoi persino votare dal telefono!", source: "e-Estonia" },
  { day: 5, emoji: "🏰", text: "Il centro storico di Tallinn è così ben conservato che è stato usato come set per film ambientati nel Medioevo — sembra di entrare in un libro di storia.", source: "Visit Tallinn" },
  { day: 5, emoji: "🚀", text: "Skype è stato inventato in Estonia nel 2003 da sviluppatori estoni. Il paese ha il maggior numero di startup pro capite in Europa.", source: "Startup Estonia" },

  // G7 - Tallinn → Lappeenranta (Finlandia)
  { day: 6, emoji: "🧖", text: "In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili!", source: "Finnish Sauna Society" },
  { day: 6, emoji: "🏝️", text: "La Finlandia ha 187.888 laghi (con superficie > 500 m²) — è davvero il \"Paese dei mille laghi\", anzi dei quasi duecentomila!", source: "Finnish Environment Institute" },
  { day: 6, emoji: "☕", text: "I finlandesi sono i maggiori consumatori di caffè al mondo: 12 kg pro capite all'anno — il doppio degli italiani!", source: "International Coffee Organization" },

  // G8 - Lappeenranta → Punkaharju
  { day: 7, emoji: "🌲", text: "La cresta di Punkaharju è una formazione glaciale lunga 7 km tra due laghi — lo Zar Alessandro I la dichiarò paesaggio protetto nel 1803.", source: "Metsähallitus Finland" },
  { day: 7, emoji: "🎨", text: "Punkaharju ospita il Retretti Art Centre, un museo d'arte costruito dentro grotte naturali — l'acustica è così perfetta che ci fanno concerti.", source: "Visit Saimaa" },
  { day: 7, emoji: "🌅", text: "Il lago Saimaa è il quarto lago più grande d'Europa (4.380 km²) e ha oltre 13.000 isole — più isole che in molti arcipelaghi marini!", source: "Finnish Environment Institute" },

  // G9 - Regione dei Laghi (Saimaa)
  { day: 8, emoji: "🦭", text: "Nel lago Saimaa vive la foca degli anelli più rara del mondo: ne restano solo ~430 esemplari, intrappolati qui dalla fine dell'era glaciale.", source: "WWF Finland" },
  { day: 8, emoji: "🛶", text: "Il sistema lacustre di Saimaa ha oltre 14.000 km di costa — più della costa marittima di molti paesi europei!", source: "Finnish Environment Institute" },
  { day: 8, emoji: "🌌", text: "D'estate in Finlandia il cielo non diventa mai completamente buio — il fenomeno delle \"notti bianche\" dura da maggio ad agosto.", source: "Visit Finland" },

  // G10 - Laghi → Oulu
  { day: 9, emoji: "🎸", text: "Oulu ospita ogni anno i Campionati Mondiali di Air Guitar — sì, è una competizione seria dal 1996!", source: "Air Guitar World Championships" },
  { day: 9, emoji: "🚴", text: "Oulu è la città ciclabile più a nord del mondo: ha 600 km di piste ciclabili usate anche a -30°C con pneumatici chiodati!", source: "City of Oulu" },
  { day: 9, emoji: "📡", text: "Oulu è la \"Silicon Valley del Nord\": Nokia vi ha il più grande centro di ricerca, e la città ha più ingegneri pro capite di qualsiasi città finlandese.", source: "Business Oulu" },

  // G11 - Oulu → Ranua
  { day: 10, emoji: "🐻‍❄️", text: "Lo zoo artico di Ranua è l'unico zoo al mondo dove si possono vedere gli orsi polari a queste latitudini in un habitat quasi naturale.", source: "Ranua Wildlife Park" },
  { day: 10, emoji: "🦉", text: "A Ranua vivono oltre 50 specie artiche tra cui il gufo delle nevi, la volpe artica e il ghiottone — animali quasi impossibili da vedere in natura.", source: "Ranua Wildlife Park" },
  { day: 10, emoji: "❄️", text: "D'inverno a Ranua la temperatura può scendere a -45°C — ma d'estate (quando sarete voi) può superare i 25°C. Un'escursione termica di 70 gradi!", source: "Finnish Meteorological Institute" },

  // G12 - Ranua → Rovaniemi
  { day: 11, emoji: "🎅", text: "Rovaniemi riceve ogni anno oltre 500.000 lettere indirizzate a Babbo Natale da bambini di 198 paesi diversi.", source: "Santa Claus Main Post Office" },
  { day: 11, emoji: "🏗️", text: "Rovaniemi fu completamente distrutta dai tedeschi nel 1944 e ricostruita su progetto di Alvar Aalto — la pianta della città vista dall'alto ha la forma di una renna!", source: "City of Rovaniemi" },
  { day: 11, emoji: "🌡️", text: "Rovaniemi detiene il record finlandese di escursione termica annuale: da -45°C in inverno a +33°C in estate — 78 gradi di differenza!", source: "Finnish Meteorological Institute" },

  // G13 - Rovaniemi
  { day: 12, emoji: "📐", text: "Il Circolo Polare Artico (66°33'N) passa esattamente attraverso il Santa Claus Village — c'è una linea dipinta sul pavimento dove puoi attraversarlo!", source: "Arctic Circle marking, Rovaniemi" },
  { day: 12, emoji: "🏛️", text: "L'Arktikum di Rovaniemi è un museo scientifico con un tunnel di vetro lungo 172 metri che punta verso il Polo Nord — di notte si illumina come un'aurora.", source: "Arktikum Museum" },
  { day: 12, emoji: "📮", text: "L'ufficio postale di Babbo Natale ha un timbro speciale con il Circolo Polare Artico — ogni cartolina spedita da qui arriva con quel timbro unico.", source: "Santa Claus Main Post Office" },

  // G14 - Rovaniemi → Inari
  { day: 13, emoji: "🦌", text: "Il popolo Sami è l'unico popolo indigeno riconosciuto dell'UE. La loro lingua ha oltre 300 parole diverse per descrivere la neve e il ghiaccio.", source: "Sámi Parliament Finland" },
  { day: 13, emoji: "🌊", text: "Il lago Inari è il terzo lago più grande della Finlandia (1.040 km²) e ha oltre 3.000 isole — molte considerate sacre dai Sami.", source: "Metsähallitus" },
  { day: 13, emoji: "🏔️", text: "Il museo Siida a Inari documenta 10.000 anni di cultura Sami — il popolo che ha abitato queste terre dall'ultima era glaciale.", source: "Siida Museum" },

  // G15 - Inari → Kilpisjärvi
  { day: 14, emoji: "🪨", text: "A Kilpisjärvi c'è il Treriksröset: il punto dove si incontrano i confini di Finlandia, Svezia e Norvegia. Puoi stare in 3 paesi contemporaneamente!", source: "Kilpisjärvi Biological Station" },
  { day: 14, emoji: "🌿", text: "Kilpisjärvi è il punto più a nord-ovest della Finlandia — qui la tundra artica inizia e gli alberi smettono di crescere (treeline).", source: "University of Helsinki" },
  { day: 14, emoji: "🦅", text: "Nella zona di Kilpisjärvi nidifica l'aquila reale artica — una delle popolazioni più settentrionali del mondo.", source: "BirdLife Finland" },

  // G16 - Kilpisjärvi → Tromsø
  { day: 15, emoji: "⛪", text: "La Cattedrale Artica di Tromsø (Ishavskatedralen) ha una vetrata di 140 m² — una delle più grandi d'Europa, visibile anche di notte col sole di mezzanotte.", source: "Ishavskatedralen" },
  { day: 15, emoji: "🍺", text: "Tromsø ha il birrificio più settentrionale del mondo (Mack Bryggeri, fondato nel 1877) e la più alta concentrazione di pub pro capite della Norvegia.", source: "Mack Bryggeri" },
  { day: 15, emoji: "🌅", text: "A Tromsø il sole di mezzanotte dura dal 20 maggio al 22 luglio — quando sarete lì, il sole NON tramonterà mai. Nemmeno a mezzanotte!", source: "Visit Tromsø" },

  // G17 - Tromsø → Senja
  { day: 16, emoji: "👹", text: "Senja ospita il Troll più grande del mondo: Senjatrollet, alto 18 metri, con una grotta-museo dentro la pancia!", source: "Senjatrollet" },
  { day: 16, emoji: "🏝️", text: "Senja è la seconda isola più grande della Norvegia (1.586 km²) — i norvegesi la chiamano \"la Norvegia in miniatura\" perché ha fiordi, montagne e spiagge.", source: "Visit Senja" },
  { day: 16, emoji: "🦅", text: "Le aquile di mare (Havørn) di Senja hanno un'apertura alare di 2,5 metri — sono le più grandi aquile d'Europa e si vedono facilmente dalla strada.", source: "Norwegian Nature Inspectorate" },

  // G18 - Senja → Andenes
  { day: 17, emoji: "🚀", text: "Ad Andøya c'è una base spaziale attiva — la Andøya Space, da cui vengono lanciati razzi di ricerca scientifica nell'atmosfera dal 1962.", source: "Andøya Space" },
  { day: 17, emoji: "🐟", text: "Andenes era il centro della caccia alle balene in Norvegia — oggi le balene si osservano solo per turismo, con un tasso di avvistamento del 95%.", source: "Whalesafari Andenes" },
  { day: 17, emoji: "🌊", text: "La fossa oceanica al largo di Andenes scende a 2.500 metri a soli 7 km dalla costa — ecco perché i capodogli vengono così vicini!", source: "Institute of Marine Research, Norway" },

  // G19 - Andenes (Vesterålen)
  { day: 18, emoji: "🐋", text: "I capodogli di Andenes si immergono fino a 2.000 metri di profondità per cacciare calamari giganti — trattengono il respiro per 90 minuti!", source: "Whalesafari Andenes" },
  { day: 18, emoji: "🧠", text: "Il cervello del capodoglio pesa 7,8 kg — il più grande di qualsiasi animale mai esistito sulla Terra, 5 volte quello umano.", source: "National Geographic" },
  { day: 18, emoji: "📡", text: "I capodogli comunicano con \"click\" che viaggiano per chilometri sott'acqua — ogni individuo ha un pattern unico, come un'impronta digitale sonora.", source: "Whale Research Institute" },

  // G20 - Andenes → Svolvær (Lofoten)
  { day: 19, emoji: "🐟", text: "Le Lofoten producono il 70% di tutto lo stoccafisso norvegese — il merluzzo viene essiccato all'aria aperta sui caratteristici hjell da oltre 1.000 anni.", source: "Norwegian Seafood Council" },
  { day: 19, emoji: "🌡️", text: "Le Lofoten hanno la più grande anomalia termica positiva del mondo per la loro latitudine: sono a 68°N ma d'inverno non scendono mai sotto -5°C grazie alla Corrente del Golfo.", source: "Norwegian Meteorological Institute" },
  { day: 19, emoji: "🎨", text: "Svolvær è la \"capitale artistica\" delle Lofoten — ha più gallerie d'arte pro capite di qualsiasi città norvegese.", source: "Visit Lofoten" },

  // G21 - Svolvær → Henningsvær
  { day: 20, emoji: "⚽", text: "Henningsvær ha il campo da calcio più scenografico del mondo: costruito su un isolotto tra le montagne, circondato dal mare su tutti i lati.", source: "Henningsvær Idrettslag" },
  { day: 20, emoji: "🎣", text: "Henningsvær era il più grande villaggio di pescatori delle Lofoten — durante la stagione del merluzzo (gen-apr) la popolazione triplicava.", source: "Lofoten Museum" },
  { day: 20, emoji: "🌅", text: "Le Lofoten sono state votate come la terza isola più bella del mondo da National Geographic — davanti a Bali e alle Maldive!", source: "National Geographic Traveler" },

  // G22 - Lofoten (Spiagge)
  { day: 21, emoji: "🏖️", text: "Haukland Beach alle Lofoten è stata votata tra le 10 spiagge più belle del mondo — con sabbia bianca e acqua turchese... a 68° Nord!", source: "National Geographic" },
  { day: 21, emoji: "🏄", text: "Unstad Beach alle Lofoten è il surf spot più a nord del mondo — i surfisti cavalcano onde artiche con temperature dell'acqua di 6°C!", source: "Unstad Arctic Surf" },
  { day: 21, emoji: "🌊", text: "Le spiagge delle Lofoten hanno sabbia bianca formata da coralli e conchiglie triturate — non da quarzo come la maggior parte delle spiagge.", source: "Norwegian Geological Survey" },

  // G23 - Lofoten (Reine)
  { day: 22, emoji: "📸", text: "Reine è stata eletta \"villaggio più bello della Norvegia\" dalla rivista Allers nel 1970 — da allora è diventata l'immagine iconica delle Lofoten.", source: "Lofoten Tourism" },
  { day: 22, emoji: "🏔️", text: "Il Reinebringen (448m) offre la vista più fotografata della Norvegia — la salita dura 1h ma la vista su Reine vale ogni passo.", source: "Visit Norway" },
  { day: 22, emoji: "🎬", text: "Le Lofoten sono state location per film e serie TV internazionali grazie alla luce unica — il sole basso crea un'\"ora d'oro\" che dura ore.", source: "Nordnorsk Filmsenter" },

  // G24 - Lofoten (Nusfjord)
  { day: 23, emoji: "🏚️", text: "Nusfjord è uno dei villaggi di pescatori meglio conservati della Norvegia — le sue rorbu (capanne rosse) risalgono al 1800 e sono Patrimonio UNESCO.", source: "Nusfjord Arctic Resort" },
  { day: 23, emoji: "🔴", text: "Le rorbu rosse delle Lofoten devono il colore al \"rødfarge\" — una vernice a base di olio di fegato di merluzzo e ossido di ferro, usata da 500 anni.", source: "Norwegian Cultural Heritage" },
  { day: 23, emoji: "🐙", text: "Le acque delle Lofoten ospitano il più grande calamaro mai pescato in Norvegia: 12 metri di lunghezza, trovato nel 2017.", source: "University of Tromsø" },

  // G25 - Lofoten → Mo i Rana
  { day: 24, emoji: "🌀", text: "Il Saltstraumen vicino a Mo i Rana è la corrente di marea più forte del mondo: 400 milioni di m³ d'acqua passano in un canale stretto a 37 km/h!", source: "Visit Bodø" },
  { day: 24, emoji: "🦀", text: "Il Saltstraumen attira enormi quantità di pesce — i pescatori locali catturano merluzzi di 20+ kg grazie ai nutrienti portati dalla corrente.", source: "Norwegian Fisheries" },
  { day: 24, emoji: "🧊", text: "Il ghiacciaio Svartisen vicino a Mo i Rana è il secondo più grande della Norvegia (370 km²) — e uno dei pochi al mondo raggiungibile in barca.", source: "Norwegian Water Resources and Energy Directorate" },

  // G26 - Mo i Rana → Trondheim
  { day: 25, emoji: "🌐", text: "Oggi attraverserete il Circolo Polare Artico verso sud — il monumento Polarsirkelen segna il punto esatto a 66°33'N sulla E6.", source: "Polarsirkelsenteret" },
  { day: 25, emoji: "🛣️", text: "La E6 che percorrete è la strada più lunga della Norvegia: 2.580 km da Svinesund (sud) a Kirkenes (nord) — quasi come Roma-Londra!", source: "Norwegian Public Roads Administration" },
  { day: 25, emoji: "🌲", text: "Attraverserete l'Helgeland — una regione con 12.000 isole e la montagna Torghatten, che ha un buco naturale di 160m che la attraversa da parte a parte.", source: "Visit Helgeland" },

  // G27 - Trondheim
  { day: 26, emoji: "👑", text: "La cattedrale di Nidaros a Trondheim è il luogo di incoronazione dei re norvegesi dal Medioevo — e la chiesa più settentrionale del mondo in stile gotico.", source: "Nidaros Cathedral" },
  { day: 26, emoji: "🚲", text: "Trondheim ha il primo (e unico) ascensore per biciclette al mondo: il Trampe, una rampa che spinge i ciclisti su per una collina ripida dal 1993.", source: "City of Trondheim" },
  { day: 26, emoji: "🎓", text: "Trondheim è la città universitaria della Norvegia — NTNU ha 40.000 studenti, rendendo la città una delle più giovani e vivaci del paese.", source: "NTNU" },

  // G28 - Trondheim → Molde (Atlanterhavsveien)
  { day: 27, emoji: "🌊", text: "L'Atlanterhavsveien (Strada dell'Atlantico) è lunga solo 8,3 km ma ha 8 ponti che saltano da un isolotto all'altro — votata \"strada del secolo\" in Norvegia.", source: "Norwegian Public Roads Administration" },
  { day: 27, emoji: "🎬", text: "L'Atlanterhavsveien è stata usata in pubblicità automobilistiche e film — durante le tempeste le onde scavalcano la strada creando scene spettacolari.", source: "Visit Northwest" },
  { day: 27, emoji: "🌹", text: "Molde è chiamata \"la città delle rose\" — ha un roseto con 2.000 piante e una vista panoramica su 222 cime innevate dall'altra parte del fiordo.", source: "Visit Molde" },

  // G29 - Molde → Geiranger (Trollstigen)
  { day: 28, emoji: "🐉", text: "La Trollstigen (Scala dei Troll) ha 11 tornanti con pendenza del 10% e una cascata che attraversa la strada — aperta solo da maggio a ottobre.", source: "Visit Norway" },
  { day: 28, emoji: "🌊", text: "La cascata Stigfossen sulla Trollstigen cade per 320 metri — l'acqua nebulizzata bagna le auto che passano sotto. Chiudete i finestrini!", source: "Norwegian Public Roads Administration" },
  { day: 28, emoji: "👹", text: "Secondo la leggenda norvegese, i troll si pietrificano alla luce del sole — le montagne frastagliate della Trollstigen sarebbero troll trasformati in roccia.", source: "Norwegian Folklore" },

  // G30 - Geiranger → Bergen
  { day: 29, emoji: "💎", text: "Il Geirangerfjord è Patrimonio UNESCO dal 2005 — le cascate \"Sette Sorelle\" cadono per 250 metri direttamente nel fiordo.", source: "UNESCO World Heritage" },
  { day: 29, emoji: "🚢", text: "Il Geirangerfjord è lungo 15 km e profondo 260 m — le navi da crociera che ci entrano sembrano giocattoli tra le pareti rocciose alte 1.400 m.", source: "Geiranger Fjordservice" },
  { day: 29, emoji: "🏚️", text: "Sulle pareti del Geirangerfjord ci sono fattorie abbandonate raggiungibili solo in barca o con scale a pioli — ci vivevano famiglie fino agli anni '60.", source: "Geiranger World Heritage" },

  // G31 - Bergen
  { day: 30, emoji: "🌧️", text: "Bergen è la città più piovosa d'Europa: piove in media 231 giorni all'anno (2.250 mm). I locali dicono: \"Non esiste cattivo tempo, solo cattivo abbigliamento\".", source: "Norwegian Meteorological Institute" },
  { day: 30, emoji: "🏘️", text: "Bryggen, il quartiere anseatico di Bergen, ha case in legno del XIV secolo — è Patrimonio UNESCO e il quartiere in legno più antico del Nord Europa.", source: "UNESCO World Heritage" },
  { day: 30, emoji: "🐟", text: "Il mercato del pesce di Bergen (Fisketorget) è attivo dal 1276 — quasi 750 anni di commercio ininterrotto nello stesso posto!", source: "Visit Bergen" },

  // G32 - Bergen → Stavanger (Preikestolen)
  { day: 31, emoji: "🧗", text: "Il Preikestolen (Pulpito) è una piattaforma rocciosa piatta di 25×25 metri sospesa a 604 metri sopra il Lysefjord — senza ringhiere!", source: "Stavanger Turistforening" },
  { day: 31, emoji: "🛢️", text: "Stavanger è la \"capitale del petrolio\" della Norvegia — il Norwegian Petroleum Museum racconta come il petrolio del Mare del Nord ha reso la Norvegia il paese più ricco d'Europa.", source: "Norwegian Petroleum Museum" },
  { day: 31, emoji: "🗡️", text: "A Stavanger ci sono tre spade giganti di 10 metri conficcate nella roccia (Sverd i fjell) — commemorano la battaglia che unificò la Norvegia nell'872.", source: "Visit Stavanger" },

  // G33 - Stavanger → Kristiansand
  { day: 32, emoji: "⛰️", text: "Il Kjeragbolten è un masso di 5 m³ incastrato tra due pareti rocciose a 984 metri d'altezza — la foto in piedi sopra è un classico (vertiginoso!) norvegese.", source: "Visit Norway" },
  { day: 32, emoji: "🏖️", text: "Kristiansand è la \"Riviera norvegese\" — ha le temperature estive più alte della Norvegia e spiagge di sabbia bianca dove i norvegesi vanno in vacanza.", source: "Visit Kristiansand" },
  { day: 32, emoji: "🦁", text: "Lo zoo di Kristiansand è il più grande della Norvegia e l'unico con animali africani — ha anche un parco acquatico e un villaggio di Capitan Sabertooth.", source: "Kristiansand Dyrepark" },

  // G34 - Kristiansand → Copenhagen
  { day: 33, emoji: "🚢", text: "Il traghetto Kristiansand-Hirtshals attraversa lo Skagerrak in ~2h30 — lo stesso stretto dove nel 1940 affondò l'incrociatore tedesco Blücher.", source: "Color Line" },
  { day: 33, emoji: "🌊", text: "Lo Skagerrak è il punto dove Mare del Nord e Mar Baltico si incontrano — le correnti creano onde particolari visibili dalla nave.", source: "Danish Meteorological Institute" },
  { day: 33, emoji: "🇩🇰", text: "La Danimarca è composta da 443 isole (di cui 78 abitate) — il paese è così piatto che il punto più alto è solo 170 metri!", source: "Visit Denmark" },

  // G35 - Copenhagen (Tivoli)
  { day: 34, emoji: "🎢", text: "I Giardini di Tivoli a Copenhagen, aperti nel 1843, sono il secondo parco divertimenti più antico del mondo — e ispirarono Walt Disney per Disneyland!", source: "Tivoli Gardens" },
  { day: 34, emoji: "🧜‍♀️", text: "La Sirenetta di Copenhagen è alta solo 1,25 metri — è una delle attrazioni più piccole e più fotografate del mondo (dal 1913).", source: "Visit Copenhagen" },
  { day: 34, emoji: "🏰", text: "Il Castello di Rosenborg a Copenhagen custodisce i gioielli della corona danese — inclusa una corona con 2.500 diamanti e una spada del 1551.", source: "Rosenborg Castle" },

  // G36 - Copenhagen
  { day: 35, emoji: "🚲", text: "A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone. Il 49% dei residenti va al lavoro in bici ogni giorno.", source: "City of Copenhagen" },
  { day: 35, emoji: "🏘️", text: "Nyhavn, il porto colorato di Copenhagen, fu costruito nel 1671 come porto commerciale — Hans Christian Andersen visse qui ai numeri 18, 20 e 67.", source: "Visit Copenhagen" },
  { day: 35, emoji: "♻️", text: "Copenhagen punta a diventare la prima capitale carbon-neutral del mondo. L'inceneritore Amager Bakke ha una pista da sci sul tetto!", source: "City of Copenhagen" },

  // G37 - Copenhagen → Billund
  { day: 36, emoji: "🧱", text: "La parola LEGO viene dal danese \"leg godt\" che significa \"gioca bene\". L'azienda fu fondata nel 1932 a Billund da un falegname, Ole Kirk Christiansen.", source: "LEGO Group" },
  { day: 36, emoji: "🏭", text: "La fabbrica LEGO di Billund produce 36 miliardi di mattoncini all'anno — circa 1.140 pezzi al secondo, 24 ore su 24!", source: "LEGO Group" },
  { day: 36, emoji: "🌍", text: "Billund era un villaggio di 300 abitanti prima della LEGO — oggi è una città di 6.800 persone con il secondo aeroporto più grande della Danimarca.", source: "Billund Municipality" },

  // G38 - Legoland
  { day: 37, emoji: "🏗️", text: "LEGOLAND Billund ha un modello del Monte Rushmore fatto con 1,5 milioni di mattoncini — ci sono voluti 3 anni per costruirlo!", source: "LEGOLAND Billund" },
  { day: 37, emoji: "🤖", text: "Il Miniland di LEGOLAND Billund riproduce monumenti di tutto il mondo con 20 milioni di mattoncini — i modelli si muovono, hanno luci e suoni.", source: "LEGOLAND Billund" },
  { day: 37, emoji: "📏", text: "Il mattoncino LEGO è prodotto con una tolleranza di 0,002 mm — più preciso di un orologio svizzero. Ecco perché i pezzi del 1958 si incastrano ancora con quelli di oggi.", source: "LEGO Group" },

  // G39 - LEGO House + Lalandia
  { day: 38, emoji: "🏠", text: "La LEGO House di Billund contiene 25 milioni di mattoncini e un albero della creatività alto 15 metri fatto interamente di LEGO — il più grande mai costruito.", source: "LEGO House" },
  { day: 38, emoji: "🦖", text: "Nella LEGO House c'è un dinosauro a grandezza naturale fatto con 750.000 mattoncini — ci sono voluti 24.000 ore di lavoro per assemblarlo.", source: "LEGO House" },
  { day: 38, emoji: "🌊", text: "Lalandia Billund ha la più grande piscina tropicale della Scandinavia — con onde, scivoli e 25°C costanti, anche se fuori piove!", source: "Lalandia" },

  // G40 - Billund → Brema (Germania)
  { day: 39, emoji: "🐴", text: "I Musicanti di Brema (asino, cane, gatto e gallo) non arrivarono mai a Brema nella fiaba dei Grimm — si fermarono prima! La statua in città è del 1953.", source: "Bremen Tourism" },
  { day: 39, emoji: "🤞", text: "Toccare le zampe dell'asino nella statua dei Musicanti di Brema porta fortuna — sono lucide per i milioni di mani che le hanno strofinate!", source: "Bremen Tourism" },
  { day: 39, emoji: "🚀", text: "Brema è una città-stato (come Berlino e Amburgo) ed è sede dell'Airbus Defence & Space — qui si costruiscono moduli della Stazione Spaziale Internazionale.", source: "Airbus Bremen" },

  // G41 - Brema → Amiens (Francia)
  { day: 40, emoji: "⛪", text: "La cattedrale di Amiens è la più grande cattedrale gotica di Francia per volume (200.000 m³) — ci entrerebbero 2 Notre-Dame di Parigi!", source: "UNESCO / Cathédrale Notre-Dame d'Amiens" },
  { day: 40, emoji: "💡", text: "Di notte la cattedrale di Amiens viene illuminata con i colori originali medievali — nel Medioevo le cattedrali erano dipinte a colori vivaci, non grigie!", source: "Amiens Métropole" },
  { day: 40, emoji: "📖", text: "Jules Verne visse ad Amiens per 34 anni e scrisse qui la maggior parte dei suoi romanzi — la sua casa è ora un museo con 15.000 documenti.", source: "Maison de Jules Verne" },

  // G42 - Amiens → Loira
  { day: 41, emoji: "🏰", text: "La Valle della Loira ha oltre 300 castelli in 280 km — più castelli per km² di qualsiasi altra regione al mondo.", source: "Val de Loire UNESCO" },
  { day: 41, emoji: "🏰", text: "Il Castello di Chambord ha 440 stanze, 365 camini e una scala a doppia elica progettata (forse) da Leonardo da Vinci — due persone salgono senza mai incontrarsi.", source: "Château de Chambord" },
  { day: 41, emoji: "🌹", text: "Il Castello di Villandry ha i giardini rinascimentali più belli di Francia — 52.000 piante vengono sostituite due volte l'anno per mantenere i disegni geometrici.", source: "Château de Villandry" },

  // G43 - Castelli della Loira (Clos Lucé, Chenonceau)
  { day: 42, emoji: "🎨", text: "Leonardo da Vinci trascorse gli ultimi 3 anni della sua vita al Clos Lucé, invitato da Francesco I. Morì qui nel 1519 — portò con sé la Gioconda dall'Italia!", source: "Château du Clos Lucé" },
  { day: 42, emoji: "👸", text: "Il Castello di Chenonceau è chiamato \"il castello delle donne\" — fu costruito, ampliato e salvato da 6 donne diverse in 400 anni.", source: "Château de Chenonceau" },
  { day: 42, emoji: "🌉", text: "Chenonceau è l'unico castello costruito su un fiume — il suo ponte-galleria sul Cher fu usato come via di fuga durante la Seconda Guerra Mondiale.", source: "Château de Chenonceau" },

  // G44 - Loira → San Sebastián
  { day: 43, emoji: "🍽️", text: "San Sebastián ha la più alta concentrazione di stelle Michelin per metro quadrato al mondo — 19 stelle in una città di 180.000 abitanti.", source: "Michelin Guide" },
  { day: 43, emoji: "🍢", text: "I pintxos di San Sebastián non sono tapas — sono mini-capolavori gastronomici serviti su stuzzicadenti. Un giro dei bar del centro è un'esperienza obbligatoria!", source: "San Sebastián Turismo" },
  { day: 43, emoji: "🏖️", text: "La Playa de la Concha di San Sebastián è stata votata la spiaggia urbana più bella d'Europa — una mezzaluna perfetta nel centro della città.", source: "TripAdvisor" },

  // G45 - San Sebastián → Bilbao (Guggenheim)
  { day: 44, emoji: "🐕", text: "\"Puppy\" davanti al Guggenheim di Bilbao è un cane di 12 metri ricoperto da 37.000 piante fiorite — viene ripiantato due volte l'anno!", source: "Guggenheim Bilbao" },
  { day: 44, emoji: "🏗️", text: "Il Guggenheim di Bilbao ha trasformato una città industriale in declino in una meta turistica mondiale — l'\"effetto Bilbao\" è studiato nelle università.", source: "Guggenheim Bilbao" },
  { day: 44, emoji: "🕷️", text: "\"Maman\", il ragno gigante di Louise Bourgeois davanti al Guggenheim, è alto 9 metri e pesa 8 tonnellate — sotto la pancia ha 26 uova di marmo.", source: "Guggenheim Bilbao" },

  // G46 - Bilbao → Picos de Europa (Fuente Dé)
  { day: 45, emoji: "🚡", text: "La funivia di Fuente Dé sale 753 metri in soli 4 minuti — è una delle più ripide d'Europa, con una vista a 360° sui Picos de Europa.", source: "Cantur" },
  { day: 45, emoji: "🐺", text: "I Picos de Europa ospitano lupi, orsi bruni e avvoltoi — è una delle ultime aree selvagge dell'Europa occidentale.", source: "Parque Nacional Picos de Europa" },
  { day: 45, emoji: "🧀", text: "Il formaggio Cabrales dei Picos de Europa viene stagionato in grotte naturali a 1.000m di altitudine — il suo sapore intenso è famoso in tutto il mondo.", source: "DOP Cabrales" },

  // G47 - Picos → Palencia
  { day: 46, emoji: "✝️", text: "Il Cristo del Otero a Palencia è alto 20 metri — fu la seconda statua di Cristo più alta del mondo quando fu costruita nel 1931 (dopo il Corcovado di Rio).", source: "Ayuntamiento de Palencia" },
  { day: 46, emoji: "🏛️", text: "Palencia ha la prima università della Spagna, fondata nel 1208 — 10 anni prima di Salamanca. Fu chiusa dopo soli 55 anni e dimenticata dalla storia.", source: "Universidad de Palencia" },
  { day: 46, emoji: "🌾", text: "La Meseta castigliana intorno a Palencia è il \"granaio della Spagna\" — campi di grano a perdita d'occhio a 800m di altitudine, con tramonti spettacolari.", source: "Junta de Castilla y León" },

  // G48 - ECLISSI TOTALE DI SOLE
  { day: 47, emoji: "🌑", text: "L'eclissi del 12 agosto 2026 sarà totale per ~1 min 50 sec a Palencia. La prossima eclissi totale visibile dalla Spagna sarà nel 2090 — tra 64 anni!", source: "NASA Eclipse Predictions" },
  { day: 47, emoji: "⭐", text: "Durante la totalità dell'eclissi vedrete la corona solare — un alone di plasma a 2 milioni di gradi, visibile solo quando la Luna copre il disco solare.", source: "NASA" },
  { day: 47, emoji: "🌡️", text: "Durante un'eclissi totale la temperatura può calare di 5-10°C in pochi minuti — gli animali si confondono e pensano sia notte!", source: "Royal Astronomical Society" },

  // G49 - Palencia → Costa Brava
  { day: 48, emoji: "🗿", text: "Cap de Creus è il punto più orientale della penisola iberica — le sue rocce erose dal vento ispirarono i paesaggi surreali di Salvador Dalí.", source: "Parc Natural de Cap de Creus" },
  { day: 48, emoji: "💨", text: "La Tramontana a Cap de Creus può soffiare a 150 km/h — il vento ha scolpito le rocce in forme così strane che Dalí le dipingeva nei suoi quadri.", source: "Servei Meteorològic de Catalunya" },
  { day: 48, emoji: "🐙", text: "La Costa Brava ha una riserva marina protetta a Cap de Creus — con posidonia, cernie giganti e corallo rosso a pochi metri dalla riva.", source: "Parc Natural de Cap de Creus" },

  // G50 - Costa Brava (Cadaqués)
  { day: 49, emoji: "🎨", text: "Cadaqués fu il rifugio di Dalí per 50 anni. La sua casa-museo a Portlligat ha uova giganti sul tetto e un labirinto di stanze surreali.", source: "Fundació Dalí" },
  { day: 49, emoji: "🎭", text: "Il Teatro-Museo Dalí a Figueres è il museo più visitato della Spagna dopo il Prado — Dalí è sepolto sotto il palcoscenico, come volle lui.", source: "Fundació Dalí" },
  { day: 49, emoji: "🐟", text: "Cadaqués era un villaggio di pescatori così isolato (raggiungibile solo via mare) che sviluppò un dialetto catalano unico, ancora parlato oggi.", source: "Ajuntament de Cadaqués" },

  // G51 - Costa Brava → Costa Azzurra
  { day: 50, emoji: "🏎️", text: "La Costa Azzurra prende il nome dal libro \"La Côte d'Azur\" (1887) dello scrittore Stéphen Liégeard — prima si chiamava semplicemente \"Riviera\".", source: "Office de Tourisme Côte d'Azur" },
  { day: 50, emoji: "🎬", text: "Il Festival di Cannes proietta circa 200 film in 12 giorni — ma solo 20 competono per la Palma d'Oro. Il red carpet è lungo 60 metri.", source: "Festival de Cannes" },
  { day: 50, emoji: "🌿", text: "Grasse, nell'entroterra della Costa Azzurra, è la capitale mondiale del profumo — produce il 66% dei profumi francesi da oltre 400 anni.", source: "Ville de Grasse" },

  // G52 - Costa Azzurra → Genova (Acquario)
  { day: 51, emoji: "🐬", text: "L'Acquario di Genova è il più grande d'Italia e il secondo in Europa: 70 vasche, 12.000 animali di 600 specie, e una vasca tattile dove toccare le razze!", source: "Acquario di Genova" },
  { day: 51, emoji: "🌐", text: "L'Acquario di Genova fu costruito da Renzo Piano per l'Expo 1992 (500 anni dalla scoperta dell'America) — la struttura sembra una nave in porto.", source: "Acquario di Genova" },
  { day: 51, emoji: "🦈", text: "L'Acquario di Genova ha la più grande vasca di squali del Mediterraneo — con squali martello, mante e una ricostruzione della barriera corallina.", source: "Acquario di Genova" },

  // G53 - Genova
  { day: 52, emoji: "⛵", text: "Genova fu la \"Superba\" — la repubblica marinara più ricca del Medioevo. Cristoforo Colombo nacque qui nel 1451, e la sua casa è ancora visitabile.", source: "Comune di Genova" },
  { day: 52, emoji: "🍝", text: "Il pesto alla genovese ha solo 7 ingredienti (basilico DOP, pinoli, aglio, parmigiano, pecorino, olio, sale) — e il basilico DEVE essere di Prà, un quartiere di Genova.", source: "Consorzio del Pesto Genovese" },
  { day: 52, emoji: "🏘️", text: "I \"caruggi\" di Genova formano il centro storico medievale più grande d'Europa — un labirinto di 5 km² dove il sole non entra mai.", source: "Comune di Genova" },

  // G54 - Genova → Selvazzano (ritorno!)
  { day: 54, emoji: "🏠", text: "Dopo 55 giorni, ~12.000 km e 13 paesi, il cerchio si chiude. La parola \"nostos\" (ritorno) + \"algos\" (dolore) dà \"nostalgia\" — ma voi tornate con 55 giorni di ricordi!", source: "Etimologia greca" },
  { day: 53, emoji: "📊", text: "In 55 giorni avete attraversato 7 fusi orari (da UTC+1 a UTC+3 e ritorno), 4 mari (Adriatico, Baltico, Artico, Mediterraneo) e 2 oceani (Atlantico e Artico).", source: "Calcolo itinerario" },
  { day: 53, emoji: "🌍", text: "Il punto più a nord del viaggio (Andenes, 69°N) e il più a sud (Costa Brava, 42°N) distano 27 gradi di latitudine — 3.000 km in linea retta!", source: "Calcolo itinerario" }
,
  {
    day: 54,
    city: "Genova → Selvazzano",
    cityEn: "Genoa → Selvazzano",
    fact: "Genova ha dato i natali a Cristoforo Colombo e a Giuseppe Garibaldi. La città possiede il più grande centro storico medievale d'Europa — 4,5 km² di caruggi, più esteso di quello di Venezia.",
    factEn: "Genoa is the birthplace of Christopher Columbus and Giuseppe Garibaldi. The city has the largest medieval historic center in Europe — 4.5 km² of narrow lanes, larger than Venice's.",
    emoji: "🏠"
  },
  // ── v2.88: curiosita aggiunte per raggiungere 3/giorno ──
  { day: -25, emoji: "🧭", text: "L'itinerario tocca il punto più a nord a Andenes (69°N) e il più a sud sulla Costa Brava (42°N): 27 gradi di latitudine, come passare dall'Artico al Mediterraneo.", source: "Calcolo itinerario" },
  { day: -25, emoji: "📦", text: "Un viaggio di 55 giorni in camper richiede in media 70-90 litri d'acqua potabile a bordo per famiglia: per questo i camper hanno serbatoi da 100+ litri.", source: "ADAC Camping" },
  { day: -24, emoji: "🛂", text: "Grazie all'area Schengen attraverserete la maggior parte dei confini senza controlli passaporto: 29 paesi europei ne fanno parte.", source: "European Commission" },
  { day: -24, emoji: "💶", text: "Dei 13 paesi del viaggio, non tutti usano l'euro: Polonia (złoty), Danimarca (corona danese), Norvegia (corona norvegese) e Svezia hanno valute proprie.", source: "European Central Bank" },
  { day: -23, emoji: "🌌", text: "In inverno, sopra il Circolo Polare Artico, il sole non sorge per settimane: è la \"notte polare\". D'estate accade l'opposto, con il sole di mezzanotte.", source: "Norwegian Polar Institute" },
  { day: -23, emoji: "🧭", text: "Il Circolo Polare Artico si trova a 66°33' di latitudine nord: lo supererete dirigendovi verso le Lofoten e Andenes.", source: "National Geographic" },
  { day: -22, emoji: "🚢", text: "Il Geirangerfjord e il Nærøyfjord sono Patrimonio UNESCO dal 2005, tra i fiordi più stretti e spettacolari del mondo.", source: "UNESCO World Heritage" },
  { day: -22, emoji: "💧", text: "La Norvegia produce circa il 90% della sua elettricità dall'energia idroelettrica, grazie a fiordi e montagne ricche d'acqua.", source: "International Energy Agency" },
  { day: -21, emoji: "🧱", text: "Il primo mattoncino LEGO nella forma attuale fu brevettato il 28 gennaio 1958: ancora oggi si incastra con quelli prodotti allora.", source: "The LEGO Group" },
  { day: -21, emoji: "🇩🇰", text: "La parola \"LEGO\" viene dal danese \"leg godt\", cioè \"gioca bene\". L'azienda nacque a Billund nel 1932.", source: "The LEGO Group" },
  { day: -20, emoji: "❄️", text: "In lappone (sámi) esistono decine di parole per descrivere la neve e le renne in base a età, colore e comportamento.", source: "Sámi University of Applied Sciences" },
  { day: -20, emoji: "🌙", text: "La Lapponia è uno dei posti migliori al mondo per vedere l'aurora boreale, visibile in media più di 200 notti all'anno nelle zone più a nord.", source: "Finnish Meteorological Institute" },
  { day: -19, emoji: "🔭", text: "Quella del 12 agosto 2026 sarà la prima eclissi solare totale visibile dall'Europa continentale dal 1999: un'attesa di 27 anni.", source: "timeanddate.com" },
  { day: -19, emoji: "🌞", text: "L'ultima eclissi solare totale visibile dalla Spagna risale al 30 agosto 1905: oltre un secolo fa.", source: "Wikipedia / NASA" },
  { day: -18, emoji: "🐳", text: "I capodogli sono i più grandi predatori dotati di denti del pianeta e possono immergersi oltre 1.000 metri a caccia di calamari giganti.", source: "NOAA Fisheries" },
  { day: -18, emoji: "🏝️", text: "Le isole Vesterålen e Lofoten si trovano sopra il Circolo Polare Artico ma hanno un clima mite per la latitudine, grazie alla Corrente del Golfo.", source: "Norwegian Meteorological Institute" },
  { day: -17, emoji: "🎨", text: "Leonardo da Vinci portò con sé la Gioconda in Francia e morì ad Amboise nel 1519: per questo il dipinto è oggi al Louvre.", source: "Musée du Louvre" },
  { day: -17, emoji: "🏰", text: "La Loira ospita Chambord, il castello più grande della valle: ha 440 stanze e una celebre scala a doppia elica attribuita a idee di Leonardo.", source: "Domaine national de Chambord" },
  { day: -16, emoji: "🕷️", text: "Davanti al Guggenheim di Bilbao c'è \"Puppy\", un cane alto 12 metri ricoperto di fiori veri, opera di Jeff Koons.", source: "Guggenheim Bilbao Museum" },
  { day: -16, emoji: "🌉", text: "Il museo di Bilbao, aperto nel 1997 e progettato da Frank Gehry, è considerato uno dei simboli dell'architettura contemporanea mondiale.", source: "Guggenheim Bilbao Museum" },
  { day: -15, emoji: "🗼", text: "La cinta muraria medievale di Tallinn conserva ancora circa 1,9 km di mura e una ventina di torri difensive.", source: "Visit Tallinn" },
  { day: -15, emoji: "🇪🇪", text: "L'Estonia ha riconquistato l'indipendenza nel 1991 con la \"Rivoluzione cantata\", in cui centinaia di migliaia di persone protestarono cantando.", source: "Estonica / Estonian Institute" },
  { day: -14, emoji: "⛽", text: "In Norvegia oltre il 90% delle auto nuove vendute è elettrico: è il paese con la più alta quota di veicoli elettrici al mondo.", source: "Norwegian EV Association" },
  { day: -14, emoji: "🛣️", text: "Il tunnel di Lærdal, in Norvegia, è il tunnel stradale più lungo del mondo: 24,5 km, con grotte illuminate per spezzare la monotonia.", source: "Visit Norway" },
  { day: -13, emoji: "🌊", text: "La Finlandia è chiamata \"il paese dei mille laghi\", ma in realtà ne ha circa 188.000: il numero più alto al mondo rispetto alla superficie.", source: "finland.fi" },
  { day: -13, emoji: "📚", text: "La sauna è così radicata nella cultura finlandese che l'UNESCO l'ha inserita nel 2020 tra i patrimoni culturali immateriali dell'umanità.", source: "UNESCO" },
  { day: -12, emoji: "🍷", text: "La Valle della Loira è anche una delle più grandi regioni vinicole della Francia, celebre per i vini bianchi come Sancerre e Vouvray.", source: "Vins de Loire" },
  { day: -12, emoji: "🌅", text: "La Loira è il fiume più lungo della Francia: 1.006 km dal Massiccio Centrale all'Atlantico.", source: "Géoportail / IGN France" },
  { day: -11, emoji: "🥘", text: "Nei bar dei Paesi Baschi gli stuzzichini si chiamano \"pintxos\": piccoli bocconi serviti sul bancone, spesso infilzati con uno stecchino.", source: "Basque Culinary Center" },
  { day: -11, emoji: "🌊", text: "La spiaggia urbana di La Concha, a San Sebastián, è spesso citata tra le più belle d'Europa per la sua forma a conchiglia.", source: "San Sebastián Turismo" },
  { day: -10, emoji: "🎠", text: "Il Rutschebanen di Tivoli (1914) è una delle montagne russe in legno più antiche del mondo ancora in funzione, con un frenatore a bordo.", source: "Tivoli Gardens" },
  { day: -10, emoji: "🏙️", text: "Copenhagen punta a diventare la prima capitale al mondo a emissioni di CO₂ nette zero, obiettivo verso cui lavora da anni.", source: "City of Copenhagen" },
  { day: -9, emoji: "🏠", text: "Il quartiere di Bryggen a Bergen, con le sue case di legno colorate sul porto, è Patrimonio UNESCO e ricorda il passato della Lega Anseatica.", source: "UNESCO World Heritage" },
  { day: -9, emoji: "🚠", text: "La funicolare Fløibanen porta da Bergen alla cima del monte Fløyen in pochi minuti, con una vista panoramica sulla città e i fiordi.", source: "Fløibanen" },
  { day: -8, emoji: "🐟", text: "Alle Lofoten il merluzzo viene essiccato all'aperto su grandi rastrelliere di legno: lo \"stoccafisso\" è esportato da secoli, anche in Italia.", source: "Norwegian Seafood Council" },
  { day: -8, emoji: "🎣", text: "Il merluzzo artico (skrei) migra ogni inverno verso le Lofoten per riprodursi: una tradizione di pesca che risale all'epoca vichinga.", source: "Institute of Marine Research, Norway" },
  { day: -7, emoji: "🎄", text: "Rovaniemi, in Lapponia, è considerata la città ufficiale di Babbo Natale e si trova proprio sul Circolo Polare Artico.", source: "Visit Rovaniemi" },
  { day: -7, emoji: "🦌", text: "Nella tradizione, la slitta di Babbo Natale è trainata dalle renne: in Lapponia le renne sono allevate dai sámi da generazioni.", source: "Visit Finland" },
  { day: -6, emoji: "🧜‍♀️", text: "La statua della Sirenetta di Copenhagen (1913), ispirata alla fiaba di Andersen, è alta appena 1,25 metri: molti visitatori la trovano più piccola del previsto.", source: "Visit Copenhagen" },
  { day: -6, emoji: "🌈", text: "Il quartiere di Nyhavn, con le sue case colorate sul canale, fu per un periodo la casa dello scrittore Hans Christian Andersen.", source: "Visit Copenhagen" },
  { day: -5, emoji: "🐠", text: "L'Acquario di Genova fu inaugurato nel 1992 per le celebrazioni colombiane dei 500 anni dalla scoperta dell'America.", source: "Acquario di Genova" },
  { day: -5, emoji: "⚓", text: "Il Porto Antico di Genova, dove sorge l'Acquario, fu ridisegnato dall'architetto genovese Renzo Piano.", source: "Comune di Genova" },
  { day: -4, emoji: "🥾", text: "Per raggiungere il Preikestolen serve un'escursione di circa 4 km a piedi, con un dislivello di quasi 350 metri.", source: "Stavanger Turistforening" },
  { day: -4, emoji: "🪨", text: "Un'altra meta vertiginosa norvegese è il Kjeragbolten: un masso incastrato tra due pareti rocciose sopra un baratro di quasi 1.000 metri.", source: "Visit Norway" },
  { day: -3, emoji: "🆔", text: "L'Estonia ha inventato la \"e-Residency\": dal 2014 chiunque nel mondo può ottenere un'identità digitale estone per avviare un'impresa online.", source: "e-Estonia" },
  { day: -3, emoji: "📶", text: "L'Estonia è stata tra i primi paesi a dichiarare l'accesso a Internet un diritto e a offrire Wi-Fi pubblico diffuso già dai primi anni 2000.", source: "e-Estonia" },
  { day: -2, emoji: "🎨", text: "Užupis, a Vilnius, celebra ogni 1° aprile la \"Festa dell'Indipendenza\": per un giorno si timbrano i passaporti all'ingresso del quartiere.", source: "Užupis Republic" },
  { day: -2, emoji: "📜", text: "La costituzione di Užupis è esposta su una parete in decine di lingue diverse, comprese traduzioni aggiunte negli anni dai visitatori.", source: "Užupis Republic" },
  { day: -1, emoji: "🎒", text: "Consiglio dell'ultimo minuto: in viaggio in camper conviene caricare il peso in basso e al centro per migliorare stabilità e consumi.", source: "ADAC Camping" },
  { day: -1, emoji: "🗺️", text: "13 paesi, 4 mari e 2 oceani vi aspettano: dall'Adriatico al Baltico, dall'Artico al Mediterraneo. Si parte!", source: "Quo Vadis" },
  { day: 53, emoji: "🏛️", text: "Genova vanta i \"Palazzi dei Rolli\", 42 dimore nobiliari Patrimonio UNESCO dal 2006, un tempo usate per ospitare gli ospiti di Stato.", source: "UNESCO World Heritage" },
  { day: 54, emoji: "🌿", text: "La Lanterna di Genova, alta 77 metri, è uno dei fari più antichi del mondo ancora in funzione: è il simbolo della città dal 1543.", source: "Comune di Genova" },
  { day: 54, emoji: "🎭", text: "Genova è stata Capitale Europea della Cultura nel 2004, riscoprendo e valorizzando il suo centro storico e i Palazzi dei Rolli.", source: "European Commission" },
];