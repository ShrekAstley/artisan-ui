# Example: Creative Workstation ("Reelhouse")

## 1. Concept

Reelhouse is a browser-based video and motion editor for solo creators who cut short films and social edits. It combines a viewer, a multi-track timeline, an inspector for precise parameters, and an asset bin in one split workspace. Goal: prioritize the workspace; every control is intentional, compact, and placed where the hand already is.

Load when: designing a creative tool / editing workstation or needing a worked example

Build order if budget-limited (e.g. a single-file build): tokens + shell wireframe first, then the one core interaction, then states and motion. Everything else in this spec is optional. Examples are illustrative; the approved `.artisan/` profile outranks them, and libraries outrank example token values.

Real data it binds to: a project document (`tracks[]`, `clips[]` with `asset_id`, `start_frame`, `in_frame`, `out_frame`, `track`), media assets (`duration`, `fps`, `waveform_peaks[]`, `thumbnail_strip`), effect parameters per clip (`type`, `params{}` with `min`, `max`, `step`, `unit`), and playback state (`playhead_frame`, `loop_range`). Timebase is frames at the project fps; display is timecode.

## 2. Design profile

```json
{
  "identity": {
    "name": "Reelhouse",
    "category": "creative-workstation",
    "personality": ["focused", "tactile", "compact", "unobtrusive"]
  },
  "visual": {
    "theme": "dark",
    "themeNotes": "neutral mid-dark so footage color reads true; chrome stays desaturated",
    "palette": "indigo-violet",
    "typography": { "ui": "Work Sans", "numbers": "IBM Plex Mono", "labels": "Work Sans" },
    "density": "compact-high",
    "radius": "tight"
  },
  "layout": {
    "navigation": "no global nav; a 36px menu/tool strip at the top; workspaces (Cut, Color, Audio) are tabs inside the strip",
    "content": "viewer top-left, inspector right, asset bin bottom-left tab, timeline spanning the bottom; all separated by draggable seams",
    "responsive": true,
    "responsiveNotes": "at 1280 the bin folds into a tab; at 768 the inspector becomes a contextual bottom sheet attached to the selection; at 390 a read-and-trim mode only (viewer plus simplified timeline), full edit marked unsupported"
  },
  "motion": {
    "preset": "smooth",
    "microInteractions": ["drag with pointer capture and inertia", "snap magnet pulse", "scrub preview", "parameter scrub on numeric fields"],
    "pageTransitions": "workspace tabs re-arrange panels with a 220ms layout glide",
    "proceduralEffects": "waveform and thumbnail strips render lazily; playhead glow limited to playback"
  },
  "principles": [
    "The viewer and timeline get at least 70% of the window; chrome is the remainder",
    "Every control shows value, unit, and range; none are decorative",
    "Direct manipulation first: drag, scrub, and snap before dialogs",
    "Contextual panels show only parameters of the current selection",
    "Color in chrome is neutral; violet marks selection and the playhead only, so footage color is never competing"
  ],
  "motif": "the frame tick: evenly spaced tick marks that form the ruler, slider tracks, numeric scrub fields, and snap guides",
  "shapeLanguage": "tight 3px corners, thin 1px strokes, clips as flat bars with notched ends, round only for the playhead handle",
  "colorPhilosophy": "neutral gray ladder with a cool tilt; violet for selection, playhead, and in/out handles; track colors are low-saturation hues used on a 3px stripe, never full fills",
  "spatialComposition": "4px grid, 24px track height (compact) or 40px (comfortable), ruler 20px; panel headers 24px; seams 1px with 6px hit areas",
  "interactionPersonality": "responsive and forgiving: movement follows the hand, then settles gently on a snap"
}
```

## 3. Implementation

```
1440x900
+--------------------------------------------------------------------------+
| File Edit View  | Cut  Color  Audio |  V  C  S  H  |   00:00:12:08  1080p|
+------------------------------------------+-------------------------------+
|                                          | INSPECTOR  clip "interview_02"|
|        VIEWER  (16:9, fit)               | Position  X [ 0.0 ] Y [ 0.0 ] |
|                                          | Scale     [ 100 % ]  lock     |
|                                          | Opacity   |-----o----| 85 %   |
|                                          | Speed     [ 1.00 x ]          |
|  <<  |<  >  >|  >>   12:08  loop  1/2x  |                               |
+------------------------------------------+-------------------------------+
| ruler | 0s    5s    10s   | 15s    20s    25s    30s                     |
| V2    |        [broll_04 ====]  [title ==]                               |
| V1    | [interview_02 ================]  [broll_07 ========]             |
| A1    | ~~~~~~~~~~~~~~~~~~~~ waveform ~~~~~~~~~~~~~~~~~~~~~~~            |
| A2    | ~~~~~ music ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~            |
+--------------------------------------------------------------------------+
```

Key components and states:
- **Timeline clip**: idle, hover (top edge brightens), selected (violet 1px outline plus handles), dragging (lifted 1px, 70% opacity ghost at origin), trimming (tooltip with delta frames), locked (hatched), missing media (red stripe plus relink action).
- **Playhead**: line plus handle; idle, playing (glow limited to 6px), scrubbing (frame number shows at the handle).
- **Numeric scrub field**: drag horizontally on the label to change value (Shift = x10 coarse, Alt = x0.1 fine); click to type; arrow keys step; units shown inline. States: idle, scrubbing (cursor hidden, delta shown), invalid (outline plus message, value reverts on blur).
- **Slider**: ticks at the step interval, thumb 12px, range label ends, double-click resets to default.
- **Contextual panel**: inspector content swaps by selection (clip, track, none, multiple); with none selected it shows project settings, not an empty state.
- **Splitter**: same behavior as the other panels (1px seam, 6px hit area), double-click to reset, snap to 50% and 66%.

