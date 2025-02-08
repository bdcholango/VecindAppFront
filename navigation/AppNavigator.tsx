import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../components/Login';
import Register from '../components/Register';
import Home from '../components/Home';
import { isAuthenticated } from '../utils/authMiddleware';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const authStatus = await isAuthenticated();
            setIsLoggedIn(authStatus);
        };

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
