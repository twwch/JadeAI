# JadeAI

[English](./README.md)

AI 驱动的智能简历生成器，支持拖拽编辑、实时 AI 优化和 PDF 导出。

![JadeAI Demo](./images/demo.png)

## 功能特性

- **拖拽编辑器** — 可视化拖拽构建简历，自由排序各模块
- **AI 助手** — 基于对话的 AI 实时改写、优化简历内容并提供改进建议
- **PDF 导出** — 高保真 PDF 生成，内置多套模板（经典、现代、极简）
- **多简历管理** — 创建、复制、切换多份简历
- **国际化** — 完整的中英文界面支持
- **灵活认证** — 可插拔认证方案：Google OAuth 或浏览器指纹 fallback
- **双数据库** — 同时支持 SQLite（默认，零配置）和 PostgreSQL

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| 拖拽 | dnd-kit |
| 状态管理 | Zustand |
| 数据库 | Drizzle ORM (SQLite / PostgreSQL) |
| 认证 | NextAuth.js v5 + FingerprintJS |
| AI | Vercel AI SDK v6 + OpenAI / Anthropic |
| PDF | @react-pdf/renderer |
| 国际化 | next-intl |
| 数据校验 | Zod |

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 9+

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/jadeai.git
cd jadeai

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
```

### 配置环境变量

编辑 `.env.local`：

```bash
# AI（必填）
AI_API_KEY=sk-...
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o

# 数据库（默认 SQLite，无需额外配置）
DB_TYPE=sqlite

# 认证（默认指纹模式，无需额外配置）
NEXT_PUBLIC_AUTH_ENABLED=false
```

### 初始化数据库并启动

```bash
# 生成并执行迁移
pnpm db:generate
pnpm db:migrate

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
| `pnpm type-check` | 运行 TypeScript 类型检查 |
| `pnpm db:generate` | 从 schema 生成 Drizzle 迁移文件 |
| `pnpm db:migrate` | 执行数据库迁移 |
| `pnpm db:studio` | 打开 Drizzle Studio（数据库 GUI） |
| `pnpm db:seed` | 填充示例数据 |

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # 国际化路由 (/zh/..., /en/...)
│   │   ├── dashboard/      # 简历列表
│   │   ├── editor/[id]/    # 简历编辑器
│   │   └── preview/[id]/   # 简历预览
│   └── api/                # API 路由
│       ├── ai/chat/        # AI 对话（流式）
│       ├── resume/         # 简历 CRUD
│       └── auth/           # 认证
├── components/
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── editor/             # 拖拽编辑器
│   ├── ai/                 # AI 对话面板
│   ├── preview/            # 简历预览与模板
│   └── dashboard/          # 仪表盘组件
├── lib/
│   ├── db/                 # 数据库层（schema、仓库、适配器）
│   ├── auth/               # 认证配置
│   ├── ai/                 # AI 提示词、工具、工具函数
│   └── pdf/                # PDF 生成
├── hooks/                  # 自定义 React Hooks
├── stores/                 # Zustand 状态仓库
└── types/                  # TypeScript 类型定义
```

## 许可证

MIT
