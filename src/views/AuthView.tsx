import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useAuthViewModel } from "@/src/viewmodels/AuthViewModel";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * AuthView
 * Vue pour l'authentification
 */
const AuthView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const viewModel = useAuthViewModel();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs");
      return;
    }

    if (viewModel.isSignUpMode) {
      const result = await viewModel.handleSignUp({ email, password });
      if (!result.success && result.error) {
        Alert.alert("Erreur", result.error.message);
      } else if (result.success && result.requiresEmailConfirmation) {
        Alert.alert(
          "Vérifiez votre email",
          "Un email de confirmation a été envoyé !"
        );
      }
    } else {
      const result = await viewModel.handleSignIn({ email, password });
      if (!result.success && result.error) {
        Alert.alert("Erreur", result.error.message);
      }
    }
  };

  const handleToggleMode = () => {
    viewModel.toggleMode();
    setEmail("");
    setPassword("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {viewModel.isSignUpMode ? "Créer un compte" : "Bienvenue"}
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!viewModel.isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!viewModel.isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, viewModel.isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={viewModel.isLoading}
        >
          {viewModel.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {viewModel.isSignUpMode ? "S'inscrire" : "Se connecter"}
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleToggleMode}
          disabled={viewModel.isLoading}
        >
          <ThemedText type="link">
            {viewModel.isSignUpMode
              ? "Vous avez déjà un compte ? Connectez-vous"
              : "Pas de compte ? Inscrivez-vous"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 20,
  },
});

export default AuthView;
