import { SearchIcon } from "@/assets/icons";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { AssignTeacherModalProps } from "@/interfaces/interfaces";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal, Spacer } from "../common";
import { ThemedText, ThemedTextInput, ThemedView } from "../themed";
import UserActionCard from "./UserActionCard";

const AssignTeacherModal = ({
  visible,
  onClose,
  onSelectTeacher,
}: AssignTeacherModalProps) => {
  const { users, isLoading } = useUserSearch();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [searchText, setSearchText] = useState<string>("");

  const filteredResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return users.approved;

    return users.approved.filter(
      (user) =>
        user.profile.full_name.toLowerCase().includes(query) ||
        user.profile.username.toLowerCase().includes(query),
    );
  }, [searchText, users]);

  return (
    <CustomModal modalVisible={visible} setModalVisible={onClose}>
      <ThemedView
        style={{
          width: "100%",
          borderRadius: 8,
          padding: 8,
          maxHeight: "100%",
        }}
      >
        <ThemedText
          style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
        >
          Assign Teacher
        </ThemedText>

        <ThemedTextInput
          title="Search approved users"
          Icon={SearchIcon}
          value={searchText}
          onChangeText={setSearchText}
        />

        <Spacer lineVisible />

        {isLoading ? (
          <ActivityIndicator
            size={"large"}
            color={colors.primary}
            style={{ marginTop: 16 }}
          />
        ) : (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.profile_id}
            keyboardShouldPersistTaps="handled"
            style={{ marginTop: 12 }}
            ListEmptyComponent={() => (
              <ThemedText
                style={{
                  fontSize: 16,
                  color: colors.accent,
                  fontWeight: "bold",
                  padding: 8,
                }}
              >
                {searchText
                  ? "No matching teachers found"
                  : "No approved teachers found"}
              </ThemedText>
            )}
            renderItem={({ item: teacher }) => (
              <UserActionCard
                user={teacher}
                hideIcons
                keepExpanded
                onPress={() => {
                  onSelectTeacher(
                    teacher.profile_id,
                    teacher.profile.full_name,
                  );
                  setSearchText("");
                }}
              />
            )}
          />
        )}
      </ThemedView>
    </CustomModal>
  );
};

export default AssignTeacherModal;
