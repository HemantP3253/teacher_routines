import { DarkModeIcon } from "@/assets/icons";
import { CustomModal } from "@/components/common";
import { ThemedOptionsCard, ThemedRadioButtonMenu } from "@/components/themed/";
import { useState } from "react";
import { View } from "react-native";
import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";

const CommonSettings = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const currentTheme = UnistylesRuntime.hasAdaptiveThemes
    ? "Use System Theme"
    : UnistylesRuntime.themeName === "dark"
      ? "Dark Mode"
      : "Light Mode";
  const availableThemeOptions = ["Use System Theme", "Light Mode", "Dark Mode"];
  const themeSublabel: Record<string, string> = {
    "Use System Theme":
      "Automatically assigns dark mode and light mode according to the system theme",
  };

  const handleThemeSelect = (themeName: string) => {
    if (themeName === "Use System Theme") {
      UnistylesRuntime.setAdaptiveThemes(true);
      return;
    }

    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(
      themeName.split(" ")[0].toLowerCase() as keyof UnistylesThemes,
    );
  };

  return (
    <View>
      <ThemedOptionsCard
        Icon={DarkModeIcon}
        label={"Select Theme"}
        onPress={() => setModalVisible(true)}
      />
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <ThemedRadioButtonMenu
          title="Select Theme"
          data={availableThemeOptions}
          selectedItem={currentTheme}
          getId={(item) => item.toLowerCase().replace(/\s+/gu, "-")}
          getLabel={(item) => item}
          getSublabel={(item) => themeSublabel[item]}
          alwaysShowSubLabel
          onItemSelect={handleThemeSelect}
        />
      </CustomModal>
    </View>
  );
};

export default CommonSettings;
