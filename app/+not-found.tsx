import { Stack } from 'expo-router'

import { NotFoundView } from '@/src/views'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <NotFoundView />
    </>
  )
}
