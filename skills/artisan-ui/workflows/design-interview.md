# Workflow: Design Interview (Phase 2)
Load when: Discovery is complete and the visual direction is unclear, incomplete, or changed; or the user asks to define or redo a design direction.

## Goal
Elicit enough about product, personality, layout, color, type, motion, detail and constraints to write a design profile, in as few questions as possible. The interview is adaptive, not a form: branch on answers, skip what is known, delegate what the user does not care about.

## Core rules
1. **Never ask 30 questions regardless.** The bank below is a menu. Ask only what changes the design and is not already answered (by the request, the repo, the existing profile, references).
2. **Batch up to 4 questions per AskUserQuestion call**, each with 2-4 concrete options plus an implicit "other". Prefer multiple choice over open text.
3. **Offer visual direction options early** (see below); people react better to concrete directions than to abstract adjectives.
4. **Allow skip, delegate, and references.** Every question set must be answerable with "you decide" or by supplying a reference image/site.
5. **Branch.** Use the branching table; each answer can remove or add questions.
6. **State assumptions.** For anything delegated or skipped, derive from product purpose and write the assumption in the approval summary.
7. **Respect the preserve list** from Discovery; never propose changes that violate it.
8. Write answers into your working notes as you go; persist after approval to `.artisan/design-profile.json`.

## Interview depth (pick from Discovery recommendation)
| Path | Questions | Stages covered | When |
|---|---|---|---|
| **quick** | up to 4 total (one AskUserQuestion call) | identity+personality merged, color, motion, approval | small project, clear request, delta on existing profile |
| **standard** | about 8-14 across 2-4 calls | all 9 stages, trimmed by branching | default |
| **deep** | 15-24 across 5-7 calls | all stages fully, plus references and a content audit | brand-critical, large rebuild, user wants to explore |

Quick path default question set: (1) product + audience in a phrase (if not already known), (2) direction option, (3) light/dark/both + accent temperature, (4) motion level. Everything else derived.

## Visual direction options
Present as the first batch once the product is understood. Each option: name, one-line look, "good for". Combinations are allowed (for example Swiss typography + refined dark theme).

| Direction | Look | Good for |
|---|---|---|
| **Swiss / Editorial** | Strict grid, big confident type, flush-left, ample white, few colors, rules and numerals | content-heavy products, portfolios, documentation, publishing, data storytelling |
| **Refined / Minimal** | Quiet neutrals, soft depth, careful spacing, restrained accent, polished micro-detail | productivity, consumer apps, wellness, premium tools |
| **Brutalist / Experimental** | Raw type, hard edges, visible structure, unconventional layout, high contrast | creative studios, music/culture, tools with attitude, campaigns |
| **Technical / Instrumental** | Dense, hairlines, mono data, compact controls, status-driven color | developer tools, monitoring, admin, analytics, pro software |
| **Luxury / Editorial** | Elegant serif/display, high-contrast typography, restrained palette (ink, ivory, champagne), cinematic space | fashion, hospitality, high-end commerce, galleries, storytelling |

Example combinations: Swiss type + refined dark; Technical layout + editorial serif for headings; Luxury palette + minimal layout.

## The 9 stages and question bank
Order is a guide; skip or merge freely. Each question lists answer options; always allow "you decide".

### Stage 1 - Product identity (A)
- **Name**: product name (and tagline if any).
- **Purpose**: what does it do, in one sentence? What problem for whom?
- **Audience**: who uses it (role, expertise, device, context)? Frequency (daily power-use vs occasional)?
- **Product kind**: dashboard / tool / content site / marketing / e-commerce / social / game UI / creative / other.
- **Key screens**: top 2-4 screens or flows that matter most (pre-fill from Discovery).
- **Feel**: pick up to 3 words: calm, precise, playful, bold, warm, serious, luxurious, raw, friendly, technical, cinematic, human.

### Stage 2 - Visual personality (B)
- **Direction option** (from table above) and any combination.
- **Reference points**: any product or site whose feel you like (or dislike)? (leads to reference analysis)
- **Anti-goals**: what must it never feel like? (corporate, childish, cluttered, cold, trendy)
- **Boldness**: understated / balanced / statement.

### Stage 3 - Layout (C)
- **Navigation**: sidebar / top bar / bottom dock / hybrid / command-palette-first.
- **Width model**: fixed-width centered / fluid full-bleed / constrained with wide breakouts.
- **Density**: dense (power users) vs spacious (comfort/reading) vs adaptive (user toggle).
- **Alignment**: centered vs asymmetric/editorial.
- **Views**: single focus view vs multi-view/multi-pane workspace.
- **Controls**: persistent toolbars vs contextual (appear on selection/hover).
- **Small screens**: collapse to drawer / bottom tabs / stack / different task flow? Is mobile a primary target?

