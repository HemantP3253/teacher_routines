import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "colleges",
      columns: [
        { name: "university", type: "string" },
        { name: "college_code", type: "string" },
        { name: "college_name", type: "string" },
        { name: "address", type: "string" },
        { name: "authorized_users", type: "string" },
        { name: "available_faculties", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "profiles",
      columns: [
        { name: "username", type: "string" },
        { name: "full_name", type: "string" },
        { name: "date_of_birth", type: "string" },
        { name: "gender", type: "string" },
        { name: "phone", type: "string" },
        { name: "avatar_url", type: "string", isOptional: true },
        { name: "is_admin", type: "boolean" },
        { name: "address", type: "string", isOptional: true },
        { name: "colleges", type: "string", isOptional: true },
        { name: "approved_by", type: "string", isOptional: true },
        { name: "rejected_by", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "routines",
      columns: [
        { name: "user_id", type: "string" },
        { name: "college_id", type: "string" },
        { name: "subject_code", type: "string" },
        { name: "day_of_week", type: "string" },
        { name: "start_time", type: "string" },
        { name: "duration", type: "string" },
        { name: "remarks", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
