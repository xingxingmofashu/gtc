# AGENTS.md

## Repo purpose

`gtc` is a Bun CLI for Ghostty config management. Real command set is `list`, `set`, `remove`, and `theme` subcommands (`theme list|install|remove`).

## Commands that matter

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run fmt
bun run fmt:fix
bun run build
bun run build -- --single
bun run build -- --single --baseline
```

- Pre-commit hook runs: `bun run lint && bun run typecheck && bun run fmt` (same order).
- `typecheck` is **not** `tsc`; it runs `oxlint --type-aware`.
- There is no test suite (`bun test` has nothing to run).

## Verification shortcuts

```bash
bun run src/index.ts list
bun run src/index.ts list --search font
bun run src/index.ts set
bun run src/index.ts remove font-size
bun run src/index.ts theme list
```

## High-signal gotchas

- `scripts/build.ts` always does `rm -rf dist` before building.
- `--single` builds only the current OS/arch and skips musl/baseline variants by default; add `--baseline` if you explicitly need baseline on host.
- Published build targets are Linux + macOS only (no Windows target in `allTargets`).
- `gtc set` is interactive-only via `@clack/prompts`; no positional key/value mode.
- Valid config keys are a static allowlist in `src/config/constants.ts`; new Ghostty keys must be added there.
- Config path is hardcoded to `~/.config/ghostty/config` in `src/config/index.ts`.
- Theme directory is hardcoded to `~/.config/ghostty/themes`; theme commands depend on that path existing.

## Architecture map

- `src/index.ts`: yargs entrypoint, command wiring, global error handling.
- `src/config/index.ts`: core file I/O + env-controlled theme API/cache paths.
- `src/theme/index.ts`: remote theme fetch/cache (`~/.config/gtc/cache/themes.json`) + local theme install/remove.
- `src/cli/commands/*.ts`: command handlers; `src/cli/commands/theme/index.ts` requires a subcommand (`.demandCommand()`).
- `scripts/build.ts`: Bun cross-compile pipeline using `Bun.build({ compile: true })`.
- `bin/gtc`: intentionally CJS shim (`require`) that resolves platform binary packages.

## Env vars used by runtime

- `GTC_BIN_PATH`: force `bin/gtc` to execute a specific binary.
- `GTC_THEME_BASE_URL`: override theme site base URL.
- `GTC_THEME_API_URL`: override theme API endpoint.
