import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'
import { config } from '../config'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'

const sqlite = new Database(config.dbPath)
export const db = drizzle({ client: sqlite, schema })

migrate(db, { migrationsFolder: './drizzle' })
