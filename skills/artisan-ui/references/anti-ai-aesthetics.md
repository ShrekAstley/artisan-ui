# Anti-AI Aesthetics
Load when: before implementing any new direction, when reviewing output that feels generic, during the originality test in design-exploration, and during visual audit scoring of "visual identity and originality".

## Purpose
Generic output comes from defaults chosen without a reason. Find each default, ask what the product actually needs, replace it with a decision traceable to purpose. This file is the detection list and the replacement moves.

## Generic pattern -> Artisan approach
| Generic pattern | Why it reads as AI | Artisan approach |
|---|---|---|
| Purple/blue gradient on everything | Default "modern" palette; says nothing about the product | Pick a palette from the product's mood (`references/color-library.md`); flat neutrals + one meaningful accent; gradients only where a gradient models something real (heat, progress) |
| Hero + three feature cards + CTA | The universal landing template | Compose from the product's core object: show the real UI, a real workflow, or an editorial argument; vary structure per section |
| Every component rounded | One radius applied by default | Radius scale tied to shape language; sharp where precision matters, soft where comfort matters; mix by role |
| Excessive glassmorphism | Blur used as ornament | Blur only for true layering (overlays over content); otherwise solid surfaces with hairlines |
| Identical sidebar dashboards | Same shell for every product | Choose navigation from usage frequency and task shape: top bar, command palette, dock, contextual rail, hybrid |
| Random decorative icons | Icons as filler | Icons only to aid recognition; consistent set, stroke and size; text labels where meaning is unclear; none if text suffices |
| Fake charts and stats | Invented numbers to fill space | Real data or an honest empty state; no placeholder metrics ever shipped |
| Huge empty hero | Padding mistaken for elegance | Hero height from content need; first screen shows product value immediately |
| Default Inter everywhere | No typographic decision | Choose a pairing for personality (`references/typography-library.md`); if Inter is right, justify and tune weights/tracking |
| Unnecessary gradients | Depth faked by default | Flat fills; depth from spacing, borders, tone steps |
| Excessive shadows | Elevation on everything | Shadows only for real elevation (menus, modals, dragged items); borders for separation |
| Every section inside a card | Boxing as the only grouping tool | Group with space, alignment, rules and tone; cards only for repeatable, independent objects |

## AI tells checklist (with replacement move)
Scan the design and code against this list. Each hit needs a replacement move or a logged justification.

### Color and surface
1. **Gradient text headings.** -> Solid ink color; emphasis through weight, size or a single underline rule.
2. **Glow orbs / blurred blobs behind hero.** -> Remove; if atmosphere is needed use a flat tonal band, grain, or a structural pattern from the motif.
3. **Purple-to-blue (or pink-to-orange) brand gradient.** -> Palette chosen from purpose; one hue accent on neutrals.
4. **Pure black #000 on pure white #fff.** -> Tinted neutrals (warm or cool) with deliberate contrast ratios.
5. **Dark mode = navy-black with neon accents by default.** -> Dark theme only if it suits use context; derive dark neutrals from the same hue family as light.
6. **Colored shadows / neon glows on buttons.** -> Neutral, low-opacity shadows or none; focus rings as state, not decoration.
7. **Translucent white cards with blur on gradient backgrounds.** -> Solid surface tokens.
8. **Semantic colors used as brand decoration (green badges everywhere).** -> Reserve status colors for status.
9. **Five or more accent hues on one screen.** -> One accent plus neutrals plus status.

### Shape and depth
10. **Uniform 16px (or 12/24px) radius on all elements.** -> Radius by role and size; inputs, buttons, panels, avatars get deliberate different steps.
11. **Shadow stack (shadow-lg) on every card.** -> Border or tone difference; elevation only for floating layers.
12. **Cards inside cards inside cards.** -> Flatten; one container level, then spacing and rules.
13. **Pill-shaped everything.** -> Pills only for tags/toggles where the shape signals "chip".
14. **Border on every element plus shadow plus background.** -> Pick one separation device per element.
15. **Decorative dividers with gradient fades.** -> Plain hairline or none.

### Typography
16. **Default Inter/system stack with default weights.** -> Chosen pairing with tuned tracking and size scale.
17. **Badge pill above every heading ("New", "Beta", "Features").** -> Cut; or one eyebrow label style used only where it carries information.
18. **Everything centered, including paragraphs.** -> Left-align text blocks; center only short, isolated statements.
19. **Giant heading with tiny gray subtext, same pattern per section.** -> Vary section openings; match scale to importance.
20. **Three font weights randomly mixed, no scale.** -> Defined type scale with named roles.
21. **Lorem-ish or vague copy ("Unlock the power of...", "Seamless experience").** -> Specific, product-true copy written for the audience; ask the user for real content.
22. **Title Case On Every Label.** -> Sentence case unless the voice demands otherwise.
23. **Long line lengths (90ch+) in prose.** -> Measure 45-75ch.

### Layout and composition
24. **3-column feature grids with icon + title + sentence.** -> Replace with one featured item plus a list, an annotated screenshot, a comparison, or a sequence tied to the workflow.
25. **Identical vertical rhythm (same 96px padding between all sections).** -> Vary spacing by relationship and importance.
26. **Everything centered on a symmetric axis.** -> Anchor to the grid's left edge, use one deliberate asymmetric focal point.
27. **Sidebar + header + card grid dashboard for every product.** -> Shell shaped by task frequency and density.
28. **Huge hero with centered headline, subhead, two buttons.** -> Lead with the product itself or a decisive statement with a different structure.
29. **Equal-weight cards in a grid (no hierarchy).** -> Promote the primary item, vary spans, group by meaning.
30. **Stat strip ("10k users, 99.9% uptime, 4.9 stars") under hero.** -> Only real, verifiable numbers; otherwise delete.
31. **Testimonial carousel with faces and quotes by default.** -> Include only real quotes; else omit.
32. **Footer with four link columns for a one-page product.** -> Match footer to actual destinations.
33. **Alternating left-right image/text zig-zag sections.** -> Compose sections around content type, not a repeating template.

