import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export const dateTimePicker = (
  currentMode: "date" | "time",
  date: Date,
  setDate: (date: Date) => void,
  use24Hours?: boolean,
) => {
  const today = new Date();

  DateTimePickerAndroid.open({
    value: date,
    onChange: (event, date?: Date) => {
      if (!date || event.type === "dismissed") return;
      if (event.type === "set") setDate(date);
    },
    mode: currentMode,
    is24Hour: use24Hours ?? false,
    design: "material",
    maximumDate: today,
  });
};
