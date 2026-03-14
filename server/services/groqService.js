import Groq from 'groq-sdk';

const fallbackText =
  'Assign volunteers with medical skills to urgent requests, prioritize low-stock resources, and reinforce high-impact event areas.';

const buildGeminiInsight = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an NGO operations assistant. Reply with concise practical recommendations.\n\n${prompt}`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('\n').trim();
  return text || null;
};

const buildGroqInsight = async (prompt) => {
  if (!process.env.GROQ_API_KEY) return null;

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: 'You are an NGO operations assistant. Reply with concise practical recommendations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return completion.choices?.[0]?.message?.content || null;
};

export const buildAiInsight = async (prompt) => {
  try {
    const gemini = await buildGeminiInsight(prompt);
    if (gemini) return gemini;
  } catch (error) {
    console.warn('Gemini unavailable, trying Groq fallback.', error?.message || error);
  }

  try {
    const groq = await buildGroqInsight(prompt);
    if (groq) return groq;
  } catch (error) {
    console.warn('Groq unavailable, using static fallback.', error?.message || error);
  }

  return fallbackText;
};
