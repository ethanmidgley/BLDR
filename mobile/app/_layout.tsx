import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "@/context/context";
import "react-native-reanimated";
import {
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold_Italic,
} from "@expo-google-fonts/archivo";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Archivo_500Medium,
    Archivo_700Bold_Italic,
    Archivo_600SemiBold,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <Slot />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
