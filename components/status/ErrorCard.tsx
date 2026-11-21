import { ErrorIcon } from "@/assets/icons";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedLinearGradient from "../themed/ThemedLinearGradient";
import ThemedText from "../themed/ThemedText";

const ErrorCard = ({
  errorText,
  containerStyle,
  iconStyle,
  textStyle,
}: {
  errorText: string | undefined | null;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const { colors } = useUnistyles().theme;
  if (!errorText) return null;

  return (
    <ThemedLinearGradient
      overrideColors={[...colors.errorGradient]}
      style={[styles.rootContainer, containerStyle]}
    >
      <ErrorIcon
        fill={colors.errorContent}
        style={[styles.infoIcon, iconStyle]}
      />
      <ThemedText type="errorContent" style={[textStyle]}>
        {errorText}
      </ThemedText>
    </ThemedLinearGradient>
  );
};

const styles = StyleSheet.create(({ spacing, radius }) => ({
  rootContainer: {
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.sm,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  infoIcon: {
    alignSelf: "flex-start",
  },
}));

export default ErrorCard;
