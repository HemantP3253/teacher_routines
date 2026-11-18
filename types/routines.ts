export type Days =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type ActiveSubjectInfo = {
  index: number;
  subjectId: string;
  teacherId: string;
};

export type MenuSteps = "Program" | "Branch" | "Term";

export interface RoutineMetadata {
  unitId: string | null;
  programId: string | null;
  branchId: string | null;
  academicLevelId: string | null;
  batchAndSection: string;
}

export interface RoutineOption {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  periodDuration: number;
  activeDays: Days[];
}
