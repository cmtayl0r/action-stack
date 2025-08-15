# Action Stack - Implementation Guidelines

## Development Workflow

### User Story Implementation Pattern

```typescript
// Always reference user story and feature IDs in code
// Example: US-001 (Instant Task Capture) → F-001.1 (Quick Action Input)

const ActionInput: React.FC<ActionInputProps> = ({ onSave, stackId }) => {
  // F-001.1: Quick capture with auto-focus and auto-save
  // F-001.2: Optimistic updates with error recovery

  const [text, setText] = useState("");
  const { announce } = useScreenReader(); // F-004.2: Screen reader support

  // Implementation continues...
};
```

### Code Comment Patterns

```typescript
// Feature ID comments for traceability
// F-002.1: Focus management implementation
const trapFocus = useCallback((container: HTMLElement) => {
  // Implementation specific to keyboard navigation requirements
});

// US-003: Cross-device sync requirement
const { mutate: createAction } = useMutation({
  // F-003.1: Real-time sync with optimistic updates
  onMutate: async (newAction) => {
    // Optimistic update logic
  },
});
```

## Database Implementation: Supabase Patterns

### Real-time Subscriptions (F-003.1)

```typescript
// Supabase real-time integration with accessibility announcements
export const useRealtimeSync = () => {
  const { announce } = useScreenReader();

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "actions" },
        (payload) => {
          // F-004.2: Announce changes to screen readers
          if (payload.eventType === "INSERT") {
            announce("New action synced from another device");
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [announce]);
};
```

### Row Level Security Setup

```sql
-- Enable RLS for secure multi-user access
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own actions
CREATE POLICY "Users can manage own actions" ON actions
  FOR ALL USING (auth.uid() = user_id);

-- Real-time subscriptions enabled
ALTER PUBLICATION supabase_realtime ADD TABLE actions;
```

### Database Schema (MVP)

