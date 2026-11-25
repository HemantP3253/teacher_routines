import { CloseIcon } from "@/assets/icons";
import { IconProperties } from "@/types/common";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Spacer } from "../../layout";
import { AppLinearGradient, CustomText } from "../../primitives";

interface TagChipProps extends PressableProps {
  label: string;
  selected?: boolean;
  Icon?: IconProperties["Icon"];
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  fill?: boolean;
  dottedBorder?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  removeIconProperties?: IconProperties;
  onRemoveIconPress?:
    | ((event: GestureResponderEvent) => void)
    | null
    | undefined;
}

const TagChip = ({
  label = "Item",
  selected = false,
  onPress,
  contentStyle,
  fill = true,
  Icon,
  dottedBorder,
  style,
  removeIconProperties,
  onRemoveIconPress,
  ...props
}: TagChipProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const isDotted = dottedBorder && !fill;

  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        styles.rootContainer,
        selected && !isDotted && styles.selectedRootContainer,
        isDotted && !selected && styles.dottedRootContainer,
      ]}
      {...props}
    >
      <AppLinearGradient
        style={[styles.chipBase, contentStyle]}
        type={selected ? "primary" : "surfaceElevated"}
        end={{ x: 0, y: 1 }}
      >
        {Icon && (
          <View style={styles.iconWrapper}>
            <Icon
              fill={selected ? colors.primaryContent : colors.textSecondary}
            />
          </View>
        )}
        <CustomText type="text" style={[styles.labelText]} numberOfLines={1}>
          {label}
        </CustomText>

        {onRemoveIconPress && (
          <>
            <Spacer
              line={{ type: "divider", size: 1 }}
              style={styles.removeDivider}
            />
            <Pressable
              onPress={onRemoveIconPress}
              hitSlop={8}
              accessibilityRole="button"
              style={styles.removeButton}
            >
              <CloseIcon
                size={14}
                fill={selected ? colors.primaryContent : colors.textSecondary}
                {...removeIconProperties}
              />
            </Pressable>
          </>
        )}
      </AppLinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  rootContainer: {
    height: 40,
    margin: theme.spacing.xs,
    borderColor: theme.colors.borderMuted,
    borderWidth: 1,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedRootContainer: {
    borderColor: theme.colors.primary,
  },
  dottedRootContainer: {
    borderColor: theme.colors.primary,
    borderStyle: "dotted",
    borderWidth: 1.5,
  },
  chipBase: {
    borderRadius: theme.radius.full,
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  removeDivider: {
    height: 24,
    marginHorizontal: theme.spacing.sm,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginRight: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
}));

export default TagChip;
