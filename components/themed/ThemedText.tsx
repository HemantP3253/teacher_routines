import { ThemedTextProps } from "@/interfaces/interfaces";
import { Text } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const ThemedText = ({ style, ...otherProps }: ThemedTextProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const textStyle = [
    { color: colors[otherProps.type ?? "baseContent"] },
    style,
  ];

  return <Text style={textStyle} {...otherProps} />;
};

export default ThemedText;
