import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type UserProfileProps = {
    navigation: StackNavigationProp<any>;
};

const UserProfile: React.FC<UserProfileProps> = ({ navigation }) => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername);
        };

        fetchUser();
    }, []);

    // ✅ Función para confirmar cierre de sesión
    const confirmLogout = () => {
        Alert.alert(
            "Cerrar Sesión", 
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí", onPress: handleLogout }
            ]
        );
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        navigation.replace('Login'); // Redirigir a Login
    };

    return (
        <View style={styles.container}>
            <FontAwesome5 name="user-circle" size={100} color="#007bff" style={styles.icon} />
            <Text style={styles.username}> {username || 'Usuario'}</Text>

            <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    icon: {
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        padding: 10,
        borderRadius: 8,
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserProfile;
