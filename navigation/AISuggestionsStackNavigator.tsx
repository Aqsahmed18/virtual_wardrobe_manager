import { HeaderTitle } from "@/components/HeaderTitle";
import { useCommonScreenOptions } from "@/navigation/screenOptions";
import AISuggestionsScreen from "@/screens/AISuggestionsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

export type AISuggestionsStackParamList = {
  AISuggestions: undefined;
};

const Stack = createNativeStackNavigator<AISuggestionsStackParamList>();

export default function AISuggestionsStackNavigator() {
  const screenOptions = useCommonScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="AISuggestions"
        component={AISuggestionsScreen}
        options={{
          headerTransparent: true,
          headerTitle: () => <HeaderTitle title="AI Suggestions" />,
        }}
      />
    </Stack.Navigator>
  );
}
