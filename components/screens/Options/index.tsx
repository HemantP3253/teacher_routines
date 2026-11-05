import { LogoutIcon } from "@/assets/icons";
import {
  ThemedLinearGradient,
  ThemedPressable,
  ThemedStatusBar,
  ThemedText,
} from "@/components/themed";
import { handleLogout } from "@/services/authService";
import { StatusBar } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import AdminSettings from "./AdminSettings";
import CommonSettings from "./CommonSettings";
import { RoleGuard } from "./RoleGuard";

const OptionsScreen = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

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
