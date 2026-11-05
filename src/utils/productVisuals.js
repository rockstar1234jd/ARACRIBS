// Aracribs - High-Fidelity Acrylic Enclosure & Product Visual Renderers (SVG / Canvas)

export const renderProductVisual = (type, productId, options = {}) => {
  const width = options.width || '100%';
  const height = options.height || '100%';
  const isDark = options.isDark !== false;

  switch (type) {
    case 'arboreal':
      return `
        <svg viewBox="0 0 400 480" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="acrylicGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
              <stop offset="40%" stop-color="#38ef7d" stop-opacity="0.04"/>
              <stop offset="70%" stop-color="#ffffff" stop-opacity="0.08"/>
              <stop offset="100%" stop-color="#11e38c" stop-opacity="0.18"/>
            </linearGradient>
            <linearGradient id="soilGrad_${productId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4a3525"/>
              <stop offset="50%" stop-color="#322216"/>
              <stop offset="100%" stop-color="#1f140c"/>
            </linearGradient>
            <linearGradient id="corkGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8d6e63"/>
              <stop offset="50%" stop-color="#5d4037"/>
              <stop offset="100%" stop-color="#3e2723"/>
            </linearGradient>
            <linearGradient id="spiderBlue_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="50%" stop-color="#4facfe"/>
              <stop offset="100%" stop-color="#000d6b"/>
            </linearGradient>
            <filter id="glow_${productId}" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="glassReflect_${productId}">
              <feDropShadow dx="3" dy="5" stdDeviation="6" flood-color="#000" flood-opacity="0.35"/>
            </filter>
          </defs>

          <!-- Background Studio Glow -->
          <rect width="400" height="480" fill="transparent"/>
          <ellipse cx="200" cy="420" rx="140" ry="24" fill="#000000" opacity="0.45" filter="url(#glow_${productId})"/>
          <ellipse cx="200" cy="240" rx="120" ry="160" fill="#00e676" opacity="0.05" filter="url(#glow_${productId})"/>

          <!-- 3D Base Shadow -->
          <polygon points="90,405 310,405 335,425 65,425" fill="#050807" opacity="0.7"/>

          <!-- Acrylic Box Outer Shell (Arboreal Tower) -->
          <!-- Rear Wall -->
          <polygon points="105,70 295,70 320,390 80,390" fill="#0f1915" opacity="0.85"/>
          
          <!-- Bioactive Soil Substrate (Base Layer) -->
          <polygon points="82,350 318,350 320,390 80,390" fill="url(#soilGrad_${productId})"/>
          <!-- Substrate details: moss & micro perlite -->
          <ellipse cx="140" cy="355" rx="35" ry="8" fill="#2e7d32" opacity="0.8"/>
          <ellipse cx="240" cy="358" rx="45" ry="9" fill="#1b5e20" opacity="0.85"/>
          <circle cx="110" cy="365" r="3" fill="#81c784" opacity="0.9"/>
          <circle cx="280" cy="368" r="2.5" fill="#a5d6a7" opacity="0.9"/>

          <!-- Vertical Virgin Cork Bark Branch -->
          <path d="M 230,120 Q 240,240 250,360 L 210,360 Q 205,240 195,120 Z" fill="url(#corkGrad_${productId})"/>
          <!-- Cork texture ribs -->
          <path d="M 200,160 Q 220,155 235,165" stroke="#271810" stroke-width="3" fill="none"/>
          <path d="M 198,220 Q 220,215 242,225" stroke="#271810" stroke-width="3.5" fill="none"/>
          <path d="M 205,280 Q 225,275 248,285" stroke="#271810" stroke-width="4" fill="none"/>
          <!-- Tree moss tufts -->
          <circle cx="205" cy="190" r="7" fill="#4caf50" opacity="0.75"/>
          <circle cx="238" cy="240" r="9" fill="#388e3c" opacity="0.8"/>

          <!-- Tarantula Web Hammock / Canopy Webbing -->
          <path d="M 190,140 Q 150,160 130,130 Q 170,180 200,170" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5" fill="#ffffff" fill-opacity="0.1"/>
          <path d="M 220,135 Q 260,150 280,125" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" fill="none"/>

          <!-- Exotic Arboreal Tarantula (Caribena versicolor metallic blue/teal) -->
          <g transform="translate(190, 185) scale(0.85)">
            <!-- Legs (8) -->
            <path d="M 0,-5 Q -30,-40 -50,-30" stroke="#00e5ff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 0,-15 Q -40,-30 -60,-10" stroke="#00b0ff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 0,5 Q -45,10 -55,35" stroke="#2979ff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 0,15 Q -35,35 -40,65" stroke="#1565c0" stroke-width="4" stroke-linecap="round" fill="none"/>

            <path d="M 15,-5 Q 45,-40 65,-30" stroke="#00e5ff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,-15 Q 55,-30 75,-10" stroke="#00b0ff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 15,5 Q 60,10 70,35" stroke="#2979ff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,15 Q 50,35 55,65" stroke="#1565c0" stroke-width="4" stroke-linecap="round" fill="none"/>

            <!-- Pedipalps -->
            <path d="M -5,-25 Q -15,-45 -22,-45" stroke="#ff80ab" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 20,-25 Q 30,-45 37,-45" stroke="#ff80ab" stroke-width="3.5" stroke-linecap="round" fill="none"/>

            <!-- Cephalothorax (Carapace) -->
            <ellipse cx="7" cy="-10" rx="14" ry="17" fill="url(#spiderBlue_${productId})"/>
            <circle cx="7" cy="-14" r="3" fill="#ff007f"/>

            <!-- Abdomen with metallic hues & setae -->
            <ellipse cx="7" cy="24" rx="18" ry="24" fill="#0d1b2a"/>
            <!-- Setae tiger stripes -->
            <path d="M -5,16 Q 7,12 19,16" stroke="#ff4081" stroke-width="2.5" fill="none"/>
            <path d="M -7,24 Q 7,20 21,24" stroke="#ff4081" stroke-width="2.5" fill="none"/>
            <path d="M -5,32 Q 7,28 19,32" stroke="#ff5252" stroke-width="2" fill="none"/>
          </g>

          <!-- Magnetic Floating Water Dish (Canopy height) -->
          <rect x="86" y="210" width="28" height="12" rx="4" fill="#ffffff" fill-opacity="0.3" stroke="#ffffff" stroke-width="1.5"/>
          <ellipse cx="100" cy="216" rx="10" ry="3.5" fill="#00e5ff" opacity="0.8"/>
          <rect x="76" y="212" width="6" height="8" rx="2" fill="#37474f"/> <!-- outer magnet -->

          <!-- Front Acrylic Switch Door (Reflective) -->
          <polygon points="90,75 310,75 318,390 82,390" fill="url(#acrylicGrad_${productId})" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.8"/>

          <!-- Precision Laser Cross-Ventilation Arrays -->
          <!-- Left bank -->
          <g fill="#00e676" opacity="0.85">
            <circle cx="98" cy="110" r="2.2"/>
            <circle cx="108" cy="110" r="2.2"/>
            <circle cx="98" cy="122" r="2.2"/>
            <circle cx="108" cy="122" r="2.2"/>
            <circle cx="98" cy="134" r="2.2"/>
            <circle cx="108" cy="134" r="2.2"/>

            <circle cx="98" cy="290" r="2.2"/>
            <circle cx="108" cy="290" r="2.2"/>
            <circle cx="98" cy="302" r="2.2"/>
            <circle cx="108" cy="302" r="2.2"/>
            <circle cx="98" cy="314" r="2.2"/>
            <circle cx="108" cy="314" r="2.2"/>
          </g>
          <!-- Right bank -->
          <g fill="#00e676" opacity="0.85">
            <circle cx="292" cy="110" r="2.2"/>
            <circle cx="302" cy="110" r="2.2"/>
            <circle cx="292" cy="122" r="2.2"/>
            <circle cx="302" cy="122" r="2.2"/>
            <circle cx="292" cy="134" r="2.2"/>
            <circle cx="302" cy="134" r="2.2"/>

            <circle cx="292" cy="290" r="2.2"/>
            <circle cx="302" cy="290" r="2.2"/>
            <circle cx="292" cy="302" r="2.2"/>
            <circle cx="302" cy="302" r="2.2"/>
            <circle cx="292" cy="314" r="2.2"/>
            <circle cx="302" cy="314" r="2.2"/>
          </g>

          <!-- Dual N52 Magnetic Latches with Stainless Mounts -->
          <rect x="296" y="190" width="16" height="26" rx="4" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="304" cy="203" r="4.5" fill="#37474f"/>
          <!-- Top Hatch Grip -->
          <rect x="180" y="66" width="40" height="8" rx="3" fill="#ffffff" fill-opacity="0.8" stroke="#00e676" stroke-width="1.2"/>

          <!-- Specular Optical Reflection Glare (45-degree diagonal cast) -->
          <polygon points="120,75 160,75 290,390 250,390" fill="#ffffff" opacity="0.12"/>
          <polygon points="175,75 185,75 298,340 288,340" fill="#ffffff" opacity="0.22"/>
          
          <!-- Crystal Rim Highlights -->
          <line x1="90" y1="75" x2="310" y2="75" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.9"/>
          <line x1="82" y1="390" x2="318" y2="390" stroke="#00e676" stroke-width="2" stroke-opacity="0.7"/>

          <!-- Brand Emblem Badge Micro-engraved -->
          <text x="200" y="380" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="2">ARACRIBS</text>
        </svg>
      `;

    case 'slider':
      return `
        <svg viewBox="0 0 440 360" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="sliderAcrylic_${productId}" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
              <stop offset="50%" stop-color="#00e676" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15"/>
            </linearGradient>
            <linearGradient id="deepSoil_${productId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4e342e"/>
              <stop offset="60%" stop-color="#3e2723"/>
              <stop offset="100%" stop-color="#1b0000"/>
            </linearGradient>
            <linearGradient id="redKneeLeg_${productId}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#212121"/>
              <stop offset="35%" stop-color="#ff6d00"/>
              <stop offset="65%" stop-color="#dd2c00"/>
              <stop offset="100%" stop-color="#212121"/>
            </linearGradient>
          </defs>

          <!-- Studio Ambient Ground -->
          <ellipse cx="220" cy="315" rx="170" ry="22" fill="#000000" opacity="0.5"/>

          <!-- Rear Acrylic Panel -->
          <polygon points="75,100 365,100 395,290 45,290" fill="#111915" opacity="0.8"/>

          <!-- Deep Substrate Soil Reservoir (3.0" Well) -->
          <polygon points="50,210 390,210 395,290 45,290" fill="url(#deepSoil_${productId})"/>
          <!-- Substrate top texture -->
          <path d="M 50,210 Q 120,205 200,212 Q 300,207 390,210 L 395,225 L 47,225 Z" fill="#6d4c41"/>
          
          <!-- Natural Cork Flat Hide -->
          <polygon points="120,205 220,185 240,215 110,215" fill="#4e342e" stroke="#271810" stroke-width="2"/>
          <path d="M 125,202 Q 170,190 225,188" stroke="#8d6e63" stroke-width="2.5" fill="none"/>
          <ellipse cx="140" cy="208" rx="16" ry="6" fill="#33691e"/> <!-- live moss -->
          <ellipse cx="310" cy="212" rx="22" ry="7" fill="#2e7d32" opacity="0.8"/>

          <!-- Terrestrial Tarantula: Mexican Red Knee (Brachypelma hamorii) -->
          <g transform="translate(230, 195) scale(0.9)">
            <!-- Left Legs -->
            <path d="M -10,-10 Q -45,-30 -75,-15" stroke="url(#redKneeLeg_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M -10,0 Q -60,-10 -90,10" stroke="url(#redKneeLeg_${productId})" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M -10,10 Q -65,15 -85,45" stroke="url(#redKneeLeg_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M -10,20 Q -45,45 -65,70" stroke="url(#redKneeLeg_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>
            
            <!-- Right Legs -->
            <path d="M 15,-10 Q 50,-30 80,-15" stroke="url(#redKneeLeg_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,0 Q 65,-10 95,10" stroke="url(#redKneeLeg_${productId})" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M 15,10 Q 70,15 90,45" stroke="url(#redKneeLeg_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,20 Q 50,45 70,70" stroke="url(#redKneeLeg_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>

            <!-- Pedipalps -->
            <path d="M -8,-25 Q -25,-40 -35,-35" stroke="url(#redKneeLeg_${productId})" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M 12,-25 Q 30,-40 40,-35" stroke="url(#redKneeLeg_${productId})" stroke-width="4.5" stroke-linecap="round" fill="none"/>

            <!-- Carapace (Golden Orange Rim with Black Center) -->
            <ellipse cx="2" cy="-5" rx="17" ry="19" fill="#1a1a1a" stroke="#ff9100" stroke-width="3"/>
            <circle cx="2" cy="-8" r="3.5" fill="#000000"/>

            <!-- Plump Abdomen with Red Setae -->
            <ellipse cx="2" cy="28" rx="20" ry="26" fill="#121212"/>
            <path d="M -12,22 Q 2,16 16,22" stroke="#ff3d00" stroke-width="3" fill="none"/>
            <path d="M -14,30 Q 2,24 18,30" stroke="#ff6d00" stroke-width="3.5" fill="none"/>
            <path d="M -10,38 Q 2,32 14,38" stroke="#ff9100" stroke-width="2.5" fill="none"/>
          </g>

          <!-- Front Cast Acrylic Wall -->
          <polygon points="60,110 380,110 395,290 45,290" fill="url(#sliderAcrylic_${productId})" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>

          <!-- Smooth Sliding Lid Mechanism on Upper Track -->
          <!-- Track Rail -->
          <rect x="52" y="98" width="336" height="12" rx="3" fill="#cfd8dc" opacity="0.85"/>
          <!-- Top Sliding Pane slightly offset to show slide feature -->
          <polygon points="65,85 365,85 378,104 78,104" fill="#ffffff" fill-opacity="0.4" stroke="#00e676" stroke-width="1.8"/>
          <!-- Sliding Lid Finger Handle Tab with N52 Magnets -->
          <rect x="200" y="80" width="40" height="10" rx="3" fill="#37474f" stroke="#00e676" stroke-width="1.5"/>
          <circle cx="210" cy="85" r="2.5" fill="#00e676"/>
          <circle cx="230" cy="85" r="2.5" fill="#00e676"/>

          <!-- Side Cross-Flow Ventilation Array -->
          <g fill="#00e676" opacity="0.9">
            <circle cx="80" cy="140" r="2.5"/><circle cx="95" cy="140" r="2.5"/><circle cx="110" cy="140" r="2.5"/><circle cx="125" cy="140" r="2.5"/>
            <circle cx="80" cy="155" r="2.5"/><circle cx="95" cy="155" r="2.5"/><circle cx="110" cy="155" r="2.5"/><circle cx="125" cy="155" r="2.5"/>
            <circle cx="80" cy="170" r="2.5"/><circle cx="95" cy="170" r="2.5"/><circle cx="110" cy="170" r="2.5"/><circle cx="125" cy="170" r="2.5"/>

            <circle cx="315" cy="140" r="2.5"/><circle cx="330" cy="140" r="2.5"/><circle cx="345" cy="140" r="2.5"/><circle cx="360" cy="140" r="2.5"/>
            <circle cx="315" cy="155" r="2.5"/><circle cx="330" cy="155" r="2.5"/><circle cx="345" cy="155" r="2.5"/><circle cx="360" cy="155" r="2.5"/>
            <circle cx="315" cy="170" r="2.5"/><circle cx="330" cy="170" r="2.5"/><circle cx="345" cy="170" r="2.5"/><circle cx="360" cy="170" r="2.5"/>
          </g>

          <!-- Specular Light Reflection Streak -->
          <polygon points="120,110 160,110 320,290 280,290" fill="#ffffff" opacity="0.12"/>
          <line x1="60" y1="110" x2="380" y2="110" stroke="#ffffff" stroke-width="2.5"/>

          <!-- Branding Logo -->
          <text x="220" y="275" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="3">ARACRIBS • SLIDER PRO</text>
        </svg>
      `;

    case 'cuboid':
      return `
        <svg viewBox="0 0 420 360" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="cubeGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
              <stop offset="60%" stop-color="#00e676" stop-opacity="0.08"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18"/>
            </linearGradient>
            <linearGradient id="blackT_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2d3436"/>
              <stop offset="100%" stop-color="#090a0f"/>
            </linearGradient>
          </defs>
          <ellipse cx="210" cy="305" rx="160" ry="20" fill="#000000" opacity="0.5"/>

          <!-- Cuboid Body -->
          <polygon points="80,110 340,110 370,280 50,280" fill="#0c1410" opacity="0.85"/>
          
          <!-- Substrate -->
          <polygon points="55,200 365,200 370,280 50,280" fill="#3e2723"/>
          <ellipse cx="140" cy="204" rx="20" ry="6" fill="#1b5e20"/>

          <!-- Brazilian Black Tarantula (Grammostola pulchra - velvet jet black) -->
          <g transform="translate(210, 190) scale(0.95)">
            <path d="M -10,-10 Q -45,-30 -70,-20" stroke="#121212" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M -10,0 Q -60,-10 -85,5" stroke="#1c1c1c" stroke-width="6.5" stroke-linecap="round" fill="none"/>
            <path d="M -10,10 Q -65,15 -80,40" stroke="#121212" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M -10,20 Q -45,40 -60,65" stroke="#1c1c1c" stroke-width="5.5" stroke-linecap="round" fill="none"/>

            <path d="M 15,-10 Q 50,-30 75,-20" stroke="#121212" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M 15,0 Q 65,-10 90,5" stroke="#1c1c1c" stroke-width="6.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,10 Q 70,15 85,40" stroke="#121212" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M 15,20 Q 50,40 65,65" stroke="#1c1c1c" stroke-width="5.5" stroke-linecap="round" fill="none"/>

            <ellipse cx="2" cy="-6" rx="16" ry="18" fill="url(#blackT_${productId})" stroke="#333" stroke-width="1.5"/>
            <ellipse cx="2" cy="26" rx="21" ry="25" fill="#050505"/>
            <circle cx="2" cy="-9" r="3" fill="#222"/>
          </g>

          <!-- Front Clear Acrylic Glass -->
          <polygon points="65,115 355,115 370,280 50,280" fill="url(#cubeGrad_${productId})" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>

          <!-- 8-Point Flush Magnetic Snap Lid -->
          <polygon points="75,90 345,90 365,115 55,115" fill="#ffffff" fill-opacity="0.45" stroke="#00e676" stroke-width="2"/>
          <!-- 8 Magnets on perimeter -->
          <circle cx="85" cy="115" r="4" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="150" cy="115" r="4" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="270" cy="115" r="4" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="335" cy="115" r="4" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="95" cy="94" r="3.5" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="170" cy="94" r="3.5" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="250" cy="94" r="3.5" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>
          <circle cx="325" cy="94" r="3.5" fill="#cfd8dc" stroke="#263238" stroke-width="1.5"/>

          <!-- Vent matrix -->
          <g fill="#00e676" opacity="0.9">
            <circle cx="75" cy="140" r="2.2"/><circle cx="87" cy="140" r="2.2"/><circle cx="99" cy="140" r="2.2"/>
            <circle cx="75" cy="152" r="2.2"/><circle cx="87" cy="152" r="2.2"/><circle cx="99" cy="152" r="2.2"/>
            <circle cx="320" cy="140" r="2.2"/><circle cx="332" cy="140" r="2.2"/><circle cx="344" cy="140" r="2.2"/>
            <circle cx="320" cy="152" r="2.2"/><circle cx="332" cy="152" r="2.2"/><circle cx="344" cy="152" r="2.2"/>
          </g>

          <polygon points="120,115 160,115 300,280 260,280" fill="#ffffff" opacity="0.12"/>
          <text x="210" y="270" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="3">CUBOID SERIES 976</text>
        </svg>
      `;

    case 'fossorial':
      return `
        <svg viewBox="0 0 380 440" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="deepDirt_${productId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4e342e"/>
              <stop offset="40%" stop-color="#3e2723"/>
              <stop offset="80%" stop-color="#271810"/>
              <stop offset="100%" stop-color="#140a05"/>
            </linearGradient>
            <linearGradient id="cobaltGlow_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00d2ff"/>
              <stop offset="50%" stop-color="#3a7bd5"/>
              <stop offset="100%" stop-color="#000428"/>
            </linearGradient>
          </defs>
          <ellipse cx="190" cy="405" rx="140" ry="20" fill="#000000" opacity="0.5"/>

          <!-- Deep Fossorial Bunker Outer Box -->
          <polygon points="90,70 290,70 310,380 70,380" fill="#0d1410" opacity="0.85"/>
          
          <!-- 7.5 Inches of Deep Compacted Substrate -->
          <polygon points="73,150 307,150 310,380 70,380" fill="url(#deepDirt_${productId})"/>

          <!-- Excavated Under-Earth Burrow System Against Clear Glass -->
          <path d="M 190,150 Q 180,220 220,260 Q 250,300 210,340 Q 160,350 140,320 Q 130,260 170,210 Z" fill="#180e08"/>
          <!-- Subterranean tunnel web lining -->
          <path d="M 188,155 Q 178,222 218,262 Q 248,302 208,342" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" fill="none"/>
          
          <!-- Cobalt Blue Tarantula Inside Chamber -->
          <g transform="translate(195, 295) scale(0.75)">
            <path d="M -10,-10 Q -40,-25 -65,-15" stroke="url(#cobaltGlow_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M -10,0 Q -50,-5 -75,10" stroke="url(#cobaltGlow_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M -10,10 Q -50,15 -65,35" stroke="url(#cobaltGlow_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 15,-10 Q 45,-25 70,-15" stroke="url(#cobaltGlow_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 15,0 Q 55,-5 80,10" stroke="url(#cobaltGlow_${productId})" stroke-width="5.5" stroke-linecap="round" fill="none"/>
            <path d="M 15,10 Q 55,15 70,35" stroke="url(#cobaltGlow_${productId})" stroke-width="5" stroke-linecap="round" fill="none"/>

            <ellipse cx="2" cy="-6" rx="14" ry="16" fill="url(#cobaltGlow_${productId})"/>
            <ellipse cx="2" cy="24" rx="17" ry="21" fill="#000428"/>
          </g>

          <!-- Top Sliding Access Lid -->
          <polygon points="85,60 295,60 305,75 75,75" fill="#ffffff" fill-opacity="0.45" stroke="#00e676" stroke-width="2"/>
          <rect x="170" y="55" width="40" height="8" rx="2" fill="#37474f"/>

          <!-- High-Altitude Cross Vents -->
          <g fill="#00e676" opacity="0.9">
            <circle cx="95" cy="100" r="2.2"/><circle cx="107" cy="100" r="2.2"/><circle cx="119" cy="100" r="2.2"/>
            <circle cx="95" cy="112" r="2.2"/><circle cx="107" cy="112" r="2.2"/><circle cx="119" cy="112" r="2.2"/>
            <circle cx="260" cy="100" r="2.2"/><circle cx="272" cy="100" r="2.2"/><circle cx="284" cy="100" r="2.2"/>
            <circle cx="260" cy="112" r="2.2"/><circle cx="272" cy="112" r="2.2"/><circle cx="284" cy="112" r="2.2"/>
          </g>

          <!-- Acrylic Sheen -->
          <polygon points="100,75 140,75 280,380 240,380" fill="#ffffff" opacity="0.12"/>
          <text x="190" y="370" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="2">FOSSORIAL BUNKER 8410</text>
        </svg>
      `;

    case 'soil':
      return `
        <svg viewBox="0 0 360 420" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="pouchGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#263238"/>
              <stop offset="50%" stop-color="#1b2428"/>
              <stop offset="100%" stop-color="#0f1517"/>
            </linearGradient>
            <linearGradient id="goldSeal_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffd700"/>
              <stop offset="100%" stop-color="#ff9100"/>
            </linearGradient>
          </defs>
          <ellipse cx="180" cy="380" rx="130" ry="18" fill="#000000" opacity="0.5"/>

          <!-- Stand-Up Matte Resealable Pouch -->
          <path d="M 80,70 L 280,70 L 305,350 L 55,350 Z" fill="url(#pouchGrad_${productId})" stroke="#37474f" stroke-width="2"/>
          <!-- Heat Seal Ribs -->
          <line x1="80" y1="85" x2="280" y2="85" stroke="#455a64" stroke-width="2"/>
          <line x1="80" y1="92" x2="280" y2="92" stroke="#455a64" stroke-width="2"/>
          <rect x="165" y="75" width="30" height="6" rx="3" fill="#00e676"/>

          <!-- Pouch Artwork & Branding -->
          <rect x="85" y="120" width="190" height="210" rx="6" fill="#121a1d" stroke="#00e676" stroke-width="1.5" stroke-opacity="0.6"/>

          <!-- Arachnid Silhouette Emblem -->
          <circle cx="180" cy="165" r="28" fill="#00e676" fill-opacity="0.15" stroke="#00e676" stroke-width="1.5"/>
          <circle cx="180" cy="160" r="7" fill="#00e676"/>
          <ellipse cx="180" cy="174" rx="9" ry="12" fill="#00e676"/>
          <!-- Spider legs on emblem -->
          <path d="M 174,158 Q 155,145 145,155" stroke="#00e676" stroke-width="2" fill="none"/>
          <path d="M 174,162 Q 150,160 142,170" stroke="#00e676" stroke-width="2" fill="none"/>
          <path d="M 186,158 Q 205,145 215,155" stroke="#00e676" stroke-width="2" fill="none"/>
          <path d="M 186,162 Q 210,160 218,170" stroke="#00e676" stroke-width="2" fill="none"/>

          <!-- Text -->
          <text x="180" y="215" font-family="Barlow, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">ARACHNIDIRT™</text>
          <text x="180" y="232" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#00e676" text-anchor="middle" letter-spacing="2">BIOACTIVE SUBSTRATE</text>
          <text x="180" y="252" font-family="Barlow, sans-serif" font-size="8" fill="#90a4ae" text-anchor="middle">ANTI-COLLAPSE BURROW BLEND</text>
          
          <!-- Specs Pill Tags -->
          <rect x="105" y="270" width="70" height="18" rx="9" fill="#263238"/>
          <text x="140" y="282" font-family="Barlow, sans-serif" font-size="8" font-weight="600" fill="#ffffff" text-anchor="middle">4 DRY QTS</text>

          <rect x="185" y="270" width="70" height="18" rx="9" fill="#263238"/>
          <text x="220" y="282" font-family="Barlow, sans-serif" font-size="8" font-weight="600" fill="#00e676" text-anchor="middle">MOLD SHIELD</text>

          <!-- Gold Quality Seal Badge -->
          <circle cx="255" cy="135" r="18" fill="url(#goldSeal_${productId})"/>
          <text x="255" y="138" font-family="Barlow, sans-serif" font-size="7" font-weight="900" fill="#1b2428" text-anchor="middle">PREMIUM</text>
        </svg>
      `;

    case 'decor':
      return `
        <svg viewBox="0 0 380 380" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="barkGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8d6e63"/>
              <stop offset="40%" stop-color="#5d4037"/>
              <stop offset="80%" stop-color="#3e2723"/>
              <stop offset="100%" stop-color="#271810"/>
            </linearGradient>
          </defs>
          <ellipse cx="190" cy="320" rx="140" ry="22" fill="#000000" opacity="0.5"/>

          <!-- 3D Hollow Virgin Cork Bark Round -->
          <!-- Inner Dark Hollow Retreat -->
          <ellipse cx="140" cy="160" rx="55" ry="85" fill="#1a100a" stroke="#271810" stroke-width="4"/>
          <!-- Outer Bark Cylinder Wall -->
          <path d="M 140,75 Q 260,70 290,160 Q 310,260 250,300 L 140,245 Z" fill="url(#barkGrad_${productId})"/>
          
          <!-- Rough Organic Bark Furrows & Ridges -->
          <path d="M 170,95 Q 220,130 240,200 Q 250,250 230,285" stroke="#271810" stroke-width="5" fill="none"/>
          <path d="M 200,85 Q 250,120 270,180 Q 280,240 260,270" stroke="#271810" stroke-width="4" fill="none"/>
          <path d="M 150,115 Q 180,160 195,220" stroke="#8d6e63" stroke-width="3" fill="none"/>

          <!-- Lichen & Forest Moss Tufts -->
          <circle cx="230" cy="140" r="12" fill="#4caf50" opacity="0.85"/>
          <circle cx="260" cy="210" r="16" ry="8" fill="#388e3c" opacity="0.8"/>
          <circle cx="185" cy="240" r="9" fill="#81c784" opacity="0.9"/>

          <!-- Webbing Anchors -->
          <path d="M 130,130 Q 150,150 140,180" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4" fill="none"/>
          <text x="190" y="350" font-family="Barlow, sans-serif" font-size="10" font-weight="700" fill="#ffffff" opacity="0.5" text-anchor="middle" letter-spacing="2">VIRGIN CORK BARK ROUND</text>
        </svg>
      `;

    case 'accessories':
      return `
        <svg viewBox="0 0 380 340" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="waterGrad_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="100%" stop-color="#4facfe"/>
            </linearGradient>
          </defs>
          <ellipse cx="190" cy="285" rx="120" ry="18" fill="#000000" opacity="0.45"/>

          <!-- Magnetic Ledge Body (Clear Laser Acrylic) -->
          <polygon points="100,120 280,120 250,220 70,220" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="2"/>
          <line x1="100" y1="120" x2="70" y2="220" stroke="#00e676" stroke-width="3"/>

          <!-- Dual N52 Rubber-Coated Magnets -->
          <rect x="52" y="140" width="16" height="30" rx="4" fill="#263238" stroke="#37474f" stroke-width="2"/>
          <rect x="52" y="180" width="16" height="30" rx="4" fill="#263238" stroke="#37474f" stroke-width="2"/>

          <!-- Removable Clear Food-Grade Water Cup -->
          <ellipse cx="180" cy="160" rx="45" ry="24" fill="url(#waterGrad_${productId})" opacity="0.85" stroke="#ffffff" stroke-width="2"/>
          <path d="M 135,160 Q 180,240 225,160 Z" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="1.5"/>

          <!-- Water Droplets & Ripples -->
          <circle cx="180" cy="160" r="10" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
          <circle cx="180" cy="160" r="22" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4"/>
          <circle cx="215" cy="145" r="3" fill="#ffffff" opacity="0.8"/>
          
          <text x="190" y="270" font-family="Barlow, sans-serif" font-size="10" font-weight="700" fill="#ffffff" opacity="0.5" text-anchor="middle" letter-spacing="2">MAGNETIC ARBOREAL WATER DISH</text>
        </svg>
      `;

    case 'bundle':
    default:
      return `
        <svg viewBox="0 0 420 380" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="product-svg">
          <defs>
            <linearGradient id="kitGlow_${productId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00e676"/>
              <stop offset="100%" stop-color="#1b5e20"/>
            </linearGradient>
          </defs>
          <ellipse cx="210" cy="335" rx="160" ry="22" fill="#000000" opacity="0.5"/>

          <!-- Turnkey Kit Arrangement: Slider Crib in center, Soil bag left, Cork bark right, Tongs in front -->
          <!-- Substrate Bag (Left Rear) -->
          <polygon points="50,130 150,130 165,290 35,290" fill="#263238" stroke="#37474f" stroke-width="1.5"/>
          <text x="100" y="210" font-family="Barlow, sans-serif" font-size="9" font-weight="900" fill="#00e676" text-anchor="middle">ARACHNIDIRT</text>

          <!-- Cork Round (Right Rear) -->
          <path d="M 280,120 Q 360,110 380,200 Q 390,280 340,300 L 270,290 Z" fill="#4e342e" stroke="#271810" stroke-width="2"/>

          <!-- Center Slider Crib Pro Enclosure -->
          <polygon points="120,140 310,140 330,290 100,290" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="2.2"/>
          <line x1="120" y1="140" x2="310" y2="140" stroke="#00e676" stroke-width="2.5"/>

          <!-- Stainless Steel Precision Tongs In Front -->
          <line x1="80" y1="315" x2="330" y2="295" stroke="#cfd8dc" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="80" y1="318" x2="330" y2="305" stroke="#b0bec5" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="80" cy="316" r="5" fill="#37474f"/>

          <!-- Bundle Ribbon Tag -->
          <rect x="145" y="90" width="130" height="30" rx="15" fill="url(#kitGlow_${productId})" stroke="#ffffff" stroke-width="1.5"/>
          <text x="210" y="110" font-family="Barlow, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">COMPLETE BUNDLE</text>

          <text x="210" y="325" font-family="Barlow, sans-serif" font-size="9" font-weight="700" fill="#ffffff" opacity="0.5" text-anchor="middle" letter-spacing="2">TURNKEY HABITAT SETUP</text>
        </svg>
      `;
  }
};
