#!/usr/bin/env python3
"""
Generate encyclopedic nature sections for all remaining countries using the LLM.
Each country gets IT, EN, ES versions.
Uses the Finland structure as template.
"""

import os
import time
from openai import OpenAI

client = OpenAI()

COUNTRIES = {
    "estonia": {
        "name_it": "Estonia",
        "name_en": "Estonia", 
        "name_es": "Estonia",
        "research": """
ESTONIA NATURE RESEARCH:
- Flora: ~50% territory forests (pine, spruce, birch). Bogs/wetlands 6-7% actual coverage.
  Mushrooms: cultural cornerstone "seenelkäik". Top edible: Chanterelle (kukeseen), Porcini (kivipuravik), Bay Bolete, Birch Bolete, Saffron Milkcap, Slippery Jack, Funnel Chanterelle, Hedgehog Mushroom.
  Dangerous: Death Cap (Amanita phalloides), Destroying Angel. Everyman's Right (Igaüheõigus).
  Berries: cloudberry (bogs), bilberry, lingonberry, cranberry.
  Bog plants: Sphagnum moss (absorbs 20x mass), sundew carnivorous.
  Trees: Scots pine, Norway spruce, silver/downy birch, oak (islands), ash.
- Fauna: Brown bear, Wolf, Eurasian Lynx (800! very high density for small country), Wolverine (rare).
  Flying squirrel (Pteromys volans) - only in Alutaguse NE Estonia, extremely rare in EU.
  Moose prefers bogs. Wild boar, beaver, roe deer.
  Grey seal (10,000+ in Estonian waters). Birds: White stork (nests on electric poles), Black stork, Common crane, Eurasian eagle-owl.
  Matsalu National Park: one of most important wetland bird areas in Europe (East Atlantic Flyway), 250+ plant species, millions migratory birds.
  Fish: pike, perch, pikeperch, eel, salmon, Baltic herring (kiluvõileib!).
- Geology: Baltic Klint - 1100-1200 km limestone escarpment, best in N. Estonia.
  Ordovician limestone 470-460 million years old. UNESCO tentative list. Up to 56m at Ontika.
  Glacial erratic boulders: Ehalkivi ("Sunset Glow Rock") biggest in N. Europe, 7m high, 48.2m circumference.
  Kaali meteorite crater on Saaremaa (3,500 years old, 110m diameter). 2,222 islands.
  Flat terrain: highest point Suur Munamägi only 318m.
- Natural Phenomena: White nights at 59°N. Sun sets ~11pm, rises ~4am. ~19h daylight at solstice.
  Never truly dark. No midnight sun (too far south). Short winter days ~6h in December.
- Ecosystems: Hemiboreal forest (transition boreal/temperate).
  Raised bogs: oldest 9,000-10,000 years, peat 5-7m thick, 1mm/year.
  Stages: lake→fen→transitional mire→raised bog. Soomaa NP "fifth season" (spring floods).
  Coastal meadows and alvars (thin soil on limestone, unique grassland).
  West Estonian archipelago: unique maritime ecosystem.
"""
    },
    "latvia": {
        "name_it": "Lettonia",
        "name_en": "Latvia",
        "name_es": "Letonia",
        "research": """
LATVIA NATURE RESEARCH:
- Flora: ~52% territory forests (one of most forested in EU). Pine, spruce, birch dominant.
  Gauja NP: 900+ plant species. Wild orchids in meadows.
  Berries and mushrooms same as Baltic region (chanterelle, porcini, bilberry, lingonberry).
  Ancient oaks in Tērvete. Kemeri NP: sulfur springs, raised bogs.
- Fauna: Gauja NP has 52 of 60+ mammal species in Latvia, 149 bird species.
  Large carnivores: lynx, wolves (growing population), moose, wild boar.
  European bison reintroduced. Eurasian otters, red deer.
  Black storks (endangered), corncrakes, lesser-spotted eagles, beaver.
  Baltic grey seal on coast. Harbour seal.
- Geology: Gauja NP - 350 million year old Devonian red sandstone cliffs and caves.
  Gutmanis Cave: largest cave in Baltics (10m high, 19m deep), inscriptions from 1668.
  Baltic coast: 496 km, Jurmala White Dunes (15m high).
  Baltic amber (fossilized resin 40-50 million years old, washes up on beaches).
  Flat terrain, glacial landscape.
- Natural Phenomena: White nights (57°N). ~18.5h daylight at solstice.
  Amber washed ashore after storms. Bog gas (will-o'-the-wisp folklore).
- Ecosystems: Boreal/hemiboreal forests. Raised bogs (Kemeri, Teiči).
  Coastal dunes and pine forests. River valleys (Gauja, Daugava).
  Floodplain meadows important for biodiversity.
"""
    },
    "lithuania": {
        "name_it": "Lituania",
        "name_en": "Lithuania",
        "name_es": "Lituania",
        "research": """
LITHUANIA NATURE RESEARCH:
- Flora: ~33% territory forests. Pine forests on sandy soils, mixed forests inland.
  Curonian Spit: unique dune vegetation, Curonian rose, marram grass, mountain pine.
  Dzūkija region: famous for mushroom picking tradition.
  Berries: bilberry, lingonberry, cranberry in bogs.
- Fauna: White Stork national bird, ~13,000 breeding pairs (3rd largest in EU).
  Densities up to 160 nests/100 km² in western Lithuania. Nests on poles/chimneys.
  Moose, deer, wild boar, beaver (very common), wolf (small population ~250).
  Nemunas Delta: important bird migration area.
  Curonian Lagoon: rich fish populations, cormorant colonies.
- Geology: Curonian Spit - 98 km sand dune peninsula, UNESCO.
  Grand Dune Ridge, shifting dunes up to 60m high.
  Formed by wind and sea over thousands of years. Dunes move.
  Nemunas Delta: very young (1,000-1,100 years), river branches and polders.
  Flat glacial terrain, moraines. Baltic amber deposits.
- Natural Phenomena: White nights (55-56°N). ~17-18h daylight at solstice.
  Amber washed up on coast. Stork migration spectacle in August.
- Ecosystems: Mixed/hemiboreal forests. Curonian Spit dune ecosystem (fragile).
  Wetlands and river deltas. Peatlands/bogs.
  Žuvintas Biosphere Reserve: lake and marsh ecosystem.
"""
    },
    "poland": {
        "name_it": "Polonia",
        "name_en": "Poland",
        "name_es": "Polonia",
        "research": """
POLAND NATURE RESEARCH:
- Flora: ~30% territory forests. Białowieża: last primeval forest in Europe.
  Ancient oaks 500+ years, linden, hornbeam, spruce, ash. 1,000+ vascular plant species.
  Tatra: alpine flora - edelweiss, gentian, alpine poppy, dwarf pine (kosodrzewina).
  Słowiński: dune grasses, sea buckthorn, coastal pine.
- Fauna: Białowieża: 800+ European bison (żubr), 25% world population.
  12,000+ animal species. Wolves, lynx, wild boar, deer, beaver, elk.
  Tatra: Tatra chamois (endemic subspecies), Alpine marmot, brown bear (~200 in Poland),
  wolf, lynx, golden eagle.
  White stork: largest population in EU (~52,000 pairs). "Stork villages."
  Biebrza Marshes: aquatic warbler (globally threatened), spotted eagle, corncrake.
- Geology: Tatra Mountains: highest Carpathians, granite/limestone, glacial lakes (morskie oko).
  Białowieża: flat glacial terrain, ancient undisturbed soils.
  Słowiński NP: moving sand dunes 40m+ high, move 3-10m/year ("Polish Sahara").
  Baltic coast: amber deposits, chalk cliffs on Rügen nearby.
  Salt mines (Wieliczka) - underground chambers carved in Miocene salt.
- Natural Phenomena: Stork migration (Aug-Sep). Bison rut (Aug-Sep).
  Tatra weather: rapid changes, föhn wind (halny).
- Ecosystems: Primeval forest (Białowieża) - unique in Europe, undisturbed for millennia.
  Alpine/subalpine (Tatra). Coastal dune (Słowiński).
  Largest wetlands in Central Europe (Biebrza). River floodplains.
"""
    },
    "austria": {
        "name_it": "Austria",
        "name_en": "Austria",
        "name_es": "Austria",
        "research": """
AUSTRIA NATURE RESEARCH:
- Flora: ~47% territory forests (spruce dominant). Alpine flora iconic.
  Edelweiss (Leontopodium nivale) - protected, symbol of Alps, woolly white star flower.
  Gentian (Gentiana) - intense blue trumpet flowers, used for schnapps (Enzian).
  Alpenrose (Rhododendron ferrugineum) - pink/magenta alpine shrub, blooms June-July.
  Arolla pine (Pinus cembra) - high altitude (1,500-2,500m), slow growing, 1000+ years.
  Larch (Larix decidua) - only deciduous conifer, golden autumn color.
- Fauna: Alpine ibex (Capra ibex) - 100kg, massive curved horns, steep rocky terrain.
  Chamois (Rupicapra rupicapra) - agile mountain goat-antelope, 30-50kg.
  Alpine marmot (Marmota marmota) - whistling alarm call, hibernates 6 months, social colonies.
  Golden eagle (Aquila chrysaetos) - 2m wingspan, hunts marmots and hares.
  Bearded vulture (Gypaetus barbatus) - reintroduced, 2.8m wingspan, eats bones.
  Alpine salamander - entirely black, viviparous (gives live birth at altitude).
  Red deer, chamois, ibex around Grossglockner.
- Geology: Alps formed by collision African/European plates (Tethys Sea closure).
  Grossglockner 3,798m highest peak. Pasterze glacier (retreating rapidly).
  Limestone Alps (Northern/Southern Calcareous Alps) - karst, caves.
  Eisriesenwelt: largest ice cave in world (42km passages).
  Crystalline Central Alps: gneiss, granite, schist.
  Hohe Tauern: window into deep Earth crust.
- Natural Phenomena: Föhn wind (warm dry wind from south). Alpine glow (Alpenglühen).
  Glacier retreat visible. Thunderstorms in summer afternoons.
- Ecosystems: Altitudinal zonation: valley forests→subalpine→alpine meadows→nival (rock/ice).
  Donau-Auen NP: Danube wetlands, last major floodplain in Central Europe.
  Neusiedler See: steppe lake, unique in Central Europe, bird paradise.
"""
    },
    "denmark": {
        "name_it": "Danimarca",
        "name_en": "Denmark",
        "name_es": "Dinamarca",
        "research": """
DENMARK NATURE RESEARCH:
- Flora: Beech forests (UNESCO World Heritage - ancient beech forests of Europe).
  European beech dominant, arrived 3,500 years ago. Oak also common.
  Heathland (Jutland): heather (Calluna vulgaris), juniper.
  Coastal: marram grass, sea buckthorn, lyme grass on dunes.
  No mountains, gentle rolling landscape.
- Fauna: Red deer (largest wild land animal). Roe deer very common.
  Marine: harbour porpoise (only cetacean resident year-round), harbour seal, grey seal.
  Wadden Sea birds: 12-15 million migratory birds, 400+ species.
  "Sort Sol" (Black Sun): spectacular starling murmurations (spring/autumn in marshes).
  White-tailed eagle (returned after near-extinction). Barn owl, buzzard.
- Geology: Entirely shaped by Ice Age glaciation. No mountains (highest 171m Møllehøj).
  Møns Klint: 70m chalk cliffs, 70 million year old (Cretaceous). Fossils.
  Stevns Klint: UNESCO, K-Pg boundary layer (dinosaur extinction 66 mya) visible!
  Moraine landscape, erratic boulders from Scandinavia.
  Skagen: where Kattegat meets Skagerrak (two seas visible).
- Natural Phenomena: Sort Sol starling murmurations (March-April, Sep-Oct).
  White nights mild (56°N, ~18h daylight). Strong winds, North Sea storms.
  Tidal flats of Wadden Sea: twice daily 1.5m tides expose vast mudflats.
- Ecosystems: Wadden Sea (UNESCO): tidal flats, salt marshes, seagrass beds.
  Beech forest (temperate deciduous). Heathland (Jutland).
  Coastal dunes. Fjord systems (Limfjorden, Roskilde).
"""
    },
    "france": {
        "name_it": "Francia",
        "name_en": "France",
        "name_es": "Francia",
        "research": """
FRANCE (ATLANTIC COAST / BRITTANY / NORMANDY) NATURE RESEARCH:
- Flora: Brittany: maritime pine, Scots pine, gorse (ajonc - yellow flowers), heather.
  Normandy: beech, oak, apple orchards (cider). Bocage hedgerow landscape.
  Atlantic coast: maritime pine forests (Landes), dune vegetation.
  Tidal pools: diverse algae, kelp forests. Seagrass beds.
- Fauna: Brittany coast (2,800 km - longest in France):
  Common bottlenose dolphin (resident pods in Iroise Sea).
  Basking shark (2nd largest fish, filter feeder, summer visitor).
  Grey seal (Iroise Sea, Sept-Îles - largest French colony ~800).
  Atlantic puffin colonies (Sept-Îles reserve - only French breeding colony).
  Northern gannet (Rouzic island - 20,000+ pairs).
  Normandy: peregrine falcon on cliffs. Seabird colonies.
  Bay of Biscay: fin whale, pilot whale, common dolphin.
- Geology: Brittany: Armorican Massif - ancient granite/gneiss (600+ million years).
  Pink granite coast (Côte de Granit Rose) - unique rose-colored granite eroded into shapes.
  Normandy: chalk cliffs of Étretat (same formation as Dover).
  Mont Saint-Michel: tidal island, fastest tides in Europe (up to 15m range).
  Basque coast flysch: layered sedimentary rock tilted vertically.
- Natural Phenomena: Extreme tides (Brittany/Normandy - up to 14m range, among highest in world).
  Mont Saint-Michel tidal bore. Bioluminescence (plankton, rare).
  Atlantic storms (winter). Mild Gulf Stream influence.
- Ecosystems: Rocky intertidal (richest in Europe on Brittany coast).
  Kelp forests (Laminaria). Seagrass meadows (Zostera).
  Temperate deciduous forest. Bocage (hedgerow farmland).
  Estuaries (Loire, Seine) - nursery for fish.
"""
    },
    "spain": {
        "name_it": "Spagna",
        "name_en": "Spain",
        "name_es": "España",
        "research": """
SPAIN (CANTABRIAN COAST / BASQUE COUNTRY / ASTURIAS) NATURE RESEARCH:
- Flora: "Green Spain" (España Verde) - Atlantic climate, lush and rainy.
  Atlantic forest: sessile oak, beech, chestnut, birch (very different from dry Spain).
  Eucalyptus plantations (controversial, invasive). Laurel forest remnants.
  Picos de Europa: alpine meadows, endemic plants.
  Basque coast: coastal scrub, holm oak on limestone.
- Fauna: Cantabrian brown bear (Ursus arctos, ~350 individuals - recovered from 70 in 1990s!).
  Somiedo Natural Park: best bear observation area.
  Iberian wolf (Canis lupus signatus) - ~300 in NW Spain, controversial.
  Cantabrian chamois (rebeco, Rupicapra pyrenaica parva).
  Griffon vulture (huge colonies), Egyptian vulture, golden eagle.
  Cantabrian capercaillie (Tetrao urogallus cantabricus) - critically endangered (<500).
  Bay of Biscay: fin whale, sperm whale, Cuvier's beaked whale, common dolphin.
- Geology: Picos de Europa: massive limestone massif, deepest gorge in Europe (Cares).
  Karst formations, caves (Altamira, Tito Bustillo - prehistoric art).
  Basque coast flysch at Zumaia: spectacular layered rock exposing K-Pg boundary
  (dinosaur extinction layer visible! - 60 million years of Earth history in cliffs).
  Asturias: Paleozoic rocks, coal deposits, Jurassic dinosaur coast.
- Natural Phenomena: Cantabrian mists (constant fog/drizzle = "orbayu/orballo").
  Green flash at sunset over Bay of Biscay. Atlantic storms.
  Bear emergence from hibernation (March-April).
- Ecosystems: Atlantic temperate forest (unique in Iberian Peninsula).
  Cantabrian mountain ecosystem (bears, wolves, chamois, vultures).
  Marine: Bay of Biscay canyon system (cetacean hotspot).
  Estuaries (rías) - rich marine nurseries.
  Picos de Europa: alpine lakes (Lagos de Covadonga).
"""
    }
}

