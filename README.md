<div align="center">

# JadeAI

**AI-Powered Smart Resume Builder**

Build professional resumes with drag-and-drop editing, real-time AI optimization, 20 templates, and multi-format export.

[中文文档](./README.zh-CN.md)

</div>

---

## Screenshots

| Template Gallery | Resume Editor |
|:---:|:---:|
| ![Template Gallery](images/template-list.png) | ![Resume Editor](images/resume-edit.png) |

| AI Resume Generation | AI Resume Parsing (Image) |
|:---:|:---:|
| ![AI Resume Generation](images/AI%20填充简历.gif) | ![AI Resume Parsing](images/图片简历解析.gif) |

| AI Optimization | Grammar Check |
|:---:|:---:|
| ![AI Optimization](images/ai%20优化.png) | ![Grammar Check](images/AI%20语法检查.png) |

| Grammar Auto-Fix | JD Match Analysis |
|:---:|:---:|
| ![Grammar Auto-Fix](images/AI%20语法检查一键修复.png) | ![JD Match Analysis](images/JD%20匹配分析.png) |

| Multi-Format Export | Share Link |
|:---:|:---:|
| ![Multi-Format Export](images/多项导出.png) | ![Share Link](images/创建分享链接.png) |

| Shared Resume Page |
|:---:|
| ![Shared Resume Page](images/简历分享页.png) |

## Features

### Resume Editing

- **Drag & Drop Editor** — Visually arrange and reorder resume sections and items
- **Inline Editing** — Click any field to edit directly on the canvas
- **20 Professional Templates** — Classic, Modern, Minimal, Creative, ATS-Friendly, Timeline, and more
- **Theme Customization** — Colors, fonts, spacing, and margins with live preview
- **Undo / Redo** — Full edit history (up to 50 steps)
- **Auto Save** — Configurable interval (0.3s–5s), with manual save option

### AI Capabilities

- **AI Chat Assistant** — Conversational AI integrated in the editor, with multi-session support and persistent history
- **AI Resume Generation** — Generate a complete resume from job title, experience, and skills
- **Resume Parsing** — Upload an existing PDF or image, AI extracts all content automatically
- **JD Match Analysis** — Compare resume against a job description: keyword matching, ATS score, and improvement suggestions
- **Cover Letter Generation** — AI-tailored cover letter based on resume and JD, with tone selection (formal / friendly / confident)
- **Grammar & Writing Check** — Detect weak verbs, vague descriptions, and grammar issues; returns a quality score
- **Translation** — Translate resume content across 10 languages while preserving technical terms

### Export & Sharing

- **Multi-Format Export** — PDF (Puppeteer + Chromium), DOCX, HTML, TXT, JSON
- **Link Sharing** — Token-based shareable links with optional password protection
- **View Counter** — Track how many times a shared resume has been viewed

### Management

- **Multi-Resume Dashboard** — Grid and list views, search, sort (by date, name)
- **Duplicate & Rename** — Quick resume management actions
- **Interactive Tours** — Step-by-step onboarding for first-time users

### Other

- **Bilingual UI** — Full Chinese (zh) and English (en) interface
- **Dark Mode** — Light, dark, and system theme support
- **Flexible Auth** — Google OAuth or browser fingerprint (zero-config)
- **Dual Database** — SQLite (default, zero-config) or PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Drag & Drop | @dnd-kit |
| State | Zustand |
| Database | Drizzle ORM (SQLite / PostgreSQL) |
| Auth | NextAuth.js v5 + FingerprintJS |
| AI | Vercel AI SDK v6 + OpenAI / Anthropic |
| PDF | Puppeteer Core + Chromium |
| i18n | next-intl |
| Validation | Zod v4 |

## Getting Started

### Docker (Recommended)

```bash
docker run -d -p 3000:3000 \
  -v jadeai-data:/app/data \
  twwch/jadeai:latest
```

Open [http://localhost:3000](http://localhost:3000). Database auto-migrates and seeds on first start.

> **AI Configuration:** No server-side AI env vars needed. Each user configures their own API Key, Base URL, and Model in **Settings > AI** within the app.

<details>
<summary>With PostgreSQL</summary>

```bash
docker run -d -p 3000:3000 \
  -e DB_TYPE=postgresql \
  -e DATABASE_URL=postgresql://user:pass@host:5432/jadeai \
  twwch/jadeai:latest
```

</details>

<details>
<summary>With Google OAuth</summary>

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

### Local Development

#### Prerequisites

- Node.js 18+
- pnpm 9+

#### Installation

```bash
git clone https://github.com/twwch/JadeAI.git
cd JadeAI

pnpm install
cp .env.example .env.local
```

#### Configure Environment

Edit `.env.local`:

```bash
# Database (defaults to SQLite, no config needed)
DB_TYPE=sqlite

# Auth (defaults to fingerprint mode, no config needed)
NEXT_PUBLIC_AUTH_ENABLED=false
```

> **AI Configuration:** No server-side env vars needed. Each user configures their own API Key, Base URL, and Model in **Settings > AI** within the app.

See `.env.example` for all available options (Google OAuth, PostgreSQL, etc.).

#### Initialize Database & Run

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate

# (Optional) Seed with sample data
pnpm db:seed

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | TypeScript type checking |
| `pnpm db:generate` | Generate Drizzle migrations (SQLite) |
| `pnpm db:generate:pg` | Generate Drizzle migrations (PostgreSQL) |
| `pnpm db:migrate` | Execute database migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:seed` | Seed database with sample data |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # i18n routes (/zh/..., /en/...)
│   │   ├── dashboard/          # Resume list & management
│   │   ├── editor/[id]/        # Resume editor
│   │   ├── preview/[id]/       # Full-screen preview
│   │   ├── templates/          # Template gallery
│   │   └── share/[token]/      # Public shared resume viewer
│   └── api/
│       ├── ai/                 # AI endpoints (chat, generate, JD analysis, cover letter, grammar, translate)
│       ├── resume/             # Resume CRUD, export, parse, share
│       └── auth/               # NextAuth handlers
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── editor/                 # Editor canvas, sections, fields, dialogs
│   ├── ai/                     # AI chat panel & bubble
│   ├── preview/templates/      # 20 resume templates
│   ├── dashboard/              # Dashboard cards, grid, dialogs
│   └── layout/                 # Header, theme provider, locale switcher
├── lib/
│   ├── db/                     # Schema, repositories, migrations, adapters
│   ├── auth/                   # Auth configuration
│   └── ai/                     # AI prompts, tools, model config
├── hooks/                      # Custom React hooks
├── stores/                     # Zustand stores (resume, editor, settings, UI, tour)
└── types/                      # TypeScript type definitions
```

## License

MIT
