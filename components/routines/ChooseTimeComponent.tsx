import { useAppTheme } from "@/contexts/ThemeContext";
import { useAssignTimeModal } from "@/hooks/useAssignTimeModal";
import { ChooseTimeComponentProps } from "@/interfaces/interfaces";
import { formatNumberInput } from "@/utils/formatters";
import { View } from "react-native";
import {
  ThemedPressable,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "../themed";

const ChooseTimeComponent = ({
  timeValues,
  date,
  setDate,
  setTimeValues,
  onClose,
  onSubmit,
  backgroundColor,
}: ChooseTimeComponentProps) => {
  const { theme } = useAppTheme();
  const colors = theme.colors;
  const { handleTimeInputChange } = useAssignTimeModal();

  const isClearable =
    timeValues.startTime !== "" ||
    timeValues.endTime !== "" ||
    timeValues.maxDuration !== "";
  const isSubmittable =
    timeValues.startTime.length >= 5 &&
    timeValues.endTime.length >= 5 &&
    timeValues.maxDuration !== "";
  return (
    <ThemedView style={{ backgroundColor: backgroundColor || colors.base300 }}>
      <View>
        <ThemedTextInput
          title="Start Time"
          value={timeValues.startTime}
          keyboardType="numeric"
          placeholder="HH:MM"
          onChangeText={(text) => handleTimeInputChange(text)}
          returnKeyType="default"
          blendColor={colors.base300}
          timeValues={{
            time: date,
            setTime: setDate,
          }}
        />
        <ThemedTextInput
          title="End Time"
          value={timeValues.endTime}
          keyboardType="numeric"
          placeholder="HH:MM"
          onChangeText={(text) => handleTimeInputChange(text)}
          returnKeyType="default"
          blendColor={colors.base300}
          timeValues={{
            time: date,
            setTime: setDate,
          }}
          infoText="Please enter the time in 24 hour time, or use the button provided for selecting time. The 24 hour format will automatically be converted to 12 hour time."
        />
        <ThemedTextInput
          title="Duration"
          value={timeValues.maxDuration}
          onChangeText={(duration) => {
            setTimeValues((prev) => ({
              ...prev,
              maxDuration: formatNumberInput({
                text: duration,
                formatType: "wholeNumber",
              }),
            }));
          }}
          returnKeyType="default"
          blendColor={colors.base300}
          keyboardType="numeric"
          maxLength={3}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingBottom: 8,
          paddingHorizontal: 8,
        }}
      >
        <ThemedPressable
          onPress={() => {
            if (!isClearable) return;
            setTimeValues({ startTime: "", endTime: "", maxDuration: "" });
          }}
          noFill
          style={[
            {
              width: "28%",
              alignItems: "center",
              backgroundColor: colors.base200,
            },
            isClearable
              ? { borderColor: colors.primary }
              : {
                  borderColor: colors.disabled,
                  backgroundColor: colors.disabled,
                },
          ]}
        >
          <ThemedText
            style={[
              { fontWeight: "600" },
              isClearable ? {} : { color: colors.disabledContent },
            ]}
          >
            Clear
          </ThemedText>
        </ThemedPressable>
        <ThemedPressable
          onPress={() => {
            if (!isSubmittable) return;
            onClose?.();
            onSubmit?.(
              timeValues.startTime,
              timeValues.endTime,
              timeValues.maxDuration,
            );
          }}
          style={[
            {
              width: "28%",
              alignItems: "center",
              backgroundColor: colors.base200,
            },
            isSubmittable
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.disabled },
          ]}
        >
          <ThemedText
            style={[
              { fontWeight: "600" },
              isSubmittable
                ? { color: colors.primaryContent }
                : { color: colors.disabledContent },
            ]}
          >
            Submit
          </ThemedText>
        </ThemedPressable>
      </View>
    </ThemedView>
  );
};

export default ChooseTimeComponent;
