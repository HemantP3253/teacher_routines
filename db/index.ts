import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import College from "./models/College";
import Profile from "./models/Profile";
import Routine from "./models/Routine";
import schema from "./schema";

// 1. Configure the native SQLite adapter connection
const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Enables high-speed C++ JSI bindings matching your MMKV setup
  onSetUpError: (error) => {
    console.error("WatermelonDB failed to initialize native adapter:", error);
  },
});

// 2. Instantiate and export the centralized database driver with your models
export const database = new Database({
  adapter,
  modelClasses: [College, Profile, Routine],
});
