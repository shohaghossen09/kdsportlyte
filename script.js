// ===== DATA =====
const FLAVORS = {
  blue: { name:'Blue Lightning', emoji:'⚡', color:'#00B4FF', desc:'Electric blue raspberry with a bolt of energy. The OG fan favorite!', tagline:'Strike First. Stay Hydrated.' },
  orange: { name:'Orange Blast', emoji:'🍊', color:'#FF6B00', desc:'Bursting citrus sunshine that kids can\'t resist.', tagline:'Sunshine in Every Sip.' },
  pink: { name:'Pink Power', emoji:'🍓', color:'#FF1493', desc:'Sweet strawberry kick for your little powerhouse.', tagline:'Power Up with Pink!' },
  green: { name:'Green Galaxy', emoji:'🥝', color:'#7FFF00', desc:'Kiwi-lime cosmic blast from another dimension.', tagline:'Taste the Galaxy.' },
  red: { name:'Red Rush', emoji:'🍉', color:'#FF4444', desc:'Watermelon wave that hits different. Rush approved!', tagline:'Feel the Rush.' }
};

const PRODUCTS = [
  { id:'bl-10', flavor:'blue', name:'Blue Lightning', pack:'10-Stick Pack', price:9.99, badge:'BEST SELLER', emoji:'⚡' },
  { id:'ob-10', flavor:'orange', name:'Orange Blast', pack:'10-Stick Pack', price:9.99, badge:null, emoji:'🍊' },
  { id:'pp-10', flavor:'pink', name:'Pink Power', pack:'10-Stick Pack', price:9.99, badge:null, emoji:'🍓' },
  { id:'gg-10', flavor:'green', name:'Green Galaxy', pack:'10-Stick Pack', price:9.99, badge:'NEW!', emoji:'🥝' },
  { id:'rr-10', flavor:'red', name:'Red Rush', pack:'10-Stick Pack', price:9.99, badge:null, emoji:'🍉' },
  { id:'vp-30', flavor:'mixed', name:'Variety Pack', pack:'30-Stick Box', price:24.99, badge:'BEST VALUE', emoji:'🌈' },
  { id:'sub-30', flavor:'mixed', name:'Monthly Sub', pack:'30-Stick / month', price:19.99, badge:'SAVE 20%', emoji:'🔄' },
  { id:'bl-30', flavor:'blue', name:'Blue Lightning', pack:'30-Stick Box', price:24.99, badge:null, emoji:'⚡' }
];

// ===== STATE =====
let cart = [];
let currentFlavor = 'blue';
let reviewIndex = 0;

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  $('#scrollProgress').style.width = progress + '%';
});

