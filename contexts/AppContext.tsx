import { getAllDegreeNames } from "@/data/degreeDataTU";
import { DynamicRoutineDetails } from "@/interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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

const STORAGE_KEY = "@app_global_settings";

interface AppContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => Promise<void>;
  allAvailableDegrees: string[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const allAvailableDegrees = getAllDegreeNames();

  useEffect(() => {
    const bootstrapSettings = async () => {
      try {
        const rawJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawJson) {
          const parsed = JSON.parse(rawJson);

          setSettings((prev) => ({
            ...prev,
            ...parsed,
            routineTimeOptions:
              parsed.routineTimeOptions || prev.routineTimeOptions,
            shownDegrees: parsed.shownDegrees || prev.shownDegrees,
          }));
        }
      } catch (error: any) {
        console.error("Failed to load app settings from disk: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapSettings();
  }, []);

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value,
      };

      setSettings(updatedSettings);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error: any) {
      console.error(
        `Failed to persist setting updates for key: ${key} `,
        error.message,
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSetting,
        allAvailableDegrees,
        isLoading,
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
