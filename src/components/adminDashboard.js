// Aracribs - Interactive Admin Management Dashboard
import { api, userState } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';
import { PRODUCTS } from '../data/products.js';

export class AdminDashboard {
  constructor() {
    this.modalEl = document.getElementById('adminDashboardContainer');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.activeSection = 'orders'; // 'orders' | 'products' | 'analytics'
    this.orderFilter = 'all';
    this.orderSearch = '';
    this.orders = [];
    this.products = [...PRODUCTS];
    this.analytics = null;
    this.editingTrackingOrder = null;

    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'adminDashboardContainer';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  async open() {
    if (!userState.isAdmin()) {
      window.dispatchEvent(new CustomEvent('toast:show', {
        detail: { message: 'Access denied: Admin credentials required. Login as admin@aracribs.com' }
      }));
      return;
    }

    await this.fetchData();
    this.render();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
    if (window.location.hash === '#admin') {
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  async fetchData() {
    try {
      this.orders = await api.getOrders();
      this.analytics = await api.getAnalytics();
      const liveProds = await api.getProducts();
      if (liveProds && Array.isArray(liveProds) && liveProds.length > 0) {
        this.products = liveProds;
      }
    } catch (e) {
      console.warn('Backend sync error:', e);
    }
  }

  render() {
    const totalRev = this.orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
    const totalStock = this.products.reduce((sum, p) => sum + (p.stockCount || 10), 0);

    this.modalEl.innerHTML = `
      <div class="modal-dialog admin-modal-dialog">
        <button class="modal-close-btn" id="adminCloseBtn" aria-label="Close admin dashboard">&times;</button>

        <!-- Admin Top Navigation Bar -->
        <div class="admin-header-bar">
          <div class="admin-title-col">
            <span class="admin-badge-pill">👑 ADMINISTRATOR CONTROL PANEL</span>
            <h2>Aracribs Management Console</h2>
            <div class="db-status-row">
              <span class="status-pulse-dot"></span>
              <span>Database Status: <strong>Connected (Persistent Embedded JSON Engine)</strong></span>
            </div>
          </div>

          <div class="admin-nav-tabs">
            <button class="admin-nav-tab ${this.activeSection === 'orders' ? 'active' : ''}" data-section="orders">
              📦 Orders (${this.orders.length})
            </button>
            <button class="admin-nav-tab ${this.activeSection === 'products' ? 'active' : ''}" data-section="products">
              🕷️ Products (${this.products.length})
            </button>
            <button class="admin-nav-tab ${this.activeSection === 'analytics' ? 'active' : ''}" data-section="analytics">
              📊 Sales Analytics
            </button>
            <button class="btn btn-outline btn-sm admin-exit-btn" id="adminExitToStoreBtn">
              ← Back to Store
            </button>
          </div>
        </div>

        <!-- Quick Stats Overview -->
        <div class="admin-stats-ribbon">
          <div class="admin-stat-card">
            <span class="stat-lbl">TOTAL SALES REVENUE</span>
            <strong class="stat-val text-accent">${formatPrice(totalRev)}</strong>
            <small>All completed orders</small>
          </div>
          <div class="admin-stat-card">
            <span class="stat-lbl">TOTAL ORDERS RECORDED</span>
            <strong class="stat-val">${this.orders.length}</strong>
            <small>Live courier tracking</small>
          </div>
          <div class="admin-stat-card">
            <span class="stat-lbl">HABITATS IN STOCK</span>
            <strong class="stat-val">${totalStock} Units</strong>
            <small>Across ${this.products.length} models</small>
          </div>
          <div class="admin-stat-card">
            <span class="stat-lbl">CURRENCY ARCHITECTURE</span>
            <strong class="stat-val">INR (₹)</strong>
            <small>UPI, Cards, Netbanking, COD</small>
          </div>
        </div>

        <!-- Dynamic Body Section -->
        <div class="admin-body-content">
          ${this.activeSection === 'orders' ? this.renderOrdersSection() : ''}
          ${this.activeSection === 'products' ? this.renderProductsSection() : ''}
          ${this.activeSection === 'analytics' ? this.renderAnalyticsSection(totalRev) : ''}
        </div>
      </div>
    `;

    this.bindActionEvents();
  }

  getFilteredOrders() {
    return this.orders.filter(o => {
      if (this.orderFilter !== 'all' && (o.orderStatus || 'Confirmed').toLowerCase() !== this.orderFilter.toLowerCase()) {
        return false;
      }
      if (this.orderSearch) {
        const q = this.orderSearch.toLowerCase();
        const numMatch = (o.orderNumber || '').toLowerCase().includes(q);
        const nameMatch = (o.customerName || '').toLowerCase().includes(q);
        const emailMatch = (o.email || '').toLowerCase().includes(q);
        const addrMatch = (o.shippingAddress || '').toLowerCase().includes(q);
        const awbMatch = (o.trackingNumber || '').toLowerCase().includes(q);
        if (!numMatch && !nameMatch && !emailMatch && !addrMatch && !awbMatch) return false;
      }
      return true;
    });
  }

  renderOrdersSection() {
    const filtered = this.getFilteredOrders();

    return `
      <div class="admin-section-wrap">
        <div class="admin-section-header-split">
          <div>
            <h3>Customer Orders & Courier Dispatches</h3>
            <p>Update order status, assign Indian courier tracking numbers (Delhivery, BlueDart, DTDC), and review customer invoices.</p>
          </div>

          <div class="admin-filter-bar">
            <input type="text" id="adminOrderSearchInput" class="admin-search-input" placeholder="Search by Order #, Name, City, or AWB..." value="${this.orderSearch}" />
            <select id="adminOrderStatusFilter" class="custom-select admin-status-filter">
              <option value="all" ${this.orderFilter === 'all' ? 'selected' : ''}>All Statuses (${this.orders.length})</option>
              <option value="Confirmed" ${this.orderFilter === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Processing" ${this.orderFilter === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${this.orderFilter === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${this.orderFilter === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </div>
        </div>

        ${filtered.length === 0 ? `
          <div class="admin-empty-card">
            <p>No orders match the current filter criteria.</p>
          </div>
        ` : `
          <div class="admin-table-wrap">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer & Destination</th>
                  <th>Items Ordered</th>
                  <th>Payment</th>
                  <th>Total (₹)</th>
                  <th>Status & Courier AWB</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(order => `
                  <tr data-order="${order.orderNumber}">
                    <td>
                      <strong class="order-id-tag">${order.orderNumber}</strong><br>
                      <small class="order-date-small">${new Date(order.createdAt).toLocaleDateString('en-IN')}</small>
                    </td>
                    <td>
                      <strong>${order.customerName || 'Guest'}</strong><br>
                      <small class="text-muted">📱 ${order.phone || 'N/A'}</small><br>
                      <small class="text-muted">${order.shippingAddress || 'Address on file'}</small>
                    </td>
                    <td>
                      <ul class="order-items-mini-list">
                        ${(order.items || []).map(i => `<li>${i.quantity}x ${i.name}</li>`).join('')}
                      </ul>
                    </td>
                    <td>
                      <span class="payment-method-chip">${order.paymentMethod || 'UPI'}</span>
                    </td>
                    <td>
                      <strong class="order-total-accent">${formatPrice(order.totals?.total || 0)}</strong>
                    </td>
                    <td>
                      <select class="order-status-select" data-order="${order.orderNumber}">
                        <option value="Confirmed" ${order.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="Processing" ${order.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                      <div class="order-tracking-num mt-1">
                        <small>AWB: <strong>${order.trackingNumber || 'Pending'}</strong></small>
                      </div>
                    </td>
                    <td>
                      <button class="btn btn-outline btn-xs update-tracking-btn" data-order="${order.orderNumber}">
                        Assign Tracking
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }

  renderProductsSection() {
    return `
      <div class="admin-section-wrap">
        <div class="admin-section-header-split">
          <div>
            <h3>Inventory & Catalog Management</h3>
            <p>Add new acrylic crib models, update prices in ₹, or adjust stock levels. Updates automatically reflect in customer store.</p>
          </div>
          <button class="btn btn-primary btn-sm" id="toggleAddProductFormBtn">+ Add New Enclosure / Supply</button>
        </div>

        <!-- Add Product Form (Collapsible) -->
        <div id="addProductDrawer" class="add-product-form-box hidden">
          <h4>Add New Product to Store Catalog</h4>
          <form id="newProductForm" class="new-product-grid">
            <div class="form-group">
              <label>Product Title</label>
              <input type="text" id="npName" required placeholder="e.g. Hexacrib Pro 360" />
            </div>

            <div class="form-group">
              <label>Category</label>
              <select id="npCategory" class="custom-select">
                <option value="arboreal">Arboreal Treehouse</option>
                <option value="terrestrial">Terrestrial Enclosure</option>
                <option value="fossorial">Fossorial Deep Burrow</option>
                <option value="micro">Micro Sling Crib</option>
                <option value="substrate">Substrate & Soil</option>
                <option value="decor">Decor & Hides</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div class="form-group">
              <label>Price in Rupees (₹)</label>
              <input type="number" id="npPrice" required placeholder="4999" />
            </div>

            <div class="form-group">
              <label>Available Stock</label>
              <input type="number" id="npStock" required value="15" />
            </div>

            <div class="form-group full-width">
              <label>Tagline / Description</label>
              <input type="text" id="npTagline" required placeholder="Smooth slide acrylic habitat with laser venting" />
            </div>

            <div class="form-group">
              <label>Dimensions</label>
              <input type="text" id="npDimensions" placeholder='8" x 6" x 6"' />
            </div>

            <div class="form-group">
              <label>Lid Closure</label>
              <input type="text" id="npLidStyle" placeholder="Magnetic Slider Lid" />
            </div>

            <div class="form-actions-full">
              <button type="submit" class="btn btn-primary btn-sm">Save & Publish Product</button>
              <button type="button" class="btn btn-outline btn-sm" id="cancelAddProductBtn">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Existing Products Table with Inline Price & Stock Editing -->
        <div class="admin-table-wrap">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th style="min-width: 140px;">Price in ₹ (Editable)</th>
                <th style="min-width: 110px;">Stock Units</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.map(p => `
                <tr data-prod-id="${p.id}">
                  <td>
                    <strong>${p.name}</strong><br>
                    <small class="text-muted">${p.dimensions ? (p.dimensions.inches || p.dimensions) : 'Standard'}</small>
                  </td>
                  <td><span class="cat-pill-small">${p.category}</span></td>
                  <td>
                    <div class="admin-inline-edit-group">
                      <span class="rupee-prefix">₹</span>
                      <input type="number" class="admin-inline-input prod-price-input" data-id="${p.id}" value="${p.price}" />
                    </div>
                  </td>
                  <td>
                    <input type="number" class="admin-inline-input prod-stock-input" data-id="${p.id}" value="${p.stockCount || 10}" />
                  </td>
                  <td>
                    <span class="status-indicator ${p.inStock !== false ? 'active' : 'inactive'}">
                      ${p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div class="admin-btn-row">
                      <button class="btn btn-primary btn-xs save-prod-btn" data-id="${p.id}" title="Save Changes">
                        💾 Save
                      </button>
                      <button class="btn btn-outline btn-xs delete-prod-btn" data-id="${p.id}" title="Delete Product">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderAnalyticsSection(totalRev) {
    const avgOrder = this.orders.length ? Math.round(totalRev / this.orders.length) : 0;
    const codOrders = this.orders.filter(o => (o.paymentMethod || '').toLowerCase().includes('cash')).length;
    const upiOrders = this.orders.filter(o => (o.paymentMethod || '').toLowerCase().includes('upi')).length;
    const cardOrders = this.orders.filter(o => (o.paymentMethod || '').toLowerCase().includes('card')).length;

    return `
      <div class="admin-section-wrap">
        <div class="admin-section-header">
          <h3>E-Commerce Performance Insights</h3>
          <p>Financial breakdown of completed invertebrate habitats and botanical supply orders across India.</p>
        </div>

        <div class="analytics-metrics-grid">
          <div class="metric-card">
            <span class="metric-icon">💰</span>
            <h4>Total Revenue</h4>
            <div class="metric-number text-accent">${formatPrice(totalRev)}</div>
            <p>100% processed in Indian Rupees (INR)</p>
          </div>

          <div class="metric-card">
            <span class="metric-icon">🚚</span>
            <h4>Average Order Value</h4>
            <div class="metric-number">${formatPrice(avgOrder)}</div>
            <p>Driven by precision acrylic enclosures & bundles</p>
          </div>

          <div class="metric-card">
            <span class="metric-icon">💳</span>
            <h4>Payment Distribution</h4>
            <div class="metric-number">${this.orders.length} Orders</div>
            <p>⚡ UPI: ${upiOrders} • 💳 Cards: ${cardOrders} • 💵 COD: ${codOrders}</p>
          </div>
        </div>

        <div class="backup-export-card">
          <div>
            <h4>Database Maintenance & JSON Export</h4>
            <p>Download a complete snapshot of your users, product catalog, and orders database.</p>
          </div>
          <button class="btn btn-outline btn-sm" id="exportDbBtn">💾 Download Database JSON Backup</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  bindActionEvents() {
    const closeBtn = document.getElementById('adminCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const exitBtn = document.getElementById('adminExitToStoreBtn');
    if (exitBtn) exitBtn.addEventListener('click', () => this.close());

    // Tab switches
    this.modalEl.querySelectorAll('.admin-nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeSection = tab.dataset.section;
        this.render();
      });
    });

    // Orders search input
    const orderSearchInput = document.getElementById('adminOrderSearchInput');
    if (orderSearchInput) {
      orderSearchInput.addEventListener('input', (e) => {
        this.orderSearch = e.target.value.trim();
        this.render();
        const refocused = document.getElementById('adminOrderSearchInput');
        if (refocused) {
          refocused.focus();
          refocused.selectionStart = refocused.selectionEnd = refocused.value.length;
        }
      });
    }

    // Orders status filter
    const statusFilter = document.getElementById('adminOrderStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.orderFilter = e.target.value;
        this.render();
      });
    }

    // Order status dropdown change
    this.modalEl.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderNum = select.dataset.order;
        const newStatus = e.target.value;
        await api.updateOrderStatus(orderNum, newStatus);
        const ord = this.orders.find(o => o.orderNumber === orderNum);
        if (ord) ord.orderStatus = newStatus;
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Order ${orderNum} status updated to: ${newStatus}` }
        }));
      });
    });

    // Assign Tracking button
    this.modalEl.querySelectorAll('.update-tracking-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderNum = btn.dataset.order;
        const currentAwb = this.orders.find(o => o.orderNumber === orderNum)?.trackingNumber || '';
        const couriers = ['DELHIVERY', 'BLUEDART', 'DTDC', 'SPEEDPOST'];
        const chosenCourier = couriers[Math.floor(Math.random() * couriers.length)];
        const defaultAwb = currentAwb || `${chosenCourier}-${Math.floor(10000000 + Math.random() * 90000000)}`;
        
        const trackingNum = prompt(`Enter Indian courier tracking AWB for order ${orderNum}:`, defaultAwb);
        if (trackingNum) {
          await api.updateOrderStatus(orderNum, 'Shipped', trackingNum.trim());
          await this.fetchData();
          this.render();
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Assigned tracking ${trackingNum} to ${orderNum}!` }
          }));
        }
      });
    });

    // Inline Save Product Price & Stock
    this.modalEl.querySelectorAll('.save-prod-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const row = this.modalEl.querySelector(`tr[data-prod-id="${id}"]`);
        if (!row) return;

        const priceInput = row.querySelector('.prod-price-input');
        const stockInput = row.querySelector('.prod-stock-input');
        const newPrice = parseFloat(priceInput.value);
        const newStock = parseInt(stockInput.value, 10);

        if (isNaN(newPrice) || newPrice <= 0) {
          alert('Please enter a valid price in ₹');
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Saving...';

        await api.updateProduct(id, {
          price: newPrice,
          stockCount: newStock,
          inStock: newStock > 0
        });

        const localProd = this.products.find(p => p.id === id);
        if (localProd) {
          localProd.price = newPrice;
          localProd.stockCount = newStock;
          localProd.inStock = newStock > 0;
        }

        window.dispatchEvent(new CustomEvent('catalog:refresh'));
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Updated ${localProd?.name || 'Product'}: ₹${newPrice} • ${newStock} in stock` }
        }));

        this.render();
      });
    });

    // Toggle Add Product
    const toggleAddBtn = document.getElementById('toggleAddProductFormBtn');
    const addDrawer = document.getElementById('addProductDrawer');
    const cancelAddBtn = document.getElementById('cancelAddProductBtn');

    if (toggleAddBtn && addDrawer) {
      toggleAddBtn.addEventListener('click', () => {
        addDrawer.classList.toggle('hidden');
      });
    }

    if (cancelAddBtn && addDrawer) {
      cancelAddBtn.addEventListener('click', () => {
        addDrawer.classList.add('hidden');
      });
    }

    // Submit New Product
    const npForm = document.getElementById('newProductForm');
    if (npForm) {
      npForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newProduct = {
          name: document.getElementById('npName').value.trim(),
          category: document.getElementById('npCategory').value,
          price: parseFloat(document.getElementById('npPrice').value),
          stockCount: parseInt(document.getElementById('npStock').value, 10),
          tagline: document.getElementById('npTagline').value.trim(),
          dimensions: {
            inches: document.getElementById('npDimensions').value.trim() || '8" x 6" x 6"',
            cm: '20 x 15 x 15 cm'
          },
          lidStyle: document.getElementById('npLidStyle').value.trim() || 'Magnetic Slider'
        };

        await api.createProduct(newProduct);
        this.products.unshift(newProduct);
        window.dispatchEvent(new CustomEvent('catalog:refresh'));
        this.render();

        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Created new product: ${newProduct.name}!` }
        }));
      });
    }

    // Delete Product
    this.modalEl.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete this product?`)) {
          await api.deleteProduct(id);
          this.products = this.products.filter(p => p.id !== id);
          window.dispatchEvent(new CustomEvent('catalog:refresh'));
          this.render();
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: 'Product deleted from inventory' }
          }));
        }
      });
    });

    // Export DB Backup
    const exportBtn = document.getElementById('exportDbBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const backupData = {
          exportDate: new Date().toISOString(),
          currency: 'INR',
          orders: this.orders,
          products: this.products
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aracribs_db_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }
}
