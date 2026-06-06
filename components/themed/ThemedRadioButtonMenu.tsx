import {
  ArrowDownIcon,
  RadioButtonCheckedIcon,
  RadioButtonUncheckedIcon,
} from "@/assets/icons";
import { ThemedCheckboxProps } from "@/interfaces/interfaces";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Spacer } from "../common";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedRadioButton = <T,>({
  data,
  initialSelection = [],
  minSelection = 0,
  onSubmit,
  title,
  getId,
  getLabel,
  getSubLabel,
}: ThemedCheckboxProps<T>) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [selectedId, setSelectedId] = useState<string>();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
  }, [data]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

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

      <Spacer lineVisible />

      <ThemedView style={{ gap: 4 }}>
        {sortedData.map((item: T) => {
          const id = getId(item);
          const label = getLabel(item);
          const subLabel = getSubLabel?.(item);

          const isChecked = selectedId === id;
          const isExpanded = expandedIds.includes(id);

          return (
            <Pressable
              key={id}
              onPress={() => setSelectedId(id)}
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
                  <RadioButtonCheckedIcon fill={colors.primary} />
                ) : (
                  <RadioButtonUncheckedIcon fill={colors.neutral} />
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
      </ThemedView>
    </ScrollView>
  );
};

export default ThemedRadioButton;
