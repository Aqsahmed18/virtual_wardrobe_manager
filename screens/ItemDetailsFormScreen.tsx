import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { useTheme } from "@/hooks/useTheme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Category, ClothingItem, Gender, Occasion, Season } from "@/types/ClothingItem";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, "ItemDetailsForm">;

const CATEGORIES: Category[] = ["Tops", "Bottoms", "Shoes", "Accessories", "Outerwear"];
const SEASONS: Season[] = ["Spring", "Summer", "Fall", "Winter"];
const OCCASIONS: Occasion[] = ["Casual", "Work", "Formal", "Sport"];
const COLORS = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Gray", "Brown", "Pink", "Purple"];
const GENDERS: Gender[] = ["men", "women", "unisex"];

export default function ItemDetailsFormScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { addItem } = useWardrobe();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Tops");
  const [gender, setGender] = useState<Gender>("unisex");
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSeason = (season: Season) => {
    setSelectedSeasons((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleOccasion = (occasion: Occasion) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion) ? prev.filter((o) => o !== occasion) : [...prev, occasion]
    );
  };

  const handleSave = async () => {
    if (selectedSeasons.length === 0) {
      Alert.alert("Missing Information", "Please select at least one season");
      return;
    }
    if (selectedOccasions.length === 0) {
      Alert.alert("Missing Information", "Please select at least one occasion");
      return;
    }

    setSaving(true);
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      imageUri: route.params.imageUri,
      name: name.trim() || undefined,
      category,
      gender,
      seasons: selectedSeasons,
      colors: selectedColors,
      occasions: selectedOccasions,
      dateAdded: new Date().toISOString(),
    };

    await addItem(newItem);
    setSaving(false);
    navigation.navigate("MainTabs");
  };

  return (
    <ScreenKeyboardAwareScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: Spacing["3xl"] },
      ]}
    >
      <View style={[styles.imagePreview, { borderColor: colors.border }]}>
        <Image
          source={{ uri: route.params.imageUri }}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>GENDER</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {GENDERS.map((value) => (
            <Pressable
              key={value}
              onPress={() => setGender(value)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    gender === value ? colors.primary : colors.backgroundDefault,
                  borderColor: gender === value ? colors.primary : colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color:
                      gender === value ? colors.buttonText : colors.text,
                  },
                ]}
              >
                {value === "men" ? "Men" : value === "women" ? "Women" : "Unisex"}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>NAME (OPTIONAL)</ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Blue denim jacket"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundDefault,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>CATEGORY</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    category === cat ? colors.primary : colors.backgroundDefault,
                  borderColor: category === cat ? colors.primary : colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  { color: category === cat ? colors.buttonText : colors.text },
                ]}
              >
                {cat}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>SEASON</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {SEASONS.map((season) => (
            <Pressable
              key={season}
              onPress={() => toggleSeason(season)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedSeasons.includes(season)
                    ? colors.primary
                    : colors.backgroundDefault,
                  borderColor: selectedSeasons.includes(season)
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color: selectedSeasons.includes(season)
                      ? colors.buttonText
                      : colors.text,
                  },
                ]}
              >
                {season}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>COLORS (OPTIONAL)</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => toggleColor(color)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedColors.includes(color)
                    ? colors.secondary
                    : colors.backgroundDefault,
                  borderColor: selectedColors.includes(color)
                    ? colors.secondary
                    : colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color: selectedColors.includes(color)
                      ? colors.buttonText
                      : colors.text,
                  },
                ]}
              >
                {color}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>OCCASION</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {OCCASIONS.map((occasion) => (
            <Pressable
              key={occasion}
              onPress={() => toggleOccasion(occasion)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedOccasions.includes(occasion)
                    ? colors.primary
                    : colors.backgroundDefault,
                  borderColor: selectedOccasions.includes(occasion)
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  {
                    color: selectedOccasions.includes(occasion)
                      ? colors.buttonText
                      : colors.text,
                  },
                ]}
              >
                {occasion}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: colors.primary,
            opacity: pressed || saving ? 0.8 : 1,
          },
        ]}
      >
        <ThemedText style={[styles.saveButtonText, { color: colors.buttonText }]}>
          {saving ? "Saving..." : "Save Item"}
        </ThemedText>
      </Pressable>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
  },
  imagePreview: {
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing["2xl"],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
