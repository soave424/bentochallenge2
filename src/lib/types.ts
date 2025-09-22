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

export interface MenuItem {
  id: number;
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
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  seeds: number;
  bento: MenuItem[];
  bonusCards: BonusCard[];
  aiShoppingList?: number[];
  eliminated: boolean;
}

export type GamePhase =
  | 'welcome'
  | 'loading'
  | 'rolling'
  | 'player_turn'
  | 'ai_turn'
  | 'buying'
  | 'bonus_card'
  | 'game_over';

export interface Score {
  consumption: number;
  eco: number;
  total: number;
}
