import { ThemedOptionsCardProps } from "@/interfaces/interfaces";
import { Pressable, Switch } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedOptionsCard = ({
  Icon,
  description,
  switchOnValueChange,
  switchValue,
  onPress,
  label,
}: ThemedOptionsCardProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <Pressable
      onPress={onPress ? onPress : switchOnValueChange}
      style={{ flexDirection: "row", alignItems: "center", minHeight: 32 }}
    >
      {Icon && (
        <ThemedView style={{ marginLeft: 8 }}>
          <Icon height={24} width={24} fill={colors.primary} />
        </ThemedView>
      )}
      <ThemedView style={{ flex: 1, marginLeft: 8 }}>
        <ThemedText
          type="baseContent"
          style={{ fontSize: 16, fontWeight: "600" }}
        >
          {label}
        </ThemedText>
        {description && (
          <ThemedText type="baseContent" style={{ fontSize: 14 }}>
            {description}
          </ThemedText>
        )}
      </ThemedView>
      {switchOnValueChange && (
        <Switch
          value={switchValue}
          onValueChange={switchOnValueChange}
          trackColor={{ false: colors.base300, true: colors.primary }}
          thumbColor={colors.accent}
          style={{ alignItems: "center", marginHorizontal: 8 }}
        />
      )}
    </Pressable>
  );
};

export default ThemedOptionsCard;
