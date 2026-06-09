import { HomeIcon, OptionsIcon, RoutinesIcon } from "@/assets/icons";
import { ThemedText } from "@/components/themed";
import { TabIconProps } from "@/interfaces/interfaces";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const TabIcon = ({ focused, Icon, title }: TabIconProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const tabItemColor = focused ? colors.primaryContent : colors.primary;

  return (
    <View
      style={[
        styles.tabContainer,
        { backgroundColor: focused ? colors.primary : "transparent" },
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
          style={[styles.focusedText, { color: tabItemColor }]}
        >
          {title}
        </ThemedText>
      )}
    </View>
  );
};

const _Layout = () => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen
        name="routines"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon focused={focused} Icon={RoutinesIcon} title="Routines" />
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
        name="options"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon focused={focused} Icon={OptionsIcon} title="Options" />
            );
          },
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    width: 100,
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
