import { useAuthStore } from "@/store/useAuthStore";
import { LocalProfilesData, RawProfileSyncRecord } from "@/types/localDbTypes";
import { mapProfileToRawSync } from "@/utils/mappers/profileMapper";
import { supabase } from "../supabase";

export const pullProfiles = async (
  lastPulledDate: string,
): Promise<{ createdOrUpdated: RawProfileSyncRecord[]; deleted: string[] }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .gt("updated_at", lastPulledDate);

  if (error) throw error;

  const active = data?.filter((item) => !item.deleted_at) || [];
  const deleted =
    data?.filter((item) => item.deleted_at).map((item) => item.id) || [];

  const createdOrUpdated = active.map(mapProfileToRawSync);

  return { createdOrUpdated: createdOrUpdated, deleted };
};

export const pushProfiles = async (
  profiles: LocalProfilesData[],
  deletedIds: string[],
) => {
  const { userId } = useAuthStore.getState();

  const filteredProfiles = userId
    ? profiles.filter((record) => record.id === userId)
    : [];

  const payloads = filteredProfiles
    .filter((record) => Boolean(record.fullName))
    .map((record) => ({
      id: record.id,
      address: record.address,
      avatar_url: record.avatarUrl,
      date_of_birth: record.dateOfBirth,
      full_name: record.fullName,
      gender: record.gender,
      phone: record.phone,
      username: record.username,

      created_at:
        typeof record.createdAt === "number"
          ? new Date(record.createdAt).toISOString()
          : (record.createdAt?.toISOString() ?? new Date().toISOString()),
      updated_at:
        typeof record.updatedAt === "number"
          ? new Date(record.updatedAt).toISOString()
          : (record.updatedAt?.toISOString() ?? new Date().toISOString()),
    }));

  if (payloads.length > 0) {
    const { error } = await supabase.from("profiles").upsert(payloads);
    if (error) throw error;
  }

  const filteredDeletedIds =
    userId && deletedIds.includes(userId) ? [userId] : [];

  if (filteredDeletedIds.length > 0) {
    const { error } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", filteredDeletedIds);

    if (error) throw error;
  }
};
