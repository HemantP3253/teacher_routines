import { useState } from "react";
import { AdToBs, BsToAd, NepaliToday } from "react-native-nepali-picker";

export type MainPickerMode = "date" | "dateAndTime" | "time";
export type CalendarType = "BS" | "AD";

export interface OpenPickerConfig {
  mode: MainPickerMode;
  calendarType?: CalendarType;
}

interface UseAppDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const useAppDatePicker = ({
  selectedDate,
  onDateChange,
}: UseAppDatePickerProps) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<MainPickerMode>("date");
  const [calendarType, setCalendarType] = useState<CalendarType>("AD");

  const [dateTimeStep, setDateTimeStep] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date>(selectedDate);

  const openPicker = ({ mode, calendarType = "AD" }: OpenPickerConfig) => {
    setMode(mode);
    setCalendarType(calendarType);
    setDateTimeStep("date");
    setTempDate(selectedDate);
    setVisible(true);
  };

  const closePicker = () => {
    setVisible(false);
    setDateTimeStep("date");
  };

  const getInitialBsValue = () => {
    try {
      return AdToBs(
        [
          selectedDate.getFullYear(),
          String(selectedDate.getMonth() + 1).padStart(2, "0"),
          String(selectedDate.getDate()).padStart(2, "0"),
        ].join("-"),
      );
    } catch {
      return NepaliToday();
    }
  };

  const handleNepaliDateSelect = (bsDate: string) => {
    const convertedAdDate = new Date(BsToAd(bsDate));

    if (mode === "dateAndTime") {
      setTempDate(convertedAdDate);
      setDateTimeStep("time");
    } else {
      closePicker();
      onDateChange(convertedAdDate);
    }
  };

  const handleStandardSelect = (event: any, date?: Date) => {
    if (!date) {
      closePicker();
      return;
    }

    if (mode === "dateAndTime" && dateTimeStep === "date") {
      setTempDate(date);
      setDateTimeStep("time");
    } else if (mode === "dateAndTime" && dateTimeStep === "time") {
      const finalDateTime = new Date(tempDate);
      finalDateTime.setHours(date.getHours(), date.getMinutes());
      closePicker();
      onDateChange(finalDateTime);
    } else {
      closePicker();
      onDateChange(date);
    }
  };

  return {
    visible,
    mode,
    calendarType,
    dateTimeStep,
    openPicker,
    closePicker,
    getInitialBsValue,
    handleNepaliDateSelect,
    handleStandardSelect,
  };
};
