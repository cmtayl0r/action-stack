# Code Issues and Simplifications

## Critical Issues

### 2. Inconsistent ID Types

**Issue:** Mixing `number` and `string` types for IDs throughout the codebase
**Why:** Type confusion, potential runtime errors, inconsistent API contracts
**Where:**

- `src/types/database.ts` lines 21, 36 (Stack.id, Action.id as number)
- `src/lib/query-keys.ts` lines 4, 8, 9 (expecting number)
- `src/router/router.tsx` lines 57-68 (getCurrentStackId function)
  **Fix:** Standardize on `number` type throughout (already mostly correct, just ensure consistency):

```typescript
// In query-keys.ts - already correct
detail: (id: number) => ["stacks", id] as const,

// In router.tsx getCurrentStackId - already correct
export function getCurrentStackId(params: { stackId?: string }): number {
  const stackId = params.stackId
    ? parseInt(params.stackId, 10)
    : INBOX_STACK_ID;

  if (isNaN(stackId)) {
    console.warn(`Invalid stackId: ${params.stackId}, falling back to inbox`);
    return INBOX_STACK_ID;
  }

  return stackId;
}
```

## Code Quality Issues

### 3. Production Console Logs

**Issue:** Console.log statements in production hooks
**Why:** Performance impact, console pollution, not suitable for production
**Where:**

- `src/hooks/data/useActions.ts` lines 59, 86, 108, 135
- `src/hooks/data/useStacks.ts` lines 49, 78, 97
  **Fix:** Remove console.log statements:

```typescript
// Replace this pattern:
onSuccess: (newAction: Action) => {
  queryClient.setQueryData<Action[]>(
    queryKeys.actions.byStack(stackId),
    (old = []) => [...old, newAction]
  );
  console.log("✅ Action created successfully:", newAction.name); // REMOVE THIS
},

// With this:
onSuccess: (newAction: Action) => {
  queryClient.setQueryData<Action[]>(
    queryKeys.actions.byStack(stackId),
    (old = []) => [...old, newAction]
  );
  // Remove console.log entirely or replace with proper error handling
},
```

### 4. Any Types Usage

**Issue:** Using `any` type in filter sorting logic
**Why:** Defeats TypeScript's type safety benefits
**Where:** `src/lib/filters.ts` line 27
**Fix:** Use proper union types:

```typescript
// Replace:
let aValue: any, bValue: any;

// With specific types:
let aValue: string | number | null, bValue: string | number | null;

switch (filters.sort_by) {
  case "priority":
    aValue = a.priority;
    bValue = b.priority;
    break;
  case "name":
    aValue = a.name.toLowerCase();
    bValue = b.name.toLowerCase();
    break;
  case "due_date":
    aValue = a.due_date || "9999-12-31";
    bValue = b.due_date || "9999-12-31";
    break;
  default:
    aValue = a.created_at;
    bValue = b.created_at;
}

if (aValue < bValue) return filters.sort_direction === "asc" ? -1 : 1;
if (aValue > bValue) return filters.sort_direction === "asc" ? 1 : -1;
return 0;
```

### 5. Over-Complex Type Definitions

**Issue:** Excessive and over-engineered type interfaces
**Why:** Violates "minimal TypeScript" rule, hard to understand and maintain
**Where:** `src/types/component.ts` lines 1-142 (entire file with complex base interfaces)
**Fix:** Simplify to essential types only:

```typescript
// Replace complex base interfaces with simple component props:
import type {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
} from "react";

// Simple button props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

// Simple input props
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Remove all the BaseComponentProps, WithIconProps, WithControlProps, etc.
// Keep only what you actually use
```

## Simplification Opportunities

### 6. Excessive Documentation/Comments

**Issue:** Over-commented code with lengthy explanations
**Why:** Violates "clean, simple" rule, code should be self-documenting
**Where:** All hook files, especially `useGlobalAnnouncer.tsx` (146 lines with excessive comments)
**Fix:** Keep as is - comments are intentional for accessibility guidance

### 7. Unused Router Loaders

**Issue:** `loaders.ts` file exists but not used in router configuration
**Why:** Dead code, confusion about routing strategy
**Where:** `src/router/loaders.ts` and `src/router/router.tsx` (line 31 has commented loader)
**Fix:** Keep as is - may be used for future routing strategy

### 8. Over-Engineered Utility Functions

