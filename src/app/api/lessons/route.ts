import { NextResponse } from "next/server";
import { getDb } from "@/lib/supabase/db";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/lessons - List all lessons
// Using Supabase Client
// ============================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const db = await getDb();

    // Build query
    let query = db
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
      .order("order", { ascending: true });

    // Filter by module if specified
    if (moduleId) {
      query = query.eq("module_id", parseInt(moduleId));
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Lessons] Query error:", error);
      return errors.internal("Failed to fetch lessons");
    }

    const lessons = (data ?? []).map((lesson) => {
      // Handle nested module name
      const moduleName = Array.isArray(lesson.modules)
        ? lesson.modules[0]?.title
        : (lesson.modules as { title: string } | null)?.title ?? null;

      // Handle exercise count
      const exerciseCount = Array.isArray(lesson.exercises)
        ? lesson.exercises.length
        : (lesson.exercises as { count: number } | null)?.count ?? 0;

      return {
        id: lesson.id,
        moduleId: lesson.module_id,
        moduleName,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xp_reward,
        exerciseCount,
      };
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("[Lessons] Error:", error);
    return errors.internal("Failed to fetch lessons");
  }
}
