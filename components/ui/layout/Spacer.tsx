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

  const lineColor = (
    line?.type ? colors[line.type] : line?.color ? line.color : colors.divider
  ) as ColorValue;
  const lineSize = line?.size ?? 1;

  const containerStyle: StyleProp<ViewStyle> = [
    horizontal
      ? {
          width: useFullWidth ? "100%" : size,
          ...(line ? { height: lineSize } : {}),
        }
      : {
          height: size,
          ...(useFullWidth
            ? { width: "100%" }
            : { width: line ? lineSize : undefined }),
          ...(line ? { alignSelf: "stretch" } : {}),
        },
    line &&
      (horizontal
        ? {
            justifyContent: "center",
            marginVertical: 4,
          }
        : {
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 4,
          }),
  ];

  return (
    <View style={[containerStyle, props.style]} {...props}>
      {line && (
        <View
          style={
            horizontal
              ? {
                  backgroundColor: lineColor,
                  width: "100%",
                  height: lineSize,
                }
              : {
                  backgroundColor: lineColor,
                  width: lineSize,
                  height: "100%",
                }
          }
        />
      )}
    </View>
  );
};

export default Spacer;
