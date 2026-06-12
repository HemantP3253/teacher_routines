import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { TagChipProps } from "@/interfaces/interfaces";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const TagChip = ({
  label = "Item",
  selected = false,
  onPress,
  fill = true,
  Icon,
  dottedBorder,
}: TagChipProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const isDotted = dottedBorder && !fill;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.rootContainer,
        selected && !isDotted && styles.selectedRootContainer,
        isDotted && !selected && styles.dottedRootContainer,
      ]}
    >
      <ThemedLinearGradient
        style={[styles.chipBase]}
        type={selected ? "primary" : "surfaceElevated"}
        end={{ x: 0, y: 1 }}
      >
        {Icon && (
          <View style={styles.iconWrapper}>
            <Icon
              fill={selected ? colors.primaryContent : colors.textSecondary}
            />
          </View>
        )}
        <ThemedText
          type={selected ? "primaryContent" : "text"}
          style={[styles.labelText]}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      </ThemedLinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  rootContainer: {
    height: 40,
    margin: theme.spacing.xs,
    borderColor: theme.colors.borderMuted,
    borderWidth: 1,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedRootContainer: {
    borderColor: theme.colors.primary,
  },
  dottedRootContainer: {
    borderColor: theme.colors.primary,
    borderStyle: "dotted",
    borderWidth: 1.5,
  },
  chipBase: {
    borderRadius: theme.radius.full,
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    alignSelf: "flex-start",
    height: "100%",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
}));

export default TagChip;
