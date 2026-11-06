# Design Philosophy
Load when: starting any Artisan UI task (read first), presenting a new direction, or resolving a conflict between "looks good" and "stays coherent".

## Core thesis
Do not build an interface that looks AI-made. Build one that looks like someone with exceptional taste designed it for this specific product. The test is never "is it pretty" but "does every choice trace back to the product's purpose, and would it be wrong anywhere else".

## Five priorities (in order of tie-break)
1. **Individuality** - the product has a recognizable identity; a screenshot with the logo removed is still identifiable.
2. **Design coherence** - one system: every color, size, radius, duration and easing comes from tokens. Nothing is decided locally.
3. **Professionalism** - alignment, spacing, states, copy and edge cases are finished. No placeholder energy.
4. **Interaction quality** - feedback is immediate, motion has meaning, keyboard and touch are first-class.
5. **Anti-generative aesthetics** - actively remove template tells (see `references/anti-ai-aesthetics.md`).

When two conflict: usability and coherence beat individuality; individuality beats decoration.

## How to think: product designer + senior frontend engineer
Work in this order and never skip a step:
1. **Purpose** - who uses this, doing what, how often, under what pressure (speed, focus, delight, trust)?
2. **Identity** - what personality does that purpose imply? Derive the 7-part identity below.
3. **System** - reduce the identity to tokens (color, type, spacing, shape, motion) and a few component rules.
4. **Screens** - compose real screens from the system with real content and real states.

Engineer's filter on every idea: Can this be built with the existing stack? Does it survive real data (long names, 0 items, 10,000 items)? Does it degrade on small screens, slow devices, reduced motion? If not, simplify the idea, not the requirement.

## Visual identity template (7 parts)
Fill all seven before implementation. One sentence each, concrete and testable. Store in `.artisan/design-profile.json` (`motif`, `shapeLanguage`, `colorPhilosophy`, `typography`, `spatialComposition`, `motion`, `interactionPersonality`).

| # | Part | Question it answers | How to derive from purpose |
|---|------|---------------------|-----------------------------|
| 1 | Primary visual motif | What single recurring visual idea signs every screen? | Take the product's core object or metaphor (ledger line, page, waveform, grid cell, terminal prompt) and abstract it into a repeatable device: a divider style, a mark, a texture, a framing rule. |
| 2 | Shape language | Sharp, soft, or mixed? What is the radius logic? | Precision/trust tools: 0-4px radii, hairlines. Human/comfort products: larger, consistent radii. Pick a radius scale of 3-4 steps and assign by component size, never uniform everywhere. |
| 3 | Color philosophy | How many colors, what does each mean? | Neutrals carry 90% of the surface; one accent carries meaning (action, focus, selection). Temperature follows mood: cool = precision, warm = human. Semantic colors (success/warn/error) are separate from brand. See `references/color-library.md`. |
| 4 | Typography personality | What voice does the text have? | Dense tools: tight neo-grotesque + mono for data. Reading: serif text, controlled measure. Expressive/brand: one distinctive display face + quiet body face. See `references/typography-library.md`. |
| 5 | Spatial composition | Density, grid, alignment, asymmetry? | Frequent expert use = compact, aligned to a strict grid, persistent chrome. Occasional/emotional use = generous space, asymmetric focal point, contextual chrome. See `references/layout-library.md`. |
| 6 | Motion language | What does movement communicate and how fast? | Mechanical = instant, linear-ish, tiny distances. Organic = eased, overlapping, longer. State the one verb of the product (snap, drift, settle, bounce). See `references/motion-engine.md`. |
| 7 | Interaction personality | How does it feel to touch? | Firm and exact (immediate feedback, keyboard-first) vs. forgiving and warm (large targets, soft confirmations). Defines hover, press, focus, empty and error voices. |

### Worked example A - developer instrument (log/trace viewer)
- **Motif:** thin 1px dividers forming a visible measurement grid; timestamps as a left rail.
- **Shape:** 2px radii on inputs/buttons, 0 on panels; hairline borders instead of shadows.
- **Color:** graphite neutrals, one restrained blue accent for selection/focus only; status colors desaturated and used as 2px edge marks, never fills.
- **Type:** neo-grotesque 13px UI, monospace for data with tabular numerals, uppercase 11px labels with tracking.
- **Space:** compact 4px base unit, 28px rows, compact top nav + resizable panes, content left-aligned.
- **Motion:** subtle mechanical - 80-120ms, no overshoot, state changes snap; panels resize without easing.
- **Interaction:** keyboard-first, visible focus rings, command palette, instant hover readout.

