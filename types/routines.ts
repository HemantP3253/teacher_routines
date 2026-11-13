type Days =
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
