import { ClothingItem, Outfit, Season, Occasion } from "@/types/ClothingItem";

export interface OutfitRecommendation {
  items: ClothingItem[];
  score: number;
  reasons: string[];
  seasonScore: number;
  occasionScore: number;
  colorScore: number;
  categoryScore: number;
}

export interface RecommendationOptions {
  preferredSeason?: Season;
  preferredOccasion?: Occasion;
  maxRecommendations?: number;
}

// Color compatibility matrix (simplified)
const COLOR_COMPATIBILITY: Record<string, string[]> = {
  black: ["white", "gray", "navy", "red", "beige", "brown"],
  white: ["black", "gray", "navy", "blue", "red", "green", "beige"],
  navy: ["white", "gray", "black", "beige", "brown"],
  gray: ["black", "white", "navy", "blue", "red", "pink"],
  brown: ["white", "beige", "cream", "navy", "green"],
  beige: ["black", "brown", "navy", "white", "cream"],
  red: ["black", "white", "gray", "navy"],
  blue: ["white", "gray", "black", "beige"],
  green: ["white", "beige", "brown", "navy"],
  pink: ["gray", "black", "white", "navy"],
};

function getColorCompatibility(colors1: string[], colors2: string[]): number {
  if (colors1.length === 0 || colors2.length === 0) return 0.5;

  let compatibleCount = 0;
  let totalComparisons = 0;

  for (const color1 of colors1) {
    for (const color2 of colors2) {
      totalComparisons++;
      const normalizedColor1 = color1.toLowerCase();
      const normalizedColor2 = color2.toLowerCase();
      
      if (COLOR_COMPATIBILITY[normalizedColor1]?.includes(normalizedColor2)) {
        compatibleCount++;
      }
    }
  }

  return totalComparisons > 0 ? compatibleCount / totalComparisons : 0.5;
}

function getSeasonCompatibility(item1: ClothingItem, item2: ClothingItem): number {
  const commonSeasons = item1.seasons.filter((s) => item2.seasons.includes(s));
  return commonSeasons.length > 0 ? 1 : 0.3;
}

function getOccasionCompatibility(item1: ClothingItem, item2: ClothingItem): number {
  const commonOccasions = item1.occasions.filter((o) => item2.occasions.includes(o));
  return commonOccasions.length > 0 ? 1 : 0.3;
}

function getCategoryCompleteness(items: ClothingItem[]): number {
  const categories = new Set(items.map((item) => item.category));
  const hasTop = categories.has("Tops");
  const hasBottom = categories.has("Bottoms");
  const hasShoes = categories.has("Shoes");
  
  let score = 0;
  if (hasTop) score += 0.4;
  if (hasBottom) score += 0.4;
  if (hasShoes) score += 0.2;
  
  return score;
}

