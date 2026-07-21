# Portfolio Revamp — CHANGELOG

> **Repo:** `anshulghogre4/portfolio-2k26`
> **Stack:** React Router v8 · React 19 · Vite · TypeScript · Vanilla CSS
> **Owner:** Anshul Ghogre — Applied AI Engineer / FDE
> **Last Updated:** 2026-07-21

---

## Quick Context for a Fresh Agent

This is a **single-page portfolio** built with **React Router v8 in framework (SSR) mode**, running SPA mode for static deployment. It renders one route (`app/routes/home.tsx`) that composes six section components:

```
Hero → About → Work (Experience) → Projects → Skills → Contact
```

The `root.tsx` wraps everything in a `SmoothScrollProvider` that boots **Lenis** smooth scroll globally. GitHub Actions CD pipeline deploys the static build on every push to `main`.

---

## [v1.0.0] — Initial Commit

**Commit:** `1343ac5 first commit`

### What Was Built
- Full single-page portfolio scaffolded from scratch with React Router v8 framework mode.
- Core data files under `app/data/`:
  - `profile.ts` — name, tagline, heroStatement, roles, social links
  - `projects.ts` — featured projects with techStack, description
  - `skills.ts` — skillCategories with id, name, and skill pills
  - `experience.ts` — work history with highlights, period, location, techStack
  - `certifications.ts` — certs and education entries

### Design System (`app/styles/global.css`)
- **Dark minimalist tokens:**
  - Background: `#0a0a0a` (primary), `#111111` (secondary), `#161616` (card)
  - Text: `#f5f5f5` → `#a0a0a0` → `#666666`
  - Accents: `--accent-blue: #3b82f6`, `--accent-purple: #a855f7`, `--accent-green`, `--accent-amber`, `--accent-cyan`
- **Typography:** `Inter` (body) + `JetBrains Mono` (code/labels) via Google Fonts
- **Responsive `--section-gap`:** 160px → 100px → 80px at breakpoints
- **Fluid type scale:** `clamp()` for h1/h2/h3
- `.section-label` — monospace uppercase with `// ` prefix in accent blue
- `::selection` — blue accent background

### Components Created
| Component | Purpose |
|---|---|
| `Navbar.tsx` | Fixed header, desktop nav links, Resume button |
| `AnimatedBackground.tsx` | Two blurred radial-gradient CSS orbs with float animation |
| `Footer.tsx` | Simple dark footer with copyright |
| `GlassCard.tsx` | Reusable glassmorphic card wrapper |
| `TerminalBlock.tsx` | Monospace code-style display block |

### CSS Animations (`animations.css`)
- `@keyframes fade-up` — `opacity: 0, translateY(24px)` → visible
- `@keyframes fade-in` — opacity only
- `.animate-fade-up`, `.animate-fade-in` utility classes
- `.delay-1` through `.delay-4` — 100ms–400ms stagger delays
- Responsive media queries for all section layouts

### Infrastructure
- `Dockerfile` — multi-stage Node build for container deployment
- `.gitignore`, `.dockerignore` — standard ignores
- `react-router.config.ts` — framework mode config
- `vite.config.ts` — Tailwind v4 plugin wired
- `tsconfig.json` — strict TypeScript config

---

## [v1.1.0] — Profile Image & Project Data Fix

**Commit:** `fdef5d3 second commit`

- **Profile photo:** Replaced `Anshul_Image.jpg` (25KB) with `public/images/Anshul_Ghogre.png` (1.7MB high-res PNG).
- Removed `public/images/profile.jpg` (old duplicate).
- **Projects data restructured** (`app/data/projects.ts`): Added `problem`, `approach`, `result` structured fields per project. Cleaned schema.

---

## [v1.2.0] — Section Component Refactor

**Commit:** `28b9b4f third commit`

- Major refactor of `app/routes/home.tsx` (+45/-15 lines).
- Section components extracted from the monolithic home file into separate files under `app/components/`.
- Layout and spacing adjustments across sections.

---

## [v1.3.0] — Certifications & Education

**Commit:** `62bc88c fourth commit`

- `app/data/certifications.ts` expanded with more structured entries.
- Certifications/Education section wired into `SkillsSection`.
- Resume PDF updated in both root and `public/` (served at `/Anshul_Resume_FDE.pdf`).

