import { ThemeColors } from "@/types/common";
import {
  ColorValue,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

interface LineProps extends ViewProps {
  size?: number;
}

type LineByType = LineProps & { type: keyof ThemeColors; color?: never };
type LineByColor = LineProps & { color: ColorValue; type?: never };

type SpacerDimensionProps =
  | {
      useFullWidth?: false;
      size?: number;
    }
  | { useFullWidth?: true; size?: never };

type SpacerProps = ViewProps &
  SpacerDimensionProps & {
    horizontal?: boolean;
    line?: LineByType | LineByColor;
  };

const Spacer = ({
  horizontal,
  size = 8,
  line,
  useFullWidth = false,
  ...props
}: SpacerProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const containerStyle: StyleProp<ViewStyle> = [
    horizontal
      ? { width: useFullWidth ? "100%" : size, height: "auto" }
      : { height: size, width: useFullWidth ? "100%" : "auto" },
    line && {
      justifyContent: "center",
      marginHorizontal: useFullWidth ? 0 : 4,
    },
  ];

  const lineColor = (
    line?.type ? colors[line.type] : line?.color ? line.color : colors.divider
  ) as ColorValue;
  const lineSize = line?.size ?? 1;

  return (
    <View style={containerStyle} {...props}>
      {line && (
        <View
          style={{
            backgroundColor: lineColor,
            height: lineSize,
          }}
        />
      )}
    </View>
  );
};

export default Spacer;
