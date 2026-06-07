import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import College from "./models/College";
import Profile from "./models/Profile";
import Routine from "./models/Routine";
import schema from "./schema";

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error("WatermelonDB failed to initialize native adapter:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [College, Profile, Routine],
});
