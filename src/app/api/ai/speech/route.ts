import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1", input: text, voice: "alloy" }),
    });
    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });
  } catch (error) { return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 }); }
}
