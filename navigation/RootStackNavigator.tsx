import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import AddItemModal from "@/screens/AddItemModal";
import ItemDetailsFormScreen from "@/screens/ItemDetailsFormScreen";
import { useCommonScreenOptions } from "@/navigation/screenOptions";

export type RootStackParamList = {
  MainTabs: undefined;
  AddItemModal: undefined;
  ItemDetailsForm: { imageUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useCommonScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItemModal"
        component={AddItemModal}
        options={{
          presentation: "modal",
          title: "Add Clothing",
        }}
      />
      <Stack.Screen
        name="ItemDetailsForm"
        component={ItemDetailsFormScreen}
        options={{
          presentation: "modal",
          title: "Item Details",
        }}
      />
    </Stack.Navigator>
  );
}
