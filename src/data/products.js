// Aracribs - High End Invertebrate Enclosures & Husbandry Catalog Data
// Currency: Indian Rupees (INR / ₹) Only

export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1.00, label: 'INR (₹)' }
};

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'grid' },
  { id: 'terrestrial', name: 'Terrestrial Cribs', icon: 'square' },
  { id: 'arboreal', name: 'Arboreal Treehouses', icon: 'columns' },
  { id: 'fossorial', name: 'Fossorial Deep Burrows', icon: 'layers' },
  { id: 'micro', name: 'Sling & Micro Cribs', icon: 'sparkles' },
  { id: 'cylinder', name: '360 Cylinders & Hex', icon: 'circle' },
  { id: 'substrate', name: 'Substrates & Bioactive', icon: 'droplet' },
  { id: 'decor', name: 'Hides & Cork Bark', icon: 'compass' },
  { id: 'accessories', name: 'Accessories & Tools', icon: 'wrench' },
  { id: 'bundles', name: 'Habitat Bundles', icon: 'package' }
];

export const PRODUCTS = [
  {
    id: 'treehouse-switch-446',
    name: 'Treehouse Switch 446 (Arboreal)',
    category: 'arboreal',
    type: 'enclosure',
    badge: 'Best Seller',
    tagline: 'Precision front-opening acrylic habitat for climbing species and jumpers',
    price: 3299,
    compareAtPrice: 3899,
    rating: 4.95,
    reviewCount: 342,
    dimensions: {
      inches: '4" L x 4" W x 6" H',
      cm: '10.2 x 10.2 x 15.2 cm',
      length: 4, width: 4, height: 6
    },
    substrateDepth: '1.75" deep water-tight well',
    volume: '1.6 Liters / 0.4 Gallons',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: 'Front-Opening Switch Door with Dual N52 Magnets',
    ventilation: 'Laser Cross-Flow Micro Ventilation (1.8mm holes)',
    suitableSpecies: [
      'Caribena versicolor (Antilles Pink Toe)',
      'Avicularia avicularia (Pink Toe)',
      'Phidippus regius (Regal Jumping Spider)',
      'Poecilotheria metallica (Juvenile)',
      'Praying Mantis (Orchid, Ghost)'
    ],
    inStock: true,
    stockCount: 14,
    description: `The Treehouse Switch 446 represents the peak of arboreal micro-husbandry. Engineered specifically for tree-dwelling invertebrates and jumping spiders that build web hammocks near the top of their enclosures. Traditional top-opening lids tear fragile arboreal web retreats—our signature front magnetic switch door gives complete access to the habitat without disturbing your animal's delicate aerial web structure.

Constructed from ultra-pure cast acrylic that boasts higher optical clarity than standard float glass, with laser-cut cross ventilation arranged to prevent humidity pockets while keeping feeder insects inside.`,
    features: [
      'Front-opening door eliminates damage to canopy web nests',
      'High-grade dual N52 neodymium magnetic latches',
      'Water-tight 1.75-inch substrate well for live moss & springtails',
      'Laser-cut ventilation with 1.8mm escape-proof diameter',
      'Beveled diamond-polished edges for crystal clarity'
    ],
    lidVariants: [
      { name: 'Standard Laser Cross-Vent (1.8mm)', priceOffset: 0 },
      { name: 'Fine-Mesh High Airflow Canopy', priceOffset: 400 },
      { name: 'Top Feeder Port Switch Lid', priceOffset: 600 }
    ],
    colors: ['Crystal Clear', 'Smoked Obsidian Back Panel', 'Frosted Privacy Base'],
    svgType: 'arboreal'
  },
  {
    id: 'treehouse-pro-668',
    name: 'Treehouse Switch 668 Pro (Arboreal)',
    category: 'arboreal',
    type: 'enclosure',
    badge: 'Pro Tier',
    tagline: 'Full-size arboreal display habitat for sub-adult and adult tree-dwellers',
    price: 4999,
    compareAtPrice: 5799,
    rating: 4.98,
    reviewCount: 489,
    dimensions: {
      inches: '6" L x 6" W x 8" H',
      cm: '15.2 x 15.2 x 20.3 cm',
      length: 6, width: 6, height: 8
    },
    substrateDepth: '2.25" deep leak-proof well',
    volume: '4.7 Liters / 1.25 Gallons',
    acrylicThickness: '4.5mm Heavyweight Cast Acrylic',
    lidStyle: 'Full Front Drop-Down Latch & Top Access Hatch',
    ventilation: 'Dual-Zone Chimney Cross Ventilation',
    suitableSpecies: [
      'Adult Caribena versicolor',
      'Poecilotheria regalis / metallica',
      'Psalmopoeus cambridgei / irminia',
      'Heteropoda venatoria (Huntsman)',
      'Green Bottle Blue (Arboreal setup)'
    ],
    inStock: true,
    stockCount: 8,
    description: `Designed for keepers who demand the best for their medium to large arboreal spiders. The Treehouse Pro 668 features an expansive 8-inch vertical flight path, enabling lush cork bark arrangements and natural vertical retreats. Equipped with dual-action ventilation that pulls cool air from bottom vents and exhausts through top canopy ports, simulating natural tropical cross-breezes.`,
    features: [
      'Generous 6x6x8 footprint accommodates large cork rounds',
      'Quad-magnet latch with anti-deflection reinforcing frame',
      'Chimney-effect cross-ventilation system',
      'Integrated top magnetic feeding hatch for cricket drops',
      'Zero distortion 360-degree panoramic viewing'
    ],
    lidVariants: [
      { name: 'Dual Access (Front Door + Top Hatch)', priceOffset: 0 },
      { name: 'Micro-Mesh Bioactive Venting', priceOffset: 500 }
    ],
    colors: ['Crystal Clear', 'Smoked Black Backplate'],
    svgType: 'arboreal'
  },
  {
    id: 'slider-crib-pro-866',
    name: 'Slider Crib Pro 866 (Terrestrial)',
    category: 'terrestrial',
    type: 'enclosure',
    badge: 'Bestseller',
    tagline: 'Silky smooth top-sliding lid with magnetic safety stop and deep substrate well',
    price: 4499,
    compareAtPrice: 5199,
    rating: 4.92,
    reviewCount: 512,
    dimensions: {
      inches: '8" L x 6" W x 6" H',
      cm: '20.3 x 15.2 x 15.2 cm',
      length: 8, width: 6, height: 6
    },
    substrateDepth: '3.0" deep burrow reservoir',
    volume: '4.7 Liters / 1.25 Gallons',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: 'Smooth-Glide Sliding Lid with Magnetic Locking Detents',
    ventilation: '360 Perimeter Cross-Hole Grid',
    suitableSpecies: [
      'Brachypelma hamorii (Mexican Red Knee)',
      'Grammostola pulchra (Brazilian Black)',
      'Tliltocatl albopilosus (Curly Hair)',
      'Chromatopelma cyaneopubescens (GBB)',
      'Aphonopelma chalcodes (Arizona Blonde)'
    ],
    inStock: true,
    stockCount: 22,
    description: `The Slider Crib Pro 866 is the flagship terrestrial habitat praised by thousands of arachnid enthusiasts worldwide. The engineered slide-in track allows you to gently open the enclosure inch-by-inch without vibrations or sudden snapping that would startle skittish ground species. Twin N52 magnets create a positive lock that no tarantula can push open.`,
    features: [
      'Vibration-free slide track prevents startled defensive displays',
      'Full 3-inch substrate well for natural burrow excavation',
      'Triple magnetic safety stop prevents accidental lid drop',
      'Micro-hole cross flow pattern ensures fresh air exchange without drying substrate',
      'Flame-polished crystal edges'
    ],
    lidVariants: [
      { name: 'Standard Smooth-Slide (Vented)', priceOffset: 0 },
      { name: 'High-Vent Arid Slotted Lid', priceOffset: 400 },
      { name: 'Canopy Light Mounting Lid', priceOffset: 650 }
    ],
    colors: ['Crystal Clear', 'Stealth Matte Black Base'],
    svgType: 'slider'
  },
  {
    id: 'cuboid-series-976',
    name: 'Cuboid Series 976 (Terrestrial)',
    category: 'terrestrial',
    type: 'enclosure',
    badge: 'Popular',
    tagline: 'Ultra-clean minimalist geometric cube with 8-point magnetic snap lid',
    price: 4499,
    compareAtPrice: 4999,
    rating: 4.89,
    reviewCount: 218,
    dimensions: {
      inches: '9" L x 7" W x 6" H',
      cm: '22.8 x 17.8 x 15.2 cm',
      length: 9, width: 7, height: 6
    },
    substrateDepth: '3.25" deep substrate capacity',
    volume: '6.2 Liters / 1.6 Gallons',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: '8-Magnet Flush Magnetic Snap-On Lid',
    ventilation: 'Dual Side Cross-Flow Matrix',
    suitableSpecies: [
      'Grammostola rosea (Chilean Rose)',
      'Brachypelma boehmei (Fireleg)',
      'Pterinochilus murinus (OBT - Terrestrial setup)',
      'Asian Forest Scorpion (Heterometrus silenus)',
      'Emperor Scorpion'
    ],
    inStock: true,
    stockCount: 11,
    description: `Clean lines, flush lid seating, and 8 powerful neodymium magnets positioned around the perimeter ensure zero lid warpage over years of use. The Cuboid Series 976 offers generous surface area for active terrestrial foragers while maintaining a low profile that fits standard shelving systems.`,
    features: [
      'Flush snap lid sits seamlessly inside outer perimeter rebate',
      'Zero-deflection reinforced top rim',
      'Supports up to 3.25 inches of dense compacted substrate',
      'Laser-aligned ventilation prevents dead air zones',
      'Stackable design with non-slip silicone feet included'
    ],
    lidVariants: [
      { name: 'Flush Snap-On Lid (Standard)', priceOffset: 0 },
      { name: 'Easy-Grip Knob Lid', priceOffset: 350 }
    ],
    colors: ['Crystal Clear', 'Smoked Obsidian'],
    svgType: 'cuboid'
  },
  {
    id: 'xxl-fortress-181212',
    name: 'XXL Fortress 181212 (Grand Terrarium)',
    category: 'terrestrial',
    type: 'enclosure',
    badge: 'Flagship Heavyweight',
    tagline: 'Museum-grade showcase terrarium for giant tarantulas and heavy display setups',
    price: 16499,
    compareAtPrice: 18999,
    rating: 5.0,
    reviewCount: 97,
    dimensions: {
      inches: '18" L x 12" W x 12" H',
      cm: '45.7 x 30.5 x 30.5 cm',
      length: 18, width: 12, height: 12
    },
    substrateDepth: '5.5" immense bio-reservoir',
    volume: '42.5 Liters / 11.2 Gallons',
    acrylicThickness: '6mm Museum-Grade Optical Cast Acrylic',
    lidStyle: 'Bi-Folding Magnetic Safety Lid with Cam-Lock Latch',
    ventilation: 'Quad-Wall Balanced Cross Ventilation',
    suitableSpecies: [
      'Theraphosa blondi (Goliath Birdeater)',
      'Theraphosa stirmi (Burgundy Goliath)',
      'Lasiodora parahybana (Salmon Pink Birdeater)',
      'Damon diadema (Tailless Whip Scorpion)',
      'Giant Centipede (Scolopendra dehaani)'
    ],
    inStock: true,
    stockCount: 5,
    description: `When keeping world-record giants like Theraphosa blondi, standard pet store enclosures simply do not suffice. The XXL Fortress is precision machined from robust 6mm museum-grade acrylic capable of holding 15+ kg of bioactive soil without bowing. Features dual stainless reinforced hinges and mechanical cam-lock safety tabs in addition to magnetic latches.`,
    features: [
      'Heavy-duty 6mm cast acrylic wall thickness prevents bowing',
      'Massive 5.5-inch substrate well for giant burrowers',
      'Dual-opening split lid for safe targeted maintenance',
      'Escape-proof precision tolerance (<0.2mm edge gap)',
      'Full bioactive ready with sealed bottom corners'
    ],
    lidVariants: [
      { name: 'Split Bi-Fold Canopy Lid', priceOffset: 0 },
      { name: 'Heavy Mesh Lighting Canopy', priceOffset: 1200 }
    ],
    colors: ['Ultra-Clear Museum Acrylic'],
    svgType: 'fortress'
  },
  {
    id: 'fossorial-bunker-8410',
    name: 'Fossorial Bunker 8410 (Deep Burrower)',
    category: 'fossorial',
    type: 'enclosure',
    badge: 'Specialized',
    tagline: 'Ultra-deep vertical profile for obligate burrowers and tunnel builders',
    price: 3999,
    compareAtPrice: 4699,
    rating: 4.91,
    reviewCount: 164,
    dimensions: {
      inches: '8" L x 4" W x 10" H',
      cm: '20.3 x 10.2 x 25.4 cm',
      length: 8, width: 4, height: 10
    },
    substrateDepth: '7.5" deep vertical burrow column',
    volume: '5.2 Liters / 1.3 Gallons',
    acrylicThickness: '4.5mm Cast Acrylic',
    lidStyle: 'Top Sliding Magnetic Lid with Safety Stop',
    ventilation: 'High-Altitude Cross Ventilation',
    suitableSpecies: [
      'Pelinobius muticus (King Baboon)',
      'Hysterocrates gigas (Cameroon Red Baboon)',
      'Cyriopagopus lividus (Cobalt Blue)',
      'Chilobrachys fimbriatus (Indian Violet)',
      'Trapdoor Spiders'
    ],
    inStock: true,
    stockCount: 16,
    description: `Fossorial tarantulas spend 95% of their lives underground constructing intricate subterranean tunnel networks. The Bunker 8410 provides an incredible 7.5 inches of vertical soil depth while maintaining a narrow horizontal profile, encouraging the spider to dig its burrow against the acrylic wall for unmatched viewing of natural burrowing behavior.`,
    features: [
      'Deep 7.5-inch burrow column mimics natural subterranean depth',
      'Encourages visible glass-side tunneling architecture',
      'Top-sliding lid with magnetic safety stop for safe top-down feeding',
      'Upper-level ventilation prevents soil dry-out while keeping air fresh',
      'Rigid side walls withstand lateral soil pressure'
    ],
    lidVariants: [
      { name: 'Top Sliding Magnetic (Standard)', priceOffset: 0 },
      { name: 'Dual Feed Port Lid', priceOffset: 500 }
    ],
    colors: ['Crystal Clear'],
    svgType: 'fossorial'
  },
  {
    id: 'og-sling-crib-223',
    name: 'OG Sling Crib (Micro Rearing Habitat)',
    category: 'micro',
    type: 'enclosure',
    badge: 'Essential',
    tagline: 'The ultimate nursery enclosure for tiny spiderlings and baby jumping spiders',
    price: 1599,
    compareAtPrice: 1999,
    rating: 4.96,
    reviewCount: 840,
    dimensions: {
      inches: '2.25" L x 2.25" W x 3.5" H',
      cm: '5.7 x 5.7 x 8.9 cm',
      length: 2.25, width: 2.25, height: 3.5
    },
    substrateDepth: '1.0" base reservoir',
    volume: '0.3 Liters',
    acrylicThickness: '3mm Cast Acrylic',
    lidStyle: 'Magnetic Top Cap with Micro Grip Latch',
    ventilation: 'Micro-Pin Laser Holes (0.8mm - Escape Proof for Pinhead Crickets)',
    suitableSpecies: [
      'All 1/4" to 1.5" Tarantula Slings',
      'Jumping Spider Slings (i4 - i8 instars)',
      'Baby Praying Mantis nymphs',
      'Dwarf Isopod breeding colonies',
      'Velvet Spiders'
    ],
    inStock: true,
    stockCount: 45,
    description: `Rearing fragile slings in condiment cups or pill bottles is precarious and prone to mold. The OG Sling Crib is the world's most trusted baby arachnid enclosure. Features 0.8mm micro-pin laser holes that guarantee micro feeder insects cannot escape while delivering vital air exchange.`,
    features: [
      '0.8mm micro-laser ventilation keeps flightless fruit flies trapped inside',
      'Dual miniature neodymium magnets provide effortless one-hand feeding access',
      'Crystal-clear clarity allows easy health monitoring without disturbing sling',
      'Stackable modular nursery design',
      'Includes micro water droplet pipette'
    ],
    lidVariants: [
      { name: 'Micro-Pin Hole Cap (Standard)', priceOffset: 0 },
      { name: 'Ultra-Fine Mesh Vent Cap', priceOffset: 250 }
    ],
    colors: ['Crystal Clear'],
    svgType: 'micro'
  },
  {
    id: 'hexacrib-panoramic-360',
    name: 'Hexacrib Panoramic 360 (Geometric Showcase)',
    category: 'cylinder',
    type: 'enclosure',
    badge: 'Artisan',
    tagline: 'Six-sided panoramic geometry for jumping spider display setups and mantises',
    price: 6499,
    compareAtPrice: 7299,
    rating: 4.94,
    reviewCount: 129,
    dimensions: {
      inches: '7" Diameter x 10" H',
      cm: '17.8 cm Dia x 25.4 cm H',
      length: 7, width: 7, height: 10
    },
    substrateDepth: '2.5" base well',
    volume: '4.5 Liters / 1.2 Gallons',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: 'Rotating Magnetic Hex Hatch + Front Viewing Pane',
    ventilation: 'Spiral Geometric Cross-Flow Venting',
    suitableSpecies: [
      'Adult Phidippus regius (Regal Jumping Spider)',
      'Phidippus otiosus (Canopy Jumper)',
      'Orchid Mantis (Hymenopus coronatus)',
      'Arboreal Dwarf Geckos',
      'Stick Insects / Leaf Insects'
    ],
    inStock: true,
    stockCount: 9,
    description: `A showpiece of precision engineering. The Hexacrib delivers six optically pristine faceted panels for a mesmerizing panoramic perspective of jumping spider acrobatics and courtship dances. The top rotating hatch allows feeding without breaching the main enclosure airspace.`,
    features: [
      'Distinctive 6-sided crystal geometry with beveled faceted edges',
      'Top rotating magnetic hex hatch for easy live feeding',
      'Designed for elaborate arboreal botanical scapes',
      'Spiral laser ventilation creates convective airflow',
      'Non-scratch silicon footpads included'
    ],
    lidVariants: [
      { name: 'Hex Magnetic Rotating Hatch', priceOffset: 0 },
      { name: 'Magnetic Canopy with LED Recess', priceOffset: 999 }
    ],
    colors: ['Crystal Clear', 'Frosted Back Trio Panels'],
    svgType: 'hex'
  },
  {
    id: 'arachnidirt-original-4qt',
    name: 'Arachnidirt™ Bioactive Invertebrate Substrate (4 Quarts)',
    category: 'substrate',
    type: 'supply',
    badge: 'Keeper Favorite',
    tagline: 'Proprietary bioactive soil blend engineered for structural burrow retention and humidity balance',
    price: 899,
    compareAtPrice: 1149,
    rating: 4.97,
    reviewCount: 954,
    dimensions: {
      inches: 'Bag: 10" x 8" x 3"',
      cm: '25 x 20 x 8 cm',
      length: 10, width: 8, height: 3
    },
    volume: '4 Dry Quarts (approx 3.8 Liters)',
    weight: '1.45 kg',
    materials: 'Blonde Peat, Cocopeat, New Zealand Tree Fern, Horticultural Charcoal, Kaolin Clay & Mycorrhizae',
    suitableSpecies: ['All Tarantulas', 'Scorpions', 'Isopods', 'Springtails', 'Millipedes'],
    inStock: true,
    stockCount: 88,
    description: `Arachnidirt™ was created specifically to solve the biggest flaw of standard potting soil and coco fiber: burrows collapsing and mold growth. Our blend contains fine structural kaolin clay that bonds fibers together when packed, allowing tarantulas to excavate multi-chambered burrows that stay intact permanently without cave-ins.

Infused with natural horticultural charcoal to inhibit mold spores, plus mycorrhizal cultures that support bioactive clean-up crews.`,
    features: [
      'Maintains rigid burrow tunnels without collapsing on your spider',
      'Absorbs and evenly distributes humidity without becoming soupy or soggy',
      'Charcoal infused to actively suppress sour odors and harmful mold',
      '100% pesticide, fertilizer, and chemical free',
      'Bioactive ready - ideal substrate for springtail seeding'
    ],
    lidVariants: [
      { name: 'Standard 4-Quart Stand-Up Resealable Pouch', priceOffset: 0 },
      { name: 'Double Pack (8 Quarts Total - Save ₹300)', priceOffset: 699 }
    ],
    colors: ['Original Rich Earth Brown'],
    svgType: 'soil'
  },
  {
    id: 'arachnidirt-arid-blend-4qt',
    name: 'Arachnidirt™ Arid Desert Blend (4 Quarts)',
    category: 'substrate',
    type: 'supply',
    badge: 'Specialty',
    tagline: 'Sandy loam volcanic blend crafted for desert scrub and arid-dwelling tarantulas',
    price: 1049,
    compareAtPrice: 1249,
    rating: 4.88,
    reviewCount: 310,
    dimensions: {
      inches: 'Bag: 10" x 8" x 3"',
      cm: '25 x 20 x 8 cm',
      length: 10, width: 8, height: 3
    },
    volume: '4 Dry Quarts',
    weight: '2.0 kg',
    materials: 'Red Desert Sandy Loam, Crushed Volcanic Zeolite, Bentonite Clay, Coarse Decomposed Granite',
    suitableSpecies: ['Chromatopelma cyaneopubescens (GBB)', 'Aphonopelma chalcodes', 'Desert Hairy Scorpion', 'Deathstalker Scorpion'],
    inStock: true,
    stockCount: 42,
    description: `Tropical substrates stay too damp for species originating from dry arid steppes and desert scrublands. The Arid Blend replicates natural desert loam: dusty on top, with moisture-retaining clay underneath when lightly misted in deep burrow layers. Packable and ultra-stable for web anchor points.`,
    features: [
      'Replicates authentic desert red earth and scrubland loam',
      'Packs firmly when dampened to form natural scrape burrows',
      'Rapid surface evaporation prevents respiratory fungal issues',
      'Zero synthetic dyes, 100% natural mineral oxides',
      'Provides firm footing for fast-moving skittering species'
    ],
    lidVariants: [
      { name: '4-Quart Resealable Pouch', priceOffset: 0 },
      { name: '8-Quart Value Pack', priceOffset: 899 }
    ],
    colors: ['Natural Desert Terra Cotta'],
    svgType: 'soil'
  },
  {
    id: 'virgin-cork-bark-round-6in',
    name: 'Virgin Natural Cork Bark Round (6" Tree Trunk Hide)',
    category: 'decor',
    type: 'supply',
    badge: 'Natural',
    tagline: 'Sustainably harvested virgin cork round hide - naturally mold-resistant',
    price: 1199,
    compareAtPrice: 1499,
    rating: 4.93,
    reviewCount: 412,
    dimensions: {
      inches: '6" - 7" Length x 2.5" - 3.5" Diameter',
      cm: '15-18 cm L x 6-9 cm Dia',
      length: 6, width: 3, height: 3
    },
    materials: '100% Sustainably Harvested Natural Cork Oak (Quercus suber)',
    suitableSpecies: ['All Arboreal Tarantulas', 'Jumping Spiders', 'Geckos', 'Tree Frogs'],
    inStock: true,
    stockCount: 37,
    description: `Natural virgin cork bark is the gold standard retreat for all exotic terrariums. It will never rot, warp, or mold even in 85%+ relative humidity bioactive rainforest environments. Hollowed interior creates an instinctive, dark, safe sanctuary where arboreal spiders immediately establish their primary web retreats.`,
    features: [
      'Naturally hydrophobic and mold-resistant for lifetime use',
      'Rough textured exterior provides infinite anchor points for heavy webbing',
      'Hollow circular interior replicates wild hollow tree hollows',
      'Heat-sterilized and ready for immediate terrarium placement',
      'Each piece is unique and organically hand-selected'
    ],
    lidVariants: [
      { name: 'Single 6" Cork Round', priceOffset: 0 },
      { name: 'Assorted Pair (1 Round + 1 Flat)', priceOffset: 800 }
    ],
    colors: ['Natural Aged Oak Bark'],
    svgType: 'decor'
  },
  {
    id: 'magnetic-acrylic-water-dish',
    name: 'Elevated Magnetic Acrylic Water Dish & Feeding Ledge',
    category: 'accessories',
    type: 'supply',
    badge: 'Patent Design',
    tagline: 'Ultra-strong N52 neodymium magnetic floating dish for arboreal cages',
    price: 999,
    compareAtPrice: 1249,
    rating: 4.97,
    reviewCount: 620,
    dimensions: {
      inches: '2.5" L x 1.75" W x 0.75" H (Dish Dia: 1.0")',
      cm: '6.3 x 4.4 x 1.9 cm',
      length: 2.5, width: 1.75, height: 0.75
    },
    materials: 'Laser-Cut Clear Cast Acrylic, Removable Food-Grade Poly Dish, Dual Rubber-Coated N52 Magnets',
    suitableSpecies: ['Arboreal Tarantulas', 'Jumping Spiders', 'Crested Geckos', 'Tree Frogs'],
    inStock: true,
    stockCount: 58,
    description: `Arboreal tarantulas rarely climb down to the substrate level to drink water, often resulting in chronic dehydration. This innovative magnetic ledge holds a crystal-clear water cup elevated at canopy height on the acrylic enclosure wall. The outer magnetic block secures it through acrylic up to 6mm thick without scratching.`,
    features: [
      'Rubberized magnets prevent slipping and protect acrylic from scratches',
      'Removable cup allows easy refilling and rinsing without disturbing the spider',
      'Positions hydration right next to arboreal web nests',
      'Minimalist invisible clear aesthetic keeps focus on your animal',
      'Includes 3 extra replacement cups'
    ],
    lidVariants: [
      { name: 'Single Magnetic Ledge + 3 Cups', priceOffset: 0 },
      { name: 'Dual Ledge Pack (Water + Feeder Ledge)', priceOffset: 750 }
    ],
    colors: ['Clear Acrylic', 'Obsidian Black Acrylic'],
    svgType: 'accessories'
  },
  {
    id: 'complete-terrestrial-bioactive-bundle',
    name: 'Complete Terrestrial Bioactive Habitat Bundle (Save 20%)',
    category: 'bundles',
    type: 'bundle',
    badge: 'Ultimate Value',
    tagline: 'Everything you need to build a museum-grade bioactive paradise in one click',
    price: 7499,
    compareAtPrice: 9499,
    rating: 4.99,
    reviewCount: 388,
    dimensions: {
      inches: 'Includes Slider Crib Pro 866 (8"x6"x6") + Full Bioactive Kit',
      cm: 'Full setup kit',
      length: 8, width: 6, height: 6
    },
    volume: 'Complete Turnkey Kit',
    includes: [
      '1x Slider Crib Pro 866 Acrylic Enclosure (₹4,499 value)',
      '1x Arachnidirt™ Bioactive Substrate 4-Quart Bag (₹899 value)',
      '1x Natural Virgin Cork Bark Flat Hide (₹799 value)',
      '1x Pure New Zealand Sphagnum Moss (₹549 value)',
      '1x Natural Oak Leaf Litter Pack (₹499 value)',
      '1x Elevated Magnetic Acrylic Water Dish (₹999 value)',
      '1x 10" Precision Stainless Feeding Tongs (₹999 value)'
    ],
    suitableSpecies: ['Mexican Red Knee', 'Brazilian Black', 'Curly Hair', 'Chilean Rose', 'Arizona Blonde'],
    inStock: true,
    stockCount: 15,
    description: `Skip the guesswork and save 20%. The Complete Terrestrial Bioactive Bundle equips you with the best enclosure on the market alongside premium soil, cork hide, micro-habitat botanicals, hydration, and long feeding tongs for safe feeding. Ideal for keepers welcoming a new tarantula home.`,
    features: [
      'Complete turnkey kit saves ₹2,000 over buying components individually',
      'Includes world-famous Slider Crib Pro 866 with smooth sliding magnetic lid',
      'Bioactive ready botanical pack prevents mold and balances moisture',
      'High-grade stainless steel padded feeding tongs for safe feeding sessions',
      'Step-by-step setup guide booklet included'
    ],
    lidVariants: [
      { name: 'Complete Bundle with Slider Crib Pro 866', priceOffset: 0 },
      { name: 'Upgrade to Cuboid Series 976 (+₹600)', priceOffset: 600 }
    ],
    colors: ['Complete Kit Edition'],
    svgType: 'bundle'
  }
];

