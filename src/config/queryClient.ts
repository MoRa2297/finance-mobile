import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

// helper to understand if the error is "retryabile"
const isRetryableError = (error: any) => {
  // es: no retry su 4xx
  return !(error?.response?.status >= 400 && error?.response?.status < 500);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log('Query Error:', {
        queryKey: query.queryKey,
        error,
      });
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.log('Mutation Error:', {
        mutationKey: mutation.options.mutationKey,
        error,
      });
    },
    onSuccess: (data, _variables, _context, mutation) => {
      console.log('Mutation Success:', {
        mutationKey: mutation.options.mutationKey,
        data,
      });
    },
  }),

  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10, // ← 10 min
      retry: (failureCount, error) => {
        if (!isRetryableError(error)) return false;
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
