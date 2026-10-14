import type { CurriculumSubject } from "./common";

/**
 * Broad category used to group school-level definitions.
 *
 * Multiple SchoolLevel definitions may belong to the same category.
 *
 * @example
 * "basic"
 * "secondary"
 * "higher_secondary"
 * "other"
 */
export type SchoolLevelCategory =
  | "eced"
  | "basic"
  | "secondary"
  | "higher_secondary"
  | "other";

/**
 * Definition for school grade
 */
export interface SchoolGrade {
  /**
   * Stable identifier for a grade
   *
   * @example
   * "grade_1"  // Grade 1
   * "grade_8"  // Grade 8
   * "grade_11"  // Grade 11
   */
  id: string;
  /**
   * Name for a grade
   *
   * @example
   * Grade 1 (One)
   * Grade 2 (Two)
   */
  name: string;
  /**
   * Subject list for a grade
   */
  subjects: CurriculumSubject[];
}

/**
 * Definition for school levels
 */
export interface SchoolLevel {
  /**
   * Stable identifier for a level
   *
   * @example
   * "basic_level_1" // Basic Level 1 (Class 1 to 3)
   * "secondary_level_1" // Secondary Level 1 (Class 9 and 10)
   */
  id: string;
  /**
   * Display name for a level
   *
   * @example
   * "Basic Level 1" // Basic (Class 1 to 3)
   */
  name: string;
  /**
   * Used for categorizing the school levels
   *
   * Available values are "eced", "basic", "secondary", "higher_secondary", "other"
   */
  category: SchoolLevelCategory;
  /**
   * Grade information for the current school level
   */
  grades: SchoolGrade[];
}

/**
 * Complete curriculum for a school
 */
export interface SchoolCurriculum {
  /**
   * Identifier of the university that owns this curriculum.
   *
   * @example
   * "nepal_school_curriculum"
   */
  id: string;
  /**
   * The version of the syllabus.
   *
   * Used for checking data.
   *
   * @example
   * v1
   * v2
   * v3
   */
  version: string;
  /**
   * Identifies this as a school
   */
  type: "school";
  /**
   * The levels in a school (like Basic, Secondary, etc)
   */
  levels: SchoolLevel[];
}
