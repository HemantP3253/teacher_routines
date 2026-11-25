import { IconProperties } from "@/types/common";
import { Pressable, PressableProps, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Spacer } from "../../layout";
import { CustomText } from "../../primitives";

type Description =
  | { target?: string; description?: never }
  | { target?: never; description: string };

interface ModalMenuPressableProps extends PressableProps {
  title: string;
  iconProperties: IconProperties;
  selectedItem?: string | null;
  onPress: () => void;
}

const ModalMenuPressable = ({
  title,
  target,
  selectedItem,
  iconProperties,
  description,
  style,
  ...props
}: ModalMenuPressableProps & Description) => {
  const { colors } = useUnistyles().theme;
  const Icon = iconProperties.Icon;
  const noSelectionDescription =
    description ??
    (target ? `No ${target.toLowerCase()} selected` : "No item selected");

  return (
    <Pressable
      style={(state) => [
        state.pressed && styles.pressedContainer,
        styles.rootContainer,
        selectedItem && {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {Icon && (
        <Icon
          size={24}
          fill={selectedItem ? colors.primary : colors.textSecondary}
        />
      )}
      <View style={styles.contentContainer}>
        <CustomText type="text" style={styles.titleText}>
          {title}
        </CustomText>

        <Spacer
          line={{ type: selectedItem ? "onPrimaryContainer" : "divider" }}
          horizontal
          useFullWidth
        />

        <CustomText
          style={[
            styles.itemText,
            !selectedItem && {
              color: colors.textSecondary,
              opacity: 0.55,
              fontWeight: "400",
              fontStyle: "italic",
            },
          ]}
        >
          {selectedItem || noSelectionDescription}
        </CustomText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius, typography }) => ({
  rootContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.lg,
  },
  pressedContainer: { transform: [{ scale: 0.98 }], opacity: 0.85 },
  contentContainer: { flex: 1, paddingHorizontal: spacing.sm },
  titleText: {
    ...typography.caption,
    flexWrap: "wrap",
    opacity: 0.9,
    fontWeight: "700",
  },
  itemText: {
    ...typography.body,
    color: colors.primary,
    flexWrap: "wrap",
    fontWeight: "700",
  },
  selectedItemText: {},
}));

export default ModalMenuPressable;
