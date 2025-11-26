import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * ConfirmationView - US7: Confirmation
 * Écran de confirmation avec numéro de commande et message de remerciement
 */
export const ConfirmationView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commande confirmée !</Text>
      <Text style={styles.subtitle}>Merci pour votre commande</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4CAF50",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});