export const REVIEWS = [
  {
    author: 'Dr. Rebecca Vance',
    badge: 'Verified Keeper (42 Cribs)',
    stars: 5,
    date: '3 days ago',
    title: 'The clarity is unreal. Won’t buy anything else.',
    content: 'I switched my entire 40+ tarantula collection over from glass tanks to Aracribs. The optical clarity of their cast acrylic makes glass look murky green. The magnetic slide lid on the 866 is so buttery smooth that even my flightiest Old World species don’t even flinch when I feed them.',
    productName: 'Slider Crib Pro 866'
  },
  {
    author: 'Marcus Chen',
    badge: 'Jumping Spider Breeder',
    stars: 5,
    date: '1 week ago',
    title: 'Treehouse Switch saved my jumpers web retreats!',
    content: 'If you keep Phidippus regius or Avicularia, top opening lids are your worst enemy. The Treehouse Switch front door completely solved web destruction for me. The micro cross-ventilation keeps airflow circulating without fruit flies slipping out.',
    productName: 'Treehouse Switch 446'
  },
  {
    author: 'Aditya Sharma',
    badge: 'Exotic Invert Enthusiast (Bengaluru)',
    stars: 5,
    date: '2 weeks ago',
    title: 'Arachnidirt holds burrows like actual magic.',
    content: 'My H. gigas dug a 6-inch vertical spiral tunnel that has held its structural shape for 9 months now. Regular coco fiber would have caved in on week one. Fantastic substrate and looks gorgeous through the acrylic.',
    productName: 'Arachnidirt™ Bioactive Substrate'
  }
];

export const INSTAGRAM_POSTS = [
  {
    handle: '@arachno_palace',
    species: 'Caribena versicolor in Treehouse 446',
    likes: '1,420',
    tags: '#Aracribs #Versicolor #Bioactive'
  },
  {
    handle: '@spooder_haven',
    species: 'Phidippus regius courtship in Hexacrib',
    likes: '2,890',
    tags: '#JumpingSpider #Hexacrib #MacroPets'
  },
  {
    handle: '@exotic_inverts_india',
    species: 'Grammostola pulchra deep burrow in Slider 866',
    likes: '984',
    tags: '#BrazilianBlack #Arachnidirt #CleanEnclosures'
  },
  {
    handle: '@invert_sanctuary',
    species: 'Theraphosa blondi dinner time in XXL Fortress',
    likes: '3,110',
    tags: '#GoliathBirdeater #XXLFortress #MonsterT'
  }
];
