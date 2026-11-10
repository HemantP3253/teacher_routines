import { getAllMemberships } from "@/services/profileInstituteService";
import { getAllProfiles, updateDbUserStatus } from "@/services/profileService";
import { ProfileStatus } from "@/types/common";
import { LocalProfilesData } from "@/types/localDbTypes";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface ProfileState {
  allProfiles: LocalProfilesData[];
  approvedProfiles: LocalProfilesData[];
  pendingProfiles: LocalProfilesData[];
  rejectedProfiles: LocalProfilesData[];
  statusMap: Map<string, string>;
  isLoading: boolean;

  getProfilesByStatus: (status?: ProfileStatus) => LocalProfilesData[];
  fetchProfiles: () => Promise<void>;
  updateUserStatus: (profileId: string, status: ProfileStatus) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  allProfiles: [],
  approvedProfiles: [],
  pendingProfiles: [],
  rejectedProfiles: [],
  statusMap: new Map(),
  isLoading: false,

  getProfilesByStatus: (status) => {
    const state = get();
    switch (status) {
      case "approved":
        return state.approvedProfiles;
      case "pending":
        return state.pendingProfiles;
      case "rejected":
        return state.rejectedProfiles;
      default:
        return state.allProfiles;
    }
  },
  fetchProfiles: async () => {
    const { currentInstituteId } = useAuthStore.getState();
    if (!currentInstituteId) return;

    set({ isLoading: true });
    try {
      const [allProfiles, InstituteMemberships] = await Promise.all([
        getAllProfiles(),
        getAllMemberships(currentInstituteId, "institute"),
      ]);

      const map = new Map(
        InstituteMemberships.map((membership) => [
          membership.profileId,
          membership.status,
        ]),
      );

      set({
        allProfiles: allProfiles,
        approvedProfiles: allProfiles.filter(
          (profile) => map.get(profile.id) === "approved",
        ),
        pendingProfiles: allProfiles.filter(
          (profile) => map.get(profile.id) === "pending",
        ),
        rejectedProfiles: allProfiles.filter(
          (profile) => map.get(profile.id) === "rejected",
        ),
        statusMap: map,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch profiles in store: ", error);
      set({ isLoading: false });
    }
  },
  updateUserStatus: async (profileId, status) => {
    try {
      await updateDbUserStatus(profileId, status);

      await get().fetchProfiles();
    } catch (error) {
      console.error("Failed to update user status: ", error);
    }
  },
}));
