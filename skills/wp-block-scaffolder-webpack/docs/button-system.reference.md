## Button System (Critical - Must Use Prebuilt Components)

**Never create block-specific button styles or custom button rendering.**

### Required Behavior

- **React Blocks**: Always use the prebuilt `Button` component from `react/components/Button.jsx`
  - Import: `import { Button } from "../components/Button";`
  - Use: `<Button version="primary" title="Text" link="/url" target="_self" />`
  - Props: `version` (primary/secondary/tertiary), `title`, `link`, `target`, `onClick` (optional)

- **PHP Blocks**: Always use the prebuilt `createButton()` function from `template-parts/component/button.php`
  - Include: `include_once('button.php');` (usually in `template-parts/component/init.php`)
  - Use: `echo createButton($version, $title, $link, $target);`

- **Styling**: Buttons are styled globally via `scss/_buttons.scss`
  - **DO NOT** create block-specific button styles (e.g., `.{block}-block__button`)
  - **DO NOT** override button styles in block SCSS files
  - Button styles are handled by WordPress block button classes (`.wp-block-button`, `.is-style-primaryBtn`, etc.)

### ACF Button Clone Fields

When using ACF button clone fields (Component: Button group):

- Extract `text_link` (ACF link field) → `url`, `title`, `target`
- Extract `version` → pass to Button component's `version` prop
- Extract `size` → handled automatically by button system (if needed, add size class to wrapper)

### Example Usage

**React:**

```jsx
import { Button } from "../components/Button";

const renderButton = (buttonData) => {
	const textLink = buttonData.text_link || {};
	return (
		<Button
			version={buttonData.version || "primary"}
			title={textLink.title || ""}
			link={textLink.url || null}
			target={textLink.target || "_self"}
		/>
	);
};
```

**PHP:**

```php
<?php
include_once(get_template_directory() . '/template-parts/component/button.php');

$button = get_field('button');
$textLink = $button['text_link'] ?? [];
echo createButton(
  $button['version'] ?? 'primary',
  $textLink['title'] ?? 'Button',
  $textLink['url'] ?? '#',
  $textLink['target'] ?? '_self'
);
```
