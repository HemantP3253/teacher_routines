import { SearchIcon } from "@/assets/icons";
import TagChip from "@/components/common/DynamicTagSelect/TagChip";
import { UserActionCard } from "@/components/routines";
import {
  ThemedLinearGradient,
  ThemedText,
  ThemedTextInput,
} from "@/components/themed";
import { useProfileStore } from "@/store/useProfileStore";
import { ProfileStatus } from "@/types/common";
import { LocalProfilesData } from "@/types/localDbTypes";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type searchType = "Name" | "Username" | "Phone";

const SearchUsers = () => {
  const { title } = useLocalSearchParams();
  const { colors } = useUnistyles().theme;
  const statusMap = useProfileStore((state) => state.statusMap);
  const isLoading = useProfileStore((state) => state.isLoading);
  const getProfilesByStatus = useProfileStore(
    (state) => state.getProfilesByStatus,
  );
  const updateUserStatus = useProfileStore((state) => state.updateUserStatus);

  const [searchParams, setSearchParams] = useState<{
    searchText: string;
    searchType: searchType;
  }>({ searchText: "", searchType: "Name" });
  const [searchError, setSearchError] = useState<string>("");

  const handleSearchSubmit = () => {
    if (
      !searchParams.searchText ||
      searchParams.searchText === "" ||
      searchParams.searchText?.length < 3
    ) {
      setSearchError("Search text must be at least 3 letters");
    }
  };

  const getUserData = () => {
    if (title === "All" || !title) return getProfilesByStatus();
    else
      return getProfilesByStatus(
        title.toString().toLowerCase() as ProfileStatus,
      );
  };

  const getSearchValue = useCallback(
    (profile: LocalProfilesData) => {
      switch (searchParams.searchType) {
        case "Name":
          return profile.fullName;
        case "Username":
          return profile.username;
        case "Phone":
          return profile.phone;
      }
    },
    [searchParams.searchType],
  );

  const filteredUsers = (() => {
    const query = searchParams.searchText.trim().toLowerCase();

    if (query.length < 3 || !getUserData()?.length) return [];

    return getUserData().filter(
      (user) => getSearchValue(user)?.toLowerCase().includes(query) ?? false,
    );
  })();

  return (
    <ThemedLinearGradient style={styles.rootContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <ThemedText type="text" style={styles.headingText}>
            {title ? `Search ${title} Users` : "Search Users"}
          </ThemedText>
          <ThemedTextInput
            title={`Search by ${searchParams.searchType}`}
            Icon={SearchIcon}
            value={searchParams.searchText}
            errorText={searchError}
            onChangeText={(text) => {
              setSearchParams((prev) => ({ ...prev, searchText: text }));
              setSearchError("");
            }}
            autoCapitalize="words"
            returnKeyType="search"
            onSubmitEditing={() => handleSearchSubmit()}
          />

          <ThemedText style={styles.searchByText} type="text">
            Search By:
          </ThemedText>

          <View style={styles.searchByContainer}>
            {(["Name", "Username", "Phone"] as searchType[]).map((type) => (
              <TagChip
                style={{ flex: 1 }}
                contentStyle={{ width: "100%" }}
                key={type}
                label={type}
                fill={searchParams?.searchType === type}
                selected={searchParams.searchType === type}
                onPress={() =>
                  setSearchParams((prev) => ({ ...prev, searchType: type }))
                }
              />
            ))}
          </View>
          <View>
            {isLoading ? (
              <ActivityIndicator
                size={"large"}
                color={colors.primary}
                style={{ marginTop: 24 }}
              />
            ) : searchParams.searchText.trim().length >= 3 &&
              filteredUsers?.length === 0 ? (
              <ThemedText style={styles.searchHintText} type="text">
                {`No results found for "${searchParams.searchText}"`}
              </ThemedText>
            ) : searchParams.searchText.trim().length < 3 ? (
              <ThemedText style={styles.searchHintText} type="text">
                Type at least 3 characters to search...
              </ThemedText>
            ) : (
              filteredUsers?.map((profile) => {
                const status = statusMap.get(profile.id) as ProfileStatus;

                return (
                  <UserActionCard
                    profile={profile}
                    status={!title || title === "All" ? status : undefined}
                    key={profile.id}
                    onStatusChange={(newStatus) =>
                      updateUserStatus(profile.id, newStatus)
                    }
                  />
                );
              })
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedLinearGradient>
  );
};

const styles = StyleSheet.create(({ spacing }) => ({
  rootContainer: {
    paddingTop: StatusBar.currentHeight,
    ...StyleSheet.absoluteFill,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchByText: { padding: spacing.sm, fontWeight: "bold", fontSize: 16 },
  searchByContainer: { flexDirection: "row", marginHorizontal: 8, gap: 6 },
  searchHintText: { padding: spacing.sm },
  pressable: {
    flex: 1,
    alignItems: "center",
  },
  pressableText: {
    fontWeight: "bold",
    fontSize: 16,
  },
}));

export default SearchUsers;
