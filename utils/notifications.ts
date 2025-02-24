import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert('Las notificaciones push solo funcionan en dispositivos físicos.');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('No se otorgaron permisos para las notificaciones.');
        return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token obtenido:', token);

    // Enviar el pushToken al backend
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
        try {
            const response = await axios.post('http://192.168.100.17:5000/api/users/push-token', { pushToken: token }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            console.log('✅ Token de notificación guardado en el backend:', response.data);
        } catch (error) {
            console.log('❌ Error al guardar el token de notificación:', error);
        }
    }

    return token;
}
