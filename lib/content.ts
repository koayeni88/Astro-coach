import { ZodiacSign } from "./zodiac";
import { getSignData } from "./zodiac-data";
import { getDailyQuote } from "./zodiac-data/daily";

export interface SignProfile {
  sign: ZodiacSign;
  overview: string;
  strengths: string[];
  watchOuts: string[];
  loveStyle: string;
  workStyle: string;
  communicationTips: string;
}

export interface Compatibility {
  bestFriends: { sign: ZodiacSign; reason: string }[];
  bestRomance: { sign: ZodiacSign; reason: string }[];
}

export const SIGN_PROFILES: Record<ZodiacSign, SignProfile> = {
  Aries: {
    sign: "Aries",
    overview:
      "Bold, ambitious, and fiercely independent. Aries dives headfirst into challenges and inspires others with their fearless energy. A natural-born leader who thrives on action.",
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic", "Honest"],
    watchOuts: ["Impatient", "Short-tempered", "Impulsive", "Can be self-centered"],
    loveStyle:
      "Passionate and direct. Aries loves the thrill of the chase and keeps the spark alive with spontaneous adventures and bold romantic gestures.",
    workStyle:
      "Thrives in leadership roles and fast-paced environments. Gets bored with routine but excels at starting projects and rallying teams.",
    communicationTips:
      "Be direct and don't beat around the bush. Aries respects honesty and confidence. Keep conversations energetic and action-oriented.",
  },
  Taurus: {
    sign: "Taurus",
    overview:
      "Grounded, reliable, and devoted. Taurus values stability and comfort, building a beautiful and secure life with patience and determination.",
    strengths: ["Reliable", "Patient", "Practical", "Devoted", "Responsible"],
    watchOuts: ["Stubborn", "Possessive", "Resistant to change", "Can be materialistic"],
    loveStyle:
      "Sensual and loyal. Taurus shows love through touch, quality time, and creating a cozy shared life. They're in it for the long haul.",
    workStyle:
      "Methodical and steady. Excels in roles requiring patience and attention to detail. Values financial security and tangible results.",
    communicationTips:
      "Be patient and give them time to process. Avoid rushing decisions. Show appreciation for their efforts and be consistent.",
  },
  Gemini: {
    sign: "Gemini",
    overview:
      "Curious, adaptable, and endlessly communicative. Gemini's dual nature makes them versatile and fascinating, always seeking new knowledge and connections.",
    strengths: ["Adaptable", "Witty", "Intellectual", "Versatile", "Sociable"],
    watchOuts: ["Inconsistent", "Indecisive", "Restless", "Can be superficial"],
    loveStyle:
      "Stimulating conversation is the key to a Gemini's heart. They need mental connection first and keep relationships lively with humor and variety.",
    workStyle:
      "Thrives on variety and mental stimulation. Excellent communicator and multitasker. Gets restless with repetitive work but shines in creative or media roles.",
    communicationTips:
      "Engage their mind with interesting topics. Be flexible and open to changing plans. Keep things light but intellectually stimulating.",
  },
  Cancer: {
    sign: "Cancer",
    overview:
      "Deeply intuitive, nurturing, and emotionally intelligent. Cancer creates safe spaces for loved ones and feels things with remarkable depth.",
    strengths: ["Nurturing", "Intuitive", "Loyal", "Protective", "Empathetic"],
    watchOuts: ["Moody", "Clingy", "Overly sensitive", "Can be manipulative when hurt"],
    loveStyle:
      "Deeply caring and emotionally present. Cancer builds love through creating a home together, remembering details, and providing unwavering emotional support.",
    workStyle:
      "Excels in caring professions and team environments. Brings emotional intelligence to leadership and creates supportive workplace cultures.",
    communicationTips:
      "Be gentle and emotionally available. Validate their feelings before offering solutions. Create safe spaces for vulnerability.",
  },
  Leo: {
    sign: "Leo",
    overview:
      "Charismatic, creative, and warm-hearted. Leo lights up every room with their generous spirit and natural magnetism. Born to shine and inspire.",
    strengths: ["Creative", "Generous", "Warm-hearted", "Cheerful", "Natural leader"],
    watchOuts: ["Arrogant", "Attention-seeking", "Dramatic", "Can be inflexible"],
    loveStyle:
      "Grand romantic gestures and unwavering loyalty define Leo's love language. They want to be adored and in return give their whole heart.",
    workStyle:
      "Thrives in creative and leadership positions. Motivates teams with infectious enthusiasm. Needs recognition and opportunities to shine.",
    communicationTips:
      "Give genuine compliments and acknowledgment. Be warm and enthusiastic. Avoid public criticism — address concerns privately.",
  },
  Virgo: {
    sign: "Virgo",
    overview:
      "Analytical, practical, and deeply caring beneath the surface. Virgo's attention to detail and desire to help make them invaluable friends and partners.",
    strengths: ["Analytical", "Kind", "Hardworking", "Practical", "Detail-oriented"],
    watchOuts: ["Overly critical", "Perfectionist", "Worry-prone", "Can be judgmental"],
    loveStyle:
      "Shows love through acts of service and remembering the details. Virgo may seem reserved but their care runs deep and is shown in practical ways.",
    workStyle:
      "The ultimate perfectionist and problem-solver. Excels in roles requiring precision, analysis, and organization. Sometimes needs to delegate more.",
    communicationTips:
      "Be specific and logical. Appreciate their help without dismissing their concerns. Give constructive feedback gently.",
  },
  Libra: {
    sign: "Libra",
    overview:
      "Diplomatic, charming, and harmony-seeking. Libra brings beauty and balance to everything they touch, always striving for fairness and connection.",
    strengths: ["Diplomatic", "Fair-minded", "Social", "Gracious", "Cooperative"],
    watchOuts: ["Indecisive", "People-pleasing", "Avoids confrontation", "Can be superficial"],
    loveStyle:
      "A true romantic who believes in partnership. Libra creates beautiful shared experiences and values equality and mutual respect in love.",
    workStyle:
      "Excels in collaborative environments and creative fields. Natural mediator and networker. Needs aesthetic and harmonious workspaces.",
    communicationTips:
      "Be fair and consider all angles. Avoid aggression — discuss calmly. Appreciate their perspective and give them space to decide.",
  },
  Scorpio: {
    sign: "Scorpio",
    overview:
      "Intense, passionate, and deeply transformative. Scorpio sees beneath the surface and understands emotional complexities that most overlook.",
    strengths: ["Passionate", "Resourceful", "Brave", "Loyal", "Strategic"],
    watchOuts: ["Jealous", "Secretive", "Controlling", "Can be vindictive"],
    loveStyle:
      "All-or-nothing in love. Scorpio craves deep emotional and physical connection. Fiercely loyal once trust is earned but devastated by betrayal.",
    workStyle:
      "Excels in research, investigation, and transformation roles. Intensely focused and strategic. Natural ability to uncover hidden truths.",
    communicationTips:
      "Be authentic and never lie — they'll sense it. Respect their privacy. Engage in deep, meaningful conversation rather than small talk.",
  },
  Sagittarius: {
    sign: "Sagittarius",
    overview:
      "Adventurous, philosophical, and freedom-loving. Sagittarius seeks meaning through exploration and inspires others with their optimism and big-picture thinking.",
    strengths: ["Optimistic", "Adventurous", "Philosophical", "Generous", "Humorous"],
    watchOuts: ["Tactless", "Commitment-shy", "Overconfident", "Can be reckless"],
    loveStyle:
      "Needs a partner who is also a best friend and fellow adventurer. Values freedom within relationships and shows love through shared experiences.",
    workStyle:
      "Thrives in roles involving travel, education, or big-picture strategy. Needs freedom and purpose. Gets restless in rigid structures.",
    communicationTips:
      "Be open-minded and honest. Enjoy philosophical debates. Don't try to restrict or box them in. Keep things optimistic.",
  },
  Capricorn: {
    sign: "Capricorn",
    overview:
      "Ambitious, disciplined, and wise beyond their years. Capricorn builds empires with patience and determination, valuing legacy and achievement.",
    strengths: ["Disciplined", "Responsible", "Self-controlled", "Strategic", "Patient"],
    watchOuts: ["Pessimistic", "Workaholic", "Emotionally guarded", "Can be condescending"],
    loveStyle:
      "Slow to open up but incredibly devoted once committed. Shows love through providing stability, loyalty, and long-term planning together.",
    workStyle:
      "Born for leadership and long-term projects. Excels in management, finance, and any role requiring strategy and discipline.",
    communicationTips:
      "Be respectful of their time. Come prepared with facts. Show ambition and reliability. Avoid excessive emotional displays early on.",
  },
  Aquarius: {
    sign: "Aquarius",
    overview:
      "Innovative, humanitarian, and delightfully unconventional. Aquarius thinks ahead of their time and champions causes that make the world better.",
    strengths: ["Progressive", "Independent", "Humanitarian", "Inventive", "Intellectual"],
    watchOuts: ["Emotionally detached", "Stubborn opinions", "Aloof", "Can be unpredictable"],
    loveStyle:
      "Values friendship as the foundation of love. Aquarius needs intellectual connection and shared values. May struggle with traditional romance but loves deeply in their own unique way.",
    workStyle:
      "Thrives in innovative and humanitarian fields. Excellent at seeing the big picture and challenging the status quo. Needs freedom to experiment.",
    communicationTips:
      "Engage their intellect with ideas and vision. Respect their need for independence. Be open to unconventional perspectives.",
  },
  Pisces: {
    sign: "Pisces",
    overview:
      "Dreamy, compassionate, and deeply creative. Pisces feels the world with extraordinary sensitivity and turns their emotions into art and healing.",
    strengths: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
    watchOuts: ["Escapist", "Overly trusting", "Self-pitying", "Can lose boundaries"],
    loveStyle:
      "The ultimate romantic who loves unconditionally. Pisces merges deeply with partners and creates a magical, almost fairy-tale love experience.",
    workStyle:
      "Excels in creative, healing, and spiritual fields. Deeply intuitive and empathetic. Needs a purpose-driven role to stay motivated.",
    communicationTips:
      "Be gentle and emotionally present. Use metaphors and stories. Don't be too harsh or blunt — lead with empathy.",
  },
};

