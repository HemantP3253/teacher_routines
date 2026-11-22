import { AlertDialog, CustomPressable, CustomText } from "@/components/ui";
import { useRoutineStore } from "@/store/useRoutineStore";
import { useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const RoutinesFooter = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const generateAndSaveRoutines = useRoutineStore(
    (state) => state.generateAndSaveRoutines,
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await generateAndSaveRoutines();
      setModalVisible(true);
      setAlertTitle("Saved successfully!");
    } catch (error: any) {
      setModalVisible(true);
      setAlertTitle("Cannot Save Routine");
      setAlertDescription(error.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      <CustomPressable style={{ margin: 8 }} onPress={handleSave}>
        <CustomText
          type="primaryContent"
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Save Changes
        </CustomText>
      </CustomPressable>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.primary,
          alignItems: "center",
        }}
      >
        <CustomText type="text" style={{ padding: 4 }}>
          ~End of list~
        </CustomText>
      </View>
      <AlertDialog
        onClose={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)}
        title={alertTitle}
        visible={modalVisible}
      />
    </View>
  );
};

export default RoutinesFooter;
