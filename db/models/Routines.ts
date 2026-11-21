import { Model } from "@nozbe/watermelondb";
import { date, json, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class Routines extends Model {
  static table = "routines";

  static associations: Associations = {
    profiles: { type: "belongs_to", key: "teacher_id" },
    institutes: { type: "belongs_to", key: "institute_id" },
  } as const;

  @text("batch_and_section") batchAndSection!: string;
  @json("days", sanitizeArray) days!: string[];
  @text("end_time") endTime!: string;
  @text("institute_id") instituteId!: string;
  @text("program_id") programId?: string | null;
  @text("branch_id") branchId?: string | null;
  @text("academic_level_id") academicLevelId!: string;
  @text("start_time") startTime!: string;
  @text("stream_id") streamId?: string | null;
  @text("subject_id") subjectId!: string;
  @text("syllabus_id") syllabusId?: string | null;
  @text("teacher_id") teacherId!: string;
  @text("unit_id") unitId!: string;

  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
