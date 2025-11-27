import { Text, View } from 'react-native'

interface AuthHeaderProps {
  isSignUpMode: boolean
}

/**
 * AuthHeader
 * Header de la page d'authentification avec logo et titre
 */
export const AuthHeader = ({ isSignUpMode }: AuthHeaderProps) => {
  return (
    <View className="items-center mb-12">
      <Text className="text-6xl font-bold text-primary-600 mb-4">🍔 Tap & Eat</Text>
      <Text className="text-xl text-secondary-600">
        {isSignUpMode ? 'Créer un compte' : 'Bienvenue !'}
      </Text>
      <Text className="text-base text-secondary-500 mt-2 text-center">
        {isSignUpMode
          ? 'Rejoignez-nous pour commander facilement'
          : 'Connectez-vous pour passer commande'}
      </Text>
    </View>
  )
}
