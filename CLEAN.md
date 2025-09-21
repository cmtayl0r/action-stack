# Data Architecture Clean-Up Issues

## ✅ Completed Issues

### 1. ✅ Type Mismatches & Context Refactoring - COMPLETED

**What was done:**

- ✅ Moved app types from `src/context/app/types.ts` to centralized `src/types/app.ts`
- ✅ Removed unused `currentStackId` from app state (using URL-based navigation instead)
- ✅ Fixed imports in `src/context/app/reducer.ts` to use `@/types/app`
- ✅ Cleaned up dead code (SET_CURRENT_STACK_ID actions)

**Impact:** Eliminated runtime type errors, centralized type management, removed duplicate state

### 2. ✅ Type Safety Improvements - COMPLETED

**What was done:**

- ✅ Added `CreateStackData`, `UpdateStackData`, `CreateActionData` interfaces in `src/types/database.ts`
- ✅ Updated `src/lib/data/supabaseAPI.ts` to use proper typed interfaces
- ✅ Extracted `applyFilters()` utility function to eliminate code duplication
- ✅ Fixed function signatures to use specific types instead of `Record<string, any>`

**Impact:** Better type safety, IDE support, compile-time error catching

### 3. ✅ Query Key Centralization - COMPLETED

**What was done:**

- ✅ Created centralized query keys in `src/lib/query-keys.ts`
- ✅ Updated `src/hooks/data/useStacks.ts` to use centralized query keys

**Impact:** Consistent cache management, easier invalidation patterns

## 🔧 Questions & Remaining Issues

### 1. ✅ Type Safety - COMPLETED & IMPROVED

**Your question:** "I dont understand how 'UpdateData' is for filters?"

**Response:** You're right! The generic `UpdateData` interface wasn't needed for filters. You solved this better by:

- ✅ Creating specific `UpdateStackData` interface in `database.ts`
- ✅ Using `Partial<CreateActionData>` for action updates (even better approach)

**Current status:** ✅ COMPLETED - Your implementation is cleaner than the original suggestion.

### 2. ✅ Update Types - COMPLETED & OPTIMIZED

**Your questions:**

- ✅ **"Can this not be dealt with in database.ts?"** - Yes, and you did exactly that! Much better centralized approach.
- ✅ **"Can CreateActionData be used instead?"** - Excellent insight! For actions, you can use `Partial<CreateActionData>` for updates.

**Current status:** ✅ COMPLETED - `UpdateStackData` is now properly defined in `database.ts` and imported correctly.

**Optional optimization for actions:**

```typescript
// In useActions.ts, you could use:
updateAction: (id: number, updates: Partial<CreateActionData>) =>
// Instead of creating a separate UpdateActionData interface
```

### 3. ✅ Dynamic Inbox Stack Solution - ALREADY SOLVED!

**Your questions:** "Id like to figure a dynamic solution to this" → **"can i just not have a simple function that detects if is_inbox is true?"**

**✅ You already have the perfect solution!** In `src/hooks/data/useStacks.ts`:

```typescript
// 🏠 Find inbox stack from the stacks list
export function findInboxStack(stacks: Stack[]): Stack | undefined {
  return stacks.find((stack) => stack.is_inbox);
}
```

**Usage in components:**

```typescript
const { stacks } = useStacks();
const inboxStack = findInboxStack(stacks);
const inboxStackId = inboxStack?.id ?? INBOX_STACK_ID; // fallback to hardcoded if needed
```

**Why this is better than my complex database suggestion:**

- ✅ **Simple pure function** - no database calls needed
- ✅ **Uses existing data** - stacks you already fetch
- ✅ **No extra queries** - more efficient
- ✅ **Already implemented** - working now!
- ✅ **Easy to test** - pure function
- ✅ **Fallback ready** - can use hardcoded constant as backup

**Status:** ✅ SOLVED - Your simple approach is superior to the complex one I suggested

### 4. 🤔 Functional API Abstraction (No Classes)

**Your question:** "I dont want Class functions, can this be done without?"

**Yes! Functional repository pattern:**

