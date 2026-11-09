import { database } from "@/db";
import { useAppStore } from "@/store/useAppStore";
import { LocalInstituteData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";
import { supabase } from "./supabase";

export const populateInstitutes = async () => {
  const { institutesLoaded, setInstitutesLoaded } = useAppStore.getState();

  if (institutesLoaded) {
    console.log("Institutes already populated. Skipping...");
    return;
  }

  try {
    console.log("First launch detected: Fetching institutes...");

    const { data: institutes, error } = await supabase
      .from("institutes")
      .select("*");

    if (error || !institutes) {
      console.error("Failed to populate institutes: ", error);
      return;
    }

    await database.write(async () => {
      const institutesCollection =
        database.get<LocalInstituteData>("institutes");

      for (const institute of institutes) {
        const existingRecords = await institutesCollection
          .query(Q.where("id", institute.id))
          .fetch();

        if (existingRecords.length > 0) {
          const localInstitute = existingRecords[0];
          await localInstitute.update((record) => {
            record.address = institute.address;
            record.affiliatedUniversity = institute.affiliated_university;
            record.code = institute.code;
            record.name = institute.name;
            record.type = institute.type;

            record.updatedAt = institute.updated_at
              ? new Date(institute.updated_at)
              : new Date();
            record.deletedAt = institute.deleted_at
              ? new Date(institute.deleted_at)
              : null;
          });
        } else {
          await institutesCollection.create((record) => {
            record._raw.id = institute.id;
            record.address = institute.address;
            record.affiliatedUniversity = institute.affiliated_university;
            record.code = institute.code;
            record.name = institute.name;
            record.type = institute.type;

            record.createdAt = institute.created_at
              ? new Date(institute.created_at)
              : new Date();
            record.updatedAt = institute.updated_at
              ? new Date(institute.updated_at)
              : new Date();
            record.deletedAt = institute.deleted_at
              ? new Date(institute.deleted_at)
              : null;
          });
        }
      }

      setInstitutesLoaded(true);
    });
  } catch (error) {
    console.error("Error while populating institutes: ", error);
    setInstitutesLoaded(false);
  }
};
