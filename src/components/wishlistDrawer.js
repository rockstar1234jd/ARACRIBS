// Aracribs - Saved Wishlist Drawer
import { wishlistState, cartState } from '../utils/storage.js';
import { PRODUCTS } from '../data/products.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class WishlistDrawer {
  constructor(onProductSelect) {
    this.onProductSelect = onProductSelect || (() => {});
    this.drawerEl = document.getElementById('wishlistDrawerContainer');
    if (!this.drawerEl) {
      this.createDrawerDOM();
    } else {
      this.drawerEl.className = 'modal-backdrop hidden';
    }
    this.bindEvents();
  }

  createDrawerDOM() {
    const el = document.createElement('div');
    el.id = 'wishlistDrawerContainer';
    el.className = 'modal-backdrop hidden';
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
    const ids = wishlistState.get();
    const products = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    this.drawerEl.innerHTML = `
      <div class="modal-dialog wishlist-dialog">
        <button class="modal-close-btn" id="wishlistCloseBtn" aria-label="Close wishlist">&times;</button>

        <div class="wishlist-header">
          <span class="section-eyebrow">SAVED HABITATS</span>
          <h3>Your Favorite Enclosures (${products.length})</h3>
          <p>Keep track of future enclosure upgrades and bioactive botanical supplies.</p>
        </div>

        ${products.length === 0 ? `
          <div class="empty-wishlist-box">
            <div class="empty-icon">🤍</div>
            <h4>Your wishlist is empty</h4>
            <p>Click the heart icon on any product in the catalog to save it for later.</p>
          </div>
        ` : `
          <div class="wishlist-grid">
            ${products.map(p => `
              <div class="wishlist-item-card" data-id="${p.id}">
                <div class="wishlist-thumb" data-action="view">
                  ${renderProductVisual(p.svgType, p.id, { height: '140px' })}
                </div>
                <div class="wishlist-info">
                  <div class="wishlist-title" data-action="view">${p.name}</div>
                  <div class="wishlist-price">${formatPrice(p.price)}</div>
                </div>
                <div class="wishlist-actions">
                  <button class="btn btn-primary btn-sm wishlist-cart-btn" data-id="${p.id}">Move to Cart</button>
                  <button class="btn btn-outline btn-sm wishlist-remove-btn" data-id="${p.id}">Remove</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    this.bindActions();
  }

  bindEvents() {
    this.drawerEl.addEventListener('click', (e) => {
      if (e.target === this.drawerEl) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.drawerEl.classList.contains('hidden')) {
        this.close();
      }
    });

    window.addEventListener('wishlist:updated', () => {
      if (!this.drawerEl.classList.contains('hidden')) {
        this.render();
      }
    });
  }

  bindActions() {
    const closeBtn = document.getElementById('wishlistCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    this.drawerEl.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        wishlistState.toggle(btn.dataset.id);
      });
    });

    this.drawerEl.querySelectorAll('.wishlist-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = PRODUCTS.find(p => p.id === btn.dataset.id);
        if (product) {
          cartState.add({
            id: product.id,
            name: product.name,
            price: product.price,
            variant: product.lidVariants ? product.lidVariants[0].name : 'Standard',
            quantity: 1,
            type: product.svgType
          });
          wishlistState.toggle(product.id);
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Moved ${product.name} to cart!` }
          }));
        }
      });
    });

    this.drawerEl.querySelectorAll('[data-action="view"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        if (card) {
          const product = PRODUCTS.find(p => p.id === card.dataset.id);
          if (product) {
            this.close();
            this.onProductSelect(product);
          }
        }
      });
    });
  }
}
