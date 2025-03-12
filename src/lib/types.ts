
export type Category = 'real-talk' | 'relationships' | 'sex' | 'dating';

export interface Card {
  id: string;
  question: string;
  category: Category;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
  description: string;
  enabled: boolean;
}
