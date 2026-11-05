import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";

export default class Profiles extends Model {
  static table = "profiles";

  @text("username") username!: string;
  @text("avatar_url") avatar_url?: string | null;
  @text("date_of_birth") date_of_birth!: string;
  @text("full_name") full_name!: string;
  @text("gender") gender!: string;
  @text("phone") phone!: string;
  @text("address") address?: string | null;

  @readonly @date("created_at") created_at!: Date;
  @readonly @date("updated_at") updated_at!: Date;
  @date("deleted_at") deleted_at!: Date | null;
}