### Stage 4 - Color (D)
- **Theme**: light / dark / both (system + toggle).
- **Temperature**: warm / cool / neutral.
- **Chroma**: neutral and quiet vs colorful and expressive.
- **Accent preference**: a hue, or "from brand", or "you decide".
- **Contrast level**: standard AA / high-contrast leaning / soft low-contrast (still must pass AA for text).
- **Custom themes**: user-selectable themes needed? Brand colors that are fixed?
Shortlist 2-3 palette ids from `references/color-library.md` when ready (load it at this point only).

### Stage 5 - Typography (F)
- **Voice**: geometric sans (modern, friendly) / humanist sans (warm, readable) / neo-grotesque (neutral, precise) / monospace (technical) / editorial serif (literary, premium) / combination.
- **Display vs body**: same family or a pairing?
- **Content type**: long-form reading, data/tables, UI labels, headlines, code.
- **Constraints**: self-hosted only, no external font requests, brand font provided, language/script coverage.
Load `references/typography-library.md` to present 2-3 concrete pairings only when this stage is reached.

### Stage 6 - Motion (E)
- **Level**: subtle / balanced / expressive.
- **Tempo**: fast and snappy / relaxed and smooth.
- **Feel**: spring physics vs eased curves vs mechanical/linear.
- **Coordination**: individual element animation vs choreographed/staggered scenes.
- **Responsiveness**: should cursor, scroll, or drag influence visuals (parallax, magnetic, tilt)? (default: no)
- **Reduced motion**: always honored (non-negotiable; do not ask).
Map to a preset from `references/motion-engine.md` (precision, smooth, spring, elastic, cinematic, mechanical, organic, expressive) after answers.

### Stage 7 - Detail (G)
- **Borders**: hairlines / none (tone-only) / bold outlines.
- **Shadows**: none / subtle / layered only for floating elements.
- **Corners**: sharp (0-2px) / small (4-6px) / soft (8-12px) / mixed by role.
- **Textures**: flat / grain / paper / pattern from motif / none.
- **Density**: row heights, control sizes (compact / default / comfortable).
- **Iconography**: line / filled / none (text-first); existing icon set to keep?

### Stage 8 - Technical (H)
- **Constraints**: browser/device targets, performance budget, offline.
- **Dependencies**: allowed to add (fonts, motion lib, icon set) or none?
- **Existing system**: keep current component library and retheme it, or introduce new components?
- **Accessibility**: required level (default WCAG 2.2 AA), keyboard-first, screen reader support.
- **Responsive priority**: desktop-first, mobile-first, or equal.
- **Scope**: whole app, specific screens, or shell and shared components first?

### Stage 9 - Approval (I)
Present the approval summary (format below). Ask: approve / adjust X / explore alternatives.

## Branching table
| Signal from answers | Skip / reduce | Expand / add |
|---|---|---|
| Finance / banking / admin dashboard | playful and expressive options, bouncy motion, whimsical type | trust cues, tabular numerals, density, data-state colors, error clarity |
| Developer tool / monitoring | luxury/editorial options, large hero ideas | density, keyboard shortcuts, mono, status colors, command palette |
| Reading / writing / editor | heavy chrome, flashy motion | measure, serif options, theme (paper/sepia/dark), focus mode |
| Game launcher / entertainment | conservative minimal-only choices | motion (expand to full stage), immersion, atmosphere, sound cues, controller/gamepad nav |
| Marketing / landing site | dense UI, dashboards | hero strategy, narrative structure, imagery, scroll motion |
| E-commerce | experimental brutalism unless the brand asks | product imagery, trust, checkout clarity, filter UX |
| Creative / portfolio | generic SaaS patterns | identity, bold type, unconventional layout, work presentation |
| Health / wellness / kids | harsh high-contrast, cold palettes | warmth, large targets, soft motion, reassuring copy |
| Existing component library to keep | new-component questions | token overrides, density, shape, theming strategy |
| User gave reference sites | generic direction questions | reference analysis (below), then confirm what to borrow/avoid |
| User says "you decide" on a stage | all of that stage | state derived assumption in summary |
| Small project (one page) | stages 7-8 detail | go quick path |
| Mobile primary | wide-layout options | bottom navigation, thumb zones, gestures |
| Strong brand colors given | color exploration | tint scale derivation, contrast checks vs brand |

## Skip, delegate, references
- **Skip**: if the user ignores a question, use the default derived from purpose; do not re-ask.
- **Delegate** ("you decide", "surprise me", "whatever fits"): derive from product purpose and audience, then list each derived choice as an assumption with a one-line reason. Delegation is a green light to proceed; keep exploration to 2 directions maximum unless asked.
- **References**: accept URLs, screenshots/images, or product names.

