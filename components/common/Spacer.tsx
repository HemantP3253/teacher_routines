import { useAppTheme } from "@/contexts/ThemeContext";
import { SpacerProps } from "@/interfaces/interfaces";
import { View } from "react-native";

const Spacer = ({
  lineVisible,
  horizontal,
  size = 8,
  lineSize = 2,
  style,
  lineColor,
  ...otherProps
}: SpacerProps) => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  const containerStyle = [
    horizontal
      ? { width: size, height: "auto" }
      : { height: size, width: "auto" },
    lineVisible && { justifyContent: "center", marginHorizontal: 4 },
    style,
  ];

  return (
    <View style={containerStyle} {...otherProps}>
      {lineVisible && (
        <View
          style={{
            backgroundColor: lineColor ? lineColor : colors.accent,
            height: lineSize,
          }}
        />
      )}
    </View>
  );
};

export default Spacer;
