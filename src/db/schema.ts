import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const repos = sqliteTable('repos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull().unique(),
  description: text('description'),
  stars: integer('stars').notNull().default(0),
  language: text('language'),
  docRepoName: text('doc_repo_name'),
  lastIndexedAt: integer('last_indexed_at', { mode: 'timestamp' }),
})
