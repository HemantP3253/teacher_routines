import SyncStatusBanner from "@/components/common/SyncStatusBanner";
import "../styles/unistyles";

import { BlurProvider } from "@/contexts/BlurContext";
import useAppLifecycle from "@/hooks/useAppLifecycle";
import { ThemeColors } from "@/types/common";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

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

  useAppLifecycle();

  return (
    <View style={{ flex: 1 }}>
      <ScreenStack colors={colors} />
      <SyncStatusBanner />
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
