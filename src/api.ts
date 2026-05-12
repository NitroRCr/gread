import { Hono } from 'hono'
import { db } from './db'
import { repos } from './db/schema'
import { eq } from 'drizzle-orm'
import { indexRepo } from './services/indexer'
import { searchGithubRepos } from './services/github'
import { getTree, getFile, grep, type GrepOptions } from './services/git'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPTransport } from '@hono/mcp'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import Handlebars from 'handlebars'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { rateLimiter } from 'hono-rate-limiter'
import { config } from './config'

const app = new Hono()

const repoNameSchema = z.string().regex(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/, 'Repository name must be in the format "owner/repo"')

// -- Templates --
const repoTpl = Handlebars.compile(`
# {{fullName}}
**Stars**: {{stars}} | **Language**: {{language}}
**Description**: {{description}}
`)

const treeTpl = Handlebars.compile(`
## Directory Tree
\`\`\`
{{tree}}
\`\`\`
`)

// -- Hono MCP Setup --
const server = new McpServer({ name: 'gread-mcp', version: '1.0.0' })
const transport = new StreamableHTTPTransport()

app.use(logger())
app.use(cors())

app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    limit: config.rpmLimit,
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '',
  }),
)

app.all('/mcp', async (c) => {
  if (!server.isConnected()) await server.connect(transport)
  return transport.handleRequest(c)
})

// -- Core Logic --
async function searchRepos(query: string) {
  try {
    const rawItems = await searchGithubRepos(query)
    return rawItems.map((r: any) => repoTpl({
      fullName: r.full_name,
      stars: r.stargazers_count,
      language: r.language || 'Unknown',
      description: r.description || '',
    })).join('\n---\n')
  } catch (e: any) {
    return `Failed to search GitHub: ${e.message}`
  }
}

async function viewRepo(name: string) {
  try { await indexRepo(name) } catch (e) { console.error(e) }
  const r = db.select().from(repos).where(eq(repos.fullName, name)).get()
  if (!r) return 'Repo not indexed and could not be fetched.'
  let result = repoTpl(r) + '\n' + treeTpl({ tree: (await getTree(name, '', 3, 25)) })
  if (r.docRepoName && r.docRepoName !== name) {
    const doc = db.select().from(repos).where(eq(repos.fullName, r.docRepoName)).get()
    if (doc) {
      result += '\n\n---\n\n' + repoTpl(doc) + '\n' + treeTpl({ tree: (await getTree(r.docRepoName, '', 3, 25)) })
    }
  }
  return result
}

async function listTree(name: string, targetDir: string, maxDepth: number, maxPerDir: number) {
  try { await indexRepo(name) } catch (e) { console.error(e) }
  return treeTpl({ tree: await getTree(name, targetDir, maxDepth, maxPerDir) })
}

async function readCode(name: string, paths: string[]) {
  if (!paths || paths.length === 0) return 'No paths provided.'
  try { await indexRepo(name) } catch (e) { console.error(e) }
  const contents = await Promise.all(paths.map(async p => `## ${p}\n\`\`\`\n${await getFile(name, p) ?? 'File not found.'}\n\`\`\``))
  return contents.join('\n\n')
}

async function searchCode(name: string, query: string, options: GrepOptions = {}) {
  try { await indexRepo(name) } catch (e) { console.error(e) }
  let res = await grep(name, query, options)
  if (res) {
    res = res.split('\n').map(line => line.length > 10000 ? line.slice(0, 10000) + '...[TRUNCATED]' : line).join('\n')
    if (res.length > 100000) {
      res = res.slice(0, 100000) + '...[TRUNCATED]'
    }
  }
  return `## Search inside ${name} for "${query}"\n\`\`\`\n${res || 'No matches found.'}\n\`\`\``
}

// -- HTTP Routes --
app.get('/search', zValidator('query', z.object({ q: z.string().default('') })), async c => {
  return c.text(await searchRepos(c.req.valid('query').q))
})

app.get('/repo', zValidator('query', z.object({ name: repoNameSchema })), async c => {
  return c.text(await viewRepo(c.req.valid('query').name))
})

