# Anime.js v4 + Advanced Scroll — Deep-Dive Addendum
### Companion to ANIMATION_IMPLEMENTATION.md — read that first for architecture/rules

---

## 0. Important: Anime.js v4 changed its API completely

If your IDE agent has training data from Anime.js v3, it will write broken code. V4 dropped the old global `anime({...})` object entirely in favor of modular named exports. Give it this cheat sheet directly:

```ts
// OLD (v3) — do not use
anime({ targets: '.box', translateX: 250 });

// NEW (v4) — use this
import { animate, createTimeline, createScope, stagger, svg, text, utils } from 'animejs';

animate('.box', { translateX: 250, duration: 800, ease: 'outQuad' });
```

Key v4 exports and what they replace:

| v4 export | Purpose |
|---|---|
| `animate(target, params)` | Core animation function — replaces `anime()` |
| `createTimeline()` | Sequenced animations — replaces `anime.timeline()` |
| `createScope({ root })` | Scopes queries + auto-cleanup for React components — this is your `useGSAP` equivalent for Anime.js |
| `stagger(value, opts)` | Stagger utility — now accepts units directly (`stagger('1rem')`) and `reversed` instead of `direction` |
| `svg` module | Line drawing, motion paths, shape morphing |
| `text` module (`splitText`) | Splits text into chars/words/lines for stagger reveals |
| `createSpring({...})` | Spring-physics easing, usable as an `ease` value |
| `createDraggable({...})` | Drag/snap/flick interactions |
| `utils` | `random`, `round`, `set`, `get`, `remove`, `promisify` |

### The React-safe pattern — use `createScope`, always

Exactly like `useGSAP` for GSAP, wrap every Anime.js usage in a component in `createScope`. This auto-reverts animations and removes listeners on unmount — critical in your SSR/hydration setup.

```tsx
import { useEffect, useRef } from 'react';
import { createScope, animate, stagger, type Scope } from 'animejs';

function AnimatedPills({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate('.pill', {
        opacity: [0, 1],
        scale: [0.85, 1],
        delay: stagger(60),
        duration: 500,
        ease: 'outBack',
      });
    });
    return () => scope.current?.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
```

---

## 1. Anime.js — Mapped to Your Actual Components

### 1.1 Skills pills — stagger pop-in, per category (`SkillsSection`)
Your `skillCategories.map(...)` already renders `.pill` spans. Trigger this with GSAP ScrollTrigger's `onEnter` per category block (GSAP watches scroll, Anime.js does the flourish — this is the two libraries collaborating cleanly):

```ts
skillCategories.forEach((cat, i) => {
  ScrollTrigger.create({
    trigger: `#skill-cat-${cat.id}`,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      animate(`#skill-cat-${cat.id} .pill`, {
        opacity: [0, 1],
        translateY: [12, 0],
        scale: [0.9, 1],
        delay: stagger(40),
        duration: 450,
        ease: 'outQuad',
      });
    },
  });
});
```
(Add `id={`skill-cat-${cat.id}`}` to the category wrapper div in `SkillsSection`.)

### 1.2 Certification & education cards — flip-in reveal (`certs-grid`)
Your cert cards already have badges/logos. A subtle 3D flip-in on scroll entry reads well for credential cards specifically:

```ts
animate('.certs-grid .card', {
  rotateY: [-15, 0],
  opacity: [0, 1],
  delay: stagger(80, { from: 'first' }),
  duration: 600,
  ease: createSpring({ stiffness: 120, damping: 14 }),
});
```

### 1.3 Rotating role labels — text scramble (`Hero`, `profile.roles`)
You render `{profile.roles.join(' · ')}` as a static line. A far more "award-site" treatment: cycle through each role one at a time with a scramble/decode effect using the `text` module.

```ts
import { text, animate } from 'animejs';

