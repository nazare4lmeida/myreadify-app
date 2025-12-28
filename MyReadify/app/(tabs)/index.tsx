import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api, { IMAGE_BASE_URL } from '../../src/services/api';

// Importação dos componentes que criamos
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookCard from "../../components/BookCard";

const { width } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();
  const [latestBooks, setLatestBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Função para tratar a URL da imagem (consistente com o resto do app)
  const resolveCoverUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/300x450";
    if (url.startsWith('http')) {
        if (url.includes('localhost')) {
            const fileName = url.split('/').pop();
            return `${IMAGE_BASE_URL}/${fileName}`;
        }
        return url;
    }
    const fileName = url.split('/').pop();
    return `${IMAGE_BASE_URL}/${fileName}`;
  };

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get("api/books?page=1&limit=6");
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

  // Lógica do Carrossel Automático (Troca a cada 4 segundos)
  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(latestBooks.length, 5));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [latestBooks]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION COM CARROSSEL */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Sua próxima grande leitura começa aqui.</Text>
            <Text style={styles.heroSubtitle}>Descubra histórias que transformam o seu mundo.</Text>
          </View>

          {/* CARROSSEL DE DESTAQUES */}
          <View style={styles.carouselWrapper}>
            {loading ? (
              <ActivityIndicator color="#975238" size="large" />
            ) : (
              latestBooks.slice(0, 5).map((book, index) => (
                index === currentSlide && (
                  <TouchableOpacity 
                    key={book.id || index} 
                    activeOpacity={0.9}
                    onPress={() => router.push({ pathname: '/detalhes', params: { slug: book.slug } })}
                    style={styles.slide}
                  >
                    <Image
                      source={{ uri: resolveCoverUrl(book.cover_url) }}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                    <View style={styles.carouselBadge}>
                      <Text style={styles.carouselBadgeText}>Destaque</Text>
                    </View>
                  </TouchableOpacity>
                )
              ))
            )}
            
            {/* Indicadores (Pontinhos) */}
            <View style={styles.pagination}>
              {latestBooks.slice(0, 5).map((_, i) => (
                <View 
                  key={i} 
                  style={[styles.dot, currentSlide === i && styles.activeDot]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* SECTION RECENTES (Grid idêntica ao site) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionados Recentemente</Text>
          
          {loading ? (
            <ActivityIndicator color="#975238" />
          ) : (
            <View style={styles.bookGrid}>
              {latestBooks.map((book) => (
                <BookCard key={book.slug || book.id} livro={book} />
              ))}
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F7" },
  
  // Hero e Texto
  heroSection: { paddingVertical: 30, backgroundColor: '#FFF', alignItems: 'center' },
  heroTextContainer: { paddingHorizontal: 30, marginBottom: 25, alignItems: 'center' },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: '#4A3728', textAlign: 'center', lineHeight: 32 },
  heroSubtitle: { fontSize: 14, color: '#A68A73', textAlign: 'center', marginTop: 10 },

  // Carrossel
  carouselWrapper: { width: width * 0.85, height: 400, alignItems: 'center', justifyContent: 'center' },
  slide: { width: '100%', height: '100%', borderRadius: 15, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, backgroundColor: '#FFF', overflow: 'hidden' },
  carouselImage: { width: '100%', height: '100%' },
  carouselBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#975238', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  carouselBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // Pontinhos do Carrossel
  pagination: { flexDirection: 'row', marginTop: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E3D5CA', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#975238', width: 20 },

  // Listagem de Livros
  section: { padding: 20, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#4A3728', marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#975238', paddingLeft: 10 },
  bookGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});