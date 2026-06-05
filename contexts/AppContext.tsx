import { getAllDegreeNames } from "@/data/degreeDataTU";
import { DynamicRoutineDetails } from "@/interfaces/interfaces";
import { AppStorage } from "@/utils/storage"; // Import your typed MMKV helper
import { createContext, ReactNode, useContext, useState } from "react";

interface AppSettings {
  shownDegrees: string[];
  routineTimeOptions: DynamicRoutineDetails[];
  isDark: boolean;
  userRole?: "admin" | "user";
}

const DEFAULT_SETTINGS: AppSettings = {
  shownDegrees: getAllDegreeNames(),
  routineTimeOptions: [
    {
      label: "Short morning routine",
      startTime: "06:00 AM",
      endTime: "09:00 AM",
      duration: "40",
    },
    {
      label: "Full morning routine",
      startTime: "06:00 AM",
      endTime: "12:00 AM",
      duration: "60",
    },
    {
      label: "Day routine",
      startTime: "11:00 AM",
      endTime: "04:00 AM",
      duration: "60",
    },
  ],
  isDark: false,
  userRole: "user",
};

// 1. Define a clean key name matching your AppStorage typing if needed
const STORAGE_KEY = "user_theme_preference"; // Or add a generic 'app_settings' key to your StorageKeys type

interface AppContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void; // Changed from Promise<void> to void because MMKV is synchronous
  allAvailableDegrees: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // 2. Load settings SYNCHRONOUSLY directly inside the initial state initializer.
  // There is zero layout pop or waiting for loading states!
  const [settings, setSettings] = useState<AppSettings>(() => {
    // We reuse our setObject/getObject implementation logic using our raw key string
    const cached = AppStorage.getObject<Partial<AppSettings>>(
      "user_theme_preference" as any,
    );
    if (cached) {
      return {
        ...DEFAULT_SETTINGS,
        ...cached,
        routineTimeOptions:
          cached.routineTimeOptions || DEFAULT_SETTINGS.routineTimeOptions,
        shownDegrees: cached.shownDegrees || DEFAULT_SETTINGS.shownDegrees,
      };
    }
    return DEFAULT_SETTINGS;
  });

  const allAvailableDegrees = getAllDegreeNames();

  // 3. Update settings synchronously
  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(updatedSettings);

    // Save to MMKV completely synchronously
    AppStorage.setObject("user_theme_preference" as any, updatedSettings);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSetting,
        allAvailableDegrees,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
