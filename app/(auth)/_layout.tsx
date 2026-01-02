import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="transaction"
                options={{
                    presentation: 'modal',
                    headerShown: true,
                    title: 'Nuova Transazione',
                }}
            />
        </Stack>
    );
}
