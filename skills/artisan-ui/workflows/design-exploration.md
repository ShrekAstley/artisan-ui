# Workflow: Design Exploration and Specification (Phases 3-4)
Load when: the interview is approved (or delegated) and a direction must be explored and/or turned into the written design spec (`.artisan/`).

## Goal
Phase 3: when worthwhile, compare 2-3 genuinely different directions and pick one. Phase 4: write the full specification (tokens, profile, decisions) that passes the originality test, ready for implementation.

## 1. Explore or skip?
**Explore 2-3 directions when:**
- the user asked to explore, or chose "Explore alternatives" at approval;
- brand-critical product, new product, or large redesign;
- the interview left identity open (delegated, "surprise me", conflicting signals);
- the first sketched direction fails the originality test or feels generic.

**Skip exploration (go to section 4) when:**
- small project or a few screens; or a quick-path interview with a clear request;
- an existing profile already defines the direction (resume; only extend it);
- the user's references and answers define a single direction precisely;
- the user said "just do it" / delegated and low risk (state assumptions instead).

Default count: 2 directions for most cases, 3 for deep/brand-critical. Never more than 3.

## 2. What counts as a genuinely different direction
Directions must differ in at least **four of these five**: primary motif, layout structure (navigation + content composition), typography, motion language, shape language. Palette alone never counts.
- Color variations of the same layout/type are not directions; discard and rework.
- Differ in a purposeful way: each direction is a different answer to the same product purpose (for example "instrument" vs "editorial workspace" for the same analytics tool).
- Each direction must be buildable in the project's stack within the stated scope.
- Load `references/anti-ai-aesthetics.md` now (run the tell checklist while drafting) and, as needed, `references/color-library.md`, `references/typography-library.md`, `references/layout-library.md`, `references/motion-engine.md`. Load only the pieces needed to name ids/pairings; do not paste libraries into the response.

## 3. Direction card template
Produce one card per direction (about 25-35 lines each):

```
### Direction <A/B/C>: <Name>
**Thesis:** <one sentence: the idea that organizes every decision, tied to the product purpose>
**Identity (7 parts)**
1. Primary visual motif: ...
2. Shape language: ...
3. Color philosophy: ...
4. Typography personality: ...
5. Spatial composition: ...
6. Motion language: ...
7. Interaction personality: ...
**Specifics**
- Palette id: <one of obsidian-cobalt | graphite-acid | midnight-teal | porcelain-coral | warm-paper-terracotta | indigo-violet | forest-sage | slate-amber | monochrome-editorial | plum-champagne> (+ any override and why)
- Type pairing: <heading / body / mono + scale ratio>
- Layout: <navigation + content structure + density>
- Motion preset: <precision | smooth | spring | elastic | cinematic | mechanical | organic | expressive>
**Best for:** <the product situation where this wins>
**Trade-offs:** <what it costs: learnability, density, effort, mobile>
**Risks:** <what could go wrong: contrast, performance, over-stylization, scope>
**Main screen wireframe**
<ASCII wireframe, about 12-20 lines, labeled regions, showing the motif>
```

ASCII wireframe guidance: use box-drawing or `+---+` borders, label regions (NAV, LIST, DETAIL, TOOLBAR), mark the focal point with `*`, show 1-2 signature details (the motif rail, the rule style). Example skeleton:

```
+--------------------------------------------------+
| LOGO   Search ....................  [cmd K]   (A) |  <- compact top nav
+------+-------------------------------------------+
| 12:01| ERROR  auth.service  token expired      * |  <- time rail + 1px rules
| 12:01| INFO   gateway       200 /v1/items        |
| 12:02| WARN   db            slow query 412ms     |
+------+------------------------+------------------+
| FILTERS (collapsible)         | DETAIL panel     |
+-------------------------------+------------------+
```

## 4. Present and choose
1. Present cards compactly side by side in text (a short comparison table first: motif, layout, type, motion, best for), then the full cards.
2. Explain (rule 12): why each fits, what it costs, and your recommendation with a one-line reason. Recommend one; do not hedge among all.
3. Ask via AskUserQuestion: pick A / B / C / mix (name which parts) / none (describe). Allow mixing only if the parts remain coherent (do not merge two motifs).
4. Record the chosen direction and the rejected ones with reasons (rejected-direction entries go into `design-decisions.md`).
5. Max 2 refinement rounds; then proceed with the best-supported option and state remaining assumptions.
6. Optional: if the user wants to see before choosing, build a throwaway static HTML mock of one main screen (outside project source or in a clearly marked temp folder); never ship it into the app.

## 5. Write the full specification (Phase 4)
Create the persistent design spec at the project root, exactly this structure:

```
.artisan/
  design-profile.json     # identity{name,category,personality[]}, visual{theme,palette,typography,density,radius}, layout{navigation,content,responsive}, motion{preset,microInteractions,pageTransitions,proceduralEffects}, principles[]; plus optional: motif, shapeLanguage, colorPhilosophy, spatialComposition, interactionPersonality, status{phase,score,updated}
  design-decisions.md     # decision log
  tokens/{colors,typography,spacing,shapes,motion}.json
  references/inspiration.md
  audits/latest-audit.md
```
Create `audits/` empty (the audit file is written later in `workflows/visual-audit.md`). Create `references/inspiration.md` only if references were analyzed (or a one-line "none provided").

### 5.1 design-profile.json
Fill every required field; add the optional 7-part fields. Example:

