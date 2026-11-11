import { RoutinesData } from "@/types/common";
import { LocalRoutinesData, RawRoutineSyncRecord } from "@/types/localDbTypes";

export function mapRoutineData(remoteItem: RoutinesData): RawRoutineSyncRecord;
export function mapRoutineData(
  remoteItem: RoutinesData,
  target: LocalRoutinesData,
): void;

export function mapRoutineData(
  remoteItem: RoutinesData,
  target?: LocalRoutinesData,
): RawRoutineSyncRecord | void {
  if (!target) {
    return {
      id: remoteItem.id,
      batch_and_section: remoteItem.batch_and_section ?? "",
      days: remoteItem.days ? JSON.stringify(remoteItem.days) : "[]",
      end_time: remoteItem.end_time ?? "",
      grade_id: remoteItem.grade_id ?? null,
      institute_id: remoteItem.institute_id ?? "",
      program_id: remoteItem.program_id ?? null,
      semester_id: remoteItem.semester_id ?? null,
      start_time: remoteItem.start_time ?? "",
      stream_id: remoteItem.stream_id ?? null,
      subject_id: remoteItem.subject_id ?? "",
      teacher_id: remoteItem.teacher_id ?? "",
      unit_id: remoteItem.unit_id ?? "",
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

  target.batchAndSection = remoteItem.batch_and_section ?? "";
  target.days = remoteItem.days;
  target.endTime = remoteItem.end_time ?? "";
  target.gradeId = remoteItem.grade_id ?? null;
  target.instituteId = remoteItem.institute_id ?? "";
  target.programId = remoteItem.program_id ?? null;
  target.semesterId = remoteItem.semester_id ?? null;
  target.startTime = remoteItem.start_time ?? "";
  target.streamId = remoteItem.stream_id ?? null;
  target.subjectId = remoteItem.subject_id ?? "";
  target.teacherId = remoteItem.teacher_id ?? "";
  target.unitId = remoteItem.unit_id ?? "";
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
