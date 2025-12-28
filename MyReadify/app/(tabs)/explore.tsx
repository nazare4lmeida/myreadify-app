import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api, { IMAGE_BASE_URL } from '../../src/services/api';

// Interface que define a estrutura de um Livro
// 'string' no TypeScript é o equivalente ao 'varchar' do Supabase
interface Livro {
  id: string | number;
  title: string;  
  author: string; 
  category: string;
  cover_url: string; 
  slug: string;
  summary?: string; // O '?' indica que o campo é opcional
  isPlaceholder?: boolean; 
}

const mockLivros: Livro[] = [
  { id: 1000001, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', slug: 'o-senhor-dos-aneis', cover_url: 'lordoftherings.jpg' },
  { id: 1000002, title: '1984', author: 'George Orwell', category: 'Ficção Científica', slug: '1984', cover_url: '1984.jpg' },
  { id: 1000003, title: 'O Sol é para Todos', author: 'Harper Lee', category: 'Clássicos', slug: 'o-sol-e-para-todos', cover_url: 'tosol.jpg' },
  { id: 1000004, title: 'Orgulho e Preconceito', author: 'Jane Austen', category: 'Romance', slug: 'orgulho-e-preconceito', cover_url: 'orgulhoepreconceito.jpg' },
  { id: 1000005, title: 'Duna', author: 'Frank Herbert', category: 'Ficção Científica', slug: 'duna', cover_url: 'duna.jpg' },
  { id: 1000006, title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', category: 'Clássicos', slug: 'cem-anos-de-solidao', cover_url: 'cemanos.jpg' },
  { id: 1000007, title: 'A Guerra dos Tronos', author: 'George R. R. Martin', category: 'Fantasia', slug: 'a-guerra-dos-tronos', cover_url: 'tronos.jpg' },
  { id: 1000008, title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', category: 'Clássicos', slug: 'o-pequeno-principe', cover_url: 'pequenoprincipe.jpg' },
  { id: 1000009, title: 'O Homem e Seus Símbolos', author: 'Carl Gustav Jung', category: 'Filosofia', slug: 'o-homem-e-seus-simbolos', cover_url: 'homemeseussimbolos.jpg' },
  { id: 1000010, title: 'As Dores do Mundo', author: 'Arthur Schopenhauer', category: 'Filosofia', slug: 'as-dores-do-mundo', cover_url: 'asdoresdomundo.jpg' },
  { id: 1000011, title: 'A Obscena Senhora D', author: 'Hilda Hilst', category: 'Romance', slug: 'a-obscena-senhora-d', cover_url: 'aobscenasenhorad.jpg' },
  { id: 1000012, title: 'A Hora da Estrela', author: 'Clarice Lispector', category: 'Romance', slug: 'a-hora-da-estrela', cover_url: 'ahoradaestrela.jpg' },
  { id: 1000013, title: 'O Delicado Abismo da Loucura', author: 'Raimundo Carrero', category: 'Romance', slug: 'o-delicado-abismo-da-loucura', cover_url: 'delicadoabismo.jpg' },
  { id: 1000014, title: 'Quarto de Despejo', author: 'Carolina Maria de Jesus', category: 'Não-ficção', slug: 'quarto-de-despejo', cover_url: 'quartodedespejo.jpg' },
  { id: 1000015, title: 'O Diário de Anne Frank', author: 'Anne Frank', category: 'Não-ficção', slug: 'o-diario-de-anne-frank', cover_url: 'diariodeannefrank.jpg' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [allBooks, setAllBooks] = useState<Livro[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Função para garantir que a URL da imagem aponte para o servidor de arquivos
  const resolveCoverUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/300x450";
    if (url.startsWith('http')) return url;
    const fileName = url.split('/').pop();
    return `${IMAGE_BASE_URL}/${fileName}`;
  };

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await api.get('/api/books');
        
        // Convertemos os dados da API para o tipo Livro[] explicitamente
        const apiBooks = (Array.isArray(response.data) ? response.data : (response.data.books || [])) as Livro[];
        
        // Criando mapas tipados para o merge de dados
        const apiBooksMap = new Map<string, Livro>(
            apiBooks.map((book) => [String(book.slug), book])
        );
        const mockBooksMap = new Map<string, Livro>(
            mockLivros.map((book) => [String(book.slug), book])
        );
        
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
          return { ...(mockVersion as Livro), isPlaceholder: true };
        });

        setAllBooks(finalBookList as Livro[]);
      } catch (err) {
        console.error("Erro ao buscar livros da API, usando locais:", err);
        setAllBooks(mockLivros);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

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

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => String(item.slug || item.id)}
        numColumns={2}
        contentContainerStyle={styles.bookGrid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard}
            onPress={() => router.push({ 
                pathname: '/detalhes', 
                params: { slug: item.slug } 
            })}
          >
            <Image 
                source={{ uri: resolveCoverUrl(item.cover_url) }} 
                style={styles.coverImage} 
                resizeMode="cover" 
            />
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 15 },
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