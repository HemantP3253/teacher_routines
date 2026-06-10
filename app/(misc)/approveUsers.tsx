import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { ActionableHeaderCard, UserActionCard } from "@/components/routines";
import {
  ThemedLinearGradient,
  ThemedText
} from "@/components/themed";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { getCurrentAdminCollege } from "@/services/collegeService";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type UserStatus = "Pending" | "Approved" | "Rejected" | "All";

const approveUsers = () => {
  const { theme } = useUnistyles();
  const { cachedUsers, isLoading } = useUserSearch();
  const colors = theme.colors;
  const router = useRouter();
  const [collegeCode, setCollegeCode] = useState<string>("");

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

  useEffect(() => {
    const getUserCollege = async () => {
      const collegeInfo = await getCurrentAdminCollege();
      setCollegeCode(collegeInfo[0].college_code);
    };

    getUserCollege();
  }, [collegeCode]);

  const userData = useMemo(() => {
    return {
      pending: cachedUsers.filter(
        (user) =>
          !user.approved_by?.includes(collegeCode) &&
          !user.rejected_by?.includes(collegeCode),
      ),
      approved: cachedUsers.filter((user) =>
        user.approved_by?.includes(collegeCode),
      ),
      rejected: cachedUsers.filter((user) =>
        user.rejected_by?.includes(collegeCode),
      ),
      all: cachedUsers,
    };
  }, [cachedUsers, collegeCode]);

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
                (userData[type.toLowerCase() as keyof typeof userData]
                  .length === 0 ? (
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
                  userData[type.toLowerCase() as keyof typeof userData].map(
                    (user) => (
                      <UserActionCard
                        userData={user}
                        key={user.id}
                        showStatus={type === "All"}
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