const split = text.split('.role-text', { chars: true });
let i = 0;
function cycleRole() {
  animate(split.chars, {
    opacity: [1, 0],
    translateY: [0, -8],
    delay: stagger(15),
    duration: 200,
    onComplete: () => {
      i = (i + 1) % profile.roles.length;
      // swap textContent here, then re-split + fade back in
    },
  });
}
```
This is more work than a straight fade — only do it if you want the hero to feel genuinely dynamic rather than just decorated. Given your headline already communicates the role via `profile.tagline`, treat this as optional polish, not required.

### 1.4 Work section — the "→" bullet arrows (`WorkSection`)
Small but effective: stagger the arrow-prefixed `exp.highlights` list items in with a slight horizontal slide, so each bullet feels like it's being "typed out" as you scroll to that job entry.

```ts
animate(`#exp-${exp.id} li`, {
  opacity: [0, 1],
  translateX: [-10, 0],
  delay: stagger(70),
  duration: 400,
});
```

### 1.5 Project card tech pills — same pop-in as skills, reused
Reuse the exact 1.1 pattern on `.projects-grid .pill` — consistency between Skills and Projects pill treatment is good design discipline, not laziness.

### 1.6 Nav logo — one-time SVG or text draw-in on first load
If you ever convert "Anshul Ghogre" in the navbar to an inline SVG wordmark, Anime's `svg` module can draw the stroke on mount:

```ts
import { svg, animate } from 'animejs';
const drawable = svg.createDrawable('#logo-path');
animate(drawable, { draw: ['0 0', '0 1'], duration: 900, ease: 'inOutQuad' });
```
Not required with plain text — mention it as a future upgrade path if you commission/create an SVG wordmark.

### 1.7 Contact cards — magnetic hover pull
A cheap, satisfying detail on the four `ContactCard` elements: nudge the card slightly toward the cursor on hover.

```ts
function useMagnetic(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      animate(el, {
        translateX: (e.clientX - r.left - r.width / 2) * 0.15,
        translateY: (e.clientY - r.top - r.height / 2) * 0.15,
        duration: 300,
        ease: 'outQuad',
      });
    };
    const onLeave = () => animate(el, { translateX: 0, translateY: 0, duration: 400, ease: 'outElastic(1, .6)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref]);
}
```
Apply this same hook to the hero CTA buttons too — one reusable hook, several places.

---

## 2. More GSAP + ScrollTrigger Variety (beyond what was in the main spec)

### 2.1 Horizontal scroll for Projects (optional, high-impact)
Instead of a static 2-column grid, pin `ProjectsSection` and scroll the cards horizontally as the user scrolls vertically — a well-worn but still effective agency-site trick.

```ts
useGSAP(() => {
  const track = trackRef.current!;
  const scrollWidth = track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
    },
  });
}, { scope: sectionRef });
```
Caveat: this changes your layout structure (cards need `display: flex` in a wide track, not a CSS grid). Treat this as a bigger structural change, not a drop-in — flag it to yourself as its own phase if you want it.

### 2.2 Pinned Work timeline with scroll-drawn progress line
Pin `WorkSection` while a vertical line's `scaleY` scrubs from 0→1 in sync with scroll, and each experience card's opacity ties to the line reaching it:

```ts
useGSAP(() => {
  gsap.to('.work-progress-line', {
    scaleY: 1,
    transformOrigin: 'top',
    ease: 'none',
    scrollTrigger: {
      trigger: workSectionRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
  });
}, { scope: workSectionRef });
```

### 2.3 Section-to-section background color/theme shift
Tie a CSS custom property (e.g., `--accent-tint`) to overall page scroll progress, so the ambient glow color drifts subtly as you move from section to section — cheap, avoids the "static forever" feel without being distracting.

```ts
ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const hue = 200 + self.progress * 80; // shifts blue → violet
    document.documentElement.style.setProperty('--accent-tint', `hsl(${hue}, 70%, 55%)`);
  },
});
```

### 2.4 Reading-progress bar
A thin fixed bar at the very top of the viewport (under or replacing part of the navbar) that fills as you scroll — trivial with Lenis + GSAP together:

```ts
lenis.on('scroll', ({ progress }: { progress: number }) => {
  gsap.set('.scroll-progress-bar', { scaleX: progress });
});
```

### 2.5 Nav-link scroll-to via Lenis (replace raw `<a href="#section">`)
Your `Navbar` currently uses plain anchor hrefs. Route them through Lenis instead so the smooth-scroll duration/easing is consistent with the rest of the page, and you get a completion callback for free (e.g., to close the mobile drawer only after scroll finishes):

```ts
function handleNavClick(e: React.MouseEvent, href: string) {
  e.preventDefault();
  getLenis()?.scrollTo(href, { offset: -64 }); // offset for fixed navbar height
}
```

---

## 3. More Lenis Techniques Worth Knowing

| Technique | Why it matters here |
|---|---|
| `lenis.stop()` / `lenis.start()` | Pause smooth scroll while the mobile nav drawer is open, so background content doesn't scroll under it — call `.stop()` on drawer open, `.start()` on close. |
| `data-lenis-prevent` attribute | Add to any future inner-scrollable element (a modal, an embedded code block) so Lenis doesn't hijack it. |
| `lenis.on('scroll', ({ progress }) => {...})` | Drives the reading-progress bar (2.4) and the theme-shift effect (2.3) — one source of truth for "how far down the page are we." |
| Disable smooth wheel on touch | Test disabling Lenis's `smoothWheel` on mobile — native touch scroll is often already smooth, and Lenis can occasionally fight momentum scrolling on iOS Safari. Feature-detect and conditionally construct Lenis without smoothing on touch devices if you notice jank. |

---

## 4. Suggested Priority If You Don't Do All of This At Once

1. Skills pills stagger (1.1) — highest visual payoff for lowest effort.
2. Hero magnetic buttons (reuse 1.7's hook) — small, immediately satisfying.
3. Reading progress bar (2.4) — trivial to add, looks intentional.
4. Work timeline scroll-drawn line (2.2) — this is the single most "premium agency site" feeling addition on the whole page.
5. Everything else, in whatever order interests you — none of it is load-bearing for the site to feel finished.

Skip 2.1 (horizontal projects scroll) unless you specifically want that agency-portfolio feel — it's the most structurally invasive change and the one most likely to hurt mobile UX if done carelessly.
