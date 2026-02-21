import fs from 'fs/promises';
import path from 'path';
import { DBData } from './types';

const DB_FILE = path.join(process.cwd(), 'data.json');

const defaultData: DBData = {
  categories: [
    { id: 'c1', name: 'Salads' },
    { id: 'c2', name: 'Beverages' },
    { id: 'c3', name: 'Add-ons' }
  ],
  menuItems: [
    { id: 'm1', categoryId: 'c1', name: 'Classic Greek Salad', description: 'Fresh lettuce, olives, feta cheese, cucumber, tomatoes, olive oil', price: 350, image: 'https://picsum.photos/seed/greek/400/300', available: true },
    { id: 'm2', categoryId: 'c1', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan cheese, caesar dressing', price: 380, image: 'https://picsum.photos/seed/caesar/400/300', available: true },
    { id: 'm3', categoryId: 'c2', name: 'Watermelon Juice', description: 'Freshly squeezed watermelon juice', price: 120, image: 'https://picsum.photos/seed/watermelon/400/300', available: true },
    { id: 'm4', categoryId: 'c2', name: 'Lemon Mint', description: 'Refreshing lemon and mint cooler', price: 100, image: 'https://picsum.photos/seed/lemon/400/300', available: true }
  ],
  orders: [],
  expenses: [],
  settings: { deliveryFee: 40, freeDeliveryThreshold: 500, isFreeDeliveryEnabled: true }
};

export async function getDB(): Promise<DBData> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function saveDB(data: DBData): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}
