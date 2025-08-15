# Action Stack - Memory Bank

## 1. Project Identity & Strategic Context

- **Project:** Action Stack
- **Vision:** An accessible task management web app for overwhelmed minds, designed for instant capture and later organization.
- **Core Philosophy:** Dump thoughts now, organize when ready, complete with satisfaction.
- **User Personas:**
  - **Sarah:** Overwhelmed knowledge worker needing a quick "brain dump" solution.
  - **Marcus:** Screen reader user requiring full keyboard and assistive technology compatibility.
- **Strategic Goal:** Build a portfolio piece demonstrating Design Engineer capabilities, specializing in AI and Accessibility for the Berlin tech market.
- **Project Type:** MVP Foundation Project (Learning Phase).

## 2. Technical Stack & Architecture

- **Frontend:** React 19, TypeScript (Strict Mode), Vite, Tailwind CSS v4.
- **Backend & Database:** Supabase (PostgreSQL, Auth, Real-time).
- **State Management:** React Query for server state, React Context for UI state.
- **Architecture:** React Query + Supabase + PWA, deployed on Vercel.
- **Routing:** React Router.

## 3. Core Requirements (MVP)

- **US-001: Instant Task Capture:** Create actions in under 10 seconds.
- **US-002: Universal Keyboard Navigation:** 100% keyboard accessible.
- **US-003: Cross-Device Sync:** Real-time sync via Supabase.
- **US-004: Screen Reader Optimization:** WCAG 2.2 AA compliant.
- **US-005: Stack Organization:** Group actions into lists.
- **US-006: Action Status Management:** Mark actions as complete.
- **US-007: Mobile-Native Interface:** Responsive design with 44px+ touch targets and mobile-first patterns like bottom sheets.

## 4. Core Architectural Patterns

### Data & State Management

- **Supabase Client:** A singleton client instance is initialized in `src/lib/supabase/client.ts`.
- **Data Hooks:** All data interaction is abstracted into custom hooks (e.g., `useStacks`, `useActions`) that encapsulate React Query logic for fetching, creating, and updating.
- **Optimistic Updates:** Mutations (create, update) will use optimistic updates to provide an instantaneous UI response.
- **Real-Time Sync:** A global `useRealtimeSync` hook will listen for Supabase channel events and use `queryClient.invalidateQueries()` to trigger refetches, keeping all clients in sync.

### Accessibility

- **Focus Management:** A `useFocusTrap` hook will be used in all modal/overlay components (`Modal`, `BottomSheet`) to contain keyboard focus.
- **Screen Reader Announcements:** A `useScreenReaderAnnouncer` hook and context will provide a global `announce()` function for communicating asynchronous events (e.g., "Action saved successfully," "Connection lost") to users of assistive technology.
- **Semantic Structure:** Components will use correct HTML landmarks (`<header>`, `<main>`, `<nav>`). Lists of data will be presented in `<ul>` elements with `aria-labelledby` pointing to a visible heading.

### Component & UI Design

- **Base Components:** Foundational UI will be built from accessible base components (`Button`, `Input`, `Modal`) with defined variants and states.
- **Layout:** A responsive `AppLayout` component will manage the overall page structure, including a `Sidebar` and `Header`.
- **Mobile-First:** The UI will be designed for mobile first, then enhanced for larger screens. Mobile-specific patterns like a `BottomSheet` will be used to improve ergonomics.

### Error Handling

- **Error Boundaries:** A global `ErrorBoundary` component will wrap the main application to catch critical rendering errors and display a fallback UI.
- **Toasts:** Non-critical API errors (handled in React Query's `onError`) will trigger accessible toast notifications to inform the user without disrupting their workflow.

## 5. File Structure

```
src/
├── components/
│   ├── ui/         # Base accessible components (Button.tsx)
│   ├── features/   # Feature components (ActionList.tsx)
│   └── layout/     # App shell (AppLayout.tsx)
├── hooks/
│   ├── data/       # Data hooks (useActions.ts)
│   └── accessibility/ # a11y hooks (useFocusTrap.ts)
├── lib/
│   ├── supabase/    # Supabase client & strategies
│   └── error-handling/
├── router/
├── styles/
├── test/
└── types/
```

_This Memory Bank is the canonical source of truth for architectural decisions._
