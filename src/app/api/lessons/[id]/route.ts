import { NextResponse } from "next/server";
import { getDb } from "@/lib/supabase/db";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// GET /api/lessons/[id] - Get lesson with exercises
// Using Supabase Client
// ============================================

// Type for lesson with nested exercises from Supabase query
interface LessonWithExercises {
  id: number;
  title: string;
  description: string | null;
  xp_reward: number;
  exercises: Array<{
    id: number;
    type: string;
    question: string;
    options: string[] | null;
    correct_answer: string;
    explanation: string | null;
    order: number;
  }>;
}

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

    const db = await getDb();

    // Get lesson with exercises in a single query
    const { data: lesson, error: lessonError } = await db
      .from("lessons")
      .select(`
        id,
        title,
        description,
        xp_reward,
        exercises:exercises(
          id,
          type,
          question,
          options,
          correct_answer,
          explanation,
          order
        )
      `)
      .eq("id", lessonId)
      .single<LessonWithExercises>();

    if (lessonError) {
      if (lessonError.code === "PGRST116") {
        return errors.notFound("Lesson not found");
      }
      console.error("[Lesson] Query error:", lessonError);
      return errors.internal("Failed to fetch lesson");
    }

    // Sort exercises by order
    const exercises = (lesson.exercises ?? []).sort((a, b) => a.order - b.order);

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xp_reward,
      },
      exercises: exercises.map((ex) => ({
        id: ex.id,
        type: ex.type,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.correct_answer,
        explanation: ex.explanation,
        order: ex.order,
      })),
    });
  } catch (error) {
    console.error("[Lesson] Error:", error);
    return errors.internal("Failed to fetch lesson");
  }
}
