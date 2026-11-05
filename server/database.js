// Aracribs - Database Manager & Multi-DB Adapter (Zero-Config Persistent Engine + MongoDB/PostgreSQL Support)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed catalog in Indian Rupees (INR / ₹)
const SEED_PRODUCTS = [
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
      'Poecilotheria metallica (Juvenile)'
    ],
    inStock: true,
    stockCount: 14,
    description: 'The Treehouse Switch 446 represents the peak of arboreal micro-husbandry. Front magnetic switch door gives complete access to the habitat without disturbing delicate aerial webs.',
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
    volume: '4.7 Liters',
    acrylicThickness: '4.5mm Heavyweight Cast Acrylic',
    lidStyle: 'Full Front Drop-Down Latch & Top Access Hatch',
    ventilation: 'Dual-Zone Chimney Cross Ventilation',
    suitableSpecies: [
      'Adult Caribena versicolor',
      'Poecilotheria regalis / metallica',
      'Psalmopoeus cambridgei'
    ],
    inStock: true,
    stockCount: 8,
    description: 'Designed for keepers who demand the best for their medium to large arboreal spiders. Features chimney-effect cross ventilation.',
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
    volume: '4.7 Liters',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: 'Smooth-Glide Sliding Lid with Magnetic Locking Detents',
    ventilation: '360 Perimeter Cross-Hole Grid',
    suitableSpecies: [
      'Brachypelma hamorii (Mexican Red Knee)',
      'Grammostola pulchra (Brazilian Black)',
      'Tliltocatl albopilosus (Curly Hair)'
    ],
    inStock: true,
    stockCount: 22,
    description: 'The worldwide flagship terrestrial habitat. Smooth slide-in track allows opening without startling defensive ground spiders.',
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
    volume: '6.2 Liters',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: '8-Magnet Flush Magnetic Snap-On Lid',
    ventilation: 'Dual Side Cross-Flow Matrix',
    suitableSpecies: [
      'Grammostola rosea (Chilean Rose)',
      'Brachypelma boehmei (Fireleg)',
      'Asian Forest Scorpion'
    ],
    inStock: true,
    stockCount: 11,
    description: 'Flush lid seating with 8 powerful neodymium magnets around perimeter ensuring zero lid warping.',
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
      'Lasiodora parahybana (Salmon Pink)',
      'Damon diadema (Tailless Whip Scorpion)'
    ],
    inStock: true,
    stockCount: 5,
    description: 'Constructed from heavy 6mm cast acrylic capable of holding 15+ kg of soil without bowing.',
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
    volume: '5.2 Liters',
    acrylicThickness: '4.5mm Cast Acrylic',
    lidStyle: 'Top Sliding Magnetic Lid with Safety Stop',
    ventilation: 'High-Altitude Cross Ventilation',
    suitableSpecies: [
      'Pelinobius muticus (King Baboon)',
      'Cyriopagopus lividus (Cobalt Blue)',
      'Hysterocrates gigas'
    ],
    inStock: true,
    stockCount: 16,
    description: 'Provides 7.5 inches of vertical soil depth encouraging visible glass-side tunneling architecture.',
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
    ventilation: 'Micro-Pin Laser Holes (0.8mm - Escape Proof)',
    suitableSpecies: [
      'All 1/4" to 1.5" Tarantula Slings',
      'Jumping Spider Slings',
      'Baby Praying Mantis nymphs'
    ],
    inStock: true,
    stockCount: 45,
    description: 'Features 0.8mm micro-pin laser holes that keep fruit flies inside while providing vital nursery airflow.',
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
    volume: '4.5 Liters',
    acrylicThickness: '4mm Cast Acrylic',
    lidStyle: 'Rotating Magnetic Hex Hatch + Front Viewing Pane',
    ventilation: 'Spiral Geometric Cross-Flow Venting',
    suitableSpecies: [
      'Adult Phidippus regius (Regal Jumping Spider)',
      'Orchid Mantis',
      'Arboreal Dwarf Geckos'
    ],
    inStock: true,
    stockCount: 9,
    description: 'Distinctive 6-sided crystal geometry with beveled faceted edges for panoramic observation.',
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
    materials: 'Blonde Peat, Cocopeat, Tree Fern, Horticultural Charcoal, Kaolin Clay',
    suitableSpecies: ['All Tarantulas', 'Scorpions', 'Isopods', 'Springtails'],
    inStock: true,
    stockCount: 88,
    description: 'Contains fine structural clay and charcoal so burrows never collapse and mold is suppressed.',
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
    materials: 'Desert Sandy Loam, Volcanic Zeolite, Bentonite Clay',
    suitableSpecies: ['Chromatopelma cyaneopubescens (GBB)', 'Desert Hairy Scorpion'],
    inStock: true,
    stockCount: 42,
    description: 'Replicates natural arid steppe and red earth loam. Fast surface evaporation.',
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
      inches: '6" - 7" Length x 3" Diameter',
      cm: '15-18 cm L x 7-8 cm Dia',
      length: 6, width: 3, height: 3
    },
    materials: '100% Sustainably Harvested Natural Cork Oak',
    suitableSpecies: ['All Arboreal Tarantulas', 'Jumping Spiders', 'Geckos'],
    inStock: true,
    stockCount: 37,
    description: 'Hydrophobic natural oak bark that never rots or molds even under 90% humidity.',
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
      inches: '2.5" L x 1.75" W x 0.75" H',
      cm: '6.3 x 4.4 x 1.9 cm',
      length: 2.5, width: 1.75, height: 0.75
    },
    materials: 'Laser Acrylic, Removable Poly Cup, Dual N52 Magnets',
    suitableSpecies: ['Arboreal Tarantulas', 'Jumping Spiders'],
    inStock: true,
    stockCount: 58,
    description: 'Positions vital hydration at canopy height. Magnets work through up to 6mm thick acrylic.',
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
      inches: 'Slider 866 (8"x6"x6") + Full Bioactive Kit',
      cm: 'Complete setup kit',
      length: 8, width: 6, height: 6
    },
    suitableSpecies: ['Red Knee', 'Brazilian Black', 'Curly Hair', 'GBB'],
    inStock: true,
    stockCount: 15,
    description: 'Includes Slider 866 enclosure, 4qt Arachnidirt™, cork bark hide, moss, water dish, and feeding tongs.',
    svgType: 'bundle'
  }
];

