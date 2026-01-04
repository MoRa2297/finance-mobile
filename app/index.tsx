import { Redirect } from 'expo-router';
import {useAuthStore} from "../stores";

export default function Index() {
    // TODO: controllare auth state con Zustand
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);

    if (isAuthenticated) {
        return <Redirect href="/(auth)/(tabs)" />;
    }

    return <Redirect href="/(unauth)/login" />;
}
