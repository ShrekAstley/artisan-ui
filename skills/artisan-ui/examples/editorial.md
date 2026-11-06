# Example: Reading and Memory Application ("Marginalia")

## 1. Concept

Marginalia is a reading and memory app for people who read long-form essays and books and want to remember them: it holds the text, lets readers highlight and annotate in the margin, and resurfaces passages later through spaced review. Audience: slow readers, students, researchers. Goal: protect attention and make recalling a passage feel like returning to a well-kept notebook.

Load when: designing a reading / editorial / memory application or needing a worked example

Build order if budget-limited (e.g. a single-file build): tokens + shell wireframe first, then the one core interaction, then states and motion. Everything else in this spec is optional. Examples are illustrative; the approved `.artisan/` profile outranks them, and libraries outrank example token values.

Real data it binds to: imported documents (EPUB/HTML/Markdown) parsed into `chapter`, `paragraph`, `offset`; user `highlight` records (`doc_id`, `start`, `end`, `note`, `created_at`); a review schedule per highlight (`due_at`, `interval_days`, `ease`); reading position (`doc_id`, `offset`, `updated_at`).

## 2. Design profile

```json
{
  "identity": {
    "name": "Marginalia",
    "category": "reading-and-memory",
    "personality": ["quiet", "literate", "warm", "patient"]
  },
  "visual": {
    "theme": "both",
    "themeNotes": "warm paper light theme with a candle-dark evening theme; no pure white or black",
    "palette": "warm-paper-terracotta",
    "typography": { "display": "Fraunces", "reading": "Newsreader", "ui": "Instrument Sans" },
    "density": "airy",
    "radius": "soft-minimal"
  },
  "layout": {
    "navigation": "no persistent nav while reading; a hairline top strip reveals on pointer-up-scroll or Esc; library is a typographic index page",
    "content": "single centered reading column at 64ch with a right margin lane for notes that appears on demand",
    "responsive": true,
    "responsiveNotes": "column is fluid up to 64ch; at 768 notes become a bottom sheet; at 390 type scales with clamp() and notes open as an inline drawer under the paragraph"
  },
  "motion": {
    "preset": "organic",
    "microInteractions": ["highlight ink-in sweep", "margin note unfold", "progress thread thickening", "review card page-turn"],
    "pageTransitions": "chapter changes use a 320ms opacity plus 8px vertical drift; library to book uses a title that travels to the running head",
    "proceduralEffects": "paper grain is a static SVG; a faint ink-bleed on highlight creation only"
  },
  "principles": [
    "The text is the interface; chrome appears only when asked for",
    "Control measure (60-68ch) and leading (1.65) before any decoration",
    "Progress is shown as place, not as a score: a thread along the margin, not a percentage ring",
    "Notes live beside the passage they belong to",
    "Warm, not sentimental: no skeuomorphic page curls or leather"
  ],
  "motif": "the running thread: a thin vertical terracotta line in the left margin that thickens as you read and becomes the visual anchor for highlights and review",
  "shapeLanguage": "soft rectangles with 2px corners, dropped caps, hairline rules, pilcrow and asterism glyphs as ornaments",
  "colorPhilosophy": "paper and ink do the work; terracotta is the only chromatic voice, used for the thread, highlights (at 22% opacity), and the due-for-review marker; a muted olive marks 'remembered'",
  "spatialComposition": "generous margins (clamp 24px to 12vw), a baseline grid of 28px for text, vertical rhythm in multiples of 14px",
  "interactionPersonality": "a patient friend: slow to interrupt, gentle in response, never celebratory"
}
```

## 3. Implementation

```
1440x900  (reading view)
+--------------------------------------------------------------------------+
|  Marginalia   On Attention - Ch. 3                       aA   o   (hidden) |
+--------------------------------------------------------------------------+
|                                                                          |
|        |   III.                                      +-- note lane ----+ |
|        |   The Slow Return                           | "compare w/ Weil| |
|  thread|                                             |  on waiting"    | |
|        |   It is a curious fact that attention,      |  2 days ago     | |
|        |   once broken, returns not all at once      +-----------------+ |
|        |   but in layers, the way [light enters      |                 | |
|        |   a room at dawn].                          |                 | |
|        |                                             |                 | |
|        |   ~ 64ch measure, 20px / 33px ~             |                 | |
|        |                                             |                 | |
+--------------------------------------------------------------------------+
|   Chapter 3 of 9   -   14 min left   -   thread at 31%                  |
+--------------------------------------------------------------------------+
```

Key components and states:
- **Reading column**: default, focus mode (paragraphs other than the current one drop to 55% ink), search match (underline, not box), selection (native with terracotta tint).
- **Highlight**: new (ink-in sweep), idle (22% terracotta underlay), has-note (small asterism in the margin), due (dotted underline and a terracotta dot in the thread).
- **Margin note**: collapsed (asterism), open (note text in Instrument Sans 14px, edit in place), editing (caret in terracotta), orphaned (source text changed; shown with "passage moved" and a reattach action).
- **Progress thread**: reading position as thickness along the left margin; hover reveals chapter ticks; click jumps. Alternative linear bar is off; no percentage ring.
- **Review card**: front (passage with a word masked as an underline), revealed (full passage plus note), rated (Again / Hard / Good / Easy as text buttons with next interval "3 d").
- **Library**: typographic list with title in Fraunces 28px, author in italic Newsreader, a thin thread per book; no cover-card grid.

