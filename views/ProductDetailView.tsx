import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * ProductDetailView - US2: Consulter un produit & US3: Personnaliser sa commande
 * Affiche les détails d'un produit et permet sa personnalisation
 */
export const ProductDetailView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du produit</Text>
      <Text style={styles.subtitle}>
        Description, prix, options de personnalisation
      </Text>
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
