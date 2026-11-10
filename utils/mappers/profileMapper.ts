import { RawProfileSyncRecord } from "@/types/localDbTypes";
import { ProfilesData } from "@/types/supabaseTypes";

export const mapProfileToRawSync = (
  remoteItem: ProfilesData,
): RawProfileSyncRecord => {
  return {
    id: remoteItem.id,
    address: remoteItem.address ?? null,
    avatar_url: remoteItem.avatar_url ?? null,
    date_of_birth: remoteItem.date_of_birth ?? "",
    full_name: remoteItem.full_name ?? "",
    gender: remoteItem.gender ?? "",
    phone: remoteItem.phone ?? "",
    username: remoteItem.username ?? "",
    created_at: remoteItem.created_at
      ? new Date(remoteItem.created_at).getTime()
      : 0,
    updated_at: remoteItem.updated_at
      ? new Date(remoteItem.updated_at).getTime()
      : 0,
    deleted_at: remoteItem.deleted_at
      ? new Date(remoteItem.deleted_at).getTime()
      : null,
  };
};
