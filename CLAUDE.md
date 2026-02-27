# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Google Sheets Add-on ("Sheets Modeler") built with Google Apps Script (V8 runtime). Provides financial modeling tools, format cycling, formula auditing, and range snapshots for Google Sheets.

## Development

This is a pure Google Apps Script project — no npm, no local build tools. Code is edited and deployed through the Google Apps Script IDE (editor.script.google.com) or via `clasp` CLI.

- **Manifest**: `appsscript.json` — defines OAuth scopes, homepage trigger, runtime version
- **No tests or linting** — GAS projects typically lack these; manual testing in a bound spreadsheet

## Architecture

All server-side logic lives in `Code.gs`. One HTML modal (`Trace.html`) handles interactive UI via `google.script.run` for client-server communication.

### Entry Point

`onSheetsHomepage()` → builds the CardService sidebar with 5 collapsible sections (Format Painter, Auto Color, Format Cycling, Modeling Tools, Settings).

### Core Modules (all in Code.gs)

- **Format Cycling** — `cycleFill()`, `cycleFont()`, `cycleNumber()`, `cycleCurrency()`, `cyclePercent()` → `applyCycle()`. One-click rotation through user-customizable format presets stored in PropertiesService.
- **Auto Color** — `autoColorSheet()`. Colors cells by content type: black (formulas), green (cross-sheet refs), purple (IMPORTRANGE), blue (numeric values).
- **Format Painter** — `saveNumberFormat()` / `applyNumberFormat()`. Copies number formats between ranges.
- **Modeling Tools** — `wrapIferror()` (wraps in IFERROR), `flipSign()` (negates values/formulas).
- **Formula Tracing** — `launchTraceModal()` / `launchDependentsModal()`. Regex-based precedent extraction + TextFinder-based dependent discovery, rendered in `Trace.html` modal with keyboard navigation.
- **Navigation History** — `jumpBack()`. Tracks sheet navigation, capped at 20 entries.

### Data Storage

User settings persisted via `PropertiesService.getUserProperties()` with keys: `c_fill`, `c_font`, `c_num`, `c_cur`, `c_per` (custom format cycles), plus `navHistory`.

### UI Patterns

- **Sidebar**: CardService card-based UI (not HTML sidebar)
- **Modals**: HtmlService dialog for Trace feature
- **Notifications**: `CardService.newNotification()` for user feedback

### OAuth Scopes

`spreadsheets`, `drive.readonly`, `script.external_request`, `script.container.ui` — all declared in `appsscript.json`. Any new feature requiring additional scopes must update the manifest.
