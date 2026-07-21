# Portfolio Animation System — Implementation Spec
### Target repo: `anshulghogre4/portfolio-2k26` (React Router v8 SSR · React 19 · Vite · Tailwind v4)

---

## 0. Agent Persona (paste this as your system/instruction prompt)

```
You are a senior front-end animation engineer with 10+ years shipping
production websites for agencies and studios — the kind of person who
has built hundreds of scroll-driven, motion-heavy sites and knows
exactly where GSAP, Motion, Anime.js, and Lenis each earn their place,
and where they conflict.

You are working inside an EXISTING React Router v8 (SSR/framework
mode) + React 19 + Vite + Tailwind v4 codebase. You do not rebuild the
site. You retrofit animation infrastructure into it, section by
section, following the rules and phase order in this document exactly.

Non-negotiables:
- Every animation must respect prefers-reduced-motion.
- Only animate GPU-cheap properties: transform, opacity, filter (avoid
  animating width/height/top/left directly — use transform instead).
- All GSAP/ScrollTrigger instances must be created inside useGSAP()
  or gsap.context() and cleaned up on unmount — this is an SSR app,
  window/document do not exist on the server.
- Only one library owns scroll physics: Lenis. GSAP ScrollTrigger
  reads position from Lenis, never the native scroll listener.
- Never let two libraries animate the same property on the same
  element at the same time.
- After each phase, run `npm run typecheck` and manually verify in
  the browser before moving to the next phase.

Work through the phases in Section 7 of this document in order. Do
not skip ahead. Confirm each phase is visually correct before starting
the next.
```

---

## 1. Current State Audit (already confirmed from the repo)

| Item | Status |
|---|---|
| Framework | React Router v8, SSR/framework mode (this matters — no `window` on server) |
| React | 19.2.7 |
| Styling | Tailwind v4 (`@tailwindcss/vite`) + inline `style={{}}` objects + `app/styles/global.css` / `animations.css` |
| Existing animation | CSS keyframes only: `.animate-fade-up`, `.animate-fade-in`, `.animate-float`, hover transitions on `.card`/`.pill` |
| `framer-motion` | Installed (`^12.42.2`) but **not imported anywhere** — dead dependency |
| Structure | Single route `app/routes/home.tsx`, 6 inline section components: Hero, About, Skills, Work, Projects, Contact |
| Hero | Text block (left) + glassmorphic image card with `Anshul_Ghogre.png` (right) — **this is your "face" element** |
| Background | `AnimatedBackground.tsx` — two blurred radial-gradient orbs, CSS-animated float |
| Nav | `Navbar.tsx` — fixed header, manual hover handlers, mobile drawer via `useState` |

---

## 2. Library Roles — Who Owns What

Do not let these overlap. Each library gets a strict lane:

| Library | Owns | Never used for |
|---|---|---|
| **Lenis** | Smooth scroll physics for the whole page (single instance in root) | Individual element animation |
| **GSAP + ScrollTrigger** | Scroll-scrubbed and pinned sequences: hero parallax/gaze-tracking, section pin/reveal, timeline choreography, `SplitText` headline reveals | Simple hover states, React component enter/exit |
| **Motion** (rebranded Framer Motion) | Component-level UI motion: route/section mount transitions, `AnimatePresence` for the mobile nav drawer, hover/tap micro-interactions on cards and buttons, layout animations | Scroll-scrubbed timelines (GSAP is more expressive here) |
| **Anime.js v4** | Small standalone flourishes: SVG path draw-ins (logo, icons), skill-pill stagger-in, number/counter animations, text-scramble effects | Page-level scroll orchestration |

**Rule of thumb the agent should apply per element:** if it moves *because you scrolled*, it's GSAP+Lenis. If it moves *because a component mounted/unmounted or you're hovering*, it's Motion. If it's a small self-contained decorative flourish, it's Anime.js.

---

## 3. Package Changes Required

```bash
# Remove the old package — it's been superseded
npm uninstall framer-motion

# Install the four target libraries + GSAP's React glue
npm install gsap @gsap/react motion animejs lenis
npm install -D @types/animejs
```

> **Note on Motion:** Framer Motion was rebranded to "Motion" in 2025. Do not import from `framer-motion` anymore — import from `motion/react`. If any old snippets or AI suggestions reference `framer-motion`, translate the import path.

> **Note on GSAP licensing:** GSAP (including ScrollTrigger and SplitText) is fully free as of 2026 — no club membership needed, no plugin restrictions.

---

## 4. Core Infrastructure (build this first, before touching any section)

