import { getAllDegreeNames } from "@/data/curricula/university/TU/tuHelpers";
import { UniversityProgram } from "@/types/academic";
import { ThemePreference } from "@/types/common";
import { RoutineOption } from "@/types/routines";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorageAdapter } from "./storageAdapter";

interface AppState {
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;

  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  routineOptions: RoutineOption[];
  addRoutineOption: (option: RoutineOption) => void;
  removeRoutineOption: (id: number) => void;
  updateRoutineOption: (
    id: number,
    updatedOption: Partial<RoutineOption>,
  ) => void;

  availablePrograms: UniversityProgram[];
  setAvailablePrograms: (programs: UniversityProgram[]) => void;

  settingsVersion: number;
}

const SETTINGS_VERSION = 1;
const INITIAL_ROUTINE_OPTIONS: RoutineOption[] = [
  {
    id: 1,
    label: "Short morning routine",
    startTime: "06:00 AM",
    endTime: "10:00 AM",
    periodDuration: 40,
    activeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: 2,
    label: "Full morning routine",
    startTime: "06:00 AM",
    endTime: "12:00 PM",
    periodDuration: 60,
    activeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: 3,
    label: "Day routine",
    startTime: "11:00 AM",
    endTime: "04:00 PM",
    periodDuration: 60,
    activeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: "Use System Theme",
      setThemePreference: (themePreference) => set({ themePreference }),

      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (completed) =>
        set({ hasCompletedOnboarding: completed }),

      settingsVersion: SETTINGS_VERSION,
      routineOptions: INITIAL_ROUTINE_OPTIONS,
      addRoutineOption: (option) =>
        set((state) => ({ routineOptions: [...state.routineOptions, option] })),
      removeRoutineOption: (id) =>
        set((state) => ({
          routineOptions: state.routineOptions.filter(
            (option) => option.id !== id,
          ),
        })),
      updateRoutineOption: (id, updatedOptions) =>
        set((state) => ({
          routineOptions: state.routineOptions.map((option) =>
            option.id === id ? { ...option, ...updatedOptions } : option,
          ),
        })),

      availablePrograms: getAllDegreeNames(),
      setAvailablePrograms: (programs) => set({ availablePrograms: programs }),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => zustandStorageAdapter),
    },
  ),
);
