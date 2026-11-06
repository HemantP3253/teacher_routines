import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Institutes from "./models/Institutes";
import ProfileInstitutes from "./models/ProfileInstitutes";
import Profiles from "./models/Profiles";
import Routines from "./models/Routines";
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
  modelClasses: [Institutes, Profiles, Routines, ProfileInstitutes],
});
