import {
  AcademicLevel,
  CurriculumSubject,
  UniversityBranch,
  UniversityDegreeLevel,
  UniversityProgram,
  UniversityUnit,
} from "@/types/academic";
import { TUCurriculumV1 } from "./TUv1";

export const getAllProgramsByQuery = (query: string): UniversityProgram[] => {
  if (!query || !query.trim()) return [];
  const lowercaseQuery = query.toLowerCase().trim();

  return TUCurriculumV1.units
    .flatMap((unit) => unit.degreeLevels)
    .flatMap((level) => level.programs)
    .filter((program) => program.id.toLowerCase().includes(lowercaseQuery));
};

export const getProgramById = (id: string): UniversityProgram | undefined => {
  if (!id || !id.trim()) return undefined;
  const lowercaseQuery = id.toLowerCase().trim();

  return TUCurriculumV1.units
    .flatMap((unit) => unit.degreeLevels)
    .flatMap((level) => level.programs)
    .find((program) => program.id.toLowerCase().includes(lowercaseQuery));
};

export function getAllAvailableEntities(
  ids: string[],
  filterBy: "faculty" | "degreeLevel" | "program",
): UniversityProgram[] {
  return TUCurriculumV1.units
    .filter((unit) => filterBy !== "faculty" || ids.includes(unit.id))
    .flatMap((unit) => unit.degreeLevels)
    .filter((level) => filterBy !== "degreeLevel" || ids.includes(level.id))
    .flatMap((level) => level.programs)
    .filter((program) => filterBy !== "program" || ids.includes(program.id));
}

export const getProgramContextById = (programId?: string) => {
  if (!programId) return undefined;

  for (const unit of TUCurriculumV1.units) {
    for (const level of unit.degreeLevels) {
      const program = level.programs.find(
        (program) => program.id === programId,
      );

      if (program) return { unit, level, program };
    }
  }

  return undefined;
};

export const getAllCurriculumEntities = () => {
  const units = TUCurriculumV1.units;

  const degreeLevels = units.flatMap((unit) => unit.degreeLevels);

  const programs = degreeLevels.flatMap((level) => level.programs);

  const branches = programs.flatMap((program) =>
    program.hasBranches ? program.branches : [],
  );

  const academicLevels = programs.flatMap((program) => {
    if (program.hasBranches) {
      return [
        ...program.commonLevels,
        ...program.branches.flatMap((branch) => branch.levels),
      ];
    }

    return program.levels;
  });

  return {
    units,
    degreeLevels,
    programs,
    branches,
    academicLevels,
  };
};

export const getSubjects = (
  programId: string,
  branchId: string | undefined,
  academicLevelId: string,
): CurriculumSubject[] => {
  const program = getProgramById(programId);
  if (!program) return [];

  const hasBranches = program.hasBranches;

  if (!hasBranches) {
    return (
      program.levels.find((level) => level.id === academicLevelId)?.subjects ??
      []
    );
  }

  if (!branchId) return [];

  const commonLevel = program.commonLevels.find(
    (academicLevel) => academicLevel.id === academicLevelId,
  );
  const branchLevel = program.branches
    .find((branch) => branch.id === branchId)
    ?.levels?.find((academicLevel) => academicLevel.id === academicLevelId);

  if (!commonLevel || !branchLevel) return [];

  return [...commonLevel.subjects, ...branchLevel.subjects];
};

export const getAllDegreeNames = (): UniversityProgram[] => {
  return TUCurriculumV1.units
    .flatMap((unit) => unit.degreeLevels)
    .flatMap((level) => level.programs)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export function getEntityByPreviousId(
  unitId: string,
): UniversityUnit | undefined;
export function getEntityByPreviousId(
  unitId: string,
  programLevelId: string,
): UniversityDegreeLevel | undefined;
export function getEntityByPreviousId(
  unitId: string,
  programLevelId: string,
  programId: string,
): UniversityProgram | undefined;
export function getEntityByPreviousId(
  unitId: string,
  programLevelId: string,
  programId: string,
  branchId: string,
): UniversityBranch | UniversityProgram | undefined;
export function getEntityByPreviousId(
  unitId: string,
  programLevelId: string,
  programId: string,
  branchId: string,
  termId: string,
): AcademicLevel | undefined;

export function getEntityByPreviousId(
  unitId: string,
  programLevelId?: string,
  programId?: string,
  branchId?: string,
  termId?: string,
):
  | UniversityUnit
  | UniversityDegreeLevel
  | UniversityProgram
  | UniversityBranch
  | AcademicLevel
  | undefined {
  const unit = TUCurriculumV1.units.find((unit) => unit.id === unitId);
  if (!programLevelId) return unit;

  const programLevel = unit?.degreeLevels.find(
    (level) => level.id === programLevelId,
  );
  if (!programId) return programLevel;

  const program = programLevel?.programs.find(
    (program) => program.id === programId,
  );
  if (!branchId && !program?.hasBranches) return program;

  const branch = program?.hasBranches
    ? program.branches.find((branch) => branch.id === branchId)
    : program;
  if (!termId) return branch;

  return branch?.levels.find((term) => term.id === termId);
}

export function getNextCurriculumEntities(
  unitId: string,
): UniversityDegreeLevel[];
export function getNextCurriculumEntities(
  unitId: string,
  programLevelId: string,
): UniversityProgram[];
export function getNextCurriculumEntities(
  unitId: string,
  programLevelId: string,
  programId: string,
): UniversityBranch[];
export function getNextCurriculumEntities(
  unitId: string,
  programLevelId: string,
  programId: string,
  branchId: string,
): AcademicLevel[];
export function getNextCurriculumEntities(
  unitId: string,
  programLevelId: string,
  programId: string,
  branchId: string,
  termId: string,
): CurriculumSubject[];

export function getNextCurriculumEntities(
  unitId: string,
  programLevelId?: string,
  programId?: string,
  branchId?: string,
  termId?: string,
) {
  const unit = TUCurriculumV1.units.find((unit) => unit.id === unitId);

  if (!unit) return [];

  if (!programLevelId) return unit.degreeLevels;

  const level = unit.degreeLevels.find((level) => level.id === programLevelId);

  if (!level) return [];

  if (!programId) return level.programs;

  const program = level.programs.find((program) => program.id === programId);

  if (!program) return [];

  if (program.hasBranches) {
    if (!branchId) return program.branches;

    const branch = program.branches.find((branch) => branch.id === branchId);

    return branch?.levels ?? [];
  }

  if (!termId) return program.levels;

  const levels = program.levels;
  return levels.find((term) => term.id === termId)?.subjects ?? [];
}
