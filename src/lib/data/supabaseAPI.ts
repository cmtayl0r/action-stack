import { supabase } from "@/lib/supabase/client";

export function makeSupabaseAPI(tableName: string) {
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000"; // Temporary for testing

  return {
    // 1️⃣ Get all records
    getAll: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(`Error loading ${tableName}:`, error);
        throw error;
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
      const newItem = {
        ...defaults, // Default values for new items
        ...data, // User-provided data
        user_id: TEST_USER_ID, // Temporary - will be replaced
      };

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
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
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

    // 6️⃣ Find many with filters
    findMany: async (filters: Record<string, any> = {}) => {
      let query = supabase.from(tableName).select("*");

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) {
        console.error(`Error finding ${tableName}:`, error);
        throw new Error(`Failed to find ${tableName}: ${error.message}`);
      }
      return data || [];
    },

    // 7️⃣ Remove many with filters
    removeMany: async (filters: Record<string, any> = {}) => {
      let query = supabase.from(tableName).delete();

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query;
      if (error) {
        console.error(`Error bulk deleting ${tableName}:`, error);
        throw new Error(`Failed to delete ${tableName}: ${error.message}`);
      }
      return true;
    },
  };
}
