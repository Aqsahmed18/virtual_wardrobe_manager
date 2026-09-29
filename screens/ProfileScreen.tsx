import { Button } from "@/components/Button";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { useTheme } from "@/hooks/useTheme";
import type { Category, Occasion, Season } from "@/types/ClothingItem";
import { Feather } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const headerHeight = 91;

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { items, outfits, clearAllData } = useWardrobe();

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all clothing items and outfits. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
          },
        },
      ]
    );
  };

  // Calculate wardrobe statistics
  const categoryStats = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const seasonStats = items.reduce((acc, item) => {
    item.seasons.forEach((season) => {
      acc[season] = (acc[season] || 0) + 1;
    });
    return acc;
  }, {} as Record<Season, number>);

  const occasionStats = items.reduce((acc, item) => {
    item.occasions.forEach((occasion) => {
      acc[occasion] = (acc[occasion] || 0) + 1;
    });
    return acc;
  }, {} as Record<Occasion, number>);

  const colorCounts = items.reduce((acc, item) => {
    item.colors.forEach((color) => {
      acc[color] = (acc[color] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color);

  return (
    <ScreenScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
      <View style={[styles.avatarContainer, { backgroundColor: colors.backgroundDefault }]}>
        <Feather name="user" size={48} color={colors.primary} />
      </View>

      <View style={styles.primaryActionContainer}>
        <Button
          variant="primary"
          size="md"
          icon={<Feather name="bar-chart-2" size={18} color={colors.buttonText} />}
        >
          View wardrobe insights
        </Button>
      </View>

      <ThemedText style={styles.userName}>My Profile</ThemedText>

      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: colors.backgroundDefault,
            borderColor: colors.border,
            shadowColor: colors.text,
            shadowOpacity: 0.04,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          },
        ]}
      >
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{items.length}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Items
          </ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <ThemedText style={styles.statValue}>{outfits.length}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Outfits
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          WARDRODE BREAKDOWN
        </ThemedText>
        
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText style={styles.statsCardTitle}>By Category</ThemedText>
          {Object.entries(categoryStats).map(([category, count]) => (
            <View key={category} style={styles.statRow}>
              <ThemedText style={styles.statRowLabel}>{category}</ThemedText>
              <ThemedText style={styles.statRowValue}>{count}</ThemedText>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText style={styles.statsCardTitle}>Top Colors</ThemedText>
          <View style={styles.colorTags}>
            {topColors.length > 0 ? (
              topColors.map((color, index) => (
                <View key={index} style={[styles.colorTag, { backgroundColor: colors.border }]}>
                  <ThemedText style={styles.colorTagText}>{color}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No colors yet
              </ThemedText>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          ABOUT
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="info" size={20} color={colors.text} />
          <ThemedText style={styles.menuItemText}>About AI Wardrobe</ThemedText>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          STORAGE
        </ThemedText>
        <View
          style={[
            styles.storageInfo,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="database" size={20} color={colors.textSecondary} />
          <ThemedText style={styles.storageText}>Local device storage</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APP INFO
        </ThemedText>
        <View
          style={[
            styles.appInfo,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText style={styles.appInfoLabel}>Version</ThemedText>
          <ThemedText style={styles.appInfoValue}>1.0.0</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          DANGER ZONE
        </ThemedText>
        <Pressable
          onPress={handleClearData}
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.error,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="trash-2" size={20} color={colors.error} />
          <ThemedText style={[styles.menuItemText, { color: colors.error }]}>
            Clear All Data
          </ThemedText>
          <Feather name="chevron-right" size={20} color={colors.error} />
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: Spacing["2xl"],
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing["2xl"],
    width: "100%",
    marginBottom: Spacing["3xl"],
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    marginHorizontal: Spacing.lg,
  },
  section: {
    width: "100%",
    marginBottom: Spacing["2xl"],
  },
  primaryActionContainer: {
    width: "100%",
    marginBottom: Spacing["3xl"],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
  },
  statsCard: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  statRowLabel: {
    fontSize: 14,
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  colorTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  colorTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  colorTagText: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  storageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  storageText: {
    fontSize: 14,
  },
  appInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  appInfoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
