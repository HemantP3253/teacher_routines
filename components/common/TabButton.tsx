import { TabIconProps } from "@/interfaces/interfaces";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "../themed/ThemedText";

const TabButton = ({ focused, Icon, title, onPress }: TabIconProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const tabItemColor = colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.unfocusedContainer, focused && styles.focusedContainer]}
    >
      <View style={styles.iconContainer}>
        <Icon
          height={focused ? 24 : 28}
          width={focused ? 24 : 28}
          fill={tabItemColor}
          fillItem={focused}
        />
      </View>

      {focused && (
        <ThemedText numberOfLines={1} style={styles.focusedText}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  focusedContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: theme.colors.border,
  },
  unfocusedContainer: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  focusedText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: theme.spacing.xxs,
  },
  iconContainer: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default TabButton;
