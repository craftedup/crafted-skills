# Scaffold WordPress Plugin

## TL;DR (Read First)

- **Collect inputs first**: Never write a single file until you have all required values confirmed by the user.
- **ABSPATH on every file**: Every PHP file must begin with `defined('ABSPATH') || exit;` — no exceptions.
- **OOP boilerplate**: Use the WordPress Plugin Boilerplate (WPB) pattern — one orchestrator class, one loader class for hooks.
- **Auto-derive**: Slug, text domain, class prefix, and constant prefix are always derived from the plugin name — never ask for them.
- **Conditional scaffolding**: Only generate `admin/` and `public/` directories when the user confirms they are needed.
- **i18n everywhere**: Every user-facing string must be wrapped in `__()`, `_e()`, or equivalent with the correct text domain.
- **End every run** by listing every file created and any values left as placeholders.

---

## Purpose

Scaffold a complete WordPress plugin directory from scratch following the WordPress Plugin Boilerplate architecture. Enforces WordPress coding standards, security best practices, and internationalization throughout all generated files.

---

## Step 1 — Collect Inputs

If the user has not provided all required inputs, ask for them before proceeding.

**Required:**
- Plugin name (human-readable, e.g. "My Awesome Plugin")
- Plugin description (one sentence)
- Author name

**Optional — use these defaults if not provided:**
| Field | Default |
|---|---|
| Author URI | _(empty)_ |
| Plugin URI | _(empty)_ |
| Min WordPress version | `6.0` |
| Min PHP version | `8.0` |
| License | `GPL-2.0-or-later` |
| Has admin functionality? | Yes |
| Has public-facing functionality? | Yes |

**Always auto-derive — never ask:**
- **Plugin slug**: lowercase, hyphens only (e.g. "My Awesome Plugin" → `my-awesome-plugin`)
- **Text domain**: same as plugin slug
- **Class prefix**: PascalCase with `_` separator (e.g. `My_Awesome_Plugin`)
- **Constant prefix**: SCREAMING_SNAKE_CASE (e.g. `MY_AWESOME_PLUGIN`)
- **Function prefix**: same as class prefix in lowercase with underscores (e.g. `my_awesome_plugin`)

---

## Step 2 — Confirm Before Generating

Present a confirmation summary showing all resolved values before writing any files:

```
Plugin Name:        My Awesome Plugin
Plugin Slug:        my-awesome-plugin
Text Domain:        my-awesome-plugin
Class Prefix:       My_Awesome_Plugin
Constant Prefix:    MY_AWESOME_PLUGIN
Author:             Jane Developer
Min WP Version:     6.0
Min PHP Version:    8.0
License:            GPL-2.0-or-later
Admin section:      Yes
Public section:     Yes
```

Wait for user confirmation before proceeding.

---

## Step 3 — Generate File Structure

Create the plugin directory at `{plugin-slug}/`. Generate every file listed below.

### Always-required files

- `{slug}/{slug}.php` — main plugin file (headers + bootstrap)
- `{slug}/readme.txt` — WordPress.org-format readme
- `{slug}/uninstall.php` — cleanup on uninstall
- `{slug}/includes/class-{slug}.php` — core orchestrator class
- `{slug}/includes/class-{slug}-loader.php` — hook loader
- `{slug}/includes/class-{slug}-activator.php` — activation logic
- `{slug}/includes/class-{slug}-deactivator.php` — deactivation logic
- `{slug}/includes/class-{slug}-i18n.php` — i18n loader

### If admin functionality (admin section = yes)

- `{slug}/admin/class-{slug}-admin.php`
- `{slug}/admin/css/{slug}-admin.css`
- `{slug}/admin/js/{slug}-admin.js`
- `{slug}/admin/partials/{slug}-admin-display.php`

### If public-facing functionality (public section = yes)

- `{slug}/public/class-{slug}-public.php`
- `{slug}/public/css/{slug}-public.css`
- `{slug}/public/js/{slug}-public.js`
- `{slug}/public/partials/{slug}-display.php`

Reference: `docs/plugin-structure.reference.md`

---

## Step 4 — Write Each File

Follow the annotated boilerplate templates in the reference docs exactly. Apply all user-provided values throughout.

