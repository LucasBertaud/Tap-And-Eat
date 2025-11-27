import { AuthFooter, AuthHeader, AuthToggle } from "@/src/components/auth";
import { Button, ErrorMessage, InputForm } from "@/src/components/forms";
import { ScreenWrapper } from "@/src/components/ui";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@/src/utils";
import { useAuthViewModel } from "@/src/viewmodels";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

/**
 * AuthView
 * Vue pour l'authentification
 */
const AuthView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const viewModel = useAuthViewModel();

  const validateForm = (): boolean => {
    let isValid = true;

    // Validation email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validation mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validation champs supplémentaires pour l'inscription
    if (viewModel.isSignUpMode) {
      const fullNameValidation = validateFullName(fullName);
      if (!fullNameValidation.isValid) {
        setFullNameError(fullNameValidation.error || "");
        isValid = false;
      } else {
        setFullNameError("");
      }

      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.error || "");
        isValid = false;
      } else {
        setPhoneError("");
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (viewModel.isSignUpMode) {
      const result = await viewModel.handleSignUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });
      if (!result.success && result.error) {
        Alert.alert("Erreur d'inscription", result.error.message);
      } else if (result.success && result.requiresEmailConfirmation) {
        Alert.alert(
          "Vérifiez votre email",
          "Un email de confirmation a été envoyé à votre adresse !"
        );
      }
    } else {
      const result = await viewModel.handleSignIn({ email, password });
      if (!result.success && result.error) {
        Alert.alert("Erreur de connexion", result.error.message);
      }
    }
  };

  const handleToggleMode = () => {
    viewModel.toggleMode();
    setEmail("");
    setPassword("");
    setFullName("");
    setPhone("");
    setEmailError("");
    setPasswordError("");
    setFullNameError("");
    setPhoneError("");
  };

  return (
    <ScreenWrapper className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-12 py-20 justify-center">
            {/* Header */}
            <AuthHeader isSignUpMode={viewModel.isSignUpMode} />

            {/* Formulaire */}
            <View className="w-full max-w-xl mx-auto">
              {/* Champ Nom complet (uniquement inscription) */}
              {viewModel.isSignUpMode && (
                <InputForm
                  label="Nom complet"
                  required
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (fullNameError) setFullNameError("");
                  }}
                  error={fullNameError}
                  editable={!viewModel.isLoading}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              )}

              {/* Champ Email */}
              <InputForm
                label="Email"
                required
                placeholder="exemple@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
                editable={!viewModel.isLoading}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              {/* Champ Téléphone (uniquement inscription) */}
              {viewModel.isSignUpMode && (
                <InputForm
                  label="Téléphone"
                  required
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) setPhoneError("");
                  }}
                  error={phoneError}
                  editable={!viewModel.isLoading}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              )}

              {/* Champ Mot de passe */}
              <InputForm
                label="Mot de passe"
                required
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
                error={passwordError}
                editable={!viewModel.isLoading}
                isPassword
                autoCapitalize="none"
                autoComplete="password"
              />

              {/* Message d'erreur global */}
              <ErrorMessage message={viewModel.error?.message} />

              {/* Bouton principal */}
              <Button
                title={
                  viewModel.isSignUpMode ? "Créer mon compte" : "Se connecter"
                }
                onPress={handleSubmit}
                loading={viewModel.isLoading}
                disabled={viewModel.isLoading}
              />

              {/* Bouton de changement de mode */}
              <AuthToggle
                isSignUpMode={viewModel.isSignUpMode}
                onToggle={handleToggleMode}
                disabled={viewModel.isLoading}
              />
            </View>

            {/* Footer */}
            <AuthFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default AuthView;
