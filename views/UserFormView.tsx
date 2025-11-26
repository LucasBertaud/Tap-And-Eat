import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { userViewModel } from "./UserListView";

/**
 * UserFormView
 * Composant pour créer ou modifier un utilisateur
 * Wrapped avec observer() pour réagir aux changements de selectedUser
 */
const UserFormView = observer(() => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // Pré-remplir le formulaire si un utilisateur est sélectionné
  useEffect(() => {
    if (userViewModel.selectedUser) {
      setName(userViewModel.selectedUser.name);
      setEmail(userViewModel.selectedUser.email);
      setAge(userViewModel.selectedUser.age?.toString() || "");
    }
  }, [userViewModel.selectedUser]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    const ageNumber = age ? parseInt(age, 10) : undefined;

    if (userViewModel.selectedUser) {
      await userViewModel.updateUser(userViewModel.selectedUser.id, {
        name,
        email,
        age: ageNumber,
      });
    } else {
      await userViewModel.createUser(name, email, ageNumber);
    }

    // Réinitialiser le formulaire
    if (!userViewModel.error) {
      setName("");
      setEmail("");
      setAge("");
      userViewModel.selectUser(null);
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setAge("");
    userViewModel.selectUser(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {userViewModel.selectedUser
              ? "Modifier l'utilisateur"
              : "Nouvel utilisateur"}
          </Text>

          {userViewModel.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{userViewModel.error}</Text>
              <TouchableOpacity onPress={() => userViewModel.clearError()}>
                <Text style={styles.dismissError}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Entrez le nom"
              editable={!userViewModel.loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Entrez l'email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!userViewModel.loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Âge</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Entrez l'âge"
              keyboardType="numeric"
              editable={!userViewModel.loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={userViewModel.loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={userViewModel.loading}
            >
              {userViewModel.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {userViewModel.selectedUser ? "Modifier" : "Créer"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: "#ff3b30",
    fontSize: 14,
  },
  dismissError: {
    color: "#ff3b30",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserFormView;
