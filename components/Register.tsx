import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios, { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterProps = {
    navigation: StackNavigationProp<any>;
};

const Register: React.FC<RegisterProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://192.168.100.10:5000/api/auth/register', {
                username,
                password,
            });
            Alert.alert('Registro Exitoso', 'Ahora puedes iniciar sesión.');
            navigation.navigate('Login');
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const message = axiosError.response?.data?.message || 'Error desconocido';
            Alert.alert('Error de Registro', message);
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
            <Button title="Registrar" onPress={handleRegister} />
        </View>
    );
};

export default Register;
