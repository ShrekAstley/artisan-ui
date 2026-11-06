# Responsive Design
Load when: building or reviewing any layout that must work across desktop, tablet and phone widths, or a desktop app window (Electron/Tauri) that can be resized.

## 1. Principle

A viewport is a **transformation of the interaction model**, not a shrunken desktop. At each size ask: what is the primary task, what input is used (mouse / finger), how much can be seen at once, what can move behind a tap. Collapse, reorder, replace and re-prioritize; never just scale down.

Verification baselines (not fixed constraints; design is fluid between and beyond them):

| Viewport | Represents | Interaction model |
|---|---|---|
| 1440x900 | large laptop/desktop | multi-pane workspace, hover, dense |
| 1280x800 | small laptop / smallest "full" desktop | same as above, tighter; side panels may collapse |
| 768x1024 | tablet portrait | touch + maybe keyboard; rail nav, 1-2 columns, sheets |
| 390x844 | phone | single column, bottom nav/drawer, bottom sheets, thumb zone |

Also check ~320px wide (WCAG reflow), 1920+ (max-width containment), and landscape phone (844x390).

## 2. Fluid type and space

```css
:root {
  /* clamp(min, preferred = intercept + slope*vw, max); keep min/max in rem so user font size still scales */
  --step--1: clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem);
  --step-0:  clamp(1rem,      0.95rem + 0.25vw, 1.125rem);
  --step-1:  clamp(1.25rem,   1.1rem  + 0.7vw,  1.625rem);
  --step-2:  clamp(1.5rem,    1.2rem  + 1.5vw,  2.25rem);
  --step-3:  clamp(2rem,      1.3rem  + 3.2vw,  3.5rem);
  --space-s: clamp(0.5rem,  0.45rem + 0.25vw, 0.75rem);
  --space-m: clamp(1rem,    0.85rem + 0.7vw,  1.5rem);
  --space-l: clamp(1.5rem,  1.2rem  + 1.5vw,  2.5rem);
  --gutter:  max(16px, env(safe-area-inset-left), 4vw);
  --measure: 68ch;
}
body { font-size: var(--step-0); line-height: 1.5; }
h1 { font-size: var(--step-3); line-height: 1.1; text-wrap: balance; }
p  { max-inline-size: var(--measure); text-wrap: pretty; }
```
Rules: body never <16px on mobile (iOS zooms inputs <16px); line-height >=1.4 body; `rem` in the clamp bounds (never px-only) so browser zoom/text-size works; avoid `vw`-only font sizes.

## 3. Container queries (component-level responsiveness)

Media queries for page shell; **container queries for components** that live in different-width slots.

```css
.card-host { container: card / inline-size; }
.card { display: grid; gap: var(--space-s); }
@container card (min-width: 420px) { .card { grid-template-columns: 120px 1fr; } }
@container card (min-width: 640px) { .card { grid-template-columns: 200px 1fr auto; } .card .actions { display: flex; } }
/* style queries / unit usage */
.card h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }   /* cqi = 1% of container inline size */
```
Name containers; do not put `container-type` on an element whose own size depends on its children's inline size (collapses width). Provide a fallback by designing the default (no container support) as the single-column layout.

## 4. Intrinsic grids (no breakpoints needed)

```css
.grid { display: grid; gap: var(--space-m); grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
/* auto-fill keeps empty tracks (stable card width); auto-fit stretches */
.gallery { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr)); grid-auto-flow: dense; }
/* sidebar that wraps under content when narrow, without media query */
.with-sidebar { display: flex; flex-wrap: wrap; gap: var(--space-m); }
.with-sidebar > :first-child { flex: 1 1 18rem; }
.with-sidebar > :last-child  { flex: 999 1 0; min-inline-size: min(100%, 24rem); }
/* page shell */
.page { display: grid; grid-template-columns: [full-start] minmax(var(--gutter), 1fr) [content-start] minmax(0, 72rem) [content-end] minmax(var(--gutter), 1fr) [full-end]; }
.page > * { grid-column: content; }
.page > .bleed { grid-column: full; }
```
`min(100%, Nrem)` inside `minmax` prevents overflow when the container is narrower than N. Always `min-inline-size: 0` on grid/flex children holding long text or code (default `min-width:auto` causes overflow).

## 5. Navigation transformation

