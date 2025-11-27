import { useProductDetailViewModel } from "@/src/viewmodels/ProductDetailViewModel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { product, loading, error, reload } =
    useProductDetailViewModel(productId);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-gray-600 mt-4">Chargement...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-lg text-gray-800 font-semibold mt-4">
          {error || "Produit introuvable"}
        </Text>
        <TouchableOpacity
          onPress={reload}
          className="bg-primary-500 px-6 py-3 rounded-full mt-6"
        >
          <Text className="text-white font-semibold">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white shadow-sm">
        <View className="flex-row items-center px-4 py-3 pt-12">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 flex-1">
            Détails du produit
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="w-full h-80 bg-gray-200">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-8xl">🍔</Text>
            </View>
          )}
        </View>

        <View className="bg-white p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </Text>

          {product.description && (
            <Text className="text-base text-gray-600 mb-4 leading-6">
              {product.description}
            </Text>
          )}

          <Text className="text-3xl font-bold text-primary-500">
            {product.base_price.toFixed(2)} €
          </Text>
        </View>

        {product.ingredients && product.ingredients.length > 0 && (
          <View className="bg-white mt-2 p-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Ingrédients
            </Text>
            <View className="flex-row flex-wrap">
              {product.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                >
                  <Text className="text-sm text-gray-700">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.option_groups && product.option_groups.length > 0 && (
          <View className="bg-white mt-2 p-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Options disponibles
            </Text>

            {product.option_groups.map((group) => (
              <View key={group.id} className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-gray-800">
                    {group.name}
                  </Text>
                  {group.is_required && (
                    <View className="bg-error-100 rounded-full px-3 py-1">
                      <Text className="text-xs text-error-700 font-medium">
                        Requis
                      </Text>
                    </View>
                  )}
                </View>

                {group.description && (
                  <Text className="text-sm text-gray-600 mb-3">
                    {group.description}
                  </Text>
                )}

                {group.allow_multiple && (
                  <Text className="text-xs text-gray-500 mb-3">
                    {group.min_selections > 0
                      ? `Sélectionnez entre ${group.min_selections} et ${group.max_selections || "plusieurs"} options`
                      : `Sélectionnez jusqu'à ${group.max_selections || "plusieurs"} options`}
                  </Text>
                )}

                <View className="space-y-2">
                  {group.options.map((option) => (
                    <View
                      key={option.id}
                      className="flex-row items-center justify-between py-3 border-b border-gray-100"
                    >
                      <Text className="text-sm text-gray-800 flex-1">
                        {option.name}
                      </Text>
                      {option.price_modifier !== 0 && (
                        <Text className="text-sm text-primary-500 font-medium ml-2">
                          {option.price_modifier > 0 ? "+" : ""}
                          {option.price_modifier.toFixed(2)} €
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {product.is_available && (
        <View className="bg-white border-t border-gray-200 px-6 py-4">
          <TouchableOpacity
            className="bg-primary-500 rounded-full py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              Ajouter au panier
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
