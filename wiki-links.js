// wiki-links.js — Wikipedia links for main places (IT + EN)
// ═══════════════════════════════════════════════════════════════

// ─── Per-day links (used by renderTimeline in tab Giorni) ───
var WIKI_LINKS = {
  "g1": { label: "Leoben", wiki: "https://it.wikipedia.org/wiki/Leoben", wikiEn: "https://en.wikipedia.org/wiki/Leoben" },
  "g2": [
    { label: "Vienna", wiki: "https://it.wikipedia.org/wiki/Vienna", wikiEn: "https://en.wikipedia.org/wiki/Vienna" },
    { label: "Prater", wiki: "https://it.wikipedia.org/wiki/Prater", wikiEn: "https://en.wikipedia.org/wiki/Prater" }
  ],
  "g3": [
    { label: "Brno", wiki: "https://it.wikipedia.org/wiki/Brno", wikiEn: "https://en.wikipedia.org/wiki/Brno" },
    { label: "Varsavia", labelEn: "Warsaw", wiki: "https://it.wikipedia.org/wiki/Varsavia", wikiEn: "https://en.wikipedia.org/wiki/Warsaw" }
  ],
  "g4": [
    { label: "Vilnius", wiki: "https://it.wikipedia.org/wiki/Vilnius", wikiEn: "https://en.wikipedia.org/wiki/Vilnius" },
    { label: "Užupis", wiki: "https://it.wikipedia.org/wiki/U%C5%BEupis", wikiEn: "https://en.wikipedia.org/wiki/U%C5%BEupis" }
  ],
  "g5": [
    { label: "Collina delle Croci", labelEn: "Hill of Crosses", wiki: "https://it.wikipedia.org/wiki/Collina_delle_Croci", wikiEn: "https://en.wikipedia.org/wiki/Hill_of_Crosses" },
    { label: "Riga", wiki: "https://it.wikipedia.org/wiki/Riga", wikiEn: "https://en.wikipedia.org/wiki/Riga" }
  ],
  "g6": [
    { label: "Tallinn", wiki: "https://it.wikipedia.org/wiki/Tallinn", wikiEn: "https://en.wikipedia.org/wiki/Tallinn" },
    { label: "Lennusadam", wiki: "https://it.wikipedia.org/wiki/Lennusadam", wikiEn: "https://en.wikipedia.org/wiki/Seaplane_Harbour" }
  ],
  "g7": [
    { label: "Helsinki", wiki: "https://it.wikipedia.org/wiki/Helsinki", wikiEn: "https://en.wikipedia.org/wiki/Helsinki" },
    { label: "Lappeenranta", wiki: "https://it.wikipedia.org/wiki/Lappeenranta", wikiEn: "https://en.wikipedia.org/wiki/Lappeenranta" }
  ],
  "g8": { label: "Punkaharju", wiki: "https://it.wikipedia.org/wiki/Punkaharju", wikiEn: "https://en.wikipedia.org/wiki/Punkaharju" },
  "g9": { label: "Lago Saimaa", labelEn: "Lake Saimaa", wiki: "https://it.wikipedia.org/wiki/Saimaa", wikiEn: "https://en.wikipedia.org/wiki/Saimaa" },
  "g10": { label: "Oulu", wiki: "https://it.wikipedia.org/wiki/Oulu", wikiEn: "https://en.wikipedia.org/wiki/Oulu" },
  "g11": { label: "Ranua Wildlife Park", wiki: "https://it.wikipedia.org/wiki/Ranua", wikiEn: "https://en.wikipedia.org/wiki/Ranua" },
  "g12": { label: "Rovaniemi", wiki: "https://it.wikipedia.org/wiki/Rovaniemi", wikiEn: "https://en.wikipedia.org/wiki/Rovaniemi" },
  "g13": [
    { label: "Villaggio di Babbo Natale", labelEn: "Santa Claus Village", wiki: "https://it.wikipedia.org/wiki/Villaggio_di_Babbo_Natale", wikiEn: "https://en.wikipedia.org/wiki/Santa_Claus_Village" },
    { label: "Arktikum", wiki: "https://it.wikipedia.org/wiki/Arktikum", wikiEn: "https://en.wikipedia.org/wiki/Arktikum" }
  ],
  "g14": [
    { label: "Inari", wiki: "https://it.wikipedia.org/wiki/Inari_(Finlandia)", wikiEn: "https://en.wikipedia.org/wiki/Inari,_Finland" },
    { label: "Museo Siida", labelEn: "Siida Museum", wiki: "https://it.wikipedia.org/wiki/Siida", wikiEn: "https://en.wikipedia.org/wiki/Siida" }
  ],
  "g15": { label: "Treriksröset", wiki: "https://it.wikipedia.org/wiki/Treriksröset", wikiEn: "https://en.wikipedia.org/wiki/Treriksröset" },
  "g16": [
    { label: "Tromsø", wiki: "https://it.wikipedia.org/wiki/Tromsø", wikiEn: "https://en.wikipedia.org/wiki/Tromsø" },
    { label: "Fjellheisen", wiki: "https://it.wikipedia.org/wiki/Troms%C3%B8", wikiEn: "https://en.wikipedia.org/wiki/Fjellheisen" }
  ],
  "g17": { label: "Senja", wiki: "https://it.wikipedia.org/wiki/Senja", wikiEn: "https://en.wikipedia.org/wiki/Senja" },
  "g18": { label: "Andøya", wiki: "https://it.wikipedia.org/wiki/Andøya", wikiEn: "https://en.wikipedia.org/wiki/Andøya" },
  "g19": { label: "Andenes", wiki: "https://it.wikipedia.org/wiki/Andenes", wikiEn: "https://en.wikipedia.org/wiki/Andenes" },
  "g20": [
    { label: "Isole Lofoten", labelEn: "Lofoten Islands", wiki: "https://it.wikipedia.org/wiki/Lofoten", wikiEn: "https://en.wikipedia.org/wiki/Lofoten" },
    { label: "Svolvær", wiki: "https://it.wikipedia.org/wiki/Svolvær", wikiEn: "https://en.wikipedia.org/wiki/Svolvær" }
  ],
  "g21": { label: "Henningsvær", wiki: "https://it.wikipedia.org/wiki/Henningsvær", wikiEn: "https://en.wikipedia.org/wiki/Henningsvær" },
  "g22": { label: "Haukland Beach", wiki: "https://it.wikipedia.org/wiki/Lofoten", wikiEn: "https://en.wikipedia.org/wiki/Lofoten" },
  "g23": { label: "Reine", wiki: "https://it.wikipedia.org/wiki/Reine", wikiEn: "https://en.wikipedia.org/wiki/Reine" },
  "g24": [
    { label: "Nusfjord", wiki: "https://it.wikipedia.org/wiki/Nusfjord", wikiEn: "https://en.wikipedia.org/wiki/Nusfjord" },
    { label: "Museo Vichingo Lofotr", labelEn: "Lofotr Viking Museum", wiki: "https://it.wikipedia.org/wiki/Museo_vichingo_di_Lofotr", wikiEn: "https://en.wikipedia.org/wiki/Lofotr_Viking_Museum" }
  ],
  "g25": { label: "Circolo Polare Artico", labelEn: "Arctic Circle", wiki: "https://it.wikipedia.org/wiki/Circolo_polare_artico", wikiEn: "https://en.wikipedia.org/wiki/Arctic_Circle" },
  "g26": [
    { label: "Ghiacciaio Svartisen", labelEn: "Svartisen Glacier", wiki: "https://it.wikipedia.org/wiki/Svartisen", wikiEn: "https://en.wikipedia.org/wiki/Svartisen" },
    { label: "Trondheim", wiki: "https://it.wikipedia.org/wiki/Trondheim", wikiEn: "https://en.wikipedia.org/wiki/Trondheim" }
  ],
  "g27": { label: "Cattedrale di Nidaros", labelEn: "Nidaros Cathedral", wiki: "https://it.wikipedia.org/wiki/Cattedrale_di_Nidaros", wikiEn: "https://en.wikipedia.org/wiki/Nidaros_Cathedral" },
  "g28": { label: "Strada dell'Atlantico", labelEn: "Atlantic Road", wiki: "https://it.wikipedia.org/wiki/Strada_dell%27Atlantico", wikiEn: "https://en.wikipedia.org/wiki/Atlantic_Ocean_Road" },
  "g29": [
    { label: "Trollstigen", wiki: "https://it.wikipedia.org/wiki/Trollstigen", wikiEn: "https://en.wikipedia.org/wiki/Trollstigen" },
    { label: "Geirangerfjord", wiki: "https://it.wikipedia.org/wiki/Geirangerfjord", wikiEn: "https://en.wikipedia.org/wiki/Geirangerfjord" }
  ],
  "g30": [
    { label: "Bergen", wiki: "https://it.wikipedia.org/wiki/Bergen_(Norvegia)", wikiEn: "https://en.wikipedia.org/wiki/Bergen,_Norway" },
    { label: "Bryggen", wiki: "https://it.wikipedia.org/wiki/Bryggen", wikiEn: "https://en.wikipedia.org/wiki/Bryggen" }
  ],
  "g31": { label: "Fløibanen", wiki: "https://it.wikipedia.org/wiki/Fløibanen", wikiEn: "https://en.wikipedia.org/wiki/Fløibanen" },
  "g32": { label: "Stavanger", wiki: "https://it.wikipedia.org/wiki/Stavanger", wikiEn: "https://en.wikipedia.org/wiki/Stavanger" },
  "g33": { label: "Preikestolen", wiki: "https://it.wikipedia.org/wiki/Preikestolen", wikiEn: "https://en.wikipedia.org/wiki/Preikestolen" },
  "g34": [
    { label: "Nyhavn", wiki: "https://it.wikipedia.org/wiki/Nyhavn", wikiEn: "https://en.wikipedia.org/wiki/Nyhavn" },
    { label: "Copenhagen", wiki: "https://it.wikipedia.org/wiki/Copenaghen", wikiEn: "https://en.wikipedia.org/wiki/Copenhagen" }
  ],
  "g35": { label: "Giardini di Tivoli", labelEn: "Tivoli Gardens", wiki: "https://it.wikipedia.org/wiki/Giardini_di_Tivoli", wikiEn: "https://en.wikipedia.org/wiki/Tivoli_Gardens" },
  "g36": { label: "Experimentarium", wiki: "https://it.wikipedia.org/wiki/Experimentarium", wikiEn: "https://en.wikipedia.org/wiki/Experimentarium" },
  "g37": [
    { label: "Ponte dello Storebælt", labelEn: "Great Belt Bridge", wiki: "https://it.wikipedia.org/wiki/Ponte_dello_Storebælt", wikiEn: "https://en.wikipedia.org/wiki/Great_Belt_Fixed_Link" },
    { label: "Odense", wiki: "https://it.wikipedia.org/wiki/Odense", wikiEn: "https://en.wikipedia.org/wiki/Odense" }
  ],
  "g38": { label: "Legoland Billund", wiki: "https://it.wikipedia.org/wiki/Legoland_Billund", wikiEn: "https://en.wikipedia.org/wiki/Legoland_Billund" },
  "g39": { label: "LEGO House", wiki: "https://it.wikipedia.org/wiki/LEGO_House", wikiEn: "https://en.wikipedia.org/wiki/Lego_House_(museum)" },
  "g40": [
    { label: "Brema", labelEn: "Bremen", wiki: "https://it.wikipedia.org/wiki/Brema", wikiEn: "https://en.wikipedia.org/wiki/Bremen" },
    { label: "Musicanti di Brema", labelEn: "Town Musicians of Bremen", wiki: "https://it.wikipedia.org/wiki/I_musicanti_di_Brema", wikiEn: "https://en.wikipedia.org/wiki/Town_Musicians_of_Bremen" }
  ],
  "g41": { label: "Cattedrale di Amiens", labelEn: "Amiens Cathedral", wiki: "https://it.wikipedia.org/wiki/Cattedrale_di_Nostra_Signora_di_Amiens", wikiEn: "https://en.wikipedia.org/wiki/Amiens_Cathedral" },
  "g42": { label: "Valle della Loira", labelEn: "Loire Valley", wiki: "https://it.wikipedia.org/wiki/Valle_della_Loira", wikiEn: "https://en.wikipedia.org/wiki/Loire_Valley" },
  "g43": [
    { label: "Clos Lucé", wiki: "https://it.wikipedia.org/wiki/Castello_di_Clos_Lucé", wikiEn: "https://en.wikipedia.org/wiki/Château_du_Clos_Lucé" },
    { label: "Castello di Chenonceau", labelEn: "Château de Chenonceau", wiki: "https://it.wikipedia.org/wiki/Castello_di_Chenonceau", wikiEn: "https://en.wikipedia.org/wiki/Château_de_Chenonceau" }
  ],
  "g44": [
    { label: "Gaztelugatxe", wiki: "https://it.wikipedia.org/wiki/Gaztelugatxe", wikiEn: "https://en.wikipedia.org/wiki/Gaztelugatxe" },
    { label: "San Sebastián", wiki: "https://it.wikipedia.org/wiki/San_Sebastián", wikiEn: "https://en.wikipedia.org/wiki/San_Sebastián" }
  ],
  "g45": { label: "Museo Guggenheim (Bilbao)", labelEn: "Guggenheim Museum Bilbao", wiki: "https://it.wikipedia.org/wiki/Museo_Guggenheim_(Bilbao)", wikiEn: "https://en.wikipedia.org/wiki/Guggenheim_Museum_Bilbao" },
  "g46": [
    { label: "Picos de Europa", wiki: "https://it.wikipedia.org/wiki/Picos_de_Europa", wikiEn: "https://en.wikipedia.org/wiki/Picos_de_Europa" },
    { label: "Fuente Dé", wiki: "https://it.wikipedia.org/wiki/Fuente_Dé", wikiEn: "https://en.wikipedia.org/wiki/Fuente_Dé" }
  ],
  "g47": { label: "Palencia", wiki: "https://it.wikipedia.org/wiki/Palencia", wikiEn: "https://en.wikipedia.org/wiki/Palencia" },
  "g48": { label: "Eclissi solare del 12 agosto 2026", labelEn: "Solar eclipse of August 12, 2026", wiki: "https://it.wikipedia.org/wiki/Eclissi_solare_del_12_agosto_2026", wikiEn: "https://en.wikipedia.org/wiki/Solar_eclipse_of_August_12,_2026" },
  "g49": [
    { label: "Costa Brava", wiki: "https://it.wikipedia.org/wiki/Costa_Brava", wikiEn: "https://en.wikipedia.org/wiki/Costa_Brava" },
    { label: "Cadaqués", wiki: "https://it.wikipedia.org/wiki/Cadaqués", wikiEn: "https://en.wikipedia.org/wiki/Cadaqués" }
  ],
  "g50": { label: "Cap de Creus", wiki: "https://it.wikipedia.org/wiki/Cap_de_Creus", wikiEn: "https://en.wikipedia.org/wiki/Cap_de_Creus" },
  "g51": { label: "Costa Azzurra", labelEn: "French Riviera", wiki: "https://it.wikipedia.org/wiki/Costa_Azzurra", wikiEn: "https://en.wikipedia.org/wiki/French_Riviera" },
  "g52": { label: "Acquario di Genova", labelEn: "Aquarium of Genoa", wiki: "https://it.wikipedia.org/wiki/Acquario_di_Genova", wikiEn: "https://en.wikipedia.org/wiki/Aquarium_of_Genoa" },
  "g53": { label: "Genova", labelEn: "Genoa", wiki: "https://it.wikipedia.org/wiki/Genova", wikiEn: "https://en.wikipedia.org/wiki/Genoa" },
  "g54": null,
  "g55": null
};

