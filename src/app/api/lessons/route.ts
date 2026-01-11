import { NextResponse } from "next/server";
import { getDb } from "@/lib/supabase/db";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/lessons - List all lessons
// Using Supabase Client
// ============================================

// Type for lesson with nested relations from Supabase query
interface LessonQueryResult {
  id: number;
  module_id: number;
  title: string;
  description: string | null;
  order: number;
  xp_reward: number;
  modules: { title: string } | null;
  exercises: { count: number }[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const db = await getDb();

    // Build query with explicit type
    const { data, error } = await db
      .from("lessons")
      .select(`
        id,
        module_id,
        title,
        description,
        order,
        xp_reward,
        modules:module_id(title),
        exercises:exercises(count)
      `)
      .eq("is_active", true)
      .eq(moduleId ? "module_id" : "is_active", moduleId ? parseInt(moduleId) : true)
      .order("order", { ascending: true })
      .returns<LessonQueryResult[]>();

    if (error) {
      console.error("[Lessons] Query error:", error);
      return errors.internal("Failed to fetch lessons");
    }

    const lessons = (data ?? []).map((lesson) => ({
      id: lesson.id,
      moduleId: lesson.module_id,
      moduleName: lesson.modules?.title ?? null,
      title: lesson.title,
      description: lesson.description,
      xpReward: lesson.xp_reward,
      exerciseCount: lesson.exercises?.[0]?.count ?? 0,
    }));

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("[Lessons] Error:", error);
    return errors.internal("Failed to fetch lessons");
  }
}
