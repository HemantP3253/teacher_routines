import "../styles/unistyles";

import { BlurProvider } from "@/contexts/BlurContext";
import { populateInstitutes } from "@/services/populateInstitutes";
import { syncDatabase } from "@/services/sync";
import { useAppStore } from "@/store/useAppStore";
import { useAppSyncStore } from "@/store/useAppSyncStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { ThemeColors } from "@/types/common";
import NetInfo from "@react-native-community/netinfo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, View } from "react-native";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";

interface ScreenStackProps {
  colors: ThemeColors;
}

const ScreenStack = ({ colors }: ScreenStackProps) => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
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
  const { colors } = useUnistyles().theme;
  const router = useRouter();
  const segments = useSegments();

  const themePreference = useAppStore((state) => state.themePreference);
  const isAppActive = useAppSyncStore((state) => state.isAppActive);
  const isOnline = useAppSyncStore((state) => state.isOnline);
  const institutesLoaded = useAppSyncStore((state) => state.institutesLoaded);
  const setIsAppActive = useAppSyncStore((state) => state.setIsAppActive);
  const setIsOnline = useAppSyncStore((state) => state.setIsOnline);
  const setInstitutesLoaded = useAppSyncStore(
    (state) => state.setInstitutesLoaded,
  );
  const setIsSyncing = useAppSyncStore((state) => state.setIsSyncing);
  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.userRole);
  const fetchProfiles = useProfileStore((state) => state.fetchProfiles);

  const isPopulatingRef = useRef<boolean>(false);
  const isSyncedRef = useRef<boolean>(false);

  // Effect responsible for changing themes
  useEffect(() => {
    if (themePreference === "Use System Theme") {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      const rawTheme = themePreference.split(" ")[0].toLowerCase() as
        | "light"
        | "dark";
      UnistylesRuntime.setTheme(rawTheme);
    }
  }, [themePreference]);

  // Effect responsible for role-based routing
  useEffect(() => {
    const isAdmin =
      userRole === "department_admin" || userRole === "institute_admin";
    const inAuthGroup = segments[0] === "(auth)";

    if (!userId || !userRole) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (inAuthGroup) {
      router.replace(isAdmin ? "/(admin)/home" : "/(user)/home");
    }
  }, [userId, userRole, segments, router]);

  // Effect for checking app state and network changes
  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener((state) =>
      setIsOnline((state.isConnected && state.isInternetReachable) ?? false),
    );

    const subscriptionApp = AppState.addEventListener(
      "change",
      (nextAppState) => setIsAppActive(nextAppState === "active"),
    );

    return () => {
      unsubscribeNet();
      subscriptionApp.remove();
    };
  }, [setIsAppActive, setIsOnline]);

  // Effect for populating institutes (if not already populated)
  useEffect(() => {
    if (
      !institutesLoaded &&
      !isPopulatingRef.current &&
      isOnline &&
      isAppActive
    ) {
      isPopulatingRef.current = true;

      populateInstitutes()
        .then(() => setInstitutesLoaded(true))
        .catch((error) => {
          console.error("Error while populating institutes: ", error);
          setInstitutesLoaded(false);
        })
        .finally(() => {
          if (!useAppSyncStore.getState().institutesLoaded) {
            isPopulatingRef.current = false;
          }
        });
    }
  }, [institutesLoaded, setInstitutesLoaded, isAppActive, isOnline]);

  // Effect for database synchronization
  useEffect(() => {
    if (userId && userRole && isAppActive && isOnline && !isSyncedRef.current) {
      isSyncedRef.current = true;
      setIsSyncing(true);

      syncDatabase()
        .then(() => fetchProfiles())
        .catch((error) => {
          console.error("Background sync failed:", error);
          isSyncedRef.current = false;
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [fetchProfiles, isAppActive, setIsSyncing, isOnline, userId, userRole]);

  return (
    <View style={{ flex: 1 }}>
      <ScreenStack colors={colors} />
    </View>
  );
};

const RootLayout = () => {
  return (
    <BlurProvider>
      <AppNavigationLayout />
    </BlurProvider>
  );
};

export default RootLayout;