---

## [v1.4.0] — CD Pipeline & SPA Mode

**Commit:** `80a5089 Add CD deployment pipeline and set SPA mode`

- **`.github/workflows/cd.yml` added** — GitHub Actions pipeline triggers on push to `main`, installs deps, builds, deploys via SSH/rsync.
- **`react-router.config.ts`** — switched to SPA mode (`ssr: false`) for static bundle output.

---

## [v1.5.0] — Navbar Revamp (Animated Mobile Drawer)

**Commit:** `0064161 fifth commit`

Major rewrite of `app/components/Navbar.tsx` (82 → ~250 lines):

- **Animated mobile drawer** via `AnimatePresence` from `motion/react`:
  - `height: 0 → auto`, `opacity: 0 → 1` on open; reverses on close
  - `transition={{ duration: 0.3, ease: 'easeInOut' }}`
- **GSAP ScrollTrigger scroll-shrink:**
  - Navbar height: `64px → 56px` past 100px scroll
  - Background: `rgba(10,10,10,0.85) → rgba(10,10,10,0.95)` (scrubbed)
- **Lenis integration:**
  - Nav clicks use `getLenis()?.scrollTo(href, { offset: -64 })`
  - Mobile menu open → `lenis.stop()` / close → `lenis.start()`

---

## [v1.6.0] — Favicon Update

**Commit:** `7760efa update favicon`

- Replaced `public/favicon.ico` (15KB ICO) with `public/favicon.png` (634KB custom PNG).
- `app/root.tsx`: `rel: "icon"` link updated to `type: "image/png"`, `href: "/favicon.png"`.

---

## [v1.7.0] — Cards Update: Data & Image Assets

**Commit:** `e54ca30 update cards`

- `app/data/certifications.ts` refined with institution logos.
- `app/data/skills.ts` reordered/refined categories.
- `app/routes/home.tsx` expanded (+143 lines) to support new card designs.
- **New image assets** added to `public/images/`:
  - `IITR.png` — IIT Roorkee logo
  - `cdac.png` — CDAC logo
  - `fde-logo.png` — FDE branding
  - `galgotias.png` — Galgotias University logo

---

## [v2.0.0] — Full Animation Revamp

**Date:** 2026-07-21 (current state)

This is the major revamp replacing the CSS-only system with a full multi-library animation stack.

---

### Library Role Segregation (Hard Rule)

| Library | Strict Role | Never Used For |
|---|---|---|
| **Lenis v1.3** | Smooth scroll physics — single global instance, GSAP ticker drives it | Element animation |
| **GSAP v3.15 + ScrollTrigger** | Scroll-scrubbed/pinned sequences, parallax, timeline choreography, SplitText | Simple hover states |
| **Motion v12** (rebranded Framer Motion) | Component UI: AnimatePresence mobile nav, whileHover/whileTap on cards | Scroll-scrubbed timelines |
| **Anime.js v4.5** | Flourishes: skill pill stagger, cert flip-ins, magnetic button hover | Page-level scroll orchestration |
| **Three.js v0.185** | WebGL particle sphere in hero background | — |
| **Web Audio API** | Procedural sound engine — zero audio files | — |

> **Decision rule:** Moves because you scrolled → GSAP+Lenis. Moves because component mounted/hover → Motion. Decorative standalone flourish → Anime.js.

---

### New Infrastructure

#### `app/lib/lenis.ts` — Smooth Scroll Singleton

```ts
export function initLenis(): Lenis | null  // creates instance once
export function getLenis(): Lenis | null   // retrieve from anywhere
```

Key implementation details:
- SSR guard: `if (typeof window === 'undefined') return null`
- GSAP ticker sync: `gsap.ticker.add((time) => lenis?.raf(time * 1000))` — Lenis driven by GSAP's ticker so ScrollTrigger stays perfectly in sync
- `gsap.ticker.lagSmoothing(0)` — precise Lenis timing
- `lenis.on('scroll', ScrollTrigger.update)` — ScrollTrigger recalculates on every Lenis event
- Config: `duration: 1.1, smoothWheel: true`

#### `app/lib/motionPrefs.ts` — Reduced Motion Guard

