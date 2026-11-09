import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class Profiles extends Model {
  static table = "profiles";

  static associations: Associations = {
    profile_institutes: { type: "has_many", foreignKey: "profile_id" },
  } as const;

  @text("username") username!: string;
  @text("avatar_url") avatarUrl?: string | null;
  @text("date_of_birth") dateOfBirth!: string;
  @text("full_name") fullName!: string;
  @text("gender") gender!: string;
  @text("phone") phone!: string;
  @text("address") address?: string | null;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
