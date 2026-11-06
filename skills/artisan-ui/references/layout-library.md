# Layout Library
Load when: choosing page/app structure, navigation pattern, content layout, spacing/radius/elevation systems, density, or mapping a product type to a layout.

## 1. Selection procedure
Derive layout from information architecture, not fashion. Do NOT default to sidebar + topbar + hero + card grid. Bento grids are an option, never a default.
1. Primary task: what does the user do most (monitor, create, read, compare, decide, buy, configure)? The layout serves that task's focal region.
2. Frequency: daily/hourly tools -> persistent, dense, keyboard-first navigation; occasional/consumer -> light, visible, guided navigation.
3. Content types: prose, tables, media, canvas, forms, streams, spatial/timeline data. Each has a natural container (see section 3).
4. Destination count: <=5 top-level -> top nav or rail; 6-12 -> sidebar; many/unbounded -> command-centered + search; 1-3 -> no persistent nav.
5. Density: glanceable operations (high) vs reading/browsing (low). Pick a density mode (section 4).
6. Input mode: pointer+keyboard (precision, hover, shortcuts), touch (44px targets, bottom reach, no hover), controller/TV (focus grid, 10-foot), hybrid.
7. Posture: focused single flow vs parallel multi-pane work vs ambient glance.
8. Choose one navigation layout (sec 2) + one primary content layout (sec 3) + at most one secondary. Justify each in one line.
9. Define responsive transformation explicitly (not just shrink): what collapses, reorders, becomes a sheet, loses features.
10. Sanity check: remove a region; if nothing breaks, remove it permanently.

## 2. Navigation layouts

### 2.1 Navigation rail
- Use: 3-7 stable top-level destinations, tools where content width matters, creative/workstation apps, tablets.
- Not: >8 destinations, destinations needing long labels, hierarchies deeper than 1 level.
- Anatomy: vertical strip, icon + short label (or icon with tooltip), active indicator, optional top logo/bottom settings+account.
- Dimensions: 64-80px wide (icon 24px, label 11-12px); item hit area >= 48x48; gap 4-8px; indicator 2-3px bar or filled pill.
- Responsive: >=1024px rail left; 600-1023px rail stays; <600px becomes bottom bar (<=5 items) or drawer.
```
+----+---------------------------+
| [] |                           |
| [] |        content            |
| [] |                           |
|    |                           |
| [] |                           |
+----+---------------------------+
```
- A11y: `<nav aria-label="Primary">`, list of links, `aria-current="page"` on active, icon-only items need accessible names + tooltip on focus too; arrow-key roving optional, Tab must reach every item.

### 2.2 Expandable sidebar
- Use: 6-15 destinations, nested sections, workspaces/projects switching, admin/knowledge tools.
- Not: few destinations, content-first reading, small-screen primary experience, or when it would hold only 3 links.
- Anatomy: header (workspace switcher), grouped sections with labels, items with icon+label+badge, footer (user, help); collapse toggle; resizable optionally.
- Dimensions: expanded 240-280px (min 200, max 360); collapsed 56-64px (icons); item height 32-36px dense / 40px comfortable; section label 11px caps.
- Responsive: >=1280 expanded; 768-1279 collapsed by default; <768 off-canvas drawer with scrim, opened by a labeled button, closes on route change/Esc.
```
+--------+-----------------------------+
| WS  v  |                             |
| Home   |                             |
| Inbox 3|          content            |
| -Group |                             |
|  Item  |                             |
|  Item  |                             |
| user   |                             |
+--------+-----------------------------+
```
- A11y: nav landmark; collapse button `aria-expanded` + `aria-controls`; tree-like nesting via nested lists, disclosure buttons for groups; persist collapsed state; collapsed items keep tooltips and names; focus trap in mobile drawer; `Ctrl/Cmd+B` toggle is a nice shortcut.

