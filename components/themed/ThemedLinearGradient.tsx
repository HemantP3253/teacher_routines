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
  ];
  const gradientIndex = type === "background" ? 0 : type === "surface" ? 1 : 2;

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
