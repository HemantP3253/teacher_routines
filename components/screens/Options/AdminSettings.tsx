import { DegreeIcon } from "@/assets/icons";
import { CustomModal } from "@/components/common";
import { ThemedCheckboxMenu, ThemedOptionsCard } from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { UniversityProgram } from "@/types/academic";
import { useState } from "react";
import { View } from "react-native";

const AdminSettings = () => {
  const { settings, updateSetting, allAvailableDegrees } = useApp();

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
        description={`${getShownDegreesDescription(settings.shownDegrees)}`}
      />
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <ThemedCheckboxMenu
          title="Select Available Degrees"
          data={allAvailableDegrees}
          minSelection={1}
          initialSelection={settings.shownDegrees}
          getId={(item) => item.id}
          getLabel={(item) => item.name}
          onSubmit={(degreeNames) => {
            setModalVisible(false);
            updateSetting("shownDegrees", degreeNames);
          }}
        />
      </CustomModal>
    </View>
  );
};

export default AdminSettings;
