import { createClient } from "./server";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// TYPED SUPABASE DATABASE CLIENT
// ============================================

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Get a typed Supabase client for database operations.
 * Use this instead of the raw createClient for type safety.
 */
export async function getDb(): Promise<TypedSupabaseClient> {
  return (await createClient()) as TypedSupabaseClient;
}

/**
 * Helper to handle Supabase errors consistently
 */
export function handleDbError(error: unknown, context: string): never {
  console.error(`[${context}] Database error:`, error);
  throw new Error(`Database error in ${context}`);
}
