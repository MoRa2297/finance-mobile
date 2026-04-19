import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { bankAccountKeys } from '@/stores/bank-account/bank-account.keys';
import { cardKeys } from '@/stores/card/card.keys';
import { categoryKeys } from '@/stores/category/category.keys';
import bankAccountService from '@/services/bank-account.service';
import cardService from '@/services/card.service';
import categoryService from '@/services/category.service';

export default function AuthLayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch core data as soon as the user is authenticated
    // These will be in cache when any screen needs them
    queryClient.prefetchQuery({
      queryKey: bankAccountKeys.lists(),
      queryFn: () => bankAccountService.getBankAccounts(),
    });
    queryClient.prefetchQuery({
      queryKey: cardKeys.lists(),
      queryFn: () => cardService.getCards(),
    });
    queryClient.prefetchQuery({
      queryKey: categoryKeys.listByType(),
      queryFn: () => categoryService.getCategories(),
    });
  }, [queryClient]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      <Stack.Screen
        name="transaction"
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen name="profile" />
      <Stack.Screen name="categories" />
    </Stack>
  );
}
