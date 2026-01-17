import { Stack } from 'expo-router';
import { BottomNavigation } from '@components/ui';

export default function AuthLayout() {
  return (
    // <>
    //   <Stack
    //     screenOptions={{
    //       headerShown: false,
    //       animation: 'none',
    //       gestureEnabled: false,
    //     }}>
    //     <Stack.Screen name="transaction" />
    //   </Stack>
    //   <BottomNavigation />
    // </>

    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}>
      {/* Tabs - nessuna animazione per switch tra tabs */}
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: 'none',
        }}
      />

      {/* Transaction - Modal dal basso */}
      <Stack.Screen
        name="transaction"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />

      {/* Stack screens da Settings - slide da destra */}
      <Stack.Screen name="profile" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="bank-accounts" />
      <Stack.Screen name="bank-cards" />
    </Stack>
  );
}
