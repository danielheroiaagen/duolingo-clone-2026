import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, exercises } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/lessons/[id] - Get lesson with exercises
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require auth to access exercises
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return errors.badRequest("Invalid lesson ID");
    }

    // Get lesson
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return errors.notFound("Lesson not found");
    }

    // Get exercises for this lesson
    const lessonExercises = await db
      .select({
        id: exercises.id,
        type: exercises.type,
        question: exercises.question,
        options: exercises.options,
        correctAnswer: exercises.correctAnswer,
        explanation: exercises.explanation,
        order: exercises.order,
      })
      .from(exercises)
      .where(eq(exercises.lessonId, lessonId))
      .orderBy(asc(exercises.order));

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xpReward,
      },
      exercises: lessonExercises,
    });
  } catch (error) {
    console.error("[Lesson] Error:", error);
    return errors.internal("Failed to fetch lesson");
  }
}
