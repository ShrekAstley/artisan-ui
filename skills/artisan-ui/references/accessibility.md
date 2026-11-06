# Accessibility
Load when: building, reviewing or scoring any UI (every design needs this before the 85/100 acceptance check), especially modals, menus, tabs, forms, custom controls, color, or motion.

## 1. Rules of thumb

1. **Semantic HTML first.** `button`, `a`, `input`, `select`, `dialog`, `details`, `nav`, `main`, `header`, `footer`, `ul`, `table`, `label`, `fieldset`.
2. **ARIA only to fill gaps** native HTML cannot. First rule of ARIA: no ARIA beats bad ARIA. Wrong role/state is worse than none.
3. **Never `div` + `onclick`.** If it acts, it's a `button`; if it navigates, it's an `a href`.
4. Every interactive element: reachable by keyboard, has an accessible name, shows focus, shows state, >= target size.
5. Information never by color alone, never by hover alone, never by motion alone.

## 2. Structure: landmarks, headings, skip link

```html
<a class="skip" href="#main">Skip to main content</a>
<header><nav aria-label="Primary">...</nav></header>
<main id="main" tabindex="-1">
  <h1>Page title</h1>      <!-- exactly one h1; no skipped levels; headings describe, not decorate -->
  <section aria-labelledby="s1"><h2 id="s1">Section</h2></section>
</main>
<footer>...</footer>
```
```css
.skip { position: absolute; inset-block-start: 8px; inset-inline-start: 8px; padding: 8px 12px; background: var(--surface); color: var(--text); transform: translateY(-200%); z-index: 100; border-radius: 6px; }
.skip:focus { transform: none; }
.sr-only { position: absolute; inline-size: 1px; block-size: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
```
Multiple `nav`s need distinct `aria-label`s. Choose heading level for outline, style with CSS. On SPA route change: move focus to `h1`/`main` (`tabindex="-1"`) and update `document.title`.

## 3. Keyboard access

| Key | Expected |
|---|---|
| Tab / Shift+Tab | moves through interactive elements in visual/logical order; DOM order = visual order |
| Enter | activates links and buttons |
| Space | activates buttons, toggles checkboxes/switches |
| Esc | closes dialogs, menus, popovers, cancels; returns focus to trigger |
| Arrows | within composite widgets (tabs, menus, listbox, radio group, grid) |
| Home/End | first/last item in composites |

- Never positive `tabindex`. Use `0` (join order) or `-1` (programmatic focus only).
- **Roving tabindex** for composites: one item `tabindex="0"`, others `-1`; arrows move.
- Don't trap focus except in modal dialogs. No keyboard traps (WCAG 2.1.2). Drag-only actions need keyboard/button alternative (WCAG 2.5.7).
- Hidden content must be unfocusable: `hidden`, `display:none`, `inert`, or `visibility:hidden` (never just `opacity:0` / offscreen translate).

```js
// roving tabindex for any composite (tabs, toolbar, menu, listbox)
export function roving(container, itemSel, { orientation = "horizontal", loop = true, onActivate } = {}) {
  const items = () => [...container.querySelectorAll(itemSel)].filter(i => !i.disabled && !i.hidden);
  const focusAt = (i) => { const list = items(); if (!list.length) return; const n = loop ? (i + list.length) % list.length : Math.max(0, Math.min(list.length - 1, i)); list.forEach((el, k) => el.tabIndex = k === n ? 0 : -1); list[n].focus(); onActivate?.(list[n]); };
  items().forEach((el, k) => el.tabIndex = k === 0 ? 0 : -1);
  const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft", next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
  container.addEventListener("keydown", (e) => {
    const list = items(), i = list.indexOf(document.activeElement); if (i < 0) return;
    if (e.key === next) focusAt(i + 1); else if (e.key === prev) focusAt(i - 1);
    else if (e.key === "Home") focusAt(0); else if (e.key === "End") focusAt(list.length - 1); else return;
    e.preventDefault();
  });
}
```

## 4. Focus visibility

Visible focus ring: **>= 2px thick, >= 3:1 contrast against adjacent colors** (both the component and the background), not obscured by sticky headers (WCAG 2.4.11 Focus Not Obscured: use `scroll-padding`).

