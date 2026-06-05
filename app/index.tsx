import { useAppTheme } from "@/contexts/ThemeContext";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function EntryPoint() {
  const { theme } = useAppTheme();

  // This renders a native background matching your active theme
  // while the root layout's useEffect auth hook routes the user.
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.base100 }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