### 4.1 `app/lib/lenis.ts` — smooth scroll singleton
Create a Lenis instance and drive it from a single `requestAnimationFrame` loop, synced to GSAP's ticker so ScrollTrigger and Lenis never fight over frame timing.

```ts
// app/lib/lenis.ts
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function initLenis() {
  if (typeof window === "undefined") return null; // SSR guard
  if (lenis) return lenis;

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  // Let ScrollTrigger recalc on Lenis scroll
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker instead of its own rAF loop —
  // this is what keeps ScrollTrigger and Lenis perfectly in sync
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}
```

### 4.2 `app/components/SmoothScrollProvider.tsx`
Mount this once in `root.tsx`, wrapping `{children}`.

```tsx
import { useEffect } from "react";
import { initLenis } from "~/lib/lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = initLenis();
    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Wire it into `root.tsx` inside the existing `<body>`, around `{children}` (between `<Navbar />` and `<Footer />` stays as-is — just wrap the whole body content).

### 4.3 `prefers-reduced-motion` guard
Create `app/lib/motionPrefs.ts`:

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

Every GSAP timeline and Anime.js animation must check this first and either skip or reduce to a simple opacity fade. Motion handles this automatically via its `useReducedMotion()` hook — use that in Motion components.

### 4.4 GSAP + React pattern — use `useGSAP`, not raw `useEffect`
Never write raw `gsap.to()` calls inside a plain `useEffect` in this codebase — always use the `useGSAP` hook from `@gsap/react`. It auto-scopes context and auto-cleans on unmount, which matters a lot in an SSR app with client-side hydration.

```tsx
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

function Example() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".fade-item", {
      opacity: 0,
      y: 24,
      stagger: 0.08,
      scrollTrigger: { trigger: scope.current, start: "top 80%" },
    });
  }, { scope });

  return <div ref={scope}>...</div>;
}
```

---

## 5. Hero Section — The Centerpiece (this is what you actually asked about originally)

You have a **real photo**, not an illustration — so the "face turns as you scroll" effect from your earlier reference sites should NOT be attempted as a literal head-turn (that needs an image sequence or a Rive/Lottie rig, which is out of scope for this pass). Here's the version that works beautifully with a static photo and reads as intentional, not gimmicky:

**5.1 Cursor-reactive tilt (Motion)** — on desktop, the glassmorphic image card subtly tilts toward the cursor (3D perspective tilt via `rotateX`/`rotateY`), like the card is "looking" at you. Use Motion's `useMotionValue` + `useTransform` + `useSpring` for buttery lag-free following.

**5.2 Scroll-linked parallax + reveal (GSAP + ScrollTrigger, scrubbed)** — as the user scrolls past the hero, scrub:
- The image card moves at a different speed than the text (parallax depth)
- A subtle scale-down + opacity fade as it exits
- The two background orbs (already in `AnimatedBackground.tsx`) drift at yet another speed — this is what sells the "depth" illusion that reads as the face "following" the scroll

**5.3 Headline text reveal (GSAP SplitText)** — split `profile.tagline` into characters/words and stagger them in on load. SplitText is now free with GSAP.

**5.4 Magnetic CTA buttons (Anime.js or Motion)** — the three hero buttons (`View Projects`, `Get in Touch`, `Download Resume`) get a small magnetic pull toward the cursor on hover — cheap, delightful, very "award-site."

Rough shape:

```tsx
// Hero image card — cursor tilt (Motion)
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

function TiltCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
    >
      {/* existing glassmorphic card JSX */}
    </motion.div>
  );
}
```

```ts
// Hero scroll parallax (GSAP, scrubbed via Lenis-synced ScrollTrigger)
useGSAP(() => {
  gsap.to(".hero-image-wrap", {
    yPercent: 15,
    scale: 0.92,
    opacity: 0.4,
    scrollTrigger: {
      trigger: ".hero-grid",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.to(".hero-grid > div:first-child", {
    yPercent: -10,
    scrollTrigger: {
      trigger: ".hero-grid",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
}, { scope: heroRef });
```

---

## 6. Section-by-Section Plan (beyond Hero)

| Section | Treatment |
|---|---|
| **Navbar** | Motion `AnimatePresence` for the mobile drawer (replace the current `display:none/flex` toggle with animated height/opacity). GSAP ScrollTrigger to shrink navbar height + increase blur past 100px scroll. |
| **About / Four Pillars** | GSAP ScrollTrigger stagger reveal — cards fade+rise in as the section enters (`start: "top 75%"`), staggered 80–120ms apart. |
| **Skills / Pills** | Anime.js stagger for the pill tags — quick scale+opacity pop-in, staggered by category as each category scrolls into view (trigger via ScrollTrigger `onEnter`, animate via Anime.js). |
| **Work / Experience** | GSAP timeline: a vertical progress line that draws itself (`stroke-dashoffset` or scaleY) as you scroll through the experience list, each entry fading in as the line reaches it — classic scrollytelling pattern. |
| **Projects** | Motion `whileHover`/`whileTap` on project cards (slight lift + border glow), plus GSAP ScrollTrigger stagger on entry, same as About. |
| **Contact** | Simple GSAP fade+rise on entry — this section doesn't need much, don't over-animate the CTA-adjacent content. |
| **Footer** | Leave mostly static — motion fatigue at the end of a page reads as noise, not polish. |

---

## 7. Implementation Phases (work through these in order)

- [ ] **Phase 0 — Setup:** Install packages (Section 3), remove `framer-motion`, create `lib/lenis.ts`, `lib/motionPrefs.ts`, `SmoothScrollProvider.tsx`. Wire provider into `root.tsx`. Verify smooth scroll works with zero broken layout (Lenis + `position: sticky` navbar is a common conflict — test it).
- [ ] **Phase 1 — Navbar:** Animated mobile drawer (Motion), scroll-shrink behavior (GSAP ScrollTrigger).
- [ ] **Phase 2 — Hero:** Cursor tilt on image card (Motion), scroll parallax on hero grid (GSAP scrubbed), SplitText headline reveal, magnetic CTA buttons.
- [ ] **Phase 3 — About:** Stagger reveal on the four pillars.
- [ ] **Phase 4 — Skills:** Anime.js stagger on pills, per category, triggered by scroll.
- [ ] **Phase 5 — Work:** Scroll-drawn progress line + staggered entry reveals.
- [ ] **Phase 6 — Projects:** Hover/tap micro-interactions (Motion) + entry stagger (GSAP).
- [ ] **Phase 7 — Contact/Footer:** Light entry fade only.
- [ ] **Phase 8 — QA pass:**
  - Test with `prefers-reduced-motion: reduce` enabled — confirm everything degrades to simple fades or is skipped.
  - Test on mobile viewport — Lenis smooth scroll should NOT be applied on touch devices by default (test performance; consider disabling Lenis smoothWheel behavior on mobile, native touch scroll is usually already smooth).
  - Run Lighthouse — check CLS didn't regress from any of the entry animations (use `opacity`/`transform` only, never animate layout-affecting properties).
  - Confirm no console warnings about GSAP context leaks or ScrollTrigger not refreshing after route changes.

---

## 8. Hard Rules Checklist (the agent must self-check against this before marking any phase done)

1. ❌ No `gsap.to()`/`gsap.from()` outside `useGSAP()` or `gsap.context()`.
2. ❌ No direct `window`/`document` access outside `useEffect`/`useGSAP` (SSR breaks otherwise).
3. ❌ No animating `width`, `height`, `top`, `left`, `margin` — use `transform`/`scale`/`translate` instead.
4. ❌ No duplicate scroll listeners — Lenis is the only thing listening to scroll; GSAP ScrollTrigger reads from Lenis's `scroll` event, not its own native listener.
5. ❌ No un-cleaned Anime.js instances — store the returned animation object and `.pause()`/revert it on unmount if the component can unmount mid-animation.
6. ✅ Every new animated component checks `prefers-reduced-motion` (via `useReducedMotion()` in Motion, or the shared `prefersReducedMotion()` helper for GSAP/Anime.js).
7. ✅ `ScrollTrigger.refresh()` is called after any layout-affecting async content loads (images, fonts) to avoid mistimed triggers.
8. ✅ Keep the existing CSS-keyframe fade-ups (`animate-fade-up` etc.) as the reduced-motion fallback layer — don't delete them, they become your degraded experience.

---

## 9. Optional Extras Worth Considering (not required, but you asked)

- **GSAP SplitText** — free now, use it for the hero headline and section titles (`h2`) instead of plain fade-ups. Big visual upgrade for very little effort.
- **`@gsap/react`'s `useGSAP`** — already included above; non-negotiable for this stack, not really "optional."
- **Lenis's `data-lenis-prevent`** — apply this attribute to any inner-scrollable element (e.g., a code block or dropdown) so Lenis doesn't hijack its scroll.
- **View Transitions API fallback** — React Router v8 supports `<Link viewTransition>` for native page-transition animation if you ever split this into multiple routes; not relevant yet since this is a single-page site, but worth knowing if you add a `/blog` or `/projects/:slug` route later.