SYSTEM_PROMPT = """You are an expert nature writer creating encyclopedic content for a travel app.
Write in the specified language with extreme detail about each species, geological formation, and ecosystem.
Follow this exact structure with markdown formatting:
- Use ## for main sections (Flora, Fauna, Geology, Natural Phenomena, Ecosystems)
- Use ### for subsections
- Use - **Species name (*Scientific name*, local name)** for species entries with detailed descriptions
- Include ![image alt](images/nature/filename.jpg) where appropriate
- Include identification tables for mushrooms/berries where relevant
- Be extremely detailed: physical descriptions, behaviors, numbers, conservation status
- Include practical tips for the traveler (where to see, when, safety)
- End with a sources line: *Fonti e Riferimenti...*
The content should be 150-200 lines, matching the depth of the Finland example."""

def generate_country_content(country_key, lang):
    """Generate nature content for a country in a specific language."""
    country = COUNTRIES[country_key]
    research = country["research"]
    
    if lang == "it":
        name = country["name_it"]
        instruction = f"""Scrivi una sezione naturalistica ESTREMAMENTE dettagliata ed enciclopedica per {name} in ITALIANO.
Usa la stessa struttura della Finlandia: ## Flora, ## Fauna, ## Geologia, ## Fenomeni Naturali, ## Ecosistemi.
Ogni specie deve avere: nome italiano, nome scientifico in corsivo, nome locale, descrizione fisica dettagliata, comportamento, dove/quando vederla.
Per i funghi includi una tabella di identificazione con sosia pericolosi.
Sii MOLTO dettagliato (almeno 150 righe). Includi riferimenti a immagini dove appropriato usando ![alt](images/nature/filename.jpg).
Inizia con: # Natura — {name}
Poi un paragrafo introduttivo, poi le 5 sezioni ##."""
    elif lang == "en":
        name = country["name_en"]
        instruction = f"""Write an EXTREMELY detailed and encyclopedic nature section for {name} in ENGLISH.
Use the same structure: ## Flora, ## Fauna, ## Geology, ## Natural Phenomena, ## Ecosystems.
Each species must have: English name, scientific name in italics, local name, detailed physical description, behavior, where/when to see it.
For mushrooms include an identification table with dangerous lookalikes.
Be VERY detailed (at least 150 lines). Include image references where appropriate using ![alt](images/nature/filename.jpg).
Start with: # Nature — {name}
Then an introductory paragraph, then the 5 ## sections."""
    else:  # es
        name = country["name_es"]
        instruction = f"""Escribe una sección naturalista EXTREMADAMENTE detallada y enciclopédica para {name} en ESPAÑOL.
Usa la misma estructura: ## Flora, ## Fauna, ## Geología, ## Fenómenos Naturales, ## Ecosistemas.
Cada especie debe tener: nombre español, nombre científico en cursiva, nombre local, descripción física detallada, comportamiento, dónde/cuándo verla.
Para hongos incluye una tabla de identificación con dobles peligrosos.
Sé MUY detallado (al menos 150 líneas). Incluye referencias a imágenes donde sea apropiado usando ![alt](images/nature/filename.jpg).
Empieza con: # Naturaleza — {name}
Luego un párrafo introductorio, luego las 5 secciones ##."""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"{instruction}\n\nRICERCA/RESEARCH DATA:\n{research}"}
    ]
    
    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model="gpt-5",
                max_completion_tokens=8000,
                messages=messages
            )
            content = response.choices[0].message.content
            if content and len(content) > 500:
                return content
            print(f"  Warning: short response for {country_key}/{lang}, retrying...")
        except Exception as e:
            print(f"  Error for {country_key}/{lang}: {e}")
            time.sleep(5)
    
    return None


def main():
    base_dir = "/home/ubuntu/quo-vadis"
    
    for country_key in COUNTRIES:
        print(f"\n{'='*60}")
        print(f"Generating: {country_key.upper()}")
        print(f"{'='*60}")
        
        for lang in ["it", "en", "es"]:
            out_file = f"{base_dir}/{country_key}-nature-encyclopedic-{lang}.md"
            
            # Skip if already exists and has content
            if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
                print(f"  Skipping {country_key}/{lang} (already exists)")
                continue
            
            print(f"  Generating {country_key}/{lang}...")
            content = generate_country_content(country_key, lang)
            
            if content:
                with open(out_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  Saved {out_file} ({len(content)} chars)")
            else:
                print(f"  FAILED to generate {country_key}/{lang}")
            
            time.sleep(2)  # Rate limiting


if __name__ == "__main__":
    main()
