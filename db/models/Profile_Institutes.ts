import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class ProfileInstitutes extends Model {
  static table = "profile_institutes";

  @text("profile_id") profile_id!: string;
  @text("institute_id") institute_id!: string;
  @text("role") role!: string;
  @text("status") status!: string;
  @json("allowed_units", sanitizeArray) allowed_units?: string[] | null;
  @text("reviewed_by") reviewed_by?: string | null;
  @date("reviewed_at") reviewed_at?: Date | null;

  @readonly @date("created_at") created_at!: Date;
  @readonly @date("updated_at") updated_at!: Date;
  @date("deleted_at") deleted_at!: Date | null;
}