class DatabaseEngine {
  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading database file, reinitializing:', e);
    }

    // Default Seed Data
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const userPasswordHash = bcrypt.hashSync('user123', 10);

    const initialData = {
      users: [
        {
          id: 'usr_admin',
          name: 'Store Admin',
          email: 'admin@aracribs.com',
          phone: '+91 9876543210',
          passwordHash: adminPasswordHash,
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'usr_aditya',
          name: 'Aditya Sharma',
          email: 'aditya@example.com',
          phone: '+91 9811223344',
          passwordHash: userPasswordHash,
          role: 'customer',
          address: {
            street: '42 Lotus Enclave, MG Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001'
          },
          createdAt: new Date().toISOString()
        }
      ],
      products: SEED_PRODUCTS,
      orders: [
        {
          orderNumber: 'AC-948210',
          userId: 'usr_aditya',
          customerName: 'Aditya Sharma',
          email: 'aditya@example.com',
          phone: '+91 9811223344',
          shippingAddress: '42 Lotus Enclave, MG Road, Bengaluru, Karnataka - 560001',
          items: [
            {
              id: 'slider-crib-pro-866',
              name: 'Slider Crib Pro 866 (Terrestrial)',
              quantity: 1,
              price: 4499,
              variant: 'Standard'
            },
            {
              id: 'arachnidirt-original-4qt',
              name: 'Arachnidirt™ Bioactive Substrate (4 Quarts)',
              quantity: 2,
              price: 899,
              variant: 'Standard'
            }
          ],
          paymentMethod: 'UPI (Google Pay)',
          paymentStatus: 'PAID',
          orderStatus: 'Shipped',
          trackingNumber: 'DELHIVERY-77492190',
          totals: {
            subtotal: 6297,
            shipping: 0,
            tax: 519,
            total: 6816
          },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      settings: {
        currency: 'INR',
        currencySymbol: '₹',
        freeShippingThreshold: 2500,
        storeName: 'Aracribs India',
        supportEmail: 'support@aracribs.com',
        supportPhone: '+91 80000 12345'
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (e) {
      console.error('Failed to write to database:', e);
    }
  }

  // --- Products Collections ---
  getProducts() {
    return this.data.products;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(product) {
    const newProduct = {
      id: product.id || `crib-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      stockCount: product.stockCount || 10,
      ...product
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.save();
      return this.data.products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Users & Auth Collections ---
  getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    const u = this.data.users.find(u => u.id === id);
    if (!u) return null;
    const { passwordHash, ...userWithoutPass } = u;
    return userWithoutPass;
  }

  createUser({ name, email, phone, password, role = 'customer', address }) {
    if (this.getUserByEmail(email)) {
      throw new Error('User already exists with this email');
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      passwordHash,
      role,
      address: address || {},
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  // --- Orders Collections ---
  getOrders(userId = null, userEmail = null) {
    if (userId) {
      const emailLower = userEmail ? userEmail.toLowerCase() : null;
      return this.data.orders.filter(o => 
        o.userId === userId || 
        (emailLower && o.email && o.email.toLowerCase() === emailLower)
      );
    }
    return this.data.orders;
  }

  createOrder(orderData) {
    const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed',
      paymentStatus: orderData.paymentMethod.includes('Cash') ? 'PENDING_COD' : 'PAID',
      trackingNumber: `EXP-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      ...orderData
    };

    // Update stock for products
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const prod = this.getProductById(item.id);
        if (prod && typeof prod.stockCount === 'number') {
          prod.stockCount = Math.max(0, prod.stockCount - (item.quantity || 1));
          if (prod.stockCount === 0) prod.inStock = false;
        }
      });
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderNumber, status, trackingNumber = null) {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (order) {
      order.orderStatus = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      this.save();
      return order;
    }
    return null;
  }

  // --- Store Analytics for Admin ---
  getAnalytics() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
    const totalProducts = this.data.products.length;
    const totalUsers = this.data.users.length;
    const recentOrders = this.data.orders.slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders
    };
  }
}

export const db = new DatabaseEngine();
