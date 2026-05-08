import { mkdirSync } from 'fs'
import { join } from 'path'

const dataPath = process.env.DATA_PATH || './data'
mkdirSync(dataPath, { recursive: true })

export const config = {
  dataPath,
  dbPath: join(dataPath, 'sqlite.db'),
  reposPath: join(dataPath, 'repos'),
  minStars: Number(process.env.MIN_STARS) || 10000,
  syncInterval: Number(process.env.SYNC_INTERVAL) || 72 * 60 * 60 * 1000, // 72 hours
  syncConcurrency: Number(process.env.SYNC_CONCURRENCY) || 8,
  repoRefreshThreshold: Number(process.env.REPO_REFRESH_THRESHOLD) || 7 * 24 * 60 * 60 * 1000, // 7 days
  port: Number(process.env.PORT) || 3000,
  blobLimit: process.env.BLOB_LIMIT || '100k',
  githubToken: process.env.GITHUB_TOKEN,
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
}
