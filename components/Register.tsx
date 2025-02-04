import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import axios, { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            {/* Icono en la parte superior */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Icon name="user-plus" size={50} color="#000" />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Registrarse</Text>
            </View>

            {/* Username Input con icono a la izquierda */}
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 20, 
                borderBottomWidth: 1, 
                borderColor: '#000'
            }}>
                <Icon name="user" size={20} color="#000" style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Nombre de Usuario / Correo Electrónico"
                    value={username}
                    onChangeText={setUsername}
                    style={{
                        flex: 1, 
                        paddingHorizontal: 10, 
                        paddingVertical: 5, 
                        fontSize: 16
                    }}
                />
            </View>

            {/* Password Input con icono a la izquierda */}
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 20, 
                borderBottomWidth: 1, 
                borderColor: '#000'
            }}>
                <Icon name="lock" size={20} color="#000" style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        flex: 1, 
                        paddingHorizontal: 10, 
                        paddingVertical: 5, 
                        fontSize: 16
                    }}
                />
            </View>

            {/* Botón de registro */}
            <Button title="Registrarse" onPress={handleRegister} />
        </View>
    );
};

export default Register;

