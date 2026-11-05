// Aracribs - "Find Your Crib" Interactive Habitat Finder Engine
import { PRODUCTS } from '../data/products.js';
import { cartState } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';
import { renderProductVisual } from '../utils/productVisuals.js';

export class CribQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentStep = 1;
    this.answers = {
      lifestyle: null,
      size: null,
      priority: null
    };

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (this.currentStep <= 3) {
      this.renderQuestionStep();
    } else {
      this.renderResultStep();
    }
  }

  renderQuestionStep() {
    let questionTitle = '';
    let questionDesc = '';
    let options = [];

    if (this.currentStep === 1) {
      questionTitle = 'Step 1: What is your animal’s natural habitat lifestyle?';
      questionDesc = 'Matching the natural vertical or horizontal lifestyle prevents stress and fatal abdominal fall injuries.';
      options = [
        {
          key: 'arboreal',
          icon: '🌿',
          title: 'Arboreal (Tree Dweller)',
          desc: 'Climbing species that construct aerial web retreats in tree canopies (e.g. Pink Toe, Versicolor, Psalmopoeus).'
        },
        {
          key: 'terrestrial',
          icon: '🪨',
          title: 'Terrestrial (Ground Dweller)',
          desc: 'Surface roaming species that explore open soil and need broad floor space (e.g. Red Knee, Brazilian Black, GBB).'
        },
        {
          key: 'fossorial',
          icon: '⛏️',
          title: 'Fossorial (Obligate Burrower)',
          desc: 'Subterranean species that engineer deep multi-level underground tunnel systems (e.g. King Baboon, Cobalt Blue).'
        },
        {
          key: 'jumper',
          icon: '🕷️',
          title: 'Jumping Spider or Micro Sling',
          desc: 'Curious acrobatic jumpers or baby spiderlings under 1 inch requiring micro-mesh escape-proofing.'
        }
      ];
    } else if (this.currentStep === 2) {
      questionTitle = 'Step 2: What is your pet’s current life stage & size?';
      questionDesc = 'Enclosures that are too large make feeding difficult; enclosures that are too small stunt natural growth.';
      options = [
        {
          key: 'sling',
          icon: '🌱',
          title: 'Spiderling / Sling (< 1.25" Legspan)',
          desc: 'Tiny babies and early instars requiring escape-proof micro pinhole venting for fruit flies.'
        },
        {
          key: 'juvenile',
          icon: '🪴',
          title: 'Juvenile / Sub-Adult (1.5" - 3.5")',
          desc: 'Fast-growing adolescents requiring comfortable space for molting and active hunting.'
        },
        {
          key: 'adult',
          icon: '🌳',
          title: 'Mature Adult (4" to 8"+ Legspan)',
          desc: 'Full-grown display specimens requiring maximum living volume and heavy bioactive substrate.'
        }
      ];
    } else if (this.currentStep === 3) {
      questionTitle = 'Step 3: What is your #1 enclosure priority?';
      questionDesc = 'Tailoring the mechanical lid design to your feeding routine.';
      options = [
        {
          key: 'front_door',
          icon: '🚪',
          title: 'Zero Web Destruction (Front Door)',
          desc: 'Side/front magnetic switch door so upper canopy web hammocks are never ripped during feeding.'
        },
        {
          key: 'smooth_slide',
          icon: '🧈',
          title: 'Vibration-Free Top Sliding Lid',
          desc: 'Silky smooth slide tracks that prevent sudden vibrations from startling skittish ground spiders.'
        },
        {
          key: 'deep_dirt',
          icon: '🏔️',
          title: 'Maximum Substrate Depth',
          desc: 'Extra-deep reservoir well capable of holding 4 to 8 inches of packable burrowing soil.'
        },
        {
          key: 'panoramic',
          icon: '🔮',
          title: '360° Panoramic Viewing',
          desc: 'Faceted crystal geometry for maximum visibility on a desktop display.'
        }
      ];
    }

    this.container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${(this.currentStep / 3) * 100}%"></div>
        </div>

        <div class="quiz-header">
          <span class="quiz-step-tag">QUESTION ${this.currentStep} OF 3</span>
          <h3 class="quiz-title">${questionTitle}</h3>
          <p class="quiz-desc">${questionDesc}</p>
        </div>

        <div class="quiz-options-grid">
          ${options.map(opt => `
            <button class="quiz-opt-btn" data-key="${opt.key}">
              <div class="opt-icon">${opt.icon}</div>
              <div class="opt-content">
                <div class="opt-title">${opt.title}</div>
                <div class="opt-desc">${opt.desc}</div>
              </div>
            </button>
          `).join('')}
        </div>

        ${this.currentStep > 1 ? `
          <div class="quiz-footer">
            <button class="btn btn-outline quiz-back-btn" id="quizBackBtn">
              ← Previous Question
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Bind option click
    this.container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (this.currentStep === 1) this.answers.lifestyle = key;
        else if (this.currentStep === 2) this.answers.size = key;
        else if (this.currentStep === 3) this.answers.priority = key;

        this.currentStep++;
        this.render();
      });
    });

    const backBtn = document.getElementById('quizBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.currentStep--;
        this.render();
      });
    }
  }

  calculateRecommendation() {
    const { lifestyle, size, priority } = this.answers;

    if (size === 'sling' || lifestyle === 'jumper') {
      if (lifestyle === 'jumper' && size !== 'sling') {
        return {
          productId: 'treehouse-switch-446',
          reason: 'The Treehouse Switch 446 features a front magnetic door that preserves upper web retreats built by jumping spiders.'
        };
      }
      return {
        productId: 'og-sling-crib-223',
        reason: 'The OG Sling Crib features 0.8mm micro-pin laser holes that keep fruit flies inside while providing safe nursery airflow.'
      };
    }

    if (lifestyle === 'arboreal') {
      if (size === 'adult') {
        return {
          productId: 'treehouse-pro-668',
          reason: 'The 668 Pro provides an 8" vertical column essential for adult tree-dwellers and mature Avicularia / Poecilotheria.'
        };
      }
      return {
        productId: 'treehouse-switch-446',
        reason: 'The Switch 446 gives juvenile climbing spiders safe vertical height with front magnetic door access.'
      };
    }

    if (lifestyle === 'fossorial' || priority === 'deep_dirt') {
      return {
        productId: 'fossorial-bunker-8410',
        reason: 'Features 7.5" of subterranean vertical depth so your obligate burrower can construct stable multi-chambered tunnels.'
      };
    }

    if (size === 'adult') {
      if (priority === 'smooth_slide') {
        return {
          productId: 'slider-crib-pro-866',
          reason: 'The Slider Crib Pro 866 has vibration-free sliding lid detents and a 3" substrate well perfect for heavy ground dwellers.'
        };
      }
      return {
        productId: 'cuboid-series-976',
        reason: 'Broad 9x7 footprint with flush 8-point magnetic snap lid gives adult terrestrial foragers maximum walking room.'
      };
    }

    // Default terrestrial
    return {
      productId: 'slider-crib-pro-866',
      reason: 'The worldwide gold-standard terrestrial enclosure with magnetic safety stop and deep substrate well.'
    };
  }

  renderResultStep() {
    const { productId, reason } = this.calculateRecommendation();
    const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
    const substrate = PRODUCTS.find(p => p.id === 'arachnidirt-original-4qt');
    const cork = PRODUCTS.find(p => p.id === 'virgin-cork-bark-round-6in');

    const bundleTotal = product.price + (substrate ? substrate.price : 899) + (cork ? cork.price : 1199);
    const discountedBundle = Math.round(bundleTotal * 0.85); // 15% quiz bundle savings

    this.container.innerHTML = `
      <div class="quiz-card quiz-result-card">
        <div class="result-celebration-banner">
          <span class="result-badge">MATCH FOUND (100% COMPATIBLE)</span>
          <h2 class="result-heading">Your Ideal Match: ${product.name}</h2>
          <p class="result-reason">"${reason}"</p>
        </div>

        <div class="result-body-grid">
          <!-- Main Product Card -->
          <div class="result-product-col">
            <div class="result-visual-box">
              ${renderProductVisual(product.svgType, product.id, { height: '240px' })}
            </div>
            <div class="result-meta">
              <div class="result-tags">
                <span class="tag-pill">${product.acrylicThickness}</span>
                <span class="tag-pill">${product.dimensions.inches}</span>
                <span class="tag-pill">${product.lidStyle}</span>
              </div>
              <div class="result-price-row">
                <span class="result-price">${formatPrice(product.price)}</span>
                <button class="btn btn-primary" id="quizAddSingleBtn">Add Enclosure Only</button>
              </div>
            </div>
          </div>

          <!-- Recommended Bioactive Habitat Bundle (Save 15%) -->
          <div class="result-bundle-col">
            <div class="bundle-col-header">
              <span class="save-tag">SAVE 15% ON RECOMMENDED BUNDLE</span>
              <h4>Complete Turnkey Starter Kit</h4>
              <p>Everything needed to build this setup in one shipment:</p>
            </div>

            <ul class="bundle-items-list">
              <li>
                <span class="check-icon">✓</span>
                <span><strong>1x ${product.name}</strong> (${formatPrice(product.price)})</span>
              </li>
              <li>
                <span class="check-icon">✓</span>
                <span><strong>1x Arachnidirt™ 4-Quart Substrate</strong> (${formatPrice(substrate ? substrate.price : 10.99)})</span>
              </li>
              <li>
                <span class="check-icon">✓</span>
                <span><strong>1x Natural Virgin Cork Bark Hide</strong> (${formatPrice(cork ? cork.price : 14.99)})</span>
              </li>
            </ul>

            <div class="bundle-pricing-box">
              <div class="bundle-price-compare">
                <span>Value: <del>${formatPrice(bundleTotal)}</del></span>
                <strong class="bundle-deal-price">${formatPrice(discountedBundle)}</strong>
              </div>
              <button class="btn btn-accent btn-block" id="quizAddBundleBtn">
                ⚡ Add Complete 3-Piece Kit to Cart (Save 15%)
              </button>
            </div>
          </div>
        </div>

        <div class="quiz-reset-row">
          <button class="btn-text-link" id="quizRestartBtn">← Retake Habitat Matcher Quiz</button>
        </div>
      </div>
    `;

    // Single add
    const singleBtn = document.getElementById('quizAddSingleBtn');
    if (singleBtn) {
      singleBtn.addEventListener('click', () => {
        cartState.add({
          id: product.id,
          name: product.name,
          price: product.price,
          variant: 'Standard Quiz Match',
          quantity: 1,
          type: product.svgType
        });
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Added ${product.name} to cart!` }
        }));
      });
    }

    // Bundle add
    const bundleBtn = document.getElementById('quizAddBundleBtn');
    if (bundleBtn) {
      bundleBtn.addEventListener('click', () => {
        cartState.add({
          id: product.id,
          name: `${product.name} (Quiz Bundle Kit)`,
          price: discountedBundle,
          variant: 'Complete Bioactive 3-Piece Kit (15% Off)',
          quantity: 1,
          type: 'bundle'
        });
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Added 3-Piece Starter Kit to cart with 15% discount!` }
        }));
      });
    }

    // Restart
    const restartBtn = document.getElementById('quizRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.currentStep = 1;
        this.answers = { lifestyle: null, size: null, priority: null };
        this.render();
      });
    }
  }
}
