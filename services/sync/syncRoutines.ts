import { useAuthStore } from "@/store/useAuthStore";
import { LocalRoutinesData, RawRoutineSyncRecord } from "@/types/localDbTypes";
import { mapRoutineData } from "@/utils/mappers/routineMapper";
import { toIsoString } from "@/utils/stringUtils";
import { supabase } from "../supabase";

export const pullRoutines = async (
  lastPulledDate: string,
): Promise<{ createdOrUpdated: RawRoutineSyncRecord[]; deleted: string[] }> => {
  const { data, error } = await supabase
    .from("routines")
    .select("*")
    .gt("updated_at", lastPulledDate);

  if (error) throw error;

  const active = data?.filter((item) => !item.deleted_at) || [];
  const deleted =
    data?.filter((item) => item.deleted_at).map((item) => item.id) || [];

  const createdOrUpdated: RawRoutineSyncRecord[] = active.map((remoteItem) =>
    mapRoutineData(remoteItem),
  );

  return { createdOrUpdated: createdOrUpdated, deleted };
};

export const pushRoutines = async (
  routines: LocalRoutinesData[],
  deletedIds: string[],
): Promise<void> => {
  const { userRole, currentInstituteId } = useAuthStore.getState();
  if (!userRole || userRole === "teacher" || userRole === "student") return;

  const payloads = routines
    .filter((record) => record.instituteId === currentInstituteId)
    .map((record) => {
      let parsedDays = record.days;
      if (typeof record.days === "string") {
        try {
          parsedDays = JSON.parse(record.days);
        } catch {
          parsedDays = [];
        }
      }

      return {
        id: record.id,
        batch_and_section: record.batchAndSection,
        days: parsedDays,
        end_time: record.endTime,
        grade_id: record.gradeId,
        institute_id: record.instituteId,
        program_id: record.programId,
        semester_id: record.semesterId,
        start_time: record.startTime,
        stream_id: record.streamId,
        subject_id: record.subjectId,
        teacher_id: record.teacherId,
        unit_id: record.unitId,

        created_at: toIsoString(record.createdAt) ?? new Date().toISOString(),
        updated_at: toIsoString(record.updatedAt) ?? new Date().toISOString(),
      };
    });

  if (payloads.length > 0) {
    const { error } = await supabase.from("routines").upsert(payloads);
    if (error) throw error;
  }

  if (deletedIds.length > 0) {
    const { error } = await supabase
      .from("routines")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", deletedIds);

    if (error) throw error;
  }
};
