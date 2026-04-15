import { queryClient } from './queryClient';

export const setupReactQueryLogger = () => {
  if (!__DEV__) return;

  const queryCache = queryClient.getQueryCache();
  const mutationCache = queryClient.getMutationCache();

  // Query events
  queryCache.subscribe(event => {
    console.tron?.display({
      name: 'React Query',
      preview: 'Query Event',
      value: {
        type: event.type,
        queryKey: event.query?.queryKey,
        state: event.query?.state,
      },
    });
  });

  // Mutation events
  mutationCache.subscribe(event => {
    console.tron?.display({
      name: 'React Query',
      preview: 'Mutation Event',
      value: {
        type: event.type,
        mutationKey: event.mutation?.options?.mutationKey,
        state: event.mutation?.state,
      },
    });
  });
};
