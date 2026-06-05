import { ArrowDownIcon } from "@/assets/icons";
import SelectedCheckBox from "@/assets/icons/CheckedCheckBox";
import IndeterminateCheckBoxIcon from "@/assets/icons/IndeterminateCheckBoxIcon";
import SelectAllIcon from "@/assets/icons/SelectAllIcon";
import UncheckedCheckBoxIcon from "@/assets/icons/UncheckedCheckBoxIcon";
import { useAppTheme } from "@/contexts/ThemeContext";
import { ThemedCheckboxProps } from "@/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
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
  const { theme } = useAppTheme();
  const colors = theme.colors;

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

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      {title && (
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 8,
            textAlign: "center",
          }}
        >
          {title}
        </ThemedText>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
          onPress={handleGlobalToggle}
        >
          {selectedIds.length === 0 ? (
            <UncheckedCheckBoxIcon fill={colors.accent} />
          ) : selectedIds.length === data.length ? (
            <SelectedCheckBox fill={colors.accent} />
          ) : (
            <IndeterminateCheckBoxIcon fill={colors.accent} />
          )}
          <ThemedText style={{ paddingLeft: 8, fontSize: 16 }}>
            {`${selectedIds.length} ${selectedIds.length === 1 ? "item" : "items"} selected`}
          </ThemedText>
        </Pressable>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
          onPress={handleInverseSelection}
        >
          <SelectAllIcon fill={colors.accent} />
          <ThemedText style={{ paddingLeft: 8, fontSize: 16 }}>
            Inverse Selection
          </ThemedText>
        </Pressable>
      </View>

      <Spacer lineVisible />

      <ThemedView style={{ gap: 4 }}>
        {sortedData.map((item: T) => {
          const id = getId(item);
          const label = getLabel(item);
          const subLabel = getSubLabel?.(item);

          const isChecked = selectedIds.includes(id);
          const isExpanded = expandedIds.includes(id);

          return (
            <Pressable
              key={id}
              onPress={() => toggleItem(id)}
              style={[
                {
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                },
                isChecked ? { backgroundColor: colors.primary + 20 } : {},
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {isChecked ? (
                  <SelectedCheckBox fill={colors.primary} />
                ) : (
                  <UncheckedCheckBoxIcon fill={colors.neutral} />
                )}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 8,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 16,
                      flexShrink: 1,
                      paddingRight: 12,
                    }}
                  >
                    {label}
                  </ThemedText>
                  {subLabel && (
                    <ArrowDownIcon
                      fill={colors.primary}
                      transform={[{ rotate: isExpanded ? "180deg" : "0deg" }]}
                      onPress={() => toggleExpand(id)}
                      style={{ padding: 12 }}
                    />
                  )}
                </View>
              </View>

              {isExpanded && subLabel && (
                <ThemedView
                  style={[
                    {
                      paddingLeft: 32,
                      paddingTop: 4,
                      paddingBottom: 6,
                      backgroundColor: "transparent",
                    },
                  ]}
                >
                  <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
                    {subLabel}
                  </ThemedText>
                </ThemedView>
              )}
            </Pressable>
          );
        })}

        <ThemedPressable
          disabled={isSubmitDisabled}
          style={isSubmitDisabled ? { backgroundColor: colors.disabled } : {}}
          onPress={() => onSubmit?.(selectedIds)}
        >
          <ThemedText
            style={[
              isSubmitDisabled
                ? { color: colors.disabledContent }
                : { color: colors.primaryContent },
              { textAlign: "center", fontWeight: "bold" },
            ]}
          >
            Submit Choices
          </ThemedText>
        </ThemedPressable>
      </ThemedView>
    </ScrollView>
  );
};

export default ThemedCheckbox;
