import { database } from "@/db";
import { LocalInstituteData } from "@/types/localDbTypes";
import { supabase } from "./supabase";

export const populateInstitutes = async () => {
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

      const localInstitutes = await institutesCollection.query().fetch();
      const localMap = new Map(localInstitutes.map((item) => [item.id, item]));

      const batchRecords = institutes.map((institute) => {
        const existingRecord = localMap.get(institute.id);

        const createdAt = institute.created_at
          ? new Date(institute.created_at)
          : new Date();
        const updatedAt = institute.updated_at
          ? new Date(institute.updated_at)
          : new Date();
        const deletedAt = institute.deleted_at
          ? new Date(institute.deleted_at)
          : null;

        if (existingRecord) {
          return existingRecord.prepareUpdate((record) => {
            record.address = institute.address;
            record.affiliatedUniversity = institute.affiliated_university;
            record.code = institute.code;
            record.name = institute.name;
            record.type = institute.type;

            record.updatedAt = updatedAt;
            record.deletedAt = deletedAt;
          });
        } else {
          return institutesCollection.prepareCreate((record) => {
            record._raw.id = institute.id;
            record.address = institute.address;
            record.affiliatedUniversity = institute.affiliated_university;
            record.code = institute.code;
            record.name = institute.name;
            record.type = institute.type;
            record.createdAt = createdAt;
            record.updatedAt = updatedAt;
            record.deletedAt = deletedAt;
          });
        }
      });

      await database.batch(batchRecords);
    });
  } catch (error) {
    console.error("Error while populating institutes: ", error);
    throw error;
  }
};
