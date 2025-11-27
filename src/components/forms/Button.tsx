import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Button
 * Composant bouton réutilisable avec différentes variantes
 */
export const Button = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary-600 active:bg-primary-700";
      case "secondary":
        return "bg-secondary-600 active:bg-secondary-700";
      case "outline":
        return "bg-transparent border-2 border-primary-600";
      default:
        return "bg-primary-600";
    }
  };

  const getTextClasses = () => {
    return variant === "outline" ? "text-primary-600" : "text-text-inverse";
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`w-full h-16 rounded-lg items-center justify-center shadow-md ${getVariantClasses()} ${
        isDisabled ? "opacity-50" : ""
      }`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#EA580C" : "#FFFFFF"}
        />
      ) : (
        <Text className={`text-lg font-semibold ${getTextClasses()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
