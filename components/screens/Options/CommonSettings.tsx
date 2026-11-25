import { DarkModeIcon } from "@/assets/icons";
import { CustomModal, OptionsCard, RadioButtonMenu } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { ThemePreference } from "@/types/common";
import { useState } from "react";
import { View } from "react-native";

const CommonSettings = () => {
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const availableThemeOptions: ThemePreference[] = [
    "Use System Theme",
    "Light Mode",
    "Dark Mode",
  ];

  const themeSublabel: Partial<Record<ThemePreference, string>> = {
    "Use System Theme":
      "Automatically assigns dark mode and light mode according to the system theme",
  };

  return (
    <View>
      <OptionsCard
        Icon={DarkModeIcon}
        label={"Select Theme"}
        onPress={() => setModalVisible(true)}
      />
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <View style={{ width: "100%" }}>
          <RadioButtonMenu
            title="Select Theme"
            data={availableThemeOptions}
            selectedItem={themePreference}
            getId={(item) => item.toLowerCase().replace(/\s+/gu, "-")}
            getLabel={(item) => item}
            getSublabel={(item) => themeSublabel[item]}
            alwaysShowSubLabel
            onItemSelect={setThemePreference}
          />
        </View>
      </CustomModal>
    </View>
  );
};

export default CommonSettings;
