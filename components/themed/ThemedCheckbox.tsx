import { ArrowDownIcon } from "@/assets/icons";
import SelectedCheckBox from "@/assets/icons/CheckedCheckBox";
import IndeterminateCheckBoxIcon from "@/assets/icons/IndeterminateCheckBoxIcon";
import SelectAllIcon from "@/assets/icons/SelectAllIcon";
import UncheckedCheckBoxIcon from "@/assets/icons/UncheckedCheckBoxIcon";
import { ThemedCheckboxProps } from "@/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Spacer } from "../common";
import ThemedPressable from "./ThemedPressable";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedCheckbox = <T,>({
  data,
  initialSelection = [],
  minSelection = 0,
  onSubmit,
  title,
  getId,
  getLabel,
  getSubLabel,
}: ThemedCheckboxProps<T>) => {
  const { colors } = useUnistyles().theme;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

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

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) =>
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {title && <ThemedText style={styles.titleText}>{title}</ThemedText>}

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
          style={styles.selectOptionsContainer}
          onPress={handleInverseSelection}
        >
          <SelectAllIcon fill={colors.accent} />
          <ThemedText style={styles.selectOptionText}>
            Inverse Selection
          </ThemedText>
        </Pressable>
      </View>

      <Spacer lineVisible />

      <Spacer />

      <ThemedView style={styles.checkboxListContainer}>
        {sortedData.map((item: T) => {
          const id = getId(item);
          const label = getLabel(item);
          const subLabel = getSubLabel?.(item);

          const isChecked = selectedIds.includes(id);
          const isExpanded = expandedIds.includes(id);

          const currentColor = isChecked
            ? colors.primaryContent
            : colors.primary;

          return (
            <Pressable
              key={id}
              onPress={() => toggleItem(id)}
              style={[
                styles.cardContainer,
                isChecked && { backgroundColor: colors.primary },
              ]}
            >
              <View style={styles.innerCardContainer}>
                {isChecked ? (
                  <SelectedCheckBox fill={currentColor} />
                ) : (
                  <UncheckedCheckBoxIcon fill={colors.neutral100} />
                )}
                <View style={styles.innerTextContainer}>
                  <ThemedText
                    style={[
                      styles.labelText,
                      isChecked && { color: colors.primaryContent },
                    ]}
                  >
                    {label}
                  </ThemedText>
                  {subLabel && (
                    <ArrowDownIcon
                      fill={currentColor}
                      transform={[{ rotate: isExpanded ? "180deg" : "0deg" }]}
                      onPress={() => toggleExpand(id)}
                      style={styles.arrowIcon}
                    />
                  )}
                </View>
              </View>

              {isExpanded && subLabel && (
                <ThemedView style={styles.subLabelContainer}>
                  <ThemedText
                    style={[
                      styles.subLabelText,
                      isChecked && { color: colors.primaryContent },
                    ]}
                  >
                    {subLabel}
                  </ThemedText>
                </ThemedView>
              )}
            </Pressable>
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
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  scrollContent: { padding: theme.spacing.sm },
  titleText: {
    fontSize: theme.typography.h2.fontSize,
    padding: theme.spacing.md,
    fontWeight: "bold",
    paddingHorizontal: theme.spacing.sm,
    textAlign: "center",
  },
  selectOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  selectOptionText: {
    ...theme.typography.body,
    paddingLeft: theme.spacing.sm,
  },
  checkboxListContainer: {
    gap: theme.spacing.xs,
  },
  cardContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.sm,
  },
  innerCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  innerTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: theme.spacing.sm,
  },
  labelText: {
    fontSize: 16,
    flexShrink: 1,
    paddingRight: theme.spacing.md,
  },
  arrowIcon: { padding: theme.spacing.md },
  subLabelContainer: {
    paddingLeft: theme.spacing["2xl"],
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
    backgroundColor: "transparent",
  },
  subLabelText: {
    fontSize: 14,
    lineHeight: 18,
  },
  submitText: {
    textAlign: "center",
    fontWeight: "bold",
  },
}));

export default ThemedCheckbox;
