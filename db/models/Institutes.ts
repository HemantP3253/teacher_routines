import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class Institutes extends Model {
  static table = "institutes";

  static associations: Associations = {
    profile_institutes: { type: "has_many", foreignKey: "institute_id" },
  } as const;

  @text("name") name!: string;
  @text("code") code!: string;
  @text("type") type!: string;
  @text("address") address?: string | null;
  @text("affiliated_university") affiliatedUniversity!: string;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
