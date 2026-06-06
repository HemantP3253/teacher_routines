import { useAssignTimeModal } from "@/hooks/useAssignTimeModal";
import { AssignTimeModalProps } from "@/interfaces/interfaces";
import { formatNumberInput } from "@/utils/formatters";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomModal } from "../common";
import {
  ThemedPressable,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "../themed";

const AssignTimeModal = ({
  visible,
  onClose,
  title,
  onSubmit,
}: AssignTimeModalProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;
  const {
    date,
    setDate,
    timeValues,
    setTimeValues,
    handleTimeInputChange,
    isClearable,
    isSubmittable,
  } = useAssignTimeModal();

  return (
    <CustomModal
      modalVisible={visible}
      animationType="fade"
      style={{}}
      setModalVisible={(isVisible) => {
        if (!isVisible && onClose) {
          setTimeValues({ time: "", duration: "" });
          onClose();
        }
      }}
    >
      <ThemedView
        style={{
          width: "100%",
          maxHeight: "100%",
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: colors.base100,
        }}
      >
        <ThemedText
          type="baseContent"
          style={{
            fontSize: 18,
            padding: 8,
            fontWeight: "800",
            textAlign: "center",
            color: colors.primary,
            margin: 4,
          }}
        >
          {title}
        </ThemedText>
        <ThemedView style={{ backgroundColor: colors.base300 }}>
          <View>
            <ThemedTextInput
              title="Start Time"
              value={timeValues.time}
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
              value={timeValues.duration}
              onChangeText={(duration) => {
                setTimeValues((prev) => ({
                  ...prev,
                  duration: formatNumberInput({
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
                setTimeValues({ time: "", duration: "" });
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
                if (onClose) onClose();
                if (onSubmit) onSubmit(timeValues.time, timeValues.duration);
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
      </ThemedView>
    </CustomModal>
  );
};

export default AssignTimeModal;
