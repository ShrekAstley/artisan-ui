# Workflow: Implementation (Phases 5-7, 9)
Load when: a design spec exists in `.artisan/` (profile + tokens) and it is time to build or restyle the UI, run motion work, or run the refinement loop after an audit.

## Goal
Turn the spec into a working, consistent interface without breaking existing behavior. Order: Foundation (5) -> Real screens (6) -> Motion engineering (7) -> Refinement loop (9). Audits (Phases 8, 10) live in `workflows/visual-audit.md`.

## Preconditions
- `.artisan/design-profile.json` and `tokens/*.json` exist and the profile passes the originality test. If not, go back to `workflows/design-exploration.md`.
- Discovery baseline known: build/test commands, what must be preserved.
- If the app cannot run, say so now; you will have to cap verification claims later.

## Operating rules (apply throughout)
1. **Preserve functionality.** Do not change routes, state shape, business logic, API calls, or test selectors. Do not rewrite working logic to make styling easier.
2. **Incremental.** Work in small stages; after each stage run the build/typecheck (and tests if present). Fix breakage you caused before moving on. Revert a stage that cannot be made green.
3. **No unnecessary dependencies.** Ladder: CSS/platform feature -> already-installed library -> small inline code -> new dependency (only with a stated reason, user consent for anything heavy, and a log entry). Fonts: prefer self-hosted or an already-used loader; never add three font families for fun.
4. **Tokens only.** No magic numbers: every color, font size, spacing, radius, shadow, duration, easing comes from a token. Grep for strays at the end of each stage (see Consistency checks).
5. **Do not rewrite the whole app to introduce the design system.** Tokens at the root first, then shell and shared components, then screens one by one.
6. **Reuse the project's styling approach and conventions** (naming, file layout, `cn()` helpers).
7. **Commit-sized increments.** Each stage is a coherent, reviewable unit with a clear message-sized summary. Do not commit unless the user asked; if asked, one commit per stage.
8. **Real data and real functionality.** Build with the product's real content and states, not lorem or invented stats. If real data is unavailable, use realistic, domain-true sample data that is clearly local mock and never fabricate metrics.
9. **Keep spec and code in sync.** Whenever code needs a value the spec lacks, add it to tokens and log the decision; whenever code deviates from the spec, either fix code or update the spec with a log entry (rule 10).

## Phase 5 - Foundation
Order matters; finish and verify each before the next.

### 5.1 Tokens into the framework
- Map `.artisan/tokens/*.json` into the project's mechanism per the mapping table in `workflows/design-exploration.md` (CSS vars / Tailwind theme / `theme.ts`).
- Both themes if specified; theme switch mechanism honoring `prefers-color-scheme` plus a persisted toggle only if the product needs it.
- Verify: app still builds, nothing visually broken (old values still alias if needed).

### 5.2 Global styles
- Reset/base: box-sizing, body background/ink from tokens, font families, base size/line-height, selection color, scrollbar styling only if part of the identity, `color-scheme`, focus-visible default ring from tokens.
- Typography: heading/body/mono rules, numeric features (`tabular-nums` for data), measure for prose.
- Load fonts (preload critical, `font-display: swap`), define fallbacks with matching metrics when possible (`size-adjust`).
- Reduced motion base: `@media (prefers-reduced-motion: reduce)` shortening transitions to near-zero.

### 5.3 Base components
Restyle or build the shared primitives, in this order: Button, Link, Input/Textarea/Select, Checkbox/Radio/Switch, Badge/Tag, Card/Panel (if the identity uses them), Dialog/Popover/Menu/Tooltip, Table/List, Tabs, Toast, Empty state, Skeleton/Loading. Keep component APIs stable; change internals and variants. Extend the project's existing library by token override rather than forking it.
Component state checklist (every interactive component):
- [ ] default
- [ ] hover (pointer only; do not depend on hover for essential information)
- [ ] focus-visible (clear ring from tokens, not removed)
- [ ] active/pressed
- [ ] disabled (still legible, `aria-disabled` semantics where needed)
- [ ] loading (stable size, no layout shift, accessible status)
- [ ] error (message + non-color cue + `aria-invalid`/described-by)
- [ ] empty (explains and offers next action)
- [ ] selected/checked/expanded where relevant
- [ ] long text / overflow, RTL-safe where relevant
Min target sizes: 44x44 on touch (24x24 absolute minimum on dense desktop controls).

### 5.4 App shell
Navigation, header/rail/dock, content frame, panel structure, breadcrumbs, command palette if specified. Implement the responsive behavior of the shell now (collapse, drawer, bottom tabs) using `references/responsive-design.md` (load when working this step). Landmarks: `header`, `nav`, `main`, skip link. Verify keyboard order.

Foundation exit: build green, shell renders with real routes, base components pass the state checklist, no hardcoded values in new code.

## Phase 6 - Real screens
- Take screens in priority order: the key screens from Discovery first.
- For each screen: confirm real data and functionality are intact; recompose layout using the spec (patterns from `references/layout-library.md`, load when composing); apply type scale, spacing, motif; build all states (loading, empty, error, partial, long content, many items).
- Replace placeholder content only with user-approved or real content. Remove invented stats/testimonials.
- Check each screen against the originality quick tells (`references/anti-ai-aesthetics.md`, load once, scan list) and the squint test (one focal point).
- Accessibility pass per screen (`references/accessibility.md`, load when building forms, dialogs, or custom widgets): semantics first, then ARIA only where native elements fall short; labels; error association; contrast; focus management for dialogs/route changes.
- After each screen: build + typecheck + relevant tests; start the app and glance at it if tools allow (full verification happens in the audit).

## Phase 7 - Motion engineering
Goal: implement the preset from `design-profile.json` with the smallest technology that works. Load `references/motion-engine.md` at the start of this phase.

