/**
 * Core types for the question management system
 */

export type CategoryId =
  | "chill"
  | "real talk"
  | "relationships"
  | "sex"
  | "dating"
  | "t/d";

export interface Question {
  id: number;
  category: string;
  question: string;
  isGenerated?: boolean; // true if AI-generated
  generatedAt?: number; // timestamp when generated
}

export interface SwipeRecord {
  questionId: number;
  category: CategoryId;
  action: "liked" | "skipped";
  timestamp: number;
  questionLength: number; // character count for preference analysis
}

export interface CategoryStats {
  totalSeen: number;
  liked: number;
  skipped: number;
  seenQuestionIds: number[];
  likedQuestionIds: number[];
  skippedQuestionIds: number[];
}

export interface UserPreferences {
  // Per-category preference ratios (liked / total seen)
  categoryPreferences: Record<CategoryId, number>;
  
  // Preferred question length range based on liked questions
  preferredLengthRange: {
    min: number;
    max: number;
    avg: number;
  };
  
  // Keywords from liked questions (for AI prompting)
  likedKeywords: string[];
  
  // Overall engagement stats
  totalQuestionsAnswered: number;
  lastPlayedAt: number;
}

export interface QuestionHistoryData {
  // Stats per category
  categoryStats: Record<CategoryId, CategoryStats>;
  
  // Full swipe history (limited to last 500 for storage)
  recentSwipes: SwipeRecord[];
  
  // AI-generated questions stored separately
  generatedQuestions: Question[];
  
  // Computed preferences
  preferences: UserPreferences | null;
  
  // Version for migrations
  version: number;
}

export interface DeckConfig {
  // How many base questions before considering AI generation
  baseQuestionThreshold: number;
  
  // Whether to mix in generated questions with base
  mixGeneratedQuestions: boolean;
  
  // Percentage of deck that can be generated (0-1)
  maxGeneratedRatio: number;
}

export const DEFAULT_DECK_CONFIG: DeckConfig = {
  baseQuestionThreshold: 0.8, // Trigger AI after seeing 80% of base questions
  mixGeneratedQuestions: true,
  maxGeneratedRatio: 0.3, // Max 30% of deck can be generated
};

export const EMPTY_CATEGORY_STATS: CategoryStats = {
  totalSeen: 0,
  liked: 0,
  skipped: 0,
  seenQuestionIds: [],
  likedQuestionIds: [],
  skippedQuestionIds: [],
};

export const STORAGE_VERSION = 1;

