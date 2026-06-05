import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  json,
  readonly,
  text,
} from "@nozbe/watermelondb/decorators";

const sanitizeArray = (jsonArray: any) =>
  Array.isArray(jsonArray) ? jsonArray : [];

export default class Profile extends Model {
  static table = "profiles";

  @text("username") username!: string;
  @text("full_name") full_name!: string;
  @text("date_of_birth") date_of_birth!: string;
  @text("gender") gender!: string;
  @text("phone") phone!: string;
  @text("avatar_url") avatar_url?: string;
  @field("is_admin") is_admin!: boolean;
  @text("address") address?: string;

  @json("colleges", sanitizeArray) colleges!: string[];
  @json("approved_by", sanitizeArray) approved_by!: string[];
  @json("rejected_by", sanitizeArray) rejected_by!: string[];

  @readonly @date("created_at") created_at!: Date;
  @readonly @date("updated_at") updated_at!: Date;
}
