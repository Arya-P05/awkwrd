/**
 * Preference Analysis Service
 * Analyzes swipe patterns to understand user preferences for AI generation
 */

import {
  CategoryId,
  UserPreferences,
  QuestionHistoryData,
  SwipeRecord,
} from "./types";
import { getFullHistory, saveQuestionHistory } from "./questionStorage";
import baseQuestions from "../../questions.json";

// Keywords that indicate question themes/types
const THEME_KEYWORDS = {
  deep: [
    "regret",
    "trauma",
    "fear",
    "vulnerable",
    "honest",
    "secret",
    "hardest",
    "worst",
    "painful",
    "heal",
    "lonely",
    "cry",
    "death",
    "love",
    "heart",
  ],
  playful: [
    "favorite",
    "would you rather",
    "if you could",
    "best",
    "funniest",
    "craziest",
    "weirdest",
    "embarrassing",
    "guilty pleasure",
  ],
  spicy: [
    "sex",
    "hook up",
    "turn on",
    "turn off",
    "kiss",
    "attraction",
    "body",
    "intimate",
    "fantasy",
    "bedroom",
  ],
  practical: [
    "money",
    "finance",
    "career",
    "work",
    "family",
    "kids",
    "marriage",
    "future",
    "plan",
    "goal",
  ],
  social: [
    "friend",
    "party",
    "social media",
    "text",
    "ghost",
    "date",
    "ex",
    "relationship",
  ],
};

/**
 * Extract keywords from a question text
 */
function extractKeywords(questionText: string): string[] {
  const text = questionText.toLowerCase();
  const foundKeywords: string[] = [];

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }
  }

  return foundKeywords;
}

/**
 * Get theme distribution from keywords
 */
function getThemeDistribution(keywords: string[]): Record<string, number> {
  const distribution: Record<string, number> = {
    deep: 0,
    playful: 0,
    spicy: 0,
    practical: 0,
    social: 0,
  };

  for (const keyword of keywords) {
    for (const [theme, themeKeywords] of Object.entries(THEME_KEYWORDS)) {
      if (themeKeywords.includes(keyword)) {
        distribution[theme]++;
      }
    }
  }

  return distribution;
}

/**
 * Analyze user preferences from their swipe history
 */
export async function analyzePreferences(): Promise<UserPreferences> {
  const history = await getFullHistory();

  // Calculate category preferences
  const categoryPreferences: Record<CategoryId, number> = {
    chill: 0,
    "real talk": 0,
    relationships: 0,
    sex: 0,
    dating: 0,
    "t/d": 0,
  };

  const categories = Object.keys(history.categoryStats) as CategoryId[];
  for (const category of categories) {
    const stats = history.categoryStats[category];
    if (stats.totalSeen > 0) {
      categoryPreferences[category] = stats.liked / stats.totalSeen;
    }
  }

  // Analyze liked questions for length preferences
  const likedQuestions = getLikedQuestions(history);
  const questionLengths = likedQuestions.map((q) => q.question.length);

  const preferredLengthRange = {
    min: questionLengths.length > 0 ? Math.min(...questionLengths) : 30,
    max: questionLengths.length > 0 ? Math.max(...questionLengths) : 150,
    avg:
      questionLengths.length > 0
        ? questionLengths.reduce((a, b) => a + b, 0) / questionLengths.length
        : 80,
  };

  // Extract keywords from liked questions
  const allKeywords: string[] = [];
  for (const question of likedQuestions) {
    const keywords = extractKeywords(question.question);
    allKeywords.push(...keywords);
  }

  // Count keyword frequency and get top ones
  const keywordCounts = new Map<string, number>();
  for (const keyword of allKeywords) {
    keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
  }

  const likedKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword]) => keyword);

  // Calculate total questions answered
  let totalQuestionsAnswered = 0;
  for (const stats of Object.values(history.categoryStats)) {
    totalQuestionsAnswered += stats.totalSeen;
  }

  const preferences: UserPreferences = {
    categoryPreferences,
    preferredLengthRange,
    likedKeywords,
    totalQuestionsAnswered,
    lastPlayedAt: Date.now(),
  };

  // Store computed preferences
  history.preferences = preferences;
  await saveQuestionHistory(history);

  return preferences;
}

