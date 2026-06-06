import { DarkModeIcon, DegreeIcon } from "@/assets/icons";
import {
  ThemedOptionsCard,
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
  ThemedView,
} from "@/components/themed";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/services/supabase";
import { useState } from "react";
import { StatusBar } from "react-native";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { CustomModal, Spacer } from "../common";
import ThemedCheckbox from "../themed/ThemedCheckbox";

const OptionsScreen = ({ type }: { type?: "admin" | "user" }) => {
  const { theme, rt } = useUnistyles();
  const { settings, updateSetting, allAvailableDegrees } = useApp();
  const colors = theme.colors;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
      style={{ height: "100%", paddingTop: StatusBar.currentHeight ?? 0 }}
    >
      <ThemedStatusBar />
      <ThemedOptionsCard
        switchValue={rt.themeName === "dark"}
        switchOnValueChange={() => {
          UnistylesRuntime.setAdaptiveThemes(false);
          rt.themeName === "dark"
            ? UnistylesRuntime.setTheme("light")
            : UnistylesRuntime.setTheme("dark");
        }}
        Icon={DarkModeIcon}
        label={"Dark Mode"}
      />
      {type === "admin" && (
        <ThemedOptionsCard
          Icon={DegreeIcon}
          label="Selected Degrees"
          onPress={() => setModalVisible(true)}
          description={`${settings.shownDegrees.length > 0 ? settings.shownDegrees.join(", ") : "All"}`}
        />
      )}

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <ThemedCheckbox
          data={allAvailableDegrees}
          getId={(item: string) => item}
          initialSelection={settings.shownDegrees}
          title="Select Available Degrees"
          getLabel={(item: string) => item}
          onSubmit={(degreeNames: string[]) => {
            setModalVisible(false);
            updateSetting("shownDegrees", degreeNames);
          }}
        />
      </CustomModal>

      <Spacer />
      <ThemedPressable
        style={{ backgroundColor: colors.error }}
        onPress={handleLogout}
      >
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
