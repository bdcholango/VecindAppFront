import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image, Text, TouchableOpacity } from 'react-native';
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mostrar errores

    const handleLogin = async () => {
        setErrorMessage(null); // Resetear mensaje de error antes de una nueva petición

        try {
            const response = await axios.post('http://192.168.100.10:5000/api/auth/login', {
                username,
                password,
            });

            await AsyncStorage.setItem('userToken', response.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            Alert.alert('Inicio de Sesión Exitoso', 'Bienvenido!');
            navigation.navigate('Home');
        } catch (error) {
            const axiosError = error as AxiosError<{ errors?: { msg: string }[], message?: string }>;
            if (axiosError.response?.data?.errors) {
                setErrorMessage(axiosError.response.data.errors[0].msg); // Muestra el primer error
            } else {
                setErrorMessage(axiosError.response?.data?.message || 'Error desconocido');
            }
        }
    };

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Image 
                source={require('../assets/logo1.png')}
                style={{ width: 300, height: 200, marginBottom: 20 }}
                resizeMode="contain"
            />

            {errorMessage && (
                <Text style={{ color: 'red', marginBottom: 10, fontSize: 16 }}>
                    {errorMessage}
                </Text>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 15, width: '100%' }}>
                <Icon name="user" size={20} style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Nombre de Usuario"
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
