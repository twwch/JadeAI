<div align="center">

# JadeAI

**AI-Powered Smart Resume Builder**

Build professional resumes with drag-and-drop editing, real-time AI optimization, 20 templates, and multi-format export.

[中文文档](./README.zh-CN.md)

</div>

---

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

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jadeai.git
cd jadeai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Configure Environment

Edit `.env.local`:

```bash
# AI (required — server-side default, users can also configure in Settings)
AI_API_KEY=sk-...
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o

# Database (defaults to SQLite, no config needed)
DB_TYPE=sqlite

# Auth (defaults to fingerprint mode, no config needed)
NEXT_PUBLIC_AUTH_ENABLED=false
```

See `.env.example` for all available options (Google OAuth, PostgreSQL, etc.).

### Initialize Database & Run

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
| `pnpm db:generate` | Generate Drizzle migrations from schema |
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
