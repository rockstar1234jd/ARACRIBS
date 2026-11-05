// Aracribs - State Management & Backend API Sync
const API_BASE = (typeof window !== 'undefined' && window.location)
  ? (window.location.port === '3001' ? '/api' : `${window.location.protocol}//${window.location.hostname || '127.0.0.1'}:3001/api`)
  : 'http://127.0.0.1:3001/api';

const STORAGE_KEYS = {
  CART: 'aracribs_cart',
  WISHLIST: 'aracribs_wishlist',
  COMPARE: 'aracribs_compare',
  THEME: 'aracribs_theme',
  DISCOUNT: 'aracribs_discount',
  USER: 'aracribs_user',
  TOKEN: 'aracribs_token',
  ORDERS: 'aracribs_orders'
};

export const getStorageItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // Backward-compatibility check with legacy keys
    const legacyKey = key.replace('aracribs_', 'tc_') + '_v3';
    const legacyRaw = localStorage.getItem(legacyKey);
    return legacyRaw ? JSON.parse(legacyRaw) : fallback;
  } catch (e) {
    console.warn('Storage read error:', e);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
};

// ==========================================
// USER & AUTH STATE
// ==========================================
export const userState = {
  get: () => getStorageItem(STORAGE_KEYS.USER, null),
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  set: (user, token) => {
    setStorageItem(STORAGE_KEYS.USER, user);
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    window.dispatchEvent(new CustomEvent('auth:updated', { detail: user }));
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.dispatchEvent(new CustomEvent('auth:updated', { detail: null }));
  },
  isLoggedIn: () => {
    return Boolean(userState.get() && userState.getToken());
  },
  isAdmin: () => {
    const u = userState.get();
    return Boolean(u && u.role === 'admin');
  },
  saveAddress: (address) => {
    const u = userState.get();
    if (u) {
      u.address = address;
      userState.set(u, userState.getToken());
    }
  }
};

// ==========================================
// CART STATE (INR Values)
// ==========================================
export const cartState = {
  get: () => getStorageItem(STORAGE_KEYS.CART, []),
  set: (cart) => setStorageItem(STORAGE_KEYS.CART, cart),
  add: (item) => {
    const cart = cartState.get();
    const existingIndex = cart.findIndex(i => i.id === item.id && i.variant === item.variant);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.push({ ...item, quantity: item.quantity || 1 });
    }
    cartState.set(cart);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    return cart;
  },
  updateQuantity: (id, variant, delta) => {
    let cart = cartState.get();
    const item = cart.find(i => i.id === id && i.variant === variant);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => !(i.id === id && i.variant === variant));
      }
    }
    cartState.set(cart);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    return cart;
  },
  remove: (id, variant) => {
    const cart = cartState.get().filter(i => !(i.id === id && i.variant === variant));
    cartState.set(cart);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    return cart;
  },
  clear: () => {
    cartState.set([]);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: [] }));
  },
  count: () => {
    return cartState.get().reduce((sum, item) => sum + (item.quantity || 0), 0);
  },
  subtotal: () => {
    return cartState.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};

// ==========================================
// WISHLIST & COMPARE
// ==========================================
export const wishlistState = {
  get: () => getStorageItem(STORAGE_KEYS.WISHLIST, []),
  toggle: (productId) => {
    let list = wishlistState.get();
    const exists = list.includes(productId);
    if (exists) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    setStorageItem(STORAGE_KEYS.WISHLIST, list);
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: list }));
    return !exists;
  },
  has: (productId) => wishlistState.get().includes(productId)
};

