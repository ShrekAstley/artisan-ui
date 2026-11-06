# Example: Analytical Platform ("Ledgerline")

## 1. Concept

Ledgerline is an analytical platform for infrastructure and operations analysts who investigate service reliability: latency, error budgets, deploy impact, and cost per request. The audience reads data for hours, compares many series at once, and must trust every number. Goal: communicate clarity and trust through typography, rules, tables, and small multiples, with no decorative card chrome.

Load when: designing a dashboard / analytical data product or needing a worked example

Build order if budget-limited (e.g. a single-file build): tokens + shell wireframe first, then the one core interaction, then states and motion. Everything else in this spec is optional. Examples are illustrative; the approved `.artisan/` profile outranks them, and libraries outrank example token values.

Real data it binds to: OpenTelemetry metrics (`http.server.duration` histograms, `http.server.request.count` by `status_code`), a deploy event stream (`deploy_id`, `service`, `sha`, `started_at`), SLO definitions (`objective`, `window_days`, `budget_remaining`), and a billing export (`service`, `usd_per_day`). Every figure on screen carries its source, window, and aggregation in a caption. No invented marketing stats; empty states say "no data in window" with the query used.

## 2. Design profile

```json
{
  "identity": {
    "name": "Ledgerline",
    "category": "analytical-platform",
    "personality": ["exact", "calm", "auditable", "dense-but-quiet"]
  },
  "visual": {
    "theme": "both",
    "themeNotes": "light-first with a true dark twin; surfaces differ by hairline, not by shadow",
    "palette": "slate-amber",
    "typography": { "display": "Instrument Sans", "body": "Inter", "data": "Geist Mono" },
    "density": "compact-high",
    "radius": "sharp"
  },
  "layout": {
    "navigation": "top scope bar (service / environment / time window) plus a left-aligned section index of text links; no icon sidebar",
    "content": "single flowing sheet divided by 1px rules: headline readout, then small-multiple grid, then a sortable table with inline sparklines",
    "responsive": true,
    "responsiveNotes": "columns collapse to a stacked reading order at 768; at 390 the table becomes a ranked list with one metric per row and a metric switcher"
  },
  "motion": {
    "preset": "precision",
    "microInteractions": ["crosshair that links all small multiples", "row hover rule highlight", "sort-arrow flip", "number tick on window change"],
    "pageTransitions": "none between sections (scroll anchors); 120ms cross-fade when the time window changes data",
    "proceduralEffects": "none; the chart crosshair is the only continuous effect"
  },
  "principles": [
    "Every number has a unit, window, and source within one glance",
    "Hierarchy is made with type size and rules, never with boxes",
    "Amber means attention; everything else is ink on paper",
    "Compare with small multiples sharing one scale, not dual-axis charts",
    "Tables are first-class, not an afterthought under the charts"
  ],
  "motif": "ledger rule: a 1px baseline with tick marks that recurs as axis, section divider, and row separator",
  "shapeLanguage": "orthogonal, sharp corners, hairlines; no pills, no rounded containers",
  "colorPhilosophy": "slate neutrals carry 95% of the surface; amber is reserved for budget burn, anomalies, and selection; series are told apart by position and direct labels, not a rainbow",
  "spatialComposition": "12-column grid, 8px base, wide left margin for row labels; whitespace comes from line-height, not padding boxes",
  "interactionPersonality": "a careful instrument: hover reveals precision, click pins it, nothing bounces"
}
```

## 3. Implementation

```
1440x900
+--------------------------------------------------------------------------+
| LEDGERLINE   checkout-api v  prod v  [ Last 7d ][ 24h ][ 30d ]   Cmd+K   |
+--------------------------------------------------------------------------+
| Overview  Latency  Errors  Deploys  Cost  SLOs                           |
+--------------------------------------------------------------------------+
| p95 latency          Error rate          Budget remaining     $/1k req   |
| 312 ms               0.41 %              71 %                 $0.082     |
| -18 ms vs prior 7d   +0.06 pt            burn 1.4x            -3 %       |
| histogram, otel, agg: p95 per 5m, source: collector-eu                   |
|--------------------------------------------------------------------------|
| LATENCY p95 BY ENDPOINT   (shared y scale 0-800 ms)                      |
| /cart  ~~~~~~^~~~~~    /pay   ~~~~~~~~~~     /search ~~^~~~~~~            |
| /login ~~~~~~~~~~~~    /ship  ~~~^^~~~~~     /feed   ~~~~~~~~~            |
|   deploy ticks along the baseline: | a91f  | c02e                        |
|--------------------------------------------------------------------------|
| Endpoint     Req/min   p50   p95   p99   Err %  Trend(7d)    Budget burn  |
| /pay          1,204    88    312   604   0.62   ~~~~^~~~     1.9x  [amber]|
| /cart         3,876    41    140   288   0.12   ~~~~~~~~     0.4x         |
+--------------------------------------------------------------------------+
```

