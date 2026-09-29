import { ClothingCard } from "@/components/ClothingCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { useTheme } from "@/hooks/useTheme";
import type { CategoriesStackParamList } from "@/navigation/CategoriesStackNavigator";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Category } from "@/types/ClothingItem";
import { Feather } from "@expo/vector-icons";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, SectionList, StyleSheet, View } from "react-native";

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CategoriesStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const CATEGORIES: Category[] = ["Tops", "Bottoms", "Shoes", "Accessories", "Outerwear"];
const headerHeight = 91;
const tabBarHeight = 49;

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { items } = useWardrobe();
  const navigation = useNavigation<NavigationProp>();
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(
    new Set()
  );

  const toggleCategory = (category: Category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddItem = () => {
    navigation.navigate("AddItemModal");
  };

  const handleItemPress = (itemId: string) => {
    navigation.navigate("ItemDetail", { itemId });
  };

  const sections = CATEGORIES.map((category) => ({
    title: category,
    data: items.filter((item) => item.category === category),
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundRoot }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl + 70 },
        ]}
        ListHeaderComponent={<View style={{ height: headerHeight }} />}
        renderSectionHeader={({ section }) => {
          const isExpanded = expandedCategories.has(section.title as Category);

          return (
            <View
              style={[
                styles.sectionHeader,
                {
                  backgroundColor: colors.backgroundDefault,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderContent}>
                <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={[styles.badgeText, { color: colors.buttonText }]}>
                    {section.data.length}
                  </ThemedText>
                </View>
              </View>
              <Pressable
                onPress={() => toggleCategory(section.title as Category)}
                style={styles.sectionToggleButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            </View>
          );
        }}
        renderItem={() => null}
        renderSectionFooter={({ section }) => {
          const isExpanded = expandedCategories.has(section.title as Category);

          if (!isExpanded) {
            return null;
          }

          if (section.data.length === 0) {
            return (
              <View style={styles.emptySection}>
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No {section.title.toLowerCase()} added yet
                </ThemedText>
              </View>
            );
          }

          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalItemsRow}
            >
              {section.data.map((item) => (
                <View key={item.id} style={styles.cardWrapperHorizontal}>
                  <ClothingCard
                    item={item}
                    onPress={() => handleItemPress(item.id)}
                  />
                </View>
              ))}
            </ScrollView>
          );
        }}
      />
      <FloatingActionButton onPress={handleAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionToggleButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptySection: {
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  horizontalItemsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    gap: Spacing.md,
  },
  cardWrapperHorizontal: {
    width: 160,
  },
});
