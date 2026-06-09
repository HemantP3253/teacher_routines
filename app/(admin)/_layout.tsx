import { HomeIcon, OptionsIcon, RoutinesIcon } from "@/assets/icons";
import { FloatingTabBar, TabButton } from "@/components/common";
import { Tabs, usePathname, useRouter } from "expo-router";

const _Layout = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />

      <FloatingTabBar>
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
