import { ZodiacSign } from "./zodiac";

export const SYSTEM_PROMPT = `You are an astrology coach called "Astro Coach". Provide supportive, insightful, and empowering guidance based on astrological principles.

RULES:
- Never provide medical, legal, or financial advice.
- Avoid absolute claims or predictions. Use language like "the stars suggest", "this energy may", "consider exploring".
- Encourage self-reflection and personal growth.
- Be warm, supportive, and encouraging.
- Reference astrological concepts naturally (elements, ruling planets, modalities).
- Keep responses concise but meaningful (2-4 paragraphs max for chat).
- If asked about non-astrology topics, gently redirect to how astrology might offer perspective.`;

export function buildDailyReadingPrompt(
  sign: ZodiacSign,
  focusArea: string,
  mood: string,
  struggle: string,
  date: string
) {
  return `Generate a personalized daily astrology reading for today (${date}).

User context:
- Sun sign: ${sign}
- Current focus area: ${focusArea}
- Current mood: ${mood}
- Current struggle: ${struggle}

Return ONLY a valid JSON object with these exact keys:
{
  "quote": "An inspiring daily quote tailored to ${sign} energy (1 sentence)",
  "theme": "A 1-2 word theme for the day",
  "readingText": "A 2-3 paragraph personalized daily reading addressing their focus on ${focusArea}, current mood of ${mood}, and struggle with ${struggle}. Reference ${sign}'s natural traits and today's cosmic energy.",
  "action": "One specific actionable suggestion for today (1-2 sentences)",
  "avoid": "One thing to be mindful of or avoid today (1-2 sentences)"
}

Return ONLY the JSON object, no markdown formatting, no code blocks.`;
}

export function buildChatPrompt(
  sign: ZodiacSign,
  focusArea: string,
  mood: string,
  struggle: string
) {
  return `${SYSTEM_PROMPT}

Current user context:
- Sun sign: ${sign}
- Focus area: ${focusArea}
- Current mood: ${mood}
- Current struggle: ${struggle}

Use this context to personalize your responses. Reference their sign's traits and current situation naturally.`;
}

export function buildCompatibilityPrompt(
  sign1: ZodiacSign,
  sign2: ZodiacSign
) {
  return `Provide a brief but insightful astrological compatibility reading between ${sign1} and ${sign2}.

Cover:
1. Overall compatibility (1-2 sentences)
2. Strengths of this pairing (2-3 points)
3. Potential challenges (1-2 points)
4. Tips for harmony (1-2 tips)

Keep it warm, balanced, and encouraging. Under 200 words total.`;
}