export const COMPATIBILITY: Record<ZodiacSign, Compatibility> = {
  Aries: {
    bestFriends: [
      { sign: "Leo", reason: "Both fire signs who fuel each other's confidence and ambition" },
      { sign: "Sagittarius", reason: "Fellow adventurers who never run out of things to explore together" },
      { sign: "Gemini", reason: "Mental sparks fly — both love excitement and spontaneity" },
    ],
    bestRomance: [
      { sign: "Leo", reason: "A power couple full of passion, loyalty, and mutual admiration" },
      { sign: "Libra", reason: "Opposites attract — Libra's charm balances Aries' fire perfectly" },
      { sign: "Sagittarius", reason: "An adventure-filled romance that never gets boring" },
    ],
  },
  Taurus: {
    bestFriends: [
      { sign: "Cancer", reason: "Both value comfort, loyalty, and creating a safe inner circle" },
      { sign: "Virgo", reason: "Earth sign synergy — practical, reliable, and deeply supportive" },
      { sign: "Capricorn", reason: "Shared drive for stability and mutual respect for hard work" },
    ],
    bestRomance: [
      { sign: "Cancer", reason: "A nurturing, sensual match built on emotional security" },
      { sign: "Scorpio", reason: "Intense magnetic attraction with deep loyalty on both sides" },
      { sign: "Pisces", reason: "A dreamy, romantic pairing full of tenderness and devotion" },
    ],
  },
  Gemini: {
    bestFriends: [
      { sign: "Aries", reason: "Both love excitement and bring out each other's playful side" },
      { sign: "Leo", reason: "Social butterflies who light up every room together" },
      { sign: "Aquarius", reason: "Intellectual kindred spirits who love deep conversations" },
    ],
    bestRomance: [
      { sign: "Libra", reason: "Air sign harmony — great communicators who adore socializing together" },
      { sign: "Aquarius", reason: "A meeting of minds that keeps both mentally stimulated" },
      { sign: "Sagittarius", reason: "Opposites attract — adventure and intellectual passion abound" },
    ],
  },
  Cancer: {
    bestFriends: [
      { sign: "Taurus", reason: "Both cherish comfort, loyalty, and heartfelt connections" },
      { sign: "Scorpio", reason: "Water sign depth — they understand each other's emotional world" },
      { sign: "Pisces", reason: "Deeply empathetic bond where both feel truly seen" },
    ],
    bestRomance: [
      { sign: "Taurus", reason: "A cozy, devoted match built on trust and physical affection" },
      { sign: "Scorpio", reason: "Passionate and deeply emotional — a transformative love" },
      { sign: "Capricorn", reason: "Opposites attract — Cancer's warmth melts Capricorn's guard" },
    ],
  },
  Leo: {
    bestFriends: [
      { sign: "Aries", reason: "Fire sign energy — bold, fun, and always hyping each other up" },
      { sign: "Gemini", reason: "Social and witty — they bring the best conversations and laughs" },
      { sign: "Sagittarius", reason: "Adventurous and optimistic — the ultimate good-time duo" },
    ],
    bestRomance: [
      { sign: "Aries", reason: "Two fire signs creating an unstoppable, passionate romance" },
      { sign: "Libra", reason: "Leo's warmth meets Libra's charm — a glamorous love story" },
      { sign: "Sagittarius", reason: "A fun, freedom-loving match with endless excitement" },
    ],
  },
  Virgo: {
    bestFriends: [
      { sign: "Taurus", reason: "Grounded and practical — they build a rock-solid friendship" },
      { sign: "Cancer", reason: "Both caring and thoughtful — nurture each other naturally" },
      { sign: "Capricorn", reason: "Ambitious earth signs who respect each other's discipline" },
    ],
    bestRomance: [
      { sign: "Taurus", reason: "A stable, sensual match where both feel safe to be themselves" },
      { sign: "Scorpio", reason: "Deep connection — both value loyalty and see beneath the surface" },
      { sign: "Capricorn", reason: "Power couple energy — building a lasting empire together" },
    ],
  },
  Libra: {
    bestFriends: [
      { sign: "Gemini", reason: "Air sign magic — endless conversations and social adventures" },
      { sign: "Leo", reason: "Both love beauty, fun, and making every moment special" },
      { sign: "Aquarius", reason: "Intellectual connection with shared humanitarian values" },
    ],
    bestRomance: [
      { sign: "Gemini", reason: "A lively, communicative romance full of charm and wit" },
      { sign: "Leo", reason: "A stunning match of warmth, romance, and mutual admiration" },
      { sign: "Aries", reason: "Opposites attract — passion meets diplomacy for fiery balance" },
    ],
  },
  Scorpio: {
    bestFriends: [
      { sign: "Cancer", reason: "Deep emotional understanding and fierce mutual loyalty" },
      { sign: "Virgo", reason: "Both analytical and loyal — they see through the noise together" },
      { sign: "Pisces", reason: "Water sign trio — intuitive connection on a soul level" },
    ],
    bestRomance: [
      { sign: "Cancer", reason: "Emotionally rich and deeply committed — a powerful love" },
      { sign: "Taurus", reason: "Magnetic attraction with unshakable loyalty and devotion" },
      { sign: "Pisces", reason: "A spiritual, passionate bond that transcends the ordinary" },
    ],
  },
  Sagittarius: {
    bestFriends: [
      { sign: "Aries", reason: "Adventure buddies who push each other to explore and grow" },
      { sign: "Leo", reason: "Big energy, big laughs — the life of every party together" },
      { sign: "Aquarius", reason: "Free spirits who respect each other's independence" },
    ],
    bestRomance: [
      { sign: "Aries", reason: "A fiery, adventurous love that keeps both on their toes" },
      { sign: "Leo", reason: "Passionate and fun — a romance full of warmth and excitement" },
      { sign: "Gemini", reason: "Opposites attract — endless curiosity and mental stimulation" },
    ],
  },
  Capricorn: {
    bestFriends: [
      { sign: "Taurus", reason: "Both value stability, ambition, and showing up consistently" },
      { sign: "Virgo", reason: "Detail-oriented duo who help each other reach their goals" },
      { sign: "Scorpio", reason: "Intense mutual respect and strategic thinking in common" },
    ],
    bestRomance: [
      { sign: "Taurus", reason: "A devoted, sensual match built on shared values and patience" },
      { sign: "Virgo", reason: "A thoughtful, ambitious partnership that withstands time" },
      { sign: "Cancer", reason: "Opposites attract — emotional depth meets steadfast ambition" },
    ],
  },
  Aquarius: {
    bestFriends: [
      { sign: "Gemini", reason: "Intellectual kindred spirits who never run out of ideas" },
      { sign: "Libra", reason: "Both social and idealistic — a friendship built on shared vision" },
      { sign: "Sagittarius", reason: "Free-spirited adventurers who champion each other's uniqueness" },
    ],
    bestRomance: [
      { sign: "Gemini", reason: "A stimulating, freedom-respecting match of brilliant minds" },
      { sign: "Libra", reason: "Harmonious and intellectually matched — a beautiful partnership" },
      { sign: "Sagittarius", reason: "An unconventional romance full of travel and big ideas" },
    ],
  },
  Pisces: {
    bestFriends: [
      { sign: "Cancer", reason: "Both deeply empathetic — they create a safe emotional world" },
      { sign: "Scorpio", reason: "Intuitive and loyal — water sign magic at its finest" },
      { sign: "Taurus", reason: "Taurus grounds Pisces while Pisces inspires Taurus's imagination" },
    ],
    bestRomance: [
      { sign: "Cancer", reason: "A fairy-tale romance built on emotional depth and tenderness" },
      { sign: "Scorpio", reason: "Soul-deep passion and spiritual connection like no other" },
      { sign: "Taurus", reason: "A sweet, sensual love story where both feel cherished" },
    ],
  },
};

