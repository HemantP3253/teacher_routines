import { useInstituteInfo } from "@/contexts/InstituteInfoContext";
import "../styles/unistyles";

import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function EntryPoint() {
  const { currentMembership, isLoading } = useInstituteInfo();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#76a831" />
      </View>
    );
  }

  if (!currentMembership) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Redirect
      href={
        currentMembership.role === "department_admin" ||
        currentMembership.role === "institute_admin"
          ? "/(admin)/home"
          : "/(user)/home"
      }
    />
  );
}