app.get('/tree', zValidator('query', z.object({
  name: repoNameSchema,
  dir: z.string().default(''),
  depth: z.coerce.number().default(3),
  limit: z.coerce.number().default(40),
})), async c => {
  const { name, dir, depth, limit } = c.req.valid('query')
  return c.text(await listTree(name, dir, depth, limit))
})

app.get('/read', zValidator('query', z.object({
  name: repoNameSchema,
  paths: z.string().transform(v => v.split(',')),
})), async c => {
  const { name, paths } = c.req.valid('query')
  return c.text(await readCode(name, paths))
})

app.get('/grep', zValidator('query', z.object({
  name: repoNameSchema,
  q: z.string(),
  i: z.string().optional().transform(v => v === 'true' || v === '1'),
  F: z.string().optional().transform(v => v === 'true' || v === '1'),
  E: z.string().optional().transform(v => v === 'true' || v === '1'),
  C: z.coerce.number().optional(),
  path: z.string().optional(),
})), async c => {
  const q = c.req.valid('query')
  return c.text(await searchCode(q.name, q.q, {
    ignoreCase: q.i,
    fixedStrings: q.F,
    extendedRegexp: q.E,
    contextLines: q.C,
    path: q.path,
  }))
})

// -- MCP Tools --
server.registerTool('search_repos', {
  description: 'Search for GitHub repositories by name, description, or topic keywords using the GitHub Search API.',
  inputSchema: z.object({ q: z.string().describe('Keyword to search in repository names, descriptions, or topics') }),
}, async ({ q }) => ({ content: [{ type: 'text', text: await searchRepos(q) }] }))

server.registerTool('view_repo', {
  description: 'View repository basic information and its directory structure. Includes corresponding documentation repo if available.',
  inputSchema: z.object({ name: repoNameSchema.describe('Full name of the repository (owner/name)') }),
}, async ({ name }) => ({ content: [{ type: 'text', text: await viewRepo(name) }] }))

server.registerTool('list_tree', {
  description: 'List the directory tree of a specific path in a repository with customizable depth and traversal limits.',
  inputSchema: z.object({
    name: repoNameSchema.describe('Full name of the repository (owner/name)'),
    targetDir: z.string().default('').describe('Target directory path to inspect. Leaves empty to search from root.'),
    maxDepth: z.number().default(3).describe('Maximum depth into the directory structure to list.'),
    maxPerDir: z.number().default(40).describe('Maximum number of items to display per directory level.'),
  }),
}, async ({ name, targetDir, maxDepth, maxPerDir }) => ({ content: [{ type: 'text', text: await listTree(name, targetDir, maxDepth, maxPerDir) }] }))

server.registerTool('read_code', {
  description: 'Retrieve the raw source code of specified files from within a known repository.',
  inputSchema: z.object({
    name: repoNameSchema.describe('Full name of the repository (owner/name)'),
    paths: z.array(z.string()).describe('An array of precise file paths within the repository'),
  }),
}, async ({ name, paths }) => ({ content: [{ type: 'text', text: await readCode(name, paths) }] }))

server.registerTool('search_code', {
  description: 'Perform a fast git grep inside the repository, allowing regex matching by default or substring search.',
  inputSchema: z.object({
    name: repoNameSchema.describe('Full name of the repository (owner/name)'),
    query: z.string().describe('Search pattern or query to pass to git grep'),
    ignoreCase: z.boolean().optional().describe('Ignore case distinctions in both the PATTERN and the input files (-i)'),
    fixedStrings: z.boolean().optional().describe('Use fixed strings for patterns (don’t interpret pattern as a regex) (-F)'),
    extendedRegexp: z.boolean().optional().describe('Use extended regular expressions (-E)'),
    contextLines: z.number().optional().describe('Print num lines of output context (-C)'),
    path: z.string().optional().describe('Directory or file path to limit the search scope'),
  }),
}, async ({ name, query, ...options }) => ({ content: [{ type: 'text', text: await searchCode(name, query, options) }] }))

export default app
