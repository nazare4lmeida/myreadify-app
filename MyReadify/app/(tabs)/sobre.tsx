import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutPage() {
  const router = useRouter();

  const features = [
    "Adicionar, atualizar e remover livros e resumos da sua estante pessoal.",
    "Pesquisar obras pelo seu autor favorito.",
    "Marcar aqueles livros que tocaram seu coração como favoritos.",
    "Fazer avaliações e comentários sobre livros que você leu.",
    "Descobrir novos autores e obras recomendadas pela comunidade.",
    "Enviar resumos e propostas de resumos para livros que você gostaria de ver."
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header simples para navegação interna */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#975238" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Institucional</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Título e Subtítulo */}
        <View style={styles.aboutHeader}>
          <Text style={styles.title}>Sobre o MyReadify</Text>
          <Text style={styles.subtitle}>Conectando leitores, uma indicação de cada vez.</Text>
        </View>

        {/* Corpo do Texto */}
        <View style={styles.aboutContent}>
          <Text style={styles.paragraph}>
            O MyReadify nasceu de uma ideia simples: criar um espaço acolhedor e funcional para todos que amam livros. Acreditamos que cada livro é uma porta para um novo universo, e encontrar a porta certa pode ser uma jornada maravilhosa. Nosso objetivo é facilitar essa descoberta.
          </Text>

          <Text style={styles.paragraph}>
            Esta é uma plataforma de indicação de livros onde você pode não apenas explorar uma biblioteca cuidadosamente selecionada, mas também interagir com ela. Aqui, você pode:
          </Text>

          {/* Lista de Funcionalidades */}
          <View style={styles.listContainer}>
            {features.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listIcon}>📖</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.paragraph}>
            Este projeto está em constante evolução, impulsionado pela paixão pela leitura e pela tecnologia. Queremos que o MyReadify seja a sua estante digital de confiança, um lugar para onde você sempre pode voltar em busca de inspiração.
          </Text>

          <Text style={[styles.paragraph, styles.finalCall]}>
            Explore, descubra e, acima de tudo, continue lendo!
          </Text>
        </View>

        {/* Rodapé Interno */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A68A73',
  },
  container: {
    flex: 1,
  },
  contentPadding: {
    padding: 25,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#975238',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#A68A73',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aboutContent: {
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#4A3728',
    marginBottom: 20,
    textAlign: 'justify',
  },
  listContainer: {
    marginBottom: 25,
    paddingLeft: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingRight: 15,
  },
  listIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A3728',
    flex: 1,
  },
  finalCall: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#975238',
  },
  footerSpace: {
    height: 40,
  }
});