---
name: WordPress Block Scaffolder
slug: wp-block-scaffolder
description: Construct a WordPress block, building ACF fields from a Figma design.
author: crafted-skills
category: architecture
tags:
  - wordpress
  - figma
tools:
  - claude
  - cursor
version: 2.0.0
createdAt: 2026-03-27
---

# Scaffold WordPress Block (PHP-First)

## TL;DR (Read First)

- **PHP-first**: Blocks are PHP-only by default. Create React **only** when real client-side interactivity is required.
- **Never invent styles**:
  - Colors must come from `tailwind.config.js`
  - Font sizes must come from `_defaults.scss`
  - If unavoidable, create a custom font-size utility using `clamp()` (never Tailwind defaults)
- **Follow file structure exactly**:
  - PHP blocks → `template-parts/block/content-{slug}.php`
  - PHP components → `template-parts/component/`
  - React blocks (only if needed) → `/react/blocks/`
  - React components → `/react/components/`
  - Block SCSS -> `scss/blocks/{slug}.scss`
- **Register the SCSS in `webpack.mix.js` (Critical — do not skip)**:
  - Add `.sass("scss/blocks/{slug}.scss", "css")` to `webpack.mix.js`
  - This is required on every block, no exceptions
- **Button System (Critical)**:
  - Never create custom button styles or markup
  - PHP: use `createButton()` from `template-parts/component/button.php`
  - React: use the shared `Button` component
- **Generate ACF Local JSON**:
  - Create a field group JSON in `acf-json/`
  - Use unique, namespaced keys (`group_cr_*`, `field_cr_*`)
  - **Filename must be `{groupKey}.json`** — e.g. `group_cr_layered_hero_1773388800.json`. Any other naming causes ACF to create a duplicate file on save.
  - Always update the `modified` timestamp so Sync appears
- **Do not guess**: if something can’t be confidently mapped, leave it unset and call it out
- **End every run by stating**:
  - PHP-only vs PHP + React (and why)
  - Files created or modified

---

## Purpose

Scaffold a WordPress block from a Figma MCP selection using strict project conventions.  
This Skill enforces **how** blocks are built, not **why** the rules exist.

---

## Inputs & Assumptions

- A Figma MCP selection is active
- A block name is provided or can be inferred
- The repo includes:
  - `tailwind.config.js`
  - `_defaults.scss`
  - ACF Local JSON (`acf-json/`)

---

## PHP vs React Decision Rules

- Default to PHP-only
- Create React only if the block requires:
  - Client-side state
  - Filtering/sorting
  - Tabs, accordions, carousels
  - Non-trivial JS behavior
- Static layout/content blocks must remain PHP-only

### Carousels always use React + Swiper (Critical)

Any block that is a carousel or slide-based experience **must** use React + Swiper — never PHP + vanilla JS.

- `import { Swiper, SwiperSlide } from "swiper/react"`
- Standard modules: `A11y`, `Keyboard` (add `Autoplay` if autoplay is required)
- `import "swiper/css"` in the component file
- Custom navigation (bubbles, arrows) calls `swiper.slideTo(index)` via a `useRef`
- References: `react/blocks/CarouselHero.jsx`, `react/blocks/Timeline.jsx`

Reference:

- `.cursor/skills/scaffold-block/docs/block-scaffolding.reference.md`

---

## File Structure Rules

- PHP blocks: `template-parts/block/content-{slug}.php`
- PHP components: `template-parts/component/`
- React blocks (if used): `/react/blocks/`
- React components: `/react/components/`

---

## Margin & Padding Fields (Required on Every Block)

Margin and padding fields are **globally available on every block** via two shared ACF Component field groups that are registered site-wide:

- **Component: Margins** (`group_66bbc41452927`) — `margin_top`, `margin_bottom`
- **Component: Block Padding** (`group_66c3a59df3229`) — `padding_top`, `padding_bottom`

> **Do NOT add these as clone fields in the block’s ACF JSON.** They are already present on every block automatically. Only read them in the PHP template.

### Semantic distinction

- **Margin** = spacing _between_ blocks (outer spacing).
- **Padding** = spacing of content to the edge of the block (inner spacing).

### Placement rules

- **Margin** → Apply to the outer block wrapper (the element that defines the block’s boundaries).
- **Padding** → Apply to the **same element** that has the background color (when the block has a background color field or a set background). That way the background extends into the padded area and content sits inside it.

