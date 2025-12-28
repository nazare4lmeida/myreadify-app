import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
// Supondo que você moveu seu mockLivros para esta pasta no mobile
const mockLivros = [
  { id: 1000000, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', slug: 'o-senhor-dos-aneis', cover_url: 'https://via.placeholder.com/150x225' },
  // ... adicione os outros mocks aqui ou importe o arquivo
];

interface Livro {
  id: string | number;
  title: string;  
  author: string; 
  category: string;
  cover_url: string;
  slug?: string;
  isPlaceholder?: boolean; 
}
export default function CategoriesScreen() {
  const router = useRouter();
  const [allBooks, setAllBooks] = useState<Livro[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await api.get('/books');
        const apiBooks = Array.isArray(response.data) ? response.data : [];
        
        // Lógica de mesclagem (Merge) idêntica ao seu site
        const apiBooksMap = new Map(apiBooks.map((book: any) => [book.slug, book]));
        const mockBooksMap = new Map(mockLivros.map(book => [book.slug, book]));
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()]);
        
        const finalBookList = Array.from(allSlugs).map(slug => {
          const apiVersion = apiBooksMap.get(slug);
          const mockVersion = mockBooksMap.get(slug);

          if (apiVersion && mockVersion) {
            return { ...mockVersion, ...apiVersion, isPlaceholder: !apiVersion.summary };
          }
          if (apiVersion) {
            return { ...apiVersion, isPlaceholder: !apiVersion.summary };
          }
          return { ...mockVersion, isPlaceholder: true };
        });

        setAllBooks(finalBookList);
      } catch (err) {
        console.error("Usando dados locais:", err);
        setAllBooks(mockLivros as Livro[]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Filtros de Categoria
  const allCategories = ['Todos', ...new Set(allBooks.map(book => book.category).filter(Boolean))];
  
  const filteredBooks = selectedCategory === 'Todos'
    ? allBooks
    : allBooks.filter(book => book.category === selectedCategory);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#975238" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER DE CATEGORIAS */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navegue por Categoria</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allCategories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filterButton, selectedCategory === item && styles.filterButtonActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.filterText, selectedCategory === item && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LISTA DE LIVROS EM GRID (BookCard adaptado) */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => String(item.slug || item.id)}
        numColumns={2}
        contentContainerStyle={styles.bookGrid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard}
            onPress={() => router.push({ pathname: '/detalhes', params: { id: item.id, title: item.title, author: item.author } } as any)}
          >
            <Image source={{ uri: item.cover_url }} style={styles.coverImage} resizeMode="cover" />
            <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingVertical: 20, backgroundColor: '#FAF9F7' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 15, fontFamily: 'serif' },
  filterList: { paddingHorizontal: 20 },
  filterButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  filterButtonActive: { backgroundColor: '#975238', borderColor: '#975238' },
  filterText: { color: '#555', fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },
  bookGrid: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  bookCard: { width: '47%', backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  coverImage: { width: '100%', height: 200, borderRadius: 6, marginBottom: 8 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  bookAuthor: { fontSize: 12, color: '#975238', marginTop: 2 }
});