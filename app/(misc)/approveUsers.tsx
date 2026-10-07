import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { ActionableHeaderCard, UserActionCard } from "@/components/routines";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type UserStatus = "Pending" | "Approved" | "Rejected" | "All";

const approveUsers = () => {
  const { theme } = useUnistyles();
  const { users, isLoading, updateMembershipStatus } = useUserSearch();
  const colors = theme.colors;
  const router = useRouter();

  const [showDropDown, setShowDropDown] = useState<Record<UserStatus, boolean>>(
    { Pending: false, Approved: false, Rejected: false, All: false },
  );

  const toggleDropdown = async (status: UserStatus) => {
    const nextState = !showDropDown[status];
    setShowDropDown((prev) => ({ ...prev, [status]: nextState }));
  };

  const getHeaderCardIcon = (status: UserStatus) => {
    return showDropDown[status] ? ArrowUpIcon : ArrowDownIcon;
  };

  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
    >
      <ThemedLinearGradient style={styles.rootContainer}>
        <ThemedText style={styles.headingText}>User Action Section</ThemedText>
        {(["Pending", "Approved", "Rejected", "All"] as UserStatus[]).map(
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
                (users.all.length === 0 ? (
                  <ThemedText
                    style={{
                      paddingHorizontal: 8,
                      fontWeight: "700",
                      color: colors.warning,
                      fontSize: 16,
                    }}
                  >
                    No {type} users found
                  </ThemedText>
                ) : (
                  users[type.toLowerCase() as keyof typeof users].map(
                    (user) => (
                      <UserActionCard
                        user={user}
                        key={user.profile_id}
                        showStatus={type === "All"}
                        onStatusChange={(status) =>
                          updateMembershipStatus(user.profile_id, status)
                        }
                      />
                    ),
                  )
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

export default approveUsers;
