# Sheets Modeler

Google Sheets Add-on built with Google Apps Script (V8 runtime). Provides financial modeling tools, format cycling, formula auditing, and more for Google Sheets.

## Features

### Formula Auditing
- **Trace Precedents** — Select a formula cell and trace all its input references, including cross-sheet and named ranges. Navigate the dependency tree with keyboard shortcuts.
- **Trace Dependents** — Find every cell that references the selected cell using TextFinder-based search.
- **Jump Back** — Navigate back through your trace history (up to 20 entries).

### Model Formatting
- **Auto Color Sheet** — Automatically color-codes cells by type: black (formulas), green (cross-sheet refs), purple (IMPORTRANGE), blue (hard-coded numbers).

### Modeling Tools
- **Flip Sign (+/-)** — Negates values and wraps formulas with `=-1*(...)`.
- **Wrap IFERROR** — Wraps all formulas in a selection with `IFERROR(..., "")`.

### Format Cycling
One-click rotation through customizable format presets:
- **Fill Colors** — Cycle background colors
- **Font Colors** — Cycle font colors
- **Number / Currency / Percent** — Cycle number formats

All presets are user-configurable via the sidebar settings panel.

### Number Format Painter
Save a cell's number format, then apply it to any other range.

## Installation

1. Open a Google Spreadsheet
2. Go to **Extensions > Apps Script**
3. Copy `Code.gs`, `Trace.html`, and `appsscript.json` into the project
4. Save and reload the spreadsheet
5. The "Sheets Modeler" sidebar appears in the right panel

## Project Structure

```
Code.gs          Server-side logic (sidebar UI, all features)
Trace.html       Modal UI for formula tracing (precedents & dependents)
appsscript.json  Manifest (OAuth scopes, triggers, runtime config)
```

## OAuth Scopes

| Scope | Purpose |
|-------|---------|
| `spreadsheets` | Read/write cell data, formatting, formulas |
| `drive.readonly` | Access spreadsheet metadata |
| `script.external_request` | UrlFetchApp for export endpoints |
| `script.container.ui` | Show modals and notifications |
