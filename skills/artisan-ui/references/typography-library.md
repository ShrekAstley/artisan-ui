# Typography Library
Load when: choosing fonts, pairings, type scales, line-height/measure, responsive type, numeric/data typography, font loading, or fallback stacks.

## 1. Principles
- Choose type by product purpose and voice, not popularity. State the reason in one line in the design profile.
- Max 2 families (1 sans, or 1 sans + 1 mono, or 1 serif + 1 sans). Max 3-4 weights total (e.g. 400, 500, 600, 700). Hierarchy comes from size, weight, spacing, and color, not more families.
- Prefer variable fonts: one file, any weight, fewer requests.
- Body text >= 16px on content sites, >= 13px for dense tool UI (never below 12px except legal/captions at >= 11px with strong contrast).
- Measure (line length): 45-75ch for prose (ideal 60-68ch); tables/code unconstrained but scroll-safe. Apply `max-width: 65ch` to prose containers.
- Line-height: body 1.5-1.7 (prose), 1.4-1.5 (UI), headings 1.05-1.25, display 0.95-1.1, mono blocks 1.5.
- Letter-spacing: display/large headings tighten (-0.01 to -0.04em); body 0; small caps/uppercase labels and tiny text (<=12px) open (+0.04 to +0.1em). Never track lowercase body text.
- Numbers: `font-variant-numeric: tabular-nums` for tables, prices, timers, metrics, ledgers; `lining-nums` in UI; `oldstyle-nums` only in editorial prose.
- Left-align body text; avoid justified without `hyphens:auto`; avoid long all-caps strings.
- Use `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Optical sizing: if the font has `opsz`, set `font-optical-sizing:auto` (Fraunces, Newsreader, Instrument Serif has none).

## 2. Font catalog
All fonts below are open-source (SIL OFL 1.1; Geist family also OFL via Vercel). Weights column: V = variable file available (axis range).

### Sans
| Font | Personality | Best for | Weights / axes | Notes |
|---|---|---|---|---|
| Geist | modern, technical, clean | developer tools, dashboards, premium SaaS | V wght 100-900 | tight, slightly geometric; pairs with Geist Mono; good tabular figures |
| Inter | neutral, versatile | when neutrality is deliberately required (dense enterprise UI, i18n coverage) | V wght 100-900, opsz 14-32 (v4) | DEFAULT-TO-AVOID: the generic-AI look. Use only as a conscious choice and say why; otherwise pick another sans |
| Manrope | geometric, polished | fintech, analytics, modern product marketing | V wght 200-800 | slightly wide; strong numerals; best >= 14px |
| IBM Plex Sans | technical, professional | enterprise, engineering, documentation | static 100-700 (+italics); V on Google Fonts | humanist-grotesque with character; excellent with Plex Mono |
| Plus Jakarta Sans | friendly, contemporary | consumer apps, onboarding, startups | V wght 200-800 | warm round forms; avoid for dense data |
| DM Sans | approachable, balanced | general product UI, small brands | V wght 100-1000, opsz 9-40 | low-contrast geometric; safe, slightly soft |
| Sora | distinctive, geometric | brand-led products, web3/tech marketing, display headings | V wght 100-800 | wide forms; use for headings, pair with a neutral body |
| Instrument Sans | refined, modern | editorial UI, portfolio, product with taste | V wght 400-700, wdth 75-100 | condensed width axis useful for labels; pairs with Newsreader |
| Work Sans | functional, understated | utilitarian tools, content sites | V wght 100-900 | grotesque; solid at body sizes |
| Public Sans | clear, institutional | government, nonprofit, forms, accessibility-first | V wght 100-900 | neutral, highly legible, USWDS lineage |

### Serif
| Font | Personality | Best for | Weights / axes | Notes |
|---|---|---|---|---|
| Newsreader | editorial, readable | long-form, magazines, reading apps | V wght 200-800, opsz 6-72, italics | use opsz auto; superb italic |
| Fraunces | expressive, distinctive | brands with character, food, lifestyle, display | V wght 100-900, opsz 9-144, SOFT 0-100, WONK 0-1 | set `font-variation-settings:"SOFT" 50,"WONK" 0`; wonky at display only |
| Playfair Display | traditional, luxurious | fashion, hospitality, luxury headlines | V wght 400-900, italics | high contrast: headings only, never small body |
| Literata | reading-oriented | e-readers, long text, docs | V wght 200-900, opsz 7-72 | designed for screens; strong at 16-20px |
| Instrument Serif | contemporary editorial | display headlines, pull quotes, portfolios | static 400 + italic | condensed display serif; one weight, do not synthesize bold |

### Mono
| Font | Personality | Best for | Weights / axes | Notes |
|---|---|---|---|---|
| JetBrains Mono | developer | code editors, terminals, logs | V wght 100-800 | tall x-height, ligatures optional (`font-variant-ligatures:none` for logs) |
| IBM Plex Mono | technical, structured | data labels, tables of IDs, instrument readouts | static 100-700 | pairs with Plex Sans and Manrope |
| Geist Mono | modern, understated | UI code snippets, metadata, tabular labels | V wght 100-900 | pairs with Geist |
| Space Mono | expressive, technical | brand accents, retro-tech, headings in small doses | static 400/700 + italics | quirky; avoid for long code |

## 3. Pairings
| ID | Combination | Mood / purpose | Display | Body | UI | Data |
|---|---|---|---|---|---|---|
| technical | Geist Sans + Geist Mono | developer tools, dashboards | Geist 600 | Geist 400 | Geist 500 | Geist Mono 400 |
| editorial | Newsreader + Instrument Sans | magazines, reading, essays | Newsreader 500 (opsz auto) | Newsreader 400 | Instrument Sans 500/600 | Instrument Sans tabular |
| analytical | Manrope + IBM Plex Mono | geometric, analytical, finance/analytics | Manrope 700 | Manrope 400/500 | Manrope 600 | Plex Mono 400/500 |
| expressive-lifestyle | Fraunces + DM Sans | warm brands, food, wellness | Fraunces 600 SOFT 50 | DM Sans 400 | DM Sans 500 | DM Sans tabular |
| engineering | IBM Plex Sans + IBM Plex Mono | docs, enterprise engineering | Plex Sans 600 | Plex Sans 400 | Plex Sans 500 | Plex Mono |
| friendly-consumer | Plus Jakarta Sans (single family) | consumer onboarding | Jakarta 700/800 | Jakarta 400 | Jakarta 600 | Jakarta tabular |
| luxury | Playfair Display + Work Sans | luxury retail, hospitality | Playfair 500/700 | Work Sans 400 | Work Sans 500 | Work Sans tabular |
| reading | Literata + Public Sans | long-form reading apps, docs | Literata 600 | Literata 400 | Public Sans 500/600 | Public Sans tabular |
| contemporary-edit | Instrument Serif + Instrument Sans | portfolios, studios, minimal brands | Instrument Serif 400 / italic | Instrument Sans 400 | Instrument Sans 500 | Instrument Sans tabular |
| brand-tech | Sora (display) + Public Sans (body) | brand-led tech marketing | Sora 600/700 | Public Sans 400 | Public Sans 500 | Public Sans tabular |
| instrument | Work Sans + Space Mono | industrial/retro instruments | Work Sans 700 | Work Sans 400 | Work Sans 600 | Space Mono 400 |

Hierarchy roles: display = hero/headings (largest, tightest), body = prose and descriptions, ui = buttons/labels/nav/tabs (500-600, slightly smaller, tighter line-height), data = numbers, IDs, code, timestamps (mono or tabular-nums).

### Avoid combinations
- Two sans families (Inter + Geist, DM Sans + Manrope): near-identical, reads as a mistake.
- Two serifs, or two display faces.
- Playfair Display or Fraunces at body size; Sora or Space Mono for paragraphs.
- Inter + any serif by default (the generic "AI blog" look) unless Inter was chosen on purpose.
- Mono for headings in non-technical products; mono for body prose.
- Mixing more than 4 weights; synthetic bold/italic (use a real face or none: Instrument Serif has no bold).

## 4. Type scales (CSS custom properties)
Scale = base * ratio^n. Pick one scale per product personality. All sizes in rem (1rem = 16px root); for tool UIs set `html{font-size:100%}` and base via tokens, never shrink the root.

### compact-instrumental (dense tools, dashboards) - ratio 1.125, base 13px
```css
:root{
  --font-base:0.8125rem;  /* 13px */
  --text-xs:0.6875rem; --text-sm:0.75rem; --text-md:0.8125rem; --text-lg:0.9125rem;
  --text-xl:1.0275rem; --text-2xl:1.156rem; --text-3xl:1.3rem;
  --lh-body:1.45; --lh-tight:1.2; --lh-heading:1.2;
  --ls-label:0.04em; --ls-heading:-0.01em; --ls-body:0;
  --fw-regular:400; --fw-medium:500; --fw-strong:600;
}
```
### standard-product (SaaS, consumer apps) - ratio 1.2, base 15-16px
```css
:root{
  --text-xs:0.75rem; --text-sm:0.875rem; --text-md:1rem; --text-lg:1.2rem;
  --text-xl:1.44rem; --text-2xl:1.728rem; --text-3xl:2.074rem; --text-4xl:2.488rem;
  --lh-body:1.55; --lh-heading:1.2; --lh-display:1.1;
  --ls-label:0.03em; --ls-heading:-0.015em; --ls-display:-0.025em;
  --fw-regular:400; --fw-medium:500; --fw-strong:600; --fw-display:700;
}
```
### editorial - ratio 1.25, base 18px
```css
:root{
  --text-sm:0.875rem; --text-md:1.125rem; --text-lg:1.406rem; --text-xl:1.758rem;
  --text-2xl:2.197rem; --text-3xl:2.747rem; --text-4xl:3.433rem; --text-display:clamp(3rem,2rem + 5vw,6rem);
  --lh-body:1.65; --lh-heading:1.15; --lh-display:1.0;
  --ls-heading:-0.02em; --ls-display:-0.035em; --ls-caps:0.08em;
  --measure:62ch; --fw-regular:400; --fw-medium:500; --fw-display:500; /* serif display lighter, not bolder */
}
```
### luxury-display - ratio 1.333, base 16px, high contrast of scale
```css
:root{
  --text-sm:0.875rem; --text-md:1rem; --text-lg:1.333rem; --text-xl:1.777rem; --text-2xl:2.369rem;
  --text-3xl:3.157rem; --text-display:clamp(3.5rem,2rem + 8vw,8rem);
  --lh-body:1.7; --lh-display:0.95; --ls-display:-0.03em; --ls-caps:0.14em; /* tracked small caps labels */
  --fw-regular:400; --fw-display:400;
}
```
### data-dense-monospace - ratio 1.125, base 12-13px, mono data
```css
:root{
  --text-xs:0.6875rem; --text-sm:0.75rem; --text-md:0.8125rem; --text-lg:0.9125rem; --text-xl:1.03rem;
  --text-metric:clamp(1.5rem,1.2rem + 1vw,2.25rem); /* big KPI numerals */
  --lh-body:1.4; --lh-mono:1.5; --ls-mono:0; --ls-label:0.06em;
  --num:tabular-nums slashed-zero; /* font-variant-numeric value for data cells */
}
```
### playful-friendly - ratio 1.2, base 16px, rounder, heavier
```css
:root{ --text-md:1rem; --text-lg:1.25rem; --text-xl:1.563rem; --text-2xl:1.953rem; --text-3xl:2.441rem;
  --lh-body:1.6; --lh-heading:1.15; --ls-heading:-0.01em; --fw-regular:400; --fw-medium:500; --fw-strong:700; --fw-display:800; }
