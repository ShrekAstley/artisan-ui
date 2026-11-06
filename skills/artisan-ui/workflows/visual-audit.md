# Workflow: Visual Audit (Phases 8, 10)
Load when: an implementation stage is complete and needs verification, after a refinement round, before declaring the work done, or when the user asks "how does it look / is it good".

## Hard rule
**Run the app and inspect rendered screenshots. Never claim visual verification otherwise.** Reading code, diffs or CSS is not seeing the UI. If you could not render and view the app, say so explicitly, perform code-level checks only, and cap claims (see "If screenshot tools are unavailable").

## Goal
Judge the result against the spec with evidence, score it, fix, and re-check. Output `.artisan/audits/latest-audit.md`. Phase 8 = first full audit; Phase 10 = final audit after refinement.

## 1. Start the app
1. Use the run command from Discovery (`dev`/`start`); run it in the background (Bash `run_in_background`). Wait until the port responds (poll with a short check command, do not sleep-loop blindly); note the URL.
2. If it fails to start, read the log, fix only what you broke; if pre-existing or env-related (missing keys/backend), state it and use the best fallback (mock data, static build via `npm run build` + `npx serve`/`vite preview`).
3. Never kill a process you did not start. Stop your server when finished.
4. Use a clean browser profile/incognito state to avoid cached or extension-affected results where tooling allows.

## 2. Pick browser tooling (first available, in this order)
| Tool | Use |
|---|---|
| Claude Browser pane (`preview_start` / `navigate`, `computer` screenshot, `resize_window`, `read_console_messages`, `read_page`, `find`) | preferred for localhost; supports viewport emulation (`resize_window` presets/custom), console and network reads, accessibility tree, colorScheme emulation |
| Claude in Chrome (`mcp__claude-in-chrome__*`: `navigate`, `computer`, `resize_window`, `read_console_messages`, `javascript_tool`) | alternative; needs the extension connected |
| Playwright via Bash (`npx playwright` with a small script: `page.setViewportSize`, `page.screenshot`, `page.emulateMedia({ reducedMotion: 'reduce', colorScheme })`, `page.on('console')`) | fallback; only if installed or the user allows installation; write scripts to a temp/scratch folder, not the project |
| None available | follow "If screenshot tools are unavailable" |

Tip: load deferred browser tools (ToolSearch) in one call before starting. After taking each screenshot, actually look at it (view the image) and write down observations; do not just save files.

## 3. Capture matrix
Viewports (resize, reload if needed, screenshot):
- **1440x900** (desktop wide)
- **1280x800** (desktop common)
- **768x1024** (tablet portrait)
- **390x844** (phone)

Screens: every key screen from Discovery at all four sizes; secondary screens at 1440 and 390 at minimum.
States (at 1440 and 390 for key screens): default, hover on primary controls/rows, keyboard focus (Tab to the main controls and screenshot), active/pressed if visible, empty (clear data or fresh state), loading (throttle or inspect), error (invalid input, failed request), long content/overflow, open overlays (dialog, menu, toast), selected/expanded.
Themes: both light and dark if the spec says "both".
Save screenshots in a scratch/temp folder outside the project (or `.artisan/audits/screens/` only if the user wants them kept); reference them by path in the audit.

## 4. Technical probes (in the browser)
- **Console**: read console errors/warnings on load and during interaction; any uncaught error or failed resource is a finding.
- **Network**: failed requests (404 fonts/assets), oversized assets, many font files.
- **Keyboard walkthrough**: Tab/Shift+Tab through each key screen: order matches visual order, focus always visible, no traps, Enter/Space activate, Escape closes overlays and returns focus, skip link works, shortcuts do not conflict.
- **Reduced motion**: emulate `prefers-reduced-motion: reduce` (Playwright `emulateMedia`, or DevTools rendering emulation via JS/tooling); confirm movement is removed or minimal and functionality remains.
- **Zoom/text scaling**: 200% zoom or large text: no clipped content or horizontal scroll (except data tables/code).
- **Contrast**: sample key text/UI pairs; compute ratios from tokens (`references/accessibility.md` for thresholds); automated check via `javascript_tool` (computed styles) or axe-core if already available. Do not add dependencies just for the audit.
- **Layout**: no horizontal scroll at 390 and 768; no overlap/clipping; touch targets measured.
- **Performance**: quick sanity (page weight, number of font files, long tasks/jank during a key animation, Lighthouse only if already installed); record numbers you actually measured.
- **Token adherence**: Grep for stray values (see `workflows/implementation.md` Consistency checks).

