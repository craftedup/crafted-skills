# Security Standards Reference

This document covers WordPress security requirements that must be applied throughout every plugin file. Do not invoke this file as a skill — it is a reference document read during scaffolding.

---

## 1. ABSPATH Check (Critical — Every PHP File)

Prevents direct HTTP access to PHP files. Must be the **first executable line** after `<?php` in every PHP file.

```php
<?php
defined( 'ABSPATH' ) || exit;
```

**Why:** Without this, anyone can request the file directly via URL and potentially trigger fatal errors that expose server paths or execute partial code.

---

## 2. Nonce Verification

Nonces prove that a form submission or AJAX request originated from your admin UI, not a forged cross-site request.

### Settings API (handled automatically)

When using `settings_fields()` in a form, WordPress generates and verifies the nonce automatically. Do not add a manual nonce in this case.

### Custom Admin Forms

Generate a nonce field in the form:

```php
<form method="post" action="">
    <?php wp_nonce_field( '{slug}_save_action', '{slug}_nonce' ); ?>
    <!-- form fields -->
</form>
```

Verify on submission:

```php
// In the form handler method:
if (
    ! isset( $_POST['{slug}_nonce'] ) ||
    ! wp_verify_nonce(
        sanitize_text_field( wp_unslash( $_POST['{slug}_nonce'] ) ),
        '{slug}_save_action'
    )
) {
    wp_die( esc_html__( 'Security check failed.', '{slug}' ) );
}
```

### Settings Page (shorthand)

```php
check_admin_referer( '{slug}_save_action', '{slug}_nonce' );
```

This calls `wp_die()` automatically on failure — no manual check needed.

### AJAX Requests

Generate the nonce in PHP and pass it to JS via `wp_localize_script`:

```php
wp_localize_script(
    $this->plugin_name,
    '{slug}_vars',
    array( 'nonce' => wp_create_nonce( '{slug}_ajax_action' ) )
);
```

Send it as a POST parameter from JS:

```js
$.post( {slug}_vars.ajax_url, {
    action: '{slug}_my_action',
    nonce:  {slug}_vars.nonce,
    // ... other data
} );
```

Verify in the AJAX handler:

```php
add_action( 'wp_ajax_{slug}_my_action', array( $this, 'handle_ajax' ) );

public function handle_ajax() {
    check_ajax_referer( '{slug}_ajax_action', 'nonce' );
    // ... rest of handler
}
```

---

## 3. Capability Checks

Always verify the current user has permission before performing any privileged operation.

```php
// Admin page rendering.
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( esc_html__( 'Insufficient permissions.', '{slug}' ) );
}

// AJAX handler.
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_send_json_error( array( 'message' => __( 'Insufficient permissions.', '{slug}' ) ), 403 );
}

// Form processing in admin.
if ( ! current_user_can( 'manage_options' ) ) {
    return;
}
```

**Order matters:** Check capability **before** checking nonce. A user without the capability should be rejected before any nonce logic runs.

**Common capabilities:**
| Capability | Typical use |
|---|---|
| `manage_options` | Plugin settings pages |
| `edit_posts` | Creating/editing content |
| `publish_posts` | Publishing content |
| `manage_categories` | Taxonomy management |
| `upload_files` | Media uploads |
| `install_plugins` | Plugin-related admin actions |

---

## 4. Input Sanitization

Sanitize all input **immediately on receipt**, before any processing, storing, or comparison.

**Rule:** If data comes from `$_POST`, `$_GET`, `$_REQUEST`, `$_COOKIE`, or `$_SERVER`, sanitize it.

| Function | Use for |
|---|---|
| `sanitize_text_field( $value )` | Single-line text input |
| `sanitize_textarea_field( $value )` | Multi-line text (textarea) |
| `sanitize_email( $value )` | Email addresses |
| `sanitize_url( $value )` | URLs (WP 5.9+; alias for `esc_url_raw`) |
| `esc_url_raw( $value )` | URLs being stored in the database |
| `absint( $value )` | Positive integers (IDs, counts) |
| `intval( $value )` | Signed integers |
| `sanitize_key( $value )` | Option keys, slugs, identifiers |
| `sanitize_file_name( $value )` | File names for uploads |
| `wp_kses_post( $value )` | Rich HTML from trusted admin users only |
| `wp_unslash( $value )` | Strip slashes before sanitizing (always apply first to `$_POST` values) |

### Combined pattern (most common)

```php
// Always wp_unslash() first, then sanitize.
$title   = isset( $_POST['title'] )
    ? sanitize_text_field( wp_unslash( $_POST['title'] ) )
    : '';

$user_id = isset( $_POST['user_id'] )
    ? absint( $_POST['user_id'] )
    : 0;

$url     = isset( $_POST['url'] )
    ? esc_url_raw( wp_unslash( $_POST['url'] ) )
    : '';
```

### Full POST handler pattern

