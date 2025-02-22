import React, {useEffect} from 'react';
import * as Notifications from 'expo-notifications';
import AppNavigator from './navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Configuración global de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    useEffect(() => {
        async function setupNotifications() {
            await registerForPushNotificationsAsync();
            
            
        }

        setupNotifications();
    }, []);

    return <AppNavigator />;
}