import { Colors } from '@/src/constants'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useState } from 'react'
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

interface InputFormProps extends TextInputProps {
  label: string
  error?: string
  required?: boolean
  isPassword?: boolean
}

/**
 * InputForm
 * Composant réutilisable pour les champs de formulaire
 * Affiche un label, un input et un message d'erreur si présent
 */
export const InputForm = ({
  label,
  error,
  required = false,
  value,
  onChangeText,
  isPassword = false,
  ...props
}: InputFormProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className="mb-6">
      <Text className="text-lg font-medium text-text-primary mb-2">
        {label} {required && <Text className="text-error-500">*</Text>}
      </Text>
      <View className="relative">
        <TextInput
          className={`w-full h-16 px-6 bg-surface border ${
            error
              ? 'border-error-500'
              : isFocused
              ? 'border-primary-500'
              : 'border-border-default'
          } rounded-lg text-lg ${isPassword ? 'pr-14' : ''}`}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.text.tertiary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color={Colors.secondary[500]}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View className="flex-row items-center mt-2">
          <Text className="text-sm text-error-500 ml-1">{error}</Text>
        </View>
      ) : null}
    </View>
  )
}
