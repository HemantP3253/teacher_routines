import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedStatusBarProps } from "@/interfaces/interfaces";
import { StatusBar } from "react-native";

const ThemedStatusBar = ({ ...props }: ThemedStatusBarProps) => {
  const { isDark, theme } = useAppTheme();
  return (
    <StatusBar
      barStyle={isDark ? "light-content" : "dark-content"}
      backgroundColor={theme.colors.base200}
      animated
      {...props}
    />
  );
};

export default ThemedStatusBar;
