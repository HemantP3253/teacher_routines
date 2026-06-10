import {
  AddressIcon,
  AgeIcon,
  ApproveIcon,
  ArrowDownIcon,
  ClearIcon,
  CloseIcon,
  ExclamationIcon,
  NameIcon,
  PhoneIcon,
  RejectIcon,
  SuccessIcon,
  UsernameIcon,
} from "@/assets/icons";
import { useCollegeInfo } from "@/contexts/CollegeInfoContext";
import { UserActionCardProps } from "@/interfaces/interfaces";
import { userAction } from "@/services/userActionService";
import { calculateAgeByDOB } from "@/utils/dateUtils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedLinearGradient, ThemedText } from "../themed";

type CardType = "Pending" | "Approved" | "Rejected";

const UserActionCard = ({
  userData,
  showStatus,
  hideIcons,
  keepExpanded,
}: UserActionCardProps) => {
  const { colors } = useUnistyles().theme;
  const { currentCollege } = useCollegeInfo();
  const collegeCode: string = currentCollege?.college_code || "";

  const [showDropDown, setShowDropDown] = useState<boolean>(
    keepExpanded || false,
  );
  const cardStatus: CardType = userData?.approved_by?.includes(
    currentCollege?.college_code ?? "",
  )
    ? "Approved"
    : userData?.rejected_by?.includes(currentCollege?.college_code ?? "")
      ? "Rejected"
      : "Pending";

  const statusColor =
    cardStatus === "Pending"
      ? colors.warning
      : cardStatus === "Approved"
        ? colors.success
        : colors.error;

  const StatusCard = () => {
    return (
      <View style={styles.statusRow}>
        {cardStatus === "Pending" ? (
          <ExclamationIcon fill={statusColor} />
        ) : cardStatus === "Approved" ? (
          <SuccessIcon fill={statusColor} />
        ) : (
          <CloseIcon fill={statusColor} />
        )}
        <ThemedText style={{ color: statusColor }}>{cardStatus}</ThemedText>
      </View>
    );
  };

  return (
    <Pressable onPress={() => !keepExpanded && setShowDropDown(!showDropDown)}>
      <ThemedLinearGradient
        type="surface"
        end={{ x: 0, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.leftColumn}>
          <View style={[styles.headerWrapper]}>
            <View style={styles.nameRow}>
              <NameIcon fill={colors.primary} />
              <ThemedText type="text" style={{ paddingRight: 4 }}>
                {userData.full_name}
              </ThemedText>
              {!keepExpanded && (
                <ArrowDownIcon
                  transform={[{ rotate: showDropDown ? "180deg" : "0deg" }]}
                  fill={colors.primary}
                />
              )}
            </View>
            {!showDropDown && showStatus && <StatusCard />}
          </View>
          {showDropDown && (
            <View>
              <View style={styles.iconInfoContainer}>
                <UsernameIcon fill={colors.primary} />
                <ThemedText type="text">
                  <ThemedText style={{ color: colors.secondary }}>@</ThemedText>
                  {userData.username}
                </ThemedText>
              </View>
              <View style={styles.iconInfoContainer}>
                <AgeIcon fill={colors.primary} />
                <ThemedText type="text">
                  {calculateAgeByDOB(userData.date_of_birth)}
                  {", " + userData.gender}
                </ThemedText>
              </View>
              <View style={styles.iconInfoContainer}>
                <PhoneIcon fill={colors.primary} />
                <ThemedText type="text">{userData.phone}</ThemedText>
              </View>
              {userData?.address && (
                <View style={styles.iconInfoContainer}>
                  <AddressIcon fill={colors.primary} />
                  <ThemedText type="text">{userData.address}</ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.rightColumn}>
          {showStatus && showDropDown && <StatusCard />}
          <View style={styles.actionButtonsContainer}>
            {!hideIcons && (
              <>
                {cardStatus === "Approved" ? (
                  <ClearIcon
                    fill={colors.neutral500}
                    height={32}
                    width={32}
                    onPress={() => userAction(userData, collegeCode, "clear")}
                  />
                ) : (
                  <ApproveIcon
                    height={32}
                    width={32}
                    fill={colors.success}
                    onPress={() => userAction(userData, collegeCode, "approve")}
                  />
                )}
                {cardStatus === "Rejected" ? (
                  <ClearIcon
                    height={32}
                    width={32}
                    fill={colors.neutral500}
                    onPress={() => userAction(userData, collegeCode, "clear")}
                  />
                ) : (
                  <RejectIcon
                    height={32}
                    width={32}
                    fill={colors.error}
                    onPress={() => userAction(userData, collegeCode, "reject")}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </ThemedLinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  actionButtonsContainer: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  iconInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  cardContainer: {
    borderWidth: 1,
    padding: theme.spacing.xs,
    margin: theme.spacing.xs,
    flexDirection: "row",
    borderRadius: 10,
    borderColor: theme.colors.border,
    justifyContent: "space-between",
  },
  leftColumn: {
    justifyContent: "center",
  },
  rightColumn: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerWrapper: {
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
}));

export default UserActionCard;
