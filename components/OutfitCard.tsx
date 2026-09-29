import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { ClothingItem, Outfit } from "@/types/ClothingItem";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface OutfitCardProps {
  outfit: Outfit;
  items: ClothingItem[];
}

export function OutfitCard({ outfit, items }: OutfitCardProps) {
  const { colors } = useTheme();

  const outfitItems = items.filter((item) => outfit.items.includes(item.id));

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.backgroundDefault, borderColor: colors.border },
      ]}
    >
      <ThemedText style={styles.outfitName}>{outfit.name}</ThemedText>

      <View style={styles.itemsContainer}>
        {outfitItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.itemThumbnail,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Image source={{ uri: item.imageUri }} style={styles.itemImage} contentFit="cover" />
          </View>
        ))}
      </View>

      <ThemedText style={[styles.reasoning, { color: colors.textSecondary }]}>
        {outfit.reasoning}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  itemsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  itemThumbnail: {
    width: 80,
    height: 106,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  reasoning: {
    fontSize: 14,
    lineHeight: 20,
  },
});
