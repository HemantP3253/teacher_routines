import { dateToFormattedTimeString } from "@/utils/dateUtils";
import { formatTimeInput } from "@/utils/formatters";
import { pad } from "@/utils/stringUtils";
import { useEffect, useState } from "react";

export const useAssignTimeModal = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeValues, setTimeValues] = useState<{
    time: string;
    duration: string;
  }>({
    time: dateToFormattedTimeString(new Date(), true, false),
    duration: "",
  });

  const handleTimeInputChange = (text: string) => {
    const formatted = formatTimeInput(text);
    setTimeValues((prev) => ({ ...prev, time: formatted }));

    if (formatted.length >= 5) {
      const dayPeriod = formatted.slice(formatted.length - 2, formatted.length);
      const addHours = dayPeriod.toLowerCase() === "am" ? 0 : 12;
      const hours = Number(formatted.slice(0, 2)) + addHours;
      const minutes = Number(formatted.slice(3, 5));
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      setDate(newDate);
    }
  };

  const isClearable = timeValues.time !== "" || timeValues.duration !== "";
  const isSubmittable =
    timeValues.time.length >= 5 && timeValues.duration !== "";

  useEffect(() => {
    if (date) {
      // Convert the Date object from the picker into your HH:MM string format
      let hours = date.getHours();
      const dayPeriod = hours > 12 ? "PM" : "AM";
      hours -= hours > 12 ? 12 : 0;
      const minutes = pad(date.getMinutes());
      const formattedTime = `${pad(hours)}:${minutes} ${dayPeriod}`;

      setTimeValues((prev) => ({
        ...prev,
        time: formattedTime,
      }));
    }
  }, [date]);

  return {
    date,
    setDate,
    timeValues,
    setTimeValues,
    handleTimeInputChange,
    isClearable,
    isSubmittable,
  };
};
