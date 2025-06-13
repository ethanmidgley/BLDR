import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "History" }} />
      <Stack.Screen name="post" options={{ title: "Post" }} />
    </Stack>
  );
}
