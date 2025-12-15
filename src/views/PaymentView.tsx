import { Button, CardInputForm } from "@/src/components/forms";
import { LoadingSpinner, Navbar, ScreenWrapper } from "@/src/components/ui";
import { usePaymentViewModel } from "@/src/viewmodels";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export const PaymentView: React.FC = () => {
  const router = useRouter();
  const {
    cardInfo,
    totalAmount,
    isProcessing,
    lastResult,
    validationErrors,
    updateCardInfo,
    handlePayment,
    resetPayment,
  } = usePaymentViewModel();

  const onPaymentSubmit = async () => {
    const result = await handlePayment();

    if (result.success) {
      router.push({
        pathname: '/payment-success',
        params: {
          orderNumber: result.orderNumber,
          totalAmount: result.amount.toString(),
        },
      });
    } else if (result.errorMessage === 'Veuillez corriger les erreurs du formulaire') {
      // Stay on payment page for form validation errors
    } else {
      router.push({
        pathname: '/payment-error',
        params: {
          errorMessage: result.errorMessage,
          totalAmount: result.amount.toString(),
        },
      });
    }
  };

  const isFormValid = true; // Temporairement pour tester

  if (isProcessing) {
    return (
      <ScreenWrapper className="flex-1 bg-secondary-50">
        <LoadingSpinner
          fullScreen
          message="Traitement du paiement en cours..."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-secondary-50">
      <Navbar
        title="Paiement"
        subtitle={`Total: ${totalAmount.toFixed(2)} €`}
        actions={[
          {
            icon: "close",
            label: "Annuler",
            color: "#6B7280",
            onPress: () => router.back(),
          },
        ]}
      />

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center"
      >
        <View className="w-full max-w-3xl">
          <View className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
              <Text className="text-primary-800 font-semibold ml-2">
                Paiement sécurisé
              </Text>
            </View>
            <Text className="text-primary-700 text-sm">
              Vos informations bancaires sont chiffrées et ne sont pas stockées.
              Cette démo simule un paiement réel avec 80% de succès.
            </Text>
          </View>

          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-secondary-900 mb-4">
              Informations de paiement
            </Text>

            <CardInputForm
              cardNumber={cardInfo.number}
              expiryMonth={cardInfo.expiryMonth}
              expiryYear={cardInfo.expiryYear}
              cvv={cardInfo.cvv}
              holderName={cardInfo.holderName}
              onCardNumberChange={(value) => updateCardInfo('number', value)}
              onExpiryMonthChange={(value) => updateCardInfo('expiryMonth', value)}
              onExpiryYearChange={(value) => updateCardInfo('expiryYear', value)}
              onCvvChange={(value) => updateCardInfo('cvv', value)}
              onHolderNameChange={(value) => updateCardInfo('holderName', value)}
              validationErrors={validationErrors}
            />
          </View>

          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-secondary-900 mb-4">
              Récapitulatif
            </Text>

            <View className="flex-row justify-between items-center py-2 border-b border-secondary-100">
              <Text className="text-secondary-600">Sous-total</Text>
              <Text className="text-secondary-900 font-medium">
                {totalAmount.toFixed(2)} €
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-secondary-100">
              <Text className="text-secondary-600">Frais de livraison</Text>
              <Text className="text-secondary-900 font-medium">0.00 €</Text>
            </View>

            <View className="flex-row justify-between items-center py-4">
              <Text className="text-lg font-semibold text-secondary-900">Total</Text>
              <Text className="text-2xl font-bold text-primary-600">
                {totalAmount.toFixed(2)} €
              </Text>
            </View>
          </View>

          <Button
            title={`Payer ${totalAmount.toFixed(2)} €`}
            onPress={onPaymentSubmit}
            disabled={!isFormValid}
            variant="primary"
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};