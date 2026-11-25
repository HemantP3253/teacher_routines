import { Pressable, PressableProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

interface ThemedPressableProps extends PressableProps {
  noFill?: boolean;
  inline?: boolean;
}

const CustomPressable = ({
  style,
  noFill,
  inline,
  ...otherProps
}: ThemedPressableProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <Pressable
      style={(state) => [
        state.pressed && { transform: [{ scale: 0.98 }], opacity: 0.85 },
        inline
          ? {}
          : {
              backgroundColor: noFill ? undefined : colors.primary,
              borderRadius: 8,
              borderColor: noFill ? colors.primary : undefined,
              borderWidth: noFill ? 1 : 0,
              paddingHorizontal: 4,
              marginHorizontal: 4,
              paddingVertical: 6,
              justifyContent: "center",
            },
        typeof style === "function" ? style(state) : style,
      ]}
      {...otherProps}
    />
  );
};

export default CustomPressable;
