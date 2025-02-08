import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { isAuthenticated } from '../utils/authMiddleware';

type HomeProps = {
    navigation: StackNavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [loading, setLoading] = useState(true); // Estado para verificar la autenticación

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            if (!authStatus) {
                navigation.replace('Login'); // Si no está autenticado, redirigir a Login
            } else {
                setLoading(false); // Si está autenticado, mostrar la pantalla
            }
        };

        checkAuth();
    }, [navigation]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Bienvenido a VecindApp!</Text>
            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
    );
};

export default Home;