```

### Choosing a scale
| Product | Scale | Pairing |
|---|---|---|
| devtools, observability | compact-instrumental or data-dense-monospace | technical, analytical |
| SaaS, business | standard-product | engineering, friendly-consumer |
| reading, magazines | editorial | editorial, reading |
| luxury retail | luxury-display | luxury |
| creative tools | compact-instrumental with expressive display | brand-tech, technical |
| kids/casual | playful-friendly | friendly-consumer |

## 5. Responsive typography (clamp)
Fluid size = `clamp(min, preferred, max)` where preferred = `intercept + slope*vw`. Always include a rem term so user zoom still scales (never pure vw).
```css
:root{
  --step-0:clamp(1rem,0.96rem + 0.2vw,1.125rem);      /* body */
  --step-1:clamp(1.2rem,1.1rem + 0.5vw,1.5rem);
  --step-2:clamp(1.44rem,1.2rem + 1.2vw,2.1rem);
  --step-3:clamp(1.73rem,1.3rem + 2.1vw,3rem);
  --step-4:clamp(2.07rem,1.3rem + 3.8vw,4.5rem);
  --step-display:clamp(2.75rem,1rem + 8vw,7rem);
}
h1{font-size:var(--step-4);line-height:1.05;letter-spacing:-0.03em;text-wrap:balance}
p{font-size:var(--step-0);line-height:1.6;max-width:65ch;text-wrap:pretty}
```
- Fluid type for marketing/editorial; fixed type scale (stepped at breakpoints) for app UI - dense tools should not resize text with the window.
- Test 320px width and 200% zoom; no clipped or overlapping lines; headings must wrap, not truncate.
- Prefer `ch`/`em` for component padding adjacent to text so spacing scales with font size.

### Data and numeric typography
```css
.num,td.num,.metric{font-variant-numeric:tabular-nums lining-nums;font-feature-settings:"tnum" 1}
.table th{font-size:var(--text-xs);letter-spacing:.06em;text-transform:uppercase;font-weight:600}
.table td.num{text-align:right}   /* right-align numerals; align decimals */
.code,.mono{font-family:var(--font-mono);font-variant-ligatures:none;font-size:0.92em} /* mono renders larger; reduce 8% inline */
.display{font-optical-sizing:auto;letter-spacing:-0.03em}
```
Tabular numerals: Geist, Inter, Manrope, IBM Plex Sans, DM Sans, Work Sans, Public Sans support `tnum`; verify the chosen face before relying on it (check glyph widths of 1 vs 8).

## 6. Loading rules
- Use variable fonts; request only needed axes (Google Fonts API: `wght@400..700`), only needed styles (italics only if used), and a Latin subset unless content requires others (`&subset=latin`).
- `font-display: swap` on every @font-face. Preload only the one or two files used above the fold (primary body + display) with `crossorigin`.
- Match fallback metrics to reduce layout shift: `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` on a local fallback @font-face.
- Self-host (WOFF2) for production web: `fontsource` npm packages (`@fontsource-variable/geist`) or downloaded files; avoid third-party font CDNs on privacy-sensitive sites. Geist: `npm i geist` (Vercel package) or fontsource.
- Never load a family "just in case". Never stack three weights of display plus three of body.
```css
@font-face{font-family:"Geist";src:url("/fonts/Geist-Variable.woff2") format("woff2-variations");
  font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Geist Fallback";src:local("Arial");size-adjust:100%;ascent-override:92%;descent-override:24%;line-gap-override:0%}
```
(Metric overrides above are placeholder numbers: compute real values per font with a tool such as fontaine/capsize before shipping.)

## 7. Licensing and availability procedure
All catalog fonts are open-source (SIL OFL 1.1) and obtainable from Google Fonts, fontsource, or (Geist, Geist Mono) Vercel's `geist` package/GitHub. The agent must still verify before bundling:
1. Confirm the exact family name and source (Google Fonts page, fontsource package, or upstream repo). Do not assume a font exists under a name; check.
2. Confirm the license file (OFL.txt) ships with the font files; include it in the repo (`/fonts/LICENSE-<family>.txt`). OFL permits bundling, embedding, and redistribution; it forbids selling the font alone and reusing the reserved font name for modified versions.
3. Confirm needed weights/axes/styles/subsets exist (e.g. Instrument Serif: 400 only; Space Mono: 400/700 static; Plex families: static weights unless a variable build is verified).
4. Check glyph coverage for the product's languages and symbols (arrows, currency, math, box-drawing for terminal UIs).
5. If the font cannot be verified or downloaded, choose the nearest listed alternative or a system stack; never reference an uninstalled font by name without a fallback.
6. Desktop apps (Electron, Tauri, native webviews), offline apps, kiosks: bundle fonts locally in the app package (WOFF2 via relative path); never depend on a CDN or network at runtime. Also verify packaging includes font files after build.

## 8. System fallback stacks
```css
:root{
  --stack-system:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --stack-serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --stack-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;

  --font-geist:"Geist","Geist Fallback",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-inter:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-manrope:"Manrope",system-ui,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;
  --font-plex-sans:"IBM Plex Sans","Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  --font-jakarta:"Plus Jakarta Sans",system-ui,"Segoe UI",Roboto,sans-serif;
  --font-dm-sans:"DM Sans",system-ui,"Segoe UI",Roboto,sans-serif;
  --font-sora:"Sora",system-ui,"Segoe UI",Roboto,sans-serif;
  --font-instrument-sans:"Instrument Sans",system-ui,"Segoe UI",Roboto,sans-serif;
  --font-work-sans:"Work Sans",system-ui,"Segoe UI",Roboto,Arial,sans-serif;
  --font-public-sans:"Public Sans",system-ui,"Segoe UI",Roboto,Arial,sans-serif;

  --font-newsreader:"Newsreader",Georgia,"Times New Roman",serif;
  --font-fraunces:"Fraunces","Iowan Old Style",Georgia,serif;
  --font-playfair:"Playfair Display",Didot,"Bodoni 72",Georgia,serif;
  --font-literata:"Literata",Georgia,"Iowan Old Style",serif;
  --font-instrument-serif:"Instrument Serif",Georgia,"Times New Roman",serif;

  --font-jetbrains-mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --font-plex-mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --font-geist-mono:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --font-space-mono:"Space Mono",ui-monospace,Menlo,Consolas,monospace;
}
body{font-family:var(--font-geist);font-size:var(--text-md);line-height:var(--lh-body);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
code,kbd,pre,.mono{font-family:var(--font-geist-mono)}
```

## 9. Decision procedure
1. Name the product's job and voice in 3 words (e.g. "precise, calm, technical"; "warm, literary, slow"). Name the dominant content: prose, data, code, UI chrome, brand display.
2. Prose-dominant -> serif or reading-oriented face (Newsreader, Literata) + sans UI. Data/code-dominant -> technical sans + mono (Geist, Plex, Manrope + Plex Mono). Brand/display-led -> one expressive display face (Fraunces, Sora, Playfair, Instrument Serif) + neutral body.
3. Match personality to palette and layout: instrument/industrial -> Plex or Work Sans + mono; luxury -> high-contrast serif display + restrained sans; consumer friendly -> Jakarta/DM Sans.
4. Skip Inter unless neutrality or language coverage is the stated reason; if chosen, pair with a distinctive role (a mono or serif display) so the product still has a voice.
5. Select a scale from section 4; set tokens; verify body size, measure (45-75ch), and contrast.
6. Verify availability and licensing (section 7), choose fallbacks (section 8), minimize weights and files (section 6).
7. Differentiate between projects: rotate within the matching row (e.g. technical products alternate Geist, Plex Sans, Manrope) rather than reusing one pairing everywhere.
8. Audit: count families (<= 2), weights (<= 4), loaded files, FOUT/CLS, mobile 320px, 200% zoom.
