/**
 * Birth Chart Calculator
 * 
 * Calculates moon sign and rising sign based on birth date, time, and location.
 * Uses simplified astronomical algorithms — for production, integrate with
 * a professional ephemeris API like Swiss Ephemeris or AstroAPI.
 */

import { ZodiacSign, ZODIAC_SIGNS } from "./zodiac";

// Simplified moon sign calculation based on date
// In production, use Swiss Ephemeris for precise calculations
export function calculateMoonSign(birthDate: string, birthTime?: string): ZodiacSign {
  const date = new Date(birthDate + (birthTime ? `T${birthTime}:00` : "T12:00:00"));
  
  // Simplified lunar cycle calculation
  // Moon completes a cycle every ~29.53 days, spends ~2.46 days in each sign
  const J2000 = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSinceJ2000 = (date.getTime() - J2000) / (1000 * 60 * 60 * 24);
  
  // Moon's mean longitude (simplified)
  const moonLongitude = (218.316 + 13.176396 * daysSinceJ2000) % 360;
  const normalizedLong = ((moonLongitude % 360) + 360) % 360;
  
  // Each sign is 30 degrees
  const signIndex = Math.floor(normalizedLong / 30);
  return ZODIAC_SIGNS[signIndex % 12];
}

// Simplified rising sign calculation
// Rising sign changes every ~2 hours, depends on birth time and location
export function calculateRisingSign(
  birthDate: string,
  birthTime?: string,
  _birthPlace?: string
): ZodiacSign | null {
  if (!birthTime) return null;
  
  const date = new Date(`${birthDate}T${birthTime}:00`);
  const hours = date.getHours() + date.getMinutes() / 60;
  
  // Get the sun's zodiac sign index
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const sunSignIndex = getSunSignIndex(month, day);
  
  // Rising sign shifts approximately 1 sign every 2 hours
  // Starting from the sun sign at sunrise (~6am)
  const hoursFromSunrise = ((hours - 6) + 24) % 24;
  const risingOffset = Math.floor(hoursFromSunrise / 2);
  
  return ZODIAC_SIGNS[(sunSignIndex + risingOffset) % 12];
}

function getSunSignIndex(month: number, day: number): number {
  const signs: [number, number, ZodiacSign][] = [
    [3, 21, "Aries"], [4, 20, "Taurus"], [5, 21, "Gemini"],
    [6, 21, "Cancer"], [7, 23, "Leo"], [8, 23, "Virgo"],
    [9, 23, "Libra"], [10, 23, "Scorpio"], [11, 22, "Sagittarius"],
    [12, 22, "Capricorn"], [1, 20, "Aquarius"], [2, 19, "Pisces"],
  ];
  
  for (let i = signs.length - 1; i >= 0; i--) {
    const [m, d] = signs[i];
    if (month > m || (month === m && day >= d)) {
      return ZODIAC_SIGNS.indexOf(signs[i][2]);
    }
  }
  return ZODIAC_SIGNS.indexOf("Capricorn");
}

// Planetary positions (simplified)
export interface BirthChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign | null;
  element: string;
  modality: string;
  rulingPlanet: string;
  bigThree: string;
}

export function calculateBirthChart(
  birthDate: string,
  sunSign: ZodiacSign,
  birthTime?: string,
  birthPlace?: string
): BirthChart {
  const moonSign = calculateMoonSign(birthDate, birthTime);
  const risingSign = calculateRisingSign(birthDate, birthTime, birthPlace);
  
  const ELEMENTS: Record<ZodiacSign, string> = {
    Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
    Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
    Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
  };
  
  const MODALITIES: Record<ZodiacSign, string> = {
    Aries: "Cardinal", Taurus: "Fixed", Gemini: "Mutable", Cancer: "Cardinal",
    Leo: "Fixed", Virgo: "Mutable", Libra: "Cardinal", Scorpio: "Fixed",
    Sagittarius: "Mutable", Capricorn: "Cardinal", Aquarius: "Fixed", Pisces: "Mutable",
  };
  
  const RULERS: Record<ZodiacSign, string> = {
    Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
    Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Pluto",
    Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Uranus", Pisces: "Neptune",
  };
  
  const bigThreeParts = [sunSign];
  if (moonSign) bigThreeParts.push(moonSign);
  if (risingSign) bigThreeParts.push(risingSign);
  
  return {
    sunSign,
    moonSign,
    risingSign,
    element: ELEMENTS[sunSign],
    modality: MODALITIES[sunSign],
    rulingPlanet: RULERS[sunSign],
    bigThree: bigThreeParts.join(" / "),
  };
}

