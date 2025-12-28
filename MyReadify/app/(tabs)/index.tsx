import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "../../src/services/api";

export default function HomePage() {
  const router = useRouter();
  const [latestBooks, setLatestBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get("/books?page=1&limit=8");
        // Lógica de fallback para mockData se a API falhar
        const data = response.data.books || response.data;
        setLatestBooks(data);
      } catch (error) {
        console.error("Erro ao buscar destaques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);

  // Timer para o Carrossel Hero (3 segundos como no seu site)
  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(latestBooks.length, 5));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [latestBooks]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION - Equivalente ao .hero-section do seu CSS */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Sua próxima grande leitura começa aqui.
            </Text>
            <Text style={styles.heroSubtitle}>
              Descubra, compartilhe e apaixone-se por novas histórias em sua
              estante digital.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push("/explore" as any)}
            >
              <Text style={styles.heroButtonText}>Explorar Resumos</Text>
            </TouchableOpacity>
          </View>

          {/* HERO CAROUSEL - Replicando o .hero-carousel do seu CSS */}
          <View style={styles.carouselContainer}>
            {loading ? (
              <View style={styles.skeletonPlaceholder} />
            ) : (
              latestBooks
                .slice(0, 5)
                .map(
                  (book, index) =>
                    index === currentSlide && (
                      <Image
                        key={book.id || index}
                        source={{
                          uri:
                            book.cover_url ||
                            "https://via.placeholder.com/300x450",
                        }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                      />
                    )
                )
            )}
          </View>
        </View>

        {/* FEATURED SECTION - Adicionados Recentemente */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Adicionados Recentemente</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {latestBooks.map((book) => (
              <TouchableOpacity
                key={book.id || book.slug}
                style={styles.bookCard}
                onPress={() =>
                  router.push({
                    pathname: "/detalhes",
                    params: { id: book.id, title: book.title },
                  } as any)
                }
              >
                <Image
                  source={{ uri: book.cover_url }}
                  style={styles.bookCover}
                />
                <Text style={styles.bookCardTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookCardAuthor}>{book.author}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F7" },
  heroSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FAF9F7",
    minHeight: 400,
  },
  heroTextContainer: { width: "100%", alignItems: "center", marginBottom: 30 },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "serif", // Aproximação do 'Lora' do site
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  heroButton: {
    backgroundColor: "#975238",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  heroButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  carouselContainer: {
    width: 220,
    height: 330,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  carouselImage: { width: "100%", height: "100%", borderRadius: 10 },
  skeletonPlaceholder: {
    width: 220,
    height: 330,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
  },

  featuredSection: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "serif",
  },
  horizontalScroll: { flexDirection: "row" },
  bookCard: { width: 140, marginRight: 20 },
  bookCover: { width: 140, height: 210, borderRadius: 8, marginBottom: 8 },
  bookCardTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
  bookCardAuthor: { fontSize: 12, color: "#975238" },
});