## 5. Required checks
| Area | Check | Evidence to record |
|---|---|---|
| Visual identity | Motif visible on key screens; originality test passes (`references/anti-ai-aesthetics.md`); matches profile | screenshots, which tells found |
| Hierarchy | One focal point per screen; squint test; primary action clear | screen refs |
| Typography | Scale used, measure, line-height, numerals, fallbacks, no FOUT jumps | sizes sampled, issues |
| Color | Only tokens, accent used with meaning, status colors, both themes | contrast numbers, strays |
| Spacing | Scale only, rhythm varied, alignment on shared edges | specific misalignments |
| Layout | Composition per spec, grid, density, no template feel | screen refs |
| Animation | Matches preset; purposeful; interruptible; reduced-motion honored | what was observed, how |
| Responsiveness | 4 viewports OK, transformations intentional, touch targets | per-viewport notes |
| Accessibility | keyboard, focus, labels, contrast, semantics, errors, zoom | probe results |
| Functionality | Core flows still work (click-through); preserved routes/state; tests/build | commands run and results |
| Performance | No jank, sane weight, no console errors | measurements |

## 6. Critical failures (any one blocks acceptance, regardless of score)
- **Accessibility:** keyboard trap; focus not visible on interactive controls; text contrast below AA on primary content; form inputs without labels; essential information conveyed by color only; reduced-motion ignored for large/looping motion; touch targets unusable on phone.
- **Functionality:** a pre-existing working flow broken or removed; build/typecheck/test regression caused by the changes; unhandled runtime/console error on key screens; lost data or state.
- **Rendering:** content clipped/overlapping/unreachable at any required viewport; horizontal page scroll on phone; blank or broken screen; missing fonts causing illegible fallback; assets 404ing on key screens; dark/light theme unreadable.
- **Integrity:** claimed verification without inspection; invented metrics/content presented as real.

## 7. Scoring rubric (100 points)
| Criterion | Weight |
|---|---|
| Visual identity and originality | 15 |
| Layout and composition | 15 |
| Typography | 10 |
| Color coherence | 10 |
| Spacing and consistency | 10 |
| Motion and interactions | 10 |
| Functionality | 10 |
| Accessibility | 10 |
| Responsiveness | 5 |
| Performance | 5 |
| **Total** | **100** |

Scoring method:
- For each criterion, score 0-weight in whole numbers. Anchors: 90-100% of weight = excellent, specific, nothing notable to fix; 75-89% = good with minor issues; 50-74% = acceptable but visibly generic/inconsistent; below 50% = failing.
- Every score needs: evidence (screenshot/probe/grep result) and the specific problems found. A score with no evidence is invalid.
- The score is **a judgment, not an objective metric**. Say so in the audit. Do not present it with false precision; do not average away critical failures.
- Be harsh on generic tells and token violations; be fair on subjective taste (record the reasoning, not just the verdict).
- **Acceptance threshold: 85/100 and no critical failures.** 85+ with a critical failure = not accepted.

## 8. Output template: `.artisan/audits/latest-audit.md`
Overwrite the file each audit; keep a one-line history list at the bottom.

```
# Visual Audit - <Product name>
Date: <YYYY-MM-DD> | Phase: <8|10> | Iteration: <n of 3>
Verification method: <tool used, viewports, states covered> | Not verified: <anything not inspected>

## Result
Score: <n>/100 (judgment, not an objective metric) | Threshold 85 | Critical failures: <none | list>
Verdict: <ACCEPTED | NOT ACCEPTED - reason>

## Scores
| Criterion | Score | Weight | Evidence | Problems |
|---|---|---|---|---|
| Visual identity and originality | | 15 | <screens/tells> | |
| Layout and composition | | 15 | | |
| Typography | | 10 | | |
| Color coherence | | 10 | | |
| Spacing and consistency | | 10 | | |
| Motion and interactions | | 10 | | |
| Functionality | | 10 | <build/test/click-through> | |
| Accessibility | | 10 | <keyboard/contrast/reduced-motion> | |
| Responsiveness | | 5 | <viewports> | |
| Performance | | 5 | <measurements> | |

## Critical failures
- <none | description, screen, viewport, fix>

## Prioritized fixes
1. [P0 critical] ...
2. [P1 high score impact] ...
3. [P2 polish] ...

## Fix loop history
| Iteration | Score | Fixed | Remaining |
|---|---|---|---|

## Remaining limitations
- <known issues, unverified areas, deliberate trade-offs>

## Screenshots
- <path> - <screen/viewport/state>
```

