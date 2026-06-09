import { ThemedClassCardProps } from "@/interfaces/interfaces";
import { calculateFullPeriodTime } from "@/utils/dateUtils";
import { termToFormattedString } from "@/utils/stringUtils";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const ThemedClassCard = ({ ...props }: ThemedClassCardProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  return (
    <ThemedView>
      <ThemedText style={{ padding: 8, fontWeight: "600", fontSize: 16 }}>
        {calculateFullPeriodTime(
          props.startTime,
          props?.durationInMinutes ?? 40,
        )}
      </ThemedText>
      <ThemedView
        style={{
          margin: 4,
          padding: 4,
          borderWidth: 1,
          borderColor: colors.surfaceElevated,
          backgroundColor: colors.surface,
          borderRadius: 8,
          flexDirection: "row",
        }}
      >
        <View>
          <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
            {props.class.degreeName}{" "}
            {termToFormattedString(props.class.semester)}{" "}
            {props.class.semester ? "Semester" : "Year"} {props.class?.section}
          </ThemedText>
          <ThemedText style={{}}>Subject: {props.subject}</ThemedText>
          {<ThemedText>Subject Code: {}</ThemedText>}
        </View>
        <View></View>
      </ThemedView>
    </ThemedView>
  );
};

export default ThemedClassCard;
