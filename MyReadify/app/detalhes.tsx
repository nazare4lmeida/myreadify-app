import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api, { IMAGE_BASE_URL } from '../src/services/api';

interface LivroDetalhe {
  id: string | number;
  title: string;
  author: string;
  category?: string;
  cover_url: string; 
  summary: string;
  slug: string;
}

export default function DetalhesLivro() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  
  const [livro, setLivro] = useState<LivroDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  // FUNÇÃO DE IMAGEM ATUALIZADA PARA LIDAR COM O LINK DO BACKEND
  const resolveCoverUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/300x450";
    
    // Se a URL vier do backend como 'localhost', o telemóvel não vai encontrar.
    // Substituímos 'localhost' pelo IP que está configurado no seu IMAGE_BASE_URL.
    if (url.includes('localhost')) {
      const fileName = url.split('/').pop();
      return `${IMAGE_BASE_URL}/${fileName}`;
    }

    // Se já for uma URL externa (http) que não seja localhost, usa direto
    if (url.startsWith('http')) return url;

    // Se for apenas o nome do arquivo
    const fileName = url.split('/').pop();
    return `${IMAGE_BASE_URL}/${fileName}`;
  };

  useEffect(() => {
    async function loadLivro() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/books/${slug}`);
        setLivro(response.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        setLivro(null);
      } finally {
        setLoading(false);
      }
    }

    loadLivro();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#975238" />
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Obra não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar para Estante</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image 
            source={{ uri: resolveCoverUrl(livro.cover_url) }} 
            style={styles.coverImage} 
            resizeMode="cover"
          />
          
          <Text style={styles.title}>{livro.title}</Text>
          <Text style={styles.author}>{livro.author}</Text>
          
          {livro.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{livro.category}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Resumo da Obra</Text>
          <Text style={styles.summaryText}>{livro.summary || "Sem resumo disponível."}</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDFCFB' },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFCFB' },
  backButton: { paddingHorizontal: 20, paddingVertical: 15 },
  backText: { color: '#975238', fontWeight: 'bold', fontSize: 16 },
  headerContent: { alignItems: 'center', padding: 20 },
  coverImage: { 
    width: 200, 
    height: 300, 
    borderRadius: 10, 
    marginBottom: 20,
    backgroundColor: '#EEE', 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4A3728', textAlign: 'center' },
  author: { fontSize: 18, color: '#A68A73', marginTop: 5, marginBottom: 10 },
  categoryBadge: { backgroundColor: '#F4EAE2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  categoryText: { color: '#975238', fontSize: 12, fontWeight: 'bold' },
  content: { padding: 25 },
  divider: { height: 1, backgroundColor: '#E3D5CA', marginBottom: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#8B5E3C', marginBottom: 15 },
  summaryText: { fontSize: 17, color: '#4A3728', lineHeight: 28, textAlign: 'justify' },
  errorText: { fontSize: 18, color: '#333', marginBottom: 10 }
});