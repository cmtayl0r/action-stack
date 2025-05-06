/*
  ROLE: React-focused logic that manages component state, side effects, handles reactivity
  Abstract over the API layer to perform CRUD operations on stacks.
*/

import { useState, useEffect, useCallback } from "react";
import { makeStorageAPI } from "../api/localStorageAPI";

// Pass key name to the API to manipulate it in localStorage
const stackAPI = makeStorageAPI("todoApp:stacks");

function useStacks() {
  const [stacks, setStacks] = useState([]);

  // 1️⃣ Load all stacks
  const loadStacks = useCallback(async () => {
    const stacks = await stackAPI.getAll();
    setStacks(stacks);
  }, []);

  useEffect(() => {
    loadStacks();
  }, [loadStacks]);

  // 2️⃣ Add a new stack
  const addStack = useCallback(async (stackData) => {
    // Create a new stack object
    const newStack = await stackAPI.create(stackData);
    // Update the state with the new stack
    setStacks((prev) => [...prev, newStack]);
    return newStack;
  }, []);

  // 3️⃣ Remove a stack
  const removeStack = useCallback(
    async (stackId) => {
      await stackAPI.remove(stackId);
      // Update the state by filtering out the removed stack
      setStacks((prev) => prev.filter((s) => s.id !== stackId));
    },
    [setStacks]
  );

  // 4️⃣ Update a stack
  const updateStack = async (id, updates) => {
    const updated = await stackAPI.update(id, updates);
    setStacks((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  // 5️⃣ Get a stack by ID
  const getStackById = async (id) => stackAPI.getById(id);

  // 6️⃣ Rename a stack
  const renameStack = async (id, newName) => {
    const updated = await stackAPI.update(id, { name: newName });
    setStacks((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  // DEBUG: useEffect to log whenever stacks change
  useEffect(() => {
    console.log("Stacks state in hook updated:", stacks);
  }, [stacks]);

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
