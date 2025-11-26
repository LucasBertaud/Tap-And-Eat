import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * MenuListView - US1: Parcourir le menu
 * Affiche la liste des produits disponibles avec possibilité de filtrer par catégories
 */
export const MenuListView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <Text style={styles.subtitle}>Liste des produits disponibles</Text>
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
