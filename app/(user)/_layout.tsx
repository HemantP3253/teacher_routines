import { ClassIcon, HomeIcon, UsernameIcon } from "@/assets/icons";
import { ThemedText, ThemedView } from "@/components/themed";
import { useAppTheme } from "@/contexts/ThemeContext";
import { TabIconProps } from "@/interfaces/interfaces";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

const TabIcon = ({ focused, Icon, title }: TabIconProps) => {
  const { theme } = useAppTheme();
  const colors = theme.colors;
  const tabItemColor = colors.primary;

  return (
    <ThemedView
      style={[
        styles.tabContainer,
        { backgroundColor: focused ? colors.primary + 20 : "transparent" },
      ]}
    >
      <Icon
        height={focused ? 24 : 28}
        width={focused ? 24 : 28}
        fill={tabItemColor}
        fillItem={focused}
      />

      {focused && (
        <ThemedText
          numberOfLines={1}
          style={[styles.focusedText, { color: colors.primary }]}
        >
          {title}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const _Layout = () => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flexDirection: "row",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: colors.base200,
          borderRadius: 8,
          padding: 8,
          height: 64,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#000000",
        },
      }}
    >
      <Tabs.Screen
        name="classes"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon focused={focused} Icon={ClassIcon} title="Classes" />
            );
          },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <TabIcon focused={focused} Icon={HomeIcon} title="Home" />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon focused={focused} Icon={UsernameIcon} title="Profile" />
            );
          },
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    width: 90,
    borderRadius: 9999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  focusedText: {
    fontSize: 14,
    fontWeight: "600",
  },
  unFocusedIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default _Layout;