| Width | Pattern | Notes |
|---|---|---|
| >=1280 | Full sidebar (240-280px) with labels, groups, collapsible | resizable optional |
| 1024-1279 | Collapsed icon rail (64-72px) + tooltips/labels on hover/focus | expand on button, don't auto-expand on hover only |
| 768-1023 | Rail, or hidden drawer + top bar with menu button | rail if <=6 destinations |
| <768 | Bottom tab bar (3-5 destinations) + "More" sheet; or top bar + off-canvas drawer | primary actions in thumb zone |

```css
.shell { display: grid; min-block-size: 100dvh; grid-template-columns: 260px minmax(0, 1fr); grid-template-areas: "nav main"; }
.nav { grid-area: nav; position: sticky; top: 0; block-size: 100dvh; overflow-y: auto; }
.main { grid-area: main; min-inline-size: 0; }
@media (max-width: 1279px) { .shell { grid-template-columns: 72px minmax(0, 1fr); } .nav .label { display: none; } .nav a { justify-content: center; } }
@media (max-width: 767px) {
  .shell { grid-template-columns: minmax(0, 1fr); grid-template-areas: "main"; padding-block-end: calc(64px + env(safe-area-inset-bottom)); }
  .nav { position: fixed; inset: auto 0 0 0; block-size: calc(64px + env(safe-area-inset-bottom)); padding-block-end: env(safe-area-inset-bottom);
         display: flex; justify-content: space-around; z-index: 40; border-block-start: 1px solid var(--border); background: var(--surface); overflow: visible; }
  .nav a { flex: 1; flex-direction: column; min-block-size: 48px; font-size: 0.75rem; }
  .nav .label { display: block; }   /* keep labels: icons alone are ambiguous */
}
```
Keep the same DOM and the same `<nav aria-label>`; only restyle. Drawer = `<dialog>`/focus-trapped panel (see accessibility.md). Active destination marked with `aria-current="page"` plus a non-color cue.

## 6. Data tables -> lists/cards

Wide data does not shrink. Choose per table:

| Situation | Transformation |
|---|---|
| 2-4 columns, short values | keep table; allow column wrap |
| Many columns, user compares rows | horizontal scroll **inside a bordered scroll container** with sticky first column, visible scroll affordance |
| Records read one at a time | card/list rows: title, 2-3 key fields, status, chevron to detail |
| Sort/filter heavy | keep controls; move to a filter bottom sheet on phone |

```css
.tbl-wrap { overflow-x: auto; overscroll-behavior-x: contain; border: 1px solid var(--border); border-radius: 12px; }   /* scroll lives here, not on body */
.tbl-wrap table { min-inline-size: 640px; border-collapse: separate; border-spacing: 0; }
.tbl-wrap th:first-child, .tbl-wrap td:first-child { position: sticky; inset-inline-start: 0; background: var(--surface); }

/* table -> cards on narrow (keeps semantics via role; labels from data-label) */
@media (max-width: 639px) {
  table.stack, .stack thead, .stack tbody, .stack tr, .stack td { display: block; }
  .stack thead { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }  /* visually hidden, still announced */
  .stack tr { padding: 12px; border: 1px solid var(--border); border-radius: 12px; margin-block-end: 12px; }
  .stack td { display: grid; grid-template-columns: 9rem 1fr; gap: 8px; padding: 4px 0; }
  .stack td::before { content: attr(data-label); font-weight: 600; color: var(--muted); }
}
```
When `display:block` is applied to table parts, add `role="table|row|cell|columnheader"` explicitly in markup to keep screen-reader table semantics (display overrides drop them in some browsers).

## 7. Workspace layouts (split panes, inspectors)

| Desktop (>=1280) | Tablet | Phone |
|---|---|---|
| list + detail + inspector, 3 panes | list + detail, inspector as slide-over | one pane at a time (stack navigation: list -> detail), inspector/actions as bottom sheet |
| toolbar with all actions | toolbar with overflow "..." | primary action FAB/sticky bottom bar, rest in sheet |
| side-by-side editor + preview | tabs (Edit / Preview) | tabs or segmented control |

```css
.workspace { display: grid; grid-template-columns: minmax(240px, 22rem) minmax(0, 1fr) minmax(260px, 20rem); block-size: 100dvh; }
@media (max-width: 1279px) { .workspace { grid-template-columns: minmax(220px, 20rem) minmax(0, 1fr); } .inspector { position: fixed; inset-block: 0; inset-inline-end: 0; inline-size: min(24rem, 90vw); transform: translateX(100%); } .inspector[data-open="true"] { transform: none; } }
@media (max-width: 767px)  { .workspace { grid-template-columns: minmax(0, 1fr); } .workspace[data-view="detail"] .list, .workspace[data-view="list"] .detail { display: none; } }

/* bottom sheet */
.sheet { position: fixed; inset: auto 0 0 0; max-block-size: 85dvh; border-radius: 16px 16px 0 0; padding-block-end: env(safe-area-inset-bottom);
         transform: translateY(100%); transition: transform var(--dur-normal, 220ms) cubic-bezier(.2,0,0,1); overflow: auto; overscroll-behavior: contain; }
.sheet[data-open="true"] { transform: none; }
```
Sheets need: grab handle (decorative), close button (not drag-only), focus trap, Escape, scrim tap to close, `inert` on the page behind.

