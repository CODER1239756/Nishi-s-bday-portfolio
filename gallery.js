/* gallery.js */

const grid = document.getElementById('masonryGrid');
let currentIdx = 0;

// ── BUILD MASONRY GRID ──
GALLERY_PHOTOS.forEach((photo, i) => {
  const item = document.createElement('div');
  item.className = 'masonry-item';
  item.dataset.index = i;

  const img = document.createElement('img');
  img.src = photo.src;
  img.alt = `Nishi — photo ${i + 1}`;
  img.loading = 'lazy';

  img.onload = () => {
    setTimeout(() => item.classList.add('loaded'), i * 80);
  };

  item.appendChild(img);
  item.addEventListener('click', () => openLightbox(i));
  grid.appendChild(item);
});

// ── LIGHTBOX ──
const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');

function openLightbox(idx) {
  currentIdx = idx;
  lbImg.src = GALLERY_PHOTOS[idx].src;
  lbCounter.textContent = `${idx + 1} / ${GALLERY_PHOTOS.length}`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}

function prev() {
  currentIdx = (currentIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  lbImg.style.animation = 'none';
  lbImg.offsetHeight; // reflow
  lbImg.style.animation = '';
  lbImg.src = GALLERY_PHOTOS[currentIdx].src;
  lbCounter.textContent = `${currentIdx + 1} / ${GALLERY_PHOTOS.length}`;
}

function next() {
  currentIdx = (currentIdx + 1) % GALLERY_PHOTOS.length;
  lbImg.style.animation = 'none';
  lbImg.offsetHeight;
  lbImg.style.animation = '';
  lbImg.src = GALLERY_PHOTOS[currentIdx].src;
  lbCounter.textContent = `${currentIdx + 1} / ${GALLERY_PHOTOS.length}`;
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', prev);
document.getElementById('lbNext').addEventListener('click', next);

// Click backdrop to close
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  prev();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'Escape')     closeLightbox();
});

// Touch swipe
let touchStartX = 0;
lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > 50)  prev();
  if (dx < -50) next();
});
