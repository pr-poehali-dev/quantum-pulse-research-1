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
}));
