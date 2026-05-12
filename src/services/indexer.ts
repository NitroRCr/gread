import { db } from '../db'
import { repos } from '../db/schema'
import { eq } from 'drizzle-orm'
import { fetchRepoInfo, fetchReadme, fetchOrgRepos } from './github'
import { partialClone } from './git'
import { analyzeRepo } from './llm'
import { config } from '../config'

const activeIndexes = new Map<string, Promise<any>>()

export async function indexRepo(fullName: string) {
  if (activeIndexes.has(fullName)) return activeIndexes.get(fullName)

  const promise = _indexRepo(fullName)
  activeIndexes.set(fullName, promise)
  try {
    return await promise
  } finally {
    activeIndexes.delete(fullName)
  }
}

async function _indexRepo(fullName: string) {
  const r = db.select().from(repos).where(eq(repos.fullName, fullName)).get()
  const isOutdated = r?.lastIndexedAt ? (Date.now() - r.lastIndexedAt.getTime() > config.repoRefreshThreshold) : true
  if (r && !isOutdated) {
    console.log(`Skipping ${fullName} (indexed recently)`)
    return r
  }

  console.log(`Indexing ${fullName}...`)
  const info = await fetchRepoInfo(fullName)
  const readme = await fetchReadme(fullName, info.default_branch)

  // Clone codebase
  await partialClone(fullName, info.clone_url)

  // Analyze metadata and find doc repo
  const orgRepos = info.owner?.repos_url ? await fetchOrgRepos(info.owner.repos_url) : []
  const docRepos = orgRepos.filter(r => r.name.toLowerCase().includes('doc'))
  const { cleanDescription, docRepoName } = await analyzeRepo(fullName, info.description, readme, docRepos)

  // Upsert in DB
  const record = {
    fullName: info.full_name,
    description: cleanDescription,
    stars: info.stargazers_count,
    language: info.language,
    docRepoName,
    lastIndexedAt: new Date(),
  }

  const existing = db.select().from(repos).where(eq(repos.fullName, info.full_name)).get()
  if (existing) {
    db.update(repos).set(record).where(eq(repos.id, existing.id)).run()
  } else {
    db.insert(repos).values(record).run()
  }

  // Cascade index doc repo if found
  if (docRepoName && docRepoName !== fullName) {
    try {
      await indexRepo(docRepoName)
    } catch (e) {
      console.error(`Failed cascading doc repo ${docRepoName}`, e)
    }
  }

  console.log(`Indexed ${fullName}`)
  return record
}