Token highlights:

```css
:root {
  --space-1: 7px; --space-2: 14px; --space-3: 21px; --space-4: 28px; --space-6: 56px;
  --radius-1: 2px; --radius-2: 6px;                    /* notes only */
  --paper: #f4ecdf; --paper-2: #ece2d1; --ink: #2a211b; --ink-2: #6b5d50;
  --terracotta: #b4532a; --olive: #6f7a4a;
  --hl: color-mix(in srgb, var(--terracotta) 22%, transparent);
  --measure: 64ch; --lead: 1.65;
  --ease-page: cubic-bezier(0.22, 0.61, 0.36, 1);
}
:root[data-theme="evening"] {
  --paper: #1d1814; --paper-2: #26201a; --ink: #e9dfd0; --ink-2: #a39685; --terracotta: #d9774a;
}
```

Typography scale: reading text Newsreader 20/33 (optical size on, `font-feature-settings: "onum", "liga"`); chapter title Fraunces 44/48 with SOFT 50 and WONK 0 axes; chapter numeral Fraunces italic 64; drop cap spans 3 lines; margin notes and UI Instrument Sans 14/20; small caps for running head. Use `text-wrap: pretty` on paragraphs and `hanging-punctuation: first` where supported. Reader can change size (16-26px) and the column adjusts to keep 60-68ch.

Framework notes: render the document as semantic HTML (`article`, `section`, `p`, `blockquote`); highlights as `<mark data-id>` applied with Range API wrappers, stored as offsets plus a text-quote fallback. React/Tailwind: `max-w-[64ch] mx-auto`, `leading-[1.65]`, custom `font-reading` family, `prose` plugin is avoided in favor of explicit tokens; the thread is a position-sticky 2px element whose height is set from an IntersectionObserver-derived offset.

## 4. Motion decisions

- Highlight ink-in: background-size animates 0 to 100% left to right, 380ms `cubic-bezier(0.22, 0.61, 0.36, 1)`; a 1.5% opacity ink-bleed blur at start fades in 600ms.
- Margin note unfold: height auto via grid-rows 0fr to 1fr, 260ms, plus 4px translateX; close 180ms.
- Progress thread: stroke width 1px to 3px interpolated to reading position, updated on scroll with a 120ms ease; no animation while the user is actively scrolling beyond 2 viewports per second (it snaps).
- Chapter transition: outgoing content opacity 1 to 0 in 140ms, incoming opacity 0 to 1 plus translateY(8px to 0) in 320ms with `--ease-page`; focus returns to the chapter heading.
- Library to book: the title element morphs to the running head with the View Transitions API, 360ms; fallback is a cross-fade.
- Review card page-turn: rotateY is not used; a 240ms horizontal slide of 12px plus fade keeps it delicate.
- Procedural effect: static grain (SVG feTurbulence rendered once to a data URI at 4% opacity). Ink-bleed runs only at highlight creation and ends; no ambient loop, so zero idle cost.
- Reduced motion: transitions become 0ms opacity-only swaps; highlight appears instantly; the thread updates without easing; view transition is disabled.

## 5. Why it works

- Reading is the job: a 64ch measure at 1.65 leading, optical sizing, and hanging punctuation do more for retention than any feature chrome.
- The thread ties reading, highlighting, and review together: the same line shows where you are, what you marked, and what is due.
- Warm paper and a single terracotta voice lower glare and keep notes and highlights visually related.
- Notes beside the passage reduce context switching during recall, which is the memory goal.
- Deliberately avoids: card grid library with cover tiles, progress rings and streak confetti, blue links on white, dashboard stats, sticky toolbars over the text, and generic sans-only typography.

## 6. Originality check

1. Could another product's name replace "Marginalia" with no visual change? No: the thread motif and typographic library are unique to it.
2. Motif specific to the concept? Yes, the running thread.
3. Palette used with intent? Yes, warm-paper-terracotta with terracotta as a single memory/highlight color and olive for remembered.
4. Layout not sidebar plus card grid? Yes, a centered column with an on-demand note lane.
5. Type voice distinct? Yes, Fraunces display with Newsreader text.
6. Motion matched to personality? Yes, organic preset with slow ink-like reveals and no ambient effects.

## 7. Verification notes

- 1440x900: column is 64ch centered; note lane opens without shifting the text column; thread visible; chrome hidden until summoned.
- 1280x800: measure still 60-68ch; running head and footer line do not overlap content.
- 768x1024: notes open as a bottom sheet; thread remains in the left margin; font size control works.
- 390x844: body 18px minimum, lines 35-45ch; note drawer inline; drop cap does not break the first line; tap targets 44px.
- Measure characters per line with a script on a real paragraph at each width; confirm 45-75 range.
- Contrast: `--ink` on `--paper` above 7:1, highlight underlay does not drop text below 4.5:1 in either theme.
- Test with `prefers-reduced-motion` and with text zoom to 200%.
- `screenshots/` placeholder: populate by running the benchmark; do not fabricate.
