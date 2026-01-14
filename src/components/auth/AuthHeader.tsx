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
      <Text className="mb-4 text-6xl font-bold text-white">
        🍔 Tap & Eat
      </Text>
      <Text className="text-xl text-white">
        {isSignUpMode ? "Créer un compte" : "Bienvenue !"}
      </Text>
      <Text className="mt-2 text-center text-base text-gray-200">
        {isSignUpMode
          ? "Rejoignez-nous pour commander facilement"
          : "Connectez-vous pour passer commande"}
      </Text>
    </View>
  );
};
