import { RawProfileInstituteSyncRecord } from "@/types/localDbTypes";
import { ProfileInstitutesData } from "@/types/supabaseTypes";
import { getProfileInstituteId } from "../profileInstituteUtils";

export const mapProfileInstituteToRawSync = (
  remoteItem: ProfileInstitutesData,
): RawProfileInstituteSyncRecord => {
  return {
    id: getProfileInstituteId(remoteItem.profile_id, remoteItem.institute_id),
    allowed_units: remoteItem.allowed_units
      ? JSON.stringify(remoteItem.allowed_units)
      : null,
    institute_id: remoteItem.institute_id ?? "",
    profile_id: remoteItem.profile_id ?? "",
    reviewed_by: remoteItem.reviewed_by ?? null,
    role: remoteItem.role ?? "",
    status: remoteItem.status ?? "",
    reviewed_at: remoteItem.reviewed_at
      ? new Date(remoteItem.reviewed_at).getTime()
      : null,
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
