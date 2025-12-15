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
      className={`${backgroundColor} border-b-2 border-primary-100 px-4 py-4 shadow-md md:px-8 md:py-6`}
    >
      {/* Conteneur centré avec max-width pour tablette */}
      <View className="mx-auto w-full max-w-7xl">
        <View className="flex-row items-center justify-between">
          {/* Partie gauche : Bouton retour + Titre */}
          <View className="flex-1 flex-row items-center">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                className="mr-4 rounded-full bg-primary-50 p-2 md:mr-6 md:p-3"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#F97316" />
              </TouchableOpacity>
            )}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-secondary-900 md:text-4xl">
                {title}
              </Text>
              {subtitle && (
                <Text className="mt-1 text-sm text-secondary-600 md:mt-2 md:text-lg">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Partie droite : Actions */}
          {actions.length > 0 && (
            <View className="flex-row items-center gap-2 md:gap-4">
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  className={`flex-row items-center rounded-2xl px-3 py-2 shadow-sm md:px-6 md:py-4 ${
                    action.backgroundColor || "bg-secondary-100"
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={action.icon}
                    size={24}
                    color={action.color || "#6B7280"}
                  />
                  {action.label && (
                    <Text
                      className="ml-1 font-semibold md:ml-3 md:text-lg"
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
    </View>
  );
};
