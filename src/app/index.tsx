import { Redirect } from 'expo-router';
import { useAuthStore, useLookupStore } from '@/stores';
import { ROUTES } from '@/config/constants';
import { useEffect } from 'react';

export default function Index() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const colors = useLookupStore(state => state.colors);
  const fetchAll = useLookupStore(state => state.fetchAll);

  useEffect(() => {
    if (isAuthenticated && colors.length === 0) {
      fetchAll();
    }
  }, [isAuthenticated, colors.length, fetchAll]);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return <Redirect href={ROUTES.LOGIN} />;
}
