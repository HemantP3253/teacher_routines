import {
  formatDateInput,
  formatDateTimeInput,
  formatTimeInput,
} from "@/utils/formatters";
import { useAppDatePicker } from "@/utils/pickerUtils";
import { pad } from "@/utils/stringUtils";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Spacer from "../../../common/Spacer";
import { ThemedCheckbox } from "../../../themed";
import { CustomPressable, CustomText } from "../../primitives";
import DynamicTextInput from "./DynamicTextInput";
import { InputField } from "./DynamicTextInput.types";

interface DynamicFormContainerProps {
  title?: string;
  inputFields: InputField[];
  extraInputs?: {
    captionText: string;
    subCaptionText?: string;
    inputFields: InputField[];
  };
  optionalInputFields?: InputField[];
  onSubmit?: (inputs: string[]) => void;
  defaultValues?: string[];
  CustomComponent?: React.ReactNode;
}

const DynamicFormContainer = ({
  title,
  inputFields,
  extraInputs,
  onSubmit,
  defaultValues,
  CustomComponent,
}: DynamicFormContainerProps) => {
  const extraCount = extraInputs?.inputFields.length || 0;
  const totalFieldsCount = inputFields.length + extraCount;
  const [textValues, setTextValues] = useState<string[]>(() => {
    return defaultValues || Array(totalFieldsCount).fill("");
  });

  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(
    null,
  );
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>(
    new Date(),
  );

  const [isExtraInputsChecked, setIsExtraInputsChecked] =
    useState<boolean>(false);

  const handleTextChange = (value: string, index: number) => {
    setTextValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const datePicker = useAppDatePicker({
    selectedDate: currentSelectedDate,
    onDateChange: (date) => {
      if (activePickerIndex === null) return;

      const pickerMode = datePicker.mode;
      let formattedValue = "";

      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());

      if (pickerMode === "date") {
        formattedValue = formatDateInput(`${yyyy}-${mm}-${dd}`);
      } else if (pickerMode === "time") {
        formattedValue = formatTimeInput(`${hh}:${min}`);
      } else if (pickerMode === "dateAndTime") {
        formattedValue = formatDateTimeInput(
          `${yyyy}-${mm}-${dd} ${hh}:${min}`,
        );
      }

      handleTextChange(formattedValue, activePickerIndex);
      setActivePickerIndex(null);
    },
  });

  const isClearable = useMemo(() => {
    return textValues.some((text) => text.trim() !== "");
  }, [textValues]);

  const isSubmittable = useMemo(() => {
    const areMainFieldsValid = inputFields.every((field, index) => {
      if (!field.isNullable && textValues[index] === "") return false;
      return true;
    });

    if (!areMainFieldsValid) return false;

    if (extraInputs && isExtraInputsChecked) {
      return extraInputs.inputFields.every((field, extraIndex) => {
        const actualIndex = inputFields.length + extraIndex;
        if (!field.isNullable && textValues[actualIndex] === "") return false;
        return true;
      });
    }

    return true;
  }, [textValues, inputFields, extraInputs, isExtraInputsChecked]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "position"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {title && (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <CustomText
              type="text"
              style={{ fontWeight: "bold", fontSize: 20 }}
            >
              {title}
            </CustomText>
          </View>
        )}
        <View>
          {inputFields.map((input, index) => {
            return (
              <DynamicTextInput
                key={`${input.title}-${index}`}
                value={textValues[index]}
                onChangeText={(value) => handleTextChange(value, index)}
                onOpenPicker={() =>
                  input.showPicker &&
                  datePicker.openPicker({ mode: input.showPicker })
                }
                inputField={input}
              />
            );
          })}

          {CustomComponent}

          {extraInputs && (
            <View>
              <ThemedCheckbox
                label={extraInputs.captionText}
                subLabel={extraInputs?.subCaptionText}
                isChecked={isExtraInputsChecked}
                onPress={() => setIsExtraInputsChecked((prev) => !prev)}
                style={{ padding: 4 }}
                alwaysShowSubLabel
              />
            </View>
          )}

          {extraInputs &&
            isExtraInputsChecked &&
            extraInputs.inputFields.map((input, index) => {
              const actualIndex = inputFields.length + index;

              return (
                <DynamicTextInput
                  key={`${input.title}-${actualIndex}`}
                  inputField={input}
                  value={textValues[actualIndex]}
                  onChangeText={(value) => handleTextChange(value, actualIndex)}
                  onOpenPicker={() =>
                    input.showPicker &&
                    datePicker.openPicker({ mode: input.showPicker })
                  }
                />
              );
            })}

          <Spacer size={16} />

          <View style={styles.actionButtonsContainer}>
            <CustomPressable
              noFill
              disabled={!isClearable}
              style={[
                styles.actionButtons,
                !isClearable && styles.buttonDisabled,
              ]}
              onPress={() => setTextValues(Array(totalFieldsCount).fill(""))}
            >
              <CustomText
                style={styles.actionButtonsText}
                type={isClearable ? "text" : "disabledContent"}
              >
                Clear All
              </CustomText>
            </CustomPressable>

            <CustomPressable
              style={[
                styles.actionButtons,
                !isSubmittable && styles.buttonDisabled,
              ]}
              disabled={!isSubmittable}
              onPress={() => {
                if (extraInputs && !isExtraInputsChecked)
                  onSubmit?.(textValues.slice(0, inputFields.length));
                else onSubmit?.(textValues);
              }}
            >
              <CustomText
                type={isSubmittable ? "primaryContent" : "disabledContent"}
                style={styles.actionButtonsText}
              >
                Submit
              </CustomText>
            </CustomPressable>
          </View>
        </View>

        {datePicker.visible && (
          <>
            {/* DATE or DATE_AND_TIME (First Step) */}
            {(datePicker.mode === "date" ||
              (datePicker.mode === "dateAndTime" &&
                datePicker.dateTimeStep === "date")) && (
              <>
                {/* {datePicker.calendarType === "bs" ? (
                  <NepaliDatePicker
                    value={datePicker.getInitialBsValue()}
                    onSelect={datePicker.handleNepaliDateSelect}
                    onClose={datePicker.closePicker}
                  />
                ) : ( */}
                <DateTimePicker
                  value={currentSelectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onValueChange={datePicker.handleStandardSelect}
                />
                {/* )} */}
              </>
            )}

            {/* TIME or DATE_AND_TIME (Second Step) */}
            {(datePicker.mode === "time" ||
              (datePicker.mode === "dateAndTime" &&
                datePicker.dateTimeStep === "time")) && (
              <DateTimePicker
                value={currentSelectedDate}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onValueChange={datePicker.handleStandardSelect}
              />
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create(({ colors, spacing, radius }) => ({
  actionButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: spacing.md,
  },
  actionButtons: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: spacing.md,
  },
  actionButtonsText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    borderWidth: 0,
  },
  pickerButton: {
    minHeight: 48,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
}));

export default DynamicFormContainer;
