import { InfoIcon } from "@/assets/icons";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedLinearGradient from "../themed/ThemedLinearGradient";
import ThemedText from "../themed/ThemedText";

const InfoCard = ({
  infoText,
  containerStyle,
  iconStyle,
  textStyle,
}: {
  infoText: string | undefined | null;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const { colors } = useUnistyles().theme;
  if (!infoText) return null;

  return (
    <ThemedLinearGradient
      overrideColors={[...colors.infoGradient]}
      style={[styles.rootContainer, containerStyle]}
    >
      <InfoIcon
        height={28}
        width={28}
        style={[styles.infoIcon, iconStyle]}
        fill={colors.infoContent}
      />
      <ThemedText type="infoContent" style={[textStyle]}>
        {infoText}
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

export default InfoCard;
