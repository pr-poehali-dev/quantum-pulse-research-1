import { create } from 'zustand';
import { Skin } from '@/data/skins';

interface InventoryItem {
  skin: Skin;
  obtainedAt: Date;
}

interface Store {
  balance: number;
  inventory: InventoryItem[];
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  addToInventory: (skin: Skin) => void;
  sellFromInventory: (index: number) => number;
  sellAll: () => number;
}

export const useStore = create<Store>((set, get) => ({
  balance: 500,
  inventory: [],
  addBalance: (amount) => set((s) => ({ balance: s.balance + amount })),
  deductBalance: (amount) => {
    if (get().balance < amount) return false;
    set((s) => ({ balance: s.balance - amount }));
    return true;
  },
  addToInventory: (skin) =>
    set((s) => ({ inventory: [{ skin, obtainedAt: new Date() }, ...s.inventory] })),
  sellFromInventory: (index) => {
    const item = get().inventory[index];
    if (!item) return 0;
    const sellPrice = Math.floor(item.skin.price * 0.7);
    set((s) => ({
      balance: s.balance + sellPrice,
      inventory: s.inventory.filter((_, i) => i !== index),
    }));
    return sellPrice;
  },
  sellAll: () => {
    const total = get().inventory.reduce((sum, item) => sum + Math.floor(item.skin.price * 0.7), 0);
    set((s) => ({ balance: s.balance + total, inventory: [] }));
    return total;
  },
}));