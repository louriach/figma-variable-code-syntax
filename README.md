# Figma Variable Code Syntax

A Figma plugin for batch editing the **code syntax** on your local variables — across Web, iOS, and Android platforms.

Inspired by [Jake Albaugh](https://github.com/jakealbaugh)'s console snippet.

![Plugin UI](https://raw.githubusercontent.com/disco-lu/figma-variable-code-syntax/main/preview.png)

## Features

- **All variable types** — COLOR, FLOAT, STRING, BOOLEAN
- **All platforms** — Web (`var(--token)`), iOS (`Color.token`), Android (`R.color.token`)
- **Collection picker** — target a specific collection or work across all of them
- **Search & filter** — drill down by name or group path
- **Bulk pattern editor** — apply a template to all filtered variables at once
- **Token chips** — click to insert `{kebab}`, `{camel}`, `{pascal}`, `{snake}`, `{UPPER}`, `{last}`, `{name}`
- **Inline editing** — override individual variables after a bulk apply
- **Multi-platform workflow** — set Web, iOS, and Android syntax in one session before applying

## Pattern tokens

| Token | Example output |
|-------|---------------|
| `{name}` | `Colors/Primary/500` |
| `{kebab}` | `colors-primary-500` |
| `{camel}` | `colorsPrimary500` |
| `{pascal}` | `ColorsPrimary500` |
| `{snake}` | `colors_primary_500` |
| `{UPPER}` | `COLORS_PRIMARY_500` |
| `{last}` | `500` |

## Installation

1. Clone or download this repo
2. In Figma: **Plugins → Development → Import plugin from manifest…**
3. Select `manifest.json` from this folder

## Development

No build step required — the plugin is plain HTML, CSS, and JavaScript.

- `manifest.json` — Figma plugin config
- `code.js` — plugin sandbox code (variable read/write via Figma API)
- `ui.html` — self-contained plugin UI
