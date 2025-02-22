import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { isAuthenticated } from "../utils/authMiddleware";
import NoticiasScreen from "../components/NoticiasScreen";
import PublicacionesScreen from "../components/PublicacionesScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import UserProfile from "./UserProfile";
import { useTheme } from "../context/ThemeContext";


const Tab = createBottomTabNavigator();

type HomeProps = {
  navigation: StackNavigationProp<any>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      if (!authStatus) {
        navigation.replace("Login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary}/>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBackground, // ✅ Fondo del tab en modo oscuro/claro
          borderTopWidth: 0, // ✅ Eliminar la línea superior
        },
        tabBarActiveTintColor: isDarkMode ? "#1e90ff" : "#007bff", // ✅ Color de iconos activos
        tabBarInactiveTintColor: isDarkMode ? "#aaa" : "#666", // ✅ Color de iconos inactivos
      }}
    >
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
