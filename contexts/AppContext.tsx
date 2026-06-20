import { getAllDegreeNames } from "@/data/degreeDataTU";
import { DynamicRoutineDetails } from "@/interfaces/interfaces";
import { storage } from "@/utils/storage";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppSettings {
  shownDegrees: string[];
  routineTimeOptions: DynamicRoutineDetails[];
  isDark: boolean;
  userRole?: "admin" | "user";
  updatedAt: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  shownDegrees: getAllDegreeNames(),
  routineTimeOptions: [
    {
      id: 1,
      label: "Short morning routine",
      startTime: "06:00 AM",
      endTime: "10:00 AM",
      duration: "40",
      activeDays: "Mon, Tue, Wed, Thu, Fri",
    },
    {
      id: 2,
      label: "Full morning routine",
      startTime: "06:00 AM",
      endTime: "12:00 PM",
      duration: "60",
      activeDays: "Mon, Tue, Wed, Thu, Fri",
    },
    {
      id: 3,
      label: "Day routine",
      startTime: "11:00 AM",
      endTime: "04:00 PM",
      duration: "60",
      activeDays: "Mon, Tue, Wed, Thu, Fri",
    },
  ],
  isDark: false,
  userRole: "user",
  updatedAt: Date.now(),
};

interface AppContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
  allAvailableDegrees: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const cached = storage.getObject<Partial<AppSettings>>(
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

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(updatedSettings);

    storage.setObject("user_theme_preference" as any, updatedSettings);
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
