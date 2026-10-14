


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role = 'department_admin'
      and pi.status = 'approved'
  );
$$;


ALTER FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role = 'institute_admin'
      and pi.status = 'approved'
  );
$$;


ALTER FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.profile_institutes pi
    where pi.profile_id = auth.uid()
      and pi.institute_id = target_institute_id
      and pi.role in (
        'department_admin',
        'institute_admin'
      )
      and pi.status = 'approved'
  );
$$;


ALTER FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."institutes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "code" "text" NOT NULL,
    "address" "text",
    "affiliated_university" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "institutes_type_check" CHECK (("type" = ANY (ARRAY['school'::"text", 'college'::"text", 'university'::"text"])))
);


ALTER TABLE "public"."institutes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_institutes" (
    "profile_id" "uuid" NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "allowed_units" "text"[],
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "profile_institutes_check" CHECK (((("role" = 'department_admin'::"text") AND ("allowed_units" IS NOT NULL) AND ("cardinality"("allowed_units") > 0)) OR (("role" <> 'department_admin'::"text") AND ("allowed_units" IS NULL)))),
    CONSTRAINT "profile_institutes_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'teacher'::"text", 'department_admin'::"text", 'institute_admin'::"text"]))),
    CONSTRAINT "profile_institutes_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."profile_institutes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "date_of_birth" "date" NOT NULL,
    "gender" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "address" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."routines" (
    "id" bigint NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "unit_id" "text" NOT NULL,
    "teacher_id" "uuid" NOT NULL,
    "stream_id" "text",
    "program_id" "text",
    "grade_id" "text",
    "semester_id" "text",
    "batch" "text" NOT NULL,
    "section" "text",
    "subject_id" "text" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "days" "text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "routines_check" CHECK (("end_time" > "start_time")),
    CONSTRAINT "routines_days_check" CHECK (("cardinality"("days") > 0)),
    CONSTRAINT "routines_days_check1" CHECK (("days" <@ ARRAY['monday'::"text", 'tuesday'::"text", 'wednesday'::"text", 'thursday'::"text", 'friday'::"text", 'saturday'::"text", 'sunday'::"text"]))
);


ALTER TABLE "public"."routines" OWNER TO "postgres";


ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_institutes"
    ADD CONSTRAINT "profile_institutes_pkey" PRIMARY KEY ("profile_id", "institute_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."routines"
    ADD CONSTRAINT "routines_pkey" PRIMARY KEY ("id");



CREATE INDEX "profile_institutes_approved_institute_idx" ON "public"."profile_institutes" USING "btree" ("institute_id", "role", "profile_id") WHERE (("status" = 'approved'::"text") AND ("deleted_at" IS NULL));



CREATE INDEX "profile_institutes_approved_profile_idx" ON "public"."profile_institutes" USING "btree" ("profile_id", "institute_id", "role") WHERE (("status" = 'approved'::"text") AND ("deleted_at" IS NULL));



CREATE INDEX "profile_institutes_institute_id_idx" ON "public"."profile_institutes" USING "btree" ("institute_id");



CREATE INDEX "routines_institute_unit_idx" ON "public"."routines" USING "btree" ("institute_id", "unit_id");



CREATE INDEX "routines_teacher_schedule_idx" ON "public"."routines" USING "btree" ("teacher_id", "start_time", "end_time") WHERE ("deleted_at" IS NULL);



CREATE OR REPLACE TRIGGER "institutes_updated_at" BEFORE UPDATE ON "public"."institutes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "profile_institutes_updated_at" BEFORE UPDATE ON "public"."profile_institutes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "routines_updated_at" BEFORE UPDATE ON "public"."routines" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."profile_institutes"
    ADD CONSTRAINT "profile_institutes_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_institutes"
    ADD CONSTRAINT "profile_institutes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile_institutes"
    ADD CONSTRAINT "profile_institutes_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."routines"
    ADD CONSTRAINT "routines_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."routines"
    ADD CONSTRAINT "routines_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can read student and teacher memberships" ON "public"."profile_institutes" FOR SELECT TO "authenticated" USING ((("role" = ANY (ARRAY['student'::"text", 'teacher'::"text"])) AND "public"."is_institute_admin_or_department_admin"("institute_id")));



CREATE POLICY "Admins can update student and teacher status" ON "public"."profile_institutes" FOR UPDATE TO "authenticated" USING ((("role" = ANY (ARRAY['student'::"text", 'teacher'::"text"])) AND "public"."is_institute_admin_or_department_admin"("institute_id"))) WITH CHECK ((("role" = ANY (ARRAY['student'::"text", 'teacher'::"text"])) AND "public"."is_institute_admin_or_department_admin"("institute_id")));



CREATE POLICY "Anyone can read institutes" ON "public"."institutes" FOR SELECT USING (("deleted_at" IS NULL));



CREATE POLICY "Department admins can create allowed routines" ON "public"."routines" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'department_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL) AND ("routines"."unit_id" = ANY ("pi"."allowed_units"))))));



CREATE POLICY "Department admins can read allowed routines" ON "public"."routines" FOR SELECT TO "authenticated" USING ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'department_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL) AND ("routines"."unit_id" = ANY ("pi"."allowed_units")))))));



CREATE POLICY "Department admins can read institute profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."profile_institutes" "admin_membership"
     JOIN "public"."profile_institutes" "target_membership" ON (("target_membership"."institute_id" = "admin_membership"."institute_id")))
  WHERE (("admin_membership"."profile_id" = "auth"."uid"()) AND ("admin_membership"."role" = 'department_admin'::"text") AND ("admin_membership"."status" = 'approved'::"text") AND ("admin_membership"."deleted_at" IS NULL) AND ("target_membership"."profile_id" = "profiles"."id") AND ("target_membership"."deleted_at" IS NULL) AND ("target_membership"."role" = ANY (ARRAY['student'::"text", 'teacher'::"text", 'department_admin'::"text"]))))));