```typescript
// src/lib/data/createRepository.ts
export function createRepository<T extends { id: number; user_id: string }>(
  tableName: string,
  defaultFilters: Record<string, any> = {}
) {
  const applyFilters = (query: any, filters?: Partial<T>) => {
    const allFilters = { ...defaultFilters, ...filters };
    Object.entries(allFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });
    return query;
  };

  return {
    async getAll(filters?: Partial<T>): Promise<T[]> {
      let query = supabase.from(tableName).select("*");
      query = applyFilters(query, filters);

      const { data, error } = await query;
      if (error)
        throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
      return data || [];
    },

    async getById(id: number, filters?: Partial<T>): Promise<T | null> {
      let query = supabase.from(tableName).select("*").eq("id", id);
      query = applyFilters(query, filters);

      const { data, error } = await query.single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
      }
      return data;
    },

    async create(
      data: Omit<T, "id" | "created_at" | "updated_at">
    ): Promise<T> {
      const createData = { ...data, ...defaultFilters };
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([createData])
        .select()
        .single();

      if (error)
        throw new Error(`Failed to create ${tableName}: ${error.message}`);
      return result;
    },

    async update(id: number, updates: Partial<T>): Promise<T> {
      let query = supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      query = applyFilters(query, defaultFilters);

      const { data, error } = await query.select().single();
      if (error)
        throw new Error(`Failed to update ${tableName}: ${error.message}`);
      return data;
    },

    async remove(id: number): Promise<void> {
      let query = supabase.from(tableName).delete().eq("id", id);
      query = applyFilters(query, defaultFilters);

      const { error } = await query;
      if (error)
        throw new Error(`Failed to delete ${tableName}: ${error.message}`);
    },
  };
}

// Usage:
export const stacksRepo = createRepository<Stack>("stacks", {
  user_id: TEST_USER_ID,
  is_archived: false,
});

export const actionsRepo = createRepository<Action>("actions", {
  user_id: TEST_USER_ID,
});
```

**Benefits of functional approach:**

- ✅ No classes, pure functions
- ✅ Composable and flexible
- ✅ Default filters baked in
- ✅ Still type-safe

**Status:** OPTIONAL - Current implementation works fine, this is just cleaner

### 5. ⏳ Input Validation - DEFERRED

**Your note:** "I will do this later"

**Status:** ✅ ACKNOWLEDGED - This is a good future enhancement for production

**When you're ready, consider:**

- Form-level validation with React Hook Form + Zod
- API boundary validation for security
- User-friendly error messages

**Priority:** Low - Current type safety provides good protection

## ✅ Remaining Tasks & Status

### 1. ⏳ Minor Cleanup Tasks

**Still need to fix:**

```bash
# Fix filename typo:
mv src/hooks/data/useUrlFIlters.ts src/hooks/data/useUrlFilters.ts
```

**Status:** Quick 2-minute fix when convenient

### 2. ✅ Type Centralization - COMPLETED

**What you accomplished:**

- ✅ Moved types from `src/context/app/types.ts` to `src/types/app.ts`
- ✅ Removed dead `SET_CURRENT_STACK_ID` code
- ✅ Using superior URL-based stack navigation with `getCurrentStackId()`

**Impact:** Cleaner architecture, better URL-first navigation

### 3. ✅ Boolean Naming - GOOD AS-IS

**Current approach is correct:**

- ✅ Database fields use `is_` (matches SQL conventions)
- ✅ Component props use `isX` (matches React conventions)

**Status:** No changes needed - you're following best practices

## 🎯 Immediate Action Items

1. **Fix filename typo** - 2-minute task: `useUrlFIlters.ts` → `useUrlFilters.ts`
2. **Consider dynamic inbox detection** - Production enhancement
3. **Evaluate functional repository pattern** - Optional cleaner architecture

## 📊 Priority Matrix

**High Impact, Low Effort:**

- Fix filename typo
- Dynamic inbox stack lookup (good for production)

**High Impact, High Effort:**

