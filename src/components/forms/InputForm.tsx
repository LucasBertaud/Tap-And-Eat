import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputFormProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  isPassword?: boolean;
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
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-6">
      <Text className="mb-2 text-lg font-medium text-text-primary md:text-xl">
        {label} {required && <Text className="text-error-500">*</Text>}
      </Text>
      <View className="relative">
        <TextInput
          className={`h-16 w-full border bg-surface px-6 md:h-20 md:px-8 ${
            error
              ? "border-error-500"
              : isFocused
                ? "border-primary-500"
                : "border-border-default"
          } rounded-lg text-lg md:text-xl ${isPassword ? "pr-14" : ""}`}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-4 md:right-6 md:top-6"
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={28}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View className="mt-2 flex-row items-center">
          <Text className="ml-1 text-sm text-error-500">{error}</Text>
        </View>
      ) : null}
    </View>
  );
};
