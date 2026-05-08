import app from './api'
import { searchReposByStars } from './services/github'
import { indexRepo } from './services/indexer'
import { config } from './config'

async function syncRepos() {
  console.log(`Syncing high-star repos (>= ${config.minStars} stars) with concurrency ${config.syncConcurrency}...`)
  try {
    const repos = await searchReposByStars(config.minStars)
    let i = 0
    const worker = async () => {
      while (i < repos.length) {
        const repo = repos[i++]
        await indexRepo(repo.full_name).catch(e => console.error(`Error indexing ${repo.full_name}:`, e))
      }
    }
    const workers = Array.from({ length: config.syncConcurrency }, () => worker())
    await Promise.all(workers)
  } catch (error) {
    console.error('Initial sync failed:', error)
  }
}

// Start immediate sync and schedule interval
syncRepos()
setInterval(syncRepos, config.syncInterval)

export default {
  port: config.port,
  fetch: app.fetch,
}

console.log(`gread is running on http://localhost:${config.port}`)
