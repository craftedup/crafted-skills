# Styling & Design Tokens Reference

This document explains how styling decisions should be made.
It is not a Skill.

---

## Color Usage

- All colors must come from `tailwind.config.js`
- Never hardcode hex/rgb values
- Prefer semantic tokens over visual guesses

---

## Typography

- `_defaults.scss` defines the source-of-truth type scale
- Blocks should reuse existing sizes whenever possible

---

## Custom Font Sizes

Only create custom sizes when no existing size fits.

Requirements:

- Use `clamp(min, preferred, max)`
- Respect existing scale proportions
- Avoid Tailwind default font-size utilities

---

## Layout vs Styling

- Tailwind in PHP should be limited to layout helpers
- Block-specific visual styling belongs in block SCSS

---

## Block SCSS vs Tailwind-in-PHP

### Rule recap

- Default: put block styling in `scss/blocks/{slug}.scss`.
- PHP should use Tailwind only for layout/structure when needed.
- Color/typography/visual styling belongs in SCSS.

### Why this exists

This keeps each block’s styling in one predictable place and prevents “utility sprawl” and color/type drift across templates.

### `theme()` usage in SCSS

When setting colors in SCSS, use Tailwind’s `theme()` lookups instead of hardcoding values.

Examples:

```scss
.block-hero {
	background-color: theme("colors.black");
}

.block-hero__eyebrow {
	color: theme("colors.green.light");
}
```

### What to do when you can’t find a token

- First, re-check tailwind.config.js for an existing color.
- If no appropriate token exists, leave the color unset and add a TODO comment.
- Do not “guess” a brand hex value.

### Anti-patterns (avoid)

- color: #00ff00;
- color: rgb(12, 200, 100);
- PHP template classes like text-green-500 when the block has a SCSS file
- Arbitrary Tailwind values: bg-[#123456]
