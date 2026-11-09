import {
  AddressIcon,
  AgeIcon,
  ApproveIcon,
  ArrowDownIcon,
  ClearIcon,
  NameIcon,
  PhoneIcon,
  RejectIcon,
  UsernameIcon,
} from "@/assets/icons";
import { ProfileStatus } from "@/types/common";
import { LocalProfilesData } from "@/types/localDbTypes";
import { calculateAgeByDOB } from "@/utils/dateUtils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedLinearGradient, ThemedText } from "../themed";
import StatusCard from "./StatusCard";

interface UserActionCardProps {
  profile: LocalProfilesData;
  status?: ProfileStatus;
  hideIcons?: boolean;
  keepExpanded?: boolean;
  onPress?: () => void;
  onStatusChange?: (status: "approved" | "rejected" | "pending") => void;
}

const UserActionCard = ({
  profile,
  status,
  hideIcons,
  keepExpanded,
  onPress,
  onStatusChange,
}: UserActionCardProps) => {
  const { colors } = useUnistyles().theme;

  const [showDropDown, setShowDropDown] = useState<boolean>(
    keepExpanded || false,
  );

  const iconColour = colors.primary;

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        !keepExpanded && setShowDropDown(!showDropDown);
      }}
    >
      <ThemedLinearGradient
        type="surface"
        end={{ x: 0, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.leftColumn}>
          <View style={[styles.headerWrapper]}>
            <View style={styles.nameRow}>
              <NameIcon fill={iconColour} />
              <ThemedText type="text" style={{ paddingRight: 4 }}>
                {profile.fullName}
              </ThemedText>
              {!keepExpanded && (
                <ArrowDownIcon
                  transform={[{ rotate: showDropDown ? "180deg" : "0deg" }]}
                  fill={iconColour}
                />
              )}
            </View>
            {!showDropDown && status && <StatusCard status={status} />}
          </View>
          {showDropDown && (
            <View>
              <View style={styles.iconInfoContainer}>
                <UsernameIcon fill={iconColour} />
                <ThemedText type="text">
                  <ThemedText style={styles.username}>@</ThemedText>
                  {profile.username}
                </ThemedText>
              </View>
              <View style={styles.iconInfoContainer}>
                <AgeIcon fill={iconColour} />
                <ThemedText type="text">
                  {calculateAgeByDOB(profile.dateOfBirth)}
                  {", " + profile.gender}
                </ThemedText>
              </View>
              <View style={styles.iconInfoContainer}>
                <PhoneIcon fill={iconColour} />
                <ThemedText type="text">{profile.phone}</ThemedText>
              </View>
              {profile?.address && (
                <View style={styles.iconInfoContainer}>
                  <AddressIcon fill={iconColour} />
                  <ThemedText type="text">{profile.address}</ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.rightColumn}>
          {status && showDropDown && <StatusCard status={status} />}
          <View style={styles.actionButtonsContainer}>
            {!hideIcons && (
              <>
                {status === "approved" ? (
                  <ClearIcon
                    fill={colors.neutral400}
                    height={32}
                    width={32}
                    onPress={() => onStatusChange?.("pending")}
                  />
                ) : (
                  <ApproveIcon
                    height={32}
                    width={32}
                    fill={colors.success}
                    onPress={() => onStatusChange?.("approved")}
                  />
                )}
                {status === "rejected" ? (
                  <ClearIcon
                    height={32}
                    width={32}
                    fill={colors.neutral400}
                    onPress={() => onStatusChange?.("pending")}
                  />
                ) : (
                  <RejectIcon
                    height={32}
                    width={32}
                    fill={colors.error}
                    onPress={() => onStatusChange?.("rejected")}
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

  cardContainer: {
    borderWidth: 1,
    padding: theme.spacing.xs,
    margin: theme.spacing.xs,
    flexDirection: "row",
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.border,
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
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
  username: {
    color: theme.colors.secondary,
  },
}));

export default UserActionCard;
