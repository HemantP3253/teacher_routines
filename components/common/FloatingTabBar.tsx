import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const FloatingTabBar = ({ children }: { children?: ReactNode }) => {
  const { rt } = useUnistyles();

  return (
    <View style={styles.shadowContainer}>
      <BlurView
        intensity={40}
        tint={rt.themeName === "light" ? "light" : "dark"}
        style={styles.tabBar}
        experimentalBlurMethod="dimezisBlurView"
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  shadowContainer: {
    position: "absolute",
    bottom: theme.spacing.xl,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    height: 64,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: "transparent",
  },
  tabBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 4, // Clean 4px gutter for your sliding capsule
    flexDirection: "row",
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    overflow: "hidden", // Ensures the blur effect cuts off cleanly at the rounded corners
  },
}));

export default FloatingTabBar;
