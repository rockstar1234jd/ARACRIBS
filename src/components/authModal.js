// Aracribs - Interactive User Auth & Account Profile Modal
import { userState, api } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class AuthModal {
  constructor(onAdminOpen, onWishlistOpen) {
    this.onAdminOpen = onAdminOpen || (() => {});
    this.onWishlistOpen = onWishlistOpen || (() => {});
    this.modalEl = document.getElementById('authModalContainer');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.activeTab = 'login'; // 'login' | 'register' | 'profile'
    this.profileView = 'main'; // 'main' | 'orders' | 'address'
    this.customerOrders = [];
    this.selectedInvoiceOrder = null;
    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'authModalContainer';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  async open(preferredTab = null, options = {}) {
    this.adminOnly = Boolean(options.adminOnly);
    this.autoOpenAdminOnSuccess = Boolean(options.autoOpenAdminOnSuccess);
    this.selectedInvoiceOrder = null;

    if (preferredTab) {
      if (preferredTab === 'orders') {
        this.activeTab = 'profile';
        this.profileView = 'orders';
      } else {
        this.activeTab = preferredTab;
        this.profileView = 'main';
      }
    } else {
      this.activeTab = userState.isLoggedIn() ? 'profile' : 'login';
      this.profileView = 'main';
    }

    if (userState.isLoggedIn()) {
      try {
        this.customerOrders = await api.getOrders();
      } catch (e) {
        this.customerOrders = [];
      }
    }

    this.render();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
    // If closing from admin route without logging in, clean the hash
    if (this.adminOnly && !userState.isAdmin() && window.location.hash === '#admin') {
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  render() {
    const user = userState.get();

    this.modalEl.innerHTML = `
      <div class="modal-dialog auth-modal-dialog ${this.adminOnly ? 'admin-gate-dialog' : ''}">
        <button class="modal-close-btn" id="authCloseBtn" aria-label="Close modal">&times;</button>

        <div class="auth-modal-content">
          <div class="auth-brand-badge ${this.adminOnly ? 'admin-badge-highlight' : ''}">
            ${this.adminOnly ? `
              <span>👑</span>
              <span>RESTRICTED ADMIN MANAGEMENT ACCESS</span>
            ` : `
              <span class="auth-spider-icon">🕷️</span>
              <span>ARACRIBS ACCOUNT PORTAL</span>
            `}
          </div>

          ${user ? this.renderProfileView(user) : this.renderAuthForms()}
        </div>
      </div>
    `;

    this.bindActionEvents();
  }

  renderAuthForms() {
    return `
      ${!this.adminOnly ? `
        <div class="auth-tabs-row">
          <button class="auth-tab ${this.activeTab === 'login' ? 'active' : ''}" data-tab="login">Sign In</button>
          <button class="auth-tab ${this.activeTab === 'register' ? 'active' : ''}" data-tab="register">Create Account</button>
        </div>
      ` : ''}

      ${this.activeTab === 'login' ? `
        <!-- Sign In Form -->
        <form id="loginForm" class="auth-form">
          <div class="auth-form-header">
            ${this.adminOnly ? `
              <h3>Administrator Sign In</h3>
              <p>Enter store administrator credentials to access inventory control, courier dispatches, and sales analytics.</p>
            ` : `
              <h3>Welcome Back, Keeper</h3>
              <p>Sign in to track orders, manage your bioactive crib collection, and view VIP discounts.</p>
            `}
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="loginEmail" required placeholder="${this.adminOnly ? 'admin@aracribs.com' : 'aditya@example.com'}" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="loginPassword" required placeholder="••••••••" />
          </div>

          <div id="loginErrorMsg" class="auth-error-chip hidden"></div>

          <button type="submit" class="btn btn-primary btn-block auth-submit-btn" id="loginSubmitBtn">
            ${this.adminOnly ? 'Authenticate & Enter Admin Console →' : 'Sign In to My Account'}
          </button>

          <!-- 1-Click Instant Demo Credentials -->
          <div class="demo-logins-box">
            <span class="demo-box-label">⚡ 1-Click Instant Test Fill:</span>
            <div class="demo-btn-group">
              <button type="button" class="btn btn-outline btn-xs demo-fill-btn" id="demoCustomerBtn">
                👤 Demo Customer (Aditya)
              </button>
              <button type="button" class="btn btn-outline btn-xs demo-fill-btn admin-demo-btn" id="demoAdminBtn" style="border-color: #ffb300; color: #ffb300;">
                👑 Store Admin
              </button>
            </div>
          </div>
        </form>
      ` : `
        <!-- Register Form -->
        <form id="registerForm" class="auth-form">
          <div class="auth-form-header">
            <h3>Join the Keeper Society</h3>
            <p>Create your free account to unlock faster ₹ checkout, order tracking, and exclusive discounts.</p>
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="regName" required placeholder="Aditya Sharma" />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="regEmail" required placeholder="aditya@example.com" />
          </div>

          <div class="form-group">
            <label>WhatsApp / Phone Number</label>
            <input type="tel" id="regPhone" placeholder="+91 98765 43210" />
          </div>

          <div class="form-row two-col">
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="regPassword" required placeholder="At least 6 chars" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select id="regRole" class="auth-role-select">
                <option value="customer">Customer / Keeper</option>
                <option value="admin">Store Admin</option>
              </select>
            </div>
          </div>

          <div id="regErrorMsg" class="auth-error-chip hidden"></div>

          <button type="submit" class="btn btn-primary btn-block auth-submit-btn" id="regSubmitBtn">
            Create Account & Claim ₹300 Welcome Credit
          </button>
        </form>
      `}
    `;
  }

  renderProfileView(user) {
    const isAdmin = user.role === 'admin';

    // Sub-view: Order History
    if (this.profileView === 'orders') {
      return this.renderOrdersSubView();
    }

    // Sub-view: Saved Address Editor
    if (this.profileView === 'address') {
      return this.renderAddressSubView(user);
    }

    // Sub-view: Invoice Detail View
    if (this.profileView === 'invoice' && this.selectedInvoiceOrder) {
      return this.renderInvoiceSubView(this.selectedInvoiceOrder);
    }

    // Main Profile View
    const addr = user.address || {};
    const hasAddress = addr.street || addr.city;

    return `
      <div class="profile-view-box">
        <div class="profile-header-card">
          <div class="profile-avatar-circle">${user.name ? user.name[0].toUpperCase() : 'K'}</div>
          <div class="profile-title-group">
            <div class="profile-name-row">
              <h3>${user.name}</h3>
              <span class="profile-role-badge ${isAdmin ? 'admin-badge' : 'keeper-badge'}">
                ${isAdmin ? '👑 Store Administrator' : '🕷️ Verified Keeper'}
              </span>
            </div>
            <span class="profile-email">${user.email}</span>
            ${user.phone ? `<span class="profile-phone">📱 ${user.phone}</span>` : ''}
          </div>
        </div>

        ${isAdmin ? `
          <div class="admin-quick-action-card">
            <div class="admin-card-info">
              <h4>Store Management Portal</h4>
              <p>You have full administrative privileges to manage orders, update tracking, and edit product inventory.</p>
            </div>
            <button class="btn btn-accent btn-sm" id="launchAdminPanelBtn">
              Open Admin Dashboard →
            </button>
          </div>
        ` : ''}

        <div class="profile-actions-grid">
          <button class="profile-menu-item" id="viewMyOrdersBtn">
            <span class="menu-icon">📦</span>
            <div class="menu-text">
              <strong>Order History & Live Tracking</strong>
              <small>${this.customerOrders.length} order(s) placed</small>
            </div>
            <span class="menu-arrow">→</span>
          </button>

          <button class="profile-menu-item" id="myWishlistBtn">
            <span class="menu-icon">🤍</span>
            <div class="menu-text">
              <strong>Saved Enclosures</strong>
              <small>View your favorite setups</small>
            </div>
            <span class="menu-arrow">→</span>
          </button>

          <button class="profile-menu-item" id="editSavedAddressBtn">
            <span class="menu-icon">📍</span>
            <div class="menu-text">
              <strong>Delivery Address</strong>
              <small>${hasAddress ? `${addr.city || ''}, ${addr.pincode || ''}` : 'Configure default address'}</small>
            </div>
            <span class="menu-arrow">→</span>
          </button>
        </div>

        <div class="profile-footer-row">
          <button class="btn btn-outline btn-sm logout-btn" id="logoutBtn">
            Sign Out of Account
          </button>
        </div>
      </div>
    `;
  }

  renderOrdersSubView() {
    return `
      <div class="profile-subview-box">
        <div class="subview-header">
          <button class="btn btn-outline btn-xs back-subview-btn" id="backToProfileBtn">
            ← Back to Profile
          </button>
          <h4>📦 Order History & Live Tracking</h4>
        </div>

        ${this.customerOrders.length === 0 ? `
          <div class="empty-orders-card">
            <div class="empty-icon">📦</div>
            <p>No orders placed yet.</p>
            <small>When you order habitats or bioactive supplies, live tracking will appear here.</small>
            <button class="btn btn-primary btn-sm mt-3" id="ordersShopNowBtn">Browse Habitats</button>
          </div>
        ` : `
          <div class="customer-orders-scroll">
            ${this.customerOrders.map(order => {
              const statusClass = (order.orderStatus || 'Confirmed').toLowerCase();
              return `
                <div class="cust-order-card" data-order="${order.orderNumber}">
                  <div class="cust-order-top">
                    <div class="cust-order-id-col">
                      <span class="order-hash">Order #${order.orderNumber}</span>
                      <small class="order-placed-date">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                    </div>
                    <span class="status-pill status-${statusClass}">${order.orderStatus || 'Confirmed'}</span>
                  </div>

                  <div class="cust-order-items">
                    ${(order.items || []).map(item => `
                      <div class="cust-order-item-row">
                        <span class="item-name-qty"><strong>${item.quantity}x</strong> ${item.name}</span>
                        <span class="item-price-val">${formatPrice(item.price * item.quantity)}</span>
                      </div>
                    `).join('')}
                  </div>

                  <div class="cust-order-tracking-strip">
                    <div class="tracking-code-group">
                      <span class="tracking-lbl">Courier AWB:</span>
                      <strong class="tracking-code">${order.trackingNumber || 'Pending Courier Assignment'}</strong>
                    </div>
                    ${order.trackingNumber ? `
                      <button class="btn btn-outline btn-xs copy-awb-btn" data-awb="${order.trackingNumber}">
                        📋 Copy AWB
                      </button>
                    ` : ''}
                  </div>

                  <div class="cust-order-bottom">
                    <div class="order-total-group">
                      <span>Total Paid:</span>
                      <strong class="text-accent">${formatPrice(order.totals?.total || 0)}</strong>
                      <small>(${order.paymentMethod || 'UPI'})</small>
                    </div>
                    <button class="btn btn-outline btn-xs view-invoice-btn" data-order="${order.orderNumber}">
                      View Receipt →
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  renderAddressSubView(user) {
    const addr = user.address || {};
    return `
      <div class="profile-subview-box">
        <div class="subview-header">
          <button class="btn btn-outline btn-xs back-subview-btn" id="backToProfileBtn">
            ← Back to Profile
          </button>
          <h4>📍 Default Delivery Address</h4>
        </div>

        <form id="saveAddressForm" class="auth-form mt-2">
          <div class="form-group">
            <label>Street Address / Flat / Floor</label>
            <input type="text" id="addrStreet" required value="${addr.street || ''}" placeholder="Flat 402, Lotus Enclave, Bellandur" />
          </div>

          <div class="form-row two-col">
            <div class="form-group">
              <label>City</label>
              <input type="text" id="addrCity" required value="${addr.city || ''}" placeholder="Bengaluru" />
            </div>
            <div class="form-group">
              <label>State</label>
              <input type="text" id="addrState" required value="${addr.state || ''}" placeholder="Karnataka" />
            </div>
          </div>

          <div class="form-group">
            <label>PIN Code (6 Digits)</label>
            <input type="text" id="addrPin" required pattern="[0-9]{6}" maxlength="6" value="${addr.pincode || ''}" placeholder="560103" />
          </div>

          <button type="submit" class="btn btn-primary btn-block mt-3">
            Save Delivery Address
          </button>
        </form>
      </div>
    `;
  }

  renderInvoiceSubView(o) {
    return `
      <div class="profile-subview-box">
        <div class="subview-header">
          <button class="btn btn-outline btn-xs back-subview-btn" id="backToOrdersBtn">
            ← Back to Orders
          </button>
          <h4>Tax Invoice & Receipt</h4>
        </div>

        <div class="invoice-sheet-box">
          <div class="invoice-header-row">
            <div>
              <div class="invoice-brand-logo">ARACRIBS INDIA</div>
              <small class="text-muted">Precision Acrylic Habitats Pvt. Ltd.</small><br>
              <small class="text-muted">GSTIN: 29AABCU9603R1ZM • SAC: 39269099</small>
            </div>
            <div class="invoice-meta-right">
              <strong>TAX INVOICE</strong>
              <div>#INV-${o.orderNumber}</div>
              <small>${new Date(o.createdAt).toLocaleDateString('en-IN')}</small>
            </div>
          </div>

          <div class="invoice-billed-to">
            <strong>Billed & Dispatched To:</strong>
            <div>${o.customerName || 'Customer'}</div>
            <small class="text-muted">${o.shippingAddress || 'India'}</small>
            ${o.phone ? `<small class="text-muted"><br>Phone: ${o.phone}</small>` : ''}
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
                <th style="text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(o.items || []).map(item => `
                <tr>
                  <td>${item.name} <small class="text-muted">(${item.variant || 'Standard'})</small></td>
                  <td style="text-align:center;">${item.quantity}</td>
                  <td style="text-align:right;">${formatPrice(item.price)}</td>
                  <td style="text-align:right;">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="invoice-summary-block">
            <div class="inv-line"><span>Subtotal:</span><span>${formatPrice(o.totals?.subtotal || 0)}</span></div>
            ${o.totals?.discountAmount > 0 ? `<div class="inv-line text-accent"><span>Discount:</span><span>-${formatPrice(o.totals.discountAmount)}</span></div>` : ''}
            <div class="inv-line"><span>Delivery / Courier:</span><span>${o.totals?.shippingCost === 0 ? 'FREE' : formatPrice(o.totals?.shippingCost || 0)}</span></div>
            <div class="inv-line"><span>GST (5% SGST+CGST):</span><span>${formatPrice(o.totals?.tax || 0)}</span></div>
            <div class="inv-line grand-total"><strong>Grand Total Paid:</strong><strong class="text-accent">${formatPrice(o.totals?.total || 0)}</strong></div>
          </div>

          <div class="invoice-tracking-card">
            <span>Live Courier AWB: <strong>${o.trackingNumber || 'Pending'}</strong></span>
            <small>Dispatch Status: ${o.orderStatus || 'Confirmed'} • Payment: ${o.paymentMethod || 'UPI'}</small>
          </div>

          <div class="invoice-actions-row">
            <button class="btn btn-outline btn-sm" id="printSubInvoiceBtn">🖨️ Print Invoice</button>
          </div>
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
    const closeBtn = document.getElementById('authCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Switch tabs
    this.modalEl.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.tab;
        this.render();
      });
    });

    // Demo fill customer button
    const demoCustBtn = document.getElementById('demoCustomerBtn');
    if (demoCustBtn) {
      demoCustBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        if (emailInput && passInput) {
          emailInput.value = 'aditya@example.com';
          passInput.value = 'user123';
        }
      });
    }

    // Demo fill admin button
    const demoAdmBtn = document.getElementById('demoAdminBtn');
    if (demoAdmBtn) {
      demoAdmBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        if (emailInput && passInput) {
          emailInput.value = 'admin@aracribs.com';
          passInput.value = 'admin123';
        }
      });
    }

    // Submit Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errChip = document.getElementById('loginErrorMsg');
        const submitBtn = document.getElementById('loginSubmitBtn');

        try {
          if (submitBtn) submitBtn.textContent = 'Verifying credentials...';
          const res = await api.login(email, password);
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Welcome back, ${res.user.name}!` }
          }));

          if (res.user.role === 'admin' && (this.adminOnly || this.autoOpenAdminOnSuccess || window.location.hash === '#admin' || window.location.pathname.includes('/admin'))) {
            this.close();
            this.onAdminOpen();
            return;
          }

          try {
            this.customerOrders = await api.getOrders();
          } catch (e) {}

          this.render();
        } catch (err) {
          if (errChip) {
            errChip.textContent = err.message || 'Invalid email or password';
            errChip.classList.remove('hidden');
          }
          if (submitBtn) submitBtn.textContent = 'Sign In to My Account';
        }
      });
    }

    // Submit Register
    const regForm = document.getElementById('registerForm');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const errChip = document.getElementById('regErrorMsg');
        const submitBtn = document.getElementById('regSubmitBtn');

        try {
          if (submitBtn) submitBtn.textContent = 'Creating Account...';
          const res = await api.register(name, email, phone, password, role);
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Account created! Welcome, ${res.user.name}!` }
          }));
          this.render();
        } catch (err) {
          if (errChip) {
            errChip.textContent = err.message || 'Registration failed';
            errChip.classList.remove('hidden');
          }
          if (submitBtn) submitBtn.textContent = 'Create Account';
        }
      });
    }

    // Launch Admin button
    const adminBtn = document.getElementById('launchAdminPanelBtn');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        this.close();
        this.onAdminOpen();
      });
    }

    // Profile Menu: View My Orders
    const viewOrdersBtn = document.getElementById('viewMyOrdersBtn');
    if (viewOrdersBtn) {
      viewOrdersBtn.addEventListener('click', async () => {
        try {
          this.customerOrders = await api.getOrders();
        } catch (e) {}
        this.profileView = 'orders';
        this.render();
      });
    }

    // Profile Menu: My Wishlist
    const myWishlistBtn = document.getElementById('myWishlistBtn');
    if (myWishlistBtn) {
      myWishlistBtn.addEventListener('click', () => {
        this.close();
        this.onWishlistOpen();
      });
    }

    // Profile Menu: Edit Saved Address
    const editAddrBtn = document.getElementById('editSavedAddressBtn');
    if (editAddrBtn) {
      editAddrBtn.addEventListener('click', () => {
        this.profileView = 'address';
        this.render();
      });
    }

    // Back to Profile button
    const backBtn = document.getElementById('backToProfileBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.profileView = 'main';
        this.render();
      });
    }

    // Back to Orders from Invoice
    const backToOrdersBtn = document.getElementById('backToOrdersBtn');
    if (backToOrdersBtn) {
      backToOrdersBtn.addEventListener('click', () => {
        this.profileView = 'orders';
        this.render();
      });
    }

    // Orders Shop Now button
    const ordersShopNowBtn = document.getElementById('ordersShopNowBtn');
    if (ordersShopNowBtn) {
      ordersShopNowBtn.addEventListener('click', () => {
        this.close();
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // View Invoice button inside order card
    this.modalEl.querySelectorAll('.view-invoice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderNum = btn.dataset.order;
        const ord = this.customerOrders.find(o => o.orderNumber === orderNum);
        if (ord) {
          this.selectedInvoiceOrder = ord;
          this.profileView = 'invoice';
          this.render();
        }
      });
    });

    // Copy AWB
    this.modalEl.querySelectorAll('.copy-awb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const awb = btn.dataset.awb;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(awb);
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Copied courier tracking: ${awb}` }
          }));
        }
      });
    });

    // Print Invoice
    const printSubInvoiceBtn = document.getElementById('printSubInvoiceBtn');
    if (printSubInvoiceBtn) {
      printSubInvoiceBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Save Address Form
    const saveAddrForm = document.getElementById('saveAddressForm');
    if (saveAddrForm) {
      saveAddrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const street = document.getElementById('addrStreet').value.trim();
        const city = document.getElementById('addrCity').value.trim();
        const state = document.getElementById('addrState').value.trim();
        const pincode = document.getElementById('addrPin').value.trim();

        userState.saveAddress({ street, city, state, pincode });
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: 'Default delivery address saved!' }
        }));
        this.profileView = 'main';
        this.render();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        userState.clear();
        this.customerOrders = [];
        this.profileView = 'main';
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: 'Successfully signed out' }
        }));
        this.render();
      });
    }
  }
}