/**
 * Get liked questions from history
 */
function getLikedQuestions(
  history: QuestionHistoryData
): { id: number; question: string; category: string }[] {
  const likedIds = new Set<number>();

  for (const stats of Object.values(history.categoryStats)) {
    stats.likedQuestionIds.forEach((id) => likedIds.add(id));
  }

  return (
    baseQuestions as { id: number; question: string; category: string }[]
  ).filter((q) => likedIds.has(q.id));
}

/**
 * Generate a prompt context based on user preferences
 * This will be used to guide AI question generation
 */
export async function generatePreferenceContext(): Promise<string> {
  const preferences = await analyzePreferences();
  const history = await getFullHistory();

  // Get sample of liked questions
  const likedQuestions = getLikedQuestions(history);
  const sampleLiked = likedQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Get theme distribution
  const allKeywords = sampleLiked.flatMap((q) => extractKeywords(q.question));
  const themeDistribution = getThemeDistribution(allKeywords);

  // Find dominant themes
  const sortedThemes = Object.entries(themeDistribution)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0);

  const dominantThemes = sortedThemes.slice(0, 3).map(([theme]) => theme);

  // Find preferred categories
  const preferredCategories = Object.entries(preferences.categoryPreferences)
    .filter(([, ratio]) => ratio > 0.5)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  // Build context string
  let context = `User Preference Profile:
- Total questions answered: ${preferences.totalQuestionsAnswered}
- Preferred question length: ${Math.round(
    preferences.preferredLengthRange.avg
  )} characters (range: ${preferences.preferredLengthRange.min}-${
    preferences.preferredLengthRange.max
  })
`;

  if (dominantThemes.length > 0) {
    context += `- Preferred themes: ${dominantThemes.join(", ")}\n`;
  }

  if (preferredCategories.length > 0) {
    context += `- Highly engaged categories: ${preferredCategories.join(
      ", "
    )}\n`;
  }

  if (preferences.likedKeywords.length > 0) {
    context += `- Topics they enjoy: ${preferences.likedKeywords
      .slice(0, 10)
      .join(", ")}\n`;
  }

  // Add sample questions they liked
  if (sampleLiked.length > 0) {
    context += `\nSample questions they liked:\n`;
    for (const q of sampleLiked.slice(0, 5)) {
      context += `- "${q.question}"\n`;
    }
  }

  return context;
}

/**
 * Get engagement score for a category (0-100)
 * Used to show users how much they've explored each category
 */
export async function getCategoryEngagement(category: CategoryId): Promise<{
  score: number;
  seen: number;
  total: number;
  likeRatio: number;
}> {
  const history = await getFullHistory();
  const stats = history.categoryStats[category];

  // Count total base questions in this category
  const totalInCategory = (
    baseQuestions as { id: number; category: string }[]
  ).filter((q) => q.category === category).length;

  const score =
    totalInCategory > 0
      ? Math.round((stats.totalSeen / totalInCategory) * 100)
      : 0;

  const likeRatio = stats.totalSeen > 0 ? stats.liked / stats.totalSeen : 0;

  return {
    score: Math.min(score, 100),
    seen: stats.totalSeen,
    total: totalInCategory,
    likeRatio,
  };
}

/**
 * Check if user should be offered AI-generated questions
 */
export async function shouldOfferAIQuestions(
  categories: CategoryId[]
): Promise<{
  shouldOffer: boolean;
  totalSeen: number;
  totalAvailable: number;
  percentageSeen: number;
}> {
  const history = await getFullHistory();

  // Count total seen and total available for selected categories
  let totalSeen = 0;
  let totalAvailable = 0;

  for (const category of categories) {
    const stats = history.categoryStats[category];
    totalSeen += stats.totalSeen;

    const categoryQuestions = (
      baseQuestions as { id: number; category: string }[]
    ).filter((q) => q.category === category);
    totalAvailable += categoryQuestions.length;
  }

  const percentageSeen =
    totalAvailable > 0 ? (totalSeen / totalAvailable) * 100 : 0;

  // Offer AI questions when user has seen 80% of available questions
  const shouldOffer = percentageSeen >= 80;

  return {
    shouldOffer,
    totalSeen,
    totalAvailable,
    percentageSeen: Math.round(percentageSeen),
  };
}