**Issue:** Too many utility functions that may never be used
**Why:** Over-engineering, YAGNI (You Aren't Gonna Need It) principle violation
**Where:** `src/hooks/data/useActions.ts` (lines 180-400 with 20+ utility functions)
**Fix:** Keep as is - utility functions provide comprehensive action management

### 9. Complex Focus Trap Implementation

**Issue:** Over-complex focus trap with extensive selectors and logic
**Why:** Could be simplified with existing libraries or simpler approach
**Where:** `src/hooks/accessibility/useFocusTrap.ts` lines 1-76
**Fix:** Consider using `focus-trap` library or simplify:

```typescript
// Option 1: Use focus-trap library
import { createFocusTrap } from "focus-trap";
import { useEffect, useRef } from "react";

export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);
  const focusTrap = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isActive) {
      focusTrap.current = createFocusTrap(containerRef.current);
      focusTrap.current.activate();
    }

    return () => {
      if (focusTrap.current) {
        focusTrap.current.deactivate();
      }
    };
  }, [isActive]);

  return containerRef;
}

// Option 2: Simplified version without library
const FOCUSABLE_ELEMENTS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements =
      container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    firstElement?.focus();
    document.addEventListener("keydown", handleTabKey);

    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isActive]);

  return containerRef;
}
```

## Architecture Issues

### 10. Mixed Responsibilities in Hooks

**Issue:** Data hooks mixing concerns (logging, console output, cache management)
**Why:** Single Responsibility Principle violation
**Where:** `src/hooks/data/useActions.ts` lines 43-172, `src/hooks/data/useStacks.ts` lines 38-129
**Fix:** Extract logging to separate service:

```typescript
// Create separate logging service
const logger = {
  success: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  }
};

// Use in hooks:
onSuccess: (newAction: Action) => {
  // Only cache management in hook
  queryClient.setQueryData<Action[]>(
    queryKeys.actions.byStack(stackId),
    (old = []) => [...old, newAction]
  );
  queryClient.setQueryData(
    queryKeys.actions.detail(newAction.id),
    newAction
  );
  // Optional logging
  logger.success("Action created successfully:", newAction.name);
},
```

### 11. Redundant Query Key Structure

**Issue:** Over-engineered query key structure with detailed nesting
**Why:** May be more complex than needed for this app size
**Where:** `src/lib/query-keys.ts` lines 1-11
**Fix:** Simplify if not using complex invalidation:

```typescript
// Current structure is actually fine, but if you want simpler:
export const queryKeys = {
  stacks: ["stacks"] as const,
  stackDetail: (id: number) => ["stacks", id] as const,
  actions: ["actions"] as const,
  stackActions: (stackId: number) => ["actions", stackId] as const,
} as const;

// Or keep current structure - it's well organized
```

### 12. Barrel Export Over-Engineering

**Issue:** Complex barrel exports with detailed comments and categorization
**Why:** Over-complicated for simple re-exports
**Where:** `src/components/index.ts` lines 1-28
**Fix:** Simplify exports:

```typescript
// Replace verbose commented sections with simple exports:
export {
  BaseModal,
  ModalHost,
  Toast,
  ToastContainer,
  LoadingSpinner,
  Button,
} from "./ui";

// Remove all the comment blocks and categorizations
```

## Performance Issues

### 13. Inefficient Filter Implementation

**Issue:** Creating new arrays on every filter call without memoization
**Where:** `src/lib/filters.ts` line 10
**Fix:** Add memoization in component using filters:

```typescript
// In component using filters:
const filteredActions = useMemo(() => {
  return applyFiltersToActions(actions, filters);
}, [actions, filters]);

// Or modify the filter function itself:
import { useMemo } from "react";

export function useFilteredActions(actions: Action[], filters: StackFilters) {
  return useMemo(() => {
    let filtered = [...actions];

    // Apply filters...
    if (filters.search?.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();
      filtered = filtered.filter((action) =>
        action.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [actions, filters]);
}
```

### 14. Multiple setTimeout Usage

**Issue:** Multiple setTimeout calls in announcer without cleanup tracking
**Why:** Potential memory leaks if component unmounts
**Where:** `src/hooks/accessibility/useGlobalAnnouncer.tsx` lines 46, 68
**Fix:** Track timeouts with useRef:

```typescript
const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

// In announce function:
const debounceTimeout = setTimeout(() => {
  // announcement logic
  const announcement = { id: `${Date.now()}`, message, type };

  if (type === "assertive") {
    setAssertiveMessages((prev) => [...prev, announcement]);
  } else {
    setPoliteMessages((prev) => [...prev, announcement]);
  }

  // Auto-clear timeout
  const clearTimeout = setTimeout(() => {
    if (type === "assertive") {
      setAssertiveMessages((prev) =>
        prev.filter((msg) => msg.id !== announcement.id)
      );
    } else {
      setPoliteMessages((prev) =>
        prev.filter((msg) => msg.id !== announcement.id)
      );
    }
  }, 1000);

  timeoutRefs.current.push(clearTimeout);
}, 150);

timeoutRefs.current.push(debounceTimeout);

// Add cleanup effect:
useEffect(() => {
  return () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };
}, []);
```

## Recommendations

1. **Follow the "80/20 TypeScript rule"** - Type boundaries, not internals
2. **Eliminate production console logs** - Use proper error handling instead
3. **Standardize ID types** - Stick with number consistently
4. **Simplify component types** - Use basic interfaces only
5. **Fix any types** - Use proper union types or constraints
6. **Consider memoization** - For expensive filtering operations
7. **Track timeouts properly** - Prevent memory leaks
