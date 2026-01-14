import { Button } from "@/src/components/forms";
import { ThemedText } from "@/src/components/themed-text";
import { ScreenWrapper } from "@/src/components/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export const PaymentSuccessView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderNumber = (params.orderNumber as string) || "N/A";
  const totalAmount = params.totalAmount
    ? parseFloat(params.totalAmount as string)
    : 0;

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
          <ThemedText className="text-3xl">✓</ThemedText>
        </View>

        <ThemedText className="mb-2 text-center text-2xl font-bold">
          Paiement réussi !
        </ThemedText>

        <ThemedText className="text-muted mb-6 text-center text-lg">
          Votre commande a été confirmée
        </ThemedText>

        <View className="bg-card mb-8 w-full rounded-lg border p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <ThemedText className="text-base font-medium">
              Numéro de commande
            </ThemedText>
            <ThemedText className="text-primary text-base font-bold">
              #{orderNumber}
            </ThemedText>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <ThemedText className="text-base font-medium">
              Montant total
            </ThemedText>
            <ThemedText className="text-base font-bold">
              {totalAmount.toFixed(2)} €
            </ThemedText>
          </View>

          <View className="border-t pt-4">
            <ThemedText className="text-muted text-center text-sm">
              Merci pour votre commande ! Vous recevrez un email de confirmation
              sous peu.
            </ThemedText>
          </View>
        </View>

        <View className="w-full items-center">
          <Button
            title="Retour à l'accueil"
            onPress={() => router.replace("/(tabs)")}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};