```css
:focus-visible { outline: 3px solid var(--focus, #2563eb); outline-offset: 2px; border-radius: inherit; }
:focus:not(:focus-visible) { outline: none; }                  /* mouse clicks only; keyboard keeps ring */
.on-dark :focus-visible { outline-color: #fff; box-shadow: 0 0 0 5px #000; }   /* double ring works on any bg */
html { scroll-padding-block: 80px; }                           /* sticky header height */
@media (forced-colors: active) { :focus-visible { outline: 3px solid Highlight; } }
```
Never `outline: none` without a replacement. Don't rely on subtle background shift as the only focus cue.

## 5. Names, labels, roles

- Every control has an accessible name: visible `<label for>`, wrapped label, `aria-labelledby`, or (icon-only) `aria-label`. Visible label text must be contained in the accessible name (WCAG 2.5.3).
- Icon-only buttons: `<button aria-label="Close"><svg aria-hidden="true" focusable="false">...</svg></button>`.
- Decorative images `alt=""`; informative images describe purpose, not "image of". Decorative SVG/canvas: `aria-hidden="true"`.
- Placeholder is not a label. Use `autocomplete` tokens (`email`, `given-name`, `current-password`, `one-time-code`).
- Links: distinguishable out of context ("Read pricing details", not "Click here"); links that open new tab say so.
- State via attributes, not just class: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-checked`, `aria-current`, `aria-disabled`, `aria-invalid`, `aria-busy`.
- Language: `<html lang="en">`; mark inline foreign phrases `lang`.

## 6. Contrast and color

| Item | Minimum |
|---|---|
| Body text, small text (<24px / <19px bold) | **4.5:1** |
| Large text (>=24px, or >=18.66px bold) | **3:1** |
| UI components (borders of inputs, icons that convey meaning, focus ring, chart marks) | **3:1** against adjacent |
| Disabled controls, pure decoration, logos | exempt (but keep legible) |
| Placeholder text | 4.5:1 (treat as text) |

- Check each theme (light and dark) and each state (hover, selected, disabled-but-informational), text on gradients/images (worst point, add scrim).
- **Don't communicate by color alone** (WCAG 1.4.1): add icon, text, pattern, underline, position, weight.
- Color-blind-safe pairs: avoid red/green only; pair with shapes/labels.

```css
/* prefers-color-scheme with explicit toggle override */
:root { color-scheme: light dark; --bg: #fff; --text: #14161a; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0e1013; --text: #e8eaed; } }
:root[data-theme="dark"] { --bg: #0e1013; --text: #e8eaed; }
body { background: var(--bg); color: var(--text); }

/* forced-colors / Windows High Contrast: use system colors, keep borders, don't rely on shadows/backgrounds */
@media (forced-colors: active) {
  .btn { border: 1px solid ButtonText; forced-color-adjust: auto; }
  .btn[aria-pressed="true"], [aria-selected="true"], [aria-current] { outline: 2px solid Highlight; }
  .switch::after { background: ButtonText; }                  /* thumb must remain visible */
  .icon { fill: currentColor; }                               /* SVGs follow text color */
  .badge { border: 1px solid CanvasText; }                    /* bg-only badges vanish otherwise */
}
@media (prefers-contrast: more) { :root { --border: #000; --muted: #333; } }
```
Contrast computation (WCAG relative luminance):

```js
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const hex = (h) => { h = h.replace("#", ""); if (h.length === 3) h = [...h].map(x => x + x).join(""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
export const contrast = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// contrast("#767676", "#ffffff") -> 4.54 (just passes AA). Semi-transparent colors: composite over bg first.
```

## 7. Touch target size

- Design >= 44x44 CSS px; floor **24x24** (WCAG 2.2 SC 2.5.8) or 24px offset from neighbors. Inline text links are exempt.
- Small visuals, big hit area: pad or `::after { inset: -8px }`. See responsive-design.md section 8.

## 8. Forms and error feedback

```html
<form novalidate>
  <div class="field">
    <label for="email">Email <span aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
    <input id="email" name="email" type="email" autocomplete="email" required
           aria-describedby="email-hint email-err" aria-invalid="true">
    <p id="email-hint" class="hint">We only use this for receipts.</p>
    <p id="email-err" class="error"><svg aria-hidden="true" class="icon">...</svg> Enter an email like name@example.com</p>
  </div>
  <fieldset><legend>Notifications</legend> <!-- radio/checkbox groups -->
    <label><input type="radio" name="n" value="all"> All</label>
    <label><input type="radio" name="n" value="none"> None</label>
  </fieldset>
  <button type="submit">Save</button>
</form>
<div id="form-status" role="status" aria-live="polite" class="sr-only"></div>
```
- Errors: **text + icon (+ color)**, adjacent to the field, specific and actionable ("Password needs 8+ characters" not "Invalid"), linked via `aria-describedby`, `aria-invalid="true"` only after validation fails.
- On submit with errors: summary at top (`role="alert"` or move focus to a heading with `tabindex="-1"`) with links to each field, and focus the first invalid field.
- Don't clear user input on error. Don't validate on every keystroke before the user finished (validate on blur/submit).
- Don't disable submit just to signal invalid; if you do, explain why.
- Live regions: create the container **empty on page load**, then change text. `role="status"`/`aria-live="polite"` for confirmations ("Saved"), `role="alert"` (assertive) only for errors needing immediate attention. Toasts: live region + persist long enough (>=6s + reading time) or until dismissed; pausable on hover/focus.
- Loading: `aria-busy="true"` on region, plus announce completion via live region; spinner needs text (`<span class="sr-only">Loading</span>`).
- Required fields indicated in text, not only `*` color. Consistent help/placement (WCAG 3.2.6). Don't require re-entering info already given (3.3.7). Auth: allow paste and password managers (3.3.8).

```js
const live = document.getElementById("form-status");
export const announce = (msg) => { live.textContent = ""; setTimeout(() => (live.textContent = msg), 50); };  // reset so repeats re-announce
```

## 9. Patterns with minimal code

### Dialog (modal)
Use native `<dialog>`; `showModal()` gives focus trap, inert background, Esc, top-layer.

```html
<button id="open" aria-haspopup="dialog">Delete project</button>
<dialog id="dlg" aria-labelledby="dlg-t" aria-describedby="dlg-d">
  <h2 id="dlg-t">Delete project?</h2><p id="dlg-d">This cannot be undone.</p>
  <form method="dialog"><button value="cancel" autofocus>Cancel</button><button value="ok">Delete</button></form>
</dialog>
<script>
  const dlg = document.getElementById("dlg"), opener = document.getElementById("open");
  opener.addEventListener("click", () => dlg.showModal());          // focus moves into dialog; autofocus the least destructive control
  dlg.addEventListener("close", () => opener.focus());               // focus returns to trigger
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close("cancel"); });   // backdrop click (optional)
</script>
```
Custom (non-native) modal needs: `role="dialog" aria-modal="true"` + label, focus into dialog on open, trap Tab, Esc closes, `inert` on siblings, restore focus, scroll lock.

```js
export function trapFocus(root) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const h = (e) => { if (e.key !== "Tab") return; const f = [...root.querySelectorAll(sel)].filter(el => el.offsetParent !== null); if (!f.length) return;
    const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { z.focus(); e.preventDefault(); } else if (!e.shiftKey && document.activeElement === z) { a.focus(); e.preventDefault(); } };
  root.addEventListener("keydown", h); return () => root.removeEventListener("keydown", h);
}
```

### Disclosure / accordion
```html
<h3><button aria-expanded="false" aria-controls="p1" id="b1">Shipping</button></h3>
<div id="p1" role="region" aria-labelledby="b1" hidden>...</div>
```
```js
b1.addEventListener("click", () => { const o = b1.getAttribute("aria-expanded") === "true"; b1.setAttribute("aria-expanded", !o); p1.hidden = o; });
```
Or native `<details><summary>`. (With height animation keep `hidden`/`inert` when closed so content is unfocusable.)

### Menu button (action menu)
```html
<button id="mb" aria-haspopup="menu" aria-expanded="false" aria-controls="m">Actions</button>
<ul id="m" role="menu" aria-labelledby="mb" hidden>
  <li role="menuitem" tabindex="-1">Rename</li><li role="menuitem" tabindex="-1">Duplicate</li>
</ul>
```
Behavior: Enter/Space/ArrowDown on button opens and focuses first item; arrows move (roving), Home/End, type-ahead optional, Esc closes and refocuses button, Tab closes, Enter/Space activates. Use `role=menu` ONLY for action menus, not site navigation (use `nav` + disclosure buttons + links). Floating UI must be dismissible, hoverable and persistent (WCAG 1.4.13).

### Tabs
```html
<div role="tablist" aria-label="Project">
  <button role="tab" id="t1" aria-selected="true" aria-controls="tp1" tabindex="0">Overview</button>
  <button role="tab" id="t2" aria-selected="false" aria-controls="tp2" tabindex="-1">Activity</button>
</div>
<div role="tabpanel" id="tp1" aria-labelledby="t1" tabindex="0">...</div>
<div role="tabpanel" id="tp2" aria-labelledby="t2" tabindex="0" hidden>...</div>
```
```js
roving(tablist, '[role=tab]', { onActivate: (t) => {          // automatic activation: selection follows focus
  tablist.querySelectorAll('[role=tab]').forEach(x => { const on = x === t; x.setAttribute("aria-selected", on); document.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
}});
```
Use `roving` from section 3. Tab list keys: Left/Right (Up/Down if `aria-orientation="vertical"`), Home/End.

### Combobox (autocomplete, editable with listbox)
```html
<label for="city">City</label>
<input id="city" role="combobox" aria-expanded="false" aria-controls="lb" aria-autocomplete="list" aria-activedescendant="" autocomplete="off">
<ul id="lb" role="listbox" hidden><li role="option" id="o1">Oslo</li><li role="option" id="o2">Osaka</li></ul>
<div class="sr-only" role="status" id="count"></div>   <!-- "2 results available" -->
```
Behavior: DOM focus stays in the input; ArrowDown/Up change `aria-activedescendant` + `aria-selected="true"` on option; Enter selects; Esc closes (second Esc clears); announce result count via live region. For simple lists prefer native `<select>` or `<input list>` + `<datalist>`.

### Switch, tooltip, progress
- Switch: `<button role="switch" aria-checked="false">Wi-Fi</button>` (Space/Enter toggles), or `<input type="checkbox" role="switch">`.
- Tooltip: supplementary only; trigger focusable; `aria-describedby` on trigger; shows on focus too; Esc dismisses; content also reachable on touch.
- Progress: `<progress value="40" max="100">` or `role="progressbar" aria-valuenow aria-valuemin aria-valuemax` + name.
- Toggle button: `aria-pressed` (don't also change the label text).
- Data tables: `<th scope="col|row">`, `<caption>`; sortable header `aria-sort="ascending"`.

## 10. Zoom, reflow, text spacing

- Layout works at **200% zoom** and reflows at **320 CSS px width (= 400% zoom on 1280)** with no 2D scrolling (except data tables, maps, code). See responsive-design.md.
- Text resizable to 200% without clipping: no fixed `height` on text containers; use `min-block-size`, `rem`.
- Text spacing override must not break (line-height 1.5, paragraph spacing 2x, letter 0.12em, word 0.16em): avoid `overflow:hidden` with fixed heights on text.
- Never disable zoom in the viewport meta. Orientation not locked (WCAG 1.3.4).
- Content on hover/focus (tooltips) dismissible, hoverable, persistent.

## 11. Reduced motion and time

- Honor `prefers-reduced-motion` (see motion-engine.md section 9): replace movement with fades, stop loops, render static frames for procedural visuals. Essential motion (progress) may remain non-vestibular.
- Animations that start automatically, last >5s and sit beside content need pause/stop/hide (WCAG 2.2.2). Carousels: pause button, no autoplay by default.
- Nothing flashes >3 times per second (WCAG 2.3.1).
- Timeouts: warn and allow extension; toasts with actions must not vanish before reading.
- Motion that **cannot be disabled** is a critical failure.

```css
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; scroll-behavior: auto !important; } }
```
```js
const reduce = matchMedia("(prefers-reduced-motion: reduce)"); reduce.addEventListener("change", e => app.setMotion(e.matches ? "off" : "on"));
```
Also provide an in-app motion toggle when the app has heavy ambient effects; persist it and let it override only toward less motion.

## 12. How to verify

### Keyboard-only walkthrough (unplug the mouse)
1. Load page; press Tab once: does a skip link or first control get a **visible** ring?
2. Tab through the whole page. Order matches visual order? Every control reachable? Any invisible focus, any trap, any element focused while hidden (offscreen/closed menu)?
3. Activate each control with Enter/Space. Menus/tabs/listboxes: arrows, Home/End, Esc.
4. Open every dialog/popover: focus enters, Tab stays inside (modal), Esc closes, focus returns to trigger.
5. Submit a form empty: errors appear as text+icon, focus lands on summary/first error, errors announced.
6. Zoom browser to 200% then 400%: no loss of content/function, no horizontal page scroll.
7. Toggle OS/devtools reduced motion and forced colors (DevTools > Rendering > Emulate): content and focus still visible, motion minimal.
8. (If possible) 2 minutes with NVDA/VoiceOver: headings list, landmarks list, form labels, state announcements.

### Automated: axe-core via browser script (console or automation `javascript` call)
```js
(async () => {
  await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] } });
  return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, count: v.nodes.length, sample: v.nodes[0].target.join(" ") })), incomplete: r.incomplete.length };
})();
```
Run it in each theme (light/dark), each viewport baseline, and with each overlay open (dialog/menu). axe finds ~30-40% of issues; the manual walkthrough covers the rest. If CDN is blocked, use `npm i -D @axe-core/cli` -> `npx axe http://localhost:3000 --exit`.

