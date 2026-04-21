import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { bankAccountKeys } from '@/stores/bank-account/bank-account.keys';
import { cardKeys } from '@/stores/card/card.keys';
import { categoryKeys } from '@/stores/category/category.keys';
import { lookupKeys } from '@/stores/lookup/lookup.keys';
import bankAccountService from '@/services/bank-account.service';
import cardService from '@/services/card.service';
import categoryService from '@/services/category.service';
import { lookupService } from '@/services';
import { theme } from '@config/theme';

// Lookup data is mostly static — keep it fresh for a long time.
const LOOKUP_STALE_TIME = 1000 * 60 * 60 * 24; // 24h

export default function AuthLayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch core data as soon as the user is authenticated.
    // These will be in cache when any screen needs them.
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

    // Lookup data (colors, icons, bank/card types) — long stale time
    // because they change rarely.
    queryClient.prefetchQuery({
      queryKey: lookupKeys.colors(),
      queryFn: () => lookupService.getColors(),
      staleTime: LOOKUP_STALE_TIME,
    });
    queryClient.prefetchQuery({
      queryKey: lookupKeys.categoryIcons(),
      queryFn: () => lookupService.getCategoryIcons(),
      staleTime: LOOKUP_STALE_TIME,
    });
    queryClient.prefetchQuery({
      queryKey: lookupKeys.bankTypes(),
      queryFn: () => lookupService.getBankTypes(),
      staleTime: LOOKUP_STALE_TIME,
    });
    queryClient.prefetchQuery({
      queryKey: lookupKeys.bankAccountTypes(),
      queryFn: () => lookupService.getBankAccountTypes(),
      staleTime: LOOKUP_STALE_TIME,
    });
    queryClient.prefetchQuery({
      queryKey: lookupKeys.cardTypes(),
      queryFn: () => lookupService.getCardTypes(),
      staleTime: LOOKUP_STALE_TIME,
    });
  }, [queryClient]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        contentStyle: { backgroundColor: theme.colors.primaryBK },
      }}>
      {/* Tabs: nessuna animazione di entrata, è il "guscio" dell'app */}
      <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />

      {/* Form transaction: MODAL (presentation), perché è una task isolata */}
      <Stack.Screen
        name="transaction"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          animationDuration: 280,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />

      {/* Profile: drill-down classico */}
      <Stack.Screen name="profile" />

      {/* Categories, bank-accounts, bank-cards: drill-down */}
      <Stack.Screen name="categories" />
      <Stack.Screen name="bank-accounts" />
      <Stack.Screen name="bank-cards" />
    </Stack>
  );
}
