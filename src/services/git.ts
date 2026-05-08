import { $ } from 'bun'
import { join } from 'path'
import { existsSync } from 'fs'
import { rm } from 'fs/promises'
import { config } from '../config'

export const getRepoDir = (repoName: string) => join(config.reposPath, repoName)

export async function partialClone(repoName: string, url: string) {
  const dir = getRepoDir(repoName)
  const limit = config.blobLimit
  if (existsSync(dir)) {
    try {
      await $`git -C ${dir} fetch --depth 1 origin HEAD`
      // Use reset --soft to update HEAD without affecting the empty working tree
      await $`git -C ${dir} reset --soft FETCH_HEAD`
    } catch {
      // Fallback if fetch fails or directory is corrupted
      await rm(dir, { recursive: true, force: true })
      await $`git clone --depth 1 --filter=blob:limit=${limit} --no-checkout ${url} ${dir}`
    }
  } else {
    await $`git clone --depth 1 --filter=blob:limit=${limit} --no-checkout ${url} ${dir}`
  }
}

export async function getTree(repoName: string, targetDir = '', maxDepth = 3, maxPerDir = 40) {
  const dir = getRepoDir(repoName)
  const out = await $`git -C ${dir} ls-tree -r -t --name-only HEAD`.text()
  const tree = out.split('\n').filter(Boolean)

  const counts: Record<string, number> = {}
  const truncated: Set<string> = new Set()
  const result: string[] = []

  for (const path of tree) {
    if (targetDir && path !== targetDir && !path.startsWith(targetDir + '/')) continue
    const relPath = targetDir ? path.slice(targetDir.length ? targetDir.length + 1 : 0) : path
    if (!relPath) continue

    const parts = relPath.split('/')
    const depth = parts.length

    if (depth > maxDepth) continue

    const parent = path.split('/').slice(0, -1).join('/') || '/'
    counts[parent] = (counts[parent] || 0) + 1

    if (counts[parent] > maxPerDir) {
      const key = `count:${parent}`
      if (!truncated.has(key)) {
        truncated.add(key)
        result.push(parent === '/' ? '...' : `${parent}/...`)
      }
      continue
    }

    result.push(path)
  }

  return result.join('\n')
}

export async function getFile(repoName: string, path: string) {
  try {
    return await $`git -C ${getRepoDir(repoName)} show HEAD:${path}`.text()
  } catch { return null }
}

export type GrepOptions = {
  ignoreCase?: boolean
  fixedStrings?: boolean
  contextLines?: number
  path?: string
}

export async function grep(repoName: string, query: string, options: GrepOptions = {}) {
  try {
    const args = ['grep', '-n', '-I']
    if (options.ignoreCase) args.push('-i')
    if (options.fixedStrings) args.push('-F')
    if (options.contextLines !== undefined) args.push(`-C${options.contextLines}`)
    args.push(query)
    // Always append HEAD since we are operating in a no-checkout repository
    args.push('HEAD')
    if (options.path) args.push('--', options.path)

    // Disable lazy fetching to prevent downloading large filtered blobs during search
    return await $`git -C ${getRepoDir(repoName)} ${args}`.env({ ...process.env, GIT_NO_LAZY_FETCH: '1' }).text()
  } catch { return null } // returns exit code 1 if no match
}
