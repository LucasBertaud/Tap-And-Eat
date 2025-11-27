import type { Product } from "@/src/models";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

/**
 * ProductCard - Carte pour afficher un produit
 */
export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Image du produit */}
        <View className="w-28 h-28">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Text className="text-4xl">🍔</Text>
            </View>
          )}
        </View>

        {/* Informations du produit */}
        <View className="flex-1 p-4">
          <Text
            className="text-lg font-bold text-gray-900 mb-1"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {product.description && (
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {product.description}
            </Text>
          )}

          {/* Ingrédients (optionnel) */}
          {product.ingredients && product.ingredients.length > 0 && (
            <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
              {product.ingredients.slice(0, 3).join(", ")}
              {product.ingredients.length > 3 && "..."}
            </Text>
          )}

          {/* Prix */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-primary-500">
              {product.base_price.toFixed(2)} €
            </Text>
            {!product.is_available && (
              <Text className="text-xs text-error-500 font-medium">
                Indisponible
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
