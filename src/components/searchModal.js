// Aracribs - Instant Predictive Search Modal
import { PRODUCTS } from '../data/products.js';
import { CARE_GUIDES } from '../data/guides.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';
import { api } from '../utils/storage.js';

export class SearchModal {
  constructor(onProductSelect, onGuideSelect) {
    this.onProductSelect = onProductSelect || (() => {});
    this.onGuideSelect = onGuideSelect || (() => {});
    this.products = [...PRODUCTS];
    this.modalEl = document.getElementById('searchModalContainer');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'searchModalContainer';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  async open() {
    try {
      const live = await api.getProducts();
      if (live && Array.isArray(live) && live.length > 0) {
        this.products = live;
      }
    } catch (e) {}

    this.render();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('globalSearchInput');
    if (input) {
      setTimeout(() => input.focus(), 80);
    }
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  render() {
    this.modalEl.innerHTML = `
      <div class="modal-dialog search-dialog">
        <div class="search-input-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="globalSearchInput" placeholder="Search cribs, species (e.g. Versicolor), substrates, or guides..." autocomplete="off" />
          <button class="search-modal-close" id="searchCloseBtn">&times;</button>
        </div>

        <div class="search-quick-tags">
          <span class="quick-tag-label">Popular Searches:</span>
          <button class="quick-search-pill" data-query="Arboreal">Treehouse</button>
          <button class="quick-search-pill" data-query="Slider">Slider Pro</button>
          <button class="quick-search-pill" data-query="Arachnidirt">Arachnidirt</button>
          <button class="quick-search-pill" data-query="Jumping Spider">Jumping Spider</button>
          <button class="quick-search-pill" data-query="Bioactive">Bioactive</button>
        </div>

        <div class="search-results-container" id="searchResultsArea">
          <div class="search-initial-hint">
            <p>Start typing to search our catalog of museum-grade habitats and husbandry articles.</p>
          </div>
        </div>
      </div>
    `;

    this.bindSearchEvents();
  }

  bindEvents() {
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
      // Shortcut Ctrl+K or /
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  }

  bindSearchEvents() {
    const closeBtn = document.getElementById('searchCloseBtn');
    const input = document.getElementById('globalSearchInput');
    const resultsArea = document.getElementById('searchResultsArea');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Quick tag buttons
    this.modalEl.querySelectorAll('.quick-search-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        if (input) {
          input.value = btn.dataset.query;
          this.executeSearch(btn.dataset.query, resultsArea);
        }
      });
    });

    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.executeSearch(query, resultsArea);
      });
    }
  }

  executeSearch(query, resultsArea) {
    if (!resultsArea) return;

    if (!query) {
      resultsArea.innerHTML = `<div class="search-initial-hint"><p>Start typing to search habitats, species, or guides...</p></div>`;
      return;
    }

    // Match products
    const matchedProducts = this.products.filter(p => {
      return p.name.toLowerCase().includes(query) ||
             (p.tagline && p.tagline.toLowerCase().includes(query)) ||
             p.category.toLowerCase().includes(query) ||
             (p.suitableSpecies && p.suitableSpecies.some(s => s.toLowerCase().includes(query)));
    });

    // Match guides
    const matchedGuides = CARE_GUIDES.filter(g => {
      return g.title.toLowerCase().includes(query) ||
             g.summary.toLowerCase().includes(query) ||
             g.category.toLowerCase().includes(query);
    });

    if (matchedProducts.length === 0 && matchedGuides.length === 0) {
      resultsArea.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "<strong>${query}</strong>".</p>
          <small>Try checking the spelling or searching by habitat style like "Arboreal" or "Terrestrial".</small>
        </div>
      `;
      return;
    }

    resultsArea.innerHTML = `
      ${matchedProducts.length > 0 ? `
        <div class="search-section-block">
          <span class="search-group-title">Enclosures & Products (${matchedProducts.length})</span>
          <div class="search-prods-list">
            ${matchedProducts.map(p => `
              <div class="search-prod-item" data-id="${p.id}">
                <div class="search-prod-thumb">
                  ${renderProductVisual(p.svgType, p.id, { height: '50px' })}
                </div>
                <div class="search-prod-info">
                  <div class="search-prod-name">${p.name}</div>
                  <div class="search-prod-sub">${p.dimensions.inches} • ${p.category}</div>
                </div>
                <div class="search-prod-price">${formatPrice(p.price)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${matchedGuides.length > 0 ? `
        <div class="search-section-block">
          <span class="search-group-title">Husbandry Guides (${matchedGuides.length})</span>
          <div class="search-guides-list">
            ${matchedGuides.map(g => `
              <div class="search-guide-item" data-guide-id="${g.id}">
                <span class="guide-tag">${g.category}</span>
                <div class="guide-title">${g.title}</div>
                <small class="guide-readtime">${g.readTime}</small>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    // Bind item clicks
    resultsArea.querySelectorAll('.search-prod-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const p = this.products.find(prod => prod.id === id);
        if (p) {
          this.close();
          this.onProductSelect(p);
        }
      });
    });

    resultsArea.querySelectorAll('.search-guide-item').forEach(el => {
      el.addEventListener('click', () => {
        const guideId = el.dataset.guideId;
        const g = CARE_GUIDES.find(guide => guide.id === guideId);
        if (g) {
          this.close();
          this.onGuideSelect(g);
        }
      });
    });
  }
}