### Security Rules (Critical — enforce on every PHP file)

- **ABSPATH check**: First executable line after `<?php` must be: `defined('ABSPATH') || exit;`
- **Nonces**: Verify with `wp_verify_nonce()` or `check_admin_referer()` / `check_ajax_referer()` on all form and AJAX submissions
- **Capabilities**: Call `current_user_can()` before any privileged operation
- **Input**: Sanitize all input immediately on receipt — `sanitize_text_field()`, `absint()`, `sanitize_email()`, etc.
- **Output**: Escape all output as late as possible — `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
- **Database**: Always use `$wpdb->prepare()` for queries with variables; use format arrays for `$wpdb->insert()` / `$wpdb->update()`

Reference: `docs/security-standards.reference.md`

### WordPress Coding Standards

- Variables and functions: `snake_case`
- Classes: PascalCase with `_` separator (e.g. `My_Awesome_Plugin_Admin`)
- Indentation: **tabs**, not spaces
- Doc blocks on every class, method, and function
- File names: `class-{slug}-{suffix}.php` pattern (all lowercase, hyphens)

### Internationalization

- Every user-facing string: `__( 'String', 'text-domain' )` or `_e( 'String', 'text-domain' )`
- The text domain must match the plugin slug exactly
- Do not translate code-facing strings (option keys, CSS classes, hook names)

### Constants

Define these three constants in the main plugin file using the constant prefix:

```php
define( '{PREFIX}_VERSION', '1.0.0' );
define( '{PREFIX}_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( '{PREFIX}_PLUGIN_URL', plugins_url( '', __FILE__ ) );
```

### Asset Enqueueing

- Admin assets: enqueue inside the admin class, gated by `$hook` to load only on relevant pages
- Public assets: enqueue conditionally (e.g. `is_singular()`, shortcode presence) — never globally unless required
- Always pass the version constant as the `$ver` argument
- Scripts: always pass `true` for in-footer

Reference: `docs/admin-public.reference.md`

---

## Step 5 — Generate readme.txt

Create a valid WordPress.org-format `readme.txt` with:

- All required headers: `Plugin Name`, `Plugin URI`, `Contributors`, `Requires at least`, `Requires PHP`, `Tested up to`, `Stable tag`, `License`, `License URI`
- **Description** section — use the plugin description
- **Installation** section — numbered steps (download, upload to `wp-content/plugins/`, activate)
- **Changelog** section — initial `= 1.0.0 =` entry: "Initial release."

---

## Step 6 — Final Output

State explicitly at completion:

1. Every file created (full relative path from plugin root)
2. Any values that were defaulted rather than user-provided
3. Any `// TODO:` placeholders left in the code that the developer must fill in

### Pre-completion checklist (verify every item before closing)

- [ ] `{slug}/{slug}.php` — valid plugin headers, ABSPATH check, constants defined, activation/deactivation hooks registered
- [ ] `{slug}/readme.txt` — all WordPress.org required headers present
- [ ] `{slug}/uninstall.php` — `WP_UNINSTALL_PLUGIN` check + ABSPATH check
- [ ] `{slug}/includes/class-{slug}.php` — orchestrator class with loader, locale, admin/public hook definitions
- [ ] `{slug}/includes/class-{slug}-loader.php` — loader class with `$actions`, `$filters` arrays and `run()` method
- [ ] `{slug}/includes/class-{slug}-activator.php` — static `activate()` method
- [ ] `{slug}/includes/class-{slug}-deactivator.php` — static `deactivate()` method
- [ ] `{slug}/includes/class-{slug}-i18n.php` — `load_plugin_textdomain()` wired up
- [ ] Admin files created (if applicable) — class, CSS, JS, partial
- [ ] Public files created (if applicable) — class, CSS, JS, partial
- [ ] Every PHP file begins with `defined('ABSPATH') || exit;`
- [ ] All user-facing strings wrapped in i18n functions with correct text domain
- [ ] Constants defined in main plugin file using SCREAMING_SNAKE_CASE prefix
- [ ] Assets enqueued with version constant and conditional loading

---

## Related Reference Docs

- `docs/plugin-structure.reference.md`
- `docs/admin-public.reference.md`
- `docs/security-standards.reference.md`
