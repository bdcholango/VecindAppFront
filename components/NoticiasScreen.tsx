import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import axios from 'axios';

type Publication = {
    _id: string;
    title: string;
    description: string;
    location: string;
    image?: string;
    user: {
        username: string;
    };
};

const NoticiasScreen = () => {
    const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const response = await axios.get('http://192.168.100.10:5000/api/publications');
                setPublicaciones(response.data);
            } catch (error) {
                console.error('Error cargando publicaciones:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicaciones();
    }, []);

    // ✅ Función para abrir Google Maps según el formato de ubicación
    const openInMaps = (location: string) => {
        if (location.startsWith("https://www.google.com/maps")) {
            Linking.openURL(location); // ✅ Si ya es un link de Google Maps, lo abre directamente
        } else {
            const query = encodeURIComponent(location); // ✅ Convierte texto en URL válida
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={publicaciones}
                keyExtractor={(item) => item._id}
                renderItem={({ item }: { item: Publication }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.user}>Publicado por: {item.user.username}</Text>

                        {/* ✅ Ubicación - Se toca para abrir Google Maps */}
                        {item.location && (
                            <TouchableOpacity onPress={() => openInMaps(item.location)}>
                                <Text style={styles.location}>📍 {item.location}</Text>
                            </TouchableOpacity>
                        )}

                        {item.image && (
                            <Image 
                                source={{ uri: `http://192.168.100.10:5000${item.image}` }} 
                                style={styles.image} 
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 15,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        color: '#666',
        marginBottom: 5,
    },
    user: {
        fontStyle: 'italic',
        color: '#333',
    },
    location: {
        fontSize: 14,
        color: '#007bff',
        textDecorationLine: 'underline',
        marginTop: 5,
    },
    image: {
        width: '100%',
        height: 150,
        marginTop: 10,
        borderRadius: 10,
    },
});

export default NoticiasScreen;
