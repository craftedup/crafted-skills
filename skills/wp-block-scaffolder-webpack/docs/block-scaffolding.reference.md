# Block Scaffolding Reference

This document explains the rules enforced by the Scaffold WordPress Block Skill.
Do not invoke this file as a Skill.

---

## Why PHP-first

- Most blocks are static content
- PHP blocks are faster, simpler, and easier to maintain
- React is reserved for real interactivity

---

## Figma → Block Modeling

- Headings, copy, images → simple ACF fields
- Repeating UI → repeater fields
- Variants/layout toggles → select or true/false fields

### Block Preview Image

When scaffolding from Figma, save the Figma screenshot as the block preview image:

1. **Save location**: `img/block-preview/{slug}.jpg` (or `.png` if the Figma export is PNG)
2. **Use in template**: Wrap the block output in the preview conditional and reference the image in the editor preview:

```php
<?php // Block preview
if (!empty($block['data']['_is_preview']) || !empty($block['data']['preview_image_help'])) { ?>
  <figure>
    <img class="preview-image-block" src="<?php echo get_stylesheet_directory_uri(); ?>/img/block-preview/<?php echo $slug; ?>.jpg" alt="Preview of the <?php echo ucfirst($slug); ?> Block" style="max-width: 425px;">
  </figure>
<?php } else { ?>
  <!-- block markup -->
<?php } ?>
```

Reference: Hero block (`template-parts/block/hero/content-hero.php` lines 30–40)

---

## PHP Component Extraction

Extract PHP components when:

- Markup is repeated
- Logic is shared
- The component has a clear semantic role

---

## React Usage Guidance

React is appropriate when:

- UI state must persist client-side
- DOM manipulation is non-trivial
- Behavior cannot be handled with light JS

If in doubt, default back to PHP.

