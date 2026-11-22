import { ArrowForwardIcon } from "@/assets/icons";
import UserActionCard from "@/components/features/userAction";
import {
  ActionableHeaderCard,
  AppLinearGradient,
  AppStatusBar,
  CustomText,
} from "@/components/ui";
import { useDynamicGreeting } from "@/hooks/useDynamicGreeting";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileStatus } from "@/types/common";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StatusBar } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const Home = () => {
  const router = useRouter();
  const greeting = useDynamicGreeting();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const allProfiles = useProfileStore((state) => state.allProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const isLoading = useProfileStore((state) => state.isLoading);
  const updateUserStatus = useProfileStore((state) => state.updateUserStatus);

  const pendingProfiles = useMemo(
    () =>
      allProfiles.filter((profile) => statusMap.get(profile.id) === "pending"),
    [allProfiles, statusMap],
  );

  return (
    <AppLinearGradient style={styles.rootContainer}>
      <AppStatusBar />
      <CustomText type="text" style={styles.headingText}>
        {greeting}, admin!
      </CustomText>
      <CustomText type="text" style={{ fontSize: 16 }}>
        Ready to assign routines?{" "}
        <CustomText
          style={{ color: colors.primary }}
          onPress={() => router.push("/(admin)/routines")}
        >
          Click here!
        </CustomText>
      </CustomText>

      {/* Approve Users Section */}
      <ActionableHeaderCard
        title="Pending Users"
        iconProperties={{
          Icon: ArrowForwardIcon,
          onPress: () => router.push("/(misc)/approveUsers"),
          height: 24,
          width: 24,
        }}
        isDataLoading={isLoading}
        showBottomBorder
      >
        {pendingProfiles.length === 0 ? (
          <CustomText
            type="text"
            style={{
              paddingHorizontal: 4,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            No pending users found
          </CustomText>
        ) : (
          pendingProfiles.slice(0, 3).map((profile) => {
            const status = statusMap.get(profile.id) as ProfileStatus;

            return (
              <UserActionCard
                key={profile.id}
                profile={profile}
                status={status}
                onStatusChange={(newStatus) =>
                  updateUserStatus(profile.id, newStatus)
                }
              />
            );
          })
        )}
        {pendingProfiles.length > 3 && (
          <Pressable
            onPress={() => router.push("/(misc)/approveUsers")}
            style={{ alignItems: "flex-end", padding: 8 }}
          >
            <CustomText style={{ fontWeight: "600", fontSize: 16 }}>
              + {pendingProfiles.length - 3} more
            </CustomText>
          </Pressable>
        )}
      </ActionableHeaderCard>
    </AppLinearGradient>
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

export default Home;
