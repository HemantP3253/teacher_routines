import { UserType } from "@/types/common";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorageAdapter } from "./storageAdapter";

interface AuthState {
  userId: string | null;
  setUserId: (id: string | null) => void;

  currentInstituteId: string | null;
  setCurrentInstituteId: (id: string | null) => void;

  userRole: UserType | null;
  setUserRole: (role: UserType | null) => void;

  isLoading: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      currentInstituteId: null,
      userRole: null,
      isLoading: true,

      setUserId: (id) => set({ userId: id }),

      setCurrentInstituteId: (id) => set({ currentInstituteId: id }),

      setUserRole: (role) => set({ userRole: role }),

      logout: () => {
        set({ userId: null, currentInstituteId: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorageAdapter),
      partialize: (state) => ({
        userId: state.userId,
        currentInstituteId: state.currentInstituteId,
        userRole: state.userRole,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[AuthStore] Hydration error: ", error);
        }
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
