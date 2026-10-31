import { CloseIcon, ExclamationIcon, SuccessIcon } from "@/assets/icons";
import { capitalizeFirstLettter } from "@/utils/stringUtils";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedText } from "../themed";

interface StatusCardProps {
  status: string;
}

export const StatusCard = ({ status }: StatusCardProps) => {
  const { colors } = useUnistyles().theme;

  const statusColor =
    status === "pending"
      ? colors.neutral400
      : status === "approved"
        ? colors.success
        : colors.error;

  return (
    <View style={styles.statusRow}>
      {status === "pending" ? (
        <ExclamationIcon fill={statusColor} />
      ) : status === "approved" ? (
        <SuccessIcon fill={statusColor} />
      ) : (
        <CloseIcon fill={statusColor} />
      )}
      <ThemedText style={{ color: statusColor }}>
        {capitalizeFirstLettter(status)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create(({ spacing }) => ({
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: spacing.sm,
    gap: spacing.xs,
  },
}));
