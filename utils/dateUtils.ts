import { pad } from "./stringUtils";

export const calculateFullPeriodTime = (
  timeString: string,
  minutesToAdd: number,
) => {
  const is24Hours = !is12HourTime(timeString);

  const time24 = is24Hours ? timeString : changeTimeMode(timeString, "24-hour");

  const [hours, minutes] = time24.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  const start = changeTimeMode(time24, "12-hour");
  const end = changeTimeMode(
    `${String(pad(date.getHours()))}:${String(pad(date.getMinutes()))}`,
    "12-hour",
  );

  return `${start} - ${end}`;
};

export const changeTimeMode = (
  time: string,
  targetMode?: "12-hour" | "24-hour" | "change",
  showSeconds: boolean = false,
) => {
  if (!time) return "";

  const currentMode = is12HourTime(time) ? "12-hour" : "24-hour";

  if (!targetMode || targetMode === "change") {
    targetMode = currentMode === "12-hour" ? "24-hour" : "12-hour";
  }

  if (currentMode === targetMode) return time;

  if (currentMode === "24-hour") {
    const parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    const seconds = showSeconds && parts[2] ? `:${parts[2]}` : "";

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
    const seconds = showSeconds && parts[2] ? `:${parts[2]}` : "";

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
  const is12hour = is12HourTime(timeString);
  timeString = is12hour ? changeTimeMode(timeString, "24-hour") : timeString;
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

interface RangeToSubjectTimeProps {
  times: {
    start: string;
    end: string;
    duration: string;
  };
  breakTime?:
    | {
        type: "range";
        start: string;
        end: string;
      }
    | {
        type: "duration";
        start: string;
        duration: string;
      };
  index: number;
}

export const RangeToSubjectTime = ({
  times,
  breakTime,
  index,
}: RangeToSubjectTimeProps) => {
  const durationMinutes: number = Number(times.duration);
  if (!durationMinutes) return null;

  const startMinutes: number = hoursToMinutes(
    changeTimeMode(times.start, "24-hour"),
  );
  const endMinutes: number = hoursToMinutes(
    changeTimeMode(times.end, "24-hour"),
  );

  let breakStartMinutes: number = 0;
  let breakEndMinutes: number = 0;
  let breakDuration: number = 0;

  if (breakTime) {
    breakStartMinutes = hoursToMinutes(
      changeTimeMode(breakTime.start, "24-hour"),
    );

    if (breakTime.type === "duration") {
      breakDuration = Number(breakTime.duration);
      breakEndMinutes = breakStartMinutes + breakDuration;
    } else {
      breakEndMinutes = hoursToMinutes(
        changeTimeMode(breakTime.end, "24-hour"),
      );
      breakDuration = breakEndMinutes - breakStartMinutes;
    }
  }

  const totalAvailableTime = endMinutes - startMinutes - breakDuration;
  const totalSubjects = Math.floor(totalAvailableTime / durationMinutes);

  if (index >= totalSubjects) return null;

  let startRange = startMinutes + index * durationMinutes;
  let endRange = startRange + durationMinutes;

  if (breakDuration > 0) {
    if (startRange >= breakStartMinutes) {
      startRange += breakDuration;
      endRange += breakDuration;
    } else if (endRange > breakStartMinutes) {
      endRange = breakStartMinutes;
    }
  }

  startRange %= 24 * 60;
  endRange %= 24 * 60;

  return {
    startTime: changeTimeMode(minutesToHours(startRange), "12-hour"),
    endTime: changeTimeMode(minutesToHours(endRange), "12-hour"),
    breakStartTime: changeTimeMode(
      minutesToHours(breakStartMinutes),
      "12-hour",
    ),
    breakEndTime: changeTimeMode(minutesToHours(breakEndMinutes), "12-hour"),
    breakDuration: breakDuration,
    type: "",
    duration: times.duration,
    totalSubjects: totalSubjects,
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

  if (is24Hour) {
    return `${pad(hours)}:${pad(minutes)}${secondsStr}`;
  }

  const ampm = hours >= 12 ? "PM" : "AM";
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12;

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
