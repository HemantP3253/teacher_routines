import { pad } from "./stringUtils";

export const calculateFullPeriodTime = (
  timeString: string,
  minutesToAdd: number,
  is24hours: boolean = true,
) => {
  let hours = 0,
    minutes = 0;
  if (is24hours) {
    [hours, minutes] = timeString.split(":").map(Number);
  } else {
    hours = Number(timeString.slice(0, 2));
    minutes = Number(timeString.slice(3, 5));
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  date.setMinutes(date.getMinutes() + minutesToAdd);

  const oldMinutes = pad(minutes);

  let newHours = date.getHours();
  const newMinutes = pad(date.getMinutes());
  const newAMPM = newHours >= 12 ? "PM" : "AM";

  const oldAMPM = hours >= 12 ? "PM" : "AM";

  newHours %= 12;
  newHours = newHours ? newHours : 12;

  let oldHours = `${hours % 12}`;
  oldHours = `${hours ? pad(hours) : 12}`;

  return `${oldHours}:${oldMinutes} ${oldAMPM} - ${newHours}:${newMinutes} ${newAMPM}`;
};

export const changeTimeMode = (
  time: string,
  currentMode: "24-hour" | "12-hour",
  hideSeconds: boolean = false,
) => {
  if (!time) return "";

  if (currentMode === "24-hour") {
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

  if (currentMode === "12-hour") {
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

  const minutes1 = hoursToMinutes(changeTimeMode(time1.startTime, "12-hour"));
  const minutes2 = hoursToMinutes(changeTimeMode(time2.startTime, "12-hour"));

  const end1 = minutes1 + duration1;
  const end2 = minutes2 + duration2;

  // 1. Check if they completely clear each other
  const routine2EndsBeforeRoutine1Starts = end2 <= minutes1;
  const routine1EndsBeforeRoutine2Starts = end1 <= minutes2;

  if (routine2EndsBeforeRoutine1Starts || routine1EndsBeforeRoutine2Starts) {
    return false; // Safely separated!
  }

  // 2. Otherwise, they are overlapping (even at midnight!)
  return true;
};

export const RangeToSubjectTime = (
  startTime: string,
  endTime: string,
  maxDuration: string,
  index: number,
) => {
  const startTime24hours = changeTimeMode(startTime, "12-hour", true);
  const endTime24hours = changeTimeMode(endTime, "12-hour", true);

  const totalSubjects = Math.floor(
    (hoursToMinutes(endTime24hours) - hoursToMinutes(startTime24hours)) /
      Number(maxDuration),
  );
  if (index + 1 > totalSubjects) return null;
  const startTimeInMinutes = hoursToMinutes(startTime24hours);

  const [startRange, endRange] = [
    startTimeInMinutes + index * Number(maxDuration),
    startTimeInMinutes + (index + 1) * Number(maxDuration),
  ];

  return [minutesToHours(startRange), minutesToHours(endRange)];
};

export const dateToFormattedTimeString = (
  date: Date,
  hideSeconds?: boolean,
  is24Hour?: boolean,
) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const newHours = hours > 12 ? hours - 12 : hours;
  const ampm = hours > 12 ? "PM" : "AM";

  return `${is24Hour ? pad(hours) : pad(newHours)}:${pad(minutes)}${hideSeconds ? "" : ":" + pad(seconds)} ${ampm}`;
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
