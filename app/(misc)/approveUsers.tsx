import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import UserActionCard from "@/components/admin/users";
import { ActionableHeaderCard } from "@/components/common";
import { ThemedLinearGradient, ThemedText } from "@/components/themed";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileStatus, ThemeColors } from "@/types/common";
import { LocalProfilesData } from "@/types/localDbTypes";
import { ImperativeRouter, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState, useTransition } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

type FilterType = "Pending" | "Approved" | "Rejected" | "All";
const FILTER_TYPES: FilterType[] = ["Approved", "Pending", "Rejected", "All"];

interface MemoizedUserCardProps {
  profile: LocalProfilesData;
  onStatusChange: (id: string, profile: ProfileStatus) => void;
}

const MemoizedUserCard = memo(function MemoizedUserCard({
  profile,
  onStatusChange,
}: MemoizedUserCardProps) {
  const status = useProfileStore(
    useCallback(
      (state) => state.statusMap.get(profile.id) as ProfileStatus,
      [profile.id],
    ),
  );
  return (
    <UserActionCard
      profile={profile}
      status={status}
      onStatusChange={(newStatus) => onStatusChange(profile.id, newStatus)}
    />
  );
});

interface FilterAccordionItemProps {
  type: FilterType;
  colors: ThemeColors;
  isLoading: boolean;
  updateUserStatus: (id: string, status: ProfileStatus) => void;
  router: ImperativeRouter;
}

const FilterAccordionItem = memo(function FilterAccordionItem({
  type,
  colors,
  isLoading,
  updateUserStatus,
  router,
}: FilterAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const getProfilesByStatus = useProfileStore(
    (state) => state.getProfilesByStatus,
  );

  const profiles = useMemo(() => {
    const status =
      type === "All" ? undefined : (type.toLowerCase() as ProfileStatus);
    return getProfilesByStatus(status);
  }, [type, getProfilesByStatus]);

  const toggleDropdown = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsContentReady(false);

      requestAnimationFrame(() => {
        startTransition(() => {
          setIsContentReady(true);
        });
      });
    } else {
      setIsExpanded(false);
      setIsContentReady(false);
    }
  }, [isExpanded]);

  return (
    <ActionableHeaderCard
      title={`${type} Users`}
      iconProperties={{
        Icon: isExpanded ? ArrowUpIcon : ArrowDownIcon,
        onPress: toggleDropdown,
        fill: colors.primary,
        height: 24,
        width: 24,
      }}
      showBottomBorder={isExpanded}
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
      {isExpanded && (
        <View
          style={{
            height: 260,
            width: "100%",
            overflow: "hidden",
            justifyContent: isContentReady ? "flex-start" : "center",
            alignItems: isContentReady ? "stretch" : "center",
          }}
        >
          {!isContentReady ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{ paddingVertical: 4 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {profiles.length === 0 ? (
                <ThemedText
                  type="text"
                  style={{
                    padding: 12,
                    fontWeight: "500",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  No {type} users found
                </ThemedText>
              ) : (
                profiles.map((profile) => (
                  <MemoizedUserCard
                    key={profile.id}
                    profile={profile}
                    onStatusChange={updateUserStatus}
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>
      )}
    </ActionableHeaderCard>
  );
});

const ApproveUsers = () => {
  const router = useRouter();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const isLoading = useProfileStore((state) => state.isLoading);
  const updateUserStatus = useProfileStore((state) => state.updateUserStatus);

  return (
    <ThemedLinearGradient style={styles.rootContainer}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.headingText}>User Action Section</ThemedText>

        {FILTER_TYPES.map((type) => (
          <FilterAccordionItem
            key={type}
            type={type}
            colors={colors}
            isLoading={isLoading}
            updateUserStatus={updateUserStatus}
            router={router}
          />
        ))}
      </ScrollView>
    </ThemedLinearGradient>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight ?? 0,
    flex: 1,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
});

export default ApproveUsers;
