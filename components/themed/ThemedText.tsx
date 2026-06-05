import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedTextProps } from "@/interfaces/interfaces";
import { Text } from "react-native";

const ThemedText = ({ style, ...otherProps }: ThemedTextProps) => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  const textStyle = [
    { color: colors[otherProps.type ?? "baseContent"] },
    style,
  ];

  return <Text style={textStyle} {...otherProps} />;
};

export default ThemedText;