```ts
export function prefersReducedMotion(): boolean
// Returns false on server (SSR safe), checks matchMedia on client
```

Called at the top of every `useGSAP()` block and every Anime.js effect. If true, animations skip and `gsap.set(el, { autoAlpha: 1 })` makes content immediately visible.

#### `app/lib/audio.ts` — Procedural Audio Engine

Class-based `AudioEngine` singleton. Zero audio files — all generated via Web Audio API:

| Method | Sound Description |
|---|---|
| `audio.playHoverBeep()` | 800→1200Hz sine sweep, 150ms |
| `audio.startDrone()` | 60Hz sawtooth oscillator, 1s fade-in |
| `audio.stopDrone()` | Graceful gain ramp-down then stop |
| `audio.playExplode()` | 2s white noise burst through 1000→100Hz lowpass filter |
| `audio.unmute()` | `async` — resumes AudioContext (browser gesture requirement) |
| `audio.mute()` | Stops drone, sets `isMuted = true` |

Starts muted by default (`isMuted = true`). User opt-in via `SoundToggle`.

#### `app/components/SmoothScrollProvider.tsx`

```tsx
// Mounted once in root.tsx wrapping <Navbar>, {children}, <Footer>
export function SmoothScrollProvider({ children }: { children: React.ReactNode })
// initLenis() on mount, destroys on unmount
```

---

### New Components

#### `app/components/HeroWebGL.tsx` — Three.js Interactive Particle Sphere

Replaces the static glassmorphic photo card from v1.x.

**Scene Setup:**
- 2000 particles in a sphere (radius 3), colored by Y position: `#3b82f6` (blue) → `#a855f7` (purple) via `THREE.Color.lerp()`
- `THREE.PointsMaterial` with `AdditiveBlending + vertexColors: true` for additive glow

**Interactions:**
- **Mouse tracking:** `rotation.y/x += 0.05 * (targetX - current)` lerp toward cursor
- **Scroll parallax:** `particleMesh.position.y = -scrollY * 0.002`
- **Hold-to-blast:**
  - Mouse hold → GSAP tween `chargeProgress: 0→1` over 2s (`power2.in`)
  - While charging: particle size grows `0.05→0.15`, mesh scales up
  - Full charge: `playExplode()` + GSAP scale blast (`x/y/z: 10`, `expo.out` 0.5s) → snap back `elastic.out(1, 0.3)`
  - Mouse up cancels and resets gracefully
- **Hover beep:** `playHoverBeep()` when mouse moves >20px/frame

**Render loop:** `gsap.ticker.add(renderTick)` — shares the same tick as Lenis+ScrollTrigger.

**Full cleanup on unmount:** removes all event listeners, `gsap.ticker.remove()`, disposes geometry/material/renderer DOM element.

---

#### `app/components/SoundToggle.tsx` — Audio Control Button

- Fixed-position pill: `bottom: 24px; left: 24px`
- `lucide-react` icons: `<Volume2>` (on) / `<VolumeX>` (off)
- Glassmorphic style: `backdropFilter: blur(12px)`
- Calls `audio.unmute()` (async) or `audio.mute()` on toggle

---

#### `app/components/BlurTextReveal.tsx` — GSAP SplitText Cinematic Entrance

```tsx
<BlurTextReveal text="..." elementType="h1" delay={0.5} className="optional" />
```

- `new SplitText(ref, { type: "words,chars", charsClass: "blur-char" })`
- Animates each char: `opacity: 0→1`, `filter: blur(12px)→blur(0)`, `scale: 1.2→1`, `y: 20→0`
- `stagger: 0.03s`, `duration: 1.2s`, `ease: "power3.out"`
- ScrollTrigger: trigger when container hits `top 80%` viewport
- `clearProps: "filter,will-change"` on complete for GPU cleanup
- Used in Hero for: role text line (`delay: 0.1`) and `h1` tagline (`delay: 0.5`)

---

### Section-by-Section Changes

#### Hero (`app/components/Hero.tsx`)

