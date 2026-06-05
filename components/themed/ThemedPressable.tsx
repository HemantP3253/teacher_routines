import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedPressableProps } from "@/interfaces/interfaces";
import { useState } from "react";
import { Pressable } from "react-native";

const ThemedPressable = ({
  style,
  noFill,
  inline,
  ...otherProps
}: ThemedPressableProps) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const { theme } = useAppTheme();
  const colors = theme.colors;

  return (
    <Pressable
      style={(state) => [
        pressed
          ? { borderColor: colors.neutral }
          : { borderColor: colors.success },
        inline
          ? {}
          : {
              backgroundColor: noFill ? undefined : colors.primary,
              borderRadius: 8,
              borderColor: noFill ? colors.primary : undefined,
              borderWidth: noFill ? 1 : 0,
              paddingHorizontal: 4,
              marginHorizontal: 4,
              height: 32,
              justifyContent: "center",
            },
        typeof style === "function" ? style(state) : style,
      ]}
      onPress={() => setPressed(true)}
      {...otherProps}
    />
  );
};

export default ThemedPressable;
