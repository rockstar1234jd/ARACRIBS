// Aracribs - Interactive 3D Acrylic Enclosure Visualizer (HTML5 Canvas & 3D Math)
import { cartState } from '../utils/storage.js';
import { formatPrice } from '../utils/currency.js';

export class EnclosureVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.style = 'arboreal'; // 'arboreal' | 'slider' | 'cuboid'
    this.layer = 'bioactive'; // 'bare' | 'hardscape' | 'bioactive'
    this.lidOpenPercent = 0; // 0 to 100
    this.isDragging = false;
    this.rotX = -18;
    this.rotY = 32;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.autoRotate = true;

    this.init();
  }

  init() {
    this.renderDOM();
    this.setupCanvas();
    this.bindEvents();
    this.animate();
  }

  renderDOM() {
    this.container.innerHTML = `
      <div class="visualizer-wrapper">
        <div class="visualizer-header">
          <div class="visualizer-badge">
            <span class="pulse-dot"></span>
            <span>INTERACTIVE 3D CRIB STUDIO</span>
          </div>
          <h2 class="visualizer-title">Inspect The Optical Cast Acrylic</h2>
          <p class="visualizer-subtitle">Drag to rotate 360°. Slide the lid mechanism to test our escape-proof tolerances.</p>
        </div>

        <div class="visualizer-stage-card">
          <!-- Canvas Container -->
          <div class="canvas-container" id="cribCanvasContainer">
            <canvas id="crib3dCanvas" width="700" height="460"></canvas>
            
            <div class="canvas-overlay-specs">
              <div class="spec-pill" id="visSpecDims"><strong>Size:</strong> 6" x 6" x 8"</div>
              <div class="spec-pill" id="visSpecLid"><strong>Closure:</strong> Front Magnetic Switch</div>
              <div class="spec-pill" id="visSpecGauge"><strong>Acrylic:</strong> 4.5mm Cast</div>
            </div>

            <div class="canvas-hint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
              <span>Click & Drag to Rotate Enclosure</span>
            </div>
          </div>

          <!-- Interactive Controls Sidebar -->
          <div class="visualizer-controls">
            <!-- Habitat Style Selector -->
            <div class="control-group">
              <label class="control-label">1. Choose Enclosure Geometry</label>
              <div class="model-buttons">
                <button class="model-btn active" data-style="arboreal">
                  <span class="btn-icon">📐</span>
                  <div class="btn-text">
                    <strong>Treehouse Switch</strong>
                    <small>Vertical • Front Door</small>
                  </div>
                </button>
                <button class="model-btn" data-style="slider">
                  <span class="btn-icon">📦</span>
                  <div class="btn-text">
                    <strong>Slider Crib Pro</strong>
                    <small>Horizontal • Sliding Lid</small>
                  </div>
                </button>
                <button class="model-btn" data-style="cuboid">
                  <span class="btn-icon">🧊</span>
                  <div class="btn-text">
                    <strong>Cuboid 976</strong>
                    <small>Flush Snap-On Lid</small>
                  </div>
                </button>
              </div>
            </div>

            <!-- Habitat Interior Layer -->
            <div class="control-group">
              <label class="control-label">2. Habitat Interior Setup</label>
              <div class="layer-pills">
                <button class="layer-pill" data-layer="bare">Bare Acrylic</button>
                <button class="layer-pill" data-layer="hardscape">Substrate + Cork</button>
                <button class="layer-pill active" data-layer="bioactive">Full Bioactive + Spider</button>
              </div>
            </div>

            <!-- Lid Slide / Opening Interactive Slider -->
            <div class="control-group">
              <div class="control-header-row">
                <label class="control-label">3. Lid Opening Slider</label>
                <span class="lid-state-text" id="lidPercentVal">Closed (Locked)</span>
              </div>
              <div class="slider-container">
                <input type="range" id="lidSlider" min="0" max="100" value="0" class="custom-range" />
                <div class="slider-ticks">
                  <span>Magnetic Lock</span>
                  <span>50%</span>
                  <span>Full Access</span>
                </div>
              </div>
            </div>

            <!-- Live Price & Add to Cart -->
            <div class="visualizer-purchase-box">
              <div class="vis-price-row">
                <div>
                  <div class="vis-price-label">Configured Habitat Price</div>
                  <div class="vis-price-value" id="visPriceTag">${formatPrice(4999)}</div>
                </div>
                <div class="vis-stock-badge">In Stock • Ships in 24h</div>
              </div>

              <button class="btn btn-primary btn-block vis-add-btn" id="visAddToCartBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Add This Configuration to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupCanvas() {
    this.canvas = document.getElementById('crib3dCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Resize for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = (rect.width || 700) * dpr;
    this.canvas.height = (rect.height || 460) * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 700;
    this.height = rect.height || 460;
  }

  bindEvents() {
    // Model switches
    this.container.querySelectorAll('.model-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.style = btn.dataset.style;
        this.updateSpecs();
      });
    });

    // Layer switches
    this.container.querySelectorAll('.layer-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.layer-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.layer = btn.dataset.layer;
      });
    });

    // Lid range
    const lidSlider = document.getElementById('lidSlider');
    const lidValText = document.getElementById('lidPercentVal');
    if (lidSlider) {
      lidSlider.addEventListener('input', (e) => {
        this.lidOpenPercent = parseFloat(e.target.value);
        if (this.lidOpenPercent === 0) {
          lidValText.textContent = 'Closed (Magnetic Lock)';
          lidValText.style.color = '#00e676';
        } else if (this.lidOpenPercent < 40) {
          lidValText.textContent = `Feeding Gap (${Math.round(this.lidOpenPercent)}%)`;
          lidValText.style.color = '#ffb300';
        } else {
          lidValText.textContent = `Open (${Math.round(this.lidOpenPercent)}%)`;
          lidValText.style.color = '#ffffff';
        }
      });
    }

    // Canvas mouse rotation
    const canvasWrap = document.getElementById('cribCanvasContainer');
    if (canvasWrap) {
      canvasWrap.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.rotY += dx * 0.5;
        this.rotX = Math.max(-50, Math.min(20, this.rotX + dy * 0.5));
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      // Touch support
      canvasWrap.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.autoRotate = false;
          this.lastMouseX = e.touches[0].clientX;
          this.lastMouseY = e.touches[0].clientY;
        }
      });

      window.addEventListener('touchmove', (e) => {
        if (!this.isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.rotY += dx * 0.5;
        this.rotX = Math.max(-50, Math.min(20, this.rotX + dy * 0.5));
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
      });
    }

    // Add to cart from visualizer
    const addBtn = document.getElementById('visAddToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const itemMap = {
          arboreal: { id: 'treehouse-pro-668', name: 'Treehouse Switch 668 Pro (Arboreal)', price: 4999, variant: 'Dual Access Front Door' },
          slider: { id: 'slider-crib-pro-866', name: 'Slider Crib Pro 866 (Terrestrial)', price: 4499, variant: 'Smooth-Glide Sliding Lid' },
          cuboid: { id: 'cuboid-series-976', name: 'Cuboid Series 976 (Terrestrial)', price: 4499, variant: '8-Magnet Flush Snap-On' }
        };
        const config = itemMap[this.style] || itemMap.arboreal;
        cartState.add({
          id: config.id,
          name: config.name,
          price: config.price,
          variant: config.variant,
          quantity: 1,
          type: this.style
        });

        // Trigger toast
        window.dispatchEvent(new CustomEvent('toast:show', {
          detail: { message: `Added ${config.name} to cart!` }
        }));
      });
    }

    // Currency update listener
    window.addEventListener('currency:updated', () => {
      this.updateSpecs();
    });
  }

  updateSpecs() {
    const dimsPill = document.getElementById('visSpecDims');
    const lidPill = document.getElementById('visSpecLid');
    const gaugePill = document.getElementById('visSpecGauge');
    const priceTag = document.getElementById('visPriceTag');

    if (this.style === 'arboreal') {
      if (dimsPill) dimsPill.innerHTML = '<strong>Size:</strong> 6" x 6" x 8"';
      if (lidPill) lidPill.innerHTML = '<strong>Closure:</strong> Front Magnetic Switch';
      if (gaugePill) gaugePill.innerHTML = '<strong>Acrylic:</strong> 4.5mm Cast';
      if (priceTag) priceTag.textContent = formatPrice(4999);
    } else if (this.style === 'slider') {
      if (dimsPill) dimsPill.innerHTML = '<strong>Size:</strong> 8" x 6" x 6"';
      if (lidPill) lidPill.innerHTML = '<strong>Closure:</strong> Smooth Glide Sliding';
      if (gaugePill) gaugePill.innerHTML = '<strong>Acrylic:</strong> 4.0mm Cast';
      if (priceTag) priceTag.textContent = formatPrice(4499);
    } else {
      if (dimsPill) dimsPill.innerHTML = '<strong>Size:</strong> 9" x 7" x 6"';
      if (lidPill) lidPill.innerHTML = '<strong>Closure:</strong> 8-Point Magnetic Snap';
      if (gaugePill) gaugePill.innerHTML = '<strong>Acrylic:</strong> 4.0mm Cast';
      if (priceTag) priceTag.textContent = formatPrice(4499);
    }
  }

  project(x, y, z) {
    const radX = (this.rotX * Math.PI) / 180;
    const radY = (this.rotY * Math.PI) / 180;

    // Rotate Y
    let x1 = x * Math.cos(radY) + z * Math.sin(radY);
    let y1 = y;
    let z1 = -x * Math.sin(radY) + z * Math.cos(radY);

    // Rotate X
    let x2 = x1;
    let y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
    let z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

    // Perspective camera
    const fov = 480;
    const camDist = 650;
    const scale = fov / (fov + z2 + camDist);

    return {
      x: this.width / 2 + x2 * scale,
      y: this.height / 2 + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  animate() {
    if (this.autoRotate) {
      this.rotY += 0.25;
    }

    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Dynamic 3D Box Dimensions
    let w = 140, h = 200, d = 140; // Arboreal
    if (this.style === 'slider') {
      w = 200; h = 130; d = 150;
    } else if (this.style === 'cuboid') {
      w = 180; h = 140; d = 170;
    }

    // Shadow on floor
    const floorY = h / 2 + 15;
    const s1 = this.project(-w / 2 - 20, floorY, -d / 2 - 20);
    const s2 = this.project(w / 2 + 20, floorY, -d / 2 - 20);
    const s3 = this.project(w / 2 + 20, floorY, d / 2 + 20);
    const s4 = this.project(-w / 2 - 20, floorY, d / 2 + 20);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(s2.x, s2.y);
    ctx.lineTo(s3.x, s3.y);
    ctx.lineTo(s4.x, s4.y);
    ctx.closePath();
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.filter = 'none';

    // 8 Box Corners
    const p = [
      this.project(-w/2, -h/2, -d/2), // 0: top back left
      this.project( w/2, -h/2, -d/2), // 1: top back right
      this.project( w/2,  h/2, -d/2), // 2: btm back right
      this.project(-w/2,  h/2, -d/2), // 3: btm back left
      this.project(-w/2, -h/2,  d/2), // 4: top front left
      this.project( w/2, -h/2,  d/2), // 5: top front right
      this.project( w/2,  h/2,  d/2), // 6: btm front right
      this.project(-w/2,  h/2,  d/2)  // 7: btm front left
    ];

    // Rear Acrylic Glass Planes (drawn first)
    this.drawFace(p[0], p[1], p[2], p[3], 'rgba(15, 25, 20, 0.45)', '#00e676', 0.8); // back
    this.drawFace(p[0], p[4], p[7], p[3], 'rgba(15, 25, 20, 0.35)', '#ffffff', 0.6); // left
    this.drawFace(p[1], p[5], p[6], p[2], 'rgba(15, 25, 20, 0.35)', '#ffffff', 0.6); // right

    // Interior Layers (Substrate, Cork, Spider)
    if (this.layer !== 'bare') {
      this.drawSubstrate(w, h, d);
      this.drawHardscape(w, h, d);
      if (this.layer === 'bioactive') {
        this.drawSpider(w, h, d);
      }
    }

    // Front Face & Animated Lid
    if (this.style === 'slider') {
      // Sliding lid slides back along Z based on lidOpenPercent
      const slideOffset = (this.lidOpenPercent / 100) * (d * 0.7);
      const l0 = this.project(-w/2 + 5, -h/2 - 2, -d/2 - slideOffset);
      const l1 = this.project( w/2 - 5, -h/2 - 2, -d/2 - slideOffset);
      const l2 = this.project( w/2 - 5, -h/2 - 2,  d/2 - slideOffset);
      const l3 = this.project(-w/2 + 5, -h/2 - 2,  d/2 - slideOffset);
      this.drawFace(l0, l1, l2, l3, 'rgba(255, 255, 255, 0.28)', '#00e676', 1.8);
      
      // Front Wall
      this.drawFace(p[4], p[5], p[6], p[7], 'rgba(255, 255, 255, 0.12)', '#ffffff', 1.2);
    } else if (this.style === 'arboreal') {
      // Front Door hinges open based on lidOpenPercent
      const openAngle = (this.lidOpenPercent / 100) * 1.4; // radians
      const doorWidth = w;
      // Front left is hinge p[4], p[7]. Front right swings out:
      const dX = -w/2 + Math.cos(openAngle) * doorWidth;
      const dZ = d/2 + Math.sin(openAngle) * doorWidth;
      const dTopRight = this.project(dX, -h/2, dZ);
      const dBtmRight = this.project(dX,  h/2, dZ);

      // Door panel
      this.drawFace(p[4], dTopRight, dBtmRight, p[7], 'rgba(255, 255, 255, 0.22)', '#00e676', 1.8);
      // Top stationary ceiling
      this.drawFace(p[0], p[1], p[5], p[4], 'rgba(255, 255, 255, 0.15)', '#ffffff', 1.0);
    } else {
      // Cuboid snap lid lifts upward based on lidOpenPercent
      const liftY = (this.lidOpenPercent / 100) * 45;
      const l0 = this.project(-w/2, -h/2 - liftY, -d/2);
      const l1 = this.project( w/2, -h/2 - liftY, -d/2);
      const l2 = this.project( w/2, -h/2 - liftY,  d/2);
      const l3 = this.project(-w/2, -h/2 - liftY,  d/2);
      this.drawFace(l0, l1, l2, l3, 'rgba(255, 255, 255, 0.28)', '#00e676', 2.0);
      
      // Front Wall
      this.drawFace(p[4], p[5], p[6], p[7], 'rgba(255, 255, 255, 0.14)', '#ffffff', 1.2);
    }

    // Laser cross-ventilation dots on front/sides
    this.drawLaserVents(p);

    // Beveled Edge Sheen Highlights
    this.drawBevelHighlights(p);
  }

  drawFace(p1, p2, p3, p4, fill, stroke, strokeWidth = 1) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }

  drawSubstrate(w, h, d) {
    const soilHeight = this.style === 'arboreal' ? 45 : 60;
    const sTop = h/2 - soilHeight;
    const b1 = this.project(-w/2 + 2, sTop, -d/2 + 2);
    const b2 = this.project( w/2 - 2, sTop, -d/2 + 2);
    const b3 = this.project( w/2 - 2, sTop,  d/2 - 2);
    const b4 = this.project(-w/2 + 2, sTop,  d/2 - 2);

    this.drawFace(b1, b2, b3, b4, 'rgba(62, 39, 35, 0.95)', '#271810', 1);

    // Substrate front face
    const f1 = this.project(-w/2 + 2, sTop, d/2 - 2);
    const f2 = this.project( w/2 - 2, sTop, d/2 - 2);
    const f3 = this.project( w/2 - 2,  h/2 - 2, d/2 - 2);
    const f4 = this.project(-w/2 + 2,  h/2 - 2, d/2 - 2);
    this.drawFace(f1, f2, f3, f4, 'rgba(46, 26, 18, 0.95)', '#1b0000', 1);
  }

  drawHardscape(w, h, d) {
    const ctx = this.ctx;
    if (this.style === 'arboreal') {
      // Vertical cork branch
      const pTop = this.project(15, -h/4, -10);
      const pBtm = this.project(25, h/2 - 40, -5);
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pBtm.x, pBtm.y);
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 18 * pTop.scale;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Green moss patch
      const m1 = this.project(20, 0, 0);
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.arc(m1.x, m1.y, 10 * m1.scale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Horizontal cork flat hide
      const h1 = this.project(-w/4, h/2 - 75, 0);
      const h2 = this.project( w/4, h/2 - 70, 0);
      ctx.beginPath();
      ctx.moveTo(h1.x, h1.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.strokeStyle = '#4e342e';
      ctx.lineWidth = 22 * h1.scale;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  drawSpider(w, h, d) {
    const ctx = this.ctx;
    let spPos;
    if (this.style === 'arboreal') {
      spPos = this.project(12, -20, -5); // On cork branch
    } else {
      spPos = this.project(10, h/2 - 72, 10); // On ground
    }

    const scale = spPos.scale * 1.1;
    ctx.save();
    ctx.translate(spPos.x, spPos.y);

    // Spider abdomen & carapace
    ctx.fillStyle = this.style === 'arboreal' ? '#00e5ff' : '#ff9100';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 10 * scale, 8 * scale, 11 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8 Legs
    ctx.strokeStyle = this.style === 'arboreal' ? '#00b0ff' : '#e65100';
    ctx.lineWidth = 2.2 * scale;
    ctx.lineCap = 'round';

    const legAngles = [-0.9, -0.6, -0.2, 0.3, 0.9, 0.6, 0.2, -0.3];
    for (let i = 0; i < 4; i++) {
      // Left legs
      ctx.beginPath();
      ctx.moveTo(-3 * scale, (i * 3 - 3) * scale);
      ctx.lineTo(-18 * scale, (i * 6 - 8) * scale);
      ctx.lineTo(-26 * scale, (i * 7 + 2) * scale);
      ctx.stroke();

      // Right legs
      ctx.beginPath();
      ctx.moveTo(3 * scale, (i * 3 - 3) * scale);
      ctx.lineTo(18 * scale, (i * 6 - 8) * scale);
      ctx.lineTo(26 * scale, (i * 7 + 2) * scale);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawLaserVents(p) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 230, 118, 0.85)';
    // Draw some vent dots along left front edge
    for (let i = 0; i < 5; i++) {
      const t = 0.25 + i * 0.12;
      const vx = p[4].x + (p[7].x - p[4].x) * t + 8;
      const vy = p[4].y + (p[7].y - p[4].y) * t;
      ctx.beginPath();
      ctx.arc(vx, vy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBevelHighlights(p) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p[4].x, p[4].y);
    ctx.lineTo(p[5].x, p[5].y);
    ctx.stroke();
  }
}