## 8. Touch, pointer and density

- **Target size**: design >=44x44 CSS px for touch (Apple 44pt / Material 48dp); absolute floor WCAG 2.2 SC 2.5.8 is **24x24** (or 24px spacing circle). Visual icon may be smaller if hit area is padded.
- **Spacing** between adjacent targets >=8px.
- **Hover-less equivalents**: every hover reveal needs tap/focus equivalent (row actions -> always visible or via "..." button; tooltips -> focusable info button or visible label; hover preview -> tap to open).
- **Density by pointer type**:

```css
:root { --row-h: 32px; --ctl-h: 32px; --pad: 8px; }
@media (pointer: coarse) { :root { --row-h: 48px; --ctl-h: 44px; --pad: 12px; } }
@media (hover: none) { .row-actions { opacity: 1; } .tooltip-only { display: none; } }
@media (any-pointer: fine) and (min-width: 1024px) { :root[data-density="compact"] { --row-h: 28px; } }  /* user-selectable compact mode on desktop only */
.btn, .icon-btn { min-block-size: var(--ctl-h); min-inline-size: var(--ctl-h); }
.icon-btn { position: relative; } .icon-btn::after { content: ""; position: absolute; inset: -8px; }   /* expand hit area, no layout change */
```
Use `pointer`/`hover` media features, not width, to decide touch affordances (a 1280px touch laptop or 700px desktop window exists).
- Gestures (swipe, long-press, drag) are enhancements only; provide visible button equivalents. Do not rely on edge swipes (system back gesture conflicts).

## 9. Viewport units, safe areas, orientation

```css
html { -webkit-text-size-adjust: 100%; }
.full-screen { min-block-size: 100vh; min-block-size: 100dvh; }        /* dvh tracks mobile browser chrome; svh = smallest (stable hero); lvh = largest */
.hero { min-block-size: 100svh; }                                       /* avoids jump when URL bar collapses */
.bottom-bar { padding-block-end: max(12px, env(safe-area-inset-bottom)); }
.top-bar    { padding-block-start: env(safe-area-inset-top); padding-inline: max(16px, env(safe-area-inset-left), env(safe-area-inset-right)); }
@media (orientation: landscape) and (max-height: 500px) { .hero { min-block-size: auto; } .bottom-bar { position: static; } .nav { inline-size: 72px; } }
```
HTML: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (never `user-scalable=no` or `maximum-scale=1`). Software keyboard: use `interactive-widget=resizes-content` in the viewport meta or `visualViewport` so focused inputs/sticky bars stay visible.

## 10. Content priority and overflow rules

- **Reorder by priority, not DOM source**: keep DOM in logical reading order; use `order`/grid placement for visual changes only if reading order stays sensible. Phone order: primary task/status -> key content -> secondary -> filters/meta. Move secondary panels to accordions/sheets.
- **No page-level horizontal scroll** at any width >=320px. Allowed: intentional contained scrollers (table wrapper, code block, carousel, tab strip) with visible edge cue and keyboard access (`tabindex="0"` on scroller).
- Overflow defenses:

```css
*, *::before, *::after { box-sizing: border-box; }
img, video, canvas, svg { max-inline-size: 100%; block-size: auto; }
.text, .cell { overflow-wrap: anywhere; min-inline-size: 0; }          /* long URLs, ids */
pre, code { overflow-x: auto; max-inline-size: 100%; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-inline-size: 0; }
.clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
/* never: width: 100vw on block elements (includes scrollbar -> overflow); use 100% / inline-size: 100% */
```
- Fixed pixel widths on containers are bugs; use `min()`, `max-inline-size`, `%`, `fr`.
- Truncated text must remain reachable (tooltip/title is not enough on touch: provide detail view).
- Images: `srcset`/`sizes`, `aspect-ratio` to prevent layout shift; art-direct with `<picture>` if crop matters.

## 11. Desktop apps (Electron / Tauri)

