import { CartItemCard } from "@/src/components/cart";
import { Navbar, ScreenWrapper } from "@/src/components/ui";
import { useCartViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

/**
 * CartView - US4 : Gestion du panier
 * Affiche les articles du panier avec possibilité de modifier quantités et supprimer
 * Architecture MVVM : toute la logique est dans CartViewModel
 */
export const CartView: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    itemCount,
    totalPrice,
    isEmpty,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCartViewModel();

  /**
   * Confirmer avant de vider le panier
   */
  const confirmClearCart = () => {
    Alert.alert(
      "Vider le panier",
      "Êtes-vous sûr de vouloir supprimer tous les articles ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          style: "destructive",
          onPress: handleClearCart,
        },
      ]
    );
  };

  /**
   * Naviguer vers la validation de commande
   */
  const handleCheckout = () => {
    // US5 - à implémenter
    Alert.alert("À venir", "La validation de commande sera bientôt disponible");
  };

  return (
    <ScreenWrapper className="flex-1 bg-secondary-50">
      {/* En-tête */}
      <Navbar
        title="Mon Panier"
        subtitle={`${itemCount} ${itemCount > 1 ? "articles" : "article"}`}
        actions={
          !isEmpty
            ? [
                {
                  icon: "trash-outline",
                  label: "Vider",
                  color: "#EF4444",
                  backgroundColor: "bg-error-50",
                  onPress: confirmClearCart,
                },
              ]
            : []
        }
      />

      {/* Contenu */}
      {isEmpty ? (
        // Panier vide
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-secondary-100 rounded-full p-8 mb-4">
            <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-semibold text-secondary-900 mb-2">
            Votre panier est vide
          </Text>
          <Text className="text-base text-secondary-600 text-center mb-6">
            Ajoutez des produits pour commencer votre commande
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary-500 px-8 py-4 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold px-4">
              Voir le menu
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Liste des articles
        <>
          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                onRemove={handleRemoveItem}
              />
            ))}

            {/* Espacement en bas pour le bouton fixe */}
            <View className="h-24" />
          </ScrollView>

          {/* Barre de validation en bas (fixe) */}
          <View className="bg-white border-t border-secondary-200 px-4 pt-4 pb-8">
            {/* Récapitulatif */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base text-secondary-600">Total</Text>
              <Text className="text-2xl font-bold text-secondary-900">
                {totalPrice.toFixed(2)} €
              </Text>
            </View>

            {/* Bouton Commander */}
            <TouchableOpacity
              onPress={handleCheckout}
              className="bg-primary-500 rounded-full py-4 items-center"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">
                  Commander
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
};
