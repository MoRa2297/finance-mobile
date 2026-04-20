import { useQueries, useQuery } from '@tanstack/react-query';
import { lookupService } from '@/services';
import { lookupKeys } from './lookup.keys';

// Lookup data is mostly static — long stale time, persists across sessions.
const LOOKUP_QUERY_OPTIONS = {
  staleTime: 1000 * 60 * 60 * 24, // 24h
  gcTime: 1000 * 60 * 60 * 24 * 7, // 7d
} as const;

// ─── Individual queries ───────────────────────────────────────────────────────

export const useColors = () =>
  useQuery({
    queryKey: lookupKeys.colors(),
    queryFn: () => lookupService.getColors(),
    ...LOOKUP_QUERY_OPTIONS,
  });

export const useCategoryIcons = () =>
  useQuery({
    queryKey: lookupKeys.categoryIcons(),
    queryFn: () => lookupService.getCategoryIcons(),
    ...LOOKUP_QUERY_OPTIONS,
  });

export const useBankTypes = () =>
  useQuery({
    queryKey: lookupKeys.bankTypes(),
    queryFn: () => lookupService.getBankTypes(),
    ...LOOKUP_QUERY_OPTIONS,
  });

export const useBankAccountTypes = () =>
  useQuery({
    queryKey: lookupKeys.bankAccountTypes(),
    queryFn: () => lookupService.getBankAccountTypes(),
    ...LOOKUP_QUERY_OPTIONS,
  });

export const useCardTypes = () =>
  useQuery({
    queryKey: lookupKeys.cardTypes(),
    queryFn: () => lookupService.getCardTypes(),
    ...LOOKUP_QUERY_OPTIONS,
  });

// ─── Aggregator: fetches all 5 in parallel ────────────────────────────────────
// Use this in your app bootstrap (e.g. splash/loading screen) to warm the cache.
// Returns aggregated isLoading/isError so the caller can render a single state.

export const useLookups = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: lookupKeys.colors(),
        queryFn: () => lookupService.getColors(),
        ...LOOKUP_QUERY_OPTIONS,
      },
      {
        queryKey: lookupKeys.categoryIcons(),
        queryFn: () => lookupService.getCategoryIcons(),
        ...LOOKUP_QUERY_OPTIONS,
      },
      {
        queryKey: lookupKeys.bankTypes(),
        queryFn: () => lookupService.getBankTypes(),
        ...LOOKUP_QUERY_OPTIONS,
      },
      {
        queryKey: lookupKeys.bankAccountTypes(),
        queryFn: () => lookupService.getBankAccountTypes(),
        ...LOOKUP_QUERY_OPTIONS,
      },
      {
        queryKey: lookupKeys.cardTypes(),
        queryFn: () => lookupService.getCardTypes(),
        ...LOOKUP_QUERY_OPTIONS,
      },
    ],
  });

  const [colors, categoryIcons, bankTypes, bankAccountTypes, cardTypes] =
    queries;

  return {
    colors: colors.data ?? [],
    categoryIcons: categoryIcons.data ?? [],
    bankTypes: bankTypes.data ?? [],
    bankAccountTypes: bankAccountTypes.data ?? [],
    cardTypes: cardTypes.data ?? [],
    isLoading: queries.some(q => q.isLoading),
    isFetching: queries.some(q => q.isFetching),
    isError: queries.some(q => q.isError),
    errors: queries.map(q => q.error).filter(Boolean),
  };
};
