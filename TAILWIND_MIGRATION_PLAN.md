# Tailwind CSS Migration & UI Modernization Plan

## Table of Contents

1. [Current State](#1-current-state)
2. [Goals](#2-goals)
3. [New Design System](#3-new-design-system)
4. [Tailwind Setup (CRA)](#4-tailwind-setup-cra)
5. [Mobile App-Like Navigation](#5-mobile-app-like-navigation)
6. [Component Migration Priority](#6-component-migration-priority)
7. [Phase-by-Phase Execution](#7-phase-by-phase-execution)
8. [UI Modernization Details](#8-ui-modernization-details)
9. [Testing & Deployment](#9-testing--deployment)

---

## 1. Current State

| Metric | Value |
|---|---|
| Framework | CRA (react-scripts 5.0.1) + React 18 |
| Files extension | `.js` (not `.jsx`) |
| Page components | 28 pages |
| Shared components | 2 (Navbar, Footer) |
| CSS files | 52 files |
| Total CSS lines | ~10,177 |
| CSS approach | Component-scoped `.css` imports, CSS variables in `:root` |
| Breakpoints | 768px (tablet), 1024px (desktop), 1280px (large) |
| Navbar | Fixed top, hamburger → slide-in menu from left |
| Current palette | `#667eea` (indigo) / `#764ba2` (purple) gradient |

### Current CSS variable system (index.css)

```
--primary:     #667eea   (indigo)
--primary-dark:#764ba2   (purple)
--secondary:   #3b82f6   (blue)
--success:     #10b981   (green)
--danger:      #ef4444   (red)
--warning:     #f59e0b   (amber)
--gray-50...900           (standard gray scale)
```

### Routes (30 total)

```
PUBLIC:     /, /entreprises, /entreprises/:slug, /actualites, /actualites/:slug,
            /about, /contact, /faq, /comparateur, /login, /register,
            /forgot-password, /reset-password/:uidb64/:token,
            /verify-email/:uidb64/:token,
            /cgu, /politique-confidentialite, /mentions-legales

ACHETEUR:   /dashboard, /favoris, /alertes, /messages, /messages/:id,
            /notifications, /profil, /soumettre-avis

VENDEUR:    /dashboard, /publier, /modifier/:slug, /abonnement,
            /statistiques/:slug, /medias/:slug, /messages, /notifications, /profil

ADMIN:      /admin, /admin/temoignages, /admin/entreprises-publiees
```

---

## 2. Goals

1. **Migrate to Tailwind CSS** — replace 10K+ lines of custom CSS with utility classes
2. **Modernize the UI** — cleaner, more professional, app-like feel
3. **Mobile-app experience** — bottom tab bar, slide-out drawer, native-feeling transitions
4. **Keep mobile-first** — all changes start from 320px viewport
5. **New color palette** — fresh, modern, trustworthy (fintech-like)
6. **Zero functional regressions** — all routes, APIs, and logic stay identical

---

## 3. New Design System

### 3.1 Color Palette

Replace the indigo/purple gradient with a modern, trustworthy palette inspired by fintech/business platforms.

```js
// tailwind.config.js — theme.extend.colors
colors: {
  primary: {
    50:  '#eff6ff',   // lightest tint (backgrounds)
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',   // DEFAULT — buttons, links, active states
    600: '#2563eb',   // hover state
    700: '#1d4ed8',   // pressed/active
    800: '#1e40af',
    900: '#1e3a8a',   // darkest (headers on light bg)
    DEFAULT: '#3b82f6',
  },
  accent: {
    50:  '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',   // DEFAULT — highlights, featured badges
    600: '#c026d3',
    700: '#a21caf',
    DEFAULT: '#d946ef',
  },
  // Semantic colors (unchanged, already Tailwind-compatible)
  success: '#10b981',
  danger:  '#ef4444',
  warning: '#f59e0b',
  info:    '#3b82f6',
}
```

**Why this palette?**
- `primary` (blue `#3b82f6`): Trustworthy, business-appropriate, replaces the indigo/purple gradient
- `accent` (fuchsia `#d946ef`): Used sparingly for featured/premium badges, call-to-action highlights
- No gradients on primary surfaces — flat colors with subtle shadows look more modern
- The old `linear-gradient(135deg, #667eea, #764ba2)` is replaced by solid `primary-500` with optional `primary-600` hover

### 3.2 Typography

```js
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
},
fontSize: {
  // Use Tailwind defaults — they match the current scale almost exactly
}
```

- Add **Inter** font (Google Fonts) — modern, highly legible, designed for screens
- Current system font stack is the fallback

### 3.3 Shadows

```js
boxShadow: {
  'soft':    '0 2px 8px rgba(0,0,0,0.06)',
  'card':    '0 4px 12px rgba(0,0,0,0.08)',
  'floating':'0 8px 24px rgba(0,0,0,0.12)',
  'nav':     '0 2px 12px rgba(0,0,0,0.08)',
}
```

### 3.4 Border Radius

Use Tailwind defaults (`rounded-lg` = 8px, `rounded-xl` = 12px, `rounded-2xl` = 16px).
Current values map cleanly: `--radius` → `rounded-lg`, `--radius-md` → `rounded-xl`, `--radius-lg` → `rounded-2xl`.

### 3.5 Spacing

Use Tailwind defaults. Current CSS variables map directly:
`--spacing-xs` → `gap-1`, `--spacing-sm` → `gap-2`, `--spacing-md` → `gap-4`, etc.

---

## 4. Tailwind Setup (CRA)

CRA 5 supports Tailwind via PostCSS. No need to eject.

### Step 1: Install dependencies

```bash
cd frontend
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* palette from section 3.1 */ },
        accent:  { /* palette from section 3.1 */ },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        /* custom shadows from section 3.3 */
      },
    },
  },
  plugins: [],
}
```

### Step 3: Create `postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 4: Replace `src/index.css` with Tailwind directives

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep ONLY global resets that Tailwind doesn't cover */
html { scroll-behavior: smooth; }

/* Inter font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Keep keyframe animations that can't be expressed as utilities */
@keyframes shine { /* featured card shine effect */ }

/* Custom component classes for things too complex for pure utilities */
@layer components {
  .btn-primary { @apply bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors; }
  .btn-secondary { @apply bg-white text-primary-600 border-2 border-primary-500 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors; }
  .card { @apply bg-white rounded-xl shadow-card p-6; }
  .input { @apply w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors outline-none; }
  .badge { @apply inline-block px-3 py-1 rounded-full text-xs font-semibold; }
}
```

### Step 5: Add Inter font to `public/index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Step 6: Verify Docker build still works

The Dockerfile `COPY . .` → `npm run build` will include Tailwind. No Dockerfile changes needed.
Test: `docker build -t test-frontend frontend/`

---

## 5. Mobile App-Like Navigation

This is the biggest UX change. Replace the current top hamburger menu with a modern mobile-app pattern.

### 5.1 Mobile View (< 768px): Bottom Tab Bar + Slide-Out Drawer

```
┌─────────────────────────┐
│  [Logo]     [🔔] [👤]   │ ← Top bar (simplified, 56px)
├─────────────────────────┤
│                         │
│    Page Content         │
│    (scrollable)         │
│                         │
│                         │
├─────────────────────────┤
│ 🏠   📋   ➕   ❤️   ☰  │ ← Bottom tab bar (fixed, 64px)
└─────────────────────────┘
         Tab bar
```

**Bottom Tab Bar** (fixed, 5 items max):
- `Home` → `/`
- `Entreprises` → `/entreprises`
- `Publier` (center, elevated FAB-style) → `/publier` (vendeurs) or `/register` (guests)
- `Messages` → `/messages` (with unread badge)
- `Menu` → Opens full slide-out drawer

**Slide-Out Drawer** (opens from right, full-height, overlay):
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │  👤 User Name     │  │
│  │  user@email.com   │  │
│  │  ───────────────  │  │
│  │  📊 Dashboard     │  │
│  │  🔔 Notifications │  │
│  │  ⭐ Favoris       │  │
│  │  🔔 Mes Alertes   │  │
│  │  💳 Abonnement    │  │
│  │  📈 Statistiques  │  │
│  │  ───────────────  │  │
│  │  ℹ️ À Propos      │  │
│  │  📞 Contact       │  │
│  │  ❓ FAQ           │  │
│  │  ───────────────  │  │
│  │  🚪 Déconnexion   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Drawer behavior:**
- Slides in from right with overlay backdrop (tap backdrop to close)
- Smooth `transition-transform duration-300` animation
- Groups: Account, Tools, Info, Auth
- Role-based items (vendeur sees Abonnement/Statistiques, acheteur sees Favoris/Alertes)
- Closes on navigation

### 5.2 Desktop View (>= 768px): Clean Top Navigation

```
┌───────────────────────────────────────────────────┐
│ [Logo]  Home  Entreprises  Actualités  ...  [🔔] [👤] │
└───────────────────────────────────────────────────┘
```

- Horizontal nav bar, no hamburger
- Items visible based on auth state and role
- No bottom bar on desktop
- No slide-out drawer on desktop

### 5.3 New Component Structure

```
src/components/
  layout/
    AppLayout.js          ← wrapper: top bar + bottom bar + <Outlet/>
    TopBar.js             ← simplified top bar (logo + notification icons)
    BottomTabBar.js       ← mobile-only bottom navigation
    SideDrawer.js         ← mobile-only slide-out full menu
  Navbar.js               ← desktop-only top navigation (refactored)
  Footer.js               ← desktop-only footer
```

### 5.4 What to Remove

- **Footer on mobile**: Move key footer links into the slide-out drawer. Keep footer for desktop only (hidden on `< 768px`)
- **Hamburger animation CSS**: Replaced by slide-out drawer + bottom bar
- **Full menu in top bar on mobile**: Replaced by simplified top bar

### 5.5 Content Padding Adjustments

```css
/* Mobile: account for top bar (56px) + bottom tab bar (64px) */
.main-content {
  padding-top: 56px;    /* pb-14 */
  padding-bottom: 64px; /* pb-16 */
}

/* Desktop: only top bar (64px) */
@media (min-width: 768px) {
  .main-content {
    padding-top: 64px;
    padding-bottom: 0;
  }
}
```

---

## 6. Component Migration Priority

Ordered by: user-facing visibility first, then complexity.

### Tier 1 — Core Layout (do first, everything depends on these)

| # | Component | CSS Lines | Notes |
|---|---|---|---|
| 1 | `index.css` → `tailwind.css` | 145 | Global reset, CSS variables → Tailwind config |
| 2 | `App.css` | 20 | Main layout wrapper |
| 3 | `Navbar.js` → `TopBar.js` + `BottomTabBar.js` + `SideDrawer.js` | 222 | Full navigation restructure |
| 4 | `Footer.js` | 199 | Desktop-only after restructure |

### Tier 2 — High-Traffic Pages (visible to all users)

| # | Page | CSS Lines | Notes |
|---|---|---|---|
| 5 | `Home.js` | 758 | Landing page — hero, stats, cards, testimonials |
| 6 | `ListeEntreprises.js` | 391 | Search/browse results |
| 7 | `DetailEntreprise.js` | 691 | Most visited page (entreprise detail) |
| 8 | `Auth.css` (Login + Register) | 154 | First impression for new users |

### Tier 3 — User Dashboard Pages

| # | Page | CSS Lines | Notes |
|---|---|---|---|
| 9 | `Dashboard.js` | 439 | User dashboard |
| 10 | `Messages.js` + `ConversationDetail.js` | 242 + 304 | Messaging |
| 11 | `Notifications.js` | 363 | Notifications list |
| 12 | `Favoris.js` | 430 | Favorites |
| 13 | `Profil.js` | 248 | User profile |
| 14 | `Abonnement.js` | 707 | Subscription plans |

### Tier 4 — Vendeur/Pro Pages

| # | Page | CSS Lines | Notes |
|---|---|---|---|
| 15 | `PublierEntreprise.js` | 574 | Publish form |
| 16 | `Statistiques.js` | 443 | Stats charts |
| 17 | `GestionMedias.js` | 372 | Media management |
| 18 | `MesAlertes.js` | 355 | Alert management |

### Tier 5 — Admin Pages

| # | Page | CSS Lines | Notes |
|---|---|---|---|
| 19 | `AdminDashboard.js` | 405 | Admin panel |
| 20 | `AdminEntreprisesPubliees.js` | 367 | Admin entreprises |
| 21 | `AdminTemoignages.js` | 425 | Admin testimonials |

### Tier 6 — Info/Legal Pages (lowest priority)

| # | Page | CSS Lines | Notes |
|---|---|---|---|
| 22 | `About.js` | 272 | About page |
| 23 | `Contact.js` | 240 | Contact form |
| 24 | `FAQ.js` | 193 | FAQ accordion |
| 25 | `Comparateur.js` | 348 | Comparison tool |
| 26 | `SoumettreAvis.js` | 308 | Review submission |
| 27 | `Actualites.js` + `ActualiteDetail.js` | 219 + 198 | News |
| 28 | Legal pages (CGU, Politique, Mentions) | ~0 CSS (inline styles) | Text-heavy, minimal styling |

### Migration Approach Per Component

For each component, the process is:

1. **Open the `.js` file** — identify all `className="..."` references
2. **Replace classNames with Tailwind utilities** directly in JSX
3. **Delete the `.css` file import** from the JS file
4. **Delete the `.css` file** itself
5. **Test** the page visually (responsive at 320px, 768px, 1024px)
6. **Commit** with message: `refactor: migrate <ComponentName> to Tailwind`

Example transformation:
```jsx
// BEFORE
<div className="recent-card">
  <div className="recent-header">
    <h3>{entreprise.nom}</h3>
    <span className="recent-badge">{entreprise.secteur}</span>
  </div>
</div>

// AFTER
<div className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-primary-500 hover:shadow-floating hover:-translate-y-0.5">
  <div className="flex justify-between items-start gap-2.5 mb-4">
    <h3 className="text-lg text-gray-900 m-0 flex-1">{entreprise.nom}</h3>
    <span className="badge bg-primary-500 text-white">{entreprise.secteur}</span>
  </div>
</div>
```

---

## 7. Phase-by-Phase Execution

### Phase 0: Setup (1 session)
- [ ] Install Tailwind + PostCSS + Autoprefixer
- [ ] Create `tailwind.config.js` with new color palette
- [ ] Create `postcss.config.js`
- [ ] Replace `index.css` with Tailwind directives + custom `@layer components`
- [ ] Add Inter font to `index.html`
- [ ] Verify Docker build passes
- [ ] Commit: `feat: add Tailwind CSS configuration`

### Phase 1: Navigation Restructure (1-2 sessions)
- [ ] Create `src/components/layout/` directory
- [ ] Build `TopBar.js` (mobile: logo + bell + avatar; desktop: full nav)
- [ ] Build `BottomTabBar.js` (mobile only, 5 tabs, active states)
- [ ] Build `SideDrawer.js` (mobile only, slide from right, overlay)
- [ ] Update `App.js` to use new layout structure
- [ ] Delete old `Navbar.js` + `Navbar.css`
- [ ] Update `Footer.js` (hide on mobile via `hidden md:block`)
- [ ] Commit: `feat: mobile-app navigation with bottom tab bar and slide-out drawer`

### Phase 2: High-Traffic Pages (2-3 sessions)
- [ ] Migrate `Home.js` (hero, stats, featured, testimonials, CTA)
- [ ] Migrate `ListeEntreprises.js` (search, filters, grid)
- [ ] Migrate `DetailEntreprise.js` (gallery, info, contact)
- [ ] Migrate Login + Register pages
- [ ] Commit per page: `refactor: migrate <Page> to Tailwind`

### Phase 3: Dashboard Pages (2-3 sessions)
- [ ] Migrate Dashboard, Messages, Notifications, Favoris, Profil, Abonnement
- [ ] Commit per page

### Phase 4: Vendeur + Admin Pages (2-3 sessions)
- [ ] Migrate PublierEntreprise, ModifierEntreprise, Statistiques, GestionMedias, MesAlertes
- [ ] Migrate Admin pages
- [ ] Commit per page

### Phase 5: Info Pages + Cleanup (1 session)
- [ ] Migrate About, Contact, FAQ, Comparateur, SoumettreAvis, Actualites, Legal pages
- [ ] Remove any remaining unused CSS files
- [ ] Run full responsive test
- [ ] Commit: `refactor: complete Tailwind migration, remove all legacy CSS`

**Total estimated time: 7-10 focused sessions**

---

## 8. UI Modernization Details

### 8.1 Cards

```
BEFORE:  border: 2px solid var(--gray-200); border-radius: var(--radius-lg); box-shadow: var(--shadow);
AFTER:   className="bg-white rounded-2xl shadow-card border border-gray-100"
```

- Subtle border (`border-gray-100` instead of `border-2 border-gray-200`)
- Soft shadow instead of sharp border
- Rounded corners (`rounded-2xl` = 16px for cards)
- Hover: `hover:shadow-floating hover:-translate-y-1 transition-all duration-300`

### 8.2 Buttons

```
BEFORE:  padding: 14px 28px; border-radius: var(--radius-full); background: white; color: var(--primary);
AFTER:   className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:scale-95 transition-all"
```

- Remove pill shape (`rounded-full`) → use `rounded-xl` (12px) — more modern
- Add `active:scale-95` for tactile press feedback
- Primary buttons: solid `primary-500` → `primary-600` on hover
- Secondary buttons: `bg-white border border-primary-500 text-primary-600`

### 8.3 Forms / Inputs

```
BEFORE:  border: 2px solid var(--gray-300); border-radius: var(--radius); padding: 12px 16px;
AFTER:   className="input" (custom component class in @layer)
```

- Reduce border weight: `border` (1px) instead of `border-2`
- Focus ring: `focus:ring-2 focus:ring-primary-100 focus:border-primary-500`
- Smooth transition

### 8.4 Page Headers

Standardize all page headers with a reusable pattern:

```jsx
<div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-8 px-4 md:py-12">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold">Page Title</h1>
    <p className="text-primary-100 mt-2">Subtitle text</p>
  </div>
</div>
```

Note: Gradients are OK for page headers (large areas), just not for nav bars and buttons.

### 8.5 Loading States

Replace the current `min-height: 200px` spinner with a skeleton loader:

```jsx
<div className="space-y-4">
  <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
</div>
```

### 8.6 Empty States

Standardize empty states (no data, no results):

```jsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div className="text-6xl mb-4">{icon}</div>
  <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
  <p className="text-gray-500 mb-6">{message}</p>
  <button className="btn-primary">{actionLabel}</button>
</div>
```

### 8.7 Mobile Bottom Tab Bar Details

```jsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
  <div className="flex justify-around items-center h-16">
    {/* Each tab */}
    <Link to="/" className="flex flex-col items-center justify-center gap-1 flex-1 h-full">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium text-gray-500">Home</span>
    </Link>

    {/* Center FAB-style (Publier) */}
    <Link to="/publier" className="flex flex-col items-center justify-center -mt-4">
      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white text-xl">+</span>
      </div>
    </Link>
  </div>
</nav>
```

### 8.8 Slide-Out Drawer Details

```jsx
{/* Backdrop */}
<div
  className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  onClick={onClose}
/>

{/* Drawer */}
<aside
  className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 md:hidden transition-transform duration-300 shadow-floating overflow-y-auto ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
  {/* User header */}
  {/* Menu items grouped by section */}
  {/* Logout at bottom */}
</aside>
```

---

## 9. Testing & Deployment

### 9.1 Testing Checklist

After each phase, verify:

- [ ] **Responsive**: Test at 320px, 375px, 414px, 768px, 1024px, 1280px
- [ ] **All routes work**: Click through every route in App.js
- [ ] **Auth states**: Test as guest, acheteur, vendeur, admin
- [ ] **Bottom tab bar**: Correct active states, badges update, center button works
- [ ] **Side drawer**: Opens/closes smoothly, backdrop dismisses, closes on navigation
- [ ] **Forms**: All inputs, selects, textareas render and submit correctly
- [ ] **No console errors**: Check browser dev tools
- [ ] **Docker build**: `docker build` passes for frontend

### 9.2 Deployment Strategy

Use the existing CI/CD pipeline:

1. Work on a `feature/tailwind-migration` branch
2. Commit per-component (small, reviewable diffs)
3. Test locally with `docker compose -f docker-compose.local.yml up -d --build`
4. Merge to `main` when a phase is complete
5. Tag `dev0.6.0` → CI auto-builds and deploys

### 9.3 Rollback Plan

If issues arise after deployment:
- The old CSS files are in git history — can revert any single commit
- Tailwind and legacy CSS can coexist — partial migration is safe
- Each page migration is a separate commit — revert individual pages without affecting others

### 9.4 What Does NOT Change

- **Backend**: Zero changes to Django/DRF
- **API endpoints**: All URLs remain identical
- **Services layer**: All 15 service files (`src/services/*.js`) untouched
- **Routing**: Same routes in App.js (only the layout wrapper changes)
- **Business logic**: All state management, form handling, API calls stay the same
- **Docker build**: Dockerfile structure unchanged (Tailwind is a build-time dependency)
- **CI/CD**: Workflows unchanged

---

## Appendix: File Inventory

### CSS files to migrate (52 files, ~10,177 lines)

```
index.css              145 lines  → Tailwind config + directives
App.css                 20 lines  → Tailwind classes in App.js
Navbar.css             222 lines  → New layout components
Footer.css             199 lines  → Footer.js inline Tailwind
Home.css               758 lines  → Home.js inline Tailwind
Abonnement.css         707 lines  → Abonnement.js inline Tailwind
DetailEntreprise.css   691 lines  → DetailEntreprise.js inline Tailwind
PublierEntreprise.css  574 lines  → PublierEntreprise.js inline Tailwind
Statistiques.css       443 lines  → Statistiques.js inline Tailwind
Dashboard.css          439 lines  → Dashboard.js inline Tailwind
Favoris.css            430 lines  → Favoris.js inline Tailwind
AdminTemoignages.css   425 lines  → AdminTemoignages.js inline Tailwind
AdminDashboard.css     405 lines  → AdminDashboard.js inline Tailwind
ListeEntreprises.css   391 lines  → ListeEntreprises.js inline Tailwind
GestionMedias.css      372 lines  → GestionMedias.js inline Tailwind
AdminEntreprisesPubliees.css 367  → AdminEntreprisesPubliees.js inline Tailwind
Notifications.css      363 lines  → Notifications.js inline Tailwind
MesAlertes.css         355 lines  → MesAlertes.js inline Tailwind
Comparateur.css        348 lines  → Comparateur.js inline Tailwind
SoumettreAvis.css      308 lines  → SoumettreAvis.js inline Tailwind
ConversationDetail.css 304 lines  → ConversationDetail.js inline Tailwind
About.css              272 lines  → About.js inline Tailwind
Profil.css             248 lines  → Profil.js inline Tailwind
Messages.css           242 lines  → Messages.js inline Tailwind
Contact.css            240 lines  → Contact.js inline Tailwind
Actualites.css         219 lines  → Actualites.js inline Tailwind
ActualiteDetail.css    198 lines  → ActualiteDetail.js inline Tailwind
FAQ.css                193 lines  → FAQ.js inline Tailwind
Auth.css               154 lines  → Login.js + Register.js inline Tailwind
Legal.css              146 lines  → Legal pages inline Tailwind
```

### JS files NOT changing (services — 15 files)

```
services/api.js, authService.js, entrepriseService.js, messagingService.js,
notificationService.js, favorisService.js, abonnementService.js, alerteService.js,
statistiquesService.js, mediaService.js, temoignageService.js, contactService.js,
actualiteService.js, adminService.js, paymentService.js
```
