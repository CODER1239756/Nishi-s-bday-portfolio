# 🎂 Nishi Yadav — Birthday Website

A premium black-and-gold multi-page birthday website for Nishi Yadav,
built with Flask + vanilla HTML/CSS/JS.

---

## Project Structure

```
nishi_birthday/
├── app.py                   ← Flask server
├── requirements.txt
├── templates/
│   ├── base.html            ← Shared nav, cursor, fonts
│   ├── index.html           ← Home + countdown + unlock button
│   ├── about.html           ← Her story + timeline
│   ├── hobbies.html         ← Badminton, Anime, Movies, Cooking
│   ├── gallery.html         ← Masonry photo grid + lightbox
│   └── secret.html          ← Birthday experience (standalone)
└── static/
    ├── css/
    │   ├── base.css         ← Shared styles, nav, cursor
    │   ├── home.css
    │   ├── about.css
    │   ├── hobbies.css
    │   └── gallery.css
    │   └── secret.css
    └── js/
        ├── base.js          ← Cursor, nav, scroll reveal
        ├── photos.js        ← Base64-encoded photos (auto-generated)
        ├── home.js          ← Countdown + particles
        ├── gallery.js       ← Masonry + lightbox
        └── secret.js        ← Full birthday experience flow
```

---

## Setup

### 1. Install Python dependencies

```bash
pip install flask
# or
pip install -r requirements.txt
```

### 2. Run the server

```bash
cd nishi_birthday
python app.py
```

### 3. Open in browser

```
http://localhost:5000
```

---

## Pages

| Route      | Description                              |
|------------|------------------------------------------|
| `/`        | Home page with countdown timer           |
| `/about`   | Her story, traits, and timeline          |
| `/hobbies` | Badminton, Anime, Movies, Cooking        |
| `/gallery` | Masonry photo grid with lightbox         |
| `/secret`  | Full birthday experience (unlocks Sept 15) |

---

## Secret Experience Flow

The **"Open Birthday Experience"** button unlocks automatically at
**midnight on September 15** (her birthday). It leads through:

1. **Intro Animation** — Emotional particle scene with staggered text
2. **Birthday Letter** — Animated envelope that opens to reveal her letter
3. **Cake Scene** — 3-layer CSS cake; blow into mic (or click) to extinguish the candle + confetti burst
4. **Memory Lane** — Horizontal scrollable photo strip of all gallery photos

---

## Design

- **Theme:** Black × Gold, premium editorial
- **Fonts:** Cormorant Garamond (display) + DM Sans (body) + Pinyon Script (accents)
- **Photos:** All embedded as base64 in `photos.js` (fully self-contained)
- **Animations:** Custom cursor, gold particles, scroll reveal, confetti

---

## Notes

- To test the secret experience before Sept 15, visit `/secret` directly
- The mic-blow feature requests microphone permission in the browser
- Works best in Chrome/Edge/Firefox; Safari may have mic API limitations
