/**
 * Smart Deck Manager
 * Builds decks that prioritize unseen questions and intelligently mix generated ones
 */

import { CategoryId, Question, DeckConfig, DEFAULT_DECK_CONFIG } from "./types";
import { getSeenQuestionIds, getGeneratedQuestions } from "./questionStorage";
import { shouldOfferAIQuestions } from "./preferenceAnalysis";
import baseQuestions from "../../questions.json";

export interface DeckBuildResult {
  deck: Question[];
  stats: {
    totalQuestions: number;
    unseenQuestions: number;
    seenQuestions: number;
    generatedQuestions: number;
    shouldOfferAI: boolean;
    percentageSeen: number;
  };
}

/**
 * Build a smart deck for the given categories
 * Prioritizes unseen questions, then mixes in seen ones if needed
 */
export async function buildSmartDeck(
  categories: CategoryId[],
  config: DeckConfig = DEFAULT_DECK_CONFIG
): Promise<DeckBuildResult> {
  // Get all base questions for selected categories
  const categoryQuestions = (baseQuestions as Question[]).filter((q) =>
    categories.includes(q.category as CategoryId)
  );

  // Get seen question IDs
  const seenIds = await getSeenQuestionIds(categories);
  const seenIdSet = new Set(seenIds);

  // Split into unseen and seen
  const unseenQuestions = categoryQuestions.filter((q) => !seenIdSet.has(q.id));
  const seenQuestions = categoryQuestions.filter((q) => seenIdSet.has(q.id));

  // Check if we should offer AI questions
  const aiCheck = await shouldOfferAIQuestions(categories);

  // Get any generated questions for these categories
  const generatedQuestions = await getGeneratedQuestions(categories);
  const unseenGenerated = generatedQuestions.filter(
    (q) => !seenIdSet.has(q.id)
  );

  // Build the deck
  let deck: Question[] = [];

  // Always start with unseen base questions (shuffled)
  const shuffledUnseen = shuffleArray([...unseenQuestions]);
  deck = [...shuffledUnseen];

  // If user should be offered AI questions and we have some generated ones,
  // mix them in according to config
  if (config.mixGeneratedQuestions && unseenGenerated.length > 0) {
    const maxGenerated = Math.floor(deck.length * config.maxGeneratedRatio);
    const generatedToAdd = shuffleArray([...unseenGenerated]).slice(
      0,
      maxGenerated
    );

    // Interleave generated questions throughout the deck
    deck = interleaveQuestions(deck, generatedToAdd);
  }

  // If we're running low on unseen questions, add seen ones (shuffled)
  // This happens when user has seen most questions
  if (deck.length < 10 && seenQuestions.length > 0) {
    const shuffledSeen = shuffleArray([...seenQuestions]);
    deck = [...deck, ...shuffledSeen];
  }

  // Final shuffle to prevent predictability while keeping unseen first
  // Only shuffle within groups to maintain priority
  if (deck.length > 0) {
    // Light shuffle - swap some adjacent cards to add variety
    deck = lightShuffle(deck);
  }

  return {
    deck,
    stats: {
      totalQuestions: deck.length,
      unseenQuestions: shuffledUnseen.length,
      seenQuestions: Math.max(
        0,
        deck.length - shuffledUnseen.length - unseenGenerated.length
      ),
      generatedQuestions: unseenGenerated.filter((q) => deck.includes(q))
        .length,
      shouldOfferAI: aiCheck.shouldOffer,
      percentageSeen: aiCheck.percentageSeen,
    },
  };
}

/**
 * Build a deck that's fresh - only unseen questions
 * Useful for "fresh start" mode
 */
