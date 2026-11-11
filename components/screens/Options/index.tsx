import { ThemedLinearGradient, ThemedStatusBar } from "@/components/themed";
import { StatusBar } from "react-native";
import AdminSettings from "./AdminSettings";
import CommonSettings from "./CommonSettings";
import { RoleGuard } from "./RoleGuard";
import SettingsFooter from "./SettingsFooter";

const OptionsScreen = () => {
  return (
    <ThemedLinearGradient
      style={{
        height: "100%",
        paddingTop: StatusBar.currentHeight ?? 0,
        gap: 8,
      }}
    >
      <ThemedStatusBar />

      <CommonSettings />

      <RoleGuard allowedRoles={["department_admin", "institute_admin"]}>
        <AdminSettings />
      </RoleGuard>

      <SettingsFooter />
    </ThemedLinearGradient>
  );
};

export default OptionsScreen;
