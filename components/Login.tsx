import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginProps = {
    navigation: StackNavigationProp<any>;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.100.10:5000/api/auth/login', {
                username,
                password,
            });

            // Guardar el token en AsyncStorage
            await AsyncStorage.setItem('userToken', response.data.token);
            Alert.alert('Inicio de Sesión Exitoso', 'Bienvenido!');
            navigation.navigate('Home'); // Navegar a la pantalla de inicio
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const message = axiosError.response?.data?.message || 'Error desconocido';
            Alert.alert('Error de Inicio de Sesión', message);
        }
    };

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            {/* Logo */}
            <Image 
                source={require('../assets/logo1.png')} // Cambia la ruta según la ubicación del logo
                style={{ width: 300, height: 200, marginBottom: 20 }}
                resizeMode="contain"
            />

            {/* Inputs */}
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 15, width: '100%' }}>
                <Icon name="user" size={20} style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Nombre de Usuario / Correo Electrónico"
                    value={username}
                    onChangeText={setUsername}
                    style={{ flex: 1, paddingVertical: 8 }}
                />
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 15, width: '100%' }}>
                <Icon name="lock" size={20} style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ flex: 1, paddingVertical: 8 }}
                />
            </View>

            {/* Botones */}
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ marginTop: 10, color: 'blue', fontSize: 16 }}>
                    ¿No tienes una cuenta? Regístrate aquí
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;