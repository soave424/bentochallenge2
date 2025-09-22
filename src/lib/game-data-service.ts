'use server';

import { initialMenuItems } from '@/data/game-data';
import type { MenuItem } from './types';

const MENU_STORAGE_KEY = 'eco-bento-menu';

// This function will run on the client, as localStorage is a browser API.
export async function getMenuItems(): Promise<MenuItem[]> {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const storedData = localStorage.getItem(MENU_STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Failed to parse menu items from localStorage', error);
        // Fallback to initial data if parsing fails
        return initialMenuItems;
      }
    } else {
        // If nothing in storage, initialize it
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(initialMenuItems));
        return initialMenuItems;
    }
  }
  // Fallback for server-side rendering
  return initialMenuItems;
}

// This function will run on the client
export async function saveMenuItems(menuItems: MenuItem[]): Promise<void> {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
  } else {
    console.warn('localStorage is not available. Cannot save menu items.');
  }
}

    