// Fallback daily readings when no OpenAI key is available
const DAILY_QUOTES: Record<ZodiacSign, string[]> = {
  Aries: [
    "Your courage today could spark a chain reaction of positive change.",
    "Channel your fire into focus — the world needs your leadership.",
    "Bold moves are calling. Trust your instincts and lead the way.",
  ],
  Taurus: [
    "Slow and steady doesn't mean standing still — trust your pace.",
    "Your patience today plants seeds for tomorrow's abundance.",
    "Comfort is your superpower. Create beauty wherever you go.",
  ],
  Gemini: [
    "Your words carry extra magic today — use them wisely.",
    "Curiosity is your compass. Follow it without overthinking.",
    "Two paths appear — your adaptability means you can explore both.",
  ],
  Cancer: [
    "Your intuition is your greatest guide today. Listen deeply.",
    "Nurture yourself first — you can't pour from an empty shell.",
    "Home is wherever your heart feels safe. Create that today.",
  ],
  Leo: [
    "Your light is needed today. Don't dim yourself for anyone.",
    "Generosity returns tenfold — lead with your warm heart.",
    "The spotlight is yours. Step into it with grace and confidence.",
  ],
  Virgo: [
    "Perfection is the enemy of progress. Move forward imperfectly today.",
    "Your keen eye catches what others miss — trust your analysis.",
    "Small acts of service ripple into huge waves of change.",
  ],
  Libra: [
    "Balance isn't static — it's a dance. Enjoy the rhythm today.",
    "Your diplomacy heals bridges today. Lean into harmony.",
    "Beauty surrounds you. Take time to notice and appreciate it.",
  ],
  Scorpio: [
    "Transformation begins with a single honest moment. Be brave today.",
    "Your depth is your gift. Not everyone earns access — that's okay.",
    "Let go of what no longer serves you. Rebirth awaits.",
  ],
  Sagittarius: [
    "Adventure doesn't require a plane ticket — find it in your mindset.",
    "Your optimism is contagious. Spread it generously today.",
    "The truth shall set you free — speak it with compassion.",
  ],
  Capricorn: [
    "Every empire started with a single disciplined step. Take yours today.",
    "Rest is not weakness — even mountains need their stillness.",
    "Your legacy is being built right now. Make it count.",
  ],
  Aquarius: [
    "Your unique perspective is exactly what the world needs today.",
    "Innovation starts with questioning the norm. Keep questioning.",
    "Connect with your community — together you're unstoppable.",
  ],
  Pisces: [
    "Your dreams are messages. Pay attention to them today.",
    "Compassion is your superpower — but remember to include yourself.",
    "Create something today. Your imagination is a portal to healing.",
  ],
};