- Set a **minimum window size** that your smallest supported layout fits: typically 900x600 (workspace) or 480x600 (utility/overlay). Below that, don't try to shrink further.

```js
// Electron
new BrowserWindow({ width: 1280, height: 800, minWidth: 900, minHeight: 600, show: false });
// Tauri (tauri.conf.json -> app.windows[0])
// { "width": 1280, "height": 800, "minWidth": 900, "minHeight": 600, "resizable": true }
```
- Treat the window as a viewport: all breakpoints above apply, driven by container/window width, not device type. Test by resizing live, snapping half-screen (e.g. 960x1080), and on high-DPI + 125/150% OS scaling.
- **Resizable panels with persisted sizes**: min/max per panel, double-click handle to reset, keyboard-resizable handle (`role="separator"`, arrow keys), persist to storage (try/catch), clamp restored values to the current window.

```js
export function splitter(handle, panel, { min = 220, max = 520, key = "panel-w" } = {}) {
  const clamp = (v) => Math.min(max, Math.min(innerWidth * 0.6, Math.max(min, v)));
  const set = (v) => { v = clamp(v); panel.style.inlineSize = v + "px"; handle.setAttribute("aria-valuenow", Math.round(v)); try { localStorage.setItem(key, v); } catch {} return v; };
  try { const s = +localStorage.getItem(key); if (s) set(s); } catch {}
  handle.setAttribute("role", "separator"); handle.setAttribute("aria-orientation", "vertical"); handle.tabIndex = 0;
  handle.setAttribute("aria-valuemin", min); handle.setAttribute("aria-valuemax", max);
  handle.addEventListener("pointerdown", (e) => {
    handle.setPointerCapture(e.pointerId); const x0 = e.clientX, w0 = panel.getBoundingClientRect().width;
    const mv = (m) => set(w0 + m.clientX - x0); const up = () => { handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); };
    handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up);
  });
  handle.addEventListener("keydown", (e) => { const w = panel.getBoundingClientRect().width; if (e.key === "ArrowLeft") set(w - 16); if (e.key === "ArrowRight") set(w + 16); if (e.key === "Home") set(min); if (e.key === "End") set(max); });
  handle.addEventListener("dblclick", () => set(min * 1.4));
  addEventListener("resize", () => set(panel.getBoundingClientRect().width));
}
```
- Frameless/custom title bars: mark drag region (`-webkit-app-region: drag`) with interactive children `no-drag`; respect OS window controls overlay insets (`env(titlebar-area-*)`).
- Persist window bounds; restore on a connected display only.
- Overlay/widget windows (small, always-on-top): design for a fixed set of sizes, test each, avoid scroll.

## 12. Per-viewport checklist (what to look for in screenshots)

Take a full-page screenshot at each baseline, plus one scrolled-state and one with a modal/menu open.

**1440x900**
- [ ] Content contained by max-width/measure; no lonely stretched lines (>~80ch) or huge empty gutters
- [ ] Hierarchy clear in first screen; primary action visible without scroll
- [ ] Hover/focus states present; dense but not cramped

**1280x800**
- [ ] No horizontal page scroll; no clipped sidebar/inspector; panels collapse gracefully
- [ ] Toolbar not wrapping into two ragged rows; tables not cramped

**768x1024**
- [ ] Navigation transformed (rail/drawer), not just squeezed
- [ ] 1-2 column layout deliberate; no orphaned half-empty row
- [ ] Targets >=44px; both portrait and landscape OK

**390x844**
- [ ] No horizontal page scroll (check document.scrollWidth <= innerWidth); 16px gutters
- [ ] Primary action reachable with thumb; bottom nav not covering content (padding for safe area)
- [ ] Text >=16px body, inputs >=16px; no text <12px; no truncated essential info
- [ ] Tables transformed; modals become sheets/full-screen; keyboard doesn't hide the focused field

**All**
- [ ] 200% browser zoom and 320px width still usable (reflow)
- [ ] Images don't distort or shift layout; nothing overlaps; fixed/sticky bars don't consume >25% of height
- [ ] Interaction parity: every desktop hover feature has a touch equivalent
- [ ] Reduced-motion + dark/light variants checked at least at 390 and 1440

```js
// paste in console / automation: finds elements causing horizontal overflow
[...document.querySelectorAll("*")].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 10).map(e => e.tagName + "." + e.className);
// small touch targets
[...document.querySelectorAll("a,button,input,select,[role=button]")].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.width < 24 || r.height < 24); }).map(e => e.outerHTML.slice(0, 80));
```
