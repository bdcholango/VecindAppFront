import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return false;

        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return await refreshToken(); // Si el token ha expirado, intenta renovarlo
        }

        return true;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
};

// Función para refrescar el token
export const refreshToken = async (): Promise<boolean> => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        const response = await axios.post('http://192.168.100.10:5000/api/auth/refresh-token', { refreshToken });

        await AsyncStorage.setItem('userToken', response.data.accessToken);
        return true;
    } catch (error) {
        console.error('Error renovando el token:', error);
        await AsyncStorage.removeItem('userToken');
        return false;
    }
};
