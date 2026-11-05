// Aracribs - Multi-Step Interactive Checkout Simulator (Indian Payments & UPI Flow)
import { cartState, discountState, api, userState } from '../utils/storage.js';
import { formatPrice, getDiscountedAmount } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class CheckoutModal {
  constructor() {
    this.modalEl = document.getElementById('checkoutModalContainer');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.currentStep = 1; // 1: Shipping, 2: Payment, 3: Success Confirmation
    this.shippingMethod = 'standard';
    this.paymentMethod = 'upi'; // 'upi' | 'card' | 'netbanking' | 'cod'
    this.selectedUpiApp = 'gpay'; // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
    this.selectedBank = 'HDFC Bank';

    // Card interactive preview state
    this.cardData = {
      number: '6074 8899 4432 1084',
      name: 'ADITYA SHARMA',
      expiry: '11/28',
      cvv: '342'
    };

    this.upiId = 'aditya@okhdfcbank';
    this.upiVerified = true;

    this.initCustomerData();
    this.completedOrder = null;

    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'checkoutModalContainer';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  initCustomerData() {
    const user = userState.get();
    const addr = user?.address || {};

    this.customerData = {
      firstName: user?.name ? user.name.split(' ')[0] : 'Aditya',
      lastName: user?.name ? (user.name.split(' ').slice(1).join(' ') || 'Sharma') : 'Sharma',
      email: user?.email || 'aditya@example.com',
      phone: user?.phone || '+91 98765 43210',
      address: addr.street || '42 Lotus Enclave, MG Road',
      city: addr.city || 'Bengaluru',
      state: addr.state || 'Karnataka',
      pincode: addr.pincode || '560001',
      country: 'India'
    };
  }

  open() {
    const cart = cartState.get();
    if (cart.length === 0) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Your cart is empty!' } }));
      return;
    }
    this.initCustomerData();
    this.currentStep = 1;
    this.completedOrder = null;
    this.render();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  autofillSampleData() {
    const samples = [
      { firstName: 'Aditya', lastName: 'Sharma', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', address: 'Flat 402, Green Glen Terraces, Bellandur', phone: '+91 98765 43210', email: 'aditya@example.com' },
      { firstName: 'Rohit', lastName: 'Verma', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', address: '12 Palm Beach Road, Bandra West', phone: '+91 98201 12345', email: 'rohit@example.com' },
      { firstName: 'Priya', lastName: 'Nair', city: 'Hyderabad', state: 'Telangana', pincode: '500081', address: 'A-7 Cyber Gateway, Hitech City', phone: '+91 97000 88221', email: 'priya@example.com' }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    this.customerData = { ...this.customerData, ...picked };
    this.render();
    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: { message: `Autofilled address for ${picked.city}, ${picked.state}` }
    }));
  }

  calculateTotals() {
    const subtotal = cartState.subtotal();
    const discount = discountState.get();
    const discountAmount = getDiscountedAmount(subtotal, discount);
    
    // Free shipping threshold: ₹2,500
    let shippingCost = 199;
    if (subtotal >= 2500 || (discount && discount.freeShipping)) {
      shippingCost = 0;
    }
    if (this.shippingMethod === 'express') {
      shippingCost += 299; // Express Priority Air Cargo
    }
    if (this.paymentMethod === 'cod') {
      shippingCost += 99; // Cash on delivery handling fee
    }

    const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
    const total = Math.max(0, (subtotal - discountAmount) + shippingCost + tax);

    return { subtotal, discountAmount, shippingCost, tax, total };
  }

  render() {
    const cart = cartState.get();
    const { subtotal, discountAmount, shippingCost, tax, total } = this.calculateTotals();

    if (this.currentStep === 3 && this.completedOrder) {
      this.renderOrderSuccess();
      return;
    }

    this.modalEl.innerHTML = `
      <div class="modal-dialog checkout-modal-dialog">
        <button class="modal-close-btn" id="checkoutCloseBtn" aria-label="Close checkout">&times;</button>

        <div class="checkout-grid">
          <!-- Main Checkout Form Steps -->
          <div class="checkout-main-col">
            <div class="checkout-brand-header">
              <div class="checkout-brand-group">
                <span class="checkout-logo">🕷️ ARACRIBS INDIA</span>
                <span class="inr-guarantee-tag">₹ SECURE CHECKOUT</span>
              </div>
              <div class="checkout-steps-pill">
                <span class="step-indicator ${this.currentStep === 1 ? 'active' : 'completed'}">1. Address</span>
                <span class="step-separator">›</span>
                <span class="step-indicator ${this.currentStep === 2 ? 'active' : ''}">2. Payment</span>
                <span class="step-separator">›</span>
                <span class="step-indicator ${this.currentStep === 3 ? 'active' : ''}">3. Receipt</span>
              </div>
            </div>

            ${this.currentStep === 1 ? `
              <!-- Step 1: Shipping Address -->
              <div class="checkout-step-content">
                <div class="step-title-row">
                  <div>
                    <h3>1. Delivery Address (All India Courier)</h3>
                    <p class="step-sub">Ships in double-walled shockproof impact foam packaging.</p>
                  </div>
                  <button class="btn btn-outline btn-xs" id="autofillBtn">⚡ Autofill Indian Address</button>
                </div>

                <form id="shippingForm" class="checkout-form">
                  <div class="form-row two-col">
                    <div class="form-group">
                      <label>First Name</label>
                      <input type="text" id="chkFirstName" required placeholder="Aditya" value="${this.customerData.firstName}" />
                    </div>
                    <div class="form-group">
                      <label>Last Name</label>
                      <input type="text" id="chkLastName" required placeholder="Sharma" value="${this.customerData.lastName}" />
                    </div>
                  </div>

                  <div class="form-row two-col">
                    <div class="form-group">
                      <label>Email Address</label>
                      <input type="email" id="chkEmail" required placeholder="aditya@example.com" value="${this.customerData.email}" />
                    </div>
                    <div class="form-group">
                      <label>WhatsApp / Phone Number</label>
                      <input type="tel" id="chkPhone" required placeholder="+91 98765 43210" value="${this.customerData.phone}" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Street Address / Flat / Floor / Colony</label>
                      <input type="text" id="chkAddress" required placeholder="Flat 402, Lotus Enclave, Bellandur" value="${this.customerData.address}" />
                    </div>
                  </div>

                  <div class="form-row three-col">
                    <div class="form-group">
                      <label>City</label>
                      <input type="text" id="chkCity" required placeholder="Bengaluru" value="${this.customerData.city}" />
                    </div>
                    <div class="form-group">
                      <label>State</label>
                      <input type="text" id="chkState" required placeholder="Karnataka" value="${this.customerData.state}" />
                    </div>
                    <div class="form-group">
                      <label>PIN Code (6 Digits)</label>
                      <input type="text" id="chkZip" required pattern="[0-9]{6}" maxlength="6" placeholder="560103" value="${this.customerData.pincode}" />
                    </div>
                  </div>

                  <!-- Delivery Method Selection -->
                  <div class="shipping-method-section">
                    <label class="form-label-header">Select Delivery Speed</label>
                    <label class="shipping-radio-card ${this.shippingMethod === 'standard' ? 'selected' : ''}">
                      <input type="radio" name="shippingMethod" value="standard" ${this.shippingMethod === 'standard' ? 'checked' : ''} />
                      <div class="radio-info">
                        <strong>Standard Surface Express (Cocoon Foam Padded)</strong>
                        <small>3-5 business days via BlueDart / Delhivery Surface</small>
                      </div>
                      <span class="radio-price">${shippingCost === 0 ? 'FREE' : formatPrice(199)}</span>
                    </label>

                    <label class="shipping-radio-card ${this.shippingMethod === 'express' ? 'selected' : ''}">
                      <input type="radio" name="shippingMethod" value="express" ${this.shippingMethod === 'express' ? 'checked' : ''} />
                      <div class="radio-info">
                        <strong>Priority Safe-Transit Air Cargo</strong>
                        <small>1-2 business days with 100% Zero-Crack Cast Acrylic Replacement Guarantee</small>
                      </div>
                      <span class="radio-price">+${formatPrice(299)}</span>
                    </label>
                  </div>

                  <button type="submit" class="btn btn-primary btn-block checkout-next-btn">
                    Continue to Payment Options (${formatPrice(total)}) →
                  </button>
                </form>
              </div>
            ` : `
              <!-- Step 2: Indian Payment Options -->
              <div class="checkout-step-content">
                <div class="step-title-row">
                  <div>
                    <h3>2. Choose Indian Payment Mode</h3>
                    <p class="step-sub">Encrypted 256-bit gateway with instant refund protection.</p>
                  </div>
                  <button class="btn btn-outline btn-xs" id="backToShippingBtn">← Edit Address</button>
                </div>

                <div class="shipping-summary-chip">
                  <span>📍 Deliver to: <strong>${this.customerData.firstName} ${this.customerData.lastName}</strong> (${this.customerData.address}, ${this.customerData.city} - ${this.customerData.pincode})</span>
                </div>

                <!-- Payment Method Tabs -->
                <div class="payment-tabs-row">
                  <button type="button" class="payment-pill ${this.paymentMethod === 'upi' ? 'active' : ''}" data-method="upi">
                    ⚡ UPI & QR Code
                  </button>
                  <button type="button" class="payment-pill ${this.paymentMethod === 'card' ? 'active' : ''}" data-method="card">
                    💳 Cards (RuPay/Visa)
                  </button>
                  <button type="button" class="payment-pill ${this.paymentMethod === 'netbanking' ? 'active' : ''}" data-method="netbanking">
                    🏦 Netbanking
                  </button>
                  <button type="button" class="payment-pill ${this.paymentMethod === 'cod' ? 'active' : ''}" data-method="cod">
                    💵 Cash on Delivery
                  </button>
                </div>

                <form id="paymentForm" class="checkout-form">
                  ${this.paymentMethod === 'upi' ? `
                    <!-- UPI & QR Code Mode -->
                    <div class="upi-payment-box">
                      <div class="upi-apps-grid">
                        <div class="upi-app-badge ${this.selectedUpiApp === 'gpay' ? 'active gpay-active' : ''}" data-app="gpay">
                          <span class="app-icon">🟢</span>
                          <span>Google Pay</span>
                        </div>
                        <div class="upi-app-badge ${this.selectedUpiApp === 'phonepe' ? 'active phonepe-active' : ''}" data-app="phonepe">
                          <span class="app-icon">🟣</span>
                          <span>PhonePe</span>
                        </div>
                        <div class="upi-app-badge ${this.selectedUpiApp === 'paytm' ? 'active paytm-active' : ''}" data-app="paytm">
                          <span class="app-icon">🔵</span>
                          <span>Paytm UPI</span>
                        </div>
                        <div class="upi-app-badge ${this.selectedUpiApp === 'bhim' ? 'active bhim-active' : ''}" data-app="bhim">
                          <span class="app-icon">🟠</span>
                          <span>BHIM UPI</span>
                        </div>
                      </div>

                      <div class="upi-qr-display-row">
                        <div class="upi-qr-card">
                          <div class="qr-scanner-line"></div>
                          <svg viewBox="0 0 100 100" width="130" height="130" class="qr-svg">
                            <rect width="100" height="100" fill="#ffffff" rx="8"/>
                            <rect x="8" y="8" width="28" height="28" fill="#000000" rx="3"/>
                            <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2"/>
                            <rect x="18" y="18" width="8" height="8" fill="#000000"/>

                            <rect x="64" y="8" width="28" height="28" fill="#000000" rx="3"/>
                            <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2"/>
                            <rect x="74" y="18" width="8" height="8" fill="#000000"/>

                            <rect x="8" y="64" width="28" height="28" fill="#000000" rx="3"/>
                            <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2"/>
                            <rect x="18" y="74" width="8" height="8" fill="#000000"/>

                            <circle cx="50" cy="50" r="11" fill="#00e676"/>
                            <text x="50" y="55" font-size="11" font-weight="bold" text-anchor="middle" fill="#000">₹</text>

                            <!-- Data blocks -->
                            <rect x="42" y="12" width="6" height="6" fill="#000"/>
                            <rect x="52" y="12" width="6" height="6" fill="#000"/>
                            <rect x="42" y="24" width="6" height="6" fill="#000"/>
                            <rect x="12" y="44" width="6" height="6" fill="#000"/>
                            <rect x="24" y="44" width="6" height="6" fill="#000"/>
                            <rect x="68" y="44" width="6" height="6" fill="#000"/>
                            <rect x="80" y="44" width="6" height="6" fill="#000"/>
                            <rect x="44" y="70" width="6" height="6" fill="#000"/>
                            <rect x="56" y="80" width="6" height="6" fill="#000"/>
                            <rect x="70" y="70" width="6" height="6" fill="#000"/>
                            <rect x="82" y="82" width="6" height="6" fill="#000"/>
                          </svg>
                          <span class="qr-scan-badge">Scan with ${this.selectedUpiApp.toUpperCase()}</span>
                        </div>

                        <div class="upi-or-col">
                          <span class="upi-or-title">OR PAY VIA UPI ID (VPA)</span>
                          <div class="upi-id-input-wrap">
                            <input type="text" id="upiIdInput" placeholder="username@bank" value="${this.upiId}" />
                            <span class="upi-verified-badge ${this.upiVerified ? 'verified' : ''}" id="upiStatusBadge">
                              ${this.upiVerified ? '✓ Verified' : 'Verify'}
                            </span>
                          </div>
                          <div class="upi-quick-pills">
                            <button type="button" class="btn btn-outline btn-xs demo-upi-btn" data-vpa="aditya@okhdfcbank">aditya@okhdfcbank</button>
                            <button type="button" class="btn btn-outline btn-xs demo-upi-btn" data-vpa="keeper@paytm">keeper@paytm</button>
                          </div>
                          <small class="upi-hint-text">Instant UPI 2.0 authorization with automatic webhook receipt confirmation.</small>
                        </div>
                      </div>
                    </div>
                  ` : ''}

                  ${this.paymentMethod === 'card' ? `
                    <!-- Cards Mode with Interactive Card Preview -->
                    <div class="card-payment-box">
                      <!-- Live Card Visual -->
                      <div class="interactive-card-preview">
                        <div class="card-bg-glow"></div>
                        <div class="card-top-row">
                          <div class="card-chip-wrap">
                            <div class="emv-chip"></div>
                            <span class="contactless-icon">🛜</span>
                          </div>
                          <span class="card-network-badge">
                            ${this.cardData.number.startsWith('6') ? 'RuPay' : (this.cardData.number.startsWith('4') ? 'VISA' : 'MasterCard')}
                          </span>
                        </div>
                        <div class="card-preview-number" id="cardPreviewNum">${this.cardData.number}</div>
                        <div class="card-bottom-row">
                          <div>
                            <span class="card-lbl">CARDHOLDER</span>
                            <div class="card-val" id="cardPreviewName">${this.cardData.name}</div>
                          </div>
                          <div>
                            <span class="card-lbl">EXPIRES</span>
                            <div class="card-val" id="cardPreviewExpiry">${this.cardData.expiry}</div>
                          </div>
                        </div>
                      </div>

                      <div class="form-row mt-3">
                        <div class="form-group">
                          <label>Card Number (RuPay, Visa, MasterCard)</label>
                          <input type="text" id="cardInputNumber" maxlength="19" required placeholder="6074 8899 4432 1084" value="${this.cardData.number}" />
                        </div>
                      </div>

                      <div class="form-row two-col">
                        <div class="form-group">
                          <label>Expiry (MM/YY)</label>
                          <input type="text" id="cardInputExpiry" maxlength="5" required placeholder="11/28" value="${this.cardData.expiry}" />
                        </div>
                        <div class="form-group">
                          <label>CVV (3 Digits)</label>
                          <input type="password" id="cardInputCVV" maxlength="3" required placeholder="•••" value="${this.cardData.cvv}" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label>Cardholder Name</label>
                          <input type="text" id="cardInputName" required placeholder="ADITYA SHARMA" value="${this.cardData.name}" />
                        </div>
                      </div>
                    </div>
                  ` : ''}

                  ${this.paymentMethod === 'netbanking' ? `
                    <!-- Netbanking Mode -->
                    <div class="netbanking-box">
                      <label class="form-label-header">Select Popular Indian Bank</label>
                      <div class="banks-grid">
                        ${['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => `
                          <label class="bank-pill ${this.selectedBank === bank ? 'active' : ''}">
                            <input type="radio" name="bank" value="${bank}" ${this.selectedBank === bank ? 'checked' : ''} />
                            <span>${bank}</span>
                          </label>
                        `).join('')}
                      </div>

                      <div class="form-group mt-3">
                        <label>Or Choose Other Indian Bank:</label>
                        <select id="otherBanksSelect" class="custom-select">
                          <option value="">-- 40+ Other Indian Banks --</option>
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="Canara Bank">Canara Bank</option>
                          <option value="Union Bank of India">Union Bank of India</option>
                          <option value="IndusInd Bank">IndusInd Bank</option>
                          <option value="Yes Bank">Yes Bank</option>
                          <option value="IDFC First Bank">IDFC First Bank</option>
                        </select>
                      </div>
                    </div>
                  ` : ''}

                  ${this.paymentMethod === 'cod' ? `
                    <!-- Cash on Delivery -->
                    <div class="cod-box">
                      <div class="cod-icon">💵</div>
                      <h4>Pay on Delivery at Your Doorstep</h4>
                      <p>You can pay via Cash, Google Pay, or PhonePe directly to the delivery agent when your bubble-cocooned enclosure arrives.</p>
                      <div class="cod-tag-info">
                        <span>Standard ₹99 cash handling courier fee applied.</span>
                      </div>
                    </div>
                  ` : ''}

                  <button type="submit" class="btn btn-accent btn-block checkout-pay-btn" id="payNowBtn">
                    <span>Pay ${formatPrice(total)} & Confirm Order ➔</span>
                  </button>
                </form>
              </div>
            `}
          </div>

          <!-- Order Summary Sidebar -->
          <div class="checkout-summary-col">
            <h4 class="summary-col-title">Habitat Cart (${cartState.count()} items)</h4>

            <div class="checkout-items-scroll">
              ${cart.map(item => `
                <div class="chk-item-row">
                  <div class="chk-item-thumb">
                    ${renderProductVisual(item.type || 'slider', item.id, { height: '50px' })}
                    <span class="chk-item-qty">${item.quantity}</span>
                  </div>
                  <div class="chk-item-info">
                    <div class="chk-item-name">${item.name}</div>
                    <small class="chk-item-variant">${item.variant}</small>
                  </div>
                  <div class="chk-item-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
              `).join('')}
            </div>

            <div class="chk-totals-table">
              <div class="chk-line">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
              </div>

              ${discountAmount > 0 ? `
                <div class="chk-line discount-line">
                  <span>Coupon Discount</span>
                  <span class="text-accent">-${formatPrice(discountAmount)}</span>
                </div>
              ` : ''}

              <div class="chk-line">
                <span>All India Courier</span>
                <span>${shippingCost === 0 ? '<strong class="text-accent">FREE</strong>' : formatPrice(shippingCost)}</span>
              </div>

              <div class="chk-line">
                <span>GST (5% SGST+CGST)</span>
                <span>${formatPrice(tax)}</span>
              </div>

              <div class="chk-line total-line">
                <strong>Grand Total (INR)</strong>
                <strong class="grand-total-val text-accent">${formatPrice(total)}</strong>
              </div>
            </div>

            <div class="checkout-guarantees">
              <div class="guarantee-badge">
                🛡️ <strong>Cast Acrylic Transit Guarantee:</strong> 100% zero-crack policy with immediate free replacements across India.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindStepActions();
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

  bindStepActions() {
    const closeBtn = document.getElementById('checkoutCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Autofill button
    const autofillBtn = document.getElementById('autofillBtn');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.autofillSampleData();
      });
    }

    // Shipping radio changes
    this.modalEl.querySelectorAll('input[name="shippingMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.shippingMethod = e.target.value;
        this.render();
      });
    });

    // Payment tab clicks
    this.modalEl.querySelectorAll('.payment-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.paymentMethod = btn.dataset.method;
        this.render();
      });
    });

    // UPI App clicks
    this.modalEl.querySelectorAll('.upi-app-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        this.selectedUpiApp = badge.dataset.app;
        this.render();
      });
    });

    // Demo UPI pills
    this.modalEl.querySelectorAll('.demo-upi-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vpa = btn.dataset.vpa;
        const input = document.getElementById('upiIdInput');
        if (input) input.value = vpa;
        this.upiId = vpa;
        this.upiVerified = true;
        const badge = document.getElementById('upiStatusBadge');
        if (badge) {
          badge.className = 'upi-verified-badge verified';
          badge.textContent = '✓ Verified';
        }
      });
    });

    // Bank radio clicks
    this.modalEl.querySelectorAll('input[name="bank"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedBank = e.target.value;
        this.render();
      });
    });

    const otherBanksSelect = document.getElementById('otherBanksSelect');
    if (otherBanksSelect) {
      otherBanksSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          this.selectedBank = e.target.value;
          this.render();
        }
      });
    }

    // Card interactive input sync
    const cardNumInput = document.getElementById('cardInputNumber');
    const cardNameInput = document.getElementById('cardInputName');
    const cardExpiryInput = document.getElementById('cardInputExpiry');

    if (cardNumInput) {
      cardNumInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        v = v.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = v;
        this.cardData.number = v || '•••• •••• •••• ••••';
        const numPreview = document.getElementById('cardPreviewNum');
        if (numPreview) numPreview.textContent = this.cardData.number;
      });
    }

    if (cardNameInput) {
      cardNameInput.addEventListener('input', (e) => {
        this.cardData.name = e.target.value.toUpperCase() || 'ADITYA SHARMA';
        const namePreview = document.getElementById('cardPreviewName');
        if (namePreview) namePreview.textContent = this.cardData.name;
      });
    }

    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
        e.target.value = v;
        this.cardData.expiry = v || 'MM/YY';
        const expPreview = document.getElementById('cardPreviewExpiry');
        if (expPreview) expPreview.textContent = this.cardData.expiry;
      });
    }

    // Step 1: Submit shipping form
    const shipForm = document.getElementById('shippingForm');
    if (shipForm) {
      shipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.customerData.firstName = document.getElementById('chkFirstName').value.trim();
        this.customerData.lastName = document.getElementById('chkLastName').value.trim();
        this.customerData.email = document.getElementById('chkEmail').value.trim();
        this.customerData.phone = document.getElementById('chkPhone').value.trim();
        this.customerData.address = document.getElementById('chkAddress').value.trim();
        this.customerData.city = document.getElementById('chkCity').value.trim();
        this.customerData.state = document.getElementById('chkState').value.trim();
        this.customerData.pincode = document.getElementById('chkZip').value.trim();

        // Save address in state
        userState.saveAddress({
          street: this.customerData.address,
          city: this.customerData.city,
          state: this.customerData.state,
          pincode: this.customerData.pincode
        });

        this.currentStep = 2;
        this.render();
      });
    }

    // Step 2: Back to shipping
    const backBtn = document.getElementById('backToShippingBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.currentStep = 1;
        this.render();
      });
    }

    // Step 2: Pay now
    const payForm = document.getElementById('paymentForm');
    if (payForm) {
      payForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payBtn = document.getElementById('payNowBtn');
        if (payBtn) {
          payBtn.disabled = true;
          payBtn.innerHTML = '<span>⚡ Processing Payment via Gateway...</span>';
        }

        setTimeout(async () => {
          await this.completeCheckout();
        }, 1100);
      });
    }
  }

  async completeCheckout() {
    const cart = cartState.get();
    const totals = this.calculateTotals();

    let methodLabel = 'UPI';
    if (this.paymentMethod === 'upi') methodLabel = `UPI (${this.selectedUpiApp.toUpperCase()})`;
    if (this.paymentMethod === 'card') methodLabel = `CARD (${this.cardData.number.slice(-4)})`;
    if (this.paymentMethod === 'netbanking') methodLabel = `NETBANKING (${this.selectedBank})`;
    if (this.paymentMethod === 'cod') methodLabel = 'CASH ON DELIVERY';

    const orderPayload = {
      items: [...cart],
      customer: { ...this.customerData },
      shippingAddress: `${this.customerData.address}, ${this.customerData.city}, ${this.customerData.state} - ${this.customerData.pincode}`,
      paymentMethod: methodLabel,
      totals,
      shippingMethod: this.shippingMethod
    };

    // Save to Express Backend API / Persistent DB
    const savedOrder = await api.createOrder(orderPayload);
    this.completedOrder = savedOrder;
    this.currentStep = 3;

    // Clear cart and discounts
    cartState.clear();
    discountState.remove();

    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: { message: `🎉 Order ${savedOrder.orderNumber} successfully confirmed!` }
    }));

    this.render();
  }

  renderOrderSuccess() {
    const o = this.completedOrder;
    if (!o) return;

    this.modalEl.innerHTML = `
      <div class="modal-dialog checkout-success-dialog">
        <button class="modal-close-btn" id="successCloseBtn" aria-label="Close dialog">&times;</button>

        <div class="order-success-content">
          <div class="success-icon-wrap">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>

          <span class="success-tag">PAYMENT CONFIRMED (₹)</span>
          <h2 class="order-number-title">Order ${o.orderNumber}</h2>
          <p class="order-subtext">Dhanyavaad, ${o.customerName || o.customer?.firstName || 'Keeper'}! Your precision acrylic habitat is booked and scheduled for courier dispatch.</p>

          <!-- Live Courier Tracking Box -->
          <div class="order-tracking-card">
            <div class="tracking-row">
              <div>
                <span class="tracking-label">Live Indian Dispatch Tracking:</span>
                <strong class="tracking-val">${o.trackingNumber}</strong>
              </div>
              <button class="btn btn-outline btn-xs" id="copySuccessAwbBtn" data-awb="${o.trackingNumber}">
                📋 Copy AWB
              </button>
            </div>

            <!-- Visual 4-Step Dispatch Progress -->
            <div class="dispatch-steps-track">
              <div class="d-step done">
                <span class="d-dot">✓</span>
                <span class="d-label">Order Confirmed</span>
              </div>
              <div class="d-step active">
                <span class="d-dot">📦</span>
                <span class="d-label">Foam Packed</span>
              </div>
              <div class="d-step">
                <span class="d-dot">🚚</span>
                <span class="d-label">In Transit</span>
              </div>
              <div class="d-step">
                <span class="d-dot">🏠</span>
                <span class="d-label">Delivered</span>
              </div>
            </div>

            <p class="tracking-info">SMS & WhatsApp status updates sent to <strong>${o.phone || o.customer?.phone || '+91 9876543210'}</strong>.</p>
          </div>

          <!-- Official Tax Invoice Receipt -->
          <div class="order-receipt-card" id="printableReceiptArea">
            <div class="receipt-header-row">
              <div>
                <h4>Aracribs India • Tax Invoice (₹)</h4>
                <small class="text-muted">GSTIN: 29AABCU9603R1ZM • State: Karnataka (29)</small><br>
                <small class="text-muted">HSN Code: 39269099 (Precision Cast Acrylic Habitats)</small>
              </div>
              <div class="invoice-number-pill">#INV-${o.orderNumber}</div>
            </div>

            <div class="receipt-items-list mt-3">
              ${o.items.map(item => `
                <div class="receipt-item-row">
                  <span>${item.quantity}x ${item.name} <small class="text-muted">(${item.variant || 'Standard'})</small></span>
                  <strong>${formatPrice(item.price * item.quantity)}</strong>
                </div>
              `).join('')}
            </div>

            <div class="receipt-summary-lines">
              <div class="r-line"><span>Subtotal:</span><span>${formatPrice(o.totals.subtotal)}</span></div>
              ${o.totals.discountAmount > 0 ? `<div class="r-line text-accent"><span>Promo Discount:</span><span>-${formatPrice(o.totals.discountAmount)}</span></div>` : ''}
              <div class="r-line"><span>All-India Delivery:</span><span>${o.totals.shippingCost === 0 ? 'FREE' : formatPrice(o.totals.shippingCost)}</span></div>
              <div class="r-line"><span>GST (5% SGST + CGST):</span><span>${formatPrice(o.totals.tax)}</span></div>
              <div class="r-line total"><strong>Total Paid in Rupees:</strong><strong class="text-accent">${formatPrice(o.totals.total)}</strong></div>
            </div>

            <div class="receipt-footer-stamp">
              <span>Payment Mode: <strong>${o.paymentMethod}</strong> • Status: <strong>PAID</strong></span>
            </div>
          </div>

          <div class="success-actions-row">
            <button class="btn btn-primary" id="continueShoppingBtn">Continue Shopping</button>
            <button class="btn btn-outline" id="printReceiptBtn">🖨️ Print Tax Invoice</button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('successCloseBtn');
    const contBtn = document.getElementById('continueShoppingBtn');
    const printBtn = document.getElementById('printReceiptBtn');
    const copyAwbBtn = document.getElementById('copySuccessAwbBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (contBtn) contBtn.addEventListener('click', () => this.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    if (copyAwbBtn) {
      copyAwbBtn.addEventListener('click', () => {
        const awb = copyAwbBtn.dataset.awb;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(awb);
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Copied courier tracking: ${awb}` }
          }));
        }
      });
    }
  }
}