Technology ladder (stop at the first that works):
1. CSS transitions/animations with token durations and easings.
2. CSS `@starting-style`, view transitions API (`document.startViewTransition`) for page transitions where supported, scroll-driven animations with feature detection.
3. Web Animations API (`element.animate`) for sequenced/imperative control.
4. An already-installed library (framer-motion/motion, GSAP, react-spring).
5. A new library only if (1-4) cannot meet a stated requirement; log it.
For procedural/ambient effects (`proceduralEffects` in profile): canvas/SVG/CSS only, pause when off-screen or tab hidden (`IntersectionObserver`, `visibilitychange`), cap frame cost, always provide a static fallback.

Rules:
- Animate `transform` and `opacity`; avoid animating layout properties (`width`, `top`, `height` on large trees); use `will-change` sparingly and remove it after.
- Every animation answers "what does this explain" (state change, origin, hierarchy, feedback). If nothing, delete it.
- Durations/easings only from `tokens/motion.json`; distances small; stagger limited (under about 60ms per item, cap at 6-8 items).
- Interruptible: reversing mid-flight must not glitch; avoid blocking input during animation.
- **Reduced motion:** honor `prefers-reduced-motion`: replace movement with instant or opacity-only changes; disable parallax/auto-play loops; keep functional feedback (focus, state).
- Page transitions: default none for tool-like products; if specified, keep under about 300-450ms and never delay content readiness.
- Performance: profile one key interaction; no long frames on mid-range hardware; no motion on first paint of heavy screens.
- Mobile: avoid hover-dependent effects; gestures need visible alternatives.

## Phase 9 - Refinement loop
Entered after an audit (`audits/latest-audit.md`) lists issues, or when the user requests polish.
1. Read the audit; take the prioritized fix list (critical failures first, then by weighted score impact).
2. Fix in batches by theme (tokens/spacing, typography, color, states, responsive, a11y, motion), not screen by screen ad hoc.
3. Build + typecheck + tests after each batch.
4. Hand back to `workflows/visual-audit.md` for re-screenshot and re-score. Max 3 iterations total; then document remaining limitations (the audit workflow owns that rule).
5. Polish checklist (final pass): alignment on shared edges; optical alignment of icons/text; consistent corner treatment; consistent icon stroke/size; numeric alignment; empty/error copy; focus order; scroll containers and overscroll; selection/scrollbar styling; print/dark edge cases only if in scope; favicon/title/meta consistent with identity.

## Consistency checks (run after each stage)
Use Grep with `output_mode: count` or `files_with_matches`, limited to source (not node_modules):
- Raw hex/rgb/hsl colors outside token files: pattern `#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(`.
- Hardcoded px for spacing/radius/font-size outside the token scale: pattern `\b(margin|padding|gap|border-radius|font-size)\s*:\s*\d+px`, and in Tailwind, arbitrary values `\[\d+px\]`.
- Raw easing/duration literals: `cubic-bezier|\b\d+ms\b|\b0?\.\d+s\b` outside token files.
- Inline `style=` with design values.
- New dependencies in `package.json` (diff against baseline).
- Distinct radii/shadows count (should equal token set size).
Fix findings or log the exception in `design-decisions.md`.

## When to delegate vs do inline
Specialist agents (use only if the host provides them): `design-director` (coherence, direction guard), `ux-architect` (flows, navigation, information architecture), `typography-color-specialist` (scales, pairings, contrast), `motion-engineer` (motion implementation, performance), `frontend-engineer` (component/framework work), `visual-qa` (screenshots, audit).

| Situation | Approach |
|---|---|
| Small project (1-3 screens, few components) | Do everything inline, in one agent; no delegation |
| Medium project | Inline foundation; delegate independent screens to `frontend-engineer` in parallel only if files do not overlap; `visual-qa` for audits |
| Large rebuild | `design-director` guards the spec; `ux-architect` for shell/flows; `frontend-engineer`s per area; `motion-engineer` after screens stable; `visual-qa` for each audit round |
| Motion-heavy brief | Delegate Phase 7 to `motion-engineer` after Phase 6 is stable |
| Typography/color tuning at scale | `typography-color-specialist` produces tokens; you apply |

When delegating: give the profile path, token path, the preserve list, the scope (files), the acceptance check (build/tests/state checklist), and the rule "tokens only, no new deps". Review diffs for spec adherence; do not accept unverified claims. If specialists are unavailable, do the work inline following the same checks.

## Status and logging
- After each phase, update `.artisan/design-profile.json` `status`: `{ "phase": "implementation", "score": <last audit score or null>, "updated": "<YYYY-MM-DD>" }`.
- Log decisions made during implementation in `.artisan/design-decisions.md` (new tokens, rule exceptions, library additions, changed responsive behavior, component deviations) using the entry template (date, decision, alternatives, reason, constraints, invalidated if).
- Keep `tokens/*.json` aligned with the code values; if code diverged, reconcile.

## Common failure modes to avoid
- Restyling by editing every screen before tokens/base components exist (leads to drift).
- Letting a component library's defaults leak through (default shadows, radii, blue focus rings).
- Adding motion everywhere at the end "to make it feel alive".
- Hiding broken functionality behind a nicer surface.
- Forgetting states: empty/error/loading screens look the most generic and are the first things users notice.
- Claiming it looks right without running it: always hand off to `workflows/visual-audit.md`; do not claim verification from code reading.

## Exit criteria
- Build/typecheck/tests at or above baseline.
- All screens in scope implemented with real functionality and states.
- Consistency checks clean (or exceptions logged).
- Motion implemented to the preset with reduced-motion handled.
- Profile status and decision log updated.
- Next: `workflows/visual-audit.md` (Phase 8).
