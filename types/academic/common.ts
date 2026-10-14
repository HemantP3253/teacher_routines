/**
 * Used to mark whether a subject is required or an elective
 * (optional) subject with various options to choose from
 */
export type SubjectType = "required" | "elective";

/**
 * Used to define whether a institute uses semester-based
 * terms or year-based terms
 */
export type AcademicLevelType = "semester" | "year";

/**
 * Used to differentiate between institutes depending on
 * the amount of education they provide
 */
export type InstituteType = "school" | "college" | "university";

/**
 * Defines the subjects present in a curriculum
 */
export interface CurriculumSubject {
  /**
   * Stable identifier for a subject
   */
  id: string;
  /**
   * Display name of a subject
   */
  name: string;
  /**
   * Subject code either provided by a curriculum, or defined independently
   */
  code?: string;
  /**
   * Type of subject
   */
  type: SubjectType;
  /**
   * (Optional) Elective group which a subject falls under
   */
  elective_group?: string;
}

/**
 * Defines the grades/ classes of an institute
 */
export interface AcademicLevel {
  /**
   * Stable identifier for an academic level
   */
  id: string;
  /**
   * Display name for an academic level
   */
  name: string;
  /**
   * Type of term the academic level uses (semester or year)
   */
  type: AcademicLevelType;
  /**
   * Subjects within the academic level
   */
  subjects: CurriculumSubject[];
}
