// Coordinates for each day of the trip (index 0 = G0, index 1 = G1, etc.)
// Used by the weather widget to fetch Open-Meteo forecast
var TRIP_COORDS = [
  { lat: 46.6111, lng: 13.8558, city: "Villach", cityEn: "Villach" },           // G0 - Villach Austria
  { lat: 48.2082, lng: 16.3738, city: "Vienna", cityEn: "Vienna" },             // G1 - Vienna
  { lat: 52.2297, lng: 21.0122, city: "Varsavia", cityEn: "Warsaw" },           // G2 - Warsaw
  { lat: 54.6872, lng: 25.2797, city: "Vilnius", cityEn: "Vilnius" },           // G3 - Vilnius
  { lat: 56.0153, lng: 23.4161, city: "Šiauliai", cityEn: "Šiauliai" },        // G4 - Hill of Crosses
  { lat: 59.4370, lng: 24.7536, city: "Tallinn", cityEn: "Tallinn" },          // G5 - Tallinn
  { lat: 60.1699, lng: 24.9384, city: "Helsinki", cityEn: "Helsinki" },         // G6 - Helsinki/Lappeenranta
  { lat: 61.7667, lng: 29.3833, city: "Punkaharju", cityEn: "Punkaharju" },     // G7 - Punkaharju
  { lat: 61.5000, lng: 28.5000, city: "Lago Saimaa", cityEn: "Lake Saimaa" },   // G8 - Lake District
  { lat: 65.0121, lng: 25.4651, city: "Oulu", cityEn: "Oulu" },                // G9 - Oulu
  { lat: 65.9300, lng: 26.5100, city: "Ranua", cityEn: "Ranua" },              // G10 - Ranua
  { lat: 66.5436, lng: 25.8473, city: "Rovaniemi", cityEn: "Rovaniemi" },       // G11 - Rovaniemi
  { lat: 66.5000, lng: 25.7500, city: "Rovaniemi", cityEn: "Rovaniemi" },       // G12 - Santa Claus Village
  { lat: 69.0714, lng: 27.0142, city: "Utsjoki", cityEn: "Utsjoki" },          // G13 - Capo Nord approach
  { lat: 69.0485, lng: 20.7890, city: "Kilpisjärvi", cityEn: "Kilpisjärvi" },  // G14 - Three-country cairn
  { lat: 69.6496, lng: 18.9560, city: "Tromsø", cityEn: "Tromsø" },            // G15 - Tromsø
  { lat: 69.2950, lng: 17.0500, city: "Senja", cityEn: "Senja" },              // G16 - Senja
  { lat: 69.3267, lng: 16.1317, city: "Andøya", cityEn: "Andøya" },            // G17 - Andøya
  { lat: 69.3250, lng: 16.1300, city: "Andøya", cityEn: "Andøya" },            // G18 - Whale watching
  { lat: 68.2344, lng: 14.5686, city: "Svolvær", cityEn: "Svolvær" },          // G19 - Svolvær Lofoten
  { lat: 68.1483, lng: 14.2017, city: "Henningsvær", cityEn: "Henningsvær" },  // G20 - Henningsvær
  { lat: 68.2500, lng: 13.5833, city: "Lofoten", cityEn: "Lofoten" },          // G21 - Lofoten
  { lat: 67.9333, lng: 13.0833, city: "Reine", cityEn: "Reine" },              // G22 - Reine
  { lat: 68.0333, lng: 13.3500, city: "Lofoten Sud", cityEn: "South Lofoten" },// G23 - South Lofoten
  { lat: 66.5633, lng: 15.3117, city: "Saltstraumen", cityEn: "Saltstraumen" }, // G24 - Saltstraumen
  { lat: 63.4305, lng: 10.3951, city: "Trondheim", cityEn: "Trondheim" },      // G25 - Trondheim
  { lat: 63.4305, lng: 10.3951, city: "Trondheim", cityEn: "Trondheim" },      // G26 - Trondheim day 2
  { lat: 63.0167, lng: 7.3500, city: "Atlanterhavsveien", cityEn: "Atlantic Road" }, // G27 - Atlantic Road
  { lat: 62.4567, lng: 7.6700, city: "Trollstigen", cityEn: "Trollstigen" },   // G28 - Trollstigen
  { lat: 60.3913, lng: 5.3221, city: "Bergen", cityEn: "Bergen" },              // G29 - Bergen
  { lat: 60.3913, lng: 5.3221, city: "Bergen", cityEn: "Bergen" },              // G30 - Bergen day 2
  { lat: 58.9700, lng: 5.7331, city: "Stavanger", cityEn: "Stavanger" },        // G31 - Stavanger
  { lat: 58.9863, lng: 6.1885, city: "Preikestolen", cityEn: "Preikestolen" },  // G32 - Preikestolen
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen", cityEn: "Copenhagen" },     // G33 - Copenhagen
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen", cityEn: "Copenhagen" },     // G34 - Copenhagen day 2
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen", cityEn: "Copenhagen" },     // G35 - Copenhagen day 3
  { lat: 55.7308, lng: 9.1153, city: "Billund", cityEn: "Billund" },            // G36 - Billund
  { lat: 55.7308, lng: 9.1153, city: "Legoland", cityEn: "Legoland" },          // G37 - Legoland
  { lat: 55.7308, lng: 9.1153, city: "LEGO House", cityEn: "LEGO House" },      // G38 - LEGO House
  { lat: 53.0793, lng: 8.8017, city: "Brema", cityEn: "Bremen" },               // G39 - Bremen
  { lat: 49.8942, lng: 2.3022, city: "Amiens", cityEn: "Amiens" },              // G40 - Amiens
  { lat: 47.4133, lng: 0.9900, city: "Loira", cityEn: "Loire Valley" },         // G41 - Loire
  { lat: 47.4133, lng: 0.9900, city: "Loira", cityEn: "Loire Valley" },         // G42 - Loire day 2
  { lat: 43.3183, lng: -1.9812, city: "San Sebastián", cityEn: "San Sebastián" },// G43 - San Sebastian
  { lat: 43.2630, lng: -2.9350, city: "Bilbao", cityEn: "Bilbao" },             // G44 - Bilbao
  { lat: 43.1500, lng: -4.8000, city: "Picos de Europa", cityEn: "Picos de Europa" }, // G45 - Picos
  { lat: 42.0096, lng: -4.5288, city: "Palencia", cityEn: "Palencia" },         // G46 - Palencia
  { lat: 42.0096, lng: -4.5288, city: "Palencia", cityEn: "Palencia" },         // G47 - Palencia day 2
  { lat: 41.8800, lng: 3.1200, city: "Costa Brava", cityEn: "Costa Brava" },    // G48 - Costa Brava
  { lat: 42.2886, lng: 3.2743, city: "Cadaqués", cityEn: "Cadaqués" },          // G49 - Cadaqués
  { lat: 43.5528, lng: 7.0174, city: "Costa Azzurra", cityEn: "Côte d'Azur" },  // G50 - Côte d'Azur
  { lat: 44.4056, lng: 8.9463, city: "Genova", cityEn: "Genoa" },               // G51 - Genova
  { lat: 44.4056, lng: 8.9463, city: "Genova", cityEn: "Genoa" },               // G52 - Genova day 2
  { lat: 45.3900, lng: 11.8500, city: "Casa", cityEn: "Home" }                  // G53 - Selvazzano/Home
];
