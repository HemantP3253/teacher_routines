import {
  CheckedCheckBox,
  IndeterminateCheckBoxIcon,
  SelectAllIcon,
  UncheckedCheckBoxIcon,
} from "@/assets/icons";
import { MenuProps } from "@/types/common";
import { sortByLabel } from "@/utils/sortUtils";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Spacer from "../common/Spacer";
import ThemedCheckbox from "./ThemedCheckbox";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

interface ThemedCheckboxMenuProps<T> extends MenuProps<T> {
  initialSelection?: T[];
  minSelection?: number;
  onSubmit?: (selected: T[]) => void;
  addSearchBar?: boolean;
}

const ThemedCheckboxMenu = <T,>({
  data,
  initialSelection,
  minSelection = 0,
  onSubmit,
  title,
  sortType,
  getId,
  getLabel,
  getSublabel,
}: ThemedCheckboxMenuProps<T>) => {
  const { colors } = useUnistyles().theme;

  const [selectedItems, setSelectedItems] = useState<T[]>(
    initialSelection ?? [],
  );

  const [previousInitialSelection, setPreviousInitialSelection] = useState<
    T[] | undefined
  >(initialSelection);

  if (initialSelection !== previousInitialSelection) {
    setPreviousInitialSelection(initialSelection);
    setSelectedItems(initialSelection ?? []);
  }

  const sortedData = useMemo(() => {
    return sortByLabel(data, getLabel, sortType);
  }, [data, getLabel, sortType]);

  const isSubmitDisabled = useMemo(() => {
    return selectedItems.length < minSelection;
  }, [selectedItems, minSelection]);

  const toggleItem = (item: T) => {
    setSelectedItems((prev) => {
      const itemId = getId(item);
      const exists = prev.some((selected) => getId(selected) === itemId);
      return exists
        ? prev.filter((selected) => getId(selected) !== itemId)
        : [...prev, item];
    });
  };

  const handleGlobalToggle = useCallback(() => {
    setSelectedItems((prev) =>
      prev.length === 0 ? sortedData.map((item) => item) : [],
    );
  }, [sortedData]);

  const handleInverseSelection = useCallback(() => {
    setSelectedItems((prev) =>
      sortedData.filter((item) => !prev.includes(item)).map((item) => item),
    );
  }, [sortedData]);

  const getSelectedText = () => {
    const postfix = "selected";
    let prefix = "No items";
    if (selectedItems.length === 1) prefix = `1 item`;
    if (selectedItems.length > 1) prefix = `${selectedItems.length} items`;

    return `${prefix} ${postfix}`;
  };

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
            {selectedItems.length === 0 ? (
              <UncheckedCheckBoxIcon fill={colors.accent} />
            ) : selectedItems.length === data.length ? (
              <CheckedCheckBox fill={colors.accent} />
            ) : (
              <IndeterminateCheckBoxIcon fill={colors.accent} />
            )}
            <ThemedText style={styles.selectOptionText}>
              {getSelectedText()}
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
            const subLabel = getSublabel?.(item);

            const isChecked = selectedItems.some(
              (selected) => getId(selected) === getId(item),
            );

            return (
              <ThemedCheckbox
                label={label}
                subLabel={subLabel}
                key={`Checkbox-${id}-${index}`}
                onPress={() => toggleItem(item)}
                isChecked={isChecked}
              />
            );
          })}

          <Spacer />

          {data.length > 0 ? (
            <ThemedPressable
              disabled={isSubmitDisabled}
              style={isSubmitDisabled && { backgroundColor: colors.disabled }}
              onPress={() => onSubmit?.(selectedItems)}
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
          ) : (
            <ThemedText type="text" style={styles.noItemsText}>
              No items available
            </ThemedText>
          )}
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
    flexShrink: 0,
  },
  titleText: {
    fontSize: typography.h2.fontSize,
    padding: spacing.md,
    fontWeight: "bold",
    paddingHorizontal: spacing.sm,
    textAlign: "center",
  },
  selectOptionsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  selectAllContainer: {
    flex: 1,
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
    flexShrink: 0,
  },
  submitText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  noItemsText: {
    textAlign: "center",
    color: colors.disabledContent,
  },
}));

export default ThemedCheckboxMenu;
