import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// TRANSCRIBE API - Whisper STT
// ============================================

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (Whisper limit)
const ALLOWED_TYPES = ["audio/webm", "audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a"];

export async function POST(req: Request) {
  // 1. Require authentication
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 3. Validate input
    if (!file) {
      return errors.badRequest("No audio file provided");
    }

    if (file.size > MAX_FILE_SIZE) {
      return errors.badRequest("File too large. Maximum size is 25MB");
    }

    if (!ALLOWED_TYPES.some((type) => file.type.startsWith(type.split("/")[0]))) {
      return errors.badRequest("Invalid file type. Supported: webm, mp3, wav, m4a");
    }

    // 4. Forward to OpenAI Whisper
    const openaiFormData = new FormData();
    openaiFormData.append("file", file);
    openaiFormData.append("model", "whisper-1");
    openaiFormData.append("language", "es"); // Spanish optimization

    const whisperResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openaiFormData,
      }
    );

    if (!whisperResponse.ok) {
      console.error(`[Transcribe] OpenAI error for user ${user?.id}:`, whisperResponse.status);
      return errors.serviceUnavailable("Transcription service temporarily unavailable");
    }

    const result = await whisperResponse.json();

    return NextResponse.json({
      text: result.text,
      language: result.language || "es",
    });
  } catch (error) {
    console.error("[Transcribe] Error:", error);
    return errors.internal("Failed to process audio");
  }
}
