import { Text, TextProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type textType =
  | "text"
  | "textSecondary"
  | "textDisabled"
  | "primaryContent"
  | "secondaryContent"
  | "accentContent"
  | "disabledContent"
  | "warningContent"
  | "successContent"
  | "errorContent"
  | "infoContent";

interface ThemedTextProps extends TextProps {
  type?: textType;
}

const ThemedText = ({ style, type, ...otherProps }: ThemedTextProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const textStyle = [{ color: colors[type ?? "text"] }, style];

  return <Text style={textStyle} {...otherProps} />;
};

export default ThemedText;
