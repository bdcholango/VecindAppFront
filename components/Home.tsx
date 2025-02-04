import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeProps = {
    navigation: StackNavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.navigate('Login');
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Bienvenido a VecindApp!</Text>
            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
    );
};

export default Home;
