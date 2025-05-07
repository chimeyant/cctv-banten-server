import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";
import { compose } from "@ioc:Adonis/Core/Helpers";
import {
  BaseModel,
  beforeCreate,
  column,
  computed,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Cctv from "./Cctv";

export default class Area extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uuid: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public deletedAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async createUUID(area: Area) {
    area.uuid = uuid();
  }

  @hasMany(() => Cctv, { foreignKey: "areaUuid", localKey: "uuid" })
  public cctvs: HasMany<typeof Cctv>;

  @computed()
  public get display() {
    return {
      id: this.uuid,
      name: this.name,
      description: this.description,
    };
  }

  @computed()
  public get record() {
    return {
      id: this.uuid,
      name: this.name,
      description: this.description,
    };
  }
}
