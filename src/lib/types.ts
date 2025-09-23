


export type Category =
  | 'Side Dish'
  | 'Fruit'
  | 'Drink'
  | 'Container'
  | 'Snack';

export const CATEGORIES: Category[] = [
  'Side Dish',
  'Fruit',
  'Drink',
  'Container',
  'Snack',
];

export const CATEGORY_NAMES: Record<Category, string> = {
  'Side Dish': '식사',
  'Fruit': '과일',
  'Drink': '음료',
  'Container': '용기',
  'Snack': '간식',
};

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  taste: number;
  convenience: number;
  eco: number;
  image: string;
  imageHint: string;
}

export type BonusCardType = 'Campaign' | 'Tax';

export interface BonusCard {
  id: string;
  type: BonusCardType;
  name: string;
  description: string;
  effect: string;
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  seeds: number;
  bento: MenuItem[];
  bonusCards: BonusCard[];
  aiShoppingList?: string[];
}

export type GamePhase =
  | 'welcome'
  | 'loading'
  | 'rolling'
  | 'player_turn'
  | 'ai_turn'
  | 'buying'
  | 'round_end'
  | 'advancing_round'
  | 'game_over';

export interface Score {
  taste: number;
  convenience: number;
  eco: number;
}

export interface BonusDetail {
    cardName: string;
    metric: 'taste' | 'convenience' | 'eco' | 'total' | 'seeds';
    value: number;
}

export interface ScoreWithBonuses {
    player: Player;
    score: Score;
    total: number;
    bonusDetails: BonusDetail[];
}
