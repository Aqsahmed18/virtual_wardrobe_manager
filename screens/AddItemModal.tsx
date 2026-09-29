import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddItemModal() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "Please allow camera access in settings to capture photos of your clothing items."
      );
      return false;
    }
    return true;
  };

  const getPersistentDirectory = () => {
    const dir = (FileSystem as any).documentDirectory as string | null | undefined;
    if (!dir) {
      throw new Error("No persistent file directory available");
    }
    return dir;
  };

  const convertBlobToBase64 = async (blobUri: string): Promise<string> => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Photo Library Permission",
        "Please allow photo library access in settings to select images of your clothing items."
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const originalUri = result.assets[0].uri;
      let finalUri = originalUri;

      try {
        // On web, convert blob to base64 for persistence
        if (originalUri.startsWith('blob:')) {
          finalUri = await convertBlobToBase64(originalUri);
        } else {
          const filename =
            originalUri.split("/").pop() ?? `item-${Date.now()}.jpg`;
          const destUri = getPersistentDirectory() + filename;
          await FileSystem.copyAsync({ from: originalUri, to: destUri });
          finalUri = destUri;
        }
      } catch (error) {
        console.error("Failed to persist image", error);
        Alert.alert(
          "Image Error",
          "Could not save the image to storage, but you can still continue.",
        );
      }

      navigation.replace("ItemDetailsForm", { imageUri: finalUri });
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const originalUri = result.assets[0].uri;
      let finalUri = originalUri;

      try {
        // On web, convert blob to base64 for persistence
        if (originalUri.startsWith('blob:')) {
          finalUri = await convertBlobToBase64(originalUri);
        } else {
          const filename =
            originalUri.split("/").pop() ?? `item-${Date.now()}.jpg`;
          const destUri = getPersistentDirectory() + filename;
          await FileSystem.copyAsync({ from: originalUri, to: destUri });
          finalUri = destUri;
        }
      } catch (error) {
        console.error("Failed to persist image", error);
        Alert.alert(
          "Image Error",
          "Could not save the image to storage, but you can still continue.",
        );
      }

      navigation.replace("ItemDetailsForm", { imageUri: finalUri });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundRoot,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <Pressable
        onPress={handleTakePhoto}
        style={({ pressed }) => [
          styles.actionCard,
          {
            backgroundColor: colors.backgroundDefault,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "1A" }]}>
          <Feather name="camera" size={32} color={colors.primary} />
        </View>
        <ThemedText style={styles.actionTitle}>Take Photo</ThemedText>
        <ThemedText style={[styles.actionDescription, { color: colors.textSecondary }]}>
          Capture a new photo of your clothing item
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={handleChooseFromGallery}
        style={({ pressed }) => [
          styles.actionCard,
          {
            backgroundColor: colors.backgroundDefault,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.secondary + "1A" }]}>
          <Feather name="image" size={32} color={colors.secondary} />
        </View>
        <ThemedText style={styles.actionTitle}>Choose from Gallery</ThemedText>
        <ThemedText style={[styles.actionDescription, { color: colors.textSecondary }]}>
          Select an existing photo from your library
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    gap: Spacing.lg,
  },
  actionCard: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing["3xl"],
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: 14,
    textAlign: "center",
  },
});
