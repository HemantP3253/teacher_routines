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
