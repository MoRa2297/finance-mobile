import { Stack } from 'expo-router';
import { theme } from '@config/theme';

export default function UnAuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 220,
        gestureEnabled: true,
        contentStyle: { backgroundColor: theme.colors.primaryBK },
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
