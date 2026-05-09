import app from './api'
import { searchReposByStars } from './services/github'
import { indexRepo } from './services/indexer'
import { config } from './config'

async function syncRepos() {
  console.log(`Syncing high-star repos (>= ${config.minStars} stars) with concurrency ${config.syncConcurrency}...`)
  try {
    let maxStars: number | string = '*'
    while (true) {
      console.log(`Fetching repos, max_stars: ${maxStars}`)
      const repos: any[] = []
      let page = 1
      while (repos.length < 1000) {
        const pageRepos = await searchReposByStars(config.minStars, maxStars, page)
        repos.push(...pageRepos)
        if (pageRepos.length < 100) break
        page++
        if (page > 10) break // GitHub Search API limits offset to 1000 items
      }

      if (repos.length === 0) break

      let i = 0
      const worker = async () => {
        while (i < repos.length) {
          const repo = repos[i++]
          await indexRepo(repo.full_name).catch(e => console.error(`Error indexing ${repo.full_name}:`, e))
        }
      }
      const workers = Array.from({ length: config.syncConcurrency }, () => worker())
      await Promise.all(workers)

      maxStars = repos[repos.length - 1].stargazers_count

      if (repos.length < 100 * (page - 1)) break // Less than expected pages fetched, we're done
    }
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
