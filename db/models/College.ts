import { Model } from "@nozbe/watermelondb";
import { date, json, readonly, text } from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class College extends Model {
  static table: string = "colleges";

  @text("university") university!: string;
  @text("college_code") college_code!: string;
  @text("college_name") college_name!: string;
  @text("address") address!: string;

  // 🟢 Automatically handles JSON stringify/parse for your arrays!
  @json("authorized_users", sanitizeArray) authorized_users!: string[];
  @json("available_faculties", sanitizeArray) available_faculties!: string[];

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
}
