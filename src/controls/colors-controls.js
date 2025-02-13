/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from "@wordpress/block-editor";

const HoverColorsControls = ({
	clientId,
	hoverTextColor,
	hoverBackgroundColor,
	hoverBorderColor,
	setHoverTextColor,
	setHoverBackgroundColor,
	setHoverBorderColor,
}) => {
	const colorSettings = [
		{
			value: hoverTextColor?.color,
			onChange: setHoverTextColor,
			isShownByDefault: false,
			label: __("Hover Text"),
			resetAllFilter: () => ({
				hoverTextColor: undefined,
				customHoverTextColor: undefined,
			}),
		},
		{
			value: hoverBackgroundColor?.color,
			onChange: setHoverBackgroundColor,
			isShownByDefault: false,
			label: __("Hover Background"),
			resetAllFilter: () => ({
				hoverBackgroundColor: undefined,
				customHoverBackgroundColor: undefined,
			}),
		},
		{
			value: hoverBorderColor?.color,
			onChange: setHoverBorderColor,
			isShownByDefault: false,
			label: __("Hover Border"),
			resetAllFilter: () => ({
				hoverBorderColor: undefined,
				customHoverBorderColor: undefined,
			}),
		},
	];

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if (!colorGradientSettings.hasColorsOrGradients) {
		return null;
	}

	return (
		<>
			{colorSettings.map(
				({ onChange, label, isShownByDefault, value, resetAllFilter }) => (
					<ColorGradientSettingsDropdown
						key={`hover-color-${label}`}
						__experimentalIsRenderedInSidebar
						settings={[
							{
								colorValue: value,
								label,
								onColorChange: onChange,
								resetAllFilter,
								isShownByDefault,
								enableAlpha: true,
								clearable: true,
							},
						]}
						panelId={clientId}
						{...colorGradientSettings}
					/>
				),
			)}
		</>
	);
};

export default withColors(
	{ hoverTextColor: "color" },
	{ hoverBackgroundColor: "background-color" },
	{ hoverBorderColor: "border-color" },
)(HoverColorsControls);
