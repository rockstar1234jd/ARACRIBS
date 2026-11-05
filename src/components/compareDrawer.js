// Aracribs - Side-by-Side Enclosure Comparison Matrix
import { compareState, cartState } from '../utils/storage.js';
import { PRODUCTS } from '../data/products.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class CompareDrawer {
  constructor() {
    this.drawerEl = document.getElementById('compareDrawerContainer');
    if (!this.drawerEl) {
      this.createDrawerDOM();
    } else {
      this.drawerEl.className = 'modal-backdrop hidden';
    }
    this.bindEvents();
  }

  createDrawerDOM() {
    const el = document.createElement('div');
    el.id = 'compareDrawerContainer';
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
    const compareIds = compareState.get();
    const comparedProducts = compareIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    this.modalEl = this.drawerEl;
    this.drawerEl.innerHTML = `
      <div class="modal-dialog compare-dialog">
        <button class="modal-close-btn" id="compareCloseBtn" aria-label="Close compare">&times;</button>

        <div class="compare-header">
          <span class="section-eyebrow">TECHNICAL MATRIX</span>
          <h3>Compare Enclosure Engineering (${comparedProducts.length} of 3)</h3>
          <p>Side-by-side comparison of dimensions, substrate reservoir depths, and lid mechanisms.</p>
        </div>

        ${comparedProducts.length === 0 ? `
          <div class="empty-compare-box">
            <p>No enclosures selected for comparison yet.</p>
            <small>Click the compare icon on any product card in the catalog to add it here.</small>
          </div>
        ` : `
          <div class="compare-matrix-scroll">
            <table class="compare-table">
              <thead>
                <tr>
                  <th class="matrix-feature-col">Feature / Metric</th>
                  ${comparedProducts.map(p => `
                    <th class="matrix-prod-col">
                      <div class="matrix-thumb">
                        ${renderProductVisual(p.svgType, p.id, { height: '110px' })}
                      </div>
                      <div class="matrix-title">${p.name}</div>
                      <div class="matrix-price">${formatPrice(p.price)}</div>
                      <button class="btn btn-outline btn-xs remove-compare-btn" data-id="${p.id}">Remove</button>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>External Dimensions</strong></td>
                  ${comparedProducts.map(p => `<td>${p.dimensions.inches}<br><small class="text-muted">(${p.dimensions.cm})</small></td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Substrate Reservoir</strong></td>
                  ${comparedProducts.map(p => `<td>${p.substrateDepth || 'N/A'}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Lid Mechanism</strong></td>
                  ${comparedProducts.map(p => `<td>${p.lidStyle || 'Standard'}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Acrylic Thickness</strong></td>
                  ${comparedProducts.map(p => `<td>${p.acrylicThickness || '4mm Cast'}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Internal Volume</strong></td>
                  ${comparedProducts.map(p => `<td>${p.volume || 'N/A'}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Ideal Species</strong></td>
                  ${comparedProducts.map(p => `
                    <td>
                      <ul class="compare-species-list">
                        ${p.suitableSpecies ? p.suitableSpecies.slice(0, 3).map(s => `<li>• ${s}</li>`).join('') : 'Various'}
                      </ul>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td><strong>Action</strong></td>
                  ${comparedProducts.map(p => `
                    <td>
                      <button class="btn btn-primary btn-sm matrix-add-btn" data-id="${p.id}">
                        Add to Cart
                      </button>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>

          <div class="compare-footer-actions">
            <button class="btn btn-outline" id="clearCompareBtn">Clear Comparison Matrix</button>
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

    window.addEventListener('compare:updated', () => {
      if (!this.drawerEl.classList.contains('hidden')) {
        this.render();
      }
    });
  }

  bindActions() {
    const closeBtn = document.getElementById('compareCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Remove buttons
    this.drawerEl.querySelectorAll('.remove-compare-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        compareState.toggle(btn.dataset.id);
      });
    });

    // Clear compare
    const clearBtn = document.getElementById('clearCompareBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        compareState.clear();
      });
    }

    // Add to cart buttons
    this.drawerEl.querySelectorAll('.matrix-add-btn').forEach(btn => {
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
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Added ${product.name} to cart!` }
          }));
        }
      });
    });
  }
}
