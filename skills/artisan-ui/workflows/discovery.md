# Workflow: Discovery (Phase 1)
Load when: starting any Artisan UI task on a project (new or existing), before any design question or code change.

## Goal
Learn what the project is, what already exists, what must not break, and whether a design direction already exists. Output a Discovery Summary. Do not design or implement in this phase.

## Step 0 - Resume check (always first)
1. Glob `.artisan/design-profile.json` at the project root.
2. If it exists: read it, plus `.artisan/design-decisions.md` (tail only) and `status` inside the profile. **Resume, do not re-interview.**
   - Compare the profile against the current request. Ask only what is missing (empty fields) or changed (user wants a new direction, new screen type, new platform).
   - Jump to the phase named in `status.phase`: interview gaps -> `workflows/design-interview.md`; spec incomplete -> `workflows/design-exploration.md`; spec complete -> `workflows/implementation.md`; implemented -> `workflows/visual-audit.md`.
   - Still run steps 1-6 below, but lightly (confirm nothing drifted: new routes, new styling system).
3. If absent: run the full discovery below. Also check for design hints elsewhere: `DESIGN.md`, `docs/design*`, Figma links in README, `tailwind.config.*`, `theme.*`, `tokens.*`.

## Step 1 - Detect stack
Use Glob/Grep/Read in this order; stop when you have the answer. Never dump whole files; read the relevant 30-60 lines.

| Question | Where to look |
|---|---|
| Framework / build tool | `package.json` (dependencies, scripts), `vite.config.*`, `next.config.*`, `astro.config.*`, `svelte.config.*`, `nuxt.config.*`; non-JS: `pubspec.yaml`, `Cargo.toml` (Tauri), `*.csproj`, `project.godot`, `Package.swift` |
| Language | `tsconfig.json`, file extensions |
| Styling system | `tailwind.config.*`, `postcss.config.*`, `*.module.css`, `styled-components`/`@emotion` in deps, `*.scss`, `vanilla-extract`, global `index.css`/`globals.css` |
| Component libraries | deps: `@radix-ui/*`, `shadcn` (components.json), `@mui/*`, `antd`, `@chakra-ui/*`, `@mantine/*`, `headlessui`, `daisyui` |
| Routes / screens | `src/pages`, `app/`, `src/routes`, router config; Grep `createBrowserRouter|<Route|path:` |
| State management | deps: `redux`, `zustand`, `jotai`, `pinia`, `@tanstack/query`, context usage |
| Existing tokens | Grep `--color-|--space-|:root|theme\s*=|extend:\s*\{` ; theme files |
| Design conventions | naming of classes, `cn()`/`clsx` helpers, `components/ui` folder, Storybook (`.storybook/`) |
| Assets | `public/`, `src/assets`, fonts in `@font-face` or `next/font`, icon set deps (`lucide-react`, `heroicons`) |
| Motion libs already installed | `framer-motion`/`motion`, `gsap`, `@react-spring/*`, `lottie`, `auto-animate`; otherwise note "CSS only" |

## Step 2 - Screens inventory
List every user-facing screen/view with: route or entry file, purpose in one phrase, status (real / placeholder / stub), data source (real API / mock / none). Mark the 2-3 **key screens** (the ones that define the product). Cap at about 15 lines; summarize the rest as a group.

## Step 3 - Run command and app health
1. Read `package.json` `scripts` (or equivalent): find `dev`, `start`, `build`, `test`, `lint`, `typecheck`.
2. Check dependencies are installed (`node_modules` present); if not, ask before installing (do not install silently if a lockfile conflict is likely).
3. Try a build or typecheck once (`npm run build` / `tsc --noEmit`) to get the baseline: **record pre-existing failures** so you never get blamed for or hide them.
4. Try starting the dev server in the background (Bash `run_in_background`); note the URL/port, and whether it renders without console errors. If it cannot run (missing env, backend, keys), state exactly why and the fallback (static mock, partial run).
5. Note the existing test suite (command, pass/fail baseline).

