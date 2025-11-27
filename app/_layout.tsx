import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import "../global.css";

import { SplashScreenController } from "@/src/components/splash-screen-controller";
import { useAuth } from "@/src/hooks/use-auth-redux";
import { store } from "@/src/store";

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inProductDetail = segments[0] === "product";

    if (!isLoggedIn && inAuthGroup) {
      // Rediriger vers login si déconnecté
      router.replace("/login");
    } else if (
      isLoggedIn &&
      !inAuthGroup &&
      !inProductDetail &&
      segments[0] !== undefined
    ) {
      // Rediriger vers home si connecté (sauf si on est sur product detail)
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, segments, isLoading]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../src/assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