export async function buildFreshDeck(
  categories: CategoryId[]
): Promise<DeckBuildResult> {
  const categoryQuestions = (baseQuestions as Question[]).filter((q) =>
    categories.includes(q.category as CategoryId)
  );

  const seenIds = await getSeenQuestionIds(categories);
  const seenIdSet = new Set(seenIds);

  const unseenQuestions = categoryQuestions.filter((q) => !seenIdSet.has(q.id));

  const aiCheck = await shouldOfferAIQuestions(categories);

  const deck = shuffleArray([...unseenQuestions]);

  return {
    deck,
    stats: {
      totalQuestions: deck.length,
      unseenQuestions: deck.length,
      seenQuestions: 0,
      generatedQuestions: 0,
      shouldOfferAI: aiCheck.shouldOffer,
      percentageSeen: aiCheck.percentageSeen,
    },
  };
}

/**
 * Build a deck with ALL questions (including seen)
 * Useful for party mode where repetition is okay
 */
export async function buildFullDeck(
  categories: CategoryId[]
): Promise<DeckBuildResult> {
  const categoryQuestions = (baseQuestions as Question[]).filter((q) =>
    categories.includes(q.category as CategoryId)
  );

  const seenIds = await getSeenQuestionIds(categories);
  const aiCheck = await shouldOfferAIQuestions(categories);

  // Shuffle all questions
  const deck = shuffleArray([...categoryQuestions]);

  return {
    deck,
    stats: {
      totalQuestions: deck.length,
      unseenQuestions: categoryQuestions.filter((q) => !seenIds.includes(q.id))
        .length,
      seenQuestions: categoryQuestions.filter((q) => seenIds.includes(q.id))
        .length,
      generatedQuestions: 0,
      shouldOfferAI: aiCheck.shouldOffer,
      percentageSeen: aiCheck.percentageSeen,
    },
  };
}

/**
 * Get quick stats about available questions
 */
export async function getDeckStats(categories: CategoryId[]): Promise<{
  totalAvailable: number;
  unseenCount: number;
  seenCount: number;
  generatedCount: number;
  percentageSeen: number;
}> {
  const categoryQuestions = (baseQuestions as Question[]).filter((q) =>
    categories.includes(q.category as CategoryId)
  );

  const seenIds = await getSeenQuestionIds(categories);
  const seenIdSet = new Set(seenIds);

  const generatedQuestions = await getGeneratedQuestions(categories);

  const unseenCount = categoryQuestions.filter(
    (q) => !seenIdSet.has(q.id)
  ).length;
  const seenCount = categoryQuestions.filter((q) => seenIdSet.has(q.id)).length;

  const percentageSeen =
    categoryQuestions.length > 0
      ? Math.round((seenCount / categoryQuestions.length) * 100)
      : 0;

  return {
    totalAvailable: categoryQuestions.length + generatedQuestions.length,
    unseenCount,
    seenCount,
    generatedCount: generatedQuestions.length,
    percentageSeen,
  };
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Light shuffle - maintains general order but adds variety
 */
function lightShuffle<T>(array: T[]): T[] {
  const result = [...array];
  // Swap about 20% of adjacent pairs
  const swapCount = Math.floor(result.length * 0.2);

  for (let i = 0; i < swapCount; i++) {
    const idx = Math.floor(Math.random() * (result.length - 1));
    [result[idx], result[idx + 1]] = [result[idx + 1], result[idx]];
  }

  return result;
}

/**
 * Interleave questions from second array throughout first array
 */
function interleaveQuestions(
  primary: Question[],
  secondary: Question[]
): Question[] {
  if (secondary.length === 0) return primary;
  if (primary.length === 0) return secondary;

  const result: Question[] = [];
  const interval = Math.floor(primary.length / (secondary.length + 1));

  let secondaryIdx = 0;
  for (let i = 0; i < primary.length; i++) {
    result.push(primary[i]);

    // Insert a secondary question at intervals
    if (
      interval > 0 &&
      (i + 1) % interval === 0 &&
      secondaryIdx < secondary.length
    ) {
      result.push(secondary[secondaryIdx]);
      secondaryIdx++;
    }
  }

  // Add any remaining secondary questions at the end
  while (secondaryIdx < secondary.length) {
    result.push(secondary[secondaryIdx]);
    secondaryIdx++;
  }

  return result;
}
