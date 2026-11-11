import {
  LocalProfileInstitutesData,
  RawProfileInstituteSyncRecord,
} from "@/types/localDbTypes";
import { ProfileInstitutesData } from "@/types/supabaseTypes";
import { getProfileInstituteId } from "../profileInstituteUtils";

export function mapProfileInstituteData(
  remoteItem: ProfileInstitutesData,
): RawProfileInstituteSyncRecord;
export function mapProfileInstituteData(
  remoteItem: ProfileInstitutesData,
  target: LocalProfileInstitutesData,
): void;

export function mapProfileInstituteData(
  remoteItem: ProfileInstitutesData,
  target?: LocalProfileInstitutesData,
): RawProfileInstituteSyncRecord | void {
  if (!target) {
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
  }

  target.profileId = remoteItem.profile_id ?? "";
  target.instituteId = remoteItem.institute_id ?? "";
  target.role = remoteItem.role ?? "";
  target.status = remoteItem.status ?? "";
  target.allowedUnits = remoteItem.allowed_units;
  target.reviewedBy = remoteItem.reviewed_by ?? null;
  target.reviewedAt = remoteItem.reviewed_at
    ? new Date(remoteItem.reviewed_at)
    : null;
  target.createdAt = remoteItem.created_at
    ? new Date(remoteItem.created_at)
    : new Date();
  target.updatedAt = remoteItem.updated_at
    ? new Date(remoteItem.updated_at)
    : new Date();
  target.deletedAt = remoteItem.deleted_at
    ? new Date(remoteItem.deleted_at)
    : null;
}
