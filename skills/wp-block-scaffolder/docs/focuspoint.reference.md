# ACF FocusPoint Field Reference

This document explains how to use the ACF FocusPoint plugin field type in blocks.
Do not invoke this file as a Skill.

---

## Overview

The **ACF FocusPoint** plugin adds a `focuspoint` field type to ACF. It provides an image selector with a built-in visual focal point picker. The editor clicks on the image preview to set the focal point.

This plugin is installed on all theme builds. Always use `focuspoint` instead of a standard `image` field when the image needs focal-point-aware cropping (heroes, backgrounds, cards, etc.).

---

## ACF JSON Field Definition

```json
{
    "key": "field_cr_{block}_{name}_{index}",
    "label": "Background Image",
    "name": "background_image",
    "type": "focuspoint",
    "instructions": "Select an image and click to set the focal point.",
    "required": 0,
    "conditional_logic": 0,
    "wrapper": {
        "width": "",
        "class": "",
        "id": ""
    },
    "preview_size": "medium",
    "library": "all"
}
```

---

## Return Value

The `focuspoint` field returns an array with three keys:

```php
[
    'id'   => 123,   // WordPress attachment ID
    'top'  => 35,    // Percentage from top edge (0–100)
    'left' => 60,    // Percentage from left edge (0–100)
]
```

**Note:** It does NOT return full image data (URL, alt, srcset, etc.). You must enrich it.

---

## PHP: Enriching FocusPoint Data

Use `\Crafted\Functions\getImageById()` to get the full image data from the attachment ID, then merge the focal point coordinates back in.

### Standard Pattern (PHP Blocks)

```php
$image = get_field('background_image'); // focuspoint field

if (!empty($image['id']) && function_exists('Crafted\Functions\getImageById')) {
    $image_data = \Crafted\Functions\getImageById($image['id'], 'large');
    if (!empty($image_data)) {
        $image = array_merge($image_data, [
            'left' => $image['left'] ?? 50,
            'top'  => $image['top'] ?? 50,
        ]);
    }
}

// Ensure defaults are always present
if (!empty($image)) {
    $image['left']       = $image['left'] ?? 50;
    $image['top']        = $image['top'] ?? 50;
    $image['source_url'] = $image['source_url'] ?? $image['url'] ?? '';
    $image['alt_text']   = $image['alt_text'] ?? $image['alt'] ?? '';
}
```

### React Block Pattern

For React blocks, process the data in the PHP template **before** encoding as JSON for the React component. This ensures the React component receives ready-to-use image data.

```php
$decoded = json_decode($fields, true) ?: [];

if (!empty($decoded['slides'])) {
    foreach ($decoded['slides'] as &$slide) {
        if (!empty($slide['background_image']['id'])) {
            $image = $slide['background_image'];
            if (function_exists('Crafted\Functions\getImageById')) {
                $image_data = \Crafted\Functions\getImageById($image['id'], 'full');
                if (!empty($image_data)) {
                    $slide['background_image'] = array_merge($image_data, [
                        'left' => $image['left'] ?? 50,
                        'top'  => $image['top'] ?? 50,
                    ]);
                }
            }
            $slide['background_image']['left']       = $slide['background_image']['left'] ?? 50;
            $slide['background_image']['top']        = $slide['background_image']['top'] ?? 50;
            $slide['background_image']['source_url'] = $slide['background_image']['source_url'] ?? $slide['background_image']['url'] ?? '';
            $slide['background_image']['alt_text']   = $slide['background_image']['alt_text'] ?? $slide['background_image']['alt'] ?? '';
        }
    }
    unset($slide);
}

$fields = json_encode(array_merge($decoded, ['blockID' => $id]));
```

---

## HTML: Rendering with Focal Point

### PHP Template (with `<picture>` and responsive sources)

```php
<picture>
    <?php if (!empty($image['avif_srcset'])) : ?>
        <source type="image/avif"
            srcset="<?php echo esc_attr($image['avif_srcset']); ?>"
            sizes="<?php echo esc_attr($sizes_attr); ?>">
    <?php endif; ?>
    <?php if (!empty($image['webp_srcset'])) : ?>
        <source type="image/webp"
            srcset="<?php echo esc_attr($image['webp_srcset']); ?>"
            sizes="<?php echo esc_attr($sizes_attr); ?>">
    <?php endif; ?>
    <img
        src="<?php echo esc_url($image['source_url']); ?>"
        srcset="<?php echo esc_attr($image['image_srcset'] ?? ''); ?>"
        sizes="<?php echo esc_attr($sizes_attr); ?>"
        alt="<?php echo esc_attr($image['alt_text']); ?>"
        width="<?php echo esc_attr($image['media_details']['width'] ?? $image['width'] ?? ''); ?>"
        height="<?php echo esc_attr($image['media_details']['height'] ?? $image['height'] ?? ''); ?>"
        style="object-position:<?php echo esc_attr($image['left']); ?>% <?php echo esc_attr($image['top']); ?>%"
        class="object-cover w-full h-full">
</picture>
```

### React Component

Use `<picture>` with AVIF and WebP sources when available, matching the PHP pattern. Define `sizesAttr` based on the image’s display context (e.g. `"100vw"` for full-width heroes, or a responsive `sizes` string):

```jsx
<picture>
    {image.avif_srcset && (
        <source type="image/avif" srcSet={image.avif_srcset} sizes={sizesAttr} />
    )}
    {image.webp_srcset && (
        <source type="image/webp" srcSet={image.webp_srcset} sizes={sizesAttr} />
    )}
    <img
        src={image.source_url || image.url}
        srcSet={image.image_srcset || ""}
        sizes={sizesAttr}
        alt={image.alt_text || image.alt || ""}
        width={image.media_details?.width ?? image.width}
        height={image.media_details?.height ?? image.height}
        style={{ objectPosition: `${image.left ?? 50}% ${image.top ?? 50}%` }}
        className="object-cover w-full h-full"
    />
</picture>
```

---

## Key Properties After Enrichment

| Property | Source | Description |
|----------|--------|-------------|
| `source_url` | `getImageById()` | Full-size image URL |
| `alt_text` | `getImageById()` | Alt text string |
| `left` | FocusPoint field | Horizontal focal point (0–100%) |
| `top` | FocusPoint field | Vertical focal point (0–100%) |
| `image_srcset` | `getImageById()` | Standard responsive srcset |
| `avif_srcset` | `getImageById()` | AVIF format srcset (if available) |
| `webp_srcset` | `getImageById()` | WebP format srcset (if available) |
| `media_details` | `getImageById()` | Width/height and size metadata |

---

## When to Use FocusPoint vs Standard Image

| Scenario | Field Type |
|----------|------------|
| Hero/banner backgrounds | `focuspoint` |
| Card thumbnails that crop | `focuspoint` |
| Gallery images (full display) | `image` |
| Logos / icons | `image` |
| Any `object-fit: cover` image | `focuspoint` |
