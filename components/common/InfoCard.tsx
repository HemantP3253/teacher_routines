import { InfoIcon } from "@/assets/icons";
import { useAppTheme } from "@/contexts/ThemeContext";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";

const InfoCard = ({
  infoText,
  containerStyle,
  iconStyle,
  textStyle,
}: {
  infoText: string | undefined | null;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const { colors } = useAppTheme().theme;
  if (!infoText) return null;

  return (
    <ThemedView
      style={[
        {
          backgroundColor: colors.info + 80,
          borderRadius: 8,
          flexDirection: "row",
          marginHorizontal: 8,
          padding: 8,
        },
        containerStyle,
      ]}
    >
      <InfoIcon style={[{ alignSelf: "flex-start" }, iconStyle]} />
      <ThemedText
        type="infoContent"
        style={[
          {
            paddingLeft: 4,
            textAlign: "justify",
            maxWidth: "92%",
          },
          textStyle,
        ]}
      >
        {infoText}
      </ThemedText>
    </ThemedView>
  );
};

export default InfoCard;
