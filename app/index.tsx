import { Redirect } from 'expo-router';

export default function Index() {
    // TODO: controllare auth state con Zustand
    const isAuthenticated = false;

    if (isAuthenticated) {
        return <Redirect href="/(auth)/(tabs)" />;
    }

    return <Redirect href="/(unauth)/login" />;
}