### Quick script checks
```js
// images without alt, buttons/links without names, inputs without labels, positive tabindex, tiny targets
const q = (s) => [...document.querySelectorAll(s)];
({
  imgNoAlt: q("img:not([alt])").length,
  unnamedButtons: q("button,[role=button],a[href]").filter(e => !(e.textContent.trim() || e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.title)).length,
  unlabeled: q("input:not([type=hidden]):not([type=submit]),select,textarea").filter(e => !(e.labels?.length || e.getAttribute("aria-label") || e.getAttribute("aria-labelledby"))).length,
  positiveTabindex: q("[tabindex]").filter(e => +e.getAttribute("tabindex") > 0).length,
  h1Count: q("h1").length,
  noLang: !document.documentElement.lang,
  outlineNoneInline: q("[style*='outline: none'],[style*='outline:none']").length,
});
```
### Contrast
Use `contrast(fg, bg)` from section 6 on every text token pair x every surface x both themes; generate a table in the design system and fail the build under 4.5 (text) / 3 (UI). For rendered pages use axe's `color-contrast` rule plus visual spot checks on gradients/images.

## 13. Critical failures (block the 85/100 acceptance regardless of other scores)

Any one of these caps the accessibility result below acceptance:

1. **Core function not keyboard-accessible** (cannot reach/operate primary action, nav, form, dialog by keyboard; keyboard trap).
2. **Essential text contrast < 3:1** (body, labels, buttons, errors) in any shipped theme/state.
3. **Focus invisible** on interactive elements (outline removed with no replacement, or ring < 3:1 / hidden under sticky UI).
4. **Motion that cannot be disabled** (ignores `prefers-reduced-motion`, no pause for >5s autoplay, or flashing >3Hz).
5. **State or error by color alone** (selected/error/success unreadable without color vision).
6. **Unlabeled controls** (icon buttons / inputs with no accessible name).
7. **Page-level reflow failure** at 320px / 200% zoom hides content or function; zoom disabled.
8. **Modal that traps without escape or leaks focus** (no Esc/close, focus behind modal reachable, focus lost on close).
9. **Clickable non-semantic elements** (`div`/`span` handlers with no role, tabindex, key handling).

Non-critical but scored down: missing skip link, heading outline gaps, missing landmarks, touch targets 24-43px on touch layouts, vague link text, absent forced-colors support, unannounced async updates.
