# Artisan UI

A Claude Code plugin that turns vague interface requests into deliberate, distinctive, production-quality applications. It teaches Claude a designer's process, not a pile of CSS snippets.

**Foundation:** Design Director + persistent design profile (`.artisan/`) + screenshot-based visual QA loop.

## Install

```
/plugin marketplace add ShrekAstley/artisan-ui
/plugin install artisan-ui@artisan-ui
```

Or try it locally without installing: `claude --plugin-dir ./artisan-ui`.

## Commands

| Command | Purpose |
|---|---|
| `/artisan-ui:design` | Adaptive interview, design directions, approved spec |
| `/artisan-ui:build` | Implement the agreed design, then verify |
| `/artisan-ui:refine` | Improve an existing UI without redesigning it |
| `/artisan-ui:audit` | Score the UI with evidence at 4 viewports |

The `artisan-ui` skill also activates automatically when you ask to create or substantially redesign an interface.

## Layout

- `skills/artisan-ui/SKILL.md`: rules and phase map (loads other files only when needed)
- `references/`: philosophy, anti-AI aesthetics, layout, color, typography, motion, responsive, accessibility
- `workflows/`: discovery, interview, exploration, implementation, visual audit
- `examples/`: four benchmark designs (dashboard, desktop app, editorial, creative tool)
- `templates/`: design profile and brief
- `agents/`: design-director, ux-architect, typography-color-specialist, motion-engineer, frontend-engineer, visual-qa
- `hooks/`: on session start, surfaces the project's design profile if one exists

## Persistent spec

```
.artisan/design-profile.json  design-decisions.md  tokens/*.json  references/inspiration.md  audits/latest-audit.md
```

## Benchmark

Run five unrelated app concepts through `/artisan-ui:design` and `/artisan-ui:build`. They should look like five independently designed products. The `examples/` screenshots folders are to be populated from real runs.

## License

MIT
