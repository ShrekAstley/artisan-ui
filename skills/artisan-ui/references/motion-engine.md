# Motion Engine
Load when: adding, reviewing or tuning any animation, transition, micro-interaction, page transition, or procedural/generative visual (canvas, SVG, parallax).

## 1. Philosophy

Motion makes UI feel **responsive** (instant feedback), **deliberate** (nothing happens by accident), **physically coherent** (things come from somewhere and go somewhere).

Never animate everything. Every animation must answer "what does this communicate?" One of:

| Purpose | Example |
|---|---|
| Cause/effect | Button compresses on press; toggle thumb slides |
| Spatial continuity | Modal grows from its trigger; list item reorders instead of teleporting |
| State change | Skeleton -> content; success check draws in |
| Attention | Error field shakes once; new item pulses once |
| Delight-with-purpose | Brand moment on first load/empty state; ambient field that reflects app state |

No answer -> delete the animation. Ambient/looping effects need a purpose AND an off-switch (pause offscreen, reduced-motion).

## 2. Baseline tokens (defaults, always start here)

```js
export const motion = {
  duration: { instant: 80, fast: 140, normal: 220, deliberate: 360, expressive: 520 }, // ms
  easing: {
    standard: [0.2, 0, 0, 1],
    enter:    [0, 0, 0.2, 1],
    exit:     [0.4, 0, 1, 1],
    spring:   { stiffness: 320, damping: 28, mass: 0.8 },
  },
  stagger: { compact: 25, normal: 45, expressive: 75 }, // ms between children
};
```

```css
:root {
  --dur-instant: 80ms; --dur-fast: 140ms; --dur-normal: 220ms;
  --dur-deliberate: 360ms; --dur-expressive: 520ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  /* CSS spring approximation (overshoot ~6%) */
  --ease-spring: linear(0, 0.18 6%, 0.62 15%, 0.93 26%, 1.05 38%, 1.04 48%, 0.995 66%, 1);
  --stagger-compact: 25ms; --stagger-normal: 45ms; --stagger-expressive: 75ms;
}
```

These are **defaults, not law**. Adapt to:
- **Distance traveled**: ~+40ms per extra 100px beyond 100px; tiny moves (<16px) use `fast`.
- **Component size**: tooltip 140ms, dropdown 180-220ms, modal 260-360ms, full-page 360-520ms.
- **User prefs**: reduced motion (section 9).
- **Device performance**: low-end/battery saver -> drop to `fast`, no blur, fewer particles.
- **Exit faster than enter**: exit ~60-70% of enter duration, use `exit` easing.
- **Cap total stagger ~400ms**: `step = min(token, 400 / (n-1))`; beyond ~10 items stagger only the first visible ones.

```js
export const dur = (base, px = 0) => Math.round(base + Math.max(0, px - 100) * 0.4);
export const staggerStep = (token, n) => Math.min(token, 400 / Math.max(1, n - 1));
export const cssEase = (a) => `cubic-bezier(${a.join(",")})`;
```

## 3. Presets (pick one personality per project)

| Preset | Feel | duration normal | easing | stagger | overshoot | Use for |
|---|---|---|---|---|---|---|
| Precision | fast, restrained | 140 | [0.2,0,0,1] | 20 | 0% | dev tools, dashboards, pro apps |
| Smooth | calm, fluid | 260 | [0.4,0,0.2,1] | 45 | 0% | content, SaaS, editorial |
| Spring | alive, tactile | 280 | spring 320/28/0.8 | 45 | ~5% | consumer apps, mobile-like |
| Elastic | playful bounce | 420 | spring 260/14/0.9 | 60 | ~18% | games, kids, celebration |
| Cinematic | slow, weighty | 520 | [0.65,0,0.35,1] | 90 | 0% | marketing, portfolios, storytelling |
| Mechanical | snappy, linear-ish | 120 | [0.4,0,0.6,1] steps allowed | 15 | 0% | industrial/terminal/retro UI |
| Organic | soft, irregular | 340 | [0.3,0.1,0.2,1] | 70 (+/-20 jitter) | ~3% | wellness, nature, handmade brands |
| Expressive | bold, large moves | 380 | spring 220/18/1 | 75 | ~12% | creative tools, brand-forward |

