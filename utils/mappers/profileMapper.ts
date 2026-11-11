import { LocalProfilesData, RawProfileSyncRecord } from "@/types/localDbTypes";
import { ProfilesData } from "@/types/supabaseTypes";

export function mapProfileData(remoteItem: ProfilesData): RawProfileSyncRecord;
export function mapProfileData(
  remoteItem: ProfilesData,
  target: LocalProfilesData,
): void;

export function mapProfileData(
  remoteItem: ProfilesData,
  target?: LocalProfilesData,
): RawProfileSyncRecord | void {
  if (!target) {
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
  }

  target.username = remoteItem.username ?? "";
  target.avatarUrl = remoteItem.avatar_url ?? null;
  target.dateOfBirth = remoteItem.date_of_birth ?? "";
  target.fullName = remoteItem.full_name ?? "";
  target.gender = remoteItem.gender ?? "";
  target.phone = remoteItem.phone ?? "";
  target.address = remoteItem.address ?? null;
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