// ─── Trekking Wikipedia links (used by injectWikiLinks) ───
var WIKI_TREKS = {
  "Segla": { wiki: "https://it.wikipedia.org/wiki/Senja", wikiEn: "https://en.wikipedia.org/wiki/Senja" },
  "Reinebringen": { wiki: "https://it.wikipedia.org/wiki/Reine", wikiEn: "https://en.wikipedia.org/wiki/Reine" },
  "Ryten": { wiki: "https://it.wikipedia.org/wiki/Lofoten", wikiEn: "https://en.wikipedia.org/wiki/Lofoten" },
  "Vidden Trail": { wiki: "https://it.wikipedia.org/wiki/Bergen_(Norvegia)", wikiEn: "https://en.wikipedia.org/wiki/Vidden_(hiking_trail)" },
  "Ruta del Cares": { wiki: "https://it.wikipedia.org/wiki/Picos_de_Europa", wikiEn: "https://en.wikipedia.org/wiki/Cares_Trail" },
  "Offersøykammen": { wiki: "https://it.wikipedia.org/wiki/Lofoten", wikiEn: "https://en.wikipedia.org/wiki/Lofoten" },
  "Fløyen Troll Forest": { wiki: "https://it.wikipedia.org/wiki/Fløyen", wikiEn: "https://en.wikipedia.org/wiki/Fløyen" },
  "Preikestolen": { wiki: "https://it.wikipedia.org/wiki/Preikestolen", wikiEn: "https://en.wikipedia.org/wiki/Preikestolen" },
  "San Juan de Gaztelugatxe": { wiki: "https://it.wikipedia.org/wiki/Gaztelugatxe", wikiEn: "https://en.wikipedia.org/wiki/Gaztelugatxe" },
  "Fuente Dé": { wiki: "https://it.wikipedia.org/wiki/Fuente_Dé", wikiEn: "https://en.wikipedia.org/wiki/Fuente_Dé" },
  "Fjellheisen": { wiki: "https://it.wikipedia.org/wiki/Troms%C3%B8", wikiEn: "https://en.wikipedia.org/wiki/Fjellheisen" },
  "Sherpatrappa": { wiki: "https://it.wikipedia.org/wiki/Tromsø", wikiEn: "https://en.wikipedia.org/wiki/Tromsø" },
  "Hesten": { wiki: "https://it.wikipedia.org/wiki/Senja", wikiEn: "https://en.wikipedia.org/wiki/Senja" },
  "Trollstigen": { wiki: "https://it.wikipedia.org/wiki/Trollstigen", wikiEn: "https://en.wikipedia.org/wiki/Trollstigen" },
  "Picos de Europa": { wiki: "https://it.wikipedia.org/wiki/Picos_de_Europa", wikiEn: "https://en.wikipedia.org/wiki/Picos_de_Europa" },
  "Kjeragbolten": { wiki: "https://it.wikipedia.org/wiki/Kjerag", wikiEn: "https://en.wikipedia.org/wiki/Kjeragbolten" },
  "Kjerag": { wiki: "https://it.wikipedia.org/wiki/Kjerag", wikiEn: "https://en.wikipedia.org/wiki/Kjerag" },
  "Romsdalseggen": { wiki: "https://it.wikipedia.org/wiki/%C3%85ndalsnes", wikiEn: "https://en.wikipedia.org/wiki/%C3%85ndalsnes" },
  "Naranjo de Bulnes": { wiki: "https://it.wikipedia.org/wiki/Naranjo_de_Bulnes", wikiEn: "https://en.wikipedia.org/wiki/Naranjo_de_Bulnes" },
  "Geirangerfjord": { wiki: "https://it.wikipedia.org/wiki/Geirangerfjord", wikiEn: "https://en.wikipedia.org/wiki/Geirangerfjord" }
};

