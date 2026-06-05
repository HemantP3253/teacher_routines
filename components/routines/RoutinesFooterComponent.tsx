import { useAppTheme } from "@/contexts/ThemeContext";
import { View } from "react-native";
import { ThemedPressable, ThemedText } from "../themed";

const RoutinesFooterComponent = () => {
  const { theme } = useAppTheme();
  const colors = theme.colors;

  return (
    <View>
      <ThemedPressable style={{ margin: 8 }}>
        <ThemedText
          onPress={() => {
            /* TODO */
          }}
          type="primaryContent"
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Save Changes
        </ThemedText>
      </ThemedPressable>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.base100,
          borderBottomColor: colors.primary,
          borderTopColor: colors.primary,
          alignItems: "center",
        }}
      >
        <ThemedText type="baseContent" style={{ padding: 4 }}>
          ~End of list~
        </ThemedText>
      </View>
    </View>
  );
};

export default RoutinesFooterComponent;
