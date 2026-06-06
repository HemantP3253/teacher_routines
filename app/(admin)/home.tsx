import { ArrowForwardIcon } from "@/assets/icons";
import { ActionableHeaderCard, UserActionCard } from "@/components/routines";
import { ThemedStatusBar, ThemedText, ThemedView } from "@/components/themed";
import { useCollegeInfo } from "@/contexts/CollegeInfoContext";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { getGreeting } from "@/utils/stringUtils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StatusBar } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

// 1. FIX: Capitalize to "Home" so Expo Router detects the valid component layout
const Home = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const router = useRouter();
  const { currentCollege } = useCollegeInfo();
  const { cachedUsers, isLoading } = useUserSearch();

  // 2. FIX: Remove the function reference from the dependency array
  const greeting = useMemo(() => {
    return getGreeting();
  }, []);

  const unapprovedUsers = useMemo(() => {
    if (!currentCollege?.college_code) return [];

    return cachedUsers.filter(
      (user) =>
        !user.approved_by?.includes(currentCollege?.college_code) &&
        !user.rejected_by?.includes(currentCollege?.college_code),
    );
  }, [cachedUsers, currentCollege]);

  return (
    <ThemedView style={styles.rootContainer}>
      <ThemedStatusBar />
      <ThemedText type="baseContent" style={styles.headingText}>
        {greeting}, admin!
      </ThemedText>
      <ThemedText type="baseContent" style={{ fontSize: 16 }}>
        Ready to assign routines?{" "}
        <ThemedText
          style={{ color: colors.primary }}
          onPress={() => router.push("/(admin)/routines")}
        >
          Click here!
        </ThemedText>
      </ThemedText>

      {/* Approve Users Section */}
      <ActionableHeaderCard
        title="Pending Users"
        iconProperties={{
          Icon: ArrowForwardIcon,
          onPress: () => router.push("/(misc)/approveUsers"),
        }}
        isDataLoading={isLoading}
      >
        {unapprovedUsers?.length === 0 ? (
          <ThemedText
            style={{
              paddingHorizontal: 8,
              fontWeight: "700",
              color: colors.warning,
              fontSize: 16,
            }}
          >
            No pending users found
          </ThemedText>
        ) : (
          unapprovedUsers
            ?.sort((a, b) => {
              if (a < b) return 1;
              if (a > b) return -1;
              return 0;
            })
            .slice(0, 3)
            .map((user) => <UserActionCard userData={user} key={user.id} />)
        )}
        {unapprovedUsers && unapprovedUsers?.length > 3 && (
          <Pressable onPress={() => null}>
            <ThemedText>+{unapprovedUsers?.length - 3} more</ThemedText>
          </Pressable>
        )}
      </ActionableHeaderCard>
    </ThemedView>
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

// 3. FIX: Export your capitalized component
export default Home;
