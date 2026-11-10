import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: "profiles",
      columns: [
        { name: "address", type: "string", isOptional: true },
        { name: "avatar_url", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "date_of_birth", type: "string" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "full_name", type: "string" },
        { name: "gender", type: "string" },
        { name: "phone", type: "string" },
        { name: "username", type: "string" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "profile_institutes",
      columns: [
        { name: "allowed_units", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "institute_id", type: "string" },
        { name: "profile_id", type: "string" },
        { name: "reviewed_at", type: "number", isOptional: true },
        { name: "reviewed_by", type: "string", isOptional: true },
        { name: "role", type: "string" },
        { name: "status", type: "string" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "institutes",
      columns: [
        { name: "address", type: "string", isOptional: true },
        { name: "affiliated_university", type: "string" },
        { name: "code", type: "string" },
        { name: "created_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "name", type: "string" },
        { name: "type", type: "string" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "routines",
      columns: [
        { name: "batch_and_section", type: "string" },
        { name: "created_at", type: "number" },
        { name: "days", type: "string" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "end_time", type: "string" },
        { name: "grade_id", type: "string", isOptional: true },
        { name: "institute_id", type: "string" },
        { name: "program_id", type: "string", isOptional: true },
        { name: "semester_id", type: "string", isOptional: true },
        { name: "start_time", type: "string" },
        { name: "stream_id", type: "string", isOptional: true },
        { name: "subject_id", type: "string" },
        { name: "teacher_id", type: "string" },
        { name: "unit_id", type: "string" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
