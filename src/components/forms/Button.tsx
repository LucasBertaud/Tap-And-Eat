import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
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
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    }
  }, [loading, spinValue]);
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

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`w-full md:h-20 h-16 rounded-lg items-center justify-center shadow-md ${getVariantClasses()} ${
        isDisabled ? "opacity-50" : ""
      }`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center">
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 3,
              borderColor: variant === "outline" ? "#EA580C" : "#FFFFFF",
              borderTopColor: "transparent",
              marginRight: 8,
            }}
          />
          <Text className={`md:text-xl text-lg font-semibold ${getTextClasses()}`}>
            {title}
          </Text>
        </View>
      ) : (
        <Text className={`md:text-xl text-lg font-semibold ${getTextClasses()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
