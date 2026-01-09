/**
 * Question Storage Service
 * Handles persistence of question history and swipe preferences
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CategoryId,
  CategoryStats,
  QuestionHistoryData,
  SwipeRecord,
  Question,
  EMPTY_CATEGORY_STATS,
  STORAGE_VERSION,
} from "./types";

const STORAGE_KEY = "@awkwrd_question_history";
const MAX_RECENT_SWIPES = 500;

/**
 * Initialize empty history data
 */
function createEmptyHistoryData(): QuestionHistoryData {
  const categoryStats: Record<CategoryId, CategoryStats> = {
    chill: { ...EMPTY_CATEGORY_STATS },
    "real talk": { ...EMPTY_CATEGORY_STATS },
    relationships: { ...EMPTY_CATEGORY_STATS },
    sex: { ...EMPTY_CATEGORY_STATS },
    dating: { ...EMPTY_CATEGORY_STATS },
    "t/d": { ...EMPTY_CATEGORY_STATS },
  };

  return {
    categoryStats,
    recentSwipes: [],
    generatedQuestions: [],
    preferences: null,
    version: STORAGE_VERSION,
  };
}

/**
 * Load question history from storage
 */
export async function loadQuestionHistory(): Promise<QuestionHistoryData> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createEmptyHistoryData();
    }

    const data = JSON.parse(stored) as QuestionHistoryData;

    // Handle version migrations if needed
    if (data.version !== STORAGE_VERSION) {
      console.log("Migrating question history data...");
      // For now, just update version - add migration logic as needed
      data.version = STORAGE_VERSION;
    }

    return data;
  } catch (error) {
    console.error("Error loading question history:", error);
    return createEmptyHistoryData();
  }
}

/**
 * Save question history to storage
 */
export async function saveQuestionHistory(
  data: QuestionHistoryData
): Promise<void> {
  try {
    // Trim recent swipes if too long
    if (data.recentSwipes.length > MAX_RECENT_SWIPES) {
      data.recentSwipes = data.recentSwipes.slice(-MAX_RECENT_SWIPES);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving question history:", error);
  }
}

/**
 * Record a swipe action
 */
export async function recordSwipe(
  questionId: number,
  category: CategoryId,
  action: "liked" | "skipped",
  questionLength: number
): Promise<QuestionHistoryData> {
  const history = await loadQuestionHistory();

  // Create swipe record
  const swipeRecord: SwipeRecord = {
    questionId,
    category,
    action,
    timestamp: Date.now(),
    questionLength,
  };

  // Update category stats
  const stats = history.categoryStats[category];

  // Only update if this question hasn't been seen before
  if (!stats.seenQuestionIds.includes(questionId)) {
    stats.totalSeen += 1;
    stats.seenQuestionIds.push(questionId);

    if (action === "liked") {
      stats.liked += 1;
      stats.likedQuestionIds.push(questionId);
    } else {
      stats.skipped += 1;
      stats.skippedQuestionIds.push(questionId);
    }
  } else {
    // Question was seen before (maybe skipped previously, now liked)
    // Update the preference if it changed
    const wasLiked = stats.likedQuestionIds.includes(questionId);
    const wasSkipped = stats.skippedQuestionIds.includes(questionId);

    if (action === "liked" && !wasLiked) {
      stats.liked += 1;
      stats.likedQuestionIds.push(questionId);
      if (wasSkipped) {
        stats.skipped -= 1;
        stats.skippedQuestionIds = stats.skippedQuestionIds.filter(
          (id) => id !== questionId
        );
      }
    } else if (action === "skipped" && !wasSkipped) {
      stats.skipped += 1;
      stats.skippedQuestionIds.push(questionId);
      if (wasLiked) {
        stats.liked -= 1;
        stats.likedQuestionIds = stats.likedQuestionIds.filter(
          (id) => id !== questionId
        );
      }
    }
  }

  // Add to recent swipes
  history.recentSwipes.push(swipeRecord);

  // Save and return
  await saveQuestionHistory(history);
  return history;
}

/**
 * Get seen question IDs for given categories
 */
export async function getSeenQuestionIds(
  categories: CategoryId[]
): Promise<number[]> {
  const history = await loadQuestionHistory();
  const seenIds: Set<number> = new Set();

  for (const category of categories) {
    const stats = history.categoryStats[category];
    stats.seenQuestionIds.forEach((id) => seenIds.add(id));
  }

  return Array.from(seenIds);
}

/**
 * Get category stats
 */
export async function getCategoryStats(
  category: CategoryId
): Promise<CategoryStats> {
  const history = await loadQuestionHistory();
  return history.categoryStats[category];
}

/**
 * Get all stats across categories
 */
export async function getAllStats(): Promise<{
  totalSeen: number;
  totalLiked: number;
  totalSkipped: number;
  byCategory: Record<CategoryId, CategoryStats>;
}> {
  const history = await loadQuestionHistory();

  let totalSeen = 0;
  let totalLiked = 0;
  let totalSkipped = 0;

  const categories = Object.keys(history.categoryStats) as CategoryId[];
  for (const category of categories) {
    const stats = history.categoryStats[category];
    totalSeen += stats.totalSeen;
    totalLiked += stats.liked;
    totalSkipped += stats.skipped;
  }

  return {
    totalSeen,
    totalLiked,
    totalSkipped,
    byCategory: history.categoryStats,
  };
}

/**
 * Store AI-generated questions
 */
export async function storeGeneratedQuestions(
  questions: Question[]
): Promise<void> {
  const history = await loadQuestionHistory();

  // Assign IDs starting from 10000 to avoid collision with base questions
  const existingGeneratedIds = history.generatedQuestions.map((q) => q.id);
  const maxId =
    existingGeneratedIds.length > 0 ? Math.max(...existingGeneratedIds) : 9999;

  const questionsWithIds = questions.map((q, i) => ({
    ...q,
    id: maxId + 1 + i,
    isGenerated: true,
    generatedAt: Date.now(),
  }));

  history.generatedQuestions = [
    ...history.generatedQuestions,
    ...questionsWithIds,
  ];

  await saveQuestionHistory(history);
}

/**
 * Get generated questions for categories
 */
export async function getGeneratedQuestions(
  categories: CategoryId[]
): Promise<Question[]> {
  const history = await loadQuestionHistory();
  return history.generatedQuestions.filter((q) =>
    categories.includes(q.category as CategoryId)
  );
}

/**
 * Clear all history (for testing/reset)
 */
export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Get the full history data (for preference analysis)
 */
export async function getFullHistory(): Promise<QuestionHistoryData> {
  return loadQuestionHistory();
}
