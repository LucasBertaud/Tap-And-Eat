import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserViewModel } from "../viewmodels";

/**
 * UserListView
 * Composant Vue qui affiche la liste des utilisateurs
 * Utilise le UserViewModel pour accéder aux données et aux actions
 */
export const UserListView: React.FC = () => {
  const viewModel = useUserViewModel();

  useEffect(() => {
    viewModel.loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteUser = (id: string, name: string) => {
    Alert.alert("Confirmer la suppression", `Voulez-vous supprimer ${name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => viewModel.deleteUser(id),
      },
    ]);
  };

  if (viewModel.loading && viewModel.users.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (viewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{viewModel.error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => viewModel.loadUsers()}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={viewModel.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              {item.age && (
                <Text style={styles.userAge}>
                  {item.age} ans {item.isAdult() ? "(majeur)" : "(mineur)"}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => viewModel.selectUser(item)}
              >
                <Text style={styles.selectButtonText}>Détails</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteUser(item.id, item.name)}
              >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun utilisateur</Text>
          </View>
        }
        refreshing={viewModel.loading}
        onRefresh={() => viewModel.loadUsers()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userAge: {
    fontSize: 14,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
