# APTASK - AI-First Universal Email Client

## Project Overview
APTASK is a modern, AI-first universal email client built as a mobile-ready Progressive Web App (PWA). It supports Gmail, Office 365, and IMAP accounts with a unified inbox experience, enhanced with AI-powered features.

## Core Features
- Multi-account support (Gmail, Office 365, IMAP)
- Unified inbox
- Compose, Reply, Forward
- Search with AI enhancements
- Labels and folders
- Archive/Delete
- AI summaries
- AI-generated reply drafts
- AI prioritization

## Architecture
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **State Management**: Zustand, React Query
- **Authentication**: Google OAuth, Microsoft OAuth
- **AI**: Claude API / OpenAI API
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel
- **PWA**: next-pwa

## Folder Conventions
```
/
├── src/
│   ├── app/              # Next.js App Router
│   ├── features/         # Feature-based modules
│   │   ├── auth/
│   │   ├── inbox/
│   │   ├── compose/
│   │   ├── ai/
│   │   └── ...
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions, clients
│   └── types/            # TypeScript definitions
├── docs/                 # Documentation
├── specs/                # Feature specifications
├── agents/               # Agent definitions
├── tests/                # Tests
└── ...
```

## AI Workflows
- **Smart Inbox Prioritization**: Uses AI to rank emails by importance
- **Email Summarization**: Generates concise summaries of emails/threads
- **Reply Suggestions**: Creates draft replies based on email content
- **Semantic Search**: Enables natural language email search
- **Action Item Extraction**: Identifies and tracks tasks from emails

## Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run linter

## Testing Strategy
- **Unit Tests**: Vitest
- **Integration Tests**: React Testing Library
- **E2E Tests**: Playwright

## Deployment Process
- Deployed to Vercel
- CI/CD via GitHub Actions
- Environment management for dev/staging/prod

## Agent Responsibilities
- **Architecture Agent**: System design, folder structure, scalability
- **UI/UX Agent**: Responsive design, accessibility, interactions
- **Auth & Integration Agent**: OAuth, IMAP, token management
- **AI Agent**: Summarization, drafting, search, prioritization
- **PWA Agent**: Offline support, installability, caching
- **Testing Agent**: Tests, coverage enforcement
- **DevOps Agent**: Deployment, environment management, CI/CD
