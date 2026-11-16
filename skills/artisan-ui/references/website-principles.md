# Website principles: five rules for sites that communicate and convert
Load when: designing or auditing a website, landing page, storefront, marketing or product site (anything with a visitor to persuade). For pure in-app UIs apply principles 2-4 only.

Core belief: **design should reduce effort, not create spectacle.** Recognition → Understanding → Direction → Experience → Trust → Action. Every element earns its place; the conversion is a natural continuation, not an interruption.

Reconciling with Artisan's anti-generic rules: a clear hero is correct (Mirror Test). What stays banned is the *template*: hero + three identical cards + CTA with swapped colors. Build the hero and sections from this product's actual audience, outcome, and content.

## 1. The Mirror Test (communication)
Make the visitor recognize themselves before introducing the product.
- First screen states: **who it is for**, **what they get** (tangible outcome), **what happens next** (one obvious action).
- Headline communicates value, not a product description. "Spend less time managing tasks. Get important work done." beats "Welcome to the future of productivity."
- One prominent primary CTA phrased as an action or outcome ("Estimate my savings"), never "Learn more" / "Submit".
- Hero is the most important communication space. Support with a real product preview or demo when it clarifies value. The first screen must work as a complete introduction without scrolling.
- Avoid vague claims, jargon, and clever wording that hides meaning.
- **Test:** can a stranger say who it is for, what it does, and what to do next after five seconds on the first screen?

## 2. The Highlighter Rule (visual hierarchy)
Color communicates importance, not decoration. 60-30-10 as a guideline, not a pixel count: 60% dominant neutral/surface, 30% supporting surfaces and navigation, 10% accent for the highest-priority interactions.
- One recognizable accent for primary CTAs; secondary actions quieter (outline, muted surface, text).
- The primary CTA is the most prominent interactive element in its context; supporting elements must not compete.
- Consistent color per state across the site; semantic colors (error, success) only where needed; sufficient contrast.
- **Test:** glance at any section: is the most important action obvious? Does the accent keep its meaning everywhere? If everything is highlighted, nothing is.
- See `references/color-library.md` for the semantic roles.

## 3. Front, Middle, Back (visual structure)
Depth through intentional layers, not decoration.
- **Back:** environment: solid, subtle gradient, restrained texture; never competes with content; separates sections without relying only on borders.
- **Middle:** content grouped into understandable units via spacing, alignment, type, surface contrast. Not every section needs a card; no nested-rectangle soup.
- **Front:** CTAs, floating controls, active nav, focused panels: stronger contrast, soft intentional shadow or slight elevation.
- Consistent surface levels, corner radii, shadow and border styles; whitespace as structure; elevation only where it helps. No glass, blur, or gradients that don't improve comprehension. Readable at every size.
- **Test:** can someone tell background, information, and actions apart without everything outlined or labeled?

## 4. Motion with a Job
Every animation must **demonstrate** (show what static can't: workflow, before/after, product response), **direct** (where to look/what next: menu open, scroll cue, state change), or **reveal** (controlled disclosure: enter-viewport content, accordion, result after an action).
- Prefer subtle, fast, purposeful; consistent timing and easing; animate meaningful state changes, not every element.
- Avoid gratuitous parallax, heavy scroll-triggered effects, distracting loops. Never make essential information depend on an animation finishing. Respect reduced-motion. Never interfere with scrolling, reading, navigation.
- **Test:** if the animation were removed, would the visitor lose information, guidance, feedback, or sense of interaction? If not, delete it.
- See `references/motion-engine.md` for implementation.

## 5. The Free Sample (value and trust)
Give tangible value before asking for attention, trust, or information.
- Offer one small, accessible experience tied to the product's value: calculator, quiz, estimator, diagnostic, generator, interactive demo (no account), or free assessment. Solve a small real problem (optimization software → performance check; budgeting → savings calculator).
- Not a disguised lead form: it must be useful even if they never buy, including when the result is unfavorable. No exaggerated promises.
- Value exchange: relevant problem → useful tool → only the inputs needed → clear actionable result → natural next step (try the product, explore a feature, ask for help). Ask for contact info only when necessary or with a clear optional benefit.
- Easy to discover, quick, minimal inputs, results relevant to the inputs, obvious link to the main product.
- Build it for real: working logic with honest assumptions shown; never fake outputs or invented statistics.
- **Test:** would someone find it genuinely useful if they never purchased?

## Standard across the whole site
- **Copy:** each section answers a question the visitor has; specific, concise; headings carry information, not slogans; claims backed by demo, example, or evidence; honest pricing and limits; no artificial urgency.
- **Layout:** clear hierarchy, consistent spacing, scannable; responsive reorganizes the experience, not just shrinks it.
- **Components:** one shared system; a primary action looks the same on every page.
- **Accessibility and performance:** readable text, keyboard use, color never the only signal, reduced motion, optimized images, no needless scripts. See `references/accessibility.md`.
- **Trust:** contextual CTAs, minimal forms, credible testimonials, clarity over tricks.

## Final evaluation: five questions
1. **Mirror:** does the first screen say who it serves, what outcome it offers, and what to do next?
2. **Highlighter:** is the most important action obvious, color used intentionally?
3. **Depth:** is the relationship between backgrounds, content, and interactive elements clear?
4. **Motion:** does every meaningful animation communicate, demonstrate, or guide?
5. **Free Sample:** can the visitor experience genuine value right away?

Record each as pass/fail with evidence in the audit (`workflows/visual-audit.md`). A site failing Mirror or Highlighter cannot reach the acceptance score regardless of polish.