CREATE POLICY "Department admins can update allowed routines" ON "public"."routines" FOR UPDATE TO "authenticated" USING ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'department_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL) AND ("routines"."unit_id" = ANY ("pi"."allowed_units"))))))) WITH CHECK ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'department_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL) AND ("routines"."unit_id" = ANY ("pi"."allowed_units")))))));



CREATE POLICY "Institute admins can create institute routines" ON "public"."routines" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'institute_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL)))));



CREATE POLICY "Institute admins can read all institute routines" ON "public"."routines" FOR SELECT TO "authenticated" USING ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'institute_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL))))));



CREATE POLICY "Institute admins can read department admin memberships" ON "public"."profile_institutes" FOR SELECT TO "authenticated" USING ((("role" = 'department_admin'::"text") AND "public"."is_institute_admin"("institute_id")));



CREATE POLICY "Institute admins can read institute profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."profile_institutes" "admin_membership"
     JOIN "public"."profile_institutes" "target_membership" ON (("target_membership"."institute_id" = "admin_membership"."institute_id")))
  WHERE (("admin_membership"."profile_id" = "auth"."uid"()) AND ("admin_membership"."role" = 'institute_admin'::"text") AND ("admin_membership"."status" = 'approved'::"text") AND ("admin_membership"."deleted_at" IS NULL) AND ("target_membership"."profile_id" = "profiles"."id") AND ("target_membership"."deleted_at" IS NULL) AND ("target_membership"."role" = ANY (ARRAY['student'::"text", 'teacher'::"text", 'department_admin'::"text"]))))));



CREATE POLICY "Institute admins can update all institute routines" ON "public"."routines" FOR UPDATE TO "authenticated" USING ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'institute_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL)))))) WITH CHECK ((("deleted_at" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."profile_institutes" "pi"
  WHERE (("pi"."profile_id" = "auth"."uid"()) AND ("pi"."institute_id" = "routines"."institute_id") AND ("pi"."role" = 'institute_admin'::"text") AND ("pi"."status" = 'approved'::"text") AND ("pi"."deleted_at" IS NULL))))));



CREATE POLICY "Teachers can read their own routines" ON "public"."routines" FOR SELECT TO "authenticated" USING ((("teacher_id" = "auth"."uid"()) AND ("deleted_at" IS NULL)));



CREATE POLICY "Users can create their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "Users can read their own memberships" ON "public"."profile_institutes" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can read their own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can request to join an institute" ON "public"."profile_institutes" FOR INSERT TO "authenticated" WITH CHECK ((("profile_id" = "auth"."uid"()) AND ("role" = ANY (ARRAY['student'::"text", 'teacher'::"text"])) AND ("status" = 'pending'::"text") AND ("allowed_units" IS NULL)));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."institutes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_institutes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."routines" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_department_admin"("target_institute_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_institute_admin"("target_institute_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_institute_admin_or_department_admin"("target_institute_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."institutes" TO "anon";
GRANT ALL ON TABLE "public"."institutes" TO "authenticated";
GRANT ALL ON TABLE "public"."institutes" TO "service_role";



GRANT ALL ON TABLE "public"."profile_institutes" TO "anon";
GRANT ALL ON TABLE "public"."profile_institutes" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_institutes" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."routines" TO "anon";
GRANT ALL ON TABLE "public"."routines" TO "authenticated";
GRANT ALL ON TABLE "public"."routines" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































