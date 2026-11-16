import { database } from "@/db";
import { LocalRoutinesData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";
import { Observable } from "@nozbe/watermelondb/utils/rx";
import { randomUUID } from "expo-crypto";
import { map } from "rxjs/operators";

const routinesCollection = database.get<LocalRoutinesData>("routines");

export const observeBatchesByProgramId = (
  programId: string,
): Observable<string[]> => {
  return routinesCollection
    .query(Q.where("program_id", programId))
    .observeWithColumns(["batch_and_section"])
    .pipe(
      map((routines) =>
        Array.from(
          new Set(routines.map((r) => r.batchAndSection).filter(Boolean)),
        ),
      ),
    );
};

export const fetchRoutinesByBatch = async (
  batch: string,
): Promise<LocalRoutinesData[]> => {
  return await routinesCollection
    .query(Q.where("batch_and_section", batch))
    .fetch();
};

export const prepareRoutineCreations = (
  routines: LocalRoutinesData[],
): LocalRoutinesData[] => {
  return routines.map((item) =>
    routinesCollection.prepareCreate((routine) => {
      routine._raw.id = randomUUID();
      routine.batchAndSection = item.batchAndSection;
      routine.days = item.days;
      routine.endTime = item.endTime;
      routine.gradeId = item.gradeId;
      routine.instituteId = item.instituteId;
      routine.programId = item.programId;
      routine.semesterId = item.semesterId;
      routine.startTime = item.startTime;
      routine.streamId = item.streamId;
      routine.subjectId = item.subjectId;
      routine.teacherId = item.teacherId;
      routine.unitId = item.unitId;
      routine.createdAt = item.createdAt ?? new Date();
      routine.updatedAt = item.updatedAt ?? new Date();
      routine.deletedAt = item.deletedAt ?? null;
    }),
  );
};

export const prepareRoutineUpdate = (
  routine: LocalRoutinesData,
  item: Partial<LocalRoutinesData>,
): LocalRoutinesData => {
  return routine.prepareUpdate((record) => {
    if (item.batchAndSection !== undefined)
      record.batchAndSection = item.batchAndSection;
    if (item.days !== undefined) record.days = item.days;
    if (item.startTime !== undefined) record.startTime = item.startTime;
    if (item.endTime !== undefined) record.endTime = item.endTime;
    if (item.subjectId !== undefined) record.subjectId = item.subjectId;
    if (item.teacherId !== undefined) record.teacherId = item.teacherId;
    if (item.unitId !== undefined) record.unitId = item.unitId;
    if (item.gradeId !== undefined) record.gradeId = item.gradeId;
    if (item.instituteId !== undefined) record.instituteId = item.instituteId;
    if (item.programId !== undefined) record.programId = item.programId;
    if (item.streamId !== undefined) record.streamId = item.streamId;
    if (item.semesterId !== undefined) record.semesterId = item.semesterId;

    record.updatedAt = new Date();
  });
};
