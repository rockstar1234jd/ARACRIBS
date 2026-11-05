// Aracribs - Express Backend API Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'aracribs_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Helper Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin credentials required' });
  }
  next();
};

// ==========================================
// 1. HEALTH & SYSTEM STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Aracribs API',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
    database: {
      type: process.env.DATABASE_TYPE || 'Persistent Embedded Engine (data/db.json)',
      connected: true,
      productsCount: db.getProducts().length,
      ordersCount: db.getOrders().length
    }
  });
});

// ==========================================
// 2. PRODUCTS API
// ==========================================
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let products = db.getProducts();

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.tagline && p.tagline.toLowerCase().includes(q))
    );
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, category, price, tagline, stockCount, dimensions, lidStyle } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price in ₹ are required' });
    }

    const newProd = db.createProduct({
      name,
      category: category || 'terrestrial',
      price: parseFloat(price),
      tagline: tagline || 'Precision cast acrylic habitat',
      stockCount: parseInt(stockCount, 10) || 10,
      dimensions: dimensions || { inches: '8" x 6" x 6"', cm: '20 x 15 x 15 cm' },
      lidStyle: lidStyle || 'Magnetic Slider',
      svgType: category === 'arboreal' ? 'arboreal' : 'slider'
    });

    res.status(201).json(newProd);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully', id: req.params.id });
});

// ==========================================
// 3. AUTHENTICATION (LOGIN & SIGNUP)
// ==========================================
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const safeUser = db.createUser({
      name,
      email,
      phone,
      password,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      user: safeUser,
      token
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      message: 'Logged in successfully',
      user: safeUser,
      token
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ==========================================
// 4. ORDERS & PAYMENT FLOW
// ==========================================
app.get('/api/orders', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.json([]);
  }
  // Admin sees all, customer sees own orders
  if (req.user.role === 'admin') {
    return res.json(db.getOrders());
  }
  res.json(db.getOrders(req.user.id, req.user.email));
});

app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, customer, paymentMethod, totals, shippingAddress } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart items cannot be empty' });
    }

    const newOrder = db.createOrder({
      userId: req.user ? req.user.id : `guest_${Date.now()}`,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Guest Keeper',
      email: customer ? customer.email : 'guest@example.com',
      phone: customer ? customer.phone : '',
      shippingAddress: shippingAddress || (customer ? `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}` : ''),
      items,
      paymentMethod: paymentMethod || 'UPI',
      totals: totals || { total: 0 }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/orders/:orderNumber/status', authenticateToken, requireAdmin, (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = db.updateOrderStatus(req.params.orderNumber, status, trackingNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order status updated', order });
});

// ==========================================
// 5. ADMIN ANALYTICS
// ==========================================
app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req, res) => {
  const stats = db.getAnalytics();
  res.json(stats);
});

// Static Client Serving (Optional Production)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🕷️  ARACRIBS BACKEND API RUNNING`);
  console.log(`📍  Port: ${PORT}`);
  console.log(`💰  Currency: Indian Rupees (INR / ₹) Only`);
  console.log(`🔑  Admin Account: admin@aracribs.com | admin123`);
  console.log(`👤  Demo Customer: aditya@example.com | user123`);
  console.log(`===============================================`);
});
