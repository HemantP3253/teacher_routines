import { SearchIcon } from "@/assets/icons";
import { ActionableHeaderCardProps } from "@/interfaces/interfaces";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedText, ThemedView } from "../themed";

const ActionableHeaderCard = ({
  title,
  iconProperties,
  showBottomBorder = false,
  isDataLoading = true,
  searchButtonProperties,
  children,
  IconBeforeText,
}: ActionableHeaderCardProps) => {
  const { Icon, onPress, height, width } = iconProperties;
  const { theme } = useUnistyles();
  const colors = theme.colors;
  return (
    <ThemedView
      style={{
        gap: 4,
        borderWidth: 1,
        borderRadius: 8,
        margin: 8,
        padding: 12,
        borderColor: colors.primary,
        backgroundColor: colors.base200,
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            paddingLeft: 4,
          }}
        >
          {IconBeforeText && <IconBeforeText fill={colors.primary} />}
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            {title}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {searchButtonProperties && (
            <SearchIcon
              onPress={searchButtonProperties.onPress}
              fill={colors.primary}
            />
          )}
          <Icon
            height={height ?? 24}
            width={width ?? 24}
            onPress={onPress}
            style={{ marginRight: 8 }}
            fill={colors.primary}
          />
        </View>
      </Pressable>
      {showBottomBorder && (
        <View
          style={{ borderWidth: 1, borderColor: colors.accent, margin: 4 }}
        ></View>
      )}
      {isDataLoading ? <ActivityIndicator size={"large"} /> : children}
      {}
    </ThemedView>
  );
};

export default ActionableHeaderCard;
