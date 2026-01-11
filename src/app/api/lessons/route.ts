import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, exercises, modules } from "@/db/schema";
import { eq, asc, count } from "drizzle-orm";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/lessons - List all lessons
// ============================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");

    // Build query
    let query = db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        moduleName: modules.title,
        title: lessons.title,
        description: lessons.description,
        order: lessons.order,
        xpReward: lessons.xpReward,
        exerciseCount: count(exercises.id),
      })
      .from(lessons)
      .leftJoin(modules, eq(modules.id, lessons.moduleId))
      .leftJoin(exercises, eq(exercises.lessonId, lessons.id))
      .where(eq(lessons.isActive, true))
      .groupBy(lessons.id, modules.title)
      .orderBy(asc(lessons.order));

    // Filter by module if specified
    if (moduleId) {
      query = query.where(eq(lessons.moduleId, parseInt(moduleId)));
    }

    const result = await query;

    return NextResponse.json({
      lessons: result.map((lesson) => ({
        id: lesson.id,
        moduleId: lesson.moduleId,
        moduleName: lesson.moduleName,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xpReward,
        exerciseCount: lesson.exerciseCount,
      })),
    });
  } catch (error) {
    console.error("[Lessons] Error:", error);
    return errors.internal("Failed to fetch lessons");
  }
}
