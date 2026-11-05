import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class Routines extends Model {
  static table = "routines";

  @text("batchAndSection") batchAndSection!: string;
  @json("days", sanitizeArray) days!: string[];
  @text("end_time") end_time!: string;
  @text("grade_id") grade_id?: string | null;
  @text("institute_id") institute_id!: string;
  @text("program_id") program_id?: string | null;
  @text("semester_id") semester_id?: string | null;
  @text("start_time") start_time!: string;
  @text("stream_id") stream_id?: string | null;
  @text("subject_id") subject_id!: string;
  @text("teacher_id") teacher_id!: string;
  @text("unit_id") unit_id!: string;

  @readonly @date("created_at") created_at!: Date;
  @readonly @date("updated_at") updated_at!: Date;
  @date("deleted_at") deleted_at!: Date | null;
}