// ─── Cultura country Wikipedia links ───
var WIKI_COUNTRIES = {
  "Austria": { wiki: "https://it.wikipedia.org/wiki/Austria", wikiEn: "https://en.wikipedia.org/wiki/Austria" },
  "Repubblica Ceca": { labelEn: "Czech Republic", wiki: "https://it.wikipedia.org/wiki/Repubblica_Ceca", wikiEn: "https://en.wikipedia.org/wiki/Czech_Republic" },
  "Polonia": { labelEn: "Poland", wiki: "https://it.wikipedia.org/wiki/Polonia", wikiEn: "https://en.wikipedia.org/wiki/Poland" },
  "Lituania": { labelEn: "Lithuania", wiki: "https://it.wikipedia.org/wiki/Lituania", wikiEn: "https://en.wikipedia.org/wiki/Lithuania" },
  "Lettonia": { labelEn: "Latvia", wiki: "https://it.wikipedia.org/wiki/Lettonia", wikiEn: "https://en.wikipedia.org/wiki/Latvia" },
  "Estonia": { wiki: "https://it.wikipedia.org/wiki/Estonia", wikiEn: "https://en.wikipedia.org/wiki/Estonia" },
  "Finlandia": { labelEn: "Finland", wiki: "https://it.wikipedia.org/wiki/Finlandia", wikiEn: "https://en.wikipedia.org/wiki/Finland" },
  "Norvegia": { labelEn: "Norway", wiki: "https://it.wikipedia.org/wiki/Norvegia", wikiEn: "https://en.wikipedia.org/wiki/Norway" },
  "Danimarca": { labelEn: "Denmark", wiki: "https://it.wikipedia.org/wiki/Danimarca", wikiEn: "https://en.wikipedia.org/wiki/Denmark" },
  "Germania": { labelEn: "Germany", wiki: "https://it.wikipedia.org/wiki/Germania", wikiEn: "https://en.wikipedia.org/wiki/Germany" },
  "Francia": { labelEn: "France", wiki: "https://it.wikipedia.org/wiki/Francia", wikiEn: "https://en.wikipedia.org/wiki/France" },
  "Spagna": { labelEn: "Spain", wiki: "https://it.wikipedia.org/wiki/Spagna", wikiEn: "https://en.wikipedia.org/wiki/Spain" },
  "Italia": { labelEn: "Italy", wiki: "https://it.wikipedia.org/wiki/Italia", wikiEn: "https://en.wikipedia.org/wiki/Italy" }
};

