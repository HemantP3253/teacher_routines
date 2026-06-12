import { ThemedLinearGradientProps } from "@/interfaces/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import { useUnistyles } from "react-native-unistyles";

const ThemedLinearGradient = ({
  style,
  type = "background",
  ...otherProps
}: ThemedLinearGradientProps) => {
  const { colors } = useUnistyles().theme;
  const gradientColors: string[] = [
    colors.background,
    colors.surface,
    colors.surfaceElevated,
    colors.surfacePressed,
    colors.primary,
    colors.secondary,
    colors.accent,
  ];
  let gradientIndex = 0;
  switch (type) {
    case "background":
      gradientIndex = 0;
      break;

    case "surface":
      gradientIndex = 1;
      break;
    case "surfaceElevated":
      gradientIndex = 2;
      break;
    case "primary":
      gradientIndex = 3;
      break;
    case "secondary":
      gradientIndex = 4;
      break;
    case "accent":
      gradientIndex = 5;
      break;
    default:
      gradientIndex = 0;
      break;
  }

  return (
    <LinearGradient
      colors={[
        gradientColors[gradientIndex],
        gradientColors[gradientIndex + 1],
      ]}
      start={otherProps.start ? otherProps.start : { x: 0, y: 0 }}
      end={otherProps.end ? otherProps.end : { x: 1, y: 1 }}
      style={style}
      {...otherProps}
    />
  );
};

export default ThemedLinearGradient;
