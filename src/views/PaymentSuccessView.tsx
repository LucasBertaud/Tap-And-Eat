import { Button } from '@/src/components/forms';
import { ThemedText } from '@/src/components/themed-text';
import { ScreenWrapper } from '@/src/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export const PaymentSuccessView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderNumber = params.orderNumber as string || 'N/A';
  const totalAmount = params.totalAmount ? parseFloat(params.totalAmount as string) : 0;

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-green-50 dark:bg-green-900/20 rounded-full w-20 h-20 items-center justify-center mb-6">
          <ThemedText className="text-3xl">✓</ThemedText>
        </View>

        <ThemedText className="text-2xl font-bold text-center mb-2">
          Paiement réussi !
        </ThemedText>

        <ThemedText className="text-lg text-center mb-6 text-muted">
          Votre commande a été confirmée
        </ThemedText>

        <View className="bg-card rounded-lg p-6 w-full mb-8 border">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-base font-medium">
              Numéro de commande
            </ThemedText>
            <ThemedText className="text-base font-bold text-primary">
              #{orderNumber}
            </ThemedText>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-base font-medium">
              Montant total
            </ThemedText>
            <ThemedText className="text-base font-bold">
              {totalAmount.toFixed(2)} €
            </ThemedText>
          </View>

          <View className="border-t pt-4">
            <ThemedText className="text-sm text-center text-muted">
              Merci pour votre commande ! Vous recevrez un email de confirmation sous peu.
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