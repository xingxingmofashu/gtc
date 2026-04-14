# AGENTS.md

## What this repo is

`gtc` — a Bun CLI tool for managing the Ghostty terminal emulator config file (`~/.config/ghostty/config`). Provides `list`, `set`, and `remove` commands. Built into self-contained native binaries for 8 platform targets via `Bun.build({ compile: true })`.

## Developer commands

```bash
bun install                       # install deps
bun run dev                       # run from source (no build step needed)
bun run typecheck                 # tsc --noEmit
bun run build                     # cross-compile all 8 platform targets (wipes dist/ first)
bun run build -- --single         # build only the host platform (fast)
bunx prettier --write .           # format (no npm script exists for this)
```

No test suite. No linter. Manual verification only:

```bash
bun run src/index.ts list
bun run src/index.ts list --search font
bun run src/index.ts set
bun run src/index.ts remove font-size
```

## Key gotchas

- **No tests.** `bun test` will find nothing. Do not look for test files.
- **`bun run build` always runs `rm -rf dist` first.** Every build is a full clean rebuild. Use `--single` to avoid rebuilding all 8 targets.
- **`dist/` is committed to git** despite `.gitignore` listing it. Newly generated dist files may not be staged automatically — force-add if needed.
- **No semicolons.** Prettier config (`package.json` → `"prettier"`) sets `"semi": false`. Line width is 120.
- **`gtc set` is interactive-only.** Uses `@clack/prompts` autocomplete — cannot be scripted with positional args.
- **Config key validation uses a static list.** `src/config/constants.ts` has a hardcoded `CONFIGURATIONS` array (~180 entries). New Ghostty config keys must be manually added there or `set` will reject them.
- **`bin/gtc` shim is CJS** (`require()`), intentionally, for npm bin compatibility. The rest of the project is ESM (`"type": "module"`).
- **Build target naming:** `Bun.build()` receives `bun-<os>-<arch>` strings; output directories are named `gtc-<os>-<arch>`. The substitution in `scripts/build.ts` is `name.replace(pkg.name, "bun")` (replaces `gtc` with `bun`).
- **No Windows binaries are produced.** The `allTargets` array in `scripts/build.ts` contains no `win32` entries.
- **TypeScript 6.0.2** (bleeding-edge). Some type behaviors differ from TS 5.x.

## Architecture

```
src/index.ts              # CLI entrypoint (yargs + top-level await)
src/cli/commands/         # list.ts, set.ts, remove.ts
src/cli/utils/            # cmd.ts (yargs type wrapper), ui.ts (ANSI colors)
src/config/index.ts       # useConfig() — reads/writes ~/.config/ghostty/config
src/config/constants.ts   # CONFIGURATIONS: all valid Ghostty keys + doc URLs
scripts/build.ts          # Bun cross-compile script
bin/gtc                   # CJS shim for npm distribution
dist/                     # Compiled binaries (committed)
```

Config file path is hardcoded — no override flag exists.
