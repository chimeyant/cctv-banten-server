import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import {  BaseModel, belongsTo, column ,BelongsTo, computed, beforeCreate, afterFind} from '@ioc:Adonis/Lucid/Orm'
import Area from './Area'

export default class Cctv extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public areaUuid: string

  @column()
  public name:string

  @column()
  public description:string

  @column()
  public contactPerson:string

  @column()
  public phone:string

  @column()
  public url:string

  @column()
  public address:string

  @column()
  public lat:string

  @column()
  public lng:string

  @column()
  public publicAccess:boolean

  @column()
  public foto:string

  @column()
  public status:string

  @column()
  public deletedAt:DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public  static async createUID(cctv: Cctv){
    cctv.uuid = uuid()
  }

  @belongsTo(()=> Area,{foreignKey:'areaUuid',localKey:'uuid'})
  public area: BelongsTo<typeof Area >

  @computed()
  public  get dataview(){
    return {
      id: this.uuid,
      name: this.name,
      address: this.address,
      status: this.status,
    }
  }

  @computed()
  public get datarecord(){
    return{
      id:this.uuid,
      area_uuid: this.areaUuid,
      name: this.name,
      description: this.description,
      contact_person: this.contactPerson,
      phone: this.phone,
      url: this.url,
      address: this.address,
      lat:this.lat,
      lng: this.lng,
      foto: this.foto,
      status: this.status,
      public_access:this.publicAccess,
    }
  }



}
