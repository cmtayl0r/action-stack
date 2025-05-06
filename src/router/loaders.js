/*
  ROLE: Loader functions for the router
  These functions are responsible for fetching data before rendering the component
  Their primary role is to preload data before a page renders
  They use API directly (pre-render data), we don't use hooks here
*/

// Utilities for Local Storage API
import { makeStorageAPI } from "../api/localStorageAPI";
const stackAPI = makeStorageAPI("todoApp:stacks");
const actionAPI = makeStorageAPI("todoApp:actions");

// Helper function
export async function loadStackAndActions(stackId) {
  const stacks = await stackAPI.getAll();
  const hasInbox = stacks.some((s) => s.id === "inbox");

  if (!hasInbox) {
    await stackAPI.create({ name: "Inbox" }, { id: "inbox" });
  }

  const stack = await stackAPI.getById(stackId);
  const actions = await actionAPI.findMany((a) => a.stackId === stackId);

  return { stack, actions };
}

// 1️⃣ LOAD INBOX
export async function indexLoader() {
  return await loadStackAndActions("inbox");
}

// 2️⃣ LOAD /:stackID
export async function stackLoader({ params }) {
  const stackId = params?.stackId || "inbox";
  return await loadStackAndActions(stackId);
}
