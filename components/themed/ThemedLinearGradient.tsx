import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { ColorValue } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type GradientType =
  | "background"
  | "surface"
  | "surfaceElevated"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface ThemedLinearGradientProps extends Omit<
  LinearGradientProps,
  "colors"
> {
  overrideColors?: [ColorValue, ColorValue, ...ColorValue[]];
  type?: GradientType;
}

const ThemedLinearGradient = ({
  overrideColors,
  style,
  type = "background",
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ...otherProps
}: ThemedLinearGradientProps) => {
  const { colors } = useUnistyles().theme;

  const gradientMap: Record<GradientType, [ColorValue, ColorValue]> = {
    background: [colors.background, colors.surface],
    surface: [colors.surface, colors.surfaceElevated],
    surfaceElevated: [colors.surfaceElevated, colors.surfacePressed],
    primary: [colors.surfacePressed, colors.primary],
    secondary: [colors.secondary, colors.accent],
    accent: [colors.accent, colors.primary],
    info: [...colors.infoGradient],
    success: [...colors.successGradient],
    warning: [...colors.warningGradient],
    error: [...colors.errorGradient],
  };

  const resolvedColors =
    overrideColors ?? gradientMap[type] ?? gradientMap.background;

  return (
    <LinearGradient
      colors={resolvedColors}
      start={start}
      end={end}
      style={style}
      {...otherProps}
    />
  );
};

export default ThemedLinearGradient;
