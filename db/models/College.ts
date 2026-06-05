import { Model } from "@nozbe/watermelondb";
import {
  children,
  date,
  json,
  readonly,
  text,
} from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class College extends Model {
  static table: string = "colleges";

  static associations = {
    profiles: { type: "has_many", foreignKey: "college_id" },
    routines: { type: "has_many", foreignKey: "college_id" },
  } as const;

  @text("university") university!: string;
  @text("college_code") college_code!: string;
  @text("college_name") college_name!: string;
  @text("address") address!: string;

  @json("authorized_users", sanitizeArray) authorized_users!: string[];
  @json("available_faculties", sanitizeArray) available_faculties!: string[];

  @readonly @date("created_at") created_at!: Date;
  @readonly @date("updated_at") updated_at!: Date;

  @children("profiles") profiles!: any;
  @children("routines") routines!: any;
}
