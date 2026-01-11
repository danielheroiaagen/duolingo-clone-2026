import { createClient } from "./server";

// ============================================
// SUPABASE DATABASE CLIENT
// ============================================

/**
 * Get a Supabase client for database operations.
 * Use .returns<T>() for type-safe reads where needed.
 */
export async function getDb() {
  return await createClient();
}

/**
 * Helper to handle Supabase errors consistently
 */
export function handleDbError(error: unknown, context: string): never {
  console.error(`[${context}] Database error:`, error);
  throw new Error(`Database error in ${context}`);
}
