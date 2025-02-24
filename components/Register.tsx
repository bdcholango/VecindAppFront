import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import axios, { AxiosError } from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

type RegisterProps = {
    navigation: StackNavigationProp<any>;
};

const Register: React.FC<RegisterProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [secureText, setSecureText] = useState(true); // Estado para mostrar u ocultar la contraseña

    const handleRegister = async () => {
        setErrorMessage(null); // Resetear mensaje de error antes de enviar solicitud

        try {
            await axios.post('http://192.168.100.17:5000/api/auth/register', {
                username,
                password,
            });

            Alert.alert('Registro Exitoso', 'Ahora puedes iniciar sesión.');
            navigation.navigate('Login');
        } catch (error) {
            const axiosError = error as AxiosError<{ errors?: { msg: string }[], message?: string }>;
            if (axiosError.response?.data?.errors) {
                setErrorMessage(axiosError.response.data.errors[0].msg);
            } else {
                setErrorMessage(axiosError.response?.data?.message || 'Error desconocido');
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <View style={{ alignItems: 'center',height: 250, marginBottom: 10 }}>
                <Icon name="user-plus" size={200} color="#000" />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Registrarse</Text>
            </View>

            {errorMessage && (
                <Text style={{ color: 'red', marginBottom: 10, fontSize: 16 }}>
                    {errorMessage}
                </Text>
            )}

            {/* Campo de Nombre de Usuario */}
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 20, 
                borderBottomWidth: 1, 
                borderColor: '#000'
            }}>
                <Icon name="user" size={20} color="#000" style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChangeText={setUsername}
                    style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5, fontSize: 16 }}
                />
            </View>

            {/* Campo de Contraseña con icono de Visualización */}
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
                    secureTextEntry={secureText}
                    style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5, fontSize: 16 }}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Icon 
                        name={secureText ? 'eye' : 'eye-slash'} 
                        size={20} 
                        color="gray" 
                        style={{ marginLeft: 10 }} 
                    />
                </TouchableOpacity>
            </View>

            <Button title="Registrarse" onPress={handleRegister} />
        </View>
    );
};

export default Register;
