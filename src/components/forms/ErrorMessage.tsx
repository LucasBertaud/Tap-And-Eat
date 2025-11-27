import { Text, View } from 'react-native'

interface ErrorMessageProps {
  message?: string | null
}

/**
 * ErrorMessage
 * Composant pour afficher les messages d'erreur globaux
 */
export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <View className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
      <Text className="text-error-600 text-base text-center">{message}</Text>
    </View>
  )
}
