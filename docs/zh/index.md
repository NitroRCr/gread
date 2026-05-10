---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Gread"
  text: "一个 Skill，所有库"
  tagline: 让你的 Agent 能够访问所有开源库的源码和文档
  actions:
    - theme: brand
      text: 快速开始
      link: '#快速开始'

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

你可以查看 [SKILL.md](https://github.com/NitroRCr/gread/blob/main/.agents/skills/gread/SKILL.md) 了解 Gread 提供的工具和参数。或者，直接添加 Gread 并向你的 Agent 询问更多信息！

## 对比

了解 Gread 与现有工具有何不同：

::: details 对比 [Deepwiki](https://deepwiki.com/) / [Zread](https://zread.ai/)

- Deepwiki / Zread 只能在他们的网站上询问 AI，而 Gread 将这种能力带给了你自己的 Agent
- Deepwiki / Zread 的 AI 只能访问当前仓库，无法同时访问多个仓库；而 Gread 可以随时访问任意仓库
- Deepwiki / Zread 是闭源的，而 Gread 是开源的
- Deepwiki / Zread 会生成用于深度理解项目的文档，而 Gread 没有这个功能
:::

::: details 对比 [Zread MCP](https://zread.ai/mcp)

- Zread MCP 需要购买 GLM Coding Plan 才能使用，且有严格的用量限制；而 Gread 可以免费使用
- Zread MCP 是闭源的，而 Gread 是开源的
- Zread MCP 仅提供 MCP，而 Gread 同时提供 Skill 和 MCP
:::

::: details 对比 [Context7](https://context7.com/)

- Context7 主要针对文档；而 Gread 主要针对源代码，同时也能够以源代码的形式访问文档
- Context7 仅开源了 MCP 服务器，其后端是私有的；而 Gread 是完全开源的
- Context7 有较为严格的用量限制和付费计划；而 Gread 完全免费
- Gread 能够访问所有公开的 GitHub 仓库；Context7 只能访问已提交的库，但支持更多来源
:::

::: details 对比 [GitMCP](https://github.com/idosal/git-mcp)

- GitMCP 使用 GitHub API 读取/搜索代码，响应较慢；而 Gread 会将代码部分克隆至服务端本地，使用 git 读取/搜索代码，响应迅速。
- GitMCP 未提供列出目录树的工具，而 Gread 提供了。这有助于 Agent 更高效地读取代码库
- GitMCP 仅提供 MCP，而 Gread 同时提供 Skill 和 MCP
:::

::: details 对比 [Sourcebot](https://github.com/sourcebot-dev/sourcebot)

- Sourcebot 只能访问已索引的仓库；而 Gread 能访问所有公开仓库，“索引” 只是一种缓存
- Sourcebot 需要自部署使用，而 Gread 提供开箱即用的服务
- Sourcebot 提供用户界面和 MCP，而 Gread 提供 Skill 和 MCP
:::

## 在线体验

想要在线体验 Gread？试试 [Nya AI](https://nyaai.cc)，它内置了 Gread，只需要在对话中启用 **“GitHub 项目”** 插件即可。
