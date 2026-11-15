# Product references (study, don't clone)
Load when: the user names or admires a product ("like Linear"), asks for a modern SaaS / desktop-oriented / developer-tool feel, or you need real-world benchmarks during the interview or exploration phase.

Observations below come from general knowledge of these products and may be out of date. Before relying on one, inspect the live product (screenshot + read the page; see `workflows/design-interview.md` reference analysis) and record findings in `.artisan/references/inspiration.md`.

## Rules
1. Extract **principles and structure**, not appearance. Never copy logos, brand assets, exact layouts, copy, or a proprietary typeface. Never imitate a brand so closely a user could mistake the product.
2. Reduce each reference to the 7-part identity (motif, shape, color philosophy, type, spatial composition, motion, interaction), then ask what *this* product's purpose would change. If your result could be mistaken for the reference, revise.
3. Two references that agree are a pattern; one reference is a style. Combine at most 2-3 and name what you take from each.
4. Quality bar, not template: these are polished because of restraint and consistency, which transfer; their look does not.

## Landscape (SaaS worth studying, by category)
| Category | Products | Study them for |
|---|---|---|
| Productivity / PM | Notion, Linear, ClickUp, Trello, Asana, Monday.com | Linear: speed, density, keyboard flow. Notion: flexible blocks, calm typography. Trello: one strong metaphor (kanban). Monday/ClickUp: what *not* to do when feature sprawl hits (visual noise, color overload) |
| Design / dev | Figma, Canva, Webflow, Framer, Vercel, GitHub | Figma: canvas + contextual panels. Canva: approachable tool onboarding. Vercel: status hierarchy, monochrome precision. GitHub: dense information made scannable |
| Business / marketing | HubSpot, Shopify, Stripe, Mailchimp, Plausible, Calendly | Stripe: data-heavy dashboards and docs. Plausible: single-screen analytics, radical simplicity. Calendly: one task, zero friction |
| AI / automation | Perplexity, Jasper, Zapier, Make, ElevenLabs, Runway | Zapier/Make: node and flow builders. Perplexity: answer + sources layout. ElevenLabs/Runway: media-tool workspaces. Beware: many AI products share the same purple-gradient look; don't inherit it |

## Deep references

### Linear: precision dark workspace
- **Take:** very restrained palette (near-neutral surfaces, one cool accent used sparingly), tight type scale, hairline borders instead of shadows, dense list rows with consistent columns, command palette and keyboard shortcuts for everything, fast sub-200ms transitions, subtle state colors for status.
- **Don't take:** its exact purple-blue accent, issue-tracker information model, or marketing-page style unless the product warrants it.
- **Map to:** palettes `obsidian-cobalt`, `graphite-acid`, `slate-amber` (re-hued); fonts Geist/Inter/IBM Plex Sans (+ Geist Mono for IDs); layout expandable sidebar or rail + master-detail + command-centered; motion `precision` or `mechanical`.
- **Differentiation exercise:** keep the discipline (density, hairlines, keyboard-first), change the motif and accent logic to fit your domain.

### Vercel: developer dashboard, status first
- **Take:** monochrome base with color reserved for state (ready / building / error), strong information hierarchy (project → deployment → logs), generous but disciplined spacing, mono type for technical data, clear empty and loading states, deployment-status as the visual anchor, high contrast and clean focus rings.
- **Don't take:** pure black/white austerity if your audience isn't developers; the geometric-sans-plus-mono look for non-technical products.
- **Map to:** `monochrome-editorial` (dark), `obsidian-cobalt`; Geist Sans + Geist Mono; top navigation or rail + modular dashboard / data table; motion `precision`.

### Raycast: polished utility app
- **Take:** product presentation that shows the real UI in context, a strong brand voice through a single recurring motif, keyboard-driven list UI with a prominent query field, compact rows, native-feeling windows, tasteful depth and vibrancy only where it signals layering (floating palette over content).
- **Don't take:** its red/warm brand identity or gradient-heavy marketing art; heavy blur everywhere (see `references/anti-ai-aesthetics.md`).
- **Map to:** `graphite-acid`, `slate-amber`; Inter-class neutral sans or Geist; layout command-centered, dock/floating palette; motion `spring` (short) or `precision`.

### Stripe: dashboards and data presentation
- **Take:** clear data hierarchy (headline number, trend, breakdown), careful chart design with restrained colors and direct labeling, tables that are actually usable (sticky headers, aligned numerals, row actions), consistent form patterns, polished docs layout (three-pane with code), sophisticated but sparing use of gradient as a brand device.
- **Don't take:** its gradient identity as a default decoration; copying chart styles without real data.
- **Map to:** `midnight-teal`, `porcelain-coral`, `slate-amber`; tabular numerals, sans + mono; layout modular dashboard + data table; motion `smooth`/`precision`. See `examples/dashboard.md`.

## Quick selection
| You are building | Study first | Also consider |
|---|---|---|
| Keyboard-heavy productivity or issue tracker | Linear | Raycast |
| Developer tool / deployment / ops console | Vercel | GitHub, Linear |
| Utility or launcher style desktop app | Raycast | Linear |
| Payments, analytics, finance dashboard | Stripe | Plausible, Vercel |
| Whiteboard, design or media editor | Figma | Runway, Framer |
| Automation / flow builder | Zapier, Make | Figma (canvas panels) |
| Notes, docs, flexible content | Notion | Linear (density), editorial examples |
| Simple single-purpose SaaS | Calendly, Plausible | Stripe (clarity) |

## Reference analysis procedure
1. Capture 3-4 screens of the reference (screenshots at 1440 wide) via the browser tools; note the date.
2. Extract measurable facts: type sizes and families, spacing rhythm, corner radius, border vs shadow use, accent usage count, density (rows per 900px), motion durations (observe or inspect CSS).
3. Name what makes it feel premium (usually restraint, consistency, speed), not what is trending.
4. Write a 5-line summary to `.artisan/references/inspiration.md`: what we take, what we reject, why.
5. Run the originality test (`references/anti-ai-aesthetics.md`) against the result vs the reference.
