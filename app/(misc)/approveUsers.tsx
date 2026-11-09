import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { ActionableHeaderCard, UserActionCard } from "@/components/routines";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileStatus } from "@/types/common";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type FilterType = "Pending" | "Approved" | "Rejected" | "All";

const ApproveUsers = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const statusMap = useProfileStore((state) => state.statusMap);
  const isLoading = useProfileStore((state) => state.isLoading);
  const getProfilesByStatus = useProfileStore(
    (state) => state.getProfilesByStatus,
  );
  const updateUserStatus = useProfileStore((state) => state.updateUserStatus);

  const [showDropDown, setShowDropDown] = useState<Record<FilterType, boolean>>(
    { Pending: false, Approved: false, Rejected: false, All: false },
  );

  const toggleDropdown = async (status: FilterType) => {
    const nextState = !showDropDown[status];
    setShowDropDown((prev) => ({ ...prev, [status]: nextState }));
  };

  const getHeaderCardIcon = (status: FilterType) => {
    return showDropDown[status] ? ArrowUpIcon : ArrowDownIcon;
  };

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
    >
      <ThemedLinearGradient style={styles.rootContainer}>
        <ThemedText style={styles.headingText}>User Action Section</ThemedText>
        {(["Pending", "Approved", "Rejected", "All"] as FilterType[]).map(
          (type) => (
            <ActionableHeaderCard
              key={type}
              title={`${type} Users`}
              iconProperties={{
                Icon: getHeaderCardIcon(type),
                onPress: () => toggleDropdown(type),
              }}
              showBottomBorder={showDropDown[type]}
              isDataLoading={isLoading}
              searchButtonProperties={{
                onPress: () => {
                  router.navigate({
                    pathname: "/(misc)/searchUsers",
                    params: { title: type },
                  });
                },
              }}
            >
              {showDropDown[type] &&
                (getProfilesByStatus(
                  type === "All"
                    ? undefined
                    : (type.toString().toLowerCase() as ProfileStatus),
                ).length === 0 ? (
                  <ThemedText
                    type="text"
                    style={{
                      paddingHorizontal: 8,
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                  >
                    No {type} users found
                  </ThemedText>
                ) : (
                  getProfilesByStatus(
                    type === "All"
                      ? undefined
                      : (type.toString().toLowerCase() as ProfileStatus),
                  ).map((profile) => {
                    const status = statusMap.get(profile.id) as ProfileStatus;

                    return (
                      <UserActionCard
                        key={profile.id}
                        profile={profile}
                        status={type === "All" ? status : undefined}
                        onStatusChange={(newStatus) =>
                          updateUserStatus(profile.id, newStatus)
                        }
                      />
                    );
                  })
                ))}
            </ActionableHeaderCard>
          ),
        )}
      </ThemedLinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight ?? 0,
    height: "100%",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelText: {
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default ApproveUsers;
