# Action Stack - Project Context

## Project Overview

**Vision:** Accessible task management for overwhelmed minds - the first todo app designed specifically for cognitive overload with AI enhancement and universal accessibility.

**Timeline:** MVP (Release 1) → Release 2 (Enhancements, Advanced AI) → Release 3 (Future)

**Portfolio Value:** Demonstrates accessible AI Design Engineer capabilities for Berlin tech market positioning.

## Database Strategy: Supabase Foundation

**Decision:** Using Supabase for MVP learning and PostgreSQL mastery
**Rationale:**

- Foundation phase project (learning React + accessibility + basic AI)
- Real-time sync critical for overwhelm scenarios
- RLS perfect for future multi-tenancy
- Edge Functions ready for Release 2 AI integration
- Vector support available for future RAG features

**Architecture:** React Query + Supabase + Progressive Web App

## Technical Stack

### Frontend Foundation

- **React 19** + **TypeScript** (strict mode) for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for rapid styling with accessibility utilities
- **React Query v5** for server state, caching, and optimistic updates
- **React Router v6** for client-side routing

### Backend & Database

- **Supabase** (PostgreSQL + Auth + Real-time + Edge Functions)
- **Row Level Security** for data protection
- **Real-time subscriptions** for cross-device sync
- **Progressive Web App** with service worker for offline support

### AI Integration (Release 2 Ready)

- **OpenAI API** via Supabase Edge Functions (secure API key handling)
- **Conversation design** with accessibility-first patterns
- **Fallback strategies** for AI unavailability

## User Stories & Features Reference

### MVP Release 1 (Critical Priority)

- **US-001**: Instant Task Capture (F-001.1, F-001.2, F-001.3)
- **US-002**: Universal Keyboard Navigation (F-002.1, F-002.2, F-002.3)
- **US-003**: Cross-Device Sync (F-003.1, F-003.2, F-003.3)
- **US-004**: Screen Reader Optimization (F-004.1, F-004.2, F-004.3)
- **US-005**: Stack Organization (F-005.1, F-005.2, F-005.3)
- **US-006**: Action Status Management (F-006.1, F-006.2, F-006.3)
- **US-007**: Mobile-Native Interface (F-007.1, F-007.2, F-007.3)

### Intelligence Release 2 (AI Enhancement)

- **US-008**: AI Task Language Optimization
- **US-009**: Priority System
- **US-010**: Today and This Week Views
- **US-011**: Voice Input with AT Coordination
- **US-012**: Overwhelm Detection

## Architecture Decisions

### Component Structure

```
src/
├── components/
│   ├── ui/           # Base accessible components (Button, Input, Modal)
│   ├── features/     # Feature-specific (ActionInput, StackList)
│   └── layout/       # App shell and navigation
├── hooks/
│   ├── accessibility/ # Focus management, screen reader
│   ├── data/         # CRUD operations, real-time sync
│   └── mobile/       # Bottom sheets, touch gestures
├── lib/
│   ├── supabase/     # Database configuration
│   └── accessibility/ # ARIA helpers, focus utilities
```

### State Management Strategy

- **React Query**: Server state, caching, optimistic updates
- **React Context**: Accessibility preferences, theme
- **Local State**: Component-specific UI state
- **Supabase**: Real-time sync and persistence

## Accessibility Requirements

### WCAG 2.2 AA Compliance (Non-negotiable)

- **Semantic HTML**: Proper landmarks, headings, lists
- **ARIA Implementation**: Live regions, labels, descriptions
- **Keyboard Navigation**: 100% keyboard accessible, logical tab order
- **Screen Reader**: NVDA/VoiceOver optimized
- **Focus Management**: Visible indicators, no traps
- **Color Contrast**: 4.5:1 minimum for normal text

### Accessibility Testing Strategy

- **Automated**: axe-core integration with Vitest
- **Manual**: Weekly NVDA/VoiceOver testing
- **User Testing**: Marcus validation (screen reader excellence)
- **Continuous**: ESLint jsx-a11y rules in development

## Current Focus: MVP Week 1-2 Foundation

### Week 1 Priorities

1. **Accessibility Foundation**: Focus management, screen reader setup
2. **Core CRUD**: ActionInput component with optimistic updates
3. **Supabase Integration**: Real-time sync with React Query
4. **Keyboard Navigation**: Complete keyboard workflow

### Week 2 Priorities

1. **Stack Organization**: Create, rename, move actions between stacks
2. **Mobile Interface**: Bottom sheets, touch-optimized interactions
3. **PWA Setup**: Offline support, service worker
4. **Integration Testing**: Cross-device sync validation

## Learning Goals

### Technical Skills

- **React 19 Patterns**: Hooks, Context, custom hooks, performance
- **TypeScript Excellence**: Strict mode, interface design, type safety
- **Accessibility Mastery**: WCAG 2.2 AA implementation, AT testing
- **Real-time Sync**: Supabase subscriptions, conflict resolution
- **Mobile-First Design**: Progressive enhancement, responsive patterns

### Portfolio Demonstration

- **Accessibility-First Development**: Built-in, not added later
- **Systematic Methodology**: Research → Planning → Implementation
- **AI Integration Readiness**: Foundation prepared for intelligent features
- **Professional Workflow**: GitHub issues, testing, documentation

## Hazel UI Opportunities

### Component Extraction Candidates

- **AccessibleInput**: Input with ARIA labels, error handling
- **BottomSheet**: Mobile-native modal with focus trapping
- **ProgressIndicator**: WCAG-compliant progress visualization
- **StackProgress**: Task completion with accessibility metadata
- **QuickCapture**: Optimistic updates with screen reader support

### Design System Integration

- **Accessibility Tokens**: Focus indicators, touch targets, contrast ratios
- **Motion Preferences**: Reduced motion support, respectful animations
- **Semantic Patterns**: Consistent ARIA implementation across components

## Success Criteria

### MVP Completion

- [ ] Complete Sarah workflow: Dump → Organize → Complete
- [ ] 100% Marcus accessibility validation
- [ ] Cross-device sync <2 seconds
- [ ] PWA installation and offline functionality
- [ ] Professional GitHub project with systematic issues

### Quality Standards

- [ ] WCAG 2.2 AA compliance verified by automated and manual testing
- [ ] Screen reader efficiency matches or exceeds visual user efficiency
- [ ] Mobile interactions feel native (iOS/Android patterns)
- [ ] Real-time sync works seamlessly across interruptions
- [ ] Performance meets Core Web Vitals targets

## Content Creation Opportunities

### Development Blog Posts

- "Building Accessibility-First React Components"
- "Real-time Sync with Supabase and React Query"
- "Mobile-Native Web Apps: Bottom Sheets and Touch Patterns"
- "Screen Reader Testing: NVDA and VoiceOver Workflows"

### Case Study Elements

- Accessibility innovation in task management
- Cross-device sync architecture decisions
- Mobile-first progressive enhancement
- AI preparation without over-engineering

This project positions Chris as Berlin's leading accessible AI Design Engineer through systematic execution of user-centered development with accessibility excellence and AI readiness.
