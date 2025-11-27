import { Text, TouchableOpacity } from 'react-native'

interface AuthToggleProps {
  isSignUpMode: boolean
  onToggle: () => void
  disabled?: boolean
}

/**
 * AuthToggle
 * Bouton pour basculer entre connexion et inscription
 */
export const AuthToggle = ({ isSignUpMode, onToggle, disabled = false }: AuthToggleProps) => {
  return (
    <TouchableOpacity
      className="mt-8 py-4"
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text className="text-center text-primary-600 text-base font-medium">
        {isSignUpMode
          ? 'Vous avez déjà un compte ? Connectez-vous'
          : 'Pas de compte ? Inscrivez-vous'}
      </Text>
    </TouchableOpacity>
  )
}
