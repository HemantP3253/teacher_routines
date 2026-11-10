import { RawInstituteSyncRecord } from "@/types/localDbTypes";
import { mapInstituteToRawSync } from "@/utils/mappers/instituteMapper";
import { supabase } from "../supabase";

export const pullInstitutes = async (
  lastPulledDate: string,
): Promise<{
  createdOrUpdated: RawInstituteSyncRecord[];
  deleted: string[];
}> => {
  const { data, error } = await supabase
    .from("institutes")
    .select("*")
    .gt("updated_at", lastPulledDate);

  if (error) throw error;

  const active = data?.filter((item) => !item.deleted_at) || [];
  const deleted =
    data?.filter((item) => item.deleted_at).map((item) => item.id) || [];

  const createdOrUpdated: RawInstituteSyncRecord[] = active.map(
    mapInstituteToRawSync,
  );

  return { createdOrUpdated: createdOrUpdated, deleted };
};