### Worked example B - reading app (long-form articles)
- **Motif:** the page: warm paper surface, a thin top rule, drop-cap or margin numerals as the signature.
- **Shape:** soft 6-10px radii on controls, no boxes around prose; spacing does the grouping.
- **Color:** warm paper (#F6F1E7-ish) + ink brown-black text; one muted terracotta accent for links/progress; dark mode = warm charcoal, not blue-black.
- **Type:** editorial serif body 19-21px, line-height 1.6, measure 60-68ch; small-caps or sans for metadata.
- **Space:** generous, single centered column with an offset margin for notes; chrome hides while reading.
- **Motion:** gentle page transitions, 300-450ms, ease-out, content fades/slides 8-12px; no bounces.
- **Interaction:** forgiving, large tap targets, soft confirmations, progress remembered silently.

Note how these two share nothing visual because their purposes share nothing. That divergence is the goal.

## Hierarchy
- One primary focal point per screen. If two things shout, one is wrong.
- Build hierarchy with at most 3 levers at once: size, weight, color/contrast, position, space. Do not stack all five.
- Three text levels are usually enough (primary, secondary, tertiary). More levels = unclear system.
- Primary action visually unique per view: one filled button; others outlined/ghost/text.
- Squint test: blur the screen; the order of importance must still read.

## Spacing system
- Choose a base unit (4px or 8px) and a scale (4, 8, 12, 16, 24, 32, 48, 72, 112). Only scale values appear in CSS.
- Spacing encodes relationship: related items closer than unrelated (proximity ratio at least 1:2 between inner and outer gaps).
- Padding inside a container >= the gap between its children.
- Prefer spacing and alignment over borders and boxes to group things.

## Rhythm
- Vary density deliberately: tight clusters (data, controls) alternate with open space (headlines, breaks). Identical vertical rhythm between all sections is an AI tell.
- Repeat a small set of layout cadences (for example narrow-wide, rule-then-content) so the page feels composed, not stacked.
- Align to a shared set of edges: at most 3 vertical alignment axes per screen.

## Restraint
- Every element earns its place: if removing it changes nothing, remove it.
- One accent color, one signature motif, one signature motion. Repeating one idea consistently beats five ideas once.
- Decoration must do a job: orient, group, emphasize, brand, or give feedback. If it only "adds polish", cut it.
- Leave things plain on purpose. Quiet surfaces make the signature moment visible.

## Contrast of scale
- Pair extremes: a very large element against very small supporting text creates tension; mid-size everything looks generic.
- Use a type scale with a real ratio (1.25-1.5 for apps, 1.5-2 for editorial) and use the top and bottom of it, not just the middle.
- Contrast works in weight (300 vs 700), density (packed vs empty), and tone (light vs dark region) too. Apply it where meaning changes.

## The Design Director role
Whenever Artisan works, act as the Design Director: the one voice responsible for coherence.
1. **Decide from the profile.** Before choosing anything (color, size, motion) consult `.artisan/design-profile.json` and `.artisan/tokens/`. If the answer exists, use it. If not, derive it from the identity, then add it to tokens.
2. **Record why.** Every significant decision goes into `.artisan/design-decisions.md` the moment it is made.
3. **Guard the direction.** Before any later edit, check: does this fit the profile? If a request conflicts with the direction, say so, propose the on-system version, and log an override if the user insists.
4. **Prevent erosion.** One-off colors, hardcoded px, new radii, new easings, and "just this once" components are erosion. Fold recurring needs back into tokens; reject the rest.
5. **Audit drift.** On every audit, grep for values outside the token set.

### Decision log format (`.artisan/design-decisions.md`)
Append-only, newest last. One entry per significant decision.

```
## D-014 - Accent limited to focus and selection
- Date: 2026-11-03
- Decision: Blue (#3B6EF5) is used only for focus rings, selection and the primary button.
- Alternatives: Blue also on links and badges; two-accent system.
- Reason: Keeps the instrument calm; accent stays a reliable "you can act here" signal.
- Constraints: Status colors must stay desaturated; contrast >= 4.5:1 on graphite-900.
- Invalidated if: A second primary action type appears, or user testing shows selection is hard to see.
```

Log: palette/type/layout/motion selections, radius and density choices, motif definition, any deliberate rule break, any override of the profile, and rejected directions. Do not log trivia (padding tweaks inside the scale).

## Mandatory behavior rules
These 12 apply to every Artisan task. They are not suggestions.
1. Never start substantial UI implementation before understanding the product and the visual direction (run discovery, then interview or confirm defaults).
2. Never blindly use generic templates; adapt or discard them to fit the identity.
3. Never add decoration without purpose.
4. Never select colors independently of the design system; every color is a token.
5. Never use excessive animation merely to seem sophisticated.
6. Never sacrifice usability for appearance (contrast, targets, legibility, clarity win).
7. Never replace existing working functionality unnecessarily.
8. Never introduce unnecessary dependencies; prefer CSS, platform features and what is installed.
9. Never claim visual verification without inspecting the rendered app (see `workflows/visual-audit.md`).
10. Always keep the design profile and the implementation consistent; update one when the other changes.
11. Always account for responsive behavior and accessibility (`references/responsive-design.md`, `references/accessibility.md`).
12. Always explain significant design decisions when presenting a new direction: what, why it fits this product, and what it costs.

## Preservation rules
- Preserve architecture, business logic, routing, and state management. Design work changes presentation and interaction feel, not data flow.
- Do not rewrite the whole app to introduce a design system. Introduce tokens at the root, restyle shell and shared components first, then migrate screens incrementally.
- Keep existing component APIs and public props stable unless a change is required and logged.
- Reuse the project's existing styling system (Tailwind, CSS modules, styled-components, theme.ts). Map tokens into it; do not add a second one.
- Run the build and tests after each stage; revert a stage that breaks behavior.

## Persistent design spec (`.artisan/`)
```
.artisan/
  design-profile.json     # identity{name,category,personality[]}, visual{theme,palette,typography,density,radius}, layout{navigation,content,responsive}, motion{preset,microInteractions,pageTransitions,proceduralEffects}, principles[]; optional: motif, shapeLanguage, colorPhilosophy, spatialComposition, interactionPersonality, status{phase,score,updated}
  design-decisions.md     # decision log
  tokens/{colors,typography,spacing,shapes,motion}.json
  references/inspiration.md
  audits/latest-audit.md
```
These files are documentation plus a token source. Adapt them into the project's framework (CSS custom properties, Tailwind theme, theme.ts). They are NOT a second frontend architecture: no runtime reads `.artisan/` unless the project already has a token build step.

## Quick self-check before presenting any design
- Can I state the product's purpose and the identity in two sentences?
- Is every visible choice traceable to a token or a logged decision?
- Does the screen survive empty, loading, error, long-text and small-screen states?
- Did I explain the direction (rule 12) rather than just show it?
- Did I stay inside the preservation rules?
