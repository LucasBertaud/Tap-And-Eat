import React, { useState } from "react";
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
import { useUserViewModel } from "../viewmodels";

/**
 * UserFormView
 * Composant Vue pour créer ou modifier un utilisateur
 */
export const UserFormView: React.FC = () => {
  const viewModel = useUserViewModel();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const ageNumber = age ? parseInt(age, 10) : undefined;

    if (viewModel.selectedUser) {
      await viewModel.updateUser(viewModel.selectedUser.id, {
        name,
        email,
        age: ageNumber,
      });
    } else {
      await viewModel.createUser(name, email, ageNumber);
    }

    // Réinitialiser le formulaire après soumission
    if (!viewModel.error) {
      setName("");
      setEmail("");
      setAge("");
      viewModel.selectUser(null);
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setAge("");
    viewModel.selectUser(null);
  };

  // Pré-remplir le formulaire si un utilisateur est sélectionné
  React.useEffect(() => {
    if (viewModel.selectedUser) {
      setName(viewModel.selectedUser.name);
      setEmail(viewModel.selectedUser.email);
      setAge(viewModel.selectedUser.age?.toString() || "");
    }
  }, [viewModel.selectedUser]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {viewModel.selectedUser
              ? "Modifier l'utilisateur"
              : "Nouvel utilisateur"}
          </Text>

          {viewModel.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{viewModel.error}</Text>
              <TouchableOpacity onPress={() => viewModel.clearError()}>
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
              editable={!viewModel.loading}
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
              editable={!viewModel.loading}
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
              editable={!viewModel.loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={viewModel.loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={viewModel.loading}
            >
              {viewModel.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {viewModel.selectedUser ? "Modifier" : "Créer"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
