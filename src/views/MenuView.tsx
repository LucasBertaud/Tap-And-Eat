import { CategoryCard, ProductCard } from "@/src/components/menu";
import { useAppSelector } from "@/src/store/hooks";
import { useAuthViewModel, useMenuViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * MenuView - Vue principale pour parcourir le menu
 * US1 - Parcourir le menu
 * Architecture: MVVM (ViewModel + Redux)
 */
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
    resetFilters,
    reload,
  } = useMenuViewModel();

  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { handleSignOut } = useAuthViewModel();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    reload();
    // Redux gère l'async, on attend juste un peu pour l'UI
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // Si on clique sur la catégorie déjà sélectionnée, on désélectionne
      filterByCategory(null);
    } else {
      filterByCategory(categoryId);
    }
  };

  const handleSearchChange = (text: string) => {
    searchProducts(text);
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  const handleProductPress = (productId: string) => {
    // TODO: Navigation vers la page de détails du produit (US2)
    console.log("Product pressed:", productId);
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="text-gray-600 mt-4">Chargement du menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-red-600 text-lg font-semibold mt-4 text-center">
            {error}
          </Text>
          <TouchableOpacity
            onPress={reload}
            className="mt-6 bg-orange-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* En-tête avec recherche */}
      <View className="bg-white px-4 pt-4 pb-2 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Notre Menu</Text>
          <View className="flex-row items-center gap-3">
            {(selectedCategoryId || searchQuery) && (
              <TouchableOpacity
                onPress={handleClearFilters}
                className="flex-row items-center"
              >
                <Ionicons name="close-circle" size={20} color="#F97316" />
                <Text className="text-orange-500 ml-1 font-medium">
                  Réinitialiser
                </Text>
              </TouchableOpacity>
            )}
            {isLoggedIn && (
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex-row items-center bg-red-50 px-3 py-2 rounded-lg"
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-red-600 ml-1 font-medium">
                  Déconnexion
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            className="flex-1 ml-2 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => handleSearchChange("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des catégories (horizontale) */}
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
              className={`w-20 h-20 rounded-full items-center justify-center mb-2 border-2 ${
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
              className={`text-sm text-center font-medium ${
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

      {/* Liste des produits */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
      >
        {filteredCategories.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="sad-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Aucun produit trouvé
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Essayez de modifier vos filtres
            </Text>
          </View>
        ) : (
          filteredCategories.map((category) => (
            <View key={category.id} className="mt-6">
              {/* Titre de la catégorie */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-xl font-bold text-gray-900 mx-4">
                  {category.name}
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {category.description && (
                <Text className="text-sm text-gray-600 mb-4 text-center">
                  {category.description}
                </Text>
              )}

              {/* Liste des produits de la catégorie */}
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product.id)}
                />
              ))}
            </View>
          ))
        )}

        {/* Espace en bas pour le scroll */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
