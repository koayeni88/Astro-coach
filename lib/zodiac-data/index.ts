/**
 * Zodiac Data — Barrel Export
 *
 * Re-exports all 12 sign data files and the shared SignData type,
 * plus a convenience `allSigns` map keyed by lowercase sign name.
 */

export type { SignData } from "./types";

import { aries } from "./aries";
import { taurus } from "./taurus";
import { gemini } from "./gemini";
import { cancer } from "./cancer";
import { leo } from "./leo";
import { virgo } from "./virgo";
import { libra } from "./libra";
import { scorpio } from "./scorpio";
import { sagittarius } from "./sagittarius";
import { capricorn } from "./capricorn";
import { aquarius } from "./aquarius";
import { pisces } from "./pisces";
import type { SignData } from "./types";

export {
  aries,
  taurus,
  gemini,
  cancer,
  leo,
  virgo,
  libra,
  scorpio,
  sagittarius,
  capricorn,
  aquarius,
  pisces,
};

/** All 12 signs keyed by lowercase name (e.g. "aries", "pisces"). */
export const allSigns: Record<string, SignData> = {
  aries,
  taurus,
  gemini,
  cancer,
  leo,
  virgo,
  libra,
  scorpio,
  sagittarius,
  capricorn,
  aquarius,
  pisces,
};

/**
 * Look up sign data by name (case-insensitive).
 * Returns `undefined` if the sign is not found.
 */
export function getSignData(signName: string): SignData | undefined {
  return allSigns[signName.toLowerCase()];
}
