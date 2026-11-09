import { DegreeIcon } from "@/assets/icons";
import { CustomModal } from "@/components/common";
import { ThemedCheckboxMenu, ThemedOptionsCard } from "@/components/themed";
import { useAppStore } from "@/store/useAppStore";
import { UniversityProgram } from "@/types/academic";
import { useState } from "react";
import { View } from "react-native";

const AdminSettings = () => {
  const availableDegrees = useAppStore((state) => state.availablePrograms);
  const setAvailablePrograms = useAppStore(
    (state) => state.setAvailablePrograms,
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const getShownDegreesDescription = (shownDegrees: UniversityProgram[]) => {
    if (!shownDegrees) return "";
    let description: string = "";
    shownDegrees.forEach((degree, index) => {
      description =
        description +
        degree.shortCode +
        (index === shownDegrees.length - 1 ? "" : ", ");
    });
    return description;
  };

  return (
    <View>
      <ThemedOptionsCard
        Icon={DegreeIcon}
        label="Selected Degrees"
        onPress={() => setModalVisible(true)}
        description={`${getShownDegreesDescription(availableDegrees)}`}
      />
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <ThemedCheckboxMenu
          title="Select Available Degrees"
          data={availableDegrees}
          minSelection={1}
          initialSelection={availableDegrees}
          getId={(item) => item.id}
          getLabel={(item) => item.name}
          onSubmit={(degrees) => {
            setModalVisible(false);
            setAvailablePrograms(degrees);
          }}
        />
      </CustomModal>
    </View>
  );
};

export default AdminSettings;
