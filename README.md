# GTC

A CLI tool for managing your [Ghostty](https://ghostty.org) terminal config file (`~/.config/ghostty/config`).

- Read, write, and remove config entries without manually editing the file
- Interactive autocomplete for all ~180 valid Ghostty config keys
- Theme browser — preview and apply themes from the local Ghostty themes directory
- Cross-compiled to native binaries for macOS and Linux (no Node.js or Bun required at runtime)

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/xingxingmofashu/gtc/main/install | bash
```

Install a specific version:

```sh
curl -fsSL https://raw.githubusercontent.com/xingxingmofashu/gtc/main/install | bash -s -- --version 0.2.2
```

### Supported platforms

| Platform | Arch |
|---|---|
| macOS | arm64, x64 |
| Linux (glibc) | arm64, x64, x64-baseline |
| Linux (musl) | arm64, x64, x64-baseline |

Windows is not supported.

---

## Commands

### `gtc list`

List all active entries in `~/.config/ghostty/config`. Comments and blank lines are excluded.

```sh
gtc list
gtc ls               # alias
```

**Options**

| Flag | Description |
|---|---|
| `--search <key>` | Filter entries by key substring (case-sensitive) |

**Examples**

```sh
gtc list                     # show all config entries
gtc list --search font       # show only entries whose key contains "font"
gtc list --search background # show background-related entries
```

---

### `gtc set`

Interactively set a config key to a new value. Uses an autocomplete prompt to browse all ~180 valid Ghostty keys. Pressing `Enter` writes the value to the config file; reloading Ghostty applies the change.

```sh
gtc set
```

> `gtc set` is interactive-only. It cannot be scripted with positional arguments.

**Flow**

1. An autocomplete prompt lists all valid keys (with documentation URLs as hints).
2. After selecting a key, a second prompt asks for the value.
3. If the key is `theme`, a second autocomplete lists themes installed in `~/.config/ghostty/themes/` instead of a free-text input.
4. The entry is written to the config file (added if absent, updated in-place if present).

---

### `gtc remove <name>`

Remove a config entry by key name. Errors if the key is not currently present in the file.

```sh
gtc remove <name>
gtc rm <name>        # alias
```

**Arguments**

| Argument | Description |
|---|---|
| `name` | The exact config key to remove (required) |

**Examples**

```sh
gtc remove font-size
gtc rm background-color
```

---

### `gtc theme`

Browse and apply Ghostty themes from `~/.config/ghostty/themes/`.

```sh
gtc theme
```

---

## Config file

All commands operate on `~/.config/ghostty/config`. The path is fixed — there is no override flag.

The file is parsed line-by-line. Each entry must follow the `key = value` format. Lines beginning with `#` are treated as comments and are ignored by `gtc list`. Blank lines are also ignored.

Example config file:

```
font-family = JetBrains Mono
font-size = 14
theme = GruvboxDark
background-opacity = 0.95
```

---

## Valid config keys

Valid keys are defined in `src/config/constants.ts` (~180 entries). Each entry pairs a key with a link to its official Ghostty documentation page. `gtc set` will reject any key that is not in this list.

If Ghostty adds new config options they must be added to `src/config/constants.ts` manually — there is no auto-sync.

---

## Environment variables

| Variable | Description |
|---|---|
| `GTC_BIN_PATH` | Override the path to the gtc binary used by the `bin/gtc` shim |
| `GTC_THEME_BASE_URL` | Override the base URL for the theme service (default: `https://ghostty-style.vercel.app`) |
| `GTC_THEME_API_URL` | Override the theme API endpoint (default: `https://ghostty-style.vercel.app/api/configs`) |

---

## Development

**Prerequisites:** [Bun](https://bun.sh) v1.x

```bash
bun install                      # install dependencies
bun run dev                      # run from source (no build step needed)
bun run typecheck                # tsc --noEmit — type-check without emitting
bun run build                    # cross-compile all 8 platform targets (wipes dist/ first)
bun run build -- --single        # compile host platform only (faster iteration)
bunx prettier --write .          # format all files
```

Manual verification (no test suite):

```bash
bun run src/index.ts list
bun run src/index.ts list --search font
bun run src/index.ts set
bun run src/index.ts remove font-size
bun run src/index.ts theme
```

### Build targets

`bun run build` produces 8 self-contained native binaries under `dist/`:

| Target directory | OS | Arch | ABI |
|---|---|---|---|
| `gtc-linux-arm64` | Linux | arm64 | glibc |
| `gtc-linux-x64` | Linux | x64 | glibc |
| `gtc-linux-x64-baseline` | Linux | x64 (no AVX2) | glibc |
| `gtc-linux-arm64-musl` | Linux | arm64 | musl |
| `gtc-linux-x64-musl` | Linux | x64 | musl |
| `gtc-linux-x64-baseline-musl` | Linux | x64 (no AVX2) | musl |
| `gtc-darwin-arm64` | macOS | arm64 (Apple Silicon) | — |
| `gtc-darwin-x64` | macOS | x64 (Intel) | — |

Each target directory contains `bin/gtc` (the binary) and a `package.json` with `os`/`cpu` fields for optional package managers to select the correct variant.

> `dist/` is committed to the repository. Newly built binaries may need to be force-added with `git add -f dist/`.

### Project structure

```
src/index.ts              # CLI entrypoint — wires yargs + registers all commands
src/cli/commands/
  list.ts                 # gtc list — reads and displays config entries
  set.ts                  # gtc set — interactive autocomplete to set a value
  remove.ts               # gtc remove — removes an entry by key
  theme.ts                # gtc theme — theme browser
src/cli/utils/
  cmd.ts                  # typed yargs command wrapper
  ui.ts                   # ANSI color/style helpers
src/config/
  index.ts                # useConfig() — core file I/O (get / set / remove / exists)
  constants.ts            # CONFIGURATIONS: ~180 valid Ghostty keys with doc URLs
scripts/build.ts          # Bun cross-compile script (8 targets)
bin/gtc                   # CJS shim — resolves correct platform binary at runtime
dist/                     # Compiled binaries (committed to git)
```

### Key implementation notes

- **Config I/O** (`src/config/index.ts`): The config file is read and written as plain text. `set` scans for a line starting with the key and updates it in-place, or appends it. `remove` splices the matching line out. No TOML/INI parser is used.
- **Key validation**: `set` validates the key against the static `CONFIGURATIONS` list before writing. Keys not in the list are rejected with an error.
- **Theme key special case**: When `set` detects the key `theme`, it replaces the free-text value prompt with an autocomplete sourced from `~/.config/ghostty/themes/`.
- **`bin/gtc` shim**: A CJS file (`require()`) for npm bin compatibility. It resolves the correct platform binary by checking `GTC_BIN_PATH`, a cached `.gtc` sibling, and then walking `node_modules` for the matching platform package.
- **No semicolons**: Prettier config (`package.json → "prettier"`) sets `"semi": false`, line width 120.
- **TypeScript 6.0.2**: Bleeding-edge — some type behaviors differ from TS 5.x.
