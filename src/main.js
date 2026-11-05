// Aracribs - Main Application Orchestrator
import './style.css';
import { PRODUCTS, CURRENCIES, REVIEWS, INSTAGRAM_POSTS } from './data/products.js';
import { CARE_GUIDES } from './data/guides.js';
import { cartState, wishlistState, compareState, themeState, userState } from './utils/storage.js';
import { formatPrice } from './utils/currency.js';
import { renderProductVisual } from './utils/productVisuals.js';
import { EnclosureVisualizer } from './components/visualizer.js';
import { CribQuiz } from './components/quiz.js';
import { ProductCatalog } from './components/catalog.js';
import { ProductModal } from './components/productModal.js';
import { CartDrawer } from './components/cartDrawer.js';
import { CheckoutModal } from './components/checkoutModal.js';
import { CompareDrawer } from './components/compareDrawer.js';
import { WishlistDrawer } from './components/wishlistDrawer.js';
import { SearchModal } from './components/searchModal.js';
import { GuidesModal } from './components/guidesModal.js';
import { AuthModal } from './components/authModal.js';
import { AdminDashboard } from './components/adminDashboard.js';

class AracribsApp {
  constructor() {
    this.appEl = document.getElementById('app');
    this.initTheme();
    this.renderSkeleton();
    this.initComponents();
    this.bindGlobalEvents();
    this.initToastListener();
    this.initMarathonCountdown();
    this.initCyberHeroCanvas();
    this.initLiveSupport();
  }

  initTheme() {
    const saved = themeState.get();
    document.documentElement.setAttribute('data-theme', saved);
  }

