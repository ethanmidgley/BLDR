import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "History", headerShown: false }}
      />
      <Stack.Screen name="post" options={{ title: "Post" }} />
    </Stack>
  );
}
