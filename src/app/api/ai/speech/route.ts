import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// SPEECH API - OpenAI TTS
// ============================================

const MAX_TEXT_LENGTH = 4096; // OpenAI TTS limit

const VOICE_OPTIONS = {
  ALLOY: "alloy",
  ECHO: "echo",
  FABLE: "fable",
  ONYX: "onyx",
  NOVA: "nova",
  SHIMMER: "shimmer",
} as const;

type VoiceOption = (typeof VOICE_OPTIONS)[keyof typeof VOICE_OPTIONS];

export async function POST(req: Request) {
  // 1. Require authentication
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    // 2. Parse request body
    const body = await req.json();
    const { text, voice = VOICE_OPTIONS.ALLOY } = body as {
      text?: string;
      voice?: VoiceOption;
    };

    // 3. Validate input
    if (!text || typeof text !== "string") {
      return errors.badRequest("Text is required");
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return errors.badRequest(`Text too long. Maximum ${MAX_TEXT_LENGTH} characters`);
    }

    if (text.trim().length === 0) {
      return errors.badRequest("Text cannot be empty");
    }

    // Validate voice option
    const validVoices = Object.values(VOICE_OPTIONS);
    const selectedVoice = validVoices.includes(voice as VoiceOption)
      ? voice
      : VOICE_OPTIONS.ALLOY;

    // 4. Generate speech via OpenAI
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: selectedVoice,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      console.error(`[Speech] OpenAI error for user ${user?.id}:`, response.status);
      return errors.serviceUnavailable("Speech service temporarily unavailable");
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[Speech] Error:", error);
    return errors.internal("Failed to generate speech");
  }
}
