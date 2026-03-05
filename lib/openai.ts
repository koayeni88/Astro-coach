import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function chatCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  options?: { json?: boolean; maxTokens?: number }
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: options?.maxTokens || 800,
      temperature: 0.8,
      ...(options?.json ? { response_format: { type: "json_object" } } : {}),
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}

export async function generateStructuredJSON(
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, string> | null> {
  // First attempt
  let result = await chatCompletion(systemPrompt, [{ role: "user", content: userPrompt }], {
    json: true,
  });

  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      // Retry with explicit JSON instruction
      result = await chatCompletion(
        systemPrompt,
        [
          { role: "user", content: userPrompt },
          { role: "assistant", content: result },
          { role: "user", content: "That was not valid JSON. Return ONLY a valid JSON object." },
        ],
        { json: true }
      );
      if (result) {
        try {
          return JSON.parse(result);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