```js
export const presets = {
  precision:  { duration: { instant: 60,  fast: 100, normal: 140, deliberate: 220, expressive: 300 }, easing: { standard: [0.2,0,0,1],     enter: [0,0,0.2,1],      exit: [0.4,0,1,1],   spring: { stiffness: 500, damping: 40, mass: 0.7 } }, stagger: { compact: 15, normal: 20, expressive: 30 } },
  smooth:     { duration: { instant: 100, fast: 180, normal: 260, deliberate: 400, expressive: 560 }, easing: { standard: [0.4,0,0.2,1],   enter: [0,0,0.2,1],      exit: [0.4,0,1,1],   spring: { stiffness: 260, damping: 30, mass: 1 } },   stagger: { compact: 30, normal: 45, expressive: 70 } },
  spring:     { duration: { instant: 80,  fast: 160, normal: 280, deliberate: 420, expressive: 600 }, easing: { standard: [0.2,0,0,1],     enter: [0,0,0.2,1],      exit: [0.4,0,1,1],   spring: { stiffness: 320, damping: 28, mass: 0.8 } }, stagger: { compact: 25, normal: 45, expressive: 75 } },
  elastic:    { duration: { instant: 100, fast: 220, normal: 420, deliberate: 600, expressive: 800 }, easing: { standard: [0.3,0,0.2,1],   enter: [0,0,0.2,1],      exit: [0.4,0,1,1],   spring: { stiffness: 260, damping: 14, mass: 0.9 } }, stagger: { compact: 35, normal: 60, expressive: 90 } },
  cinematic:  { duration: { instant: 140, fast: 280, normal: 520, deliberate: 800, expressive: 1100 }, easing: { standard: [0.65,0,0.35,1], enter: [0.22,1,0.36,1], exit: [0.64,0,0.78,0], spring: { stiffness: 120, damping: 26, mass: 1.4 } }, stagger: { compact: 50, normal: 90, expressive: 140 } },
  mechanical: { duration: { instant: 50,  fast: 80,  normal: 120, deliberate: 180, expressive: 260 }, easing: { standard: [0.4,0,0.6,1],   enter: [0.2,0,0.4,1],   exit: [0.6,0,0.8,1], spring: { stiffness: 600, damping: 60, mass: 0.6 } }, stagger: { compact: 10, normal: 15, expressive: 25 } },
  organic:    { duration: { instant: 100, fast: 200, normal: 340, deliberate: 520, expressive: 760 }, easing: { standard: [0.3,0.1,0.2,1], enter: [0.1,0.4,0.2,1], exit: [0.5,0,0.9,0.6], spring: { stiffness: 180, damping: 22, mass: 1.1 } }, stagger: { compact: 40, normal: 70, expressive: 110 } },
  expressive: { duration: { instant: 90,  fast: 180, normal: 380, deliberate: 560, expressive: 760 }, easing: { standard: [0.2,0,0,1],     enter: [0.05,0.7,0.1,1], exit: [0.3,0,0.8,0.15], spring: { stiffness: 220, damping: 18, mass: 1 } },   stagger: { compact: 35, normal: 75, expressive: 110 } },
};
```

CSS custom properties per preset (swap with `data-motion` on any ancestor, which also gives **per-component override**):

```css
:root, [data-motion="spring"] { --dur-fast:160ms; --dur-normal:280ms; --dur-deliberate:420ms; --ease-standard:cubic-bezier(.2,0,0,1); --stagger:45ms; }
[data-motion="precision"]  { --dur-fast:100ms; --dur-normal:140ms; --dur-deliberate:220ms; --ease-standard:cubic-bezier(.2,0,0,1); --stagger:20ms; }
[data-motion="smooth"]     { --dur-fast:180ms; --dur-normal:260ms; --dur-deliberate:400ms; --ease-standard:cubic-bezier(.4,0,.2,1); --stagger:45ms; }
[data-motion="elastic"]    { --dur-fast:220ms; --dur-normal:420ms; --dur-deliberate:600ms; --ease-standard:cubic-bezier(.34,1.56,.64,1); --stagger:60ms; }
[data-motion="cinematic"]  { --dur-fast:280ms; --dur-normal:520ms; --dur-deliberate:800ms; --ease-standard:cubic-bezier(.65,0,.35,1); --stagger:90ms; }
[data-motion="mechanical"] { --dur-fast:80ms;  --dur-normal:120ms; --dur-deliberate:180ms; --ease-standard:cubic-bezier(.4,0,.6,1); --stagger:15ms; }
[data-motion="organic"]    { --dur-fast:200ms; --dur-normal:340ms; --dur-deliberate:520ms; --ease-standard:cubic-bezier(.3,.1,.2,1); --stagger:70ms; }
[data-motion="expressive"] { --dur-fast:180ms; --dur-normal:380ms; --dur-deliberate:560ms; --ease-standard:cubic-bezier(.05,.7,.1,1); --stagger:75ms; }

/* component override: this one control is snappier than the page personality */
.toolbar { --dur-normal: 120ms; --ease-standard: cubic-bezier(.2,0,0,1); }
```

