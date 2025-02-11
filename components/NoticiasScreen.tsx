import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

type Publication = {
    _id: string;
    title: string;
    description: string;
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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <FlatList
                data={publicaciones}
                keyExtractor={(item) => item._id}
                renderItem={({ item }: { item: Publication }) => (
                    <View style={{ padding: 15, margin: 10, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>{item.title}</Text>
                        <Text style={{ color: '#666', marginBottom: 5 }}>{item.description}</Text>
                        <Text style={{ fontStyle: 'italic', color: '#333' }}>Publicado por: {item.user.username}</Text>
                        {item.image && (
                            <Image 
                                source={{ uri: `http://192.168.100.10:5000${item.image}` }} 
                                style={{ width: '100%', height: 150, marginTop: 10, borderRadius: 10 }} 
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
};

export default NoticiasScreen;
