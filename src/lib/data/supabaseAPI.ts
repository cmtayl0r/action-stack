import { supabase } from "@/lib/supabase/client";
import { TEST_USER_ID } from "@/types/database";

// ===============================================================
// GENERIC CRUD OPERATIONS - Work with any table
// ===============================================================

// 1️⃣ Get all records from a table with optional filters
export async function getAll<T>(
  tableName: string,
  filters?: Record<string, any>
): Promise<T[]> {
  let query = supabase.from(tableName).select("*");
  // If filters are provided, apply them to the query
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      // If value is defined and not null or empty, apply the filter
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });
  }
  // Await the query and handle errors from Supabase
  const { data, error } = await query;
  // If there's an error, log it and throw
  if (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    throw new Error(`Failed to fetch from ${tableName}: ${error.message}`);
  }
  // Return the fetched data or an empty array if none
  return data || [];
}

// 2️⃣ Get a single record by ID
export async function getById<T>(
  tableName: string,
  id: number | string,
  filters?: Record<string, any>
): Promise<T | null> {
  let query = supabase.from(tableName).select("*").eq("id", id);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });
  }
  // Use .single() to ensure only one record is returned
  const { data, error } = await query.single();
  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows returned
    }
    console.error(`Error fetching ${tableName} by ID:`, error);
    throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
  }

  return data;
}

// 3️⃣ Create a new record
export async function create<T>(
  tableName: string,
  data: Record<string, any>
): Promise<T> {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
    .select()
    .single(); // Return the created record

  if (error) {
    console.error(`Error creating in ${tableName}:`, error);
    throw new Error(`Failed to create in ${tableName}: ${error.message}`);
  }

  return result;
}

// 4️⃣ Update an existing record by ID
export async function update<T>(
  tableName: string,
  id: number | string,
  updates: Record<string, any>,
  filters?: Record<string, any>
): Promise<T> {
  let query = supabase
    .from(tableName)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });
  }
  const { data, error } = await query.select().single();
  if (error) {
    console.error(`Error updating ${tableName} by ID:`, error);
    throw new Error(`Failed to update ${tableName}: ${error.message}`);
  }
  return data;
}

// 5️⃣ Delete a record by ID
export async function remove(
  tableName: string,
  id: number | string,
  filters?: Record<string, any>
): Promise<void> {
  let query = supabase.from(tableName).delete().eq("id", id);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });
  }
  const { error } = await query;
  if (error) {
    console.error(`Error deleting from ${tableName} by ID:`, error);
    throw new Error(`Failed to delete from ${tableName}: ${error.message}`);
  }
}

// ===============================================================
// BUSINESS LOGIC LAYER - Specific operations using generic API
// ===============================================================

// 🏗️ Stack operations using generic functions
export const stacksAPI = {
  getAll: () => getAll("stacks", { user_id: TEST_USER_ID, is_archived: false }),
  getById: (id: number) => getById("stacks", id, { user_id: TEST_USER_ID }),
  create: (data: Record<string, any>) =>
    create("stacks", {
      ...data,
      user_id: TEST_USER_ID,
      is_default: false,
      is_archived: false,
      is_inbox: false,
      total_actions: 0,
      completed_actions: 0,
      sort_order: Date.now(),
    }),
  update: (id: number, updates: Record<string, any>) =>
    update("stacks", id, updates, { user_id: TEST_USER_ID }),
  remove: (id: number) => remove("stacks", id, { is_archived: true }),
};

// 📋 Action operations using generic functions
export const actionsAPI = {
  getByStackId: (stack_id: number) =>
    getAll("actions", { stack_id, user_id: TEST_USER_ID }),
  getById: (id: number) => getById("actions", id, { user_id: TEST_USER_ID }),
  create: (data: Record<string, any>) =>
    create("actions", { ...data, user_id: TEST_USER_ID, completed: false }),
  update: (id: number, updates: Record<string, any>) =>
    update("actions", id, updates, { user_id: TEST_USER_ID }),
  remove: (id: number) => remove("actions", id, { user_id: TEST_USER_ID }),
  toggleComplete: async (id: number) => {
    const action = await getById("actions", id, { user_id: TEST_USER_ID });
    if (!action) throw new Error("Action not found");
    return update(
      "actions",
      id,
      { completed: !action.completed },
      { user_id: TEST_USER_ID }
    );
  },
};

// ===============================================================
// USAGE EXAMPLE
// ===============================================================
// In your React components or hooks, you can now import and use these APIs:
// import { stacksAPI, actionAPI } from '@/lib/data/supabaseAPI';
// const stacks = await stacksAPI.getAll();
// const newAction = await actionAPI.create({ name: 'New Task', stack_id: 1, priority: 2 });

// ===============================================================
// UTILITY FUNCTIONS
// ===============================================================

// 🔍 Generic search function
export async function search<T>(
  tableName: string,
  column: string,
  query: string,
  filters?: Record<string, any>
): Promise<T[]> {
  let supabaseQuery = supabase
    .from(tableName)
    .select("*")
    .ilike(column, `%${query}%`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      supabaseQuery = supabaseQuery.eq(key, value);
    });
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error(`Error searching ${tableName}:`, error);
    throw new Error(`Failed to search ${tableName}: ${error.message}`);
  }

  return data || [];
}
