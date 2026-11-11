import { LogoutIcon, SyncIcon } from "@/assets/icons";
import { ThemedPressable, ThemedText } from "@/components/themed";
import { handleLogout } from "@/services/authService";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const SettingsFooter = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <View>
      <ThemedPressable style={[styles.actionButton]}>
        <SyncIcon fill={colors.infoContent} />
        <ThemedText type="infoContent" style={styles.actionText}>
          Sync Now
        </ThemedText>
      </ThemedPressable>

      <ThemedPressable
        style={[styles.logoutButton, styles.actionButton]}
        onPress={handleLogout}
      >
        <LogoutIcon fill={colors.errorContent} />
        <ThemedText type="errorContent" style={styles.actionText}>
          Log Out
        </ThemedText>
      </ThemedPressable>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  syncButton: { backgroundColor: colors.info },
  logoutButton: { backgroundColor: colors.error },
  actionText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
}));

export default SettingsFooter;
