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
  const { theme } = useUnistyles();
  const colors = theme.colors;

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
  }, [data]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
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
                  isChecked ? { backgroundColor: colors.primary + 20 } : {},
                ]}
              >
                <View style={styles.labelContainer}>
                  {isChecked ? (
                    <RadioButtonCheckedIcon fill={colors.primary} />
                  ) : (
                    <RadioButtonUncheckedIcon fill={colors.neutral} />
                  )}
                  <View style={styles.labelContainer}>
                    <ThemedText style={styles.labelText}>{label}</ThemedText>
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
  rootContainer: {
    backgroundColor: theme.colors.base200,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 8,
    color: theme.colors.primary,
    textAlign: "center",
  },
  cardContainer: {
    gap: theme.margins.sm,
    padding: theme.margins.sm,
    backgroundColor: theme.colors.base300,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
  },
  card: {
    borderRadius: 8,
    padding: theme.margins.sm,
    flexDirection: "column",
  },
  labelContainer: {
    flexDirection: "row",
    gap: theme.margins.sm,
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
    paddingLeft: 32,
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  subLabelText: {
    fontSize: 14,
    lineHeight: 18,
  },
}));

export default ThemedRadioButtonMenu;
