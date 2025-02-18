import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, StyleSheet, RefreshControl, Animated, Easing } from 'react-native';
import axios from 'axios';

type Publication = {
    _id: string;
    title: string;
    description: string;
    location: string;
    image?: string;
    user?: {
        username: string;
    };
};

const NoticiasScreen = () => {
    const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const skeletonOpacity = useState(new Animated.Value(0.3))[0];

    useEffect(() => {
        fetchPublicaciones(1, true); // ✅ Carga la primera página
        startSkeletonAnimation();
    }, []);

    // ✅ Animación del Skeleton Loader
    const startSkeletonAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.3,
                    duration: 800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    // ✅ Función para obtener publicaciones con paginación
    const fetchPublicaciones = async (pageNumber: number, reset = false) => {
        if (pageNumber > totalPages) return; // ✅ No seguir si ya estamos en la última página

        try {
            if (reset) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await axios.get(`http://192.168.100.10:5000/api/publications?page=${pageNumber}&limit=5`);

            if (response.data && Array.isArray(response.data.publications)) {
                setPublicaciones(prev =>
                    reset ? response.data.publications : [...prev, ...response.data.publications]
                );
                setTotalPages(response.data.totalPages);
                setPage(response.data.currentPage);
            } else {
                console.error("Formato de datos inesperado:", response.data);
            }
        } catch (error) {
            console.error('Error cargando publicaciones:', error);
        } finally {
            if (reset) {
                setLoading(false);
            }
            setLoadingMore(false);
        }
    };

    // ✅ Función para refrescar (swipe down)
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPublicaciones(1, true); // ✅ Carga desde la primera página
        setRefreshing(false);
    };

    // ✅ Función para cargar más publicaciones cuando se hace scroll hasta el final
    const loadMore = () => {
        if (!loadingMore && page < totalPages) {
            fetchPublicaciones(page + 1);
        }
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
            <Text style={styles.pageHeader}>Publicaciones Recientes </Text>
            {loading ? (
                // ✅ Skeleton Loader mientras se cargan las publicaciones
                <FlatList
                    data={[1, 2, 3, 4, 5]} // Simulamos 5 elementos vacíos
                    keyExtractor={(item) => `skeleton-${item}`}
                    renderItem={() => (
                        <View style={styles.card}>
                            <Animated.View style={[styles.skeletonTitle, { opacity: skeletonOpacity }]} />
                            <Animated.View style={[styles.skeletonText, { opacity: skeletonOpacity }]} />
                            <Animated.View style={[styles.skeletonUser, { opacity: skeletonOpacity }]} />
                            <Animated.View style={[styles.skeletonLocation, { opacity: skeletonOpacity }]} />
                            <Animated.View style={[styles.skeletonImage, { opacity: skeletonOpacity }]} />

                        </View>
                    )}
                />
            ) : (
                <FlatList
                    data={publicaciones}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            {item.user && <Text style={styles.user}>Publicado por: {item.user.username}</Text>}

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
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null} // ✅ Indicador de carga al final
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pageHeader: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#1e90ff', 
    textAlign: 'center', 
    marginTop: 30, 
    marginBottom: 5 
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
    // 🎨 Skeleton Styles
    skeletonTitle: {
        width: '80%',
        height: 20,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 4,
    },
    skeletonText: {
        width: '60%',
        height: 15,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 4,
    },
    skeletonUser: {
        width: '40%',
        height: 15,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 4,
    },
    skeletonLocation: {
        width: '60%',
        height: 15,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 4,
    },
    skeletonImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#ddd',
        marginTop: 10,
        borderRadius: 10,
    },
});

export default NoticiasScreen;