### 2.3 Top navigation
- Use: content sites, storefronts, marketing, products with <=7 top destinations, wide content (tables, canvases using full height).
- Not: deep hierarchy, many destinations, apps with persistent tool panels needing full height.
- Anatomy: logo left, links center/left, actions/search/account right; optional second row for sub-navigation or filters; mega-menu only for catalogs.
- Dimensions: height 56-64px (48 compact); content max-width 1200-1440px aligned with page grid; link gap 24-32px; sticky only if scroll depth is long; shrink to 48px on scroll.
- Responsive: <768px collapse to menu button + sheet, keep search and primary CTA visible; do not hide the cart/account.
```
+------------------------------------------+
| Logo   Link  Link  Link      [search] (u)|
+------------------------------------------+
|                content                   |
+------------------------------------------+
```
- A11y: skip-to-content link first; `<nav>`; dropdowns open on click (not hover only), Esc closes, arrow keys optional in menus; visible focus; `aria-current`; menu button `aria-expanded`.

### 2.4 Dock-based navigation
- Use: workstation/launcher/OS-like products, game launchers, creative suites with many tools, kiosks, immersive or full-screen apps where chrome should recede.
- Not: content/information sites, deep IA, or where discoverability of labels is critical for first-time users.
- Anatomy: floating or edge-docked bar (bottom/left) of icon buttons, magnify/hover labels, active dot, grouped separators, optional overflow; auto-hide in immersive views.
- Dimensions: height 56-72px (icons 28-40px), padding 8-12px, gap 6-10px, radius per shape language (pill or rounded); inset 12-16px from edge; never overlap primary content without reserved space or auto-hide.
- Responsive: desktop bottom or left; mobile bottom (<=5 items, 56px+safe-area inset); controller mode: focus ring grid.
```
+------------------------------------------+
|                                          |
|             full-bleed content           |
|                                          |
|        [ o  o  o | o  o  (o) ]           |
+------------------------------------------+
```
- A11y: `role="toolbar"` or nav with list; labels not hover-only (tooltip on focus too); magnification effect disabled under `prefers-reduced-motion`; hit area >= 44px; keyboard shortcuts with visible hints.

### 2.5 Hybrid
- Pattern: top bar for global (search, account, workspace) + rail/sidebar for in-product tools; or rail + contextual secondary panel (rail = areas, panel = items in area).
- Rules: one source of truth per destination (never both in the bar and sidebar); global actions at top, local navigation at side; limit chrome to <= 20% of viewport height + width.
```
+--------------------------------------------+
| Workspace    [ search / command ]    (user)|
+----+------------+--------------------------+
| [] | Section    |                          |
| [] |  item      |        content           |
| [] |  item      |                          |
+----+------------+--------------------------+
```

## 3. Content layouts

### 3.1 Asymmetric grid
- Best: portfolios, editorial landing pages, product storytelling, dashboards with one hero metric.
- Structure: 12-col grid, uneven spans (7/5, 8/4, 5/7), one dominant column, offset columns, intentional empty cells; align to baseline.
- Combine with: top nav, editorial column, immersive sections.
- Pitfalls: arbitrary offsets without a rule; mobile collapse that loses hierarchy; decoration over content.
```
+------------------+-------+
|   dominant       | small |
|                  +-------+
|                  | small |
+---------+--------+-------+
| aside   |  wide block    |
+---------+----------------+
```

### 3.2 Master-detail
- Best: email, tickets, records, files, settings with many items; selection-driven workflows.
- Structure: list (320-400px, scroll independently) + detail pane (flex); selection state in URL; empty state in detail.
- Combine with: sidebar/rail nav, data table (list becomes table), command palette for jump.
- Pitfalls: detail losing context on narrow screens (use stacked navigation: list -> detail with back); nested scroll traps; no selection persistence.
```
+----------+---------------------+
| item     |  Detail title       |
| item *   |  ...                |
| item     |  ...                |
+----------+---------------------+
```

### 3.3 Split workspace
- Best: code/IDE, editor + preview, compare/diff, research with source + notes, creative tools.
- Structure: 2-3 resizable panes with drag handles (4-8px, hit 12px), min widths, collapsible panes, saved layouts.
- Combine with: rail, dock, command-centered, master-detail inside a pane.
- Pitfalls: no keyboard resize; too many panes on small screens (collapse to tabs); focus ambiguity between panes (show active pane indicator).
```
+----------+-----------+---------+
| tree     |  editor   | preview |
|          |           |         |
+----------+-----------+---------+
| terminal / output              |
+--------------------------------+
```

