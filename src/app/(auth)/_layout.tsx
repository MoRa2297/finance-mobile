import { Stack } from 'expo-router';
import { BottomNavigation } from '@components/ui';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Transizione fade invece di slide
          gestureEnabled: false,
        }}>
        <Stack.Screen name="transaction" />
      </Stack>
      <BottomNavigation />
    </>
  );
}
