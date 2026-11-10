import { RawInstituteSyncRecord } from "@/types/localDbTypes";
import { InstituteData } from "@/types/supabaseTypes";

export const mapInstituteToRawSync = (
  remoteItem: InstituteData,
): RawInstituteSyncRecord => {
  return {
    id: remoteItem.id,
    address: remoteItem.address ?? null,
    affiliated_university: remoteItem.affiliated_university ?? null,
    code: remoteItem.code ?? "",
    name: remoteItem.name ?? "",
    type: remoteItem.type ?? null,
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
