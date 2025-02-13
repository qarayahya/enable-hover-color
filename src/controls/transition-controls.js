/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { RangeControl, SelectControl } from "@wordpress/components";

const HoverTransitionControls = ({ attributes, setAttributes }) => {
	const {
		hoverTransitionDuration,
		hoverTransitionTiming,
		hoverTextColor,
		hoverBackgroundColor,
		hoverBorderColor,
		customHoverTextColor,
		customHoverBackgroundColor,
		customHoverBorderColor,
	} = attributes;

	const timingOptions = [
		{ label: __("Ease", "enable-hover-color"), value: "ease" },
		{ label: __("Linear", "enable-hover-color"), value: "linear" },
		{ label: __("Ease-in", "enable-hover-color"), value: "ease-in" },
		{ label: __("Ease-out", "enable-hover-color"), value: "ease-out" },
		{ label: __("Ease-in-out", "enable-hover-color"), value: "ease-in-out" },
	];

	return (
		<>
			{(customHoverBorderColor ||
				customHoverTextColor ||
				customHoverBackgroundColor ||
				hoverTextColor ||
				hoverBackgroundColor ||
				hoverBorderColor) && (
				<div
					className="enable-hover-color__transition-controls"
					style={{
						gridTemplateColumns: "repeat(2, minmax(0px, 1fr))",
						gap: "calc(16px)",
						gridColumn: "1 / -1",
					}}
				>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Transition Duration", "enable-hover-color")}
						value={hoverTransitionDuration}
						onChange={(value) =>
							setAttributes({ hoverTransitionDuration: value })
						}
						min={0}
						max={2000}
						step={50}
						initialPosition={200}
						help={__("Duration in milliseconds", "enable-hover-color")}
					/>

					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Timing Function", "enable-hover-color")}
						value={hoverTransitionTiming}
						options={timingOptions}
						onChange={(value) =>
							setAttributes({ hoverTransitionTiming: value })
						}
					/>
				</div>
			)}
		</>
	);
};

export default HoverTransitionControls;
