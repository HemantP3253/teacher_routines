import { useState } from "react";
import { AdToBs, BsToAd, NepaliToday } from "react-native-nepali-picker";

interface UseAppDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const useAppDatePicker = ({
  selectedDate,
  onDateChange,
}: UseAppDatePickerProps) => {
  const [visible, setVisible] = useState(false);

  const openPicker = () => setVisible(true);

  const closePicker = () => setVisible(false);

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
    closePicker();
    onDateChange(new Date(BsToAd(bsDate)));
  };

  return {
    visible,
    openPicker,
    closePicker,
    getInitialBsValue,
    handleNepaliDateSelect,
  };
};
