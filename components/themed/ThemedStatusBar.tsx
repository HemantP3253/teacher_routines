import { ThemedStatusBarProps } from "@/interfaces/interfaces";
import { StatusBar } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const ThemedStatusBar = ({ ...props }: ThemedStatusBarProps) => {
  const { theme, rt } = useUnistyles();
  return (
    <StatusBar
      barStyle={rt.themeName === "dark" ? "light-content" : "dark-content"}
      backgroundColor={theme.colors.base200}
      animated
      {...props}
    />
  );
};

export default ThemedStatusBar;
