/**
 * Comprehensive Zodiac Sign Data
 *
 * Each sign file exports a `SignData` object containing 10,000+ words
 * of structured astrological content across 20+ categories.
 */

export interface SignData {
  sign: string;
  emoji: string;
  element: string;
  modality: string;
  rulingPlanet: string;
  symbol: string;
  dateRange: string;
  season: string;
  houseNumber: number;
  houseName: string;
  polarity: string;
  luckyNumbers: number[];
  luckyDay: string;
  colors: string[];
  gemstones: string[];
  flowers: string[];
  bodyParts: string[];
  tarotCard: string;
  motto: string;
  /* -------------------------------------------------- */
  overview: string;
  personality: {
    core: string;
    lightSide: string;
    shadowSide: string;
    innerWorld: string;
    socialStyle: string;
    emotionalLandscape: string;
    stressResponse: string;
    growthPath: string;
  };
  strengths: {
    list: string[];
    details: string;
  };
  weaknesses: {
    list: string[];
    details: string;
  };
  love: {
    style: string;
    attractedTo: string;
    inRelationship: string;
    dealbreakers: string;
    attachmentStyle: string;
    loveTips: string[];
    bestMatches: string[];
    challengingMatches: string[];
  };
  friendship: {
    style: string;
    asAFriend: string;
    needsInFriendship: string;
    friendshipTips: string[];
  };
  family: {
    asChild: string;
    asParent: string;
    familyDynamics: string;
  };
  career: {
    style: string;
    idealRoles: string[];
    workEnvironment: string;
    leadershipStyle: string;
    asColleague: string;
    moneyStyle: string;
    careerTips: string[];
  };
  communication: {
    style: string;
    argumentStyle: string;
    listeningStyle: string;
    tips: string[];
  };
  health: {
    constitution: string;
    vulnerabilities: string;
    exerciseStyle: string;
    mentalHealth: string;
    wellnessTips: string[];
  };
  spirituality: {
    path: string;
    practices: string[];
    lessonInLife: string;
  };
  mythology: {
    origin: string;
    ancientAssociations: string;
    symbolism: string;
  };
  decans: {
    first: { dateRange: string; subRuler: string; traits: string };
    second: { dateRange: string; subRuler: string; traits: string };
    third: { dateRange: string; subRuler: string; traits: string };
  };
  celebrities: string[];
  funFacts: string[];
  dailyQuotes: string[];
  /* Extended sections */
  hiddenDepths: string;
  evolutionaryJourney: string;
  shadowWork: string;
  sacredGifts: string;
}

export type { SignData as default };
