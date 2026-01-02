import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* Placeholder - implementeremo dopo */}
            <Link href="/(auth)/(tabs)" asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Accedi (temp)</Text>
                </Pressable>
            </Link>

            <Link href="/register" asChild>
                <Pressable style={styles.link}>
                    <Text>Non hai un account? Registrati</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        marginTop: 20,
    },
});
