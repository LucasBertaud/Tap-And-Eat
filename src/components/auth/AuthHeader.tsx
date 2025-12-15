import { Text, View } from "react-native";

interface AuthHeaderProps {
  isSignUpMode: boolean;
}

/**
 * AuthHeader
 * Header de la page d'authentification avec logo et titre
 */
export const AuthHeader = ({ isSignUpMode }: AuthHeaderProps) => {
  return (
    <View className="mb-12 items-center">
      <Text className="mb-4 text-6xl font-bold text-primary-600">
        🍔 Tap & Eat
      </Text>
      <Text className="text-xl text-secondary-600">
        {isSignUpMode ? "Créer un compte" : "Bienvenue !"}
      </Text>
      <Text className="mt-2 text-center text-base text-secondary-500">
        {isSignUpMode
          ? "Rejoignez-nous pour commander facilement"
          : "Connectez-vous pour passer commande"}
      </Text>
    </View>
  );
};
