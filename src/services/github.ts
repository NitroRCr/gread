import { config } from '../config'

const headers: Record<string, string> = config.githubToken ? { Authorization: `Bearer ${config.githubToken}` } : {}

async function fetchJson<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `https://api.github.com${path}`
  console.log(url)
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`)
  return res.json() as T
}

export async function fetchRepoInfo(fullName: string) {
  return fetchJson<any>(`/repos/${fullName}`)
}

export async function fetchReadme(fullName: string, defaultBranch: string) {
  const url = `https://raw.githubusercontent.com/${fullName}/refs/heads/${defaultBranch}/README.md`
  const res = await fetch(url)
  return res.ok ? res.text() : ''
}

export async function fetchOrgRepos(orgUrl: string) {
  try {
    const repos = await fetchJson<any[]>(orgUrl)
    return repos.map(r => ({ name: r.full_name, desc: r.description }))
  } catch { return [] }
}

export async function searchReposByStars(minStars: number, page = 1) {
  const data = await fetchJson<any>(`/search/repositories?q=stars:>=${minStars}&sort=stars&order=desc&per_page=100&page=${page}`)
  return data.items
}
export async function searchGithubRepos(query: string, page = 1) {
  const data = await fetchJson<any>(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20&page=${page}`)
  return data.items
}
