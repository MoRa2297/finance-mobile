import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/config/constants';

export default function Index() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  console.log('=== AUTH DEBUG ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return <Redirect href={ROUTES.LOGIN} />;
}
