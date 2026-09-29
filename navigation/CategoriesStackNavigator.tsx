import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "@/screens/CategoriesScreen";
import ItemDetailScreen from "@/screens/ItemDetailScreen";
import { useCommonScreenOptions } from "@/navigation/screenOptions";

export type CategoriesStackParamList = {
  Categories: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStackNavigator() {
  const screenOptions = useCommonScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categories",
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{
          title: "Item Details",
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
}
