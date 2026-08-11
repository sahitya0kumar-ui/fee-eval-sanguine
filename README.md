# 🩸 Sanguine — Smart Blood Donation Portal

> "Connecting Every Drop to Every Life."

A fully front-end, framework-free Blood Donation Portal built for **Front-End Engineering-II**. It connects donors, recipients, hospitals, and blood banks through one responsive web app — no backend, no build step, just HTML5, CSS3, and vanilla JavaScript with `localStorage` as the data layer.

---

## 1. Live structure

```
Sanguine/
├── index.html            Landing + Home (hero, stats, banks, timeline, testimonials, CTA)
├── about.html             Mission, values, project context
├── donor.html             Donor registration form + personal donation history
├── donors.html            Find Donor — search/filter by group, city, availability
├── request.html           Emergency blood request form + live request feed
├── bloodbanks.html        Partner blood bank directory
├── camps.html             Donation camps with seat-registration
├── compatibility.html     Interactive donor/recipient compatibility table
├── eligibility.html       Eligibility guidelines
├── dashboard.html         Impact dashboard — counters, charts, recent activity
├── gallery.html           Responsive photo-style gallery with hover captions
├── faq.html               Searchable FAQ accordion
├── contact.html           Contact form, emergency numbers, social links
├── login.html             Login + forgot-password UI
├── signup.html            Signup with password-strength meter
│
├── css/
│   ├── style.css          Design tokens, layout primitives, shared components
│   ├── forms.css          Form-specific patterns (blood-group picker, filters, meters)
│   ├── dashboard.css      Dashboard charts and tables
│   ├── animations.css     Keyframes, entrance & ambient motion
│   └── responsive.css     Fine-grained breakpoint tweaks
│
├── js/
│   ├── storage.js         localStorage data layer + demo data seeding
│   ├── validation.js      Reusable field validators + form-runner
│   ├── app.js             Shared shell: header/footer injection, nav, dark mode, toasts
│   ├── auth.js             Login / signup / forgot-password logic
│   ├── donor.js            Donor registration + history rendering
│   ├── search.js           Find Donor filtering
│   ├── request.js          Emergency request form + feed
│   └── dashboard.js        Counters + charts
│
├── images/ · icons/        Static assets (placeholders — see Gallery for demo tiles)
└── README.md
```

## 2. Design system

| Token | Value |
|---|---|
| Primary | `#D90429` |
| Primary Dark | `#8B0015` |
| Ink | `#1E1E1E` |
| Mist (surface) | `#F8F9FA` |
| Urgency accent | `#F2A93B` |
| Display type | Sora |
| Body type | Inter |

**Signature element:** a pulse/heartbeat line motif (`.pulse-rule`) ties the "life" theme through the hero, section dividers, and loading screen — reinforcing the brand without over-decorating the UI.

The system uses CSS custom properties for every color/spacing/radius value, CSS Grid + Flexbox for layout, glassmorphism on the sticky header, and a `body.dark` class toggle for dark mode.

## 3. Core functionality

- **Donor registration** → stored as a record in `bc_donors`, immediately searchable on Find Donor.
- **Find Donor** → live filtering by blood group, city, and availability (no page reload).
- **Blood Request** → posts to `bc_requests`; renders instantly in the live feed.
- **Blood Banks / Camps** → seeded directory data; camp registration increments seat counts live.
- **Compatibility** → click-to-highlight donor/recipient matrix, computed from a static compatibility map.
- **Dashboard** → animated counters, a CSS bar chart of donor blood-group distribution, and a live recent-requests table.
- **Auth (demo only)** → signup/login backed by `bc_users` in localStorage; **not secure** — this is a UI demonstration, not production authentication.
- **Cross-cutting**: form validation, toast notifications, dark mode, scroll-reveal animation, sticky nav with mobile hamburger, and a branded loading screen.

## 4. Development roadmap

1. **Phase 1 — Foundation**: design tokens, folder structure, shared header/footer shell, base CSS.
2. **Phase 2 — Core pages**: Home/Landing, About, Donor Registration, Find Donor.
3. **Phase 3 — Requests & directory**: Blood Request, Blood Banks, Camps.
4. **Phase 4 — Knowledge pages**: Compatibility, Eligibility, FAQ, Gallery.
5. **Phase 5 — Accounts & insight**: Login, Signup, Dashboard.
6. **Phase 6 — Polish**: animations, responsive QA across breakpoints, accessibility pass (focus states, semantic landmarks, alt/aria labels).

## 5. Running it

No build tools required — open `index.html` directly in a browser, or serve the folder with any static server:

```bash
npx serve Sanguine
```

## 6. Notes & limitations

- All data lives in the browser's `localStorage`; clearing site data resets the demo.
- Authentication is illustrative only — passwords are stored in plain text for demo purposes and must never be implemented this way in production.
- Google Fonts (Sora, Inter) are loaded via CDN and require an internet connection.