export const compareState = {
  get: () => getStorageItem(STORAGE_KEYS.COMPARE, []),
  toggle: (productId) => {
    let list = compareState.get();
    const exists = list.includes(productId);
    if (exists) {
      list = list.filter(id => id !== productId);
    } else {
      if (list.length >= 3) list.shift();
      list.push(productId);
    }
    setStorageItem(STORAGE_KEYS.COMPARE, list);
    window.dispatchEvent(new CustomEvent('compare:updated', { detail: list }));
    return !exists;
  },
  has: (productId) => compareState.get().includes(productId),
  clear: () => {
    setStorageItem(STORAGE_KEYS.COMPARE, []);
    window.dispatchEvent(new CustomEvent('compare:updated', { detail: [] }));
  }
};

export const discountState = {
  get: () => getStorageItem(STORAGE_KEYS.DISCOUNT, null),
  set: (discount) => {
    setStorageItem(STORAGE_KEYS.DISCOUNT, discount);
    window.dispatchEvent(new CustomEvent('discount:updated', { detail: discount }));
  },
  remove: () => {
    setStorageItem(STORAGE_KEYS.DISCOUNT, null);
    window.dispatchEvent(new CustomEvent('discount:updated', { detail: null }));
  }
};

export const themeState = {
  get: () => getStorageItem(STORAGE_KEYS.THEME, 'dark'),
  set: (theme) => {
    setStorageItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new CustomEvent('theme:updated', { detail: theme }));
  }
};

// Fixed to Indian Rupees (INR)
export const currencyState = {
  get: () => 'INR',
  set: () => {}
};

// ==========================================
// BACKEND API CLIENT (With Offline Fallback)
// ==========================================
export const api = {
  async register(name, email, phone, password, role = 'customer') {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      userState.set(data.user, data.token);
      return data;
    } catch (e) {
      // Local fallback simulation if server is offline
      const mockUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone,
        role
      };
      userState.set(mockUser, 'mock_token_' + Date.now());
      return { user: mockUser, token: 'mock_token' };
    }
  },

  async login(email, password) {
    let networkFailed = false;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }
      userState.set(data.user, data.token);
      return data;
    } catch (e) {
      if (e.message && (e.message.includes('fetch') || e.name === 'TypeError')) {
        networkFailed = true;
      } else {
        // Real auth rejection from backend
        throw e;
      }
    }

    if (networkFailed) {
      // Local check fallback only when server is offline
      if (email.toLowerCase() === 'admin@aracribs.com' && password === 'admin123') {
        const adminUser = { id: 'usr_admin', name: 'Store Admin', email, role: 'admin' };
        userState.set(adminUser, 'mock_admin_token');
        return { user: adminUser, token: 'mock_admin_token' };
      } else if (email.toLowerCase() === 'aditya@example.com' && password === 'user123') {
        const customerUser = {
          id: 'usr_aditya',
          name: 'Aditya Sharma',
          email: 'aditya@example.com',
          phone: '+91 9811223344',
          role: 'customer',
          address: { street: '42 Lotus Enclave, MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }
        };
        userState.set(customerUser, 'mock_user_token');
        return { user: customerUser, token: 'mock_user_token' };
      }
      throw new Error('Invalid email or password');
    }
  },

  async createOrder(orderData) {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order creation failed');
      return data.order;
    } catch (e) {
      // Offline fallback
      const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackOrder = {
        orderNumber,
        createdAt: new Date().toISOString(),
        orderStatus: 'Confirmed',
        trackingNumber: `EXP-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        ...orderData
      };
      const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
      orders.unshift(fallbackOrder);
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
      return fallbackOrder;
    }
  },

  async getOrders() {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return getStorageItem(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(orderNumber, status, trackingNumber) {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, trackingNumber })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async getAnalytics() {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async createProduct(productData) {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async getProducts(category = null) {
    try {
      const url = category && category !== 'all' ? `${API_BASE}/products?category=${category}` : `${API_BASE}/products`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async updateProduct(id, updates) {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async getMe() {
    const token = userState.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        userState.set(user, token);
        return user;
      }
    } catch (e) {}
    return userState.get();
  },

  async deleteProduct(productId) {
    const token = userState.getToken();
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }
};
