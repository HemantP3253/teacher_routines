import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({
  id: "teacher-routines-storage",
});

export const storage = {
  setString(key: string, value: string) {
    mmkv.set(key, value);
  },

  getString(key: string): string | undefined {
    return mmkv.getString(key);
  },

  setBool(key: string, value: boolean) {
    mmkv.set(key, value);
  },

  getBool(key: string, defaultValue = false): boolean {
    const value = mmkv.getBoolean(key);
    return value ?? defaultValue;
  },

  setNumber(key: string, value: number) {
    mmkv.set(key, value);
  },

  getNumber(key: string): number | undefined {
    return mmkv.getNumber(key);
  },

  setObject<T>(key: string, value: T) {
    mmkv.set(key, JSON.stringify(value));
  },

  getObject<T>(key: string): T | null {
    const value = mmkv.getString(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  delete(key: string) {
    mmkv.remove(key);
  },

  clearAll() {
    mmkv.clearAll();
  },
};
