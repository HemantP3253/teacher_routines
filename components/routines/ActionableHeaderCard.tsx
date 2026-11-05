import { SearchIcon } from "@/assets/icons";
import { IconProperties } from "@/types/common";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Spacer } from "../common";
import { ThemedLinearGradient, ThemedText } from "../themed";

interface ActionableHeaderCardProps {
  title: string;
  IconBeforeText?: IconProperties["Icon"];
  iconProperties: IconProperties;
  searchButtonProperties?: {
    onPress: () => void;
  };
  showBottomBorder?: boolean;
  isDataLoading?: boolean;
  children?: ReactNode;
  summaryText?: string;
}

const ActionableHeaderCard = ({
  title,
  iconProperties,
  showBottomBorder = false,
  isDataLoading = false,
  searchButtonProperties,
  children,
  IconBeforeText,
  summaryText,
}: ActionableHeaderCardProps) => {
  const { Icon, onPress, height, width, size } = iconProperties;
  const { colors } = useUnistyles().theme;
  return (
    <Pressable onPress={onPress}>
      <ThemedLinearGradient
        type="surface"
        end={{ x: 0, y: 1 }}
        style={styles.rootContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {IconBeforeText && <IconBeforeText fill={colors.text} />}
            <ThemedText style={styles.title}>{title}</ThemedText>
          </View>
          <View style={styles.iconContainer}>
            {searchButtonProperties && (
              <SearchIcon
                onPress={searchButtonProperties.onPress}
                fill={colors.textSecondary}
              />
            )}
            {Icon && (
              <Icon
                height={height}
                width={width}
                size={size}
                onPress={onPress}
                style={styles.secondaryIcon}
                fill={colors.primary}
              />
            )}
          </View>
        </View>
        {showBottomBorder && (
          <Spacer useFullWidth line={{ type: "border" }} horizontal />
        )}
        {isDataLoading ? <ActivityIndicator size={"large"} /> : children}
        {summaryText && (
          <ThemedText style={styles.summaryText}>{summaryText}</ThemedText>
        )}
      </ThemedLinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create(({ colors, radius, spacing }) => ({
  rootContainer: {
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.md,
    margin: spacing.sm,
    alignItems: "stretch",
    padding: spacing.md,
    borderColor: colors.border,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    paddingLeft: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  iconContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    opacity: 0.7,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  secondaryIcon: {
    marginRight: spacing.sm,
  },
}));

export default ActionableHeaderCard;
