/* home.js */

// ── INJECT HERO PHOTO ──
if (typeof HERO_PHOTO !== 'undefined') {
  document.getElementById('heroPhoto').style.backgroundImage = `url(${HERO_PHOTO})`;
}

// ── BIRTHDAY COUNTDOWN ──
// Target: Sept 14, 2026 at 23:59:59 (so it unlocks at midnight Sept 15)
function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  // If today is already past Sept 14, target next year
  const target = new Date(year, 8, 14, 23, 59, 59); // Month 8 = September
  if (now >= target) {
    target.setFullYear(year + 1);
  }
  return target;
}

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now    = new Date();
  const target = getNextBirthday();
  const diff   = target - now;

  if (diff <= 0) {
    // It's her birthday! Show the unlock button
    document.getElementById('countdown').style.display = 'none';
    document.getElementById('unlockWrap').style.display = 'block';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent  = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}

tick();
setInterval(tick, 1000);

// ── GOLD PARTICLES ──
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = -Math.random() * 0.6 - 0.2;
    this.size = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 150;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife) this.reset();
    // Fade in/out
    const p = this.life / this.maxLife;
    this.currentAlpha = this.alpha * Math.sin(p * Math.PI);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${this.currentAlpha})`;
    ctx.fill();
  }
}

// Create 80 particles
for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife; // stagger start
  particles.push(p);
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();
