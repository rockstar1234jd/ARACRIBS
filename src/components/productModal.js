// Aracribs - Detailed Product Modal & Specification Inspector
import { cartState, wishlistState, compareState } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';
import { PRODUCTS } from '../data/products.js';

export class ProductModal {
  constructor() {
    this.modalEl = document.getElementById('productDetailModal');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.currentProduct = null;
    this.selectedVariant = null;
    this.selectedAddons = [];
    this.quantity = 1;
    this.unitSystem = 'in'; // 'in' or 'cm'

    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'productDetailModal';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  open(product) {
    this.currentProduct = product;
    this.selectedVariant = product.lidVariants ? product.lidVariants[0] : null;
    this.selectedAddons = [];
    this.quantity = 1;
    this.unitSystem = 'in';

    this.render();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  calculateTotalPrice() {
    if (!this.currentProduct) return 0;
    let base = this.currentProduct.price;
    if (this.selectedVariant && this.selectedVariant.priceOffset) {
      base += this.selectedVariant.priceOffset;
    }
    this.selectedAddons.forEach(addon => {
      base += addon.price;
    });
    return base * this.quantity;
  }

  render() {
    const p = this.currentProduct;
    if (!p) return;

    const isWishlisted = wishlistState.has(p.id);
    const isCompared = compareState.has(p.id);
    const totalPrice = this.calculateTotalPrice();

    // Addon suggestions:
    const substrate = PRODUCTS.find(prod => prod.id === 'arachnidirt-original-4qt');
    const cork = PRODUCTS.find(prod => prod.id === 'virgin-cork-bark-round-6in');
    const dish = PRODUCTS.find(prod => prod.id === 'magnetic-acrylic-water-dish');

    this.modalEl.innerHTML = `
      <div class="modal-dialog product-modal-dialog">
        <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">&times;</button>

        <div class="product-modal-grid">
          <!-- Visual & Gallery Column -->
          <div class="modal-visual-col">
            <div class="modal-visual-main">
              ${renderProductVisual(p.svgType, p.id, { height: '340px' })}
              ${p.badge ? `<span class="badge-ribbon modal-badge">${p.badge}</span>` : ''}
            </div>

            <div class="modal-gallery-thumbs">
              <div class="thumb-pill active">Main Habitat</div>
              <div class="thumb-pill">Laser Vents (1.8mm)</div>
              <div class="thumb-pill">N52 Magnetic Lock</div>
            </div>

            <!-- Trust badges strip -->
            <div class="modal-trust-strip">
              <div class="trust-item">
                <span class="trust-icon">💎</span>
                <span>Museum-Grade 100% Cast Acrylic</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">🧲</span>
                <span>N52 Flush Neodymium Magnets</span>
              </div>
              <div class="trust-item">
                <span class="trust-icon">🛡️</span>
                <span>Zero-Warp Solvent Welded Seams</span>
              </div>
            </div>
          </div>

          <!-- Product Details & Configuration Column -->
          <div class="modal-details-col">
            <div class="modal-header-meta">
              <span class="product-category-chip">${p.category.toUpperCase()} • ${p.acrylicThickness || 'PREMIUM'}</span>
              <div class="card-rating">
                <span class="star-icon">★</span>
                <span>${p.rating}</span>
                <small>(${p.reviewCount} keeper reviews)</small>
              </div>
            </div>

            <h1 class="modal-product-title">${p.name}</h1>
            <p class="modal-product-tagline">${p.tagline}</p>

            <!-- Price & Stock Status -->
            <div class="modal-price-row">
              <div class="price-stack">
                <span class="modal-price" id="modalPriceDisplay">${formatPrice(totalPrice)}</span>
                ${p.compareAtPrice ? `<del class="modal-compare-price">${formatPrice(p.compareAtPrice * this.quantity)}</del>` : ''}
              </div>

              <div class="stock-status-pill ${p.inStock ? 'in-stock' : 'out-stock'}">
                <span class="stock-dot"></span>
                <span>${p.inStock ? `In Stock (${p.stockCount} left) • Ships Today` : 'Backordered'}</span>
              </div>
            </div>

            <!-- Description Excerpt -->
            <div class="modal-desc-box">
              <p>${p.description}</p>
            </div>

            <!-- Technical Specifications Table -->
            <div class="specs-accordion">
              <div class="specs-accordion-header">
                <h4>Engineered Enclosure Specifications</h4>
                <div class="unit-toggle">
                  <button class="unit-btn ${this.unitSystem === 'in' ? 'active' : ''}" data-unit="in">Inches</button>
                  <button class="unit-btn ${this.unitSystem === 'cm' ? 'active' : ''}" data-unit="cm">Centimeters</button>
                </div>
              </div>
              
              <div class="specs-grid">
                <div class="spec-cell">
                  <span class="spec-label">External Dimensions</span>
                  <span class="spec-value" id="specDimsVal">${this.unitSystem === 'in' ? p.dimensions.inches : p.dimensions.cm}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-label">Internal Volume</span>
                  <span class="spec-value">${p.volume || '1.6 Liters'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-label">Acrylic Thickness</span>
                  <span class="spec-value">${p.acrylicThickness || '4.0mm Cast'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-label">Substrate Reservoir</span>
                  <span class="spec-value">${p.substrateDepth || '2.0 inches deep'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-label">Lid Closure</span>
                  <span class="spec-value">${p.lidStyle || 'Magnetic Slider'}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-label">Ventilation Array</span>
                  <span class="spec-value">${p.ventilation || 'Laser Cross-Flow Holes'}</span>
                </div>
              </div>
            </div>

            <!-- Suitable Species Tags -->
            ${p.suitableSpecies ? `
              <div class="suitable-species-block">
                <label class="config-label">Recommended Arachnid & Invert Species:</label>
                <div class="species-tags-wrap">
                  ${p.suitableSpecies.map(sp => `<span class="species-pill">🕷️ ${sp}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Lid / Canopy Variant Selector -->
            ${p.lidVariants && p.lidVariants.length > 1 ? `
              <div class="config-group">
                <label class="config-label">Choose Lid Configuration:</label>
                <div class="variant-chips-grid">
                  ${p.lidVariants.map((v, idx) => `
                    <button class="variant-chip ${v.name === this.selectedVariant.name ? 'active' : ''}" data-variant-idx="${idx}">
                      <span>${v.name}</span>
                      ${v.priceOffset > 0 ? `<small>+${formatPrice(v.priceOffset)}</small>` : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Add-on Accessories Checkboxes (Upsell Bundle) -->
            ${p.type === 'enclosure' ? `
              <div class="addons-upsell-box">
                <label class="config-label">Complete The Habitat (Save On Shipping):</label>
                
                ${substrate ? `
                  <label class="addon-checkbox-row">
                    <input type="checkbox" class="addon-input" data-addon-id="${substrate.id}" data-addon-name="${substrate.name}" data-addon-price="${substrate.price}" />
                    <div class="addon-info">
                      <strong>Add 4-Quart Arachnidirt™ Substrate</strong>
                      <small>Bioactive anti-collapse soil</small>
                    </div>
                    <span class="addon-price">+${formatPrice(substrate.price)}</span>
                  </label>
                ` : ''}

                ${cork ? `
                  <label class="addon-checkbox-row">
                    <input type="checkbox" class="addon-input" data-addon-id="${cork.id}" data-addon-name="${cork.name}" data-addon-price="${cork.price}" />
                    <div class="addon-info">
                      <strong>Add Virgin Natural Cork Bark Hide</strong>
                      <small>Mold-resistant natural oak hide</small>
                    </div>
                    <span class="addon-price">+${formatPrice(cork.price)}</span>
                  </label>
                ` : ''}

                ${dish ? `
                  <label class="addon-checkbox-row">
                    <input type="checkbox" class="addon-input" data-addon-id="${dish.id}" data-addon-name="${dish.name}" data-addon-price="${dish.price}" />
                    <div class="addon-info">
                      <strong>Add Magnetic Acrylic Water Dish</strong>
                      <small>Dual N52 waterproof magnets</small>
                    </div>
                    <span class="addon-price">+${formatPrice(dish.price)}</span>
                  </label>
                ` : ''}
              </div>
            ` : ''}

            <!-- Quantity & Add to Cart -->
            <div class="modal-action-row">
              <div class="qty-control">
                <button class="qty-btn" id="qtyMinusBtn" aria-label="Decrease quantity">-</button>
                <input type="number" id="qtyInput" class="qty-input" value="${this.quantity}" min="1" max="99" readonly />
                <button class="qty-btn" id="qtyPlusBtn" aria-label="Increase quantity">+</button>
              </div>

              <button class="btn btn-primary modal-add-btn" id="modalAddToCartBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Add To Cart • <span id="modalBtnPrice">${formatPrice(totalPrice)}</span></span>
              </button>

              <button class="icon-tool-btn modal-tool-btn ${isWishlisted ? 'active' : ''}" id="modalWishlistBtn" title="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? '#ff4081' : 'none'}" stroke="${isWishlisted ? '#ff4081' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindModalElements();
  }

  bindEvents() {
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });

    window.addEventListener('currency:updated', () => {
      if (!this.modalEl.classList.contains('hidden')) {
        this.render();
      }
    });
  }

  bindModalElements() {
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Unit toggle (Inches vs CM)
    this.modalEl.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.unitSystem = btn.dataset.unit;
        this.modalEl.querySelectorAll('.unit-btn').forEach(b => b.classList.toggle('active', b.dataset.unit === this.unitSystem));
        const dimsEl = document.getElementById('specDimsVal');
        if (dimsEl && this.currentProduct) {
          dimsEl.textContent = this.unitSystem === 'in' ? this.currentProduct.dimensions.inches : this.currentProduct.dimensions.cm;
        }
      });
    });

    // Variant chips
    this.modalEl.querySelectorAll('.variant-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const idx = parseInt(chip.dataset.variantIdx, 10);
        this.selectedVariant = this.currentProduct.lidVariants[idx];
        this.modalEl.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.updatePrices();
      });
    });

    // Add-on checkboxes
    this.modalEl.querySelectorAll('.addon-input').forEach(box => {
      box.addEventListener('change', () => {
        this.selectedAddons = [];
        this.modalEl.querySelectorAll('.addon-input:checked').forEach(checkedBox => {
          this.selectedAddons.push({
            id: checkedBox.dataset.addonId,
            name: checkedBox.dataset.addonName,
            price: parseFloat(checkedBox.dataset.addonPrice)
          });
        });
        this.updatePrices();
      });
    });

    // Quantity buttons
    const minusBtn = document.getElementById('qtyMinusBtn');
    const plusBtn = document.getElementById('qtyPlusBtn');
    const qtyInput = document.getElementById('qtyInput');

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          if (qtyInput) qtyInput.value = this.quantity;
          this.updatePrices();
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        this.quantity++;
        if (qtyInput) qtyInput.value = this.quantity;
        this.updatePrices();
      });
    }

    // Add to cart button
    const addBtn = document.getElementById('modalAddToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const p = this.currentProduct;
        // Add main item
        cartState.add({
          id: p.id,
          name: p.name,
          price: p.price + (this.selectedVariant ? this.selectedVariant.priceOffset : 0),
          variant: this.selectedVariant ? this.selectedVariant.name : 'Standard',
          quantity: this.quantity,
          type: p.svgType
        });

        // Add any selected add-ons
        this.selectedAddons.forEach(addon => {
          cartState.add({
            id: addon.id,
            name: addon.name,
            price: addon.price,
            variant: 'Add-on with ' + p.name,
            quantity: 1,
            type: 'accessories'
          });
        });

        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Added ${this.quantity}x ${p.name} to cart!` }
        }));

        this.close();
      });
    }

    // Wishlist button
    const wishBtn = document.getElementById('modalWishlistBtn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        const added = wishlistState.toggle(this.currentProduct.id);
        wishBtn.classList.toggle('active', added);
        const svg = wishBtn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', added ? '#ff4081' : 'none');
          svg.setAttribute('stroke', added ? '#ff4081' : 'currentColor');
        }
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: added ? 'Saved to Wishlist ❤️' : 'Removed from Wishlist' }
        }));
      });
    }
  }

  updatePrices() {
    const total = this.calculateTotalPrice();
    const priceEl = document.getElementById('modalPriceDisplay');
    const btnPriceEl = document.getElementById('modalBtnPrice');
    if (priceEl) priceEl.textContent = formatPrice(total);
    if (btnPriceEl) btnPriceEl.textContent = formatPrice(total);
  }
}
