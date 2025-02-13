/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { addFilter } from "@wordpress/hooks";
import { getBlockSupport, getBlockType } from "@wordpress/blocks";
import { InspectorControls } from "@wordpress/block-editor";
import { createHigherOrderComponent } from "@wordpress/compose";

/**
 * Internal dependencies
 */
import HoverColorsControls from "./controls/colors-controls";
import HoverTransitionControls from "./controls/transition-controls";

/**
 * Add the attribute to the block.
 * This is the attribute that will be saved to the database.
 *
 * @param {object} settings block settings
 * @param {string} name block name
 * @returns {object} modified settings
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype
 */
addFilter(
	"blocks.registerBlockType",
	"enable-hover-color/add-attributes",
	function (settings, name) {
		// Checks if the block supports text color.
		const hasTextColorSupport = () => {
			const colorSupport = getBlockSupport(settings, "color");
			return colorSupport && colorSupport.text !== false;
		};

		if (!hasTextColorSupport()) {
			return settings;
		}

		// Add the block hover color attributes.
		return {
			...settings,
			attributes: {
				...settings.attributes,
				hoverTextColor: {
					type: "string",
				},
				customHoverTextColor: {
					type: "string",
				},
				hoverBackgroundColor: {
					type: "string",
				},
				customHoverBackgroundColor: {
					type: "string",
				},
				hoverBorderColor: {
					type: "string",
				},
				customHoverBorderColor: {
					type: "string",
				},
				hoverTransitionDuration: {
					type: "number",
					default: 200,
				},
				hoverTransitionTiming: {
					type: "string",
					default: "ease",
				},
			},
		};
	},
);

/**
 * Add the edit component to the block.
 * This is the component that will be rendered in the editor.
 * It will be rendered after the original block edit component.
 *
 * @param {function} BlockEdit Original component
 * @returns {function} Wrapped component
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#editor-blockedit
 */
addFilter(
	"editor.BlockEdit",
	"enable-hover-color/add-inspector-controls",
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			const { name, attributes, setAttributes, clientId } = props;

			// Checks if the block supports text color.
			const hasTextColorSupport = () => {
				const blockType = getBlockType(name);
				const colorSupport = getBlockSupport(blockType, "color");
				return colorSupport && colorSupport.text !== false;
			};

			if (!hasTextColorSupport()) {
				return <BlockEdit {...props} />;
			}

			return (
				<>
					<BlockEdit {...props} />
					<InspectorControls group="color">
						{props.children}
						<HoverColorsControls
							attributes={attributes}
							setAttributes={setAttributes}
							clientId={clientId}
						/>
						<HoverTransitionControls
							attributes={attributes}
							setAttributes={setAttributes}
							clientId={clientId}
						/>
					</InspectorControls>
				</>
			);
		};
	}),
);

/**
 * Add inline style & classes in the Editor.
 *
 * @param {Object} BlockListBlock
 */
addFilter(
	"editor.BlockListBlock",
	"enable-hover-color/add-styles",
	createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			const { name, attributes } = props;

			// Checks if the block supports text color.
			const hasTextColorSupport = () => {
				const blockType = getBlockType(name);
				const colorSupport = getBlockSupport(blockType, "color");
				return colorSupport && colorSupport.text !== false;
			};

			if (!hasTextColorSupport()) {
				return <BlockListBlock {...props} />;
			}

			const {
				hoverTextColor,
				customHoverTextColor,
				hoverBackgroundColor,
				customHoverBackgroundColor,
				hoverBorderColor,
				customHoverBorderColor,
				hoverTransitionDuration,
				hoverTransitionTiming,
			} = attributes;

			// Define classes
			const classes = classnames(props?.className, {
				"has-hover__color": hoverTextColor || customHoverTextColor,
				"has-hover__background-color":
					hoverBackgroundColor || customHoverBackgroundColor,
				"has-hover__border-color": hoverBorderColor || customHoverBorderColor,
			});

			const getColorValue = (presetColor, customColor) => {
				return presetColor
					? `var(--wp--preset--color--${presetColor})`
					: customColor || "";
			};

			// Define inline style
			const inlineStyle = {
				"--hover-color": getColorValue(hoverTextColor, customHoverTextColor),
				"--hover-background-color": getColorValue(
					hoverBackgroundColor,
					customHoverBackgroundColor,
				),
				"--hover-border-color": getColorValue(
					hoverBorderColor,
					customHoverBorderColor,
				),
				"--hover-transition-duration":
					attributes.hoverTransitionDuration + "ms",
				"--hover-transition-timing": attributes.hoverTransitionTiming,
			};

			return (
				<>
					<BlockListBlock
						{...props}
						wrapperProps={{
							style: inlineStyle,
						}}
						className={classes}
					/>
				</>
			);
		};
	}),
);
