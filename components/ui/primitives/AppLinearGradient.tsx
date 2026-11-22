import { ThemeColors } from "@/types/common";
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

type GradientColors = [ColorValue, ColorValue, ...ColorValue[]];

interface AppLinearGradientProps extends Omit<LinearGradientProps, "colors"> {
  overrideColors?: GradientColors;
  type?: GradientType;
}

// Hoisted outside the component so the mapping logic lives in one place
const getGradientColors = (
  colors: ThemeColors,
  type: GradientType,
): GradientColors => {
  const gradientMap: Record<GradientType, GradientColors> = {
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

  return gradientMap[type] ?? gradientMap.background;
};

const AppLinearGradient = ({
  overrideColors,
  style,
  type = "background",
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ...otherProps
}: AppLinearGradientProps) => {
  const { colors } = useUnistyles().theme;
  const resolvedColors = overrideColors ?? getGradientColors(colors, type);

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

export default AppLinearGradient;
