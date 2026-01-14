import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { ScreenWrapper } from "@/src/components/ui";

export function NotFoundView() {
  return (
    <ScreenWrapper className="flex-1">
      <ThemedView style={styles.container}>
        <ThemedText type="title">Cette page n&apos;existe pas.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Retour à l&apos;accueil</ThemedText>
        </Link>
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
