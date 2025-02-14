import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, StyleSheet, RefreshControl } from 'react-native';
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPublicaciones(1, true); // ✅ Cargar la primera página al iniciar
    }, []);

    // ✅ Función para obtener publicaciones con paginación desde el backend
    const fetchPublicaciones = async (pageNumber: number, reset = false) => {
        if (pageNumber > totalPages) return; // No cargar más si ya estamos en la última página

        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.100.10:5000/api/publications?page=${pageNumber}&limit=5`);

            setPublicaciones((prev) =>
                reset ? response.data.publications : [...prev, ...response.data.publications]
            );
            setTotalPages(response.data.totalPages);
            setPage(response.data.currentPage);
        } catch (error) {
            console.error('Error cargando publicaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Función para cargar más publicaciones cuando se llega al final
    const loadMore = () => {
        if (!loading && page < totalPages) {
            fetchPublicaciones(page + 1);
        }
    };

    // ✅ Función para refrescar la lista al hacer swipe hacia abajo
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPublicaciones(1, true); // Cargar desde la primera página
        setRefreshing(false);
    };

    // ✅ Función para abrir Google Maps según el formato de ubicación
    const openInMaps = (location: string) => {
        if (location.startsWith("https://www.google.com/maps")) {
            Linking.openURL(location);
        } else {
            const query = encodeURIComponent(location);
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={publicaciones}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.user}>Publicado por: {item.user.username}</Text>

                        {item.location && (
                            <TouchableOpacity onPress={() => openInMaps(item.location)}>
                                <Text style={styles.location}>📍 {item.location}</Text>
                            </TouchableOpacity>
                        )}

                        {item.image && (
                            <Image source={{ uri: `http://192.168.100.10:5000${item.image}` }} style={styles.image} />
                        )}
                    </View>
                )}
                onEndReached={loadMore} // ✅ Cargar más cuando se llega al final
                onEndReachedThreshold={0.5} // ✅ Se activa cuando el usuario está al 50% del último ítem
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // ✅ Swipe para refrescar
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null} // ✅ Indicador de carga
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
