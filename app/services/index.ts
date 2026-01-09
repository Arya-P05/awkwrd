/**
 * Services Index
 * Re-exports all services for easy importing
 */

// Types
export * from "./types";

// Question Storage
export {
  loadQuestionHistory,
  saveQuestionHistory,
  recordSwipe,
  getSeenQuestionIds,
  getCategoryStats,
  getAllStats,
  storeGeneratedQuestions,
  getGeneratedQuestions,
  clearHistory,
  getFullHistory,
} from "./questionStorage";

// Preference Analysis
export {
  analyzePreferences,
  generatePreferenceContext,
  getCategoryEngagement,
  shouldOfferAIQuestions,
} from "./preferenceAnalysis";

// Smart Deck
export {
  buildSmartDeck,
  buildFreshDeck,
  buildFullDeck,
  getDeckStats,
  type DeckBuildResult,
} from "./smartDeck";

// AI Generation
export {
  generateQuestions,
  generateQuestionsForCategories,
  configureAPI,
  getAPIConfig,
  type GenerationResult,
} from "./aiGeneration";
