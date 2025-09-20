// ===============================================================
// DATABASE TYPES & INTERFACES
// ===============================================================
// Centralized data types for our Stack & Actions todo app
// These match exactly with our Supabase table structure

// 🧪 Test user ID for development (replace with real auth later)
export const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";
export const INBOX_STACK_ID = 32;

// Supbabase table interfaces
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stack {
  id: number; // int8 primary key
  user_id: string; // UUID reference to auth.users
  name: string; // Stack title
  description?: string | null; // Optional stack description
  color: string; // Hex color for UI theming
  icon: string; // Emoji or icon for visual identification
  is_default: boolean; // Is this the user's default stack?
  is_inbox: boolean; // Inbox stack (special handling)
  is_archived: boolean; // Archived stacks (hidden but not deleted)
  sort_order: number; // Custom sort order for user-defined stacks
  sort_by: string; // 'priority', 'name', 'due_date', 'created_at'
  sort_direction: string; // 'asc', 'desc'
  created_at: string; // Creation timestamp
  updated_at: string; // Last updated timestamp
}

export interface Action {
  id: number; // int8 (good for simple incrementing)
  stack_id: number; // UUID reference to stacks
  user_id: string; // UUID reference to auth.users
  name: string; // Action title
  description?: string | null;
  priority: 0 | 1 | 2 | 3; // 0=none, 1=low, 2=medium, 3=high
  due_date?: string | null;
  completed: boolean; // Simple true/false (good choice!)
  tags?: string[]; // array of tag strings
  external_url?: string | null;
  created_at: string;
  updated_at: string;
}

// 🔍 Filter types for URL query params and search
export interface StackFilters {
  search?: string; // Search actions by name
  sort_by?: "priority" | "name" | "due_date" | "created_at";
  sort_direction?: "asc" | "desc";
  show_completed?: boolean; // Include completed actions
}

// 📊 Default filter values to ensure consistent behavior
export const DEFAULT_FILTERS: StackFilters = {
  search: "",
  sort_by: "created_at",
  sort_direction: "desc",
  show_completed: true,
};

// 🔄 Sort options for UI dropdowns
export const SORT_OPTIONS = [
  { value: "created_at", label: "Date Created" },
  { value: "priority", label: "Priority" },
  { value: "name", label: "Name" },
  { value: "due_date", label: "Due Date" },
] as const;
