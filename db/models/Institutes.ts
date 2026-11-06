import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";

export default class Institutes extends Model {
  static table = "institutes";

  @text("name") name!: string;
  @text("code") code!: string;
  @text("type") type!: string;
  @text("address") address?: string | null;
  @text("affiliated_university") affiliatedUniversity?: string | null;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @date("deleted_at") deletedAt!: Date | null;
}
