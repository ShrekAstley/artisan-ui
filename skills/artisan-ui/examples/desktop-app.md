# Example: Developer Workstation ("Lathe")

## 1. Concept

Lathe is a desktop workstation for backend developers that unifies a file tree, a code editor, a request runner, a log stream, and a trace viewer in one keyboard-first window. Audience: engineers who spend all day in tooling and judge it by latency and predictability. Goal: feel like a professional instrument where every panel is separated, resizable, and reachable without the mouse.

Load when: designing a desktop developer tool / workstation app or needing a worked example

Build order if budget-limited (e.g. a single-file build): tokens + shell wireframe first, then the one core interaction, then states and motion. Everything else in this spec is optional. Examples are illustrative; the approved `.artisan/` profile outranks them, and libraries outrank example token values.

Real data it binds to: the local filesystem (watched paths), a language server (diagnostics, symbols), an HTTP request collection (`method`, `url`, `headers`, `body`, `response.time_ms`), a log stream (NDJSON lines with `ts`, `level`, `msg`, `trace_id`), and OpenTelemetry spans for the trace panel.

## 2. Design profile

```json
{
  "identity": {
    "name": "Lathe",
    "category": "developer-workstation",
    "personality": ["precise", "terse", "mechanical", "trustworthy"]
  },
  "visual": {
    "theme": "dark",
    "themeNotes": "dark graphite, no pure black; panels separated by 1px seams and a one-step surface change",
    "palette": "graphite-acid",
    "typography": { "ui": "Geist", "code": "JetBrains Mono", "labels": "JetBrains Mono" },
    "density": "compact-high",
    "radius": "sharp"
  },
  "layout": {
    "navigation": "48px icon rail on the left plus command palette (Ctrl+K); rail only switches workspace modes",
    "content": "separated panels in a dockable split tree: explorer, editor, bottom dock (requests / logs / traces), right inspector",
    "responsive": true,
    "responsiveNotes": "window min 960x600; below 1100 the inspector auto-collapses to a tab in the bottom dock; panels are never stacked into cards"
  },
  "motion": {
    "preset": "mechanical",
    "microInteractions": ["detent-snap on panel resize", "focus ring that steps rather than fades", "palette list selection slide", "status-bar tick on build finish"],
    "pageTransitions": "workspace mode switch swaps panel contents in 100ms with no layout travel",
    "proceduralEffects": "none beyond a 1px activity scan on the status bar while a task runs"
  },
  "principles": [
    "Keyboard first: every action has a command id, a palette entry, and a shortcut",
    "Panels are separated surfaces, not floating cards",
    "Monospace marks machine facts (paths, ids, durations); sans marks human labels",
    "One acid accent for focus and running state; red and amber only for diagnostics",
    "Never move content under the user's pointer or caret"
  ],
  "motif": "detent: small notch marks on every seam and slider that show snap points, like a machinist's dial",
  "shapeLanguage": "right angles, 1px seams, 2px notches, square badges; chamfered corner only on the palette",
  "colorPhilosophy": "graphite steps (4 levels) build depth; acid green appears only where something is live, focused, or passing; diagnostics use a separate warm pair so they never read as brand",
  "spatialComposition": "4px base grid; 28px row height; seams align across panels so splits form one continuous grid",
  "interactionPersonality": "instant, deterministic, slightly ratcheted; like turning a precision knob with detents"
}
```

## 3. Implementation

```
1440x900
+--+-----------------------------------------------------------------------+
|R | LATHE  api-gateway / main        > Run  Debug       Ctrl+K command   |
|a +--------------+---------------------------------------+---------------+
|i | EXPLORER     | auth/session.ts  x  routes.ts         | INSPECTOR     |
|l | v src        |  41  export async function open(     | span 7f3a     |
|  |   auth       |  42    ctx: Ctx                      | dur   18.2 ms |
|  |   > session  |  43  ) {                             | parent 2c91   |
|  |   routes     |  44    const t = await ...           | attrs         |
|  |              |                                      |  db.system pg |
|  |              +---------------------||---------------+---------------+
|  |              | [Requests] [Logs] [Traces]       filter: level>=warn   |
|  |              | 14:02:11.482 WARN  retry 2/3 trace=7f3a  session.open  |
|  |              | 14:02:11.511 INFO  200 GET /v1/session   18 ms         |
+--+--------------+--------------------------------------------------------+
| main  0 errors 2 warnings   Ln 44, Col 12   UTF-8   LSP ready   v1.8.2   |
+---------------------------------------------------------------------------+
```

Key components and states:
- **Rail item**: idle, hover (surface +1 step), active (2px acid bar on the left, icon in ink-1), badge (square count, diagnostics color).
- **Panel**: focused (seam on its edge turns acid at 40% opacity, header label ink-1), unfocused (header ink-3), collapsed (24px strip with vertical label), maximized (Ctrl+Shift+M, others become strips).
- **Splitter**: idle (1px seam), hover (3px grab zone, notches visible), dragging (acid seam, size readout "412 px" near the pointer), snapped (notch flashes once).
- **Command palette**: centered 640px, chamfered top-right corner, prefix modes (`>` commands, `@` symbols, `:` line, `#` traces), results show shortcut at right in mono.
- **Log row**: default, selected (surface +1), linked to trace (underlined trace id; Enter jumps to Traces).
- **Tabs**: dirty dot, pinned, preview (italic); middle-click and Ctrl+W close.

