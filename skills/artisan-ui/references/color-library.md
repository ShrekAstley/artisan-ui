# Color Library
Load when: choosing, adapting, or auditing a color palette, theme tokens, dark/light modes, status colors, focus/hover/disabled states, or chart colors.

## 1. Principles
- A palette is a personality + use case + semantic role set + light/dark variants. Never ship raw hex in components; components read semantic tokens only.
- 60-30-10: ~60% neutral background, ~30% surface/secondary neutrals and text, ~10% accent. Accent marks the primary action, current selection, key data. Accent on everything = no hierarchy.
- Neutrals carry the personality: tint them 2-6% toward the palette hue (never pure #000/#FFF grays unless monochrome is the intent).
- Contrast (WCAG 2.2): body text 4.5:1, large text (>=24px or >=18.66px bold) 3:1, UI components/icons/focus rings/input borders 3:1 against adjacent colors. Never convey state by color alone (add icon, text, shape, underline).
- Dark mode is not inverted light mode: lift surfaces (higher = lighter), desaturate/lighten accents (~L+10-15), avoid pure #000 backgrounds and pure #FFF text (halation).
- Status colors keep fixed meaning across palettes (green ok, amber warn, red danger, blue info) but are re-tuned per palette for hue harmony and contrast.
- Max one accent hue. A second hue only for data categories or status.

Contrast checker (paste into any JS runtime):
```js
const lum=h=>{h=h.replace('#','');const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)
 .map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
// ratio('#E8EEF6','#0B0F14') -> ~16.5 ; alpha colors: composite over the real background first
```
Required checks per palette: text-primary/secondary vs background+surface+surface-elevated >= 4.5; text-muted >= 4.5 on background (else mark decorative-only); accent vs background >= 3 (>= 4.5 if used as text/links); accent-contrast vs accent >= 4.5; status colors vs surface >= 4.5 when used as text, >= 3 as icon/fill; border-strong vs background >= 3 for input outlines.

## 2. Semantic role system (every palette outputs all of these)
| Token | Role |
|---|---|
| --color-background | page canvas |
| --color-surface | panels, cards, sidebars |
| --color-surface-elevated | menus, popovers, dialogs, raised controls |
| --color-text-primary / -secondary / -muted | body+headings / supporting / hints, timestamps (muted: 4.5:1 unless noted) |
| --color-accent / -accent-hover / -accent-contrast | primary action fill, its hover, text/icon ON accent |
| --color-success / warning / danger / info | status (text/icon on surface) |
| --border-subtle / --border-strong | dividers, card edges / input outlines, focus-adjacent edges |
| --color-overlay | modal scrim |
| --color-disabled-bg / --color-disabled-text | disabled controls |
| --color-hover / --color-selected | state layers over any surface |
| --color-focus-ring | keyboard focus indicator |

### Derivation rules (one shared block, applies to every palette)
- overlay (scrim): dark mode `rgb(0 0 0 / .62)`; light mode `color-mix(in srgb, var(--color-text-primary) 45%, transparent)`. Pair with 4-8px backdrop blur only if it serves depth.
- hover: state layer, not a new color. `color-mix(in srgb, var(--color-text-primary) 6%, transparent)` over any surface (8% in dark). Accent buttons use --color-accent-hover instead (dark: +L 6-8; light: -L 6-8).
- pressed: 12% state layer (or accent-hover darkened one more step).
- selected: `color-mix(in srgb, var(--color-accent) 14%, transparent)` fill plus a 2px accent inline-start bar or check icon (not color alone). Selected text stays text-primary.
- disabled: bg `color-mix(in srgb, var(--color-text-primary) 8%, transparent)`, text `color-mix(in srgb, var(--color-text-primary) 38%, transparent)`. Exempt from contrast rules but add `cursor:not-allowed`, no hover, and keep label legible enough to read.
- focus-ring: 2px solid ring, 2px offset, color = accent in dark mode; in light mode accent if >= 3:1 against the surface, else text-primary. Never remove outline without replacement; ring must hold 3:1 against both the element and its surroundings. Use `:focus-visible`.
- borders: dark uses white alpha (12% subtle / 15% strong), light uses ink alpha (8% subtle / 19% strong).
- Do not use opacity on text to make secondary text (breaks contrast and layering); use the token.

```css
:root{
  --color-overlay:rgb(0 0 0 / .62);
  --color-hover:color-mix(in srgb,var(--color-text-primary) 8%,transparent);
  --color-pressed:color-mix(in srgb,var(--color-text-primary) 14%,transparent);
  --color-selected:color-mix(in srgb,var(--color-accent) 14%,transparent);
  --color-disabled-bg:color-mix(in srgb,var(--color-text-primary) 8%,transparent);
  --color-disabled-text:color-mix(in srgb,var(--color-text-primary) 38%,transparent);
  --color-focus-ring:var(--color-accent);
}
[data-mode="light"]{
  --color-overlay:color-mix(in srgb,var(--color-text-primary) 45%,transparent);
  --color-hover:color-mix(in srgb,var(--color-text-primary) 6%,transparent);
}
:focus-visible{outline:2px solid var(--color-focus-ring);outline-offset:2px}
```

## 3. Palettes
Selector convention: `[data-palette="<id>"]` is the default (primary) mode; `[data-palette="<id>"][data-mode="..."]` is the counterpart. Each block defines base roles; derived roles (overlay, hover, selected, disabled, focus) come from section 2. All values below are computed-contrast-checked: primary/secondary text >= 4.5:1 on all three surfaces; accent-contrast >= 4.5:1; status >= 4.5:1 on surface; muted text >= 4.5:1 on background (some palettes dip to 4.1-4.5 on surface-elevated and 3.3-4.4 for obsidian-cobalt dark, whose hex values are fixed): on elevated surfaces use muted only for non-essential hints, or use text-secondary.

### obsidian-cobalt
Cold near-black with a single electric cobalt: precise, quiet, expensive.
Best for: developer tools, technical dashboards, premium dark products, terminals, observability.
Avoid for: children's, wellness, food, playful consumer, anything needing warmth.
```css
[data-palette="obsidian-cobalt"]{ /* dark (primary) */
  --color-background:#0B0F14; --color-surface:#151D27; --color-surface-elevated:#253344;
  --color-text-primary:#E8EEF6; --color-text-secondary:#A5B1C0; --color-text-muted:#758397; /* muted: 4.5:1 on bg, 4.4 on surface, 3.3 on elevated: non-essential hints only there */
  --color-accent:#6D9EFF; --color-accent-hover:#8AB0FF; --color-accent-contrast:#0B0F14;
  --color-success:#62C99A; --color-warning:#E8B263; --color-danger:#E87979; --color-info:#7FB6E8;
  --border-subtle:#FFFFFF12; --border-strong:#FFFFFF26;
}
[data-palette="obsidian-cobalt"][data-mode="light"]{
  --color-background:#EEF2F7; --color-surface:#F9FBFD; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#0E1621; --color-text-secondary:#435064; --color-text-muted:#5C687A;
  --color-accent:#2457D6; --color-accent-hover:#1B46B3; --color-accent-contrast:#FFFFFF;
  --color-success:#12754F; --color-warning:#8F5A00; --color-danger:#B42323; --color-info:#1F6FB5;
  --border-subtle:#0E162114; --border-strong:#0E162130;
}
```

### graphite-acid
Warm-neutral graphite with one acid lime jolt: tool-like, opinionated, a little rude.
Best for: creative software, experimental products, productivity tools with attitude, music/video tooling.
Avoid for: finance, healthcare, conservative enterprise, long-form reading.
```css
[data-palette="graphite-acid"]{ /* dark (primary) */
  --color-background:#101112; --color-surface:#191B1C; --color-surface-elevated:#26292B;
  --color-text-primary:#ECEFEA; --color-text-secondary:#B0B5AD; --color-text-muted:#8A9087;
  --color-accent:#C6F432; --color-accent-hover:#D6FA62; --color-accent-contrast:#121400;
  --color-success:#5FD38D; --color-warning:#F0B545; --color-danger:#FF7A6B; --color-info:#6CB6FF;
  --border-subtle:#FFFFFF14; --border-strong:#FFFFFF2B;
}
[data-palette="graphite-acid"][data-mode="light"]{ /* acid becomes deep olive-lime; lime only as fill with dark text */
  --color-background:#F1F2EE; --color-surface:#FAFAF7; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#141615; --color-text-secondary:#4A4F48; --color-text-muted:#646A61;
  --color-accent:#4F7300; --color-accent-hover:#3E5C00; --color-accent-contrast:#FFFFFF;
  --color-success:#1A7A45; --color-warning:#8A5A00; --color-danger:#B3261E; --color-info:#1F63B0;
  --border-subtle:#14161512; --border-strong:#14161530;
}
```

### midnight-teal
Deep blue-black with controlled teal signal: calm under load, data-forward.
Best for: analytics, finance, monitoring, ops consoles, trading/reporting views.
Avoid for: playful brands, fashion, anything where teal reads as medical-generic.
```css
[data-palette="midnight-teal"]{ /* dark (primary) */
  --color-background:#08141A; --color-surface:#0F1F27; --color-surface-elevated:#19303B;
  --color-text-primary:#E6F1F3; --color-text-secondary:#A3B8BF; --color-text-muted:#7A9199;
  --color-accent:#35D0BA; --color-accent-hover:#5BE0CC; --color-accent-contrast:#04201C;
  --color-success:#6FD08C; --color-warning:#F0B24B; --color-danger:#F27C7C; --color-info:#7BB4F5;
  --border-subtle:#FFFFFF12; --border-strong:#FFFFFF26;
}
[data-palette="midnight-teal"][data-mode="light"]{
  --color-background:#EDF4F5; --color-surface:#F8FBFB; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#0B1A20; --color-text-secondary:#3F5760; --color-text-muted:#587078;
  --color-accent:#0B7F73; --color-accent-hover:#086A60; --color-accent-contrast:#FFFFFF;
  --color-success:#187A3F; --color-warning:#8A5700; --color-danger:#B42A2A; --color-info:#1D64A8;
  --border-subtle:#0B1A2014; --border-strong:#0B1A2030;
}
```

### porcelain-coral
Clean warm-white canvas, confident coral action color: friendly, approachable, commercial.
Best for: modern SaaS, business tools, consumer apps, onboarding-heavy products.
Avoid for: security/ops (coral vs danger confusion), dense monitoring, somber products.
Note: danger is a deeper red; always pair danger with icon + text so it cannot be mistaken for the accent.
```css
[data-palette="porcelain-coral"]{ /* light (primary) */
  --color-background:#F5F1EC; --color-surface:#FDFBF9; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#1D1A19; --color-text-secondary:#5A5350; --color-text-muted:#6F6763;
  --color-accent:#C9402A; --color-accent-hover:#AE3320; --color-accent-contrast:#FFFFFF;
  --color-success:#1B7A4B; --color-warning:#8C5A00; --color-danger:#9E1F1F; --color-info:#1F63B0;
  --border-subtle:#1D1A1914; --border-strong:#1D1A1932;
}
[data-palette="porcelain-coral"][data-mode="dark"]{
  --color-background:#171312; --color-surface:#211B19; --color-surface-elevated:#2F2723;
  --color-text-primary:#F4EDE8; --color-text-secondary:#C0B3AB; --color-text-muted:#968880;
  --color-accent:#FF7A5E; --color-accent-hover:#FF957D; --color-accent-contrast:#1D0A05;
  --color-success:#5CCB93; --color-warning:#EDB458; --color-danger:#F28484; --color-info:#78B4F2;
  --border-subtle:#FFFFFF14; --border-strong:#FFFFFF2B;
}
```

### warm-paper-terracotta
Uncoated-paper cream, ink-brown text, one baked-clay accent: tactile, literary, unhurried.
Best for: editorial, reading apps, newsletters, lifestyle, journaling, cookbooks.
Avoid for: dashboards with many status colors, cold/technical tools, high-energy products.
```css
[data-palette="warm-paper-terracotta"]{ /* light (primary) */
  --color-background:#F4EEE3; --color-surface:#FBF7EF; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#26201B; --color-text-secondary:#5E5249; --color-text-muted:#6F6257;
  --color-accent:#B04A2B; --color-accent-hover:#933B20; --color-accent-contrast:#FFFFFF;
  --color-success:#3F6B3A; --color-warning:#855400; --color-danger:#A82D22; --color-info:#2F5F8A;
  --border-subtle:#26201B14; --border-strong:#26201B33;
}
[data-palette="warm-paper-terracotta"][data-mode="dark"]{ /* "lamplight" reading mode */
  --color-background:#1B1612; --color-surface:#261F1A; --color-surface-elevated:#352B24;
  --color-text-primary:#F1E8DC; --color-text-secondary:#BFB1A1; --color-text-muted:#978979;
  --color-accent:#E27D5A; --color-accent-hover:#EE9A7B; --color-accent-contrast:#200D05;
  --color-success:#8CC27F; --color-warning:#E5B65F; --color-danger:#EE7F72; --color-info:#86B3DB;
  --border-subtle:#FFFFFF14; --border-strong:#FFFFFF2B;
}
```

### indigo-violet
Saturated indigo/violet on blue-black: "AI product" default look.
WARNING: the most overused AI-interface palette. Use only when the product has a specific reason (e.g. brand already violet, creative/dream/night semantics) and state that reason in the design profile; otherwise pick another palette. If used, shift hue away from the 255-265 band (toward 275-285, or 240-250) and keep gradients out. A shifted hue near 245-250 is acceptable when restricted to at most two roles (e.g. selection, playhead) with the reason recorded in the profile.
Best for: creative platforms, AI/digital workspaces with an established violet brand, night/music/dream themes.
Avoid for: generic "AI assistant" defaults, finance, health, anything chosen "because it looks techy".
```css
[data-palette="indigo-violet"]{ /* dark (primary) */
  --color-background:#0E0C1A; --color-surface:#17142B; --color-surface-elevated:#241F42;
  --color-text-primary:#ECE9FA; --color-text-secondary:#B0AACF; --color-text-muted:#8F88B5;
  --color-accent:#8B7CFF; --color-accent-hover:#A296FF; --color-accent-contrast:#0E0A2E;
  --color-success:#62CF9A; --color-warning:#EBB65E; --color-danger:#F27D8A; --color-info:#6FB5F0;
  --border-subtle:#FFFFFF12; --border-strong:#FFFFFF26;
}
[data-palette="indigo-violet"][data-mode="light"]{
  --color-background:#F4F2FC; --color-surface:#FBFAFF; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#17142B; --color-text-secondary:#4B4670; --color-text-muted:#645F8A;
  --color-accent:#5A45E0; --color-accent-hover:#4733C4; --color-accent-contrast:#FFFFFF;
  --color-success:#167A4E; --color-warning:#8C5A00; --color-danger:#B3243F; --color-info:#1D62AE;
  --border-subtle:#17142B14; --border-strong:#17142B30;
}
```

### forest-sage
Lichen-tinted off-white, deep conifer accent: grounded, patient, evidence-based.
Best for: research tools, nature/outdoor, wellness, sustainability, learning products.
Avoid for: finance (green = profit confusion), alert-heavy consoles, high-energy brands.
Note: success is green too; differentiate success with a check icon and use a brighter blue-green hue for it than the accent.
```css
[data-palette="forest-sage"]{ /* light (primary) */
  --color-background:#EEF1EA; --color-surface:#F8FAF5; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#17211A; --color-text-secondary:#4A5A4E; --color-text-muted:#5E6D5F;
  --color-accent:#2F6B47; --color-accent-hover:#245538; --color-accent-contrast:#FFFFFF;
  --color-success:#17786A; --color-warning:#855400; --color-danger:#A9302A; --color-info:#2B6290;
  --border-subtle:#17211A14; --border-strong:#17211A30;
}
[data-palette="forest-sage"][data-mode="dark"]{
  --color-background:#0F1712; --color-surface:#172019; --color-surface-elevated:#223028;
  --color-text-primary:#E6EFE6; --color-text-secondary:#A9BBAC; --color-text-muted:#809484;
  --color-accent:#7FC79A; --color-accent-hover:#9AD6B0; --color-accent-contrast:#07200F;
  --color-success:#5FCDBB; --color-warning:#E6B85F; --color-danger:#EF8379; --color-info:#7FB3E0;
  --border-subtle:#FFFFFF12; --border-strong:#FFFFFF26;
}
```

### slate-amber
Blue-gray steel with a single amber indicator lamp: functional, physical, legible at a glance.
Best for: industrial tools, instruments, control panels, hardware dashboards, diagnostics.
Avoid for: soft consumer products, editorial. Warning is lemon-yellow (not amber) so it stays distinct from the accent.
```css
[data-palette="slate-amber"]{ /* dark (primary) */
  --color-background:#14171B; --color-surface:#1D2126; --color-surface-elevated:#2A3037;
  --color-text-primary:#E9ECEF; --color-text-secondary:#AEB5BD; --color-text-muted:#838C97;
  --color-accent:#F2A93B; --color-accent-hover:#F7BC62; --color-accent-contrast:#1C1200;
  --color-success:#58C98A; --color-warning:#F2D14B; --color-danger:#F2766B; --color-info:#6DB3F2;
  --border-subtle:#FFFFFF14; --border-strong:#FFFFFF2B;
}
[data-palette="slate-amber"][data-mode="light"]{
  --color-background:#E9ECEF; --color-surface:#F4F6F8; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#13171B; --color-text-secondary:#444C55; --color-text-muted:#5C6672;
  --color-accent:#9A5B00; --color-accent-hover:#7E4A00; --color-accent-contrast:#FFFFFF;
  --color-success:#17794A; --color-warning:#7A6200; --color-danger:#B3261E; --color-info:#1F63B0;
  --border-subtle:#13171B14; --border-strong:#13171B33;
}
```

### monochrome-editorial
Ink and paper only; hierarchy by scale, weight, and rules. Color appears only as status or one image-led signal.
Best for: portfolios, editorial, minimal brands, text-forward sites, case studies.
Avoid for: dense apps needing many states, data-rich dashboards (add a categorical set first).
```css
[data-palette="monochrome-editorial"]{ /* light (primary) */
  --color-background:#F5F5F2; --color-surface:#FFFFFF; --color-surface-elevated:#FFFFFF; /* separate with hairline + shadow, not tint */
  --color-text-primary:#111111; --color-text-secondary:#4A4A4A; --color-text-muted:#666666;
  --color-accent:#111111; --color-accent-hover:#333333; --color-accent-contrast:#FFFFFF;
  --color-success:#1B6B3F; --color-warning:#7F5700; --color-danger:#B3261E; --color-info:#245B9A;
  --border-subtle:#11111114; --border-strong:#11111140;
}
[data-palette="monochrome-editorial"][data-mode="dark"]{
  --color-background:#0D0D0D; --color-surface:#161616; --color-surface-elevated:#222222;
  --color-text-primary:#F2F2EE; --color-text-secondary:#B5B5B0; --color-text-muted:#8A8A86;
  --color-accent:#F2F2EE; --color-accent-hover:#FFFFFF; --color-accent-contrast:#0D0D0D;
  --color-success:#6FCB96; --color-warning:#E3B35C; --color-danger:#EF8076; --color-info:#7FB0E6;
  --border-subtle:#FFFFFF14; --border-strong:#FFFFFF33;
}
```

### plum-champagne
Aubergine-black with champagne gold: low-key, tactile, evening-lit luxury.
Best for: luxury or premium consumer, beauty, hospitality, jewelry, high-end e-commerce.
Avoid for: utilitarian tools, high-density data, budget/value brands. Use gold sparingly (a single CTA, hairlines).
```css
[data-palette="plum-champagne"]{ /* dark (primary) */
  --color-background:#140E14; --color-surface:#1E161E; --color-surface-elevated:#2D212D;
  --color-text-primary:#F3ECE4; --color-text-secondary:#C0B2B4; --color-text-muted:#978A8E;
  --color-accent:#D8BC8A; --color-accent-hover:#E6CFA6; --color-accent-contrast:#2A1B07;
  --color-success:#7CC99A; --color-warning:#E8B964; --color-danger:#EE8383; --color-info:#8DB4E3;
  --border-subtle:#FFFFFF12; --border-strong:#FFFFFF26;
}
[data-palette="plum-champagne"][data-mode="light"]{ /* plum is the accent in light; champagne becomes a decorative hairline #B8975F */
  --color-background:#F6F0EA; --color-surface:#FCF8F4; --color-surface-elevated:#FFFFFF;
  --color-text-primary:#231620; --color-text-secondary:#5C4A57; --color-text-muted:#716069;
  --color-accent:#6B2A5B; --color-accent-hover:#55204A; --color-accent-contrast:#FFFFFF;
  --color-success:#2F6F4A; --color-warning:#86580F; --color-danger:#A62B2B; --color-info:#2D5F8F;
  --border-subtle:#23162014; --border-strong:#23162033;
}
```

## 4. Selection procedure
1. Read the design profile: personality (precise / warm / playful / austere / luxurious), domain, default mode (tools used long hours or in dim rooms = dark; reading, commerce, daytime business = light), temperature (cool/neutral/warm), data density.
2. Shortlist by "Best for"; reject any palette whose "Avoid for" matches. If two remain, pick the one whose neutral temperature matches the product's physical metaphor (instrument, paper, screen, fabric).
3. Always build both modes unless the brief forbids; verify counterpart contrast with the checker.
4. Deviate so projects do not collide: shift the accent hue 8-25 degrees, change accent chroma (+/-15%), or swap neutral tint (cool to warm). Re-run all contrast checks after any shift. Keep the lightness structure (surface steps, text steps) - change hue/chroma, not lightness, so verified ratios hold approximately; re-verify anyway.
5. Never reuse a palette unmodified in consecutive projects; never choose indigo-violet by default.
6. Define tokens once (CSS custom properties); expose via theme attribute; components never reference hex.
7. Accent budget: one accent fill per view region; secondary actions use outline/text buttons in text-primary.

### Dataviz / categorical color
- Categorical series: max 6-8 hues, equal perceived lightness (OKLCH L 0.65-0.75 on dark, 0.50-0.60 on light), chroma 0.10-0.16, hues spaced >= 40 degrees; do not reuse status red/green as categories.
- Sequential: single hue ramp over lightness (light-to-dark on light bg; reversed on dark). Diverging: two hues through a neutral midpoint. Heatmaps: perceptually uniform ramps, not rainbow.
- Encode redundantly (direct labels, markers, dash patterns). Check colorblind-safe pairs (avoid red/green adjacency). Chart gridlines use border-subtle; axis text uses text-muted/secondary (>= 4.5:1).
- Starter 6-set, dark: `#6D9EFF #62C99A #E8B263 #E87979 #B08CF0 #5FC7D6`; light: `#2457D6 #12754F #8F5A00 #B42323 #6A3FC0 #0B7F8F`. Reorder/shift hue to taste.

## 5. Roadmap: families to add
| Family | Intent |
|---|---|
| warm neutrals | stone/sand/clay grays for calm, human products; base for editorial and lifestyle |
| cool neutrals | steel/ice grays for precise, clinical, technical surfaces |
| high-contrast monochrome | pure black/white with a single signal; stark brutalist or print-like UIs |
| muted pastel | low-chroma soft tints for gentle consumer, kids-adjacent, journaling |
| earth tones | ochre, umber, moss, rust for outdoor, craft, heritage brands |
| deep jewel tones | emerald, sapphire, garnet, amethyst on dark for rich premium moods |
| cybernetic / high-energy | neon on near-black, high chroma, for games, music, live events |
| industrial | safety orange/yellow with concrete grays for tools, logistics, hardware |
| organic | leaf, clay, water hues with irregular softness for food, farming, bio |
| editorial / luxury | restrained serif-friendly neutrals with metallic or deep accent |
| colorful consumer | multi-hue friendly systems for social, education, casual games |
| accessible high-contrast | AAA (7:1) text, 4.5:1 UI, forced-colors-friendly for a11y-first products |
