// Coordinates for each day of the trip (index 0 = G1, index 1 = G2, etc.)
// Used by the weather widget to fetch Open-Meteo forecast
var TRIP_COORDS = [
  { lat: 47.3765, lng: 15.0914, city: "Leoben", cityEn: "Leoben", country: "Austria", flag: "🇦🇹" },           // G1
  { lat: 48.2082, lng: 16.3738, city: "Vienna", cityEn: "Vienna", country: "Austria", flag: "🇦🇹" },             // G2
  { lat: 52.2297, lng: 21.0122, city: "Varsavia", cityEn: "Warsaw", country: "Polonia", flag: "🇵🇱" },           // G3
  { lat: 54.6872, lng: 25.2797, city: "Vilnius", cityEn: "Vilnius", country: "Lituania", flag: "🇱🇹" },           // G4
  { lat: 56.9490, lng: 24.1052, city: "Riga", cityEn: "Riga", country: "Lettonia", flag: "🇱🇻" },           // G5 (destinazione: Riga)
  { lat: 59.4370, lng: 24.7536, city: "Tallinn", cityEn: "Tallinn", country: "Estonia", flag: "🇪🇪" },      // G6 (Riga ➔ Pärnu ➔ Haapsalu ➔ Tallinn — notte a Tallinn, cambio programma 30/06)
  { lat: 59.4370, lng: 24.7536, city: "Tallinn", cityEn: "Tallinn", country: "Estonia", flag: "🇪🇪" },          // G7
  { lat: 60.1699, lng: 24.9384, city: "Helsinki", cityEn: "Helsinki", country: "Finlandia", flag: "🇫🇮" },       // G8
  { lat: 61.7667, lng: 29.3833, city: "Punkaharju", cityEn: "Punkaharju", country: "Finlandia", flag: "🇫🇮" },   // G9
  { lat: 61.5000, lng: 28.5000, city: "Lago Saimaa", cityEn: "Lake Saimaa", country: "Finlandia", flag: "🇫🇮" }, // G10
  { lat: 65.0121, lng: 25.4651, city: "Oulu", cityEn: "Oulu", country: "Finlandia", flag: "🇫🇮" },              // G11
  { lat: 65.9300, lng: 26.5100, city: "Ranua", cityEn: "Ranua", country: "Finlandia", flag: "🇫🇮" },            // G12
  { lat: 66.5436, lng: 25.8473, city: "Rovaniemi", cityEn: "Rovaniemi", country: "Finlandia", flag: "🇫🇮" },     // G13
  { lat: 66.5000, lng: 25.7500, city: "Rovaniemi", cityEn: "Rovaniemi", country: "Finlandia", flag: "🇫🇮" },     // G14
  { lat: 69.0714, lng: 27.0142, city: "Utsjoki", cityEn: "Utsjoki", country: "Finlandia", flag: "🇫🇮" },        // G15
  { lat: 69.0485, lng: 20.7890, city: "Kilpisjärvi", cityEn: "Kilpisjärvi", country: "Finlandia", flag: "🇫🇮" },// G16
  { lat: 69.6496, lng: 18.9560, city: "Tromsø", cityEn: "Tromsø", country: "Norvegia", flag: "🇳🇴" },           // G17
  { lat: 69.2950, lng: 17.0500, city: "Senja", cityEn: "Senja", country: "Norvegia", flag: "🇳🇴" },             // G18
  { lat: 69.3267, lng: 16.1317, city: "Andøya", cityEn: "Andøya", country: "Norvegia", flag: "🇳🇴" },           // G19
  { lat: 69.3250, lng: 16.1300, city: "Andøya", cityEn: "Andøya", country: "Norvegia", flag: "🇳🇴" },           // G20
  { lat: 68.2344, lng: 14.5686, city: "Svolvær", cityEn: "Svolvær", country: "Norvegia", flag: "🇳🇴" },         // G21
  { lat: 68.1483, lng: 14.2017, city: "Henningsvær", cityEn: "Henningsvær", country: "Norvegia", flag: "🇳🇴" }, // G22
  { lat: 68.2500, lng: 13.5833, city: "Lofoten", cityEn: "Lofoten", country: "Norvegia", flag: "🇳🇴" },         // G23
  { lat: 67.9333, lng: 13.0833, city: "Reine", cityEn: "Reine", country: "Norvegia", flag: "🇳🇴" },             // G24
  { lat: 68.0333, lng: 13.3500, city: "Lofoten Sud", cityEn: "South Lofoten", country: "Norvegia", flag: "🇳🇴" },// G25
  { lat: 66.5633, lng: 15.3117, city: "Saltstraumen", cityEn: "Saltstraumen", country: "Norvegia", flag: "🇳🇴" },// G26
  { lat: 62.7373, lng: 7.1591, city: "Molde", cityEn: "Molde", country: "Norvegia", flag: "🇳🇴" },               // G27 Atlantic Road → Molde
  { lat: 62.1013, lng: 7.2059, city: "Geiranger", cityEn: "Geiranger", country: "Norvegia", flag: "🇳🇴" },         // G28 Trollstigen → Geiranger
  { lat: 60.8630, lng: 7.1140, city: "Flåm", cityEn: "Flåm", country: "Norvegia", flag: "🇳🇴" },               // G29 Geiranger → Flåm
  { lat: 60.4190, lng: 7.1530, city: "Eidfjord", cityEn: "Eidfjord", country: "Norvegia", flag: "🇳🇴" },           // G30 Nærøyfjord → Eidfjord
  { lat: 60.4190, lng: 7.1530, city: "Eidfjord", cityEn: "Eidfjord", country: "Norvegia", flag: "🇳🇴" },           // G31 Eidfjord (riposo)
  { lat: 60.3913, lng: 5.3221, city: "Bergen", cityEn: "Bergen", country: "Norvegia", flag: "🇳🇴" },               // G32 Eidfjord → Vøringsfossen → Bergen
  { lat: 58.9700, lng: 5.7331, city: "Stavanger", cityEn: "Stavanger", country: "Norvegia", flag: "🇳🇴" },         // G33 Bergen → Stavanger
  { lat: 58.9700, lng: 5.7331, city: "Stavanger", cityEn: "Stavanger", country: "Norvegia", flag: "🇳🇴" },         // G34 Preikestolen (notte Stavanger)
  { lat: 58.1460, lng: 7.9960, city: "Kristiansand", cityEn: "Kristiansand", country: "Norvegia", flag: "🇳🇴" },   // G35 Stavanger → Kristiansand + Dyrepark
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen", cityEn: "Copenhagen", country: "Danimarca", flag: "🇩🇰" },     // G36 K.sand → Copenhagen
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen", cityEn: "Copenhagen", country: "Danimarca", flag: "🇩🇰" },   // G37
  { lat: 55.7308, lng: 9.1153, city: "Billund", cityEn: "Billund", country: "Danimarca", flag: "🇩🇰" },          // G38
  { lat: 55.7308, lng: 9.1153, city: "Legoland", cityEn: "Legoland", country: "Danimarca", flag: "🇩🇰" },        // G39
  { lat: 55.7308, lng: 9.1153, city: "LEGO House", cityEn: "LEGO House", country: "Danimarca", flag: "🇩🇰" },    // G40
  { lat: 53.0793, lng: 8.8017, city: "Brema", cityEn: "Bremen", country: "Germania", flag: "🇩🇪" },              // G41
  { lat: 49.8942, lng: 2.3022, city: "Amiens", cityEn: "Amiens", country: "Francia", flag: "🇫🇷" },              // G42
  { lat: 47.4133, lng: 0.9900, city: "Loira", cityEn: "Loire Valley", country: "Francia", flag: "🇫🇷" },         // G43
  { lat: 47.4133, lng: 0.9900, city: "Loira", cityEn: "Loire Valley", country: "Francia", flag: "🇫🇷" },         // G44
  { lat: 43.3183, lng: -1.9812, city: "San Sebastián", cityEn: "San Sebastián", country: "Spagna", flag: "🇪🇸" },// G45
  { lat: 43.2630, lng: -2.9350, city: "Bilbao", cityEn: "Bilbao", country: "Spagna", flag: "🇪🇸" },              // G46
  { lat: 43.1500, lng: -4.8000, city: "Picos de Europa", cityEn: "Picos de Europa", country: "Spagna", flag: "🇪🇸" }, // G47
  { lat: 42.0096, lng: -4.5288, city: "Palencia", cityEn: "Palencia", country: "Spagna", flag: "🇪🇸" },          // G48
  { lat: 42.0096, lng: -4.5288, city: "Palencia", cityEn: "Palencia", country: "Spagna", flag: "🇪🇸" },          // G49
  { lat: 41.8800, lng: 3.1200, city: "Costa Brava", cityEn: "Costa Brava", country: "Spagna", flag: "🇪🇸" },     // G50
  { lat: 42.2886, lng: 3.2743, city: "Cadaqués", cityEn: "Cadaqués", country: "Spagna", flag: "🇪🇸" },           // G51
  { lat: 43.5528, lng: 7.0174, city: "Costa Azzurra", cityEn: "Côte d'Azur", country: "Francia", flag: "🇫🇷" },  // G52
  { lat: 44.4056, lng: 8.9463, city: "Genova", cityEn: "Genoa", country: "Italia", flag: "🇮🇹" },                // G53
  { lat: 44.4056, lng: 8.9463, city: "Genova", cityEn: "Genoa", country: "Italia", flag: "🇮🇹" },                // G54
  { lat: 45.3900, lng: 11.8500, city: "Casa", cityEn: "Home", country: "Italia", flag: "🇮🇹" }                   // G55
];
