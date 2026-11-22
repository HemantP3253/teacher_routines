import { ErrorIcon, InfoIcon, SuccessIcon } from "@/assets/icons";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { AppLinearGradient, CustomText } from "../primitives";

export type StatusVariant = "success" | "error" | "info";

interface StatusCardProps {
  variant: StatusVariant;
  message?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const STATUS_ICONS = {
  error: ErrorIcon,
  info: InfoIcon,
  success: SuccessIcon,
} as const;

const StatusCard = ({
  variant,
  message,
  containerStyle,
  iconStyle,
  textStyle,
}: StatusCardProps) => {
  const { colors } = useUnistyles().theme;
  if (!message) return null;

  const StatusIcon = STATUS_ICONS[variant];

  const variantMeta = {
    error: "errorContent",
    info: "infoContent",
    success: "successContent",
  } as const;

  const currentMeta = variantMeta[variant];

  return (
    <AppLinearGradient
      type={variant}
      style={[styles.rootContainer, containerStyle]}
    >
      <StatusIcon fill={colors[currentMeta]} style={[styles.icon, iconStyle]} />
      <CustomText type={currentMeta} style={[textStyle]}>
        {message}
      </CustomText>
    </AppLinearGradient>
  );
};

const styles = StyleSheet.create(({ spacing, radius }) => ({
  rootContainer: {
    width: "100%",
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    gap: spacing.xs,
  },
  icon: {
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  messageText: {
    flex: 1,
    flexShrink: 1,
  },
}));

export default StatusCard;
