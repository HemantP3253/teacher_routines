import "../styles/unistyles";

import { useUserInfo } from "@/contexts/UserInfoContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function EntryPoint() {
  const { userInfo, isLoading } = useUserInfo();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#76a831" />
      </View>
    );
  }

  if (!userInfo) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Redirect href={userInfo.is_admin ? "/(admin)/home" : "/(user)/home"} />
  );
}
