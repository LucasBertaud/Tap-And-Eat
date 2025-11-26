import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * PaymentView - US6: Paiement mocké
 * Simulation de paiement avec interface de saisie carte bancaire
 */
export const PaymentView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paiement</Text>
      <Text style={styles.subtitle}>Simulation de paiement par carte</Text>
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
