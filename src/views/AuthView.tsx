import { AuthFooter, AuthHeader, AuthToggle } from "@/src/components/auth";
import { Button, ErrorMessage, InputForm } from "@/src/components/forms";
import { ScreenWrapper } from "@/src/components/ui";
import { BURGER_VIDEO_URL } from "@/src/constants/media";
import { useAlert } from "@/src/hooks/use-alert";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from "@/src/utils/auth";
import { useAuthViewModel } from "@/src/viewmodels";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const AuthView = () => {
  const { showAlert, AlertComponent } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const viewModel = useAuthViewModel();

  const player = useVideoPlayer(BURGER_VIDEO_URL);

  useEffect(() => {
    player.loop = true;
    player.muted = true;
    player.play();
  }, [player]);

  const validateForm = (): boolean => {
    let isValid = true;

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    } else {
      setEmailError("");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      isValid = false;
    } else {
      setPasswordError("");
    }

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
        showAlert({
          title: "Erreur d'inscription",
          message: result.error.message,
          type: "error",
          buttons: [{ text: "OK", style: "default" }],
        });
      } else if (result.success && result.requiresEmailConfirmation) {
        showAlert({
          title: "Vérifiez votre email",
          message: "Un email de confirmation a été envoyé à votre adresse !",
          type: "success",
          buttons: [{ text: "OK", style: "default" }],
        });
      }
    } else {
      const result = await viewModel.handleSignIn({ email, password });
      if (!result.success && result.error) {
        showAlert({
          title: "Erreur de connexion",
          message: result.error.message,
          type: "error",
          buttons: [{ text: "OK", style: "default" }],
        });
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
      {/* Background video: place a file at src/assets/videos/burgers.mp4 */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      {/* Dim overlay so the form stays readable */}
      <View style={styles.overlay} pointerEvents="none" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-12 py-20">
            <View className="w-full max-w-2xl">
              <AuthHeader isSignUpMode={viewModel.isSignUpMode} />

              <View className="w-full">
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

                <ErrorMessage message={viewModel.error?.message} />

                <Button
                  title={
                    viewModel.isSignUpMode ? "Créer mon compte" : "Se connecter"
                  }
                  onPress={handleSubmit}
                  loading={viewModel.isLoading}
                  disabled={viewModel.isLoading}
                />

                <AuthToggle
                  isSignUpMode={viewModel.isSignUpMode}
                  onToggle={handleToggleMode}
                  disabled={viewModel.isLoading}
                />
              </View>

              <AuthFooter />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlertComponent />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});

export default AuthView;
