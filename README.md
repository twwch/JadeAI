# JadeAI

[中文文档](./README.zh-CN.md)

AI-powered resume builder with drag-and-drop editing, real-time AI optimization, and PDF export.

![JadeAI Demo](./images/demo.png)

## Features

- **Drag & Drop Editor** — Visually build your resume by dragging and reordering sections
- **AI Assistant** — Chat-based AI that rewrites, optimizes, and suggests improvements to your resume content in real time
- **PDF Export** — High-fidelity PDF generation with multiple templates (Classic, Modern, Minimal)
- **Multi-Resume Management** — Create, duplicate, and switch between multiple resumes
- **Internationalization** — Full Chinese and English UI support
- **Flexible Auth** — Pluggable authentication: Google OAuth or browser fingerprint fallback
- **Dual Database** — Supports both SQLite (default, zero-config) and PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Drag & Drop | dnd-kit |
| State | Zustand |
| Database | Drizzle ORM (SQLite / PostgreSQL) |
| Auth | NextAuth.js v5 + FingerprintJS |
| AI | Vercel AI SDK v6 + OpenAI / Anthropic |
| PDF | @react-pdf/renderer |
| i18n | next-intl |
| Validation | Zod |

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

Edit `.env.local` with your settings:

```bash
# AI (required)
AI_API_KEY=sk-...
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o

# Database (defaults to SQLite, no config needed)
DB_TYPE=sqlite

# Auth (defaults to fingerprint mode, no config needed)
NEXT_PUBLIC_AUTH_ENABLED=false
```

### Initialize Database & Run

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate

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
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm db:generate` | Generate Drizzle migrations from schema |
| `pnpm db:migrate` | Execute database migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:seed` | Seed database with sample data |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n routes (/zh/..., /en/...)
│   │   ├── dashboard/      # Resume list
│   │   ├── editor/[id]/    # Resume editor
│   │   └── preview/[id]/   # Resume preview
│   └── api/                # API routes
│       ├── ai/chat/        # AI chat (streaming)
│       ├── resume/         # Resume CRUD
│       └── auth/           # Authentication
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── editor/             # Drag-and-drop editor
│   ├── ai/                 # AI chat panel
│   ├── preview/            # Resume preview & templates
│   └── dashboard/          # Dashboard components
├── lib/
│   ├── db/                 # Database layer (schema, repositories, adapters)
│   ├── auth/               # Auth configuration
│   ├── ai/                 # AI prompts, tools, utilities
│   └── pdf/                # PDF generation
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

## License

MIT
