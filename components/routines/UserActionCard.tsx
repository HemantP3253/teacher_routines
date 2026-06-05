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
import { useAppTheme } from "@/contexts/ThemeContext";
import { UserActionCardProps } from "@/interfaces/interfaces";
import { userAction } from "@/services/userActionService";
import { calculateAgeByDOB } from "@/utils/dateUtils";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed";

type CardType = "Pending" | "Approved" | "Rejected";

const UserActionCard = ({
  userData,
  showStatus,
  hideIcons,
  keepExpanded,
}: UserActionCardProps) => {
  const { theme } = useAppTheme();
  const { currentCollege } = useCollegeInfo();
  const collegeCode: string = currentCollege?.college_code || "";
  const colors = theme.colors;

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
    <Pressable
      style={[
        styles.cardContainer,
        {
          borderColor: colors.accent,
          backgroundColor: colors.base200,
        },
      ]}
      onPress={() => !keepExpanded && setShowDropDown(!showDropDown)}
    >
      <View style={styles.leftColumn}>
        <View style={[styles.headerWrapper]}>
          <View style={styles.nameRow}>
            <NameIcon fill={colors.primary} />
            <ThemedText type="baseContent" style={{ paddingRight: 4 }}>
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
              <ThemedText type="baseContent">
                <ThemedText style={{ color: colors.secondary }}>@</ThemedText>
                {userData.username}
              </ThemedText>
            </View>
            <View style={styles.iconInfoContainer}>
              <AgeIcon fill={colors.primary} />
              <ThemedText type="baseContent">
                {calculateAgeByDOB(userData.date_of_birth)}
                {", " + userData.gender}
              </ThemedText>
            </View>
            <View style={styles.iconInfoContainer}>
              <PhoneIcon fill={colors.primary} />
              <ThemedText type="baseContent">{userData.phone}</ThemedText>
            </View>
            {userData?.address && (
              <View style={styles.iconInfoContainer}>
                <AddressIcon fill={colors.primary} />
                <ThemedText type="baseContent">{userData.address}</ThemedText>
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
                  fill={colors.neutral}
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
                  fill={colors.neutral}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
    alignItems: "center",
  },
  iconInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    gap: 4,
  },
  cardContainer: {
    borderWidth: 1,
    padding: 4,
    margin: 4,
    flexDirection: "row",
    borderRadius: 10,
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
    padding: 4,
    gap: 4,
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
});

export default UserActionCard;
