import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedViewProps } from "@/interfaces/interfaces";
import { View } from "react-native";

const ThemedView = ({ style, ...otherProps }: ThemedViewProps) => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  return (
    <View
      style={[{ backgroundColor: colors.base100 }, style]}
      {...otherProps}
    />
  );
};

export default ThemedView;
