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
import { useTheme } from "../context/ThemeContext";

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
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();

  useEffect(() => {
    fetchPublicaciones(1, true); //Carga la primera página
    fetchWeather();
    startSkeletonAnimation();
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "US",
          category: "general",
          apiKey: NEWS_API_KEY,
          page: page,
          pageSize: 5,
        },
      });
      setNews(
        Array.isArray(response.data.articles) ? response.data.articles : []
      );
      setTotalPages(Math.ceil(response.data.totalResults / 5)); //Calculamos el total de páginas
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
          icon: `https:${data.condition.icon}`, //Incluye ícono de clima
        },
      });
    } catch (error) {
      console.error("Error obteniendo el clima:", error);
    }
  };

  //Animación del Skeleton Loader
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

  //Función para obtener publicaciones con paginación
  const fetchPublicaciones = async (pageNumber: number, reset = false) => {
    if (pageNumber > totalPages) return; //No seguir si ya estamos en la última página

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(
        `http://192.168.100.17:5000/api/publications?page=${pageNumber}&limit=5`
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

  //Función para refrescar (swipe down)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPublicaciones(1, true); //Carga desde la primera página
    setRefreshing(false);
  };

  // función para cargar más publicaciones cuando se hace scroll hasta el final
  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchPublicaciones(page + 1);
    }
  };

  // funcion abrir Google Maps según el formato de ubicación
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.weatherContainer]}>
        {weather && (
          <View
            style={[
              styles.weatherContent,
              { backgroundColor: theme.background },
            ]}
          >
            <Image
              source={{ uri: weather.condition.icon }}
              style={styles.weatherIcon}
            />
            <Text style={[styles.weatherText, { color: theme.text }]}>
              {weather.temp_c}°C - {weather.condition.text}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.upperContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.header}>Noticias Internacionales</Text>

          {loading ? (
            <FlatList
              data={[1, 2]}
              keyExtractor={(item) => `skeleton-${item}`}
              renderItem={() => (
                <View
                  style={[
                    styles.newsCard,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.skeletonTitleNews,
                      { opacity: skeletonOpacity },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.skeletonLinkNews,
                      { opacity: skeletonOpacity },
                    ]}
                  />
                </View>
              )}
            />
          ) : (
            <FlatList
              data={news}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.newsCard,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Text style={[styles.newsTitle, { color: theme.text }]}>
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

          <View
            style={[
              styles.paginationContainer,
              { backgroundColor: theme.background },
            ]}
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <TouchableOpacity
                  key={page}
                  style={[
                    styles.pageButton,
                    currentPage === page && styles.activePage, // Resalta la página activa
                  ]}
                  onPress={() => setCurrentPage(page)}
                >
                  <Text style={[styles.pageNumber]}>{page}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        <View
          style={[styles.quoteContainer, { backgroundColor: theme.background }]}
        >
          <Text style={styles.header}>💡Frase del Dia💡</Text>
          <InspirationalQuote />
        </View>
      </View>
      <View
        style={[styles.lowerContainer, { backgroundColor: theme.background }]}
      >
        <Text style={styles.pageHeader}>
          Publicaciones Recientes del Barrio
        </Text>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(item) => `skeleton-${item}`}
            renderItem={() => (
              <View
                style={[styles.card, { backgroundColor: theme.background }]}
              >
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
              <View
                style={[styles.card, { backgroundColor: theme.background }]}
              >
                <Text style={[styles.title, { color: theme.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.description, { color: theme.text }]}>
                  {item.description}
                </Text>
                {item.user && (
                  <Text style={[styles.user, { color: theme.text }]}>
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
                    source={{ uri: `http://192.168.100.17:5000${item.image}` }}
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

  weatherContainer: {
    alignItems: "center",
    marginBottom: 5,
    marginTop: 30,
    borderColor: "#ccc",
  },

  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  weatherText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  upperContainer: {
    flex: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
  },

  newsContainer: { flex: 2, padding: 10 },
  header: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007bff",
    textAlign: "center",
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
    fontWeight: "bold",
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  pageButton: {
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 1,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  activePage: {
    backgroundColor: "#007bff",
  },
  pageNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },

  quoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  lowerContainer: {
    flex: 3,
    paddingHorizontal: 10,
  },
  pageHeader: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0,
    color: "#1e90ff",
  },
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    elevation: 3,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  description: {
    color: "#666",
    marginBottom: 5,
  },
  user: {
    fontStyle: "italic",
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },

  skeletonTitleNews: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  skeletonLinkNews: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  skeletonTitle: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  skeletonText: {
    width: "60%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  skeletonUser: {
    width: "40%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  skeletonLocation: {
    width: "60%",
    height: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  newsSource: {
    fontSize: 10,
    color: "#888",
  },

  newsUrl: {
    fontSize: 10,
    color: "#1e90ff",
    marginTop: 3,
  },
});

export default NoticiasScreen;