Drag and snapping behavior:
- `pointerdown` captures the pointer; position is computed from `pointermove` deltas in frames, not pixels, so zoom changes are consistent.
- Snap targets: other clip edges, playhead, markers, ruler seconds, within 8px; magnet strength decays, and Alt disables snapping.
- Inertia: on release at speed above 0.4 px/ms the clip continues with friction 0.92 per frame for at most 180ms, then settles to the nearest snap target within 24px; otherwise stays where released.
- Auto-scroll when dragging within 40px of the timeline edge, speed ramps from 0 to 12px/frame.
- Escape during a drag restores the original position; all drags commit as one undoable operation.

Token highlights:

```css
:root {
  --space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
  --radius-1: 3px; --radius-2: 6px;
  --n-0: #15161b; --n-1: #1c1d23; --n-2: #24262d; --n-3: #2f323a; --n-4: #444853;
  --txt-1: #e4e5ea; --txt-2: #9a9ea9; --txt-3: #6c707b;
  --violet: #8b7cf6;                         /* selection, playhead, handles */
  --track-v: #5aa3b8; --track-a: #7fb069; --track-t: #c29a5b;   /* 3px stripes */
  --track-h: 24px; --ruler-h: 20px; --seam-hit: 6px;
  --ease-glide: cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

Typography scale: panel header 11/14 Work Sans 600 uppercase tracking 0.05em; control label 12/16 Work Sans 500; value 12/16 IBM Plex Mono with tabular figures; timecode 14/16 IBM Plex Mono 500; clip name 11/14 Work Sans clipped with ellipsis; tooltips 11/14. Nothing in the editing chrome is above 14px except the viewer overlay text.

Framework notes: timeline is a canvas (clips, waveform, ruler) with a DOM overlay for handles and focus so accessibility and hit testing stay simple; viewer is a video/canvas element. React: state in an external store (zustand-style) keyed by clip id so dragging one clip re-renders only that clip layer; drag logic in a `useDrag` hook built on pointer events with `setPointerCapture`. Tailwind: tokens as CSS variables mapped in `theme.extend.colors`; use `touch-action: none` on draggable surfaces and `cursor` utilities for each tool.

## 4. Motion decisions

- Clip drag: follows the pointer with no easing; shadow-free lift is a 1px translate and 70% ghost, 90ms.
- Snap: when the dragged edge is within 8px of a target, the clip eases to the target over 120ms `--ease-glide`; the guide line pulses once (opacity 1 to 0.4, 200ms).
- Inertia release: friction 0.92 per frame (frame-rate normalized) capped at 180ms, ends with a 100ms settle to a snap target.
- Workspace tab change: panels glide to their new rectangles via FLIP in 220ms `--ease-glide`; contents cross-fade 120ms.
- Inspector context swap: 140ms cross-fade, no height animation to keep the controls stable.
- Scrub preview: viewer updates at most once per animation frame; thumbnails are used while scrubbing fast, full frames on pause (after 100ms idle).
- Procedural: waveform peaks and thumbnail strips are generated in a worker, drawn progressively per visible tile; only the visible range plus one viewport of margin is rendered. Playhead glow runs only during playback (CSS opacity on a pseudo-element, no JS loop); pauses when the tab is hidden or playback stops.
- Reduced motion: drag still follows the pointer; inertia, snap pulse, and glides are disabled and snap becomes an immediate position jump; panel changes are instant.

## 5. Why it works

- Editing is long, repetitive hand work; making drag, scrub, and snap feel physical reduces effort and error far more than visual flourish.
- The frame-tick motif unifies the ruler, sliders, and scrub fields, so the interface speaks one measurement language.
- Neutral chrome with one violet voice keeps footage color judgment accurate, which is a functional requirement.
- Contextual panels keep the workspace large and relevant instead of showing every parameter always.
- Deliberately avoids: sidebar plus card grid, large rounded buttons with icons and labels, gradient accent buttons, decorative glow on controls, modal dialogs for parameters, and onboarding hero content in the workspace.

## 6. Originality check

1. Could another product's name replace "Reelhouse" with no visual change? No: the frame-tick language and notched clip ends are tied to timeline editing.
2. Motif specific to the concept? Yes, the frame tick across ruler, sliders, and scrub fields.
3. Palette used with intent? Yes, indigo-violet restricted to selection and playhead on a cool neutral ladder.
4. Layout not sidebar plus card grid? Yes, a split workspace with a spanning timeline.
5. Type voice distinct? Yes, Work Sans compact labels with IBM Plex Mono values.
6. Motion matched to personality? Yes, smooth preset with pointer-driven inertia and brief snap pulses.

## 7. Verification notes

- 1440x900: viewer and timeline together occupy at least 70% of area; at least 4 tracks visible; inspector shows labeled, unit-bearing controls.
- 1280x800: bin folded into a tab; timeline still shows 4 tracks; no panel below its min size.
- 768x1024: inspector appears as a contextual bottom sheet tied to selection; timeline pinch-zoom and drag work with touch pointer events.
- 390x844: viewer plus simplified timeline in trim mode; unsupported edit actions clearly labeled; touch targets 44px for transport.
- Test with pointer events on mouse, pen, and touch; confirm `touch-action` prevents page scroll while dragging; test keyboard clip move (Arrow = 1 frame, Shift+Arrow = 10 frames) and undo of a full drag.
- Check drag performance with 200 clips; frame time should stay under 16ms during drag.
- `screenshots/` placeholder: populate by running the benchmark; do not fabricate.
