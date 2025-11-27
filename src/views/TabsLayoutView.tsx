import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { HapticTab } from "@/src/components/haptic-tab";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { useAppSelector } from "@/src/store/hooks";
import { selectCartItemCount } from "@/src/store/slices/cartSlice";

export function TabsLayoutView() {
  const cartItemCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F97316",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Panier",
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="cart" size={28} color={color} />
              {cartItemCount > 0 && (
                <View
                  style={{ minWidth: 14, height: 14, borderRadius: 10 }}
                  className="absolute -top-1 -right-2 bg-primary-500 min-w-5 h-5 items-center justify-center px-1"
                >
                  <Text className="text-white text-xs font-bold">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
