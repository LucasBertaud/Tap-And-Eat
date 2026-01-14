import { CategoryCard, ProductCard } from "@/src/components/menu";
import { LoadingSpinner, Navbar, ScreenWrapper } from "@/src/components/ui";
import { useAppSelector } from "@/src/store/hooks";
import { useAuthViewModel, useMenuViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MenuView() {
  const {
    categories,
    filteredCategories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
    filterByCategory,
    searchProducts,
    reload,
  } = useMenuViewModel();

  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { handleSignOut } = useAuthViewModel();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    reload();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      filterByCategory(null);
    } else {
      filterByCategory(categoryId);
    }
  };

  const handleSearchChange = (text: string) => {
    searchProducts(text);
  };

  const handleProductPress = (productId: string) => {
    console.log("Navigating to product:", productId);
    router.push({
      pathname: "/product/[id]",
      params: { id: productId },
    } as any);
  };

  if (isLoading && !refreshing) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <LoadingSpinner fullScreen message="Chargement du menu..." />
      </ScreenWrapper>
    );
  }

  if (refreshing) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <LoadingSpinner fullScreen message="Actualisation..." />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-center text-lg font-semibold text-red-600">
            {error}
          </Text>
          <TouchableOpacity
            onPress={reload}
            className="mt-6 rounded-lg bg-orange-500 px-6 py-3"
          >
            <Text className="font-semibold text-white">Réessayer</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      <Navbar
        title="Notre Menu"
        actions={
          isLoggedIn
            ? [
                {
                  icon: "log-out-outline",
                  label: "Déconnexion",
                  color: "#EF4444",
                  backgroundColor: "bg-error-50",
                  onPress: handleSignOut,
                },
              ]
            : []
        }
      />

      <View className="border-b border-gray-200 bg-white px-4 pb-2 pt-4">
        <View className="mx-auto mb-4 w-full max-w-4xl flex-row items-center rounded-lg bg-gray-100 px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            className="ml-2 flex-1 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => handleSearchChange("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View className="mx-auto w-full max-w-4xl">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <TouchableOpacity
              onPress={() => filterByCategory(null)}
              className={`mr-4 items-center ${!selectedCategoryId ? "opacity-100" : "opacity-70"}`}
              activeOpacity={0.7}
            >
              <View
                className={`mb-2 h-20 w-20 items-center justify-center rounded-full border-2 ${
                  !selectedCategoryId
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                <Ionicons
                  name="grid"
                  size={32}
                  color={!selectedCategoryId ? "#F97316" : "#9CA3AF"}
                />
              </View>
              <Text
                className={`text-center text-sm font-medium ${
                  !selectedCategoryId ? "text-orange-500" : "text-gray-700"
                }`}
              >
                Tout
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategoryId === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
      >
        {filteredCategories.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="sad-outline" size={64} color="#9CA3AF" />
            <Text className="mt-4 text-center text-lg text-gray-500">
              Aucun produit trouvé
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-400">
              Essayez de modifier vos filtres
            </Text>
          </View>
        ) : (
          <View className="mx-auto w-full max-w-4xl">
            {filteredCategories.map((category) => (
              <View key={category.id} className="mt-6">
                {/* Titre de la catégorie */}
                <View className="mb-4 flex-row items-center">
                  <View className="h-px flex-1 bg-gray-200" />
                  <Text className="mx-4 text-xl font-bold text-gray-900">
                    {category.name}
                  </Text>
                  <View className="h-px flex-1 bg-gray-200" />
                </View>

                {category.description && (
                  <Text className="mb-4 text-center text-sm text-gray-600">
                    {category.description}
                  </Text>
                )}

                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() => handleProductPress(product.id)}
                  />
                ))}
              </View>
            ))}
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenWrapper>
  );
}
