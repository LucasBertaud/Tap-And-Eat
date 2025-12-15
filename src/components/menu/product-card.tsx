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
      className="mb-4 h-40 overflow-hidden rounded-xl bg-white shadow-sm md:h-48"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Image du produit */}
        <View className="h-full w-28 md:w-40">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-gray-200">
              <Text className="text-4xl">🍔</Text>
            </View>
          )}
        </View>

        {/* Informations du produit */}
        <View className="flex-1 p-4 md:p-6">
          <Text
            className="mb-1 text-lg font-bold text-gray-900 md:text-2xl"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {product.description && (
            <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
              {product.description}
            </Text>
          )}

          {/* Ingrédients (optionnel) */}
          {product.ingredients && product.ingredients.length > 0 && (
            <Text className="mb-2 text-xs text-gray-500" numberOfLines={1}>
              {product.ingredients.slice(0, 3).join(", ")}
              {product.ingredients.length > 3 && "..."}
            </Text>
          )}

          {/* Prix */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-primary-500 md:text-2xl">
              {product.base_price.toFixed(2)} €
            </Text>
            {!product.is_available && (
              <Text className="text-xs font-medium text-error-500">
                Indisponible
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
