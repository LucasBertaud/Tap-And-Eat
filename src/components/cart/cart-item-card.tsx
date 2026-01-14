import type { CartItem } from "@/src/models";
import { calculateItemTotal } from "@/src/models";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const itemTotal = calculateItemTotal(item);

  return (
    <View className="mb-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-sm md:p-6">
      {/* En-tête avec image et infos */}
      <View className="mb-3 flex-row">
        {/* Image du produit */}
        <Image
          source={{ uri: item.product.image_url || undefined }}
          className="h-20 w-20 rounded-lg bg-secondary-100 md:h-28 md:w-28"
          resizeMode="cover"
        />

        {/* Infos produit */}
        <View className="ml-3 flex-1 md:ml-4">
          <Text className="mb-1 text-base font-semibold text-secondary-900 md:text-xl">
            {item.product.name}
          </Text>
          <Text className="text-sm text-secondary-600 md:text-base">
            {item.product.base_price.toFixed(2)} €
          </Text>
        </View>

        {/* Bouton supprimer */}
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Options sélectionnées */}
      {item.selectedOptions && item.selectedOptions.length > 0 && (
        <View className="mb-3 rounded-lg bg-secondary-50 px-2 py-2">
          {item.selectedOptions.map((option) => (
            <View
              key={option.optionId}
              className="mb-1 flex-row justify-between"
            >
              <Text className="text-sm text-secondary-700">{option.name}</Text>
              {option.priceModifier > 0 && (
                <Text className="text-sm text-secondary-600">
                  +{option.priceModifier.toFixed(2)} €
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Contrôles quantité et prix total */}
      <View className="flex-row items-center justify-between">
        {/* Sélecteur de quantité */}
        <View className="flex-row items-center rounded-full bg-secondary-50 px-2 py-1">
          <TouchableOpacity
            onPress={() => onDecrease(item.id)}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons
              name="remove-circle"
              size={32}
              color={item.quantity === 1 ? "#EF4444" : "#F97316"}
            />
          </TouchableOpacity>

          <Text className="mx-3 min-w-[24px] text-center text-base font-semibold text-secondary-900 md:mx-4 md:text-xl">
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => onIncrease(item.id)}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={32} color="#F97316" />
          </TouchableOpacity>
        </View>

        {/* Prix total de l'item */}
        <View className="rounded-full bg-primary-50 px-4 py-2 md:px-6">
          <Text className="text-lg font-bold text-primary-600 md:text-xl">
            {itemTotal.toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
};
