import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }, body: formData });
    return NextResponse.json(await whisperResponse.json());
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
