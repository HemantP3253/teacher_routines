import {
  LocalInstituteData,
  RawInstituteSyncRecord,
} from "@/types/localDbTypes";
import { InstituteData } from "@/types/supabaseTypes";

export function mapInstituteData(
  remoteItem: InstituteData,
): RawInstituteSyncRecord;
export function mapInstituteData(
  remoteItem: InstituteData,
  target: LocalInstituteData,
): void;

export function mapInstituteData(
  remoteItem: InstituteData,
  target?: LocalInstituteData,
): RawInstituteSyncRecord | void {
  if (!target)
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

  target.name = remoteItem.name ?? "";
  target.affiliatedUniversity = remoteItem.affiliated_university ?? null;
  target.code = remoteItem.code ?? "";
  target.type = remoteItem.type ?? null;
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
