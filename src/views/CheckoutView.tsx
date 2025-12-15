import { QRScanner } from "@/src/components/checkout";
import { Navbar, ScreenWrapper } from "@/src/components/ui";
import { useAlert } from "@/src/hooks/use-alert";
import { calculateItemTotal } from "@/src/models";
import { useCheckoutViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const CheckoutView: React.FC = () => {
  const router = useRouter();
  const { showAlert, AlertComponent } = useAlert();
  const {
    cartItems,
    totalPrice,
    itemCount,
    tableNumber,
    showScanner,
    canProceedToPayment,
    handleOpenScanner,
    handleCloseScanner,
    handleQRScanned,
    handleResetTable,
  } = useCheckoutViewModel();

  const handleProceedToPayment = () => {
    if (!canProceedToPayment) {
      showAlert({
        title: "Erreur",
        message: "Veuillez scanner le QR code de votre table",
        type: "error",
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }
    router.push("/payment");
  };

  if (cartItems.length === 0) {
    return (
      <ScreenWrapper className="flex-1 bg-secondary-50">
        <Navbar title="Récapitulatif" showBackButton />
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-secondary-100 rounded-full p-8 mb-4">
            <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-semibold text-secondary-900 mb-2">
            Votre panier est vide
          </Text>
          <Text className="text-base text-secondary-600 text-center mb-6">
            Ajoutez des produits avant de valider votre commande
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary-500 px-8 py-4 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">
              Voir le menu
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-secondary-50">
      <Navbar title="Récapitulatif" showBackButton />

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-secondary-900 mb-2">
            Votre commande
          </Text>
          <Text className="text-sm text-secondary-600">
            {itemCount} {itemCount > 1 ? "articles" : "article"}
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-secondary-900 mb-3">
            Détails
          </Text>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
              className={`${index > 0 ? "pt-3 border-t border-secondary-100" : ""}`}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-secondary-900">
                    {item.quantity}x {item.product.name}
                  </Text>
                  <Text className="text-sm text-secondary-600 mt-1">
                    {item.product.base_price.toFixed(2)} € l&apos;unité
                  </Text>
                </View>
                <Text className="text-base font-bold text-secondary-900">
                  {calculateItemTotal(item).toFixed(2)} €
                </Text>
              </View>

              {item.selectedOptions.length > 0 && (
                <View className="ml-4 mt-1">
                  {item.selectedOptions.map((option) => (
                    <View
                      key={option.optionId}
                      className="flex-row justify-between mb-1"
                    >
                      <Text className="text-sm text-secondary-600">
                        • {option.name}
                      </Text>
                      {option.priceModifier > 0 && (
                        <Text className="text-sm text-secondary-600">
                          +{option.priceModifier.toFixed(2)} €
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-secondary-900 mb-3">
            Numéro de table
          </Text>
          {tableNumber ? (
            <View className="flex-row items-center justify-between bg-success-50 rounded-lg p-3">
              <View className="flex-row items-center">
                <View className="bg-success-500 rounded-full w-10 h-10 items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-sm text-success-700 font-medium">
                    Table confirmée
                  </Text>
                  <Text className="text-lg font-bold text-success-900">
                    Table {tableNumber}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleResetTable}
                className="p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleOpenScanner}
              className="bg-primary-50 border-2 border-primary-500 border-dashed rounded-lg p-4 items-center"
              activeOpacity={0.7}
            >
              <View className="bg-primary-500 rounded-full w-12 h-12 items-center justify-center mb-2">
                <Ionicons name="qr-code" size={28} color="white" />
              </View>
              <Text className="text-primary-600 font-semibold text-base">
                Scanner le QR code
              </Text>
              <Text className="text-primary-500 text-sm mt-1">
                Scannez le code sur votre table
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-secondary-900">Total</Text>
            <Text className="text-2xl font-black text-primary-500">
              {totalPrice.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="bg-white border-t border-secondary-200 px-4 pt-4 pb-8">
        <TouchableOpacity
          onPress={handleProceedToPayment}
          disabled={!canProceedToPayment}
          className={`rounded-full py-4 items-center ${
            canProceedToPayment ? "bg-primary-500" : "bg-secondary-400"
          }`}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-bold mr-2">
              Passer au paiement
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>
        {!tableNumber && (
          <Text className="text-error-600 text-sm text-center mt-3 font-medium">
            ⚠️ Scannez le QR code de votre table pour continuer
          </Text>
        )}
      </View>

      <QRScanner
        visible={showScanner}
        onClose={handleCloseScanner}
        onScanned={handleQRScanned}
      />
      <AlertComponent />
    </ScreenWrapper>
  );
};
