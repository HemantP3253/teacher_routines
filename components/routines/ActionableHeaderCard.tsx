import { SearchIcon } from "@/assets/icons";
import { ActionableHeaderCardProps } from "@/interfaces/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedText } from "../themed";

const ActionableHeaderCard = ({
  title,
  iconProperties,
  showBottomBorder = false,
  isDataLoading = true,
  searchButtonProperties,
  children,
  IconBeforeText,
  summaryText,
}: ActionableHeaderCardProps) => {
  const { Icon, onPress, height, width } = iconProperties;
  const { theme } = useUnistyles();
  const colors = theme.colors;
  return (
    <Pressable style={{}} onPress={onPress}>
      <LinearGradient
        colors={[colors.surface, colors.surfaceElevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          gap: 4,
          borderWidth: 1,
          borderRadius: 8,
          margin: 8,
          padding: 12,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
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
        </View>
        {showBottomBorder && (
          <View
            style={{ borderWidth: 1, borderColor: colors.accent, margin: 4 }}
          ></View>
        )}
        {isDataLoading ? <ActivityIndicator size={"large"} /> : children}
        {summaryText && (
          <ThemedText
            style={{
              fontSize: 14,
              paddingHorizontal: 8,
              opacity: 0.7,
              fontWeight: "500",
              color: colors.text,
            }}
          >
            {summaryText}
          </ThemedText>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default ActionableHeaderCard;
