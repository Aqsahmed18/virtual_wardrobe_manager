import { ClothingItem, Outfit } from "@/types/ClothingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const CLOTHING_ITEMS_KEY = "@wardrobe_items";
const OUTFITS_KEY = "@wardrobe_outfits";

export const storage = {
  async getClothingItems(): Promise<ClothingItem[]> {
    try {
      const data = await AsyncStorage.getItem(CLOTHING_ITEMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading clothing items:", error);
      throw error;
    }
  },

  async saveClothingItems(items: ClothingItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CLOTHING_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving clothing items:", error);
      throw error;
    }
  },

  async addClothingItem(item: ClothingItem): Promise<void> {
    const items = await this.getClothingItems();
    items.push(item);
    await this.saveClothingItems(items);
  },

  async updateClothingItem(updatedItem: ClothingItem): Promise<void> {
    const items = await this.getClothingItems();
    const index = items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      await this.saveClothingItems(items);
    }
  },

  async deleteClothingItem(id: string): Promise<void> {
    const items = await this.getClothingItems();
    const itemToDelete = items.find((item) => item.id === id);

    // Delete the image file if it exists
    if (itemToDelete && itemToDelete.imageUri) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(
          itemToDelete.imageUri,
        );
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(itemToDelete.imageUri, {
            idempotent: true,
          });
        }
      } catch (error) {
        console.error("Failed to delete image file:", error);
        // Continue with deleting the item even if image deletion fails
      }
    }

    const filteredItems = items.filter((item) => item.id !== id);
    await this.saveClothingItems(filteredItems);
  },

  async getOutfits(): Promise<Outfit[]> {
    try {
      const data = await AsyncStorage.getItem(OUTFITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading outfits:", error);
      throw error;
    }
  },

  async saveOutfits(outfits: Outfit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
    } catch (error) {
      console.error("Error saving outfits:", error);
      throw error;
    }
  },

  async addOutfit(outfit: Outfit): Promise<void> {
    const outfits = await this.getOutfits();
    outfits.push(outfit);
    await this.saveOutfits(outfits);
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CLOTHING_ITEMS_KEY);
      await AsyncStorage.removeItem(OUTFITS_KEY);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  },
};