### How to include them

**Read the values in the PHP template only** and apply as classes on the appropriate wrapper(s):

```php
$margin_top = get_field(‘margin_top’);
$margin_bottom = get_field(‘margin_bottom’);
$padding_top = get_field(‘padding_top’);
$padding_bottom = get_field(‘padding_bottom’);
```

```html
<div
	class="<?= $slug ?>-block <?= $margin_top . ‘ ‘ . $margin_bottom ?> <?= $padding_top . ‘ ‘ . $padding_bottom ?>"
></div>
```

For blocks with a background color: put margin + padding on the element that has the background. For blocks without (e.g. full-bleed heroes): apply both to the outer wrapper for consistency.

Reference: `template-parts/block/hero/content-hero.php` for the full pattern.

---

## Block Alignment (alignfull)

Most blocks should default to full-width. Apply `.alignfull` to the block wrapper:

```php
$align_class = $block['align'] ? 'align' . $block['align'] : 'alignfull';
```

**Do not overwrite** these properties in block SCSS. Avoid setting `width`, `position`, `left`, `right`, `margin-left`, or `margin-right` on the block wrapper element that has `.alignfull`.

---

## Container Pattern (Critical)

Most blocks need a max-width container to prevent content from stretching too wide on large screens. Use the `.container` class for this — do **not** apply `max-width` directly to block-specific elements.

### When to use `.container`

- Use when block content (text, buttons, grids) should be max-width constrained
- Applies inside the block wrapper (the block wrapper itself stays full-width via `.alignfull`)

### When NOT to use `.container`

- Full-bleed backgrounds (hero images, video slides) — the media itself must not be constrained
- In these blocks, the media fills the full width and `.container` wraps only the content overlay inside

### PHP pattern

```php
<div id="..." class="block-wrapper">
  <div class="my-block-block ...">
    <div class="container">
      <!-- constrained content here -->
    </div>
  </div>
</div>
```

Reference: `template-parts/block/full-copy/content-full-copy.php`

### React pattern

The `.container` div is rendered inside the React component (not in the PHP template):

```jsx
return (
	<div className="my-block">
		<div className="container">{/* constrained content here */}</div>
	</div>
);
```

References: `react/blocks/Timeline.jsx`, `react/blocks/CarouselHero.jsx`

---

## Styling Rules

### Block Wrapper & Spacing Rules

- All blocks must use the standard `block-wrapper` structure.
- Margin and padding come from ACF spacing fields (see section above).
- Spacing classes apply to the outer block wrapper only.
- Block padding should always apply to the outermost wrapper with a background color applied, when applicable.
- Spacing behavior must align with `_blockMargins.scss`.

---

### Typography Rules (Critical)

- Typography scale is defined in `_defaults.scss`.
- Do not use Tailwind font-size utilities (`text-xl`, `text-2xl`, etc.).
- Do not invent new font sizes.

### Visual Hierarchy in Blocks

- Blocks should use typography utility classes (`.h1`, `.h2`, `.h3`, etc.) for visual hierarchy.
- Do not default to semantic heading tags (`<h1>`, `<h2>`, etc.) inside blocks unless explicitly required.
- Prefer using neutral elements (e.g. `<div>`, `<span>`) with the appropriate typography class.

---

### Block SCSS Rules (Critical)

- Every new block **must** have a corresponding SCSS file at:
  `scss/blocks/{slug}.scss`
- Block-specific styling must live in the block SCSS file.
- In PHP templates, Tailwind utilities are allowed **only** for structural/layout needs (e.g. `flex`, `grid`, `gap`, `order`).
- Colors, typography, and visual styling must be defined in block SCSS (not Tailwind utility classes in PHP).

#### webpack.mix.js (Required — never skip)

Every new block SCSS file **must** be added to `webpack.mix.js` or it will never compile. Add the entry alongside the other block entries:

```js
.sass("scss/blocks/{slug}.scss", "css")
```

Example for a `quick-links` block:

```js
.sass("scss/blocks/quick-links.scss", "css")
```

Failure to add this entry means the block has no styles in production — it is as critical as creating the SCSS file itself.

---

### Color Usage in Block SCSS (Critical)

