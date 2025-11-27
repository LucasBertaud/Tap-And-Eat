import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/src/components/haptic-tab'
import { IconSymbol } from '@/src/components/ui/icon-symbol'
import { Colors } from '@/src/constants'

export function TabsLayoutView() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[600],
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  )
}