```json
{
  "identity": { "name": "Ledgerline", "category": "developer-tool", "personality": ["precise", "calm", "technical"] },
  "visual": {
    "theme": "dark",
    "palette": "graphite-acid",
    "typography": { "heading": "...", "body": "...", "mono": "...", "scale": 1.25 },
    "density": "compact",
    "radius": "sharp"
  },
  "layout": {
    "navigation": "compact-top + command-palette",
    "content": "resizable-panes",
    "responsive": "panes collapse to tabs below 768px"
  },
  "motion": {
    "preset": "mechanical",
    "microInteractions": ["press-snap", "focus-ring-fade"],
    "pageTransitions": "none",
    "proceduralEffects": []
  },
  "principles": ["Accent means actionable", "Hairlines over boxes", "Numbers are tabular"],
  "motif": "1px measurement rail with timestamps",
  "shapeLanguage": "2px radius controls, 0 panels, hairline borders",
  "colorPhilosophy": "graphite neutrals, single accent for focus and selection",
  "spatialComposition": "4px grid, 28px rows, left-aligned",
  "interactionPersonality": "keyboard-first, immediate feedback",
  "status": { "phase": "specification", "score": null, "updated": "2026-11-03" }
}
```
`status.phase` values: `discovery`, `interview`, `exploration`, `specification`, `implementation`, `audit`, `done`. Use ISO dates. `principles` holds 3-6 short, testable rules.

### 5.2 Tokens (`.artisan/tokens/*.json`)
Source of truth for values, using a simple, tool-agnostic shape (`{ "name": { "value": "...", "role": "..." } }`, nesting by group). Pull values from the chosen palette in `references/color-library.md`, the pairing in `references/typography-library.md`, and the preset in `references/motion-engine.md`; do not invent values that conflict with them.
- `colors.json`: background, surface (1-3 steps), border, ink (primary, secondary, tertiary), accent (+ hover/active/subtle), status (success, warning, danger, info), focus ring, selection; both themes if "both" (`light` and `dark` groups). Record contrast ratios for ink-on-surface and accent-on-surface pairs (must meet AA: 4.5:1 text, 3:1 large text/UI).
- `typography.json`: families (with fallbacks), scale steps (name, size, line-height, weight, tracking), measure, numeric features (tabular-nums), fluid clamp rules where relevant.
- `spacing.json`: base unit and scale; named layout gaps (gutter, section, control padding), density variants.
- `shapes.json`: radius scale and role mapping, border widths, shadow/elevation set (often 2-3 only), focus ring spec.
- `motion.json`: durations, easings, distance, stagger, preset name, reduced-motion fallbacks.

### 5.3 design-decisions.md
Start the log: title, then entries D-001... for the major selections (direction, palette, type, layout, motion, shape/density, motif, any rule break, rejected directions). Use this entry template exactly:

```
## D-001 - <short title>
- Date: <YYYY-MM-DD>
- Decision: <what was decided>
- Alternatives: <what was considered and rejected>
- Reason: <why it fits this product>
- Constraints: <limits it must respect: contrast, performance, stack, preserved behavior>
- Invalidated if: <what would make us revisit>
```

## 6. Originality test gate (before locking)
Load `references/anti-ai-aesthetics.md` if not already loaded. Answer in writing, one line each:
1. Could this belong to almost any SaaS product?
2. Is the layout a familiar template with new colors?
3. Are decisions connected to the product's purpose (state the connection)?
4. Is there a recognizable identity (motif present on every key screen)?
5. Does every decorative element serve a function?
6. Is it visually balanced without unnecessary decoration?
Also run the diversity check against prior projects' profiles if any are available (procedure in that file).
Any generic answer means revise the spec and log the revision as a decision; repeat until clean. Show the outcome briefly to the user (not the full table).

## 7. Reduce to tokens mapped to the project's framework
`.artisan/tokens` is documentation plus a source; the app consumes values through its own styling system. Do not build a second architecture. Mapping table:

| Project styling | Mapping |
|---|---|
| Plain CSS / CSS modules | `:root { --color-bg: ...; --space-3: ...; --radius-control: ...; --ease-snap: ...; --dur-fast: ... }` in the existing global stylesheet; theme variants via `[data-theme="dark"]` or `prefers-color-scheme` |
| Tailwind v3 | extend `theme.extend` (colors, fontFamily, fontSize, spacing, borderRadius, transitionDuration/TimingFunction) in `tailwind.config.*`, referencing CSS vars where theming is runtime |
| Tailwind v4 | `@theme { --color-...: ...; }` in the main CSS file |
| styled-components / emotion / MUI | single `theme.ts` object (and `ThemeProvider` already present); no new provider if one exists |
| SCSS | `_tokens.scss` variables + CSS custom properties for runtime theming |
| Component lib (shadcn/Radix) | override its CSS variables/tokens; adjust variants in the component files in-place |
| Non-web (Tauri webview, game UI) | same CSS vars in the webview; engine UI: constants module mirroring tokens |

Rules:
- Naming: semantic (`--color-surface`, `--color-accent`), not literal (`--blue-500`) for things components use.
- One token source of truth: if the project already has tokens, extend/rename carefully, preserving old names via aliases until migrated.
- Do not add a build step (token transformer) unless the project already has one; copy values by hand or with a tiny script the user approves.
- Contrast and reduced-motion variants included from the start.
- Record the mapping decision (where tokens live in code) in `design-decisions.md`.

## 8. Handoff
- Show a compact spec summary (identity, palette id, type, layout, motion preset, token location in code) and the file list created.
- Update `status.phase` to `specification` and `updated` date.
- Ask for go-ahead only if the scope changed since the interview approval; otherwise continue to `workflows/implementation.md`.

## Guardrails
- Do not write application code in this phase (only `.artisan/` files, plus optional throwaway mock).
- Do not present directions that differ only in color.
- Do not exceed 3 directions or 2 refinement loops.
- Do not invent palette ids; use the 10 ids from `references/color-library.md` or define a custom palette and log why none fit.
- Do not load all five reference libraries at once; load what each card needs.
