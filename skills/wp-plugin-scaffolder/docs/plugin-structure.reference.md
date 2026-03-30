# Plugin Structure Reference

This document provides annotated boilerplate for all core plugin files following the WordPress Plugin Boilerplate (WPB) pattern. Do not invoke this file as a skill — it is a reference document read during scaffolding.

Replace all `{placeholders}` with the values derived from user inputs.

---

## Main Plugin File — `{slug}/{slug}.php`

The entry point. Contains the plugin header comment, constants, activation/deactivation hooks, and the bootstrap call.

```php
<?php
/**
 * Plugin Name:       {Plugin Name}
 * Plugin URI:        {Plugin URI}
 * Description:       {Description}
 * Version:           1.0.0
 * Requires at least: {Min WP Version}
 * Requires PHP:      {Min PHP Version}
 * Author:            {Author Name}
 * Author URI:        {Author URI}
 * License:           {License}
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       {slug}
 * Domain Path:       /languages
 */

defined( 'ABSPATH' ) || exit;

// Plugin constants.
define( '{PREFIX}_VERSION',    '1.0.0' );
define( '{PREFIX}_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( '{PREFIX}_PLUGIN_URL', plugins_url( '', __FILE__ ) );

// Activation and deactivation hooks.
register_activation_hook( __FILE__, array( '{Class_Prefix}_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( '{Class_Prefix}_Deactivator', 'deactivate' ) );

// Bootstrap.
require_once {PREFIX}_PLUGIN_DIR . 'includes/class-{slug}.php';

/**
 * Begins execution of the plugin.
 *
 * @since 1.0.0
 */
function run_{function_prefix}() {
	$plugin = new {Class_Prefix}();
	$plugin->run();
}

run_{function_prefix}();
```

**Notes:**
- `Domain Path: /languages` tells WordPress where to find translation files.
- Constants use the `plugin_dir_path()` / `plugins_url()` pair — never `__DIR__` alone for URLs.
- The bootstrap function name must be unique: prefix it with the plugin's function prefix.

---

## Core Orchestrator Class — `includes/class-{slug}.php`

Wires together all plugin components. Never contains business logic — it delegates.

```php
<?php
/**
 * The core plugin class.
 *
 * Maintains the loader, plugin name, and version, and defines hooks.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}
 */
class {Class_Prefix} {

	/**
	 * The loader responsible for maintaining and registering all hooks.
	 *
	 * @since 1.0.0
	 * @var   {Class_Prefix}_Loader $loader
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since 1.0.0
	 * @var   string $plugin_name
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @var   string $version
	 */
	protected $version;

	/**
	 * Constructor. Defines the plugin name, version, and loads dependencies.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->version     = defined( '{PREFIX}_VERSION' ) ? {PREFIX}_VERSION : '1.0.0';
		$this->plugin_name = '{slug}';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Loads required dependencies and instantiates the loader.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function load_dependencies() {
		require_once {PREFIX}_PLUGIN_DIR . 'includes/class-{slug}-loader.php';
		require_once {PREFIX}_PLUGIN_DIR . 'includes/class-{slug}-i18n.php';
		require_once {PREFIX}_PLUGIN_DIR . 'includes/class-{slug}-activator.php';
		require_once {PREFIX}_PLUGIN_DIR . 'includes/class-{slug}-deactivator.php';

		// Load admin class only when in admin context.
		if ( is_admin() ) {
			require_once {PREFIX}_PLUGIN_DIR . 'admin/class-{slug}-admin.php';
		}

		require_once {PREFIX}_PLUGIN_DIR . 'public/class-{slug}-public.php';

		$this->loader = new {Class_Prefix}_Loader();
	}

	/**
	 * Defines the locale for the plugin for internationalization.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function set_locale() {
		$plugin_i18n = new {Class_Prefix}_I18n();
		$plugin_i18n->set_domain( $this->get_plugin_name() );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Registers all hooks related to the admin area.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new {Class_Prefix}_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_menu_pages' );
	}

	/**
	 * Registers all hooks related to the public-facing functionality.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function define_public_hooks() {
		$plugin_public = new {Class_Prefix}_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
	}

	/**
	 * Runs the loader to register all hooks with WordPress.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * Returns the plugin name.
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Returns the plugin version.
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function get_version() {
		return $this->version;
	}
}
```

**Notes:**
- If the plugin has no admin section, remove the `is_admin()` block and `define_admin_hooks()`.
- If the plugin has no public section, remove the public require and `define_public_hooks()`.
- Only add more `require_once` calls here — never inline business logic.

---

## Loader Class — `includes/class-{slug}-loader.php`

Maintains and registers all hooks. Keeps all hook registration in one auditable place.