Resizable panel behavior:
- Splits are a tree stored as ratios; the layout is persisted per workspace in `layout.json`.
- Min sizes: explorer 180px, editor 360px, bottom dock 96px, inspector 220px. Dragging below min-minus-40px collapses the panel to its strip; double-click a seam resets to default ratio.
- Snap detents at 25%, 33%, 50%, 66%, 75% within 8px; hold Alt to disable snapping.
- Keyboard: focus a seam with `Ctrl+Alt+Arrow`, then Arrow moves 16px, Shift+Arrow 64px, Enter commits, Esc cancels. Splitters are `role="separator"` with `aria-valuenow`.
- Pointer: `setPointerCapture`, writes `--panel-size` CSS variable during drag, commits ratio on `pointerup`; editor relayout deferred to `requestAnimationFrame`.

Token highlights:

```css
:root {
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --radius-0: 0; --radius-1: 2px;
  --g-0: #121416; --g-1: #181b1e; --g-2: #1f2327; --g-3: #292e33;   /* graphite steps */
  --seam: #2f353b;
  --ink-1: #e6e9ec; --ink-2: #a0a8b0; --ink-3: #6b737b;
  --acid: #c5f03a;            /* focus, running, passing */
  --warn: #e8a13a; --err: #ef5b4f;
  --row-h: 28px; --rail-w: 48px; --seam-grab: 6px;
  --ease-detent: steps(1, end);   /* focus rings */
  --ease-mech: cubic-bezier(0.3, 0, 0.1, 1);
}
```

Typography scale: UI labels 12/16 Geist 500; panel headers 11/16 JetBrains Mono uppercase tracking 0.06em; code 13/20 JetBrains Mono with ligatures off; palette input 16/24 Geist; status bar 11/16 JetBrains Mono.

Framework notes: Tauri or Electron shell; panels via CSS grid driven by CSS variables, not nested flexbox re-measuring. React: a `useDock()` store (ratios, focus, collapsed) with `useSyncExternalStore`; commands registered in one `registry.ts` (id, title, shortcut, run) that feeds palette, menus, and keybinding UI. Tailwind: define `g-0..g-3`, `seam`, `acid` colors; forbid `rounded-lg` and `shadow-*` except the palette's single `shadow-pop`.

## 4. Motion decisions

- Splitter detent: size changes track the pointer 1:1; on entering a snap zone the seam steps to the detent in 60ms `cubic-bezier(0.3, 0, 0.1, 1)` and the notch lights for 120ms.
- Focus ring: 2px acid outline appears with `steps(1)` (no fade), so focus is unambiguous at speed.
- Palette open: 100ms, opacity 0 to 1 plus translateY(-6px) to 0; close 60ms. Selection highlight slides between rows in 80ms.
- Panel collapse/expand: width/height transition 140ms `--ease-mech`; content clips, never scales.
- Workspace mode switch: panel contents swap in 100ms (opacity only), seams do not move.
- Tab close: 90ms width collapse; adjacent tabs shift, no bounce.
- Procedural effect: a 1px, 40px-wide acid highlight scans the status-bar top edge every 1400ms while a task runs. Budget: one composited transform animation, off-screen or window-blurred pauses it (`visibilitychange`, `blur`), stops on task end.
- Reduced motion: collapse/expand and palette become instant; scan replaced by a static acid underline and the text "running"; detent notch still flashes via color only.

## 5. Why it works

- Developers value predictability: steps-based focus and detent snapping make the UI feel mechanical and trustworthy, not playful.
- Separated panels with shared seams read as one instrument and let the user rebuild the layout for debugging versus writing.
- Mono for machine facts reduces misreading of ids and durations; the sans UI font keeps labels quiet.
- Command registry plus palette means mouse use is optional, which is the product promise.
- Deliberately avoids: rounded card panels with shadows, purple-blue gradients, glassmorphism, oversized onboarding hero, emoji icons, chat-bubble sidebars, and bouncy springs.

## 6. Originality check

1. Could another product's name replace "Lathe" with no visual change? No: detent notches and acid-on-graphite live state are specific.
2. Motif specific to the concept? Yes, the machinist detent: notches on seams, sliders, and snap feedback.
3. Palette used with intent? Yes, graphite-acid with acid reserved for focus/running and a separate warm pair for diagnostics.
4. Layout not sidebar plus card grid? Yes, a dockable split tree with a rail used only for modes.
5. Type voice distinct? Yes, mono panel labels and 11px uppercase headers.
6. Motion matched to personality? Yes, mechanical preset with stepped focus and detent snaps.

## 7. Verification notes

- 1440x900: all four panel zones and status bar visible; seams align continuously; editor shows at least 40 lines.
- 1280x800: inspector still visible at 240px; bottom dock at least 160px; drag every splitter and confirm detents.
- 768x1024: below the 960 minimum, show a documented fallback (single panel plus tab switcher) and verify nothing overlaps; note this is outside the supported desktop envelope.
- 390x844: single-panel tab mode (editor, files, terminal as tabs) with a graceful notice; full multi-panel editing is not expected.
- Test keyboard only: open palette, run a command, resize a panel via keyboard, close a tab, with visible focus at every step.
- Check mono glyph rendering at 13px on 100% and 150% scaling; contrast of `--ink-3` against `--g-1`.
- `screenshots/` placeholder: populate by running the benchmark; do not fabricate.
