import { ClothingItem, Outfit } from "@/types/ClothingItem";
import { storage } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WardrobeContextType {
  items: ClothingItem[];
  outfits: Outfit[];
  loading: boolean;
  addItem: (item: ClothingItem) => Promise<void>;
  updateItem: (item: ClothingItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addOutfit: (outfit: Outfit) => Promise<void>;
  refreshItems: () => Promise<void>;
  refreshOutfits: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [loadedItems, loadedOutfits] = await Promise.all([
      storage.getClothingItems(),
      storage.getOutfits(),
    ]);
    setItems(loadedItems);
    setOutfits(loadedOutfits);
    setLoading(false);
  };

  const addItem = async (item: ClothingItem) => {
    await storage.addClothingItem(item);
    setItems((prev) => [...prev, item]);
  };

  const updateItem = async (item: ClothingItem) => {
    await storage.updateClothingItem(item);
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const deleteItem = async (id: string) => {
    await storage.deleteClothingItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addOutfit = async (outfit: Outfit) => {
    await storage.addOutfit(outfit);
    setOutfits((prev) => [...prev, outfit]);
  };

  const refreshItems = async () => {
    const loadedItems = await storage.getClothingItems();
    setItems(loadedItems);
  };

  const refreshOutfits = async () => {
    const loadedOutfits = await storage.getOutfits();
    setOutfits(loadedOutfits);
  };

  const clearAllData = async () => {
    await storage.clearAllData();
    setItems([]);
    setOutfits([]);
  };

  return (
    <WardrobeContext.Provider
      value={{
        items,
        outfits,
        loading,
        addItem,
        updateItem,
        deleteItem,
        addOutfit,
        refreshItems,
        refreshOutfits,
        clearAllData,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error("useWardrobe must be used within WardrobeProvider");
  }
  return context;
}
