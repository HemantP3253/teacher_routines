import { SpacerProps } from "@/interfaces/interfaces";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const Spacer = ({
  lineVisible,
  horizontal,
  size = 8,
  lineSize = 2,
  style,
  lineType,
  lineColor,
  useFullWidth = false,
  ...otherProps
}: SpacerProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const containerStyle = [
    horizontal
      ? { width: useFullWidth ? "100%" : size, height: "auto" }
      : { height: size, width: useFullWidth ? "100%" : "auto" },
    lineVisible && {
      justifyContent: "center",
      marginHorizontal: useFullWidth ? 0 : 4,
    },
    style,
  ];

  return (
    <View style={containerStyle} {...otherProps}>
      {lineVisible && (
        <View
          style={{
            backgroundColor: lineType
              ? colors[lineType]
              : lineColor
                ? lineColor
                : colors.divider,
            height: lineSize,
          }}
        />
      )}
    </View>
  );
};

export default Spacer;
