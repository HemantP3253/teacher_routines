import {
  CalendarClockIcon,
  CalendarInfoIcon,
  ScheduleIcon,
} from "@/assets/icons";
import { DynamicTextInputProps, formatType } from "@/interfaces/interfaces";
import {
  formatDateInput,
  formatDateTimeInput,
  formatEmailInput,
  formatNameInput,
  formatNumberInput,
  formatPhoneInput,
  formatTimeInput,
  formatUsernameInput,
} from "@/utils/formatters";
import {
  CalendarType,
  MainPickerMode,
  useAppDatePicker,
} from "@/utils/pickerUtils";
import { pad } from "@/utils/stringUtils";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import {
  ThemedCheckbox,
  ThemedPressable,
  ThemedText,
  ThemedTextInput,
} from "../themed";

const DynamicTextInput = ({
  inputFields,
  extraInputs,
  onSubmit,
  defaultValues,
}: DynamicTextInputProps) => {
  const { colors } = useUnistyles().theme;

  const [textValues, setTextValues] = useState<string[]>(() => {
    return defaultValues || Array(inputFields.length).fill("");
  });

  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(
    null,
  );
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>(
    new Date(),
  );

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

  const handleOpenPicker = (index: number) => {
    setActivePickerIndex(index);

    const rawVal = textValues[index];
    const parsedDate = rawVal ? new Date(rawVal) : new Date();
    const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    setCurrentSelectedDate(validDate);

    const fieldConfig = inputFields[index];
    const mode: MainPickerMode = fieldConfig.showPicker ?? "date";
    const calendarType: CalendarType = "AD"; // TODO: Make dates be switchable to AD and BS using user settings

    datePicker.openPicker({ mode, calendarType });
  };

  const isClearable = useMemo(() => {
    return textValues.some((text) => text.trim() !== "");
  }, [textValues]);

  const isSubmittable = useMemo(() => {
    return textValues.every((value, index) => {
      const isNullable = inputFields[index]?.isNullable;
      if (!isNullable && value === "") return false;
      return true;
    });
  }, [textValues, inputFields]);

  useEffect(() => {
    if (defaultValues) {
      setTextValues(defaultValues);
    } else {
      setTextValues(Array(inputFields.length).fill(""));
    }
  }, [JSON.stringify(defaultValues)]);

  const formatData = (
    inputFormatType: formatType,
    input: string,
    precision?: number,
  ): string => {
    switch (inputFormatType) {
      case "date":
        return formatDateInput(input);
      case "decimal-number":
        return formatNumberInput({
          text: input,
          formatType: "decimalNumber",
          precision: precision,
        });
      case "whole-number":
        return formatNumberInput({ text: input, formatType: "wholeNumber" });
      case "email":
        return formatEmailInput(input);
      case "name":
        return formatNameInput(input);
      case "phone":
        return formatPhoneInput(input);
      case "time":
        return formatTimeInput(input);
      case "username":
        return formatUsernameInput(input);
      default:
        return input;
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "position"}
      >
        <View>
          {inputFields.map((input, index) => {
            return (
              <ThemedTextInput
                key={`${input.title}-${index}`}
                title={input.title}
                blendColor={input.blendColor ?? undefined}
                value={textValues[index] || ""}
                secureTextEntry={input.isSensitiveText}
                onChangeText={(value) => {
                  const formattedText = input?.inputFormatType
                    ? formatData(input.inputFormatType, value, input.precision)
                    : value;

                  handleTextChange(formattedText, index);
                }}
                customComponent={
                  input.showPicker && (
                    <ThemedPressable
                      noFill
                      style={styles.pickerButton}
                      onPress={() => handleOpenPicker(index)}
                    >
                      {input.showPicker === "date" && (
                        <CalendarInfoIcon fill={colors.primary} />
                      )}
                      {input.showPicker === "time" && (
                        <ScheduleIcon fill={colors.primary} />
                      )}
                      {input.showPicker === "dateAndTime" && (
                        <CalendarClockIcon fill={colors.primary} />
                      )}
                    </ThemedPressable>
                  )
                }
              />
            );
          })}

          {extraInputs?.inputFields && extraInputs.captionText && (
            <View>
              <ThemedCheckbox
                label="Mahendra Multiple Campus, Nepalgunj"
                subLabel="Sadarline, Nepalgunj - 10, Banke, Lumbini Province, Nepal"
                style={{ padding: 4 }}
                alwaysShowSubLabel
              />
            </View>
          )}

          <View style={styles.actionButtonsContainer}>
            <ThemedPressable
              noFill
              disabled={!isClearable}
              style={isClearable ? styles.actionButtons : styles.buttonDisabled}
              onPress={() => setTextValues(Array(inputFields.length).fill(""))}
            >
              <ThemedText
                style={styles.actionButtonsText}
                type={isClearable ? "text" : "disabledContent"}
              >
                Clear All
              </ThemedText>
            </ThemedPressable>

            <ThemedPressable
              style={
                isSubmittable ? styles.actionButtons : styles.buttonDisabled
              }
              disabled={!isSubmittable}
              onPress={() => onSubmit?.(textValues)}
            >
              <ThemedText
                type={isSubmittable ? "primaryContent" : "disabledContent"}
                style={styles.actionButtonsText}
              >
                Submit
              </ThemedText>
            </ThemedPressable>
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
                  onChange={datePicker.handleStandardSelect}
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
                onChange={datePicker.handleStandardSelect}
              />
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  scrollContainer: { flex: 1 },
  actionButtonsContainer: { flexDirection: "row", flex: 1 },
  actionButtons: {
    alignItems: "center",
    flex: 1,
  },
  actionButtonsText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    flex: 1,
    alignItems: "center",
    borderWidth: 0,
  },
  pickerButton: {
    minHeight: 48,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
}));

export default DynamicTextInput;
