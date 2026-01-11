import { NextResponse } from "next/server";
import { getDb } from "@/lib/supabase/db";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// POST /api/progress - Update user progress
// Using Supabase Client
// ============================================

export async function POST(request: Request) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { lessonId, score, completed } = body as {
      lessonId: number;
      score: number;
      completed: boolean;
    };

    // Validate input
    if (!lessonId || typeof lessonId !== "number") {
      return errors.badRequest("lessonId is required");
    }

    const db = await getDb();

    // Get user's database ID
    const { data: dbUser, error: userError } = await db
      .from("users")
      .select("id")
      .eq("supabase_id", user!.id)
      .single();

    if (userError || !dbUser) {
      return errors.notFound("User not found in database");
    }

    // Check if lesson exists
    const { data: lesson, error: lessonError } = await db
      .from("lessons")
      .select("id, xp_reward")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return errors.notFound("Lesson not found");
    }

    // Check for existing progress
    const { data: existingProgress } = await db
      .from("user_progress")
      .select("*")
      .eq("user_id", dbUser.id)
      .eq("lesson_id", lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      await db
        .from("user_progress")
        .update({
          score: Math.max(existingProgress.score, score || 0),
          completed: completed || existingProgress.completed,
          attempts: existingProgress.attempts + 1,
          last_accessed_at: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : existingProgress.completed_at,
        })
        .eq("id", existingProgress.id);
    } else {
      // Create new progress
      await db
        .from("user_progress")
        .insert({
          user_id: dbUser.id,
          lesson_id: lessonId,
          score: score || 0,
          completed: completed || false,
          attempts: 1,
          completed_at: completed ? new Date().toISOString() : null,
        });
    }

    // Award XP if completed for the first time
    let xpAwarded = 0;
    if (completed && !existingProgress?.completed) {
      xpAwarded = lesson.xp_reward;
      
      // Get current XP and update
      const { data: currentUser } = await db
        .from("users")
        .select("xp")
        .eq("id", dbUser.id)
        .single();

      await db
        .from("users")
        .update({
          xp: (currentUser?.xp || 0) + xpAwarded,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dbUser.id);
    }

    return NextResponse.json({
      success: true,
      xpAwarded,
      message: completed ? "Lesson completed!" : "Progress saved",
    });
  } catch (error) {
    console.error("[Progress] Error:", error);
    return errors.internal("Failed to update progress");
  }
}

// ============================================
// GET /api/progress - Get user's progress
// Using Supabase Client
// ============================================

export async function GET() {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const db = await getDb();

    // Get user's database record
    const { data: dbUser, error: userError } = await db
      .from("users")
      .select("id, xp, streak, hearts")
      .eq("supabase_id", user!.id)
      .single();

    if (userError || !dbUser) {
      return errors.notFound("User not found in database");
    }

    // Get all progress for this user
    const { data: progress, error: progressError } = await db
      .from("user_progress")
      .select("lesson_id, completed, score, attempts, last_accessed_at")
      .eq("user_id", dbUser.id);

    if (progressError) {
      console.error("[Progress] Query error:", progressError);
      return errors.internal("Failed to fetch progress");
    }

    return NextResponse.json({
      stats: {
        xp: dbUser.xp,
        streak: dbUser.streak,
        hearts: dbUser.hearts,
      },
      progress: (progress ?? []).reduce(
        (acc, p) => {
          acc[p.lesson_id] = {
            completed: p.completed,
            score: p.score,
            attempts: p.attempts,
          };
          return acc;
        },
        {} as Record<number, { completed: boolean; score: number; attempts: number }>
      ),
    });
  } catch (error) {
    console.error("[Progress] Error:", error);
    return errors.internal("Failed to fetch progress");
  }
}
