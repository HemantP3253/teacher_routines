import { ThemedText } from "@/components/themed";
import { TagChipProps } from "@/interfaces/interfaces";
import { Pressable, StyleSheet, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const TagChip = ({
  label = "Hello",
  selected = false,
  onPress,
  fill = true,
  Icon,
  dottedBorder,
}: TagChipProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const getColors = () => {
    if (fill) {
      if (selected) {
        return {
          background: colors.primary,
          border: colors.primary,
          text: colors.primaryContent,
        };
      }
      return {
        background: `${colors.primary}5F`,
        border: "transparent",
        text: colors.baseContent,
      };
    } else {
      return {
        background: selected ? `${colors.primary}10` : `${colors.primary}1F`,
        border: colors.primary,
        text: colors.primary,
      };
    }
  };

  const currentStyles = getColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: currentStyles.background,
          borderColor: currentStyles.border,
          borderStyle: dottedBorder && !fill ? "dotted" : "solid",
        },
        styles.chipBase,
      ]}
    >
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon fill={colors.primary} />
        </View>
      )}
      <ThemedText
        style={[styles.labelText, { color: currentStyles.text }]}
        numberOfLines={1}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chipBase: {
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "center",
    margin: 4,
  },
  iconWrapper: {
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default TagChip;