function scoreOutfit(
  items: ClothingItem[],
  options: RecommendationOptions
): {
  score: number;
  seasonScore: number;
  occasionScore: number;
  colorScore: number;
  categoryScore: number;
  reasons: string[];
} {
  if (items.length < 2) {
    return {
      score: 0,
      seasonScore: 0,
      occasionScore: 0,
      colorScore: 0,
      categoryScore: 0,
      reasons: ["Incomplete outfit"],
    };
  }

  // Category completeness score (40%)
  const categoryScore = getCategoryCompleteness(items);
  const categoryReasons: string[] = [];
  if (categoryScore >= 0.8) categoryReasons.push("Complete outfit with all essential pieces");
  else if (categoryScore >= 0.4) categoryReasons.push("Basic outfit structure");

  // Season compatibility score (25%)
  let seasonScore = 0;
  const seasonReasons: string[] = [];
  if (items.length >= 2) {
    const seasonCompatibility = getSeasonCompatibility(items[0], items[1]);
    seasonScore = seasonCompatibility;
    
    if (options.preferredSeason) {
      const matchesPreferred = items.every((item) =>
        item.seasons.includes(options.preferredSeason!)
      );
      if (matchesPreferred) {
        seasonScore = 1;
        seasonReasons.push(`Perfect for ${options.preferredSeason}`);
      }
    }
    
    if (seasonScore >= 0.8) seasonReasons.push("Seasonally compatible pieces");
    else if (seasonScore < 0.5) seasonReasons.push("Mixed seasonality");
  }

  // Occasion compatibility score (20%)
  let occasionScore = 0;
  const occasionReasons: string[] = [];
  if (items.length >= 2) {
    const occasionCompatibility = getOccasionCompatibility(items[0], items[1]);
    occasionScore = occasionCompatibility;
    
    if (options.preferredOccasion) {
      const matchesPreferred = items.every((item) =>
        item.occasions.includes(options.preferredOccasion!)
      );
      if (matchesPreferred) {
        occasionScore = 1;
        occasionReasons.push(`Perfect for ${options.preferredOccasion}`);
      }
    }
    
    if (occasionScore >= 0.8) occasionReasons.push("Occasion-appropriate");
    else if (occasionScore < 0.5) occasionReasons.push("Mixed occasion suitability");
  }

  // Color compatibility score (15%)
  let colorScore = 0;
  const colorReasons: string[] = [];
  if (items.length >= 2) {
    const totalColorScore = items.reduce((sum, item, index) => {
      if (index === 0) return 1;
      return sum + getColorCompatibility(items[0].colors, item.colors);
    }, 0);
    colorScore = totalColorScore / items.length;
    
    if (colorScore >= 0.7) colorReasons.push("Well-coordinated colors");
    else if (colorScore >= 0.5) colorReasons.push("Compatible colors");
    else colorReasons.push("Bold color combination");
  }

  // Calculate final weighted score
  const finalScore =
    categoryScore * 0.4 +
    seasonScore * 0.25 +
    occasionScore * 0.2 +
    colorScore * 0.15;

  const reasons = [...categoryReasons, ...seasonReasons, ...occasionReasons, ...colorReasons];

  return {
    score: Math.round(finalScore * 100),
    seasonScore: Math.round(seasonScore * 100),
    occasionScore: Math.round(occasionScore * 100),
    colorScore: Math.round(colorScore * 100),
    categoryScore: Math.round(categoryScore * 100),
    reasons,
  };
}

export function generateRecommendations(
  items: ClothingItem[],
  options: RecommendationOptions = {}
): OutfitRecommendation[] {
  const { maxRecommendations = 5 } = options;

  if (items.length < 2) {
    return [];
  }

  const tops = items.filter((item) => item.category === "Tops");
  const bottoms = items.filter((item) => item.category === "Bottoms");
  const shoes = items.filter((item) => item.category === "Shoes");
  const accessories = items.filter((item) => item.category === "Accessories");

  if (tops.length === 0 || bottoms.length === 0) {
    return [];
  }

  const recommendations: OutfitRecommendation[] = [];

  // Generate combinations
  for (const top of tops) {
    for (const bottom of bottoms) {
      const combination: ClothingItem[] = [top, bottom];

      const shoeOptions = shoes.length > 0 ? shoes : [undefined];
      const accessoryOptions = accessories.length > 0 ? accessories : [undefined];

      for (const shoe of shoeOptions) {
        for (const accessory of accessoryOptions) {
          const combination = [top, bottom];
          if (shoe) combination.push(shoe);
          if (accessory) combination.push(accessory);

          const scoring = scoreOutfit(combination, options);

          recommendations.push({
            items: combination,
            ...scoring,
          });
        }
      }
    }
  }

  // Sort by score and return top recommendations
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, maxRecommendations);
}

export function recommendationToOutfit(
  recommendation: OutfitRecommendation,
  existingOutfitCount: number
): Outfit {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: `Outfit ${existingOutfitCount + 1}`,
    items: recommendation.items.map((item) => item.id),
    reasoning: recommendation.reasons.join(". "),
    dateCreated: new Date().toISOString(),
  };
}
