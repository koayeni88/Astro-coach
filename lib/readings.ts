import { ZodiacSign } from "./zodiac";

// Weekly reading themes
const WEEKLY_THEMES = [
  "Self-Discovery", "Abundance", "Relationships", "Transformation",
  "Creativity", "Balance", "Adventure", "Healing", "Ambition",
  "Connection", "Renewal", "Clarity", "Courage", "Patience",
  "Gratitude", "Purpose", "Release", "Trust", "Growth", "Wisdom",
  "Harmony", "Independence", "Compassion", "Determination",
  "Joy", "Intuition", "Empowerment", "Serenity", "Focus", "Love",
  "Strength", "Freedom", "Vision", "Resilience", "Grace",
  "Innovation", "Devotion", "Authenticity", "Expansion", "Peace",
  "Reflection", "Breakthrough", "Nurturing", "Discipline",
  "Exploration", "Surrender", "Optimism", "Foundation",
  "Expression", "Abundance", "Awakening", "Momentum",
];

// Monthly focus areas per sign
const MONTHLY_FOCUS: Record<ZodiacSign, string[]> = {
  Aries: ["Leadership", "Self-care", "Financial planning", "Relationships", "Adventure", "Career moves", "Health reset", "Creative projects", "Networking", "Goal setting", "Spiritual growth", "New beginnings"],
  Taurus: ["Stability", "Romance", "Investments", "Self-worth", "Home improvement", "Wellness routine", "Artistic expression", "Boundaries", "Career growth", "Family bonds", "Financial review", "Relaxation"],
  Gemini: ["Communication", "Learning", "Social connections", "Writing projects", "Mental health", "Travel plans", "Partnership review", "Skill building", "Self-expression", "Technology", "Meditation", "Networking"],
  Cancer: ["Home & family", "Emotional healing", "Finances", "Self-nurturing", "Career direction", "Relationships", "Health focus", "Creative outlet", "Boundaries", "Intuition", "Community", "Inner peace"],
  Leo: ["Self-expression", "Romance", "Career spotlight", "Creativity", "Health & fitness", "Leadership", "Fun & play", "Financial goals", "Friendships", "Personal brand", "Spiritual practice", "Celebration"],
  Virgo: ["Organization", "Health routine", "Service to others", "Skill development", "Work-life balance", "Relationships", "Financial planning", "Personal growth", "De-cluttering", "Mental wellness", "Nature connection", "Reflection"],
  Libra: ["Partnerships", "Beauty & aesthetics", "Balance", "Social life", "Justice & fairness", "Self-care", "Career harmony", "Art & culture", "Decision making", "Financial balance", "Spiritual connection", "New connections"],
  Scorpio: ["Transformation", "Intimacy", "Financial power", "Self-discovery", "Healing old wounds", "Research", "Shared resources", "Personal power", "Trust building", "Mystery & depth", "Regeneration", "Inner truth"],
  Sagittarius: ["Adventure", "Higher learning", "Travel", "Philosophy", "Optimism", "Freedom", "Teaching", "Cultural exploration", "Fitness goals", "Publishing", "Spiritual journey", "Big-picture planning"],
  Capricorn: ["Career goals", "Discipline", "Legacy building", "Structure", "Patience", "Financial mastery", "Leadership", "Reputation", "Long-term planning", "Health foundations", "Mentorship", "Achievement"],
  Aquarius: ["Innovation", "Community", "Humanitarian goals", "Technology", "Individuality", "Friendships", "Future planning", "Social causes", "Eccentricity", "Group projects", "Intellectual pursuits", "Revolution"],
  Pisces: ["Spiritual growth", "Creativity", "Compassion", "Dreams & intuition", "Healing arts", "Emotional processing", "Artistic expression", "Solitude", "Boundaries", "Imagination", "Service", "Transcendence"],
};

