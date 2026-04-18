/* secret.js — Birthday experience controller */

// ══════════════════════════
//  CURSOR
// ══════════════════════════
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ══════════════════════════
//  STEP MANAGER
// ══════════════════════════
let currentStep = 0;
const overlay = document.createElement('div');
overlay.className = 'step-overlay';
document.body.appendChild(overlay);

function goToStep(n) {
  overlay.classList.add('fade-in-cover');
  setTimeout(() => {
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    const next = document.querySelector(`[data-step="${n}"]`);
    if (next) {
      next.classList.remove('hidden');
      currentStep = n;
      // Trigger step setup
      if (n === 1) setupLetter();
      if (n === 2) setupCake();
      if (n === 3) setupMemories();
    }
    overlay.classList.remove('fade-in-cover');
  }, 500);
}

// ══════════════════════════
//  STEP 0 — INTRO
// ══════════════════════════
// Particles on canvas
const iCanvas = document.getElementById('intro-particles');
const iCtx    = iCanvas.getContext('2d');
let iW, iH, iParts = [];

function resizeIntro() {
  iW = iCanvas.width  = iCanvas.offsetWidth;
  iH = iCanvas.height = iCanvas.offsetHeight;
}
resizeIntro();
window.addEventListener('resize', resizeIntro);

class IPart {
  constructor() { this.reset(true); }
  reset(rand) {
    this.x = Math.random() * iW;
    this.y = rand ? Math.random() * iH : iH + 5;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.size = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.life = rand ? Math.floor(Math.random() * 200) : 0;
    this.maxLife = Math.random() * 250 + 120;
  }
  update() {
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
    this.a = this.alpha * Math.sin((this.life / this.maxLife) * Math.PI);
  }
  draw() {
    iCtx.beginPath();
    iCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    iCtx.fillStyle = `rgba(201,168,76,${this.a})`;
    iCtx.fill();
  }
}

for (let i = 0; i < 100; i++) iParts.push(new IPart());

function animIntro() {
  iCtx.clearRect(0, 0, iW, iH);
  iParts.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animIntro);
}
animIntro();

// Stagger lines
const lines = document.querySelectorAll('.intro-line');
const continueBtn = document.getElementById('introContinue');

lines.forEach((line, i) => {
  setTimeout(() => {
    line.classList.add('visible');
    // After last line, show continue button
    if (i === lines.length - 1) {
      setTimeout(() => {
        continueBtn.style.opacity = '1';
        continueBtn.style.pointerEvents = 'auto';
      }, 800);
    }
  }, 600 + i * 900);
});

continueBtn.addEventListener('click', () => goToStep(1));

// ══════════════════════════
//  STEP 1 — LETTER
// ══════════════════════════
function setupLetter() {
  // Inject photo
  const lp = document.getElementById('letterPhoto');
  if (lp && typeof LETTER_PHOTO !== 'undefined') {
    lp.style.backgroundImage = `url(${LETTER_PHOTO})`;
  }

  const env      = document.getElementById('envelope');
  const hint     = document.getElementById('envelopeHint');
  const letterTx = document.getElementById('letterText');
  const nextBtn  = document.getElementById('letterNext');

  function openEnvelope() {
    env.classList.add('open');
    hint.textContent = '✦ A letter, just for you';
    setTimeout(() => {
      letterTx.classList.add('visible');
      setTimeout(() => {
        nextBtn.style.display = 'inline-block';
      }, 1200);
    }, 700);
    env.removeEventListener('click', openEnvelope);
  }

  env.addEventListener('click', openEnvelope);
  nextBtn?.addEventListener('click', () => goToStep(2));
}

