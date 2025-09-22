// src/lib/game-data-service.ts
'use server';

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, query } from 'firebase/firestore';
import { initialMenuItems } from '@/data/game-data';
import type { MenuItem } from './types';

const MENU_COLLECTION_KEY = 'menu';

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const menuCollection = collection(db, MENU_COLLECTION_KEY);
    const q = query(menuCollection);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No menu items found in Firestore, initializing with default data.');
      await saveMenuItems(initialMenuItems);
      return initialMenuItems;
    }

    const items: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
         id: doc.id,
         name: data.name,
         category: data.category,
         price: data.price,
         taste: data.taste,
         convenience: data.convenience,
         eco: data.eco,
         image: data.image,
         imageHint: data.imageHint,
        });
    });
    // Sort by original ID order since firestore doesn't guarantee order
    return items.sort((a,b) => initialMenuItems.findIndex(item => item.id === a.id) - initialMenuItems.findIndex(item => item.id === b.id));

  } catch (error) {
    console.error('Failed to get menu items from Firestore, returning initial data.', error);
    return initialMenuItems;
  }
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<void> {
  try {
    const menuCollection = collection(db, MENU_COLLECTION_KEY);
    const batch = writeBatch(db);

    menuItems.forEach((item) => {
      const itemDocRef = doc(menuCollection, item.id.toString());
      // Create a new object without the 'id' property
      const { id, ...itemData } = item;
      batch.set(itemDocRef, itemData);
    });

    await batch.commit();
    console.log('Menu items successfully saved to Firestore.');
  } catch (error) {
    console.error('Error saving menu items to Firestore:', error);
    throw error;
  }
}
