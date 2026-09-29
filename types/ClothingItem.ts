export type Category = "Tops" | "Bottoms" | "Shoes" | "Accessories" | "Outerwear";
export type Season = "Spring" | "Summer" | "Fall" | "Winter";
export type Occasion = "Casual" | "Work" | "Formal" | "Sport";
export type Gender = "men" | "women" | "unisex";

export interface ClothingItem {
  id: string;
  imageUri: string;
  name?: string;
  category: Category;
  gender: Gender;
  seasons: Season[];
  colors: string[];
  occasions: Occasion[];
  dateAdded: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  reasoning: string;
  dateCreated: string;
}
