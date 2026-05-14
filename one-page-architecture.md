# APTASK - One-Page Architecture

## Overview
AI-first universal email client built as a mobile-ready PWA with multi-agent workflow orchestration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Landing    │  │    Inbox     │  │   Compose    │ │
│  │    Page      │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    State Management                      │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Zustand Stores  │  │   React Query (future)   │   │
│  │  - Auth Store    │  │   - Email Sync           │   │
│  │  - Inbox Store   │  │   - Account Management   │   │
│  └──────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      Features Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │   Auth   │  │  Inbox   │  │ Compose  │  │  AI  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Integrations Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │  Gmail   │  │  Office  │  │   IMAP   │  │  AI  │ │
│  │   API    │  │  365     │  │  (Yahoo, │  │ API  │ │
│  │          │  │   API    │  │   AOL)   │  │      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, shadcn/ui
- **State**: Zustand (client state), React Query (server state - future)
- **AI**: Claude API / OpenAI API (future)
- **Auth**: Google OAuth, Microsoft OAuth (future)
- **Database**: Supabase / PostgreSQL (future)
- **PWA**: next-pwa (future)
- **Testing**: Vitest, Playwright (future)
- **Deployment**: Vercel

## Domain Boundaries
1. **Auth**: Authentication, account management, token lifecycle
2. **Inbox**: Email listing, detail view, search, labels
3. **Compose**: Email composition, reply/forward
4. **AI**: Summarization, reply drafting, prioritization

## Key Design Decisions
- Feature-based architecture for clean separation
- Mobile-first responsive design
- Zustand for simple, scalable state management
- shadcn/ui for accessible, production-ready components
