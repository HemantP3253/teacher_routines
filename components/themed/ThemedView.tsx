import { ThemedViewProps } from "@/interfaces/interfaces";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const ThemedView = ({ style, ...otherProps }: ThemedViewProps) => {
  const { theme } = useUnistyles();

  const colors = theme.colors;

  return (
    <View
      style={[{ backgroundColor: colors.background }, style]}
      {...otherProps}
    />
  );
};

export default ThemedView;
