import { AppLinearGradient, AppStatusBar } from "@/components/ui";
import { StatusBar } from "react-native";
import AdminSettings from "./AdminSettings";
import CommonSettings from "./CommonSettings";
import { RoleGuard } from "./RoleGuard";
import SettingsFooter from "./SettingsFooter";

const OptionsScreen = () => {
  return (
    <AppLinearGradient
      style={{
        height: "100%",
        paddingTop: StatusBar.currentHeight ?? 0,
        gap: 8,
      }}
    >
      <AppStatusBar />

      <CommonSettings />

      <RoleGuard allowedRoles={["department_admin", "institute_admin"]}>
        <AdminSettings />
      </RoleGuard>

      <SettingsFooter />
    </AppLinearGradient>
  );
};

export default OptionsScreen;
