import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PublicacionesScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState('evento');

    const pickImage = async (source: 'camera' | 'gallery') => {
        let result;
        if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

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
            const filename = image.split('/').pop();
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
        <View style={styles.container}>
            <Text style={styles.label}>Título:</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Ingrese el título" />
            
            <Text style={styles.label}>Descripción:</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="Ingrese la descripción" multiline />
            
            <Text style={styles.label}>Ubicación:</Text>
            <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder="Ingrese la ubicación" />
            
            <Text style={styles.label}>Fecha:</Text>
            <TextInput value={date} onChangeText={setDate} style={styles.input} placeholder="Ingrese la fecha" />
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => pickImage('camera')} style={styles.imageButton}>
                    <FontAwesome5 name="camera" size={40} color="#007bff" />
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => pickImage('gallery')} style={styles.imageButton}>
                    <FontAwesome5 name="images" size={40} color="#28a745" />
                    <Text style={styles.buttonText}>Seleccionar Imagen</Text>
                </TouchableOpacity>
            </View>
            
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Publicar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: 'white',
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    imageButton: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PublicacionesScreen;


