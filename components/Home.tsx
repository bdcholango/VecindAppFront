import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { isAuthenticated } from '../utils/authMiddleware';
import NoticiasScreen from '../components/NoticiasScreen';
import PublicacionesScreen from '../components/PublicacionesScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import UserProfile from './UserProfile';
const Tab = createBottomTabNavigator();

type HomeProps = {
    navigation: StackNavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            if (!authStatus) {
                navigation.replace('Login');
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigation]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
                name="Noticias" 
                component={NoticiasScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="newspaper" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Publicaciones" 
                component={PublicacionesScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="plus-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
    name="Perfil" 
    component={UserProfile} 
    options={{
        tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
        ),
    }}
/>
          

        </Tab.Navigator>
    );
};

export default Home;
