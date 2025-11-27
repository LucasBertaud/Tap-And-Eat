import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export interface NavbarAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label?: string;
  color?: string;
  backgroundColor?: string;
}

interface NavbarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  actions?: NavbarAction[];
  backgroundColor?: string;
}

/**
 * Navbar - Composant d'en-tête réutilisable
 * Utilisé dans MenuView, CartView, ProductDetailView
 */
export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  actions = [],
  backgroundColor = "bg-white",
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={`${backgroundColor} border-b border-secondary-200 p-4 shadow-sm`}
    >
      <View className="flex-row items-center justify-between">
        {/* Partie gauche : Bouton retour + Titre */}
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-4 p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-secondary-900">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-secondary-600 mt-1">
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Partie droite : Actions */}
        {actions.length > 0 && (
          <View className="flex-row items-center gap-2">
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                className={`flex-row items-center px-3 py-2 rounded-full ${
                  action.backgroundColor || "bg-secondary-100"
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={action.color || "#6B7280"}
                />
                {action.label && (
                  <Text
                    className="ml-1 font-medium"
                    style={{ color: action.color || "#6B7280" }}
                  >
                    {action.label}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
