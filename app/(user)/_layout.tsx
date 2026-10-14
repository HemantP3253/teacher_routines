import { ClassIcon, HomeIcon, UsernameIcon } from "@/assets/icons";
import { FloatingTabBar, TabButton } from "@/components/common";
import { useBlurContext } from "@/contexts/BlurContext";
import { BlurTargetView } from "expo-blur";
import { Tabs, usePathname, useRouter } from "expo-router";

const _Layout = () => {
  const { targetRef } = useBlurContext();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <BlurTargetView ref={targetRef}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        />
      </BlurTargetView>

      <FloatingTabBar blurTarget={targetRef}>
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
