import { DarkModeIcon, DegreeIcon, LogoutIcon } from "@/assets/icons";
import {
  ThemedCheckboxMenu,
  ThemedLinearGradient,
  ThemedOptionsCard,
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
} from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { useInstituteInfo } from "@/contexts/InstituteInfoContext";
import { supabase } from "@/services/supabase";
import { UniversityProgram } from "@/types/academic";
import { useState } from "react";
import { StatusBar } from "react-native";
import {
  UnistylesRuntime,
  UnistylesThemes,
  useUnistyles,
} from "react-native-unistyles";
import { CustomModal, Spacer } from "../common";
import ThemedRadioButtonMenu from "../themed/ThemedRadioButtonMenu";

const OptionsScreen = () => {
  const { currentMembership } = useInstituteInfo();
  const isAdmin =
    currentMembership?.role === "department_admin" ||
    currentMembership?.role === "institute_admin";
  const { theme } = useUnistyles();
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
    <ThemedLinearGradient
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
          description={`${getShownDegreesDescription(settings.shownDegrees)}`}
        />
      )}

      <CustomModal
        modalVisible={themeModalVisible}
        setModalVisible={setThemeModalVisible}
      >
        <ThemedRadioButtonMenu
          title="Select Theme"
          data={availableThemeOptions}
          selectedItem={currentTheme}
          getId={(item) => item}
          getLabel={(item) => item}
          getSubLabel={(item) =>
            item === "Use System Theme"
              ? "Automatically assigns dark mode and light mode according to the system theme"
              : undefined
          }
          alwaysShowSubLabel
          onItemSelect={(selected: string) => {
            if (selected === "Use System Theme") {
              UnistylesRuntime.setAdaptiveThemes(true);
            } else {
              UnistylesRuntime.setAdaptiveThemes(false);
              UnistylesRuntime.setTheme(
                selected.split(" ")[0].toLowerCase() as keyof UnistylesThemes,
              );
            }
          }}
        />
      </CustomModal>
      <CustomModal
        modalVisible={degreesModalVisible}
        setModalVisible={setDegreesModalVisible}
      >
        <ThemedCheckboxMenu
          title="Select Available Degrees"
          data={allAvailableDegrees}
          minSelection={1}
          initialSelection={settings.shownDegrees}
          getId={(item) => item.id}
          getLabel={(item) => item.name}
          onSubmit={(degreeNames) => {
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
    </ThemedLinearGradient>
  );
};

export default OptionsScreen;
