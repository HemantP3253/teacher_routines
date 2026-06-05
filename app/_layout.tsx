import { AppProvider } from "@/contexts/AppContext";
import { CollegeInfoProvider } from "@/contexts/CollegeInfoContext";
import { ThemeProvider, useAppTheme } from "@/contexts/ThemeContext";
import { UserInfoProvider } from "@/contexts/UserInfoContext";
import { UserSearchProvider } from "@/contexts/UserSearchContext";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const AppNavigationLayout = () => {
  const { theme } = useAppTheme();
  const colors = theme.colors;
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        setIsAdmin(null);
      } else if (data) {
        setIsAdmin(data.is_admin);
      }
    } catch (error: any) {
      console.error(
        "Error while fetching user profile: (in rootLayout)",
        error.message,
      );
      setIsAdmin(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setIsAdmin(null);
      }

      setIsLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          setIsLoading(true);
          await fetchUserProfile(session.user.id);
          setIsLoading(false);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inUserGroup = segments[0] === "(user)";
    const inMiscGroup = segments[0] === "(misc)";
    const isViewingOptions =
      (inMiscGroup && segments[1] === "options") || segments[0] === "options";
    const isViewingApprove =
      (inMiscGroup && segments[1] === "approveUsers") ||
      segments[1] === "searchUsers";
    segments[0] === "approveUsers" || segments[0] === "searchUsers";

    if (!session) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    } else {
      if (isAdmin === true) {
        // Admins can be in admin space, misc space, or looking directly at the root sub-pages
        if (
          !inAdminGroup &&
          !inMiscGroup &&
          !isViewingOptions &&
          !isViewingApprove
        ) {
          router.replace("/(admin)/home");
        }
      } else if (isAdmin === false) {
        // Normal users are strictly limited to user screens or the options screen
        if (!inUserGroup && !isViewingOptions) {
          router.replace("/(user)/home");
        }
      }
    }
  }, [session, isLoading, isAdmin, segments]);

  if (isLoading)
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.base100,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  const ScreenStack = () => {
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
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signUp" />
        {isAdmin ? (
          <Stack.Screen name="(admin)" />
        ) : (
          <Stack.Screen name="(user)" />
        )}
        <Stack.Screen
          name="(misc)/options"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(misc)/approveUsers"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isAdmin ? (
        <UserSearchProvider>
          <ScreenStack />
        </UserSearchProvider>
      ) : (
        <ScreenStack />
      )}
    </View>
  );
};

const RootLayout = () => {
  return (
    <ThemeProvider>
      <UserInfoProvider>
        <CollegeInfoProvider>
          <AppProvider>
            <AppNavigationLayout />
          </AppProvider>
        </CollegeInfoProvider>
      </UserInfoProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
