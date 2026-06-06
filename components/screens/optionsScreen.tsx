import { DarkModeIcon, DegreeIcon, LogoutIcon } from "@/assets/icons";
import {
  ThemedOptionsCard,
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
  ThemedView,
} from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { supabase } from "@/services/supabase";
import { useState } from "react";
import { StatusBar } from "react-native";
import {
  UnistylesRuntime,
  UnistylesThemes,
  useUnistyles,
} from "react-native-unistyles";
import { CustomModal, Spacer } from "../common";
import { ThemedCheckbox } from "../themed/";
import ThemedRadioButtonMenu from "../themed/ThemedRadioButtonMenu";

const OptionsScreen = () => {
  const { userInfo } = useUserInfo();
  const isAdmin = userInfo?.is_admin || false;
  const { theme, rt } = useUnistyles();
  const availableThemeOptions = ["Use System Theme", "Light Mode", "Dark Mode"];
  const { settings, updateSetting, allAvailableDegrees } = useApp();
  const colors = theme.colors;
  const [degreesModalVisible, setDegreesModalVisible] =
    useState<boolean>(false);
  const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
  const currentTheme = UnistylesRuntime.hasAdaptiveThemes
    ? "Use System Theme"
    : UnistylesRuntime.themeName === "dark"
      ? "Dark Mode"
      : "Light Mode";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out: ", error.message);
      }
    } catch (error) {
      console.error("Unexpected error while logging out: ", error);
    }
  };

  return (
    <ThemedView
      style={{
        height: "100%",
        paddingTop: StatusBar.currentHeight ?? 0,
        gap: 8,
      }}
    >
      <ThemedStatusBar />
      <ThemedOptionsCard
        Icon={DarkModeIcon}
        label={"Select Theme"}
        onPress={() => setThemeModalVisible(true)}
      />

      {isAdmin && (
        <ThemedOptionsCard
          Icon={DegreeIcon}
          label="Selected Degrees"
          onPress={() => setDegreesModalVisible(true)}
          description={`${settings.shownDegrees.length > 0 ? settings.shownDegrees.join(", ") : "All"}`}
        />
      )}

      <CustomModal
        modalVisible={themeModalVisible}
        setModalVisible={setThemeModalVisible}
      >
        <ThemedRadioButtonMenu
          data={availableThemeOptions}
          getId={(item) => item}
          initialSelection={currentTheme}
          getLabel={(item) => item}
          onSelect={(selected: string) => {
            if (selected === "Use System Theme") {
              UnistylesRuntime.setAdaptiveThemes(true);
            } else {
              UnistylesRuntime.setAdaptiveThemes(false);
              UnistylesRuntime.setTheme(
                selected.split(" ")[0].toLowerCase() as keyof UnistylesThemes,
              );
            }
          }}
          title="Select Theme"
        />
      </CustomModal>
      <CustomModal
        modalVisible={degreesModalVisible}
        setModalVisible={setDegreesModalVisible}
      >
        <ThemedCheckbox
          data={allAvailableDegrees}
          getId={(item: string) => item}
          initialSelection={settings.shownDegrees}
          title="Select Available Degrees"
          getLabel={(item: string) => item}
          onSubmit={(degreeNames: string[]) => {
            setDegreesModalVisible(false);
            updateSetting("shownDegrees", degreeNames);
          }}
        />
      </CustomModal>

      <Spacer />
      <ThemedPressable
        style={{
          backgroundColor: colors.error,
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
        }}
        onPress={handleLogout}
      >
        <LogoutIcon fill={colors.errorContent} />
        <ThemedText
          type="errorContent"
          style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}
        >
          Log Out
        </ThemedText>
      </ThemedPressable>
    </ThemedView>
  );
};

export default OptionsScreen;
