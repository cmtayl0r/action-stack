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
  total_actions: number; // Count of all actions in this stack
  completed_actions: number; // Count of completed actions (stats)
  created_at: string; // Creation timestamp
  updated_at: string; // Last updated timestamp
}

export interface Action {
  id: number; // You chose int8 (good for simple incrementing)
  stack_id: number; // UUID reference to stacks
  user_id: string; // UUID reference to auth.users
  name: string; // Action title
  description?: string | null;
  priority: 0 | 1 | 2 | 3; // 0-3 priority levels
  due_date?: string | null;
  completed: boolean; // Simple true/false (good choice!)
  tags?: string[]; // array of tag strings
  external_url?: string | null;
  created_at: string;
  updated_at: string;
}

// React Query specific types
export interface CreateStackData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_inbox?: boolean;
  is_archived?: boolean;
  sort_order?: number;
  sort_by?: string;
  sort_direction?: string;
}

export interface CreateActionData {
  name: string;
  stack_id: number;
  priority?: 0 | 1 | 2 | 3;
  description?: string;
  due_date?: string;
  tags?: string[];
  external_url?: string;
}
