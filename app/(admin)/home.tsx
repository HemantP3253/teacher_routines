import { ArrowForwardIcon } from "@/assets/icons";
import { ActionableHeaderCard, UserActionCard } from "@/components/routines";
import {
  ThemedLinearGradient,
  ThemedStatusBar,
  ThemedText,
} from "@/components/themed";
import { useDynamicGreeting } from "@/hooks/useDynamicGreeting";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileStatus } from "@/types/common";
import { useRouter } from "expo-router";
import { Pressable, StatusBar } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const Home = () => {
  const router = useRouter();
  const greeting = useDynamicGreeting();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const pendingProfiles = useProfileStore((state) => state.pendingProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const isLoading = useProfileStore((state) => state.isLoading);
  const updateUserStatus = useProfileStore((state) => state.updateUserStatus);

  return (
    <ThemedLinearGradient style={styles.rootContainer}>
      <ThemedStatusBar />
      <ThemedText type="text" style={styles.headingText}>
        {greeting}, admin!
      </ThemedText>
      <ThemedText type="text" style={{ fontSize: 16 }}>
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
          height: 24,
          width: 24,
        }}
        isDataLoading={isLoading}
        showBottomBorder
      >
        {pendingProfiles.length === 0 ? (
          <ThemedText
            type="text"
            style={{
              paddingHorizontal: 4,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            No pending users found
          </ThemedText>
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
            <ThemedText style={{ fontWeight: "600", fontSize: 16 }}>
              + {pendingProfiles.length - 3} more
            </ThemedText>
          </Pressable>
        )}
      </ActionableHeaderCard>
    </ThemedLinearGradient>
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
