import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { errors } from "@/lib/api/errors";

// ============================================
// CHAT API - Language Learning Assistant
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
      return errors.badRequest(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters`);
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

    // 5. Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast and cost-effective for chat
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT + contextPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`[Chat] OpenAI error for user ${user?.id}:`, response.status);
      return errors.serviceUnavailable("Chat service temporarily unavailable");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu mensaje. ¡Intenta de nuevo!";

    return NextResponse.json({
      reply,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
      },
    });
  } catch (error) {
    console.error("[Chat] Error:", error);
    return errors.internal("Failed to process message");
  }
}
