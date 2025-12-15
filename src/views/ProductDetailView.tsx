import { OptionGroupSelector } from "@/src/components/product";
import { LoadingSpinner, Navbar, ScreenWrapper } from "@/src/components/ui";
import { useAlert } from "@/src/hooks/use-alert";
import { addToCart } from "@/src/store/slices/cartSlice";
import { useProductDetailViewModel } from "@/src/viewmodels/ProductDetailViewModel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const dispatch = useDispatch();
  const { showAlert, AlertComponent } = useAlert();
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
      showAlert({
        title: "Limite atteinte",
        message: errorMessage,
        type: "warning",
        buttons: [{ text: "OK", style: "default" }],
      });
    }
  };

  const handleAddToCart = () => {
    if (!canAddToCart || !product) {
      showAlert({
        title: "Options manquantes",
        message: "Veuillez sélectionner toutes les options requises",
        type: "warning",
        buttons: [{ text: "OK", style: "default" }],
      });
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

    showAlert({
      title: "Ajouté au panier",
      message: `${quantity}x ${product.name} ajouté au panier`,
      type: "success",
      buttons: [{ text: "OK", onPress: () => router.back(), style: "default" }],
    });
  };

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <LoadingSpinner fullScreen message="Chargement du produit..." />
      </ScreenWrapper>
    );
  }

  if (error || !product) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">
            {error || "Produit introuvable"}
          </Text>
          <TouchableOpacity
            onPress={reload}
            className="mt-6 rounded-full bg-primary-500 px-6 py-3"
          >
            <Text className="font-semibold text-white">Réessayer</Text>
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
          <View className="h-80 w-full bg-gray-200 md:h-[42rem]">
            {product.image_url ? (
              <Image
                source={{ uri: product.image_url }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="text-8xl">🍔</Text>
              </View>
            )}
          </View>

          <View className="bg-white p-6 md:p-8">
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              {product.name}
            </Text>

            {product.description && (
              <Text className="mb-4 text-base leading-6 text-gray-600">
                {product.description}
              </Text>
            )}

            <Text className="text-3xl font-bold text-primary-500">
              {product.base_price.toFixed(2)} €
            </Text>
          </View>

          {product.ingredients && product.ingredients.length > 0 && (
            <View className="mt-2 bg-white p-6 md:p-8">
              <Text className="mb-3 text-lg font-semibold text-secondary-900">
                Ingrédients
              </Text>
              <View className="flex-row flex-wrap">
                {product.ingredients.map((ingredient, index) => (
                  <View
                    key={index}
                    className="mb-2 mr-2 rounded-full bg-secondary-100 px-4 py-2"
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
            <View className="mt-2 bg-white p-6 md:p-8">
              <Text className="mb-6 text-2xl font-bold text-secondary-900">
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
        <View className="border-t border-secondary-200 bg-white px-6 pb-8 pt-4 shadow-lg">
          <View className="mx-auto w-full max-w-4xl">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-secondary-900">
                Quantité
              </Text>
              <View className="flex-row items-center overflow-hidden rounded-xl bg-secondary-100">
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-14 w-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove-circle" size={32} color="#F97316" />
                </TouchableOpacity>
                <Text className="px-6 text-2xl font-bold text-secondary-900">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  className="h-14 w-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle" size={32} color="#F97316" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!canAddToCart}
              className={`items-center rounded-xl py-5 shadow-lg ${
                canAddToCart ? "bg-primary-500" : "bg-secondary-400"
              }`}
              activeOpacity={0.8}
            >
              <View className="w-full flex-row items-center justify-between px-6">
                <Text className="text-xl font-bold text-white">
                  Ajouter au panier
                </Text>
                <View className="rounded-xl bg-white/20 px-4 py-2">
                  <Text className="text-xl font-black text-white">
                    {totalPrice.toFixed(2)} €
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {!canAddToCart && (
              <Text className="mt-3 text-center text-sm font-medium text-error-600">
                ⚠️ Sélectionnez toutes les options requises
              </Text>
            )}
          </View>
        </View>
      )}
      <AlertComponent />
    </ScreenWrapper>
  );
}
