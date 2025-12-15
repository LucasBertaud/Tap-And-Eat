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
          <View className="mb-4 rounded-full bg-secondary-100 p-8">
            <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          </View>
          <Text className="mb-2 text-xl font-semibold text-secondary-900">
            Votre panier est vide
          </Text>
          <Text className="mb-6 text-center text-base text-secondary-600">
            Ajoutez des produits avant de valider votre commande
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="rounded-full bg-primary-500 px-8 py-4"
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-white">
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
        <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-bold text-secondary-900">
            Votre commande
          </Text>
          <Text className="text-sm text-secondary-600">
            {itemCount} {itemCount > 1 ? "articles" : "article"}
          </Text>
        </View>

        <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-base font-bold text-secondary-900">
            Détails
          </Text>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
              className={`${index > 0 ? "border-t border-secondary-100 pt-3" : ""}`}
            >
              <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-secondary-900">
                    {item.quantity}x {item.product.name}
                  </Text>
                  <Text className="mt-1 text-sm text-secondary-600">
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
                      className="mb-1 flex-row justify-between"
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

        <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-base font-bold text-secondary-900">
            Numéro de table
          </Text>
          {tableNumber ? (
            <View className="flex-row items-center justify-between rounded-lg bg-success-50 p-3">
              <View className="flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-success-500">
                  <Ionicons name="checkmark" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-sm font-medium text-success-700">
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
              className="items-center rounded-lg border-2 border-dashed border-primary-500 bg-primary-50 p-4"
              activeOpacity={0.7}
            >
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary-500">
                <Ionicons name="qr-code" size={28} color="white" />
              </View>
              <Text className="text-base font-semibold text-primary-600">
                Scanner le QR code
              </Text>
              <Text className="mt-1 text-sm text-primary-500">
                Scannez le code sur votre table
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-secondary-900">Total</Text>
            <Text className="text-2xl font-black text-primary-500">
              {totalPrice.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="border-t border-secondary-200 bg-white px-4 pb-8 pt-4">
        <TouchableOpacity
          onPress={handleProceedToPayment}
          disabled={!canProceedToPayment}
          className={`items-center rounded-full py-4 ${
            canProceedToPayment ? "bg-primary-500" : "bg-secondary-400"
          }`}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg font-bold text-white">
              Passer au paiement
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>
        {!tableNumber && (
          <Text className="mt-3 text-center text-sm font-medium text-error-600">
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