// Transit data — current planetary positions affecting signs
export interface Transit {
  planet: string;
  sign: ZodiacSign;
  description: string;
  startDate: string;
  endDate: string;
  isRetrograde: boolean;
  affectedSigns: ZodiacSign[];
  intensity: "low" | "medium" | "high";
}

export function getCurrentTransits(): Transit[] {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  // Simplified transit data — in production, use an ephemeris API
  const transits: Transit[] = [
    {
      planet: "Mercury",
      sign: getTransitSign("Mercury", month),
      description: "Communication and thinking patterns are highlighted. Pay attention to how you express yourself.",
      startDate: `${year}-${String(month).padStart(2, "0")}-01`,
      endDate: `${year}-${String(month).padStart(2, "0")}-28`,
      isRetrograde: isRetrograde("Mercury", month, year),
      affectedSigns: getAffectedSigns(getTransitSign("Mercury", month)),
      intensity: "medium",
    },
    {
      planet: "Venus",
      sign: getTransitSign("Venus", month),
      description: "Love, beauty, and values are in focus. Relationships and finances may shift.",
      startDate: `${year}-${String(month).padStart(2, "0")}-01`,
      endDate: `${year}-${String(month).padStart(2, "0")}-28`,
      isRetrograde: isRetrograde("Venus", month, year),
      affectedSigns: getAffectedSigns(getTransitSign("Venus", month)),
      intensity: "medium",
    },
    {
      planet: "Mars",
      sign: getTransitSign("Mars", month),
      description: "Energy, drive, and ambition are activated. Channel aggression constructively.",
      startDate: `${year}-${String(month).padStart(2, "0")}-01`,
      endDate: `${year}-${String(month + 1 > 12 ? 1 : month + 1).padStart(2, "0")}-15`,
      isRetrograde: false,
      affectedSigns: getAffectedSigns(getTransitSign("Mars", month)),
      intensity: "high",
    },
    {
      planet: "Jupiter",
      sign: getTransitSign("Jupiter", month),
      description: "Expansion, luck, and growth opportunities abound. Think big but stay grounded.",
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      isRetrograde: false,
      affectedSigns: getAffectedSigns(getTransitSign("Jupiter", month)),
      intensity: "low",
    },
    {
      planet: "Saturn",
      sign: getTransitSign("Saturn", month),
      description: "Structure, discipline, and life lessons are emphasized. Build lasting foundations.",
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      isRetrograde: false,
      affectedSigns: getAffectedSigns(getTransitSign("Saturn", month)),
      intensity: "low",
    },
  ];
  
  return transits;
}

function getTransitSign(planet: string, month: number): ZodiacSign {
  // Simplified — each planet moves through signs at different rates
  const offsets: Record<string, number> = {
    Mercury: month - 1,      // ~1 sign/month
    Venus: month - 1,        // ~1 sign/month
    Mars: Math.floor((month - 1) / 2), // ~1 sign/2 months
    Jupiter: Math.floor((month - 1) / 12), // ~1 sign/year
    Saturn: 0,                // Very slow
  };
  
  const baseIndex: Record<string, number> = {
    Mercury: 10,  // Starting positions for 2026
    Venus: 11,
    Mars: 4,
    Jupiter: 3,
    Saturn: 11,
  };
  
  const idx = ((baseIndex[planet] || 0) + (offsets[planet] || 0)) % 12;
  return ZODIAC_SIGNS[idx];
}

function isRetrograde(planet: string, month: number, _year: number): boolean {
  // Simplified retrograde periods
  if (planet === "Mercury") {
    return [3, 4, 7, 8, 11, 12].includes(month); // ~3 times/year
  }
  if (planet === "Venus") {
    return [1, 2].includes(month); // ~once every 18 months
  }
  return false;
}

function getAffectedSigns(transitSign: ZodiacSign): ZodiacSign[] {
  const idx = ZODIAC_SIGNS.indexOf(transitSign);
  return [
    transitSign,
    ZODIAC_SIGNS[(idx + 3) % 12],  // Square
    ZODIAC_SIGNS[(idx + 6) % 12],  // Opposition
    ZODIAC_SIGNS[(idx + 9) % 12],  // Square
  ];
}

