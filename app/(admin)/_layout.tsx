import { HomeIcon, OptionsIcon, RoutinesIcon } from "@/assets/icons";
import { FloatingTabBar, TabButton } from "@/components/common";
import { useBlurContext } from "@/contexts/BlurContext";
import { BlurTargetView } from "expo-blur";
import { Tabs, usePathname, useRouter } from "expo-router";
import { StyleSheet } from "react-native-unistyles";

const _Layout = () => {
  const { targetRef, blurMethod } = useBlurContext();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <BlurTargetView ref={targetRef} style={StyleSheet.absoluteFill}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        />
      </BlurTargetView>

      <FloatingTabBar blurTarget={targetRef}>
        <TabButton
          focused={pathname === "/routines"}
          title="Routines"
          onPress={() => router.push("/(admin)/routines")}
          Icon={RoutinesIcon}
        />
        <TabButton
          focused={pathname === "/home"}
          title="Home"
          onPress={() => router.push("/(admin)/home")}
          Icon={HomeIcon}
        />
        <TabButton
          focused={pathname === "/options"}
          title="Options"
          onPress={() => router.push("/(admin)/options")}
          Icon={OptionsIcon}
        />
      </FloatingTabBar>
    </>
  );
};

export default _Layout;
