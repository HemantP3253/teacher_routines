import { ArrowDownIcon } from "@/assets/icons";
import SelectedCheckBox from "@/assets/icons/CheckedCheckBox";
import UncheckedCheckBoxIcon from "@/assets/icons/UncheckedCheckBoxIcon";
import { ThemedCheckboxProps } from "@/interfaces/interfaces";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";

const ThemedCheckbox = ({
  label,
  alwaysShowSubLabel = false,
  subLabel,
  style,
  onPress,
  isChecked: controlledIsChecked,
}: ThemedCheckboxProps) => {
  const [internalIsChecked, setInternalIsChecked] = useState<boolean>(
    controlledIsChecked ?? false,
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(alwaysShowSubLabel);

  const isControlled = controlledIsChecked !== undefined;
  const isChecked = isControlled ? controlledIsChecked : internalIsChecked;

  const { colors } = useUnistyles().theme;
  const currentColor = isChecked ? colors.primary : colors.neutral600;

  return (
    <View>
      <Pressable
        onPress={() => {
          if (isControlled) onPress?.();
          else setInternalIsChecked(!internalIsChecked);
        }}
        onLongPress={() => !alwaysShowSubLabel && setIsExpanded(!isExpanded)}
        style={[
          style,
          styles.rootContainer,
          {
            backgroundColor: isChecked
              ? colors.primaryContainer
              : "transparent",
          },
        ]}
      >
        <View style={styles.leftContainer}>
          {isChecked ? (
            <SelectedCheckBox fill={currentColor} />
          ) : (
            <UncheckedCheckBoxIcon fill={currentColor} />
          )}
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.labelContainer}>
            <ThemedText style={[styles.labelText]}>{label}</ThemedText>
            {!alwaysShowSubLabel && subLabel && (
              <ArrowDownIcon
                fill={currentColor}
                transform={[{ rotate: isExpanded ? "180deg" : "0deg" }]}
                onPress={() => setIsExpanded(!isExpanded)}
              />
            )}
          </View>
          <View style={styles.subLabelContainer}>
            {(alwaysShowSubLabel || isExpanded) && subLabel && (
              <ThemedText
                style={[
                  styles.subLabelText,
                  isChecked && { color: colors.onPrimaryContainer },
                ]}
              >
                {subLabel}
              </ThemedText>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ThemedCheckbox;

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  rootContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    flexDirection: "row",
    gap: spacing.xs,
  },
  leftContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    justifyContent: "center",
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 16,
    flexShrink: 1,
    fontWeight: "500",
    paddingRight: spacing.md,
    flexWrap: "wrap",
  },
  subLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subLabelText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
    flexWrap: "wrap",
  },
}));
