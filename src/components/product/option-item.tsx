import type { Option } from "@/src/models";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  isMultiple: boolean;
  onPress: () => void;
}

/**
 * OptionItem - Composant pour afficher une option sélectionnable
 * Style type borne McDonald's/BK avec checkbox ou radio
 */
export function OptionItem({
  option,
  isSelected,
  isMultiple,
  onPress,
}: OptionItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-3 flex-row items-center justify-between rounded-xl border-2 p-4 ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-secondary-200 bg-white"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-1 flex-row items-center">
        {/* Indicateur de sélection (checkbox/radio) */}
        <View
          className={`mr-2 h-5 w-5 items-center justify-center rounded-full ${
            isSelected
              ? "bg-primary-500"
              : "border-2 border-secondary-300 bg-secondary-100"
          }`}
        >
          {isSelected && (
            <Ionicons
              name={isMultiple ? "checkmark" : "radio-button-on"}
              size={16}
              color="white"
            />
          )}
        </View>

        {/* Nom de l'option */}
        <Text
          className={`flex-1 text-base font-medium ${
            isSelected ? "text-secondary-900" : "text-secondary-700"
          }`}
        >
          {option.name}
        </Text>
      </View>

      {/* Prix modificateur */}
      {option.price_modifier !== 0 && (
        <Text
          className={`ml-2 text-base font-bold ${
            isSelected ? "text-primary-500" : "text-secondary-600"
          }`}
        >
          {option.price_modifier > 0 ? "+" : ""}
          {option.price_modifier.toFixed(2)} €
        </Text>
      )}
    </TouchableOpacity>
  );
}
