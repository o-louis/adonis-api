// HOW TO ADD A COLUMN TO AN EXISTING TABLE

import { BaseSchema } from '@adonisjs/lucid/schema'

import { UserRole } from '#models/user'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('role', Object.values(UserRole)).notNullable().defaultTo(UserRole.USER)
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }
}
