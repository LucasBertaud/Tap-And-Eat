import type { Category } from "@/src/models";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * CategoryCard - Carte pour afficher une catégorie
 */
export function CategoryCard({
  category,
  isSelected,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-4 items-center ${isSelected ? "opacity-100" : "opacity-70"}`}
      activeOpacity={0.7}
    >
      <View
        className={`w-20 h-20 rounded-full overflow-hidden mb-2 border-2 ${
          isSelected ? "border-primary-500" : "border-gray-200"
        }`}
      >
        {category.image_url ? (
          <Image
            source={{ uri: category.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-200 items-center justify-center">
            <Text className="text-2xl text-gray-400">🍔</Text>
          </View>
        )}
      </View>
      <Text
        className={`text-sm text-center font-medium ${
          isSelected ? "text-primary-500" : "text-gray-700"
        }`}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
