import SelectedCheckBox from "@/assets/icons/CheckedCheckBox";
import IndeterminateCheckBoxIcon from "@/assets/icons/IndeterminateCheckBoxIcon";
import SelectAllIcon from "@/assets/icons/SelectAllIcon";
import UncheckedCheckBoxIcon from "@/assets/icons/UncheckedCheckBoxIcon";
import { ThemedCheckboxMenuProps } from "@/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Spacer } from "../common";
import ThemedCheckbox from "./ThemedCheckbox";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedCheckboxMenu = <T,>({
  data,
  initialSelection = [],
  minSelection = 0,
  onSubmit,
  title,
  getId,
  getLabel,
  getSubLabel,
}: ThemedCheckboxMenuProps<T>) => {
  const { colors } = useUnistyles().theme;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const isDifferent =
      initialSelection.length !== selectedIds.length ||
      !initialSelection.every((id) => selectedIds.includes(id));
    if (isDifferent) setSelectedIds(initialSelection);
  }, [initialSelection]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
  }, [data]);

  const isSubmitDisabled = useMemo(() => {
    return selectedIds.length < minSelection;
  }, [selectedIds, minSelection]);

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleGlobalToggle = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === 0 ? sortedData.map((item) => getId(item)) : [],
    );
  }, [sortedData, getId]);

  const handleInverseSelection = useCallback(() => {
    setSelectedIds((prev) =>
      sortedData
        .filter((item) => !prev.includes(getId(item)))
        .map((item) => getId(item)),
    );
  }, [sortedData, getId]);

  const selectedText: string = useMemo(() => {
    const postfix = "selected";
    let prefix = "No items";
    if (selectedIds.length === 1) prefix = `1 item`;
    if (selectedIds.length > 1) prefix = `${selectedIds.length} items`;

    return `${prefix} ${postfix}`;
  }, [selectedIds]);

  return (
    <ScrollView>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="text" style={styles.titleText}>
          {title ?? "Select an option"}
        </ThemedText>

        <View style={styles.selectOptionsContainer}>
          <Pressable
            style={styles.selectAllContainer}
            onPress={handleGlobalToggle}
          >
            {selectedIds.length === 0 ? (
              <UncheckedCheckBoxIcon fill={colors.accent} />
            ) : selectedIds.length === data.length ? (
              <SelectedCheckBox fill={colors.accent} />
            ) : (
              <IndeterminateCheckBoxIcon fill={colors.accent} />
            )}
            <ThemedText style={styles.selectOptionText}>
              {selectedText}
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.selectAllContainer}
            onPress={handleInverseSelection}
          >
            <SelectAllIcon fill={colors.accent} />
            <ThemedText style={styles.selectOptionText}>
              Inverse Selection
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
      <ThemedView style={styles.listItemsContainer}>
        <View style={styles.checkboxListContainer}>
          {sortedData.map((item: T, index) => {
            const id = getId(item);
            const label = getLabel(item);
            const subLabel = getSubLabel?.(item);

            const isChecked = selectedIds.includes(id);

            return (
              <ThemedCheckbox
                label={label}
                subLabel={subLabel}
                key={`Checkbox-${id}-${index}`}
                onPress={() => toggleItem(id)}
                isChecked={isChecked}
              />
            );
          })}

          <Spacer />

          <ThemedPressable
            disabled={isSubmitDisabled}
            style={isSubmitDisabled && { backgroundColor: colors.disabled }}
            onPress={() => onSubmit?.(selectedIds)}
          >
            <ThemedText
              style={[
                isSubmitDisabled
                  ? { color: colors.disabledContent }
                  : { color: colors.primaryContent },
                styles.submitText,
              ]}
            >
              Submit Choices
            </ThemedText>
          </ThemedPressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius, typography }) => ({
  headerContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  listItemsContainer: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.xs,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  titleText: {
    fontSize: typography.h2.fontSize,
    padding: spacing.md,
    fontWeight: "bold",
    paddingHorizontal: spacing.sm,
    textAlign: "center",
  },
  selectOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
  },
  selectOptionText: {
    ...typography.body,
    paddingLeft: spacing.sm,
    color: colors.accent,
  },
  checkboxListContainer: {
    gap: spacing.xs,
  },
  submitText: {
    textAlign: "center",
    fontWeight: "bold",
  },
}));

export default ThemedCheckboxMenu;