JS override: `const m = { ...presets.smooth, duration: { ...presets.smooth.duration, normal: 200 } }` (project level), and pass a per-component `opts` that spreads over `m`.

## 4. Technology ladder (smallest dependency that works)

CSS transitions/keyframes -> Web Animations API -> View Transitions API -> `motion` (React) -> GSAP -> Canvas/WebGL -> SVG.

| Need | Use | Install? |
|---|---|---|
| hover/press/focus/toggle, simple enter | CSS transition | no |
| Looping, multi-step, stagger via `animation-delay` | CSS keyframes | no |
| Imperative, interruptible, from JS, reverse/finish | WAAPI `el.animate()` | no |
| Page/route/shared-element morph | View Transitions API (+fallback) | no |
| React mount/unmount (`AnimatePresence`), layout animation, gestures, springs | `motion` package (`import { motion } from "motion/react"`) | only if React and exit/layout animations are core |
| Long scrubbable timelines, ScrollTrigger, SVG morph sequences | GSAP | only if >3 coordinated sequences or scroll-scrubbing |
| Thousands of elements, particles, fields | Canvas 2D (WebGL only if >~20k points) | no |
| Path/shape morph, line draw, crisp geometry | SVG | no |

Rules:
1. **Detect first**: read `package.json` (`motion`, `framer-motion`, `gsap`, `@react-spring/*`, `animejs`) and existing CSS tokens. Use what exists; match its idioms.
2. Never install multiple animation libs. Never install one "just in case".
3. A new dependency needs a one-line justification: what CSS/WAAPI cannot do here. `framer-motion` is the old name; new installs use `motion`.
4. Static/vanilla/artifact pages: CSS + WAAPI + Canvas only; no CDN animation lib unless essential.

## 5. Micro-interactions

