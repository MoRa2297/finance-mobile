import { View, Text, StyleSheet } from 'react-native';

export default function TransactionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuova Transazione</Text>
            <Text>Form transazione qui</Text>
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
        marginBottom: 10,
    },
});
