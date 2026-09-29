import { ClothingItem, Outfit } from "@/types/ClothingItem";

export interface OutfitGenerationOptions {
  count?: number;
  requireShoes?: boolean;
  requireAccessory?: boolean;
}

export function generateOutfits(
  items: ClothingItem[],
  existingOutfitCount: number,
  options: OutfitGenerationOptions = {}
): Outfit[] {
  const { count = 3, requireShoes = false, requireAccessory = false } = options;

  if (items.length < 3) {
    return [];
  }

  const tops = items.filter((item) => item.category === "Tops");
  const bottoms = items.filter((item) => item.category === "Bottoms");
  const shoes = items.filter((item) => item.category === "Shoes");
  const accessories = items.filter((item) => item.category === "Accessories");

  if (tops.length === 0 || bottoms.length === 0) {
    return [];
  }

  if (requireShoes && shoes.length === 0) {
    return [];
  }

  if (requireAccessory && accessories.length === 0) {
    return [];
  }

  const pickRandom = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  };

  const newOutfits: Outfit[] = [];

  for (let i = 0; i < count; i++) {
    const top = pickRandom(tops);
    const bottom = pickRandom(bottoms);
    const shoe = pickRandom(shoes);
    const accessory = pickRandom(accessories);

    if (!top || !bottom) {
      continue;
    }

    const itemIds = [top.id, bottom.id];
    if (shoe) itemIds.push(shoe.id);
    if (accessory) itemIds.push(accessory.id);

    const outfit: Outfit = {
      id: `${Date.now()}-${i}`,
      name: `Outfit ${existingOutfitCount + newOutfits.length + 1}`,
      items: itemIds,
      reasoning:
        "Suggested combination based on your tops, bottoms, and matching pieces.",
      dateCreated: new Date().toISOString(),
    };

    newOutfits.push(outfit);
  }

  return newOutfits;
}