// Retrograde tracker
export interface RetrogradeInfo {
  planet: string;
  isRetrograde: boolean;
  sign: ZodiacSign;
  description: string;
  advice: string;
}

export function getRetrogrades(): RetrogradeInfo[] {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  const planets = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  
  return planets.map(planet => {
    const retro = isRetrograde(planet, month, year);
    const sign = getTransitSign(planet, month);
    
    const descriptions: Record<string, { retro: string; direct: string; advice: string }> = {
      Mercury: {
        retro: "Mercury is retrograde! Communication, technology, and travel may face disruptions. Double-check everything.",
        direct: "Mercury is direct. Communication flows smoothly — a great time for important conversations and decisions.",
        advice: retro ? "Avoid signing contracts, back up data, and be extra clear in communication." : "Launch new projects, sign agreements, and start important conversations.",
      },
      Venus: {
        retro: "Venus is retrograde. Past relationships may resurface. Avoid major beauty changes or financial decisions.",
        direct: "Venus is direct. Love, beauty, and finances flow harmoniously. Great time for relationships.",
        advice: retro ? "Reflect on what you truly value. Reconnect with old friends carefully." : "Treat yourself, go on dates, and invest in what you love.",
      },
      Mars: {
        retro: "Mars is retrograde. Energy may feel sluggish. Avoid starting conflicts or major physical challenges.",
        direct: "Mars is direct. Energy and motivation are strong. Take action on your goals.",
        advice: retro ? "Rest more, plan instead of act, avoid unnecessary confrontations." : "Start new fitness goals, assert yourself, and take initiative.",
      },
      Jupiter: {
        retro: "Jupiter is retrograde. Growth turns inward. Reflect on your beliefs and life philosophy.",
        direct: "Jupiter is direct. Expansion and luck are on your side. Take calculated risks.",
        advice: retro ? "Journal about your life direction, revisit old opportunities." : "Apply to new opportunities, travel, learn something new.",
      },
      Saturn: {
        retro: "Saturn is retrograde. Review your structures and responsibilities. What boundaries need adjusting?",
        direct: "Saturn is direct. Build lasting structures. Discipline and hard work pay off now.",
        advice: retro ? "Release outdated rules, restructure your commitments." : "Set long-term goals, establish routines, build your foundation.",
      },
    };
    
    const info = descriptions[planet] || descriptions.Mercury;
    
    return {
      planet,
      isRetrograde: retro,
      sign,
      description: retro ? info.retro : info.direct,
      advice: info.advice,
    };
  });
}

// Tarot card of the day
export interface TarotCard {
  name: string;
  arcana: "Major" | "Minor";
  meaning: string;
  reversed: string;
  advice: string;
  isReversed: boolean;
}

