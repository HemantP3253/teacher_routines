import { ErrorIcon } from "@/assets/icons";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";

const ErrorCard = ({
  errorText,
  containerStyle,
  iconStyle,
  textStyle,
}: {
  errorText: string | undefined | null;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const { colors } = useUnistyles().theme;
  if (!errorText) return null;

  return (
    <ThemedView
      style={[
        {
          alignItems: "center",
          backgroundColor: colors.error + 95,
          borderRadius: 8,
          flexDirection: "row",
          marginHorizontal: 8,
          padding: 8,
        },
        containerStyle,
      ]}
    >
      <ErrorIcon
        fill={colors.errorContent}
        style={[{ alignSelf: "flex-start" }, iconStyle]}
      />
      <ThemedText
        type="errorContent"
        style={[{ paddingHorizontal: 4 }, textStyle]}
      >
        {errorText}
      </ThemedText>
    </ThemedView>
  );
};

export default ErrorCard;
