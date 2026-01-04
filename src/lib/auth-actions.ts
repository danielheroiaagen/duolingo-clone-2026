"use client";
import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) console.error("Auth error:", error.message);
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.reload();
}
