import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class ProfileInstitutes extends Model {
  static table = "profile_institutes";

  @text("profile_id") profileId!: string;
  @text("institute_id") instituteId!: string;
  @text("role") role!: string;
  @text("status") status!: string;
  @json("allowed_units", sanitizeArray) allowedUnits?: string[] | null;
  @text("reviewed_by") reviewedBy?: string | null;
  @date("reviewed_at") reviewedAt?: Date | null;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
