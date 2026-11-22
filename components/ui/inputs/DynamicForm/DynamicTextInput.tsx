import {
  CalendarClockIcon,
  CalendarInfoIcon,
  ScheduleIcon,
} from "@/assets/icons";
import { IconProperties } from "@/types/common";
import {
  formatDateInput,
  formatDateTimeInput,
  formatEmailInput,
  formatLettersAndSpacesInput,
  formatLettersInput,
  formatNameInput,
  formatNumberInput,
  formatPhoneInput,
  formatTimeInput,
  formatUsernameInput,
} from "@/utils/formatters";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CustomPressable } from "../../primitives";
import CustomTextInput from "../CustomTextInput";
import { FormatType, InputField } from "./DynamicTextInput.types";

interface DynamicTextInputProps {
  inputField: InputField;
  value: string;
  onChangeText: (value: string) => void;
  onOpenPicker?: () => void;
}

const FORMATTERS: Record<
  FormatType,
  (input: string, precision?: number) => string
> = {
  date: (input) => formatDateInput(input),
  time: (input) => formatTimeInput(input),
  dateAndTime: (input) => formatDateTimeInput(input),
  "whole-number": (input) =>
    formatNumberInput({ text: input, formatType: "wholeNumber" }),
  "decimal-number": (input, precision) =>
    formatNumberInput({ text: input, formatType: "decimalNumber", precision }),
  email: (input) => formatEmailInput(input),
  name: (input) => formatNameInput(input),
  phone: (input) => formatPhoneInput(input),
  username: (input) => formatUsernameInput(input),
  letters: (input) => formatLettersInput(input),
  lettersAndSpaces: (input) => formatLettersAndSpacesInput(input),
};

const ICON_MAP: Partial<Record<FormatType, IconProperties["Icon"]>> = {
  date: CalendarInfoIcon,
  time: ScheduleIcon,
  dateAndTime: CalendarClockIcon,
};

const DynamicTextInput = ({
  inputField,
  value,
  onChangeText,
  onOpenPicker,
}: DynamicTextInputProps) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  const handleTextChange = (rawText: string) => {
    if (inputField.formatter) {
      onChangeText(inputField.formatter(rawText));
      return;
    }

    const formatFunction = inputField.inputFormatType
      ? FORMATTERS[inputField.inputFormatType]
      : null;

    const formattedText = formatFunction
      ? formatFunction(rawText, inputField.precision)
      : rawText;

    onChangeText(formattedText);
  };

  const SelectedIcon = inputField.showPicker
    ? ICON_MAP[inputField.showPicker]
    : null;

  return (
    <View>
      <CustomTextInput
        title={inputField.title}
        blendColor={inputField.blendColor ?? undefined}
        value={value}
        secureTextEntry={inputField.isSensitiveText}
        onChangeText={handleTextChange}
        keyboardType={inputField.keyboardType}
        customComponent={
          inputField.showPicker && (
            <CustomPressable
              noFill
              style={styles.pickerButton}
              onPress={onOpenPicker}
            >
              {SelectedIcon && <SelectedIcon fill={colors.primary} />}
            </CustomPressable>
          )
        }
        infoText={inputField.infoText}
      />
    </View>
  );
};

const styles = StyleSheet.create(({ spacing }) => ({
  pickerButton: {
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    justifyContent: "center",
  },
}));

export default DynamicTextInput;