```css
/* Button: press compression + hover elevation */
.btn { transition: transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard), background-color var(--dur-fast) var(--ease-standard); }
@media (hover: hover) { .btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -6px rgb(0 0 0 / .35); } }
.btn:active { transform: translateY(0) scale(.97); box-shadow: 0 1px 2px rgb(0 0 0 / .3); transition-duration: var(--dur-instant); }

/* Card hover elevation (pointer devices only) */
.card { transition: transform var(--dur-normal) var(--ease-standard), box-shadow var(--dur-normal) var(--ease-standard); }
@media (hover: hover) { .card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -14px rgb(0 0 0 / .4); } }

/* Toggle: thumb slides, track recolors (state also visible via position, not color alone) */
.switch { inline-size: 44px; block-size: 26px; border-radius: 13px; background: var(--track-off); position: relative; transition: background-color var(--dur-fast) var(--ease-standard); }
.switch::after { content: ""; position: absolute; inset: 3px auto 3px 3px; inline-size: 20px; border-radius: 50%; background: #fff; transition: transform var(--dur-normal) var(--ease-spring); }
.switch[aria-checked="true"] { background: var(--track-on); }
.switch[aria-checked="true"]::after { transform: translateX(18px); }

/* Input focus: label float + ring grows (ring uses outline, never removed) */
.field input { outline: 2px solid transparent; outline-offset: 0; transition: outline-color var(--dur-fast), outline-offset var(--dur-fast) var(--ease-standard), border-color var(--dur-fast); }
.field input:focus-visible { outline-color: var(--focus); outline-offset: 2px; }
.field label { transform-origin: left top; transition: transform var(--dur-fast) var(--ease-standard); }
.field input:focus + label, .field input:not(:placeholder-shown) + label { transform: translateY(-1.1em) scale(.8); }

/* Icon transformation: hamburger <-> close, chevron rotate */
.chev { transition: transform var(--dur-normal) var(--ease-standard); }
[aria-expanded="true"] > .chev { transform: rotate(180deg); }
.burger i { display: block; block-size: 2px; background: currentColor; transition: transform var(--dur-normal) var(--ease-standard), opacity var(--dur-fast); }
.burger[aria-expanded="true"] i:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.burger[aria-expanded="true"] i:nth-child(2) { opacity: 0; }
.burger[aria-expanded="true"] i:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* Progress: determinate = transform scaleX (never animate width); indeterminate = sliding bar */
.bar { transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform var(--dur-deliberate) var(--ease-standard); }
.bar.indeterminate { inline-size: 40%; transform: none; animation: slide 1.2s var(--ease-standard) infinite; }
@keyframes slide { from { translate: -100% 0; } to { translate: 250% 0; } }

/* Selection feedback: pulse once on select, plus a persistent non-motion indicator */
.item[aria-selected="true"] { background: var(--sel-bg); box-shadow: inset 3px 0 0 var(--accent); animation: sel var(--dur-normal) var(--ease-standard); }
@keyframes sel { 40% { transform: scale(1.015); } }

/* Success check draws in */
.check path { stroke-dasharray: 24; stroke-dashoffset: 24; animation: draw var(--dur-deliberate) var(--ease-enter) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

Rules: press = instant (<=80ms in), release = normal. Hover effects wrapped in `@media (hover: hover)`. Interactive state changes <=220ms.

## 6. Component transitions

```css
/* Accordion / expandable panel: height auto without JS via grid rows */
.acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-normal) var(--ease-standard); }
.acc-panel > .inner { overflow: hidden; min-block-size: 0; }
.acc-panel[data-open="true"] { grid-template-rows: 1fr; }
/* also fade content slightly: */
.acc-panel > .inner { opacity: 0; transition: opacity var(--dur-fast) var(--ease-standard); }
.acc-panel[data-open="true"] > .inner { opacity: 1; transition-delay: 60ms; }

/* Dropdown / floating menu / tooltip: origin-aware scale+fade, exit faster */
.pop { opacity: 0; transform: translateY(-4px) scale(.98); transform-origin: var(--origin, top left); visibility: hidden;
       transition: opacity var(--dur-fast) var(--ease-exit), transform var(--dur-fast) var(--ease-exit), visibility 0s var(--dur-fast); }
.pop[data-open="true"] { opacity: 1; transform: none; visibility: visible;
       transition: opacity var(--dur-normal) var(--ease-enter), transform var(--dur-normal) var(--ease-enter), visibility 0s; }
.tooltip { transition-duration: var(--dur-fast); }          /* 140ms, no stagger, 400ms open delay on hover, 0 on focus */

/* Modal: backdrop fade + panel rise. Use <dialog> + @starting-style for enter/exit */
dialog { opacity: 0; transform: translateY(12px) scale(.98);
         transition: opacity var(--dur-normal) var(--ease-exit), transform var(--dur-normal) var(--ease-exit), overlay var(--dur-normal) allow-discrete, display var(--dur-normal) allow-discrete; }
dialog[open] { opacity: 1; transform: none; transition-timing-function: var(--ease-enter); }
@starting-style { dialog[open] { opacity: 0; transform: translateY(12px) scale(.98); } }
dialog::backdrop { background: rgb(0 0 0 / 0); transition: background var(--dur-normal), overlay var(--dur-normal) allow-discrete, display var(--dur-normal) allow-discrete; }
dialog[open]::backdrop { background: rgb(0 0 0 / .5); }
@starting-style { dialog[open]::backdrop { background: rgb(0 0 0 / 0); } }

/* Toast: slide from edge, auto-dismiss; stack reflows via translate */
.toast { animation: toast-in var(--dur-normal) var(--ease-enter) both; }
.toast[data-leaving] { animation: toast-out var(--dur-fast) var(--ease-exit) both; }
@keyframes toast-in  { from { opacity: 0; transform: translateY(12px) scale(.96); } }
@keyframes toast-out { to   { opacity: 0; transform: translateY(8px) scale(.96); } }

