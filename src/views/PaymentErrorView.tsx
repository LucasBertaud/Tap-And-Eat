import { Button } from "@/src/components/forms";
import { ThemedText } from "@/src/components/themed-text";
import { ScreenWrapper } from "@/src/components/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export const PaymentErrorView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const errorMessage =
    (params.errorMessage as string) || "Une erreur inattendue s'est produite";
  const totalAmount = params.totalAmount
    ? parseFloat(params.totalAmount as string)
    : 0;

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <ThemedText className="text-3xl text-red-500">✕</ThemedText>
        </View>

        <ThemedText className="mb-2 text-center text-2xl font-bold">
          Échec du paiement
        </ThemedText>

        <ThemedText className="text-muted mb-6 text-center text-lg">
          Votre paiement n&apos;a pas pu être traité
        </ThemedText>

        <View className="bg-card mb-8 w-full rounded-lg border p-6">
          <View className="mb-4">
            <ThemedText className="mb-2 text-base font-medium">
              Détails de l&apos;erreur
            </ThemedText>
            <ThemedText className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </ThemedText>
          </View>

          {totalAmount > 0 && (
            <View className="mb-4 flex-row items-center justify-between">
              <ThemedText className="text-base font-medium">Montant</ThemedText>
              <ThemedText className="text-base font-bold">
                {totalAmount.toFixed(2)} €
              </ThemedText>
            </View>
          )}

          <View className="border-t pt-4">
            <ThemedText className="text-muted text-center text-sm">
              Veuillez vérifier vos informations de paiement et réessayer.
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
