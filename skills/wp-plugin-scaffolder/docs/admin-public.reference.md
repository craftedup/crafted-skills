# Admin & Public Class Reference

This document provides boilerplate for the admin and public-facing plugin layers. Do not invoke this file as a skill — it is a reference document read during scaffolding.

---

## Admin Class — `admin/class-{slug}-admin.php`

Handles all admin-side functionality: asset enqueueing, menu registration, and settings pages.

```php
<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_Admin
 */
class {Class_Prefix}_Admin {

	/**
	 * The plugin's unique identifier.
	 *
	 * @since 1.0.0
	 * @var   string $plugin_name
	 */
	private $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @var   string $version
	 */
	private $version;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The current version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Enqueues stylesheets for the admin area.
	 *
	 * Loads only on this plugin's admin pages using the $hook parameter.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page hook suffix.
	 */
	public function enqueue_styles( $hook ) {
		// Replace 'toplevel_page_{slug}' with your plugin's actual hook suffix.
		// Use error_log( $hook ) temporarily to discover the correct hook.
		if ( 'toplevel_page_' . $this->plugin_name !== $hook ) {
			return;
		}

		wp_enqueue_style(
			$this->plugin_name,
			{PREFIX}_PLUGIN_URL . 'admin/css/' . $this->plugin_name . '-admin.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Enqueues scripts for the admin area.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page hook suffix.
	 */
	public function enqueue_scripts( $hook ) {
		if ( 'toplevel_page_' . $this->plugin_name !== $hook ) {
			return;
		}

		wp_enqueue_script(
			$this->plugin_name,
			{PREFIX}_PLUGIN_URL . 'admin/js/' . $this->plugin_name . '-admin.js',
			array( 'jquery' ),
			$this->version,
			true // Load in footer.
		);

		// Pass PHP data to JS (AJAX URL, nonce, etc.).
		wp_localize_script(
			$this->plugin_name,
			'{slug}_admin_vars',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( '{slug}_admin_nonce' ),
			)
		);
	}

	/**
	 * Registers admin menu pages.
	 *
	 * @since 1.0.0
	 */
	public function add_menu_pages() {
		// Top-level menu page.
		add_menu_page(
			__( '{Plugin Name}', '{slug}' ),         // Page title.
			__( '{Plugin Name}', '{slug}' ),         // Menu title.
			'manage_options',                        // Required capability.
			$this->plugin_name,                      // Menu slug.
			array( $this, 'display_admin_page' ),    // Callback.
			'dashicons-admin-plugins',               // Icon.
			80                                       // Position.
		);

		// Example: sub-page under Settings instead of a top-level menu.
		// add_options_page(
		//     __( '{Plugin Name} Settings', '{slug}' ),
		//     __( '{Plugin Name}', '{slug}' ),
		//     'manage_options',
		//     $this->plugin_name,
		//     array( $this, 'display_admin_page' )
		// );
	}

	/**
	 * Renders the main admin page.
	 *
	 * @since 1.0.0
	 */
	public function display_admin_page() {
		// Capability check — always verify before rendering.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', '{slug}' ) );
		}

		include_once {PREFIX}_PLUGIN_DIR . 'admin/partials/{slug}-admin-display.php';
	}

	/**
	 * Registers plugin settings using the Settings API.
	 *
	 * Hook this method to 'admin_init' via the loader.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		register_setting(
			'{slug}_settings_group',  // Option group (used in settings_fields()).
			'{slug}_settings',        // Option name stored in wp_options.
			array( $this, 'sanitize_settings' )
		);

		add_settings_section(
			'{slug}_general_section',
			__( 'General Settings', '{slug}' ),
			array( $this, 'render_general_section' ),
			$this->plugin_name
		);

		add_settings_field(
			'{slug}_example_field',
			__( 'Example Field', '{slug}' ),
			array( $this, 'render_example_field' ),
			$this->plugin_name,
			'{slug}_general_section'
		);
	}

	/**
	 * Sanitizes settings input before saving.
	 *
	 * @since  1.0.0
	 * @param  array $input Raw input from the settings form.
	 * @return array Sanitized input.
	 */
	public function sanitize_settings( $input ) {
		$sanitized = array();

		if ( isset( $input['example_field'] ) ) {
			$sanitized['example_field'] = sanitize_text_field( $input['example_field'] );
		}

		return $sanitized;
	}

	/**
	 * Renders the general section description.
	 *
	 * @since 1.0.0
	 */
	public function render_general_section() {
		echo '<p>' . esc_html__( 'Configure general plugin settings below.', '{slug}' ) . '</p>';
	}

	/**
	 * Renders the example settings field.
	 *
	 * @since 1.0.0
	 */
	public function render_example_field() {
		$options = get_option( '{slug}_settings', array() );
		$value   = isset( $options['example_field'] ) ? $options['example_field'] : '';
		?>
		<input
			type="text"
			id="{slug}_example_field"
			name="{slug}_settings[example_field]"
			value="<?php echo esc_attr( $value ); ?>"
			class="regular-text"
		/>
		<?php
	}
}
```

---

## Admin Partial — `admin/partials/{slug}-admin-display.php`