```php
<?php
/**
 * Registers all actions and filters for the plugin.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_Loader
 */
class {Class_Prefix}_Loader {

	/**
	 * The array of actions registered with WordPress.
	 *
	 * @since 1.0.0
	 * @var   array $actions
	 */
	protected $actions;

	/**
	 * The array of filters registered with WordPress.
	 *
	 * @since 1.0.0
	 * @var   array $filters
	 */
	protected $filters;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->actions = array();
		$this->filters = array();
	}

	/**
	 * Adds a new action to the collection.
	 *
	 * @since 1.0.0
	 * @param string $hook          The WordPress hook name.
	 * @param object $component     A reference to the class that contains the callback.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Optional. Priority. Default 10.
	 * @param int    $accepted_args Optional. Number of accepted arguments. Default 1.
	 */
	public function add_action( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
		$this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Adds a new filter to the collection.
	 *
	 * @since 1.0.0
	 * @param string $hook          The WordPress hook name.
	 * @param object $component     A reference to the class that contains the callback.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Optional. Priority. Default 10.
	 * @param int    $accepted_args Optional. Number of accepted arguments. Default 1.
	 */
	public function add_filter( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
		$this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Utility to add a hook to a collection array.
	 *
	 * @since  1.0.0
	 * @access private
	 * @param  array  $hooks
	 * @param  string $hook
	 * @param  object $component
	 * @param  string $callback
	 * @param  int    $priority
	 * @param  int    $accepted_args
	 * @return array
	 */
	private function add( $hooks, $hook, $component, $callback, $priority, $accepted_args ) {
		$hooks[] = array(
			'hook'          => $hook,
			'component'     => $component,
			'callback'      => $callback,
			'priority'      => $priority,
			'accepted_args' => $accepted_args,
		);
		return $hooks;
	}

	/**
	 * Registers all collected actions and filters with WordPress.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		foreach ( $this->filters as $hook ) {
			add_filter(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}

		foreach ( $this->actions as $hook ) {
			add_action(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}
	}
}
```

---

## Activator Class — `includes/class-{slug}-activator.php`

Runs once when the plugin is activated.

```php
<?php
/**
 * Fired during plugin activation.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_Activator
 */
class {Class_Prefix}_Activator {

	/**
	 * Runs on plugin activation.
	 *
	 * Use this method to create custom tables, set default options, or
	 * flush rewrite rules after registering CPTs/taxonomies.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		// TODO: Add activation logic (e.g. create tables, set default options).

		// If you register custom post types or taxonomies on activation,
		// flush rewrite rules so permalinks work immediately.
		// flush_rewrite_rules();
	}
}
```

---

## Deactivator Class — `includes/class-{slug}-deactivator.php`

Runs once when the plugin is deactivated. **Do not delete data here** — use `uninstall.php` for cleanup.

```php
<?php
/**
 * Fired during plugin deactivation.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_Deactivator
 */
class {Class_Prefix}_Deactivator {

	/**
	 * Runs on plugin deactivation.
	 *
	 * Deactivation should be reversible. Remove scheduled events and
	 * flush rewrite rules, but do NOT delete user data or options here.
	 * Data removal belongs in uninstall.php.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		// TODO: Add deactivation logic (e.g. clear scheduled events).

		// Example: remove a scheduled cron event.
		// wp_clear_scheduled_hook( '{slug}_daily_event' );

		flush_rewrite_rules();
	}
}
```

---

## i18n Class — `includes/class-{slug}-i18n.php`

Loads the plugin's text domain for translation support.

```php
<?php
/**
 * Defines internationalization functionality.
 *
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class {Class_Prefix}_I18n
 */
class {Class_Prefix}_I18n {

	/**
	 * The text domain of this plugin.
	 *
	 * @since 1.0.0
	 * @var   string $domain
	 */
	private $domain;

	/**
	 * Sets the text domain.
	 *
	 * @since 1.0.0
	 * @param string $domain The text domain used by this plugin.
	 */
	public function set_domain( $domain ) {
		$this->domain = $domain;
	}

	/**
	 * Loads the plugin text domain for translation.
	 *
	 * @since 1.0.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			$this->domain,
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/../../languages/'
		);
	}
}
```

---

## Uninstall File — `{slug}/uninstall.php`

Runs when the user deletes the plugin from the WordPress admin. This is the only place to permanently remove plugin data.

```php
<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @since 1.0.0
 */

// Only run if WordPress triggered the uninstall.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

defined( 'ABSPATH' ) || exit;

// TODO: Remove plugin options.
// delete_option( '{slug}_settings' );

// TODO: Drop custom database tables if any were created.
// global $wpdb;
// $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}{slug}_table" );

// TODO: Delete any uploaded files or directories if applicable.
```

**Notes:**
- Always check `WP_UNINSTALL_PLUGIN` — this prevents direct execution.
- Only run destructive cleanup here, not in the Deactivator.
- For multisite, use `delete_site_option()` in addition to `delete_option()`.
