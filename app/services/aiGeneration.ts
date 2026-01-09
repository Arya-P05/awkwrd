/**
 * AI Question Generation Service
 * Calls the backend API to generate new questions based on user preferences
 */

import { CategoryId, Question } from "./types";
import { generatePreferenceContext } from "./preferenceAnalysis";
import { storeGeneratedQuestions } from "./questionStorage";
import baseQuestions from "../../questions.json";

// API Configuration
const API_CONFIG = {
  // Your Vercel API URL - update this after deploying
  baseUrl: "https://awkwrd-api.vercel.app", // TODO: Update with your actual URL
  
  // For development/testing, set to true to use mock data
  useMock: true,
  
  // Generation settings
  questionsPerBatch: 5,
  timeout: 30000, // 30 seconds
};

export interface GenerationResult {
  success: boolean;
  questions: Question[];
  error?: string;
}

/**
 * Get sample questions from a category for API context
 */
function getSampleQuestions(category: CategoryId, count: number = 5): string[] {
  const categoryQuestions = (
    baseQuestions as { id: number; category: string; question: string }[]
  ).filter((q) => q.category === category);

  const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => q.question);
}

/**
 * Generate questions via the backend API
 */
async function generateViaAPI(
  category: CategoryId,
  count: number
): Promise<GenerationResult> {
  try {
    const preferenceContext = await generatePreferenceContext();
    const sampleQuestions = getSampleQuestions(category, 8);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(`${API_CONFIG.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        count,
        preferenceContext,
        sampleQuestions,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        questions: [],
        error: errorData.error || `API error: ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success || !data.questions?.length) {
      return {
        success: false,
        questions: [],
        error: "No questions generated",
      };
    }

    // Convert API response to Question format
    const questions: Question[] = data.questions.map(
      (q: { category: string; question: string }) => ({
        id: 0, // Will be assigned when stored
        category: q.category,
        question: q.question,
        isGenerated: true,
        generatedAt: Date.now(),
      })
    );

    return { success: true, questions };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, questions: [], error: "Request timed out" };
    }
    return {
      success: false,
      questions: [],
      error: `Network error: ${error}`,
    };
  }
}

/**
 * Generate mock questions for testing (when API not configured)
 */
