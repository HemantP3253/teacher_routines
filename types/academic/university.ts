import type { AcademicLevel, AcademicLevelType } from "./common";

/**
 * UNIVERSITY CURRICULUM STRUCTURE
 *
 * University
 * └── Unit / Faculty
 *     └── Degree Level
 *         └── Program
 *             ├── No branches
 *             │   └── Academic Level
 *             │       └── Subject
 *             │
 *             └── Has branches
 *                 ├── Common
 *                 │   └── Academic Level
 *                 │       └── Subject
 *                 └── Branch
 *                     └── Academic Level
 *                         └── Subject
 *
 * Examples:
 *
 * FoHSS
 * └── Bachelor's
 *     └── BA
 *         ├──Common
 *         │   └── Year → Subjects
 *         ├── English
 *         │   └── Year → Subjects
 *         ├── Economics
 *         │   └── Year → Subjects
 *         └── Sociology
 *             └── Year → Subjects
 *
 * FoM
 * └── Bachelor's
 *     └── BBA
 *         └── Semester → Subjects
 */

/**
 * Branches of a particular degree program
 *

 */
export interface UniversityBranch {
  /**
   * Identifier for the branch under a program
   *
   * @example
   * Soc    // Sociology
   * Nep    // Nepali
   */
  id: string;
  /**
   * Name of the branch
   *
   * @example
   * "Sociology"
   * "English"
   */
  name: string;
  /**
   * Subject and semester/ year information for a particular branch
   */
  levels: AcademicLevel[];
}

/**
 * Degree program under a degree level
 */
export type UniversityProgram =
  | {
      /**
       * Identifier for a university program
       *
       * @example
       * "ba"   // Bachelor of Arts
       * "bca"  // Bachelor of Computer Applications
       */
      id: string;
      /**
       * Full name of a degree program
       *
       * @example
       * "Bachelor of Arts"
       * "Bachelor of Computer Applications"
       */
      name: string;
      /**
       * Used to determine whether a degree uses semesters or years
       */
      termType: AcademicLevelType;
      /**
       * Boolean value used to determine whether a degree has branches
       */
      hasBranches: false;
      /**
       * Officially recognized short code for a program
       */
      shortCode: string;
      /**
       * Subject and semester/ year information for a particular branch
       */
      levels: AcademicLevel[];
    }
  | {
      /**
       * Identifier for a university program
       *
       * @example
       * "ba"   // Bachelor of Arts
       * "bca"  // Bachelor of Computer Applications
       */
      id: string;
      /**
       * Full name of a degree program
       *
       * @example
       * "Bachelor of Arts"
       * "Bachelor of Computer Applications"
       */
      name: string;
      /**
       * Used to determine whether a degree uses semesters or years
       */
      termType: AcademicLevelType;
      /**
       * Boolean value used to determine whether a degree has branches
       */
      hasBranches: true;
      /**
       * Officially recognized short code for a program
       */
      shortCode: string;
      /**
       * Stores common subjects for a branched degree
       */
      commonLevels: AcademicLevel[];
      /**
       * Branch information for a degree
       */
      branches: UniversityBranch[];
    };

/**
 * A degree level within a university unit/ faculty.
 */
export interface UniversityDegreeLevel {
  /**
   * Unique identifier for university degree level
   *
   * @example
   * "bachelors"
   * "mphil"
   * "phd"
   */
  id: string;
  /**
   * Name of the university degree level
   *
   * @example
   * "Master of Philosophy"   // mphil
   * "Doctor of Philosophy"   // phd
   */
  name: string;
  /**
   * The degree programs under the degree level
   */
  programs: UniversityProgram[];
}

/**
 * An academic unit/ faculty/ institute within a university
 */
export interface UniversityUnit {
  /**
   * Unique identifier for a faculty/ institute
   *
   * @example
   * "fohss"  // Faculty of Humanities and Social Sciences
   * "iom"    // Institute of Medicine
   * "fom"    // Faculty of Management
   */
  id: string;
  /**
   * Name of a faculty/ institute
   *
   * @example
   * "Faculty of Management"
   * "Institute of Medicine"
   * "Institute of Science and Technology"
   */
  name: string;
  /**
   * The degree levels under a faculty/ institute.
   */
  degreeLevels: UniversityDegreeLevel[];
}

/**
 * Complete curriculum definition for a university
 */
export interface UniversityCurriculum {
  /**
   * Identifier of the university that owns a curriculum.
   *
   * @example
   * "tu"   // Tribhuvan University
   * "pu"   // Pokhara University
   * "ku"   // Kathmandu University
   * "ltu"  // Lumbini Technological University
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
   * Identifies this as a university
   */
  type: "university";
  /**
   * The units/ faculties/ institute under an institution
   *
   * @example
   * "Faculty of Humanities and Social Sciences"
   * "Faculty of Management"
   * "Institute of Medicine"
   */
  units: UniversityUnit[];
}