- Never hardcode colors (no hex, `rgb()`, `hsl()`).
- Never invent colors.
- Always inspect `tailwind.config.js` before choosing a color token.
- Always reference existing colors from `tailwind.config.js` using the **theme()** function in SCSS.
- **Prefer specifically defined colors** (e.g. `colors.black`, `colors.green.light`, `colors.green.DEFAULT`) over semantic aliases (`colors.primary`, `colors.secondary`).
- If no appropriate color exists, leave the color unstyled and note it in the final self-check.

### ACF Color Clone Fields (Component: Color)

- ACF color choices are **intentionally named to match Tailwind class names** (e.g. `blue`, `blue-dark`, `gray-light`).
- **Do not create color maps** in PHP—use the ACF value directly: `'bg-' . $color`, `'has-' . $color . '-color'`.

> **Do NOT add `has-*-color` utility classes to block SCSS.** These are defined globally and are available site-wide. Only write block-specific styles in the block SCSS file.

---

### Styling Reference:

- `.cursor/docs/styling-tokens.reference.md`

---

## Button System (Critical)

- Never create block-specific button styles
- PHP: use `createButton()`
- React: use shared `Button` component
- Button styling is global; blocks must not override it generally

### Button System Reference:

- `.cursor/docs/button-system.reference.md`

---

## FocusPoint Images (Critical)

The **ACF FocusPoint** plugin is installed on all builds. Use the `focuspoint` field type instead of a standard `image` field whenever the image will be cropped or displayed with `object-fit: cover` (heroes, banners, card thumbnails, etc.).

- **ACF JSON field type**: `"type": "focuspoint"`
- **Returns**: `{ id, top, left }` — does NOT return URLs or alt text
- **Must enrich** the data using `\Crafted\Functions\getImageById()` before rendering
- For React blocks, process in PHP template before `json_encode` to send enriched data
- Apply focal point via CSS: `object-position: {left}% {top}%`

### FocusPoint Reference:

- `.cursor/skills/scaffold-block/docs/focuspoint.reference.md`

---

## ACF Field Group Generation

- Generate a Field Group JSON file in `acf-json/`
- **First field must be a Message field** with the block name as the label (e.g. `Carousel Hero Block`).
- Keys must be unique and namespaced:
  - `group_cr_{slug}_{timestamp}`
  - `field_cr_{name}_{timestamp}_{index}`
- Always set `modified` to the current Unix timestamp
- Ensure keys do not collide with existing JSON

### ACF Field Modeling Rules

- Repeated UI → Repeater fields.
- Logical grouping → Group fields.
- Avoid unnecessary deep nesting.
- Keep field structure minimal and editable.
- Follow existing repo naming conventions for field names.

### Clone Fields with Multiple Instances

- When a block has **more than one clone** of the same field group (e.g. multiple color clone fields: headline color, body color, background color), enable **Prefix Field Names** (`prefix_name: 1`) on each clone field.
- With prefix enabled, subfields become `{field_name}_{subfield_name}` (e.g. `headline_color_color`, `background_color_color`). Update PHP templates to use these prefixed keys.

---

### ACF JSON Reference:

- `.cursor/docs/acf-json.reference.md`

---

## Required Final Output

At completion, explicitly state:

- PHP-only or PHP + React (and why)
- Files created or modified
- Any unresolved styling/token questions

### Pre-completion checklist (verify every item before closing)

- [ ] `template-parts/block/{slug}/block.json` created
- [ ] `template-parts/block/{slug}/content-{slug}.php` created
- [ ] `scss/blocks/{slug}.scss` created
- [ ] `acf-json/group_cr_{slug}_{timestamp}.json` created
- [ ] `inc/acf-blocks.php` — `register_block_type_from_metadata` entry added
- [ ] `inc/block-styles-scripts.php` — `wp_enqueue_block_style` entry added
- [ ] `webpack.mix.js` — `.sass("scss/blocks/{slug}.scss", "css")` entry added

---

## Related Reference Docs

- `.cursor/skills/scaffold-block/docs/block-scaffolding.reference.md`
- `.cursor/skills/scaffold-block/docs/button-system.reference.md`
- `.cursor/skills/scaffold-block/docs/styling-tokens.reference.md`
- `.cursor/skills/scaffold-block/docs/acf-json.reference.md`
- `.cursor/skills/scaffold-block/docs/focuspoint.reference.md`
