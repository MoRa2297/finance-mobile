import { Stack } from 'expo-router';
import { BottomNavigation } from '@components/ui';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
        }}>
        <Stack.Screen name="transaction" />
      </Stack>
      <BottomNavigation />
    </>
  );
}
