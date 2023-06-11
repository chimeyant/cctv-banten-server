import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cctvs extends BaseSchema {
  protected tableName = 'cctvs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid')
      table.uuid('area_uuid')
      table.string('name')
      table.string('description',255).nullable()
      table.string('contact_person')
      table.string('phone',15).nullable
      table.string('url',255)
      table.string('address',500)
      table.string('lat').nullable
      table.string('lng').nullable
      table.boolean('public_access').defaultTo(false)
      table.string('foto').nullable
      table.string('status')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('deleted_at',{useTz:true})
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