## 9. Fix loop (max 3 iterations)
1. Write the prioritized fixes (P0 critical first, then highest weighted gain per effort).
2. Apply via `workflows/implementation.md` Phase 9 (batches, build/tests green after each).
3. Re-screenshot the affected screens and viewports (not necessarily all, but always re-check what changed plus the key screens); re-run the relevant probes.
4. Re-score every criterion honestly (scores may go down if fixes caused regressions); update the audit file and history table.
5. Stop when accepted, or after **3 iterations**: document remaining limitations in the audit and tell the user what is left and why, with recommended next steps. Do not loop silently past 3.
6. Update `.artisan/design-profile.json` `status`: `{ "phase": "audit" | "done", "score": <n>, "updated": "<date>" }`; log notable outcomes in `.artisan/design-decisions.md`.
7. Per the project's testing philosophy, re-test only what changed in each iteration; run the full suite once before declaring done.

## If screenshot tools are unavailable
1. State explicitly in the audit and in your message: "I could not render or screenshot the app; visual quality is unverified."
2. Perform code-level checks only: token adherence (greps), contrast math from token values, semantic HTML and ARIA review, focus styles present, `prefers-reduced-motion` handling present, responsive CSS (breakpoints, container queries) present, build/typecheck/tests, console-error potential (obvious runtime issues).
3. **Cap claims:** no statements like "looks great", "verified visually", or "pixel-perfect". Score only code-evidenced criteria; mark visual criteria (identity, layout, typography feel, color feel, motion feel) as "not assessed" and do not give a total or acceptance verdict (use "Provisional: cannot accept without rendering").
4. Give the user the exact command to run the app and a short manual checklist (viewports, keyboard pass, reduced motion) to verify themselves, and offer to finish the audit with their screenshots.

## Final reporting to the user
Short: score and verdict (stated as a judgment), what was verified and how, critical failures if any, top remaining issues, where the audit lives (`.artisan/audits/latest-audit.md`), and what you did not verify. Do not over-claim; do not paste the whole audit.

## Guardrails
- Do not modify app code during the audit itself; fixes happen in the fix loop step.
- Do not inflate scores to reach 85; do not deflate to look rigorous; justify with evidence.
- Do not skip keyboard and reduced-motion probes; they are the most commonly faked checks.
- Do not leave dev servers or temp scripts running or in the project tree.
- Never claim verification of a state (hover, error, empty) you did not trigger and see.

## Scoring anchors (use these; self-scores run high without them)
Per criterion, score against the fraction of its weight: **100%** only if you viewed it rendered at all four viewports and found no defect; **80%** minor defects, all viewed; **60%** noticeable defects or one viewport/state not viewed; **40%** major defects or only code-level evidence; **0-20%** broken or absent. Any criterion you could not view caps at 60%. Unrun interactions cap Functionality at 60%. A score above 85 requires screenshots of every viewport plus every claimed state.

## Windows / headless Edge notes
- Headless Edge clamps `--window-size` width to ~500px. For 390 wide, load a tiny wrapper page containing `<iframe src="file:///.../index.html" style="width:390px;height:844px;border:0">` and screenshot that at >=600px wide.
- Add `--force-device-scale-factor=1` or DPI scaling shrinks the effective viewport.
- Use a throwaway profile: `--user-data-dir=<temp> --headless=new --disable-gpu --screenshot=<png> --window-size=W,H file:///...`.
- Headless screenshots cannot test hover, drag, or keyboard. Use the browser pane tools or Playwright for those; otherwise mark them unverified.
