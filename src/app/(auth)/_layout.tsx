import { Stack } from 'expo-router';
import { BottomNavigation } from '@components/ui/BottomNavigation';

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transaction" />
      </Stack>
      <BottomNavigation />
    </>
  );
}
