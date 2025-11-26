import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import UserFormView from "./UserFormView";
import UserListView from "./UserListView";

/**
 * UserManagementView
 * Vue principale combinant le formulaire et la liste
 * Exemple complet d'utilisation de MVVM avec MobX
 */
const UserManagementView: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formSection}>
        <UserFormView />
      </View>
      <View style={styles.listSection}>
        <UserListView />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formSection: {
    flex: 0.4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listSection: {
    flex: 0.6,
  },
});

export default UserManagementView;
