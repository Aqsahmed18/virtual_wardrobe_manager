import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/theme";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { useTheme } from "@/hooks/useTheme";
import { generateRecommendations, type OutfitRecommendation } from "@/services/recommendationEngine";
import type { ClothingItem } from "@/types/ClothingItem";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

const headerHeight = 91;
const tabBarHeight = 49;

export default function AISuggestionsScreen() {
  const { colors } = useTheme();
  const { items } = useWardrobe();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (recommendations.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedIndex((prev) =>
        prev + 1 < recommendations.length ? prev + 1 : 0,
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [recommendations.length]);

  const handleGenerateSuggestions = async () => {
    if (items.length < 2) {
      return;
    }

    setLoading(true);

    try {
      const newRecommendations = generateRecommendations(items, {
        maxRecommendations: 5,
      });
      setRecommendations(newRecommendations);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Failed to generate recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.backgroundRoot }]}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          Outfit Recommendations
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          Personalized outfit suggestions based on your wardrobe
        </ThemedText>

        <Pressable
          onPress={handleGenerateSuggestions}
          disabled={loading || items.length === 0}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor:
                items.length === 0 ? colors.border : colors.primary,
              opacity: pressed || loading ? 0.8 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <ThemedText
              type="body"
              style={[styles.buttonText, { color: colors.buttonText }]}
            >
              {items.length === 0
                ? "Add some clothes first"
                : "Generate Suggestions"}
            </ThemedText>
          )}
        </Pressable>

        {recommendations.length > 0 ? (
          <View style={styles.recommendationCard}>
            <View style={styles.scoreHeader}>
              <ThemedText type="h3" style={styles.scoreText}>
                {recommendations[selectedIndex].score}% Match
              </ThemedText>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
              {recommendations[selectedIndex].items.map((item: ClothingItem) => (
                <View key={item.id} style={styles.itemPreview}>
                  <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  <ThemedText type="small" style={styles.itemName}>
                    {item.name || item.category}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>

            <View style={styles.reasonsSection}>
              <ThemedText type="small" style={styles.reasonsTitle}>Why this outfit?</ThemedText>
              {recommendations[selectedIndex].reasons.map((reason: string, index: number) => (
                <ThemedText key={index} type="small" style={styles.reasonItem}>
                  ✓ {reason}
                </ThemedText>
              ))}
            </View>

            <View style={styles.scoreBreakdown}>
              <View style={styles.scoreRow}>
                <ThemedText type="small" style={styles.scoreLabel}>Category</ThemedText>
                <ThemedText type="small" style={styles.scoreValue}>{recommendations[selectedIndex].categoryScore}%</ThemedText>
              </View>
              <View style={styles.scoreRow}>
                <ThemedText type="small" style={styles.scoreLabel}>Season</ThemedText>
                <ThemedText type="small" style={styles.scoreValue}>{recommendations[selectedIndex].seasonScore}%</ThemedText>
              </View>
              <View style={styles.scoreRow}>
                <ThemedText type="small" style={styles.scoreLabel}>Occasion</ThemedText>
                <ThemedText type="small" style={styles.scoreValue}>{recommendations[selectedIndex].occasionScore}%</ThemedText>
              </View>
              <View style={styles.scoreRow}>
                <ThemedText type="small" style={styles.scoreLabel}>Colors</ThemedText>
                <ThemedText type="small" style={styles.scoreValue}>{recommendations[selectedIndex].colorScore}%</ThemedText>
              </View>
            </View>

            {recommendations.length > 1 && (
              <View style={styles.pagination}>
                {recommendations.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === selectedIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : !loading ? (
          <ThemedText type="body" style={styles.emptyText}>
            {items.length < 2
              ? "Add at least 2 items to your wardrobe to get recommendations."
              : "Tap \"Generate Suggestions\" to see outfit ideas."}
          </ThemedText>
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  title: {
    textAlign: "left",
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: Spacing.md,
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    gap: Spacing.md,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  scoreHeader: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "700",
  },
  itemsScroll: {
    flexDirection: "row",
  },
  itemPreview: {
    marginRight: Spacing.md,
    alignItems: "center",
    width: 80,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  itemName: {
    textAlign: "center",
  },
  reasonsSection: {
    gap: Spacing.xs,
  },
  reasonsTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  reasonItem: {
    opacity: 0.9,
  },
  scoreBreakdown: {
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreLabel: {
    opacity: 0.7,
  },
  scoreValue: {
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  paginationDotActive: {
    backgroundColor: "#4F46E5",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing.lg,
    opacity: 0.7,
  },
});