/* Tabs: sliding indicator driven by measured CSS vars (set from JS on select/resize) */
.tab-ind { position: absolute; inset-block-end: 0; block-size: 2px; inline-size: var(--w); transform: translateX(var(--x)); background: var(--accent);
           transition: transform var(--dur-normal) var(--ease-standard), inline-size var(--dur-normal) var(--ease-standard); }
.tab-panel { animation: panel-in var(--dur-normal) var(--ease-enter) both; }
@keyframes panel-in { from { opacity: 0; transform: translateX(var(--dir, 8px)); } }  /* --dir = +8px/-8px by tab order */
```

```js
// tab indicator + direction
function selectTab(tabs, panelsEl, next, prev) {
  const ind = tabs.querySelector(".tab-ind"), r = next.getBoundingClientRect(), p = tabs.getBoundingClientRect();
  ind.style.setProperty("--x", `${r.left - p.left}px`); ind.style.setProperty("--w", `${r.width}px`);
  panelsEl.style.setProperty("--dir", (next.dataset.i > prev.dataset.i ? 8 : -8) + "px");
}
// exit animation on removal (toast, list item) - finish then remove
async function leave(el) { el.dataset.leaving = ""; await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))); el.remove(); }
```

Lists: animate additions with `@starting-style`, reorders with FLIP or `motion`'s `layout`. Staggered entrance:

```css
.stagger > * { animation: rise var(--dur-normal) var(--ease-enter) both; animation-delay: calc(min(var(--i), 9) * var(--stagger-normal)); }
@keyframes rise { from { opacity: 0; transform: translateY(10px); } }
```
(set `style="--i:N"` per child; the `min()` caps total at ~9 steps).

## 7. Page transitions

| Pattern | When |
|---|---|
| Crossfade (150-220ms) | default between sibling routes, unrelated content |
| Directional slide (+-24px + fade) | hierarchy: forward = from right, back = from left, drill-down = up |
| Shared element | list item -> detail, thumbnail -> hero; same object persists |
| Staggered entrance | first load of dashboards/landing; once per session, not every navigation |
| Persistent nav | header/sidebar excluded from transition (`view-transition-name`), never re-animates |
| Route-aware | direction + duration chosen from route depth/order metadata |

View Transitions API with fallback:

```js
export function navigate(update, { direction = "forward", name } = {}) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) return Promise.resolve(update());
  document.documentElement.dataset.vt = direction;
  const t = document.startViewTransition(async () => { await update(); });
  t.finished.finally(() => delete document.documentElement.dataset.vt);
  return t.finished;
}
// shared element: tag source before the snapshot, target after update
//   el.style.viewTransitionName = "hero-" + id   (clear it afterwards, names must be unique)
```

```css
nav.app-nav { view-transition-name: app-nav; }            /* persistent: excluded from root crossfade */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--dur-normal); animation-timing-function: var(--ease-standard); }
[data-vt="forward"]::view-transition-old(root) { animation-name: out-left; }
[data-vt="forward"]::view-transition-new(root) { animation-name: in-right; }
[data-vt="back"]::view-transition-old(root)    { animation-name: out-right; }
[data-vt="back"]::view-transition-new(root)    { animation-name: in-left; }
@keyframes out-left  { to   { opacity: 0; transform: translateX(-24px); } }
@keyframes in-right  { from { opacity: 0; transform: translateX(24px); } }
@keyframes out-right { to   { opacity: 0; transform: translateX(24px); } }
@keyframes in-left   { from { opacity: 0; transform: translateX(-24px); } }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 1ms; } }
```

Fallback (no API): toggle a class that fades the outlet, swap content on `transitionend`, fade in. Never block navigation on the animation; cap at 360ms. In React Router/Next use `viewTransition` option or call `navigate` above around the state update (`flushSync`).

## 8. Procedural animations

**Contract for every recipe** (shared harness): pause when offscreen (IntersectionObserver) and tab hidden (visibilitychange); honor `prefers-reduced-motion` (draw one static frame, no loop; re-check on change); cap work per frame; expose `destroy()`; DPR-aware canvas; fixed budgets, no per-frame allocation.

```js
// loop.js - shared harness. tick(dt, t) returns nothing; render once when reduced.
export function createLoop({ el, tick, renderStatic, maxDt = 1 / 30 }) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0, last = 0, visible = true, tabVisible = !document.hidden, destroyed = false;
  const running = () => !destroyed && visible && tabVisible && !mq.matches;
  const frame = (now) => {
    raf = 0; if (!running()) return;
    const dt = Math.min((now - last) / 1000, maxDt); last = now;
    tick(dt, now / 1000);
    raf = requestAnimationFrame(frame);
  };
  const sync = () => {
    if (running()) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    else { cancelAnimationFrame(raf); raf = 0; if (mq.matches && !destroyed) renderStatic(); }
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
  io.observe(el);
  const onVis = () => { tabVisible = !document.hidden; sync(); };
  document.addEventListener("visibilitychange", onVis);
  mq.addEventListener("change", sync);
  sync();
  return { sync, destroy() { destroyed = true; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); mq.removeEventListener("change", sync); } };
}