### 3.4 Editorial column
- Best: articles, docs, case studies, reading apps, onboarding narratives.
- Structure: single column 60-68ch, generous margins, optional marginalia (notes, figures) hanging in a side column >=1100px; full-bleed media breaks; sticky table of contents optional.
- Combine with: top nav or none, asymmetric grid for intro/hero, immersive full-screen for media chapters.
- Pitfalls: line length >75ch; sidebars crowding text; cards wrapping prose.
```
+----+--------------------+------+
|toc |  Headline          | note |
|    |  paragraph (62ch)  |      |
|    |  [ figure wide ]   |      |
+----+--------------------+------+
```

### 3.5 Canvas
- Best: design, diagramming, whiteboard, maps, node editors, 3D scene.
- Structure: infinite or large workspace fills viewport; floating tool palette, properties panel (right, 280-320px), minimap/zoom control, status bar; pan/zoom/selection modes.
- Combine with: dock or rail, split workspace (inspector), command-centered.
- Pitfalls: chrome covering canvas; no zoom-to-fit; no keyboard pan/zoom; non-canvas a11y alternative (outline/list view) missing.
```
+--+------------------------+-----+
|T |                        | props|
|o |      canvas            |     |
|o |                        |     |
|l |   [minimap]  zoom 100% |     |
+--+------------------------+-----+
```

### 3.6 Timeline
- Best: activity logs, project schedules, history, media editing, audit trails, roadmap.
- Structure: time axis (horizontal for schedules/media, vertical for feeds); grouped by day/phase; sticky labels; zoom levels; now-marker; virtualized rows.
- Combine with: master-detail (event -> detail), data table (alt. view), split workspace.
- Pitfalls: unbounded length without grouping/filter; relying on color for event types; time zones not shown.
```
 Mon 12        Tue 13        Wed 14
 |---[ task A ]--|
       |------[ task B ]-----|
                   * now
```

### 3.7 Data table
- Best: records, logs, inventory, admin, finance ledgers, comparisons.
- Structure: sticky header, left-sticky identifier column, right-aligned tabular numerals, row height 32/40/48 (density), column resize/sort/filter, bulk-select toolbar, pagination or virtualization, row detail drawer.
- Combine with: master-detail (row -> drawer), sidebar/top nav, toolbar filters, command-centered.
- Pitfalls: horizontal scroll without frozen id column; zebra + borders + hover all at once; hidden sort affordances; mobile: switch to stacked row cards with key fields, not a squeezed table.
```
| [] | Name   ^ | Status | Amount |
|----+----------+--------+--------|
| [] | row      | * ok   |  1,204 |
```
- A11y: real `<table>`, `<th scope>`, `aria-sort`, selection announces count, keyboard row navigation.

### 3.8 Modular dashboard
- Best: monitoring, KPIs, operations, portfolios of live data, personalized home.
- Structure: modules in a 12-col grid, sized by importance (hero metric large, supporting small), consistent module header (title, range, actions), global filter bar, shared time range; modules separated by whitespace or rules, not mandatory cards.
- Combine with: top nav or rail, data table drill-down, timeline.
- Pitfalls: equal-size tile grids (no hierarchy); too many modules (>8 above fold); decorative charts; no loading/empty/error states per module.
```
+----------------+--------+--------+
|  hero metric   | kpi    | kpi    |
|  + chart       +--------+--------+
|                | list / alerts   |
+----------------+-----------------+
| table drill-down                 |
+----------------------------------+
```

### 3.9 Immersive full-screen
- Best: games, media players, presentations, storytelling, onboarding moments, launch screens.
- Structure: content bleeds edge-to-edge; chrome (HUD, nav dock) minimal, auto-hide on idle, reappear on pointer/focus/touch; safe-area padding; clear exit affordance (Esc, close button).
- Combine with: dock navigation, editorial sections, command-centered.
- Pitfalls: text over busy imagery without scrim; hidden controls with no discoverability; no keyboard/controller path; ignoring reduced-motion.
```
+----------------------------------+
|  [<]                      [?]    |
|                                  |
|        full-bleed scene          |
|                                  |
|      [ primary action ]          |
+----------------------------------+
```