| Feature | Detail |
|---|---|
| Background | `<HeroWebGL />` replaces CSS orbs (`AnimatedBackground`) |
| Sound control | `<SoundToggle />` fixed bottom-left |
| Role text | `<BlurTextReveal>` — `profile.roles.join(' · ')`, delay 0.1s |
| Tagline h1 | `<BlurTextReveal elementType="h1">`, delay 0.5s |
| Orb entrance | GSAP: `scale: 0.5→1`, `opacity: 0→1`, 2s, `power2.out` |
| Scroll parallax | `.hero-text-content` moves at `-10% Y`, GSAP scrubbed `scrub: 1` |
| Magnetic buttons | `useMagnetic('.magnetic-btn')` — Anime.js nudges `(cursor-center)*0.15px`, snaps back with `outElastic(1, 0.6)` |

Layout changed from 2-col (text + photo) to **centered single-column** — WebGL fills the full background.

Magnetic hook: fires only on `pointer: fine` + respects `prefersReducedMotion`.

---

#### Work / Experience (`app/components/Work.tsx`)

| Feature | Detail |
|---|---|
| Progress line | `.work-progress-line` `scaleY: 0→1`, `transformOrigin: top`, `scrub: true`, trigger `top 60% → bottom 80%` |
| Entry reveals | Each `.work-entry` `opacity: 0.2, x: 20 → 1, 0` (per-card scrubbed ScrollTrigger) |
| Timeline dots | Blue circle `border: 2px solid var(--accent-blue)`, left-aligned to line |
| Company logos | `<img>` 32×32px, white bg, `objectFit: contain` (activex, anar, optalitix) |

---

#### Projects (`app/components/Projects.tsx`)

| Feature | Detail |
|---|---|
| Horizontal scroll | Section `pin: true`. Track translates `-scrollDistance` on X as user scrolls vertically. `scrub: 1.5` |
| 3D ribbon wave | Cards alternate `y: ±50`, `rotationY: ±15`, `rotationZ: ±3` in sync with scroll. Container `perspective: 1500px` |
| SVG path draw | Sine-wave path behind cards. `strokeDashoffset` driven by GSAP scrub progress → Anime.js `animate()` per frame. Neon glow: `drop-shadow(0 0 12px rgba(56,189,248,0.8))` |
| Card design | 450×600px glassmorphic tiles. `linear-gradient(145deg, rgba(30,41,59,0.75)→rgba(15,23,42,0.95))`. Purple neon top-border, `Problem/Approach/Result` structured sections, category badge, tech pills |
| Motion hover | `whileHover={{ scale:1.03, y:-10, borderColor:'rgba(192,132,252,0.5)', boxShadow:... }}` spring `{ stiffness:300, damping:20 }` |

---

#### Skills (`app/components/Skills.tsx`)

| Feature | Detail |
|---|---|
| Pill stagger | ScrollTrigger `onEnter` per `#skill-cat-{id}` → Anime.js `animate('.pill', { opacity:[0,1], translateY:[12,0], scale:[0.9,1], delay:stagger(40), duration:450, ease:'outQuad' })` |
| Cert flip-in | `.certs-grid .card` animates `rotateY: [-15, 0]` with `createSpring({ stiffness:120, damping:14 })` |
| Institution logos | IITR.png, cdac.png, galgotias.png, fde-logo.png on cert/edu cards |
| Cleanup | All `createScope` instances stored in `animeScopes.current[]`, `.revert()` on unmount |

Two-library collaboration pattern: **GSAP watches scroll → Anime.js does the flourish**.

---

#### Contact (`app/components/Contact.tsx`)
- Light GSAP fade+rise on section entry — intentionally minimal near CTAs.

---

### CSS Changes

**`app/styles/global.css`:**
- `.js-hide` under `@media (scripting: enabled)`: `visibility: hidden; opacity: 0` — sections start invisible when JS is active. GSAP calls `gsap.set(el, { autoAlpha: 1 })` on mount.

**`app/styles/animations.css`:**
- `@keyframes marquee` — infinite horizontal marquee
- `.split-char, .blur-char` — `display: inline-block; will-change: transform, filter, opacity` — required for GSAP SplitText char animation
- `.card::after` — radial gradient spotlight glow at cursor position (uses `--mouse-x/y` CSS vars)
- Responsive breakpoint rules for all section layouts

---

### Dependency Changes (v1.x → v2.0)

