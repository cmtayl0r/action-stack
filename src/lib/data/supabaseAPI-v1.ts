import { supabase } from "@/lib/supabase/client";
import { TEST_USER_ID } from "@/types/database";

// tableName is the name of the Supabase table to operate on

export function makeSupabaseAPI(tableName: string) {
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000"; // Temporary for testing

  return {
    // 1️⃣ Get all records with optional filtering
    getAll: async (filters: any = {}) => {
      // Get all records with exact count from Supabase
      let query = supabase.from(tableName).select("*");

      // Apply app specific filters to database query
      Object.entries(filters).forEach(([key, value]) => {
        // Skip undefined, null, empty string, and non-filter values
        if (value === undefined || value === null || value === "") return;
        // Skip React Query specific keys that aren't database fields
        if (key === "sort_by" || key === "sort_direction") return;
        // Handle search across multiple fields
        if (key === "search" && typeof value === "string") {
          query = query.or(
            `name.ilike.%${value}%,description.ilike.%${value}%`
          );
          return;
        }
        // Handle all other filters as exact matches
        query = query.eq(key, value);
      });

      // Apply sorting
      const sortBy = filters.sort_by || "created_at";
      const sortDirection = filters.sort_direction === "asc";
      query = query.order(sortBy, { ascending: sortDirection });

      // Execute query, get data, error, and count from Supabase
      const { data, error } = await query;

      // If error from Supabase, throw it
      if (error) {
        console.error(`Supabase error for ${tableName}:`, error);
        throw new Error(`Failed to load ${tableName}: ${error.message}`);
      }

      return data || [];
    },

    // 2️⃣ Get a record by ID
    getById: async (id: number) => {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(`${tableName} with ID ${id} not found`);
        }
        console.error(`Error loading ${tableName} with ID ${id}:`, error);
        throw new Error(`Failed to load ${tableName}: ${error.message}`);
      }
      return data || null;
    },

    // 3️⃣ Create a new record
    create: async (data: any, defaults = {}) => {
      // Merge defaults with provided data
      const newItem = {
        ...defaults, // Default values for new items
        ...data, // User-provided data
        user_id: TEST_USER_ID, // Temporary - will be replaced
      };

      // Insert new record into Supabase
      const { data: created, error } = await supabase
        .from(tableName)
        .insert(newItem)
        .select()
        .single();
      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
      }
      return created;
    },

    // 4️⃣ Update a record by ID
    update: async (id: string | number, updates: any) => {
      const { data: updated, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() }) // Always update timestamp
        .eq("id", id) // Match by ID
        .select()
        .single();
      if (error) {
        console.error(`Error updating ${tableName} with ID ${id}:`, error);
        throw error;
      }
      return updated;
    },

    // 5️⃣ Delete a record by ID
    remove: async (id: number) => {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) {
        console.error(`Error deleting ${tableName} with ID ${id}:`, error);
        throw new Error(`Failed to delete ${tableName}: ${error.message}`);
      }
      return true;
    },
  };
}
