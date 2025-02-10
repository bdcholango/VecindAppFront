import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

type Publication = {
    _id: string;
    title: string;
    description: string;
    image?: string;
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
        <FlatList
            data={publicaciones}
            keyExtractor={(item) => item._id}
            renderItem={({ item }: { item: Publication }) => (
                <View style={{ padding: 20, borderBottomWidth: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                    <Text>{item.description}</Text>
                    {item.image && (
    <Image 
        source={{ uri: `http://192.168.100.10:5000${item.image}` }} 
        style={{ width: 100, height: 100 }} 
    />
)}

                </View>
            )}
        />
    );
};

export default NoticiasScreen;
