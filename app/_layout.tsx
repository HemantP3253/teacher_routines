import "../styles/unistyles";

// This stops VSCode from reorganizing imports as unistyles is required on the first line.
void null;

import { AppProvider } from "@/contexts/AppContext";
import { CollegeInfoProvider } from "@/contexts/CollegeInfoContext";
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
  const { userInfo, isLoading } = useUserInfo();
  const colors = useUnistyles().theme.colors;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Wait for the provider to finish

    const inAuthGroup = segments[0] === "(auth)";

    if (!userInfo && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (userInfo && inAuthGroup) {
      const targetPath = userInfo.is_admin ? "/(admin)/home" : "/(user)/home";
      router.replace(targetPath as any);
    }
  }, [userInfo, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {userInfo?.is_admin ? (
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
      <CollegeInfoProvider>
        <AppProvider>
          <AppNavigationLayout />
        </AppProvider>
      </CollegeInfoProvider>
    </UserInfoProvider>
  );
};

export default RootLayout;
