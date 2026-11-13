import {
  AcademicLevel,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { ActiveSubjectInfo, RoutineOption } from "@/types/routines";
import { create } from "zustand";

interface RoutineState {
  // Routine Filters
  selectedProgram: UniversityProgram | null;
  setProgram: (program: UniversityProgram | null) => void;

  selectedBranch: UniversityBranch | null;
  setBranch: (branch: UniversityBranch | null) => void;

  selectedAcademicLevel: AcademicLevel | null;
  setAcademicLevel: (academicLevel: AcademicLevel | null) => void;

  selectedBatchAndSection: string | null;
  setBatchAndSection: (batchAndSection: string | null) => void;

  // Routine Configuration
  selectedRoutineOption: RoutineOption | null;
  setRoutineOption: (option: RoutineOption | null) => void;

  // User selected subjects
  activeSubjectsInfo: ActiveSubjectInfo[];
  setActiveSubjectsInfo: (subjects: ActiveSubjectInfo[]) => void;

  /**
   * Utility to clear stored routine filters. The filters selected will be cleared, while
   * the unselected ones remain the same
   *
   * @param filters list of filters for clearing routine state
   */
  clearRoutine: () => void;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  selectedProgram: null,
  selectedBranch: null,
  selectedAcademicLevel: null,
  selectedBatchAndSection: null,
  selectedRoutineOption: null,
  activeSubjectsInfo: [],

  setProgram: (program) =>
    set({
      selectedProgram: program,
      selectedBranch: null,
      selectedAcademicLevel: null,
      selectedBatchAndSection: null,
      activeSubjectsInfo: [],
    }),
  setBranch: (branch) =>
    set({
      selectedBranch: branch,
      selectedAcademicLevel: null,
      selectedBatchAndSection: null,
      activeSubjectsInfo: [],
    }),
  setAcademicLevel: (academicLevel) =>
    set({
      selectedAcademicLevel: academicLevel,
      selectedBatchAndSection: null,
      activeSubjectsInfo: [],
    }),
  setBatchAndSection: (batchAndSection) =>
    set({ selectedBatchAndSection: batchAndSection, activeSubjectsInfo: [] }),

  setRoutineOption: (option) => set({ selectedRoutineOption: option }),
  setActiveSubjectsInfo: (subjects) => set({ activeSubjectsInfo: subjects }),

  clearRoutine: () => {
    set({
      selectedProgram: null,
      selectedBranch: null,
      selectedAcademicLevel: null,
      selectedBatchAndSection: null,
      activeSubjectsInfo: [],
    });
  },
}));
