import { View, ViewProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const ThemedView = ({ style, ...otherProps }: ViewProps) => {
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
