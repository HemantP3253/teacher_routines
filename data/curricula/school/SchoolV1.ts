import { SchoolCurriculum } from "@/types/academic";

export const NepalSchoolCurriculum: SchoolCurriculum = {
  id: "nepal_school",
  version: "v1",
  type: "school",
  levels: [
    {
      id: "eced",
      name: "Early Childhood Education and Development (ECED)",
      category: "basic",
      grades: [
        {
          id: "nursery",
          name: "Nursery",
          subjects: [
            {
              id: "nursery_english",
              name: "English Oral & Tracing",
              type: "required",
            },
            {
              id: "nursery_nepali",
              name: "Nepali Oral & Tracing",
              type: "required",
            },
            {
              id: "nursery_maths",
              name: "Basic Mathematics",
              type: "required",
            },
            {
              id: "nursery_rhymes",
              name: "Rhymes & Stories",
              type: "required",
            },
            {
              id: "nursery_drawing",
              name: "Drawing & Coloring",
              type: "required",
            },
            {
              id: "nursery_activities",
              name: "Play & Practical Activities",
              type: "required",
            },
          ],
        },
        {
          id: "lkg",
          name: "Lower Kindergarten (LKG)",
          subjects: [
            {
              id: "lkg_english",
              name: "English Writing",
              type: "required",
            },
            {
              id: "lkg_nepali",
              name: "Nepali Writing",
              type: "required",
            },
            {
              id: "lkg_maths",
              name: "Mathematics",
              type: "required",
            },
            {
              id: "lkg_gk",
              name: "General Knowledge",
              type: "required",
            },
            {
              id: "lkg_rhymes",
              name: "Rhymes & Phonics",
              type: "required",
            },
            {
              id: "lkg_drawing",
              name: "Drawing & Craft",
              type: "required",
            },
          ],
        },
        {
          id: "ukg",
          name: "Upper Kindergarten (UKG)",
          subjects: [
            {
              id: "ukg_english",
              name: "English Language",
              type: "required",
            },
            {
              id: "ukg_nepali",
              name: "Nepali Language",
              type: "required",
            },
            {
              id: "ukg_maths",
              name: "Mathematics",
              type: "required",
            },
            {
              id: "ukg_gen_sci",
              name: "General Science",
              type: "required",
            },
            {
              id: "ukg_soc_env_std",
              name: "Social & Environmental Studies",
              type: "required",
            },
            {
              id: "ukg_creative",
              name: "Creative Arts & Dance",
              type: "required",
            },
          ],
        },
      ],
    },
  ],
};
