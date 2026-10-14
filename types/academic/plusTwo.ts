import type { CurriculumSubject } from "./common";

/**
 * Information about the current stream
 */
export interface PlusTwoStream {
  /**
   * Stable identifier for the current stream
   *
   * @example
   * "science"
   * "management"
   * "law"
   */
  id: string;
  /**
   * Name of the current stream
   *
   * @example
   * "Science"
   * "Management"
   * "Law"
   */
  name: string;
  /**
   * Information about the subjects under the current stream
   */
  subjects: CurriculumSubject[];
}

/**
 * Information about a year of plus two (+2) college
 */
export interface PlusTwoYear {
  /**
   * Stable identifier for the current year
   *
   * @example
   * "grade_11"   // Grade 11
   * "grade_12"   // Grade 12
   */
  id: string;
  /**
   * Name of the current year
   */
  name: string;
  /**
   * Information about the different streams in the current year
   */
  streams: PlusTwoStream[];
}

/**
 * Complete curriculum for a college (+2/ Plus Two)
 */
export interface PlusTwoCurriculum {
  /**
   * Identifier for this curriculum definition.
   *
   * @example
   * "nepal_plus_two"
   */
  id: string;
  /**
   * Version of the curriculum definition.
   *
   * @example
   * "v1"   // Version 1
   * "v2"   // Version 2
   * "v3"   // Version 3
   */
  version: string;
  /**
   * Identifies this as a +2 / college curriculum.
   */
  type: "college";
  /**
   * Academic years/classes included in the curriculum.
   */
  years: PlusTwoYear[];
}