// ─── Personaggi storici (Cultura > Personaggi da conoscere) ───
var WIKI_PEOPLE = {
  "Wolfgang Amadeus Mozart": { wiki: "https://it.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart", wikiEn: "https://en.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart" },
  "Gustav Klimt": { wiki: "https://it.wikipedia.org/wiki/Gustav_Klimt", wikiEn: "https://en.wikipedia.org/wiki/Gustav_Klimt" },
  "Empress Sisi": { labelEn: "Empress Elisabeth", wiki: "https://it.wikipedia.org/wiki/Elisabetta_di_Baviera", wikiEn: "https://en.wikipedia.org/wiki/Empress_Elisabeth_of_Austria" },
  "Ludwig van Beethoven": { wiki: "https://it.wikipedia.org/wiki/Ludwig_van_Beethoven", wikiEn: "https://en.wikipedia.org/wiki/Ludwig_van_Beethoven" },
  "Fryderyk Chopin": { labelEn: "Frédéric Chopin", wiki: "https://it.wikipedia.org/wiki/Fryderyk_Chopin", wikiEn: "https://en.wikipedia.org/wiki/Frédéric_Chopin" },
  "Marie Curie": { wiki: "https://it.wikipedia.org/wiki/Marie_Curie", wikiEn: "https://en.wikipedia.org/wiki/Marie_Curie" },
  "Niccolò Copernico": { labelEn: "Nicolaus Copernicus", wiki: "https://it.wikipedia.org/wiki/Niccolò_Copernico", wikiEn: "https://en.wikipedia.org/wiki/Nicolaus_Copernicus" },
  "Papa Giovanni Paolo II": { labelEn: "Pope John Paul II", wiki: "https://it.wikipedia.org/wiki/Papa_Giovanni_Paolo_II", wikiEn: "https://en.wikipedia.org/wiki/Pope_John_Paul_II" },
  "Gediminas": { wiki: "https://it.wikipedia.org/wiki/Gediminas", wikiEn: "https://en.wikipedia.org/wiki/Gediminas" },
  "Vytautas il Grande": { labelEn: "Vytautas the Great", wiki: "https://it.wikipedia.org/wiki/Vitoldo", wikiEn: "https://en.wikipedia.org/wiki/Vytautas" },
  "Alberto di Riga": { labelEn: "Albert of Riga", wiki: "https://it.wikipedia.org/wiki/Alberto_di_Riga", wikiEn: "https://en.wikipedia.org/wiki/Albert_of_Riga" },
  "Mikhail Eisenstein": { wiki: "https://it.wikipedia.org/wiki/Michail_Ėjzenštejn", wikiEn: "https://en.wikipedia.org/wiki/Mikhail_Eisenstein" },
  "Jean Sibelius": { wiki: "https://it.wikipedia.org/wiki/Jean_Sibelius", wikiEn: "https://en.wikipedia.org/wiki/Jean_Sibelius" },
  "Alvar Aalto": { wiki: "https://it.wikipedia.org/wiki/Alvar_Aalto", wikiEn: "https://en.wikipedia.org/wiki/Alvar_Aalto" },
  "Tove Jansson": { wiki: "https://it.wikipedia.org/wiki/Tove_Jansson", wikiEn: "https://en.wikipedia.org/wiki/Tove_Jansson" },
  "Edvard Grieg": { wiki: "https://it.wikipedia.org/wiki/Edvard_Grieg", wikiEn: "https://en.wikipedia.org/wiki/Edvard_Grieg" },
  "Edvard Munch": { wiki: "https://it.wikipedia.org/wiki/Edvard_Munch", wikiEn: "https://en.wikipedia.org/wiki/Edvard_Munch" },
  "Roald Amundsen": { wiki: "https://it.wikipedia.org/wiki/Roald_Amundsen", wikiEn: "https://en.wikipedia.org/wiki/Roald_Amundsen" },
  "Hans Christian Andersen": { wiki: "https://it.wikipedia.org/wiki/Hans_Christian_Andersen", wikiEn: "https://en.wikipedia.org/wiki/Hans_Christian_Andersen" },
  "Søren Kierkegaard": { wiki: "https://it.wikipedia.org/wiki/Søren_Kierkegaard", wikiEn: "https://en.wikipedia.org/wiki/Søren_Kierkegaard" },
  "Niels Bohr": { wiki: "https://it.wikipedia.org/wiki/Niels_Bohr", wikiEn: "https://en.wikipedia.org/wiki/Niels_Bohr" },
  "Ole Kirk Christiansen": { wiki: "https://it.wikipedia.org/wiki/Ole_Kirk_Christiansen", wikiEn: "https://en.wikipedia.org/wiki/Ole_Kirk_Christiansen" },
  "I Fratelli Grimm": { labelEn: "Brothers Grimm", wiki: "https://it.wikipedia.org/wiki/Fratelli_Grimm", wikiEn: "https://en.wikipedia.org/wiki/Brothers_Grimm" },
  "Jules Verne": { wiki: "https://it.wikipedia.org/wiki/Jules_Verne", wikiEn: "https://en.wikipedia.org/wiki/Jules_Verne" },
  "Leonardo da Vinci": { wiki: "https://it.wikipedia.org/wiki/Leonardo_da_Vinci", wikiEn: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci" },
  "Caterina de' Medici": { labelEn: "Catherine de' Medici", wiki: "https://it.wikipedia.org/wiki/Caterina_de%27_Medici", wikiEn: "https://en.wikipedia.org/wiki/Catherine_de%27_Medici" },
  "Pablo Picasso": { wiki: "https://it.wikipedia.org/wiki/Pablo_Picasso", wikiEn: "https://en.wikipedia.org/wiki/Pablo_Picasso" },
  "Frank Gehry": { wiki: "https://it.wikipedia.org/wiki/Frank_Gehry", wikiEn: "https://en.wikipedia.org/wiki/Frank_Gehry" },
  "Andrea Doria": { wiki: "https://it.wikipedia.org/wiki/Andrea_Doria", wikiEn: "https://en.wikipedia.org/wiki/Andrea_Doria" },
  "Cristoforo Colombo": { labelEn: "Christopher Columbus", wiki: "https://it.wikipedia.org/wiki/Cristoforo_Colombo", wikiEn: "https://en.wikipedia.org/wiki/Christopher_Columbus" },
  "Renzo Piano": { wiki: "https://it.wikipedia.org/wiki/Renzo_Piano", wikiEn: "https://en.wikipedia.org/wiki/Renzo_Piano" },
  "Ludwig Mies van der Rohe": { wiki: "https://it.wikipedia.org/wiki/Ludwig_Mies_van_der_Rohe", wikiEn: "https://en.wikipedia.org/wiki/Ludwig_Mies_van_der_Rohe" }
};

// ─── Piatti tipici (Cibo) ───
var WIKI_FOOD = {
  "Wiener Schnitzel": { wiki: "https://it.wikipedia.org/wiki/Wiener_Schnitzel", wikiEn: "https://en.wikipedia.org/wiki/Wiener_schnitzel" },
  "Apfelstrudel": { wiki: "https://it.wikipedia.org/wiki/Strudel_di_mele", wikiEn: "https://en.wikipedia.org/wiki/Apple_strudel" },
  "Sachertorte": { wiki: "https://it.wikipedia.org/wiki/Sachertorte", wikiEn: "https://en.wikipedia.org/wiki/Sachertorte" },
  "Kaiserschmarrn": { wiki: "https://it.wikipedia.org/wiki/Kaiserschmarrn", wikiEn: "https://en.wikipedia.org/wiki/Kaiserschmarrn" },
  "Germknödel": { wiki: "https://it.wikipedia.org/wiki/Germknödel", wikiEn: "https://en.wikipedia.org/wiki/Germknödel" },
  "Svíčková": { wiki: "https://it.wikipedia.org/wiki/Svíčková", wikiEn: "https://en.wikipedia.org/wiki/Svíčková" },
  "Trdelník": { wiki: "https://it.wikipedia.org/wiki/Trdelník", wikiEn: "https://en.wikipedia.org/wiki/Trdelník" },
  "Pierogi": { wiki: "https://it.wikipedia.org/wiki/Pierogi", wikiEn: "https://en.wikipedia.org/wiki/Pierogi" },
  "Żurek": { wiki: "https://it.wikipedia.org/wiki/Żurek", wikiEn: "https://en.wikipedia.org/wiki/Żurek" },
  "Oscypek": { wiki: "https://it.wikipedia.org/wiki/Oscypek", wikiEn: "https://en.wikipedia.org/wiki/Oscypek" },
  "Zapiekanka": { wiki: "https://it.wikipedia.org/wiki/Zapiekanka", wikiEn: "https://en.wikipedia.org/wiki/Zapiekanka" },
  "Pączki": { wiki: "https://it.wikipedia.org/wiki/Pączki", wikiEn: "https://en.wikipedia.org/wiki/Pączki" },
  "Cepelinai": { wiki: "https://it.wikipedia.org/wiki/Cepelinai", wikiEn: "https://en.wikipedia.org/wiki/Cepelinai" },
  "Kibinai": { wiki: "https://it.wikipedia.org/wiki/Kibinai", wikiEn: "https://en.wikipedia.org/wiki/Kibinai" },
  "Šaltibarščiai": { wiki: "https://it.wikipedia.org/wiki/Šaltibarščiai", wikiEn: "https://en.wikipedia.org/wiki/Šaltibarščiai" },
  "Piragi": { wiki: "https://it.wikipedia.org/wiki/Pirogi", wikiEn: "https://en.wikipedia.org/wiki/Pirozhki" },
  "Karjalanpiirakka": { wiki: "https://it.wikipedia.org/wiki/Karjalanpiirakka", wikiEn: "https://en.wikipedia.org/wiki/Karelian_pasty" },
  "Kalakukko": { wiki: "https://it.wikipedia.org/wiki/Kalakukko", wikiEn: "https://en.wikipedia.org/wiki/Kalakukko" },
  "Grillimakkara": { wiki: "https://it.wikipedia.org/wiki/Grillimakkara", wikiEn: "https://en.wikipedia.org/wiki/Grillimakkara" },
  "Lohikeitto": { wiki: "https://it.wikipedia.org/wiki/Lohikeitto", wikiEn: "https://en.wikipedia.org/wiki/Lohikeitto" },
  "Brunost": { wiki: "https://it.wikipedia.org/wiki/Brunost", wikiEn: "https://en.wikipedia.org/wiki/Brunost" },
  "Fårikål": { wiki: "https://it.wikipedia.org/wiki/Fårikål", wikiEn: "https://en.wikipedia.org/wiki/Fårikål" },
  "Smørrebrød": { wiki: "https://it.wikipedia.org/wiki/Smørrebrød", wikiEn: "https://en.wikipedia.org/wiki/Smørrebrød" },
  "Flæskesteg": { wiki: "https://it.wikipedia.org/wiki/Flæskesteg", wikiEn: "https://en.wikipedia.org/wiki/Flæskesteg" },
  "Æbleskiver": { wiki: "https://it.wikipedia.org/wiki/Æbleskiver", wikiEn: "https://en.wikipedia.org/wiki/Æbleskiver" },
  "Bratwurst": { wiki: "https://it.wikipedia.org/wiki/Bratwurst", wikiEn: "https://en.wikipedia.org/wiki/Bratwurst" },
  "Currywurst": { wiki: "https://it.wikipedia.org/wiki/Currywurst", wikiEn: "https://en.wikipedia.org/wiki/Currywurst" },
  "Brezel": { wiki: "https://it.wikipedia.org/wiki/Brezel", wikiEn: "https://en.wikipedia.org/wiki/Pretzel" },
  "Fischbrötchen": { wiki: "https://it.wikipedia.org/wiki/Fischbrötchen", wikiEn: "https://en.wikipedia.org/wiki/Fischbrötchen" },
  "Crêpes": { wiki: "https://it.wikipedia.org/wiki/Crêpe", wikiEn: "https://en.wikipedia.org/wiki/Crêpe" },
  "Quiche Lorraine": { wiki: "https://it.wikipedia.org/wiki/Quiche_Lorraine", wikiEn: "https://en.wikipedia.org/wiki/Quiche_Lorraine" },
  "Moules-frites": { wiki: "https://it.wikipedia.org/wiki/Moules-frites", wikiEn: "https://en.wikipedia.org/wiki/Moules-frites" },
  "Ratatouille": { wiki: "https://it.wikipedia.org/wiki/Ratatouille", wikiEn: "https://en.wikipedia.org/wiki/Ratatouille" },
  "Pintxos": { wiki: "https://it.wikipedia.org/wiki/Pintxo", wikiEn: "https://en.wikipedia.org/wiki/Pincho" },
  "Tortilla española": { wiki: "https://it.wikipedia.org/wiki/Tortilla_de_patatas", wikiEn: "https://en.wikipedia.org/wiki/Spanish_omelette" },
  "Gazpacho": { wiki: "https://it.wikipedia.org/wiki/Gazpacho", wikiEn: "https://en.wikipedia.org/wiki/Gazpacho" },
  "Churros": { wiki: "https://it.wikipedia.org/wiki/Churro", wikiEn: "https://en.wikipedia.org/wiki/Churro" },
  "Pulpo a la gallega": { wiki: "https://it.wikipedia.org/wiki/Pulpo_a_la_gallega", wikiEn: "https://en.wikipedia.org/wiki/Pulpo_a_la_gallega" },
  "Jamón ibérico": { wiki: "https://it.wikipedia.org/wiki/Jamón_ibérico", wikiEn: "https://en.wikipedia.org/wiki/Jamón_ibérico" },
  "Fabada asturiana": { wiki: "https://it.wikipedia.org/wiki/Fabada_asturiana", wikiEn: "https://en.wikipedia.org/wiki/Fabada_asturiana" },
  "Cachopo": { wiki: "https://it.wikipedia.org/wiki/Cachopo_(gastronomia)", wikiEn: "https://en.wikipedia.org/wiki/Cachopo" },
  "Focaccia genovese": { wiki: "https://it.wikipedia.org/wiki/Focaccia_genovese", wikiEn: "https://en.wikipedia.org/wiki/Focaccia" },
  "Farinata": { wiki: "https://it.wikipedia.org/wiki/Farinata", wikiEn: "https://en.wikipedia.org/wiki/Farinata" },
  "Pesto alla genovese": { wiki: "https://it.wikipedia.org/wiki/Pesto", wikiEn: "https://en.wikipedia.org/wiki/Pesto" },
  "Trofie al pesto": { wiki: "https://it.wikipedia.org/wiki/Trofie", wikiEn: "https://en.wikipedia.org/wiki/Trofie" },
  "Panissa": { wiki: "https://it.wikipedia.org/wiki/Panissa_(Liguria)", wikiEn: "https://en.wikipedia.org/wiki/Panissa" },
  "Bacalao": { wiki: "https://it.wikipedia.org/wiki/Baccalà", wikiEn: "https://en.wikipedia.org/wiki/Bacalhau" },
  "Croquetas": { wiki: "https://it.wikipedia.org/wiki/Crocchetta", wikiEn: "https://en.wikipedia.org/wiki/Croquette" },
  "Vafler": { wiki: "https://it.wikipedia.org/wiki/Waffle", wikiEn: "https://en.wikipedia.org/wiki/Waffle" },
  "Rugbrød": { wiki: "https://it.wikipedia.org/wiki/Rugbrød", wikiEn: "https://en.wikipedia.org/wiki/Rugbrød" },
  "cucina austriaca": { labelEn: "Austrian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_austriaca", wikiEn: "https://en.wikipedia.org/wiki/Austrian_cuisine" },
  "cucina ceca": { labelEn: "Czech cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_ceca", wikiEn: "https://en.wikipedia.org/wiki/Czech_cuisine" },
  "cucina polacca": { labelEn: "Polish cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_polacca", wikiEn: "https://en.wikipedia.org/wiki/Polish_cuisine" },
  "cucina lituana": { labelEn: "Lithuanian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_lituana", wikiEn: "https://en.wikipedia.org/wiki/Lithuanian_cuisine" },
  "cucina lettone": { labelEn: "Latvian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_lettone", wikiEn: "https://en.wikipedia.org/wiki/Latvian_cuisine" },
  "cucina estone": { labelEn: "Estonian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_estone", wikiEn: "https://en.wikipedia.org/wiki/Estonian_cuisine" },
  "cucina finlandese": { labelEn: "Finnish cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_finlandese", wikiEn: "https://en.wikipedia.org/wiki/Finnish_cuisine" },
  "cucina norvegese": { labelEn: "Norwegian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_norvegese", wikiEn: "https://en.wikipedia.org/wiki/Norwegian_cuisine" },
  "cucina danese": { labelEn: "Danish cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_danese", wikiEn: "https://en.wikipedia.org/wiki/Danish_cuisine" },
  "cucina tedesca": { labelEn: "German cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_tedesca", wikiEn: "https://en.wikipedia.org/wiki/German_cuisine" },
  "cucina francese": { labelEn: "French cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_francese", wikiEn: "https://en.wikipedia.org/wiki/French_cuisine" },
  "cucina spagnola": { labelEn: "Spanish cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_spagnola", wikiEn: "https://en.wikipedia.org/wiki/Spanish_cuisine" },
  "cucina ligure": { labelEn: "Ligurian cuisine", wiki: "https://it.wikipedia.org/wiki/Cucina_ligure", wikiEn: "https://en.wikipedia.org/wiki/Cuisine_of_Liguria" }
};

// ─── Monumenti, siti UNESCO, luoghi culturali ───
var WIKI_MONUMENTS = {
  "Suomenlinna": { wiki: "https://it.wikipedia.org/wiki/Suomenlinna", wikiEn: "https://en.wikipedia.org/wiki/Suomenlinna" },
  "Bryggen": { wiki: "https://it.wikipedia.org/wiki/Bryggen", wikiEn: "https://en.wikipedia.org/wiki/Bryggen" },
  "Sognefjord": { wiki: "https://it.wikipedia.org/wiki/Sognefjord", wikiEn: "https://en.wikipedia.org/wiki/Sognefjord" },
  "Geirangerfjord": { wiki: "https://it.wikipedia.org/wiki/Geirangerfjord", wikiEn: "https://en.wikipedia.org/wiki/Geirangerfjord" },
  "Cattedrale di Nidaros": { labelEn: "Nidaros Cathedral", wiki: "https://it.wikipedia.org/wiki/Cattedrale_di_Nidaros", wikiEn: "https://en.wikipedia.org/wiki/Nidaros_Cathedral" },
  "Cattedrale di Amiens": { labelEn: "Amiens Cathedral", wiki: "https://it.wikipedia.org/wiki/Cattedrale_di_Nostra_Signora_di_Amiens", wikiEn: "https://en.wikipedia.org/wiki/Amiens_Cathedral" },
  "Cattedrale di Burgos": { labelEn: "Burgos Cathedral", wiki: "https://it.wikipedia.org/wiki/Cattedrale_di_Burgos", wikiEn: "https://en.wikipedia.org/wiki/Burgos_Cathedral" },
  "Castello di Chenonceau": { labelEn: "Château de Chenonceau", wiki: "https://it.wikipedia.org/wiki/Castello_di_Chenonceau", wikiEn: "https://en.wikipedia.org/wiki/Château_de_Chenonceau" },
  "Chambord": { wiki: "https://it.wikipedia.org/wiki/Castello_di_Chambord", wikiEn: "https://en.wikipedia.org/wiki/Château_de_Chambord" },
  "Villa Tugendhat": { wiki: "https://it.wikipedia.org/wiki/Villa_Tugendhat", wikiEn: "https://en.wikipedia.org/wiki/Villa_Tugendhat" },
  "Wieliczka": { wiki: "https://it.wikipedia.org/wiki/Miniera_di_sale_di_Wieliczka", wikiEn: "https://en.wikipedia.org/wiki/Wieliczka_Salt_Mine" },
  "Collina delle Croci": { labelEn: "Hill of Crosses", wiki: "https://it.wikipedia.org/wiki/Collina_delle_Croci", wikiEn: "https://en.wikipedia.org/wiki/Hill_of_Crosses" },
  "Torre Eiffel": { labelEn: "Eiffel Tower", wiki: "https://it.wikipedia.org/wiki/Torre_Eiffel", wikiEn: "https://en.wikipedia.org/wiki/Eiffel_Tower" },
  "Museo Guggenheim": { labelEn: "Guggenheim Museum Bilbao", wiki: "https://it.wikipedia.org/wiki/Museo_Guggenheim_(Bilbao)", wikiEn: "https://en.wikipedia.org/wiki/Guggenheim_Museum_Bilbao" },
  "Nyhavn": { wiki: "https://it.wikipedia.org/wiki/Nyhavn", wikiEn: "https://en.wikipedia.org/wiki/Nyhavn" },
  "Giardini di Tivoli": { labelEn: "Tivoli Gardens", wiki: "https://it.wikipedia.org/wiki/Giardini_di_Tivoli", wikiEn: "https://en.wikipedia.org/wiki/Tivoli_Gardens" },
  "Legoland": { wiki: "https://it.wikipedia.org/wiki/Legoland_Billund", wikiEn: "https://en.wikipedia.org/wiki/Legoland_Billund" },
  "Naschmarkt": { wiki: "https://it.wikipedia.org/wiki/Naschmarkt", wikiEn: "https://en.wikipedia.org/wiki/Naschmarkt" },
  "Prater": { wiki: "https://it.wikipedia.org/wiki/Prater", wikiEn: "https://en.wikipedia.org/wiki/Prater" },
  "Gaztelugatxe": { wiki: "https://it.wikipedia.org/wiki/Gaztelugatxe", wikiEn: "https://en.wikipedia.org/wiki/Gaztelugatxe" },
  "Nordkapp": { labelEn: "North Cape", wiki: "https://it.wikipedia.org/wiki/Capo_Nord", wikiEn: "https://en.wikipedia.org/wiki/North_Cape_(Norway)" },
  "Capo Nord": { labelEn: "North Cape", wiki: "https://it.wikipedia.org/wiki/Capo_Nord", wikiEn: "https://en.wikipedia.org/wiki/North_Cape_(Norway)" },
  "Strada dell'Atlantico": { labelEn: "Atlantic Road", wiki: "https://it.wikipedia.org/wiki/Strada_dell%27Atlantico", wikiEn: "https://en.wikipedia.org/wiki/Atlantic_Ocean_Road" },
  "Trollstigen": { wiki: "https://it.wikipedia.org/wiki/Trollstigen", wikiEn: "https://en.wikipedia.org/wiki/Trollstigen" },
  "Acquario di Genova": { labelEn: "Aquarium of Genoa", wiki: "https://it.wikipedia.org/wiki/Acquario_di_Genova", wikiEn: "https://en.wikipedia.org/wiki/Aquarium_of_Genoa" },
  "Alcázar de Segovia": { wiki: "https://it.wikipedia.org/wiki/Alcázar_di_Segovia", wikiEn: "https://en.wikipedia.org/wiki/Alcázar_of_Segovia" },
  "Castelli della Loira": { labelEn: "Châteaux of the Loire Valley", wiki: "https://it.wikipedia.org/wiki/Castelli_della_Loira", wikiEn: "https://en.wikipedia.org/wiki/Châteaux_of_the_Loire_Valley" }
};

// ─── Film e libri (Cultura > Libri e Film) ───
var WIKI_MEDIA = {
  "Frozen": { wiki: "https://it.wikipedia.org/wiki/Frozen_-_Il_regno_di_ghiaccio", wikiEn: "https://en.wikipedia.org/wiki/Frozen_(2013_film)" },
  "Frozen 2": { wiki: "https://it.wikipedia.org/wiki/Frozen_II_-_Il_segreto_di_Arendelle", wikiEn: "https://en.wikipedia.org/wiki/Frozen_II" },
  "Dragon Trainer": { labelEn: "How to Train Your Dragon", wiki: "https://it.wikipedia.org/wiki/Dragon_Trainer", wikiEn: "https://en.wikipedia.org/wiki/How_to_Train_Your_Dragon_(film)" },
  "Ratatouille": { wiki: "https://it.wikipedia.org/wiki/Ratatouille_(film)", wikiEn: "https://en.wikipedia.org/wiki/Ratatouille_(film)" },
  "La Sirenetta": { labelEn: "The Little Mermaid", wiki: "https://it.wikipedia.org/wiki/La_sirenetta_(film_1989)", wikiEn: "https://en.wikipedia.org/wiki/The_Little_Mermaid_(1989_film)" },
  "Le Avventure di Pippi": { labelEn: "Pippi Longstocking", wiki: "https://it.wikipedia.org/wiki/Pippi_Calzelunghe", wikiEn: "https://en.wikipedia.org/wiki/Pippi_Longstocking" },
  "Storie di Moomin": { labelEn: "Moomin", wiki: "https://it.wikipedia.org/wiki/Mumin", wikiEn: "https://en.wikipedia.org/wiki/Moomins" },
  "Moomin": { wiki: "https://it.wikipedia.org/wiki/Mumin", wikiEn: "https://en.wikipedia.org/wiki/Moomins" },
  "Le Fiabe dei Fratelli Grimm": { labelEn: "Grimms' Fairy Tales", wiki: "https://it.wikipedia.org/wiki/Fiabe_del_focolare", wikiEn: "https://en.wikipedia.org/wiki/Grimms%27_Fairy_Tales" },
  "Le Fiabe di Andersen": { labelEn: "Andersen's Fairy Tales", wiki: "https://it.wikipedia.org/wiki/Hans_Christian_Andersen", wikiEn: "https://en.wikipedia.org/wiki/Hans_Christian_Andersen" },
  "LEGO Movie": { labelEn: "The Lego Movie", wiki: "https://it.wikipedia.org/wiki/The_LEGO_Movie", wikiEn: "https://en.wikipedia.org/wiki/The_Lego_Movie" },
  "Brave": { wiki: "https://it.wikipedia.org/wiki/Ribelle_-_The_Brave", wikiEn: "https://en.wikipedia.org/wiki/Brave_(2012_film)" },
  "Il Viaggio di Arlo": { labelEn: "The Good Dinosaur", wiki: "https://it.wikipedia.org/wiki/Il_viaggio_di_Arlo", wikiEn: "https://en.wikipedia.org/wiki/The_Good_Dinosaur" }
};

// ─── Parchi nazionali e aree naturali ───
var WIKI_PARKS = {
  "Lofoten": { wiki: "https://it.wikipedia.org/wiki/Lofoten", wikiEn: "https://en.wikipedia.org/wiki/Lofoten" },
  "Picos de Europa": { wiki: "https://it.wikipedia.org/wiki/Picos_de_Europa", wikiEn: "https://en.wikipedia.org/wiki/Picos_de_Europa" },
  "Cap de Creus": { wiki: "https://it.wikipedia.org/wiki/Cap_de_Creus", wikiEn: "https://en.wikipedia.org/wiki/Cap_de_Creus" },
  "Saimaa": { wiki: "https://it.wikipedia.org/wiki/Saimaa", wikiEn: "https://en.wikipedia.org/wiki/Saimaa" },
  "Lago Saimaa": { labelEn: "Lake Saimaa", wiki: "https://it.wikipedia.org/wiki/Saimaa", wikiEn: "https://en.wikipedia.org/wiki/Saimaa" },
  "Costa Brava": { wiki: "https://it.wikipedia.org/wiki/Costa_Brava", wikiEn: "https://en.wikipedia.org/wiki/Costa_Brava" },
  "Costa Azzurra": { labelEn: "French Riviera", wiki: "https://it.wikipedia.org/wiki/Costa_Azzurra", wikiEn: "https://en.wikipedia.org/wiki/French_Riviera" },
  "Circolo Polare Artico": { labelEn: "Arctic Circle", wiki: "https://it.wikipedia.org/wiki/Circolo_polare_artico", wikiEn: "https://en.wikipedia.org/wiki/Arctic_Circle" },
  "Allemannsretten": { wiki: "https://it.wikipedia.org/wiki/Diritto_di_pubblico_accesso", wikiEn: "https://en.wikipedia.org/wiki/Freedom_to_roam" },
  "Jokamiehenoikeus": { wiki: "https://it.wikipedia.org/wiki/Diritto_di_pubblico_accesso", wikiEn: "https://en.wikipedia.org/wiki/Freedom_to_roam#Finland" },
  "Møns Klint": { labelEn: "Møns Klint", wiki: "https://it.wikipedia.org/wiki/M%C3%B8ns_Klint", wikiEn: "https://en.wikipedia.org/wiki/M%C3%B8ns_Klint" },
  "Henningsvær": { wiki: "https://it.wikipedia.org/wiki/Henningsvaer", wikiEn: "https://en.wikipedia.org/wiki/Henningsv%C3%A6r" },
  "Hirtshals": { wiki: "https://it.wikipedia.org/wiki/Hirtshals", wikiEn: "https://en.wikipedia.org/wiki/Hirtshals" },
  "Getxo": { wiki: "https://it.wikipedia.org/wiki/Getxo", wikiEn: "https://en.wikipedia.org/wiki/Getxo" },
  "Tankavaara": { wiki: "https://it.wikipedia.org/wiki/Sodankyl%C3%A4", wikiEn: "https://en.wikipedia.org/wiki/Tankavaara" },
  "Lagos de Covadonga": { labelEn: "Lakes of Covadonga", wiki: "https://it.wikipedia.org/wiki/Covadonga", wikiEn: "https://en.wikipedia.org/wiki/Lakes_of_Covadonga" }
};

// ─── Termini cultura/natura nordica (used by injectWikiLinks) ───
var WIKI_NATURE = {
  "aurora boreale": { labelEn: "aurora", wiki: "https://it.wikipedia.org/wiki/Aurora_polare", wikiEn: "https://en.wikipedia.org/wiki/Aurora" },
  "sole di mezzanotte": { labelEn: "midnight sun", wiki: "https://it.wikipedia.org/wiki/Sole_di_mezzanotte", wikiEn: "https://en.wikipedia.org/wiki/Midnight_sun" },
  "sauna": { wiki: "https://it.wikipedia.org/wiki/Sauna", wikiEn: "https://en.wikipedia.org/wiki/Sauna" },
  "fiordo": { labelEn: "fjord", wiki: "https://it.wikipedia.org/wiki/Fiordo", wikiEn: "https://en.wikipedia.org/wiki/Fjord" },
  "renna": { labelEn: "reindeer", wiki: "https://it.wikipedia.org/wiki/Rangifer_tarandus", wikiEn: "https://en.wikipedia.org/wiki/Reindeer" },
  "renne": { labelEn: "reindeer", wiki: "https://it.wikipedia.org/wiki/Rangifer_tarandus", wikiEn: "https://en.wikipedia.org/wiki/Reindeer" },
  "Sami": { labelEn: "Sámi people", wiki: "https://it.wikipedia.org/wiki/Sami", wikiEn: "https://en.wikipedia.org/wiki/S%C3%A1mi_people" }
};
