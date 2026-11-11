import { database } from "@/db";
import {
  LocalProfileInstitutesData,
  LocalProfilesData,
  LocalRoutinesData,
} from "@/types/localDbTypes";
import { synchronize } from "@nozbe/watermelondb/sync";
import { pullInstitutes } from "./syncInstitutes";
import {
  pullProfileInstitutes,
  pushProfileInstitutes,
} from "./syncProfileInstitutes";
import { pullProfiles, pushProfiles } from "./syncProfiles";
import { pullRoutines, pushRoutines } from "./syncRoutines";

type TableChanges<T> = {
  created: T[];
  updated: T[];
  deleted: string[];
};

type LocalDatabaseChanges = {
  profiles: TableChanges<LocalProfilesData>;
  profile_institutes: TableChanges<LocalProfileInstitutesData>;
  routines: TableChanges<LocalRoutinesData>;
};

export const syncDatabase = async () => {
  try {
    await synchronize({
      database,

      pullChanges: async ({ lastPulledAt }) => {
        const lastPulledDate = lastPulledAt
          ? new Date(lastPulledAt).toISOString()
          : new Date(0).toISOString();

        const [institutes, profileInstitutes, profiles, routines] =
          await Promise.all([
            pullInstitutes(lastPulledDate),
            pullProfileInstitutes(lastPulledDate),
            pullProfiles(lastPulledDate),
            pullRoutines(lastPulledDate),
          ]);

        return {
          changes: {
            institutes: {
              created: [],
              updated: institutes.createdOrUpdated,
              deleted: institutes.deleted,
            },
            profiles: {
              created: [],
              updated: profiles.createdOrUpdated,
              deleted: profiles.deleted,
            },
            profile_institutes: {
              created: [],
              updated: profileInstitutes.createdOrUpdated,
              deleted: profileInstitutes.deleted,
            },
            routines: {
              created: [],
              updated: routines.createdOrUpdated,
              deleted: routines.deleted,
            },
          },
          timestamp: Date.now(),
        };
      },

      pushChanges: async ({ changes }) => {
        const typedChanges = changes as LocalDatabaseChanges;

        const { profiles, profile_institutes, routines } = typedChanges;

        await Promise.all([
          pushProfiles(
            [...profiles.created, ...profiles.updated],
            profiles.deleted,
          ),
          pushProfileInstitutes(
            [...profile_institutes.created, ...profile_institutes.updated],
            profile_institutes.deleted,
          ),
          pushRoutines(
            [...routines.created, ...routines.updated],
            routines.deleted,
          ),
        ]);
      },

      sendCreatedAsUpdated: true,
    });
  } catch (error) {
    console.error("Failed to synchronize database: ", error);
    throw error;
  }
};
