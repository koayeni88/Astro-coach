import { z } from "zod";

export const profileSchema = z.object({
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be YYYY-MM-DD format")
    .refine((d) => {
      const date = new Date(d + "T00:00:00");
      return !isNaN(date.getTime()) && date < new Date();
    }, "Invalid or future date"),
  focusArea: z.enum(["love", "career", "money", "peace"]),
  mood: z.enum([
    "happy", "anxious", "motivated", "reflective", "confused",
    "neutral", "sad", "excited", "intense", "peaceful",
  ]),
  struggle: z.enum([
    "none", "patience", "trust", "vulnerability", "direction",
    "confidence", "boundaries", "letting-go", "communication", "balance",
  ]),
});

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long (max 1000 characters)")
    .transform((s) => s.trim()),
  conversationId: z.string().optional(),
});

export const compatibilitySchema = z.union([
  z.object({
    otherBirthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be YYYY-MM-DD format"),
  }),
  z.object({
    otherSign: z.enum([
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ]),
  }),
]);

export const dailyDateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
    .optional()
    .default(() => new Date().toISOString().split("T")[0]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