## Step 4 - What must be preserved
Identify and list explicitly. Design work must not change these:
- Routes and URL structure, deep links.
- State management shape, stores, selectors, context providers.
- Business logic, API calls, data models, validation.
- Auth flows, permissions, feature flags.
- Accessibility features that already work (aria, focus management, keyboard shortcuts).
- Public component APIs used by many call sites.
- Existing content and copy that carries meaning (legal text, labels used in tests).
- Existing test selectors (`data-testid`, roles, labels).

Also capture what is **replaceable**: raw CSS, visual-only wrappers, placeholder content, default theme.

## Step 5 - Existing visual state
- Take a screenshot of 1-2 key screens if the app runs (see `workflows/visual-audit.md` for tooling) to anchor the "before".
- Note the most visible generic tells (see `references/anti-ai-aesthetics.md`) only as observations; do not load the full file now.
- Note inconsistencies: duplicate colors, many radius values, mixed fonts, hardcoded px (Grep counts are enough: `#[0-9a-fA-F]{3,6}` count, `border-radius` distinct values).

## Step 6 - Constraints and context
Capture anything that limits design: target platforms/browsers, device targets, brand guidelines, existing logo/colors the user mandates, performance budget, bundle size concerns, accessibility requirements (WCAG level), deadline/scope, "do not touch" areas, license constraints on fonts/assets, offline requirements.

## Output: Discovery Summary
Present this to the user (concise, under 40 lines) and keep a copy in the conversation. Do not write it to disk unless asked; the durable record is `.artisan/design-profile.json` later.

```
# Discovery Summary
Project: <name> | Type: <web app / site / desktop (Tauri) / mobile / game UI>
Stack: <framework + version>, <language>, <styling>, <component lib>, <state>, <router>
Run: dev=<cmd> (<url>) | build=<cmd> | test=<cmd> | Baseline: <build ok/fails: why>, <tests n pass/m fail>, app renders: <yes/no/why>
Existing design profile: <none | found: name, phase, score, updated>
Screens (key marked *): 
  - *<route> - <purpose> - <real/placeholder>
  - <route> - ...
Existing tokens/conventions: <none / CSS vars in file / Tailwind theme extended / ...>; inconsistencies: <e.g., 14 distinct colors, 6 radii>
Must preserve: <routes, state shape, API layer, tests selectors, ...>
Free to change: <raw CSS, placeholder visuals, ...>
Installed motion/UI deps: <...>
Constraints: <platform, a11y level, brand, perf, ...>
Gaps / unknowns: <what I still need from the user>
Recommended path: <quick | standard | deep interview> because <reason>; next: workflows/design-interview.md
```

## Choosing the interview depth (feeds Phase 2)
- **quick** (up to 4 questions): small project, user gave clear direction, or existing profile only needs a delta.
- **standard**: typical app with unclear visual direction.
- **deep**: brand-critical, multi-product, large rebuild, or the user explicitly wants to explore.
State the recommendation; the user can override.

## Tool usage hints
- **Glob** for file discovery (`**/package.json`, `**/tailwind.config.*`, `src/**/routes*`); exclude `node_modules`, `dist`, `.next`.
- **Grep** with `output_mode: files_with_matches` or `count` first; read content only for the few hits that matter. Use `head_limit`.
- **Read** with `offset`/`limit`; never read lockfiles, build output, minified files, or large JSON/asset files.
- **Bash** for running scripts (`npm run build`, dev server in background). Do not run destructive commands; do not install global packages.
- If a graphify index exists (`graphify-out/`), query it before scanning files.
- Parallelize independent reads (package.json, config files, directory listing) in one message.

## Guardrails
- Do not modify project files in this phase (the only allowed write is none).
- Do not start the interview before the summary is produced.
- Do not assume the app runs; verify, or state it does not.
- Do not invent screens or features that are not in the repo; mark unknowns as unknown.
- If the repo is empty/new, say so, list what the user must decide (stack choice), and skip to the interview with stack questions in the `technical` stage.
- Respect the project's package manager (lockfile: `pnpm-lock.yaml` -> pnpm, `yarn.lock` -> yarn, `package-lock.json` -> npm, `bun.lockb` -> bun).

## Exit criteria
- Discovery Summary delivered.
- Resume decision made (resume / new profile).
- Preservation list agreed (or no objections raised).
- Next phase identified: `workflows/design-interview.md` (or the resume target).
