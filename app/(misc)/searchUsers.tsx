import { SearchIcon } from "@/assets/icons";
import TagChip from "@/components/common/DynamicTagSelect/TagChip";
import { UserActionCard } from "@/components/routines";
import { ThemedText, ThemedTextInput, ThemedView } from "@/components/themed";
import { useCollegeInfo } from "@/contexts/CollegeInfoContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

type searchType = "Name" | "Username" | "Phone";

const searchUsers = () => {
  const { title } = useLocalSearchParams();
  const { cachedUsers, isLoading } = useUserSearch();
  const { theme } = useAppTheme();
  const colors = theme.colors;
  const { currentCollege } = useCollegeInfo();

  const [searchParams, setSearchParams] = useState<{
    searchText: string;
    searchType: searchType;
  }>({ searchText: "", searchType: "Name" });
  const [searchError, setSearchError] = useState<string>("");

  const getDynamicStyle = (text: searchType) => {
    return searchParams?.searchType === text ? "primaryContent" : "baseContent";
  };

  const handleSearchSubmit = () => {
    if (
      !searchParams.searchText ||
      searchParams.searchText === "" ||
      searchParams.searchText?.length < 3
    ) {
      setSearchError("Search text must be at least 3 letters");
    }
  };

  const userData = useMemo(() => {
    if (!currentCollege?.college_code) return;

    if (title === "Pending") {
      return cachedUsers.filter(
        (user) =>
          !user.approved_by?.includes(currentCollege?.college_code) &&
          !user.rejected_by?.includes(currentCollege?.college_code),
      );
    }

    if (title === "Approved") {
      return cachedUsers.filter((user) =>
        user.approved_by?.includes(currentCollege?.college_code),
      );
    }

    if (title === "Rejected") {
      return cachedUsers.filter((user) =>
        user.rejected_by?.includes(currentCollege?.college_code),
      );
    }

    return cachedUsers;
  }, [cachedUsers, title]);

  const filteredUsers = useMemo(() => {
    const query = searchParams.searchText.trim().toLowerCase();

    if (!query || query.length < 3) return [];

    return userData?.filter((user) => {
      if (!user.id) return false;

      if (searchParams.searchType === "Name") {
        return user.full_name.toLowerCase().includes(query);
      }
      if (searchParams.searchType === "Username") {
        return user.username.toLowerCase().includes(query);
      }
      if (searchParams.searchType === "Phone") {
        return user.phone.toLowerCase().includes(query);
      }
      return false;
    });
  }, [searchParams.searchText, searchParams.searchType, userData]);

  return (
    <ThemedView
      style={[{ paddingTop: StatusBar.currentHeight }, StyleSheet.absoluteFill]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <ThemedText
            type="baseContent"
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
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

          <ThemedText style={{ padding: 8, fontWeight: "bold", fontSize: 16 }}>
            Search By:
          </ThemedText>

          <View style={{ flexDirection: "row", marginHorizontal: 8, gap: 6 }}>
            {(["Name", "Username", "Phone"] as searchType[]).map((type) => (
              <TagChip
                key={type}
                label={type}
                fill={searchParams?.searchType === type}
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
              <ThemedText style={{ color: colors.warning, padding: 8 }}>
                No results found for "{searchParams.searchText}"
              </ThemedText>
            ) : searchParams.searchText.trim().length < 3 ? (
              <ThemedText style={{ color: colors.neutral, padding: 8 }}>
                Type at least 3 characters to search...
              </ThemedText>
            ) : (
              filteredUsers?.map((user) => (
                <UserActionCard
                  userData={user}
                  key={user.id}
                  showStatus={!title || title === "All"}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    alignItems: "center",
  },
  pressableText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default searchUsers;
