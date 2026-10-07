import "../styles/unistyles";

// This stops VSCode from reorganizing imports as unistyles is required on the first line.
void null;

import { AppProvider } from "@/contexts/AppContext";
import {
  InstituteInfoProvider,
  useInstituteInfo,
} from "@/contexts/InstituteInfoContext";
import { UserInfoProvider, useUserInfo } from "@/contexts/UserInfoContext";
import { UserSearchProvider } from "@/contexts/UserSearchContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

interface ScreenStackProps {
  colors: any;
}

const ScreenStack = ({ colors }: ScreenStackProps) => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.base100 },
        animation: "slide_from_right",
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="(auth)/login"
        options={{ animation: "slide_from_left" }}
      />
      <Stack.Screen
        name="(auth)/signUp"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="(admin)" options={{ animation: "fade" }} />
      <Stack.Screen name="(user)" options={{ animation: "fade" }} />
      <Stack.Screen name="(misc)/options" />
      <Stack.Screen name="(misc)/approveUsers" />
    </Stack>
  );
};

const AppNavigationLayout = () => {
  const { userInfo, isLoading: userLoading } = useUserInfo();
  const { currentMembership, isLoading: instituteLoading } = useInstituteInfo();
  const isAdmin =
    currentMembership?.role === "department_admin" ||
    currentMembership?.role === "institute_admin";

  const { colors } = useUnistyles().theme;
  const router = useRouter();
  const segments = useSegments();

  const isLoading = userLoading || instituteLoading;

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userInfo) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (inAuthGroup) {
      router.replace(isAdmin ? "/(admin)/home" : "/(user)/home");
    }
  }, [userInfo, currentMembership, isLoading, segments[0]]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isAdmin ? (
        <UserSearchProvider>
          <ScreenStack colors={colors} />
        </UserSearchProvider>
      ) : (
        <ScreenStack colors={colors} />
      )}
    </View>
  );
};

const RootLayout = () => {
  return (
    <UserInfoProvider>
      <InstituteInfoProvider>
        <AppProvider>
          <AppNavigationLayout />
        </AppProvider>
      </InstituteInfoProvider>
    </UserInfoProvider>
  );
};

export default RootLayout;
