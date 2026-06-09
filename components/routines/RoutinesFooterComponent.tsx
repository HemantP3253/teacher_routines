import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedPressable, ThemedText } from "../themed";

const RoutinesFooterComponent = () => {
  const { theme } = useUnistyles();
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
          borderColor: colors.background,
          borderBottomColor: colors.primary,
          borderTopColor: colors.primary,
          alignItems: "center",
        }}
      >
        <ThemedText type="text" style={{ padding: 4 }}>
          ~End of list~
        </ThemedText>
      </View>
    </View>
  );
};

export default RoutinesFooterComponent;
