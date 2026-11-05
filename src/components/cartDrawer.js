// Aracribs - Slide-out Cart Drawer with Free Shipping Bar & Coupon Engine
import { cartState, discountState } from '../utils/storage.js';
import { formatPrice, getDiscountedAmount } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';
import { PRODUCTS } from '../data/products.js';

export class CartDrawer {
  constructor(onCheckoutTrigger) {
    this.onCheckoutTrigger = onCheckoutTrigger || (() => {});
    this.drawerEl = document.getElementById('cartDrawerContainer');
    if (!this.drawerEl) {
      this.createDrawerDOM();
    } else {
      this.drawerEl.className = 'cart-drawer-overlay hidden';
    }
    this.bindEvents();
  }

  createDrawerDOM() {
    const el = document.createElement('div');
    el.id = 'cartDrawerContainer';
    el.className = 'cart-drawer-overlay hidden';
    document.body.appendChild(el);
    this.drawerEl = el;
  }

  open() {
    this.render();
    this.drawerEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawerEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  render() {
    const cart = cartState.get();
    const subtotal = cartState.subtotal();
    const freeShippingThreshold = 2500;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const amountAway = Math.max(0, freeShippingThreshold - subtotal);

    const activeDiscount = discountState.get();
    const discountAmount = getDiscountedAmount(subtotal, activeDiscount);
    const shipping = (isFreeShipping || (activeDiscount && activeDiscount.freeShipping)) ? 0 : 199;
    const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
    const grandTotal = Math.max(0, (subtotal - discountAmount) + shipping + tax);

    // Cross sell: recommend Arachnidirt or Cork round if not in cart
    const crossSellItem = PRODUCTS.find(p => p.id === 'arachnidirt-original-4qt' && !cart.some(i => i.id === p.id))
      || PRODUCTS.find(p => p.id === 'virgin-cork-bark-round-6in' && !cart.some(i => i.id === p.id));

    this.drawerEl.innerHTML = `
      <div class="cart-drawer-backdrop" id="cartBackdrop"></div>
      <div class="cart-drawer-panel">
        <!-- Drawer Header -->
        <div class="cart-drawer-header">
          <div class="cart-header-title-row">
            <h3>Your Habitat Cart (${cartState.count()})</h3>
            <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close cart">&times;</button>
          </div>

          <!-- Free Shipping Milestone Tracker -->
          <div class="shipping-meter-wrap">
            <div class="shipping-meter-text">
              ${isFreeShipping
                ? '<span>🎉 <strong>Congratulations!</strong> You unlocked FREE Insured Shipping</span>'
                : `<span>Add <strong>${formatPrice(amountAway)}</strong> more for <strong>FREE Insured Shipping</strong></span>`
              }
            </div>
            <div class="shipping-progress-track">
              <div class="shipping-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- Drawer Content List -->
        <div class="cart-drawer-body">
          ${cart.length === 0 ? `
            <div class="cart-empty-view">
              <div class="cart-empty-icon">🕷️</div>
              <h4>Your crib cart is empty</h4>
              <p>Explore our crystal acrylic enclosures and bioactive botanicals to start your build.</p>
              <button class="btn btn-primary" id="emptyCartShopBtn">Browse All Habitats</button>
            </div>
          ` : `
            <div class="cart-items-list">
              ${cart.map((item, idx) => `
                <div class="cart-item-row" data-id="${item.id}" data-variant="${item.variant}">
                  <div class="cart-item-thumb">
                    ${renderProductVisual(item.type || 'slider', item.id, { height: '80px' })}
                  </div>

                  <div class="cart-item-info">
                    <div class="cart-item-header">
                      <h4 class="cart-item-name">${item.name}</h4>
                      <button class="cart-remove-btn" data-id="${item.id}" data-variant="${item.variant}" title="Remove item">&times;</button>
                    </div>
                    <div class="cart-item-variant">${item.variant}</div>
                    
                    <div class="cart-item-bottom">
                      <div class="cart-qty-pill">
                        <button class="cart-qty-btn minus" data-id="${item.id}" data-variant="${item.variant}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn plus" data-id="${item.id}" data-variant="${item.variant}">+</button>
                      </div>

                      <div class="cart-item-price">
                        ${formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Cross-Sell Recommendation Card -->
            ${crossSellItem ? `
              <div class="cart-cross-sell-card">
                <div class="cross-sell-thumb">
                  ${renderProductVisual(crossSellItem.svgType, crossSellItem.id, { height: '60px' })}
                </div>
                <div class="cross-sell-content">
                  <span class="cross-sell-label">FREQUENTLY PAIRED</span>
                  <div class="cross-sell-title">${crossSellItem.name}</div>
                  <div class="cross-sell-price">${formatPrice(crossSellItem.price)}</div>
                </div>
                <button class="btn btn-outline btn-xs" id="crossSellAddBtn" data-id="${crossSellItem.id}">
                  + Add
                </button>
              </div>
            ` : ''}
          `}
        </div>

        <!-- Drawer Footer & Checkout -->
        ${cart.length > 0 ? `
          <div class="cart-drawer-footer">
            <!-- Promo Code Input -->
            <div class="coupon-box">
              ${activeDiscount ? `
                <div class="active-discount-chip">
                  <span>🏷️ <strong>${activeDiscount.code}</strong> (${activeDiscount.label})</span>
                  <button id="removeDiscountBtn" title="Remove code">&times;</button>
                </div>
              ` : `
                <div class="coupon-input-group">
                  <input type="text" id="couponInput" placeholder="Promo code (try CRIB10)" class="coupon-input" />
                  <button class="btn btn-outline btn-sm" id="applyCouponBtn">Apply</button>
                </div>
              `}
            </div>

            <!-- Pricing Breakdown -->
            <div class="cart-summary-table">
              <div class="summary-line">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              
              ${activeDiscount ? `
                <div class="summary-line discount-line">
                  <span>Discount (${activeDiscount.code})</span>
                  <span>-${formatPrice(discountAmount)}</span>
                </div>
              ` : ''}

              <div class="summary-line">
                <span>Estimated Shipping</span>
                <span>${shipping === 0 ? '<strong class="text-accent">FREE</strong>' : formatPrice(shipping)}</span>
              </div>

              <div class="summary-line">
                <span>GST (5%)</span>
                <span>${formatPrice(tax)}</span>
              </div>

              <div class="summary-line total-line">
                <strong>Total</strong>
                <strong class="grand-total-val">${formatPrice(grandTotal)}</strong>
              </div>
            </div>

            <button class="btn btn-primary btn-block checkout-trigger-btn" id="drawerCheckoutBtn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Proceed to Checkout • ${formatPrice(grandTotal)}</span>
            </button>

            <div class="cart-guarantee-note">
              <span>🔒 256-Bit Encrypted Checkout • Safe Transit Guarantee</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.bindDrawerActions();
  }

  bindEvents() {
    window.addEventListener('cart:updated', () => {
      if (!this.drawerEl.classList.contains('hidden')) {
        this.render();
      }
    });

    window.addEventListener('currency:updated', () => {
      if (!this.drawerEl.classList.contains('hidden')) {
        this.render();
      }
    });

    window.addEventListener('discount:updated', () => {
      if (!this.drawerEl.classList.contains('hidden')) {
        this.render();
      }
    });
  }

  bindDrawerActions() {
    const backdrop = document.getElementById('cartBackdrop');
    const closeBtn = document.getElementById('drawerCloseBtn');
    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Empty cart shop button
    const shopBtn = document.getElementById('emptyCartShopBtn');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        this.close();
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Item quantity buttons
    this.drawerEl.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        cartState.updateQuantity(btn.dataset.id, btn.dataset.variant, 1);
      });
    });

    this.drawerEl.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        cartState.updateQuantity(btn.dataset.id, btn.dataset.variant, -1);
      });
    });

    // Remove buttons
    this.drawerEl.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cartState.remove(btn.dataset.id, btn.dataset.variant);
      });
    });

    // Cross-sell button
    const crossBtn = document.getElementById('crossSellAddBtn');
    if (crossBtn) {
      crossBtn.addEventListener('click', () => {
        const product = PRODUCTS.find(p => p.id === crossBtn.dataset.id);
        if (product) {
          cartState.add({
            id: product.id,
            name: product.name,
            price: product.price,
            variant: 'Quick Add',
            quantity: 1,
            type: product.svgType
          });
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Added ${product.name} to cart!` }
          }));
        }
      });
    }

    // Coupon logic
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponInput');
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'CRIB10') {
          discountState.set({ code: 'CRIB10', type: 'percentage', value: 10, label: '10% Off Habitat' });
          window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Coupon CRIB10 applied! (10% off)' } }));
        } else if (code === 'FREESHIP') {
          discountState.set({ code: 'FREESHIP', type: 'fixed', value: 0, freeShipping: true, label: 'Free Insured Shipping' });
          window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Free Shipping unlocked!' } }));
        } else if (code === 'ARACHNID') {
          discountState.set({ code: 'ARACHNID', type: 'fixed', value: 500, label: '₹500 Invert Keeper Credit' });
          window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: '₹500 Discount applied!' } }));
        } else {
          window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Invalid promo code. Try CRIB10' } }));
        }
      });
    }

    const removeDiscountBtn = document.getElementById('removeDiscountBtn');
    if (removeDiscountBtn) {
      removeDiscountBtn.addEventListener('click', () => {
        discountState.remove();
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Discount removed' } }));
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('drawerCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.close();
        this.onCheckoutTrigger();
      });
    }
  }
}