### Analyzing references
1. **Acquire**: URL -> WebFetch for structure/CSS hints and (if tooling allows) screenshot via browser tools (`workflows/visual-audit.md` lists tools); local image -> Read the image; named product with no link -> ask for a URL or screenshot rather than guessing from memory.
2. **Extract** (write down, do not copy assets):
   - **Palette**: 4-6 dominant hexes, roles (background, surface, ink, accent, status); temperature; contrast character.
   - **Type**: families if detectable (computed styles via DevTools/JS or CSS), scale, weights, tracking, casing, measure.
   - **Layout**: grid, density, alignment, navigation pattern, spacing rhythm, use of rules/cards.
   - **Shape/detail**: radii, borders, shadows, textures, iconography.
   - **Motion cues**: transitions, easings, durations, scroll behavior, hover reactions (observe by interaction or inspect CSS).
   - **Signature**: the one thing that makes it recognizable (the motif).
3. **Separate**: what to borrow in principle (a quality: "tight mono data rails") versus what to avoid copying (specific brand marks, layouts, assets). Never clone a brand; extract principles and translate to this product's purpose.
4. **Record** in `.artisan/references/inspiration.md`:

```
## <Reference name / URL> - <date>
- Why chosen (user words): ...
- Palette: #..., #..., #... (roles)
- Type: ...
- Layout: ...
- Motion: ...
- Signature: ...
- Borrow: ...
- Avoid: ...
```
5. Confirm with the user: "From <ref> I take X and Y, not Z. Right?"

## Procedure
1. Pull from Discovery and the existing profile everything already known; list known vs unknown per stage.
2. Choose the path (quick/standard/deep). Tell the user how many rounds to expect.
3. **Round 1** (up to 4 questions): product identity gaps + visual direction options (+ references prompt).
4. **Round 2**: stages 3-4 (layout, color) trimmed by branching; use direction answer to pre-select options.
5. **Round 3**: stages 5-6 (type, motion); load the relevant library file only now, and show 2-3 concrete choices with a short rationale.
6. **Round 4** (standard/deep only): detail and technical.
7. Draft the approval summary; present; revise on feedback (max 2 revision loops, then offer exploration via `workflows/design-exploration.md`).
8. Hand off: on approval, go to `workflows/design-exploration.md` (explore if warranted, else write the spec directly).

## Defaults when delegated (derive, then state)
| Purpose cue | Default derivation |
|---|---|
| Precision/pro tool | Technical/Instrumental, cool neutrals, restrained blue/teal accent, neo-grotesque + mono, compact, mechanical/precision motion |
| Reading/knowledge | Editorial, warm paper, serif text, measure 60-68ch, smooth motion |
| Consumer lifestyle | Refined/Minimal, warm neutrals, humanist sans, soft radii, spring motion |
| Creative/culture | Brutalist or Editorial, strong contrast, expressive type, expressive motion |
| Finance/trust | Swiss/Refined, cool neutrals + one calm accent, tabular figures, precision motion |
| Game/entertainment | Immersive dark, saturated single accent, display type, cinematic or expressive motion |
Always add: AA contrast, reduced-motion support, responsive plan.

## Approval summary: exact format to present
Present verbatim in this structure (fill every field; mark assumptions with `(assumed)`):

```
# Design Direction - <Product name>
**Purpose:** <one sentence> | **Audience:** <who> | **Personality:** <3 words>

**Direction:** <name, e.g. Technical/Instrumental + Refined dark>
**Visual identity**
- Motif: ...
- Shape language: ...
- Color: <palette id or description> - <accent role>
- Typography: <heading> / <body> / <mono>
- Spatial composition: <density, grid, alignment>
- Motion: <preset> - <what moves, how fast>
- Interaction personality: ...

**Layout:** navigation <...>, content <...>, responsive <...>
**Theme:** <light/dark/both>, density <...>, radius <...>
**Scope & constraints:** <what changes / what is preserved / dependencies / a11y level>
**Assumptions:** <list, each with reason>
**Why this fits:** <2-3 sentences tying choices to the product purpose>
**Trade-offs:** <what this direction gives up>

Approve this direction, adjust something (tell me what), or explore 2-3 alternatives?
```
Call AskUserQuestion with options: "Approve", "Adjust", "Explore alternatives".

## Guardrails
- Do not ask questions whose answers are in the repo, the profile, or the request.
- Do not present more than 4 options per question; do not stack more than 4 questions per call.
- Do not load `references/*-library.md` files before the stage that needs them.
- Do not proceed to implementation without explicit approval (or the user delegating the whole decision).
- Do not write `.artisan/` files until approval; then hand off to exploration/spec.
