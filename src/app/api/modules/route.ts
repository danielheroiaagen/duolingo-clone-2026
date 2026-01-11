import { NextResponse } from "next/server";
import { db } from "@/db";
import { modules, lessons, moduleProgress } from "@/db/schema";
import { eq, asc, count } from "drizzle-orm";
import { getOptionalUser } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/modules - Learning path modules
// ============================================

export async function GET() {
  try {
    const user = await getOptionalUser();

    // Get all active modules with lesson count
    const modulesWithLessons = await db
      .select({
        id: modules.id,
        title: modules.title,
        description: modules.description,
        position: modules.position,
        order: modules.order,
        lessonCount: count(lessons.id),
      })
      .from(modules)
      .leftJoin(lessons, eq(lessons.moduleId, modules.id))
      .where(eq(modules.isActive, true))
      .groupBy(modules.id)
      .orderBy(asc(modules.order));

    // If user is logged in, get their progress
    let progressMap: Record<number, { completed: number; unlocked: boolean }> = {};

    if (user) {
      // For now, first module is always unlocked
      // Others unlock when previous is completed
      modulesWithLessons.forEach((mod, index) => {
        progressMap[mod.id] = {
          completed: 0, // TODO: Calculate from userProgress
          unlocked: index === 0, // First module unlocked by default
        };
      });
    }

    const result = modulesWithLessons.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      position: mod.position as "left" | "center" | "right",
      totalLessons: mod.lessonCount,
      completedLessons: progressMap[mod.id]?.completed ?? 0,
      status: !user
        ? "locked"
        : progressMap[mod.id]?.unlocked
          ? progressMap[mod.id]?.completed === mod.lessonCount
            ? "completed"
            : "available"
          : "locked",
    }));

    return NextResponse.json({ modules: result });
  } catch (error) {
    console.error("[Modules] Error:", error);
    return errors.internal("Failed to fetch modules");
  }
}
