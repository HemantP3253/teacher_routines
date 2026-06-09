import { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const FloatingTabBar = (children: ReactNode) => {
  return <View style={styles.tabBar}>{children}</View>;
};

const styles = StyleSheet.create(({ colors }) => ({
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    flexDirection: "row",
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
}));

export default FloatingTabBar;