### 3.10 Command-centered
- Best: power-user tools, developer products, many actions/entities, search-first apps.
- Structure: global command palette (Cmd/Ctrl+K), omnibox at top or center, recent/pinned items as home, actions-by-context; GUI surfaces remain for browsing but every action has a command and shortcut.
- Combine with: any nav layout as the accelerator, never the only navigation.
- Pitfalls: command-only with no discoverable UI; no fuzzy search or ranking; shortcuts without hints; palette not announced to screen readers.
```
+----------------------------------+
|        > search or run...        |
|  Recent                          |
|   [i] Open project               |
|   [i] New file          Ctrl+N   |
+----------------------------------+
```
- A11y: dialog with `role="combobox"`+listbox pattern, `aria-activedescendant`, focus returned on close.

## 4. Shape language, density, spacing

### Shape language (pick one, apply everywhere)
| Language | Radius scale (xs/sm/md/lg/xl) | Feel | Corner logic |
|---|---|---|---|
| sharp / technical | 0 / 2 / 2 / 4 / 6px | precise, instrument | all controls 2px; no pills |
| soft-modern | 4 / 6 / 8 / 12 / 16px | friendly SaaS | control r=md; containers r=lg |
| rounded-friendly | 8 / 12 / 16 / 20 / 28px + pill buttons | consumer, playful | everything round, buttons pill |
| editorial-square | 0 everywhere, hairline rules | print, luxury | rules and spacing do the work |
Rules: nested radius = outer radius - padding (inner r = max(0, outer - gap)); same family of radii for all components; one pill usage rule (buttons+chips only); icons, avatars, and image masks follow the same language; do not mix sharp and fully rounded.
```css
:root{--radius-xs:2px;--radius-sm:4px;--radius-md:8px;--radius-lg:12px;--radius-xl:16px;--radius-full:9999px}
```

### Density modes
| Mode | Control height | Row height | Padding (control x) | Body size | Use |
|---|---|---|---|---|---|
| compact | 28px | 28-32px | 8px | 12-13px | pro tools, tables, IDEs |
| standard | 36px | 40px | 12px | 14px | most apps |
| comfortable | 44px | 48-56px | 16px | 16px | consumer, touch, accessibility |
Expose `data-density="compact|standard|comfortable"` mapped to tokens (--control-h, --row-h, --space-inset). Touch targets >= 44x44 CSS px (24x24 absolute WCAG 2.2 minimum).

### Spacing scale (4/8 base, named steps)
| Token | px | Use |
|---|---|---|
| --space-1 (3xs) | 4 | icon-text gap, tight inline |
| --space-2 (2xs) | 8 | control inner gaps |
| --space-3 (xs) | 12 | label-field, small padding |
| --space-4 (sm) | 16 | default padding, list gap |
| --space-5 (md) | 24 | group gap, card padding |
| --space-6 (lg) | 32 | section inner gaps |
| --space-7 (xl) | 48 | section separation |
| --space-8 (2xl) | 64 | major blocks |
| --space-9 (3xl) | 96 | page rhythm, hero |
| --space-10 (4xl) | 128 | editorial/luxury only |
Rules: only scale values; proximity = relationship (inside a group <= 1/2 the gap between groups); vertical rhythm on multiples of 4px; use `gap`, not margins on children; page gutters 16px mobile / 24px tablet / 32-48px desktop; content max-width 1200-1440px (prose 65ch).

### Whitespace and composition
- Establish one focal region per view (largest, highest contrast, first in reading order). Secondary regions defer in size and contrast.
- Align to a small number of edges (left edge, column lines); a stray offset must be deliberate.
- Group by proximity and rules before boxes. Space > rule > background tint > border > shadow (use the weakest sufficient separator).
- Balance asymmetrically: heavy left or top region offset by whitespace; avoid centering everything.
- Empty states and edge cases belong in the layout plan, not an afterthought.