export function fitCanvas(canvas, maxDpr = 2) {
  const dpr = Math.min(devicePixelRatio || 1, maxDpr), r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}
```

### 8.1 Particle field (pointer + app state, pooled, fixed budget)

```js
import { createLoop, fitCanvas } from "./loop.js";

export function particleField(canvas, { count = 140, link = 90, color = "120,160,255", maxLinksPerFrame = 400 } = {}) {
  let { ctx, w, h } = fitCanvas(canvas);
  const P = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, r: 1 + Math.random() * 1.6, a: 0.3 + Math.random() * 0.5 })); // pool: allocated once
  const ptr = { x: -1e4, y: -1e4, on: false };
  const state = { energy: 0.3, hue: 0 };                    // app state: set via api.setState({energy:0..1})
  const onMove = (e) => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true; };
  const onLeave = () => { ptr.on = false; ptr.x = ptr.y = -1e4; };
  canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerleave", onLeave);
  const ro = new ResizeObserver(() => { ({ ctx, w, h } = fitCanvas(canvas)); loop.sync(); draw(); }); ro.observe(canvas);

  function step(dt) {
    const speed = 12 + state.energy * 60, R = 120;
    for (const p of P) {
      p.vx += (Math.random() - 0.5) * speed * dt; p.vy += (Math.random() - 0.5) * speed * dt;
      const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * 220 * dt; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }  // repel pointer
      p.vx *= 0.96; p.vy *= 0.96; p.x += p.vx * dt * 60 * 0.3 + p.vx * dt; p.y += p.vy * dt * 60 * 0.3 + p.vy * dt;
      if (p.x < 0) p.x += w; else if (p.x > w) p.x -= w; if (p.y < 0) p.y += h; else if (p.y > h) p.y -= h;
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgba(${color},0.9)`;
    for (const p of P) { ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
    let links = 0, L2 = link * link;
    for (let i = 0; i < P.length && links < maxLinksPerFrame; i++) for (let j = i + 1; j < P.length && links < maxLinksPerFrame; j++) {   // per-frame cap
      const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d2 = dx * dx + dy * dy;
      if (d2 < L2) { ctx.strokeStyle = `rgba(${color},${(1 - d2 / L2) * 0.35})`; ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke(); links++; }
    }
  }
  const loop = createLoop({ el: canvas, tick: (dt) => { step(dt); draw(); }, renderStatic: draw });
  draw();
  return {
    setState(s) { Object.assign(state, s); },
    destroy() { loop.destroy(); ro.disconnect(); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerleave", onLeave); },
  };
}
```
Usage: `const f = particleField(document.querySelector("canvas.bg")); f.setState({ energy: isLoading ? 0.9 : 0.2 });`. Particles at 140 -> ~9.7k pair checks per frame; for >300 use a spatial grid or drop links. Canvas gets `aria-hidden="true"` and `pointer-events: none` if decorative behind content (then listen on `window` pointermove instead).

### 8.2 Organic morphing blob (noise-based SVG path)

```js
import { createLoop } from "./loop.js";

// cheap smooth 1D value noise, deterministic, no deps
const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
const noise = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };

export function morphBlob(pathEl, { points = 8, radius = 80, wobble = 0.22, speed = 0.35, seed = 1 } = {}) {
  const cx = 100, cy = 100;
  function d(t) {
    const pts = [];
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const r = radius * (1 + (noise(t * speed + i * 1.7 + seed * 10) - 0.5) * 2 * wobble);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    // closed Catmull-Rom -> cubic Bezier
    let s = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < points; i++) {
      const p0 = pts[(i - 1 + points) % points], p1 = pts[i], p2 = pts[(i + 1) % points], p3 = pts[(i + 2) % points];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      s += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return s + "Z";
  }
  const svg = pathEl.ownerSVGElement;
  const loop = createLoop({ el: svg, tick: (_dt, t) => pathEl.setAttribute("d", d(t)), renderStatic: () => pathEl.setAttribute("d", d(0)), maxDt: 1 / 20 });
  pathEl.setAttribute("d", d(0));
  return { setWobble(v) { wobble = v; }, destroy: loop.destroy };       // e.g. wobble rises with audio level / loading
}
```
HTML: `<svg viewBox="0 0 200 200" aria-hidden="true"><path id="blob" fill="var(--accent)"/></svg>`. 8 points, one `setAttribute` per frame: negligible cost. Avoid CSS `filter: blur()` on a large animating blob; use a gradient fill.

### 8.3 Generative geometry from data (waves / lines / grid)

```js
import { createLoop, fitCanvas } from "./loop.js";

// data: number[] (0..1). Draws layered flowing waves whose amplitude follows data; setData() on every update.
export function dataWaves(canvas, { layers = 3, color = "120,160,255", speed = 0.6 } = {}) {
  let { ctx, w, h } = fitCanvas(canvas), data = [0.2], target = [0.2];
  const ro = new ResizeObserver(() => { ({ ctx, w, h } = fitCanvas(canvas)); draw(0); }); ro.observe(canvas);
  const sample = (arr, x) => { const f = x * (arr.length - 1), i = Math.floor(f), j = Math.min(arr.length - 1, i + 1); return arr[i] + (arr[j] - arr[i]) * (f - i); };
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const STEP = Math.max(4, Math.round(w / 160));                        // <=160 segments per layer: capped work
    for (let L = 0; L < layers; L++) {
      ctx.beginPath();
      for (let x = 0; x <= w + STEP; x += STEP) {
        const u = Math.min(1, x / w), amp = sample(data, u) * h * 0.35 * (1 - L * 0.25);
        const y = h * 0.6 + Math.sin(u * 8 + t * speed * (1 + L * 0.4) + L) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = `rgba(${color},${0.35 - L * 0.1})`; ctx.fill();
    }
  }
  const loop = createLoop({
    el: canvas,
    tick: (dt, t) => { if (target.length !== data.length) data = target.slice(); for (let i = 0; i < data.length; i++) data[i] += (target[i] - data[i]) * Math.min(1, dt * 6); draw(t); },
    renderStatic: () => { data = target.slice(); draw(0); },
  });
  draw(0);
  return { setData(a) { target = a.length ? a : [0]; if (data.length !== target.length) data = target.slice(); loop.sync(); }, destroy() { loop.destroy(); ro.disconnect(); } };
}
```
Same pattern for a grid: iterate cells (cap rows*cols ~ 2000), displace each by `noise`/data, draw `fillRect` or short lines; for lines, draw N polylines offset in y (ridgeline). Data value changes tween (lerp) instead of snapping.

### 8.4 Spatial movement: parallax / depth / perspective tilt

```js
export function tilt(el, { max = 8, scale = 1.02, parallax = "[data-depth]" } = {}) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)"), fine = matchMedia("(hover: hover) and (pointer: fine)");
  let raf = 0, nx = 0, ny = 0, on = false, visible = true;
  const layers = [...el.querySelectorAll(parallax)];
  el.style.transformStyle = "preserve-3d"; el.style.willChange = "auto";
  const apply = () => {
    raf = 0;
    el.style.transform = on ? `perspective(800px) rotateX(${(-ny * max).toFixed(2)}deg) rotateY(${(nx * max).toFixed(2)}deg) scale(${scale})` : "";
    for (const l of layers) { const d = +l.dataset.depth || 0; l.style.transform = on ? `translate3d(${nx * d}px, ${ny * d}px, ${d * 2}px)` : ""; }
  };
  const move = (e) => { if (mq.matches || !visible) return; const r = el.getBoundingClientRect(); nx = ((e.clientX - r.left) / r.width - 0.5) * 2; ny = ((e.clientY - r.top) / r.height - 0.5) * 2; on = true; raf ||= requestAnimationFrame(apply); };
  const leave = () => { on = false; raf ||= requestAnimationFrame(apply); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) leave(); }); io.observe(el);
  if (fine.matches) { el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave); }
  el.style.transition = "transform var(--dur-normal) var(--ease-standard)";   // smoothing + settle-back
  document.addEventListener("visibilitychange", leave);
  return { destroy() { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); document.removeEventListener("visibilitychange", leave); el.style.transform = ""; layers.forEach(l => l.style.transform = ""); } };
}
```
Scroll parallax: prefer CSS `animation-timeline: scroll()`/`view()` (progressive enhancement) over scroll listeners; otherwise one passive scroll listener + rAF, translate only. Parallax depth range: 4-24px; never move text that must be read mid-scroll.

## 9. Performance and accessibility (mandatory)

1. **Animate `transform` and `opacity` only** (plus `filter`/`clip-path` sparingly). Never animate `width/height/top/left/margin/padding` (use grid-rows trick, `scaleX`, FLIP).
2. **No always-running effects without purpose.** Ambient loops: purposeful, paused offscreen and in hidden tabs, stopped under reduced motion.
3. **prefers-reduced-motion**: reduce, don't always remove. Replace movement/scale/parallax/bounce with short opacity fades; stop autoplay loops; keep essential state feedback (progress, selection) non-spatial.
4. **Limit blur/filter**: `backdrop-filter`/`filter: blur` radius <=16px, few and small surfaces, never animated on large areas.
5. **Frame budget**: 16ms per frame at 60fps; ~8ms of your JS. Batch DOM reads then writes; no layout reads inside rAF after writes; cap particles/segments; clamp `dt`; cap DPR at 2.
6. **`will-change`**: add just before a known heavy animation, remove after (`animationend`). Never blanket `* { will-change }`; never on dozens of elements permanently.
7. **UI stays interactive**: no input blocking during animation; animations interruptible (WAAPI `cancel()/reverse()`, transitions re-target naturally); don't gate navigation on `transitionend`; `pointer-events` unchanged on exiting elements unless hidden.
8. **No flashing >3 times/second** (WCAG 2.3.1); no large high-contrast strobe; auto-playing motion >5s needs a pause control (WCAG 2.2.2).
9. Ensure content is visible if animation fails (use `both` fill carefully; initial hidden states only inside `@starting-style`/animation, not static CSS).

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; scroll-behavior: auto !important; }
}
/* better: targeted replace-with-fade for key components */
@media (prefers-reduced-motion: reduce) {
  .pop, dialog, .toast, .tab-panel { transform: none !important; }
  .stagger > * { animation: fade-only var(--dur-fast) both; animation-delay: 0s; }
  @keyframes fade-only { from { opacity: 0; } }
  .card:hover { transform: none; }
}
```

```js
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export function animate(el, keyframes, opts) {
  if (reducedMotion()) { keyframes = keyframes.map(k => { const { opacity } = k; return opacity === undefined ? {} : { opacity }; }); opts = { ...opts, duration: Math.min(opts.duration ?? 140, 140) }; }
  return el.animate(keyframes, { fill: "both", easing: cssEase(motion.easing.standard), ...opts });
}
// device performance: downgrade on low-end
export const lowPower = () => (navigator.hardwareConcurrency || 8) <= 4 || navigator.connection?.saveData === true;
```

## 10. Motion QA checklist

- [ ] Each animation has a stated purpose (cause/effect, continuity, state, attention, delight)
- [ ] Only tokens used (no magic durations); one preset personality; component overrides documented
- [ ] Enter uses `enter` easing, exit uses `exit` easing and is ~30-40% shorter
- [ ] Durations scaled to distance/size; total stagger <=400ms
- [ ] Only transform/opacity animated; no layout thrash; no blur on large animating areas
- [ ] Reduced-motion tested (DevTools: Rendering > Emulate prefers-reduced-motion): movement replaced by fade, loops stopped, procedural shows static frame
- [ ] Procedural effects pause offscreen and in background tab (check CPU in Performance monitor), have `destroy()` called on unmount
- [ ] Rapid interaction test: click/hover/toggle 10x fast, mid-animation navigation, no stuck states or queued backlog
- [ ] Keyboard focus and screen-reader content unaffected by animation (no content only reachable after animation)
- [ ] No flashing >3Hz; autoplay >5s has pause
- [ ] 60fps on a throttled CPU (4x slowdown) for hot paths; no layout shift from animations
- [ ] Fallback works with View Transitions API absent
