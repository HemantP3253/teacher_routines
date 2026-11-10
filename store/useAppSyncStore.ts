import { create } from "zustand";

interface SyncState {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  isAppActive: boolean;
  setIsAppActive: (active: boolean) => void;

  institutesLoaded: boolean;
  setInstitutesLoaded: (loaded: boolean) => void;

  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
}

export const useAppSyncStore = create<SyncState>()((set) => ({
  isOnline: true,
  isAppActive: true,
  isSyncing: false,
  institutesLoaded: false,

  setIsOnline: (online) => set({ isOnline: online }),
  setIsAppActive: (active) => set({ isAppActive: active }),
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setInstitutesLoaded: (loaded) => set({ institutesLoaded: loaded }),
}));