const MAJOR_ARCANA: Omit<TarotCard, "isReversed">[] = [
  { name: "The Fool", arcana: "Major", meaning: "New beginnings, innocence, spontaneity, a free spirit", reversed: "Holding back, recklessness, risk-taking", advice: "Take a leap of faith today. Trust the journey." },
  { name: "The Magician", arcana: "Major", meaning: "Manifestation, resourcefulness, power, inspired action", reversed: "Manipulation, poor planning, untapped talents", advice: "You have everything you need. Focus your intention and make it happen." },
  { name: "The High Priestess", arcana: "Major", meaning: "Intuition, sacred knowledge, divine feminine, the subconscious mind", reversed: "Secrets, disconnected from intuition, withdrawal", advice: "Trust your inner voice today. The answers are within." },
  { name: "The Empress", arcana: "Major", meaning: "Femininity, beauty, nature, nurturing, abundance", reversed: "Creative block, dependence on others", advice: "Nurture yourself and others. Create something beautiful today." },
  { name: "The Emperor", arcana: "Major", meaning: "Authority, establishment, structure, a father figure", reversed: "Domination, excessive control, rigidity", advice: "Take charge with wisdom and compassion. Set clear boundaries." },
  { name: "The Hierophant", arcana: "Major", meaning: "Spiritual wisdom, religious beliefs, conformity, tradition", reversed: "Personal beliefs, freedom, challenging the status quo", advice: "Seek knowledge from trusted sources. Honor your spiritual path." },
  { name: "The Lovers", arcana: "Major", meaning: "Love, harmony, relationships, values alignment, choices", reversed: "Self-love, disharmony, imbalance, misalignment of values", advice: "Follow your heart. Choose love in all its forms today." },
  { name: "The Chariot", arcana: "Major", meaning: "Control, willpower, success, action, determination", reversed: "Self-discipline, opposition, lack of direction", advice: "Stay focused on your goal. Victory comes through determination." },
  { name: "Strength", arcana: "Major", meaning: "Strength, courage, persuasion, influence, compassion", reversed: "Inner strength, self-doubt, raw emotion", advice: "Lead with gentle strength today. Your courage inspires others." },
  { name: "The Hermit", arcana: "Major", meaning: "Soul-searching, introspection, being alone, inner guidance", reversed: "Isolation, loneliness, withdrawal", advice: "Take time for solitude and reflection. The answers emerge in silence." },
  { name: "Wheel of Fortune", arcana: "Major", meaning: "Good luck, karma, life cycles, destiny, a turning point", reversed: "Bad luck, resistance to change, breaking cycles", advice: "Embrace change. The wheel turns in your favor when you flow with it." },
  { name: "Justice", arcana: "Major", meaning: "Justice, fairness, truth, cause and effect, law", reversed: "Unfairness, lack of accountability, dishonesty", advice: "Seek truth and fairness in all interactions today." },
  { name: "The Hanged Man", arcana: "Major", meaning: "Pause, surrender, letting go, new perspectives", reversed: "Delays, resistance, stalling, indecision", advice: "Sometimes the best action is no action. Shift your perspective." },
  { name: "Death", arcana: "Major", meaning: "Endings, change, transformation, transition", reversed: "Resistance to change, personal transformation, inner purging", advice: "Release what no longer serves you. Make space for transformation." },
  { name: "Temperance", arcana: "Major", meaning: "Balance, moderation, patience, purpose", reversed: "Imbalance, excess, self-healing, re-alignment", advice: "Find your center. Balance is your superpower today." },
  { name: "The Devil", arcana: "Major", meaning: "Shadow self, attachment, addiction, restriction, sexuality", reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment", advice: "Examine what holds you captive. Freedom starts with awareness." },
  { name: "The Tower", arcana: "Major", meaning: "Sudden change, upheaval, chaos, revelation, awakening", reversed: "Personal transformation, fear of change, averting disaster", advice: "Breakthroughs often come through breakdowns. Trust the process." },
  { name: "The Star", arcana: "Major", meaning: "Hope, faith, purpose, renewal, spirituality", reversed: "Lack of faith, despair, self-trust, disconnection", advice: "Keep hope alive. You are a light in the darkness." },
  { name: "The Moon", arcana: "Major", meaning: "Illusion, fear, anxiety, subconscious, intuition", reversed: "Release of fear, repressed emotion, inner confusion", advice: "Navigate uncertainty with your intuition as your guide." },
  { name: "The Sun", arcana: "Major", meaning: "Positivity, fun, warmth, success, vitality", reversed: "Inner child, feeling down, overly optimistic", advice: "Let your light shine brightly today. Joy is your birthright." },
  { name: "Judgement", arcana: "Major", meaning: "Judgement, rebirth, inner calling, absolution", reversed: "Self-doubt, inner critic, ignoring the call", advice: "Answer your higher calling. It's time for a fresh start." },
  { name: "The World", arcana: "Major", meaning: "Completion, integration, accomplishment, travel", reversed: "Seeking personal closure, short-cuts, delays", advice: "Celebrate how far you've come. A chapter completes beautifully." },
];

export function getDailyTarotCard(date?: Date): TarotCard {
  const d = date || new Date();
  const dateNum = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = dateNum % MAJOR_ARCANA.length;
  const isReversed = (dateNum * 7) % 3 === 0;
  
  return {
    ...MAJOR_ARCANA[index],
    isReversed,
  };
}

export function getTarotCards(count: number, date?: Date): TarotCard[] {
  const clamped = Math.max(1, Math.min(count, MAJOR_ARCANA.length));
  const d = date || new Date();
  const dateNum = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

  // Build a shuffled copy seeded by the date so results are deterministic per day
  const deck = MAJOR_ARCANA.map((c, i) => ({ card: c, sort: ((dateNum * (i + 1) * 31) % 997) }));
  deck.sort((a, b) => a.sort - b.sort);

  return deck.slice(0, clamped).map((entry, i) => {
    const isReversed = ((dateNum * (i + 3)) % 3) === 0;
    return { ...entry.card, isReversed };
  });
}
