export async function generateAIRecommendation(userStats: { streak: number; xp: number; hearts: number }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "Empieza con la lección de Fundamentos I para calentar.";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "o1", messages: [{ role: "user", content: `You are an elite language tutor with advanced reasoning. User stats: ${userStats.streak} day streak, ${userStats.xp} total XP, ${userStats.hearts} lives left. Provide a short, highly-reasoned tip (max 15 words) for their next step.` }] }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Keep going, your progress is solid!";
  } catch (error) { return "Keep practicing, you're doing great!"; }
}
