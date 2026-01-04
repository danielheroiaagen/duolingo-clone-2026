"use server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "./supabase/server";

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const existingUser = await db.query.users.findFirst({ where: eq(users.supabaseId, user.id) });
  if (existingUser) return existingUser;
  const [newUser] = await db.insert(users).values({
    supabaseId: user.id, email: user.email!, displayName: user.user_metadata.full_name || user.email?.split('@')[0],
    avatarUrl: user.user_metadata.avatar_url, hearts: 5, xp: 0, streak: 0,
  }).returning();
  return newUser;
}

export async function getUserStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return await db.query.users.findFirst({ where: eq(users.supabaseId, user.id) });
}

export async function updateStats(xpGain: number, heartsChange: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const currentStats = await getUserStats();
  if (!currentStats) return;
  await db.update(users).set({ xp: (currentStats.xp || 0) + xpGain, hearts: Math.max(0, Math.min(5, (currentStats.hearts || 0) + heartsChange)) }).where(eq(users.supabaseId, user.id));
}
