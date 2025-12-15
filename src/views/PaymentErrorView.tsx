import { Button } from '@/src/components/forms';
import { ThemedText } from '@/src/components/themed-text';
import { ScreenWrapper } from '@/src/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export const PaymentErrorView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const errorMessage = params.errorMessage as string || 'Une erreur inattendue s\'est produite';
  const totalAmount = params.totalAmount ? parseFloat(params.totalAmount as string) : 0;

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-red-50 dark:bg-red-900/20 rounded-full w-20 h-20 items-center justify-center mb-6">
          <ThemedText className="text-3xl text-red-500">✕</ThemedText>
        </View>

        <ThemedText className="text-2xl font-bold text-center mb-2">
          Échec du paiement
        </ThemedText>

        <ThemedText className="text-lg text-center mb-6 text-muted">
          Votre paiement n'a pas pu être traité
        </ThemedText>

        <View className="bg-card rounded-lg p-6 w-full mb-8 border">
          <View className="mb-4">
            <ThemedText className="text-base font-medium mb-2">
              Détails de l'erreur
            </ThemedText>
            <ThemedText className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </ThemedText>
          </View>

          {totalAmount > 0 && (
            <View className="flex-row justify-between items-center mb-4">
              <ThemedText className="text-base font-medium">
                Montant
              </ThemedText>
              <ThemedText className="text-base font-bold">
                {totalAmount.toFixed(2)} €
              </ThemedText>
            </View>
          )}

          <View className="border-t pt-4">
            <ThemedText className="text-sm text-center text-muted">
              Veuillez vérifier vos informations de paiement et réessayer.
            </ThemedText>
          </View>
        </View>

        <View className="w-full items-center">
          <Button
            title="Retour à l'accueil"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};