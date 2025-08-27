# Minimal TypeScript Best Practices

## 🎯 Core Philosophy

**Type the boundaries, not the internals**

Add types where they provide maximum value with minimum complexity. Focus on developer experience and maintainability over type system gymnastics.

---

## 🔥 The 80/20 Rule

### ✅ **20% Effort, 80% Value** (Always Type):
- Function parameters and return values
- Component props interfaces  
- API response shapes
- Event handlers
- Configuration objects

### ❌ **80% Effort, 20% Value** (Avoid):
- Complex generic constraints
- Utility types for edge cases
- Over-detailed internal types
- Template literal types for simple strings

---

## 📋 Quick Decision Framework

### **✅ Worth Typing**
```typescript
// Public APIs with return type interfaces
interface UseApiReturn {
  data: User[];
  loading: boolean;
  refetch: () => void;
}
export function useApi(): UseApiReturn { ... }

// Component interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

// Data shapes
type User = {
  id: string;
  name: string;
  email: string;
}

// Multi-value function returns
interface AuthResult {
  user: User | null;
  token: string;
  login: (email: string) => Promise<void>;
}
export function authenticate(): AuthResult { ... }
```

### **❌ Skip Typing**
```typescript
// Let TypeScript infer obvious types
const [count, setCount] = useState(0); // Already knows it's number
const items = [1, 2, 3]; // Already knows it's number[]
const isLoading = true; // Already knows it's boolean

// Simple single return values
function formatDate(date: Date): string { ... } // No interface needed
function calculateTotal(): number { ... } // Let TypeScript infer
```

---

## 🎯 Practical Rules

### **1. Type Public APIs Only**
- Export functions get return type interfaces when returning objects
- Internal helpers can rely on inference
- Focus on what developers interact with

### **2. Return Type Interface Decision Framework**
```typescript
// ✅ Use return type interface when:
// - Custom hooks returning objects
interface UseToggleReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}
export function useToggle(): UseToggleReturn { ... }

// - Multi-value service functions
interface LoginReturn {
  user: User;
  token: string;
  expiresAt: Date;
}
export function login(): LoginReturn { ... }

// ❌ Skip return type interface when:
// - Single value returns
export function formatCurrency(amount: number): string { ... }

// - Simple internal functions
const processItems = () => items.filter(...) // Let infer
```

### **3. Simple Types Over Complex Generics**
```typescript
// ✅ Clear and maintainable
type Status = 'loading' | 'success' | 'error';

// ❌ Over-engineered
type Status<T extends 'async' | 'sync' = 'async'> = 
  T extends 'async' ? AsyncStatus : SyncStatus;
```

### **4. Use Type Aliases for Clarity**
```typescript
// ✅ Reusable and clear
type EventHandler = (event: Event) => void;
type Status = 'loading' | 'success' | 'error';

// ❌ Repeated inline types
onClick: (event: Event) => void;
onSubmit: (event: Event) => void;
```

### **5. Interface for Objects, Type for Unions**
```typescript
// ✅ Objects get interfaces
interface User {
  id: string;
  name: string;
}

// ✅ Unions get type aliases
type Theme = 'light' | 'dark';
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### **6. Optional Properties Only When Actually Optional**
```typescript
// ✅ Required by default
interface ButtonProps {
  children: string;
  variant?: 'primary' | 'secondary'; // Actually optional
}

// ❌ Everything optional
interface ButtonProps {
  children?: string; // This will cause runtime errors
  variant?: 'primary' | 'secondary';
}
```

---

## 🚀 Common Patterns

### **Component Props**
```typescript
interface ComponentProps {
  // Required props first
  children: ReactNode;
  title: string;
  
  // Optional props after
  className?: string;
  onClick?: () => void;
}
```

### **Hook Returns**
```typescript
// ✅ Always use return type interface for custom hooks
interface UseApiReturn {
  data: ApiData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi(): UseApiReturn { ... }

// ✅ Consistent naming pattern
interface UseAuthReturn { ... }
interface UseToggleReturn { ... }
interface UseFormReturn { ... }
```

### **Service Functions**
```typescript
// ✅ Return type interface for complex returns
interface AuthServiceReturn {
  login: (credentials: LoginData) => Promise<User>;
  logout: () => void;
  refreshToken: () => Promise<string>;
}

export function createAuthService(): AuthServiceReturn { ... }

// ✅ Simple returns don't need interfaces
export function hashPassword(password: string): string { ... }
export function validateEmail(email: string): boolean { ... }
```

### **Event Handlers**
```typescript
type EventHandler<T = Event> = (event: T) => void;

interface FormProps {
  onSubmit: EventHandler<FormEvent>;
  onChange: EventHandler<ChangeEvent>;
}
```

---

## 🎯 Red Flags (Avoid These)

### **❌ Over-Generic**
```typescript
interface Props<T extends Record<string, unknown>> {
  data: T;
  render: <K extends keyof T>(item: T[K]) => ReactNode;
}
```

### **❌ Utility Type Overuse**
```typescript
type Props = Omit<Partial<Pick<User, 'name' | 'email'>>, 'id'>;
```

### **❌ Complex Conditional Types**
```typescript
type ApiResponse<T> = T extends 'user' 
  ? UserResponse 
  : T extends 'post' 
  ? PostResponse 
  : never;
```

### **❌ Unnecessary Strictness**
```typescript
// Don't type every variable
const message: string = 'Hello'; // TypeScript already knows
const items: Array<number> = [1, 2, 3]; // Use number[] instead
```

---

## 💡 Success Metrics

**You're doing TypeScript right when**:
- New team members can read and understand your types
- Types catch real bugs during development
- Refactoring is safe and confidence-inspiring
- IDE autocomplete is helpful, not overwhelming
- Compilation is fast
- Code reviews focus on logic, not type gymnastics

---

## 🔄 Review Checklist

Before adding any TypeScript, ask:
- [ ] **Is this a public API?** (If yes, consider return type interface)
- [ ] **Does this return multiple related values?** (If yes, use interface)
- [ ] **Would removing this type cause confusion or bugs?**
- [ ] **Can TypeScript already infer this accurately?**
- [ ] **Is this type simple enough to understand immediately?**
- [ ] **Will this type make refactoring easier or harder?**
- [ ] **Am I typing the boundary, not the internals?**

**If you answer "no" to most questions, skip the type.**

### **Return Type Interface Specific Check:**
- [ ] **Does this function return an object with multiple properties?**
- [ ] **Will other developers need to destructure or use this return value?**  
- [ ] **Is this a custom hook, service function, or reusable utility?**
- [ ] **Would the inferred type be long or confusing to read?**

**If you answer "yes" to most questions, add a return type interface.**

---

## 🎯 Remember

**Good TypeScript is invisible TypeScript**. It should feel like enhanced JavaScript, not a different language.

### **Core Principles:**
1. **Type the boundaries, not the internals** - Focus on what developers interact with
2. **Return type interfaces for multi-value functions** - Document complex returns clearly  
3. **Public APIs get types, private logic stays simple** - Inference is fine for internals
4. **Readability over cleverness** - Simple types that teams can maintain
5. **Help developers, don't impress them** - Useful types, not type gymnastics

### **Success Indicators:**
- New team members understand your types immediately
- Types catch real bugs during development  
- IDE autocomplete is helpful, not overwhelming
- Refactoring feels safe and confident
- Code reviews focus on logic, not type complexity

**The best type is often no type at all - but when you need one, make it count.**