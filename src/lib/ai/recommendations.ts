export async function generateAIRecommendation(userStats: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "Empieza con la lección de Fundamentos I para calentar.";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: "Eres un tutor de idiomas experto. Basado en las estadísticas del usuario, da una recomendación corta y motivadora de menos de 20 palabras." }, { role: "user", content: `Usuario con racha de ${userStats.streak}, XP de ${userStats.xp} y ${userStats.hearts} vidas.` }],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Continúa con tu racha, vas por buen camino.";
  } catch (error) {
    return "Es un buen momento para repasar tus errores anteriores.";
  }
}
