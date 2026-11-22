import { CloseIcon, ExclamationIcon, SuccessIcon } from "@/assets/icons";
import { CustomText } from "@/components/ui";
import { capitalizeFirstLettter } from "@/utils/stringUtils";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface UserStatusBadgeProps {
  status: string;
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
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
      <CustomText style={{ color: statusColor }}>
        {capitalizeFirstLettter(status)}
      </CustomText>
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

export default UserStatusBadge;
