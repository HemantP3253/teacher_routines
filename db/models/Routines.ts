import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class Routines extends Model {
  static table = "routines";

  @text("batch_and_section") batchAndSection!: string;
  @json("days", sanitizeArray) days!: string[];
  @text("end_time") endTime!: string;
  @text("grade_id") gradeId?: string | null;
  @text("institute_id") instituteId!: string;
  @text("program_id") programId?: string | null;
  @text("semester_id") semesterId?: string | null;
  @text("start_time") startTime!: string;
  @text("stream_id") streamId?: string | null;
  @text("subject_id") subjectId!: string;
  @text("teacher_id") teacherId!: string;
  @text("unit_id") unitId!: string;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