Key components and states:
- **Readout** (headline figure): default, comparing (shows prior-period ghost value), stale (value dimmed, "as of 14:02" in amber), empty ("no data in window").
- **Small multiple**: default, hovered (shared crosshair across all panels), pinned (click holds crosshair, Esc releases), anomaly (amber segment plus text label, never color alone), loading (axis and rules render first, line draws after).
- **Data table**: sortable header (arrow plus `aria-sort`), row hover (2px left rule in amber, no fill), row selected (opens a detail strip below the row, not a modal), sticky header and first column.
- **Scope bar controls**: segmented window control, service combobox with typeahead, all keyboard operable.
- **Deploy tick**: vertical hairline on every chart sharing the time axis; hover shows sha and author.

Token highlights:

```css
:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
  --radius-0: 0;   --radius-1: 2px;                 /* only inputs and focus rings use 2px */
  --ink: #16191d;  --ink-2: #4a525c;  --ink-3: #5f6872;     /* slate-amber, light */
  --paper: #f6f6f3; --paper-2: #efefea;
  --rule: #d9d9d2; --rule-strong: #16191d;
  --accent: #b7791f;                                  /* amber: burn, anomaly, selection */
  --series-1: #16191d; --series-2: #5b6b7c; --series-ghost: #b8bec5;
  --row-h: 32px;  --measure-caption: 62ch;
}
:root[data-theme="dark"] {
  --ink: #e8e9e6; --ink-2: #aab1b9; --paper: #101316; --paper-2: #161a1e;
  --rule: #2a3037; --accent: #e0a23b;
}
```

Typography scale (px / line-height): readout 40/44 Instrument Sans 600; section title 13/16 uppercase, tracking 0.08em; body 14/20 Inter; table 13/16 Inter with Geist Mono tabular figures (`font-variant-numeric: tabular-nums`); caption 11/14 Geist Mono in `--ink-3`.

Framework notes: plain CSS grid with `grid-template-columns: [label] 14rem repeat(12,1fr)`. React: one `<SmallMultiples>` that owns a shared `hoverTime` in a ref plus a subscribe function so panels repaint without re-rendering the tree; charts as SVG (d3-scale and d3-shape only), not a chart-kit. Tailwind: map tokens in `theme.extend`, ban `shadow-*` and `rounded-*` above `rounded-sm` via a lint rule; use `divide-y` and `border-t` for structure.

## 4. Motion decisions

- Crosshair: follows the pointer with no easing (direct manipulation); label snaps to nearest sample.
- Row hover rule: left rule scales `scaleY` 0 to 1, 90ms, `cubic-bezier(0.2, 0, 0, 1)`.
- Sort arrow: 140ms rotate, same easing; rows reorder with a 180ms FLIP translate.
- Number tick on window change: old value fades out 80ms, new value fades in 120ms; no counting animation (counting misleads about precision).
- Window change data swap: 120ms opacity cross-fade on chart layers, axes stay still.
- Chart line first draw: stroke-dashoffset 360ms `cubic-bezier(0.4, 0, 0.2, 1)`, once per mount only.
- Procedural effect: none. Budget: zero requestAnimationFrame loops while idle; the crosshair uses pointer events only.
- Reduced motion: drop FLIP, draw-in, and fades to instant; keep the crosshair (it is user-driven, not decorative).

## 5. Why it works

- Analysts compare; small multiples on one shared scale make comparison the default, which cards with isolated charts hinder.
- Rules and tick marks echo accounting ledgers, reinforcing the trust and auditability the product sells.
- Amber exists only for burn, anomaly, and selection, so color is information. A reader can scan a page and see only what needs attention.
- Tabular figures, units, and source captions make each number verifiable.
- Deliberately avoids: sidebar plus KPI card grid, rounded shadowed cards, gradient area charts, donut charts, dual-axis charts, icon-only nav, "+12.4% vs last month" green/red arrows without context, and animated counters.

## 6. Originality check

1. Could another product's name replace "Ledgerline" with no visual change? No: the ledger-rule motif and shared-scale small multiples define it.
2. Is there a motif specific to the concept? Yes, the ledger baseline with ticks, reused as axis, divider, and deploy marker.
3. Is the palette used with intent rather than defaulted? Yes, slate-amber with amber restricted to attention semantics.
4. Is the layout not sidebar plus card grid? Yes, top scope bar plus a ruled single sheet.
5. Does the type have a voice distinct from the other examples? Yes, Instrument Sans plus Geist Mono figures in compact sizes.
6. Is motion matched to personality? Yes, precision preset, no decorative loops.

## 7. Verification notes

- 1440x900: readout row, all small multiples, and at least 6 table rows visible without scrolling the page; no card borders anywhere.
- 1280x800: small multiples drop from 3 to 2 columns; table keeps sticky first column; no horizontal page scroll.
- 768x1024: stacked reading order; table scrolls horizontally inside its own region with a visible edge hint.
- 390x844: table becomes ranked list with metric switcher; scope bar collapses to a single "checkout-api / prod / 7d" button opening a sheet; touch targets at least 44px.
- Check contrast of `--ink-3` captions (4.5:1 minimum), amber on paper in both themes, and that anomalies carry a text label.
- `screenshots/` placeholder: populate by running the benchmark; do not fabricate.
