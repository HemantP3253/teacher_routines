import { StyleSheet } from "react-native-unistyles";

// 1. Define your responsive design breakpoints
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// 2. Define your Light Theme tokens
const lightTheme = {
  colors: {
    // Base Colors (Light Backgrounds & Surfaces)
    base100: "#f8fafc", // Clean, slightly cool off-white
    base200: "#edf2f7", // Light gray-blue for cards/sections
    base300: "#e2e8f0", // Borders/Dividers
    baseContent: "#1a2a38", // Deep Navy text (High contrast)

    // Brand Colors (Slightly more saturated for white backgrounds)
    primary: "#76a831", // Deepened version of your lime
    primaryContent: "#ffffff",
    secondary: "#d97d7f", // Deepened version of your coral
    secondaryContent: "#ffffff",
    accent: "#b5a61d", // Deepened version of your yellow/accent
    accentContent: "#ffffff",

    // Status Colors
    neutral: "#1e3540",
    neutralContent: "#e9f5f8",
    info: "#0062ff",
    infoContent: "#ffffff",
    success: "#16a34a",
    successContent: "#ffffff",
    warning: "#ca8a04",
    warningContent: "#ffffff",
    error: "#e11d48",
    errorContent: "#ffffff",

    // Unavailable Content Colors
    disabled: "#cbd5e1",
    disabledContent: "#94a3b8",
  },
  margins: {
    sm: 8,
    md: 16,
    lg: 24,
  },
} as const;

// 3. Define your Dark Theme tokens
const darkTheme = {
  colors: {
    // Base Colors (Backgrounds & Surfaces)
    base100: "#1d2e3d", // Main background
    base200: "#253d52", // Sidebars/Cards
    base300: "#2c4a66", // Borders/Dividers
    baseContent: "#def1f5", // Main text

    // Brand Colors
    primary: "#d1f4a5",
    primaryContent: "#33482a",
    secondary: "#f7bdbe",
    secondaryContent: "#563536",
    accent: "#f3eca0",
    accentContent: "#4d462c",

    // Status Colors
    neutral: "#9bbec7",
    neutralContent: "#12202c",
    info: "#5cb2ff",
    infoContent: "#f1f8ff",
    success: "#69e19a",
    successContent: "#f1fdf6",
    warning: "#f4ce5e",
    warningContent: "#fdfbf0",
    error: "#ff6c8b",
    errorContent: "#fef1f3",

    // Unavailable Content Colors
    disabled: "#334155",
    disabledContent: "#64748b",
  },
  margins: {
    sm: 8,
    md: 16,
    lg: 24,
  },
} as const;

// 4. Extract TypeScript types automatically from your configuration
type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

// 5. Register everything into the Unistyles C++ Core engine
StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
