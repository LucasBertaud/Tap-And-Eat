import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * CartView - US4: Gérer son panier
 * Affiche le panier avec possibilité de modifier les quantités et supprimer des articles
 */
export const CartView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier</Text>
      <Text style={styles.subtitle}>Gérez vos articles et quantités</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
