---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Gread"
  text: "One Skill for all repos"
  tagline: Give your agent access to the source code and docs of all open-source libraries
  actions:
    - theme: brand
      text: Quick Start
      link: '#Quick Start'

features:
  - title: Plug and Play
    details: Compatible with all popular coding agents and MCP clients, ready to use out of the box
  - title: One Skill, All Repos
    details: Can access all public GitHub repositories
  - title: Skill and MCP
    details: Both Skill and MCP are provided, connect with either option
  - title: Docs Integration
    details: Automatically recognizes docs repo and provides them along with the main repo when accessed
  - title: Efficient Access
    details: Provides multiple tools and parameters, responds quickly after the first indexing
  - title: 100% Free & Open Source
    details: We offer free services publicly and are open-sourced under Apache 2.0
---

## Quick Start

We offer two integration methods, choose either one:

- [Skill](#Skill): Suitable for coding agents like OpenCode, Codex, Cursor, Copilot, etc.
- [MCP](#MCP): Suitable for AI chat apps and other MCP clients

## Skill

Run the following command to install:

```bash
npx skills add https://github.com/NitroRCr/gread --skill gread
```

## MCP

Streamable HTTP URL:

```
https://api.gread.dev/mcp
```

JSON configuration reference:

```json
{
  "mcpServers": {
    "gread": {
      "type": "streamableHttp",
      "url": "https://api.gread.dev/mcp"
    }
  }
}
```

## More Information

You can view [SKILL.md](https://github.com/NitroRCr/gread/blob/main/.agents/skills/gread/SKILL.md) to understand the tools and parameters provided by Gread. Or, directly add Gread and ask your Agent for more information!

## Comparison

Understand how Gread differs from existing tools:

::: details Compare with [Deepwiki](https://deepwiki.com/) / [Zread](https://zread.ai/)

- Deepwiki / Zread can only ask AI on their websites, while Gread brings this capability to your own Agent
- Deepwiki / Zread's AI can only access the current repo and cannot access multiple repos simultaneously; Gread can access any repo at any time
- Deepwiki / Zread are closed-source, while Gread is open-source
- Deepwiki / Zread generates documentation for in-depth project understanding, while Gread does not have this functionality
:::

::: details Compare with [Zread MCP](https://zread.ai/mcp)

- Zread MCP requires purchasing a GLM Coding Plan to use and has strict usage limits; Gread is free to use
- Zread MCP is closed-source, while Gread is open-source
- Zread MCP only provides MCP, while Gread provides both Skill and MCP
:::

::: details Compare with [GitMCP](https://github.com/idosal/git-mcp)

- GitMCP uses GitHub API to read/search code, with slower response times; Gread clones the code to the server locally and uses git to read/search code, with rapid response.
- GitMCP does not provide a tool to list directory trees, while Gread does. This helps the Agent read codebases more efficiently.
- GitMCP only provides MCP, while Gread provides both Skill and MCP
:::

::: details Compare with [Sourcebot](https://github.com/sourcebot-dev/sourcebot)

- Sourcebot can only access indexed repositories; Gread can access all public repositories, "indexing" is just a cache
- Sourcebot requires self-deployment, while Gread provides out-of-the-box services
- Sourcebot provides a user interface and MCP, while Gread provides Skill and MCP
:::
