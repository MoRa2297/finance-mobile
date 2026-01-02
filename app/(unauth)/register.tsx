import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrazione</Text>

            <Link href="/login" asChild>
                <Pressable style={styles.link}>
                    <Text>Hai già un account? Accedi</Text>
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
    link: {
        marginTop: 20,
    },
});
