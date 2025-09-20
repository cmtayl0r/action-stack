/*
  ROLE: Router loaders
  These loaders are minimal - they just validate params and redirect as needed.
  Data fetching is handled in components via React Query hooks.
  This keeps routing simple and lets React Query manage caching and state.
  It also avoids complex loader logic and potential stale data issues.
*/

import { redirect } from "react-router-dom";
import { makeSupabaseAPI } from "@/lib/data/supabaseAPI";

const stackAPI = makeSupabaseAPI("stacks");

// 1️⃣ INDEX LOADER - Just redirect to inbox
// Let the component handle data fetching via React Query
export async function indexLoader() {
  throw redirect("/stack/inbox");
}

// 2️⃣ STACK LOADER - Just validate stack exists
// React Query in component handles actual data fetching
export async function stackLoader({ params }: { params: any }) {
  const stackId = params?.stackId;

  if (!stackId) {
    throw new Response("Stack ID is required", { status: 400 });
  }

  // Special case: inbox is always valid
  if (stackId === "inbox") {
    return { stackId: "inbox" };
  }

  // For numbered stacks, just validate it's a number
  const stackIdNum = parseInt(stackId, 10);
  if (isNaN(stackIdNum)) {
    throw new Response("Invalid stack ID", { status: 400 });
  }

  // Don't fetch data here - let React Query handle it
  // Just return the validated ID
  return { stackId: stackIdNum };
}
