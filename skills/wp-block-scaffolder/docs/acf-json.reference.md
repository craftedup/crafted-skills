# ACF Local JSON Reference

This document explains how ACF Field Groups are modeled and generated for blocks using ACF Local JSON.
It is a reference document (not a Skill).

---

## Local JSON Workflow

- Field Groups are stored in `*THEME_NAME*/acf-json/`.
- ACF loads Field Groups from JSON and may render fields in the editor even when the DB version differs.
- The ACF Field Group editor reflects the DB version until JSON is synced.

---

## Required Behavior for Generated Field Groups

### Structure & Schema

- Before generating a new Field Group JSON, inspect existing JSON files in `*THEME_NAME*/acf-json/`.
- Copy the same top-level schema and settings keys used by existing groups.
- Do not invent new/unfamiliar settings keys.

### File Naming

- Save JSON into: `*THEME_NAME*/acf-json/`
- Filename must be unique.
- Use: `block-{slug}__{groupKey}.json`

---

## Key Generation & Collision Avoidance

### Namespacing (avoid collisions with UI-generated keys)

- Generated keys must include the token `cr` after the prefix:
  - Group keys: `group_cr_{slug}_{unixTimestamp}`
  - Field keys: `field_cr_{fieldName}_{unixTimestamp}_{counter}`

### Uniqueness

- Keys must be globally unique across all `acf-json/*.json`.
- Before writing the new JSON, search `acf-json/` for the generated group key and field keys.
- If any collision is found, regenerate using a new timestamp and/or counter.

---

## Location Rules

- Prefer the same ACF block location rule pattern used by other block Field Groups in this repo.
- If no examples exist, use a conventional block-based location rule appropriate for ACF blocks and call it out explicitly in the final checklist output.

---

## Field Creation Rules

### Message Field (Required First Field)

- Every block Field Group must include a **Message** field as the first field.
- Set the **label** to: `{Block Name} Block` (e.g., `Sponsors Block`, `Contact Form Block`).
- Leave the message body empty.
- Use:
  - `type: "message"`
  - empty `name`
  - `"message": ""`
- Mirror the exact structure used by existing block JSONs in `acf-json/`.

### Derive Fields From Figma

- Create an initial set of fields derived from the Figma selection:
  - headings, body copy, images, links
  - repeaters for repeated UI (cards/lists)
- Keep it minimal and editable; avoid deep nesting unless clearly required.

---

## Field Modeling Guidelines

- Repeated UI (cards/list items) → **Repeater**
- Logical grouping → **Group**
- Variant/size/layout toggles → **Button Group** or **True/False**
- Links → **Link** field (if this is the repo’s standard)
- Images → **Image** field
  - If the FocusPoint plugin is active and the image is fixed aspect / cover-fit, prefer the FocusPoint field type per existing patterns.
- Rich text vs textarea → follow existing repo conventions (inspect other groups)

---

## Local JSON Sync Requirements

### `modified` timestamp (critical for Sync UI)

- Always set the Field Group `"modified"` value to the current Unix timestamp.
- `"modified"` must be greater than the DB version for ACF to show **Sync**.

### `ID` handling

- Ensure `"ID"` is either `0` or omitted entirely, matching existing JSON conventions.

---

## Quality Rules

- No placeholder field keys or nonsense defaults.
- Clear field labels and machine-readable `name` values.
- Match repo formatting conventions (indentation/order) as closely as possible.

---

## Final Output Note

When generating a block, always list the created `acf-json/...json` file alongside the PHP/React files.

