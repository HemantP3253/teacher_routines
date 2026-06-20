import { pad } from "./stringUtils";

export const calculateFullPeriodTime = (
  timeString: string,
  minutesToAdd: number,
) => {
  const is24Hours = !is12HourTime(timeString);

  const time24 = is24Hours ? timeString : changeTimeMode(timeString);

  const [hours, minutes] = time24.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  const start = changeTimeMode(time24);
  const end = changeTimeMode(
    `${String(pad(date.getHours()))}:${String(pad(date.getMinutes()))}`,
  );

  return `${start} - ${end}`;
};

export const changeTimeMode = (
  time: string,
  hideSeconds: boolean = false,
  currentMode: "24-hour" | "12-hour" | "auto" = "auto",
) => {
  if (!time) return "";

  let detectedMode = currentMode;
  if (detectedMode === "auto") {
    detectedMode = is12HourTime(time) ? "12-hour" : "24-hour";
  }

  if (detectedMode === "24-hour") {
    const parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    const seconds = !hideSeconds && parts[2] ? `:${parts[2]}` : "";

    const dayPeriod = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    const formattedHours = String(hours).padStart(2, "0");

    return `${formattedHours}:${minutes}${seconds} ${dayPeriod}`;
  }

  if (detectedMode === "12-hour") {
    const isPM = time.includes("PM");
    const cleanTime = time.replace(/ (AM|PM)/i, "");
    const parts = cleanTime.split(":");

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = !hideSeconds && parts[2] ? `:${parts[2]}` : "";

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const formattedHours = String(hours).padStart(2, "0");

    return `${formattedHours}:${minutes}${seconds}`;
  }

  return "";
};

export const is12HourTime = (time: string) => {
  return /[AM|PM]/i.test(time);
};

export const hoursToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToHours = (minutes: number) => {
  const hoursString = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minutesString = (minutes % 60).toString().padStart(2, "0");
  return `${hoursString}:${minutesString}`;
};

export const doesRoutineCollide = ({
  time1,
  time2,
}: {
  time1: { startTime: string; duration: string };
  time2: { startTime: string; duration: string };
}) => {
  const duration1 = Number(time1.duration);
  const duration2 = Number(time2.duration);

  const minutes1 = hoursToMinutes(changeTimeMode(time1.startTime));
  const minutes2 = hoursToMinutes(changeTimeMode(time2.startTime));

  const end1 = minutes1 + duration1;
  const end2 = minutes2 + duration2;

  const routine2EndsBeforeRoutine1Starts = end2 <= minutes1;
  const routine1EndsBeforeRoutine2Starts = end1 <= minutes2;

  if (routine2EndsBeforeRoutine1Starts || routine1EndsBeforeRoutine2Starts) {
    return false;
  }

  return true;
};

export const RangeToSubjectTime = (
  startTime: string,
  endTime: string,
  maxDuration: string,
  index: number,
) => {
  const durationMinutes = Number(maxDuration);
  if (!durationMinutes) return null;

  const startMinutes = hoursToMinutes(changeTimeMode(startTime));

  let endMinutes = hoursToMinutes(changeTimeMode(endTime));

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const totalSubjects = Math.floor(
    (endMinutes - startMinutes) / durationMinutes,
  );

  if (index > totalSubjects) return null;

  const startRange = (startMinutes + index * durationMinutes) % (24 * 60);

  const endRange = (startMinutes + (index + 1) * durationMinutes) % (24 * 60);

  return {
    startTime: changeTimeMode(minutesToHours(startRange)),
    endTime: changeTimeMode(minutesToHours(endRange)),
    duration: maxDuration,
    totalSubjects: totalSubjects + 1,
  };
};

export const dateToFormattedTimeString = (
  date: Date,
  hideSeconds: boolean = false,
  is24Hour: boolean = false,
) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (num: number) => String(num).padStart(2, "0");
  const secondsStr = hideSeconds ? "" : `:${pad(seconds)}`;

  // 🕒 24-Hour Branch logic: No AM/PM appended
  if (is24Hour) {
    return `${pad(hours)}:${pad(minutes)}${secondsStr}`;
  }

  // ⏰ 12-Hour Branch logic: Handles noon/midnight conversions perfectly
  const ampm = hours >= 12 ? "PM" : "AM";
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12; // Fixes the 00:00 midnight issue

  return `${pad(displayHours)}:${pad(minutes)}${secondsStr} ${ampm}`;
};

export const timeStringToDateObject = (
  time: string,
  date: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
) => {
  const hours = Number(
    time.slice(0, 2) + (time[time.length - 1] === "A") ? 0 : 12,
  );
  const minutes = Number(time.slice(3, 5));
  const seconds = time.length > 7 ? Number(time.slice(6, 8)) : undefined;
  const dateString = date.toString();

  setDate(
    new Date(
      new Date(dateString).setHours(hours, minutes, seconds ? seconds : 0),
    ),
  );
};

export const calculateAgeByDOB = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);

  let age: number = today.getFullYear() - birthDate.getFullYear();
  let monthDifference: number = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
