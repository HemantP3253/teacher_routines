import {
  ArrowDownIcon,
  RadioButtonCheckedIcon,
  RadioButtonUncheckedIcon,
} from "@/assets/icons";
import { ThemedRadioButtonMenuProps } from "@/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedRadioButtonMenu = <T,>({
  data,
  onSelect,
  title,
  getId,
  getLabel,
  getSubLabel,
  initialSelection,
  sortList,
  alwaysShowSubLabel,
}: ThemedRadioButtonMenuProps<T>) => {
  const { colors } = useUnistyles().theme;

  const [selectedId, setSelectedId] = useState<string>(initialSelection ?? "");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialSelection) {
      setSelectedId(initialSelection);
    }
  }, [initialSelection]);

  const sortedData = useMemo(() => {
    return sortList
      ? [...data].sort((a, b) => getLabel(a).localeCompare(getLabel(b)))
      : data;
  }, [data, sortList, getLabel]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.rootContainer}>
        <ThemedText type="text" style={styles.titleText}>
          {title ?? "Select an option"}
        </ThemedText>

        <ThemedView style={styles.cardContainer}>
          {sortedData.map((item: T) => {
            const id = getId(item);
            const label = getLabel(item);
            const subLabel = getSubLabel?.(item);

            const isChecked = selectedId === id;
            let isExpanded = alwaysShowSubLabel
              ? true
              : expandedIds.includes(id);

            return (
              <Pressable
                key={id}
                onPress={() => {
                  setSelectedId(id);
                  onSelect?.(id);
                }}
                onLongPress={() => !alwaysShowSubLabel && toggleExpand(id)}
                style={[
                  styles.card,
                  isChecked && { backgroundColor: colors.primary },
                ]}
              >
                <View style={styles.leftContainer}>
                  {isChecked ? (
                    <RadioButtonCheckedIcon fill={colors.primaryContent} />
                  ) : (
                    <RadioButtonUncheckedIcon fill={colors.neutral600} />
                  )}
                </View>
                <View style={styles.rightContainer}>
                  <View style={styles.labelContainer}>
                    <ThemedText
                      type={isChecked ? "primaryContent" : "text"}
                      style={[
                        styles.labelText,
                        isChecked && {
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {label}
                    </ThemedText>
                    {subLabel && !alwaysShowSubLabel && (
                      <ArrowDownIcon
                        fill={
                          isChecked ? colors.primaryContent : colors.primary
                        }
                        transform={[{ rotate: isExpanded ? "180deg" : "0deg" }]}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleExpand(id);
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.subLabelContainer}>
                    {isExpanded && subLabel && (
                      <ThemedText
                        type={isChecked ? "primaryContent" : "text"}
                        style={styles.subLabelText}
                      >
                        {subLabel}
                      </ThemedText>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  scrollContent: {
    padding: spacing.sm,
  },
  rootContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  cardContainer: {
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderBottomStartRadius: radius.md,
    borderBottomEndRadius: radius.md,
  },
  card: {
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm,
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
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: spacing.sm,
    textAlign: "center",
  },
}));

export default ThemedRadioButtonMenu;
