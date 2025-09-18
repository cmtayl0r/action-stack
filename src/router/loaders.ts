/*
  ROLE: Router loaders that populate React Query cache
  These loaders fetch data before rendering AND populate React Query cache
  for instant component access and background sync
*/

import { queryClient } from "@/lib/data/queryClient";
import { makeSupabaseAPI } from "@/lib/data/supabaseAPI";
import { queryKeys } from "@/lib/data/queryKeys";
import type { Stack, Action } from "@/types/database";

const stackAPI = makeSupabaseAPI("stacks");
const actionAPI = makeSupabaseAPI("actions");

// 📡 Helper function to ensure inbox exists and load stack data
export async function loadStackAndActions(stackId: string | number) {
  let stack: Stack;

  if (stackId === "inbox") {
    // Handle inbox by finding existing or creating new
    const allStacks = await stackAPI.getAll();
    // ✅ Populate stacks cache immediately
    queryClient.setQueryData(queryKeys.stacksAll(), allStacks);
    // Find inbox stack
    let inboxStack = allStacks.find((s) => s.is_inbox === true);

    // If inbox doesn't exist, create it (for testing - will be automatic in Part 2)
    if (!inboxStack) {
      inboxStack = await stackAPI.create({
        name: "Inbox",
        description: "Your default inbox for new tasks",
        color: "#6366f1",
        icon: "📥",
        is_inbox: true,
        is_default: true,
        is_archived: false,
        sort_order: 0,
        sort_by: "created_at",
        sort_direction: "desc",
        total_actions: 0,
        completed_actions: 0,
      });

      // Update cache with new inbox stack
      queryClient.setQueryData(queryKeys.stacksAll(), [
        ...allStacks,
        inboxStack,
      ]);
    }
    stack = inboxStack;
  } else {
    // Load the specific stack by ID
    stack = await stackAPI.getById(stackId);
  }

  if (!stack) {
    throw new Response(`Stack with ID ${stackId} not found`, { status: 404 });
  }

  // Load actions for this stack - note the column name is stack_id in database
  const actions = await actionAPI.findMany({ stack_id: stack.id });

  return { stack, actions };
}

// 1️⃣ LOAD INBOX - ensures inbox exists and returns it
export async function indexLoader() {
  try {
    // Call loadStackAndActions with 'inbox' to ensure it's created/loaded
    const { stack, actions } = await loadStackAndActions("inbox");
    return { stack, actions };
  } catch (error) {
    console.error("Error in indexLoader:", error);
    throw new Response("Failed to load inbox", { status: 500 });
  }
}

// 2️⃣ LOAD /:stackID
export async function stackLoader({ params }: { params: any }) {
  const stackId = params?.stackId;

  if (!stackId) {
    throw new Response("Stack ID is required", { status: 400 });
  }

  // Pass stackId directly. loadStackAndActions now handles "inbox" string and number conversion internally.
  return await loadStackAndActions(stackId);
}
