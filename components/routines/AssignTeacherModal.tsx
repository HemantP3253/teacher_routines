import { SearchIcon } from "@/assets/icons";
import { useCollegeInfo } from "@/contexts/CollegeInfoContext";
import { useUserSearch } from "@/contexts/UserSearchContext";
import { AssignTeacherModalProps } from "@/interfaces/interfaces";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal, Spacer } from "../common";
import { ThemedText, ThemedTextInput, ThemedView } from "../themed";
import UserActionCard from "./UserActionCard";

const AssignTeacherModal = ({
  visible,
  onClose,
  onSelectTeacher,
}: AssignTeacherModalProps) => {
  const { cachedUsers, isLoading } = useUserSearch();
  const { currentCollege } = useCollegeInfo();
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const [searchText, setSearchText] = useState<string>("");

  const approvedTeachers = useMemo(() => {
    if (!currentCollege?.college_code) return [];
    return cachedUsers.filter((user) =>
      user.approved_by?.includes(currentCollege.college_code),
    );
  }, [cachedUsers, currentCollege?.college_code]);

  const filteredResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return approvedTeachers;

    return approvedTeachers.filter(
      (user) =>
        user.full_name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  }, [searchText, approvedTeachers]);

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
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="never"
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
              <Pressable
                onPress={() => {
                  onSelectTeacher(teacher.id, teacher.full_name);
                  setSearchText("");
                }}
              >
                <UserActionCard userData={teacher} hideIcons keepExpanded />
              </Pressable>
            )}
          />
        )}
      </ThemedView>
    </CustomModal>
  );
};

export default AssignTeacherModal;
