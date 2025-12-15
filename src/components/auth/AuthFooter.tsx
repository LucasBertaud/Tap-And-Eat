import { Text, View } from "react-native";

/**
 * AuthFooter
 * Footer avec mentions légales
 */
export const AuthFooter = () => {
  return (
    <View className="mt-12">
      <Text className="text-center text-sm text-secondary-500">
        En vous connectant, vous acceptez nos conditions d&apos;utilisation
      </Text>
    </View>
  );
};