### Content and iconography
34. **Emoji used as icons or bullets.** -> Real icon set (consistent stroke) or plain text.
35. **Placeholder stats like "10x faster", "Save 80% time".** -> Remove or substantiate; honest specifics ("Builds in 1.2s on a 40k-line repo").
36. **Stock illustration blobs / abstract 3D shapes with no relation to product.** -> Real UI, diagrams of the actual mechanism, or typography as the visual.
37. **Generic avatars and "John Doe" names in demos.** -> Realistic, domain-appropriate sample data.
38. **Icon in a tinted rounded square before every list item.** -> Icon only when it adds recognition; otherwise typographic hierarchy.
39. **Decorative sparkles/stars/arrows ("✨") in copy and buttons.** -> Remove.

### Motion and interaction
40. **Everything fades up on scroll with the same stagger.** -> Animate only what explains change; one reveal pattern for one reason.
41. **Hover scale-up on every card.** -> Hover reveals information or affordance, not just size.
42. **Floating/bobbing hero elements, infinite pulse animations.** -> Remove ambient loops that carry no meaning.
43. **Spring bounce on utility controls.** -> Match preset to identity (`references/motion-engine.md`); precision tools stay mechanical.
44. **Skeleton shimmer and spinners everywhere.** -> Optimistic updates, real progress, stable layouts.

### Process tells
45. **Component library defaults shipped unmodified (default shadcn/MUI look).** -> Keep the library's accessibility and logic, override tokens, density and shape to match the identity.
46. **Tailwind palette defaults (indigo-500, slate-900) used raw.** -> Tokens mapped from the chosen palette.
47. **Same layout as the last project with new colors.** -> Run the diversity check below.

## Originality engine
Before any implementation, produce the 7-part identity (primary visual motif, shape language, color philosophy, typography personality, spatial composition, motion language, interaction personality) per `references/design-philosophy.md`. No identity, no implementation.

### Originality test
Answer each question in writing against the current direction:
1. Could this belong to almost any SaaS product? (Yes = generic.)
2. Is the layout a familiar template with new colors?
3. Are the major decisions connected to the product's purpose, and can I state the connection?
4. Does the design have a recognizable identity (motif visible on every main screen)?
5. Does every decorative element serve a function (orient, group, emphasize, brand, feedback)?
6. Is it visually balanced without unnecessary decoration?

**Decision rule:** any answer revealing a generic decision means revise before implementing. Record the revision in `.artisan/design-decisions.md`. Re-run the test; only proceed when no question exposes a generic choice.

### Caveat: originality is not eccentricity
- Encourage original composition, not strangeness. A calm tool should not wear a brutalist coat to seem different.
- Restraint can be the distinctive choice: one precise accent, perfect spacing and a quiet motif outperform a loud gimmick.
- Convention is correct for convention-bound controls (forms, tables, date pickers, navigation labels). Be original in the frame, composition, type and motion; keep affordances familiar.
- If the user wants plain and conventional, honor it; make it excellent and coherent rather than flashy.

## Five-concept benchmark
Quality bar: five different apps designed with Artisan must look like five independently designed products, not one product re-skinned.
- Imagine placing the five side by side with logos hidden. Palette, type, layout structure, shape language and motion should each differ in at least 3 of 5 dimensions, with no pair sharing more than two.
- Reference concepts to sanity-check range: developer instrument (graphite, mono, dense), reading app (paper, serif, calm), game launcher (immersive, expressive motion), finance dashboard (sober, tabular, trust), creative tool (canvas-first, tool palettes, tactile).
- If a new design lands near an existing concept's profile without a purpose-based reason, revise.

## Diversity check procedure
Run when `.artisan/` profiles from other projects are available (user-provided paths, sibling repos, or earlier designs in this session) and before locking a direction.
1. Collect prior profiles (`design-profile.json`, or a short summary of past designs). If none exist, skip and note it.
2. Extract the new design's fingerprint: motif, palette id, type pairing, layout structure (navigation + content), motion preset.
3. Compare each dimension against each prior profile:

| Dimension | Same? | Notes |
|---|---|---|
| Primary motif | y/n | |
| Palette (id or dominant hue + temperature) | y/n | |
| Typography (heading + body families, class) | y/n | |
| Layout (navigation type, content structure) | y/n | |
| Motion preset | y/n | |

4. Interpret: 3 or more matches with any one prior profile = too similar. Change the dimensions with the weakest purpose justification first (usually palette and layout).
5. A match is acceptable only when purpose demands it (for example two finance tools both needing tabular mono). Log it as a decision with the reason.
6. Record the result in `.artisan/design-decisions.md` (one line: compared against X, Y; matches: ...; action).

## Quick review loop for generated screens
1. Squint at the screenshot: is there a clear focal point and a recognizable signature?
2. Run the 47-tell checklist; mark hits.
3. Replace each hit with its move or log a justification.
4. Re-run the originality test. Done only when it passes.
