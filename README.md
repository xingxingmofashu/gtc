# GTC

A CLI tool for managing your [Ghostty](https://ghostty.org) terminal config file (`~/.config/ghostty/config`).

## Commands

| Command | Description |
|---|---|
| `gtc list` | List all active config entries |
| `gtc list --search <key>` | Filter entries by key substring |
| `gtc set` | Interactively pick a key and set its value |
| `gtc remove <key>` | Remove a config entry by key name |

`gtc set` uses an autocomplete prompt — it cannot be scripted non-interactively.

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/xingxingmofashu/gtc/main/install | bash
```

Install a specific version:

```sh
curl -fsSL https://raw.githubusercontent.com/xingxingmofashu/gtc/main/install | bash -s -- --version 0.1.0
```

### Supported platforms

| Platform | Arch |
|---|---|
| macOS | arm64, x64 |
| Linux (glibc) | arm64, x64, x64-baseline |
| Linux (musl) | arm64, x64, x64-baseline |

Windows is not supported.

## Development

```bash
bun install          # install deps
bun run dev          # run from source
bun run typecheck    # type-check without building
bun run build        # compile all 8 platform targets (wipes dist/ first)
bun run build -- --single   # compile host platform only (faster)
bunx prettier --write .     # format
```

Manual verification (no test suite):

```bash
bun run src/index.ts list
bun run src/index.ts list --search font
bun run src/index.ts set
bun run src/index.ts remove font-size
```

## Config key list

Valid keys are defined in `src/config/constants.ts` (~180 entries). If Ghostty adds new config options they must be added there manually — there is no auto-sync.
