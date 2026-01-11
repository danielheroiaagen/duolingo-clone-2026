"use server";

import { getDb } from "@/lib/supabase/db";
import { createClient } from "./supabase/server";

// ============================================
// USER ACTIONS - Server Actions
// Using Supabase Client
// ============================================

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const db = await getDb();

  // Check if user exists
  const { data: existingUser } = await db
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .single();

  if (existingUser) return existingUser;

  // Create new user
  const { data: newUser, error } = await db
    .from("users")
    .insert({
      supabase_id: user.id,
      email: user.email!,
      display_name: user.user_metadata.full_name || user.email?.split("@")[0],
      avatar_url: user.user_metadata.avatar_url,
      hearts: 5,
      xp: 0,
      streak: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[syncUser] Error creating user:", error);
    return null;
  }

  return newUser;
}

export async function getUserStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const db = await getDb();

  const { data } = await db
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .single();

  return data;
}

export async function updateStats(xpGain: number, heartsChange: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  const currentStats = await getUserStats();
  if (!currentStats) return;

  const db = await getDb();

  await db
    .from("users")
    .update({
      xp: (currentStats.xp || 0) + xpGain,
      hearts: Math.max(0, Math.min(5, (currentStats.hearts || 0) + heartsChange)),
      updated_at: new Date().toISOString(),
    })
    .eq("supabase_id", user.id);
}