const DAILY_THEMES = [
  "Self-reflection", "Growth", "Connection", "Courage", "Balance",
  "Creativity", "Trust", "Release", "Abundance", "Patience",
];

export function getFallbackDailyReading(sign: ZodiacSign, dateStr: string) {
  // Use date to deterministically pick content
  const dateNum = dateStr.split("-").join("").split("").reduce((a, b) => a + parseInt(b), 0);
  const profile = SIGN_PROFILES[sign];

  // Prefer date-keyed daily quote (365 unique per sign)
  const dateObj = new Date(dateStr);
  const dailyQuote = getDailyQuote(sign, isNaN(dateObj.getTime()) ? new Date() : dateObj);

  // Prefer rich zodiac data when available
  const richData = getSignData(sign);
  const quotes = richData?.dailyQuotes ?? DAILY_QUOTES[sign];
  const quote = dailyQuote || quotes[dateNum % quotes.length];
  const theme = DAILY_THEMES[dateNum % DAILY_THEMES.length];

  const strengths = richData?.strengths?.list ?? profile.strengths;
  const weaknesses = richData?.weaknesses?.list ?? profile.watchOuts;

  return {
    quote,
    theme,
    readingText: `Today's energy invites you to lean into your ${strengths[dateNum % strengths.length].toLowerCase()} nature. As a ${sign}, the theme of ${theme.toLowerCase()} speaks directly to your path right now. Consider how you can apply this energy to your daily interactions and personal goals. Remember, the stars guide but you choose.`,
    action: `Practice your natural ${strengths[(dateNum + 1) % strengths.length].toLowerCase()} energy by doing one thing today that aligns with this strength.`,
    avoid: `Watch out for ${weaknesses[dateNum % weaknesses.length].toLowerCase()} tendencies — awareness is the first step.`,
  };
}
