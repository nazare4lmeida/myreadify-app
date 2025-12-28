import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api, { IMAGE_BASE_URL } from '../../src/services/api';

interface Livro {
  id: string | number;
  title: string;  
  author: string; 
  category: string;
  cover_url: string; 
  slug: string;
  summary?: string; 
  isPlaceholder?: boolean; 
}

const mockLivros: Livro[] = [
  { id: 1000001, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', slug: 'o-senhor-dos-aneis', cover_url: 'lordoftherings.jpg' },
  { id: 1000002, title: '1984', author: 'George Orwell', category: 'Ficção Científica', slug: '1984', cover_url: '1984.jpg' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [allBooks, setAllBooks] = useState<Livro[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

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
    async function fetchBooks() {
      try {
        const response = await api.get('/api/books');
        const apiBooks = (Array.isArray(response.data) ? response.data : (response.data.books || [])) as Livro[];
        
        const apiBooksMap = new Map<string, Livro>(apiBooks.map((book) => [String(book.slug), book]));
        const mockBooksMap = new Map<string, Livro>(mockLivros.map((book) => [String(book.slug), book]));
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()]);
        
        const finalBookList = Array.from(allSlugs).map(slug => {
          const apiVersion = apiBooksMap.get(slug);
          const mockVersion = mockBooksMap.get(slug);
          if (apiVersion && mockVersion) return { ...mockVersion, ...apiVersion, isPlaceholder: !apiVersion.summary };
          if (apiVersion) return { ...apiVersion, isPlaceholder: !apiVersion.summary };
          return { ...(mockVersion as Livro), isPlaceholder: true };
        });

        setAllBooks(finalBookList as Livro[]);
      } catch (err) {
        console.error("Erro ao buscar livros:", err);
        setAllBooks(mockLivros);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const allCategories = ['Todos', ...new Set(allBooks.map(book => book.category).filter(Boolean))];
  const filteredBooks = selectedCategory === 'Todos' ? allBooks : allBooks.filter(book => book.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={[styles.filterText, selectedCategory === item && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => String(item.slug || item.id)}
        numColumns={2}
        contentContainerStyle={styles.bookGrid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard}
            onPress={() => router.push({ pathname: '/detalhes', params: { slug: item.slug } })}
          >
            <Image source={{ uri: resolveCoverUrl(item.cover_url) }} style={styles.coverImage} resizeMode="cover" />
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
  header: { paddingVertical: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 15 },
  filterList: { paddingHorizontal: 20 },
  filterButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  filterButtonActive: { backgroundColor: '#975238', borderColor: '#975238' },
  filterText: { color: '#555', fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },
  bookGrid: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  bookCard: { width: '47%', backgroundColor: '#FFF', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 3 },
  coverImage: { width: '100%', height: 200, borderRadius: 6, marginBottom: 8 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  bookAuthor: { fontSize: 12, color: '#975238', marginTop: 2 }
});