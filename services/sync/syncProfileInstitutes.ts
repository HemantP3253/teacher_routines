import { useAuthStore } from "@/store/useAuthStore";
import {
  LocalProfileInstitutesData,
  RawProfileInstituteSyncRecord,
} from "@/types/localDbTypes";
import { mapProfileInstituteToRawSync } from "@/utils/mappers/profileInstitutesMapper";
import { toIsoString } from "@/utils/stringUtils";
import { supabase } from "../supabase";

export const pullProfileInstitutes = async (
  lastPulledDate: string,
): Promise<{
  createdOrUpdated: RawProfileInstituteSyncRecord[];
  deleted: string[];
}> => {
  const { data, error } = await supabase
    .from("profile_institutes")
    .select("*")
    .gt("updated_at", lastPulledDate);

  if (error) throw error;

  const active = data?.filter((item) => !item.deleted_at) || [];
  const deleted =
    data
      ?.filter((item) => item.deleted_at)
      .map((item) => `${item.profile_id}_${item.institute_id}`) || [];

  const createdOrUpdated = active.map(mapProfileInstituteToRawSync);

  return { createdOrUpdated: createdOrUpdated, deleted };
};

export const pushProfileInstitutes = async (
  profileInstitutes: LocalProfileInstitutesData[],
  deletedIds: string[],
): Promise<void> => {
  const { userRole, currentInstituteId } = useAuthStore.getState();
  if (!userRole || userRole === "student" || userRole === "teacher") return;

  const filteredProfileInstitutes = profileInstitutes.filter(
    (profileInstitute) => profileInstitute.instituteId === currentInstituteId,
  );

  const payloads = filteredProfileInstitutes.map((record) => {
    let parsedAllowedUnits = record.allowedUnits;
    if (typeof record.allowedUnits === "string") {
      try {
        parsedAllowedUnits = JSON.parse(record.allowedUnits);
      } catch {
        parsedAllowedUnits = [];
      }
    }

    return {
      profile_id: record.profileId,
      institute_id: record.instituteId,
      allowed_units: parsedAllowedUnits,
      role: record.role,
      status: record.status,
      reviewed_at: toIsoString(record.reviewedAt),
      reviewed_by: record.reviewedBy,

      created_at: toIsoString(record.createdAt) ?? new Date().toISOString(),
      updated_at: toIsoString(record.updatedAt) ?? new Date().toISOString(),
    };
  });

  if (payloads.length > 0) {
    const { error } = await supabase
      .from("profile_institutes")
      .upsert(payloads, { onConflict: "profile_id, institute_id" });
    if (error) throw error;
  }

  if (deletedIds.length > 0) {
    for (const compositeId of deletedIds) {
      const [profileId, instituteId] = compositeId.split("_");
      if (profileId && instituteId) {
        const { error } = await supabase
          .from("profile_institutes")
          .update({ deleted_at: new Date().toISOString() })
          .eq("profile_id", profileId)
          .eq("institute_id", instituteId);

        if (error) throw error;
      }
    }
  }
};
