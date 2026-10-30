import { StatusBar, StatusBarProps } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const ThemedStatusBar = ({ ...props }: StatusBarProps) => {
  const { theme, rt } = useUnistyles();
  return (
    <StatusBar
      barStyle={rt.themeName === "dark" ? "light-content" : "dark-content"}
      backgroundColor={theme.colors.surface}
      animated
      {...props}
    />
  );
};

export default ThemedStatusBar;