export function getWeeklyReading(sign: ZodiacSign, weekOfYear: number) {
  const themeIndex = (weekOfYear + sign.charCodeAt(0)) % WEEKLY_THEMES.length;
  const theme = WEEKLY_THEMES[themeIndex];
  const focus = MONTHLY_FOCUS[sign][new Date().getMonth()];
  
  const overviews: Record<ZodiacSign, string> = {
    Aries: `This week asks you to channel your warrior spirit with more precision. The theme of ${theme.toLowerCase()} aligns with your fiery nature, but suggests a more strategic approach. Your natural boldness serves you best when paired with thoughtful planning. Mid-week brings an opportunity for connection — don't let impatience push it away.`,
    Taurus: `Stability meets transformation this week as ${theme.toLowerCase()} takes center stage. Your grounded nature is your greatest asset now — use it to build something lasting. A financial or material matter may require your attention. Trust your senses and take your time with important decisions.`,
    Gemini: `Your dual nature finds harmony this week through ${theme.toLowerCase()}. Communication is highlighted — you may have an important conversation that shifts your perspective. Stay curious but commit to following through on at least one idea. Your versatility is needed, but so is your focus.`,
    Cancer: `This week invites emotional growth through ${theme.toLowerCase()}. Your intuition is especially strong — trust those gut feelings. A family or home matter may need your nurturing touch. Create safe spaces for yourself and others. Your sensitivity is your strength, not your weakness.`,
    Leo: `The cosmic spotlight shines on ${theme.toLowerCase()} this week. Your natural charisma draws others in, and leadership opportunities arise. Channel your warmth into a creative project or meaningful cause. Remember that true royalty is about service, not just recognition.`,
    Virgo: `Precision meets purpose this week as ${theme.toLowerCase()} guides your path. Your analytical mind can solve a puzzle that's been bothering you. Pay attention to the details but don't lose sight of the bigger picture. A health or wellness adjustment may bring surprising benefits.`,
    Libra: `Balance shifts and realigns this week around ${theme.toLowerCase()}. Relationships take the spotlight — a conversation about fairness or values may be needed. Your diplomatic skills are your superpower right now. Make decisions from your heart, not just your head.`,
    Scorpio: `Intensity meets insight this week through ${theme.toLowerCase()}. Your transformative powers are amplified. Something hidden may come to light, bringing clarity. Trust your ability to navigate the depths. What you release now makes space for something powerful.`,
    Sagittarius: `Adventure calls through the lens of ${theme.toLowerCase()} this week. Your optimism serves as a beacon for others. An opportunity for learning or travel may present itself. Stay open to new philosophies but honor your own truth. The journey matters more than the destination.`,
    Capricorn: `Structure and ambition meet ${theme.toLowerCase()} this week. Your disciplined approach yields results, but leave room for spontaneity. A career matter may require your strategic mind. Build with patience — the foundations you set now last for years.`,
    Aquarius: `Innovation and community align with ${theme.toLowerCase()} this week. Your unique perspective is exactly what's needed. A group project or social cause may benefit from your vision. Stay true to your individuality while honoring your connections. The future is being shaped by your choices.`,
    Pisces: `Dreamtime meets reality through ${theme.toLowerCase()} this week. Your creative and spiritual energies are heightened. Trust the visions and feelings that surface. A compassionate act creates ripples you can't yet see. Ground your dreams in small, daily actions.`,
  };

  const loveReadings: Record<ZodiacSign, string> = {
    Aries: "Passion runs high this week. If single, an unexpected encounter sparks your interest. Coupled Aries should channel intensity into quality time, not arguments. A bold romantic gesture pays off mid-week.",
    Taurus: "Sensual connections deepen this week. Plan a cozy evening with someone special. Singles may find attraction in familiar places. Let your loyalty shine — it's your most magnetic quality right now.",
    Gemini: "Flirty conversations could become something deeper. Your words are your love language this week — use them wisely. Couples benefit from intellectual stimulation. Try something new together.",
    Cancer: "Emotional intimacy is your superpower. A heart-to-heart conversation brings you closer to a loved one. Singles should trust their gut about new connections. Home-based dates feel magical.",
    Leo: "Romance is in the spotlight! Your natural warmth attracts admirers. Couples should make time for playful dates. Singles, let your confidence shine — someone is watching with admiration.",
    Virgo: "Acts of service speak louder than words now. Show love through thoughtful gestures. A practical conversation about the future strengthens bonds. Singles may meet someone through work or health routines.",
    Libra: "Harmony in partnerships is key. Address any imbalances with grace. Your charm is irresistible this week. Singles attract connections through social events or artistic pursuits.",
    Scorpio: "Deep emotional connections intensify. Trust and vulnerability open new doors. Couples experience a breakthrough in intimacy. Singles are magnetically drawn to someone mysterious.",
    Sagittarius: "Adventure fuels romance this week. Plan something spontaneous with your partner. Singles may find love while traveling or learning. Keep things light and fun — no pressure.",
    Capricorn: "Serious romance conversations go well this week. If you've been thinking about the future, share your thoughts. Singles attract mature, grounded partners. Quality over quantity in love.",
    Aquarius: "Unconventional connections spark joy. Friendships may evolve into something more. Couples benefit from giving each other space. Singles, look beyond your usual type.",
    Pisces: "Romantic dreams feel especially vivid. Trust your intuition about love matters. Couples should plan a dreamy date. Singles may feel a soul-deep connection with someone new.",
  };

  const careerReadings: Record<ZodiacSign, string> = {
    Aries: "A leadership opportunity presents itself. Take the initiative on a stalled project. Your competitive edge gives you an advantage, but collaborate when needed. Financial gains come through bold action.",
    Taurus: "Steady progress yields results at work. A financial matter requires your patient attention. Don't rush decisions about investments or career moves. Your reliability earns trust from higher-ups.",
    Gemini: "Communication skills open new doors. A presentation or pitch goes well. Network actively — the right connection could change your trajectory. Multi-tasking is your strength but prioritize the big wins.",
    Cancer: "Trust your instincts about a work situation. A nurturing approach to leadership wins allies. Financial security improves through careful planning. Consider a side project connected to your passions.",
    Leo: "Your creative vision gets recognized. A project you've led gains momentum. Financial opportunities come through your network. Stay generous but ensure your contributions are properly credited.",
    Virgo: "Your attention to detail saves the day. Organize, analyze, and optimize — these are your career superpowers this week. A health or wellness professional opportunity emerges. Finances benefit from careful budgeting.",
    Libra: "Partnerships and collaborations flourish at work. Your ability to negotiate and mediate is invaluable. Financial decisions benefit from getting a second opinion. Balance work ambition with personal well-being.",
    Scorpio: "Strategic thinking gives you an edge. Research and investigation uncover valuable information. A power dynamic shifts in your favor. Financial transformation is possible — look at investments or debt restructuring.",
    Sagittarius: "Expand your professional horizons. International or educational opportunities beckon. Your optimism motivates your team. Financial luck comes through taking calculated risks on new ventures.",
    Capricorn: "Your long-term planning pays dividends. A promotion or recognition is within reach. Financial discipline creates stability. Mentor someone younger — it strengthens your own leadership skills.",
    Aquarius: "Innovative ideas get traction. Technology or community-focused projects thrive. Your unique approach solves a lingering problem. Financial decisions should align with your values, not just practicality.",
    Pisces: "Creative work flourishes this week. Trust your artistic instincts in professional settings. A compassionate approach to a work conflict resolves it. Financial intuition is strong — listen to it.",
  };

  const wellnessReadings: Record<ZodiacSign, string> = {
    Aries: "Channel excess energy through vigorous exercise. Your body craves movement — try a new sport or workout class. Watch for headaches caused by tension. Prioritize sleep to fuel your fire.",
    Taurus: "Slow, sensory wellness practices restore you. Try a relaxing bath, massage, or nature walk. Your throat and neck need attention. Nourish yourself with wholesome, delicious foods.",
    Gemini: "Mental wellness is the priority. Give your busy mind a break through meditation or journaling. Your hands and arms may need stretching. Social wellness matters too — connect with uplifting friends.",
    Cancer: "Emotional wellness takes center stage. Honor your feelings without drowning in them. Stomach and digestive health benefit from mindful eating. Create a comforting evening routine.",
    Leo: "Heart-centered wellness serves you best. Cardio exercise boosts your mood and vitality. Your back and spine need care — try yoga or stretching. Spend time doing something purely joyful.",
    Virgo: "Your body is telling you something — listen. Fine-tune your diet and supplement routine. Digestive wellness improves with probiotics and whole foods. Don't let perfectionism become a source of stress.",
    Libra: "Balance is everything for your wellness this week. Alternate between activity and rest. Your kidneys and lower back benefit from hydration and gentle movement. Beauty routines feel especially restorative.",
    Scorpio: "Deep healing work is powerful now. Consider therapy, energy work, or transformative practices. Reproductive and hormonal health may need attention. Intense exercise helps process heavy emotions.",
    Sagittarius: "Outdoor activities boost your well-being. Hiking, cycling, or anything adventurous lifts your spirits. Your hips and thighs benefit from stretching. Keep a positive mindset — it's your best medicine.",
    Capricorn: "Structural wellness matters — focus on bones, joints, and posture. Consistent routines serve your health better than dramatic changes. Allow yourself periods of rest without guilt. Knee care is especially important.",
    Aquarius: "Unconventional wellness practices intrigue you. Try breathwork, cold therapy, or a new form of exercise. Your ankles and circulation need attention. Social wellness recharges your unique energy.",
    Pisces: "Spiritual and creative wellness restore your soul. Meditation, music, and water-based activities heal you. Your feet need extra care. Watch for escapist tendencies — face feelings rather than numbing them.",
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const luckyDayIndex = (weekOfYear + sign.charCodeAt(0)) % 7;
  const luckyNumber = ((weekOfYear * 7 + sign.charCodeAt(0)) % 99) + 1;

  return {
    theme,
    overview: overviews[sign] || overviews.Aries,
    love: loveReadings[sign] || loveReadings.Aries,
    career: careerReadings[sign] || careerReadings.Aries,
    wellness: wellnessReadings[sign] || wellnessReadings.Aries,
    luckyDay: days[luckyDayIndex],
    luckyNumber,
    weekNumber: weekOfYear,
  };
}

export function getMonthlyReading(sign: ZodiacSign, month: number) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[month - 1] || "This month";
  const focus = MONTHLY_FOCUS[sign][(month - 1) % 12];
  
  const overviews: Record<ZodiacSign, string> = {
    Aries: `${monthName} brings a powerful surge of energy for you. The focus on ${focus.toLowerCase()} speaks directly to your core desire for forward motion. The first half of the month is ideal for initiating projects and having courageous conversations. Around mid-month, a shift in perspective allows you to see situations from new angles. The closing weeks are perfect for consolidation — gather your wins and prepare for what's next. Your ruling planet Mars supports bold action, but remember: strategic patience multiplies your impact.`,
    Taurus: `${monthName} invites you into deeper alignment with ${focus.toLowerCase()}. This is a month for strengthening foundations and enjoying the fruits of your labor. Financial matters may need your steady attention, and your natural patience serves you well. Venus, your ruler, encourages you to beautify your environment and nurture your relationships. Mid-month brings an opportunity that aligns values with action. By month's end, you'll feel more grounded and secure in your direction.`,
    Gemini: `${monthName} activates your gift for ${focus.toLowerCase()}. Your mind is especially sharp and your social calendar may bustle with meaningful connections. Mercury, your ruler, supports learning and communication — perfect for any projects involving words, ideas, or technology. Around mid-month, a surprise insight bridges two areas of your life in an unexpected way. The final week asks you to slow down and integrate what you've learned.`,
    Cancer: `${monthName} centers on ${focus.toLowerCase()}, touching the deepest parts of your emotional world. The Moon, your ruler, takes you on a journey of feeling and healing. The first week may bring nostalgic reflections. Mid-month opens doors for emotional breakthroughs in relationships. By the final week, you'll have a clearer sense of what truly nourishes your soul. Honor your need for safety while expanding your comfort zone.`,
    Leo: `${monthName} lights up your path with ${focus.toLowerCase()}. Your solar-powered charisma is magnetic, and others are drawn to your warmth and vision. Creative projects flourish in the first half. Around mid-month, a leadership opportunity tests your ability to lead with humility. The Sun, your ruler, supports self-expression and joy. Close the month by celebrating your authentic self and those who truly see you.`,
    Virgo: `${monthName} is your cosmic invitation to embrace ${focus.toLowerCase()}. Your meticulous nature finds its perfect outlet. Mercury guides your analytical powers to new heights — use them for both practical matters and self-understanding. Mid-month may present a health or wellness insight worth exploring. The final week rewards your dedication with tangible progress. Remember: your worth isn't measured by your productivity alone.`,
    Libra: `${monthName} brings ${focus.toLowerCase()} to the forefront of your awareness. Venus graces your social connections and aesthetic sensibilities. The first weeks are ideal for collaborative projects and relationship-building. A potential imbalance mid-month reminds you that saying "no" is also an act of harmony. Close the month with clarity about what partnerships truly serve your highest good.`,
    Scorpio: `${monthName} plunges you into the depths of ${focus.toLowerCase()}. Pluto, your modern ruler, intensifies everything you touch — use this power wisely. The first half is magnetic for research, investigation, and deep emotional work. Mid-month may bring a revelation that transforms your perspective. By month's end, what you've released creates space for rebirth. Trust the phoenix within you.`,
    Sagittarius: `${monthName} expands your horizons through ${focus.toLowerCase()}. Jupiter, your ruler, opens doors to learning, travel, and philosophical growth. The first weeks are perfect for exploration and saying "yes" to new experiences. Mid-month asks you to balance freedom with commitment. The final week is ideal for sharing your wisdom with others. Your optimism is not naivety — it's visionary faith.`,
    Capricorn: `${monthName} reinforces your focus on ${focus.toLowerCase()}. Saturn, your ruler, rewards long-term thinking and disciplined effort. Build on the structures you've been developing — the results compound over time. Mid-month may test your patience, but remember: every master was once a beginner. Close the month by acknowledging how far you've come. Your legacy is being built brick by brick.`,
    Aquarius: `${monthName} electrifies your world with ${focus.toLowerCase()}. Uranus sparks innovation and unexpected shifts. The first half is ideal for brainstorming, connecting with like-minded people, and challenging conventions. Mid-month may bring a breakthrough that rewires your thinking. By month's end, your vision for the future is clearer. Your uniqueness isn't a flaw — it's your contribution to the collective.`,
    Pisces: `${monthName} immerses you in ${focus.toLowerCase()}. Neptune, your ruler, heightens your sensitivity and creativity. Dreams may carry important messages in the first week. Mid-month is perfect for artistic expression and spiritual practices. The final weeks ask you to set gentle boundaries while maintaining your compassionate nature. Trust that your intuition knows things your mind hasn't yet grasped.`,
  };

  const challenges: Record<ZodiacSign, string> = {
    Aries: "Impatience may tempt you to rush through important decisions. Channel your competitive fire constructively — not every situation needs a winner. Watch for burnout from overcommitting. Your challenge is to lead with listening, not just action.",
    Taurus: "Stubbornness could create friction in relationships or at work. Your desire for stability might resist necessary changes. Financial comfort zones need occasional challenging. Practice flexibility without losing your grounding.",
    Gemini: "Mental overwhelm is the biggest risk this month. Too many options may lead to analysis paralysis. Scattered focus weakens your impact. The challenge is depth over breadth — commit fully to fewer things.",
    Cancer: "Emotional sensitivity could lead to retreating into your shell. Past hurts may resurface asking for healing. Boundaries between caring for others and self-care need attention. Avoid taking things too personally.",
    Leo: "Ego and pride may cloud your judgment mid-month. The need for validation could drive decisions that don't serve your authentic self. Share the spotlight generously. Remember that vulnerability is not weakness.",
    Virgo: "Perfectionism is your shadow this month. Self-criticism could undermine your confidence. Overthinking prevents you from enjoying your achievements. The challenge is embracing 'good enough' and celebrating progress.",
    Libra: "People-pleasing may drain your energy. Avoiding conflict only delays resolution. Indecision about a key matter needs addressing. The challenge is asserting your needs without guilt.",
    Scorpio: "Control issues may intensify. Trust challenges surface in key relationships. The urge to investigate or obsess over a situation needs tempering. Your challenge is letting go of what you can't control.",
    Sagittarius: "Over-optimism could lead to overcommitting. Restlessness may disrupt consistency. The desire for freedom clashes with responsibilities. Your challenge is finding adventure within your current commitments.",
    Capricorn: "Workaholism threatens your well-being. The pressure you put on yourself exceeds external expectations. Rigidity in your plans may miss better opportunities. Your challenge is balancing ambition with self-compassion.",
    Aquarius: "Detachment from emotions may frustrate loved ones. Rebelliousness without purpose wastes your innovative energy. The challenge is connecting your brilliant ideas with practical execution.",
    Pisces: "Escapism tempts you when reality feels overwhelming. Boundary issues with energy vampires need addressing. Creative blocks may stem from unprocessed emotions. Your challenge is staying grounded while honoring your sensitivity.",
  };

  const advice: Record<ZodiacSign, string> = {
    Aries: "Pause before reacting — your future self will thank you. Channel your fire into one priority project this month. Celebrate small victories along the way. Physical activity is essential for processing your intense energy. Trust that patience doesn't mean passivity.",
    Taurus: "Review your financial goals and adjust as needed. Treat yourself to something that nourishes your senses. Strengthen the relationships that truly matter. A home improvement project could shift your energy beautifully. Trust the slow and steady path.",
    Gemini: "Pick your top three priorities and protect your focus. Write down ideas instead of chasing them all. Deepen one conversation instead of having ten surface ones. Your greatest growth comes from integration, not accumulation.",
    Cancer: "Honor your emotional landscape without drowning in it. Create a daily ritual that makes your home feel sacred. Have the vulnerable conversation you've been avoiding. Nourish yourself first — you can't pour from an empty cup.",
    Leo: "Share your vision with trusted allies who can help bring it to life. Create something purely for joy, without an audience. Lead a project that serves others. Your generosity of spirit is your most attractive quality.",
    Virgo: "Schedule rest as seriously as you schedule work. Focus on systems that serve your wellbeing, not just productivity. Celebrate what you've accomplished before setting new goals. Your body's wisdom is as important as your mind's analysis.",
    Libra: "Make the decision you've been postponing — trust your judgment. Invest in the partnership that brings out your best self. Create beauty in your environment — it recharges your spirit. Balance comes from honoring all parts of yourself.",
    Scorpio: "Channel your intensity into transformation rather than control. Share something vulnerable with someone you trust. Focus your research skills on personal growth. The power you seek is already within you — no external source needed.",
    Sagittarius: "Plan an adventure, even a small local one. Share your philosophy through teaching or writing. Balance exploration with gratitude for where you are. Your enthusiasm is contagious — use it to inspire positive change around you.",
    Capricorn: "Celebrate a milestone, no matter how small. Delegate one task you've been holding onto. Invest in a long-term goal with renewed discipline. Allow yourself joy in the journey, not just the destination.",
    Aquarius: "Connect with your community around a shared cause. Experiment with one unconventional approach at work. Share your vision for the future and invite collaboration. Remember that emotions are data too — not just logic.",
    Pisces: "Dedicate time to creative expression without judgment. Meditate or practice a spiritual ritual daily. Set one clear boundary that protects your energy. Your sensitivity is a gift — learn to channel it rather than be overwhelmed by it.",
  };

  const bestDays = getBestDays(sign, month);
  
  return {
    theme: `${monthName}: ${focus}`,
    overview: overviews[sign] || overviews.Aries,
    highlights: [
      `Primary focus: ${focus}`,
      `Power color: ${getPowerColor(sign, month)}`,
      `Lucky number: ${getLuckyNumber(sign, month)}`,
      `Ruling energy supports ${focus.toLowerCase()} pursuits`,
    ],
    challenges: challenges[sign] || challenges.Aries,
    advice: advice[sign] || advice.Aries,
    bestDays,
    focusArea: focus,
  };
}

