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
    <View className="bg-white rounded-xl p-4 md:p-6 mb-3 shadow-sm border border-secondary-100">
      {/* En-tête avec image et infos */}
      <View className="flex-row mb-3">
        {/* Image du produit */}
        <Image
          source={{ uri: item.product.image_url || undefined }}
          className="md:w-28 md:h-28 w-20 h-20 rounded-lg bg-secondary-100"
          resizeMode="cover"
        />

        {/* Infos produit */}
        <View className="flex-1 ml-3 md:ml-4">
          <Text className="md:text-xl text-base font-semibold text-secondary-900 mb-1">
            {item.product.name}
          </Text>
          <Text className="md:text-base text-sm text-secondary-600">
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
        <View className="mb-3 px-2 py-2 bg-secondary-50 rounded-lg">
          {item.selectedOptions.map((option) => (
            <View
              key={option.optionId}
              className="flex-row justify-between mb-1"
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
        <View className="flex-row items-center bg-secondary-50 rounded-full px-2 py-1">
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

          <Text className="md:text-xl text-base font-semibold text-secondary-900 mx-3 md:mx-4 min-w-[24px] text-center">
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
        <View className="bg-primary-50 px-4 md:px-6 py-2 rounded-full">
          <Text className="md:text-xl text-lg font-bold text-primary-600">
            {itemTotal.toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
};
