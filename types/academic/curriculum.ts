import type { PlusTwoCurriculum } from "./plusTwo";
import type { SchoolCurriculum } from "./school";
import type { UniversityCurriculum } from "./university";

/**
 * Types of curriculum available depending on the type of institute
 */
export type Curriculum =
  | SchoolCurriculum
  | PlusTwoCurriculum
  | UniversityCurriculum;