| Package | Change | Version |
|---|---|---|
| `framer-motion` | **Removed** (superseded) | — |
| `motion` | **Added** (rebranded Framer Motion, import from `motion/react`) | `^12.42.2` |
| `gsap` | **Added** | `^3.15.0` |
| `@gsap/react` | **Added** | `^2.1.2` |
| `lenis` | **Added** | `^1.3.25` |
| `animejs` | **Added** | `^4.5.0` |
| `three` | **Added** | `^0.185.1` |
| `@types/three` | **Added** | `^0.185.1` |
| `lucide-react` | **Added** | `^1.25.0` |
| `@types/animejs` | **Added (dev)** | `^3.1.13` |

---

## Current File Map (v2.0 State)

```
f:/Preparation/Portfolio_FDE/
├── app/
│   ├── root.tsx                        # Layout shell: SmoothScrollProvider + Navbar + Footer + favicon
│   ├── routes/
│   │   ├── routes.ts                   # Single route: home → /
│   │   └── home.tsx                    # Composes Hero → About → Work → Projects → Skills → Contact
│   ├── components/
│   │   ├── Navbar.tsx                  # Fixed nav, GSAP shrink, Motion mobile drawer, Lenis scroll
│   │   ├── Hero.tsx                    # BlurTextReveal, GSAP parallax, Anime.js magnetic, WebGL + SoundToggle
│   │   ├── HeroWebGL.tsx               # Three.js particle sphere, hold-to-blast, audio integration
│   │   ├── SoundToggle.tsx             # Web Audio opt-in/out pill button (lucide-react icons)
│   │   ├── BlurTextReveal.tsx          # GSAP SplitText per-char blur entrance animation
│   │   ├── About.tsx                   # Four pillars (partial animation)
│   │   ├── Work.tsx                    # Timeline progress line + scrubbed entry reveals
│   │   ├── Projects.tsx                # Horizontal scroll ribbon + 3D wave + SVG path draw
│   │   ├── Skills.tsx                  # Anime.js pill stagger + cert flip-ins + edu logos
│   │   ├── Contact.tsx                 # Light fade entry, contact card links
│   │   ├── Footer.tsx                  # Static footer
│   │   ├── AnimatedBackground.tsx      # CSS orbs (in codebase, no longer in Hero)
│   │   ├── GlassCard.tsx               # Reusable glassmorphic card wrapper
│   │   ├── SmoothScrollProvider.tsx    # Lenis init/destroy lifecycle wrapper
│   │   └── TerminalBlock.tsx           # Monospace code block display
│   ├── data/
│   │   ├── profile.ts                  # name, tagline, heroStatement, roles, socials
│   │   ├── projects.ts                 # featuredProjects: title, problem, approach, result, techStack, slug, githubUrl
│   │   ├── skills.ts                   # skillCategories: id, name, skills[]
│   │   ├── experience.ts               # id, role, company, period, location, highlights, techStack, companyLogo
│   │   └── certifications.ts           # certifications + education with logos
│   ├── lib/
│   │   ├── lenis.ts                    # Smooth scroll singleton (initLenis, getLenis)
│   │   ├── motionPrefs.ts              # prefersReducedMotion() SSR-safe helper
│   │   └── audio.ts                    # Procedural Web Audio API engine (AudioEngine class)
│   └── styles/
│       ├── global.css                  # Design tokens, reset, layout, typography, js-hide
│       └── animations.css              # Keyframes, SplitText helpers, card glow, responsive
├── public/
│   ├── favicon.png                     # Custom PNG favicon
│   ├── Anshul_Resume_FDE.pdf           # Resume at /Anshul_Resume_FDE.pdf
│   └── images/
│       ├── Anshul_Ghogre.png           # Profile photo (1.7MB PNG)
│       ├── activex.png                 # Company logo
│       ├── anar.png                    # Company logo
│       ├── optalitix.png               # Company logo
│       ├── IITR.png                    # IIT Roorkee logo (education card)
│       ├── cdac.png                    # CDAC logo (certification card)
│       ├── galgotias.png               # Galgotias University logo
│       └── fde-logo.png                # FDE branding logo
├── ANIMATION_IMPLEMENTATION.md         # Detailed animation spec + agent persona instructions
├── ANIME_AND_SCROLL_DEEPDIVE.md        # Anime.js v4 API cheat sheet + advanced scroll patterns
├── CHANGELOG.md                        # This file
├── Anshul_Resume_FDE.pdf               # Resume root copy (mirrored to public/)
├── .github/workflows/cd.yml            # GitHub Actions CD (build + deploy on push to main)
├── .agents/skills/react-router/        # React Router v8 skill files for AI agent context
├── Dockerfile                          # Multi-stage Node build container
├── react-router.config.ts              # SPA mode (ssr: false)
├── vite.config.ts                      # Vite + Tailwind v4 plugin
└── package.json                        # Full dependency list (see changes table above)
```

