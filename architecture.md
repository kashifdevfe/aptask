# System Architecture

## Overview
APTASK uses a feature-driven, modular architecture with clear separation of concerns. The application is built as a Next.js PWA with both client and server components.

## Domain Boundaries

### 1. Auth Domain
- Authentication flows (Google, Microsoft OAuth)
- Token lifecycle management
- Account linking

### 2. Email Domain
- Email fetching and synchronization
- Inbox management
- Compose/Reply/Forward
- Labels and folders
- Search

### 3. AI Domain
- Summarization
- Reply drafting
- Priority classification
- Semantic search
- Action item extraction

### 4. UI Domain
- Layout components
- Feature-specific UI
- Accessibility
- Responsive design

## Folder Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/
│   │   ├── inbox/
│   │   └── ...
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── types.ts
│   │   ├── inbox/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── types.ts
│   │   ├── compose/
│   │   ├── ai/
│   │   └── ...
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── layout/
│   ├── hooks/
│   │   ├── use-email.ts
│   │   ├── use-ai.ts
│   │   └── ...
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── ai/
│   │   └── utils.ts
│   └── types/
│       ├── email.ts
│       ├── auth.ts
│       └── index.ts
├── docs/
├── specs/
├── agents/
├── tests/
└── ...
```

## Tech Stack Rationale

### Next.js 15
- App Router for modern routing
- Server Components for better performance
- API Routes for backend logic
- Built-in optimization

### Zustand + React Query
- Zustand for global client state
- React Query for server state management
- Caching and background synchronization

### shadcn/ui
- Radix UI primitives for accessibility
- TailwindCSS for styling
- Reusable, composable components

### AI Integration
- Claude API for advanced text generation
- OpenAI API as alternative
- Streaming responses for better UX
