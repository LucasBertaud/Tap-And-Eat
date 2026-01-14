import { Text, View } from "react-native";

interface ErrorMessageProps {
  message?: string | null;
}

/**
 * ErrorMessage
 * Composant pour afficher les messages d'erreur globaux
 */
export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <View className="mb-6 rounded-lg border border-error-200 bg-error-50 p-4">
      <Text className="text-center text-base text-error-600">{message}</Text>
    </View>
  );
};
