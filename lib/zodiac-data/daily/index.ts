import { ariesDaily } from "./aries";
import { taurusDaily } from "./taurus";
import { geminiDaily } from "./gemini";
import { cancerDaily } from "./cancer";
import { leoDaily } from "./leo";
import { virgoDaily } from "./virgo";
import { libraDaily } from "./libra";
import { scorpioDaily } from "./scorpio";
import { sagittariusDaily } from "./sagittarius";
import { capricornDaily } from "./capricorn";
import { aquariusDaily } from "./aquarius";
import { piscesDaily } from "./pisces";

export {
  ariesDaily,
  taurusDaily,
  geminiDaily,
  cancerDaily,
  leoDaily,
  virgoDaily,
  libraDaily,
  scorpioDaily,
  sagittariusDaily,
  capricornDaily,
  aquariusDaily,
  piscesDaily,
};

/** Map of sign name (lowercase) → daily quotes record */
const allDaily: Record<string, Record<string, string>> = {
  aries: ariesDaily,
  taurus: taurusDaily,
  gemini: geminiDaily,
  cancer: cancerDaily,
  leo: leoDaily,
  virgo: virgoDaily,
  libra: libraDaily,
  scorpio: scorpioDaily,
  sagittarius: sagittariusDaily,
  capricorn: capricornDaily,
  aquarius: aquariusDaily,
  pisces: piscesDaily,
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Get the daily quote for a given zodiac sign and date.
 * Falls back to a generic message if the sign or date key is missing.
 */
export function getDailyQuote(sign: string, date: Date = new Date()): string {
  const key = `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
  const quotes = allDaily[sign.toLowerCase()];
  if (!quotes) return "The stars are aligning — check back soon for your daily insight.";
  return quotes[key] ?? "Today holds quiet cosmic potential. Stay open to what unfolds.";
}
