import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

// ============================================
// API AUTHENTICATION HELPER
// ============================================

export interface AuthResult {
  user: User | null;
  error: NextResponse | null;
}

/**
 * Validates that the request has a valid Supabase session.
 * Returns the user if authenticated, or an error response if not.
 *
 * Usage:
 * ```ts
 * const { user, error } = await requireAuth();
 * if (error) return error;
 * // user is guaranteed to be non-null here
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: "Unauthorized", message: "You must be logged in to access this resource" },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Internal Server Error", message: "Failed to verify authentication" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Optional auth check - returns user if logged in, null if not.
 * Does not return an error response.
 */
export async function getOptionalUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
