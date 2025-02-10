import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PublicacionesScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState('evento');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !location) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        
        const token = await AsyncStorage.getItem('userToken');
        const formData = new FormData();
        formData.append('type', type);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('date', date);
        if (image) {
            const filename = image.split('/').pop(); // Extrae el nombre del archivo
            const match = /\.(\w+)$/.exec(filename || '');
            const ext = match ? `image/${match[1]}` : 'image/jpeg';
        
            formData.append('image', {
                uri: image,
                type: ext,
                name: filename || 'upload.jpg',
            } as any);
        }

        try {
            await axios.post('http://192.168.100.10:5000/api/publications/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            Alert.alert('Éxito', 'Publicación creada exitosamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la publicación');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Título:</Text>
            <TextInput value={title} onChangeText={setTitle} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <Text>Descripción:</Text>
            <TextInput value={description} onChangeText={setDescription} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <Text>Ubicación:</Text>
            <TextInput value={location} onChangeText={setLocation} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <Text>Fecha:</Text>
            <TextInput value={date} onChangeText={setDate} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            
            <TouchableOpacity onPress={pickImage}>
                <Text>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}

            <Button title="Publicar" onPress={handleSubmit} />
        </View>
    );
};

export default PublicacionesScreen;
