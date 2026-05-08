# Gread

A skill that gives your agent access to the source code of all public github repos.

- **Plug and Play**: Compatible with all popular coding agents and MCP clients, ready to use out of the box
- **Skill and MCP**: Both Skill and MCP are provided, connect with either option
- **Docs Integration**: Automatically recognizes docs repo and provides them along with the main repo when accessed

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

You can visit our [Homepage](https://gread.dev), view [SKILL.md](.agents/skills/gread/SKILL.md), or directly add Gread and ask your Agent for more information!

## Development

Install dependencies:

```bash
bun install
```

Dev server:

```bash
bun dev
```

Dev docs:

```bash
bun docs:dev
```
