import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * CheckoutView - US5: Valider sa commande
 * Écran de récapitulatif avec scan QR code pour le numéro de table
 */
export const CheckoutView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validation de commande</Text>
      <Text style={styles.subtitle}>
        Récapitulatif et scan du QR code table
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
