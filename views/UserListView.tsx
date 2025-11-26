import { observer } from "mobx-react-lite";
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
import UserViewModel from "../viewModels/UserViewModel";

// Instance unique du ViewModel (initialisée une seule fois)
const userViewModel = new UserViewModel();

/**
 * UserListView
 * Composant qui affiche la liste des utilisateurs
 * Wrapped avec observer() pour réagir aux changements MobX
 */
const UserListView = observer(() => {
  useEffect(() => {
    userViewModel.loadUsers();
  }, []);

  const handleDeleteUser = (id: string, name: string) => {
    Alert.alert("Confirmer la suppression", `Voulez-vous supprimer ${name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => userViewModel.deleteUser(id),
      },
    ]);
  };

  if (userViewModel.loading && userViewModel.users.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (userViewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{userViewModel.error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => userViewModel.loadUsers()}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userViewModel.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              {item.age && <Text style={styles.userAge}>{item.age} ans</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => userViewModel.selectUser(item)}
              >
                <Text style={styles.selectButtonText}>Modifier</Text>
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
        refreshing={userViewModel.loading}
        onRefresh={() => userViewModel.loadUsers()}
      />
    </View>
  );
});

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

export default UserListView;
export { userViewModel };
