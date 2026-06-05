import { DarkTheme, LightTheme } from "@/assets/theme/Themes";
import { ThemeContextType } from "@/interfaces/interfaces";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = storage.getString("user_theme_preference");
    if (savedTheme) {
      return savedTheme === "dark";
    }

    return systemColorScheme === "dark";
  });

  useEffect(() => {
    const savedTheme = storage.getString("user_theme_preference");
    if (!savedTheme) {
      setIsDark(systemColorScheme === "dark");
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    storage.setString("user_theme_preference", newMode ? "dark" : "light");
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }

  return context;
};
