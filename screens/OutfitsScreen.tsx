import { EmptyState } from "@/components/EmptyState";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { OutfitCard } from "@/components/OutfitCard";
import { Spacing } from "@/constants/theme";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { useTheme } from "@/hooks/useTheme";
import { generateOutfits } from "@/services/outfitGenerator";
import { FlatList, StyleSheet, View } from "react-native";
const headerHeight = 91;
const tabBarHeight = 49;

export default function OutfitsScreen() {
  const { colors } = useTheme();
  const { items, outfits, addOutfit } = useWardrobe();

  const handleGenerateOutfits = async () => {
    const newOutfits = generateOutfits(items, outfits.length, { count: 3 });

    for (const outfit of newOutfits) {
      await addOutfit(outfit);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundRoot }]}>
      {outfits.length === 0 ? (
        <EmptyState
          image={require("@/assets/images/empty-outfits.png")}
          title="No outfit suggestions yet"
          message="Add some clothing items to your wardrobe and we'll suggest stylish outfit combinations for you"
          actionLabel={items.length >= 3 ? "Generate Outfit Ideas" : undefined}
          onActionPress={items.length >= 3 ? handleGenerateOutfits : undefined}
        />
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={(outfit) => outfit.id}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: tabBarHeight + Spacing.xl + 70,
            },
          ]}
          renderItem={({ item }) => <OutfitCard outfit={item} items={items} />}
        />
      )}
      {items.length >= 3 ? (
        <FloatingActionButton onPress={handleGenerateOutfits} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
});