```sql
-- Actions table with accessibility metadata
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  stack_id UUID REFERENCES stacks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Future-ready for Release 2 AI features
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence FLOAT DEFAULT NULL,
  original_text TEXT DEFAULT NULL,

  -- Accessibility metadata
  accessibility_notes JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Component Templates with Accessibility Built-in

### Base Button Component

```typescript
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Base accessibility
        "inline-flex items-center justify-center font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // F-007.2: Touch targets minimum 44px
        { "min-h-[44px]": size === "md" },

        // Visual styling
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="mr-2" aria-hidden="true" />}
      {children}
    </button>
  );
};
```

### Input Component with Error Handling

```typescript
// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  id,
  ...props
}) => {
  const inputId = id || `input-${useId()}`;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "block w-full px-3 py-2 border rounded-md",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "min-h-[44px]", // F-007.2: Touch accessibility
          error && "border-red-300 focus:ring-red-500"
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(helpText && helpId, error && errorId)}
        {...props}
      />

      {helpText && (
        <p id={helpId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
```

## AI Component Patterns (Release 2 Ready)

### AI Language Suggestion Component

```typescript
// Future: src/components/features/ai/AILanguageSuggestion.tsx
interface AILanguageSuggestionProps {
  originalText: string;
  onAccept: (suggestion: string) => void;
  onReject: () => void;
}

export const AILanguageSuggestion: React.FC<AILanguageSuggestionProps> = ({
  originalText,
  onAccept,
  onReject,
}) => {
  const { suggestion, loading } = useAISuggestion(originalText);
  const { announce } = useScreenReader();

  // F-008.1: AI suggestions with user control
  const handleAccept = () => {
    onAccept(suggestion);
    announce("AI suggestion accepted");
  };

  const handleReject = () => {
    onReject();
    announce("AI suggestion rejected");
  };

  if (!suggestion || loading) return null;

  return (
    <div
      role="region"
      aria-labelledby="ai-suggestion-title"
      className="ai-suggestion-container"
    >
      <h3 id="ai-suggestion-title" className="sr-only">
        AI suggestion for task improvement
      </h3>

      <div className="suggestion-content">
        <p className="original-text">Original: {originalText}</p>
        <p className="suggested-text">Suggested: {suggestion}</p>
      </div>

      <div className="suggestion-actions">
        <Button onClick={handleAccept} size="sm">
          Accept suggestion
        </Button>
        <Button onClick={handleReject} variant="secondary" size="sm">
          Keep original
        </Button>
      </div>
    </div>
  );
};
```

## API Integration with Error Handling

### React Query Patterns

```typescript
// src/hooks/data/useActions.ts
export const useActions = (stackId?: string) => {
  const { announce } = useScreenReader();

  const createAction = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from("actions")
        .insert({ text, stack_id: stackId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // F-001.2: Optimistic updates
    onMutate: async (text) => {
      const previousActions = queryClient.getQueryData(["actions", stackId]);

      // Optimistic update
      queryClient.setQueryData(["actions", stackId], (old: Action[]) => [
        { id: `temp-${Date.now()}`, text, completed: false },
        ...old,
      ]);

      return { previousActions };
    },

    onError: (error, variables, context) => {
      // Rollback optimistic update
      queryClient.setQueryData(["actions", stackId], context?.previousActions);
      announce("Failed to create action. Please try again.");
    },

    onSuccess: () => {
      announce("Action created successfully");
    },
  });

  return { createAction: createAction.mutate };
};
```

### Error Boundary Implementation

```typescript
// src/components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Action Stack Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <p>The app encountered an error. Your data is safe.</p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Implementation

### Component Testing with Accessibility

```typescript
// src/components/features/actions/ActionInput.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { ActionInput } from "./ActionInput";

expect.extend(toHaveNoViolations);

describe("ActionInput Component", () => {
  it("meets accessibility standards", async () => {
    const { container } = render(<ActionInput onSave={vi.fn()} />);

    // F-004.1: Semantic HTML structure
    const input = screen.getByLabelText("Add new action");
    expect(input).toBeInTheDocument();

    // F-002.1: Focus management
    expect(input).toHaveFocus();

    // Accessibility validation
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles keyboard navigation correctly", async () => {
    const mockOnSave = vi.fn();
    const user = userEvent.setup();

    render(<ActionInput onSave={mockOnSave} />);

    const input = screen.getByLabelText("Add new action");

    // F-002.2: Enter key submission
    await user.type(input, "New task");
    await user.keyboard("{Enter}");

    expect(mockOnSave).toHaveBeenCalledWith("New task");
  });
});
```

## Performance Guidelines

### Code Splitting Strategy

```typescript
// src/App.tsx - Lazy load non-critical components
const TodayView = lazy(() => import("./pages/TodayView"));
const AIFeatures = lazy(() => import("./components/features/ai/AIFeatures"));

// Progressive enhancement for AI features
const AIEnhancedInput = lazy(
  () =>
    import("./components/features/ai/AIEnhancedInput").catch(() => ({
      default: ActionInput,
    })) // Fallback to basic input
);
```

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
```

## Accessibility Checklist

### Development Phase

- [ ] F-004.1: Semantic HTML elements used correctly
- [ ] F-002.1: Focus management implemented
- [ ] F-004.2: ARIA live regions for dynamic content
- [ ] F-002.2: Keyboard shortcuts documented and implemented
- [ ] F-007.2: Touch targets minimum 44px

### Testing Phase

- [ ] Automated axe-core tests passing
- [ ] Manual NVDA testing completed
- [ ] Manual VoiceOver testing completed
- [ ] Keyboard-only navigation verified
- [ ] High contrast mode tested

### Deployment Checklist

- [ ] Real-time sync working across devices
- [ ] PWA manifest and service worker configured
- [ ] Performance metrics meeting targets
- [ ] Error boundaries catching and handling failures
- [ ] Accessibility compliance verified

## Deployment Architecture

### Vercel Configuration

```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=development

# Production deployment
VITE_SUPABASE_URL=production_url
VITE_SUPABASE_ANON_KEY=production_key
VITE_APP_ENV=production
```

## Content Creation Opportunities

### Blog Post Topics

- "Building Accessible React Components from Day One"
- "Real-time Sync Architecture with Supabase and React Query"
- "Mobile-First Progressive Web Apps with Bottom Sheets"
- "Screen Reader Testing: NVDA vs VoiceOver Workflows"

### Case Study Elements

- Accessibility decision framework
- Cross-device sync architecture
- Mobile-native web patterns
- Performance optimization strategies

This implementation guide ensures systematic development with accessibility excellence and professional workflow standards throughout the Action Stack MVP development.
