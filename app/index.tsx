import { useAuthStore } from "@/store/useAuthStore";
import "../styles/unistyles";

import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function EntryPoint() {
  const role = useAuthStore((state) => state.userRole);
  const isLoading = useAuthStore((state) => state.isLoading);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#76a831" />
      </View>
    );
  }

  if (!role) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Redirect
      href={
        role === "department_admin" || role === "institute_admin"
          ? "/(admin)/home"
          : "/(user)/home"
      }
    />
  );
}
