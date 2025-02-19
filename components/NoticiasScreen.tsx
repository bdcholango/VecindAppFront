import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  StyleSheet,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import { WEATHER_API_KEY, NEWS_API_KEY } from "@env";
import axios from "axios";
import InspirationalQuote from "../components/InspirationalQuote";

type Publication = {
  _id: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  user?: {
    username: string;
  };
};
type WeatherData = {
  temp_c: number;
  condition: { text: string; icon: string };
};

type NewsArticle = {
  title?: string;
  source?: { name?: string };
  url?: string;
};

const NoticiasScreen = () => {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const skeletonOpacity = useState(new Animated.Value(0.3))[0];
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchPublicaciones(1, true); // ✅ Carga la primera página
    fetchWeather();
    startSkeletonAnimation();
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: { country: "US", category: "general", apiKey: NEWS_API_KEY },
      });
      setNews(
        Array.isArray(response.data.articles) ? response.data.articles : []
      );
    } catch (error) {
      console.error("Error obteniendo noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Ecuador&lang=es`
      );
      const data = response.data.current;
      setWeather({
        temp_c: data.temp_c,
        condition: {
          text: data.condition.text,
          icon: `https:${data.condition.icon}`, // ✅ Incluye ícono de clima
        },
      });
    } catch (error) {
      console.error("Error obteniendo el clima:", error);
    }
  };

  // ✅ Animación del Skeleton Loader
  const startSkeletonAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // ✅ Función para obtener publicaciones con paginación
  const fetchPublicaciones = async (pageNumber: number, reset = false) => {
    if (pageNumber > totalPages) return; // ✅ No seguir si ya estamos en la última página

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `http://192.168.100.10:5000/api/publications?page=${pageNumber}&limit=5`
      );

      if (response.data && Array.isArray(response.data.publications)) {
        setPublicaciones((prev) =>
          reset
            ? response.data.publications
            : [...prev, ...response.data.publications]
        );
        setTotalPages(response.data.totalPages);
        setPage(response.data.currentPage);
      } else {
        console.error("Formato de datos inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    } finally {
      if (reset) {
        setLoading(false);
      }
      setLoadingMore(false);
    }
  };

  // ✅ Función para refrescar (swipe down)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPublicaciones(1, true); // ✅ Carga desde la primera página
    setRefreshing(false);
  };

  // ✅ Función para cargar más publicaciones cuando se hace scroll hasta el final
  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchPublicaciones(page + 1);
    }
  };

  // ✅ Función para abrir Google Maps según el formato de ubicación
  const openInMaps = (location: string) => {
    if (location.startsWith("https://www.google.com/maps")) {
      Linking.openURL(location);
    } else {
      const query = encodeURIComponent(location);
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${query}`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 📌 Sección del Clima en la parte superior */}
      <View style={styles.weatherContainer}>
        {weather && (
          <View style={styles.weatherContent}>
            <Image
              source={{ uri: weather.condition.icon }}
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherText}>
              {weather.temp_c}°C - {weather.condition.text}
            </Text>
          </View>
        )}
      </View>

      {/* 📌 Noticias Internacionales e Inspiración en una sola fila */}
      <View style={styles.upperContainer}>
        {/* 🔹 Noticias Internacionales a la izquierda */}
        <View style={styles.newsContainer}>
          <Text style={styles.header}>Noticias Internacionales</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={news}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.newsCard}>
                  <Text style={styles.newsTitle}>
                    {item?.title || "Título no disponible"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => item.url && Linking.openURL(item.url)}
                  >
                    <Text style={styles.newsLink}>Leer más</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* 🔹 Frase Inspiradora a la derecha */}
        <View style={styles.quoteContainer}>
          <InspirationalQuote />
        </View>
      </View>

      {/* 📌 Publicaciones Recientes en la mitad inferior */}
      <View style={styles.lowerContainer}>
        <Text style={styles.pageHeader}>
          Publicaciones Recientes del Barrio
        </Text>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]} // Simulamos 5 elementos vacíos
            keyExtractor={(item) => `skeleton-${item}`}
            renderItem={() => (
              <View style={styles.card}>
                <Animated.View
                  style={[styles.skeletonTitle, { opacity: skeletonOpacity }]}
                />
                <Animated.View
                  style={[styles.skeletonText, { opacity: skeletonOpacity }]}
                />
                <Animated.View
                  style={[styles.skeletonUser, { opacity: skeletonOpacity }]}
                />
                <Animated.View
                  style={[
                    styles.skeletonLocation,
                    { opacity: skeletonOpacity },
                  ]}
                />
                <Animated.View
                  style={[styles.skeletonImage, { opacity: skeletonOpacity }]}
                />
              </View>
            )}
          />
        ) : (
          <FlatList
            data={publicaciones}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                {item.user && (
                  <Text style={styles.user}>
                    Publicado por: {item.user.username}
                  </Text>
                )}

                {item.location && (
                  <TouchableOpacity onPress={() => openInMaps(item.location)}>
                    <Text style={styles.location}>📍 {item.location}</Text>
                  </TouchableOpacity>
                )}

                {item.image && (
                  <Image
                    source={{ uri: `http://192.168.100.10:5000${item.image}` }}
                    style={styles.image}
                  />
                )}
              </View>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* 📌 Clima */
  weatherContainer: { 
    alignItems: "center", 
    marginBottom: 5,
    marginTop: 20, 
    },

    weatherContent: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
  weatherIcon: { 
    width: 40, 
    height: 40, 
    marginRight: 10 
    },

  weatherText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333" 
    },

  /* 📌 Contenedor de Noticias + Inspiración */
  upperContainer: { 
    flex: 2, 
    flexDirection: "row", 
    paddingHorizontal: 10 },

  /* 📌 Noticias Internacionales */
  newsContainer: { flex: 2, padding: 10 },
  header: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007bff",
  },
  newsCard: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 3,
  },
  newsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  newsLink: { 
    fontSize: 12, 
    textAlign: "center",
    color: "#1e90ff", 
    fontWeight: "bold" },

  /* 📌 Frase Inspiradora */
  quoteContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" },

  /* 📌 Publicaciones Recientes */
  lowerContainer: { 
    flex: 3, 
    paddingHorizontal: 10 },
  pageHeader: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#1e90ff",
  },
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 3,
  },
  title: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 5 },
  description: { 
    color: "#666", 
    marginBottom: 5 },
  user: { 
    fontStyle: "italic", 
    color: "#333" },
  location: { 
    fontSize: 14, 
    color: "#007bff", 
    textDecorationLine: "underline" },
  image: { 
    width: "100%",
    height: 150, 
    marginTop: 10, 
    borderRadius: 10 },

  // 🎨 Skeleton Styles
  skeletonTitle: {
    width: "80%",
    height: 20,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
  },
  skeletonText: {
    width: "60%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
  },
  skeletonUser: {
    width: "40%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
  },
  skeletonLocation: {
    width: "60%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
    marginTop: 10,
    borderRadius: 10,
  },

  newsSource: { fontSize: 10, color: "#888" },

  newsUrl: { fontSize: 10, color: "#1e90ff", marginTop: 3 },
});

export default NoticiasScreen;
