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
        style={[styles.infoIcon, iconStyle]}
        fill={colors.infoContent}
      />
      <ThemedText
        type="infoContent"
        style={[textStyle, { flexWrap: "wrap", flex: 1 }]}
      >
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
    width: "100%",
    padding: spacing.sm,
    gap: spacing.xs,
  },
  infoIcon: {
    alignSelf: "flex-start",
  },
}));

export default InfoCard;
