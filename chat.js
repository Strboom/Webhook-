export const config = { maxDuration: 15 };

const ALLOWED_ORIGINS = [
  "https://onyxai.site",
  "http://onyxai.site",
  "https://www.onyxai.site",
  "http://www.onyxai.site",
];

const SYSTEM_PROMPT = `You are Onyx, a friendly and powerful Discord bot assistant on the Onyx website. Help visitors learn about Onyx's features.

Be helpful, fun, and a little witty. Keep responses short — 1-3 sentences unless asked for more.

Features: AI Chat, Economy (coins, shop, leaderboards), Games (trivia, word games), Leveling (XP, rank cards), Music (play/pause/skip/queue), Utility (polls, reminders, weather, translate).

Premium perks: custom AI personality, custom server profile picture, priority AI responses, exclusive commands.

Never mention model names, API providers, or technical infrastructure. If asked something unrelated to Onyx, gently redirect.`;

export default async function handler(req, res) {
  const origin = req.headers["origin"] || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long (max 500 chars)." });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "NVIDIA_API_KEY is not set in environment variables." });
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: String(m.content).slice(0, 500) }))
    : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: "user", content: message.trim() },
  ];

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.3-70b-instruct",
        messages,
        max_tokens: 256,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API error:", response.status, errText);
      return res.status(502).json({ error: "AI service error. Try again." });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "Hmm, couldn't think of a response. Try again!";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
