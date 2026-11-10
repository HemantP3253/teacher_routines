import { getAllMemberships } from "@/services/profileInstituteService";
import { getAllProfiles, updateDbUserStatus } from "@/services/profileService";
import { ProfileStatus } from "@/types/common";
import { LocalProfilesData } from "@/types/localDbTypes";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface ProfileState {
  allProfiles: LocalProfilesData[];
  statusMap: Map<string, string>;
  isLoading: boolean;

  getProfilesByStatus: (status?: ProfileStatus) => LocalProfilesData[];
  fetchProfiles: () => Promise<void>;
  updateUserStatus: (profileId: string, status: ProfileStatus) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  allProfiles: [],
  statusMap: new Map(),
  isLoading: false,

  getProfilesByStatus: (status) => {
    const { allProfiles, statusMap } = get();
    if (!status) return allProfiles;
    return allProfiles.filter(
      (profile) => statusMap.get(profile.id) === status,
    );
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
