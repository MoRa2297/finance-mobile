import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function ExpensesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spese</Text>

            <Link href="/transaction" asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>+ Aggiungi Transazione</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});
