import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// CHAT API - Language Learning Assistant
// Using AI SDK 6 with GPT-5.2
// ============================================

const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are Longo, an elite language learning assistant specialized in teaching Spanish to English speakers.

Your personality:
- Encouraging but honest - celebrate wins, gently correct mistakes
- Use simple Spanish phrases mixed with English explanations
- Keep responses concise (2-3 sentences max)
- Focus on practical, conversational Spanish

When the user speaks Spanish:
- Acknowledge their effort
- Correct any grammar/pronunciation issues kindly
- Suggest a natural alternative if needed

When the user asks questions:
- Give clear, practical answers
- Include an example in Spanish with translation
- Encourage them to try speaking

Always respond in a mix of Spanish and English to reinforce learning.`;

export async function POST(req: Request) {
  // 1. Require authentication
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    // 2. Parse request body
    const body = await req.json();
    const { message, context } = body as {
      message?: string;
      context?: { lesson?: string; streak?: number };
    };

    // 3. Validate input
    if (!message || typeof message !== "string") {
      return errors.badRequest("Message is required");
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return errors.badRequest(
        `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters`
      );
    }

    if (message.trim().length === 0) {
      return errors.badRequest("Message cannot be empty");
    }

    // 4. Build context-aware prompt
    let contextPrompt = "";
    if (context?.lesson) {
      contextPrompt += `\nCurrent lesson: ${context.lesson}`;
    }
    if (context?.streak) {
      contextPrompt += `\nUser's streak: ${context.streak} days`;
    }

    // 5. Generate response using AI SDK 6 with GPT-5.2
    const { text, usage } = await generateText({
      model: openai("gpt-5.2"),
      system: SYSTEM_PROMPT + contextPrompt,
      prompt: message,
      maxTokens: 200,
      temperature: 0.7,
    });

    const reply =
      text || "Lo siento, no pude procesar tu mensaje. \u00a1Intenta de nuevo!";

    return NextResponse.json({
      reply,
      usage: {
        promptTokens: usage?.promptTokens,
        completionTokens: usage?.completionTokens,
      },
    });
  } catch (error) {
    console.error("[Chat] Error:", error);
    return errors.internal("Failed to process message");
  }
}
