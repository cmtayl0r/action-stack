import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { makeSupabaseAPI } from "@/lib/data/supabaseAPI";
import { Stack, CreateStackData } from "@/types/database";

const stacksAPI = makeSupabaseAPI("stacks");

function useStacks() {
  const queryClient = useQueryClient();

  // 📦 State for stacks, loading, and error
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 📡 Async function to load stacks
  const loadStacks = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state before loading
      const data = await stacksAPI.getAll();
      setStacks(data);
    } catch (err) {
      console.error("Failed to load stacks:", err);
      setError("Failed to load stacks");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 Load stacks on mount
  useEffect(() => {
    loadStacks();
  }, [loadStacks]);

  // 📡 Add a new stack
  const addStack = useCallback(async (stackData: Partial<Stack>) => {
    try {
      const newStack = await stacksAPI.create(stackData);
      setStacks((prev) => [newStack, ...prev]);
      return newStack;
    } catch (err) {
      console.error("Failed to add stack:", err);
      setError("Failed to add stack");
      throw err; // Re-throw to let caller handle if needed
    }
  }, []);

  // 📡 Remove a stack by ID
  const removeStack = useCallback(async (stackId: string | number) => {
    try {
      await stacksAPI.remove(stackId);
      setStacks((prev) => prev.filter((s) => s.id !== stackId));
    } catch (err) {
      console.error("Failed to remove stack:", err);
      setError("Failed to remove stack");
      throw err;
    }
  }, []);

  // 📡 Update a stack by ID
  const updateStack = useCallback(
    async (id: string | number, updates: Partial<Stack>) => {
      try {
        const updated = await stacksAPI.update(id, updates);
        setStacks((prev) => prev.map((s) => (s.id === id ? updated : s)));
      } catch (err) {
        console.error("Failed to update stack:", err);
        setError("Failed to update stack");
        throw err;
      }
    },
    []
  );

  // 📡 Get a stack by ID
  const getStackById = useCallback(async (id: string | number) => {
    try {
      return await stacksAPI.getById(id);
    } catch (err) {
      console.error("Failed to get stack by ID:", err);
      setError("Failed to get stack");
      throw err;
    }
  }, []);

  // 📡 Rename a stack
  const renameStack = useCallback(
    async (id: string | number, newName: string) => {
      return await updateStack(id, { name: newName });
    },
    [updateStack]
  );

  return {
    stacks,
    loading,
    error,
    addStack,
    removeStack,
    updateStack,
    getStackById,
    renameStack,
    reload: loadStacks,
  };
}

export default useStacks;
