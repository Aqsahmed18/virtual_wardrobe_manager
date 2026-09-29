import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { WardrobeStackParamList } from "@/navigation/WardrobeStackNavigator";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<WardrobeStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const headerHeight = 91;
const { width: screenWidth } = Dimensions.get("window");

export default function WardrobeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleAddItem = () => {
    navigation.navigate("AddItemModal");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundRoot }]}>
      <View style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          Wardrobe
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          All your pieces in one place
        </ThemedText>
        <ThemedText type="body" style={styles.tagline}>
          Curate outfits, not clutter.
        </ThemedText>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          <View style={styles.slide}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.slideImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.slideImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.slideImage}
              contentFit="cover"
            />
          </View>
        </ScrollView>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContentSecondary}
        >
          <View style={styles.slide}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.slideImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.slideImage}
              contentFit="cover"
            />
          </View>
        </ScrollView>
      </View>
      <FloatingActionButton onPress={handleAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: headerHeight,
    paddingBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  tagline: {
    opacity: 0.7,
    textAlign: "center",
  },
  carouselContent: {
    paddingTop: Spacing["3xl"],
  },
  carouselContentSecondary: {
    paddingTop: Spacing.lg,
  },
  slide: {
    width: screenWidth - Spacing.lg * 2,
    height: (screenWidth - Spacing.lg * 2) * 0.75,
    borderRadius: Spacing.lg,
    overflow: "hidden",
    marginRight: Spacing.lg,
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
});
