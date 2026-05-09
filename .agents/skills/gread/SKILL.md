---
name: gread
description: Provide the ability to search, inspect, and read source code from all public GitHub repositories and their associated documentation.
---

# Gread

Provide the ability to search, inspect, and read source code from all public GitHub repositories and their associated documentation.

## Endpoints

All endpoints are GET endpoints exposed at `https://api.gread.dev`. Only use parameters through the query string (`?key=value`). The system returns well-formatted markdown blocks.

- If the exact repository full name is known (e.g., `owner/repo`), view repository (`/repo`) directly.
- Otherwise, search repositories (`/search`) first to find the correct repository.
- To retrieve documents, also view the main repository through `/repo`; its corresponding document repo will also be returned (if exists).

### 1. Search Repositories
Search for GitHub repositories by name, description, or topic keywords using the GitHub Search API.
**Format**: `GET https://api.gread.dev/search?q={keyword}`
**Example**: `GET https://api.gread.dev/search?q=hono`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | string | Yes | Keyword to search in repository names, descriptions, or topics |

### 2. View Repository
View repository basic information and its directory structure. Includes corresponding documentation repo if available.
**Format**: `GET https://api.gread.dev/repo?name={user/repo}`
**Example**: `GET https://api.gread.dev/repo?name=honojs/hono`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name of the repository (owner/repo) |

### 3. List Directory Tree
Detailed view of a repository's directory tree with recursion limits.
**Format**: `GET https://api.gread.dev/tree?name={user/repo}&dir={targetDir}&depth={num}&limit={num}`
**Example**: `GET https://api.gread.dev/tree?name=honojs/hono&dir=src&depth=3&limit=50`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name of the repository (owner/repo) |
| `dir` | string | No | Target directory path to inspect (defaults to root if empty) |
| `depth` | number | No | Maximum depth into the directory structure to list (default:3) |
| `limit` | number | No | Maximum number of items to display per directory level (default: 40) |

### 4. Read Code
Retrieve the raw source code of specified files from within a known repository. Provide paths separated by commas.
**Format**: `GET https://api.gread.dev/read?name={user/repo}&paths={path1,path2}`
**Example**: `GET https://api.gread.dev/read?name=honojs/hono&paths=src/index.ts,package.json`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name of the repository (owner/repo) |
| `paths` | string | Yes | Comma-separated list of precise file paths within the repository |

### 5. Search within Repo
Perform a fast `git grep` inside the repository.
**Format**: `GET https://api.gread.dev/grep?name={user/repo}&q={search_pattern}&i=true&F=true&E=true&C=2&path={targetDir}`
**Example**: `GET https://api.gread.dev/grep?name=honojs/hono&q=listen&C=2&path=src`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full name of the repository (owner/repo) |
| `q` | string | Yes | Search pattern or query to pass to git grep |
| `i` | boolean | No | Ignore case distinctions (`-i`) |
| `F` | boolean | No | Interpret pattern as fixed string (`-F`) |
| `E` | boolean | No | Interpret pattern as extended regular expression (`-E`) |
| `C` | number | No | Print num lines of output context (`-C`) |
| `path` | string | No | Directory or file path to limit the search scope |