### Direct composition over cards
Default: place content directly on the background, separated by spacing, hairlines, type scale, and alignment. A card (container with distinct surface/border) is justified only when:
1. it is an interactive unit (click/drag/select as a whole), e.g. a project tile, product, draggable item;
2. it must be compared or repeated as equal peers in a collection with heterogeneous media;
3. it is a floating layer (popover, menu, dialog, toast) needing elevation;
4. it groups a self-contained module with its own header/actions on a busy background.
Not justified: wrapping every section, nesting cards in cards, cards for plain text, uniform card grids as the page structure. Max nesting depth 1. A page with >50% of its content in boxed cards needs revision.

### Z-index and elevation scale
| Layer | z-index | Shadow / treatment |
|---|---|---|
| base content | 0 | none |
| sticky headers / rails | 10 | 1px border-bottom, no shadow until scrolled |
| dropdown, popover, tooltip | 100 | `0 4px 16px rgb(0 0 0/.16)` + border-subtle |
| docked panels / drawers | 200 | `0 8px 24px rgb(0 0 0/.20)` |
| modal scrim | 300 | --color-overlay |
| modal dialog | 310 | `0 16px 48px rgb(0 0 0/.28)` |
| toast / notifications | 400 | `0 8px 24px rgb(0 0 0/.24)` |
| command palette / critical | 500 | like modal |
Rules: z-index values only from this scale (CSS variables); create stacking contexts with `isolation:isolate` on layout roots; in dark mode elevation = lighter surface (surface-elevated) + border, shadows are weak; light mode = shadow + border-subtle; avoid blur/glass unless it conveys depth.

## 5. Combination recipes
Each recipe: product -> nav + content layouts, shape, density, notes.

1. **Finance dashboard** -> Top navigation (<=6 areas: Overview, Accounts, Transactions, Reports...) + Modular dashboard (hero net-worth/total metric large, supporting KPIs small) + Data table drill-down with right-side row drawer. Shape: sharp/soft-modern, density standard-compact, tabular numerals, one accent, status colors only for state. Mobile: bottom bar, modules stack hero-first, tables become stacked rows.
2. **Creative workstation** -> Navigation rail (tools) or Dock + Canvas center + right properties panel (split workspace) + bottom timeline when time-based. Command-centered accelerator (Cmd+K). Shape: sharp or soft-modern, density compact, dark mode default, floating panels dockable; chrome <=25% of viewport; alt outline view for a11y.
3. **Game launcher** -> Dock-based navigation (Library, Store, Friends, Settings) + Immersive full-screen hero of selected title + horizontal shelf lists (asymmetric: 1 large, rest small). Shape: rounded-friendly or sharp-stylized per game brand; controller focus grid with visible focus ring; 10-foot type (>= 20px body), auto-hide HUD, music/animation respects reduced motion.
4. **Reading app** -> No persistent nav in reading view; library uses Top navigation or Navigation rail; reading view is Editorial column (62ch, adjustable size/line-height/theme) with collapsible table of contents; master-detail for notes/highlights. Shape: editorial-square or soft; density comfortable; warm-paper or dark lamplight palette; progress as thin rule, not widgets.
5. **Admin tool** -> Expandable sidebar (grouped entities) + Data table + Master-detail (row -> record page/drawer) + Command-centered search (find any entity). Shape: soft-modern or sharp, density compact/standard (user-selectable), bulk actions toolbar, audit timeline tab per record; permissions-aware empty states.
6. **Storefront** -> Top navigation (catalog categories, search, cart) + Asymmetric grid for merchandising landing + uniform product grid for listings (cards justified: interactive peers with imagery) + Master-detail-like product page (gallery left sticky, buy box right) + Editorial column for brand story. Shape: per brand (rounded-friendly or editorial-square); density comfortable; sticky add-to-cart on mobile; filter drawer on mobile.

### Anti-patterns to reject
- Same sidebar + card grid for every product; hero with gradient blob + 3 feature cards.
- Bento grid used as default marketing structure.
- Centered everything; equal-size tiles; equal visual weight on all regions.
- Nav chosen because a template had it; navigation with more levels than the IA has.
- Layout decisions without a responsive transformation plan.
