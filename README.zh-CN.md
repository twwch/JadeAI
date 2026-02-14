<div align="center">

# JadeAI

**AI 驱动的智能简历生成器**

拖拽编辑、实时 AI 优化、20 套专业模板、多格式导出，轻松打造高质量简历。

[English](./README.md)

</div>

---

## 截图展示

| 模板画廊 | 简历编辑器 |
|:---:|:---:|
| ![模板画廊](images/template-list.png) | ![简历编辑器](images/resume-edit.png) |

| AI 填充简历 | AI 图片简历解析 |
|:---:|:---:|
| ![AI 填充简历](images/AI%20填充简历.gif) | ![AI 图片简历解析](images/图片简历解析.gif) |

| AI 优化 | AI 语法检查 |
|:---:|:---:|
| ![AI 优化](images/ai%20优化.png) | ![AI 语法检查](images/AI%20语法检查.png) |

| 语法一键修复 | JD 匹配分析 |
|:---:|:---:|
| ![语法一键修复](images/AI%20语法检查一键修复.png) | ![JD 匹配分析](images/JD%20匹配分析.png) |

| 多格式导出 | 创建分享链接 |
|:---:|:---:|
| ![多格式导出](images/多项导出.png) | ![创建分享链接](images/创建分享链接.png) |

| 简历分享页 |
|:---:|
| ![简历分享页](images/简历分享页.png) |

## 功能特性

### 简历编辑

- **拖拽编辑器** — 可视化拖拽排列简历模块与条目
- **行内编辑** — 点击任意字段，直接在画布上编辑
- **20 套专业模板** — 经典、现代、极简、创意、ATS 友好、时间线等多种风格
- **主题定制** — 颜色、字体、间距、页边距实时预览调整
- **撤销 / 重做** — 完整编辑历史（最多 50 步）
- **自动保存** — 可配置保存间隔（0.3s–5s），支持手动保存

### AI 能力

- **AI 聊天助手** — 编辑器内集成对话式 AI，支持多会话和持久化历史
- **AI 一键生成简历** — 输入职位、经验、技能，自动生成完整简历
- **简历解析** — 上传已有 PDF 或图片，AI 自动提取全部内容
- **JD 匹配分析** — 对比简历与职位描述：关键词匹配、ATS 评分、改进建议
- **求职信生成** — 基于简历和 JD 的 AI 定制求职信，可选语气（正式 / 友好 / 自信）
- **语法与写作检查** — 检测弱动词、模糊描述和语法问题，返回质量评分
- **多语言翻译** — 支持 10 种语言互译，保留专业术语原文

### 导出与分享

- **多格式导出** — PDF（Puppeteer + Chromium）、DOCX、HTML、TXT、JSON
- **链接分享** — 基于 Token 的分享链接，支持密码保护
- **浏览统计** — 追踪分享简历的查看次数

### 简历管理

- **多简历仪表盘** — 网格和列表视图、搜索、排序（按日期、名称）
- **复制与重命名** — 快捷简历管理操作
- **新手引导** — 交互式分步引导，帮助新用户快速上手

### 其他

- **双语界面** — 完整的中文（zh）和英文（en）界面
- **暗色模式** — 浅色、深色、跟随系统三种主题
- **灵活认证** — Google OAuth 或浏览器指纹（零配置即用）
- **双数据库** — SQLite（默认，零配置）或 PostgreSQL

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| 拖拽 | @dnd-kit |
| 状态管理 | Zustand |
| 数据库 | Drizzle ORM (SQLite / PostgreSQL) |
| 认证 | NextAuth.js v5 + FingerprintJS |
| AI | Vercel AI SDK v6 + OpenAI / Anthropic |
| PDF | Puppeteer Core + Chromium |
| 国际化 | next-intl |
| 数据校验 | Zod v4 |

## 快速开始

### Docker 部署（推荐）

```bash
docker run -d -p 3000:3000 \
  -v jadeai-data:/app/data \
  twwch/jadeai:latest
```

打开 [http://localhost:3000](http://localhost:3000)。首次启动自动完成数据库迁移和数据初始化。

> **AI 配置：** 无需服务端 AI 环境变量。每位用户在应用内的 **设置 > AI** 中自行配置 API Key、Base URL 和模型。

<details>
<summary>使用 PostgreSQL</summary>

```bash
docker run -d -p 3000:3000 \
  -e DB_TYPE=postgresql \
  -e DATABASE_URL=postgresql://user:pass@host:5432/jadeai \
  twwch/jadeai:latest
```

</details>

<details>
<summary>使用 Google OAuth 登录</summary>

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_AUTH_ENABLED=true \
  -e AUTH_SECRET=your-secret \
  -e GOOGLE_CLIENT_ID=xxx \
  -e GOOGLE_CLIENT_SECRET=xxx \
  -v jadeai-data:/app/data \
  twwch/jadeai:latest
```

</details>

### 本地开发

#### 环境要求

- Node.js 18+
- pnpm 9+

#### 安装

```bash
git clone https://github.com/twwch/JadeAI.git
cd JadeAI

pnpm install
cp .env.example .env.local
```

#### 配置环境变量

编辑 `.env.local`：

```bash
# 数据库（默认 SQLite，无需额外配置）
DB_TYPE=sqlite

# 认证（默认指纹模式，无需额外配置）
NEXT_PUBLIC_AUTH_ENABLED=false
```

> **AI 配置：** 无需服务端环境变量。每位用户在应用内的 **设置 > AI** 中自行配置 API Key、Base URL 和模型。

查看 `.env.example` 了解所有可用选项（Google OAuth、PostgreSQL 等）。

#### 初始化数据库并启动

```bash
# 生成并执行迁移
pnpm db:generate
pnpm db:migrate

# （可选）填充示例数据
pnpm db:seed

# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（Turbopack） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm db:generate` | 生成 Drizzle 迁移文件（SQLite） |
| `pnpm db:generate:pg` | 生成 Drizzle 迁移文件（PostgreSQL） |
| `pnpm db:migrate` | 执行数据库迁移 |
| `pnpm db:studio` | 打开 Drizzle Studio（数据库 GUI） |
| `pnpm db:seed` | 填充示例数据 |

## 项目结构

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # 国际化路由 (/zh/..., /en/...)
│   │   ├── dashboard/          # 简历列表与管理
│   │   ├── editor/[id]/        # 简历编辑器
│   │   ├── preview/[id]/       # 全屏预览
│   │   ├── templates/          # 模板画廊
│   │   └── share/[token]/      # 公开分享简历查看
│   └── api/
│       ├── ai/                 # AI 接口（聊天、生成、JD 分析、求职信、语法检查、翻译）
│       ├── resume/             # 简历 CRUD、导出、解析、分享
│       └── auth/               # NextAuth 认证
├── components/
│   ├── ui/                     # shadcn/ui 基础组件
│   ├── editor/                 # 编辑器画布、区块、字段、弹窗
│   ├── ai/                     # AI 对话面板与气泡
│   ├── preview/templates/      # 20 套简历模板
│   ├── dashboard/              # 仪表盘卡片、网格、弹窗
│   └── layout/                 # 头部、主题、语言切换
├── lib/
│   ├── db/                     # Schema、仓库、迁移、适配器
│   ├── auth/                   # 认证配置
│   └── ai/                     # AI 提示词、工具、模型配置
├── hooks/                      # 自定义 React Hooks
├── stores/                     # Zustand 状态仓库（简历、编辑器、设置、UI、引导）
└── types/                      # TypeScript 类型定义
```

## 许可证

MIT
