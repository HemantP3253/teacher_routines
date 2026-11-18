import { LocalRoutinesData } from "@/types/localDbTypes";
import {
  ActiveSubjectInfo,
  RoutineMetadata,
  RoutineOption,
} from "@/types/routines";
import { randomUUID } from "expo-crypto";
import { changeTimeMode, hoursToMinutes, minutesToHours } from "./dateUtils";

interface GenerateRoutinesArrayParams {
  routineOption: RoutineOption;
  activeSubjectsInfo: ActiveSubjectInfo[];
  routineMetadata: RoutineMetadata;
  customDuration?: Record<number, number>;
  instituteId: string;
}

interface RangeToSubjectTimeProps {
  routineOption: RoutineOption | null;
  index: number;
  customDuration?: Record<number, number>;
}

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

export const getValidTeachingSlots = (
  routineOption: RoutineOption | null,
  customDuration: Record<number, number> = {},
) => {
  if (!routineOption || routineOption.periodDuration <= 0) return [];

  const startMinutes = hoursToMinutes(
    changeTimeMode(routineOption.startTime, "24-hour"),
  );
  const endMinutes = hoursToMinutes(
    changeTimeMode(routineOption.endTime, "24-hour"),
  );
  const defaultDuration = routineOption.periodDuration;

  let breakStartMinutes = -1;
  let breakEndMinutes = -1;

  if (routineOption.breakStartTime && routineOption.breakEndTime) {
    breakStartMinutes = hoursToMinutes(
      changeTimeMode(routineOption.breakStartTime, "24-hour"),
    );
    breakEndMinutes = hoursToMinutes(
      changeTimeMode(routineOption.breakEndTime, "24-hour"),
    );
  }

  const validSlots: { start: number; end: number; duration: number }[] = [];
  let currentMin = startMinutes;
  let subjectIndex = 0;

  while (currentMin < endMinutes) {
    const currentDuration = customDuration[subjectIndex] ?? defaultDuration;
    const slotStart = currentMin;
    const slotEnd = currentMin + currentDuration;

    if (slotEnd > endMinutes) break;

    const overlapBreak =
      breakStartMinutes !== -1 &&
      breakEndMinutes !== -1 &&
      slotStart < breakEndMinutes &&
      slotEnd > breakStartMinutes;

    if (overlapBreak) {
      currentMin = breakEndMinutes;
      continue;
    }

    validSlots.push({
      start: slotStart,
      end: slotEnd,
      duration: currentDuration,
    });
    currentMin = slotEnd;
    subjectIndex++;
  }

  return validSlots;
};

export const RangeToSubjectTime = ({
  routineOption,
  index,
  customDuration = {},
}: RangeToSubjectTimeProps) => {
  const validSlots = getValidTeachingSlots(routineOption, customDuration);

  if (index >= validSlots.length) return null;

  const slot = validSlots[index];

  return {
    startTime: changeTimeMode(minutesToHours(slot.start), "12-hour"),
    endTime: changeTimeMode(minutesToHours(slot.end), "12-hour"),
    duration: slot.duration,
    totalSubjects: validSlots.length,
  };
};

export const generateRoutinesArray = ({
  routineOption,
  activeSubjectsInfo,
  routineMetadata,
  customDuration = {},
  instituteId,
}: GenerateRoutinesArrayParams): Partial<LocalRoutinesData>[] => {
  if (
    !routineOption ||
    !routineOption.activeDays ||
    routineOption.activeDays.length === 0
  )
    return [];

  const validSlots = getValidTeachingSlots(routineOption, customDuration);

  return activeSubjectsInfo
    .map((info, index) => {
      const slot = validSlots[index];
      if (!slot) return null;

      return {
        id: randomUUID(),

        // Routine metadata
        unitId: routineMetadata.unitId ?? undefined,
        programId: routineMetadata.programId,
        branchId: routineMetadata.branchId ?? null,
        semesterId: routineMetadata.academicLevelId,
        batchAndSection: routineMetadata.batchAndSection,

        // Routine time details
        startTime: changeTimeMode(minutesToHours(slot.start), "12-hour"),
        endTime: changeTimeMode(minutesToHours(slot.end), "12-hour"),
        days: routineOption.activeDays,

        // Routine entitities details
        subjectId: info.subjectId,
        teacherId: info.teacherId,
        instituteId: instituteId,

        // Not applicable details
        gradeId: null,
        streamId: null,

        // Sync metadata
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as Partial<LocalRoutinesData>;
    })
    .filter((item): item is Partial<LocalRoutinesData> => item !== null);
};
