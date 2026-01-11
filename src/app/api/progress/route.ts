import { NextResponse } from "next/server";
import { db } from "@/db";
import { userProgress, users, lessons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// POST /api/progress - Update user progress
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

    // Get user's database ID
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.supabaseId, user!.id))
      .limit(1);

    if (!dbUser) {
      return errors.notFound("User not found in database");
    }

    // Check if lesson exists
    const [lesson] = await db
      .select({ id: lessons.id, xpReward: lessons.xpReward })
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return errors.notFound("Lesson not found");
    }

    // Check for existing progress
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, dbUser.id),
          eq(userProgress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existingProgress) {
      // Update existing progress
      await db
        .update(userProgress)
        .set({
          score: Math.max(existingProgress.score, score || 0),
          completed: completed || existingProgress.completed,
          attempts: existingProgress.attempts + 1,
          lastAccessedAt: new Date(),
          completedAt: completed ? new Date() : existingProgress.completedAt,
        })
        .where(eq(userProgress.id, existingProgress.id));
    } else {
      // Create new progress
      await db.insert(userProgress).values({
        userId: dbUser.id,
        lessonId,
        score: score || 0,
        completed: completed || false,
        attempts: 1,
        completedAt: completed ? new Date() : undefined,
      });
    }

    // Award XP if completed for the first time
    let xpAwarded = 0;
    if (completed && !existingProgress?.completed) {
      xpAwarded = lesson.xpReward;
      await db
        .update(users)
        .set({
          xp: dbUser.id + xpAwarded, // This should use SQL increment
          updatedAt: new Date(),
        })
        .where(eq(users.id, dbUser.id));
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
// ============================================

export async function GET() {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    // Get user's database ID
    const [dbUser] = await db
      .select({ id: users.id, xp: users.xp, streak: users.streak, hearts: users.hearts })
      .from(users)
      .where(eq(users.supabaseId, user!.id))
      .limit(1);

    if (!dbUser) {
      return errors.notFound("User not found in database");
    }

    // Get all progress for this user
    const progress = await db
      .select({
        lessonId: userProgress.lessonId,
        completed: userProgress.completed,
        score: userProgress.score,
        attempts: userProgress.attempts,
        lastAccessedAt: userProgress.lastAccessedAt,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, dbUser.id));

    return NextResponse.json({
      stats: {
        xp: dbUser.xp,
        streak: dbUser.streak,
        hearts: dbUser.hearts,
      },
      progress: progress.reduce(
        (acc, p) => {
          acc[p.lessonId] = {
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
