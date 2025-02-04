import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
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
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Nombre de Usuario"
                value={username}
                onChangeText={setUsername}
                style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            <Button title="Registrar" onPress={() => navigation.navigate('Register')} />
        </View>
    );
};

export default Login;
