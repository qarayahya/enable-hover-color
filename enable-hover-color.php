<?php
/**
 * Plugin Name:         Enable Hover Color
 * Description:         Add hover colors to core blocks in the WordPress block editor (Gutenberg)
 * Version:             1.0.0
 * Requires at least:   6.3
 * Requires PHP:        7.4
 * Author:              Qara Yahya
 * Author URI:          https://blocklayouts.com/author/qarayahya/
 * License:             GPL-2.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         enable-hover-color
 *
 * @package enable-hover-color
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Enqueue block editor assets.
 *
 * @since 1.0.0
 */
function enable_hover_color_enqueue_editor_assets() {

	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'enable-hover-color-editor-scripts',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'enable_hover_color_enqueue_editor_assets' );

/**
 * Register and enqueue stylesheet for the editor & frontend.
 *
 * @since 1.0.0
 */
function enable_hover_color_enqueue_block_styles() {
	wp_enqueue_style(
		'enable-hover-color-block-styles',
		plugins_url( '/build/style.css', __FILE__ ),
		array(),
		'1.0.0'
	);
}
add_action( 'enqueue_block_assets', 'enable_hover_color_enqueue_block_styles' );

/**
 * Filters the block content to add hover color classes and styles.
 *
 * @param string $block_content The block content.
 * @param array  $block The full block, including name and attributes.
 * @return string Modified block content.
 */
function enable_hover_color_render_block( $block_content, $block ) {
	// Return early if no block content or attributes.
	if ( empty( $block_content ) || empty( $block['attrs'] ) ) {
		return $block_content;
	}

	$attrs         = $block['attrs'];
	$hover_styles  = array();
	$hover_classes = array();

	// Helper function to get color value.
	$get_preset_color_value = function ( $preset_color ) {
		return sprintf( 'var(--wp--preset--color--%s)', $preset_color );
	};

	// Add transition duration.
	if ( ! empty( $attrs['hoverTransitionDuration'] ) ) {
		$duration       = $attrs['hoverTransitionDuration'];
		$hover_styles[] = sprintf( '--hover-transition-duration: %sms;', $duration );
	}

	// Add transition timing function.
	if ( ! empty( $attrs['hoverTransitionTiming'] ) ) {
		$timing         = $attrs['hoverTransitionTiming'];
		$hover_styles[] = sprintf( '--hover-transition-timing: %s;', $timing );
	}

	// Add hover text color.
	if ( ! empty( $attrs['hoverTextColor'] ) ) {

		$hover_classes[] = 'has-hover__color';
		$color           = $get_preset_color_value( $attrs['hoverTextColor'] );
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-color: %s;', $color );
		}
	}
	if ( ! empty( $attrs['customHoverTextColor'] ) ) {

		$hover_classes[] = 'has-hover__color';
		$color           = $attrs['customHoverTextColor'];
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-color: %s;', $color );
		}
	}

	// Add hover background color.
	if ( ! empty( $attrs['hoverBackgroundColor'] ) ) {

		$hover_classes[] = 'has-hover__background-color';
		$color           = $get_preset_color_value( $attrs['hoverBackgroundColor'] );
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-background-color: %s;', $color );
		}
	}
	if ( ! empty( $attrs['customHoverBackgroundColor'] ) ) {

		$hover_classes[] = 'has-hover__background-color';
		$color           = $attrs['customHoverBackgroundColor'];
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-background-color: %s;', $color );
		}
	}

	// Add hover border color.
	if ( ! empty( $attrs['hoverBorderColor'] ) ) {

		$hover_classes[] = 'has-hover__border-color';
		$color           = $get_preset_color_value( $attrs['hoverBorderColor'] );
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-border-color: %s;', $color );
		}
	}
	if ( ! empty( $attrs['customHoverBorderColor'] ) ) {

		$hover_classes[] = 'has-hover__border-color';
		$color           = $attrs['customHoverBorderColor'];
		if ( $color ) {
			$hover_styles[] = sprintf( '--hover-border-color: %s;', $color );
		}
	}

	// If no hover styles, return original content.
	if ( empty( $hover_styles ) ) {
		return $block_content;
	}

	// Create new HTML processor instance.
	$processor = new WP_HTML_Tag_Processor( $block_content );

	// Process the first HTML tag.
	if ( $processor->next_tag() ) {
		// Add hover classes.
		foreach ( $hover_classes as $class ) {
			$processor->add_class( $class );
		}

		// Add or merge style attribute.
		$style          = implode( ' ', $hover_styles );
		$existing_style = $processor->get_attribute( 'style' );
		if ( $existing_style ) {
			$style = $existing_style . ';' . $style;
		}
		$processor->set_attribute( 'style', $style );

		return $processor->get_updated_html();
	}

	return $block_content;
}
add_filter( 'render_block', 'enable_hover_color_render_block', 10, 2 );