---

## Critical Gotchas for the Next Agent

1. **Never call `gsap.to()` outside `useGSAP()`** — SSR app. Always use `useGSAP` from `@gsap/react`. It auto-scopes context and auto-cleans on unmount.

2. **`window`/`document` do not exist on the server** — guard everything with `typeof window === 'undefined'`. The `initLenis()`, `prefersReducedMotion()`, and `audio.init()` all do this already.

3. **Anime.js v4 API is completely different from v3** — use named exports ONLY:
   ```ts
   import { animate, stagger, createScope, createSpring } from 'animejs';
   // NEVER: anime({ targets: '.box', ... })  ← v3 API, does not exist in v4
   ```

4. **Import Motion from `motion/react`** — NOT `framer-motion`. The package was rebranded in 2025. `framer-motion` is uninstalled and will throw module-not-found.

5. **GSAP SplitText is free** — no Club GSAP membership required as of 2026. Import with `import { SplitText } from 'gsap/SplitText'` and `gsap.registerPlugin(SplitText)`.

6. **`.js-hide` + `autoAlpha` pattern** — every animated section MUST call this even if animations are skipped:
   ```ts
   gsap.set(sectionRef.current, { autoAlpha: 1 }); // Makes section visible
   // Without this, js-hide keeps it invisible forever
   ```

7. **`data-lenis-prevent`** — add this attribute to any inner-scrollable elements (modals, code blocks, dropdowns) to stop Lenis hijacking their scroll.

8. **Projects section is `pin: true`** — it takes up large scroll real estate. Scroll distance is calculated dynamically: `trackWidth - windowWidth + (windowWidth * 0.2)`. Mobile needs a fallback grid layout (not yet implemented).

9. **Audio starts muted** — `AudioEngine.isMuted = true` by default. `audio.unmute()` is `async` and calls `ctx.resume()` — must be triggered by a user gesture (browser policy).

10. **Lenis `stop()`/`start()` pattern** — the Navbar mobile menu calls these. Any future overlay/modal must do the same to prevent background scroll-through.

11. **Anime.js `createScope` cleanup** — always store the scope ref and call `.revert()` in the `useEffect` cleanup function. The Skills section shows the pattern: `animeScopes.current[]` array + `forEach(s => s.revert())` on unmount.

---

## What Is Still Pending

- [ ] `prefers-reduced-motion` QA pass — verify all sections degrade gracefully, no stranded `js-hide` invisible sections
- [ ] Mobile Projects fallback — horizontal scroll ribbon is desktop-only; need vertical card grid for mobile
- [ ] Mobile Lenis test — consider disabling `smoothWheel` on `pointer: coarse` touch devices (iOS Safari momentum scroll can conflict)
- [ ] About section full animation — four-pillar cards need GSAP stagger reveal treatment
- [ ] Contact section entry animation — light GSAP fade+rise, not yet added
- [ ] Reading progress bar — thin `scaleX: 0→1` bar at top, driven by `lenis.on('scroll', ({ progress }) => gsap.set('.progress-bar', { scaleX: progress }))`
- [ ] Theme color drift — `ScrollTrigger onUpdate` shifting `--accent-tint` hue (blue→violet) across page scroll
- [ ] Open Graph image — `og:image` meta tag missing from `home.tsx` meta function
- [ ] Lighthouse CLS audit — confirm no layout shift from SplitText splitting or horizontal scroll pin
- [ ] Blog / project detail routes — single-page only; React Router v8 ready for `/projects/:slug` with `<Link viewTransition>`
