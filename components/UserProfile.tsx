import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,  Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';


type UserProfileProps = {
    navigation: StackNavigationProp<any>;
};

const UserProfile: React.FC<UserProfileProps> = ({ navigation }) => {
    const [username, setUsername] = useState<string | null>(null);
    const { theme, isDarkMode, toggleTheme } = useTheme();

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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FontAwesome5 name="user-circle" size={100} color="#007bff" style={styles.icon} />
            <Text style={[styles.username, { color: theme.text }]}> {username || 'Usuario'}</Text>
                {/* Modo Oscuro */}
      <View style={styles.themeContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Modo Oscuro</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
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
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      label: {
        fontSize: 18,
      },
});

export default UserProfile;
