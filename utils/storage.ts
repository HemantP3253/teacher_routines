import * as MMKVModule from "react-native-mmkv";

// 1. Define your strict configuration keys
export type StorageKeys =
  | "user_theme_preference"
  | "is_first_launch"
  | "remembered_teacher_id"
  | "last_sync_timestamp";

// 2. Safely extract the constructor by checking the root module at runtime
const MMKVConstructor = (MMKVModule as any).MMKV;

let storageInstance: any = null;

if (MMKVConstructor) {
  try {
    // If the C++ JSI binary is present in the build tree, initialize it
    storageInstance = new MMKVConstructor({ id: "teacher-routines-storage" });
  } catch (e) {
    storageInstance = null;
  }
}

// 3. Fallback mock layer to keep Expo Go from throwing runtime red screens
const mockStorage = {
  set: () => {},
  getString: () => undefined,
  getBoolean: () => undefined,
  getNumber: () => undefined,
  delete: () => {},
  clearAll: () => {},
};

// 4. Export the live storage instance safely
export const storage = storageInstance || mockStorage;

// 5. Explicitly typed helper utility methods
export const AppStorage = {
  setString: (key: StorageKeys, value: string) => storage.set(key, value),
  getString: (key: StorageKeys): string | undefined => storage.getString(key),

  setBool: (key: StorageKeys, value: boolean) => storage.set(key, value),
  getBool: (key: StorageKeys, defaultValue = false): boolean => {
    const val = storage.getBoolean(key);
    return val !== undefined ? val : defaultValue;
  },

  setNumber: (key: StorageKeys, value: number) => storage.set(key, value),
  getNumber: (key: StorageKeys): number | undefined => storage.getNumber(key),

  setObject: <T>(key: StorageKeys, value: T) =>
    storage.set(key, JSON.stringify(value)),
  getObject: <T>(key: StorageKeys): T | null => {
    const json = storage.getString(key);
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  },

  delete: (key: StorageKeys) => storage.delete(key),
  clearAll: () => storage.clearAll(),
};
