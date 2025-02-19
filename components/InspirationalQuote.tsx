import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const InspirationalQuote = () => {
    const [quote, setQuote] = useState<string | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Función para obtener una frase de la API
    const fetchQuote = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://api.quotable.io/random?tags=inspirational');
            setQuote(response.data.content);
            setAuthor(response.data.author);
        } catch (error) {
            console.error('Error obteniendo frase:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Cargar una frase al iniciar el componente
    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>💡 Frase Inspiradora del Día</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <View>
                    <Text style={styles.quoteText}>"{quote}"</Text>
                    <Text style={styles.author}>- {author}</Text>

                    <TouchableOpacity onPress={fetchQuote} style={styles.button}>
                        <Text style={styles.buttonText}>🔄 Nueva Frase</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 100, height: 4 },
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e90ff',
        marginBottom: 10,
    },
    quoteText: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    author: {
        fontSize: 10,
        color: '#555',
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
});

export default InspirationalQuote;
