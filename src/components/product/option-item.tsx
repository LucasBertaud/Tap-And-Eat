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
      className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border-2 ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-secondary-200 bg-white"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        {/* Indicateur de sélection (checkbox/radio) */}
        <View
          className={`w-5 h-5 rounded-full items-center justify-center mr-2 ${
            isSelected
              ? "bg-primary-500"
              : "bg-secondary-100 border-2 border-secondary-300"
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
          className={`text-base font-medium flex-1 ${
            isSelected ? "text-secondary-900" : "text-secondary-700"
          }`}
        >
          {option.name}
        </Text>
      </View>

      {/* Prix modificateur */}
      {option.price_modifier !== 0 && (
        <Text
          className={`text-base font-bold ml-2 ${
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