The HTML template for the admin page. Always loaded via `include_once` from the admin class.

```php
<?php
/**
 * Provides the admin-facing view for the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="wrap">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

	<?php settings_errors( '{slug}_settings_group' ); ?>

	<form method="post" action="options.php">
		<?php
		// Output security fields for the registered settings group.
		settings_fields( '{slug}_settings_group' );
		// Output setting sections and their fields.
		do_settings_sections( '<?php echo esc_attr( $this->plugin_name ); ?>' );
		// Output the submit button.
		submit_button( __( 'Save Settings', '{slug}' ) );
		?>
	</form>
</div>
```

**Note:** `settings_fields()` outputs a hidden nonce field — this is the standard WP Settings API nonce pattern. Do not add a manual nonce field when using the Settings API.

---

## Admin JavaScript — `admin/js/{slug}-admin.js`

Strict IIFE wrapper to avoid polluting the global scope. The `{slug}_admin_vars` object is injected via `wp_localize_script`.

```js
( function ( $ ) {
	'use strict';

	// {slug}_admin_vars.ajax_url — WP AJAX endpoint
	// {slug}_admin_vars.nonce   — Nonce for AJAX requests

	$( document ).ready( function () {
		// TODO: Add admin JS.
	} );

} )( jQuery );
```

---

## Admin CSS — `admin/css/{slug}-admin.css`

```css
/**
 * Admin stylesheet for {Plugin Name}.
 *
 * @since 1.0.0
 */
```

---

## Public Class — `public/class-{slug}-public.php`

Handles public-facing functionality: asset enqueueing, shortcodes, and front-end output.

```php
<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_Public
 */
class {Class_Prefix}_Public {

	/**
	 * The plugin's unique identifier.
	 *
	 * @since 1.0.0
	 * @var   string $plugin_name
	 */
	private $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @var   string $version
	 */
	private $version;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The current version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Enqueues stylesheets for the public-facing side of the site.
	 *
	 * Only load assets where they are needed. Avoid global enqueueing
	 * unless the plugin is used site-wide.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_styles() {
		// Example: only load on singular pages that use this plugin's shortcode.
		// if ( ! is_singular() ) {
		//     return;
		// }

		wp_enqueue_style(
			$this->plugin_name,
			{PREFIX}_PLUGIN_URL . 'public/css/' . $this->plugin_name . '-public.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Enqueues scripts for the public-facing side of the site.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			$this->plugin_name,
			{PREFIX}_PLUGIN_URL . 'public/js/' . $this->plugin_name . '-public.js',
			array( 'jquery' ),
			$this->version,
			true // Load in footer.
		);
	}

	/**
	 * Registers shortcodes for the public-facing side.
	 *
	 * Hook this method to 'init' via the loader.
	 *
	 * @since 1.0.0
	 */
	public function register_shortcodes() {
		add_shortcode( '{slug}', array( $this, 'render_shortcode' ) );
	}

	/**
	 * Renders the plugin shortcode output.
	 *
	 * Usage: [{slug}]
	 *
	 * @since  1.0.0
	 * @param  array  $atts    User-defined attributes merged with defaults.
	 * @param  string $content Content between opening and closing shortcode tags.
	 * @return string          The shortcode HTML output.
	 */
	public function render_shortcode( $atts, $content = null ) {
		$atts = shortcode_atts(
			array(
				'title' => '',  // TODO: Define your shortcode attributes and defaults.
			),
			$atts,
			'{slug}'
		);

		// Sanitize all attributes before use.
		$atts['title'] = sanitize_text_field( $atts['title'] );

		ob_start();
		include {PREFIX}_PLUGIN_DIR . 'public/partials/{slug}-display.php';
		return ob_get_clean();
	}
}
```

---

## Public Partial — `public/partials/{slug}-display.php`

The front-end template. Loaded via `include` inside `render_shortcode()` — the `$atts` array is available in scope.

```php
<?php
/**
 * Template for the public-facing output of the plugin.
 *
 * Available variables:
 *   $atts  (array) — Shortcode attributes after shortcode_atts() merge.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="<?php echo esc_attr( '{slug}-wrapper' ); ?>">
	<?php if ( ! empty( $atts['title'] ) ) : ?>
		<h2><?php echo esc_html( $atts['title'] ); ?></h2>
	<?php endif; ?>

	<!-- TODO: Add front-end output here. -->
</div>
```

---

## Public JavaScript — `public/js/{slug}-public.js`

```js
( function ( $ ) {
	'use strict';

	$( document ).ready( function () {
		// TODO: Add public-facing JS.
	} );

} )( jQuery );
```

---

## Public CSS — `public/css/{slug}-public.css`

```css
/**
 * Public stylesheet for {Plugin Name}.
 *
 * @since 1.0.0
 */
```

---

## Wiring Shortcodes Into the Loader

After defining `register_shortcodes()` on the public class, add it to the loader inside `define_public_hooks()` in the core class:

```php
$this->loader->add_action( 'init', $plugin_public, 'register_shortcodes' );
```

## Wiring Settings Into the Loader

After defining `register_settings()` on the admin class, add it to the loader inside `define_admin_hooks()` in the core class:

```php
$this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );
```
