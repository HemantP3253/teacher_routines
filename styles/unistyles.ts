import { StyleSheet } from "react-native-unistyles";

// 1. Define your responsive design breakpoints
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

const lightTheme = {
  colors: {
    // Surfaces
    background: "rgb(248, 251, 249)",
    surface: "rgb(240, 245, 242)",
    surfaceElevated: "rgb(231, 236, 233)",
    surfacePressed: "rgb(220, 226, 222)",

    // Text
    text: "rgb(27, 38, 33)",
    textSecondary: "rgb(98, 114, 106)",
    textDisabled: "rgb(166, 176, 170)",

    // Borders
    border: "rgb(207, 216, 211)",
    borderMuted: "rgb(227, 233, 229)",

    // Interactive
    primary: "rgb(74, 152, 118)",
    primaryContent: "rgb(248, 251, 249)",

    secondary: "rgb(179, 103, 169)",
    secondaryContent: "rgb(248, 251, 249)",

    accent: "rgb(175, 174, 58)",
    accentContent: "rgb(27, 38, 33)",

    // Status
    success: "rgb(52, 170, 112)",
    successContent: "rgb(248, 251, 249)",

    warning: "rgb(188, 177, 49)",
    warningContent: "rgb(27, 38, 33)",

    error: "rgb(195, 91, 75)",
    errorContent: "rgb(248, 251, 249)",

    info: "rgb(79, 120, 213)",
    infoContent: "rgb(248, 251, 249)",

    // Disabled
    disabled: "rgb(220, 226, 222)",
    disabledContent: "rgb(145, 154, 148)",

    // Neutral palette
    neutral100: "rgb(246, 248, 247)",
    neutral200: "rgb(234, 238, 236)",
    neutral300: "rgb(214, 220, 216)",
    neutral400: "rgb(186, 194, 189)",
    neutral500: "rgb(150, 160, 154)",
    neutral600: "rgb(116, 126, 121)",
    neutral700: "rgb(84, 94, 89)",
    neutral800: "rgb(58, 66, 62)",
    neutral900: "rgb(36, 42, 39)",

    // Overlay
    overlay: "rgba(0,0,0,0.40)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },
    caption: {
      fontSize: 13,
      fontWeight: "400",
      lineHeight: 18,
    },
  },
} as const;

const darkTheme = {
  colors: {
    // Surfaces
    background: "rgb(14, 26, 20)",
    surface: "rgb(22, 37, 30)",
    surfaceElevated: "rgb(32, 48, 40)",
    surfacePressed: "rgb(43, 59, 50)",

    // Text
    text: "rgb(237, 248, 241)",
    textSecondary: "rgb(182, 202, 189)",
    textDisabled: "rgb(113, 129, 120)",

    // Borders
    border: "rgb(78, 102, 87)",
    borderMuted: "rgb(52, 71, 60)",

    // Interactive
    primary: "rgb(141, 216, 177)",
    primaryContent: "rgb(22, 37, 30)",

    secondary: "rgb(226, 163, 214)",
    secondaryContent: "rgb(22, 37, 30)",

    accent: "rgb(188, 186, 71)",
    accentContent: "rgb(22, 37, 30)",

    // Status
    success: "rgb(79, 206, 142)",
    successContent: "rgb(22, 37, 30)",

    warning: "rgb(196, 188, 66)",
    warningContent: "rgb(22, 37, 30)",

    error: "rgb(215, 109, 91)",
    errorContent: "rgb(22, 37, 30)",

    info: "rgb(111, 151, 240)",
    infoContent: "rgb(22, 37, 30)",

    // Disabled
    disabled: "rgb(52, 61, 56)",
    disabledContent: "rgb(112, 124, 117)",

    // Neutral palette
    neutral100: "rgb(232, 237, 234)",
    neutral200: "rgb(207, 214, 210)",
    neutral300: "rgb(180, 189, 184)",
    neutral400: "rgb(151, 161, 156)",
    neutral500: "rgb(121, 132, 126)",
    neutral600: "rgb(94, 105, 99)",
    neutral700: "rgb(71, 81, 76)",
    neutral800: "rgb(49, 57, 53)",
    neutral900: "rgb(28, 34, 31)",

    // Overlay
    overlay: "rgba(0,0,0,0.65)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },
    caption: {
      fontSize: 13,
      fontWeight: "400",
      lineHeight: 18,
    },
  },
} as const;

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

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
  themes: appThemes,
  settings: {
    adaptiveThemes: true,
  },
});
