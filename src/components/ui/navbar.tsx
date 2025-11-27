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
      className={`${backgroundColor} border-b-2 border-primary-100 md:px-8 md:py-6 px-4 py-4 shadow-md`}
    >
      {/* Conteneur centré avec max-width pour tablette */}
      <View className="w-full max-w-7xl mx-auto">
        <View className="flex-row items-center justify-between">
          {/* Partie gauche : Bouton retour + Titre */}
          <View className="flex-row items-center flex-1">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                className="md:mr-6 mr-4 md:p-3 p-2 bg-primary-50 rounded-full"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#F97316" />
              </TouchableOpacity>
            )}
            <View className="flex-1">
              <Text className="md:text-4xl text-2xl font-bold text-secondary-900">
                {title}
              </Text>
              {subtitle && (
                <Text className="md:text-lg text-sm text-secondary-600 md:mt-2 mt-1">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Partie droite : Actions */}
          {actions.length > 0 && (
            <View className="flex-row items-center md:gap-4 gap-2">
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  className={`flex-row items-center md:px-6 md:py-4 px-3 py-2 rounded-2xl shadow-sm ${
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
                      className="md:ml-3 ml-1 md:text-lg font-semibold"
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