  renderSkeleton() {
    this.appEl.innerHTML = `
      <!-- Toast Notification Container -->
      <div id="toastContainer" class="toast-container" aria-live="polite"></div>

      <!-- Top Announcement Bar -->
      <div class="announcement-bar">
        <div class="announcement-content">
          <span class="announcement-pill">🇮🇳 ALL-INDIA DISPATCH</span>
          <span class="announcement-text">Free Insured Courier Shipping on Orders Over <strong>₹2,500</strong> • Code: <strong>CRIB10</strong> (10% Off) • UPI, Cards & COD</span>
        </div>
        <div class="announcement-right">
          <span class="inr-currency-pill">🇮🇳 INR (₹)</span>
          <a href="#guides" class="announcement-link">Husbandry Guides</a>
          <button id="wholesaleTriggerBtn" class="announcement-link btn-link-text">Wholesale B2B</button>
          <button id="topBarLoginBtn" class="top-auth-link">
            <span class="top-auth-icon">🔑</span>
            <span id="topAuthLabel">Login / Sign Up</span>
          </button>
        </div>
      </div>

      <!-- Main Sticky Navigation Header -->
      <header class="site-header" id="siteHeader">
        <div class="header-container">
          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" id="mobileMenuBtn" aria-label="Toggle navigation menu">
            <span></span><span></span><span></span>
          </button>

          <!-- Brand Logo -->
          <a href="#" class="brand-logo" id="brandLogoLink">
            <div class="logo-mark">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v4a4 4 0 0 0 8 0v-4h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="10" cy="7" r="1" fill="#00e676"/><circle cx="14" cy="7" r="1" fill="#00e676"/></svg>
            </div>
            <div class="logo-text-group">
              <span class="brand-name">ARACRIBS</span>
              <span class="brand-tagline">PRECISION ACRYLIC HABITATS</span>
            </div>
          </a>

          <!-- Main Desktop Nav -->
          <nav class="main-nav" id="mainNav">
            <a href="#catalog" class="nav-link active" data-nav="catalog">Enclosures</a>
            <a href="#catalog" class="nav-link" data-category="terrestrial">Terrestrial</a>
            <a href="#catalog" class="nav-link" data-category="arboreal">Arboreal</a>
            <a href="#catalog" class="nav-link" data-category="substrate">Arachnidirt™</a>
            <a href="#cribQuizSection" class="nav-link quiz-highlight-nav">
              <span class="quiz-nav-icon">🎯</span>
              <span>Crib Finder Quiz</span>
            </a>
            <a href="#visualizerSection" class="nav-link">3D Studio</a>
            <a href="#guides" class="nav-link">Care Guides</a>
          </nav>

          <!-- Header Tools / Actions -->
          <div class="header-actions">
            <!-- Search Button -->
            <button class="header-btn" id="headerSearchBtn" title="Search catalog (Ctrl+K)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>

            <!-- Theme Toggle Button -->
            <button class="header-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode">
              <span class="theme-icon-dark">🌙</span>
              <span class="theme-icon-light">☀️</span>
            </button>

            <!-- Compare Button -->
            <button class="header-btn compare-header-btn" id="headerCompareBtn" title="Compare Enclosures">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span class="badge-count" id="compareBadgeCount">0</span>
            </button>

            <!-- Wishlist Button -->
            <button class="header-btn wishlist-header-btn" id="headerWishlistBtn" title="Favorites">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span class="badge-count" id="wishlistBadgeCount">0</span>
            </button>

            <!-- Prominent E-Commerce Login / Sign Up Action Button -->
            <button class="header-auth-pill" id="headerAuthBtn" title="Account / Profile">
              <div class="user-avatar-dot" id="headerAuthAvatar">👤</div>
              <div class="user-auth-meta">
                <span class="auth-greeting" id="headerAuthGreeting">Hello, Sign In</span>
                <strong class="auth-name" id="headerAuthLabel">Login / Sign Up</strong>
              </div>
            </button>

            <!-- Cart Trigger Button -->
            <button class="btn btn-primary cart-trigger-btn" id="headerCartBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span>Cart</span>
              <span class="cart-pill-count" id="cartPillCount">0</span>
            </button>
          </div>
        </div>
      </header>

      <!-- JAWS SONIC 2026 — THE MARATHON Kinetic Infinite Running Tape -->
      <div class="sonic-marquee-strip">
        <div class="sonic-marquee-track">
          <div class="sonic-marquee-content">
            <span class="sonic-item"><span class="sonic-neon">★ 2026 PRECISION HABITATS MARATHON</span> • 24HR SPEED DISPATCH</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> 100% CAST OPTICAL ACRYLIC • ZERO DISTORTION</span>
            <span class="sonic-item"><span class="sonic-neon">★</span> ESCAPE-PROOF N52 NEODYMIUM MAGNETIC DETENTS</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> FREE INSURED TRANSIT ACROSS INDIA OVER ₹2,500</span>
            <span class="sonic-item"><span class="sonic-neon">★</span> CODE: <strong class="code-hl">CRIB10</strong> FOR 10% OFF</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> 1.8MM LASER CROSS-FLOW AIR VENTILATION</span>
          </div>
          <div class="sonic-marquee-content" aria-hidden="true">
            <span class="sonic-item"><span class="sonic-neon">★ 2026 PRECISION HABITATS MARATHON</span> • 24HR SPEED DISPATCH</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> 100% CAST OPTICAL ACRYLIC • ZERO DISTORTION</span>
            <span class="sonic-item"><span class="sonic-neon">★</span> ESCAPE-PROOF N52 NEODYMIUM MAGNETIC DETENTS</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> FREE INSURED TRANSIT ACROSS INDIA OVER ₹2,500</span>
            <span class="sonic-item"><span class="sonic-neon">★</span> CODE: <strong class="code-hl">CRIB10</strong> FOR 10% OFF</span>
            <span class="sonic-item"><span class="sonic-bolt">⚡</span> 1.8MM LASER CROSS-FLOW AIR VENTILATION</span>
          </div>
        </div>
      </div>

      <!-- Main Body Container -->
      <main class="site-main">
        <!-- Hero Section with Cyber Particles Canvas -->
        <section class="hero-section">
          <!-- Cyber Canvas Background -->
          <canvas id="heroCyberCanvas" class="hero-cyber-canvas"></canvas>
          <div class="hero-backdrop-glow"></div>

          <!-- Marathon Flash Sale Live Countdown Banner -->
          <div class="marathon-countdown-banner">
            <div class="marathon-badge">
              <span class="fire-icon">🔥</span>
              <span>2026 KEEPER MARATHON DROP</span>
            </div>
            <span class="marathon-tagline">Special Batch: Up to 25% Off Habitat Bundles with Code <strong>CRIB10</strong></span>
            <div class="marathon-timer" id="marathonCountdown">
              <div class="timer-unit"><strong id="cdHours">08</strong><span>HRS</span></div>
              <span class="timer-colon">:</span>
              <div class="timer-unit"><strong id="cdMins">44</strong><span>MIN</span></div>
              <span class="timer-colon">:</span>
              <div class="timer-unit"><strong id="cdSecs" class="pulse-sec">32</strong><span>SEC</span></div>
            </div>
          </div>

          <div class="hero-container">
            <div class="hero-content">
              <div class="hero-badge">
                <span class="badge-dot"></span>
                <span>THE 2026 GOLD STANDARD IN ARACHNID HOUSING</span>
              </div>
              <h1 class="hero-title">
                Engineered For Invertebrates.<br>
                <span class="gradient-text sonic-glow-text">Designed For High-Performance Keepers.</span>
              </h1>
              <p class="hero-subtitle">
                Museum-grade 100% cast acrylic, escape-proof N52 magnetic closures, and precision cross-flow ventilation. Optimal welfare, zero optical distortion for your exotic companions.
              </p>

              <div class="hero-cta-group">
                <a href="#catalog" class="btn btn-primary btn-lg" id="heroShopBtn">
                  <span>Explore Habitats</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
                <a href="#cribQuizSection" class="btn btn-outline btn-lg" id="heroQuizBtn">
                  <span>Find Your Crib Quiz</span>
                </a>
                <a href="#visualizerSection" class="hero-link-btn">
                  <span>Launch 3D Studio →</span>
                </a>
              </div>

              <!-- Engineering Trust Indicators -->
              <div class="hero-trust-grid">
                <div class="trust-stat">
                  <strong>100%</strong>
                  <span>Cast Optical Acrylic</span>
                </div>
                <div class="trust-stat">
                  <strong>N52</strong>
                  <span>Neodymium Latches</span>
                </div>
                <div class="trust-stat">
                  <strong>1.8mm</strong>
                  <span>Laser Cross-Flow</span>
                </div>
                <div class="trust-stat">
                  <strong>15,000+</strong>
                  <span>Keepers Worldwide</span>
                </div>
              </div>
            </div>

            <!-- Hero Feature Product Card with Floating Holographic Specs -->
            <div class="hero-visual-col">
              <div class="hero-visual-card">
                <div class="card-glow-pulse"></div>

                <!-- Floating Holographic Specs (JAWS SONIC Cyber Style) -->
                <div class="hero-float-chip chip-top-left">
                  <span class="chip-icon">💎</span>
                  <div>
                    <strong>99.8% Cast Clarity</strong>
                    <small>Zero distortion</small>
                  </div>
                </div>

                <div class="hero-float-chip chip-bottom-right">
                  <span class="chip-icon">🧲</span>
                  <div>
                    <strong>N52 Neodymium</strong>
                    <small>Push-Proof Latch</small>
                  </div>
                </div>

                <div class="hero-float-chip chip-bottom-left">
                  <span class="chip-icon">🛡️</span>
                  <div>
                    <strong>Transit Safe</strong>
                    <small>Zero-Crack Guarantee</small>
                  </div>
                </div>

                <div class="hero-rendered-visual">
                  ${renderProductVisual('arboreal', 'hero-arboreal', { height: '360px' })}
                </div>
                <div class="hero-card-meta">
                  <div class="hero-card-header">
                    <div>
                      <span class="hero-card-tag">NEW GENERATION PRO</span>
                      <h3 class="hero-card-title">Treehouse Switch Pro 668</h3>
                    </div>
                    <span class="hero-card-price">${formatPrice(4999)}</span>
                  </div>
                  <div class="hero-card-actions">
                    <button class="btn btn-primary btn-sm hero-quick-add" data-id="treehouse-pro-668">Quick Add</button>
                    <button class="btn btn-outline btn-sm hero-inspect-btn" data-id="treehouse-pro-668">View Specs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Category Discovery Pill Strip (Amazon / Nike / Flipkart Style) -->
        <section class="quick-category-strip">
          <div class="quick-cat-scroll">
            <button class="quick-cat-pill active" data-category="all">
              <span class="cat-pill-icon">🌟</span>
              <span>All Habitats</span>
            </button>
            <button class="quick-cat-pill" data-category="terrestrial">
              <span class="cat-pill-icon">📦</span>
              <span>Terrestrial Cribs</span>
            </button>
            <button class="quick-cat-pill" data-category="arboreal">
              <span class="cat-pill-icon">🌿</span>
              <span>Arboreal Treehouses</span>
            </button>
            <button class="quick-cat-pill" data-category="fossorial">
              <span class="cat-pill-icon">⛏️</span>
              <span>Deep Burrowers</span>
            </button>
            <button class="quick-cat-pill" data-category="micro">
              <span class="cat-pill-icon">🌱</span>
              <span>Micro Slings</span>
            </button>
            <button class="quick-cat-pill" data-category="substrate">
              <span class="cat-pill-icon">🍃</span>
              <span>Arachnidirt™ Soil</span>
            </button>
            <button class="quick-cat-pill" data-category="bundles">
              <span class="cat-pill-icon">🎁</span>
              <span>Turnkey Bundles</span>
            </button>
            <a href="#cribQuizSection" class="quick-cat-pill quiz-pill">
              <span class="cat-pill-icon">🎯</span>
              <span>Crib Finder Quiz</span>
            </a>
          </div>
        </section>

        <!-- Feature Quality Highlights Bar -->
        <section class="quality-strip-section">
          <div class="quality-strip-container">
            <div class="quality-feature">
              <div class="quality-icon">💎</div>
              <div class="quality-text">
                <strong>Optical Cast Acrylic</strong>
                <span>Higher optical purity than glass with zero green edge distortion.</span>
              </div>
            </div>
            <div class="quality-feature">
              <div class="quality-icon">🧲</div>
              <div class="quality-text">
                <strong>Escape-Proof Magnetic Locks</strong>
                <span>N52 neodymium detents ensure 100% positive, push-proof closures.</span>
              </div>
            </div>
            <div class="quality-feature">
              <div class="quality-icon">🌬️</div>
              <div class="quality-text">
                <strong>Targeted Cross-Ventilation</strong>
                <span>Prevents dangerous stagnant CO2 and mold without drying substrate.</span>
              </div>
            </div>
            <div class="quality-feature">
              <div class="quality-icon">🛡️</div>
              <div class="quality-text">
                <strong>Break-Proof Safe Transit</strong>
                <span>Double-walled foam packaging guaranteed against shipping damage.</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Interactive 3D Visualizer Section -->
        <section class="visualizer-section" id="visualizerSection">
          <div id="visualizerContainer"></div>
        </section>

        <!-- "Find Your Crib" Quiz Section -->
        <section class="quiz-section" id="cribQuizSection">
          <div class="quiz-section-header">
            <span class="section-eyebrow">HABITAT FINDER WIZARD</span>
            <h2 class="section-title">Not Sure Which Crib Is Right For Your Spider?</h2>
            <p class="section-desc">Answer 3 quick questions about your animal's lifestyle, size, and burrowing habits to receive an instant compatible habitat recommendation.</p>
          </div>
          <div id="quizContainer"></div>
        </section>

        <!-- Product Catalog Section (Injected dynamically) -->
        <div id="catalogContainer"></div>

        <!-- Bioactive Ecosystem Showcase Strip -->
        <section class="bioactive-banner-section">
          <div class="bioactive-banner-content">
            <div class="bioactive-badge">PROPRIETARY BIOACTIVE FORMULA</div>
            <h2>Arachnidirt™: The Substrate That Never Collapses</h2>
            <p>Formulated with kaolin structural clay, New Zealand tree fern, and horticultural charcoal. Enables deep multi-level burrowing tunnels that hold their shape indefinitely while actively suppressing mold spores.</p>
            <div class="bioactive-btns">
              <button class="btn btn-accent btn-lg" id="shopArachnidirtBtn">Shop Arachnidirt™ Blends</button>
              <button class="btn btn-outline btn-lg" id="readBioactiveGuideBtn">Read Substrate Guide</button>
            </div>
          </div>
        </section>

        <!-- Customer Reviews Carousel / Grid -->
        <section class="reviews-section">
          <div class="reviews-header">
            <span class="section-eyebrow">TRUSTED BY 15,000+ KEEPERS</span>
            <h2 class="section-title">Keeper Testimonials</h2>
            <div class="overall-rating-pill">
              <span class="stars">★★★★★</span>
              <strong>4.95 Out of 5 Stars</strong>
              <span>(Over 2,400+ Verified Customer Reviews)</span>
            </div>
          </div>

          <div class="reviews-grid">
            ${REVIEWS.map(r => `
              <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <h4 class="review-title">"${r.title}"</h4>
                <p class="review-content">${r.content}</p>
                <div class="review-author-row">
                  <div class="author-avatar">${r.author[0]}</div>
                  <div>
                    <div class="author-name">${r.author}</div>
                    <div class="author-badge">${r.badge} • ${r.productName}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- "Cribs in the Wild" Community Showcase -->
        <section class="community-section">
          <div class="community-header">
            <span class="section-eyebrow">INSTAGRAM SPOTLIGHT</span>
            <h2 class="section-title">Cribs in the Wild: #Aracribs</h2>
            <p class="section-desc">Explore incredible naturalistic and bioactive enclosures built by our creative community.</p>
          </div>

          <div class="community-grid">
            ${INSTAGRAM_POSTS.map(post => `
              <div class="community-card">
                <div class="community-visual">
                  ${renderProductVisual('arboreal', post.handle, { height: '200px' })}
                  <div class="community-overlay">
                    <span class="community-likes">❤️ ${post.likes}</span>
                    <span class="community-tag-link">${post.tags}</span>
                  </div>
                </div>
                <div class="community-meta">
                  <strong>${post.handle}</strong>
                  <small>${post.species}</small>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Husbandry & Care Knowledge Base -->
        <section class="guides-section" id="guides">
          <div class="guides-header">
            <span class="section-eyebrow">HUSBANDRY SCIENCE</span>
            <h2 class="section-title">Arachnid & Invertebrate Care Masterclasses</h2>
            <p class="section-desc">Free educational guides authored by experienced entomology specialists and long-time breeders.</p>
          </div>

          <div class="guides-grid">
            ${CARE_GUIDES.map(guide => `
              <div class="guide-card" data-guide-id="${guide.id}">
                <div class="guide-card-top">
                  <span class="guide-cat-badge">${guide.category}</span>
                  <span class="guide-time">⏱️ ${guide.readTime}</span>
                </div>
                <h3 class="guide-title">${guide.title}</h3>
                <p class="guide-summary">${guide.summary}</p>
                <button class="guide-read-btn" data-guide-id="${guide.id}">
                  Read Full Masterclass →
                </button>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Newsletter & Club Section -->
        <section class="newsletter-section">
          <div class="newsletter-card">
            <div class="newsletter-badge">JOIN THE KEEPER COMMUNITY</div>
            <h2>Unlock 10% Off Your Next Habitat</h2>
            <p>Subscribe to receive early access to limited edition crib drops, care guides, and exclusive breeding discounts.</p>
            
            <form id="newsletterForm" class="newsletter-form">
              <input type="email" id="newsletterEmail" required placeholder="Enter your email address..." class="newsletter-input" />
              <button type="submit" class="btn btn-primary newsletter-btn">Get My ₹500 Voucher</button>
            </form>
            <small class="newsletter-terms">No spam. Only high-value arachnid husbandry releases and discount codes.</small>
          </div>
        </section>
      </main>

      <!-- Site Footer -->
      <footer class="site-footer">
        <div class="footer-container">
          <div class="footer-col brand-col">
            <div class="footer-logo">ARACRIBS</div>
            <p class="footer-about">
              Pioneering high-clarity cast acrylic invertebrate enclosures, engineered cross-ventilation, and bioactive substrates. Designed and tested with leading keepers around the globe.
            </p>
            <div class="social-links-row">
              <a href="https://instagram.com/aracribs" target="_blank" rel="noopener" class="social-icon" title="Instagram">📸</a>
              <a href="#" class="social-icon" title="YouTube">🎥</a>
              <a href="#" class="social-icon" title="Facebook">📘</a>
              <a href="#" class="social-icon" title="Discord">💬</a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Enclosure Collections</h4>
            <ul class="footer-links">
              <li><a href="#catalog" class="footer-filter-link" data-category="terrestrial">Terrestrial Enclosures</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="arboreal">Arboreal Treehouses</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="fossorial">Fossorial Deep Bunkers</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="micro">Sling & Micro Cribs</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="cylinder">360 Panoramic Cylinders</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Bioactive & Supplies</h4>
            <ul class="footer-links">
              <li><a href="#catalog" class="footer-filter-link" data-category="substrate">Arachnidirt™ Substrate</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="decor">Virgin Cork Bark</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="accessories">Magnetic Water Dishes</a></li>
              <li><a href="#catalog" class="footer-filter-link" data-category="bundles">Turnkey Habitat Bundles</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Support & Wholesale</h4>
            <ul class="footer-links">
              <li><a href="#" id="footerWholesaleLink">Wholesale B2B Program</a></li>
              <li><a href="#guides">Husbandry Care Guides</a></li>
              <li><a href="#" id="shippingPolicyBtn">Safe Delivery Guarantee</a></li>
              <li><a href="#" id="contactSupportBtn">Customer Support Helpdesk</a></li>
              <li><a href="#" id="orderHistoryBtn">Simulated Order History</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div class="bottom-container">
            <div class="copyright-text">
              © 2026 Aracribs. All rights reserved. Built for exotic pet welfare.
            </div>
            <div class="payment-badges-row">
              <span class="pay-badge">UPI</span>
              <span class="pay-badge">GPAY</span>
              <span class="pay-badge">PHONEPE</span>
              <span class="pay-badge">PAYTM</span>
              <span class="pay-badge">RUPAY</span>
              <span class="pay-badge">VISA</span>
              <span class="pay-badge">MASTERCARD</span>
              <span class="pay-badge">NETBANKING</span>
              <span class="pay-badge">COD</span>
            </div>
          </div>
        </div>
      </footer>

      <!-- Floating Keeper Live Support Desk (Interactive Chat) -->
      <div class="floating-support-wrap" id="floatingSupportWrap">
        <button class="floating-support-btn" id="liveSupportTrigger" title="Aracribs Keeper Desk">
          <span class="support-avatar-pulse">💬</span>
          <span class="support-btn-text">Keeper Desk <span class="support-online-badge">ONLINE</span></span>
        </button>

        <div class="support-chat-drawer hidden" id="supportChatDrawer">
          <div class="support-drawer-header">
            <div class="drawer-agent-info">
              <span class="agent-avatar">🕷️</span>
              <div>
                <strong>Aracribs Keeper Desk</strong>
                <small><span class="online-indicator"></span> 24/7 Husbandry & Order Assist</small>
              </div>
            </div>
            <button class="drawer-close-btn" id="closeSupportDrawerBtn" aria-label="Close Chat">✕</button>
          </div>
          <div class="support-chat-messages" id="supportChatMessages">
            <div class="chat-msg bot-msg">
              <span class="chat-time">Just now</span>
              <p>Namaste! 🙏 Welcome to Aracribs India. Looking for the best crib size for your tarantula, tracking an order, or need help with acrylic care?</p>
            </div>
          </div>
          <div class="support-quick-replies">
            <button class="quick-reply-pill" data-msg="Which crib is best for an arboreal tarantula?">🌿 Arboreal Crib?</button>
            <button class="quick-reply-pill" data-msg="How does safe courier transit guarantee work?">🛡️ Safe Delivery?</button>
            <button class="quick-reply-pill" data-msg="What payment options do you accept?">💳 UPI & COD?</button>
            <button class="quick-reply-pill" data-msg="How do I access the Store Admin Console?">👑 Admin Portal?</button>
          </div>
          <form class="support-input-bar" id="supportChatForm">
            <input type="text" id="supportChatInput" placeholder="Ask about cribs, humidity, delivery..." autocomplete="off" />
            <button type="submit" class="support-send-btn">Send</button>
          </form>
        </div>
      </div>

      <!-- Modals and Drawers Mounted -->
      <div id="productDetailModal" class="modal-backdrop hidden"></div>
      <div id="cartDrawerContainer" class="cart-drawer-overlay hidden"></div>
      <div id="checkoutModalContainer" class="modal-backdrop hidden"></div>
      <div id="compareDrawerContainer" class="modal-backdrop hidden"></div>
      <div id="wishlistDrawerContainer" class="modal-backdrop hidden"></div>
      <div id="searchModalContainer" class="modal-backdrop hidden"></div>
      <div id="guidesModalContainer" class="modal-backdrop hidden"></div>
      <div id="authModalContainer" class="modal-backdrop hidden"></div>
      <div id="adminDashboardContainer" class="modal-backdrop hidden"></div>
    `;
  }

  initComponents() {
    // 1. Interactive 3D Visualizer
    this.visualizer = new EnclosureVisualizer('visualizerContainer');

    // 2. Crib Quiz
    this.quiz = new CribQuiz('quizContainer');

    // 3. Modals
    this.productModal = new ProductModal();
    this.checkoutModal = new CheckoutModal();
    this.compareDrawer = new CompareDrawer();
    this.wishlistDrawer = new WishlistDrawer((product) => this.productModal.open(product));
    this.guidesModal = new GuidesModal();

    // 4. Cart Drawer
    this.cartDrawer = new CartDrawer(() => {
      this.checkoutModal.open();
    });

    // 5. Search Modal
    this.searchModal = new SearchModal(
      (product) => this.productModal.open(product),
      (guide) => this.guidesModal.open(guide)
    );

    // 6. Product Catalog
    this.catalog = new ProductCatalog('catalogContainer', (product) => {
      this.productModal.open(product);
    });

    // 7. Auth Modal & Admin Dashboard
    this.adminDashboard = new AdminDashboard();
    this.authModal = new AuthModal(
      () => this.adminDashboard.open(),
      () => this.wishlistDrawer.open()
    );

    // Update counters and auth status on load
    this.updateCounters();
    this.updateAuthUI();

    // Separate Link Admin Routing (Accessed via #admin, /admin, admin.html)
    this.initAdminRouting();
  }

  initAdminRouting() {
    const handleAdminRoute = () => {
      const isRouteAdmin = window.location.hash === '#admin' || 
                           window.location.pathname.replace(/\/$/, '') === '/admin' ||
                           window.location.pathname.endsWith('/admin.html') ||
                           new URLSearchParams(window.location.search).get('panel') === 'admin';

      if (isRouteAdmin) {
        if (userState.isAdmin()) {
          this.adminDashboard.open();
        } else {
          this.triggerToast('👑 Admin Portal: Administrator sign-in required');
          this.authModal.open('login', { adminOnly: true, autoOpenAdminOnSuccess: true });
        }
      }
    };

    // Check on initial page load
    setTimeout(handleAdminRoute, 120);

    // Listen for URL hash changes (#admin)
    window.addEventListener('hashchange', handleAdminRoute);
  }

  bindGlobalEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = themeState.get();
        const next = cur === 'dark' ? 'light' : 'dark';
        themeState.set(next);
      });
    }

    // Header Cart trigger
    const headerCartBtn = document.getElementById('headerCartBtn');
    if (headerCartBtn) {
      headerCartBtn.addEventListener('click', () => {
        this.cartDrawer.open();
      });
    }

    // Header Wishlist trigger
    const headerWishBtn = document.getElementById('headerWishlistBtn');
    if (headerWishBtn) {
      headerWishBtn.addEventListener('click', () => {
        this.wishlistDrawer.open();
      });
    }

    // Header Compare trigger
    const headerCompBtn = document.getElementById('headerCompareBtn');
    if (headerCompBtn) {
      headerCompBtn.addEventListener('click', () => {
        this.compareDrawer.open();
      });
    }

    // Header Search trigger
    const searchBtn = document.getElementById('headerSearchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.searchModal.open();
      });
    }

    // Ctrl+K keyboard shortcut for search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.searchModal.open();
      }
    });

    // Category links in nav
    document.querySelectorAll('[data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.category;
        this.catalog.setCategory(cat);
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Hero quick add
    document.querySelectorAll('.hero-quick-add').forEach(btn => {
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
          this.triggerToast(`Added ${product.name} to cart!`);
        }
      });
    });

    // Hero inspect
    document.querySelectorAll('.hero-inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = PRODUCTS.find(p => p.id === btn.dataset.id);
        if (product) this.productModal.open(product);
      });
    });

    // Bioactive banner buttons
    const shopArachnidirtBtn = document.getElementById('shopArachnidirtBtn');
    if (shopArachnidirtBtn) {
      shopArachnidirtBtn.addEventListener('click', () => {
        this.catalog.setCategory('substrate');
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const readBioactiveGuideBtn = document.getElementById('readBioactiveGuideBtn');
    if (readBioactiveGuideBtn) {
      readBioactiveGuideBtn.addEventListener('click', () => {
        const guide = CARE_GUIDES.find(g => g.id === 'bioactive-setup-guide');
        if (guide) this.guidesModal.open(guide);
      });
    }

    // Husbandry guide cards click
    document.querySelectorAll('.guide-card, .guide-read-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        const guideId = el.dataset.guideId;
        const guide = CARE_GUIDES.find(g => g.id === guideId);
        if (guide) this.guidesModal.open(guide);
      });
    });

    // Newsletter form
    const newsForm = document.getElementById('newsletterForm');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletterEmail');
        if (input && input.value) {
          this.triggerToast(`Welcome to the Crib Club! Use code CRIB10 for 10% off.`);
          input.value = '';
        }
      });
    }

    // Wholesale B2B button
    const wholesaleBtns = [
      document.getElementById('wholesaleTriggerBtn'),
      document.getElementById('footerWholesaleLink')
    ];
    wholesaleBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.triggerToast('Wholesale Portal: Contact wholesale@aracribs.com for tiered carton pricing!');
        });
      }
    });

    // Mobile menu toggle
    const mobBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    if (mobBtn && mainNav) {
      mobBtn.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-open');
        mobBtn.classList.toggle('open');
      });
    }

    // Reactive counter updates
    window.addEventListener('cart:updated', () => this.updateCounters());
    window.addEventListener('wishlist:updated', () => this.updateCounters());
    window.addEventListener('compare:updated', () => this.updateCounters());

    // Top bar login button
    const topBarLoginBtn = document.getElementById('topBarLoginBtn');
    if (topBarLoginBtn) {
      topBarLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.authModal.open();
      });
    }

    // Quick category discovery pills
    document.querySelectorAll('.quick-cat-pill[data-category]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.quick-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.category;
        this.catalog.setCategory(cat);
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Hero Shop button smooth scroll
    const heroShopBtn = document.getElementById('heroShopBtn');
    if (heroShopBtn) {
      heroShopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Customer Auth trigger
    const headerAuthBtn = document.getElementById('headerAuthBtn');
    if (headerAuthBtn) {
      headerAuthBtn.addEventListener('click', () => {
        this.authModal.open();
      });
    }

    const orderHistoryBtn = document.getElementById('orderHistoryBtn');
    if (orderHistoryBtn) {
      orderHistoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.authModal.open(userState.isLoggedIn() ? 'profile' : 'login');
      });
    }

    // Auth state changed listener
    window.addEventListener('auth:updated', () => {
      this.updateAuthUI();
    });

    // Catalog refreshed by Admin (when adding or modifying products)
    window.addEventListener('catalog:refresh', () => {
      if (this.catalog) {
        this.catalog.updateProductList();
      }
    });
  }

  updateAuthUI() {
    const user = userState.get();
    const authLabel = document.getElementById('headerAuthLabel');
    const authGreeting = document.getElementById('headerAuthGreeting');
    const authAvatar = document.getElementById('headerAuthAvatar');
    const topAuthLabel = document.getElementById('topAuthLabel');

    if (user) {
      const firstName = user.name ? user.name.split(' ')[0] : 'Member';
      if (authLabel) authLabel.textContent = firstName;
      if (authGreeting) authGreeting.textContent = user.role === 'admin' ? '👑 Admin' : '👋 Welcome';
      if (authAvatar) authAvatar.textContent = user.role === 'admin' ? '👑' : (user.name ? user.name[0].toUpperCase() : '👤');
      if (topAuthLabel) topAuthLabel.textContent = `Hi, ${firstName} (${user.role === 'admin' ? 'Admin' : 'Account'})`;
    } else {
      if (authLabel) authLabel.textContent = 'Login / Sign Up';
      if (authGreeting) authGreeting.textContent = 'Hello, Sign In';
      if (authAvatar) authAvatar.textContent = '👤';
      if (topAuthLabel) topAuthLabel.textContent = 'Login / Sign Up';
    }
  }

  initMarathonCountdown() {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = Math.max(0, midnight - now);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const hEl = document.getElementById('cdHours');
      const mEl = document.getElementById('cdMins');
      const sEl = document.getElementById('cdSecs');

      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  }

  initCyberHeroCanvas() {
    const canvas = document.getElementById('heroCyberCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(65, Math.floor((width * height) / 14000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.4 ? '#00e676' : '#00e5ff',
          baseAlpha: Math.random() * 0.5 + 0.2
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle cyber grid lines
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00e676';
            ctx.globalAlpha = (1 - dist / 110) * 0.18;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);
    };

    animate();
  }

  initLiveSupport() {
    const trigger = document.getElementById('liveSupportTrigger');
    const drawer = document.getElementById('supportChatDrawer');
    const closeBtn = document.getElementById('closeSupportDrawerBtn');
    const form = document.getElementById('supportChatForm');
    const input = document.getElementById('supportChatInput');
    const msgContainer = document.getElementById('supportChatMessages');

    if (!trigger || !drawer) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer.classList.toggle('hidden');
      if (!drawer.classList.contains('hidden') && input) {
        input.focus();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        drawer.classList.add('hidden');
      });
    }

    // Close on click outside the floating support widget
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('hidden')) {
        const wrap = document.getElementById('floatingSupportWrap');
        if (wrap && !wrap.contains(e.target)) {
          drawer.classList.add('hidden');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
        drawer.classList.add('hidden');
      }
    });

    document.querySelectorAll('.quick-reply-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.msg;
        this.handleSupportUserQuery(query, msgContainer);
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input ? input.value.trim() : '';
        if (!text) return;
        if (input) input.value = '';
        this.handleSupportUserQuery(text, msgContainer);
      });
    }
  }

  handleSupportUserQuery(text, msgContainer) {
    if (!msgContainer) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user-msg';
    userDiv.innerHTML = `
      <span class="chat-time">Just now</span>
      <p>${text}</p>
    `;
    msgContainer.appendChild(userDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot-msg typing-msg';
    typingDiv.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();

      let reply = "Our expert keepers are here to assist! You can explore our precision acrylic habitats above, test our 3D Studio, or email us at support@aracribs.com.";
      const lower = text.toLowerCase();

      if (lower.includes('arboreal') || lower.includes('tree') || lower.includes('avicularia') || lower.includes('poecilotheria')) {
        reply = "For arboreal species like *Caribena versicolor* or *Poecilotheria*, we strongly recommend our **Treehouse Switch Pro 668** (₹4,999) or **Tower 448** (₹3,899). They feature tall vertical flight room, top-tier cross-flow ventilation to eliminate stagnant air, and magnetic front drop doors that won't ruin webbing!";
      } else if (lower.includes('terrestrial') || lower.includes('sling') || lower.includes('small') || lower.includes('baby')) {
        reply = "For spiderlings and terrestrial species (*Brachypelma*, *Grammostola*), check out our **Micro Sling Cube 333** (₹1,499) and **Crib Flat Top 888** (₹5,499). Their deep substrate dams allow natural burrowing while keeping the lock securely above substrate level.";
      } else if (lower.includes('transit') || lower.includes('delivery') || lower.includes('safe') || lower.includes('break') || lower.includes('courier')) {
        reply = "We provide a **100% Break-Free Safe Transit Guarantee** across all Indian pin codes! Every acrylic enclosure is wrapped in precision PE foam and heavy-duty double-walled cartons. In the rare event of transit damage, we ship an immediate zero-cost replacement within 24 hours.";
      } else if (lower.includes('upi') || lower.includes('payment') || lower.includes('cod') || lower.includes('card')) {
        reply = "We accept all major Indian payment options: **UPI** (Google Pay, PhonePe, Paytm, BHIM with instant zero-fee QR), **RuPay, Visa, MasterCard**, Netbanking across 40+ banks, and **Cash on Delivery (COD)** with ₹99 courier handling.";
      } else if (lower.includes('admin') || lower.includes('login') || lower.includes('console')) {
        reply = "Store administrators can manage catalog pricing, inventory stock, and track customer shipments directly via the **Admin Portal** at `/admin` or `#admin`. Sign in with `admin@aracribs.com` / `admin123`.";
      }

      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot-msg';
      botDiv.innerHTML = `
        <span class="chat-time">Just now</span>
        <p>${reply}</p>
      `;
      msgContainer.appendChild(botDiv);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600);
  }

  updateCounters() {
    const cartCount = cartState.count();
    const wishCount = wishlistState.get().length;
    const compCount = compareState.get().length;

    const cartPill = document.getElementById('cartPillCount');
    const wishPill = document.getElementById('wishlistBadgeCount');
    const compPill = document.getElementById('compareBadgeCount');

    if (cartPill) cartPill.textContent = cartCount;
    if (wishPill) {
      wishPill.textContent = wishCount;
      wishPill.style.display = wishCount > 0 ? 'inline-flex' : 'none';
    }
    if (compPill) {
      compPill.textContent = compCount;
      compPill.style.display = compCount > 0 ? 'inline-flex' : 'none';
    }
  }

  initToastListener() {
    window.addEventListener('toast:show', (e) => {
      if (e.detail && e.detail.message) {
        this.triggerToast(e.detail.message);
      }
    });
  }

  triggerToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerHTML = `
      <div class="toast-dot"></div>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 20);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Start Application on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AracribsApp();
  });
} else {
  new AracribsApp();
}
