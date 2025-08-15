import { useState, useEffect, useCallback } from "react";
import { makeStorageAPI } from "@/api/localStorageAPI";
import { Stack } from "@/types";

const stackAPI = makeStorageAPI("todoApp:stacks");

function useStacks() {
  const [stacks, setStacks] = useState<Stack[]>([]);

  const loadStacks = useCallback(async () => {
    const stacks = await stackAPI.getAll();
    setStacks(stacks);
  }, []);

  useEffect(() => {
    loadStacks();
  }, [loadStacks]);

  const addStack = useCallback(async (stackData: Partial<Stack>) => {
    const newStack = await stackAPI.create(stackData);
    setStacks((prev) => [...prev, newStack]);
    return newStack;
  }, []);

  const removeStack = useCallback(async (stackId: string) => {
    await stackAPI.remove(stackId);
    setStacks((prev) => prev.filter((s) => s.id !== stackId));
  }, []);

  const updateStack = async (id: string, updates: Partial<Stack>) => {
    const updated = await stackAPI.update(id, updates);
    setStacks((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const getStackById = async (id: string) => stackAPI.getById(id);

  const renameStack = async (id: string, newName: string) => {
    const updated = await stackAPI.update(id, { name: newName });
    setStacks((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  return {
    stacks,
    addStack,
    removeStack,
    updateStack,
    getStackById,
    renameStack,
    reload: loadStacks,
  };
}

export default useStacks;