async function generateMock(
  category: CategoryId,
  count: number
): Promise<GenerationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockQuestions: Record<CategoryId, string[]> = {
    chill: [
      "If you could master any instrument overnight, what would it be?",
      "What's the most random thing you're weirdly passionate about?",
      "What's your go-to comfort show that you've rewatched too many times?",
      "If your life had a theme song, what would it be?",
      "What's a food combination you love that others find strange?",
      "What's the last thing you impulse bought that you don't regret?",
      "If you had to eat one meal for the rest of your life, what would it be?",
      "What's a skill you wish you had but will probably never learn?",
      "What's the most useless talent you have?",
      "What's something you're irrationally afraid of?",
    ],
    "real talk": [
      "What's a belief you held strongly that completely changed?",
      "When was the last time you surprised yourself?",
      "What's something you're still learning to accept about yourself?",
      "If you could have a conversation with your teenage self, what would you say?",
      "What keeps you going on your hardest days?",
      "What's the most important lesson life has taught you recently?",
      "What do you wish more people understood about you?",
      "When did you last feel truly at peace?",
      "What's something you need to forgive yourself for?",
      "What would your life look like if fear didn't exist?",
    ],
    relationships: [
      "What's something you wish you knew before your first serious relationship?",
      "How do you know when it's time to fight for something vs. let it go?",
      "What's the most important lesson love has taught you?",
      "How has your definition of a healthy relationship evolved?",
      "What boundaries have you learned to set the hard way?",
      "What's something you used to tolerate in relationships that you no longer accept?",
      "How do you show love differently than you receive it?",
      "What's the hardest conversation you've had to have with a partner?",
      "What does emotional safety look like to you?",
      "How has your relationship with yourself affected your romantic relationships?",
    ],
    sex: [
      "What's something that took you too long to feel comfortable asking for?",
      "How do you feel about discussing past experiences with a new partner?",
      "What's changed most about your perspective on intimacy as you've gotten older?",
      "What makes someone great at communicating in intimate moments?",
      "How do you handle mismatched expectations in the bedroom?",
      "What's something you wish was talked about more openly?",
      "How important is physical chemistry vs emotional connection?",
      "What's the biggest misconception about your intimate life?",
      "How do you navigate consent conversations?",
      "What makes you feel most desired?",
    ],
    dating: [
      "What's a green flag that made you fall for someone immediately?",
      "What dating advice do you wish you could un-hear?",
      "How do you know when attraction is worth pursuing vs. just a fleeting feeling?",
      "What's something you've stopped compromising on in dating?",
      "How has your approach to dating changed in the last few years?",
      "What's the biggest lesson from your worst date?",
      "How do you know when someone is genuinely interested vs being polite?",
      "What's something you look for that most people overlook?",
      "How do you balance being open with protecting yourself?",
      "What's a dealbreaker that people think is unreasonable?",
    ],
    "t/d": [
      "TRUTH: What's the most embarrassing thing you've done to impress someone?",
      "DARE: Text your ex 'I've been thinking about you' and show the response",
      "TRUTH: What's a secret you've kept from everyone in this room?",
      "DARE: Let the group choose your profile picture for 24 hours",
      "TRUTH: Who in this room would you trust with your deepest secret?",
      "DARE: Send a voice note singing to the last person you texted",
      "TRUTH: What's the pettiest reason you've ended things with someone?",
      "DARE: Post an unfiltered selfie right now with no caption",
      "TRUTH: What's the most recent lie you told?",
      "DARE: Let someone go through your search history for 30 seconds",
    ],
  };

  const questions = (mockQuestions[category] || mockQuestions.chill)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((q) => ({
      id: 0,
      category,
      question: q,
      isGenerated: true,
      generatedAt: Date.now(),
    }));

  return { success: true, questions };
}

/**
 * Main function to generate questions
 */
export async function generateQuestions(
  category: CategoryId,
  count: number = API_CONFIG.questionsPerBatch
): Promise<GenerationResult> {
  let result: GenerationResult;

  if (API_CONFIG.useMock) {
    // Use mock for testing
    result = await generateMock(category, count);
  } else {
    // Use real API
    result = await generateViaAPI(category, count);
    
    // Fallback to mock if API fails
    if (!result.success) {
      console.log("API failed, falling back to mock:", result.error);
      result = await generateMock(category, count);
    }
  }

  // Store successful generations
  if (result.success && result.questions.length > 0) {
    await storeGeneratedQuestions(result.questions);
  }

  return result;
}

/**
 * Generate questions for multiple categories
 */
export async function generateQuestionsForCategories(
  categories: CategoryId[],
  countPerCategory: number = 5
): Promise<{
  success: boolean;
  totalGenerated: number;
  byCategory: Record<CategoryId, number>;
  errors: string[];
}> {
  const byCategory: Record<CategoryId, number> = {
    chill: 0,
    "real talk": 0,
    relationships: 0,
    sex: 0,
    dating: 0,
    "t/d": 0,
  };
  const errors: string[] = [];
  let totalGenerated = 0;

  // Generate for each selected category
  for (const category of categories) {
    const result = await generateQuestions(category, countPerCategory);

    if (result.success) {
      byCategory[category] = result.questions.length;
      totalGenerated += result.questions.length;
    } else if (result.error) {
      errors.push(`${category}: ${result.error}`);
    }
  }

  return {
    success: totalGenerated > 0,
    totalGenerated,
    byCategory,
    errors,
  };
}

/**
 * Configure the API (call this on app startup if needed)
 */
export function configureAPI(options: {
  baseUrl?: string;
  useMock?: boolean;
}): void {
  if (options.baseUrl) {
    API_CONFIG.baseUrl = options.baseUrl;
  }
  if (options.useMock !== undefined) {
    API_CONFIG.useMock = options.useMock;
  }
}

/**
 * Get current API configuration
 */
export function getAPIConfig(): typeof API_CONFIG {
  return { ...API_CONFIG };
}
