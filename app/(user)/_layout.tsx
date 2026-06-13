import {
  ClassIcon,
  HomeIcon,
  UsernameIcon
} from "@/assets/icons";
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
          focused={pathname === "/classes"}
          title="Classes"
          onPress={() => router.push("/(user)/classes")}
          Icon={ClassIcon}
        />
        <TabButton
          focused={pathname === "/home"}
          title="Home"
          onPress={() => router.push("/(user)/home")}
          Icon={HomeIcon}
        />
        <TabButton
          focused={pathname === "/profile"}
          title="Profile"
          onPress={() => router.push("/(user)/profile")}
          Icon={UsernameIcon}
        />
      </FloatingTabBar>
    </>
  );
};

export default _Layout;
