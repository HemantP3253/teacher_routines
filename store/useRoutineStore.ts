import {
  AcademicLevel,
  CurriculumSubject,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { RoutineOption } from "@/types/routines";
import { create } from "zustand";

interface RoutineState {
  // Routine Filters
  selectedProgram: UniversityProgram | null;
  selectedBranch: UniversityBranch | null;
  selectedAcademicLevel: AcademicLevel | null;
  selectedBatchAndSection: string | null;

  // Routine Configuration
  selectedRoutineOption: RoutineOption | null;

  // User selected subjects
  activeSubjects: CurriculumSubject[];

  // Setter functions.
  setProgram: (program: UniversityProgram | null) => void;
  setBranch: (branch: UniversityBranch | null) => void;
  setAcademicLevel: (academicLevel: AcademicLevel | null) => void;
  setBatchAndSection: (batchAndSection: string | null) => void;
  setActiveSubjects: (subjects: CurriculumSubject[]) => void;
  setRoutineOption: (option: RoutineOption | null) => void;

  /**
   * Utility to clear stored routine filters. The filters selected will be cleared, while
   * the unselected ones remain the same
   *
   * @param filters list of filters for clearing routine state
   */
  clearRoutine: (filters: {
    program?: boolean;
    branch?: boolean;
    academicLevel?: boolean;
    batchAndSection?: boolean;
    activeSubjects?: boolean;
  }) => void;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  selectedProgram: null,
  selectedBranch: null,
  selectedAcademicLevel: null,
  selectedBatchAndSection: null,
  selectedRoutineOption: null,
  activeSubjects: [],

  setProgram: (program) => set({ selectedProgram: program }),
  setBranch: (branch) => set({ selectedBranch: branch }),
  setAcademicLevel: (academicLevel) =>
    set({ selectedAcademicLevel: academicLevel }),
  setBatchAndSection: (batchAndSection) =>
    set({ selectedBatchAndSection: batchAndSection }),

  setRoutineOption: (option) => set({ selectedRoutineOption: option }),
  setActiveSubjects: (subjects) => set({ activeSubjects: subjects }),

  clearRoutine: (filters) => {
    set((state) => ({
      selectedProgram: filters.program ? null : state.selectedProgram,
      selectedBranch: filters.branch ? null : state.selectedBranch,
      selectedAcademicLevel: filters.academicLevel
        ? null
        : state.selectedAcademicLevel,
      selectedBatchAndSection: filters.batchAndSection
        ? null
        : state.selectedBatchAndSection,
      activeSubjects: filters.activeSubjects ? [] : state.activeSubjects,
    }));
  },
}));
