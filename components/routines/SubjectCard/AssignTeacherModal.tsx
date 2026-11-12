import { SearchIcon } from "@/assets/icons";
import { useProfileStore } from "@/store/useProfileStore";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal, Spacer } from "../../common";
import { ThemedText, ThemedTextInput, ThemedView } from "../../themed";
import UserActionCard from "../UserActionCard";

interface AssignTeacherModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTeacher: (teacherId: string, teacherName: string) => void;
}

const AssignTeacherModal = ({
  visible,
  onClose,
  onSelectTeacher,
}: AssignTeacherModalProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const allProfiles = useProfileStore((state) => state.allProfiles);
  const statusMap = useProfileStore((state) => state.statusMap);
  const isLoading = useProfileStore((state) => state.isLoading);

  const approvedProfiles = useMemo(
    () =>
      allProfiles.filter((profile) => statusMap.get(profile.id) === "approved"),
    [allProfiles, statusMap],
  );

  const [searchText, setSearchText] = useState<string>("");

  const filteredResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return approvedProfiles;

    return approvedProfiles.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  }, [searchText, approvedProfiles]);

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

        <Spacer line={{ type: "divider" }} />

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
                profile={teacher}
                hideIcons
                keepExpanded
                onPress={() => {
                  onSelectTeacher(teacher.id, teacher.fullName);
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
