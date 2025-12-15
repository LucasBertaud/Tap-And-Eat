import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: "success" | "error" | "warning" | "info";
  onDismiss?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  type = "info",
  onDismiss,
}) => {
  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      case "info":
      default:
        return "#3B82F6";
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case "destructive":
        return "bg-red-500 active:bg-red-600";
      case "cancel":
        return "bg-secondary-200 active:bg-secondary-300";
      case "default":
      default:
        return "bg-primary-600 active:bg-primary-700";
    }
  };

  const getButtonTextStyle = (style?: string) => {
    return style === "cancel" ? "text-secondary-900" : "text-white";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable
        style={styles.overlay}
        onPress={onDismiss}
        className="flex-1 items-center justify-center bg-black/50 px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        >
          <View className="mb-4 items-center">
            <View className="mb-3">
              <Ionicons name={getIconName()} size={56} color={getIconColor()} />
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-secondary-900">
              {title}
            </Text>
            {message && (
              <Text className="text-center text-base text-secondary-600">
                {message}
              </Text>
            )}
          </View>

          <View className="mt-2 gap-3">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(button)}
                className={`h-12 items-center justify-center rounded-lg ${getButtonStyle(
                  button.style
                )}`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-base font-semibold ${getButtonTextStyle(button.style)}`}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
});
