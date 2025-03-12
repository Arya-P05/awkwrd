
import { Card, Category, CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'real-talk',
    name: 'Real Talk',
    color: 'category-real-talk',
    description: 'Honest conversations about life and personal growth',
    enabled: true
  },
  {
    id: 'relationships',
    name: 'Relationships',
    color: 'category-relationships',
    description: 'Explore connections with friends, family, and partners',
    enabled: true
  },
  {
    id: 'sex',
    name: 'Sex',
    color: 'category-sex',
    description: 'Intimate questions about desires and experiences',
    enabled: true
  },
  {
    id: 'dating',
    name: 'Dating',
    color: 'category-dating',
    description: 'Navigate the world of romance and attraction',
    enabled: true
  }
];

export const CARDS: Card[] = [
  // Real Talk Cards
  {
    id: 'rt1',
    question: "What's something you're still trying to prove to yourself?",
    category: 'real-talk'
  },
  {
    id: 'rt2',
    question: "What's a fear you have that you rarely share with others?",
    category: 'real-talk'
  },
  {
    id: 'rt3',
    question: "What's the most significant change you've made in your life in the past year?",
    category: 'real-talk'
  },
  {
    id: 'rt4',
    question: "What's a belief you had growing up that you no longer hold?",
    category: 'real-talk'
  },
  {
    id: 'rt5',
    question: "When was the last time you felt truly vulnerable with someone?",
    category: 'real-talk'
  },
  
  // Relationship Cards
  {
    id: 'rel1',
    question: "What's something you need in a relationship but have difficulty asking for?",
    category: 'relationships'
  },
  {
    id: 'rel2',
    question: "What's a boundary you wish you had set earlier in a past relationship?",
    category: 'relationships'
  },
  {
    id: 'rel3',
    question: "How has your relationship with your parents influenced your other relationships?",
    category: 'relationships'
  },
  {
    id: 'rel4',
    question: "What does healthy conflict resolution look like to you?",
    category: 'relationships'
  },
  {
    id: 'rel5',
    question: "What makes you feel most appreciated in a relationship?",
    category: 'relationships'
  },
  
  // Sex Cards
  {
    id: 'sex1',
    question: "What's something about sex that you wish was discussed more openly?",
    category: 'sex'
  },
  {
    id: 'sex2',
    question: "What's one thing you want more of in your sex life?",
    category: 'sex'
  },
  {
    id: 'sex3',
    question: "How has your view of intimacy changed over time?",
    category: 'sex'
  },
  {
    id: 'sex4',
    question: "What's a sexual boundary you've learned to respect in yourself or others?",
    category: 'sex'
  },
  {
    id: 'sex5',
    question: "What's a misconception about sex you believed for too long?",
    category: 'sex'
  },
  
  // Dating Cards
  {
    id: 'dat1',
    question: 'What\'s a dating "green flag" you look for?',
    category: 'dating'
  },
  {
    id: 'dat2',
    question: "What's your most memorable first date experience?",
    category: 'dating'
  },
  {
    id: 'dat3',
    question: "How has your approach to dating changed over time?",
    category: 'dating'
  },
  {
    id: 'dat4',
    question: "What's something about modern dating that frustrates you?",
    category: 'dating'
  },
  {
    id: 'dat5',
    question: "What's a dating lesson you had to learn the hard way?",
    category: 'dating'
  }
];
