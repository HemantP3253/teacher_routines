import { getProgramContextById } from "@/data/curricula/university/TU/tuHelpers";
import { saveRoutinesByBatch } from "@/services/routineService";
import {
  AcademicLevel,
  UniversityBranch,
  UniversityProgram,
} from "@/types/academic";
import { ActiveSubjectInfo, RoutineOption } from "@/types/routines";
import { generateRoutinesArray } from "@/utils/routineUtils";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

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
  trimActiveSubjectsInfo: (maxSubjects: number) => void;
  setActiveSubjectsInfo: (subjects: ActiveSubjectInfo[]) => void;
  upsertActiveSubjectInfo: (subjectInfo: ActiveSubjectInfo) => void;
  removeActiveSubjectInfo: (index: number) => void;
  reorderActiveSubjectInfo: (reorderedSubjects: ActiveSubjectInfo[]) => void;

  /**
   * Utility to clear stored routine filters. The filters selected will be cleared, while
   * the unselected ones remain the same
   *
   * @param filters list of filters for clearing routine state
   */
  clearRoutine: () => void;
  generateAndSaveRoutines: (
    customDuration?: Record<number, number>,
  ) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
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

  trimActiveSubjectsInfo: (maxSubjects) =>
    set((state) => ({
      activeSubjectsInfo: state.activeSubjectsInfo.filter(
        (subject) => subject.index < maxSubjects,
      ),
    })),
  setActiveSubjectsInfo: (subjects) => set({ activeSubjectsInfo: subjects }),
  upsertActiveSubjectInfo: (newInfo) =>
    set((state) => {
      const exists = state.activeSubjectsInfo.some(
        (subject) => subject.subjectId === newInfo.subjectId,
      );

      if (exists) {
        return {
          activeSubjectsInfo: state.activeSubjectsInfo.map((subject) =>
            subject.index === newInfo.index
              ? { ...subject, ...newInfo }
              : subject,
          ),
        };
      }

      return {
        activeSubjectsInfo: [...state.activeSubjectsInfo, newInfo],
      };
    }),
  removeActiveSubjectInfo: (index) =>
    set((state) => ({
      activeSubjectsInfo: state.activeSubjectsInfo.filter(
        (subject) => subject.index !== index,
      ),
    })),
  reorderActiveSubjectInfo: (reorderedSubjects) =>
    set({
      activeSubjectsInfo: reorderedSubjects.map((item, index) => ({
        ...item,
        index: index,
      })),
    }),

  clearRoutine: () => {
    set({
      selectedProgram: null,
      selectedBranch: null,
      selectedAcademicLevel: null,
      selectedBatchAndSection: null,
      activeSubjectsInfo: [],
    });
  },

  generateAndSaveRoutines: async (customDuration) => {
    const {
      selectedRoutineOption,
      selectedProgram,
      selectedBranch,
      selectedAcademicLevel,
      selectedBatchAndSection,
      activeSubjectsInfo,
    } = get();

    if (
      !selectedRoutineOption ||
      !selectedProgram ||
      !selectedBranch ||
      !selectedAcademicLevel ||
      !selectedBatchAndSection ||
      activeSubjectsInfo.length === 0
    )
      throw new Error(
        "Please select all the program details before saving routines.",
      );

    const instituteId = useAuthStore.getState().currentInstituteId;

    if (!instituteId) {
      throw new Error("Institute id not found, unauthorized action.");
    }

    const context = getProgramContextById(selectedProgram.id);

    if (!context) {
      throw new Error(
        "Could not find the given program's context in the system. Please try again.",
      );
    }

    const routineMetadata = {
      unitId: context.unit.id,
      programId: selectedProgram.id,
      branchId: selectedBranch.id,
      academicLevelId: selectedAcademicLevel.id,
      batchAndSection: selectedBatchAndSection,
    };

    const routines = generateRoutinesArray({
      routineOption: selectedRoutineOption,
      activeSubjectsInfo,
      routineMetadata,
      instituteId,
      customDuration,
    });
    await saveRoutinesByBatch(selectedBatchAndSection, routines);
  },
}));
