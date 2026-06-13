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
        {title && <ThemedText style={styles.titleText}>{title}</ThemedText>}

        <ThemedView style={styles.cardContainer}>
          {sortedData.map((item: T) => {
            const id = getId(item);
            const label = getLabel(item);
            const subLabel = getSubLabel?.(item);

            const isChecked = selectedId === id;
            const isExpanded = expandedIds.includes(id);

            return (
              <Pressable
                key={id}
                onPress={() => {
                  setSelectedId(id);
                  onSelect?.(id);
                }}
                style={[
                  styles.card,
                  isChecked && { backgroundColor: colors.primary },
                ]}
              >
                <View style={styles.labelContainer}>
                  {isChecked ? (
                    <RadioButtonCheckedIcon fill={colors.primaryContent} />
                  ) : (
                    <RadioButtonUncheckedIcon fill={colors.neutral100} />
                  )}
                  <View style={styles.labelSubcontainer}>
                    <ThemedText
                      style={[
                        styles.labelText,
                        isChecked && {
                          color: colors.primaryContent,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {label}
                    </ThemedText>
                    {subLabel && (
                      <ArrowDownIcon
                        fill={
                          isChecked ? colors.primaryContent : colors.primary
                        }
                        transform={[{ rotate: isExpanded ? "180deg" : "0deg" }]}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleExpand(id);
                        }}
                        style={styles.arrowDropdown}
                      />
                    )}
                  </View>
                </View>

                {isExpanded && subLabel && (
                  <ThemedView style={styles.subLabelContainer}>
                    <ThemedText style={styles.subLabelText}>
                      {subLabel}
                    </ThemedText>
                  </ThemedView>
                )}
              </Pressable>
            );
          })}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    padding: theme.spacing.sm,
  },
  rootContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: theme.spacing.sm,
    color: theme.colors.primary,
    textAlign: "center",
  },
  cardContainer: {
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceElevated,
    borderBottomStartRadius: theme.radius.md,
    borderBottomEndRadius: theme.radius.md,
  },
  card: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    flexDirection: "column",
  },
  labelContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    width: "100%",
    alignItems: "center",
  },
  labelSubcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelText: {
    fontSize: 16,
    flexShrink: 1,
  },
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
  arrowDropdown: {
    padding: theme.spacing.md,
  },
}));

export default ThemedRadioButtonMenu;
