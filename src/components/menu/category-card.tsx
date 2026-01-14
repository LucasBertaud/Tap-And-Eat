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
        className={`mb-2 h-20 w-20 overflow-hidden rounded-full border-2 ${
          isSelected ? "border-primary-500" : "border-gray-200"
        }`}
      >
        {category.image_url ? (
          <Image
            source={{ uri: category.image_url }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-gray-200">
            <Text className="text-2xl text-gray-400">🍔</Text>
          </View>
        )}
      </View>
      <Text
        className={`text-center text-sm font-medium ${
          isSelected ? "text-primary-500" : "text-gray-700"
        }`}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
