import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";

export default class Routine extends Model {
  static table = "routines";

  @text("user_id") user_id!: string;
  @text("college_id") college_id!: string;
  @text("subject_code") subject_code!: string;
  @text("day_of_week") day_of_week!: string;
  @text("start_time") start_time!: string;
  @text("duration") duration!: string;
  @text("remarks") remarks?: string;

  @readonly @date("created_at") created_at!: number;
  @readonly @date("updated_at") updated_at!: number;
}
