---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Gread"
  text: "一个 Skill，所有库"
  tagline: 让你的 Agent 能够访问所有开源库的源码和文档
  actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - title: 即插即用
    details: 兼容所有主流 coding agent 和 MCP 客户端，开箱即用
  - title: 一个 Skill，所有仓库
    details: 能够访问所有公开的 GitHub 仓库
  - title: Skill 和 MCP
    details: 同时提供 Skill 和 MCP，任选一种方式连接即可
  - title: 文档集成
    details: 会自动识别文档仓库，并在访问主仓库时一并提供
  - title: 高效访问
    details: 提供多个工具和参数，首次索引之后响应迅速
  - title: 100% 免费 & 开源
    details: 我们公开提供免费的服务，并以 Apache 2.0 开源
---

## 快速开始

我们提供了两种集成方式，任选其一：

- [Skill](#Skill): 适合 OpenCode, Codex, Cursor, Copilot 等 coding agents
- [MCP](#MCP): 适合 AI 对话应用等 MCP 客户端

## Skill

运行以下命令安装：

```bash
npx skills add https://github.com/NitroRCr/gread --skill gread
```

## MCP

Streamable HTTP URL:

```
https://api.gread.dev/mcp
```

JSON 配置参考：

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

## 更多信息

你可以查看 [SKILL.md]() 了解 Gread 提供的工具和参数。或者，直接添加 Gread 并向你的 Agent 询问更多信息！
