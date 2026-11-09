import { Model } from "@nozbe/watermelondb";
import { date, json, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class ProfileInstitutes extends Model {
  static table = "profile_institutes";

  static associations: Associations = {
    profiles: { type: "belongs_to", key: "profile_id" },
    institutes: { type: "belongs_to", key: "institute_id" },
  } as const;

  @text("profile_id") profileId!: string;
  @text("institute_id") instituteId!: string;
  @text("role") role!: string;
  @text("status") status!: string;
  @json("allowed_units", sanitizeArray) allowedUnits?: string[] | null;
  @text("reviewed_by") reviewedBy?: string | null;
  @date("reviewed_at") reviewedAt?: Date | null;

  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
