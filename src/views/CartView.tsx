import { CartItemCard } from "@/src/components/cart";
import { Navbar, ScreenWrapper } from "@/src/components/ui";
import { useAlert } from "@/src/hooks/use-alert";
import { useCartViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const CartView: React.FC = () => {
  const router = useRouter();
  const { showAlert, AlertComponent } = useAlert();
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

  const confirmClearCart = () => {
    showAlert({
      title: "Vider le panier",
      message: "Êtes-vous sûr de vouloir supprimer tous les articles ?",
      type: "warning",
      buttons: [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          style: "destructive",
          onPress: handleClearCart,
        },
      ],
    });
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <ScreenWrapper className="flex-1 bg-secondary-50">
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

      {isEmpty ? (
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
        <>
          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="items-center"
          >
            <View className="w-full">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}

              <View className="h-24" />
            </View>
          </ScrollView>

          <View className="bg-white border-t border-secondary-200 px-4 pt-4 pb-8">
            <View className="w-full max-w-3xl mx-auto">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base text-secondary-600">Total</Text>
                <Text className="text-2xl font-bold text-secondary-900">
                  {totalPrice.toFixed(2)} €
                </Text>
              </View>

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
          </View>
        </>
      )}
      <AlertComponent />
    </ScreenWrapper>
  );
};