// ══════════════════════════
//  STEP 2 — CAKE
// ══════════════════════════
function setupCake() {
  const flame     = document.getElementById('candleFlame');
  const flameGlow = document.getElementById('flameGlow');
  const wishMsg   = document.getElementById('wishMessage');
  const blowHint  = document.getElementById('blowHint');
  let blown = false;

  function blowOut() {
    if (blown) return;
    blown = true;
    flame.classList.add('out');
    flameGlow.classList.add('out');
    blowHint.style.display = 'none';
    setTimeout(() => {
      wishMsg.style.display = 'flex';
      launchConfetti();
    }, 600);
  }

  // Click flame to blow
  document.getElementById('candleFlame').addEventListener('click', blowOut);
  document.getElementById('cakeWrap').addEventListener('click', blowOut);

  // Mic blow detection (Web Audio API)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioCtx  = new AudioContext();
        const analyser  = audioCtx.createAnalyser();
        const source    = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 512;
        const data = new Uint8Array(analyser.frequencyBinCount);
        let frames = 0;

        document.getElementById('micStatus').textContent = '🎤 Blow into your mic — or click the flame!';

        function detectBlow() {
          if (blown) { stream.getTracks().forEach(t => t.stop()); return; }
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          if (avg > 30) frames++;
          else frames = Math.max(0, frames - 1);
          if (frames > 4) blowOut();
          else requestAnimationFrame(detectBlow);
        }
        detectBlow();
      })
      .catch(() => {
        document.getElementById('micStatus').textContent = '🕯️ Click the flame to blow it out!';
      });
  } else {
    document.getElementById('micStatus').textContent = '🕯️ Click the flame to blow it out!';
  }

  document.getElementById('cakeNext')?.addEventListener('click', () => goToStep(3));
}

// ══════════════════════════
//  STEP 3 — MEMORIES
// ══════════════════════════
function setupMemories() {
  const strip = document.getElementById('memStrip');
  strip.innerHTML = '';

  GALLERY_PHOTOS.forEach((photo, i) => {
    const card = document.createElement('div');
    const rot  = (i % 2 === 0 ? 1 : -1) * (Math.random() * 1.5);
    card.className = 'mem-card';
    card.style.setProperty('--rot', rot + 'deg');

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = `Memory ${i + 1}`;
    img.loading = 'lazy';

    card.appendChild(img);
    strip.appendChild(card);

    // Stagger reveal
    setTimeout(() => card.classList.add('visible'), 200 + i * 100);
  });

  // Drag-to-scroll
  const wrap = document.querySelector('.mem-strip-wrap');
  let isDown = false, startX, scrollLeft;
  wrap.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => isDown = false);
  wrap.addEventListener('mouseup', () => isDown = false);
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Replay
  document.getElementById('replayBtn')?.addEventListener('click', () => goToStep(0));
}

// ══════════════════════════
//  CONFETTI
// ══════════════════════════
const confCanvas = document.getElementById('confettiCanvas');
const confCtx    = confCanvas.getContext('2d');
let confW, confH, confetti = [], confRunning = false;

function resizeConf() {
  confW = confCanvas.width  = window.innerWidth;
  confH = confCanvas.height = window.innerHeight;
}
resizeConf();
window.addEventListener('resize', resizeConf);

const COLORS = ['#C9A84C','#E8C96E','#8A6F2E','#F5F0E8','#fff'];

class Conf {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * confW;
    this.y = init ? Math.random() * confH * -1 : -(Math.random() * 20 + 10);
    this.w = Math.random() * 10 + 4;
    this.h = Math.random() * 6 + 2;
    this.vy = Math.random() * 4 + 2;
    this.vx = (Math.random() - 0.5) * 2;
    this.rot = Math.random() * Math.PI * 2;
    this.drot = (Math.random() - 0.5) * 0.15;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.8 + 0.4;
  }
  update() {
    this.y += this.vy;
    this.x += this.vx;
    this.rot += this.drot;
    if (this.y > confH + 10) this.reset(false);
  }
  draw() {
    confCtx.save();
    confCtx.globalAlpha = this.alpha;
    confCtx.translate(this.x, this.y);
    confCtx.rotate(this.rot);
    confCtx.fillStyle = this.color;
    confCtx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    confCtx.restore();
  }
}

function launchConfetti() {
  for (let i = 0; i < 120; i++) confetti.push(new Conf());
  confRunning = true;
  animConf();
}

function animConf() {
  if (!confRunning) return;
  confCtx.clearRect(0, 0, confW, confH);
  confetti.forEach(c => { c.update(); c.draw(); });
  // Stop after confetti falls off
  if (confetti.every(c => c.y > confH + 20)) {
    confRunning = false;
    confCtx.clearRect(0, 0, confW, confH);
    confetti = [];
    return;
  }
  requestAnimationFrame(animConf);
}
