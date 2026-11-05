// Aracribs - Interactive Product Catalog & Multi-Faceted Filtering
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { cartState, wishlistState, compareState, api } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class ProductCatalog {
  constructor(containerId, onProductSelect) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.onProductSelect = onProductSelect || (() => {});
    this.products = [...PRODUCTS];
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.maxPrice = 20000;
    this.inStockOnly = false;
    this.selectedLidType = 'all';
    this.viewMode = 'grid'; // 'grid' | 'list'

    this.init();
  }

  async init() {
    this.renderLayout();
    this.bindEvents();
    this.updateProductList();
    await this.loadLiveProducts();
  }

  async loadLiveProducts() {
    try {
      const live = await api.getProducts();
      if (live && Array.isArray(live) && live.length > 0) {
        this.products = live;
        this.updateProductList();
      }
    } catch (e) {}
  }

  renderLayout() {
    this.container.innerHTML = `
      <section class="catalog-section" id="catalog">
        <div class="catalog-header-bar">
          <div class="catalog-title-col">
            <span class="section-eyebrow">PRECISION HABITATS & BOTANICALS</span>
            <h2 class="section-title">The Complete Invertebrate Collection</h2>
            <p class="section-desc">Explore crystal-clear cast acrylic enclosures, proprietary bioactive soils, and artisan terrarium decor.</p>
          </div>

          <div class="catalog-view-tools">
            <div class="view-switch-btns">
              <button class="view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid View">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button class="view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list" title="Detailed List View">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>

            <div class="sort-selector-wrap">
              <label for="catalogSort">Sort By:</label>
              <select id="catalogSort" class="custom-select">
                <option value="featured">Featured / Best Sellers</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Category Pills Ribbon -->
        <div class="category-tabs-scroll">
          <div class="category-tabs">
            ${CATEGORIES.map(cat => `
              <button class="cat-tab ${cat.id === this.activeCategory ? 'active' : ''}" data-category="${cat.id}">
                <span>${cat.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Filter Sub-Bar -->
        <div class="filters-sub-bar">
          <div class="filter-controls-inline">
            <div class="filter-chip">
              <label>Lid Style:</label>
              <select id="filterLidType" class="chip-select">
                <option value="all">All Lid Mechanisms</option>
                <option value="Front">Front Switch Door</option>
                <option value="Sliding">Smooth Sliding Track</option>
                <option value="Snap">Magnetic Snap Lid</option>
              </select>
            </div>

            <div class="filter-chip price-slider-chip">
              <label>Max Price: <span id="priceValDisplay">₹20,000</span></label>
              <input type="range" id="filterPriceRange" min="500" max="20000" step="500" value="20000" class="chip-range" />
            </div>

            <label class="filter-checkbox-chip">
              <input type="checkbox" id="filterInStock" />
              <span>In Stock Only</span>
            </label>
          </div>

          <div class="filter-results-count" id="catalogResultsCount">
            Showing all products
          </div>
        </div>

        <!-- Products Grid / List Target -->
        <div class="products-container ${this.viewMode === 'grid' ? 'products-grid' : 'products-list'}" id="productsContainer">
          <!-- Injected dynamically -->
        </div>
      </section>
    `;
  }

  bindEvents() {
    // Category tabs
    this.container.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.container.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.updateProductList();
      });
    });

    // View switch
    this.container.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.viewMode = btn.dataset.view;
        const pCont = document.getElementById('productsContainer');
        if (pCont) {
          pCont.className = `products-container ${this.viewMode === 'grid' ? 'products-grid' : 'products-list'}`;
        }
        this.updateProductList();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('catalogSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.updateProductList();
      });
    }

    // Lid filter
    const lidSelect = document.getElementById('filterLidType');
    if (lidSelect) {
      lidSelect.addEventListener('change', (e) => {
        this.selectedLidType = e.target.value;
        this.updateProductList();
      });
    }

    // Price range
    const priceRange = document.getElementById('filterPriceRange');
    const priceDisplay = document.getElementById('priceValDisplay');
    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        this.maxPrice = parseFloat(e.target.value);
        if (priceDisplay) priceDisplay.textContent = formatPrice(this.maxPrice);
        this.updateProductList();
      });
    }

    // In stock
    const inStockBox = document.getElementById('filterInStock');
    if (inStockBox) {
      inStockBox.addEventListener('change', (e) => {
        this.inStockOnly = e.target.checked;
        this.updateProductList();
      });
    }

    // Storage listeners
    window.addEventListener('currency:updated', () => this.updateProductList());
    window.addEventListener('wishlist:updated', () => this.updateProductList());
    window.addEventListener('compare:updated', () => this.updateProductList());
    window.addEventListener('catalog:refresh', () => this.loadLiveProducts());
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.container.querySelectorAll('.cat-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.category === catId);
    });
    this.updateProductList();
  }

  setSearchQuery(q) {
    this.searchQuery = q.toLowerCase().trim();
    this.updateProductList();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      // Category filter
      if (this.activeCategory !== 'all' && p.category !== this.activeCategory) {
        return false;
      }
      // Search
      if (this.searchQuery) {
        const matchName = p.name.toLowerCase().includes(this.searchQuery);
        const matchTagline = p.tagline.toLowerCase().includes(this.searchQuery);
        const matchSpecies = p.suitableSpecies && p.suitableSpecies.some(s => s.toLowerCase().includes(this.searchQuery));
        if (!matchName && !matchTagline && !matchSpecies) return false;
      }
      // Price
      if (p.price > this.maxPrice) {
        return false;
      }
      // In stock
      if (this.inStockOnly && !p.inStock) {
        return false;
      }
      // Lid mechanism
      if (this.selectedLidType !== 'all') {
        if (!p.lidStyle || !p.lidStyle.toLowerCase().includes(this.selectedLidType.toLowerCase())) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') return a.price - b.price;
      if (this.sortBy === 'price-high') return b.price - a.price;
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0; // featured default
    });
  }

  updateProductList() {
    const pCont = document.getElementById('productsContainer');
    const countEl = document.getElementById('catalogResultsCount');
    if (!pCont) return;

    const products = this.getFilteredProducts();
    if (countEl) {
      countEl.textContent = `Showing ${products.length} of ${this.products.length} products`;
    }

    if (products.length === 0) {
      pCont.innerHTML = `
        <div class="empty-catalog-message">
          <div class="empty-icon">🔍</div>
          <h3>No matching habitats found</h3>
          <p>Try broadening your filter criteria or search query.</p>
          <button class="btn btn-outline" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const rBtn = document.getElementById('resetFiltersBtn');
      if (rBtn) {
        rBtn.addEventListener('click', () => {
          this.activeCategory = 'all';
          this.searchQuery = '';
          this.maxPrice = 20000;
          this.selectedLidType = 'all';
          this.inStockOnly = false;
          this.renderLayout();
          this.bindEvents();
          this.updateProductList();
        });
      }
      return;
    }

    pCont.innerHTML = products.map(product => {
      const isWishlisted = wishlistState.has(product.id);
      const isCompared = compareState.has(product.id);

      const discountPct = (product.compareAtPrice && product.compareAtPrice > product.price)
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;
      const stock = typeof product.stock === 'number' ? product.stock : 8;
      const stockBadge = stock <= 10 
        ? `<span class="stock-scarcity-pill">🔥 Only ${stock} left</span>`
        : `<span class="dispatch-speed-pill">⚡ Fast 24-48h Dispatch</span>`;

      if (this.viewMode === 'list') {
        return `
          <div class="product-list-card" data-id="${product.id}">
            <div class="list-visual-col" data-action="view">
              ${renderProductVisual(product.svgType, product.id, { height: '170px' })}
              <div class="card-badges-stack">
                ${product.badge ? `<span class="badge-ribbon">${product.badge}</span>` : ''}
                ${discountPct > 0 ? `<span class="discount-save-pill">-${discountPct}%</span>` : ''}
              </div>
            </div>

            <div class="list-info-col" data-action="view">
              <div class="product-category-meta">${product.category.toUpperCase()} • ${product.acrylicThickness || 'PREMIUM'}</div>
              <h3 class="list-title">${product.name}</h3>
              <p class="list-tagline">${product.tagline}</p>
              
              <div class="card-urgency-row">
                ${stockBadge}
                <span class="delivery-city-note">🇮🇳 All-India Insured Dispatch</span>
              </div>

              <div class="list-specs-strip">
                <span class="spec-tag">📐 ${product.dimensions.inches}</span>
                ${product.lidStyle ? `<span class="spec-tag">🔒 ${product.lidStyle.split('with')[0]}</span>` : ''}
                <span class="spec-tag">⭐ ${product.rating} (${product.reviewCount})</span>
              </div>
            </div>

            <div class="list-actions-col">
              <div class="list-price-box">
                <div class="current-price">${formatPrice(product.price)}</div>
                ${product.compareAtPrice ? `<del class="compare-price">${formatPrice(product.compareAtPrice)}</del>` : ''}
              </div>

              <div class="list-btn-group">
                <button class="btn btn-primary btn-sm add-cart-btn" data-id="${product.id}">
                  Add to Cart
                </button>
                <div class="icon-actions-row">
                  <button class="icon-tool-btn wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="Save to Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#ff4081' : 'none'}" stroke="${isWishlisted ? '#ff4081' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <button class="icon-tool-btn compare-btn ${isCompared ? 'active' : ''}" data-id="${product.id}" title="Compare Specs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isCompared ? '#00e676' : 'currentColor'}" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // Default Grid Card
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="card-top-actions">
            <div class="card-badges-stack">
              ${product.badge ? `<span class="badge-ribbon">${product.badge}</span>` : ''}
              ${discountPct > 0 ? `<span class="discount-save-pill">-${discountPct}%</span>` : ''}
            </div>
            <div class="card-icon-tools">
              <button class="icon-tool-btn compare-btn ${isCompared ? 'active' : ''}" data-id="${product.id}" title="Compare Habitat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isCompared ? '#00e676' : 'currentColor'}" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </button>
              <button class="icon-tool-btn wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="Save to Favorites">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#ff4081' : 'none'}" stroke="${isWishlisted ? '#ff4081' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>

          <div class="card-visual-wrapper" data-action="view">
            ${renderProductVisual(product.svgType, product.id, { height: '220px' })}
            <div class="card-quick-overlay">
              <span>Quick View Specs</span>
            </div>
          </div>

          <div class="card-content">
            <div class="card-meta-row">
              <span class="card-category">${product.category.toUpperCase()}</span>
              <div class="card-rating">
                <span class="star-icon">★</span>
                <span>${product.rating}</span>
                <small>(${product.reviewCount})</small>
              </div>
            </div>

            <h3 class="card-title" data-action="view">${product.name}</h3>
            <p class="card-tagline">${product.tagline}</p>

            <div class="card-urgency-row">
              ${stockBadge}
              <span class="delivery-city-note">Free Delivery</span>
            </div>

            <div class="card-specs-row">
              <span class="spec-pill">📐 ${product.dimensions.inches}</span>
              ${product.acrylicThickness ? `<span class="spec-pill">💎 ${product.acrylicThickness.split(' ')[0]}</span>` : ''}
            </div>

            <div class="card-footer-row">
              <div class="card-price-col">
                <span class="card-price">${formatPrice(product.price)}</span>
                ${product.compareAtPrice ? `<del class="card-compare-price">${formatPrice(product.compareAtPrice)}</del>` : ''}
              </div>

              <button class="btn btn-primary btn-sm add-cart-btn" data-id="${product.id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind card interactive events
    pCont.querySelectorAll('.product-card, .product-list-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.add-cart-btn') || e.target.closest('.icon-tool-btn') || e.target.closest('.list-btn-group')) {
          return;
        }
        const id = card.dataset.id;
        const product = this.products.find(p => p.id === id) || PRODUCTS.find(p => p.id === id);
        if (product) this.onProductSelect(product);
      });
    });

    // Interactive 3D tilt effect on mouse movement for grid cards (desktop fine pointer only)
    pCont.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });

    // Add to cart buttons with micro-interaction
    pCont.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const product = this.products.find(p => p.id === id) || PRODUCTS.find(p => p.id === id);
        if (product) {
          cartState.add({
            id: product.id,
            name: product.name,
            price: product.price,
            variant: product.lidVariants ? product.lidVariants[0].name : 'Standard',
            quantity: 1,
            type: product.svgType
          });

          // Visual micro-feedback
          const originalText = btn.innerHTML;
          btn.classList.add('btn-added-state');
          btn.innerHTML = `<span>✓ Added!</span>`;
          setTimeout(() => {
            btn.classList.remove('btn-added-state');
            btn.innerHTML = originalText;
          }, 1200);

          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { message: `Added ${product.name} to cart!` }
          }));
        }
      });
    });

    // Wishlist buttons
    pCont.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const added = wishlistState.toggle(id);
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: added ? 'Added to wishlist ❤️' : 'Removed from wishlist' }
        }));
      });
    });

    // Compare buttons
    pCont.querySelectorAll('.compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const added = compareState.toggle(id);
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: added ? 'Added to enclosure comparison' : 'Removed from comparison' }
        }));
      });
    });
  }
}
