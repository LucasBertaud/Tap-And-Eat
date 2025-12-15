import AuthView from "@/src/views/AuthView";
import { Stack } from "expo-router";

/**
 * Login Screen
 */
export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Connexion" }} />
      <AuthView />
    </>
  );
}
