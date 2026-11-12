import { database } from "@/db";
import { LocalRoutinesData } from "@/types/localDbTypes";
import { Q } from "@nozbe/watermelondb";
import { Observable } from "@nozbe/watermelondb/utils/rx";
import { map } from "rxjs/operators";

export const observeBatchesByProgramId = (
  programId: string,
): Observable<string[]> => {
  return database
    .get<LocalRoutinesData>("routines")
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