function getBestDays(sign: ZodiacSign, month: number): string {
  const offset = sign.charCodeAt(0) % 7;
  const day1 = ((offset + month * 3) % 28) + 1;
  const day2 = ((offset + month * 7) % 28) + 1;
  const day3 = ((offset + month * 11) % 28) + 1;
  return [day1, day2, day3].sort((a, b) => a - b).join(", ");
}

function getPowerColor(sign: ZodiacSign, month: number): string {
  const colors = ["Ruby Red", "Emerald Green", "Sapphire Blue", "Golden Yellow", "Deep Purple", "Rose Pink", "Silver White", "Midnight Blue", "Coral Orange", "Forest Green", "Amethyst Violet", "Ocean Teal"];
  return colors[(sign.charCodeAt(0) + month) % colors.length];
}

function getLuckyNumber(sign: ZodiacSign, month: number): number {
  return ((sign.charCodeAt(0) + month * 3) % 99) + 1;
}

export function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / (1000 * 60 * 60 * 24) + start.getDay() + 1) / 7);
}

// Affirmations per sign
const AFFIRMATIONS: Record<ZodiacSign, string[]> = {
  Aries: ["I am bold, courageous, and ready for anything.", "My inner fire lights the way for others.", "I lead with both passion and compassion.", "I am worthy of the success I create.", "Every challenge makes me stronger."],
  Taurus: ["I am grounded, steady, and abundantly blessed.", "I deserve comfort, beauty, and stability.", "My patience is my greatest strength.", "I attract wealth and prosperity effortlessly.", "I am rooted in my values and unshakeable."],
  Gemini: ["My curiosity leads me to wisdom.", "I communicate with clarity and charm.", "I embrace all sides of who I am.", "My adaptability is a superpower.", "I connect minds and hearts wherever I go."],
  Cancer: ["My sensitivity is my superpower.", "I nurture myself with the same love I give others.", "My intuition always guides me true.", "I create safe spaces for healing and growth.", "I am worthy of deep, unconditional love."],
  Leo: ["I shine brightly and unapologetically.", "My warmth inspires and uplifts everyone.", "I lead with generosity and courage.", "I am worthy of all the love and attention I receive.", "My creativity transforms the world."],
  Virgo: ["I am perfectly imperfect and that is enough.", "My attention to detail creates excellence.", "I serve the world by being my best self.", "I release the need for perfection and embrace progress.", "My analytical mind solves any challenge."],
  Libra: ["I create harmony wherever I go.", "My relationships reflect my inner balance.", "I make decisions with confidence and grace.", "Beauty flows through me into the world.", "I deserve partnerships that honor my worth."],
  Scorpio: ["I transform pain into wisdom and power.", "My depth is my greatest gift.", "I release what no longer serves my evolution.", "I am magnetic, powerful, and deeply authentic.", "Every ending brings a more powerful beginning."],
  Sagittarius: ["The universe conspires in my favor.", "My optimism creates my reality.", "I am free to explore, learn, and grow.", "My truth is my compass.", "Adventure and meaning are my birthright."],
  Capricorn: ["I build empires with patience and vision.", "My discipline creates the freedom I desire.", "I am worthy of rest and celebration.", "Every step brings me closer to my legacy.", "I honor my ambition and trust my timing."],
  Aquarius: ["My uniqueness is my contribution to humanity.", "I think beyond boundaries and create the future.", "My independence fuels my purpose.", "I connect with my community while honoring my individuality.", "Innovation flows through me naturally."],
  Pisces: ["My dreams are messages from my soul.", "I am compassionate, creative, and deeply wise.", "I honor my sensitivity as sacred.", "I move between worlds with grace.", "My imagination is a portal to healing."],
};

export function getDailyAffirmation(sign: ZodiacSign, date?: Date): string {
  const d = date || new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const affirmations = AFFIRMATIONS[sign];
  return affirmations[dayOfYear % affirmations.length];
}

// Journal prompts based on sign and cosmic energy
export function getReflectionPrompt(sign: ZodiacSign, date?: Date): string {
  const d = date || new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const prompts = [
    `As a ${sign}, what strength did you lean into today?`,
    `What would your ${sign} self 5 years from now tell you right now?`,
    `How did your ${sign} energy show up in your interactions today?`,
    `What fear did you face or notice today? How did your ${sign} nature help?`,
    `What are you grateful for right now, through the lens of your ${sign} wisdom?`,
    `If your zodiac element could speak, what would it say about your day?`,
    `What pattern did you notice in yourself today that you'd like to shift?`,
    `How can you honor your ${sign} nature more fully tomorrow?`,
    `What small victory today reflects your ${sign} strength?`,
    `What does your ideal day look like, aligned with your ${sign} energy?`,
  ];
  
  return prompts[dayOfYear % prompts.length];
}
