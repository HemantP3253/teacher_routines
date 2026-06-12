import { SearchIcon } from "@/assets/icons";
import { ActionableHeaderCardProps } from "@/interfaces/interfaces";
import { ActivityIndicator, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedLinearGradient, ThemedText } from "../themed";

const ActionableHeaderCard = ({
  title,
  iconProperties,
  showBottomBorder = false,
  isDataLoading = true,
  searchButtonProperties,
  children,
  IconBeforeText,
  summaryText,
}: ActionableHeaderCardProps) => {
  const { Icon, onPress, height, width } = iconProperties;
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
            <Icon
              height={height ?? 24}
              width={width ?? 24}
              onPress={onPress}
              style={styles.secondaryIcon}
              fill={colors.primary}
            />
          </View>
        </View>
        {showBottomBorder && <View style={styles.bottomBorder}></View>}
        {isDataLoading ? <ActivityIndicator size={"large"} /> : children}
        {summaryText && (
          <ThemedText style={styles.summaryText}>{summaryText}</ThemedText>
        )}
      </ThemedLinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  rootContainer: {
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    margin: theme.spacing.sm,
    padding: theme.spacing.md,
    borderColor: theme.colors.border,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
    paddingLeft: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  iconContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    paddingHorizontal: theme.spacing.sm,
    opacity: 0.7,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  bottomBorder: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    margin: theme.spacing.sm,
  },
  secondaryIcon: {
    marginRight: theme.spacing.sm,
  },
}));

export default ActionableHeaderCard;