// ===== CURSOR GLOW =====
const cursorGlow = $('#cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== FLOATING EMOJIS =====
function createFloatingEmojis() {
  const container = $('#floatingEmojis');
  const emojis = ['⚡','💧','🍊','🍓','🥝','🍉','💪','🏆','🔥','🌈','✨','💫'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('span');
    el.className = 'float-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    el.style.animationDuration = (15 + Math.random() * 20) + 's';
    el.style.animationDelay = Math.random() * 20 + 's';
    container.appendChild(el);
  }
}

// ===== PARTICLE CANVAS =====
function initParticles() {
  const canvas = $('#particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['#00B4FF','#FF6B00','#FF1493','#7FFF00','#FF4444','#FFD700'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = 0.06 * (1 - dist / 120);
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== CONFETTI =====
const confettiCanvas = $('#confettiCanvas');
const confCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti() {
  confettiPieces = [];
  const colors = ['#00B4FF','#FF6B00','#FF1493','#7FFF00','#FF4444','#FFD700','#9B59B6','#FFFFFF'];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 20 - 5,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.3 + Math.random() * 0.2,
      alpha: 1
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let alive = false;
  confettiPieces.forEach(p => {
    if (p.alpha <= 0) return;
    alive = true;
    p.x += p.vx;
    p.vy += p.gravity;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.vx *= 0.99;
    if (p.y > confettiCanvas.height) p.alpha -= 0.02;
    confCtx.save();
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.rotation * Math.PI / 180);
    confCtx.globalAlpha = Math.max(0, p.alpha);
    confCtx.fillStyle = p.color;
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  });
  if (alive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// ===== NAVBAR =====
const navbar = $('#navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50 ? 'rgba(6,6,26,0.95)' : 'rgba(6,6,26,0.85)';
});

// ===== HAMBURGER =====
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
 $$('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ===== CART =====
const cartSidebar = $('#cartSidebar');
const cartOverlay = $('#cartOverlay');

function openCart() { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow=''; }

 $('#cartToggle').addEventListener('click', openCart);
 $('#cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to cart!`);
  const btn = document.querySelector(`[data-product-id="${productId}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '✓ Added!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<iconify-icon icon="solar:bag-4-bold" width="16"></iconify-icon> Add to Cart';
    }, 1200);
  }
}

function removeFromCart(productId) { cart = cart.filter(item => item.id !== productId); updateCartUI(); }

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  updateCartUI();
}

function updateCartUI() {
  const countEl = $('#cartCount');
  const itemsEl = $('#cartItems');
  const footerEl = $('#cartFooter');
  const totalEl = $('#cartTotal');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  countEl.textContent = totalItems;
  countEl.classList.remove('bump');
  void countEl.offsetWidth;
  countEl.classList.add('bump');
  if (!cart.length) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    footerEl.style.display = 'none';
    return;
  }
  footerEl.style.display = 'block';
  totalEl.textContent = `$${totalPrice.toFixed(2)}`;
  const colorMap = { blue:'#00B4FF', orange:'#FF6B00', pink:'#FF1493', green:'#7FFF00', red:'#FF4444', mixed:'linear-gradient(135deg,#00B4FF,#FF6B00,#FF1493,#7FFF00)' };
  itemsEl.innerHTML = cart.map(item => {
    const bg = colorMap[item.flavor] || colorMap.mixed;
    return `<div class="cart-item">
      <div class="cart-item-color" style="background:${bg}"></div>
      <div class="cart-item-info"><strong>${item.emoji} ${item.name}</strong><span>${item.pack}</span></div>
      <div class="cart-item-qty"><button onclick="changeQty('${item.id}',-1)">−</button><span>${item.qty}</span><button onclick="changeQty('${item.id}',1)">+</button></div>
      <div class="cart-item-price">$${(item.price*item.qty).toFixed(2)}</div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>`;
  }).join('');
}

 $('#checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  showToast(`🎉 Order placed! Total: $${total.toFixed(2)}`);
  launchConfetti();
  cart = [];
  updateCartUI();
  setTimeout(closeCart, 500);
});

// ===== FLAVOR TABS =====
 $$('.flavor-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.flavor-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFlavor = tab.dataset.flavor;
    renderFlavorShowcase();
    // Change bottle color
    const f = FLAVORS[currentFlavor];
    $('#bottleBody').style.background = `linear-gradient(180deg,${f.color},${adjustColor(f.color,-40)},${adjustColor(f.color,-80)})`;
    $('#bottleLiquid').style.background = `linear-gradient(180deg,${f.color}99,${adjustColor(f.color,-40)}cc)`;
    const glow = document.querySelector('.bottle-glow');
    glow.style.background = `radial-gradient(circle,${f.color}4D,${adjustColor(f.color,30)}26,transparent 70%)`;
  });
});

function adjustColor(hex, amount) {
  hex = hex.replace('#','');
  let r = Math.max(0, Math.min(255, parseInt(hex.substr(0,2),16) + amount));
  let g = Math.max(0, Math.min(255, parseInt(hex.substr(2,2),16) + amount));
  let b = Math.max(0, Math.min(255, parseInt(hex.substr(4,2),16) + amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function renderFlavorShowcase() {
  const f = FLAVORS[currentFlavor];
  $('#flavorShowcase').innerHTML = `
    <div class="flavor-hero">
      <div class="flavor-hero-emoji">${f.emoji}</div>
      <h3 class="flavor-hero-name" style="color:${f.color}">${f.name}</h3>
      <p class="flavor-hero-desc">${f.desc}</p>
      <p style="color:${f.color};font-family:'Fredoka',sans-serif;font-size:1.1rem;font-weight:600">"${f.tagline}"</p>
    </div>`;
}

// ===== PRODUCTS =====
function renderProducts() {
  const colorMap = { blue:'#00B4FF', orange:'#FF6B00', pink:'#FF1493', green:'#7FFF00', red:'#FF4444', mixed:'#9B59B6' };
  $('#productsGrid').innerHTML = PRODUCTS.map(p => {
    const accent = colorMap[p.flavor] || colorMap.mixed;
    return `<div class="product-card" style="--card-accent:${accent}">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <span class="product-emoji">${p.emoji}</span>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.pack}</p>
      <div class="product-price">$${p.price.toFixed(2)} <span>/ pack</span></div>
      <button class="btn-add-cart" data-product-id="${p.id}" onclick="addToCart('${p.id}')">
        <iconify-icon icon="solar:bag-4-bold" width="16"></iconify-icon> Add to Cart
      </button>
    </div>`;
  }).join('');
}

// ===== 3D TILT EFFECT =====
function initTilt() {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

// ===== MAGNETIC BUTTONS =====
function initMagnetic() {
  $$('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px,${y * 0.2}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ===== HYDRATION CALCULATOR =====
const calcWeight = $('#calcWeight');
const calcDuration = $('#calcDuration');
const calcActivityBtns = $$('.calc-act-btn');
let activityLevel = 'low';

calcWeight.addEventListener('input', () => {
  $('#calcWeightVal').textContent = calcWeight.value + ' lbs';
});
calcDuration.addEventListener('input', () => {
  $('#calcDurationVal').textContent = calcDuration.value + ' hrs';
});
calcActivityBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    calcActivityBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activityLevel = btn.dataset.level;
  });
});

 $('#calcSubmit').addEventListener('click', () => {
  const weight = parseInt(calcWeight.value);
  const duration = parseInt(calcDuration.value);
  const multipliers = { low: 0.5, medium: 0.75, high: 1.0 };
  const baseOz = weight * 0.5;
  const totalOz = Math.round(baseOz * duration * multipliers[activityLevel]);
  const sticks = Math.max(1, Math.round(totalOz / 16));

  $('#calcOz').textContent = totalOz;
  $('#calcSticks').textContent = sticks;
  const levelNames = { low:'light', medium:'moderate', high:'intense' };
  $('#calcResultMsg').textContent = `For a ${weight}lb child with ${levelNames[activityLevel]} activity over ${duration} hour${duration>1?'s':''}, we recommend ${totalOz}oz of water with ${sticks} KDSportLyte stick${sticks>1?'s':''} for optimal hydration.`;

  $('#calcStep1').style.display = 'none';
  $('#calcResult').style.display = 'block';
  launchConfetti();
});

 $('#calcReset').addEventListener('click', () => {
  $('#calcStep1').style.display = 'block';
  $('#calcResult').style.display = 'none';
});

// ===== REVIEWS SLIDER =====
const reviewsTrack = $('#reviewsTrack');
const reviewCards = () => reviewsTrack.children;
let autoSlideTimer;

function getVisibleCards() {
  return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
}

function getMaxIndex() {
  return Math.max(0, reviewCards().length - getVisibleCards());
}

function slideReviews() {
  const cardWidth = reviewCards()[0] ? reviewCards()[0].offsetWidth + 20 : 360;
  reviewsTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  updateDots();
}

function updateDots() {
  const dotsContainer = $('#reviewDots');
  const maxIdx = getMaxIndex();
  dotsContainer.innerHTML = '';
  for (let i = 0; i <= maxIdx; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === reviewIndex ? ' active' : '');
    dot.addEventListener('click', () => { reviewIndex = i; slideReviews(); resetAutoSlide(); });
    dotsContainer.appendChild(dot);
  }
}

 $('#reviewPrev').addEventListener('click', () => {
  reviewIndex = Math.max(0, reviewIndex - 1);
  slideReviews(); resetAutoSlide();
});
 $('#reviewNext').addEventListener('click', () => {
  reviewIndex = Math.min(getMaxIndex(), reviewIndex + 1);
  slideReviews(); resetAutoSlide();
});

function autoSlide() {
  autoSlideTimer = setInterval(() => {
    reviewIndex = reviewIndex >= getMaxIndex() ? 0 : reviewIndex + 1;
    slideReviews();
  }, 4000);
}
function resetAutoSlide() { clearInterval(autoSlideTimer); autoSlide(); }

// Touch / Swipe
let touchStartX = 0;
reviewsTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
reviewsTrack.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) reviewIndex = Math.min(getMaxIndex(), reviewIndex + 1);
    else reviewIndex = Math.max(0, reviewIndex - 1);
    slideReviews(); resetAutoSlide();
  }
});

// ===== FAQ =====
 $$('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    $$('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== NEWSLETTER =====
 $('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#emailInput').value;
  if (email) {
    showToast(`🎉 Welcome to the family, ${email}!`);
    launchConfetti();
    $('#emailInput').value = '';
  }
});

// ===== CTA PARTICLES =====
function initCtaParticles() {
  const container = $('#ctaParticles');
  const colors = ['#00B4FF','#FF6B00','#FF1493','#7FFF00','#FFD700'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'cta-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '0';
    p.style.width = (4 + Math.random() * 8) + 'px';
    p.style.height = p.style.width;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (3 + Math.random() * 5) + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(p);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 80));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current.toLocaleString() + suffix;
  }, 25);
}

let countersAnimated = false;

// ===== SCROLL REVEAL =====
function initReveal() {
  const elements = $$('.benefit-card,.step-card,.review-card,.product-card,.nutrition-label,.nutrition-compare,.section-header,.calc-card,.calc-visual,.gallery-item,.compare-verdict,.cta-inner');
  elements.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}

// ===== BENEFIT BARS ANIMATION =====
function initBenefitBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.benefit-bar-fill');
        bars.forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  $$('.benefit-card').forEach(card => observer.observe(card));
}

// ===== COMPARE BARS ANIMATION =====
function initCompareBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.compare-fill');
        fills.forEach(fill => {
          setTimeout(() => { fill.style.width = fill.dataset.width; }, 500);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const compareSection = $('.nutrition-compare');
  if (compareSection) observer.observe(compareSection);
}

// ===== HERO COUNTERS =====
function initHeroCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounter($('#statKids'), 50000, '+');
        animateCounter($('#statFlavors'), 5);
        setTimeout(() => { $('#statSugar').textContent = '0g'; }, 500);
      }
    });
  }, { threshold: 0.5 });
  observer.observe($('#hero'));
}

// ===== SMOOTH SCROLL =====
 $$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV =====
function initActiveNav() {
  const sections = $$('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });
    $$('.nav-links a').forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
    });
  });
}

// ===== HERO BOTTLE PARALLAX =====
function initBottleParallax() {
  const bottle = $('#heroBottle');
  document.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 25;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    bottle.style.transform = `translate(${x}px,${y}px) rotateY(${x*0.3}deg) rotateX(${-y*0.3}deg)`;
  });
}

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCart(); hamburger.classList.remove('active'); mobileMenu.classList.remove('open'); }
});

// ===== TYPEWRITER =====
function initTypewriter() {
  const badge = $('#heroBadge');
  const texts = ['🏆 #1 Kids Electrolyte', '⚡ Zero Sugar Hydration', '🌈 5 Amazing Flavors', '💪 Pediatrician Approved'];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % texts.length;
    badge.style.opacity = 0;
    setTimeout(() => {
      badge.textContent = texts[idx];
      badge.style.opacity = 1;
    }, 300);
  }, 3000);
  badge.style.transition = 'opacity 0.3s';
}

// ===== RIPPLE ON CLICK =====
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;background:rgba(0,180,255,0.15);transform:translate(-50%,-50%);pointer-events:none;z-index:9997;transition:all 0.6s ease-out;`;
  document.body.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.style.width = '200px';
    ripple.style.height = '200px';
    ripple.style.opacity = '0';
  });
  setTimeout(() => ripple.remove(), 700);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderFlavorShowcase();
  renderProducts();
  createFloatingEmojis();
  initParticles();
  initTilt();
  initMagnetic();
  initReveal();
  initHeroCounters();
  initActiveNav();
  initBottleParallax();
  initTypewriter();
  initCtaParticles();
  initBenefitBars();
  initCompareBars();
  updateDots();
  autoSlide();
});