```php
public function handle_form_submission() {
    // 1. Capability check.
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // 2. Nonce check.
    if (
        ! isset( $_POST['{slug}_nonce'] ) ||
        ! wp_verify_nonce(
            sanitize_text_field( wp_unslash( $_POST['{slug}_nonce'] ) ),
            '{slug}_save_action'
        )
    ) {
        wp_die( esc_html__( 'Security check failed.', '{slug}' ) );
    }

    // 3. Sanitize all input.
    $title = isset( $_POST['title'] )
        ? sanitize_text_field( wp_unslash( $_POST['title'] ) )
        : '';

    // 4. Process / save.
    update_option( '{slug}_title', $title );
}
```

---

## 5. Output Escaping

Escape all output **as late as possible**, immediately before rendering.

**Rule:** Never echo a variable without escaping, even if you sanitized it on input.

| Function | Use for |
|---|---|
| `esc_html( $value )` | Plain text inside HTML tags |
| `esc_attr( $value )` | HTML attribute values |
| `esc_url( $value )` | URLs inside `href`, `src`, `action` attributes |
| `esc_js( $value )` | Values inside inline `<script>` tags |
| `esc_textarea( $value )` | Text inside `<textarea>` tags |
| `wp_kses_post( $value )` | Rich HTML with allowed tags (post content) |
| `wp_json_encode( $value )` | PHP data output as JSON in HTML/JS |
| `number_format_i18n( $value )` | Numbers for display (locale-aware) |

```php
// Plain text in HTML.
echo esc_html( $title );

// Inside an attribute.
echo '<input type="text" value="' . esc_attr( $value ) . '">';

// A URL.
echo '<a href="' . esc_url( $link ) . '">' . esc_html( $label ) . '</a>';

// In a data attribute (JSON value).
echo '<div data-config="' . esc_attr( wp_json_encode( $config ) ) . '">';

// Rich HTML from a trusted admin user.
echo wp_kses_post( $html_content );
```

---

## 6. Database Queries

Never construct SQL with string concatenation using user-supplied data. Always use `$wpdb->prepare()`.

### SELECT with prepare()

```php
global $wpdb;

$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}my_table WHERE user_id = %d AND status = %s",
        absint( $user_id ),
        sanitize_key( $status )
    )
);
```

**Placeholders:**
| Placeholder | Type |
|---|---|
| `%d` | Integer |
| `%s` | String (auto-quoted) |
| `%f` | Float |

### INSERT (no prepare needed — use format array)

```php
$wpdb->insert(
    $wpdb->prefix . 'my_table',
    array(
        'user_id' => absint( $user_id ),
        'title'   => sanitize_text_field( $title ),
        'created' => current_time( 'mysql' ),
    ),
    array( '%d', '%s', '%s' ) // Format for each column.
);
```

### UPDATE (no prepare needed — use format array)

```php
$wpdb->update(
    $wpdb->prefix . 'my_table',
    array( 'title' => sanitize_text_field( $title ) ), // Data.
    array( 'id'    => absint( $id ) ),                 // WHERE.
    array( '%s' ),                                      // Data formats.
    array( '%d' )                                       // WHERE formats.
);
```

### DELETE

```php
$wpdb->delete(
    $wpdb->prefix . 'my_table',
    array( 'id' => absint( $id ) ),
    array( '%d' )
);
```

---

## 7. Anti-Patterns (Never Do These)

```php
// NEVER: echo unsanitized input.
echo $_POST['title'];

// NEVER: raw SQL with user data.
$wpdb->query( "SELECT * FROM my_table WHERE id = " . $_GET['id'] );

// NEVER: trust the referer header.
if ( $_SERVER['HTTP_REFERER'] === admin_url() ) { ... }

// NEVER: use $_REQUEST — be explicit about $_POST or $_GET.
$value = $_REQUEST['key'];

// NEVER: expose errors in production without error handling.
$result = $wpdb->get_results( $sql );
// Always check: if ( null === $result ) { handle error }

// NEVER: store plaintext passwords or secrets.
update_option( 'my_api_key', $_POST['api_key'] ); // OK to store, but redact from display.

// NEVER: call wp_die() without escaping the message.
wp_die( $_POST['message'] ); // Must be: wp_die( esc_html( $_POST['message'] ) );
```

---

## 8. File Upload Security

If the plugin handles file uploads:

```php
// Always use wp_handle_upload() — never move_uploaded_file() directly.
$upload = wp_handle_upload( $_FILES['my_file'], array( 'test_form' => false ) );

if ( isset( $upload['error'] ) ) {
    // Handle error.
}

// Validate MIME type after upload.
$file_type = wp_check_filetype( $upload['file'] );
$allowed   = array( 'jpg' => 'image/jpeg', 'png' => 'image/png', 'pdf' => 'application/pdf' );

if ( ! array_key_exists( $file_type['ext'], $allowed ) ) {
    unlink( $upload['file'] ); // Delete the disallowed file.
    wp_die( esc_html__( 'File type not allowed.', '{slug}' ) );
}
```
