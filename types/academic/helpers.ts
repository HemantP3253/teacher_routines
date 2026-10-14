import type { Curriculum } from "./curriculum";

/**
 * Provides the required curriculum's section (unit/ level)
 *
 * @param curriculum - The curriculum type required
 * @returns The level/ unit within the required curriculum
 */
export function getCurriculumSections(curriculum: Curriculum) {
  switch (curriculum.type) {
    case "school":
      return curriculum.levels;

    case "college":
      return curriculum.years;

    case "university":
      return curriculum.units;
  }
}