- Functional repository pattern (optional architectural improvement)
- Input validation with Zod (when you're ready)

**Low Impact, Low Effort:**

- Minor naming optimizations (already excellent)

## 🏷️ Naming Convention Analysis & Best Practice Recommendations

### ✅ What's Already Good

**Component Names**: All follow PascalCase consistently

- `Button`, `LoadingSpinner`, `ActionListItem`, `AppLayout` ✓

**Hook Names**: All follow `use` + PascalCase pattern

- `useActions`, `useStacks`, `useUrlFilters`, `useAppContext` ✓

**Type/Interface Names**: All follow PascalCase consistently

- `ButtonProps`, `StackFilters`, `AppState`, `ToastAction` ✓

**Constants**: All follow UPPER_SNAKE_CASE consistently

- `TEST_USER_ID`, `INBOX_STACK_ID`, `DEFAULT_FILTERS` ✓

**Function Names**: All follow camelCase consistently

- `getCurrentStackId`, `getFilterSummary`, `applyFiltersToActions` ✓

**Event Handlers**: Follow `handle` + action pattern consistently

- `handleSubmit`, `handleSearchChange`, `handleClick` ✓

### 🔧 Recommended Improvements

**1. File Naming Inconsistencies**

```bash
# Fix the typo (already identified):
mv src/hooks/data/useUrlFIlters.ts src/hooks/data/useUrlFilters.ts

# Fix kebab-case inconsistency:
mv src/components/features/actions/EditAction-foundation.tsx src/components/features/actions/EditActionFoundation.tsx
```

**2. Component Props Interface Naming Optimization**

```typescript
// Current (verbose):
interface ActionListItemProps { ... }
interface ActionsFilterProps { ... }

// Better (more concise while staying clear):
interface ActionItemProps { ... }
interface ActionFilterProps { ... }

// Keep these as they are (already optimal):
interface ButtonProps { ... }
interface StackFilters { ... }
```

**3. Boolean Property Consistency**

```typescript
// Current mix of approaches - standardize on 'is' prefix for UI state:
// ✅ Keep database fields as-is (matches SQL conventions):
interface Stack {
  is_default: boolean; // Keep - matches database
  is_inbox: boolean; // Keep - matches database
  is_archived: boolean; // Keep - matches database
}

// ✅ UI/Component boolean props - use 'is' prefix consistently:
interface ButtonProps {
  isFullWidth: boolean; // ✅ Good
  isIconOnly: boolean; // ✅ Good
  isPending: boolean; // ✅ Good (from React Aria)
}

// 🔧 For local component state, consider 'is' prefix:
const [isEditing, setIsEditing] = useState(false); // ✅ Already good
```

**4. API Layer Naming Standardization**

```typescript
// Current (acceptable but could be more consistent):
export const stacksAPI = { ... }
export const actionsAPI = { ... }

// Alternative (slightly more modern, but current is fine):
export const stacksApi = { ... }
export const actionsApi = { ... }

// Keep generic CRUD names in base layer:
function getAll() // ✅ Good - generic and reusable
function create() // ✅ Good - generic and reusable
function remove() // ✅ Good - generic and reusable
```

**5. Component Import/Export Consistency**

```typescript
// ✅ Excellent pattern already in use:
export default Button;
export type { ButtonProps };

// ✅ Default exports for components:
import Button from "@/components/ui/button/Button";

// ✅ Named exports for utilities:
import { getCurrentStackId, getStackUrl } from "@/router/router";
```

### 📏 Current Naming Convention Standards Summary

**Your app follows excellent naming conventions overall:**

| Category         | Convention     | Example             | Status       |
| ---------------- | -------------- | ------------------- | ------------ |
| Components       | PascalCase     | `ActionListItem`    | ✅ Excellent |
| Component Props  | ComponentProps | `ButtonProps`       | ✅ Excellent |
| Hooks            | useCamelCase   | `useActions`        | ✅ Excellent |
| Types/Interfaces | PascalCase     | `StackFilters`      | ✅ Excellent |
| Functions        | camelCase      | `getCurrentStackId` | ✅ Excellent |
| Constants        | UPPER_SNAKE    | `INBOX_STACK_ID`    | ✅ Excellent |
| Event Handlers   | handleAction   | `handleSubmit`      | ✅ Excellent |
| Boolean Props    | isCondition    | `isFullWidth`       | ✅ Excellent |
| Files            | PascalCase.tsx | `Button.tsx`        | ✅ Excellent |

### 🎯 Priority Actions

**High Impact, Low Effort:**

1. Fix `useUrlFIlters.ts` filename typo
2. Rename `EditAction-foundation.tsx` to `EditActionFoundation.tsx`

**Optional Improvements (Low Priority):**

1. Shorten some verbose prop interface names (`ActionListItemProps` → `ActionItemProps`)
2. Consider `stacksApi` vs `stacksAPI` for consistency (both acceptable)

**Overall Assessment: 🟢 Excellent naming conventions with minimal cleanup needed.**
