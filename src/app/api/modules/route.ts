import { NextResponse } from "next/server";
import { getDb } from "@/lib/supabase/db";
import { getOptionalUser } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/modules - Learning path modules
// Using Supabase Client
// ============================================

// Type for module with nested lessons count from Supabase query
interface ModuleQueryResult {
  id: number;
  title: string;
  description: string | null;
  position: string;
  order: number;
  lessons: { count: number }[];
}

export async function GET() {
  try {
    const user = await getOptionalUser();
    const db = await getDb();

    // Get all active modules
    const { data: modulesData, error: modulesError } = await db
      .from("modules")
      .select(`
        id,
        title,
        description,
        position,
        order,
        lessons:lessons(count)
      `)
      .eq("is_active", true)
      .order("order", { ascending: true })
      .returns<ModuleQueryResult[]>();

    if (modulesError) {
      console.error("[Modules] Query error:", modulesError);
      return errors.internal("Failed to fetch modules");
    }

    // Build progress map if user is logged in
    const progressMap: Record<number, { completed: number; unlocked: boolean }> = {};

    if (user && modulesData) {
      // First module is always unlocked, others unlock when previous is completed
      modulesData.forEach((mod, index) => {
        progressMap[mod.id] = {
          completed: 0, // TODO: Calculate from user_progress
          unlocked: index === 0,
        };
      });
    }

    const result = (modulesData ?? []).map((mod) => {
      const lessonCount = mod.lessons?.[0]?.count ?? 0;

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        position: mod.position as "left" | "center" | "right",
        totalLessons: lessonCount,
        completedLessons: progressMap[mod.id]?.completed ?? 0,
        status: !user
          ? "locked"
          : progressMap[mod.id]?.unlocked
            ? progressMap[mod.id]?.completed === lessonCount
              ? "completed"
              : "available"
            : "locked",
      };
    });

    return NextResponse.json({ modules: result });
  } catch (error) {
    console.error("[Modules] Error:", error);
    return errors.internal("Failed to fetch modules");
  }
}
