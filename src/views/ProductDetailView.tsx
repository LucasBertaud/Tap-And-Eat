import { OptionGroupSelector } from "@/src/components/product";
import { Navbar, ScreenWrapper } from "@/src/components/ui";
import { addToCart } from "@/src/store/slices/cartSlice";
import { useProductDetailViewModel } from "@/src/viewmodels/ProductDetailViewModel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const dispatch = useDispatch();
  const {
    product,
    loading,
    error,
    reload,
    selectedOptions,
    quantity,
    setQuantity,
    handleOptionToggle,
    totalPrice,
    canAddToCart,
    getSelectedOptionsList,
  } = useProductDetailViewModel(productId);

  const onOptionToggle = (groupId: string, optionId: string) => {
    const errorMessage = handleOptionToggle(groupId, optionId);
    if (errorMessage) {
      Alert.alert("Limite atteinte", errorMessage);
    }
  };

  const handleAddToCart = () => {
    if (!canAddToCart || !product) {
      Alert.alert(
        "Options manquantes",
        "Veuillez sélectionner toutes les options requises"
      );
      return;
    }

    const selectedOptionsList = getSelectedOptionsList();

    dispatch(
      addToCart({
        product,
        selectedOptions: selectedOptionsList,
        quantity,
      })
    );

    Alert.alert(
      "✅ Ajouté au panier",
      `${quantity}x ${product.name} ajouté au panier`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="text-gray-600 mt-4">Chargement...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !product) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
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
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right", "bottom"]}
    >
      <Navbar title="Détails du produit" showBackButton />

      <ScrollView className="flex-1" contentContainerClassName="items-center">
        <View className="w-full">
          <View className="w-full md:h-[42rem] h-80 bg-gray-200">
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

          <View className="bg-white p-6 md:p-8">
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
            <View className="bg-white mt-2 p-6 md:p-8">
              <Text className="text-lg font-semibold text-secondary-900 mb-3">
                Ingrédients
              </Text>
              <View className="flex-row flex-wrap">
                {product.ingredients.map((ingredient, index) => (
                  <View
                    key={index}
                    className="bg-secondary-100 rounded-full px-4 py-2 mr-2 mb-2"
                  >
                    <Text className="text-sm text-secondary-700">
                      {ingredient}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {product.option_groups && product.option_groups.length > 0 && (
            <View className="bg-white mt-2 p-6 md:p-8">
              <Text className="text-2xl font-bold text-secondary-900 mb-6">
                Personnalisez votre commande
              </Text>

              {product.option_groups.map((group) => (
                <OptionGroupSelector
                  key={group.id}
                  group={group}
                  selectedOptionIds={selectedOptions[group.id] || []}
                  onOptionToggle={(optionId) =>
                    onOptionToggle(group.id, optionId)
                  }
                />
              ))}
            </View>
          )}

          <View className="h-32" />
        </View>
      </ScrollView>

      {product.is_available && (
        <View className="bg-white border-t border-secondary-200 px-6 pt-4 pb-8 shadow-lg">
          <View className="w-full max-w-4xl mx-auto">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-secondary-900">
                Quantité
              </Text>
              <View className="flex-row items-center bg-secondary-100 rounded-xl overflow-hidden">
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove-circle" size={32} color="#F97316" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-secondary-900 px-6">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle" size={32} color="#F97316" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!canAddToCart}
              className={`rounded-xl py-5 items-center shadow-lg ${
                canAddToCart ? "bg-primary-500" : "bg-secondary-400"
              }`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between w-full px-6">
                <Text className="text-white text-xl font-bold">
                  Ajouter au panier
                </Text>
                <View className="bg-white/20 rounded-xl px-4 py-2">
                  <Text className="text-white text-xl font-black">
                    {totalPrice.toFixed(2)} €
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {!canAddToCart && (
              <Text className="text-error-600 text-sm text-center mt-3 font-medium">
                ⚠️ Sélectionnez toutes les options requises
              </Text>
            )}
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
